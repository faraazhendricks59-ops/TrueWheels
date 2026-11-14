import { VehicleHistoryReport } from "@/components/vehicle-history/VehicleHistoryReport";

export default function VehicleHistoryPage({ params }: { params: { vin: string } }) { return <div className="min-h-screen bg-surface-grey"><VehicleHistoryReport /></div>; }
