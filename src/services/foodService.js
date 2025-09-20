/**
 * Food service for KindBite food management functionality.
 * Handles communication with the food management backend API.
 */
import { API_CONFIG, STORAGE_KEYS, getAuthHeaders, buildUrl } from '../config/api';

class FoodService {
  constructor() {
    this.baseUrl = `${API_CONFIG.BASE_URL}/foods`;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  /**
   * Make an authenticated API request using fetch
   */
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = getAuthHeaders();

    const config = {
      method: 'GET',
      headers,
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    };

    // Add timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      config.signal = controller.signal;
      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      if (response.status === 401) {
        // Try to refresh token
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // Retry with new token
          const newHeaders = getAuthHeaders();
          config.headers = {
            ...newHeaders,
            ...options.headers,
          };
          const retryResponse = await fetch(url, config);
          if (!retryResponse.ok) {
            throw new Error(`HTTP ${retryResponse.status}: ${retryResponse.statusText}`);
          }
          return await retryResponse.json();
        } else {
          throw new Error('Authentication failed. Please log in again.');
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please try again.');
      }
      throw error;
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken() {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    if (!refreshToken) {
      this.clearAuth();
      return false;
    }

    try {
      const response = await fetch(buildUrl('/auth/token/refresh/'), {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.access);
        return true;
      } else {
        this.clearAuth();
        return false;
      }
    } catch (error) {
      this.clearAuth();
      return false;
    }
  }

  /**
   * Clear authentication data
   */
  clearAuth() {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  // Food Listing Methods

  /**
   * Get all available food listings (for food seekers)
   */
  async getAvailableFoodListings(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.provider_type) {
      params.append('provider_type', filters.provider_type);
    }
    if (filters.search) {
      params.append('search', filters.search);
    }
    if (filters.dietary) {
      params.append('dietary', filters.dietary);
    }

    const endpoint = `/listings/available/${params.toString() ? `?${params.toString()}` : ''}`;
    return await this.makeRequest(endpoint);
  }

  /**
   * Get user's own food listings (for food providers)
   */
  async getMyFoodListings() {
    return await this.makeRequest('/listings/');
  }

  /**
   * Get a specific food listing by ID
   */
  async getFoodListing(id) {
    return await this.makeRequest(`/listings/${id}/`);
  }

  /**
   * Create a new food listing
   */
  async createFoodListing(listingData) {
    return await this.makeRequest('/listings/', {
      method: 'POST',
      body: JSON.stringify(listingData),
    });
  }

  /**
   * Update an existing food listing
   */
  async updateFoodListing(id, listingData) {
    return await this.makeRequest(`/listings/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(listingData),
    });
  }

  /**
   * Delete a food listing
   */
  async deleteFoodListing(id) {
    return await this.makeRequest(`/listings/${id}/`, {
      method: 'DELETE',
    });
  }

  // Reservation Methods

  /**
   * Create a reservation for a food item
   */
  async createReservation(reservationData) {
    return await this.makeRequest('/reservations/create/', {
      method: 'POST',
      body: JSON.stringify(reservationData),
    });
  }

  /**
   * Get user's reservations
   */
  async getUserReservations() {
    return await this.makeRequest('/reservations/');
  }

  /**
   * Cancel a reservation
   */
  async cancelReservation(reservationId) {
    return await this.makeRequest(`/reservations/${reservationId}/cancel/`, {
      method: 'POST',
    });
  }

  // Statistics Methods

  /**
   * Get food statistics for the user
   */
  async getFoodStats() {
    return await this.makeRequest('/stats/');
  }

  // Helper Methods

  /**
   * Transform backend food data to match frontend format
   */
  transformFoodData(backendFood) {
    return {
      id: backendFood.id,
      restaurant: backendFood.restaurant_name,
      name: backendFood.name,
      description: backendFood.description,
      originalPrice: parseFloat(backendFood.original_price),
      discountedPrice: parseFloat(backendFood.discounted_price),
      quantity: backendFood.quantity,
      availableQuantity: backendFood.available_quantity,
      rating: parseFloat(backendFood.rating),
      distance: backendFood.distance,
      pickupWindow: backendFood.pickup_window,
      pickupDate: backendFood.pickup_date,
      dietary: backendFood.dietary_info || [],
      image: backendFood.image_emoji,
      co2Saved: parseFloat(backendFood.co2_saved),
      provider: backendFood.provider_type,
      status: backendFood.status,
      isAvailable: backendFood.is_available,
      location: backendFood.location,
      providerName: backendFood.provider_name,
      providerBusinessName: backendFood.provider_business_name,
      createdAt: backendFood.created_at,
      discountPercentage: backendFood.discount_percentage
    };
  }

  /**
   * Transform frontend food data to backend format
   */
  transformToBackendFormat(frontendFood) {
    return {
      name: frontendFood.name,
      restaurant_name: frontendFood.restaurant || frontendFood.restaurant_name,
      description: frontendFood.description,
      original_price: frontendFood.originalPrice,
      discounted_price: frontendFood.discountedPrice,
      quantity: frontendFood.quantity,
      pickup_window_start: frontendFood.pickupWindowStart,
      pickup_window_end: frontendFood.pickupWindowEnd,
      pickup_date: frontendFood.pickupDate,
      location: frontendFood.location,
      dietary_info: frontendFood.dietary || [],
      image_emoji: frontendFood.image || '🍽️',
      co2_saved: frontendFood.co2Saved || 0
    };
  }

  /**
   * Get all available food listings with frontend format
   */
  async getAvailableFoods(filters = {}) {
    const backendFoods = await this.getAvailableFoodListings(filters);
    return backendFoods.map(food => this.transformFoodData(food));
  }

  /**
   * Get user's food listings with frontend format
   */
  async getMyFoods() {
    const backendFoods = await this.getMyFoodListings();
    return backendFoods.map(food => this.transformFoodData(food));
  }

  /**
   * Create food listing with frontend format
   */
  async createFood(frontendFoodData) {
    const backendData = this.transformToBackendFormat(frontendFoodData);
    const createdFood = await this.createFoodListing(backendData);
    return this.transformFoodData(createdFood);
  }

  /**
   * Update food listing with frontend format
   */
  async updateFood(id, frontendFoodData) {
    const backendData = this.transformToBackendFormat(frontendFoodData);
    const updatedFood = await this.updateFoodListing(id, backendData);
    return this.transformFoodData(updatedFood);
  }

  /**
   * Reserve food item
   */
  async reserveFood(foodId, quantity = 1, specialInstructions = '') {
    const reservationData = {
      food_listing_id: foodId,
      quantity_reserved: quantity,
      special_instructions: specialInstructions
    };
    return await this.createReservation(reservationData);
  }
}

// Create and export a singleton instance
const foodService = new FoodService();
export default foodService;

