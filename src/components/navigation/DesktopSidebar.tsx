// src/components/navigation/DesktopSidebar.tsx
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  LineChart, 
  CreditCard, 
  Settings, 
  HelpCircle,
  BarChart2,
  Activity,
  BookOpen,
  Shield,
  Bell,
  User,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface DesktopSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const DesktopSidebar = ({ isCollapsed, onToggleCollapse }: DesktopSidebarProps) => {
  const location = useLocation();
  
  // Navigation items
  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/trading', icon: BarChart2, label: 'Trading' },
    { path: '/market', icon: Activity, label: 'Market' },
    { path: '/my-accounts', icon: CreditCard, label: 'Accounts' },
    { path: '/my-trades', icon: LineChart, label: 'My Trades' },
    { path: '/notifications', icon: Bell, label: 'Notifications' },
    { path: '/knowledge', icon: BookOpen, label: 'Knowledge' },
    { path: '/security', icon: Shield, label: 'Security' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <TooltipProvider delayDuration={0}>
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-slate-900 border-r border-slate-800 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Removed overflow-y-auto and scrollbar with custom styling */}
        <div className="flex-1 py-4" style={{ overflow: 'hidden' }}>
          {/* Logo */}
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-4'}`}>
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-8 h-8 rounded-lg" />
                <span className="font-bold text-white">GM Nexus</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-white"
              onClick={onToggleCollapse}
            >
              {isCollapsed ? (
                <ChevronsRight className="h-5 w-5" />
              ) : (
                <ChevronsLeft className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="mt-8">
            <ul className="space-y-1 px-2" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
              {navItems.map((item) => (
                <li key={item.path}>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.path}
                        className={`flex items-center gap-3 rounded-lg px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors ${
                          location.pathname === item.path 
                            ? 'bg-slate-800 text-white' 
                            : ''
                        } ${isCollapsed ? 'justify-center' : ''}`}
                      >
                        <item.icon className="h-5 w-5" />
                        {!isCollapsed && <span>{item.label}</span>}
                      </Link>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent side="right" className="bg-slate-800 border-slate-700 text-white">
                        {item.label}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Footer */}
        <div className={`border-t border-slate-800 p-4 ${isCollapsed ? 'text-center' : ''}`}>
          <Link
            to="/settings"
            className={`flex items-center gap-3 text-slate-400 hover:text-white ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            <HelpCircle className="h-5 w-5" />
            {!isCollapsed && <span>Help & Support</span>}
          </Link>
        </div>
      </aside>
    </TooltipProvider>
  );
};

export default DesktopSidebar;