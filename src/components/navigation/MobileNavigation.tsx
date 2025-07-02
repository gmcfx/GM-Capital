import { 
  Home, 
  BarChart, 
  Wallet, 
  Settings, 
  User, 
  ArrowRightLeft,
  Bell,
  X,
  Menu
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

interface MobileNavigationProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const MobileNavigation = ({ isOpen, onOpenChange }: MobileNavigationProps) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-400 hover:text-white fixed top-4 left-4 z-50"
          >
            <Menu className="w-6 h-6" />
          </Button>
        </SheetTrigger>
        
        <SheetContent 
          side="left" 
          className="bg-slate-900 border-r border-slate-800 w-64 p-0"
        >
          <div className="flex items-center justify-between p-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-8 h-8 rounded-lg" />
              <span className="font-bold text-white">GM Nexus</span>
            </div>
            <SheetClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </SheetClose>
          </div>
          
          <nav className="py-4">
            <ul className="space-y-1 px-2">
              {[
                { path: '/dashboard', icon: Home, label: 'Dashboard' },
                { path: '/market', icon: BarChart, label: 'Market' },
                { path: '/trading', icon: ArrowRightLeft, label: 'Trade' },
                { path: '/wallet', icon: Wallet, label: 'Wallet' },
                { path: '/notifications', icon: Bell, label: 'Notifications' },
                { path: '/profile', icon: User, label: 'Profile' },
                { path: '/settings', icon: Settings, label: 'Settings' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <SheetClose asChild>
                      <Link 
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive(item.path)
                            ? 'bg-blue-600/20 text-blue-400'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </Link>
                    </SheetClose>
                  </li>
                );
              })}
            </ul>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavigation;