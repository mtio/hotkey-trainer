export function matchSequence(
  expected: string[],
  buffer: string[]
): { correct: boolean; nextIndex: number } {
  const nextIndex = buffer.findIndex((key, i) => key !== expected[i]);
  return {
    correct: nextIndex === -1 && buffer.length === expected.length,
    nextIndex: nextIndex === -1 ? buffer.length : nextIndex,
  };
}
