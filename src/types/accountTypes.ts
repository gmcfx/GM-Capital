// src/types/accountTypes.ts
export interface AccountStats {
  balance: number;
  totalTrades: number;
  winRate: number;
  totalPnL: number;
  activePositions: number;
  bestTrade?: number;
  worstTrade?: number;
}
