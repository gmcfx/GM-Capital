
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Banknote, CreditCard, Smartphone, Clock, CheckCircle, AlertTriangle, Shield } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

const Withdraw = () => {
  const { settings, updateSettings } = useSettings();
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('bank');

  const withdrawalMethods = [
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: Banknote,
      fee: 'Free',
      processingTime: '1-3 Business Days',
      minAmount: 100,
      maxAmount: 50000,
      description: 'Direct transfer to your bank account'
    },
    {
      id: 'card',
      name: 'Debit Card',
      icon: CreditCard,
      fee: 'Free',
      processingTime: '2-5 Business Days',
      minAmount: 50,
      maxAmount: 10000,
      description: 'Withdraw to your registered debit card'
    },
    {
      id: 'ewallet',
      name: 'E-Wallet',
      icon: Smartphone,
      fee: 'Free',
      processingTime: '1-24 Hours',
      minAmount: 20,
      maxAmount: 5000,
      description: 'PayPal, Skrill, Neteller supported'
    }
  ];

  const recentWithdrawals = [
    {
      id: 1,
      amount: 500,
      method: 'Bank Transfer',
      status: 'completed',
      date: '2024-01-14',
      transactionId: 'WD-001234'
    },
    {
      id: 2,
      amount: 250,
      method: 'Debit Card',
      status: 'pending',
      date: '2024-01-13',
      transactionId: 'WD-001233'
    },
    {
      id: 3,
      amount: 100,
      method: 'PayPal',
      status: 'completed',
      date: '2024-01-10',
      transactionId: 'WD-001232'
    }
  ];

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (amount > 0) {
      if (settings.accountType === 'demo') {
        updateSettings({ demoAccountBalance: Math.max(0, settings.demoAccountBalance - amount) });
      } else {
        updateSettings({ realAccountBalance: Math.max(0, settings.realAccountBalance - amount) });
      }
      setWithdrawAmount('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 border-green-400';
      case 'pending': return 'text-yellow-400 border-yellow-400';
      case 'failed': return 'text-red-400 border-red-400';
      default: return 'text-slate-400 border-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'failed': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-2 sm:p-4 lg:p-6">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 pt-16 sm:pt-0">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 sm:mb-6 px-2">
          <Banknote className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent break-words">
              Withdraw Funds
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Withdraw funds from your {settings.accountType} account
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Withdrawal Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Choose Withdrawal Method</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedMethod} onValueChange={setSelectedMethod}>
                  <TabsList className="grid w-full grid-cols-3 bg-slate-700">
                    {withdrawalMethods.map((method) => (
                      <TabsTrigger
                        key={method.id}
                        value={method.id}
                        className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                      >
                        <method.icon className="w-4 h-4 mr-2" />
                        {method.name.split(' ')[0]}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {withdrawalMethods.map((method) => (
                    <TabsContent key={method.id} value={method.id} className="mt-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-slate-700/50 rounded-lg">
                          <method.icon className="w-6 h-6 text-blue-400" />
                          <div className="flex-1">
                            <h3 className="text-white font-semibold">{method.name}</h3>
                            <p className="text-slate-400 text-sm">{method.description}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                          <div className="p-3 bg-slate-700/30 rounded">
                            <div className="text-slate-400">Processing Fee</div>
                            <div className="text-white font-semibold">{method.fee}</div>
                          </div>
                          <div className="p-3 bg-slate-700/30 rounded">
                            <div className="text-slate-400">Processing Time</div>
                            <div className="text-white font-semibold">{method.processingTime}</div>
                          </div>
                          <div className="p-3 bg-slate-700/30 rounded">
                            <div className="text-slate-400">Limits</div>
                            <div className="text-white font-semibold">
                              ${method.minAmount} - ${method.maxAmount.toLocaleString()}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                              Withdrawal Amount
                            </label>
                            <div className="relative">
                              <Input
                                type="number"
                                placeholder={`Min $${method.minAmount}`}
                                value={withdrawAmount}
                                onChange={(e) => setWithdrawAmount(e.target.value)}
                                className="bg-slate-700 border-slate-600 text-white pl-8"
                              />
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">$</span>
                            </div>
                          </div>

                          <Button 
                            onClick={handleWithdraw}
                            disabled={!withdrawAmount || parseFloat(withdrawAmount) < method.minAmount}
                            className="w-full bg-red-600 hover:bg-red-700"
                          >
                            <Shield className="w-4 h-4 mr-2" />
                            Withdraw ${withdrawAmount || '0'}
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Recent Withdrawals */}
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Recent Withdrawals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentWithdrawals.map((withdrawal) => (
                    <div key={withdrawal.id} className="p-3 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-semibold">${withdrawal.amount}</span>
                        <Badge variant="outline" className={getStatusColor(withdrawal.status)}>
                          {getStatusIcon(withdrawal.status)}
                          <span className="ml-1">{withdrawal.status}</span>
                        </Badge>
                      </div>
                      <div className="text-sm text-slate-400">
                        <div>{withdrawal.method}</div>
                        <div>{withdrawal.date}</div>
                        <div className="font-mono text-xs">{withdrawal.transactionId}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-white font-semibold text-sm">Secure Withdrawals</h3>
                    <p className="text-slate-400 text-xs mt-1">
                      All withdrawals are processed securely and may require additional verification.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;
