interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info';
  timestamp: string;
  isRead: boolean;
}

class NotificationService {
  private listeners: Set<(notifications: Notification[]) => void> = new Set();
  private notifications: Notification[] = [];
  private interval: NodeJS.Timeout | null = null;

  constructor() {
    this.loadNotifications();
    this.startRealTimeUpdates();
  }

  private loadNotifications() {
    const stored = localStorage.getItem('trading-notifications');
    if (stored) {
      this.notifications = JSON.parse(stored);
    }
  }

  private saveNotifications() {
    localStorage.setItem('trading-notifications', JSON.stringify(this.notifications));
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }

  private startRealTimeUpdates() {
    // Simulate real-time updates with periodic checks and random notifications
    this.interval = setInterval(() => {
      this.checkForMarketUpdates();
      this.generateRandomNotifications();
    }, 5000); // Check every 5 seconds
  }

  private checkForMarketUpdates() {
    // Simulate market update notifications
    const marketEvents = [
      { symbol: 'EURUSD', change: '+0.25%', type: 'bullish' },
      { symbol: 'BTCUSD', change: '-1.8%', type: 'bearish' },
      { symbol: 'GBPJPY', change: '+0.15%', type: 'bullish' },
    ];

    // Randomly trigger market notifications
    if (Math.random() < 0.1) { // 10% chance every 5 seconds
      const event = marketEvents[Math.floor(Math.random() * marketEvents.length)];
      this.addNotification({
        title: `Market Alert: ${event.symbol}`,
        message: `${event.symbol} has moved ${event.change} in the last hour`,
        type: event.type === 'bullish' ? 'success' : 'error'
      });
    }
  }

  private generateRandomNotifications() {
    const notifications = [
      {
        title: 'Trade Executed',
        message: 'Your EUR/USD buy order has been executed at 1.0825',
        type: 'success' as const
      },
      {
        title: 'Price Alert',
        message: 'Bitcoin has reached your target price of $45,000',
        type: 'info' as const
      },
      {
        title: 'Stop Loss Triggered',
        message: 'Your GBP/USD position was closed due to stop loss',
        type: 'error' as const
      },
      {
        title: 'Market News',
        message: 'Federal Reserve announces interest rate decision',
        type: 'info' as const
      },
      {
        title: 'Margin Call Warning',
        message: 'Your account margin level is approaching 100%',
        type: 'error' as const
      }
    ];

    // Randomly generate notifications (very low probability)
    if (Math.random() < 0.05) { // 5% chance every 5 seconds
      const notification = notifications[Math.floor(Math.random() * notifications.length)];
      this.addNotification(notification);
    }
  }

  addNotification({ title, message, type }: { title: string; message: string; type: 'success' | 'error' | 'info' }) {
    const notification: Notification = {
      id: Date.now().toString(),
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    this.notifications.unshift(notification);
    
    // Keep only the latest 50 notifications
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50);
    }

    this.saveNotifications();
  }

  getNotifications(): Notification[] {
    return [...this.notifications];
  }

  markAsRead(id: string) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.isRead = true;
      this.saveNotifications();
    }
  }

  removeNotification(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.saveNotifications();
  }

  subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.add(listener);
    // Immediately call with current notifications
    listener([...this.notifications]);
    
    return () => {
      this.listeners.delete(listener);
    };
  }

  destroy() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.listeners.clear();
  }
}

export const notificationService = new NotificationService();
export type { Notification };
