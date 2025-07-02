// src/contexts/SettingsContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Settings {
  accountType: 'demo' | 'real';
  twoFactorEnabled: boolean;
  fingerprintEnabled: boolean;
  accountSuspended: boolean;
  suspensionEndDate?: Date;
  language: string;
  currency: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  accountNumber: string;
  kycStatus: string;
  realAccountBalance: number;
  realTotalTrades: number;
  realWinRate: number;
  demoAccountBalance: number;
  demoTotalTrades: number;
  demoWinRate: number;
  memberSince: string;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  switchAccountType: () => Promise<void>;
  suspendAccount: () => void;
  isDemoMode: boolean;
  getGreeting: () => string;
  getUserFullName: () => string;
  getCurrentBalance: () => number;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const defaultSettings: Settings = {
  accountType: 'demo',
  twoFactorEnabled: false,
  fingerprintEnabled: false,
  accountSuspended: false,
  language: 'en',
  currency: 'USD',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  dateOfBirth: '',
  accountNumber: 'GMC-DEMO-001234',
  kycStatus: 'verified',
  realAccountBalance: 0,
  realTotalTrades: 0,
  realWinRate: 0,
  demoAccountBalance: 50000,
  demoTotalTrades: 234,
  demoWinRate: 68.2,
  memberSince: 'January 2022'
};

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<Settings>(() => {
    // Try to load settings from localStorage
    try {
      const savedSettings = localStorage.getItem('gm-capital-settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (parsed.suspensionEndDate) {
          parsed.suspensionEndDate = new Date(parsed.suspensionEndDate);
        }
        return { ...defaultSettings, ...parsed };
      }
    } catch (e) {
      console.error('Failed to load settings from localStorage', e);
    }
    return defaultSettings;
  });

  useEffect(() => {
    // Save settings to localStorage whenever they change
    try {
      localStorage.setItem('gm-capital-settings', JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const switchAccountType = async (): Promise<void> => {
    return new Promise((resolve) => {
      // Explicitly type newType as 'demo' | 'real'
      const newType: 'demo' | 'real' = settings.accountType === 'demo' ? 'real' : 'demo';
      
      setSettings(prev => {
        const newAccountNumber = newType === 'demo' 
          ? 'GMC-DEMO-001234' 
          : 'GMC-REAL-001234';
        
        const updated = { 
          ...prev, 
          accountType: newType,
          accountNumber: newAccountNumber
        };
        
        toast({
          title: "Account Switched",
          description: `You're now using ${newType === 'demo' ? 'Demo' : 'Live'} Account`,
        });
        
        return updated;
      });
      
      resolve();
    });
  };

  const suspendAccount = () => {
    const suspensionEndDate = new Date();
    suspensionEndDate.setDate(suspensionEndDate.getDate() + 30);
    updateSettings({ 
      accountSuspended: true, 
      suspensionEndDate 
    });
    
    toast({
      title: "Account Suspended",
      description: "Your account has been suspended for 30 days",
      variant: "destructive",
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getUserFullName = () => {
    return `${settings.firstName} ${settings.lastName}`;
  };

  const getCurrentBalance = () => {
    return settings.accountType === 'demo' 
      ? settings.demoAccountBalance 
      : settings.realAccountBalance;
  };

  const isDemoMode = settings.accountType === 'demo';

  return (
    <SettingsContext.Provider value={{
      settings,
      updateSettings,
      switchAccountType,
      suspendAccount,
      isDemoMode,
      getGreeting,
      getUserFullName,
      getCurrentBalance
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};