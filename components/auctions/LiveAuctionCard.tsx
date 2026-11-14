"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Gavel, Timer, Users } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export interface LiveAuctionCardProps {
  id: string;
  title: string;
  currentBid: number;
  endsAt: string;
  bidders: number;
  imageUrl: string;
}

function formatRemaining(milliseconds: number) {
  if (milliseconds <= 0) return "Ended";
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((value) => value.toString().padStart(2, "0")).join(":");
}

export function LiveAuctionCard({ id, title, currentBid, endsAt, bidders, imageUrl }: LiveAuctionCardProps) {
  const endTime = useMemo(() => new Date(endsAt).getTime(), [endsAt]);
  const [timeLeft, setTimeLeft] = useState(() => formatRemaining(endTime - Date.now()));

  useEffect(() => {
    const update = () => setTimeLeft(formatRemaining(endTime - Date.now()));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [endTime]);

  const formattedBid = new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(currentBid);
  return <Link href={`/auctions/${encodeURIComponent(id)}`} className="group block" aria-label={`View auction for ${title}`}><article className="overflow-hidden rounded-xl border border-brand-silver bg-surface-white shadow-card transition-all duration-300 hover:shadow-card-hover"><div className="relative aspect-[16/10] overflow-hidden bg-gray-100"><Image src={imageUrl} alt={title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" /><div className="absolute left-3 top-3"><Badge variant="live">🔴 LIVE</Badge></div></div><div className="p-4"><h3 className="mb-3 truncate text-base font-bold text-brand-graphite transition-colors group-hover:text-brand-red">{title}</h3><div className="mb-3 flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Current Bid</p><p className="text-lg font-extrabold tabular-nums text-brand-graphite">{formattedBid}</p></div><div className="text-right"><p className="flex items-center justify-end gap-1 text-[10px] font-bold uppercase tracking-wider text-gray-400"><Timer size={10} /> Ends In</p><p className="text-lg font-extrabold tabular-nums text-brand-red" aria-live="polite">{timeLeft}</p></div></div><div className="flex items-center justify-between border-t border-brand-silver pt-3 text-xs font-medium text-gray-500"><span className="flex items-center gap-1.5"><Gavel size={12} />{bidders} Bidders</span><span className="flex items-center gap-1.5"><Users size={12} />142 Watching</span></div></div></article></Link>;
}
