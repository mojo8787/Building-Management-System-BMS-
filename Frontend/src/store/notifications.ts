import { defineStore } from 'pinia';

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    notifications: [], // List of notifications
  }),
  actions: {
    async fetchNotifications(userId: string) {
      try {
        const response = await fetch(`/notifications?userId=${userId}`);
        this.notifications = await response.json();
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    },
    async markAsRead(notificationId: string) {
      try {
        await fetch(`/notifications/${notificationId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ read: true }),
        });
        this.notifications = this.notifications.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        );
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    },
  },
});
