import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

export interface DealerHeaderProps {
  name: string;
  slug: string;
  logoUrl: string;
  coverUrl: string;
  location: string;
  description: string;
  isVerified?: boolean;
  isDealer?: boolean;
}

export function DealerHeader({ name, logoUrl, coverUrl, location, description, isVerified = true, isDealer = true }: DealerHeaderProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-brand-silver bg-surface-white shadow-card">
      <div className="relative h-48 bg-brand-graphite sm:h-64">
        <Image src={coverUrl} alt={`${name} showroom cover`} fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-graphite/75 via-brand-graphite/15 to-transparent" />
      </div>
      <div className="relative px-5 pb-6 sm:px-8">
        <div className="-mt-12 flex flex-col gap-5 sm:-mt-16 sm:flex-row sm:items-end">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-4 border-surface-white bg-surface-grey shadow-card sm:h-32 sm:w-32">
            <Image src={logoUrl} alt={`${name} logo`} fill className="object-cover" sizes="128px" />
          </div>
          <div className="min-w-0 flex-1 pt-1 sm:pb-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {isDealer && <Badge>Dealer</Badge>}
              {isVerified && <Badge variant="verified">✓ Verified Business</Badge>}
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-brand-graphite sm:text-3xl">{name}</h1>
            <p className="mt-1 text-sm font-medium text-gray-500">{location}</p>
          </div>
          <Link href="#inventory" className="inline-flex h-10 items-center justify-center rounded-lg bg-brand-red px-5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-red-dark">View Inventory</Link>
        </div>
        <p className="mt-6 max-w-3xl text-sm leading-7 text-gray-600">{description}</p>
      </div>
    </section>
  );
}
