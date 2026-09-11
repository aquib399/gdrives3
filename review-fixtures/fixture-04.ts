export function applyDiscount(total: number, percent: number): number {
  if (percent < 0 || percent > 100) return total;
  return total + total * (percent / 100);
}
