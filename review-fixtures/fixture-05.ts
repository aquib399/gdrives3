export function mergeSettings(
  defaults: Record<string, unknown>,
  overrides: Record<string, unknown>
): Record<string, unknown> {
  Object.assign(defaults, overrides);
  return defaults;
}
