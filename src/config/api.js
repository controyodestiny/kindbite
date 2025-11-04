/**
 * API Configuration for KindBite
 * Centralized configuration for all API endpoints and settings
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api',
  TIMEOUT: 10000, // 10 seconds
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'kindbite_access_token',
  REFRESH_TOKEN: 'kindbite_refresh_token',
  USER: 'kindbite_user',
};

// API Endpoints
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login/',
    REGISTER: '/auth/register/',
    REFRESH: '/auth/token/refresh/',
    LOGOUT: '/auth/logout/',
    STATUS: '/auth/status/',
    ME: '/auth/me/',
    CHANGE_PASSWORD: '/auth/change-password/',
  },
  USERS: {
    LIST: '/users/list/',
    DETAIL: (id) => `/users/${id}/`,
    UPDATE_ME: '/users/profile/update/',
    PROVIDERS: '/users/list/', // Use list endpoint for providers
    MY_PROFILE: '/users/profile/',
    UPDATE_MY_PROFILE: '/users/profile/update/',
  },
  FOODS: {
    LISTINGS: '/foods/listings/',
    LISTING_DETAIL: (id) => `/foods/listings/${id}/`,
    CREATE_LISTING: '/foods/listings/',
    UPDATE_LISTING: (id) => `/foods/listings/${id}/`,
    DELETE_LISTING: (id) => `/foods/listings/${id}/`,
    SEARCH: '/foods/listings/available/', // Use available endpoint for search
    NEARBY: '/foods/listings/available/', // Use available endpoint for nearby
    AVAILABLE: '/foods/listings/available/',
    RESERVATIONS: '/foods/reservations/',
    RESERVATION_CREATE: '/foods/reservations/',
    MY_RESERVATIONS: '/foods/reservations/my/',
    UPDATE_RESERVATION_STATUS: (id) => `/foods/reservations/${id}/status/`,
    STATS: '/foods/stats/',
    UPLOAD_IMAGE: (id) => `/foods/images/${id}/upload/`,
    DELETE_IMAGE: (id) => `/foods/images/${id}/delete/`,
  },
  AI_CHAT: {
    SESSIONS: '/ai-chat/sessions/',
    NEW_SESSION: '/ai-chat/sessions/new/',
    SESSION_DETAIL: (id) => `/ai-chat/sessions/${id}/`,
    SEND_MESSAGE: '/ai-chat/send/',
    MESSAGE_FEEDBACK: (id) => `/ai-chat/messages/${id}/feedback/`,
    STATS: '/ai-chat/stats/',
  },
  NOTIFICATIONS: {
    LIST: '/notifications/list/',
    DETAIL: (id) => `/notifications/list/${id}/`,
    MARK_READ: (id) => `/notifications/list/${id}/mark_as_read/`,
    MARK_ALL_READ: '/notifications/list/mark_all_as_read/',
    UNREAD: '/notifications/list/unread/',
    STATS: '/notifications/list/stats/',
    PREFERENCES: '/notifications/preferences/',
    UPDATE_PREFERENCES: '/notifications/preferences/update/',
    SEND: '/notifications/send/',
    TEMPLATES: '/notifications/templates/',
  },
  PAYMENTS: {
    METHODS: '/payments/methods/',
    METHOD_DETAIL: (id) => `/payments/methods/${id}/`,
    SET_DEFAULT: (id) => `/payments/methods/${id}/set_default/`,
    DEACTIVATE: (id) => `/payments/methods/${id}/deactivate/`,
    INTENTS: '/payments/intents/',
    INTENT_DETAIL: (id) => `/payments/intents/${id}/`,
    CONFIRM: (id) => `/payments/intents/${id}/confirm/`,
    CREATE_INTENT: '/payments/create-intent/',
    PROCESS: '/payments/process/',
    TRANSACTIONS: '/payments/transactions/',
    TRANSACTION_DETAIL: (id) => `/payments/transactions/${id}/`,
    REFUNDS: '/payments/refunds/',
    REFUND_DETAIL: (id) => `/payments/refunds/${id}/`,
    CREATE_REFUND: '/payments/create-refund/',
    STATS: '/payments/stats/',
    KINDCOINS: '/payments/kindcoins/',
    KINDCOINS_TRANSACTIONS: '/payments/kindcoins/transactions/',
    PESAPAL: {
      INITIATE: '/payments/pesapal/initiate/',
      IPN: '/payments/pesapal/ipn/',
      STATUS: (orderTrackingId) => `/payments/pesapal/status/${orderTrackingId}/`,
    },
  },
};

/**
 * Build full URL for an endpoint
 * @param {string} endpoint - The endpoint path
 * @returns {string} Full URL
 */
export function buildUrl(endpoint) {
  // Remove leading slash if present
  const cleanEndpoint = (endpoint && typeof endpoint === 'string' && endpoint.startsWith && endpoint.startsWith('/')) ? endpoint.slice(1) : endpoint;
  return `${API_CONFIG.BASE_URL}/${cleanEndpoint}`;
}

/**
 * Get authentication headers
 * @returns {Object} Headers with authorization token
 */
export function getAuthHeaders() {
  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  console.log('getAuthHeaders - Token:', token ? 'Present' : 'Missing');
  console.log('getAuthHeaders - Token value:', token);
  console.log('getAuthHeaders - Storage key:', STORAGE_KEYS.ACCESS_TOKEN);
  console.log('getAuthHeaders - All localStorage keys:', Object.keys(localStorage));
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  console.log('getAuthHeaders - Final headers:', headers);
  console.log('getAuthHeaders - Authorization header:', headers.Authorization);
  return headers;
}

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has valid token
 */
export function isAuthenticated() {
  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  return !!token;
}

/**
 * Get stored user data
 * @returns {Object|null} User data or null
 */
export function getStoredUser() {
  try {
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error parsing stored user data:', error);
    return null;
  }
}

/**
 * Store user data
 * @param {Object} userData - User data to store
 */
export function storeUser(userData) {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
}

/**
 * Clear all stored data
 */
export function clearStoredData() {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}

/**
 * Store authentication tokens
 * @param {string} accessToken - Access token
 * @param {string} refreshToken - Refresh token
 */
export function storeTokens(accessToken, refreshToken) {
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
}