import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle, MoreHorizontal, Share2 } from "lucide-react";

export interface CommunityPostCardProps {
  id: string;
  authorName: string;
  authorAvatar: string;
  timeAgo: string;
  content: string;
  imageUrl?: string;
  likes: number;
  comments: number;
}

function slugify(value: string) { return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }

export function CommunityPostCard({ authorName, authorAvatar, timeAgo, content, imageUrl, likes, comments }: CommunityPostCardProps) {
  return <article className="rounded-xl border border-brand-silver bg-surface-white p-5 shadow-sm"><div className="mb-4 flex items-center justify-between"><div className="flex items-center gap-3"><div className="relative h-10 w-10 overflow-hidden rounded-full border border-brand-silver bg-gray-200"><Image src={authorAvatar} alt={`${authorName} avatar`} fill className="object-cover" sizes="40px" /></div><div><Link href={`/user/${slugify(authorName)}`} className="text-sm font-semibold text-brand-graphite hover:underline">{authorName}</Link><p className="text-xs text-gray-400">{timeAgo}</p></div></div><button type="button" aria-label={`More options for ${authorName}'s post`} className="rounded-full p-1 text-gray-400 transition-colors hover:bg-surface-grey hover:text-brand-graphite"><MoreHorizontal size={18} /></button></div><p className="mb-4 whitespace-pre-line text-sm leading-relaxed text-brand-graphite">{content}</p>{imageUrl && <div className="relative mb-4 aspect-[16/9] overflow-hidden rounded-lg border border-brand-silver bg-gray-100"><Image src={imageUrl} alt={`Media shared by ${authorName}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" /></div>}<div className="flex items-center justify-between border-t border-brand-silver pt-3 text-gray-500"><button type="button" aria-label={`Like post by ${authorName}`} className="group flex items-center gap-2 text-sm font-medium transition-colors hover:text-brand-red"><Heart size={18} className="group-hover:fill-brand-red" /><span>{likes}</span></button><button type="button" aria-label={`View ${comments} comments`} className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-brand-graphite"><MessageCircle size={18} /><span>{comments}</span></button><button type="button" aria-label={`Share post by ${authorName}`} className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-brand-graphite"><Share2 size={18} /><span>Share</span></button></div></article>;
}
