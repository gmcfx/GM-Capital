import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Verified } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Import Button component

interface AccountStatisticsProps {
  isDemoMode: boolean;
  currentBalance: number;
  currentTrades: number;
  currentWinRate: number;
  accountType: string;
  kycStatus: string;
  twoFactorEnabled: boolean;
  // Add the missing prop
  onAccountSwitch: () => Promise<void>;
}

const AccountStatistics: React.FC<AccountStatisticsProps> = ({
  isDemoMode,
  currentBalance,
  currentTrades,
  currentWinRate,
  accountType,
  kycStatus,
  twoFactorEnabled,
  onAccountSwitch // Add the new prop
}) => {
  // Safely handle potential undefined values
  const safeBalance = currentBalance || 0;
  const safeTrades = currentTrades || 0;
  const safeWinRate = currentWinRate || 0;

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-400" />
          Account Statistics {isDemoMode && <Badge variant="outline" className="text-yellow-400 border-yellow-400">DEMO</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-900/50 p-4 rounded-lg">
            <p className="text-slate-400 text-sm">Account Balance</p>
            <p className="text-2xl font-bold text-green-400">
              ${safeBalance.toLocaleString()}
            </p>
            {isDemoMode && <p className="text-xs text-yellow-400 mt-1">Demo funds</p>}
            {!isDemoMode && safeBalance === 0 && <p className="text-xs text-slate-400 mt-1">No funds deposited</p>}
          </div>
          <div className="bg-slate-900/50 p-4 rounded-lg">
            <p className="text-slate-400 text-sm">Total Trades</p>
            <p className="text-2xl font-bold text-blue-400">
              {safeTrades.toLocaleString()}
            </p>
            {isDemoMode && <p className="text-xs text-yellow-400 mt-1">Demo trades</p>}
          </div>
        </div>
        
        <div className="bg-slate-900/50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <p className="text-slate-400 text-sm">Win Rate</p>
            <p className="text-green-400 font-medium">{safeWinRate}%</p>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-green-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${safeWinRate}%` }}
            ></div>
          </div>
          {isDemoMode && <p className="text-xs text-yellow-400 mt-1">Demo performance</p>}
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Account Type</span>
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className={`${
                  isDemoMode 
                    ? 'text-yellow-400 border-yellow-400' 
                    : 'text-blue-400 border-blue-400'
                }`}
              >
                {accountType.toUpperCase()} ACCOUNT
              </Badge>
              <Button
                onClick={onAccountSwitch}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                Switch
              </Button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">KYC Status</span>
            <Badge 
              variant="outline" 
              className="text-green-400 border-green-400"
            >
              <Verified className="w-3 h-3 mr-1" />
              {kycStatus.toUpperCase()}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">2FA Enabled</span>
            <Badge 
              variant="outline" 
              className={`${
                twoFactorEnabled 
                  ? 'text-green-400 border-green-400' 
                  : 'text-red-400 border-red-400'
              }`}
            >
              {twoFactorEnabled ? 'ENABLED' : 'DISABLED'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountStatistics;