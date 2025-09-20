import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider, useToast } from './contexts/ToastContext';
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
  const { user, isAuthenticated, login, register, updateKindCoins } = useAuth();
  const toast = useToast();
  
  // State management
  const [currentView, setCurrentView] = useState('home');
  const [selectedFood, setSelectedFood] = useState(null);
  const [notifications, setNotifications] = useState(3);
  const [showAIChat, setShowAIChat] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showFoodManagement, setShowFoodManagement] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [menuSticky, setMenuSticky] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [userFoodListings, setUserFoodListings] = useState([]);

  // Responsive screen detection
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024); // lg breakpoint
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Helper functions

  const handleReserve = (food) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      toast.warning('Please login to reserve food items.');
      return;
    }
    
    toast.success(`Successfully reserved ${food.name} from ${food.restaurant}! You earned 10 KindCoins.`);
    setSelectedFood(null);
    updateKindCoins(10);
  };

  const handleAddFood = (newFood) => {
    setUserFoodListings(prev => [...prev, newFood]);
    // Also add to main food listings for display
    foodListings.push(newFood);
    toast.success('Food item added successfully!');
  };

  const handleUpdateFood = (updatedFood) => {
    setUserFoodListings(prev => 
      prev.map(food => food.id === updatedFood.id ? updatedFood : food)
    );
    toast.success('Food item updated successfully!');
  };

  const handleDeleteFood = (foodId) => {
    setUserFoodListings(prev => prev.filter(food => food.id !== foodId));
    toast.info('Food item removed successfully.');
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
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold text-orange-600">
                    {userFoodListings.length || (user.user_role === 'factory' ? '156' : user.user_role === 'supermarket' ? '89' : user.user_role === 'retail' ? '34' : '23')}
                  </div>
                  <div className="text-xs text-gray-600">Items Listed</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-green-600">
                    {user.user_role === 'factory' ? '142' : user.user_role === 'supermarket' ? '76' : user.user_role === 'retail' ? '28' : '18'}
                  </div>
                  <div className="text-xs text-gray-600">Completed</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-purple-600">
                    {user.user_role === 'factory' ? '2,840' : user.user_role === 'supermarket' ? '1,560' : user.user_role === 'retail' ? '680' : '340'}
                  </div>
                  <div className="text-xs text-gray-600">KindCoins</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    switch(currentView) {
      case 'search':
        return (
          <SearchView
            searchTerm={searchTerm}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            foodListings={foodListings}
            onFoodSelect={setSelectedFood}
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
      case 'home':
      default:
        return (
          <HomeView
            userPoints={user?.kindCoins || 0}
            foodListings={foodListings}
            onFoodSelect={setSelectedFood}
            onViewChange={setCurrentView}
          />
        );
    }
  };

  // Show welcome screen for unauthenticated users
  if (!isAuthenticated) {
    return (
      <>
        <WelcomeScreen onGetStarted={() => setShowAuthModal(true)} />
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLogin={login}
          onRegister={register}
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
        notifications={notifications}
        isLargeScreen={isLargeScreen}
      />

      {/* Sidebar - Desktop: always visible, Mobile: slide-out menu */}
      <Sidebar
        onViewChange={setCurrentView}
        showMenu={showMenu}
        onMenuToggle={() => setShowMenu(!showMenu)}
        menuSticky={menuSticky}
        onMenuStickyToggle={() => setMenuSticky(!menuSticky)}
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
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={login}
        onRegister={register}
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
    </div>
  );
};

const KindBiteApp = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <KindBiteAppContent />
      </AuthProvider>
    </ToastProvider>
  );
};

export default KindBiteApp;