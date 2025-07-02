import { Card, CardContent } from '@/components/ui/card';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight
} from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';

interface PortfolioOverviewProps {
  portfolioData: {
    totalValue: number;
    totalPnL: number;
    totalPnLPercent: number;
    dayChange: number;
    dayChangePercent: number;
  };
  totalAssets: number;
}

const PortfolioOverview = ({ portfolioData, totalAssets }: PortfolioOverviewProps) => {
  const { convertCurrency } = useCurrency();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 px-2">
      {/* Total Value Card */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-slate-400 text-xs sm:text-sm">Total Value</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white truncate">
                {convertCurrency(portfolioData.totalValue)}
              </p>
            </div>
            <Wallet className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 flex-shrink-0 ml-2" />
          </div>
        </CardContent>
      </Card>

      {/* Total P&L Card */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-slate-400 text-xs sm:text-sm">Total P&L</p>
              <p className={`text-lg sm:text-xl lg:text-2xl font-bold truncate ${portfolioData.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {portfolioData.totalPnL >= 0 ? '+' : ''}{convertCurrency(portfolioData.totalPnL)}
              </p>
              <p className={`text-xs sm:text-sm ${portfolioData.totalPnLPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {portfolioData.totalPnLPercent >= 0 ? '+' : ''}{portfolioData.totalPnLPercent.toFixed(2)}%
              </p>
            </div>
            {portfolioData.totalPnL >= 0 ? 
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 flex-shrink-0 ml-2" /> : 
              <TrendingDown className="w-6 h-6 sm:w-8 sm:h-8 text-red-400 flex-shrink-0 ml-2" />
            }
          </div>
        </CardContent>
      </Card>

      {/* Day Change Card */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-slate-400 text-xs sm:text-sm">Day Change</p>
              <p className={`text-lg sm:text-xl lg:text-2xl font-bold truncate ${portfolioData.dayChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {portfolioData.dayChange >= 0 ? '+' : ''}{convertCurrency(portfolioData.dayChange)}
              </p>
              <p className={`text-xs sm:text-sm ${portfolioData.dayChangePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {portfolioData.dayChangePercent >= 0 ? '+' : ''}{portfolioData.dayChangePercent.toFixed(2)}%
              </p>
            </div>
            {portfolioData.dayChange >= 0 ? 
              <ArrowUpRight className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 flex-shrink-0 ml-2" /> : 
              <ArrowDownRight className="w-6 h-6 sm:w-8 sm:h-8 text-red-400 flex-shrink-0 ml-2" />
            }
          </div>
        </CardContent>
      </Card>

      {/* Assets Card */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-slate-400 text-xs sm:text-sm">Assets</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{totalAssets}</p>
              <p className="text-xs sm:text-sm text-slate-400">Active Positions</p>
            </div>
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
              <span className="text-xs sm:text-sm font-bold text-white">{totalAssets}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioOverview;