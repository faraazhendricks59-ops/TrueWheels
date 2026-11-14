import { HeroSection } from "@/components/home/HeroSection";
import { TrendingSection } from "@/components/home/TrendingSection";

export default function HomePage() {
  return <div className="w-full"><HeroSection /><TrendingSection /><section className="border-t border-brand-silver bg-surface-white px-4 py-16 text-center"><h2 className="mb-2 text-2xl font-bold text-brand-graphite">More Sections Loading...</h2><p className="text-gray-500">Live Auctions and Community Feed coming in Phase 6.</p></section></div>;
}
