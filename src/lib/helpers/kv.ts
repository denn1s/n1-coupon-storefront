/**
 * Convert a simple object of string key/values into an array of KVItem.
 * - Filters nothing; preserves original order from Object.entries.
 */
export type KVItem = { key: string; value: string }

/**
 * Transforms an object into a list of { key, value } items.
 */
export const objectToKvItems = (obj: Record<string, string> | undefined | null): KVItem[] =>
  Object.entries(obj ?? {}).map(([key, value]) => ({ key, value }))

/**
 * Convert an array of KVItem into an object of string key/values.
 * - Filters out entries with empty key or value (trimmed).
 */
export const kvItemsToObject = (items: KVItem[]): Record<string, string> =>
  Object.fromEntries(items.filter((it) => it.key.trim() && it.value.trim()).map((it) => [it.key, it.value]))
