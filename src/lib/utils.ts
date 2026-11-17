/**
 * Relative time for notification timestamps. Intl.RelativeTimeFormat would be
 * the richer option, but these labels are fixed-width and stable, which keeps
 * the notification list from reflowing as the wording changes.
 */
export function formatDistanceToNow(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
