/**
 * Notification Service for KindBite
 * Handles all notification-related API calls
 */
import { API_CONFIG, ENDPOINTS, buildUrl, getAuthHeaders } from '../config/api';

class NotificationService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  /**
   * Generic request method
   */
  async request(endpoint, options = {}) {
    const url = buildUrl(endpoint);
    const config = {
      timeout: API_CONFIG.TIMEOUT,
      headers: options.requiresAuth ? getAuthHeaders() : API_CONFIG.HEADERS,
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.detail || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Notification service request failed:', error);
      throw error;
    }
  }

  /**
   * Get all notifications for the current user
   */
  async getNotifications() {
    try {
      return await this.request(ENDPOINTS.NOTIFICATIONS.LIST, {
        requiresAuth: true,
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Return empty array for now to prevent app crashes
      return [];
    }
  }

  /**
   * Get unread notifications
   */
  async getUnreadNotifications() {
    try {
      return await this.request(ENDPOINTS.NOTIFICATIONS.UNREAD, {
        requiresAuth: true,
      });
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
      return [];
    }
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(notificationId) {
    try {
      return await this.request(ENDPOINTS.NOTIFICATIONS.MARK_READ(notificationId), {
        method: 'POST',
        requiresAuth: true,
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead() {
    try {
      return await this.request(ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ, {
        method: 'POST',
        requiresAuth: true,
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId) {
    try {
      return await this.request(ENDPOINTS.NOTIFICATIONS.DETAIL(notificationId), {
        method: 'DELETE',
        requiresAuth: true,
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  /**
   * Get notification preferences
   */
  async getNotificationPreferences() {
    try {
      return await this.request(ENDPOINTS.NOTIFICATIONS.PREFERENCES, {
        requiresAuth: true,
      });
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      // Return default preferences
      return {
        email: true,
        push: true,
        reservation_updates: true,
        new_food_listings: true,
        promotional: false,
        system_updates: true,
      };
    }
  }

  /**
   * Update notification preferences
   */
  async updateNotificationPreferences(preferences) {
    try {
      return await this.request(ENDPOINTS.NOTIFICATIONS.UPDATE_PREFERENCES, {
        method: 'PUT',
        body: JSON.stringify(preferences),
        requiresAuth: true,
      });
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      throw error;
    }
  }

  /**
   * Send a notification
   */
  async sendNotification(notificationData) {
    try {
      return await this.request(ENDPOINTS.NOTIFICATIONS.SEND, {
        method: 'POST',
        body: JSON.stringify(notificationData),
        requiresAuth: true,
      });
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  /**
   * Get notification statistics
   */
  async getNotificationStats() {
    try {
      return await this.request(ENDPOINTS.NOTIFICATIONS.STATS, {
        requiresAuth: true,
      });
    } catch (error) {
      console.error('Error fetching notification stats:', error);
      return {
        total_notifications: 0,
        unread_notifications: 0,
        notifications_by_type: {},
        notifications_by_priority: {},
        recent_notifications: [],
      };
    }
  }
}

// Export singleton instance
export default new NotificationService();