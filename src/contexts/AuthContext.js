import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/apiService';
import { STORAGE_KEYS } from '../config/api';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Make toast optional to avoid circular dependency issues
  let toast;
  try {
    toast = useToast();
  } catch (error) {
    console.warn('Toast context not available:', error.message);
    toast = { success: () => {}, error: () => {}, info: () => {} };
  }

  // Check for existing session on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
        const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        
        console.log('Auth check - savedUser:', !!savedUser);
        console.log('Auth check - accessToken:', !!accessToken);
        console.log('Auth check - refreshToken:', !!refreshToken);
        
        if (savedUser && accessToken) {
          // First try to refresh token to ensure it's valid
          if (refreshToken) {
            try {
              console.log('Attempting token refresh during auth check...');
              const refreshed = await apiService.refreshToken();
              if (refreshed) {
                console.log('Token refreshed successfully during auth check');
                // Now try to get current user with fresh token
                try {
                  const currentUser = await apiService.getCurrentUser();
                  console.log('Got current user after refresh:', currentUser);
                  setUser(currentUser);
                  setIsAuthenticated(true);
                  setupTokenRefresh();
                  return;
                } catch (userError) {
                  console.error('Failed to get current user after refresh:', userError);
                }
              }
            } catch (refreshError) {
              console.error('Token refresh failed during auth check:', refreshError);
            }
          }
          
          // If refresh failed or no refresh token, try with existing token
          try {
            console.log('Trying to get current user with existing token...');
            const currentUser = await apiService.getCurrentUser();
            console.log('Got current user with existing token:', currentUser);
            setUser(currentUser);
            setIsAuthenticated(true);
            setupTokenRefresh();
            return;
          } catch (error) {
            console.error('Failed to get current user with existing token:', error);
            // Both access and refresh tokens invalid, clear storage
            console.error('Token validation failed:', error);
            clearAuthData();
          }
        } else {
          console.log('No saved user or access token found');
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Set up automatic token refresh
  const setupTokenRefresh = () => {
    // Refresh token every 50 minutes (tokens typically expire in 60 minutes)
    const refreshInterval = setInterval(async () => {
      try {
        const refreshed = await apiService.refreshToken();
        if (!refreshed) {
          // Refresh failed, logout user
          clearAuthData();
          clearInterval(refreshInterval);
        }
      } catch (error) {
        console.error('Automatic token refresh failed:', error);
        clearAuthData();
        clearInterval(refreshInterval);
      }
    }, 50 * 60 * 1000); // 50 minutes

    // Store interval ID for cleanup
    window.tokenRefreshInterval = refreshInterval;
  };

  // Clear authentication data
  const clearAuthData = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    
    // Clear any existing refresh interval
    if (window.tokenRefreshInterval) {
      clearInterval(window.tokenRefreshInterval);
      window.tokenRefreshInterval = null;
    }
  };

  const login = async (loginData) => {
    try {
      console.log('AuthContext login called with:', loginData);
      const response = await apiService.login(loginData);
      console.log('AuthContext login response:', response);
      
      // Store tokens and user data
      if (response.access) {
        console.log('Storing access token:', response.access);
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.access);
      }
      if (response.refresh) {
        console.log('Storing refresh token:', response.refresh);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refresh);
      }
      if (response.user) {
        console.log('Storing user data:', response.user);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
        setUser(response.user);
      }
      
      setIsAuthenticated(true);
      console.log('Login successful, user authenticated');
      
      // Set up token refresh
      setupTokenRefresh();
      
      toast.success(`Welcome back, ${response.user.first_name}!`);
      return { success: true, user: response.user };
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed. Please try again.');
      throw new Error(error.message || 'Login failed. Please try again.');
    }
  };

  const register = async (registerData) => {
    try {
      const response = await apiService.register(registerData);
      
      // Store tokens and user data
      if (response.tokens) {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.tokens.access);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.tokens.refresh);
      }
      if (response.user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
        setUser(response.user);
      }
      
      setIsAuthenticated(true);
      
      // Set up token refresh
      setupTokenRefresh();
      
      toast.success(`Welcome to KindBite, ${response.user.first_name}! Your account has been created successfully.`);
      return { success: true, user: response.user };
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
      throw new Error(error.message || 'Registration failed. Please try again.');
    }
  };

  const logout = () => {
    // Attempt backend logout (blacklist refresh token) without blocking UI
    apiService.logoutBackend().finally(() => {
      // Clear all authentication data
      clearAuthData();
      // Show logout message
      toast.info('You have been logged out successfully.');
      // Redirect
      apiService.logout();
    });
  };

  const updateUser = (updatedUserData) => {
    const updatedUser = { ...user, ...updatedUserData };
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    return updatedUser;
  };

  const updateKindCoins = (amount) => {
    if (user) {
      const updatedUser = { ...user, kind_coins: (user.kind_coins || 0) + amount };
      setUser(updatedUser);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    updateKindCoins
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
