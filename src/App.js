import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';
import Sidebar from './components/layout/Sidebar';
import AIChat from './components/features/AIChat';
import FoodModal from './components/features/FoodModal';
import AdminPanel from './components/features/AdminPanel';
import HomeView from './views/HomeView';
import SearchView from './views/SearchView';
import CommunityView from './views/CommunityView';
import PointsView from './views/PointsView';
import ProfileView from './views/ProfileView';
import AboutView from './views/AboutView';
import MessagesView from './views/MessagesView';
import ChatModal from './components/features/ChatModal';
import EnvironmentView from './views/EnvironmentView';
import PartnersView from './views/PartnersView';
import apiService from './services/api';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [userRole, setUserRole] = useState('restaurant');
  const [showSidebar, setShowSidebar] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [currentChat, setCurrentChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [aiMessages, setAiMessages] = useState([]);
  const [aiInput, setAiInput] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [foodListings, setFoodListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFood, setSelectedFood] = useState(null);

  // Load initial data from API on component mount
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      
      // Load food listings from API with fallback
      const foodData = await apiService.getDataWithFallback('/food-listings/', 'food-listings');
      setFoodListings(foodData);
      
      // Load notifications from API with fallback
      const notificationData = await apiService.getDataWithFallback('/notifications/', 'notifications');
      setNotifications(notificationData);
      
    } catch (error) {
      console.warn('Error loading initial data:', error);
      // Use mock data as fallback
      setFoodListings(apiService.getMockData('food-listings'));
      setNotifications(apiService.getMockData('notifications'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenFoodModal = (food) => {
    setSelectedFood(food);
    setShowFoodModal(true);
  };

  const handleCloseFoodModal = () => {
    setShowFoodModal(false);
    setSelectedFood(null);
  };

  const handleOpenChat = (conversation) => {
    setCurrentChat(conversation);
    setShowChat(true);
  };

  const handleCloseChat = () => {
    setShowChat(false);
    setCurrentChat(null);
  };

  const handleNewMessage = (conversationId, message) => {
    // Update conversations in MessagesView
    // This will be handled by the MessagesView component itself
  };

  const onSendMessage = (message) => {
    if (message.sender === 'user') {
      setAiMessages(prev => [...prev, message]);
    } else {
      setAiMessages(prev => [...prev, message]);
    }
  };

  const getViewTitle = () => {
    switch (currentView) {
      case 'home': return 'KindBite';
      case 'search': return 'Find Food';
      case 'community': return 'Community';
      case 'points': return 'My Points';
      case 'profile': return 'My Profile';
      case 'about': return 'About';
      case 'messages': return 'Messages';
      case 'environment': return 'Environmental Impact';
      case 'partners': return 'Our Partners';
      case 'admin': return 'Admin Panel';
      default: return 'KindBite';
    }
  };

  const handleNotificationToggle = () => {
    setShowNotifications(!showNotifications);
  };

  const handleMarkAllNotificationsRead = async () => {
    try {
      await apiService.markAllNotificationsRead();
      // Update local state
      setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
      // Still update local state for better UX
      setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
    }
  };

  const handleFoodLikeToggle = async (foodId, isLiked) => {
    try {
      if (isLiked) {
        await apiService.likeFood(foodId);
      } else {
        await apiService.unlikeFood(foodId);
      }
      
      // Update local state
      setFoodListings(prev => prev.map(food => {
        if (food.id === foodId) {
          return {
            ...food,
            isLiked: isLiked,
            likesCount: isLiked ? (food.likesCount || 0) + 1 : Math.max(0, (food.likesCount || 1) - 1)
          };
        }
        return food;
      }));
      
      // Save updated food listings to localStorage
      apiService.saveToLocalStorage('kindbite_food_listings', foodListings);
      
    } catch (error) {
      console.warn('Could not update food like status:', error);
      // Update locally anyway for better UX
      setFoodListings(prev => prev.map(food => {
        if (food.id === foodId) {
          return {
            ...food,
            isLiked: isLiked,
            likesCount: isLiked ? (food.likesCount || 0) + 1 : Math.max(0, (food.likesCount || 1) - 1)
          };
        }
        return food;
      }));
    }
  };


  const renderRoleSpecificHome = () => {
    const roleData = {
      restaurant: {
        title: "Restaurant Dashboard",
        subtitle: "Manage your food listings and orders",
        stats: [
          { label: "Active Listings", value: "12", color: "bg-orange-100 text-orange-600" },
          { label: "Orders Today", value: "8", color: "bg-green-100 text-green-600" },
          { label: "Revenue", value: "UGX 45,000", color: "bg-blue-100 text-blue-600" },
          { label: "Rating", value: "4.8", color: "bg-purple-100 text-purple-600" }
        ],
        actions: [
          { label: "Add New Food", icon: "➕", color: "bg-orange-500" },
          { label: "View Orders", icon: "📋", color: "bg-green-500" },
          { label: "Analytics", icon: "📊", color: "bg-blue-500" },
          { label: "Settings", icon: "⚙️", color: "bg-gray-500" }
        ]
      },
      home: {
        title: "Home Kitchen",
        subtitle: "Share your homemade meals",
        stats: [
          { label: "Meals Shared", value: "23", color: "bg-blue-100 text-blue-600" },
          { label: "People Fed", value: "67", color: "bg-green-100 text-green-600" },
          { label: "KindCoins", value: "1,250", color: "bg-yellow-100 text-yellow-600" },
          { label: "Rating", value: "4.9", color: "bg-purple-100 text-purple-600" }
        ],
        actions: [
          { label: "Share Meal", icon: "🍽️", color: "bg-blue-500" },
          { label: "My Recipes", icon: "📝", color: "bg-green-500" },
          { label: "Community", icon: "👥", color: "bg-purple-500" },
          { label: "Profile", icon: "👤", color: "bg-gray-500" }
        ]
      },
      factory: {
        title: "Food Factory",
        subtitle: "Manage production and distribution",
        stats: [
          { label: "Production Lines", value: "5", color: "bg-gray-100 text-gray-600" },
          { label: "Daily Output", value: "2,500", color: "bg-green-100 text-green-600" },
          { label: "Efficiency", value: "94%", color: "bg-blue-100 text-blue-600" },
          { label: "Quality Score", value: "98", color: "bg-purple-100 text-purple-600" }
        ],
        actions: [
          { label: "Production", icon: "🏭", color: "bg-gray-500" },
          { label: "Inventory", icon: "📦", color: "bg-blue-500" },
          { label: "Distribution", icon: "🚚", color: "bg-green-500" },
          { label: "Reports", icon: "📊", color: "bg-purple-500" }
        ]
      },
      supermarket: {
        title: "Supermarket",
        subtitle: "Manage store operations and inventory",
        stats: [
          { label: "Products", value: "1,200", color: "bg-purple-100 text-purple-600" },
          { label: "Daily Sales", value: "UGX 125,000", color: "bg-green-100 text-green-600" },
          { label: "Customers", value: "340", color: "bg-blue-100 text-blue-600" },
          { label: "Satisfaction", value: "4.7", color: "bg-yellow-100 text-yellow-600" }
        ],
        actions: [
          { label: "Inventory", icon: "📦", color: "bg-purple-500" },
          { label: "Sales", icon: "💰", color: "bg-green-500" },
          { label: "Customers", icon: "👥", color: "bg-blue-500" },
          { label: "Promotions", icon: "🎯", color: "bg-yellow-500" }
        ]
      },
      retail: {
        title: "Retail Shop",
        subtitle: "Manage your retail operations",
        stats: [
          { label: "Products", value: "450", color: "bg-pink-100 text-pink-600" },
          { label: "Daily Sales", value: "UGX 35,000", color: "bg-green-100 text-green-600" },
          { label: "Customers", value: "89", color: "bg-blue-100 text-blue-600" },
          { label: "Growth", value: "+12%", color: "bg-purple-100 text-purple-600" }
        ],
        actions: [
          { label: "Products", icon: "🎁", color: "bg-pink-500" },
          { label: "Sales", icon: "💰", color: "bg-green-500" },
          { label: "Marketing", icon: "📢", color: "bg-blue-500" },
          { label: "Analytics", icon: "📊", color: "bg-purple-500" }
        ]
      },
      verifier: {
        title: "Food Verifier",
        subtitle: "Verify food quality and safety",
        stats: [
          { label: "Verified Today", value: "45", color: "bg-red-100 text-red-600" },
          { label: "Pending", value: "12", color: "bg-yellow-100 text-yellow-600" },
          { label: "Accuracy", value: "99.2%", color: "bg-green-100 text-green-600" },
          { label: "Experience", value: "2.5y", color: "bg-blue-100 text-blue-600" }
        ],
        actions: [
          { label: "Verify Food", icon: "🩺", color: "bg-red-500" },
          { label: "Reports", icon: "📋", color: "bg-yellow-500" },
          { label: "Standards", icon: "📏", color: "bg-green-500" },
          { label: "Training", icon: "🎓", color: "bg-blue-500" }
        ]
      },
      ambassador: {
        title: "Food Ambassador",
        subtitle: "Promote food sharing in your community",
        stats: [
          { label: "Events Hosted", value: "18", color: "bg-green-100 text-green-600" },
          { label: "People Reached", value: "1,200", color: "bg-blue-100 text-blue-600" },
          { label: "Impact Score", value: "9.2", color: "bg-purple-100 text-purple-600" },
          { label: "Community", value: "Active", color: "bg-yellow-100 text-yellow-600" }
        ],
        actions: [
          { label: "Host Event", icon: "✅", color: "bg-green-500" },
          { label: "Community", icon: "👥", color: "bg-blue-500" },
          { label: "Impact", icon: "🌱", color: "bg-purple-500" },
          { label: "Resources", icon: "📚", color: "bg-yellow-500" }
        ]
      },
      donor: {
        title: "Donor/Buyer",
        subtitle: "Support food sharing initiatives",
        stats: [
          { label: "Donations", value: "UGX 15,000", color: "bg-indigo-100 text-indigo-600" },
          { label: "Meals Funded", value: "89", color: "bg-green-100 text-green-600" },
          { label: "Impact Points", value: "2,340", color: "bg-purple-100 text-purple-600" },
          { label: "Badges", value: "12", color: "bg-yellow-100 text-yellow-600" }
        ],
        actions: [
          { label: "Donate", icon: "💰", color: "bg-indigo-500" },
          { label: "Fund Meals", icon: "🍽️", color: "bg-green-500" },
          { label: "Impact", icon: "🌍", color: "bg-purple-500" },
          { label: "History", icon: "📜", color: "bg-yellow-500" }
        ]
      },
      "end-user": {
        title: "Food Seeker",
        subtitle: "Find and enjoy great food",
        stats: [
          { label: "Meals Found", value: "34", color: "bg-teal-100 text-teal-600" },
          { label: "Money Saved", value: "UGX 8,500", color: "bg-green-100 text-green-600" },
          { label: "KindCoins", value: "890", color: "bg-yellow-100 text-yellow-600" },
          { label: "Favorites", value: "12", color: "bg-purple-100 text-purple-600" }
        ],
        actions: [
          { label: "Find Food", icon: "🔍", color: "bg-teal-500" },
          { label: "Favorites", icon: "❤️", color: "bg-red-500" },
          { label: "History", icon: "📜", color: "bg-green-500" },
          { label: "Profile", icon: "👤", color: "bg-purple-500" }
        ]
      }
    };

    const currentRoleData = roleData[userRole] || roleData["end-user"];

    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-24">
        <div className="p-4 lg:p-6 space-y-6">
          {/* Role Header */}
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
              {currentRoleData.title}
            </h1>
            <p className="text-gray-600 text-lg">
              {currentRoleData.subtitle}
            </p>
          </div>

          {/* Role Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {currentRoleData.stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4 text-center">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                  <span className="text-2xl font-bold">{stat.value}</span>
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Role Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {currentRoleData.actions.map((action, index) => (
                <button 
                  key={index}
                  className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center mb-2`}>
                    <span className="text-white text-xl">{action.icon}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 text-center">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Food Listings for this role */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {userRole === 'restaurant' ? 'Your Food Listings' : 
                 userRole === 'home' ? 'Your Shared Meals' :
                 userRole === 'factory' ? 'Production Items' :
                 userRole === 'supermarket' ? 'Store Products' :
                 userRole === 'retail' ? 'Retail Items' :
                 userRole === 'verifier' ? 'Items to Verify' :
                 userRole === 'ambassador' ? 'Community Events' :
                 userRole === 'donor' ? 'Donation Opportunities' :
                 'Available Food'}
              </h2>
              <button className="text-green-600 hover:text-green-700 font-medium">
                View All →
              </button>
            </div>

            {foodListings && foodListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {foodListings.slice(0, 6).map((food) => (
                  <div key={food.id || Math.random()} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="w-full h-32 bg-gray-200 rounded-lg mb-3 flex items-center justify-center text-4xl">
                      {food.image || '🍽️'}
                    </div>
                    <h3 className="font-semibold text-gray-800 text-lg mb-2">
                      {food.name || 'Food Item'}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {food.description || 'No description available'}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-green-600 font-semibold">
                        UGX {(food.discountedPrice || 0).toLocaleString()}
                      </span>
                      <button className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors duration-200">
                        {userRole === 'restaurant' ? 'Edit' :
                         userRole === 'verifier' ? 'Verify' :
                         userRole === 'donor' ? 'Donate' :
                         'View'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🍽️</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No items available</h3>
                <p className="text-gray-600 mb-6">Check back later or add new items</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return renderRoleSpecificHome();
      case 'search':
        return (
          <SearchView
            foodListings={foodListings}
            onOpenFoodModal={handleOpenFoodModal}
            onViewChange={setCurrentView}
            onLikeToggle={handleFoodLikeToggle}
          />
        );
      case 'community':
        return <CommunityView onViewChange={setCurrentView} />;
      case 'points':
        return <PointsView onViewChange={setCurrentView} />;
      case 'profile':
        return <ProfileView onViewChange={setCurrentView} />;
      case 'messages':
        return (
          <MessagesView
            onViewChange={setCurrentView}
            onOpenChat={handleOpenChat}
          />
        );
      case 'environment':
        return <EnvironmentView onViewChange={setCurrentView} />;
      case 'partners':
        return <PartnersView onViewChange={setCurrentView} />;
      case 'admin':
        return (
          <div className="p-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Panel</h2>
              <p className="text-gray-600 mb-6">Click the hamburger menu to access the admin panel</p>
              <button
                onClick={() => setShowAdminPanel(true)}
                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors duration-200"
              >
                Open Admin Panel
              </button>
            </div>
          </div>
        );
      default:
        return (
          <HomeView
            foodListings={foodListings}
            onOpenFoodModal={handleOpenFoodModal}
            onViewChange={setCurrentView}
            onLikeToggle={handleFoodLikeToggle}
          />
        );
    }
  };

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onMenuToggle={() => {
          console.log('Hamburger menu clicked, current sidebar state:', showSidebar);
          setShowSidebar(!showSidebar);
        }}
        onAIChatToggle={() => setShowAIChat(!showAIChat)}
        onNotificationsToggle={handleNotificationToggle}
        onHomeClick={() => {
          setCurrentView('home');
          setShowSidebar(false);
        }}
        notifications={unreadNotificationsCount}
        isLargeScreen={window.innerWidth >= 1024}
      />

      <Sidebar
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
        currentView={currentView}
        onViewChange={setCurrentView}
        userRole={userRole}
        onRoleChange={setUserRole}
        onAdminPanelOpen={() => {
          console.log('Admin panel open requested');
          setShowAdminPanel(true);
        }}
      />

      <main className="pt-20 pb-24">
        {renderCurrentView()}
      </main>

      <Navigation
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      {/* AI Chat Modal */}
      {showAIChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] max-h-[600px] overflow-hidden">
            <AIChat
              showAIChat={showAIChat}
              onClose={() => setShowAIChat(false)}
              aiMessages={aiMessages}
              aiInput={aiInput}
              onAiInputChange={(e) => setAiInput(e.target.value)}
              onSendMessage={(message) => {
                if (message.sender === 'user') {
                  setAiMessages(prev => [...prev, message]);
                } else {
                  setAiMessages(prev => [...prev, message]);
                }
              }}
              foodListings={foodListings}
            />
          </div>
        </div>
      )}

      {/* Food Modal */}
      {showFoodModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <FoodModal
              onClose={handleCloseFoodModal}
              food={selectedFood}
            />
          </div>
        </div>
      )}

      {/* Notifications Modal */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
                <button
                  onClick={handleNotificationToggle}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              {notifications.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No notifications</p>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-800">{notification.message}</p>
                      <p className="text-sm text-gray-500 mt-1">{notification.timestamp}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {notifications.length > 0 && (
                <button
                  onClick={handleMarkAllNotificationsRead}
                  className="w-full mt-4 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors duration-200"
                >
                  Mark All as Read
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {showChat && currentChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] max-h-[600px] overflow-hidden">
            <ChatModal
              conversation={currentChat}
              onClose={handleCloseChat}
              onSendMessage={(message) => {
                // Handle sending messages
                console.log('Sending message:', message);
              }}
            />
          </div>
        </div>
      )}

      {/* Admin Panel Modal */}
      {showAdminPanel && (
        <AdminPanel onClose={() => {
          console.log('Closing admin panel');
          setShowAdminPanel(false);
        }} />
      )}
    </div>
  );
}

export default App;