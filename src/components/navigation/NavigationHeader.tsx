import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { NotificationSystem } from '../notifications/NotificationSystem';

interface NavigationHeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  showNotifications?: boolean;
}

export const NavigationHeader = ({ 
  isCollapsed, 
  onToggleCollapse, 
  showNotifications = true 
}: NavigationHeaderProps) => {
  return (
    <div className="flex h-16 shrink-0 items-center justify-between mb-6">
      {!isCollapsed && (
        <div className="flex flex-col">
          <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
            GM Capital FX
          </h1>
          <p className="text-xs text-slate-400">Trading Platform</p>
        </div>
      )}
      
      <div className="flex items-center gap-2">
        {!isCollapsed && showNotifications && <NotificationSystem />}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="text-white hover:bg-slate-700 p-1"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? 
            <ChevronRight className="w-4 h-4" /> : 
            <ChevronLeft className="w-4 h-4" />
          }
        </Button>
      </div>
    </div>
  );
};