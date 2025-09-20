/**
 * API configuration for KindBite frontend
 * Centralized API settings and endpoints
 */

// API Base Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8002/api/v1',
  TIMEOUT: parseInt(process.env.REACT_APP_TIMEOUT) || 10000,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
};

// Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'kindbite_access_token',
  REFRESH_TOKEN: 'kindbite_refresh_token',
  USER: process.env.REACT_APP_USER_STORAGE_KEY || 'kindbite_user',
};

// API Endpoints
export const ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login/',
    REGISTER: '/auth/register/',
    LOGOUT: '/auth/logout/',
    REFRESH: '/auth/token/refresh/',
    ME: '/auth/me/',
    STATUS: '/auth/status/',
    CHANGE_PASSWORD: '/auth/password/change/',
    RESET_PASSWORD: '/auth/password/reset/',
  },
  
  // Users
  USERS: {
    LIST: '/users/',
    DETAIL: (id) => `/users/${id}/`,
    ME: '/users/me/',
    UPDATE_ME: '/users/update_me/',
    PROVIDERS: '/users/providers/',
    PROFILES: '/users/profiles/',
    MY_PROFILE: '/users/profiles/my_profile/',
    UPDATE_MY_PROFILE: '/users/profiles/update_my_profile/',
  }
};

// Helper function to build full URL
export const buildUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  if (token) {
    return {
      ...API_CONFIG.HEADERS,
      'Authorization': `Bearer ${token}`,
    };
  }
  return API_CONFIG.HEADERS;
};
