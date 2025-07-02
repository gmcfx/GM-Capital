// src/pages/Dashboard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  PieChart,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  EyeOff
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import TradingViewChart from '@/components/TradingViewChart';
import MarketWatchlist from '@/components/MarketWatchlist';
import PortfolioSnapshot from '@/components/PortfolioSnapshot';

const Dashboard = () => {
  useLanguage();
  const { isDemoMode, getGreeting } = useSettings();
  const { profile, accounts, activeAccount } = useAuth();
  const navigate = useNavigate();

  // Calculate total open positions
  const totalOpenPositions = accounts.reduce(
    (sum, account) => sum + (account.openPositions || 0), 
    0
  );

  // Get user's full name safely
  const getUserFullName = () => {
    if (!profile) return "Trader";
    return [profile.first_name, profile.last_name]
      .filter(Boolean)
      .join(" ") || "Trader";
  };

  // Calculate account statistics
  const accountBalance = isDemoMode 
    ? `$${(50000).toLocaleString()}` 
    : activeAccount?.balance
      ? `$${activeAccount.balance.toLocaleString()}`
      : 'No Funds';
  
  const totalTrades = isDemoMode ? '15' : '0';
  const winRate = isDemoMode ? '68.5%' : '0%';
  
  const openPositionsValue = totalOpenPositions.toString();
  
  const openPositionsChange = isDemoMode 
    ? '+3' 
    : totalOpenPositions > 0 
      ? `+${totalOpenPositions}` 
      : '0';

  const stats = [
    {
      title: 'Account Balance',
      value: accountBalance,
      change: isDemoMode ? '+2.5%' : '0%',
      icon: DollarSign,
      trend: isDemoMode ? 'up' : 'neutral',
      color: 'text-green-400'
    },
    {
      title: 'Total Trades',
      value: totalTrades,
      change: isDemoMode ? '+12' : '0',
      icon: Activity,
      trend: isDemoMode ? 'up' : 'neutral',
      color: 'text-blue-400'
    },
    {
      title: 'Win Rate',
      value: winRate,
      change: isDemoMode ? '+3.2%' : '0%',
      icon: PieChart,
      trend: isDemoMode ? 'up' : 'neutral',
      color: 'text-purple-400'
    },
    {
      title: 'Open Positions',
      value: openPositionsValue,
      change: openPositionsChange,
      icon: BarChart3,
      trend: isDemoMode || totalOpenPositions > 0 ? 'up' : 'neutral',
      color: 'text-orange-400'
    }
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
            {getGreeting()}, {getUserFullName()}!
          </h1>
          <p className="text-slate-400 mt-1 text-sm sm:text-base">Welcome back to your trading dashboard</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Badge
            variant="outline"
            className={isDemoMode 
              ? 'text-yellow-400 border-yellow-400' 
              : 'text-blue-400 border-blue-400'}
          >
            {isDemoMode ? 'DEMO MODE' : 'REAL ACCOUNT'}
          </Badge>
          <Button
            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
            onClick={() => navigate('/trading')}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Start Trading
          </Button>
        </div>
      </div>

      {/* Warning for empty real account */}
      {!isDemoMode && !activeAccount?.balance && (
        <Card className="bg-yellow-900/20 border-none backdrop-blur-sm mt-4">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-3 flex-1">
                <EyeOff className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-yellow-400 font-medium">No Funds Available</p>
                  <p className="text-yellow-300/80 text-sm">
                    Deposit funds to begin trading, or switch to demo mode.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="border-yellow-600 text-yellow-400 hover:bg-yellow-600/10 text-sm"
                size="sm"
                onClick={() => navigate('/deposit')}
              >
                Deposit Funds
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-slate-800/50 border-none backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
              <CardTitle className="text-sm text-slate-400">{stat.title}</CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-xl font-bold text-white">{stat.value}</div>
              <div className="flex items-center text-xs text-slate-400 mt-1">
                {stat.trend === 'up' && <ArrowUpRight className="w-3 h-3 text-green-400 mr-1" />}
                {stat.trend === 'down' && <ArrowDownRight className="w-3 h-3 text-red-400 mr-1" />}
                <span className={stat.trend === 'up' 
                    ? 'text-green-400' 
                    : stat.trend === 'down' 
                      ? 'text-red-400' 
                      : 'text-slate-400'}>
                  {stat.change} from last week
                </span>
                {isDemoMode && <span className="text-yellow-400 ml-1">(demo)</span>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart & Watchlist */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        <div className="xl:col-span-2 bg-slate-800/50 rounded-lg p-6 backdrop-blur-sm">
          <TradingViewChart symbol="EURUSD" />
        </div>
        <div className="bg-slate-800/50 rounded-lg p-6 backdrop-blur-sm">
          <MarketWatchlist />
        </div>
      </div>

      {/* Portfolio Snapshot */}
      <div className="mt-6">
        <PortfolioSnapshot />
      </div>

      {/* Quick Actions */}
      <Card className="bg-slate-800/50 border-none backdrop-blur-sm mt-6">
        <CardHeader className="p-4">
          <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="border-none text-white hover:bg-slate-700 py-4 flex-col gap-2 text-sm"
              onClick={() => navigate('/trading')}
            >
              <TrendingUp className="w-6 h-6 text-green-400" />
              <span>Buy Order</span>
            </Button>
            <Button
              variant="outline"
              className="border-none text-white hover:bg-slate-700 py-4 flex-col gap-2 text-sm"
              onClick={() => navigate('/trading')}
            >
              <TrendingDown className="w-6 h-6 text-red-400" />
              <span>Sell Order</span>
            </Button>
            <Button
              variant="outline"
              className="border-none text-white hover:bg-slate-700 py-4 flex-col gap-2 text-sm"
              onClick={() => navigate('/my-accounts')}
            >
              <PieChart className="w-6 h-6 text-blue-400" />
              <span>Portfolio</span>
            </Button>
            <Button
              variant="outline"
              className="border-none text-white hover:bg-slate-700 py-4 flex-col gap-2 text-sm"
              onClick={() => navigate('/my-trades')}
            >
              <BarChart3 className="w-6 h-6 text-purple-400" />
              <span>Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;