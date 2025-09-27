import React, { useState } from 'react';
import { Send, X } from 'lucide-react';

const DirectAIChat = ({ showAIChat, onClose, foodListings = [] }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [conversationCount, setConversationCount] = useState(0);

  const getResponse = (msg) => {
    const text = msg.toLowerCase();
    setConversationCount(prev => prev + 1);
    
    // Analyze food data
    const total = foodListings.length;
    const free = foodListings.filter(f => f.discountedPrice === 0).length;
    const topRated = foodListings.sort((a, b) => b.rating - a.rating)[0];
    const categories = [...new Set(foodListings.map(f => f.category))];
    const restaurants = [...new Set(foodListings.map(f => f.restaurant))];
    
    // Get conversation context
    const recentMessages = messages.slice(-2).map(m => m.text.toLowerCase());
    const hasAskedAboutFood = recentMessages.some(m => /food|eat|hungry|menu/.test(m));
    const hasAskedAboutReservation = recentMessages.some(m => /reserve|book|order/.test(m));
    
    // Food questions with varied responses
    if (text.includes('food') || text.includes('eat') || text.includes('hungry') || text.includes('menu')) {
      if (total === 0) {
        const noFoodResponses = [
          "No food available right now. Check back later for new items.",
          "Nothing available at the moment. New items get added throughout the day.",
          "No food items right now. Try refreshing or check back soon."
        ];
        return noFoodResponses[conversationCount % noFoodResponses.length];
      }
      
      if (hasAskedAboutFood) {
        const followUpResponses = [
          `Still looking for food? I can see ${total} items available. ${free > 0 ? `${free} are free!` : ''} Have you checked the Search section?`,
          `I see you're still interested in food. There are ${total} items available. ${free > 0 ? `${free} are completely free!` : ''} What type are you craving?`,
          `Food search again? Great! ${total} items are available. ${free > 0 ? `${free} are free!` : ''} Want me to help you find something specific?`
        ];
        return followUpResponses[conversationCount % followUpResponses.length];
      }
      
      const foodResponses = [
        `I found ${total} food items available. ${free > 0 ? `${free} are completely free!` : ''} ${topRated ? `Top rated: ${topRated.name} from ${topRated.restaurant} (${topRated.rating}★). ` : ''}What type of food are you looking for?`,
        `Great news! ${total} food items are available. ${free > 0 ? `${free} are free!` : ''} ${categories.length > 0 ? `Categories: ${categories.slice(0, 3).join(', ')}. ` : ''}What sounds good to you?`,
        `Perfect timing! ${total} items are ready. ${free > 0 ? `${free} are completely free!` : ''} ${topRated ? `The best one is ${topRated.name} from ${topRated.restaurant} (${topRated.rating}★). ` : ''}What are you in the mood for?`
      ];
      return foodResponses[conversationCount % foodResponses.length];
    }
    
    // Reservations with varied responses
    if (text.includes('reserve') || text.includes('book') || text.includes('order')) {
      if (total === 0) {
        const noReserveResponses = [
          "No food available to reserve. Check back later.",
          "Nothing to reserve right now. New items get added throughout the day.",
          "No items available for reservation. Try again later."
        ];
        return noReserveResponses[conversationCount % noReserveResponses.length];
      }
      
      if (hasAskedAboutReservation) {
        const followUpReserveResponses = [
          `Still working on that reservation? I can see ${total} items available. ${free > 0 ? `${free} are free!` : ''} Just pick one and tap 'Reserve Now'.`,
          `Reservation help again? Perfect! ${total} items are ready. ${free > 0 ? `${free} are free!` : ''} What looks good to you?`,
          `Need more reservation help? No problem! ${total} items available. ${free > 0 ? `${free} are free!` : ''} Which one do you want to reserve?`
        ];
        return followUpReserveResponses[conversationCount % followUpReserveResponses.length];
      }
      
      const reserveResponses = [
        `To reserve food:\n1. Browse the food items\n2. Tap on one you like\n3. Click "Reserve Now"\n4. Choose pickup time\n5. Confirm\n\n${total} items available. ${free > 0 ? `${free} are free!` : ''} What would you like to reserve?`,
        `Making a reservation is easy:\n1. Find a food item\n2. Tap it\n3. Hit "Reserve Now"\n4. Pick your time\n5. Confirm\n\n${total} items ready. ${free > 0 ? `${free} are free!` : ''} What catches your eye?`,
        `Here's how to reserve:\n1. Look through the food\n2. Choose one you like\n3. Tap "Reserve Now"\n4. Select pickup time\n5. Confirm\n\n${total} items available. ${free > 0 ? `${free} are free!` : ''} What do you want to reserve?`
      ];
      return reserveResponses[conversationCount % reserveResponses.length];
    }
    
    // Profile help
    if (text.includes('profile') || text.includes('account') || text.includes('settings')) {
      return "Profile settings:\n• Update your picture\n• Change your bio\n• Set dietary preferences\n• Edit personal info\n\nGo to Profile in the sidebar to make changes.";
    }
    
    // Points explanation
    if (text.includes('point') || text.includes('reward') || text.includes('earn')) {
      return "Earn points by:\n• Reserving food\n• Rating restaurants\n• Being active on the app\n• Helping reduce waste\n\nCheck Points section to see your current score and how to earn more.";
    }
    
    // Help with specific options
    if (text.includes('help') || text.includes('how') || text.includes('what')) {
      return "I can help you with:\n• Finding food (${total} items available)\n• Making reservations\n• Managing your profile\n• Understanding points\n• Using the app\n\nWhat specifically do you need help with?";
    }
    
    // Greetings with varied responses
    if (text.includes('hi') || text.includes('hello') || text.includes('hey') || text.includes('good morning') || text.includes('good afternoon')) {
      if (total > 0) {
        const greetingResponses = [
          `Hello! I can see ${total} food items available right now. ${free > 0 ? `${free} are free!` : ''} What would you like to do?`,
          `Hi there! ${total} food items are available. ${free > 0 ? `${free} are completely free!` : ''} What can I help you with?`,
          `Hey! Great timing - ${total} items are ready. ${free > 0 ? `${free} are free!` : ''} What would you like to do?`
        ];
        return greetingResponses[conversationCount % greetingResponses.length];
      }
      
      const noFoodGreetingResponses = [
        "Hello! Welcome to KindBite. I'm here to help you find food and make reservations. What can I do for you?",
        "Hi! I'm your KindBite assistant. I can help you with food, reservations, and more. What do you need?",
        "Hey there! Welcome to KindBite. I'm here to help you navigate the app. What can I do for you?"
      ];
      return noFoodGreetingResponses[conversationCount % noFoodGreetingResponses.length];
    }
    
    // App questions
    if (text.includes('app') || text.includes('kindbite') || text.includes('what is')) {
      return "KindBite is a food rescue platform that connects people with surplus food to reduce waste. Everything is free for users. We help restaurants share their extra food and help people find great meals.";
    }
    
    // Capability questions
    if (text.includes('what can you do') || text.includes('who are you')) {
      return "I'm your KindBite assistant. I can help you find food, make reservations, manage your profile, and navigate the app. I only help with KindBite-related questions though. What do you need help with?";
    }
    
    // Thanks
    if (text.includes('thank') || text.includes('thanks')) {
      return "You're welcome! Is there anything else I can help you with?";
    }
    
    // Off-topic
    if (text.includes('weather') || text.includes('news') || text.includes('joke') || text.includes('story')) {
      return "I can only help with KindBite - food, reservations, profile, and points. What do you need help with?";
    }
    
    // Default with helpful context
    return "I can help you with food, reservations, profile, or points. What do you need?";
  };

  const handleSend = () => {
    if (input.trim()) {
      const userMsg = {
        id: Date.now(),
        text: input,
        sender: 'user',
        time: new Date().toLocaleTimeString()
      };
      
      const aiMsg = {
        id: Date.now() + 1,
        text: getResponse(input),
        sender: 'ai',
        time: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, userMsg, aiMsg]);
      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  if (!showAIChat) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl h-[500px] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-lg">🤖</span>
            </div>
            <h3 className="text-lg font-semibold">KindBite AI</h3>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs p-3 rounded-2xl ${
                msg.sender === 'user' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
              }`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <p className={`text-xs mt-1 ${
                  msg.sender === 'user' ? 'text-green-100' : 'text-gray-500'
                }`}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-gray-200 rounded-b-2xl">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about food, reservations, or anything..."
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectAIChat;
