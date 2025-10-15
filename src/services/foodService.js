/**
 * Food Service for KindBite
 * Handles all food-related API calls
 */
import apiService from './apiService';
import { ENDPOINTS } from '../config/api';

class FoodService {
  /**
   * Get all food listings
   */
  async getFoodListings(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      // Add filters to query params
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      
      const queryString = params.toString();
      const endpoint = queryString ? `${ENDPOINTS.FOODS.LISTINGS}?${queryString}` : ENDPOINTS.FOODS.LISTINGS;
      
      return await apiService.request(endpoint, { requiresAuth: true });
    } catch (error) {
      console.error('Error fetching food listings:', error);
      throw error;
    }
  }

  /**
   * Get all food listings for search (no filters)
   * For food seekers, this gets available foods from all providers
   * For providers, this gets their own listings
   */
  async getAllFoodListings() {
    try {
      return await apiService.request(ENDPOINTS.FOODS.LISTINGS, { requiresAuth: true });
    } catch (error) {
      console.error('Error fetching all food listings:', error);
      throw error;
    }
  }

  /**
   * Get available food listings for food seekers (excludes own listings)
   */
  async getAvailableFoodListingsForSeekers(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      // Add filters to query params
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      
      const queryString = params.toString();
      const endpoint = queryString ? `${ENDPOINTS.FOODS.AVAILABLE}?${queryString}` : ENDPOINTS.FOODS.AVAILABLE;
      
      return await apiService.request(endpoint, { requiresAuth: true });
    } catch (error) {
      console.error('Error fetching available food listings for seekers:', error);
      throw error;
    }
  }

  /**
   * Get available food listings for food seekers
   */
  async getAvailableFoodListings(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      // Add filters to query params
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      
      const queryString = params.toString();
      const endpoint = queryString ? `${ENDPOINTS.FOODS.SEARCH}?${queryString}` : ENDPOINTS.FOODS.SEARCH;
      
      return await apiService.request(endpoint, { requiresAuth: true });
    } catch (error) {
      console.error('Error fetching available food listings:', error);
      throw error;
    }
  }

  /**
   * Get current user's food listings
   */
  async getMyFoodListings() {
    try {
      return await apiService.request(ENDPOINTS.FOODS.LISTINGS, { requiresAuth: true });
    } catch (error) {
      console.error('Error fetching my food listings:', error);
      throw error;
    }
  }

  /**
   * Get a specific food listing by ID
   */
  async getFoodListing(id) {
    try {
      return await apiService.request(ENDPOINTS.FOODS.LISTING_DETAIL(id), { requiresAuth: true });
    } catch (error) {
      console.error('Error fetching food listing:', error);
      throw error;
    }
  }

  /**
   * Create a new food listing (for providers)
   */
  async createFoodListing(foodData) {
    try {
      return await apiService.request(ENDPOINTS.FOODS.LISTINGS, {
        method: 'POST',
        body: JSON.stringify(foodData),
        requiresAuth: true,
      });
    } catch (error) {
      console.error('Error creating food listing:', error);
      throw error;
    }
  }

  /**
   * Update a food listing
   */
  async updateFoodListing(id, foodData) {
    try {
      return await apiService.request(ENDPOINTS.FOODS.LISTING_DETAIL(id), {
        method: 'PUT',
        body: JSON.stringify(foodData),
        requiresAuth: true,
      });
    } catch (error) {
      console.error('Error updating food listing:', error);
      throw error;
    }
  }

  /**
   * Delete a food listing
   */
  async deleteFoodListing(id) {
    try {
      return await apiService.request(ENDPOINTS.FOODS.LISTING_DETAIL(id), {
        method: 'DELETE',
        requiresAuth: true,
      });
    } catch (error) {
      console.error('Error deleting food listing:', error);
      throw error;
    }
  }

  /**
   * Create a food reservation
   */
  async createReservation(reservationData) {
    try {
      // Transform the data to match backend expectations
      const transformedData = {
        food_listing_id: reservationData.food_listing,
        quantity_reserved: reservationData.quantity_reserved,
        special_instructions: reservationData.special_instructions || ''
      };
      
      return await apiService.request(ENDPOINTS.FOODS.RESERVATION_CREATE, {
        method: 'POST',
        body: JSON.stringify(transformedData),
        requiresAuth: true,
      });
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }
  }

  /**
   * Get user's reservations
   */
  async getUserReservations() {
    try {
      return await apiService.request(ENDPOINTS.FOODS.MY_RESERVATIONS, { requiresAuth: true });
    } catch (error) {
      console.error('Error fetching user reservations:', error);
      throw error;
    }
  }

  /**
   * Update reservation status (for providers)
   */
  async updateReservationStatus(reservationId, newStatus) {
    try {
      return await apiService.request(ENDPOINTS.FOODS.UPDATE_RESERVATION_STATUS(reservationId), {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
        requiresAuth: true,
      });
    } catch (error) {
      console.error('Error updating reservation status:', error);
      throw error;
    }
  }

  /**
   * Get food statistics
   */
  async getFoodStats() {
    try {
      return await apiService.request(ENDPOINTS.FOODS.STATS, { requiresAuth: true });
    } catch (error) {
      console.error('Error fetching food stats:', error);
      throw error;
    }
  }

  /**
   * Search food listings with advanced filters
   */
  async searchFoodListings(searchParams) {
    try {
      const params = new URLSearchParams();
      
      // Add search parameters
      Object.keys(searchParams).forEach(key => {
        if (searchParams[key] !== null && searchParams[key] !== undefined && searchParams[key] !== '') {
          params.append(key, searchParams[key]);
        }
      });
      
      const queryString = params.toString();
      const endpoint = queryString ? `${ENDPOINTS.FOODS.SEARCH}?${queryString}` : ENDPOINTS.FOODS.SEARCH;
      
      return await apiService.request(endpoint, { requiresAuth: true });
    } catch (error) {
      console.error('Error searching food listings:', error);
      throw error;
    }
  }

  /**
   * Get food listings by provider type
   */
  async getFoodListingsByProvider(providerType) {
    try {
      return await this.getAvailableFoodListings({ provider_type: providerType });
    } catch (error) {
      console.error('Error fetching food listings by provider:', error);
      throw error;
    }
  }

  /**
   * Get nearby food listings (placeholder for future geolocation feature)
   */
  async getNearbyFoodListings(latitude, longitude, radius = 10) {
    try {
      return await this.getAvailableFoodListings({
        latitude,
        longitude,
        distance_km: radius
      });
    } catch (error) {
      console.error('Error fetching nearby food listings:', error);
      throw error;
    }
  }

  /**
   * Get free food listings (discounted_price = 0)
   */
  async getFreeFoodListings() {
    try {
      return await this.getAvailableFoodListings({ is_free: 'true' });
    } catch (error) {
      console.error('Error fetching free food listings:', error);
      throw error;
    }
  }
}

// Export singleton instance
export default new FoodService();