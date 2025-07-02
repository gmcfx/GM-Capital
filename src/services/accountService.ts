// src/services/accountService.ts
import { getFirestoreDB } from '@/lib/firebase';
import { doc, onSnapshot, Unsubscribe } from 'firebase/firestore';

export interface AccountStats {
  balance: number;
  totalTrades: number;
  winRate: number;
  totalPnL: number;
  activePositions: number;
}

const db = getFirestoreDB();

/**
 * Subscribes to real-time account statistics for the given userId and accountType.
 * @param userId Firestore user ID
 * @param accountType 'demo' | 'real'
 * @param callback callback invoked with latest stats
 */
export const subscribeToAccountStats = (
  userId: string,
  accountType: 'demo' | 'real',
  callback: (stats: AccountStats) => void
): Unsubscribe => {
  const docRef = doc(db, 'users', userId, 'accounts', accountType);
  return onSnapshot(docRef, (snap) => {
    if (snap.exists()) {
      callback(snap.data() as AccountStats);
    }
  });
};
