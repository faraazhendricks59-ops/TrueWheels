import { ReactNode } from "react";

interface ListingGridProps { children: ReactNode; columns?: 2 | 3 | 4; }
const gridCols = { 2: "grid-cols-1 sm:grid-cols-2", 3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3", 4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" } as const;
export function ListingGrid({ children, columns = 4 }: ListingGridProps) { return <div className={`grid ${gridCols[columns]} gap-6`}>{children}</div>; }
