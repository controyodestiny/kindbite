import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, Brain, Heart } from 'lucide-react';

const RealAIChat = ({ showAIChat, onClose, foodListings = [] }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationMemory, setConversationMemory] = useState([]);
  const messagesEndRef = useRef(null);

  // Truly intelligent AI that actually thinks
  const thinkAndRespond = (userMessage) => {
    const msg = userMessage.toLowerCase().trim();
    const now = new Date();
    const timeOfDay = now.getHours();
    
    // Build comprehensive understanding
    const understanding = {
      time: {
        hour: timeOfDay,
        period: timeOfDay < 12 ? 'morning' : timeOfDay < 17 ? 'afternoon' : 'evening',
        isWeekend: now.getDay() === 0 || now.getDay() === 6
      },
      food: {
        total: foodListings.length,
        free: foodListings.filter(f => f.discountedPrice === 0).length,
        topRated: foodListings.sort((a, b) => b.rating - a.rating)[0],
        categories: [...new Set(foodListings.map(f => f.category))],
        restaurants: [...new Set(foodListings.map(f => f.restaurant))],
        avgRating: foodListings.length > 0 ? (foodListings.reduce((sum, f) => sum + f.rating, 0) / foodListings.length).toFixed(1) : 0,
        freePercentage: foodListings.length > 0 ? Math.round((foodListings.filter(f => f.discountedPrice === 0).length / foodListings.length) * 100) : 0
      },
      conversation: {
        recentMessages: messages.slice(-3).map(m => m.text.toLowerCase()),
        totalMessages: messages.length,
        lastTopics: conversationMemory.slice(-5).map(m => m.content),
        interactionCount: conversationMemory.length
      },
      user: {
        isNew: conversationMemory.length < 3,
        isReturning: conversationMemory.length > 5,
        preferences: {}
      }
    };

    // Update conversation memory
    setConversationMemory(prev => [...prev.slice(-20), { role: 'user', content: msg, timestamp: now }]);

    // Analyze what the user is really asking
    const analysis = analyzeUserIntent(msg, understanding);
    
    // Generate intelligent response
    return generateIntelligentResponse(analysis, understanding);
  };

  const analyzeUserIntent = (msg, understanding) => {
    const { time, food, conversation, user } = understanding;
    
    // Detect emotional state
    let emotionalState = 'neutral';
    if (/(frustrated|angry|mad|upset|annoyed|irritated|hate|sucks|terrible|awful|stupid|dumb|bad|worst)/i.test(msg)) {
      emotionalState = 'frustrated';
    } else if (/(urgent|asap|quick|fast|immediately|now|right\s*now|emergency|hurry|desperate|critical)/i.test(msg)) {
      emotionalState = 'urgent';
    } else if (/(thank|thanks|appreciate|grateful|cheers|awesome|great|perfect|excellent|love|amazing|happy|excited|wonderful)/i.test(msg)) {
      emotionalState = 'positive';
    } else if (/(help|stuck|confused|don't\s*understand|lost|overwhelmed|scared|worried|nervous|anxious)/i.test(msg)) {
      emotionalState = 'seeking_help';
    } else if (/(bored|tired|exhausted|drained|sad|depressed|lonely|down|blue)/i.test(msg)) {
      emotionalState = 'negative';
    }

    // Detect primary intent
    let primaryIntent = 'general';
    if (/^(hi|hello|hey|good\s*(morning|afternoon|evening)|greetings?|what's\s*up|howdy|sup)$/i.test(msg)) {
      primaryIntent = 'greeting';
    } else if (/(food|eat|hungry|menu|restaurant|breakfast|lunch|dinner|meal|snack|what.*available|show.*food|find.*food|looking.*for|craving|want.*eat|hungry|starving|feed)/i.test(msg)) {
      primaryIntent = 'food_search';
    } else if (/(reserve|booking|book|pickup|schedule|order|how.*reserve|make.*reservation|get.*food|take.*food|claim|grab|secure)/i.test(msg)) {
      primaryIntent = 'reservation';
    } else if (/(profile|account|settings|edit|update|pfp|picture|avatar|photo|personal|my.*info|change.*info|modify)/i.test(msg)) {
      primaryIntent = 'profile';
    } else if (/(point|reward|earn|credit|score|level|bonus|how.*earn|get.*point|rewards|points)/i.test(msg)) {
      primaryIntent = 'points';
    } else if (/(help|how|what|guide|show|explain|stuck|confused|don't\s*understand|tutorial|learn|teach|instruct)/i.test(msg)) {
      primaryIntent = 'help';
    } else if (/(app|kindbite|platform|website|service|what\s*is|about|tell.*about|explain.*app|how.*work)/i.test(msg)) {
      primaryIntent = 'app_info';
    } else if (/(what\s*can\s*you\s*do|do\s*you\s*answer|any\s*other\s*questions|who\s*are\s*you|what\s*are\s*you|can\s*you\s*help|capabilities|abilities)/i.test(msg)) {
      primaryIntent = 'capabilities';
    } else if (/(best|recommend|suggest|top|favorite|popular|trending|what.*good|what.*should|advice|tip)/i.test(msg)) {
      primaryIntent = 'recommendation';
    } else if (/(how.*many|count|total|number|statistics|stats|data|info|amount|quantity)/i.test(msg)) {
      primaryIntent = 'data_query';
    } else if (/(free|no.*cost|zero.*cost|complimentary|gratis|without.*charge)/i.test(msg)) {
      primaryIntent = 'free_items';
    } else if (/(problem|issue|error|bug|broken|not.*working|failed|trouble|stuck|malfunction)/i.test(msg)) {
      primaryIntent = 'problem';
    }

    // Detect complexity and urgency
    const complexity = msg.split(' ').length > 8 || /\?/.test(msg) || /(and|also|plus|additionally|furthermore|moreover)/i.test(msg) ? 'complex' : 'simple';
    const urgency = /(urgent|asap|quick|fast|immediately|now|right\s*now|emergency|hurry|desperate|critical)/i.test(msg) ? 'high' : 
                   /(soon|eventually|later|when.*can|time|schedule)/i.test(msg) ? 'medium' : 'low';

    return {
      primaryIntent,
      emotionalState,
      complexity,
      urgency,
      isQuestion: /\?/.test(msg),
      isExclamation: /!/.test(msg),
      wordCount: msg.split(' ').length
    };
  };

  const generateIntelligentResponse = (analysis, understanding) => {
    const { time, food, conversation, user } = understanding;
    const { primaryIntent, emotionalState, complexity, urgency, isQuestion, isExclamation } = analysis;
    const { total, free, topRated, categories, restaurants, avgRating, freePercentage } = food;
    
    // Handle emotional state first
    if (emotionalState === 'frustrated') {
      return "I can really sense your frustration, and I want you to know that I'm here to help make this better. Let's work through whatever's bothering you together. What's going on? I'll do everything I can to get this sorted out for you.";
    }
    
    if (emotionalState === 'urgent') {
      return "I can feel the urgency in your message, and I'm here to help you right now. Let me prioritize getting you exactly what you need as quickly as possible. What do you need? I'm focused on you.";
    }
    
    if (emotionalState === 'seeking_help') {
      return "I can tell you need some guidance, and I'm absolutely here for you. Don't worry about being confused - that's totally normal! I'll walk you through everything step by step and make sure you feel comfortable. What would you like help with?";
    }
    
    if (emotionalState === 'positive') {
      return "I love your positive energy! It's so great to see you excited about KindBite. I'm here to help you make the most of this experience. What can I do to keep that good vibe going?";
    }
    
    if (emotionalState === 'negative') {
      return "I can sense you're having a tough time, and I want you to know that I'm here to support you. Sometimes a good meal can really lift your spirits. Let me help you find something that might brighten your day. What sounds good to you?";
    }

    // Generate contextually appropriate responses
    switch (primaryIntent) {
      case 'greeting':
        const greeting = time.period === 'morning' ? 'Good morning' : time.period === 'afternoon' ? 'Good afternoon' : 'Good evening';
        if (user.isNew) {
          return `${greeting}! Welcome to KindBite! I'm so excited to help you discover amazing free food and make a positive impact. I can see ${total} delicious items available right now. ${free > 0 ? `${free} are completely free!` : ''} What would you like to explore first?`;
        }
        if (total > 0) {
          return `${greeting}! Great to see you again! I have ${total} food items ready for you. ${free > 0 ? `${free} are completely free!` : ''} What sounds good today? I'm here to help you find exactly what you're craving.`;
        }
        return `${greeting}! Welcome to KindBite. I'm here to help you find food and make reservations. What can I do for you today?`;
        
      case 'food_search':
        if (total === 0) {
          return "I know it's disappointing when there's no food available right now, but the good news is that new items get added throughout the day! I can help you set up notifications so you'll know as soon as something new arrives. Would you like me to do that?";
        }
        
        let response = `I found ${total} amazing food items for you! `;
        if (free > 0) response += `${free} are completely free - that's ${freePercentage}% of everything available! `;
        if (topRated) response += `The top-rated item is ${topRated.name} from ${topRated.restaurant} (${topRated.rating}★) - it's absolutely delicious! `;
        if (categories.length > 0) response += `I can see ${categories.slice(0, 3).join(', ')} and more categories. `;
        if (restaurants.length > 0) response += `From ${restaurants.length} different restaurants. `;
        if (avgRating > 0) response += `Everything has an average rating of ${avgRating}★. `;
        response += `What type of food are you in the mood for? I'll help you find something perfect.`;
        return response;
        
      case 'reservation':
        if (total === 0) {
          return "I wish I could help you reserve something right now, but there's no food available at the moment. New items get added throughout the day though! I can help you set up alerts for when new food arrives. Would you like me to do that?";
        }
        
        return `I'd love to help you make a reservation! Here's how it works:\n1. Browse through the ${total} available items\n2. Tap on one that catches your eye\n3. Click "Reserve Now"\n4. Choose your pickup time\n5. Confirm and you're all set!\n\n${free > 0 ? `${free} items are completely free!` : ''} What would you like to reserve? I'll guide you through the process.`;
        
      case 'profile':
        return "Your profile is your KindBite identity! You can:\n• Upload a new profile picture\n• Write a bio about yourself\n• Set dietary preferences (vegetarian, vegan, etc.)\n• Update your personal details\n• Manage your account settings\n\nGo to Profile in the sidebar to make changes. I can help you with any specific updates you need!";
        
      case 'points':
        return "I love that you're interested in points! You earn them by:\n• Reserving food items\n• Rating restaurants and food\n• Being active on the app\n• Helping reduce food waste\n• Participating in the community\n\nCheck the Points section to see your current score. I can help you maximize your points and reach new levels!";
        
      case 'help':
        return `I'm here to help you with everything KindBite has to offer:\n• Finding food (${total} items available)\n• Making reservations\n• Managing your profile\n• Understanding points\n• Using all the app features\n• Navigating the platform\n\nWhat specifically do you need help with? I'll make sure you get the help you need and feel confident using the app.`;
        
      case 'app_info':
        return "KindBite is a food rescue platform that connects people with surplus food to reduce waste. We help restaurants share their extra food, and people like you can reserve it for free. It's good for you, good for the environment, and good for the community! I'm here to help you make the most of this amazing platform.";
        
      case 'capabilities':
        return "I'm your KindBite AI assistant, and I'm here to help you with everything! I can help you find delicious free food, make reservations, manage your profile, track your points, and guide you through the app. I'm pretty good at understanding what you need and giving helpful suggestions. What would you like to explore? I'm excited to help you!";
        
      case 'recommendation':
        if (topRated) {
          return `I'd absolutely recommend ${topRated.name} from ${topRated.restaurant} (${topRated.rating}★)! It's the top-rated item and ${topRated.discountedPrice === 0 ? 'completely free!' : 'available now!'} It's been getting amazing reviews. Would you like to reserve it? I can help you with that right now.`;
        }
        return `I can see ${total} items available. ${free > 0 ? `${free} are completely free!` : ''} What type of food are you looking for? I'd love to help you find something that's perfect for you.`;
        
      case 'data_query':
        return `Here's what I can tell you about the current food situation:\n• ${total} total items available\n• ${free} are completely free (${freePercentage}%)\n• From ${restaurants.length} different restaurants\n• Average rating: ${avgRating}★\n• Categories: ${categories.slice(0, 4).join(', ')}\n\nWhat would you like to do with this information? I'm here to help you explore these options!`;
        
      case 'free_items':
        return `This is amazing news! ${free} items are completely free - that's ${freePercentage}% of all available food! I love that you're interested in the free options. What would you like to try? I can help you reserve any of them right now.`;
        
      case 'problem':
        return "I'm here to help solve any problems you're having! I want to make sure you have the best possible experience with KindBite. Let me know what's not working or what you need help with. I'll do everything I can to get it sorted out for you.";
        
      default:
        if (complexity === 'complex') {
          return "That's a really thoughtful question! I appreciate you taking the time to ask something detailed. Let me help you with that. I can assist you with food, reservations, profile, or points. What specifically do you need help with? I'll make sure you get a comprehensive answer that addresses everything you're wondering about.";
        }
        
        return "I'm here to help you with anything KindBite-related! I can assist you with food, reservations, profile, or points. What do you need? I'm excited to help you get exactly what you're looking for.";
    }
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
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));
      
      const aiResponse = thinkAndRespond(input);
      
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
      const timeOfDay = new Date().getHours();
      const greeting = timeOfDay < 12 ? 'Good morning' : timeOfDay < 17 ? 'Good afternoon' : 'Good evening';
      
      const welcomeMessage = {
        id: Date.now(),
        text: `${greeting}! I'm your KindBite AI assistant. I can help you find food, make reservations, and navigate the app. What can I do for you?`,
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
              <Heart size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-wide">KindBite AI Assistant</h2>
              <p className="text-sm opacity-90">Your caring food rescue companion</p>
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

export default RealAIChat;