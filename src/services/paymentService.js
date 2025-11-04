/**
 * Payment Service for KindBite
 * Handles payment processing and KindCoins transactions
 */
import apiService from './apiService';
import { ENDPOINTS } from '../config/api';

class PaymentService {
  /**
   * Create a payment intent for food reservation
   */
  async createPaymentIntent(reservationData) {
    try {
      const paymentData = {
        amount: reservationData.food_listing.discounted_price * reservationData.quantity_reserved,
        currency: 'UGX', // Ugandan Shillings
        reservation_id: reservationData.id,
        food_listing_id: reservationData.food_listing.id,
        customer_email: reservationData.seeker.email,
        customer_name: `${reservationData.seeker.first_name} ${reservationData.seeker.last_name}`,
        description: `Payment for ${reservationData.food_listing.name} from ${reservationData.food_listing.restaurant_name}`,
        metadata: {
          food_name: reservationData.food_listing.name,
          restaurant_name: reservationData.food_listing.restaurant_name,
          quantity: reservationData.quantity_reserved,
          pickup_date: reservationData.food_listing.pickup_date
        }
      };

      return await apiService.request(ENDPOINTS.PAYMENTS.CREATE_INTENT, {
        method: 'POST',
        body: JSON.stringify(paymentData),
        requiresAuth: true,
      });
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  /**
   * Confirm payment intent
   */
  async confirmPaymentIntent(paymentIntentId, paymentMethodId) {
    try {
      const confirmData = {
        payment_intent_id: paymentIntentId,
        payment_method_id: paymentMethodId
      };

      return await apiService.request(ENDPOINTS.PAYMENTS.CONFIRM(paymentIntentId), {
        method: 'POST',
        body: JSON.stringify(confirmData),
        requiresAuth: true,
      });
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  }

  /**
   * Process payment with KindCoins
   */
  async processKindCoinsPayment(reservationData, kindCoinsAmount) {
    try {
      const paymentData = {
        type: 'kindcoins_payment',
        reservation_id: reservationData.id,
        amount: kindCoinsAmount,
        currency: 'KINDCOINS',
        description: `KindCoins payment for ${reservationData.food_listing.name}`,
        metadata: {
          food_name: reservationData.food_listing.name,
          restaurant_name: reservationData.food_listing.restaurant_name,
          quantity: reservationData.quantity_reserved
        }
      };

      return await apiService.request(ENDPOINTS.PAYMENTS.KINDCOINS, {
        method: 'POST',
        body: JSON.stringify(paymentData),
        requiresAuth: true,
      });
    } catch (error) {
      console.error('Error processing KindCoins payment:', error);
      throw error;
    }
  }

  /**
   * Get payment methods for user
   */
  async getPaymentMethods() {
    try {
      return await apiService.request(ENDPOINTS.PAYMENTS.METHODS, { requiresAuth: true });
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw error;
    }
  }

  /**
   * Add new payment method
   */
  async addPaymentMethod(paymentMethodData) {
    try {
      return await apiService.request(ENDPOINTS.PAYMENTS.METHODS, {
        method: 'POST',
        body: JSON.stringify(paymentMethodData),
        requiresAuth: true,
      });
    } catch (error) {
      console.error('Error adding payment method:', error);
      throw error;
    }
  }

  /**
   * Set default payment method
   */
  async setDefaultPaymentMethod(paymentMethodId) {
    try {
      return await apiService.request(ENDPOINTS.PAYMENTS.SET_DEFAULT(paymentMethodId), {
        method: 'POST',
        requiresAuth: true,
      });
    } catch (error) {
      console.error('Error setting default payment method:', error);
      throw error;
    }
  }

  /**
   * Get payment history
   */
  async getPaymentHistory(filters = {}) {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      
      const queryString = params.toString();
      const endpoint = queryString ? `${ENDPOINTS.PAYMENTS.TRANSACTIONS}?${queryString}` : ENDPOINTS.PAYMENTS.TRANSACTIONS;
      
      return await apiService.request(endpoint, { requiresAuth: true });
    } catch (error) {
      console.error('Error fetching payment history:', error);
      throw error;
    }
  }

  /**
   * Get KindCoins balance and transactions
   */
  async getKindCoinsBalance() {
    try {
      return await apiService.request(ENDPOINTS.PAYMENTS.KINDCOINS, { requiresAuth: true });
    } catch (error) {
      console.error('Error fetching KindCoins balance:', error);
      throw error;
    }
  }

  /**
   * Get KindCoins transaction history
   */
  async getKindCoinsTransactions(filters = {}) {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      
      const queryString = params.toString();
      const endpoint = queryString ? `${ENDPOINTS.PAYMENTS.KINDCOINS_TRANSACTIONS}?${queryString}` : ENDPOINTS.PAYMENTS.KINDCOINS_TRANSACTIONS;
      
      return await apiService.request(endpoint, { requiresAuth: true });
    } catch (error) {
      console.error('Error fetching KindCoins transactions:', error);
      throw error;
    }
  }

  /**
   * Create refund for a transaction
   */
  async createRefund(transactionId, refundData) {
    try {
      const refundRequest = {
        transaction_id: transactionId,
        amount: refundData.amount,
        reason: refundData.reason,
        description: refundData.description || 'Refund request'
      };

      return await apiService.request(ENDPOINTS.PAYMENTS.CREATE_REFUND, {
        method: 'POST',
        body: JSON.stringify(refundRequest),
        requiresAuth: true,
      });
    } catch (error) {
      console.error('Error creating refund:', error);
      throw error;
    }
  }

  /**
   * Get payment statistics
   */
  async getPaymentStats() {
    try {
      return await apiService.request(ENDPOINTS.PAYMENTS.STATS, { requiresAuth: true });
    } catch (error) {
      console.error('Error fetching payment stats:', error);
      throw error;
    }
  }

  /**
   * Calculate payment amount with fees
   */
  calculatePaymentAmount(baseAmount, currency = 'UGX') {
    const fees = {
      'UGX': 0.035, // 3.5% fee for UGX
      'USD': 0.029, // 2.9% fee for USD
      'KINDCOINS': 0 // No fee for KindCoins
    };

    const feeRate = fees[currency] || 0.035;
    const fee = baseAmount * feeRate;
    const total = baseAmount + fee;

    return {
      baseAmount,
      fee,
      total,
      feeRate: feeRate * 100 // Return as percentage
    };
  }

  /**
   * Initiate Pesapal payment and return redirect URL
   */
  async initiatePesapalPayment({ amountUGX, description, metadata = {} }) {
    const body = {
      amount: amountUGX, // backend expects integer cents (UGX minor unit = 1)
      currency: 'UGX',
      description: description || 'KindBite Order',
      metadata,
    };
    const resp = await apiService.request(ENDPOINTS.PAYMENTS.PESAPAL.INITIATE, {
      method: 'POST',
      body: JSON.stringify(body),
      requiresAuth: true,
    });
    return resp; // { payment_intent_id, order_tracking_id, merchant_reference, redirect_url }
  }

  /**
   * Format currency for display
   */
  formatCurrency(amount, currency = 'UGX') {
    const formatters = {
      'UGX': new Intl.NumberFormat('en-UG', {
        style: 'currency',
        currency: 'UGX',
        minimumFractionDigits: 0
      }),
      'USD': new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
      }),
      'KINDCOINS': (amount) => `${amount} KindCoins`
    };

    const formatter = formatters[currency];
    if (typeof formatter === 'function') {
      return formatter(amount);
    }
    return formatter.format(amount);
  }
}

// Export singleton instance
export default new PaymentService();














