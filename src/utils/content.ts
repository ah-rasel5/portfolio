/** Any content entry with a `date` in its frontmatter. */
type Dated = { data: { date: Date } };

/** Newest first. Returns a new array — the caller's collection is untouched. */
export function sortByDateDesc<T extends Dated>(entries: readonly T[]): T[] {
  return entries.toSorted((a, b) => Number(b.data.date) - Number(a.data.date));
}
