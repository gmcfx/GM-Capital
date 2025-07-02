// src/pages/Market.tsx
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { database } from '@/integrations/firebase/firebaseConfig';
import { ref, onValue } from 'firebase/database';
import { MarketData } from '@/integrations/firebase/types';

// Define a type that includes the name property
interface MarketDataWithName extends MarketData {
  name?: string;
}

interface ExtendedMarketData extends MarketDataWithName {
  symbol: string;
  type: 'forex' | 'crypto' | 'commodity' | 'index';
  change_24h: number;
}

const MarketPage = () => {
  const { convertCurrency } = useCurrency();
  const [marketData, setMarketData] = useState<ExtendedMarketData[]>([]);
  const [filteredData, setFilteredData] = useState<ExtendedMarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string }>({
    key: 'symbol',
    direction: 'ascending'
  });

  // Fetch real-time market data from Firebase
  useEffect(() => {
    const marketDataRef = ref(database, 'marketData');
    
    const unsubscribe = onValue(marketDataRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          const marketDataArray: ExtendedMarketData[] = Object.entries(data).map(([symbol, marketData]) => {
            const marketEntry = marketData as MarketDataWithName;
            
            // Determine type based on symbol
            let type: 'forex' | 'crypto' | 'commodity' | 'index' = 'crypto';
            if (symbol.includes('/') || symbol.includes('_')) type = 'forex';
            if (symbol.includes('XAU') || symbol.includes('OIL')) type = 'commodity';
            if (symbol.includes('DJI') || symbol.includes('NASDAQ')) type = 'index';
            
            return {
              ...marketEntry,
              symbol,
              type,
              name: marketEntry.name || symbol, // Use provided name or fallback to symbol
              change_24h: marketEntry.change_24h || 0
            };
          });
          
          setMarketData(marketDataArray);
          setFilteredData(marketDataArray);
          setLoading(false);
        } else {
          setError('No market data available');
          setLoading(false);
        }
      } catch (err) {
        setError('Failed to process market data');
        setLoading(false);
        console.error('Data processing error:', err);
      }
    }, (error) => {
      setError('Failed to connect to market data service');
      setLoading(false);
      console.error('Firebase connection error:', error);
    });

    return () => unsubscribe();
  }, []);

  // Apply search filter
  useEffect(() => {
    if (!searchTerm) {
      setFilteredData(marketData);
      return;
    }
    
    const term = searchTerm.toLowerCase();
    const filtered = marketData.filter(item => 
      item.symbol.toLowerCase().includes(term) || 
      (item.name && item.name.toLowerCase().includes(term)) ||
      item.type.toLowerCase().includes(term)
    );
    
    setFilteredData(filtered);
  }, [searchTerm, marketData]);

  // Handle sorting
  const requestSort = (key: string) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Apply sorting
  useEffect(() => {
    if (!sortConfig.key) return;

    const sortedData = [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof ExtendedMarketData];
      const bValue = b[sortConfig.key as keyof ExtendedMarketData];
      
      // Handle undefined values
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;
      
      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    setFilteredData(sortedData);
  }, [sortConfig, filteredData.length]);

  const refreshData = () => {
    setLoading(true);
    setError(null);
    // Firebase will automatically push new data when available
  };

  const getSortIndicator = (key: string) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? <ArrowUp className="w-3 h-3 ml-1" /> : <ArrowDown className="w-3 h-3 ml-1" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading Live Market Data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm max-w-md">
          <CardHeader>
            <CardTitle className="text-white">Market Data Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-400 mb-4">{error}</p>
            <p className="text-slate-400 text-sm mb-6">
              Please check your internet connection and try again
            </p>
            <Button
              onClick={refreshData}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry Connection
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              Live Market Data
            </h1>
            <p className="text-slate-400 mt-1 text-sm">
              Real-time prices for currencies, cryptocurrencies, and commodities
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-green-400 border-green-400 text-xs">
              Live
            </Badge>
            <Button
              variant="outline"
              className="text-slate-300 border-slate-700 hover:bg-slate-800"
              onClick={refreshData}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="text-white">Market Instruments</CardTitle>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-900 border-slate-700 text-white"
                  placeholder="Search instruments..."
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-slate-400 text-sm border-b border-slate-700">
                    <th 
                      className="py-3 px-4 cursor-pointer hover:text-white"
                      onClick={() => requestSort('symbol')}
                    >
                      <div className="flex items-center">
                        Instrument
                        {getSortIndicator('symbol')}
                      </div>
                    </th>
                    <th 
                      className="py-3 px-4 cursor-pointer hover:text-white"
                      onClick={() => requestSort('type')}
                    >
                      <div className="flex items-center">
                        Type
                        {getSortIndicator('type')}
                      </div>
                    </th>
                    <th 
                      className="py-3 px-4 cursor-pointer hover:text-white"
                      onClick={() => requestSort('bid_price')}
                    >
                      <div className="flex items-center">
                        Bid
                        {getSortIndicator('bid_price')}
                      </div>
                    </th>
                    <th 
                      className="py-3 px-4 cursor-pointer hover:text-white"
                      onClick={() => requestSort('ask_price')}
                    >
                      <div className="flex items-center">
                        Ask
                        {getSortIndicator('ask_price')}
                      </div>
                    </th>
                    <th 
                      className="py-3 px-4 cursor-pointer hover:text-white"
                      onClick={() => requestSort('spread')}
                    >
                      <div className="flex items-center">
                        Spread
                        {getSortIndicator('spread')}
                      </div>
                    </th>
                    <th 
                      className="py-3 px-4 cursor-pointer hover:text-white"
                      onClick={() => requestSort('change_24h')}
                    >
                      <div className="flex items-center">
                        24h Change
                        {getSortIndicator('change_24h')}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item) => {
                    const spread = item.spread || (item.ask_price - item.bid_price);
                    const changePercent = (item.change_24h || 0) * 100;
                    
                    return (
                      <tr 
                        key={item.symbol} 
                        className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="font-medium">{item.symbol}</div>
                          <div className="text-xs text-slate-400">{item.name || 'N/A'}</div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge 
                            variant="outline" 
                            className={
                              item.type === 'forex' ? 'text-blue-400 border-blue-400' :
                              item.type === 'crypto' ? 'text-orange-400 border-orange-400' :
                              item.type === 'commodity' ? 'text-yellow-400 border-yellow-400' :
                              'text-purple-400 border-purple-400'
                            }
                          >
                            {item.type}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          {item.type === 'crypto' 
                            ? convertCurrency(item.bid_price) 
                            : item.bid_price?.toFixed(5) || 'N/A'}
                        </td>
                        <td className="py-3 px-4">
                          {item.type === 'crypto' 
                            ? convertCurrency(item.ask_price) 
                            : item.ask_price?.toFixed(5) || 'N/A'}
                        </td>
                        <td className="py-3 px-4">
                          {spread ? spread.toFixed(item.type === 'crypto' ? 2 : 4) : 'N/A'}
                        </td>
                        <td className="py-3 px-4">
                          <div className={`flex items-center ${
                            changePercent >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {changePercent >= 0 
                              ? <ArrowUp className="w-4 h-4 mr-1" /> 
                              : <ArrowDown className="w-4 h-4 mr-1" />}
                            {Math.abs(changePercent).toFixed(2)}%
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              
              {filteredData.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  <Search className="w-12 h-12 mx-auto mb-4" />
                  <p>No instruments match your search</p>
                  <Button 
                    variant="ghost" 
                    className="mt-4 text-blue-400"
                    onClick={() => setSearchTerm('')}
                  >
                    Clear search
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarketPage;