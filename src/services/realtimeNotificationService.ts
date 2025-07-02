import { ref, onValue, update, remove, get, DataSnapshot, Database } from 'firebase/database';
import { getRealtimeDB, auth } from '@/lib/firebase';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  // Add any additional fields you need
}

class RealtimeNotificationService {
  private realtimeDb: Database;
  private listeners: Map<string, (notifications: Notification[]) => void> = new Map();
  private userRefs: Map<string, () => void> = new Map();

  constructor() {
    this.realtimeDb = getRealtimeDB();
    
    // Clean up listeners when auth state changes
    auth.onAuthStateChanged((user) => {
      if (!user) {
        this.cleanupAllListeners();
      }
    });
  }

  private getNotificationsRef(userId: string) {
    return ref(this.realtimeDb, `notifications/${userId}`);
  }

  private getNotificationRef(userId: string, notificationId: string) {
    return ref(this.realtimeDb, `notifications/${userId}/${notificationId}`);
  }

  private snapshotToNotifications(snapshot: DataSnapshot): Notification[] {
    const notifications: Notification[] = [];
    snapshot.forEach((childSnapshot) => {
      const notification = childSnapshot.val();
      notifications.push({
        ...notification,
        id: childSnapshot.key as string
      });
    });
    return notifications.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public async getNotifications(userId: string): Promise<Notification[]> {
    try {
      const notificationsRef = this.getNotificationsRef(userId);
      const snapshot = await get(notificationsRef);
      if (snapshot.exists()) {
        return this.snapshotToNotifications(snapshot);
      }
      return [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  public async markAsRead(userId: string, id: string) {
    try {
      const notificationRef = this.getNotificationRef(userId, id);
      await update(notificationRef, { isRead: true });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  public async deleteNotification(userId: string, id: string) {
    try {
      const notificationRef = this.getNotificationRef(userId, id);
      await remove(notificationRef);
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  public subscribe(userId: string, callback: (notifications: Notification[]) => void) {
    // Remove existing listener for this userId if any
    this.unsubscribe(userId);

    const handleSnapshot = (snapshot: DataSnapshot) => {
      if (snapshot.exists()) {
        callback(this.snapshotToNotifications(snapshot));
      } else {
        callback([]);
      }
    };

    const setupListener = () => {
      try {
        const notificationsRef = this.getNotificationsRef(userId);
        const unsubscribe = onValue(notificationsRef, handleSnapshot);
        this.userRefs.set(userId, unsubscribe);
        this.listeners.set(userId, callback);
      } catch (error) {
        console.error('Error setting up realtime listener:', error);
      }
    };

    setupListener();

    // Return unsubscribe function
    return () => this.unsubscribe(userId);
  }

  public unsubscribe(userId: string) {
    const unsubscribe = this.userRefs.get(userId);
    if (unsubscribe) {
      unsubscribe();
      this.userRefs.delete(userId);
    }
    if (this.listeners.has(userId)) {
      this.listeners.delete(userId);
    }
  }

  private cleanupAllListeners() {
    this.userRefs.forEach(unsubscribe => unsubscribe());
    this.userRefs.clear();
    this.listeners.clear();
  }

  public destroy() {
    this.cleanupAllListeners();
  }
}

// Singleton instance
export const realtimeNotificationService = new RealtimeNotificationService();