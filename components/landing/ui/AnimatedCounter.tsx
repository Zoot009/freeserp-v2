/**
 * Renders the numeric run within a label like "50M+", "190+", "2 min",
 * "+100%", or "^336%" as static text (no count-up animation).
 */
export function AnimatedCounter({ value }: { value: string }) {
  return <span className="tabular-nums">{value}</span>;
}
