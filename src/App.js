import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import AIChat from './components/features/IntelligentAIChat';
import FoodModal from './components/features/FoodModal';
import AuthModal from './components/features/AuthModal';
import NotLoggedInView from './components/features/NotLoggedInView';
import HomeView from './views/HomeView';
import SearchView from './views/SearchView';
import CommunityView from './views/CommunityView';
import PointsView from './views/PointsView';
import ProfileView from './views/ProfileView';
import AboutView from './views/AboutView';
import MessagesView from './views/MessagesView';
import EnvironmentView from './views/EnvironmentView';
import PartnersView from './views/PartnersView';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [userRole, setUserRole] = useState('cafe');
  const [showSidebar, setShowSidebar] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddFoodModal, setShowAddFoodModal] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [profileImage, setProfileImage] = useState(null);

  // Mock data
  const [foodListings, setFoodListings] = useState([
    {
      id: 1,
      name: "Mixed Vegetable Stir Fry",
      restaurant: "Green Garden Cafe",
      category: "Vegetarian",
      originalPrice: 0,
      discountedPrice: 0,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
      description: "Fresh mixed vegetables stir-fried with aromatic spices",
      isReserved: false
    },
    {
      id: 2,
      name: "Chicken Biryani",
      restaurant: "Spice Palace",
      category: "Non-Vegetarian",
      originalPrice: 0,
      discountedPrice: 0,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop",
      description: "Fragrant basmati rice with tender chicken and aromatic spices",
      isReserved: false
    }
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Food Available",
      message: "Mixed Vegetable Stir Fry is now available at Green Garden Cafe",
      timestamp: "2 minutes ago",
      isRead: false
    },
    {
      id: 2,
      title: "Reservation Confirmed",
      message: "Your reservation for Chicken Biryani has been confirmed",
      timestamp: "1 hour ago",
      isRead: true
    }
  ]);

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('kindbite_user');
    const savedAuth = localStorage.getItem('kindbite_authenticated');
    const savedProfileImage = localStorage.getItem('kindbite_profile_image');
    
    if (savedAuth === 'true' && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setIsAuthenticated(true);
        setUser(userData);
        setUserRole(userData.role || 'cafe');
      } catch (error) {
        console.error('Error loading user data:', error);
        localStorage.removeItem('kindbite_user');
        localStorage.removeItem('kindbite_authenticated');
      }
    }
    
    if (savedProfileImage) {
      setProfileImage(savedProfileImage);
    }
  }, []);

  // Handle add-food case
  useEffect(() => {
    if (currentView === 'add-food') {
      setShowAddFoodModal(true);
      setCurrentView('home'); // Reset to home after opening modal
    }
  }, [currentView]);

  const handleProfileImageChange = (newImage) => {
    setProfileImage(newImage);
    localStorage.setItem('kindbite_profile_image', newImage);
  };

  const handleFoodLikeToggle = (foodId) => {
    setFoodListings(prevListings =>
      prevListings.map(food =>
        food.id === foodId ? { ...food, isLiked: !food.isLiked } : food
      )
    );
  };

  const handleFoodReserve = (foodId) => {
    setFoodListings(prevListings =>
      prevListings.map(food =>
        food.id === foodId ? { ...food, isReserved: !food.isReserved } : food
      )
    );
  };

  const handleOpenFoodModal = (food) => {
    setSelectedFood(food);
    setShowFoodModal(true);
  };

  const handleOpenEditModal = (food) => {
    setEditingFood(food);
    setShowEditModal(true);
  };

  const handleOpenAddFoodModal = () => {
    setShowAddFoodModal(true);
  };

  const handleAddFood = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newFood = {
      id: Date.now(),
      name: formData.get('name'),
      restaurant: formData.get('restaurant'),
      category: formData.get('category'),
      originalPrice: 0,
      discountedPrice: 0,
      rating: 4.0,
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
      description: formData.get('description'),
      isReserved: false
    };
    setFoodListings(prevListings => [newFood, ...prevListings]);
    setShowAddFoodModal(false);
    e.target.reset();
  };

  const handleCloseFoodModal = () => {
    setShowFoodModal(false);
    setSelectedFood(null);
  };

  const handleNotificationToggle = () => {
    setShowNotifications(!showNotifications);
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
  };

  const handleNotificationClick = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
  };

  // Authentication functions
  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    setUserRole(userData.role || 'cafe');
    setShowAuthModal(false);
    
    // Save to localStorage so user stays logged in
    localStorage.setItem('kindbite_user', JSON.stringify(userData));
    localStorage.setItem('kindbite_authenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setCurrentView('home');
    setShowSidebar(false);
    
    // Clear localStorage
    localStorage.removeItem('kindbite_user');
    localStorage.removeItem('kindbite_authenticated');
    localStorage.removeItem('kindbite_profile_image');
  };

  const handleAuthModeChange = (mode) => {
    setAuthMode(mode);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView 
          foodListings={foodListings} 
          onFoodLike={handleFoodLikeToggle}
          onFoodReserve={handleFoodReserve}
          onOpenFoodModal={handleOpenFoodModal}
        />;
      case 'search':
        return <SearchView 
          foodListings={foodListings} 
          onFoodLike={handleFoodLikeToggle}
          onFoodReserve={handleFoodReserve}
          onOpenFoodModal={handleOpenFoodModal}
        />;
      case 'add-food':
        // Show add food modal
        return <HomeView 
          foodListings={foodListings} 
          onFoodLike={handleFoodLikeToggle}
          onFoodReserve={handleFoodReserve}
          onOpenFoodModal={handleOpenFoodModal}
        />;
      case 'my-food':
        // Show user's food listings
        return <SearchView 
          foodListings={foodListings.filter(food => food.restaurant === (user?.username || 'Your Restaurant'))} 
          onFoodLike={handleFoodLikeToggle}
          onFoodReserve={handleFoodReserve}
          onOpenFoodModal={handleOpenFoodModal}
          title="My Food Listings"
        />;
      case 'reservations':
        // Show reservations view
        return <MessagesView />;
      case 'analytics':
        // Show analytics/points view
        return <PointsView />;
      case 'inventory':
        // Show inventory view (for retail/grocery)
        return <SearchView 
          foodListings={foodListings.filter(food => food.restaurant === (user?.username || 'Your Store'))} 
          onFoodLike={handleFoodLikeToggle}
          onFoodReserve={handleFoodReserve}
          onOpenFoodModal={handleOpenFoodModal}
          title="Inventory"
        />;
      case 'schedule':
        // Show baking schedule (for bakery)
        return <SearchView 
          foodListings={foodListings.filter(food => food.restaurant === (user?.username || 'Your Bakery'))} 
          onFoodLike={handleFoodLikeToggle}
          onFoodReserve={handleFoodReserve}
          onOpenFoodModal={handleOpenFoodModal}
          title="Baking Schedule"
        />;
      case 'events':
        // Show events (for hotel)
        return <SearchView 
          foodListings={foodListings.filter(food => food.restaurant === (user?.username || 'Your Hotel'))} 
          onFoodLike={handleFoodLikeToggle}
          onFoodReserve={handleFoodReserve}
          onOpenFoodModal={handleOpenFoodModal}
          title="Events"
        />;
      case 'community':
        return <CommunityView />;
      case 'points':
        return <PointsView />;
      case 'profile':
        return <ProfileView 
          user={user} 
          onLogout={handleLogout}
          onProfileImageChange={handleProfileImageChange}
        />;
      case 'about':
        return <AboutView />;
      case 'messages':
        return <MessagesView />;
      case 'environment':
        return <EnvironmentView />;
      case 'partners':
        return <PartnersView />;
      default:
        return <HomeView 
          foodListings={foodListings} 
          onFoodLike={handleFoodLikeToggle}
          onFoodReserve={handleFoodReserve}
          onOpenFoodModal={handleOpenFoodModal}
        />;
    }
  };

  // If not authenticated, show the login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 overflow-x-hidden">
        <Header
          onMenuToggle={() => setShowSidebar(!showSidebar)}
          onAIChatToggle={() => setShowAIChat(!showAIChat)}
          onNotificationsToggle={handleNotificationToggle}
          onHomeClick={() => {
            setCurrentView('home');
            setShowSidebar(false);
          }}
          notifications={notifications}
          isLargeScreen={window.innerWidth >= 1024}
          isAuthenticated={isAuthenticated}
          user={user}
          onLoginClick={() => {
            setAuthMode('login');
            setShowAuthModal(true);
          }}
          onSignupClick={() => {
            setAuthMode('signup');
            setShowAuthModal(true);
          }}
          onProfileClick={() => setCurrentView('profile')}
          profileImage={profileImage}
        />
        
        <NotLoggedInView 
          onLoginClick={() => {
            setAuthMode('login');
            setShowAuthModal(true);
          }}
          onSignupClick={() => {
            setAuthMode('signup');
            setShowAuthModal(true);
          }}
        />
        
        {showAuthModal && (
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            mode={authMode}
            onModeChange={setAuthMode}
            onLogin={handleLogin}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <Header
        onMenuToggle={() => setShowSidebar(!showSidebar)}
        onAIChatToggle={() => setShowAIChat(!showAIChat)}
        onNotificationsToggle={handleNotificationToggle}
        onHomeClick={() => {
          setCurrentView('home');
          setShowSidebar(false);
        }}
        notifications={notifications}
        isLargeScreen={window.innerWidth >= 1024}
        isAuthenticated={isAuthenticated}
        user={user}
        onLoginClick={() => {
          setAuthMode('login');
          setShowAuthModal(true);
        }}
        onSignupClick={() => {
          setAuthMode('signup');
          setShowAuthModal(true);
        }}
        onProfileClick={() => setCurrentView('profile')}
        profileImage={profileImage}
      />

      <Sidebar
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
        currentView={currentView}
        onViewChange={setCurrentView}
        userRole={userRole}
        onRoleChange={setUserRole}
      />

      <main className="pt-20 pb-24 min-h-screen overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {renderCurrentView()}
        </div>
      </main>

      {showAIChat && (
        <AIChat
          showAIChat={showAIChat}
          onClose={() => setShowAIChat(false)}
          foodListings={foodListings}
        />
      )}

      {showFoodModal && selectedFood && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto my-4">
            <FoodModal
              selectedFood={selectedFood}
              onClose={handleCloseFoodModal}
              onReserve={() => handleFoodReserve(selectedFood.id)}
            />
          </div>
        </div>
      )}

      {showNotifications && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-y-auto my-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Notifications</h2>
                <button
                  onClick={handleNotificationToggle}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      notification.isRead 
                        ? 'bg-gray-50 text-gray-600' 
                        : 'bg-blue-50 text-blue-900 border-l-4 border-blue-500'
                    }`}
                  >
                    <h3 className="font-medium">{notification.title}</h3>
                    <p className="text-sm mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-2">{notification.timestamp}</p>
                  </div>
                ))}
                {notifications.length > 0 && (
                  <button
                    onClick={handleMarkAllNotificationsRead}
                    className="w-full mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Mark All as Read
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editingFood && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto my-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Edit Food Item: {editingFood.name}</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Food Name</label>
                  <input
                    type="text"
                    defaultValue={editingFood.name}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Restaurant</label>
                  <input
                    type="text"
                    defaultValue={editingFood.restaurant}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    defaultValue={editingFood.category}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Dessert">Dessert</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    defaultValue={editingFood.description}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showAddFoodModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto my-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Add New Food Item</h2>
                <button
                  onClick={() => setShowAddFoodModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleAddFood} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Food Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Enter food name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Restaurant *</label>
                  <input
                    type="text"
                    name="restaurant"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Enter restaurant name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category *</label>
                  <select
                    name="category"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">Select category</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Dessert">Dessert</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description *</label>
                  <textarea
                    name="description"
                    required
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Describe the food item"
                  />
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-800 text-sm">
                    <strong>Note:</strong> All food items on KindBite are free to help reduce food waste!
                  </p>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddFoodModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    Add Food Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          mode={authMode}
          onModeChange={setAuthMode}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
}

export default App;