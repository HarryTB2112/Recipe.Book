/**
 * Format a duration in minutes to a human-readable string.
 * e.g. 75 → "1 hr 15 min", 45 → "45 min", 60 → "1 hr"
 */
export function formatTime(minutes: number): string {
  if (minutes <= 0) return '—';
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (m === 0) return `${h} hr`;
  return `${h} hr ${m} min`;
}

/**
 * Format a date string (YYYY-MM-DD) to a readable date.
 */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Format an ingredient quantity for display.
 * Rounds to 2 decimal places max; shows integer if within 0.01 of one.
 * Never outputs trailing .00
 */
export function formatQuantity(value: number): string {
  // Check if close to an integer
  const rounded = Math.round(value);
  if (Math.abs(value - rounded) < 0.01) return String(rounded);

  // Round to 2dp and strip trailing zeros
  return parseFloat(value.toFixed(2)).toString();
}
