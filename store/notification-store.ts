import { create } from 'zustand';
import { Notification } from '@/types';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  
  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock notifications
      const mockNotifications: Notification[] = [
        {
          id: '1',
          userId: '1',
          title: 'Appointment Reminder',
          message: 'You have an appointment with Dr. Aafirin tomorrow at 10:00 AM',
          read: false,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          type: 'appointment',
        },
        {
          id: '2',
          userId: '1',
          title: 'Medication Reminder',
          message: "Don't forget to take your medication today",
          read: true,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          type: 'reminder',
        },
        {
          id: '3',
          userId: '1',
          title: 'New Message',
          message: 'Dr. Aafirin sent you a message',
          read: false,
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          type: 'message',
        },
      ];
      
      const unreadCount = mockNotifications.filter(n => !n.read).length;
      
      set({
        notifications: mockNotifications,
        unreadCount,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to fetch notifications:', error);
    }
  },
  
  markAsRead: (id: string) => {
    set(state => {
      const updatedNotifications = state.notifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      );
      
      return {
        notifications: updatedNotifications,
        unreadCount: updatedNotifications.filter(n => !n.read).length,
      };
    });
  },
  
  markAllAsRead: () => {
    set(state => ({
      notifications: state.notifications.map(notification => ({ ...notification, read: true })),
      unreadCount: 0,
    }));
  },
  
  clearNotifications: () => {
    set({ notifications: [], unreadCount: 0 });
  },
}));