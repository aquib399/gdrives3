export function groupByStatus<T extends { status: string }>(
  items: T[]
): Record<string, T[]> {
  return items.reduce<Record<string, T[]>>((groups, item) => {
    groups[item.status] = groups[item.status] || [];
    groups[item.status].push(item);
    return groups;
  }, {});
}
