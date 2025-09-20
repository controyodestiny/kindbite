/**
 * API Service for KindBite
 * Handles all HTTP requests to the backend
 */
import { API_CONFIG, ENDPOINTS, buildUrl, getAuthHeaders, STORAGE_KEYS } from '../config/api';

class ApiService {
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
      
      // Handle token expiration
      if (response.status === 401 && options.requiresAuth) {
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // Retry with new token
          config.headers = getAuthHeaders();
          const retryResponse = await fetch(url, config);
          return this.handleResponse(retryResponse);
        } else {
          // Refresh failed, logout user
          this.logout();
          throw new Error('Session expired. Please login again.');
        }
      }

      return this.handleResponse(response);
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  /**
   * Handle API response
   */
  async handleResponse(response) {
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      const error = new Error(data.message || data.detail || `HTTP ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  }

  /**
   * Refresh access token
   */
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      if (!refreshToken) return false;

      const response = await fetch(buildUrl(ENDPOINTS.AUTH.REFRESH), {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.access);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }

  /**
   * Logout user and clear tokens
   */
  logout() {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    window.location.href = '/';
  }

  // Authentication Methods
  async login(credentials) {
    return this.request(ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData) {
    return this.request(ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getAuthStatus() {
    return this.request(ENDPOINTS.AUTH.STATUS);
  }

  async getCurrentUser() {
    return this.request(ENDPOINTS.AUTH.ME, { requiresAuth: true });
  }

  async changePassword(passwordData) {
    return this.request(ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      method: 'POST',
      body: JSON.stringify(passwordData),
      requiresAuth: true,
    });
  }

  // User Methods
  async getUsers() {
    return this.request(ENDPOINTS.USERS.LIST, { requiresAuth: true });
  }

  async getUser(id) {
    return this.request(ENDPOINTS.USERS.DETAIL(id), { requiresAuth: true });
  }

  async updateCurrentUser(userData) {
    return this.request(ENDPOINTS.USERS.UPDATE_ME, {
      method: 'PATCH',
      body: JSON.stringify(userData),
      requiresAuth: true,
    });
  }

  async getProviders(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const endpoint = params ? `${ENDPOINTS.USERS.PROVIDERS}?${params}` : ENDPOINTS.USERS.PROVIDERS;
    return this.request(endpoint, { requiresAuth: true });
  }

  async getUserProfile() {
    return this.request(ENDPOINTS.USERS.MY_PROFILE, { requiresAuth: true });
  }

  async updateUserProfile(profileData) {
    return this.request(ENDPOINTS.USERS.UPDATE_MY_PROFILE, {
      method: 'PATCH',
      body: JSON.stringify(profileData),
      requiresAuth: true,
    });
  }
}

// Export singleton instance
export default new ApiService();

