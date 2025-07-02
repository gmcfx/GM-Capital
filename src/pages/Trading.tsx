// src/pages/Trading.tsx
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TradingViewChart from '@/components/TradingViewChart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Target, 
  Calculator, 
  RefreshCw,
  ChevronDown,
  X
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTrading } from '@/contexts/TradingContext';

const Trading = () => {
  const { t } = useLanguage();
  const { convertCurrency } = useCurrency();
  const { user, activeAccount } = useAuth();
  const navigate = useNavigate();
  const { 
    positions, 
    marketData, 
    addPosition, 
    closePosition,
    fetchMarketData // Added fetchMarketData from context
  } = useTrading();

  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [lotSize, setLotSize] = useState('0.01');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get symbols from real-time market data
  const tradingPairs = Object.keys(marketData).map(symbol => {
    const isForex = symbol.includes('/') || symbol.includes('_') || 
                   (symbol.length === 6 && !symbol.includes('USDT'));
    
    return {
      symbol,
      name: symbol.replace('/', ' / ').replace('_', ' / '),
      type: isForex ? 'Forex' : 'Crypto'
    };
  });

  const currentMarketData = marketData[selectedSymbol];
  const openPositions = positions.filter(p => p.status === 'open');

  // Fetch market data on mount and when retrying
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setConnectionError(false);
        await fetchMarketData();
      } catch (error) {
        console.error('Market data fetch error:', error);
        setConnectionError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [fetchMarketData]);

  // Set initial symbol when market data loads
  useEffect(() => {
    if (tradingPairs.length > 0 && !selectedSymbol) {
      setSelectedSymbol(tradingPairs[0].symbol);
    }
  }, [tradingPairs, selectedSymbol]);

  const handleTrade = async (direction: 'buy' | 'sell') => {
    if (!currentMarketData || !user) return;

    const price = direction === 'buy' ? currentMarketData.ask_price : currentMarketData.bid_price;
    const volume = parseFloat(lotSize);

    await addPosition({
      symbol: selectedSymbol,
      position_type: direction,
      volume: volume,
      open_price: price,
      stop_loss: stopLoss ? parseFloat(stopLoss) : undefined,
      take_profit: takeProfit ? parseFloat(takeProfit) : undefined
    });

    // Reset form after trade
    setLotSize('0.01');
    setStopLoss('');
    setTakeProfit('');
  };

  const calculateRisk = () => {
    if (!currentMarketData) return 'Calculating...';
    
    const lotValue = parseFloat(lotSize) * 100000;
    const pipValue = lotValue * 0.0001;
    const riskAmount = pipValue * (stopLoss ? Math.abs(currentMarketData.bid_price - parseFloat(stopLoss)) : 10);
    
    return convertCurrency(riskAmount);
  };

  const handleRetry = async () => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
    
    setIsLoading(true);
    setConnectionError(false);
    
    try {
      await fetchMarketData();
    } catch (error) {
      console.error('Retry failed:', error);
      setConnectionError(true);
      
      // Auto-retry after 5 seconds if still failing
      retryTimeoutRef.current = setTimeout(() => {
        handleRetry();
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-white">Loading Trading Interface...</p>
          <p className="text-slate-400 text-sm mt-2">Fetching live market data</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="mb-4">Please log in to access the trading interface.</p>
          <Button onClick={() => navigate('/login')}>Go to Login</Button>
        </div>
      </div>
    );
  }

  if (connectionError || tradingPairs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white max-w-md p-6 bg-slate-800/50 rounded-xl">
          <div className="bg-red-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Market Connection Issue</h2>
          <p className="mb-5 text-slate-300">
            We're having trouble connecting to the trading servers. This might be due to network issues or server maintenance.
          </p>
          
          <div className="bg-slate-700/50 p-4 rounded-lg mb-6 text-left">
            <h3 className="font-medium mb-2 flex items-center">
              <RefreshCw className="w-4 h-4 mr-2" />
              Troubleshooting Tips
            </h3>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>• Check your internet connection</li>
              <li>• Disable VPN or proxy if used</li>
              <li>• Verify server status on our status page</li>
            </ul>
          </div>
          
          <Button 
            onClick={handleRetry} 
            className="mt-4 w-full max-w-xs mx-auto bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry Connection
          </Button>
          
          <p className="text-slate-400 text-xs mt-4">
            Auto-retrying in 5 seconds...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-green-400" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
            Trading Interface
          </h1>
          <Badge variant="outline" className="text-green-400 border-green-400 text-xs ml-auto">
            {t('live')}
          </Badge>
        </div>

        {/* Account Balance */}
        <div className="bg-slate-800/50 p-4 rounded-lg flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm">Account Balance</p>
            <p className="text-xl font-bold">
              ${activeAccount?.balance?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">Account Type</p>
            <Badge variant={activeAccount?.account_type === 'demo' ? 'outline' : 'default'}>
              {activeAccount?.account_type === 'demo' ? 'DEMO' : 'REAL'}
            </Badge>
          </div>
        </div>

        {/* Chart & Order Panel */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3">
            <Card className="bg-slate-800/50 border-none backdrop-blur-sm">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
                <CardTitle className="text-white flex items-center gap-2 text-sm">
                  <Activity className="text-blue-400" /> {selectedSymbol} Chart
                </CardTitle>
                <div className="w-full sm:w-auto">
                  <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
                    <SelectTrigger className="w-full sm:w-48 bg-slate-700 border-none text-white">
                      <SelectValue />
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-none max-h-60 overflow-y-auto">
                      {tradingPairs.map((pair) => (
                        <SelectItem key={pair.symbol} value={pair.symbol} className="text-white">
                          <div className="flex items-center gap-2">
                            <span>{pair.symbol}</span>
                            <Badge 
                              variant="outline" 
                              className={`ml-2 text-xs ${
                                pair.type === 'Forex' 
                                  ? 'text-blue-400 border-blue-400' 
                                  : 'text-orange-400 border-orange-400'
                              }`}
                            >
                              {pair.type}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="h-[500px]">
                <TradingViewChart symbol={selectedSymbol} />
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="bg-slate-800/50 border-none backdrop-blur-sm h-full">
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <Target className="text-green-400" /> Order Panel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-slate-400 text-xs mb-1 block">Lot Size</Label>
                    <Input 
                      value={lotSize} 
                      onChange={(e) => setLotSize(e.target.value)} 
                      className="bg-slate-700 border-none text-white text-sm" 
                      type="number"
                      min="0.01"
                      step="0.01"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-slate-400 text-xs mb-1 block">Stop Loss</Label>
                      <Input 
                        value={stopLoss} 
                        onChange={(e) => setStopLoss(e.target.value)} 
                        className="bg-slate-700 border-none text-white text-sm" 
                        type="number"
                        step="0.0001"
                        placeholder="Optional"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-400 text-xs mb-1 block">Take Profit</Label>
                      <Input 
                        value={takeProfit} 
                        onChange={(e) => setTakeProfit(e.target.value)} 
                        className="bg-slate-700 border-none text-white text-sm" 
                        type="number"
                        step="0.0001"
                        placeholder="Optional"
                      />
                    </div>
                  </div>

                  <div className="bg-slate-900/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calculator className="text-blue-400 w-4 h-4" />
                      <span className="text-xs text-slate-400">Estimated Risk:</span>
                    </div>
                    <p className="text-sm text-white font-medium mt-1">{calculateRisk()}</p>
                  </div>

                  {currentMarketData && (
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        className="bg-green-600 hover:bg-green-700 h-14"
                        onClick={() => handleTrade('buy')}
                      >
                        <div className="flex flex-col items-center w-full">
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            <span>Buy</span>
                          </div>
                          <span className="text-xs font-normal mt-1 opacity-90">
                            @ {currentMarketData.ask_price.toFixed(5)}
                          </span>
                        </div>
                      </Button>
                      <Button 
                        className="bg-red-600 hover:bg-red-700 h-14"
                        onClick={() => handleTrade('sell')}
                      >
                        <div className="flex flex-col items-center w-full">
                          <div className="flex items-center gap-1">
                            <TrendingDown className="w-4 h-4" />
                            <span>Sell</span>
                          </div>
                          <span className="text-xs font-normal mt-1 opacity-90">
                            @ {currentMarketData.bid_price.toFixed(5)}
                          </span>
                        </div>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Open Positions */}
        {openPositions.length > 0 && (
          <Card className="bg-slate-800/50 border-none backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <Activity className="text-blue-400" /> Open Positions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-slate-400 text-xs">
                      <th className="pb-2">Symbol</th>
                      <th className="pb-2">Type</th>
                      <th className="pb-2">Volume</th>
                      <th className="pb-2">Open Price</th>
                      <th className="pb-2">Current Price</th>
                      <th className="pb-2">Profit/Loss</th>
                      <th className="pb-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {openPositions.map((position) => (
                      <tr key={position.id} className="border-b border-slate-700/50">
                        <td className="py-3 font-medium">{position.symbol}</td>
                        <td>
                          <Badge 
                            variant={position.position_type === 'buy' ? 'default' : 'destructive'} 
                            className="px-2 py-1 text-xs"
                          >
                            {position.position_type.toUpperCase()}
                          </Badge>
                        </td>
                        <td>{position.volume}</td>
                        <td>{position.open_price.toFixed(5)}</td>
                        <td>{position.current_price?.toFixed(5) || 'N/A'}</td>
                        <td className={position.unrealized_pnl >= 0 ? 'text-green-400' : 'text-red-400'}>
                          {position.unrealized_pnl !== undefined 
                            ? `${position.unrealized_pnl >= 0 ? '+' : ''}${position.unrealized_pnl.toFixed(2)}`
                            : 'N/A'}
                        </td>
                        <td>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => closePosition(position.id)}
                          >
                            <X className="w-4 h-4" /> Close
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Trading;