import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, Eye, EyeOff } from 'lucide-react'; // Removed unused icons
import { useSettings } from '@/contexts/SettingsContext';
import { useTrading } from '@/contexts/TradingContext';
import { useUser } from '@/contexts/UserContext';
import { database } from '@/integrations/firebase/firebaseConfig';
import { ref, onValue, update } from 'firebase/database';
import { Account } from '@/integrations/firebase/types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

// Fixed: Make account_type required with default value
interface ExtendedAccount extends Omit<Account, 'account_number'> {
  account_number: string;
  account_type: "demo" | "standard" | "premium"; // Removed optional flag
  status?: string;
  win_rate?: number;
  total_trades?: number;
  best_trade?: number;
  worst_trade?: number;
  server_location?: string;
  leverage?: string;
}

const MyAccounts = () => {
  const { settings, updateSettings } = useSettings();
  const { getTotalPnL, getActivePositionsCount } = useTrading();
  const { user } = useUser();
  const { toast } = useToast();
  const [showBalance, setShowBalance] = useState(true);
  const [accounts, setAccounts] = useState<ExtendedAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const activeAccountId = (settings as { activeAccountId?: string }).activeAccountId || accounts[0]?.id || '';

  // Fetch accounts from Firebase Realtime DB
  useEffect(() => {
    if (!user?.uid) return;
    
    setLoading(true);
    const accountsRef = ref(database, `users/${user.uid}/accounts`);
    
    const unsubscribe = onValue(accountsRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          const accountsArray: ExtendedAccount[] = Object.keys(data).map(key => ({
            id: key,
            account_number: data[key].account_number || 'N/A',
            // FIX: Provide default value for account_type
            account_type: data[key].account_type || 'demo',
            ...data[key]
          }));
          setAccounts(accountsArray);
        } else {
          setAccounts([]);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load accounts');
        setLoading(false);
        console.error('Error fetching accounts:', err);
      }
    }, (error) => {
      setError('Failed to connect to database');
      setLoading(false);
      console.error('Firebase connection error:', error);
    });

    return () => unsubscribe();
  }, [user]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Account number copied to clipboard",
      duration: 2000,
    });
  };

  const handleSwitchAccount = async (accountId: string) => {
    if (!user?.uid) return;
    
    try {
      await update(ref(database, `users/${user.uid}/settings`), {
        activeAccountId: accountId
      });
      
      updateSettings({ activeAccountId: accountId } as any);
      
      toast({
        title: "Account Switched",
        description: "Your active account has been updated",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Switch Failed",
        description: "Failed to switch accounts",
        variant: "destructive",
        duration: 3000,
      });
      console.error('Error switching account:', error);
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4">
        <div className="max-w-6xl mx-auto space-y-6 pt-16">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-12 w-48" />
          </div>
          
          <Tabs defaultValue="demo">
            <TabsList className="grid grid-cols-2 bg-slate-800 border-slate-700">
              <TabsTrigger value="demo">
                <Skeleton className="h-5 w-24" />
              </TabsTrigger>
              <TabsTrigger value="real">
                <Skeleton className="h-5 w-24" />
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="demo" className="mt-6">
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex justify-between">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="p-4 bg-slate-700/50 rounded-lg">
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-3 w-16 mt-1" />
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="space-y-4">
                        <Skeleton className="h-6 w-40" />
                        <div className="space-y-2">
                          {[...Array(4)].map((_, j) => (
                            <div key={j} className="p-2 bg-slate-700/30 rounded">
                              <Skeleton className="h-4 w-full" />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-6">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-10 w-48" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 flex items-center justify-center">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm max-w-md">
          <CardHeader>
            <CardTitle className="text-white">Account Error</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-red-400 text-xl mb-4">{error}</div>
              <p className="text-slate-400 mb-6">
                Failed to load your accounts. Please try again later.
              </p>
              <Button 
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 flex items-center justify-center">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm max-w-md">
          <CardHeader>
            <CardTitle className="text-white">No Accounts Found</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto bg-blue-400/20 rounded-full flex items-center justify-center mb-4">
                <div className="w-8 h-8 bg-blue-400 rounded-full" />
              </div>
              <p className="text-slate-400 mb-6">
                You don't have any trading accounts yet.
              </p>
              <Button 
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Create New Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-2 sm:p-4 lg:p-6">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 pt-16 sm:pt-0">
        {/* Header with User Profile */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6 px-2">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-400/20 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-400 rounded-full" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                My Accounts
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Manage your trading accounts and preferences
              </p>
            </div>
          </div>
          
          {/* User Profile Section */}
          {user && (
            <div className="flex items-center gap-3 bg-slate-800/50 rounded-lg px-4 py-2 border border-slate-700">
              <div className="bg-blue-500/20 p-2 rounded-full">
                <div className="w-5 h-5 bg-blue-400 rounded-full" />
              </div>
              <div className="text-right">
                <div className="font-medium text-white">
                  {user.name || user.email?.split('@')[0]}
                </div>
                <div className="text-xs text-slate-400 truncate max-w-[160px]">
                  {user.email}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Account Tabs */}
        <Tabs defaultValue={activeAccountId} className="w-full">
          <TabsList className="flex overflow-x-auto bg-slate-800 border-slate-700">
            {accounts.map((account) => (
              <TabsTrigger 
                key={account.id} 
                value={account.id} 
                className="flex-1 min-w-[120px] data-[state=active]:bg-blue-600 data-[state=active]:text-white whitespace-nowrap"
              >
                {account.account_type === 'demo' ? 'Demo Account' : 'Live Account'}
              </TabsTrigger>
            ))}
          </TabsList>

          {accounts.map((account) => {
            const accountType = account.account_type;
            
            return (
              <TabsContent key={account.id} value={account.id} className="space-y-6">
                {/* Account Overview */}
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-400" />
                        {accountType === 'demo' ? 'Demo Account' : 'Live Account'}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-green-400 border-green-400">
                          {(account.status || 'Active').charAt(0).toUpperCase() + (account.status || 'Active').slice(1)}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowBalance(!showBalance)}
                          className="border-slate-600 text-white hover:bg-slate-700"
                        >
                          {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="p-4 bg-slate-700/50 rounded-lg">
                        <div className="text-sm text-slate-400">Account Balance</div>
                        <div className="text-2xl font-bold text-white">
                          {showBalance ? `${account.currency}${account.balance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '•••••••'}
                        </div>
                        <div className="text-xs text-slate-500">{account.currency}</div>
                      </div>
                      <div className="p-4 bg-slate-700/50 rounded-lg">
                        <div className="text-sm text-slate-400">Unrealized P&L</div>
                        <div className={`text-2xl font-bold ${getTotalPnL() >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {showBalance ? `${getTotalPnL() >= 0 ? '+' : ''}${account.currency}${Math.abs(getTotalPnL()).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '•••••••'}
                        </div>
                        <div className="text-xs text-slate-500">Live P&L</div>
                      </div>
                      <div className="p-4 bg-slate-700/50 rounded-lg">
                        <div className="text-sm text-slate-400">Active Positions</div>
                        <div className="text-2xl font-bold text-blue-400">{getActivePositionsCount()}</div>
                        <div className="text-xs text-slate-500">Open Trades</div>
                      </div>
                      <div className="p-4 bg-slate-700/50 rounded-lg">
                        <div className="text-sm text-slate-400">Win Rate</div>
                        <div className="text-2xl font-bold text-purple-400">
                          {(account.win_rate || 0).toLocaleString(undefined, { maximumFractionDigits: 1 })}%
                        </div>
                        <div className="text-xs text-slate-500">
                          {(account.total_trades || 0).toLocaleString()} Trades
                        </div>
                      </div>
                    </div>

                    {/* Account Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Account Details</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center p-2 bg-slate-700/30 rounded">
                            <span className="text-slate-400">Account Number</span>
                            <div className="flex items-center gap-2">
                              <span className="text-white font-mono">{account.account_number}</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(account.account_number)}
                                className="text-slate-400 hover:text-white p-1"
                              >
                                <div className="w-3 h-3 bg-slate-400" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-slate-700/30 rounded">
                            <span className="text-slate-400">Account Type</span>
                            <span className="text-white">{account.account_type}</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-slate-700/30 rounded">
                            <span className="text-slate-400">Leverage</span>
                            <span className="text-white">{account.leverage || '1:100'}</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-slate-700/30 rounded">
                            <span className="text-slate-400">Server</span>
                            <span className="text-white">{account.server_location || 'New York'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Trading Statistics</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center p-2 bg-slate-700/30 rounded">
                            <span className="text-slate-400">Total Trades</span>
                            <span className="text-white">{(account.total_trades || 0).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-slate-700/30 rounded">
                            <span className="text-slate-400">Win Rate</span>
                            <span className="text-white">{(account.win_rate || 0).toLocaleString(undefined, { maximumFractionDigits: 1 })}%</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-slate-700/30 rounded">
                            <span className="text-slate-400">Best Trade</span>
                            <span className="text-green-400">+{account.currency}{(account.best_trade || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-slate-700/30 rounded">
                            <span className="text-slate-400">Worst Trade</span>
                            <span className="text-red-400">-{account.currency}{Math.abs(account.worst_trade || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 mt-6">
                      {account.id !== activeAccountId && (
                        <Button 
                          onClick={() => handleSwitchAccount(account.id)} 
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Switch to {accountType === 'demo' ? 'Demo' : 'Live'} Account
                        </Button>
                      )}
                      <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-700">
                        <div className="w-4 h-4 bg-slate-400 mr-2" />
                        Account Settings
                      </Button>
                      <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-700">
                        <div className="w-4 h-4 bg-slate-400 mr-2" />
                        Performance Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
};

export default MyAccounts;