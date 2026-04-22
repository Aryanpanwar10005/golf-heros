/**
 * lib/prize-pool/calculator.ts
 * Implements the prize pool distribution and rollover logic.
 */

export interface PrizePoolConfig {
  subscription_pool_pct: number;
  match5_pct: number;
  match4_pct: number;
  match3_pct: number;
}

export interface PoolDistribution {
  totalPool: number;
  jackpot: number; // 5-match + rollover
  pool4Match: number;
  pool3Match: number;
}

/**
 * Calculates the total prize pool and its distribution into tiers.
 */
export function calculatePoolDistribution(
  totalRevenue: number,
  config: PrizePoolConfig,
  rolloverAmount: number = 0
): PoolDistribution {
  const totalPool = totalRevenue * (config.subscription_pool_pct / 100);
  
  return {
    totalPool,
    jackpot: (totalPool * (config.match5_pct / 100)) + rolloverAmount,
    pool4Match: totalPool * (config.match4_pct / 100),
    pool3Match: totalPool * (config.match3_pct / 100),
  };
}

/**
 * Calculates individual prize amounts for a specific tier.
 */
export function calculateIndividualPrize(
  tierPool: number,
  winnerCount: number
): number {
  if (winnerCount === 0) return 0;
  return Number((tierPool / winnerCount).toFixed(2));
}
