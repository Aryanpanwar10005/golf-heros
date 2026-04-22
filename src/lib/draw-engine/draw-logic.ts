/**
 * lib/draw-engine/draw-logic.ts
 * Implements the core logic for Random and Algorithmic draws.
 */

/**
 * Generates a random set of 5 unique numbers between 1 and 45.
 */
export function generateRandomDraw(): number[] {
  const winningNumbers = new Set<number>();
  while (winningNumbers.size < 5) {
    const num = Math.floor(Math.random() * 45) + 1;
    winningNumbers.add(num);
  }
  return Array.from(winningNumbers).sort((a, b) => a - b);
}

/**
 * Generates an algorithmic draw weighted by score frequency.
 * @param frequencies Map of score (1-45) to its frequency in the current pool.
 * @param mode 'most_frequent' or 'least_frequent'
 */
export function generateAlgorithmicDraw(
  frequencies: Map<number, number>,
  mode: 'most_frequent' | 'least_frequent'
): number[] {
  const scores = Array.from({ length: 45 }, (_, i) => i + 1);
  const weights = new Map<number, number>();

  // Calculate weights based on mode
  if (mode === 'most_frequent') {
    scores.forEach(s => {
      const freq = frequencies.get(s) || 0;
      weights.set(s, freq + 1); // +1 to ensure non-zero probability
    });
  } else {
    const maxFreq = Math.max(...Array.from(frequencies.values()), 0);
    scores.forEach(s => {
      const freq = frequencies.get(s) || 0;
      weights.set(s, (maxFreq - freq) + 1);
    });
  }

  const winningNumbers = new Set<number>();
  const availableScores = [...scores];

  while (winningNumbers.size < 5 && availableScores.length > 0) {
    let totalWeight = 0;
    availableScores.forEach(s => {
      totalWeight += weights.get(s) || 0;
    });

    let random = Math.random() * totalWeight;
    let pickedIndex = -1;

    for (let i = 0; i < availableScores.length; i++) {
      const s = availableScores[i];
      const weight = weights.get(s) || 0;
      if (random < weight) {
        pickedIndex = i;
        break;
      }
      random -= weight;
    }

    if (pickedIndex !== -1) {
      winningNumbers.add(availableScores[pickedIndex]);
      availableScores.splice(pickedIndex, 1);
    }
  }

  return Array.from(winningNumbers).sort((a, b) => a - b);
}

/**
 * Checks how many numbers in a user's score set match the winning numbers.
 */
export function countMatches(userScores: number[], winningNumbers: number[]): number {
  const winSet = new Set(winningNumbers);
  return userScores.filter(s => winSet.has(s)).length;
}
