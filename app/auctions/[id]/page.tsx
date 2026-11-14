import { notFound } from "next/navigation";
import { AuctionRoomLayout } from "@/components/auctions/AuctionRoomLayout";

export default function AuctionDetailPage({ params }: { params: { id: string } }) { if (params.id !== "a1") notFound(); return <div className="min-h-screen bg-surface-grey"><AuctionRoomLayout /></div>; }
