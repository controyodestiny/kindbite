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
  const toast = useToast();

  // Check for existing session on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
        const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        
        if (savedUser && accessToken) {
          // Verify token is still valid
          try {
            const currentUser = await apiService.getCurrentUser();
            setUser(currentUser);
            setIsAuthenticated(true);
          } catch (error) {
            // Token invalid, clear storage
            console.error('Token validation failed:', error);
            localStorage.removeItem(STORAGE_KEYS.USER);
            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (loginData) => {
    try {
      const response = await apiService.login(loginData);
      
      // Store tokens and user data
      if (response.access) {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.access);
      }
      if (response.refresh) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refresh);
      }
      if (response.user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
        setUser(response.user);
      }
      
      setIsAuthenticated(true);
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
      toast.success(`Welcome to KindBite, ${response.user.first_name}! Your account has been created successfully.`);
      return { success: true, user: response.user };
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
      throw new Error(error.message || 'Registration failed. Please try again.');
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    toast.info('You have been logged out successfully.');
  };

  const updateUser = async (updates) => {
    try {
      const response = await apiService.updateCurrentUser(updates);
      const updatedUser = { ...user, ...response };
      setUser(updatedUser);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
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
