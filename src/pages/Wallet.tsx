import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Wallet as WalletIcon, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownLeft,
  Eye,
  EyeOff,
  Plus,
  Minus,
  BarChart3
} from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { useTrading } from '@/contexts/TradingContext';

// Activity type definition
type ActivityType = 'deposit' | 'withdrawal' | 'trading' | 'profit' | 'loss';
type ActivityStatus = 'completed' | 'pending' | 'failed';

// Activity record interface
interface ActivityRecord {
  id: number;
  type: ActivityType;
  amount: number;
  description: string;
  date: string;
  status: ActivityStatus;
}

const Wallet = () => {
  const { settings, getCurrentBalance } = useSettings();
  const { getTotalPnL } = useTrading();
  const [showBalance, setShowBalance] = useState(true);
  const [activities, setActivities] = useState<ActivityRecord[]>([]);

  // Load activities from localStorage
  useEffect(() => {
    const savedActivities = localStorage.getItem('gm-capital-activity');
    if (savedActivities) {
      try {
        setActivities(JSON.parse(savedActivities));
      } catch (e) {
        console.error('Failed to load activity history');
      }
    }
  }, []);

  // Save activities to localStorage
  useEffect(() => {
    localStorage.setItem('gm-capital-activity', JSON.stringify(activities));
  }, [activities]);

  // Calculate wallet metrics
  const walletData = {
    totalBalance: getCurrentBalance(),
    unrealizedPnL: getTotalPnL(),
    availableBalance: getCurrentBalance() - Math.abs(getTotalPnL()),
    usedMargin: Math.abs(getTotalPnL()) * 0.1,
    freeMargin: getCurrentBalance() - (Math.abs(getTotalPnL()) * 0.1),
    marginLevel: getCurrentBalance() > 0 ? 
      ((getCurrentBalance() / Math.max(Math.abs(getTotalPnL()) * 0.1, 1)) * 100) : 0
  };

  // Currency data
  const currencies = [
    {
      symbol: 'USD',
      name: 'US Dollar',
      balance: walletData.totalBalance,
      percentage: 100
    }
  ];

  // Handle deposit action
  const handleDeposit = () => {
    const amount = 1000;
    const newActivity: ActivityRecord = {
      id: Date.now(),
      type: 'deposit',
      amount,
      description: 'Account deposit via Credit Card',
      date: new Date().toISOString(),
      status: 'completed'
    };
    
    setActivities(prev => [newActivity, ...prev]);
    // In a real app, you would update the balance here
  };

  // Handle withdrawal action
  const handleWithdrawal = () => {
    const amount = -500;
    const newActivity: ActivityRecord = {
      id: Date.now(),
      type: 'withdrawal',
      amount,
      description: 'Withdrawal to Bank Account',
      date: new Date().toISOString(),
      status: 'pending'
    };
    
    setActivities(prev => [newActivity, ...prev]);
    // In a real app, you would update the balance here
  };

  // Get activity icon
  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'deposit': return <ArrowUpRight className="w-5 h-5 text-green-400" />;
      case 'withdrawal': return <ArrowDownLeft className="w-5 h-5 text-red-400" />;
      case 'trading': return <BarChart3 className="w-5 h-5 text-yellow-400" />;
      case 'profit': return <TrendingUp className="w-5 h-5 text-green-400" />;
      case 'loss': return <TrendingDown className="w-5 h-5 text-red-400" />;
      default: return <DollarSign className="w-5 h-5 text-slate-400" />;
    }
  };

  // Get activity color based on amount
  const getActivityColor = (amount: number) => {
    if (amount > 0) return 'text-green-400';
    if (amount < 0) return 'text-red-400';
    return 'text-slate-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-2 sm:p-4 lg:p-6">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 pt-16 sm:pt-0">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 sm:mb-6 px-2">
          <WalletIcon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent break-words">
              My Wallet
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Manage your funds and view account balance
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowBalance(!showBalance)}
            className="border-slate-600 text-white hover:bg-slate-700"
          >
            {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </div>

        {/* Wallet Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">Total Balance</span>
                <DollarSign className="w-4 h-4 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {showBalance ? `$${walletData.totalBalance.toLocaleString()}` : '•••••••'}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {settings.accountType} Account
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">Unrealized P&L</span>
                <TrendingUp className="w-4 h-4 text-blue-400" />
              </div>
              <div className={`text-2xl font-bold ${walletData.unrealizedPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {showBalance ? 
                  `${walletData.unrealizedPnL >= 0 ? '+' : ''}$${Math.abs(walletData.unrealizedPnL).toFixed(2)}` : 
                  '•••••••'
                }
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Open Positions
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">Available Balance</span>
                <WalletIcon className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {showBalance ? `$${walletData.availableBalance.toLocaleString()}` : '•••••••'}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Free to Trade
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">Margin Level</span>
                <BarChart3 className="w-4 h-4 text-orange-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {showBalance ? `${walletData.marginLevel.toFixed(0)}%` : '•••••••'}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Risk Management
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button 
            className="bg-green-600 hover:bg-green-700 h-auto py-4 flex-col gap-2"
            onClick={handleDeposit}
          >
            <Plus className="w-6 h-6" />
            <span>Deposit</span>
          </Button>
          <Button 
            variant="outline" 
            className="border-slate-600 text-white hover:bg-slate-700 h-auto py-4 flex-col gap-2"
            onClick={handleWithdrawal}
          >
            <Minus className="w-6 h-6" />
            <span>Withdraw</span>
          </Button>
          <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-700 h-auto py-4 flex-col gap-2">
            <ArrowUpRight className="w-6 h-6" />
            <span>Transfer</span>
          </Button>
          <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-700 h-auto py-4 flex-col gap-2">
            <BarChart3 className="w-6 h-6" />
            <span>History</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Currency Breakdown */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Currency Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currencies.map((currency, index) => (
                    <div key={index} className="p-4 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">{currency.symbol}</span>
                          </div>
                          <div>
                            <div className="text-white font-medium">{currency.name}</div>
                            <div className="text-slate-400 text-sm">{currency.symbol}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-semibold">
                            {showBalance ? `$${currency.balance.toLocaleString()}` : '•••••••'}
                          </div>
                        </div>
                      </div>
                      <Progress value={currency.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {activities.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                      {getActivityIcon(activity.type)}
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium truncate">
                          {activity.description}
                        </div>
                        <div className="text-slate-400 text-xs">
                          {new Date(activity.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className={`text-sm font-semibold ${getActivityColor(activity.amount)}`}>
                        {activity.amount > 0 ? '+' : ''}${Math.abs(activity.amount).toFixed(2)}
                      </div>
                    </div>
                  ))}
                  {activities.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      No recent activity
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;