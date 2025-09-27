import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot } from 'lucide-react';

const SimpleAIChat = ({ showAIChat, onClose, foodListings = [] }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const getResponse = (userMessage) => {
    const msg = userMessage.toLowerCase().trim();
    
    // Analyze food data
    const total = foodListings.length;
    const free = foodListings.filter(f => f.discountedPrice === 0).length;
    const topRated = foodListings.sort((a, b) => b.rating - a.rating)[0];
    const categories = [...new Set(foodListings.map(f => f.category))];
    const restaurants = [...new Set(foodListings.map(f => f.restaurant))];
    
    // Simple but effective responses
    if (msg.includes('hi') || msg.includes('hello') || msg.includes('hey')) {
      return `Hello! I can see ${total} food items available right now. ${free > 0 ? `${free} are completely free!` : ''} What would you like to do?`;
    }
    
    if (msg.includes('food') || msg.includes('eat') || msg.includes('hungry')) {
      if (total === 0) {
        return "No food available right now. Check back later for new items.";
      }
      return `I found ${total} food items available. ${free > 0 ? `${free} are completely free!` : ''} ${topRated ? `Top rated: ${topRated.name} from ${topRated.restaurant} (${topRated.rating}★). ` : ''}What type of food are you looking for?`;
    }
    
    if (msg.includes('reserve') || msg.includes('book') || msg.includes('order')) {
      if (total === 0) {
        return "No food available to reserve. Check back later.";
      }
      return `To reserve food:\n1. Browse the food items\n2. Tap on one you like\n3. Click "Reserve Now"\n4. Choose pickup time\n5. Confirm\n\n${total} items available. ${free > 0 ? `${free} are free!` : ''} What would you like to reserve?`;
    }
    
    if (msg.includes('help') || msg.includes('how')) {
      return `I can help you with:\n• Finding food (${total} items available)\n• Making reservations\n• Managing your profile\n• Understanding points\n• Using the app\n\nWhat do you need help with?`;
    }
    
    if (msg.includes('profile') || msg.includes('account')) {
      return "Profile settings:\n• Update your picture\n• Change your bio\n• Set dietary preferences\n• Edit personal info\n\nGo to Profile in the sidebar to make changes.";
    }
    
    if (msg.includes('point') || msg.includes('reward')) {
      return "Earn points by:\n• Reserving food\n• Rating restaurants\n• Being active on the app\n• Helping reduce waste\n\nCheck Points section to see your current score.";
    }
    
    if (msg.includes('app') || msg.includes('kindbite')) {
      return "KindBite is a food rescue platform that connects people with surplus food to reduce waste. Everything is free for users. We help restaurants share their extra food and help people find great meals.";
    }
    
    if (msg.includes('thank') || msg.includes('thanks')) {
      return "You're welcome! Is there anything else I can help you with?";
    }
    
    // Default response
    return "I can help you with food, reservations, profile, or points. What do you need?";
  };

  const handleSendMessage = async () => {
    if (input.trim()) {
      const userMessage = {
        id: Date.now(),
        text: input,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInput('');
      setIsTyping(true);
      
      // Simulate thinking time
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
      
      const aiResponse = getResponse(input);
      
      const aiMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Add welcome message
  useEffect(() => {
    if (showAIChat && messages.length === 0) {
      const welcomeMessage = {
        id: Date.now(),
        text: "Hello! I'm your KindBite AI assistant. I can help you find food, make reservations, and navigate the app. What can I do for you?",
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages([welcomeMessage]);
    }
  }, [showAIChat]);

  if (!showAIChat) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-sm">
      <div className="w-full max-w-4xl h-[80vh] max-h-[640px] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-white/10 backdrop-blur-xl">
        {/* Header */}
        <div className="relative p-4 sm:p-5 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-wide">KindBite AI Assistant</h2>
              <p className="text-sm opacity-90">Your intelligent food rescue companion</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute right-3 top-3 sm:right-4 sm:top-4 p-2 rounded-lg bg-white/15 hover:bg-white/25 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="h-[calc(100%-132px)] sm:h-[calc(100%-136px)] overflow-y-auto p-3 sm:p-4 space-y-3 bg-gradient-to-b from-white/40 to-white/20">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[82%] sm:max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                  message.sender === 'user'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white/80 text-gray-800 border border-gray-100'
                }`}
              >
                <p className="leading-relaxed text-sm sm:text-[15px] whitespace-pre-wrap">{message.text}</p>
                <p className={`text-[10px] sm:text-xs mt-1 ${
                  message.sender === 'user' ? 'text-emerald-100' : 'text-gray-500'
                }`}>
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white/80 rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
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
        <div className="p-3 sm:p-4 bg-white/60 backdrop-blur-md border-t border-white/20">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about food, reservations, or anything KindBite..."
              className="flex-1 rounded-xl px-4 py-2.5 bg-white/90 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder-gray-400 text-gray-800"
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isTyping}
              className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleAIChat;