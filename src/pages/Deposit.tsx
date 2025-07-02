import { useState, useEffect } from 'react';
import { usePayment } from '@/contexts/PaymentContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import QRCode from 'react-qr-code';

const Deposit = () => {
  const { initPayment, checkPaymentStatus, fetchCurrencies, currencies, isLoading } = usePayment();
  const [amount, setAmount] = useState(50);
  const [currency, setCurrency] = useState('btc');
  const [activePayment, setActivePayment] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'confirmed' | 'failed'>('pending');
  const [statusLoading, setStatusLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const handleDeposit = async () => {
    try {
      const payment = await initPayment(amount, currency);
      setActivePayment(payment);
      setPaymentStatus('pending');
      
      toast({
        title: "Payment Initialized",
        description: "Please send your cryptocurrency to the provided address",
      });
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Could not initialize payment",
        variant: "destructive",
      });
    }
  };

  const handleCheckStatus = async () => {
    if (!activePayment) return;
    
    setStatusLoading(true);
    try {
      const status = await checkPaymentStatus(activePayment.payment_id);
      setPaymentStatus(status.payment_status);
      
      if (status.payment_status === 'confirmed') {
        toast({
          title: "Payment Confirmed!",
          description: `Your deposit of ${amount} USD has been received`,
        });
      }
    } catch (error) {
      toast({
        title: "Status Check Failed",
        description: "Could not verify payment status",
        variant: "destructive",
      });
    } finally {
      setStatusLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-2 sm:p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-8 h-8 rounded-full flex items-center justify-center">
            <span className="text-lg font-bold text-white">$</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Deposit Funds</h1>
            <p className="text-sm text-slate-400">Add funds to your trading account</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle>Deposit with Crypto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-300 mb-2">Amount (USD)</label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    min="10"
                    max="10000"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-slate-300 mb-2">Cryptocurrency</label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {currencies.map((curr) => (
                        <SelectItem key={curr} value={curr} className="hover:bg-slate-700">
                          {curr.toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button
                  onClick={handleDeposit}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Generate Payment'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {activePayment && (
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle>Payment Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col items-center">
                    <QRCode 
                      value={activePayment.pay_address} 
                      size={128} 
                      className="mb-4 p-2 bg-white rounded-lg"
                    />
                    <p className="text-sm text-slate-400 mb-2">
                      Scan QR code or send {activePayment.pay_amount} {currency.toUpperCase()} to:
                    </p>
                    <div className="bg-slate-700 px-3 py-2 rounded-lg mb-4 w-full text-center overflow-x-auto">
                      <code className="text-sm">{activePayment.pay_address}</code>
                    </div>
                    <p className="text-xs text-slate-500">
                      Payment ID: {activePayment.payment_id}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {paymentStatus === 'pending' ? (
                        <Loader2 className="mr-2 h-5 w-5 text-yellow-500 animate-spin" />
                      ) : paymentStatus === 'confirmed' ? (
                        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="mr-2 h-5 w-5 text-red-500" />
                      )}
                      <span className="capitalize">
                        {paymentStatus === 'confirmed' ? 'Payment Completed' : paymentStatus}
                      </span>
                    </div>
                    
                    <Button
                      onClick={handleCheckStatus}
                      disabled={statusLoading}
                      variant="outline"
                      className="border-slate-600 text-white hover:bg-slate-700"
                    >
                      {statusLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Check Status
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {!activePayment && (
          <Card className="mt-6 bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle>Deposit Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-700/50 rounded-lg">
                  <div className="text-lg font-semibold mb-2">Cryptocurrency</div>
                  <p className="text-sm text-slate-400">
                    Instant deposits using 50+ cryptocurrencies
                  </p>
                </div>
                <div className="p-4 bg-slate-700/50 rounded-lg">
                  <div className="text-lg font-semibold mb-2">Bank Transfer</div>
                  <p className="text-sm text-slate-400">
                    International bank transfers (1-3 business days)
                  </p>
                </div>
                <div className="p-4 bg-slate-700/50 rounded-lg">
                  <div className="text-lg font-semibold mb-2">Credit Card</div>
                  <p className="text-sm text-slate-400">
                    Visa, Mastercard, and other cards (instant)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Deposit;