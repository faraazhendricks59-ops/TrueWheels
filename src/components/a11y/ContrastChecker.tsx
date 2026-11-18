"use client";

import { useEffect, useRef, useState } from "react";
import { Palette, CheckCircle2, XCircle } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/Input";
import { Reveal } from "@/components/motion/Reveal";
import { contrastRatio, parseColor, type Rgba } from "@/lib/a11y/a11yAudit";

/**
 * The token list is expressed as Tailwind classes, not hardcoded hex values.
 *
 * Hardcoding the hex would defeat the point: the checker would keep passing a
 * colour that had since been changed in tailwind.config.ts. Instead each swatch is
 * rendered with its real class and its computed background is read back, so the
 * numbers below are always the colours the app actually ships.
 */
const TOKEN_CLASSES = [
  "bg-ink-950",
  "bg-ink-900",
  "bg-ink-800",
  "bg-ink-500",
  "bg-ink-400",
  "bg-ink-300",
  "bg-ink-100",
  "bg-surface-paper",
  "bg-surface-white",
  "bg-brand",
  "bg-aurora-blue",
  "bg-aurora-purple",
  "bg-semantic-success",
  "bg-semantic-warning",
  "bg-semantic-error",
] as const;

interface ResolvedToken {
  className: string;
  label: string;
  hex: string;
}

function toHex({ r, g, b }: Rgba): string {
  const part = (n: number) => n.toString(16).padStart(2, "0");
  return `#${part(r)}${part(g)}${part(b)}`.toUpperCase();
}

export function ContrastChecker() {
  const [tokens, setTokens] = useState<ResolvedToken[]>([]);
  const [fg, setFg] = useState("#0B0D10");
  const [bg, setBg] = useState("#FFFFFF");
  const swatchesRef = useRef<HTMLDivElement>(null);

  // Read the real, compiled colour of each token class from the rendered swatches.
  useEffect(() => {
    const container = swatchesRef.current;
    if (!container) return;
    const resolved: ResolvedToken[] = [];
    container.querySelectorAll<HTMLElement>("[data-token]").forEach((el) => {
      const parsed = parseColor(getComputedStyle(el).backgroundColor);
      if (!parsed) return;
      resolved.push({
        className: el.dataset.token!,
        label: el.dataset.token!.replace(/^bg-/, ""),
        hex: toHex(parsed),
      });
    });
    setTokens(resolved);
    const firstDark = resolved.find((t) => t.label === "ink-900");
    const firstLight = resolved.find((t) => t.label === "surface-white");
    if (firstDark) setFg(firstDark.hex);
    if (firstLight) setBg(firstLight.hex);
  }, []);

  const fgRgb = parseColor(fg);
  const bgRgb = parseColor(bg);
  const ratio = fgRgb && bgRgb ? contrastRatio(fgRgb, bgRgb) : 0;

  return (
    <Reveal variant="up" delay={200}>
      <section
        aria-labelledby="contrast-checker-heading"
        className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-6 shadow-lift"
      >
        <div className="flex items-center gap-3 mb-6">
          <span className="w-9 h-9 rounded-xl bg-aurora-purple/10 flex items-center justify-center text-aurora-purple">
            <Icon icon={Palette} size={16} />
          </span>
          <div>
            <h2
              id="contrast-checker-heading"
              className="text-sm font-display font-bold text-ink-900 dark:text-white"
            >
              WCAG Contrast Checker
            </h2>
            <p className="text-[10px] text-ink-500 dark:text-ink-400">
              Tests the real compiled token colours against AA and AAA.
            </p>
          </div>
        </div>

        {/* Off-screen swatches used only to resolve the token colours. Kept in the
            layout (not display:none) so getComputedStyle returns a real value. */}
        <div ref={swatchesRef} className="sr-only" aria-hidden="true">
          {TOKEN_CLASSES.map((cls) => (
            <span key={cls} data-token={cls} className={cls} />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <ColorField label="Foreground" value={fg} onChange={setFg} tokens={tokens} />
          <ColorField label="Background" value={bg} onChange={setBg} tokens={tokens} />
        </div>

        <div
          className="p-6 rounded-xl mb-6 border border-ink-100 dark:border-ink-800"
          style={{ backgroundColor: bg, color: fg }}
        >
          <p className="text-2xl font-display font-bold mb-2">The quick brown fox</p>
          <p className="text-sm">jumps over the lazy dog — normal body text</p>
          <p className="text-xs mt-2">Small caption text at 12px</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <ResultCard label="AA Normal" ratio={ratio} pass={ratio >= 4.5} required={4.5} />
          <ResultCard label="AA Large" ratio={ratio} pass={ratio >= 3} required={3} />
          <ResultCard label="AAA Normal" ratio={ratio} pass={ratio >= 7} required={7} />
        </div>
      </section>
    </Reveal>
  );
}

function ColorField({
  label,
  value,
  onChange,
  tokens,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  tokens: ResolvedToken[];
}) {
  return (
    <div>
      <p className="text-[10px] font-bold text-ink-500 dark:text-ink-400 uppercase tracking-wider mb-2">
        {label}
      </p>
      <div className="flex items-center gap-2">
        <input
          type="color"
          aria-label={`${label} colour picker`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-lg border border-ink-200 dark:border-ink-700 cursor-pointer flex-shrink-0"
        />
        <Input
          aria-label={`${label} hex value`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="font-mono"
        />
      </div>
      <div className="flex flex-wrap gap-1.5 mt-2">
        {tokens.map((token) => (
          <button
            key={`${label}-${token.className}`}
            type="button"
            onClick={() => onChange(token.hex)}
            title={`${token.label} ${token.hex}`}
            aria-label={`Use ${token.label} (${token.hex}) as ${label.toLowerCase()}`}
            className={clsx(
              "w-7 h-7 rounded-md border transition-transform hover:scale-110 focus-visible:scale-110",
              value.toUpperCase() === token.hex
                ? "border-brand ring-2 ring-brand/30"
                : "border-ink-200 dark:border-ink-700"
            )}
            style={{ backgroundColor: token.hex }}
          />
        ))}
      </div>
    </div>
  );
}

function ResultCard({
  label,
  ratio,
  pass,
  required,
}: {
  label: string;
  ratio: number;
  pass: boolean;
  required: number;
}) {
  return (
    <div
      className={clsx(
        "p-4 rounded-xl border text-center",
        pass ? "bg-semantic-success/5 border-semantic-success/20" : "bg-semantic-error/5 border-semantic-error/20"
      )}
    >
      <div className="flex items-center justify-center gap-1.5 mb-1">
        <Icon
          icon={pass ? CheckCircle2 : XCircle}
          size={14}
          className={pass ? "text-semantic-success" : "text-semantic-error"}
        />
        <span className="text-[10px] font-bold uppercase tracking-wider text-ink-500 dark:text-ink-400">
          {label}
        </span>
      </div>
      <p
        className={clsx(
          "text-2xl font-display font-bold tabular-nums",
          pass ? "text-semantic-success" : "text-semantic-error"
        )}
      >
        {ratio.toFixed(2)}:1
      </p>
      <p className="text-[9px] text-ink-500 dark:text-ink-400 mt-1">
        Needs {required}:1 — {pass ? "passes" : "fails"}
      </p>
    </div>
  );
}
