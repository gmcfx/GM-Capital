import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

// Define the interface separately and export it
export interface CryptoWallet {
  id: string;
  symbol: string;
  name: string;
  balance: number;
  value: number;
  change_24h: number;
  address: string;
}

// Define props using the interface
interface CryptoWalletCardProps {
  wallet: CryptoWallet;
}

// Default export the component
const CryptoWalletCard = ({ wallet }: CryptoWalletCardProps) => {
  const isPositive = wallet.change_24h >= 0;
  const changeColor = isPositive ? 'text-green-400' : 'text-red-400';
  const ChangeIcon = isPositive ? ArrowUpRight : ArrowDownRight;

  return (
    <Card className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700/50 transition-colors">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <div className="bg-slate-700 p-2 rounded-lg">
              <img 
                src={`https://cryptoicon-api.vercel.app/api/icon/${wallet.symbol.toLowerCase()}`} 
                alt={wallet.name} 
                className="w-6 h-6"
                onError={(e) => {
                  e.currentTarget.src = '/crypto-fallback.svg';
                }}
              />
            </div>
            <div>
              <h3 className="text-white">{wallet.name}</h3>
              <p className="text-xs text-slate-400">{wallet.symbol}</p>
            </div>
          </CardTitle>
          <span className={`flex items-center ${changeColor} text-sm font-medium`}>
            <ChangeIcon className="w-4 h-4" />
            {Math.abs(wallet.change_24h).toFixed(2)}%
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Balance:</span>
            <span className="text-white">{wallet.balance.toFixed(6)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Value:</span>
            <span className="text-white">${wallet.value.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs mt-2">
            <span className="text-slate-500 truncate max-w-[70%]">
              {wallet.address}
            </span>
            <button className="text-blue-400 hover:text-blue-300 text-xs font-medium">
              View
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CryptoWalletCard;