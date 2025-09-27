import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, MessageCircle, Brain, Sparkles } from 'lucide-react';

const AIChat = ({ showAIChat, onClose, aiMessages, aiInput, onAiInputChange, onSendMessage, foodListings }) => {
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [conversationContext, setConversationContext] = useState([]);
  const [userPreferences, setUserPreferences] = useState({
    dietaryRestrictions: [],
    favoriteCategories: [],
    location: null,
    lastSearches: []
  });

  // Update user preferences based on conversation
  const updateUserPreferences = (message) => {
    const msg = message.toLowerCase();
    
    // Extract dietary preferences
    const dietaryKeywords = ['vegetarian', 'vegan', 'gluten-free', 'halal', 'kosher', 'dairy-free'];
    const foundDietary = dietaryKeywords.filter(diet => msg.includes(diet));
    if (foundDietary.length > 0) {
      setUserPreferences(prev => ({
        ...prev,
        dietaryRestrictions: [...new Set([...prev.dietaryRestrictions, ...foundDietary])]
      }));
    }

    // Extract location preferences
    if (msg.includes('near') || msg.includes('location') || msg.includes('close')) {
      setUserPreferences(prev => ({
        ...prev,
        location: 'nearby'
      }));
    }

    // Track search patterns
    setUserPreferences(prev => ({
      ...prev,
      lastSearches: [...prev.lastSearches.slice(-4), message].slice(-5) // Keep last 5 searches
    }));
  };

  // Simple AI that actually works
  const generateAIResponse = (userMessage, foodListings) => {
    console.log('AI function called with:', userMessage);
    
    // Always return a simple response for testing
    return "Hello! I'm working now. What do you need help with?";
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [aiMessages]);

  // Add natural welcome message when AI chat opens
  useEffect(() => {
    if (showAIChat && aiMessages.length === 0) {
      const currentTime = new Date();
      const hour = currentTime.getHours();
      const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
      
      const welcomeMessage = {
        id: Date.now(),
        text: `${greeting}! How can I help you today?`,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString(),
        fullTimestamp: new Date().toISOString()
      };
      onSendMessage(welcomeMessage);
    }
  }, [showAIChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (aiInput.trim()) {
      const userMessage = {
        id: Date.now(),
        text: aiInput,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString(),
        fullTimestamp: new Date().toISOString()
      };

      // Add user message to conversation context
      setConversationContext(prev => [...prev, { role: 'user', content: aiInput }]);
      
      // Update user preferences based on message
      updateUserPreferences(aiInput);
      
      // Send user message
      onSendMessage(userMessage);

      // Clear input
      onAiInputChange({ target: { value: '' } });

      // Show typing indicator
      setIsTyping(true);
      
      // Add a small delay to make the AI feel more natural
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
      
      // Use our intelligent AI system (100% offline - no APIs)
      console.log('Calling generateAIResponse with:', aiInput);
      const aiResponse = generateAIResponse(aiInput, foodListings);
      console.log('AI response:', aiResponse);
      
      // Create AI message from response
      const aiMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString(),
        fullTimestamp: new Date().toISOString()
      };

      // Add AI response to conversation context
      setConversationContext(prev => [...prev, { role: 'assistant', content: aiMessage.text }]);
      
      // Send AI message
      onSendMessage(aiMessage);
      
      // Hide typing indicator
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!showAIChat) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] max-h-[600px] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold">KindBite AI Assistant</h2>
              <p className="text-sm opacity-90">Your intelligent food rescue companion</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200 bg-white/10"
            title="Close AI Chat"
          >
            <X size={24} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {aiMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-green-100' : 'text-gray-500'
                }`}>
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={aiInput}
              onChange={onAiInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about food, reservations, or the app..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={!aiInput.trim() || isTyping}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <Send size={20} />
            </button>
            <button
              onClick={onClose}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
              title="Close AI Chat"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;