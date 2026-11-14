import { CarFront, Clock3, ShieldCheck, Star } from "lucide-react";

interface DealerStatsProps {
  vehicleCount: number;
  yearsInBusiness: number;
  responseTime: string;
  rating: number;
}

const stats = [
  { key: "vehicleCount", label: "Vehicles listed", Icon: CarFront },
  { key: "yearsInBusiness", label: "Years in business", Icon: ShieldCheck },
  { key: "responseTime", label: "Avg. response", Icon: Clock3 },
  { key: "rating", label: "Customer rating", Icon: Star },
] as const;

export function DealerStats({ vehicleCount, yearsInBusiness, responseTime, rating }: DealerStatsProps) {
  const values = { vehicleCount: String(vehicleCount), yearsInBusiness: String(yearsInBusiness), responseTime, rating: `${rating.toFixed(1)}/5` };
  return (
    <section aria-label="Dealer statistics" className="grid grid-cols-2 overflow-hidden rounded-2xl border border-brand-silver bg-surface-white shadow-sm sm:grid-cols-4">
      {stats.map(({ key, label, Icon }, index) => (
        <div key={key} className={`flex items-center gap-3 p-4 sm:p-5 ${index > 0 ? "border-l border-brand-silver" : ""} ${index > 1 ? "border-t sm:border-t-0" : ""}`}>
          <div className="rounded-xl bg-surface-grey p-2.5 text-brand-red"><Icon size={19} /></div>
          <div><p className="text-lg font-extrabold tabular-nums text-brand-graphite">{values[key]}</p><p className="text-[11px] font-semibold text-gray-500">{label}</p></div>
        </div>
      ))}
    </section>
  );
}
