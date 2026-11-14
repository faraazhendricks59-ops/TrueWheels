"use client";
import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";
import { calculateMonthlyRepayment } from "@/lib/finance";
import { formatRand } from "@/lib/utils";

export function FinanceCalculator({ price }: { price: number }) {
  const [depositPercent, setDepositPercent] = useState(10); const [rate, setRate] = useState(11.5); const [term, setTerm] = useState(60);
  const deposit = price * depositPercent / 100;
  const monthly = useMemo(() => calculateMonthlyRepayment({ price, deposit, annualInterestRate: rate, termMonths: term }), [price, deposit, rate, term]);
  return <section className="rounded-xl border border-brand-silver bg-white p-5 shadow-card"><div className="flex items-center gap-2"><Calculator size={19} className="text-brand-red" /><h2 className="font-bold">Finance estimate</h2></div><div className="mt-5 grid gap-4 sm:grid-cols-3"><label className="text-sm">Deposit: {depositPercent}%<input aria-label="Deposit percentage" type="range" min="0" max="50" value={depositPercent} onChange={(e) => setDepositPercent(Number(e.target.value))} className="mt-2 w-full accent-brand-red" /></label><label className="text-sm">Interest: {rate}%<input aria-label="Interest rate" type="number" step="0.1" min="0" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="mt-2 w-full rounded-lg border border-brand-silver px-3 py-2" /></label><label className="text-sm">Term: {term} months<select aria-label="Loan term" value={term} onChange={(e) => setTerm(Number(e.target.value))} className="mt-2 w-full rounded-lg border border-brand-silver px-3 py-2"><option value={36}>36 months</option><option value={60}>60 months</option><option value={72}>72 months</option></select></label></div><div className="mt-5 rounded-lg bg-surface-grey p-4"><p className="text-sm text-gray-500">Estimated monthly repayment</p><p className="mt-1 text-2xl font-extrabold text-brand-graphite">{formatRand(monthly)}</p><p className="mt-2 text-xs text-gray-500">Estimates only. Subject to credit approval. T&amp;Cs apply.</p></div></section>;
}
