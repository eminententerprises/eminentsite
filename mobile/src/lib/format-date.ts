export function formatRelativeDate(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const days = Math.floor((now - then) / (1000 * 60 * 60 * 24));

  if (days <= 0) return "Added today";
  if (days === 1) return "Added yesterday";
  if (days < 30) return `Added ${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `Added ${months} month${months > 1 ? "s" : ""} ago`;
  const years = Math.floor(months / 12);
  return `Added ${years} year${years > 1 ? "s" : ""} ago`;
}
