// Firebase Realtime Database types

// Base interface for Realtime Database entities
export interface RealtimeEntity {
  id: string; // Key of the object in the database
  created_at?: number; // Milliseconds since epoch (Unix timestamp)
  updated_at?: number; // Milliseconds since epoch (Unix timestamp)
}

// Account type
export interface Account extends RealtimeEntity {
  account_number: string;
  account_type: 'demo' | 'standard' | 'premium';
  balance: number;
  currency: string; // ISO 4217 currency code
  is_active: boolean;
  user_id: string;
}

// Market data type
export interface MarketData extends RealtimeEntity {
  ask_price: number;
  bid_price: number;
  change_24h?: number; // Percentage change
  high_24h?: number;
  low_24h?: number;
  spread: number; // Difference between ask and bid
  symbol: string; // Format: "ASSET/QUOTE" (e.g., "EUR/USD")
  volume_24h?: number; // Trading volume
}

// Notification type
export interface Notification extends RealtimeEntity {
  is_read: boolean;
  message: string;
  title: string;
  type?: 'system' | 'trade' | 'account';
  user_id: string;
}

// Position type
export interface Position extends RealtimeEntity {
  account_id: string;
  closed_at?: number; // Milliseconds since epoch
  current_price?: number; // Current market price
  open_price: number;
  opened_at?: number; // Milliseconds since epoch
  position_type: 'long' | 'short';
  profit_loss?: number; // Current P/L value
  status: 'open' | 'closed' | 'pending';
  stop_loss?: number;
  symbol: string;
  take_profit?: number;
  user_id: string;
  volume: number; // Position size
}

// Profile type
export interface Profile extends RealtimeEntity {
  account_number?: string; // Related account number
  address?: string;
  date_of_birth?: string; // ISO 8601 date string (YYYY-MM-DD)
  email: string;
  first_name: string;
  last_name: string;
  kyc_status: 'pending' | 'verified' | 'rejected' | 'unverified';
  member_since?: number; // Milliseconds since epoch
  phone?: string; // E.164 format
}

// Trading history type
export interface TradingHistory extends RealtimeEntity {
  account_id: string;
  action: 'buy' | 'sell' | 'deposit' | 'withdrawal';
  position_id?: string; // Only for trade actions
  price?: number; // Execution price for trades
  profit_loss?: number; // Realized P/L for closed positions
  symbol?: string; // Only for trade actions
  user_id: string;
  volume?: number; // Only for trade actions
  amount?: number; // For deposit/withdrawal actions
}