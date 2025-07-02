
import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  availableLanguages: { code: string; name: string; flag: string }[];
}

const languages = {
  en: {
    dashboard: 'Dashboard',
    trading: 'Trading',
    mt5_hub: 'MT5 Hub',
    financial_ops: 'Financial Operations',
    compliance: 'Compliance',
    security: 'Security',
    notifications: 'Notifications',
    knowledge: 'Knowledge Base',
    profile: 'Profile',
    settings: 'Settings',
    balance: 'Balance',
    equity: 'Equity',
    pnl: 'P&L',
    margin_level: 'Margin Level',
    last_updated: 'Last Updated',
    live: 'LIVE',
    demo_account: 'DEMO',
    real_account: 'REAL',
    live_chart: 'Live Market Chart',
    market_watchlist: 'Market Watchlist',
    portfolio_snapshot: 'Portfolio Snapshot',
    // Add more translations...
  },
  es: {
    dashboard: 'Panel de Control',
    trading: 'Trading',
    portfolio: 'Cartera',
    mt5_hub: 'Hub MT5',
    financial_ops: 'Operaciones Financieras',
    compliance: 'Cumplimiento',
    security: 'Seguridad',
    notifications: 'Notificaciones',
    knowledge: 'Base de Conocimientos',
    profile: 'Perfil',
    settings: 'Configuración',
    balance: 'Balance',
    equity: 'Patrimonio',
    pnl: 'PyG',
    margin_level: 'Nivel de Margen',
    last_updated: 'Última Actualización',
    live: 'EN VIVO',
    demo_account: 'DEMO',
    real_account: 'REAL',
    live_chart: 'Gráfico en Vivo',
    market_watchlist: 'Lista de Mercados',
    portfolio_snapshot: 'Resumen de Cartera',
  },
  fr: {
    dashboard: 'Tableau de Bord',
    trading: 'Trading',
    portfolio: 'Portefeuille',
    mt5_hub: 'Hub MT5',
    financial_ops: 'Opérations Financières',
    compliance: 'Conformité',
    security: 'Sécurité',
    notifications: 'Notifications',
    knowledge: 'Base de Connaissances',
    profile: 'Profil',
    settings: 'Paramètres',
    balance: 'Solde',
    equity: 'Capitaux Propres',
    pnl: 'P&L',
    margin_level: 'Niveau de Marge',
    last_updated: 'Dernière Mise à Jour',
    live: 'EN DIRECT',
    demo_account: 'DÉMO',
    real_account: 'RÉEL',
    live_chart: 'Graphique en Direct',
    market_watchlist: 'Liste de Surveillance',
    portfolio_snapshot: 'Aperçu du Portefeuille',
  }
  // Add more languages...
};

const availableLanguages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
  { code: 'da', name: 'Dansk', flag: '🇩🇰' },
  { code: 'no', name: 'Norsk', flag: '🇳🇴' },
  // Add more up to 50 languages...
];

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('gm-capital-language');
    if (savedLanguage && languages[savedLanguage as keyof typeof languages]) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('gm-capital-language', lang);
  };

  const t = (key: string): string => {
    const translations = languages[language as keyof typeof languages] || languages.en;
    return translations[key as keyof typeof translations] || key;
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage: handleSetLanguage,
      t,
      availableLanguages
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
