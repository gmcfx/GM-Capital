import { useState, useEffect, useContext } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Activity, X, Eye } from 'lucide-react';
import { AuthContext } from '@/contexts/AuthContext';
import { TradingContext } from '@/contexts/TradingContext';
import { getRealtimeDB } from '@/lib/firebase';
import { ref, query, orderByChild, equalTo, get, DataSnapshot } from 'firebase/database';

// Define context interfaces
interface AuthContextType {
  user: {
    uid: string;
    email?: string;
    displayName?: string;
  } | null;
}

interface TradingContextType {
  positions: any[];
  closePosition: (id: string) => void;
  getTotalPnL: () => number;
  balance: number;
}

// Position interface
interface Position {
  id: string;
  user_id?: string;
  userId?: string;
  symbol: string;
  position_type: 'buy' | 'sell';
  volume: number;
  open_price?: number;
  openPrice?: number;
  current_price?: number;
  currentPrice?: number;
  profit_loss?: number;
  profitLoss?: number;
  status: 'open' | 'closed';
  opened_at?: string;
  openedAt?: string;
  closed_at?: string;
  closedAt?: string;
}

// Helper functions to safely access properties
const getOpenedAt = (trade: Position) => trade.opened_at || trade.openedAt || '';
const getClosedAt = (trade: Position) => trade.closed_at || trade.closedAt || '';
const getCurrentPrice = (trade: Position) => trade.current_price || trade.currentPrice || 0;
const getProfitLoss = (trade: Position) => trade.profit_loss || trade.profitLoss || 0;
const getOpenPrice = (trade: Position) => trade.open_price || trade.openPrice || 0;

const MyTrades = () => {
  // Use contexts with proper types
  const authContext = useContext(AuthContext) as AuthContextType | null;
  const tradingContext = useContext(TradingContext) as unknown as TradingContextType | null;
  
  // Safe destructuring with fallbacks
  const positions = tradingContext?.positions || [];
  const closePosition = tradingContext?.closePosition || (() => {});
  const getTotalPnL = tradingContext?.getTotalPnL || (() => 0);
  const balance = tradingContext?.balance || 0;
  const { user } = authContext || {};

  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [closedPositions, setClosedPositions] = useState<Position[]>([]);

  // Fetch closed positions from Firebase
  useEffect(() => {
    if (!user) return;

    const fetchClosedPositions = async () => {
      const db = getRealtimeDB();
      const positionsRef = ref(db, 'positions');
      const userPositionsQuery = query(
        positionsRef,
        orderByChild('user_id'),
        equalTo(user.uid)
      );

      try {
        const snapshot = await get(userPositionsQuery);
        const positionsData: Position[] = [];
        
        snapshot.forEach((childSnapshot: DataSnapshot) => {
          const position = childSnapshot.val();
          if (position.status === 'closed') {
            positionsData.push({
              id: childSnapshot.key || '',
              ...position
            });
          }
        });

        setClosedPositions(positionsData);
      } catch (error) {
        console.error('Error fetching closed positions:', error);
      }
    };

    fetchClosedPositions();
  }, [user]);

  const allTrades = [...positions, ...closedPositions];

  const getFilteredTrades = () => {
    let filtered = allTrades;
    
    if (filter === 'open') {
      filtered = filtered.filter(trade => trade.status === 'open');
    } else if (filter === 'closed') {
      filtered = filtered.filter(trade => trade.status === 'closed');
    } else if (filter === 'profitable') {
      filtered = filtered.filter(trade => getProfitLoss(trade) > 0);
    } else if (filter === 'losing') {
      filtered = filtered.filter(trade => getProfitLoss(trade) < 0);
    }

    // Sort trades
    if (sortBy === 'date') {
      filtered.sort((a, b) => 
        new Date(getOpenedAt(b)).getTime() - new Date(getOpenedAt(a)).getTime()
      );
    } else if (sortBy === 'pnl') {
      filtered.sort((a, b) => getProfitLoss(b) - getProfitLoss(a));
    } else if (sortBy === 'symbol') {
      filtered.sort((a, b) => a.symbol.localeCompare(b.symbol));
    }

    return filtered;
  };

  const filteredTrades = getFilteredTrades();

  const totalPnL = getTotalPnL();
  const openTrades = positions.length;
  const closedTrades = closedPositions.length;
  const winRate = closedTrades > 0 ? 
    (closedPositions.filter(p => getProfitLoss(p) > 0).length / closedTrades * 100) : 0;

  const formatDuration = (openTime: string, closeTime?: string | null) => {
    const start = new Date(openTime);
    const end = closeTime ? new Date(closeTime) : new Date();
    const diff = Math.abs(end.getTime() - start.getTime());
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-2 sm:p-4 lg:p-6">
        <div className="max-w-7xl mx-auto pt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p>Please log in to view your trades.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-2 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 pt-16 sm:pt-0">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 sm:mb-6 px-2">
          <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent break-words">
              My Trades
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Monitor and manage your trading positions • Balance: ${balance.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Trading Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-sm text-slate-400">Open Positions</div>
              <div className="text-2xl font-bold text-blue-400">{openTrades}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-sm text-slate-400">Closed Trades</div>
              <div className="text-2xl font-bold text-slate-300">{closedTrades}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-sm text-slate-400">Total P&L</div>
              <div className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-sm text-slate-400">Win Rate</div>
              <div className="text-2xl font-bold text-purple-400">{winRate.toFixed(1)}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Controls */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm text-slate-400">Filter:</label>
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-40 bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="all" className="text-white">All Trades</SelectItem>
                    <SelectItem value="open" className="text-white">Open Only</SelectItem>
                    <SelectItem value="closed" className="text-white">Closed Only</SelectItem>
                    <SelectItem value="profitable" className="text-white">Profitable</SelectItem>
                    <SelectItem value="losing" className="text-white">Losing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-sm text-slate-400">Sort by:</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="date" className="text-white">Date</SelectItem>
                    <SelectItem value="pnl" className="text-white">P&L</SelectItem>
                    <SelectItem value="symbol" className="text-white">Symbol</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trades List */}
        <div className="space-y-3">
          {filteredTrades.length === 0 ? (
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <Activity className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No trades found</h3>
                <p className="text-slate-400">
                  {filter === 'all' ? 'You have no trading history yet' : `No ${filter} trades found`}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredTrades.map((trade) => (
              <Card key={trade.id} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        trade.position_type === 'buy' ? 'bg-green-600' : 'bg-red-600'
                      }`}>
                        {trade.position_type === 'buy' ? '↗' : '↘'}
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-semibold">{trade.symbol}</span>
                          <Badge variant="outline" className={
                            trade.position_type === 'buy' 
                              ? 'text-green-400 border-green-400'
                              : 'text-red-400 border-red-400'
                          }>
                            {trade.position_type.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className={
                            trade.status === 'open'
                              ? 'text-blue-400 border-blue-400'
                              : 'text-slate-400 border-slate-400'
                          }>
                            {trade.status.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="text-sm text-slate-400">
                          Volume: {trade.volume} lots • Opened: {new Date(getOpenedAt(trade)).toLocaleString()}
                        </div>
                        <div className="text-sm text-slate-400">
                          Duration: {formatDuration(getOpenedAt(trade), getClosedAt(trade))}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        getProfitLoss(trade) >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {getProfitLoss(trade) >= 0 ? '+' : ''}${getProfitLoss(trade).toFixed(2)}
                      </div>
                      <div className="text-sm text-slate-400">
                        Open: {getOpenPrice(trade).toFixed(trade.symbol.includes('JPY') ? 3 : 5)}
                      </div>
                      {trade.status === 'open' && (
                        <div className="text-sm text-slate-400">
                          Current: {getCurrentPrice(trade).toFixed(trade.symbol.includes('JPY') ? 3 : 5)}
                        </div>
                      )}
                    </div>

                    {trade.status === 'open' && (
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-600 text-white hover:bg-slate-700"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => closePosition(trade.id)}
                          size="sm"
                          variant="destructive"
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTrades;