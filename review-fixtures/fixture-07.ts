export function isExpired(expiresAt: Date, now = new Date()): boolean {
  return expiresAt.getTime() > now.getTime();
}
