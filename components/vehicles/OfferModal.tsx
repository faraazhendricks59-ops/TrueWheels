"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Send, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface OfferModalProps { isOpen: boolean; onClose: () => void; vehicleTitle: string; currentPrice: number; }

export function OfferModal({ isOpen, onClose, vehicleTitle, currentPrice }: OfferModalProps) {
  const [offerAmount, setOfferAmount] = useState(String(currentPrice));
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (!isOpen) return; closeRef.current?.focus(); const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); }; document.addEventListener("keydown", onKeyDown); return () => document.removeEventListener("keydown", onKeyDown); }, [isOpen, onClose]);
  if (!isOpen) return null;
  const formatCurrency = (value: number) => new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(value);
  function handleSubmit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const amount = Number(offerAmount); if (!Number.isFinite(amount) || amount <= 0) { setError("Enter a valid offer amount."); return; } setError(""); setIsSubmitting(true); window.setTimeout(() => { setIsSubmitting(false); onClose(); }, 1000); }
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="offer-modal-title"><button type="button" aria-label="Close offer modal" className="absolute inset-0 h-full w-full bg-black/60 backdrop-blur-sm" onClick={onClose} /><div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-surface-white shadow-2xl"><div className="flex items-center justify-between border-b border-brand-silver p-5"><h2 id="offer-modal-title" className="text-lg font-bold text-brand-graphite">Make an Offer</h2><button ref={closeRef} type="button" aria-label="Close offer modal" onClick={onClose} className="rounded-full p-1 transition-colors hover:bg-surface-grey"><X size={20} className="text-gray-500" /></button></div><form onSubmit={handleSubmit} className="space-y-4 p-5"><div className="rounded-lg border border-brand-silver bg-surface-grey p-3"><p className="mb-1 text-xs text-gray-500">Offering on:</p><p className="truncate text-sm font-semibold text-brand-graphite">{vehicleTitle}</p><p className="mt-1 text-xs text-gray-400">Asking price: {formatCurrency(currentPrice)}</p></div><Input label="Your Offer Amount (ZAR)" type="number" min="1" value={offerAmount} onChange={(event) => setOfferAmount(event.target.value)} placeholder="e.g. 600000" error={error} /><div className="space-y-1.5"><label htmlFor="offer-message" className="text-sm font-medium text-brand-graphite">Message to Seller (Optional)</label><textarea id="offer-message" value={message} onChange={(event) => setMessage(event.target.value)} rows={3} className="w-full resize-none rounded-lg border border-brand-silver bg-surface-white px-4 py-2.5 text-sm text-brand-graphite transition-all placeholder:text-gray-400 focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20" placeholder="I'm interested in this vehicle. Is the price negotiable?" /></div><div className="flex gap-3 pt-2"><Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button><Button type="submit" className="flex-1" disabled={isSubmitting}>{isSubmitting ? "Sending..." : <><Send size={16} className="mr-2" /> Submit Offer</>}</Button></div></form></div></div>;
}
