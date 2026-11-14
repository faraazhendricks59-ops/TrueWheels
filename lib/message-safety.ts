const contactPatterns = [/\b[\w.+-]+@[\w-]+\.[\w.-]+\b/gi, /\b(?:https?:\/\/|www\.)\S+\b/gi, /(?<!\d)(?:\+?27|0)\s*\d{2}\s*\d{3}\s*\d{4}(?!\d)/g];
export function maskContactDetails(content: string, messageNumber: number): string {
  if (messageNumber > 3) return content;
  return contactPatterns.reduce((masked, pattern) => masked.replace(pattern, "[contact hidden]"), content);
}
