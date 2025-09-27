import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Brain } from 'lucide-react';

const IntelligentAIChat = ({ showAIChat, onClose, foodListings = [] }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const getResponse = (userMessage) => {
    const msg = userMessage.toLowerCase().trim();
    const total = foodListings ? foodListings.length : 0;
    const free = foodListings ? foodListings.filter(f => f.discountedPrice === 0).length : 0;
    const topRated = foodListings && foodListings.length > 0 ? foodListings.sort((a, b) => b.rating - a.rating)[0] : null;
    const categories = foodListings ? [...new Set(foodListings.map(f => f.category))] : [];
    const restaurants = foodListings ? [...new Set(foodListings.map(f => f.restaurant))] : [];
    
    // Simple, reliable AI that always works
    
    // Direct greetings
    if (msg.includes('hi') || msg.includes('hello') || msg.includes('hey')) {
      if (total > 0) {
        return `Hello! I can see ${total} food items available right now. ${free > 0 ? `${free} are free!` : ''} What would you like to do?`;
      } else {
        return `Hello! No food is available right now, but I can help you with reservations, profile, or app questions. What do you need?`;
      }
    }
    
    // Food questions with intelligence
    if (msg.includes('food') || msg.includes('eat') || msg.includes('hungry') || msg.includes('menu')) {
      if (total === 0) {
        return "No food is available right now, but new items get added throughout the day! Check back later or let me know what else I can help you with.";
      }
      
      const responses = [
        `Great! I can see ${total} food items available right now. ${free > 0 ? `${free} are completely free!` : ''} What type of food are you in the mood for?`,
        `Perfect timing! There are ${total} delicious options available. ${free > 0 ? `${free} are free - what a deal!` : ''} What sounds good to you?`,
        `Awesome! ${total} food items are ready for you. ${free > 0 ? `${free} are free!` : ''} ${categories.length > 0 ? `I see ${categories.slice(0, 3).join(', ')} available.` : ''} What would you like?`
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Reservations with helpful steps
    if (msg.includes('reserve') || msg.includes('book') || msg.includes('order')) {
      if (total === 0) {
        return "There's no food available to reserve right now, but new items get added throughout the day! What else can I help you with?";
      }
      
      return `Here's how to reserve food:\n\n1. Browse the available food items\n2. Tap on one you like\n3. Click "Reserve Now"\n4. Choose your pickup time\n5. Confirm your reservation\n\n${total} items are available right now. ${free > 0 ? `${free} are free!` : ''} What would you like to reserve?`;
    }
    
    // Help with variety
    if (msg.includes('help') || msg.includes('what can you do')) {
      const helpResponses = [
        `I can help you with:\n• Finding and browsing food (${total} items available)\n• Making reservations\n• Managing your profile\n• Understanding points and rewards\n• Navigating the app\n\nWhat do you need help with?`,
        `Here's what I can do for you:\n• Show you available food items\n• Help you reserve food\n• Guide you through the app\n• Answer questions about your profile\n• Explain how points work\n\nWhat would you like to know?`,
        `I'm here to help with:\n• Food discovery and reservations\n• Profile management\n• App navigation\n• Points and rewards\n• Any KindBite questions\n\nWhat can I help you with today?`
      ];
      return helpResponses[Math.floor(Math.random() * helpResponses.length)];
    }
    
    // Recommendations with personality
    if (msg.includes('recommend') || msg.includes('suggest') || msg.includes('best')) {
      if (topRated) {
        const recommendations = [
          `I'd definitely recommend ${topRated.name} from ${topRated.restaurant}! It has ${topRated.rating} stars and ${topRated.discountedPrice === 0 ? 'it\'s completely free!' : 'it\'s available now!'} It's been getting amazing reviews. Want to reserve it?`,
          `You should try ${topRated.name} from ${topRated.restaurant}! With ${topRated.rating} stars, it's our top-rated item. ${topRated.discountedPrice === 0 ? 'And it\'s free!' : 'Plus it\'s available right now!'} Interested?`,
          `I highly recommend ${topRated.name} from ${topRated.restaurant}! It's rated ${topRated.rating} stars and ${topRated.discountedPrice === 0 ? 'it\'s free!' : 'it\'s ready for pickup!'} Should I help you reserve it?`
        ];
        return recommendations[Math.floor(Math.random() * recommendations.length)];
      }
      return `I'd love to recommend something! There are ${total} items available. ${free > 0 ? `${free} are free!` : ''} What type of food are you looking for?`;
    }
    
    // Profile help
    if (msg.includes('profile') || msg.includes('account') || msg.includes('settings')) {
      return `I can help with your profile:\n\n• Update your profile picture\n• Change your bio and personal info\n• Set dietary preferences\n• Edit contact information\n• Manage your settings\n\nGo to the Profile section in the sidebar to make changes. Need help with anything specific?`;
    }
    
    // Points explanation
    if (msg.includes('point') || msg.includes('reward') || msg.includes('earn')) {
      return `Here's how you earn points:\n\n• Reserve food items (+10 points each)\n• Rate restaurants after pickup (+5 points)\n• Be active on the app daily (+2 points)\n• Help reduce food waste (+15 points)\n• Complete your profile (+20 points)\n\nCheck the Points section to see your current score and rewards!`;
    }
    
    // Restaurant location questions
    if (msg.includes('nearest restaurant') || msg.includes('where is') || msg.includes('restaurant near') || msg.includes('closest restaurant') || msg.includes('restaurant location')) {
      if (restaurants.length > 0) {
        const restaurantList = restaurants.slice(0, 3).join(', ');
        return `Here are the nearest restaurants with available food:\n\n• ${restaurantList}\n\n${restaurants.length > 3 ? `And ${restaurants.length - 3} more!` : ''}\n\nAll these restaurants have food available right now. You can browse their items and reserve what you like. Would you like me to show you what's available from any specific restaurant?`;
      } else {
        return `I don't see any restaurants with available food right now, but new items get added throughout the day! Check back later or let me know what else I can help you with.`;
      }
    }
    
    // App information
    if (msg.includes('app') || msg.includes('kindbite') || msg.includes('what is')) {
      return `KindBite is a food rescue platform that connects people with surplus food to reduce waste. Everything is completely free for users! We help restaurants share their extra food and help people find great meals while fighting food waste. It's a win-win for everyone!`;
    }
    
    // Thanks responses
    if (msg.includes('thank') || msg.includes('thanks')) {
      const thanksResponses = [
        "You're welcome! Happy to help. Is there anything else you need?",
        "No problem at all! Let me know if you need anything else.",
        "You're very welcome! I'm here whenever you need help.",
        "My pleasure! What else can I do for you?",
        "Glad I could help! Anything else you'd like to know?"
      ];
      return thanksResponses[Math.floor(Math.random() * thanksResponses.length)];
    }
    
    // Off-topic responses
    if (msg.includes('weather') || msg.includes('news') || msg.includes('joke') || msg.includes('story') || msg.includes('movie')) {
      return "I can only help with KindBite-related questions - food, reservations, profile, and points. What do you need help with regarding the app?";
    }
    
    // Frustration responses
    if (msg.includes('frustrated') || msg.includes('angry') || msg.includes('upset') || msg.includes('annoyed')) {
      return "I understand you're frustrated. Let me know what's not working or what you need help with. I'll do everything I can to help you out.";
    }
    
    // Urgent responses
    if (msg.includes('urgent') || msg.includes('asap') || msg.includes('quick') || msg.includes('now')) {
      return "I understand this is urgent. What do you need right now? I'll help you as quickly as possible.";
    }
    
    // Statistics
    if (msg.includes('how many') || msg.includes('count') || msg.includes('total') || msg.includes('statistics')) {
      const freePercentage = foodListings && foodListings.length > 0 ? Math.round((free / total) * 100) : 0;
      return `Here's the current food situation:\n\n• ${total} total items available\n• ${free} are free (${freePercentage}%)\n• From ${restaurants.length} restaurants\n• Categories: ${categories.slice(0, 4).join(', ')}\n\nWhat would you like to do?`;
    }
    
    // Smart default responses based on context
    if (msg.includes('what') || msg.includes('how') || msg.includes('where') || msg.includes('when')) {
      const smartResponses = [
        `I can help you with that! ${total > 0 ? `Right now there are ${total} food items available.` : 'No food is available yet.'} What specifically do you need help with?`,
        `Great question! ${free > 0 ? `${free} items are free right now.` : 'I can help you with food, reservations, or app navigation.'} What would you like to know?`,
        `I'd be happy to help! ${categories.length > 0 ? `I see ${categories.slice(0, 2).join(' and ')} available.` : 'What do you need assistance with?'}`,
        `Let me help you with that! ${topRated ? `The top-rated item is ${topRated.name} from ${topRated.restaurant}.` : 'What can I do for you?'}`,
        `I'm here to help! ${total > 0 ? `There are ${total} items ready for you.` : 'What do you need help with?'}`
      ];
      return smartResponses[Math.floor(Math.random() * smartResponses.length)];
    }
    
    // Default response with variety
    const defaultResponses = [
      `I can help you with food, reservations, profile, or points. ${total > 0 ? `${total} items are available right now!` : 'What do you need?'}`,
      `I'm here to help with anything KindBite-related. ${free > 0 ? `${free} items are free!` : 'What can I do for you?'}`,
      `I can assist with finding food, making reservations, or managing your profile. ${categories.length > 0 ? `Categories include ${categories.slice(0, 2).join(' and ')}.` : 'What do you need?'}`,
      `I'm your KindBite assistant! ${topRated ? `Try ${topRated.name} - it's rated ${topRated.rating} stars!` : 'How can I help you today?'}`,
      `I can help with food discovery, reservations, and more. ${total > 0 ? `${total} items are ready!` : 'What would you like to know?'}`
    ];
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
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
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (showAIChat && messages.length === 0) {
      const welcomeMessage = {
        id: Date.now(),
        text: "Hello! I'm your KindBite assistant. How can I help you today?",
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages([welcomeMessage]);
    }
  }, [showAIChat]);

  if (!showAIChat) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-4xl h-[80vh] max-h-[640px] rounded-2xl overflow-hidden shadow-2xl bg-white/95 my-4">
        <div className="relative p-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Brain size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">KindBite AI Assistant</h2>
              <p className="text-sm opacity-90">Your food rescue companion</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-lg bg-white/15 hover:bg-white/25 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="h-[calc(100%-132px)] overflow-y-auto p-4 space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                  message.sender === 'user'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-emerald-100' : 'text-gray-500'
                }`}>
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
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

        <div className="p-4 bg-gray-50 border-t">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about food, reservations, or anything KindBite..."
              className="flex-1 rounded-xl px-4 py-2.5 bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isTyping}
              className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntelligentAIChat;