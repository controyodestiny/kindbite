import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // Check for existing session on app load
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const savedUser = localStorage.getItem('kindbite_user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        localStorage.removeItem('kindbite_user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (loginData) => {
    try {
      // Simulate API call - replace with actual authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data based on email (in real app, this would come from API)
      const mockUsers = {
        'restaurant@kindbite.com': {
          id: 1,
          firstName: 'John',
          lastName: 'Restaurant',
          email: 'restaurant@kindbite.com',
          userRole: 'restaurant',
          businessName: "Mama's Kitchen",
          location: 'Kampala, Uganda',
          phone: '+256 700 123 456',
          kindCoins: 340,
          joinDate: '2024-01-15',
          profileImage: null
        },
        'factory@kindbite.com': {
          id: 2,
          firstName: 'Sarah',
          lastName: 'Factory',
          email: 'factory@kindbite.com',
          userRole: 'factory',
          businessName: 'Uganda Food Industries',
          location: 'Kampala, Uganda',
          phone: '+256 700 234 567',
          kindCoins: 2840,
          joinDate: '2024-01-10',
          profileImage: null
        },
        'home@kindbite.com': {
          id: 3,
          firstName: 'Mary',
          lastName: 'Home',
          email: 'home@kindbite.com',
          userRole: 'home',
          businessName: 'The Nakasero Home',
          location: 'Kampala, Uganda',
          phone: '+256 700 345 678',
          kindCoins: 340,
          joinDate: '2024-01-20',
          profileImage: null
        },
        'user@kindbite.com': {
          id: 4,
          firstName: 'Roshni',
          lastName: 'L.',
          email: 'user@kindbite.com',
          userRole: 'end-user',
          businessName: null,
          location: 'Kampala, Uganda',
          phone: '+256 700 456 789',
          kindCoins: 245,
          joinDate: '2024-01-25',
          profileImage: null
        }
      };

      const userData = mockUsers[loginData.email] || {
        id: Date.now(),
        firstName: 'Demo',
        lastName: 'User',
        email: loginData.email,
        userRole: 'end-user',
        businessName: null,
        location: 'Kampala, Uganda',
        phone: '+256 700 000 000',
        kindCoins: 100,
        joinDate: new Date().toISOString().split('T')[0],
        profileImage: null
      };

      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('kindbite_user', JSON.stringify(userData));
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed. Please try again.');
    }
  };

  const register = async (registerData) => {
    try {
      // Simulate API call - replace with actual registration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newUser = {
        id: Date.now(),
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        email: registerData.email,
        userRole: registerData.userRole,
        businessName: registerData.businessName || null,
        location: registerData.location,
        phone: registerData.phone,
        kindCoins: 0,
        joinDate: new Date().toISOString().split('T')[0],
        profileImage: null
      };

      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('kindbite_user', JSON.stringify(newUser));
      
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Registration failed. Please try again.');
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('kindbite_user');
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('kindbite_user', JSON.stringify(updatedUser));
  };

  const updateKindCoins = (amount) => {
    if (user) {
      const updatedUser = { ...user, kindCoins: user.kindCoins + amount };
      setUser(updatedUser);
      localStorage.setItem('kindbite_user', JSON.stringify(updatedUser));
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
