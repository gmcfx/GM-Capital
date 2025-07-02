import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, PieChart } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useSettings } from '@/contexts/SettingsContext';

const PortfolioSnapshot = () => {
  const { convertCurrency } = useCurrency();
  const { getCurrentBalance } = useSettings();

  // Use consistent balance from settings
  const totalValue = getCurrentBalance();
  
  const portfolioData = {
    totalValue: totalValue,
    allocation: [
      { type: 'Forex', value: totalValue * 0.588, percentage: 58.8, color: 'bg-blue-500' },
      { type: 'Crypto', value: totalValue * 0.275, percentage: 27.5, color: 'bg-orange-500' },
      { type: 'Commodities', value: totalValue * 0.137, percentage: 13.7, color: 'bg-green-500' }
    ],
    topHoldings: [
      { symbol: 'EURUSD', value: totalValue * 0.2, change: 2.5, type: 'forex' },
      { symbol: 'BTCUSD', value: totalValue * 0.15, change: -1.2, type: 'crypto' },
      { symbol: 'GBPUSD', value: totalValue * 0.12, change: 1.8, type: 'forex' },
      { symbol: 'ETHUSD', value: totalValue * 0.1, change: 3.4, type: 'crypto' },
      { symbol: 'XAUUSD', value: totalValue * 0.08, change: 0.8, type: 'commodity' }
    ]
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* Asset Allocation */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <PieChart className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
            <span className="text-sm sm:text-base">Asset Allocation</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center mb-4">
            <p className="text-xl sm:text-2xl font-bold text-white">{convertCurrency(portfolioData.totalValue)}</p>
            <p className="text-slate-400 text-xs sm:text-sm">Total Portfolio Value</p>
          </div>
          <div className="space-y-3">
            {portfolioData.allocation.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className={`w-3 h-3 rounded-full ${item.color} flex-shrink-0`} />
                    <span className="text-white text-xs sm:text-sm">{item.type}</span>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-white text-xs sm:text-sm font-medium">{convertCurrency(item.value)}</p>
                    <p className="text-slate-400 text-xs">{item.percentage}%</p>
                  </div>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Holdings */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white text-sm sm:text-base">Top Holdings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {portfolioData.topHoldings.map((holding, index) => (
            <div key={index} className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-slate-900/50">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-white">{index + 1}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-white font-medium text-xs sm:text-sm truncate">{holding.symbol}</p>
                  <p className="text-slate-400 text-xs capitalize">{holding.type}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-white font-medium text-xs sm:text-sm">{convertCurrency(holding.value)}</p>
                <div className={`text-xs flex items-center gap-1 ${
                  holding.change >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {holding.change >= 0 ? <TrendingUp className="w-2 h-2 sm:w-3 sm:h-3" /> : <TrendingDown className="w-2 h-2 sm:w-3 sm:h-3" />}
                  {holding.change >= 0 ? '+' : ''}{holding.change}%
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioSnapshot;