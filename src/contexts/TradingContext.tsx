// src/contexts/TradingContext.tsx
import { 
  createContext, 
  useContext, 
  useState, 
  useEffect,
  useRef,
  type ReactNode
} from 'react';
import { 
  ref, 
  push, 
  set, 
  update, 
  onValue, 
  off} from 'firebase/database';
import { getRealtimeDB } from '@/lib/firebase';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Position {
  id: string;
  userId: string;
  symbol: string;
  position_type: 'buy' | 'sell';
  volume: number;
  open_price: number;
  current_price: number;
  stop_loss?: number;
  take_profit?: number;
  open_time: string;
  close_time?: string;
  profit_loss?: number;
  status: 'open' | 'closed';
  unrealized_pnl: number;
}

interface TradingContextType {
  positions: Position[];
  marketData: Record<string, any>;
  addPosition: (position: {
    symbol: string;
    position_type: 'buy' | 'sell';
    volume: number;
    open_price: number;
    stop_loss?: number;
    take_profit?: number;
  }) => Promise<void>;
  closePosition: (positionId: string) => Promise<void>;
  updateMarketData: (symbol: string, data: any) => void;
  getTotalPnL: () => number;
  getActivePositionsCount: () => number;
  calculatePnL: (position: Position) => number;
  fetchMarketData: () => Promise<void>; // Added this line
}

export const TradingContext = createContext<TradingContextType | undefined>(undefined);

export const TradingProvider = ({ children }: { children: ReactNode }) => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [marketData, setMarketData] = useState<Record<string, any>>({});
  const { user, activeAccount } = useAuth();
  const { toast } = useToast();
  const db = getRealtimeDB();
  const basePrices = useRef<Record<string, number>>({
    'EUR/USD': 1.0850,
    'GBP/USD': 1.2650,
    'USD/JPY': 151.50,
    'USD/CHF': 0.9000,
    'AUD/USD': 0.6550,
    'USD/CAD': 1.3500,
    'BTC/USD': 42000.00,
    'ETH/USD': 2500.00,
    'XAU/USD': 2150.00
  });

  // Subscribe to real-time positions
  useEffect(() => {
    if (!user) return;

    const positionsRef = ref(db, `positions/${user.uid}`);
    const positionsListener = onValue(positionsRef, (snapshot) => {
      if (snapshot.exists()) {
        const positionsData: Position[] = [];
        snapshot.forEach((childSnapshot) => {
          positionsData.push({
            id: childSnapshot.key as string,
            ...childSnapshot.val()
          });
        });
        setPositions(positionsData);
      } else {
        setPositions([]);
      }
    });

    return () => off(positionsRef, 'value', positionsListener);
  }, [user, db]);

  // Update open positions with current market prices
  useEffect(() => {
    if (positions.length === 0) return;
    
    const interval = setInterval(() => {
      setPositions(prevPositions => {
        return prevPositions.map(position => {
          if (position.status === 'closed') return position;
          
          const symbolData = marketData[position.symbol];
          if (!symbolData) return position;
          
          const currentPrice = position.position_type === 'buy' 
            ? symbolData.bid_price 
            : symbolData.ask_price;
            
          const unrealized_pnl = calculatePnL({
            ...position,
            current_price: currentPrice
          });
          
          return {
            ...position,
            current_price: currentPrice,
            unrealized_pnl
          };
        });
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [positions, marketData]);

  // Calculate margin requirement
  const calculateMargin = (volume: number) => {
    return volume * 100000 * 0.01;
  };

  // Calculate P&L for a position
  const calculatePnL = (position: Position) => {
    const contractSize = 100000;
    const priceDifference = position.position_type === 'buy' 
      ? position.current_price - position.open_price 
      : position.open_price - position.current_price;
    
    return priceDifference * position.volume * contractSize;
  };

  // Add a new position
  const addPosition = async (positionData: {
    symbol: string;
    position_type: 'buy' | 'sell';
    volume: number;
    open_price: number;
    stop_loss?: number;
    take_profit?: number;
  }) => {
    try {
      if (!user || !activeAccount) {
        throw new Error('User must be logged in to open a position');
      }

      const requiredMargin = calculateMargin(positionData.volume);
      const currentBalance = activeAccount.balance || 0;
      
      if (requiredMargin > currentBalance) {
        toast({
          title: "Insufficient Balance",
          description: "Not enough balance to open this position",
          variant: "destructive"
        });
        return;
      }

      const newBalance = currentBalance - requiredMargin;
      const accountRef = ref(db, `accounts/${activeAccount.id}`);
      await update(accountRef, { balance: newBalance });
      
      const positionRef = ref(db, `positions/${user.uid}`);
      const newPositionRef = push(positionRef);
      
      const symbolData = marketData[positionData.symbol];
      const currentPrice = positionData.position_type === 'buy' 
        ? symbolData?.bid_price || positionData.open_price
        : symbolData?.ask_price || positionData.open_price;
      
      const newPosition: Position = {
        ...positionData,
        id: newPositionRef.key as string,
        userId: user.uid,
        current_price: currentPrice,
        unrealized_pnl: 0,
        open_time: new Date().toISOString(),
        status: 'open'
      };

      await set(newPositionRef, newPosition);

      toast({
        title: `${positionData.position_type.toUpperCase()} Order Placed`,
        description: `${positionData.volume} lots of ${positionData.symbol} at ${positionData.open_price.toFixed(5)}`,
      });
    } catch (error: any) {
      console.error('Error adding position:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to place order. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Close a position
  const closePosition = async (positionId: string) => {
    try {
      if (!user || !activeAccount) {
        throw new Error('User must be logged in to close a position');
      }

      const position = positions.find(p => p.id === positionId);
      if (!position) {
        throw new Error('Position not found');
      }

      if (position.status === 'closed') {
        throw new Error('Position already closed');
      }

      const pnl = position.unrealized_pnl;

      const positionUpdates: Partial<Position> = {
        status: 'closed',
        close_time: new Date().toISOString(),
        profit_loss: pnl
      };

      const positionRef = ref(db, `positions/${user.uid}/${positionId}`);
      await update(positionRef, positionUpdates);

      const currentBalance = activeAccount.balance || 0;
      const newBalance = currentBalance + pnl;
      const accountRef = ref(db, `accounts/${activeAccount.id}`);
      await update(accountRef, { balance: newBalance });
      
      toast({
        title: "Position Closed",
        description: `Realized P&L: ${pnl >= 0 ? '+' : ''}$${Math.abs(pnl).toFixed(2)}`,
        variant: pnl >= 0 ? "default" : "destructive"
      });
    } catch (error: any) {
      console.error('Error closing position:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to close position. Please try again.",
        variant: "destructive"
      });
    }
  };

  // NEW FUNCTION: Fetch market data
  const fetchMarketData = async () => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newMarketData: Record<string, any> = {};
      
      // Update base prices with random fluctuations
      Object.keys(basePrices.current).forEach(symbol => {
        const fluctuation = (Math.random() - 0.5) * 0.01; // -0.5% to +0.5%
        basePrices.current[symbol] *= (1 + fluctuation);
      });
      
      // Generate market data for each symbol
      Object.entries(basePrices.current).forEach(([symbol, basePrice]) => {
        const spread = symbol.includes('BTC') || symbol.includes('ETH') 
          ? 5 + Math.random() * 10 
          : 0.0001 + Math.random() * 0.0002;
          
        const bidPrice = basePrice;
        const askPrice = basePrice + spread;
        
        newMarketData[symbol] = {
          symbol,
          bid_price: parseFloat(bidPrice.toFixed(5)),
          ask_price: parseFloat(askPrice.toFixed(5)),
          high: parseFloat((basePrice * (1 + 0.005)).toFixed(5)),
          low: parseFloat((basePrice * (1 - 0.005)).toFixed(5)),
          change: parseFloat((fluctuation * 100).toFixed(2)),
          volume: Math.floor(1000000 + Math.random() * 5000000)
        };
      });
      
      setMarketData(newMarketData);
    } catch (error) {
      console.error('Error fetching market data:', error);
      throw new Error('Failed to fetch market data');
    }
  };

  const updateMarketData = (symbol: string, data: any) => {
    setMarketData(prev => ({
      ...prev,
      [symbol]: { ...prev[symbol], ...data }
    }));
  };

  const getTotalPnL = () => {
    return positions.reduce((sum, position) => sum + (position.profit_loss || 0), 0);
  };

  const getActivePositionsCount = () => {
    return positions.filter(p => p.status === 'open').length;
  };

  // Initial data fetch on mount
  useEffect(() => {
    fetchMarketData();
    
    // Setup periodic updates
    const interval = setInterval(fetchMarketData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <TradingContext.Provider value={{
      positions,
      marketData,
      addPosition,
      closePosition,
      updateMarketData,
      getTotalPnL,
      getActivePositionsCount,
      calculatePnL,
      fetchMarketData // Added to context value
    }}>
      {children}
    </TradingContext.Provider>
  );
};

export const useTrading = () => {
  const context = useContext(TradingContext);
  if (!context) {
    throw new Error('useTrading must be used within a TradingProvider');
  }
  return context;
};