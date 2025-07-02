import { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { getDatabase, ref, onValue, update, remove } from 'firebase/database';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export const NotificationSystem = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const db = getDatabase();
    const notificationsRef = ref(db, `users/${user.uid}/notifications`);
    
    const unsubscribe = onValue(notificationsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedNotifications: Notification[] = [];

      if (data) {
        Object.keys(data).forEach((key) => {
          loadedNotifications.push({
            id: key,
            ...data[key]
          });
        });

        // Sort by creation date (newest first)
        loadedNotifications.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }

      setNotifications(loadedNotifications);
    });

    return unsubscribe;
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-notification-system]')) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDropdown]);

  const markAsRead = async (id: string) => {
    if (!user) return;
    
    const db = getDatabase();
    const notificationRef = ref(db, `users/${user.uid}/notifications/${id}`);
    await update(notificationRef, { is_read: true });
  };

  const clearNotification = async (id: string) => {
    if (!user) return;
    
    const db = getDatabase();
    const notificationRef = ref(db, `users/${user.uid}/notifications/${id}`);
    await remove(notificationRef);
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-400" />;
      default: return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="relative" data-notification-system>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative text-white hover:bg-slate-700 p-2"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-5 h-5 flex items-center justify-center rounded-full px-1">
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {showDropdown && (
        <>
          {/* Backdrop for mobile */}
          <div className="lg:hidden fixed inset-0 bg-black/20 z-40" onClick={() => setShowDropdown(false)} />
          
          {/* Notification dropdown */}
          <div className="absolute right-0 top-full mt-2 w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 max-h-96 overflow-hidden">
            <div className="p-3 border-b border-slate-700 bg-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-medium">Notifications</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDropdown(false)}
                  className="text-slate-400 hover:text-white p-1 lg:hidden"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-slate-400 bg-slate-800">
                <Bell className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                <p className="text-sm">No notifications</p>
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto bg-slate-800">
                {notifications.slice(0, 10).map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border-b border-slate-700 hover:bg-slate-700/50 cursor-pointer transition-colors ${
                      !notification.is_read ? 'bg-slate-700/30' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getIcon(notification.type || 'info')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="text-white text-sm font-medium truncate">
                            {notification.title}
                          </h4>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              clearNotification(notification.id);
                            }}
                            className="text-slate-400 hover:text-white p-1 flex-shrink-0"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                        <p className="text-slate-300 text-xs mb-2 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-slate-500 text-xs">
                            {new Date(notification.created_at || '').toLocaleTimeString()}
                          </p>
                          {!notification.is_read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {notifications.length > 0 && (
              <div className="p-3 border-t border-slate-700 bg-slate-800">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs border-slate-600 text-white hover:bg-slate-700"
                  onClick={() => {
                    setShowDropdown(false);
                    window.location.href = '/notifications';
                  }}
                >
                  View All Notifications
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};