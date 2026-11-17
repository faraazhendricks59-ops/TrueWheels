"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Icon } from "@/components/ui/Icon";

interface CitationLinkProps {
  index: number;
  label: string;
  href: string;
}

export function CitationLink({ index, label, href }: CitationLinkProps) {
  return (
    <Link
      href={href}
      title={label}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-ink-100 dark:bg-ink-800 hover:bg-brand hover:text-white text-[9px] font-bold text-ink-500 dark:text-ink-400 transition-colors group"
    >
      <span className="font-mono">[{index}]</span>
      <span className="truncate max-w-[120px]">{label.replace(/^\d+\.\s*/, "")}</span>
      <Icon icon={ExternalLink} size={8} />
    </Link>
  );
}
