import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  BarChart, 
  Wallet, 
  Settings, 
  User, 
  ArrowRightLeft,
  Bell
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  // Helper function to determine active link
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="sidebar h-screen w-64 fixed left-0 top-0 overflow-y-auto border-r flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
          GM Capital
        </h1>
      </div>
      
      <nav className="mt-6 flex-1">
        <ul className="space-y-2 px-4">
          {[
            { path: '/dashboard', icon: Home, label: 'Dashboard' },
            { path: '/markets', icon: BarChart, label: 'Markets' },
            { path: '/trade', icon: ArrowRightLeft, label: 'Trade' },
            { path: '/wallet', icon: Wallet, label: 'Wallet' },
            { path: '/notifications', icon: Bell, label: 'Notifications' },
            { path: '/profile', icon: User, label: 'Profile' },
            { path: '/settings', icon: Settings, label: 'Settings' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link 
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t mt-auto">
        <div className="flex items-center gap-3">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
          <div>
            <p className="font-medium">John Doe</p>
            <p className="text-xs text-muted-foreground">Premium Account</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;