export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIResponse {
  text: string;
  model: string;
  usage: { prompt_tokens: number; completion_tokens: number };
}

export interface AIProvider {
  name: string;
  baseUrl: string;
  apiKeyEnv: string;
}

// Ordered: NVIDIA NIM first, then OpenAI-compatible fallbacks if it rate-limits.
const PROVIDERS: AIProvider[] = [
  { name: "nvidia", baseUrl: "https://integrate.api.nvidia.com/v1", apiKeyEnv: "NVIDIA_API_KEY" },
  { name: "groq", baseUrl: "https://api.groq.com/openai/v1", apiKeyEnv: "GROQ_API_KEY" },
];

const DEFAULT_MODEL = "meta/llama-3.3-70b-instruct";

export interface ChatCompletionOptions {
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

async function callProvider(
  provider: AIProvider,
  messages: ChatMessage[],
  model: string,
  options: ChatCompletionOptions
): Promise<AIResponse> {
  const apiKey = process.env[provider.apiKeyEnv];
  if (!apiKey) throw new Error(`${provider.apiKeyEnv} is missing`);

  const res = await fetch(`${provider.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 1024,
      stream: false,
    }),
  });

  if (!res.ok) {
    throw new Error(`${provider.name} provider error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return {
    text: data.choices[0].message.content,
    model: data.model,
    usage: data.usage,
  };
}

/**
 * Isomorphic chat completion. Tries each configured provider in order and
 * falls through to the next on any error, so a single provider outage or
 * rate-limit does not take down the AI layer.
 */
export async function chatCompletion(
  messages: ChatMessage[],
  model: string = DEFAULT_MODEL,
  options: ChatCompletionOptions = {}
): Promise<AIResponse> {
  const configured = PROVIDERS.filter((p) => Boolean(process.env[p.apiKeyEnv]));
  if (!configured.length) {
    throw new Error("No AI provider configured. Set NVIDIA_API_KEY or GROQ_API_KEY.");
  }

  const errors: string[] = [];
  for (const provider of configured) {
    try {
      return await callProvider(provider, messages, options.model ?? model, options);
    } catch (err) {
      errors.push(err instanceof Error ? err.message : String(err));
    }
  }
  throw new Error(`All AI providers failed: ${errors.join("; ")}`);
}
