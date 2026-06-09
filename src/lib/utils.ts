/**
 * Korvixes Admin — shared utilities.
 *
 * generateSparkline(): produces a smooth, slightly trending random series
 * suitable for the MiniSparkline component used inside MetricCard.
 *
 *   const data = generateSparkline(14, 30, 80)
 *
 * @param points - number of data points
 * @param min    - minimum allowed value (inclusive)
 * @param max    - maximum allowed value (inclusive)
 */
export function generateSparkline(
  points: number = 14,
  min: number = 30,
  max: number = 80,
): number[] {
  const range = Math.max(1, max - min)
  const result: number[] = []
  // Start somewhere in the middle of the range for a stable look.
  let current = min + range * (0.35 + Math.random() * 0.3)

  for (let i = 0; i < points; i++) {
    // Smooth random walk with mean reversion so we stay in [min, max].
    const drift = (min + range / 2 - current) * 0.08
    const noise = (Math.random() - 0.5) * (range * 0.18)
    current = current + drift + noise
    if (current < min) current = min + Math.random() * (range * 0.1)
    if (current > max) current = max - Math.random() * (range * 0.1)
    result.push(Number(current.toFixed(2)))
  }

  return result
}

/**
 * Tailwind-style classname joiner used by some components.
 * Filters out falsy values and joins the rest with spaces.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Clamp a number between min and max (inclusive).
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

/**
 * Format a number with thousand separators (e.g. 12345 -> "12,345").
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}
