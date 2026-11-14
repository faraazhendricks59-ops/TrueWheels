import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileTabs } from "@/components/profile/ProfileTabs";

const MOCK_USER = { displayName: "Marcus van der Merwe", username: "marcusdrifts", avatarUrl: "https://i.pravatar.cc/300?img=11", bannerUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=2000&q=80", bio: "🏎️ BMW E46 M3 owner | Track day enthusiast | Building the ultimate drift machine. Cape Town based.", location: "Cape Town, South Africa", joinDate: "March 2026", isVerified: true, socialLinks: [{ platform: "website", url: "#" }, { platform: "instagram", url: "#" }, { platform: "tiktok", url: "#" }, { platform: "facebook", url: "#" }] as const };

export default function ProfilePage({ params }: { params: { username: string } }) { return <div className="min-h-screen w-full bg-surface-grey"><ProfileHeader {...MOCK_USER} /><div className="mx-auto max-w-6xl px-6 py-8 md:px-10"><ProfileTabs username={params.username} /></div></div>; }
