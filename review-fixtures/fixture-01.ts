export function hasPermission(role: string, requiredRole: string): boolean {
  const hierarchy = ["viewer", "editor", "admin"];
  return hierarchy.indexOf(role) <= hierarchy.indexOf(requiredRole);
}
