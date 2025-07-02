import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCircle, AlertCircle, Info, Trash2, Check } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info';
  timestamp: string;
  isRead: boolean;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    const loadNotifications = () => {
      const stored = localStorage.getItem('trading-notifications');
      if (stored) {
        setNotifications(JSON.parse(stored));
      }
    };

    loadNotifications();
    const interval = setInterval(loadNotifications, 1000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = (id: string) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    );
    setNotifications(updated);
    localStorage.setItem('trading-notifications', JSON.stringify(updated));
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, isRead: true }));
    setNotifications(updated);
    localStorage.setItem('trading-notifications', JSON.stringify(updated));
  };

  const deleteNotification = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    localStorage.setItem('trading-notifications', JSON.stringify(updated));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    localStorage.removeItem('trading-notifications');
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-400" />;
      default: return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'read') return n.isRead;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-2 sm:p-4 lg:p-6">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 pt-16 sm:pt-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 px-2">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 flex-shrink-0" />
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <p className="text-sm text-slate-400 mt-1">
                  {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              size="sm"
              variant="outline"
              className="border-slate-600 text-white hover:bg-slate-700 text-xs"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark All Read
            </Button>
            <Button
              onClick={clearAllNotifications}
              disabled={notifications.length === 0}
              size="sm"
              variant="destructive"
              className="text-xs"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 px-2 mb-6">
          {[
            { key: 'all', label: 'All', count: notifications.length },
            { key: 'unread', label: 'Unread', count: unreadCount },
            { key: 'read', label: 'Read', count: notifications.length - unreadCount }
          ].map(({ key, label, count }) => (
            <Button
              key={key}
              onClick={() => setFilter(key as any)}
              variant={filter === key ? "default" : "outline"}
              size="sm"
              className={`text-xs ${
                filter === key 
                  ? "bg-blue-600 hover:bg-blue-700" 
                  : "border-slate-600 text-white hover:bg-slate-700"
              }`}
            >
              {label} ({count})
            </Button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-3 px-2">
          {filteredNotifications.length === 0 ? (
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <Bell className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  {filter === 'all' ? 'No notifications' : `No ${filter} notifications`}
                </h3>
                <p className="text-slate-400">
                  {filter === 'all' 
                    ? 'Your notifications will appear here' 
                    : `You have no ${filter} notifications`
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`bg-slate-800/50 border-slate-700 backdrop-blur-sm transition-all hover:bg-slate-800/70 ${
                  !notification.isRead ? 'border-blue-500/30 bg-blue-900/10' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className={`font-medium ${!notification.isRead ? 'text-white' : 'text-slate-300'}`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {!notification.isRead && (
                            <Badge variant="outline" className="text-blue-400 border-blue-400 text-xs">
                              New
                            </Badge>
                          )}
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              notification.type === 'success' 
                                ? 'text-green-400 border-green-400'
                                : notification.type === 'error'
                                ? 'text-red-400 border-red-400'
                                : 'text-blue-400 border-blue-400'
                            }`}
                          >
                            {notification.type}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className={`text-sm mb-3 ${!notification.isRead ? 'text-slate-300' : 'text-slate-400'}`}>
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-slate-500">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                        
                        <div className="flex gap-2">
                          {!notification.isRead && (
                            <Button
                              onClick={() => markAsRead(notification.id)}
                              size="sm"
                              variant="ghost"
                              className="text-blue-400 hover:text-blue-300 text-xs p-1"
                            >
                              <Check className="w-3 h-3 mr-1" />
                              Mark Read
                            </Button>
                          )}
                          <Button
                            onClick={() => deleteNotification(notification.id)}
                            size="sm"
                            variant="ghost"
                            className="text-red-400 hover:text-red-300 text-xs p-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;