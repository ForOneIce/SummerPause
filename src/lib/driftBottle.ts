/** Pick a random index, avoiding consecutive repeats and preferring unseen items. */
export function pickRandomEncouragement(
  currentIndex: number,
  total: number,
  seenIndices: number[]
): { index: number; seenIndices: number[] } {
  if (total <= 1) return { index: 0, seenIndices: [0] };

  let seen = seenIndices;
  let candidates = Array.from({ length: total }, (_, i) => i).filter(i => i !== currentIndex);

  const unseen = candidates.filter(i => !seen.includes(i));
  if (unseen.length > 0) {
    candidates = unseen;
  } else {
    seen = [];
    candidates = Array.from({ length: total }, (_, i) => i).filter(i => i !== currentIndex);
  }

  const index = candidates[Math.floor(Math.random() * candidates.length)];
  const newSeen = [...seen, index];

  return {
    index,
    seenIndices: newSeen.length >= total - 1 ? [index] : newSeen,
  };
}

export function getDailyEncouragementIndex(total: number): number {
  return Math.floor((Date.now() / (1000 * 60 * 60 * 24)) % total);
}
