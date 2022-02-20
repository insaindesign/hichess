/**
 * @format
 */

export function replaceAtIndex<T>(arr: T[], index: number, newValue: T): T[] {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
}

export function removeAtIndex<T>(arr: T[], index: number): T[] {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}

export function upsert<T>(
  arr: T[],
  newValue: T,
  findIndex: (item: T) => boolean
): T[] {
  const exists = arr.findIndex(findIndex);
  return exists === -1
    ? [...arr, newValue]
    : replaceAtIndex(arr, exists, newValue);
}
