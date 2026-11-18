"use client";

import { useCallback, useEffect, useState } from "react";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/motion/Reveal";
import { KeyboardMatrix } from "@/components/a11y/KeyboardMatrix";
import { ScreenReaderHarness } from "@/components/a11y/ScreenReaderHarness";
import { ContrastChecker } from "@/components/a11y/ContrastChecker";
import { FocusOrderDebugger } from "@/components/a11y/FocusOrderDebugger";
import { RovingTabindexDemo } from "@/components/a11y/RovingTabindexDemo";
import { runA11yAudit, type A11yViolation } from "@/lib/a11y/a11yAudit";

const SEVERITY_STYLE: Record<A11yViolation["severity"], string> = {
  critical: "bg-semantic-error/10 text-semantic-error",
  serious: "bg-semantic-warning/10 text-semantic-warning",
  moderate: "bg-aurora-blue/10 text-aurora-blue",
  minor: "bg-ink-100 dark:bg-ink-800 text-ink-500 dark:text-ink-300",
};

export function A11yAuditPanel() {
  const [violations, setViolations] = useState<A11yViolation[]>([]);
  const [running, setRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  const runAudit = useCallback(async () => {
    setRunning(true);
    const results = await runA11yAudit();
    setViolations(results);
    setHasRun(true);
    setRunning(false);
  }, []);

  // Re-run whenever the auto-runner in the app reports a fresh result, so the panel
  // and the console never disagree.
  useEffect(() => {
    const onAudit = (event: Event) => {
      const detail = (event as CustomEvent<{ violations: A11yViolation[] }>).detail;
      setViolations(detail.violations);
      setHasRun(true);
    };
    window.addEventListener("tw-a11y-audit", onAudit);
    void runAudit();
    return () => window.removeEventListener("tw-a11y-audit", onAudit);
  }, [runAudit]);

  const counts = {
    critical: violations.filter((v) => v.severity === "critical").length,
    serious: violations.filter((v) => v.severity === "serious").length,
    moderate: violations.filter((v) => v.severity === "moderate").length,
    minor: violations.filter((v) => v.severity === "minor").length,
  };
  const clean = hasRun && violations.length === 0;

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-8">
      <Reveal variant="up">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-display font-bold text-ink-900 dark:text-white">
                Accessibility Audit
              </h1>
              <Badge variant="status" tone="amber">
                Dev only
              </Badge>
            </div>
            <p className="text-ink-600 dark:text-ink-300 max-w-2xl">
              A smoke detector for the mechanical parts of WCAG 2.1 AA — missing names,
              missing alternatives, contrast regressions. It is not a conformance
              certificate: whether alt text is meaningful, whether focus order is
              logical, and whether a live region is timely still need a person and a
              real screen reader.
            </p>
          </div>
          <div
            className={clsx(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border",
              clean
                ? "bg-semantic-success/10 border-semantic-success/20 text-semantic-success"
                : "bg-semantic-warning/10 border-semantic-warning/20 text-semantic-warning"
            )}
          >
            <Icon icon={clean ? ShieldCheck : ShieldAlert} size={14} />
            {!hasRun ? "Not yet run" : clean ? "No mechanical findings" : `${violations.length} finding(s)`}
          </div>
        </div>
      </Reveal>

      <Reveal variant="up" delay={100}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SummaryCard label="Critical" value={counts.critical} tone="text-semantic-error" />
          <SummaryCard label="Serious" value={counts.serious} tone="text-semantic-warning" />
          <SummaryCard label="Moderate" value={counts.moderate} tone="text-aurora-blue" />
          <SummaryCard label="Minor" value={counts.minor} tone="text-ink-500 dark:text-ink-300" />
        </div>
      </Reveal>

      <Reveal variant="up" delay={150}>
        <section
          aria-labelledby="violations-heading"
          className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl shadow-lift overflow-hidden"
        >
          <div className="p-5 border-b border-ink-100 dark:border-ink-800 flex items-center justify-between">
            <h2 id="violations-heading" className="text-sm font-bold text-ink-900 dark:text-white">
              Findings on this route
            </h2>
            <button
              type="button"
              onClick={runAudit}
              disabled={running}
              className="text-xs font-semibold text-brand hover:underline disabled:opacity-50"
            >
              {running ? "Scanning…" : "Re-scan"}
            </button>
          </div>

          {violations.length === 0 ? (
            <p className="p-8 text-sm text-ink-500 dark:text-ink-300 text-center" role="status">
              {hasRun
                ? "No mechanical findings on this route. That is not the same as accessible — check the tools below by hand."
                : "Running the first scan…"}
            </p>
          ) : (
            <ul className="divide-y divide-ink-100 dark:divide-ink-800 max-h-[400px] overflow-y-auto custom-scrollbar">
              {violations.map((v) => (
                <li key={v.id} className="p-4 flex items-start gap-3">
                  <span
                    className={clsx(
                      "px-2 py-0.5 rounded text-[9px] font-bold uppercase flex-shrink-0",
                      SEVERITY_STYLE[v.severity]
                    )}
                  >
                    {v.severity}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink-900 dark:text-white">{v.message}</p>
                    <p className="text-[10px] font-mono text-ink-500 dark:text-ink-400 mt-0.5 break-all">
                      {v.element}
                    </p>
                    <p className="text-[10px] text-ink-500 dark:text-ink-400 mt-1">
                      WCAG {v.rule}
                      {v.helpUrl && (
                        <>
                          {" · "}
                          <a
                            href={v.helpUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="underline hover:text-brand"
                          >
                            Understanding {v.rule}
                          </a>
                        </>
                      )}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <KeyboardMatrix />
        <ScreenReaderHarness />
        <ContrastChecker />
        <FocusOrderDebugger />
        <RovingTabindexDemo />
      </div>
    </div>
  );
}

function SummaryCard({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-5 shadow-lift">
      <p className="text-[10px] font-bold text-ink-500 dark:text-ink-400 uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className={clsx("text-3xl font-display font-bold tabular-nums", tone)}>{value}</p>
    </div>
  );
}
