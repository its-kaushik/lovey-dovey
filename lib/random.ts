/**
 * Returns a random index from 0 to length-1.
 * If `avoid` is provided, guarantees the returned index is different
 * (used to prevent repeating the same random pick twice in a row).
 */
export function randomIndex(length: number, avoid?: number): number {
  if (length <= 1) return 0;
  let index: number;
  do {
    index = Math.floor(Math.random() * length);
  } while (index === avoid && length > 1);
  return index;
}
