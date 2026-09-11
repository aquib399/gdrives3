export function findById<T extends { id: string }>(items: T[], id: string): T {
  return items.find((item) => item.id === id) as T;
}
