import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightLeft, ArrowRight, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

// Account data constant
const ACCOUNT_DATA = {
  demo: { 
    name: 'Demo Account', 
    number: 'GMC-DEMO-001234' 
  },
  real: { 
    name: 'Live Account', 
    number: 'GMC-REAL-001234' 
  }
};

// Transfer status types
type TransferStatus = 'completed' | 'pending' | 'failed';

// Transfer record type
interface TransferRecord {
  id: number;
  amount: number;
  from: string;
  to: string;
  status: TransferStatus;
  date: string;
  transactionId: string;
}

const Transfer = () => {
  const { settings, updateSettings } = useSettings();
  const [transferAmount, setTransferAmount] = useState('');
  const [fromAccount, setFromAccount] = useState('demo');
  const [toAccount, setToAccount] = useState('real');
  const [transfers, setTransfers] = useState<TransferRecord[]>([]);

  // Load transfers from localStorage on mount
  useEffect(() => {
    const savedTransfers = localStorage.getItem('gm-capital-transfers');
    if (savedTransfers) {
      try {
        setTransfers(JSON.parse(savedTransfers));
      } catch (e) {
        console.error('Failed to parse transfers from localStorage');
      }
    }
  }, []);

  // Save transfers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('gm-capital-transfers', JSON.stringify(transfers));
  }, [transfers]);

  const accounts = [
    { 
      id: 'demo', 
      ...ACCOUNT_DATA.demo,
      balance: settings.demoAccountBalance,
    },
    { 
      id: 'real', 
      ...ACCOUNT_DATA.real,
      balance: settings.realAccountBalance,
    }
  ];

  const handleTransfer = () => {
    const amount = parseFloat(transferAmount);
    const currentFromBalance = fromAccount === 'demo' 
      ? settings.demoAccountBalance 
      : settings.realAccountBalance;
    
    if (amount > 0 && amount <= currentFromBalance) {
      // Update account balances
      if (fromAccount === 'demo' && toAccount === 'real') {
        updateSettings({ 
          demoAccountBalance: settings.demoAccountBalance - amount,
          realAccountBalance: settings.realAccountBalance + amount
        });
      } else if (fromAccount === 'real' && toAccount === 'demo') {
        updateSettings({ 
          realAccountBalance: settings.realAccountBalance - amount,
          demoAccountBalance: settings.demoAccountBalance + amount
        });
      }

      // Create transfer record
      const newTransfer: TransferRecord = {
        id: Date.now(),
        amount,
        from: ACCOUNT_DATA[fromAccount as keyof typeof ACCOUNT_DATA].name,
        to: ACCOUNT_DATA[toAccount as keyof typeof ACCOUNT_DATA].name,
        status: 'completed',
        date: new Date().toISOString().split('T')[0],
        transactionId: `TRF-${Date.now().toString().slice(-6)}`
      };

      // Update transfers state (newest first)
      setTransfers(prev => [newTransfer, ...prev]);
      setTransferAmount('');
    }
  };

  const getStatusColor = (status: TransferStatus) => {
    switch (status) {
      case 'completed': return 'text-green-400 border-green-400';
      case 'pending': return 'text-yellow-400 border-yellow-400';
      case 'failed': return 'text-red-400 border-red-400';
      default: return 'text-slate-400 border-slate-400';
    }
  };

  const getStatusIcon = (status: TransferStatus) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'failed': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const fromAccountData = accounts.find(acc => acc.id === fromAccount);
  const toAccountData = accounts.find(acc => acc.id === toAccount);
  const maxTransferAmount = fromAccountData?.balance || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-2 sm:p-4 lg:p-6">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 pt-16 sm:pt-0">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 sm:mb-6 px-2">
          <ArrowRightLeft className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent break-words">
              Transfer Funds
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Transfer funds between your accounts
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Transfer Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Account Transfer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Account Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300">From Account</label>
                    <Select value={fromAccount} onValueChange={setFromAccount}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        {accounts.filter(acc => acc.id !== toAccount).map((account) => (
                          <SelectItem key={account.id} value={account.id} className="text-white">
                            <div className="flex flex-col">
                              <span>{account.name}</span>
                              <span className="text-xs text-slate-400">Balance: ${account.balance.toLocaleString()}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fromAccountData && (
                      <div className="p-3 bg-slate-700/50 rounded">
                        <div className="text-sm text-slate-400">{fromAccountData.number}</div>
                        <div className="text-white font-semibold">${fromAccountData.balance.toLocaleString()}</div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300">To Account</label>
                    <Select value={toAccount} onValueChange={setToAccount}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        {accounts.filter(acc => acc.id !== fromAccount).map((account) => (
                          <SelectItem key={account.id} value={account.id} className="text-white">
                            <div className="flex flex-col">
                              <span>{account.name}</span>
                              <span className="text-xs text-slate-400">Balance: ${account.balance.toLocaleString()}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {toAccountData && (
                      <div className="p-3 bg-slate-700/50 rounded">
                        <div className="text-sm text-slate-400">{toAccountData.number}</div>
                        <div className="text-white font-semibold">${toAccountData.balance.toLocaleString()}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Transfer Arrow */}
                <div className="flex justify-center">
                  <div className="p-3 bg-blue-600 rounded-full">
                    <ArrowRight className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Amount Input */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Transfer Amount
                    </label>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white pl-8"
                        max={maxTransferAmount}
                      />
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">$</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Available: ${maxTransferAmount.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {[100, 500, 1000, 5000].map((amount) => (
                      <Button
                        key={amount}
                        size="sm"
                        variant="outline"
                        onClick={() => setTransferAmount(Math.min(amount, maxTransferAmount).toString())}
                        disabled={amount > maxTransferAmount}
                        className="border-slate-600 text-white hover:bg-slate-700"
                      >
                        ${amount}
                      </Button>
                    ))}
                  </div>

                  <Button 
                    onClick={handleTransfer}
                    disabled={!transferAmount || parseFloat(transferAmount) <= 0 || parseFloat(transferAmount) > maxTransferAmount}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <ArrowRightLeft className="w-4 h-4 mr-2" />
                    Transfer ${transferAmount || '0'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transfers */}
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Recent Transfers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transfers.slice(0, 3).map((transfer) => (
                    <div key={transfer.id} className="p-3 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-semibold">${transfer.amount.toLocaleString()}</span>
                        <Badge variant="outline" className={getStatusColor(transfer.status)}>
                          {getStatusIcon(transfer.status)}
                          <span className="ml-1 capitalize">{transfer.status}</span>
                        </Badge>
                      </div>
                      <div className="text-sm text-slate-400">
                        <div className="flex items-center gap-2">
                          <span>{transfer.from}</span>
                          <ArrowRight className="w-3 h-3" />
                          <span>{transfer.to}</span>
                        </div>
                        <div>{transfer.date}</div>
                        <div className="font-mono text-xs">{transfer.transactionId}</div>
                      </div>
                    </div>
                  ))}
                  {transfers.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      No transfer history
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

export default Transfer;