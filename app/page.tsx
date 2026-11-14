import { HeroSection } from "@/components/home/HeroSection";
import { TrendingSection } from "@/components/home/TrendingSection";
import { LiveAuctionCard, LiveAuctionCardProps } from "@/components/auctions/LiveAuctionCard";
import { CommunityPostCard, CommunityPostCardProps } from "@/components/community/CommunityPostCard";

const LIVE_AUCTIONS: LiveAuctionCardProps[] = [
  { id: "a1", title: "1998 Nissan Skyline R34 GT-R", currentBid: 2850000, endsAt: "2026-11-14T16:12:00.000Z", bidders: 12, imageUrl: "https://images.unsplash.com/photo-1626668011687-8a114cf5a34c?auto=format&fit=crop&w=800&q=80" },
  { id: "a2", title: "2023 Porsche 911 GT3 RS", currentBid: 4500000, endsAt: "2026-11-14T19:43:00.000Z", bidders: 28, imageUrl: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80" },
];

const COMMUNITY_POSTS: CommunityPostCardProps[] = [
  { id: "p1", authorName: "Marcus Drifts", authorAvatar: "https://i.pravatar.cc/150?img=11", timeAgo: "2 hours ago", content: "Finally got the new coilovers installed on the E46 M3. The difference in cornering is absolutely night and day. Track day this weekend! 🏁", imageUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80", likes: 142, comments: 23 },
  { id: "p2", authorName: "Sarah Builds", authorAvatar: "https://i.pravatar.cc/150?img=5", timeAgo: "5 hours ago", content: "Looking for recommendations for a good exhaust shop in Cape Town. Need a custom setup for my Hilux. Drop your suggestions below! 👇", likes: 45, comments: 18 },
];

export default function HomePage() {
  return <div className="w-full"><HeroSection /><TrendingSection /><section className="mx-auto my-8 max-w-7xl rounded-3xl border border-brand-silver bg-surface-white px-4 py-16"><div className="mb-8"><h2 className="text-2xl font-bold tracking-tight text-brand-graphite md:text-3xl">Live Auctions Ending Soon</h2><p className="mt-1 text-gray-500">Bid in real-time on exclusive collector and performance vehicles.</p></div><div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">{LIVE_AUCTIONS.map((auction) => <LiveAuctionCard key={auction.id} {...auction} />)}</div></section><section className="mx-auto max-w-7xl px-4 py-16"><div className="mb-8"><h2 className="text-2xl font-bold tracking-tight text-brand-graphite md:text-3xl">From the Community</h2><p className="mt-1 text-gray-500">Build journals, track days, and car culture from across South Africa.</p></div><div className="grid grid-cols-1 gap-6 md:grid-cols-2">{COMMUNITY_POSTS.map((post) => <CommunityPostCard key={post.id} {...post} />)}</div></section></div>;
}
