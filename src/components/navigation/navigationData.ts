
import {
  Settings,
  LayoutDashboard,
  Activity,
  ShieldAlert,
  Bell,
  Book,
  User,
  ScrollText,
  Shield,
  Users,
  CreditCard,
  Banknote,
  ArrowRightLeft,
  Wallet as WalletIcon,
  TrendingUp,
  Calendar,
} from 'lucide-react';

export const navigationItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Trading', icon: Activity, path: '/trading' },
  { label: 'My Trades', icon: TrendingUp, path: '/my-trades' },
  { label: 'MT5 Hub', icon: ScrollText, path: '/mt5-hub' },
];

export const accountItems = [
  { label: 'My Accounts', icon: Users, path: '/my-accounts' },
  { label: 'Deposit', icon: CreditCard, path: '/deposit' },
  { label: 'Withdraw', icon: Banknote, path: '/withdraw' },
  { label: 'Transfer', icon: ArrowRightLeft, path: '/transfer' },
  { label: 'Wallet', icon: WalletIcon, path: '/wallet' },
  { label: 'Transactions', icon: Calendar, path: '/my-transactions' },
];

export const systemItems = [
  { label: 'Compliance', icon: Shield, path: '/compliance' },
  { label: 'Security', icon: ShieldAlert, path: '/security' },
  { label: 'Notifications', icon: Bell, path: '/notifications' },
  { label: 'Knowledge', icon: Book, path: '/knowledge' },
  { label: 'Profile', icon: User, path: '/profile' },
  { label: 'Settings', icon: Settings, path: '/settings' },
];
