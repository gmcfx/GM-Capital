
import { NavLink } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface NavigationItem {
  label: string;
  icon: LucideIcon;
  path: string;
}

interface NavigationItemsProps {
  items: NavigationItem[];
  showLabel?: boolean;
  onItemClick?: () => void;
}

export const NavigationItems = ({ 
  items, 
  showLabel = true, 
  onItemClick 
}: NavigationItemsProps) => {
  return (
    <ul className="space-y-1">
      {items.map((item) => (
        <li key={item.label}>
          <NavLink
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md p-2 text-sm font-medium hover:bg-slate-800 transition-colors ${
                isActive ? 'bg-blue-600 text-white' : 'text-slate-400'
              }`
            }
            onClick={onItemClick}
            title={item.label}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {showLabel && <span className="truncate">{item.label}</span>}
          </NavLink>
        </li>
      ))}
    </ul>
  );
};
