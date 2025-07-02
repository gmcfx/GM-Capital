
import React, { createContext, useContext, useState, useEffect } from 'react';

interface CurrencyContextType {
  currency: string;
  setCurrency: (currency: string) => void;
  convertCurrency: (amount: number) => string;
  formatCurrency: (amount: number) => string;
  availableCurrencies: { code: string; name: string; symbol: string; flag: string }[];
  exchangeRates: Record<string, number>;
}

const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', flag: '🇩🇰' },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', flag: '🇵🇱' },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', flag: '🇨🇿' },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', flag: '🇭🇺' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', flag: '🇷🇺' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦' },
  // Add more currencies up to 50...
];

// Mock exchange rates - in real app, these would come from an API
const mockExchangeRates: Record<string, number> = {
  USD: 1.0,
  EUR: 0.85,
  GBP: 0.73,
  JPY: 110.0,
  CAD: 1.25,
  AUD: 1.35,
  CHF: 0.92,
  SGD: 1.35,
  CNY: 6.45,
  HKD: 7.8,
  NZD: 1.42,
  SEK: 8.5,
  NOK: 8.8,
  DKK: 6.3,
  PLN: 3.9,
  CZK: 21.5,
  HUF: 295.0,
  RUB: 75.0,
  TRY: 8.5,
  ZAR: 14.5,
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState('USD');
  const [exchangeRates, setExchangeRates] = useState(mockExchangeRates);

  useEffect(() => {
    const savedCurrency = localStorage.getItem('gm-capital-currency');
    if (savedCurrency && currencies.find(c => c.code === savedCurrency)) {
      setCurrency(savedCurrency);
    }
  }, []);

  // Simulate real-time rate updates
  useEffect(() => {
    const interval = setInterval(() => {
      setExchangeRates(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          if (key !== 'USD') {
            updated[key] = updated[key] * (1 + (Math.random() - 0.5) * 0.001);
          }
        });
        return updated;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSetCurrency = (newCurrency: string) => {
    setCurrency(newCurrency);
    localStorage.setItem('gm-capital-currency', newCurrency);
  };

  const convertCurrency = (amount: number): string => {
    const rate = exchangeRates[currency] || 1;
    const convertedAmount = amount * rate;
    const currencyInfo = currencies.find(c => c.code === currency);
    const symbol = currencyInfo?.symbol || currency;
    
    return `${symbol}${convertedAmount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const formatCurrency = (amount: number): string => {
    return convertCurrency(amount);
  };

  return (
    <CurrencyContext.Provider value={{
      currency,
      setCurrency: handleSetCurrency,
      convertCurrency,
      formatCurrency,
      availableCurrencies: currencies,
      exchangeRates
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
