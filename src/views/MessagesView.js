import React, { useState, useEffect } from 'react';
import { MessageCircle, Search, Plus, RefreshCw, X, User, Building, Home, Store, Utensils } from 'lucide-react';
import apiService from '../services/api';

const MessagesView = ({ onViewChange, onOpenChat }) => {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewContactModal, setShowNewContactModal] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    role: '',
    avatar: '👤',
    type: 'individual',
    phoneNumber: ''
  });

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Try to load from localStorage first for instant display
      const savedConversations = apiService.loadFromLocalStorage('kindbite_conversations');
      if (savedConversations) {
        setConversations(savedConversations);
        setIsLoading(false);
      }
      
      // Load conversations from API with fallback to mock data
      const apiConversations = await apiService.getDataWithFallback('/conversations/', 'conversations');
      
      // Transform API data to include proper message history
      const transformedConversations = apiConversations.map(conv => ({
        ...conv,
        messages: conv.messages || [],
        lastMessage: conv.lastMessage || 'No messages yet',
        lastMessageTime: conv.lastMessageTime || conv.timestamp || new Date().toISOString(),
        unreadCount: conv.unreadCount || 0
      }));
      
      setConversations(transformedConversations);
      
      // Save to localStorage for persistence
      apiService.saveToLocalStorage('kindbite_conversations', transformedConversations);
      
    } catch (error) {
      console.warn('Could not load conversations from API, using mock data:', error);
      // Use mock data with proper structure
      const mockConversations = getMockConversations();
      setConversations(mockConversations);
      
      // Save mock data to localStorage
      apiService.saveToLocalStorage('kindbite_conversations', mockConversations);
    } finally {
      setIsLoading(false);
    }
  };

  const getMockConversations = () => {
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
        lastMessageTime: new Date(today.getTime() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
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
        lastMessageTime: new Date(today.getTime() + 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
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
      },
      {
        id: 3,
        name: "Bakery Corner",
        role: "Bakery",
        avatar: "🥐",
        lastMessage: "Pastries are ready! 🧁",
        lastMessageTime: yesterday.toISOString(),
        unreadCount: 0,
        messages: [
          {
            id: 1,
            sender: 'other',
            text: "Good morning! We have fresh croissants and muffins available today 🥐",
            timestamp: "8:30 AM",
            fullTimestamp: new Date(yesterday.getTime() + 8 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString()
          },
          {
            id: 2,
            sender: 'user',
            text: "Sounds delicious! What flavors do you have?",
            timestamp: "8:35 AM",
            fullTimestamp: new Date(yesterday.getTime() + 8 * 60 * 60 * 1000 + 35 * 60 * 1000).toISOString()
          },
          {
            id: 3,
            sender: 'other',
            text: "We have chocolate, vanilla, and blueberry muffins, plus plain and chocolate croissants! 🧁",
            timestamp: "8:40 AM",
            fullTimestamp: new Date(yesterday.getTime() + 8 * 60 * 60 * 1000 + 40 * 60 * 1000).toISOString()
          },
          {
            id: 4,
            sender: 'user',
            text: "I'll take the blueberry muffins and chocolate croissants!",
            timestamp: "8:45 AM",
            fullTimestamp: new Date(yesterday.getTime() + 8 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString()
          },
          {
            id: 5,
            sender: 'other',
            text: "Pastries are ready! 🧁",
            timestamp: "9:00 AM",
            fullTimestamp: new Date(yesterday.getTime() + 9 * 60 * 60 * 1000).toISOString()
          }
        ]
      },
      {
        id: 4,
        name: "Community Kitchen",
        role: "Food Bank",
        avatar: "🏠",
        lastMessage: "Thank you for your donation! 🙏",
        lastMessageTime: new Date(yesterday.getTime() - 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        unreadCount: 0,
        messages: [
          {
            id: 1,
            sender: 'other',
            text: "Hello! We're organizing a community food drive this weekend. Would you like to participate? 🤝",
            timestamp: "10:00 AM",
            fullTimestamp: new Date(yesterday.getTime() - 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 2,
            sender: 'user',
            text: "Absolutely! What can I do to help?",
            timestamp: "10:05 AM",
            fullTimestamp: new Date(yesterday.getTime() - 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString()
          },
          {
            id: 3,
            sender: 'other',
            text: "We need volunteers to help sort and distribute food. Also accepting food donations! 🌟",
            timestamp: "10:10 AM",
            fullTimestamp: new Date(yesterday.getTime() - 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000 + 10 * 60 * 1000).toISOString()
          },
          {
            id: 4,
            sender: 'user',
            text: "I can volunteer on Saturday and bring some canned goods!",
            timestamp: "10:15 AM",
            fullTimestamp: new Date(yesterday.getTime() - 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString()
          },
          {
            id: 5,
            sender: 'other',
            text: "Thank you for your donation! 🙏",
            timestamp: "10:20 AM",
            fullTimestamp: new Date(yesterday.getTime() - 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000 + 20 * 60 * 1000).toISOString()
          }
        ]
      }
    ];
  };

  const handleOpenChat = (conversation) => {
    // Mark conversation as read locally
    const updatedConversations = conversations.map(conv => 
      conv.id === conversation.id 
        ? { ...conv, unreadCount: 0 }
        : conv
    );
    
    setConversations(updatedConversations);
    
    // Save updated conversations to localStorage
    apiService.saveToLocalStorage('kindbite_conversations', updatedConversations);

    // Open the chat
    onOpenChat(conversation);
  };

  const handleNewMessage = (conversationId, message) => {
    // Update conversation with new message
    const updatedConversations = conversations.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          lastMessage: message.text,
          lastMessageTime: message.fullTimestamp,
          unreadCount: conv.unreadCount + 1,
          messages: [...conv.messages, message]
        };
      }
      return conv;
    });
    
    setConversations(updatedConversations);
    
    // Save updated conversations to localStorage
    apiService.saveToLocalStorage('kindbite_conversations', updatedConversations);
  };

  const simulateNewMessage = (conversationId) => {
    const responses = [
      "Perfect timing! ⏰",
      "That sounds great! 😊",
      "I'm on my way! 🚶‍♂️",
      "Thanks for letting me know! 🙏",
      "See you soon! 👋",
      "That works for me! 👍",
      "Awesome! 🌟",
      "Got it! 📝"
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    const newMessage = {
      id: Date.now(),
      text: randomResponse,
      sender: 'other',
      timestamp: new Date().toLocaleTimeString(),
      fullTimestamp: new Date().toISOString()
    };

    handleNewMessage(conversationId, newMessage);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNewContact = () => {
    if (!newContact.name.trim() || !newContact.phoneNumber.trim()) {
      alert('Please enter both name and phone number');
      return;
    }

    const contact = {
      id: Date.now(),
      name: newContact.name,
      role: newContact.role,
      avatar: newContact.avatar,
      type: newContact.type,
      phoneNumber: newContact.phoneNumber,
      lastMessage: '',
      timestamp: new Date().toISOString(),
      unreadCount: 0
    };

    const updatedConversations = [contact, ...conversations];
    setConversations(updatedConversations);
    localStorage.setItem('kindbite_conversations', JSON.stringify(updatedConversations));
    
    // Reset form
    setNewContact({
      name: '',
      role: '',
      avatar: '👤',
      type: 'individual',
      phoneNumber: ''
    });
    setShowNewContactModal(false);
  };

  const handleInputChange = (field, value) => {
    setNewContact(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getAvatarOptions = () => {
    return [
      { emoji: '👤', label: 'Person' },
      { emoji: '👩‍🍳', label: 'Chef' },
      { emoji: '👨‍💼', label: 'Business' },
      { emoji: '👩‍🌾', label: 'Farmer' },
      { emoji: '🏠', label: 'Home' },
      { emoji: '🏪', label: 'Store' },
      { emoji: '🍽️', label: 'Restaurant' },
      { emoji: '🏭', label: 'Factory' },
      { emoji: '🛒', label: 'Supermarket' },
      { emoji: '🌱', label: 'Organic' }
    ];
  };

  const getRoleOptions = () => {
    return [
      'Home Chef',
      'Restaurant Owner',
      'Food Verifier',
      'Supermarket Manager',
      'Farmer',
      'Food Bank Volunteer',
      'Community Organizer',
      'Food Ambassador',
      'Nutritionist',
      'Food Safety Inspector'
    ];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 pt-20 pb-24">
        <div className="p-4 lg:p-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading conversations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 pt-20 pb-24">
        <div className="p-4 lg:p-6">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Conversations</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={loadConversations}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 pt-20 pb-24">
      <div className="p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="card-premium p-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6 text-center">
            Messages
          </h1>
          
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 lg:w-6 lg:h-6" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl text-lg focus:border-green-500 focus:outline-none transition-all duration-300 hover:border-gray-300 lg:py-5 lg:text-xl"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setShowNewContactModal(true)}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>New Contact</span>
            </button>
            <button
              onClick={loadConversations}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
            >
              <RefreshCw size={20} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Conversations List */}
        <div className="space-y-4">
          {filteredConversations.length === 0 ? (
            <div className="card-premium p-12 text-center">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {searchTerm ? 'No conversations found' : 'No conversations yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : 'Start chatting with food providers and community members!'
                }
              </p>
              
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className="card-premium p-4 cursor-pointer hover-lift"
                onClick={() => handleOpenChat(conversation)}
              >
                <div className="flex items-center space-x-4">
                  {/* Avatar */}
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center text-2xl text-white font-semibold">
                    {conversation.avatar}
                  </div>

                  {/* Conversation Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-800 text-lg truncate">
                        {conversation.name}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {formatTime(conversation.lastMessageTime)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-1 truncate">
                      {conversation.role}
                    </p>
                    
                    <p className="text-gray-800 truncate">
                      {conversation.lastMessage}
                    </p>
                  </div>

                  {/* Unread Indicator */}
                  {conversation.unreadCount > 0 && (
                    <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* New Contact Modal */}
        {showNewContactModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-w-[90vw]">
              <h3 className="text-lg font-semibold mb-4">Add New Contact</h3>
              
              {/* Name Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={newContact.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter contact name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Phone Number Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={newContact.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  placeholder="Enter phone number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Role Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  value={newContact.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select a role</option>
                  {getRoleOptions().map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              {/* Type Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleInputChange('type', 'individual')}
                    className={`flex-1 py-2 px-4 rounded-md border ${
                      newContact.type === 'individual'
                        ? 'bg-green-500 text-white border-green-500'
                        : 'bg-white text-gray-700 border-gray-300'
                    }`}
                  >
                    Individual
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('type', 'business')}
                    className={`flex-1 py-2 px-4 rounded-md border ${
                      newContact.type === 'business'
                        ? 'bg-green-500 text-white border-green-500'
                        : 'bg-white text-gray-700 border-gray-300'
                    }`}
                  >
                    Business
                  </button>
                </div>
              </div>

              {/* Avatar Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avatar
                </label>
                <div className="grid grid-cols-8 gap-2">
                  {getAvatarOptions().map(avatar => (
                    <button
                      key={avatar.emoji}
                      type="button"
                      onClick={() => handleInputChange('avatar', avatar.emoji)}
                      className={`text-2xl p-2 rounded-md border-2 ${
                        newContact.avatar === avatar.emoji
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {avatar.emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowNewContactModal(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddNewContact}
                  className="flex-1 py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Add Contact
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Demo Section */}
        <div className="card-premium p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Demo: Test New Messages</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {conversations.slice(0, 4).map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => simulateNewMessage(conversation.id)}
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-sm"
              >
                New Message to {conversation.name.split(' ')[0]}
              </button>
            ))}
          </div>
          <div className="text-center mt-4">
            <button
              onClick={() => onViewChange && onViewChange('home')}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors duration-200"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesView; 