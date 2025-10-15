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
    
    // Build headers properly
    let headers;
    if (options.requiresAuth) {
      headers = getAuthHeaders();
    } else {
      headers = { ...API_CONFIG.HEADERS };
    }
    
    // Merge any additional headers from options
    if (options.headers) {
      headers = { ...headers, ...options.headers };
    }

    const config = {
      method: options.method || 'GET',
      headers: headers,
      ...options
    };

    // Remove headers from options to avoid duplication
    delete config.headers;
    config.headers = headers;

    console.log('API Request:', {
      url,
      method: config.method,
      requiresAuth: options.requiresAuth,
      hasAuthHeader: !!config.headers.Authorization,
      authHeaderValue: config.headers.Authorization ? 'Present' : 'Missing',
      endpoint,
      headers: config.headers
    });

    try {
      const response = await fetch(url, config);
      
      // Handle token expiration
      if (response.status === 401 && options.requiresAuth) {
        console.log('Received 401, attempting token refresh...');
        const refreshed = await this.refreshToken();
        if (refreshed) {
          console.log('Token refreshed successfully, retrying request...');
          // Retry with new token - ensure we get fresh headers
          const newHeaders = getAuthHeaders();
          const newConfig = {
            ...config,
            headers: newHeaders
          };
          console.log('Retry request with new headers:', newHeaders);
          const retryResponse = await fetch(url, newConfig);
          return this.handleResponse(retryResponse);
        } else {
          console.log('Token refresh failed, logging out user');
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
      if (!refreshToken) {
        console.log('No refresh token available');
        return false;
      }

      console.log('Attempting token refresh...');
      const response = await fetch(buildUrl(ENDPOINTS.AUTH.REFRESH), {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Token refresh successful, new token:', data.access ? 'Present' : 'Missing');
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.access);
        
        // Verify the new token works
        const testResponse = await fetch(buildUrl(ENDPOINTS.AUTH.ME), {
          method: 'GET',
          headers: {
            ...API_CONFIG.HEADERS,
            'Authorization': `Bearer ${data.access}`
          }
        });
        
        if (testResponse.ok) {
          console.log('New token verified successfully');
          return true;
        } else {
          console.log('New token verification failed:', testResponse.status);
          return false;
        }
      } else {
        console.log('Token refresh failed:', response.status, response.statusText);
        return false;
      }
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

  /**
   * Logout against backend to blacklist refresh token
   */
  async logoutBackend() {
    try {
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      if (!refreshToken) return;
      await fetch(buildUrl(ENDPOINTS.AUTH.LOGOUT), {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify({ refresh_token: refreshToken })
      });
    } catch (e) {
      // swallow errors; frontend logout will still proceed
      console.warn('Backend logout failed:', e);
    }
  }

  // Authentication Methods
  async login(credentials) {
    return this.request(ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
      requiresAuth: false, // Login doesn't require authentication
    });
  }

  async register(userData) {
    return this.request(ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
      requiresAuth: false, // Registration doesn't require authentication
    });
  }

  async getAuthStatus() {
    return this.request(ENDPOINTS.AUTH.STATUS);
  }

  async getCurrentUser() {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      console.log('Current token:', token ? 'Present' : 'Missing');
      return this.request(ENDPOINTS.AUTH.ME, { requiresAuth: true });
    } catch (error) {
      console.error('getCurrentUser error:', error);
      throw error;
    }
  }

  async changePassword(passwordData) {
    return this.request(ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      method: 'POST',
      body: JSON.stringify(passwordData),
      requiresAuth: true,
    });
  }

  async updateProfile(profileData) {
    console.log('updateProfile called with:', profileData);
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    console.log('updateProfile token:', token ? 'Present' : 'Missing');
    
    return this.request(ENDPOINTS.USERS.UPDATE_MY_PROFILE, {
      method: 'PATCH',
      body: JSON.stringify(profileData),
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

  // AI Chat Methods
  async aiGetSessions() {
    return this.request(ENDPOINTS.AI_CHAT.SESSIONS, { requiresAuth: true });
  }

  async aiCreateSession() {
    return this.request(ENDPOINTS.AI_CHAT.NEW_SESSION, {
      method: 'POST',
      requiresAuth: true,
    });
  }

  async aiGetSessionDetail(id) {
    return this.request(ENDPOINTS.AI_CHAT.SESSION_DETAIL(id), { requiresAuth: true });
  }

  async aiSendMessage(message, sessionId = null) {
    return this.request(ENDPOINTS.AI_CHAT.SEND_MESSAGE, {
      method: 'POST',
      body: JSON.stringify({ message, session_id: sessionId }),
      requiresAuth: true,
    });
  }

  async aiMessageFeedback(messageId, rating, comment = '') {
    return this.request(ENDPOINTS.AI_CHAT.MESSAGE_FEEDBACK(messageId), {
      method: 'POST',
      body: JSON.stringify({ rating, comment }),
      requiresAuth: true,
    });
  }

  async aiStats() {
    return this.request(ENDPOINTS.AI_CHAT.STATS, { requiresAuth: true });
  }
}

// Export singleton instance
export default new ApiService();













