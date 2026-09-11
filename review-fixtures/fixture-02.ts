export function paginate<T>(items: T[], page: number, limit: number): T[] {
  const start = page * limit;
  return items.slice(start, start + limit);
}
