import Image from "next/image";

interface ProfileBannerProps { bannerUrl: string; }

export function ProfileBanner({ bannerUrl }: ProfileBannerProps) {
  return <div className="relative h-[280px] w-full overflow-hidden"><div className="profile-banner-mask absolute inset-0"><Image src={bannerUrl} alt="Profile banner" fill priority className="object-cover" sizes="100vw" /></div><div className="pointer-events-none absolute left-0 right-0 top-0 h-16 bg-gradient-to-b from-black/30 to-transparent" /><div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface-grey via-surface-grey/80 to-transparent" /><div className="pointer-events-none absolute bottom-0 left-0 top-0 w-24 bg-gradient-to-r from-surface-grey/60 to-transparent md:w-48" /><div className="pointer-events-none absolute bottom-0 right-0 top-0 w-24 bg-gradient-to-l from-surface-grey/60 to-transparent md:w-48" /></div>;
}
