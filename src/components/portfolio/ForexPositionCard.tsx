import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';

// Export the ForexPosition interface
export interface ForexPosition {
  id: string;
  symbol: string;
  volume: number;
  value: number;
  pnl: number;
  pnlPercent: number;
  position_type: 'long' | 'short';
  status: 'open' | 'closed' | 'pending';
}

interface ForexPositionCardProps {
  position: ForexPosition;
  onModify?: (id: string) => void;
  onClose?: (id: string) => void;
}

const ForexPositionCard = ({ position, onModify, onClose }: ForexPositionCardProps) => {
  const { convertCurrency } = useCurrency();

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              position.position_type === 'long' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {position.position_type === 'long' ? 
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" /> : 
                <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5" />
              }
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-white text-sm sm:text-lg truncate">
                {position.symbol}
              </CardTitle>
              <div className="flex items-center gap-2">
                <p className="text-slate-400 text-xs sm:text-sm capitalize">
                  {position.position_type} Position
                </p>
                <Badge 
                  variant="outline" 
                  className={`text-[10px] px-1.5 py-0.5 ${
                    position.status === 'open' ? 'text-green-400 border-green-400' : 
                    position.status === 'closed' ? 'text-gray-400 border-gray-400' : 
                    'text-yellow-400 border-yellow-400'
                  }`}
                >
                  {position.status}
                </Badge>
              </div>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={`text-xs flex-shrink-0 ${position.pnl >= 0 ? 'text-green-400 border-green-400' : 'text-red-400 border-red-400'}`}
          >
            {position.pnl >= 0 ? '+' : ''}{convertCurrency(position.pnl)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-slate-400 text-xs sm:text-sm">Volume (Lots)</p>
            <p className="text-white font-medium text-xs sm:text-sm">
              {position.volume.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-xs sm:text-sm">Position Value</p>
            <p className="text-white font-medium text-xs sm:text-sm truncate">
              {convertCurrency(position.value)}
            </p>
          </div>
        </div>
        
        <div className="bg-slate-900/50 p-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-xs sm:text-sm">Profit & Loss</span>
            <div className="text-right">
              <p className={`font-medium text-xs sm:text-sm ${position.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {position.pnl >= 0 ? '+' : ''}{convertCurrency(position.pnl)}
              </p>
              <p className={`text-xs ${position.pnlPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {position.pnlPercent >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
        
        {position.status === 'open' && (
          <div className="grid grid-cols-2 gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="border-slate-600 text-white hover:bg-slate-700 text-xs"
              onClick={() => onModify?.(position.id)}
            >
              Modify
            </Button>
            <Button 
              size="sm" 
              variant="destructive" 
              className="bg-red-600 hover:bg-red-700 text-xs"
              onClick={() => onClose?.(position.id)}
            >
              Close Position
            </Button>
          </div>
        )}
        
        {position.status === 'pending' && (
          <div className="grid grid-cols-2 gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="border-slate-600 text-white hover:bg-slate-700 text-xs col-span-2"
              onClick={() => onModify?.(position.id)}
            >
              Modify Pending Order
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ForexPositionCard;