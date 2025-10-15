import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useToast } from './contexts/ToastContext';
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';
import Sidebar from './components/layout/Sidebar';
import AIChat from './components/features/AIChat';
import FoodModal from './components/features/FoodModal';
import AuthModal from './components/auth/AuthModal';
import WelcomeScreen from './components/auth/WelcomeScreen';
import FoodManagementModal from './components/food/FoodManagementModal';
import HomeView from './views/HomeView';
import SearchView from './views/SearchView';
import CommunityView from './views/CommunityView';
import PointsView from './views/PointsView';
import ProfileView from './views/ProfileView';
import AboutView from './views/AboutView';
import ReservationsView from './views/ReservationsView';
import ProviderReservationsView from './views/ProviderReservationsView';
import MyFoodListingsView from './views/MyFoodListingsView';
import PaymentModal from './components/payment/PaymentModal';
import foodService from './services/foodService';
import apiService from './services/apiService';
import emailService from './services/emailService';
import paymentService from './services/paymentService';

// Mock data
  const foodListings = [
    {
      id: 1,
      restaurant: "Mama's Kitchen",
      name: "Mixed Rice & Chicken",
      description: "Delicious local rice with grilled chicken and vegetables",
      originalPrice: 15000,
      discountedPrice: 5000,
      quantity: 8,
      rating: 4.8,
      distance: "0.3 km",
      pickupWindow: "5:00 PM - 7:00 PM",
      dietary: ["Halal", "Gluten-Free"],
      image: "🍛",
      co2Saved: 2.4,
      provider: "restaurant"
    },
    {
      id: 2,
      restaurant: "The Nakasero Home",
      name: "Vegetarian Combo",
      description: "Fresh salad, soup, and bread rolls from home kitchen",
      originalPrice: 12000,
      discountedPrice: 0,
      quantity: 12,
      rating: 4.6,
      distance: "0.7 km",
      pickupWindow: "6:00 PM - 8:00 PM",
      dietary: ["Vegetarian", "Vegan"],
      image: "🥗",
      co2Saved: 1.8,
      provider: "home"
    },
    {
      id: 3,
      restaurant: "Uganda Food Industries",
      name: "Bread & Pastries - End of Day",
      description: "Fresh bread, rolls, and pastries from today's production",
      originalPrice: 8000,
      discountedPrice: 2000,
      quantity: 25,
      rating: 4.5,
      distance: "2.1 km",
      pickupWindow: "4:00 PM - 6:00 PM",
      dietary: ["Contains Gluten"],
      image: "🍞",
      co2Saved: 1.6,
      provider: "factory"
    },
    {
      id: 4,
      restaurant: "Shoprite Kampala",
      name: "Fresh Produce Clearance",
      description: "Slightly overripe fruits and vegetables, perfect for cooking",
      originalPrice: 5000,
      discountedPrice: 1500,
      quantity: 40,
      rating: 4.3,
      distance: "1.8 km",
      pickupWindow: "7:00 PM - 9:00 PM",
      dietary: ["Organic", "Vegetarian", "Vegan"],
      image: "🥕",
      co2Saved: 2.8,
      provider: "supermarket"
    },
    {
      id: 5,
      restaurant: "Corner Café & Bakery",
      name: "Coffee Shop Surplus",
      description: "Sandwiches, pastries, and salads from today's café service",
      originalPrice: 12000,
      discountedPrice: 3000,
      quantity: 18,
      rating: 4.6,
      distance: "0.9 km",
      pickupWindow: "5:30 PM - 7:30 PM",
      dietary: ["Vegetarian Options"],
      image: "🥪",
      co2Saved: 2.1,
      provider: "retail"
    }
  ];

const KindBiteAppContent = () => {
  const { user, isAuthenticated, login, register, logout, updateKindCoins } = useAuth();
  const toast = useToast();
  
  // State management
  const [currentView, setCurrentView] = useState('home');
  const [selectedFood, setSelectedFood] = useState(null);
  const [notifications, setNotifications] = useState(3);
  const [showAIChat, setShowAIChat] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [showFoodManagement, setShowFoodManagement] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [menuSticky, setMenuSticky] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [aiMessages, setAiMessages] = useState([]);
  const [aiInput, setAiInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [userFoodListings, setUserFoodListings] = useState([]);
  const [allFoodListings, setAllFoodListings] = useState([]);
  const [isLoadingFoods, setIsLoadingFoods] = useState(false);
  const [userStats, setUserStats] = useState(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedReservationForPayment, setSelectedReservationForPayment] = useState(null);

  // Responsive screen detection
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024); // lg breakpoint
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Handle food management modal opening
  useEffect(() => {
    if (currentView === 'food-management') {
      setShowFoodManagement(true);
      // Reset view to home after opening modal
      setCurrentView('home');
    }
  }, [currentView]);

  // Handle custom event for opening food management modal
  useEffect(() => {
    const handleOpenFoodManagement = () => {
      setShowFoodManagement(true);
    };

    window.addEventListener('openFoodManagement', handleOpenFoodManagement);
    
    return () => window.removeEventListener('openFoodManagement', handleOpenFoodManagement);
  }, []);

  // Load data based on user role and current view
  useEffect(() => {
    if (currentView === 'search' && user && isAuthenticated) {
      loadAllFoods();
    }
  }, [currentView, user, isAuthenticated]);

  // Load role-specific data when home view is accessed
  useEffect(() => {
    if (currentView === 'home' && user && isAuthenticated) {
      loadUserStats();
      
      // Load different food data based on user role
      if (user.user_role === 'end-user') {
        // Food seekers see all available foods from providers
        loadAllFoods();
      } else {
        // Providers and admins see their own listings
        loadUserFoodListings();
      }
    }
  }, [currentView, user, isAuthenticated]);

  // Helper functions
  const sendAIMessage = () => {
    if (!aiInput.trim()) return;
    const userMessage = { sender: 'user', text: aiInput, timestamp: new Date() };
    setAiMessages(prev => [...prev, userMessage]);
    setTimeout(() => {
      const aiResponse = { 
        sender: 'ai', 
        text: `I can help you with KindBite! For "${aiInput}", I recommend checking nearby restaurants or connecting with a food ambassador in your area.`, 
        timestamp: new Date() 
      };
      setAiMessages(prev => [...prev, aiResponse]);
    }, 1000);
    setAiInput('');
  };

  const handleReserve = async (food) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    
    try {
      // Create reservation
      const reservationData = {
        food_listing: food.id,
        quantity_reserved: 1, // Default quantity
        special_instructions: ''
      };

      const reservation = await foodService.createReservation(reservationData);
      
      // Send email notifications
      await emailService.sendReservationConfirmation(reservation);
      await emailService.sendNewReservationNotification(reservation);
      
      // Dispatch event to refresh provider reservations
      window.dispatchEvent(new CustomEvent('reservationCreated'));
      
      // Show payment modal
      setSelectedReservationForPayment(reservation);
      setShowPaymentModal(true);
      
      toast.success('Reservation created successfully! Please complete payment.');
    } catch (error) {
      console.error('Error creating reservation:', error);
      toast.error('Failed to create reservation. Please try again.');
    }
    
    setSelectedFood(null);
  };

  const handlePaymentSuccess = async (reservation) => {
    try {
      // Update reservation status to confirmed
      // This would be an API call to update the reservation status
      
      // Send confirmation email
      await emailService.sendReservationStatusUpdate(reservation, 'confirmed');
      
      // Award KindCoins
      updateKindCoins(10);
      
      // Dispatch event to refresh provider reservations
      window.dispatchEvent(new CustomEvent('reservationUpdated'));
      
      toast.success('Payment completed! Reservation confirmed.');
    } catch (error) {
      console.error('Error processing payment success:', error);
      toast.error('Payment completed but there was an error updating the reservation.');
    }
  };

  const handleAddFood = async (newFood, imageFiles = []) => {
    try {
      // Call the API to create the food listing
      const createdFood = await foodService.createFoodListing(newFood);
      
      // Upload images if any were selected
      if (imageFiles && imageFiles.length > 0) {
        try {
          for (const file of imageFiles) {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('alt_text', file.name);
            formData.append('is_primary', imageFiles.indexOf(file) === 0); // First image is primary

            await fetch(
              `http://localhost:8000/api/foods/images/${createdFood.id}/upload/`,
              {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('kindbite_access_token')}`,
                },
                body: formData,
              }
            );
          }
          toast.success('Food item and images uploaded successfully!');
        } catch (imageError) {
          console.error('Error uploading images:', imageError);
          toast.success('Food item added successfully, but there was an error uploading images.');
        }
      } else {
        toast.success('Food item added successfully!');
      }
      
      // Add to local state only
      setUserFoodListings(prev => [...prev, createdFood]);
      
      // Trigger a refresh event for MyFoodListingsView to reload its data
      window.dispatchEvent(new CustomEvent('refreshMyFoodListings'));
      
    } catch (error) {
      console.error('Error adding food:', error);
      toast.error(error.message || 'Failed to add food item. Please try again.');
    }
  };

  const handleUpdateFood = async (updatedFood) => {
    try {
      // Call the API to update the food listing
      const updated = await foodService.updateFoodListing(updatedFood.id, updatedFood);
      
      // Update local state
      setUserFoodListings(prev => 
        prev.map(food => food.id === updatedFood.id ? updated : food)
      );
      
      // Trigger a refresh event for MyFoodListingsView to reload its data
      window.dispatchEvent(new CustomEvent('refreshMyFoodListings'));
      
      toast.success('Food item updated successfully!');
    } catch (error) {
      console.error('Error updating food:', error);
      toast.error(error.message || 'Failed to update food item. Please try again.');
    }
  };

  const handleDeleteFood = async (foodId) => {
    try {
      // Call the API to delete the food listing
      await foodService.deleteFoodListing(foodId);
      
      // Update local state
      setUserFoodListings(prev => prev.filter(food => food.id !== foodId));
      
      // Trigger a refresh event for MyFoodListingsView to reload its data
      window.dispatchEvent(new CustomEvent('refreshMyFoodListings'));
      
      toast.success('Food item deleted successfully!');
    } catch (error) {
      console.error('Error deleting food:', error);
      toast.error(error.message || 'Failed to delete food item. Please try again.');
    }
  };

  // Load all food listings for search
  const loadAllFoods = async () => {
    try {
      setIsLoadingFoods(true);
      
      // Check if user is authenticated
      if (!user) {
        toast.error('You must be logged in to search food');
        return;
      }
      
      // Check if we have a valid token
      const token = localStorage.getItem('kindbite_access_token');
      if (!token) {
        toast.error('Authentication token not found. Please login again.');
        return;
      }
      
      try {
        let data;
        
        // Use different endpoints based on user role
        if (user.user_role === 'end-user') {
          // Food seekers get available foods from all providers (excluding their own)
          data = await foodService.getAvailableFoodListingsForSeekers();
        } else {
          // Providers get their own listings, admin gets all listings
          data = await foodService.getAllFoodListings();
        }
        
        console.log('All foods data received:', data);
        // Ensure data is an array
        if (Array.isArray(data)) {
          setAllFoodListings(data);
        } else if (data && Array.isArray(data.results)) {
          setAllFoodListings(data.results);
        } else {
          console.log('No foods data found, setting empty array');
          setAllFoodListings([]);
        }
      } catch (foodsError) {
        // If foods load fails with 403, try refreshing token and retry
        if (foodsError.status === 403) {
          console.log('Foods load failed with 403, attempting token refresh...');
          const refreshSuccess = await apiService.refreshToken();
          if (refreshSuccess) {
            console.log('Token refreshed, retrying foods load...');
            let retryData;
            
            // Use different endpoints based on user role
            if (user.user_role === 'end-user') {
              retryData = await foodService.getAvailableFoodListingsForSeekers();
            } else {
              retryData = await foodService.getAllFoodListings();
            }
            
            console.log('Retry foods data received:', retryData);
            // Ensure retry data is an array
            if (Array.isArray(retryData)) {
              setAllFoodListings(retryData);
            } else if (retryData && Array.isArray(retryData.results)) {
              setAllFoodListings(retryData.results);
            } else {
              console.log('No retry foods data found, setting empty array');
              setAllFoodListings([]);
            }
          } else {
            throw new Error('Authentication failed. Please login again.');
          }
        } else {
          throw foodsError;
        }
      }
    } catch (error) {
      console.error('Error loading all foods:', error);
      if (error.status === 403) {
        toast.error('Authentication failed. Please login again.');
      } else {
        toast.error('Failed to load food listings');
      }
    } finally {
      setIsLoadingFoods(false);
    }
  };

  // Load user statistics from API
  const loadUserStats = async () => {
    try {
      setIsLoadingStats(true);
      
      // Check if user is authenticated
      if (!user) {
        console.log('No user found for stats');
        return;
      }
      
      // Check if we have a valid token
      const token = localStorage.getItem('kindbite_access_token');
      if (!token) {
        console.log('No access token available for stats');
        return;
      }
      
      try {
        const stats = await foodService.getFoodStats();
        console.log('User stats received:', stats);
        setUserStats(stats);
      } catch (statsError) {
        // If stats load fails with 403, try refreshing token and retry
        if (statsError.status === 403) {
          console.log('Stats load failed with 403, attempting token refresh...');
          const refreshSuccess = await apiService.refreshToken();
          if (refreshSuccess) {
            console.log('Token refreshed, retrying stats load...');
            const retryStats = await foodService.getFoodStats();
            console.log('Retry stats received:', retryStats);
            setUserStats(retryStats);
          } else {
            console.log('Token refresh failed for stats');
          }
        } else {
          console.error('Stats load error:', statsError);
        }
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  // Load user's own food listings (for providers)
  const loadUserFoodListings = async () => {
    try {
      setIsLoadingFoods(true);
      
      // Check if user is authenticated
      if (!user) {
        console.log('No user found for food listings');
        return;
      }
      
      // Check if we have a valid token
      const token = localStorage.getItem('kindbite_access_token');
      if (!token) {
        console.log('No access token available for food listings');
        return;
      }
      
      try {
        const data = await foodService.getMyFoodListings();
        console.log('User food listings received:', data);
        // Ensure data is an array
        if (Array.isArray(data)) {
          setAllFoodListings(data);
        } else if (data && Array.isArray(data.results)) {
          setAllFoodListings(data.results);
        } else {
          console.log('No user food listings data found, setting empty array');
          setAllFoodListings([]);
        }
      } catch (foodsError) {
        // If foods load fails with 403, try refreshing token and retry
        if (foodsError.status === 403) {
          console.log('User food listings load failed with 403, attempting token refresh...');
          const refreshSuccess = await apiService.refreshToken();
          if (refreshSuccess) {
            console.log('Token refreshed, retrying user food listings load...');
            const retryData = await foodService.getMyFoodListings();
            console.log('Retry user food listings data received:', retryData);
            // Ensure retry data is an array
            if (Array.isArray(retryData)) {
              setAllFoodListings(retryData);
            } else if (retryData && Array.isArray(retryData.results)) {
              setAllFoodListings(retryData.results);
            } else {
              console.log('No retry user food listings data found, setting empty array');
              setAllFoodListings([]);
            }
          } else {
            throw new Error('Authentication failed. Please login again.');
          }
        } else {
          throw foodsError;
        }
      }
    } catch (error) {
      console.error('Error loading user food listings:', error);
      if (error.status === 403) {
        toast.error('Authentication failed. Please login again.');
      } else {
        toast.error('Failed to load your food listings');
      }
    } finally {
      setIsLoadingFoods(false);
    }
  };

  const getViewTitle = () => {
    if (currentView === 'home' && user && user.user_role !== 'end-user') {
      const roleTitles = {
        restaurant: 'Restaurant Dashboard',
        home: 'Home Kitchen Dashboard',
        factory: 'Food Factory Dashboard',
        supermarket: 'Supermarket Dashboard',
        retail: 'Retail Shop Dashboard',
        verifier: 'Food Verifier Dashboard',
        ambassador: 'Food Ambassador Dashboard',
        donor: 'Donor Dashboard'
      };
      return roleTitles[user.user_role] || 'Dashboard';
    }

    const viewTitles = {
      home: 'Rescue food, earn KindCoins',
      search: 'Find Available Food',
      community: 'Community Hub',
      points: 'KindCoins & Rewards',
      profile: 'Your Profile & Impact',
      about: 'About KindBite',
      partners: 'Our Global Partners',
      environment: 'Environmental Impact',
      news: 'News & Celebrations',
      chat: 'Messages & Friends',
      panels: 'User Panels'
    };
    return viewTitles[currentView] || 'KindBite';
  };

  // Render current view
  const renderCurrentView = () => {
    if (currentView === 'home' && user && user.user_role !== 'end-user') {
      return (
        <div className="text-center py-8">
            <div className="text-6xl mb-4">
              {user.user_role === 'restaurant' ? '🍽️' : 
               user.user_role === 'home' ? '🏠' : 
               user.user_role === 'factory' ? '🏭' :
               user.user_role === 'supermarket' ? '🛒' :
               user.user_role === 'retail' ? '🏪' :
               user.user_role === 'verifier' ? '🩺' : 
               user.user_role === 'ambassador' ? '✅' : '💰'}
            </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Welcome to {user.user_role} Dashboard</h2>
            <p className="text-gray-600 mb-6">This is your specialized dashboard for managing your role in the KindBite ecosystem.</p>
            
            {/* Quick Actions */}
            <div className="mb-6">
              <button
                onClick={() => setShowFoodManagement(true)}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center space-x-2 mx-auto"
              >
                <span>🍽️</span>
                <span>Manage Food Items</span>
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-4 max-w-sm mx-auto">
              <h3 className="font-semibold text-gray-800 mb-3">Today's Performance</h3>
              {isLoadingStats ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                  <span className="ml-2 text-gray-600">Loading stats...</span>
                </div>
              ) : userStats ? (
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold text-orange-600">
                      {userStats.total_listings || 0}
                    </div>
                    <div className="text-xs text-gray-600">Items Listed</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-green-600">
                      {userStats.completed_reservations || 0}
                    </div>
                    <div className="text-xs text-gray-600">Completed</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-purple-600">
                      {userStats.total_kindcoins_earned || 0}
                    </div>
                    <div className="text-xs text-gray-600">KindCoins</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <p>No data available</p>
                </div>
              )}
            </div>
        </div>
      );
    }

    switch(currentView) {
      case 'search':
        return (
          <SearchView
            foodListings={allFoodListings}
            onFoodSelect={setSelectedFood}
            onViewChange={setCurrentView}
            loading={isLoadingFoods}
            onRefresh={loadAllFoods}
            title={user?.user_role === 'end-user' ? 'Find Food Near You' : 'Manage Food Listings'}
          />
        );
      case 'community':
        return (
          <CommunityView
            onViewChange={setCurrentView}
          />
        );
      case 'points':
        return (
          <PointsView
            userPoints={user?.kindCoins || 0}
          />
        );
      case 'profile':
        return (
          <ProfileView
            userPoints={user?.kindCoins || 0}
          />
        );
      case 'about':
        return (
          <AboutView />
        );
      case 'reservations':
        // Show different view based on user role
        if (user?.user_role === 'end-user') {
          return <ReservationsView />;
        } else {
          return <ProviderReservationsView />;
        }
      case 'my-food-listings':
        return (
          <MyFoodListingsView 
            onDeleteFood={handleDeleteFood}
          />
        );
      case 'food-management':
        // Return home view, modal will be opened via useEffect
        return (
          <HomeView
            userPoints={user?.kind_coins || 0}
            foodListings={allFoodListings}
            onFoodSelect={setSelectedFood}
            onViewChange={setCurrentView}
            userStats={userStats}
            isLoadingStats={isLoadingStats}
            isLoadingFoods={isLoadingFoods}
            user={user}
          />
        );
      case 'home':
      default:
        return (
          <HomeView
            userPoints={user?.kind_coins || 0}
            foodListings={allFoodListings}
            onFoodSelect={setSelectedFood}
            onViewChange={setCurrentView}
            userStats={userStats}
            isLoadingStats={isLoadingStats}
            isLoadingFoods={isLoadingFoods}
            user={user}
          />
        );
    }
  };

  // Show welcome screen for unauthenticated users
  if (!isAuthenticated) {
    return (
      <>
        <WelcomeScreen 
          onGetStarted={() => {
            setAuthModalMode('login');
            setShowAuthModal(true);
          }}
          onLogin={() => {
            setAuthModalMode('login');
            setShowAuthModal(true);
          }}
          onSignup={() => {
            setAuthModalMode('register');
            setShowAuthModal(true);
          }}
        />
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLogin={login}
          onRegister={register}
          initialMode={authModalMode}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        title={getViewTitle()}
        onMenuToggle={() => setShowMenu(!showMenu)}
        onAIChatToggle={() => setShowAIChat(true)}
        onAuthToggle={() => setShowAuthModal(true)}
        onLoginClick={() => {
          setAuthModalMode('login');
          setShowAuthModal(true);
        }}
        onSignupClick={() => {
          setAuthModalMode('register');
          setShowAuthModal(true);
        }}
        onNotificationsToggle={() => {/* TODO: Implement notifications */}}
        onHomeClick={() => setCurrentView('home')}
        onProfileClick={() => setCurrentView('profile')}
        onLogout={logout}
        notifications={notifications}
        isLargeScreen={isLargeScreen}
        userRole={user?.user_role}
        isAuthenticated={isAuthenticated}
        user={user}
        profileImage={user?.profile_image}
      />

      {/* Sidebar - Desktop: always visible, Mobile: slide-out menu */}
      <Sidebar
        onViewChange={setCurrentView}
        isOpen={showMenu}
        onClose={() => setShowMenu(false)}
        userRole={user?.user_role}
        onLogout={logout}
        isLargeScreen={isLargeScreen}
      />

      {/* Main Content */}
      <main className={`pb-20 ${isLargeScreen ? 'lg:pl-64 lg:pt-20' : ''}`}>
      {renderCurrentView()}
      </main>

      {/* Navigation - Always visible bottom bar */}
      <Navigation
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      {/* Modals */}
      <FoodModal
        selectedFood={selectedFood}
        onClose={() => setSelectedFood(null)}
        onReserve={handleReserve}
      />

      <AIChat
        showAIChat={showAIChat}
        onClose={() => setShowAIChat(false)}
        aiMessages={aiMessages}
        aiInput={aiInput}
        onAiInputChange={(e) => setAiInput(e.target.value)}
        onSendMessage={sendAIMessage}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={login}
        onRegister={register}
        initialMode={authModalMode}
      />

      <FoodManagementModal
        isOpen={showFoodManagement}
        onClose={() => setShowFoodManagement(false)}
        user={user}
        userFoodListings={userFoodListings}
        onAddFood={handleAddFood}
        onUpdateFood={handleUpdateFood}
        onDeleteFood={handleDeleteFood}
      />

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setSelectedReservationForPayment(null);
        }}
        reservation={selectedReservationForPayment}
        onPaymentSuccess={handlePaymentSuccess}
        userKindCoins={user?.kind_coins || 0}
      />
    </div>
  );
};

const KindBiteApp = () => {
  return (
    <AuthProvider>
      <KindBiteAppContent />
    </AuthProvider>
  );
};

export default KindBiteApp;