import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Search, Download, Filter, CreditCard, ArrowRightLeft, Banknote, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'trading_fee';
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  method: string;
  date: string;
  description: string;
  fee: number;
  balance_after: number;
}

const MyTransactions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch real-time transactions from API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await fetch('/api/transactions');
        const data = await response.json();
        setTransactions(data);
      } catch (err) {
        setError('Failed to fetch transactions');
        console.error('Error fetching transactions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <CreditCard className="w-5 h-5 text-green-400" />;
      case 'withdrawal': return <Banknote className="w-5 h-5 text-red-400" />;
      case 'transfer': return <ArrowRightLeft className="w-5 h-5 text-blue-400" />;
      case 'trading_fee': return <Filter className="w-5 h-5 text-yellow-400" />;
      default: return <CreditCard className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'failed': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default: return <Clock className="w-4 h-4 text-slate-400" />;
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

  const getAmountColor = (type: string) => {
    switch (type) {
      case 'deposit': return 'text-green-400';
      case 'withdrawal': return 'text-red-400';
      case 'transfer': return 'text-blue-400';
      case 'trading_fee': return 'text-yellow-400';
      default: return 'text-slate-400';
    }
  };

  const getAmountPrefix = (type: string) => {
    switch (type) {
      case 'deposit': return '+';
      case 'withdrawal': return '-';
      case 'transfer': return '↔';
      case 'trading_fee': return '-';
      default: return '';
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.method.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || tx.type === filterType;
    const matchesStatus = filterStatus === 'all' || tx.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalDeposits = transactions.filter(tx => tx.type === 'deposit' && tx.status === 'completed')
    .reduce((sum, tx) => sum + tx.amount, 0);
  
  const totalWithdrawals = transactions.filter(tx => tx.type === 'withdrawal' && tx.status === 'completed')
    .reduce((sum, tx) => sum + tx.amount, 0);
  
  const totalFees = transactions.filter(tx => tx.status === 'completed')
    .reduce((sum, tx) => sum + tx.fee, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading transactions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center p-6 bg-slate-800/50 rounded-lg">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">Error loading transactions</h3>
          <p className="text-slate-400 mb-4">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-2 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 pt-16 sm:pt-0">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 sm:mb-6 px-2">
          <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent break-words">
              My Transactions
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Complete history of your account activities
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-sm text-slate-400">Total Deposits</div>
              <div className="text-xl font-bold text-green-400">${totalDeposits.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-sm text-slate-400">Total Withdrawals</div>
              <div className="text-xl font-bold text-red-400">${totalWithdrawals.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-sm text-slate-400">Total Fees</div>
              <div className="text-xl font-bold text-yellow-400">${totalFees.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-sm text-slate-400">Net Flow</div>
              <div className={`text-xl font-bold ${totalDeposits - totalWithdrawals >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${(totalDeposits - totalWithdrawals).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white pl-10"
                />
              </div>
              
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Transaction Type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="all" className="text-white">All Types</SelectItem>
                  <SelectItem value="deposit" className="text-white">Deposits</SelectItem>
                  <SelectItem value="withdrawal" className="text-white">Withdrawals</SelectItem>
                  <SelectItem value="transfer" className="text-white">Transfers</SelectItem>
                  <SelectItem value="trading_fee" className="text-white">Trading Fees</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="all" className="text-white">All Status</SelectItem>
                  <SelectItem value="completed" className="text-white">Completed</SelectItem>
                  <SelectItem value="pending" className="text-white">Pending</SelectItem>
                  <SelectItem value="failed" className="text-white">Failed</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-700">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <div className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No transactions found</h3>
                <p className="text-slate-400">
                  Try adjusting your search criteria or filters
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredTransactions.map((transaction) => (
              <Card key={transaction.id} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getTypeIcon(transaction.type)}
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-semibold">{transaction.id}</span>
                          <Badge variant="outline" className={getStatusColor(transaction.status)}>
                            {getStatusIcon(transaction.status)}
                            <span className="ml-1">{transaction.status}</span>
                          </Badge>
                        </div>
                        <div className="text-sm text-slate-300 mb-1">{transaction.description}</div>
                        <div className="text-xs text-slate-400">
                          {transaction.method} • {new Date(transaction.date).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`text-lg font-bold ${getAmountColor(transaction.type)}`}>
                        {getAmountPrefix(transaction.type)}${transaction.amount.toLocaleString()}
                      </div>
                      {transaction.fee > 0 && (
                        <div className="text-sm text-slate-400">
                          Fee: ${transaction.fee.toFixed(2)}
                        </div>
                      )}
                      <div className="text-xs text-slate-500">
                        Balance: ${transaction.balance_after.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTransactions;