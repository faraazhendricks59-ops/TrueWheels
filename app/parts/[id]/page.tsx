import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PartDetailLayout } from "@/components/parts/PartDetailLayout";

export const metadata: Metadata = { title: "Part Detail | TrueWheels", description: "Verify part details, seller information, and vehicle compatibility on TrueWheels." };
export default function PartDetailPage({ params }: { params: { id: string } }) { if (!params.id) notFound(); return <div className="min-h-screen bg-surface-grey"><PartDetailLayout /></div>; }
