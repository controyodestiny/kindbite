import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';
import Sidebar from './components/layout/Sidebar';
import AIChat from './components/features/AIChat';
import FoodModal from './components/features/FoodModal';
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
  const [showSidebar, setShowSidebar] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showChat, setShowChat] = useState(false);
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

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return (
          <HomeView
            foodListings={foodListings}
            onOpenFoodModal={handleOpenFoodModal}
            onViewChange={setCurrentView}
            onLikeToggle={handleFoodLikeToggle}
          />
        );
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
        onMenuToggle={() => setShowSidebar(!showSidebar)}
        onAIChatToggle={() => setShowAIChat(!showAIChat)}
        onNotificationsToggle={handleNotificationToggle}
        notifications={unreadNotificationsCount}
        isLargeScreen={window.innerWidth >= 1024}
      />

      <Sidebar
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
        currentView={currentView}
        onViewChange={setCurrentView}
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
    </div>
  );
}

export default App;