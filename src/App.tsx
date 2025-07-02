import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Navigate, 
  Outlet,
  useLocation
} from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { TradingProvider } from "@/contexts/TradingContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import { useState, useEffect } from 'react';

// Import all pages
import Dashboard from "@/pages/Dashboard";
import Settings from "@/pages/Settings";
import Trading from "@/pages/Trading";
import MT5Hub from "@/pages/MT5Hub";
import Security from "@/pages/Security";
import Notifications from "@/pages/Notifications";
import Knowledge from "@/pages/Knowledge";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import TermsConditions from "@/pages/TermsConditions";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Compliance from "@/pages/Compliance";
import MyAccounts from "@/pages/MyAccounts";
import Deposit from "@/pages/Deposit";
import Withdraw from "@/pages/Withdraw";
import Transfer from "@/pages/Transfer";
import Wallet from "@/pages/Wallet";
import MyTrades from "@/pages/MyTrades";
import MyTransactions from "@/pages/MyTransactions";
import Login from "@/pages/Login";
import Signup from "@/pages/signup";
import VerifyEmail from "@/pages/verify-email";
import ResetPassword from "@/pages/ResetPassword";
import Market from "@/pages/Market";

// Configure query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Debugging component
const RouteDebugger = () => {
  const location = useLocation();
  
  useEffect(() => {
    console.log('Route changed to:', location.pathname);
  }, [location]);

  return null;
};

// Protected route component
const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Authenticating...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  
  return <Outlet />;
};

// Layout component for authenticated routes
const MainLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex flex-1 w-full">
      <Navigation 
        isSidebarCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <main className={`flex-1 overflow-x-hidden transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
      }`}>
        <div className="w-full h-full p-4 lg:p-6">
          <Outlet />
          <RouteDebugger />
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider delayDuration={300}>
          <LanguageProvider>
            <CurrencyProvider>
              <SettingsProvider>
                <AuthProvider>
                  <TradingProvider>
                    <BrowserRouter
                      future={{
                        v7_startTransition: true,
                        v7_relativeSplatPath: true
                      }}
                    >
                      <Routes>
                        {/* Public routes */}
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="/verify-email" element={<VerifyEmail />} />
                        
                        {/* Protected routes with nested layout */}
                        <Route element={<ProtectedRoute />}>
                          <Route element={<MainLayout />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/trading" element={<Trading />} />
                            <Route path="/mt5-hub" element={<MT5Hub />} />
                            <Route path="/security" element={<Security />} />
                            <Route path="/notifications" element={<Notifications />} />
                            <Route path="/knowledge" element={<Knowledge />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/terms" element={<TermsConditions />} />
                            <Route path="/privacy" element={<PrivacyPolicy />} />
                            <Route path="/compliance" element={<Compliance />} />
                            <Route path="/my-accounts" element={<MyAccounts />} />
                            <Route path="/deposit" element={<Deposit />} />
                            <Route path="/withdraw" element={<Withdraw />} />
                            <Route path="/transfer" element={<Transfer />} />
                            <Route path="/wallet" element={<Wallet />} />
                            <Route path="/my-trades" element={<MyTrades />} />
                            <Route path="/my-transactions" element={<MyTransactions />} />
                            <Route path="/market" element={<Market />} />
                          </Route>
                        </Route>
                        
                        {/* Catch-all route */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                      <SonnerToaster 
                        position="bottom-right" 
                        richColors 
                        closeButton 
                        toastOptions={{
                          duration: 5000,
                        }} 
                      />
                    </BrowserRouter>
                  </TradingProvider>
                </AuthProvider>
              </SettingsProvider>
            </CurrencyProvider>
          </LanguageProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;