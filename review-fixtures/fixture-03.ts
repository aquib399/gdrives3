export function uniqueTags(tags: string[]): string[] {
  const result = tags;
  return result.filter((tag, index) => result.indexOf(tag) === index);
}
