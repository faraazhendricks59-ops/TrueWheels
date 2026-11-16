"use client";

import Link from "next/link";
import { Home, MessageSquare, Plus, Search, User } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import type { TranslationKey } from "@/lib/i18n/dictionaries";

const left: { labelKey: TranslationKey; href: string; Icon: typeof Home }[] = [
  { labelKey: "nav.home", href: "/", Icon: Home },
  { labelKey: "nav.search", href: "/marketplace", Icon: Search },
];
const right: { labelKey: TranslationKey; href: string; Icon: typeof Home }[] = [
  { labelKey: "nav.messages", href: "/messages", Icon: MessageSquare },
  { labelKey: "nav.profile", href: "/profile", Icon: User },
];

export function MobileNav() {
  const { t } = useLanguage();

  return <nav aria-label="Mobile navigation" className="fixed bottom-0 left-0 right-0 z-40 border-t border-brand-silver bg-surface-white md:hidden"><div className="flex h-16 items-center justify-around px-2">{left.map(({ labelKey, href, Icon }) => <Link key={href} href={href} className="flex h-full w-16 flex-col items-center justify-center text-neutral-muted"><Icon size={22} /><span className="mt-1 text-[10px] font-medium">{t(labelKey)}</span></Link>)}<Link href="/sell" aria-label={t("nav.sell")} className="-mt-6 flex flex-col items-center justify-center"><span className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-neutral-line bg-brand-red shadow-lg"><Plus size={28} className="text-white" /></span><span className="mt-1 text-[10px] font-medium text-brand-graphite">{t("nav.sell")}</span></Link>{right.map(({ labelKey, href, Icon }) => <Link key={href} href={href} className="flex h-full w-16 flex-col items-center justify-center text-neutral-muted"><Icon size={22} /><span className="mt-1 text-[10px] font-medium">{t(labelKey)}</span></Link>)}</div></nav>;
}
