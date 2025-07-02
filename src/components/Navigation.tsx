// src/components/Navigation.tsx
import { useState } from 'react';
import MobileNavigation from './navigation/MobileNavigation';
import DesktopSidebar from './navigation/DesktopSidebar';

interface NavigationProps {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

const Navigation = ({ isSidebarCollapsed, toggleSidebar }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <MobileNavigation 
        isOpen={isMobileMenuOpen} 
        onOpenChange={setIsMobileMenuOpen} 
      />
      <DesktopSidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggleCollapse={toggleSidebar} 
      />
    </>
  );
};

export default Navigation;