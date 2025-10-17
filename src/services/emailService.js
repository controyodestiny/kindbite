/**
 * Email Service for KindBite
 * Handles email notifications and communications
 */
import apiService from './apiService';
import { ENDPOINTS } from '../config/api';

class EmailService {
  /**
   * Send reservation confirmation email
   */
  async sendReservationConfirmation(reservationData) {
    try {
      const emailData = {
        type: 'reservation_confirmation',
        recipient_email: reservationData.seeker.email,
        recipient_name: `${reservationData.seeker.first_name} ${reservationData.seeker.last_name}`,
        data: {
          food_name: reservationData.food_listing.name,
          restaurant_name: reservationData.food_listing.restaurant_name,
          pickup_date: reservationData.food_listing.pickup_date,
          pickup_time: `${reservationData.food_listing.pickup_window_start} - ${reservationData.food_listing.pickup_window_end}`,
          location: reservationData.food_listing.location,
          quantity: reservationData.quantity_reserved,
          special_instructions: reservationData.special_instructions || 'None',
          provider_contact: {
            name: reservationData.food_listing.provider.business_name || `${reservationData.food_listing.provider.first_name} ${reservationData.food_listing.provider.last_name}`,
            phone: reservationData.food_listing.provider.phone,
            email: reservationData.food_listing.provider.email
          }
        }
      };

      return await apiService.request(ENDPOINTS.NOTIFICATIONS.SEND, {
        method: 'POST',
        body: JSON.stringify(emailData),
        requiresAuth: true,
      });
    } catch (error) {
      console.error('Error sending reservation confirmation email:', error);
      throw error;
    }
  }

  /**
   * Send reservation status update email
   */
  async sendReservationStatusUpdate(reservationData, newStatus) {
    try {
      const statusMessages = {
        'confirmed': 'Your reservation has been confirmed!',
        'cancelled': 'Your reservation has been cancelled.',
        'completed': 'Your food has been picked up successfully!'
      };

      const emailData = {
        type: 'reservation_status_update',
        recipient_email: reservationData.seeker.email,
        recipient_name: `${reservationData.seeker.first_name} ${reservationData.seeker.last_name}`,
        data: {
          food_name: reservationData.food_listing.name,
          restaurant_name: reservationData.food_listing.restaurant_name,
          status: newStatus,
          message: statusMessages[newStatus] || `Your reservation status has been updated to ${newStatus}`,
          pickup_date: reservationData.food_listing.pickup_date,
          pickup_time: `${reservationData.food_listing.pickup_window_start} - ${reservationData.food_listing.pickup_window_end}`,
          location: reservationData.food_listing.location,
          provider_contact: {
            name: reservationData.food_listing.provider.business_name || `${reservationData.food_listing.provider.first_name} ${reservationData.food_listing.provider.last_name}`,
            phone: reservationData.food_listing.provider.phone,
            email: reservationData.food_listing.provider.email
          }
        }
      };

      return await apiService.request(ENDPOINTS.NOTIFICATIONS.SEND, {
        method: 'POST',
        body: JSON.stringify(emailData),
        requiresAuth: true,
      });
    } catch (error) {
      console.error('Error sending status update email:', error);
      throw error;
    }
  }

  /**
   * Send new reservation notification to provider
   */
  async sendNewReservationNotification(reservationData) {
    try {
      const emailData = {
        type: 'new_reservation_notification',
        recipient_email: reservationData.food_listing.provider.email,
        recipient_name: reservationData.food_listing.provider.business_name || `${reservationData.food_listing.provider.first_name} ${reservationData.food_listing.provider.last_name}`,
        data: {
          food_name: reservationData.food_listing.name,
          customer_name: `${reservationData.seeker.first_name} ${reservationData.seeker.last_name}`,
          customer_email: reservationData.seeker.email,
          customer_phone: reservationData.seeker.phone,
          pickup_date: reservationData.food_listing.pickup_date,
          pickup_time: `${reservationData.food_listing.pickup_window_start} - ${reservationData.food_listing.pickup_window_end}`,
          quantity: reservationData.quantity_reserved,
          special_instructions: reservationData.special_instructions || 'None',
          customer_location: reservationData.seeker.location
        }
      };

      return await apiService.request(ENDPOINTS.NOTIFICATIONS.SEND, {
        method: 'POST',
        body: JSON.stringify(emailData),
        requiresAuth: true,
      });
    } catch (error) {
      console.error('Error sending new reservation notification:', error);
      throw error;
    }
  }

  /**
   * Send welcome email to new users
   */
  async sendWelcomeEmail(userData) {
    try {
      const emailData = {
        type: 'welcome_email',
        recipient_email: userData.email,
        recipient_name: `${userData.first_name} ${userData.last_name}`,
        data: {
          user_name: `${userData.first_name} ${userData.last_name}`,
          user_role: userData.user_role,
          kind_coins: userData.kind_coins || 0
        }
      };

      return await apiService.request(ENDPOINTS.NOTIFICATIONS.SEND, {
        method: 'POST',
        body: JSON.stringify(emailData),
        requiresAuth: true,
      });
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw error;
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(userEmail, resetToken) {
    try {
      const emailData = {
        type: 'password_reset',
        recipient_email: userEmail,
        data: {
          reset_token: resetToken,
          reset_url: `${window.location.origin}/reset-password?token=${resetToken}`
        }
      };

      return await apiService.request(ENDPOINTS.NOTIFICATIONS.SEND, {
        method: 'POST',
        body: JSON.stringify(emailData),
        requiresAuth: false, // Password reset doesn't require authentication
      });
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  }

  /**
   * Send food listing reminder email
   */
  async sendFoodListingReminder(foodListingData) {
    try {
      const emailData = {
        type: 'food_listing_reminder',
        recipient_email: foodListingData.provider.email,
        recipient_name: foodListingData.provider.business_name || `${foodListingData.provider.first_name} ${foodListingData.provider.last_name}`,
        data: {
          food_name: foodListingData.name,
          pickup_date: foodListingData.pickup_date,
          pickup_time: `${foodListingData.pickup_window_start} - ${foodListingData.pickup_window_end}`,
          available_quantity: foodListingData.available_quantity,
          total_reservations: foodListingData.reservations?.length || 0
        }
      };

      return await apiService.request(ENDPOINTS.NOTIFICATIONS.SEND, {
        method: 'POST',
        body: JSON.stringify(emailData),
        requiresAuth: true,
      });
    } catch (error) {
      console.error('Error sending food listing reminder:', error);
      throw error;
    }
  }

  /**
   * Send KindCoins earned notification
   */
  async sendKindCoinsEarnedNotification(userData, kindCoinsEarned, reason) {
    try {
      const emailData = {
        type: 'kindcoins_earned',
        recipient_email: userData.email,
        recipient_name: `${userData.first_name} ${userData.last_name}`,
        data: {
          kind_coins_earned: kindCoinsEarned,
          total_kind_coins: userData.kind_coins,
          reason: reason,
          user_name: `${userData.first_name} ${userData.last_name}`
        }
      };

      return await apiService.request(ENDPOINTS.NOTIFICATIONS.SEND, {
        method: 'POST',
        body: JSON.stringify(emailData),
        requiresAuth: true,
      });
    } catch (error) {
      console.error('Error sending KindCoins notification:', error);
      throw error;
    }
  }
}

// Export singleton instance
export default new EmailService();






