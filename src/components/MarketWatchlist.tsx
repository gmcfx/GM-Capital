// src/components/MarketWatchlist.tsx
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { database } from '@/integrations/firebase/firebaseConfig';
import { ref, onValue } from 'firebase/database'; // Removed unused 'off' import
import { MarketData } from '@/integrations/firebase/types';

interface ExtendedMarketData extends MarketData {
  type: 'forex' | 'crypto' | 'commodity' | 'index';
  name: string;
  change_24h?: number;
}

const MarketWatchlist = () => {
  const { convertCurrency } = useCurrency();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [marketData, setMarketData] = useState<ExtendedMarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Fetch real-time market data from Firebase
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    const marketDataRef = ref(database, 'marketData');
    
    const handleData = (snapshot: any) => {
      try {
        const data = snapshot.val();
        if (data) {
          const marketDataArray: ExtendedMarketData[] = Object.keys(data).map(key => ({
            id: key,
            ...data[key],
            type: data[key].type || 'forex',
            name: data[key].name || data[key].symbol,
            change_24h: data[key].change_24h || 0
          }));
          setMarketData(marketDataArray);
        } else {
          setMarketData([]);
          setError('No market data available');
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to process market data');
        setLoading(false);
        console.error('Data processing error:', err);
      }
    };

    const handleError = (error: Error) => {
      setError('Failed to connect to market data service');
      setLoading(false);
      console.error('Firebase connection error:', error);
    };

    try {
      const unsubscribe = onValue(marketDataRef, handleData, handleError);
      
      // Cleanup function
      return () => {
        unsubscribe();  // Using the unsubscribe function directly
      };
    } catch (err) {
      setError('Failed to initialize connection');
      setLoading(false);
      console.error('Initialization error:', err);
    }
  }, [retryCount]);

  const toggleFavorite = (symbol: string) => {
    setFavorites(prev => 
      prev.includes(symbol) 
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  const sortedData = [...marketData].sort((a, b) => {
    const aFav = favorites.includes(a.symbol);
    const bFav = favorites.includes(b.symbol);
    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;
    return 0;
  });

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm h-full">
        <CardHeader>
          <CardTitle className="text-white">Market Watchlist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-slate-700" />
                <div className="space-y-1">
                  <div className="h-4 w-20 bg-slate-700 rounded" />
                  <div className="h-3 w-32 bg-slate-800 rounded" />
                </div>
              </div>
              <div className="space-y-1 text-right">
                <div className="h-4 w-16 bg-slate-700 rounded" />
                <div className="h-3 w-12 bg-slate-800 rounded" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm h-full">
        <CardHeader>
          <CardTitle className="text-white">Market Watchlist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-red-400">{error}</p>
            <p className="text-slate-400 text-sm mt-2">
              Please check your internet connection
            </p>
            <button
              onClick={handleRetry}
              className="mt-4 flex items-center justify-center gap-2 mx-auto px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Connection</span>
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (marketData.length === 0) {
    return (
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm h-full">
        <CardHeader>
          <CardTitle className="text-white">Market Watchlist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-slate-400">
              No market data available
            </p>
            <button
              onClick={handleRetry}
              className="mt-4 flex items-center justify-center gap-2 mx-auto px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Connection</span>
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm h-full">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          Market Watchlist
          <Badge variant="outline" className="text-green-400 border-green-400 text-xs">
            Live
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {sortedData.map((item) => {
          // Calculate price from bid/ask
          const midPrice = (item.bid_price + item.ask_price) / 2;
          const spread = item.spread || (item.ask_price - item.bid_price);
          
          return (
            <div 
              key={item.id}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 hover:bg-slate-900/70 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(item.symbol);
                  }}
                  className={`p-1 rounded ${
                    favorites.includes(item.symbol) 
                      ? 'text-yellow-400 hover:text-yellow-300' 
                      : 'text-slate-400 hover:text-slate-300'
                  }`}
                  aria-label={favorites.includes(item.symbol) ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Star className="w-4 h-4" fill={favorites.includes(item.symbol) ? 'currentColor' : 'none'} />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white text-sm">{item.symbol}</span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        item.type === 'forex' 
                          ? 'text-blue-400 border-blue-400' 
                          : item.type === 'crypto'
                            ? 'text-orange-400 border-orange-400'
                            : 'text-purple-400 border-purple-400'
                      }`}
                    >
                      {item.type.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 truncate max-w-32">
                    {item.name}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-medium text-sm">
                  {item.type === 'crypto' 
                    ? convertCurrency(midPrice) 
                    : midPrice.toFixed(item.symbol.includes('JPY') ? 2 : 4)}
                </div>
                <div className={`text-xs flex items-center gap-1 ${
                  (item.change_24h || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {(item.change_24h || 0) >= 0 
                    ? <TrendingUp className="w-3 h-3" /> 
                    : <TrendingDown className="w-3 h-3" />}
                  {(item.change_24h || 0) >= 0 ? '+' : ''}
                  {((item.change_24h || 0) * 100).toFixed(2)}%
                </div>
                <div className="text-xs text-slate-400">
                  Spread: {spread.toFixed(item.type === 'crypto' ? 2 : 4)}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default MarketWatchlist;