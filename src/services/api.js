const API_BASE_URL = 'http://localhost:8000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('authToken');
    this.baseURL = API_BASE_URL;
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  async request(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const config = {
        headers: this.getHeaders(),
        ...options,
      };

      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Authentication
  async login(credentials) {
    return this.request('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData) {
    return this.request('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    this.clearToken();
    return { success: true };
  }

  // User Profile
  async getProfile() {
    return this.request('/profile/');
  }

  async updateProfile(profileData) {
    return this.request('/profile/', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async getUserImpact() {
    return this.request('/user-impact/');
  }

  async getUserStatistics() {
    return this.request('/user-statistics/');
  }

  // Food Listings
  async getFoodListings(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/food-listings/?${queryString}`);
  }

  async searchFood(searchParams) {
    return this.request('/food-search/', {
      method: 'POST',
      body: JSON.stringify(searchParams),
    });
  }

  async getNearbyFood(lat, lng, distance = 10) {
    return this.request(`/nearby-food/?lat=${lat}&lng=${lng}&distance=${distance}`);
  }

  async getFeaturedFood() {
    return this.request('/featured-food/');
  }

  // Food Interactions
  async likeFood(foodId) {
    return this.request(`/food-listings/${foodId}/like/`, {
      method: 'POST',
    });
  }

  async unlikeFood(foodId) {
    return this.request(`/food-listings/${foodId}/unlike/`, {
      method: 'DELETE',
    });
  }

  async getLikedFood() {
    return this.request('/liked-food/');
  }

  // Reservations
  async createReservation(reservationData) {
    return this.request('/reservations/', {
      method: 'POST',
      body: JSON.stringify(reservationData),
    });
  }

  async getUserReservations() {
    return this.request('/user-reservations/');
  }

  // Notifications
  async getNotifications() {
    return this.request('/notifications/');
  }

  async markNotificationRead(notificationId) {
    return this.request(`/notifications/${notificationId}/read/`, {
      method: 'PUT',
    });
  }

  async markAllNotificationsRead() {
    return this.request('/notifications/mark-all-read/', {
      method: 'PUT',
    });
  }

  // AI Chat
  async sendAIMessage(message) {
    try {
      const response = await this.request('/ai-chat/', {
        method: 'POST',
        body: JSON.stringify({ message }),
      });
      
      // The backend creates both user and AI messages
      // We need to get the AI response from the response data
      return response;
    } catch (error) {
      console.error('AI Chat API error:', error);
      throw error;
    }
  }

  async getAIChatHistory() {
    return this.request('/ai-chat/history/');
  }

  // Conversations & Messages
  async getConversations() {
    return this.request('/conversations/');
  }

  async getConversationMessages(conversationId) {
    return this.request(`/conversations/${conversationId}/messages/`);
  }

  async sendMessage(conversationId, messageData) {
    return this.request(`/conversations/${conversationId}/messages/`, {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  async markConversationAsRead(conversationId) {
    return this.request(`/conversations/${conversationId}/mark-read/`, {
      method: 'PUT',
    });
  }

  // Dashboard
  async getDashboardStats() {
    return this.request('/dashboard/stats/');
  }

  async getProviderAnalytics() {
    return this.request('/provider-analytics/');
  }

  // Mock Data for Development
  getMockData(type) {
    switch (type) {
      case 'food-listings':
        return this.getMockFoodListings();
      case 'conversations':
        return this.getMockConversations();
      case 'notifications':
        return this.getMockNotifications();
      case 'profile':
        return this.getMockProfile();
      case 'user-stats':
        return this.getMockUserStats();
      case 'users':
        return this.getMockUsers();
      case 'reviews':
        return this.getMockReviews();
      case 'reservations':
        return this.getMockReservations();
      default:
        return [];
    }
  }

  getMockFoodListings() {
    return [
      {
        id: 1,
        name: "Fresh Sourdough Bread",
        restaurant: "Mama's Kitchen",
        provider: "home",
        image: "🍞",
        description: "Freshly baked sourdough bread, made with organic flour and natural starter. Perfect for sandwiches or toast.",
        originalPrice: 5000,
        discountedPrice: 0,
        quantity: 8,
        distance: "0.5 km",
        pickupWindow: "2:00 PM - 6:00 PM",
        rating: 4.9,
        co2Saved: 2.4,
        dietary: ["Vegetarian", "Vegan"],
        isLiked: false,
        likesCount: 23,
        category: "Bakery"
      },
      {
        id: 2,
        name: "Mixed Vegetable Stir Fry",
        restaurant: "Green Market Kampala",
        provider: "supermarket",
        image: "🥬",
        description: "Fresh mixed vegetables including bell peppers, broccoli, carrots, and snow peas. Perfect for healthy cooking.",
        originalPrice: 8000,
        discountedPrice: 2000,
        quantity: 15,
        distance: "1.2 km",
        pickupWindow: "4:00 PM - 8:00 PM",
        rating: 4.7,
        co2Saved: 1.8,
        dietary: ["Vegetarian", "Vegan", "Gluten-Free"],
        isLiked: true,
        likesCount: 45,
        category: "Produce"
      },
      {
        id: 3,
        name: "Chicken Curry with Rice",
        restaurant: "Kampala Deli",
        provider: "restaurant",
        image: "🍛",
        description: "Delicious chicken curry made with aromatic spices, served with fluffy basmati rice. Made fresh this morning.",
        originalPrice: 15000,
        discountedPrice: 5000,
        quantity: 6,
        distance: "0.8 km",
        pickupWindow: "6:00 PM - 9:00 PM",
        rating: 4.8,
        co2Saved: 3.2,
        dietary: ["Halal"],
        isLiked: false,
        likesCount: 67,
        category: "Main Course"
      },
      {
        id: 4,
        name: "Fresh Fruit Basket",
        restaurant: "Shoprite Kampala",
        provider: "supermarket",
        image: "🍎",
        description: "Assorted fresh fruits including apples, bananas, oranges, and mangoes. Perfect for smoothies or healthy snacking.",
        originalPrice: 12000,
        discountedPrice: 0,
        quantity: 12,
        distance: "1.5 km",
        pickupWindow: "5:00 PM - 7:00 PM",
        rating: 4.6,
        co2Saved: 2.1,
        dietary: ["Vegetarian", "Vegan", "Gluten-Free"],
        isLiked: true,
        likesCount: 89,
        category: "Fruits"
      },
      {
        id: 5,
        name: "Chocolate Croissants",
        restaurant: "Sweet Dreams Bakery",
        provider: "bakery",
        image: "🥐",
        description: "Buttery, flaky croissants filled with rich chocolate. Baked fresh this morning, perfect for breakfast or dessert.",
        originalPrice: 3000,
        discountedPrice: 1000,
        quantity: 20,
        distance: "0.3 km",
        pickupWindow: "8:00 AM - 12:00 PM",
        rating: 4.9,
        co2Saved: 1.5,
        dietary: ["Vegetarian"],
        isLiked: false,
        likesCount: 156,
        category: "Pastries"
      },
      {
        id: 6,
        name: "Grilled Fish with Vegetables",
        restaurant: "The Green Plate",
        provider: "restaurant",
        image: "🐟",
        description: "Fresh tilapia grilled to perfection, served with seasonal vegetables and lemon herb sauce.",
        originalPrice: 18000,
        discountedPrice: 8000,
        quantity: 4,
        distance: "1.0 km",
        pickupWindow: "7:00 PM - 10:00 PM",
        rating: 4.7,
        co2Saved: 2.8,
        dietary: ["Gluten-Free"],
        isLiked: true,
        likesCount: 78,
        category: "Seafood"
      }
    ];
  }

  getMockConversations() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    
    return [
      {
        id: 1,
        name: "Sarah's Kitchen",
        role: "Home Chef",
        avatar: "👩‍🍳",
        lastMessage: "The bread is ready for pickup! 🍞",
        lastMessageTime: new Date(today.getTime() + 2 * 60 * 60 * 1000).toISOString(),
        unreadCount: 2,
        messages: [
          {
            id: 1,
            sender: 'other',
            text: "Hey there! 👋 I just finished baking and have some extra bread that I'd hate to see go to waste. Are you interested?",
            timestamp: "2:30 PM",
            fullTimestamp: new Date(today.getTime() + 2 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 2,
            sender: 'user',
            text: "That sounds amazing! What kind of bread do you have available?",
            timestamp: "2:32 PM",
            fullTimestamp: new Date(today.getTime() + 2 * 60 * 60 * 1000 + 2 * 60 * 1000).toISOString()
          },
          {
            id: 3,
            sender: 'other',
            text: "I made whole wheat, sourdough, and some sweet rolls with cinnamon! They're all fresh from this morning. The sourdough is my personal favorite 😊",
            timestamp: "2:33 PM",
            fullTimestamp: new Date(today.getTime() + 2 * 60 * 60 * 1000 + 3 * 60 * 1000).toISOString()
          },
          {
            id: 4,
            sender: 'user',
            text: "Oh wow, that sounds delicious! I'd love the sourdough. When would be a good time to pick it up?",
            timestamp: "2:35 PM",
            fullTimestamp: new Date(today.getTime() + 2 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString()
          },
          {
            id: 5,
            sender: 'other',
            text: "Perfect! I'm usually around until 8 PM today. I'm at 123 Main St, right near the park. Just let me know when you're on your way! 🏠",
            timestamp: "2:36 PM",
            fullTimestamp: new Date(today.getTime() + 2 * 60 * 60 * 1000 + 6 * 60 * 1000).toISOString()
          },
          {
            id: 6,
            sender: 'other',
            text: "The bread is ready for pickup! 🍞",
            timestamp: "4:15 PM",
            fullTimestamp: new Date(today.getTime() + 4 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString()
          }
        ]
      },
      {
        id: 2,
        name: "Green Market",
        role: "Supermarket",
        avatar: "🛒",
        lastMessage: "Fresh produce clearance starting at 6 PM 🥬",
        lastMessageTime: new Date(today.getTime() + 1 * 60 * 60 * 1000).toISOString(),
        unreadCount: 0,
        messages: [
          {
            id: 1,
            sender: 'other',
            text: "Hi! We have surplus vegetables and fruits today. Would you like to know what's available? 🥬",
            timestamp: "1:20 PM",
            fullTimestamp: new Date(today.getTime() + 1 * 60 * 60 * 1000 + 20 * 60 * 1000).toISOString()
          },
          {
            id: 2,
            sender: 'user',
            text: "Yes, please! What do you have?",
            timestamp: "1:22 PM",
            fullTimestamp: new Date(today.getTime() + 1 * 60 * 60 * 1000 + 22 * 60 * 1000).toISOString()
          },
          {
            id: 3,
            sender: 'other',
            text: "We have tomatoes, cucumbers, bell peppers, apples, and bananas. All fresh and discounted! 🍎",
            timestamp: "1:25 PM",
            fullTimestamp: new Date(today.getTime() + 1 * 60 * 60 * 1000 + 25 * 60 * 1000).toISOString()
          },
          {
            id: 4,
            sender: 'user',
            text: "Perfect! When can I pick them up?",
            timestamp: "1:27 PM",
            fullTimestamp: new Date(today.getTime() + 1 * 60 * 60 * 1000 + 27 * 60 * 1000).toISOString()
          },
          {
            id: 5,
            sender: 'other',
            text: "Fresh produce clearance starting at 6 PM 🥬",
            timestamp: "1:30 PM",
            fullTimestamp: new Date(today.getTime() + 1 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString()
          }
        ]
      }
    ];
  }

  getMockNotifications() {
    return [
      {
        id: 1,
        message: "New food available near you! Fresh bread from Sarah's Kitchen",
        timestamp: "2 minutes ago",
        isRead: false
      },
      {
        id: 2,
        message: "Your reservation for chicken curry has been confirmed",
        timestamp: "1 hour ago",
        isRead: true
      },
      {
        id: 3,
        message: "You earned 25 KindCoins for rescuing food!",
        timestamp: "3 hours ago",
        isRead: true
      }
    ];
  }

  getMockProfile() {
    return {
      name: "John Doe",
      occupation: "Food Enthusiast",
      location: "Kampala, Uganda",
      bio: "Passionate about reducing food waste and discovering amazing local food!",
      email: "john.doe@email.com",
      phone: "+256 123 456 789",
      dietaryPreferences: ["Vegetarian", "Gluten-Free"],
      favoriteCuisines: ["Italian", "Indian", "Local"],
      joinDate: "2024-01-15",
      profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
    };
  }

  getMockUserStats() {
    return {
      kindCoins: 245,
      mealsRescued: 47,
      co2Saved: 112.8,
      waterSaved: 1175,
      communityRank: "Eco Warrior",
      streakDays: 12,
      totalDonations: 8,
      favoriteFood: "Sourdough Bread"
    };
  }

  getMockUsers() {
    return [
      {
        id: 1,
        username: "john_doe",
        email: "john.doe@email.com",
        role: "end-user",
        kind_coins: 245,
        is_verified: true,
        created_at: "2024-01-15T10:30:00Z"
      },
      {
        id: 2,
        username: "sarah_kitchen",
        email: "sarah@mamaskitchen.com",
        role: "restaurant",
        kind_coins: 1200,
        is_verified: true,
        created_at: "2024-01-10T08:15:00Z"
      },
      {
        id: 3,
        username: "green_market",
        email: "info@greenmarket.ug",
        role: "supermarket",
        kind_coins: 890,
        is_verified: true,
        created_at: "2024-01-05T14:20:00Z"
      },
      {
        id: 4,
        username: "mike_verifier",
        email: "mike@foodverify.ug",
        role: "verifier",
        kind_coins: 2100,
        is_verified: true,
        created_at: "2024-01-01T09:45:00Z"
      }
    ];
  }

  getMockReviews() {
    return [
      {
        id: 1,
        user: "john_doe",
        food_listing: "Fresh Sourdough Bread",
        rating: 5,
        comment: "Amazing bread! Very fresh and delicious.",
        created_at: "2024-01-20T15:30:00Z"
      },
      {
        id: 2,
        user: "jane_smith",
        food_listing: "Mixed Vegetable Stir Fry",
        rating: 4,
        comment: "Great vegetables, very fresh.",
        created_at: "2024-01-19T12:15:00Z"
      },
      {
        id: 3,
        user: "bob_wilson",
        food_listing: "Chicken Curry with Rice",
        rating: 5,
        comment: "Excellent curry, highly recommend!",
        created_at: "2024-01-18T18:45:00Z"
      }
    ];
  }

  getMockReservations() {
    return [
      {
        id: 1,
        user: "john_doe",
        food_listing: "Fresh Sourdough Bread",
        quantity: 2,
        status: "confirmed",
        pickup_time: "2024-01-21T16:00:00Z",
        created_at: "2024-01-20T10:30:00Z"
      },
      {
        id: 2,
        user: "jane_smith",
        food_listing: "Mixed Vegetable Stir Fry",
        quantity: 1,
        status: "pending",
        pickup_time: "2024-01-21T18:00:00Z",
        created_at: "2024-01-20T14:15:00Z"
      },
      {
        id: 3,
        user: "bob_wilson",
        food_listing: "Chicken Curry with Rice",
        quantity: 3,
        status: "completed",
        pickup_time: "2024-01-19T19:00:00Z",
        created_at: "2024-01-19T11:20:00Z"
      }
    ];
  }

  // Fallback method for development
  async getDataWithFallback(endpoint, mockType) {
    try {
      // Try to get data from API first
      const apiData = await this.request(endpoint);
      console.log(`API data received for ${endpoint}:`, apiData);
      return apiData;
    } catch (error) {
      console.warn(`API failed for ${endpoint}, using mock data:`, error);
      // Return mock data as fallback
      return this.getMockData(mockType);
    }
  }

  // Save data to localStorage for persistence
  saveToLocalStorage(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  // Load data from localStorage
  loadFromLocalStorage(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return null;
    }
  }

  // Admin methods
  async deleteItem(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  async createItem(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateItem(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
}

const apiService = new ApiService();
export default apiService; 