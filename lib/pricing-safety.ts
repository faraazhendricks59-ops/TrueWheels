export function classifyListingPrice(price: number, marketAverage: number | null) {
  if (!marketAverage || marketAverage <= 0) return { label: "Insufficient data", tone: "neutral" as const };
  const ratio = price / marketAverage;
  if (ratio < 0.5) return { label: "Review required", tone: "warning" as const };
  if (ratio < 0.9) return { label: "Underpriced · Quick sale", tone: "success" as const };
  if (ratio <= 1.1) return { label: "Market value", tone: "neutral" as const };
  return { label: "Premium · Patience required", tone: "warning" as const };
}
