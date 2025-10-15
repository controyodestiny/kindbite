import React, { useState, useEffect, useRef } from 'react';
import { Search, Paperclip, Smile, X, Phone, Video, MoreVertical } from 'lucide-react';

const ChatModal = ({ conversation, onClose, onSendMessage }) => {
  const [messageInput, setMessageInput] = useState('');
  const [localMessages, setLocalMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (conversation && conversation.messages) {
      setLocalMessages(conversation.messages);
    }
  }, [conversation]);

  useEffect(() => {
    scrollToBottom();
  }, [localMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: messageInput,
      sender: 'user',
      status: 'sent',
      timestamp: new Date().toLocaleTimeString(),
      fullTimestamp: new Date().toISOString()
    };

    // Add to local messages immediately
    const updatedMessages = [...localMessages, newMessage];
    setLocalMessages(updatedMessages);

    // Save to localStorage
    saveMessagesToStorage(conversation.id, updatedMessages);

    // Call parent handler
    if (onSendMessage) {
      onSendMessage(conversation.id, newMessage);
    }

    // Clear input
    setMessageInput('');

    // Simulate response after a short delay
    setTimeout(() => {
      simulateResponse(updatedMessages);
    }, 1000);
  };

  const saveMessagesToStorage = (conversationId, messages) => {
    try {
      const storageKey = `kindbite_chat_${conversationId}`;
      localStorage.setItem(storageKey, JSON.stringify(messages));
      
      // Also update the conversations list in localStorage
      const conversationsKey = 'kindbite_conversations';
      const savedConversations = localStorage.getItem(conversationsKey);
      if (savedConversations) {
        const conversations = JSON.parse(savedConversations);
        const updatedConversations = conversations.map(conv => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              messages: messages,
              lastMessage: messages[messages.length - 1]?.text || 'No messages',
              lastMessageTime: messages[messages.length - 1]?.fullTimestamp || new Date().toISOString()
            };
          }
          return conv;
        });
        localStorage.setItem(conversationsKey, JSON.stringify(updatedConversations));
      }
    } catch (error) {
      console.error('Failed to save messages to localStorage:', error);
    }
  };

  const simulateResponse = (currentMessages) => {
    setIsTyping(true);
    
    // Get the user's last message
    const userMessage = currentMessages[currentMessages.length - 1];
    const userText = userMessage.text.toLowerCase();
    
    // Generate contextual response based on user message and contact role
    const responseMessage = generateContextualResponse(userText, conversation);
    
    setTimeout(() => {
      const updatedMessages = [...currentMessages, responseMessage];
      setLocalMessages(updatedMessages);
      
      // Save response to localStorage
      saveMessagesToStorage(conversation.id, updatedMessages);
      
      setIsTyping(false);
    }, 1500 + Math.random() * 1000); // Random delay between 1.5-2.5 seconds
  };

  const generateContextualResponse = (userText, contact) => {
    const contactRole = contact.role.toLowerCase();
    const contactName = contact.name;
    
    // Actually understand what they're asking and respond naturally
    const userTextLower = userText.toLowerCase();
    
    // If they're asking about farming/gardening
    if (userTextLower.includes('farm') || userTextLower.includes('growing') || userTextLower.includes('garden') || userTextLower.includes('crops')) {
      if (contactRole.includes('farmer') || contactRole.includes('chef') || contactRole.includes('home')) {
        // Give a real, specific response about their farm
        if (userTextLower.includes('what') || userTextLower.includes('how')) {
          return {
            id: Date.now() + 1,
            text: `We have a small organic garden! Right now we're harvesting tomatoes, cucumbers, and fresh herbs. The tomatoes are just starting to ripen - they should be perfect in a few days. Are you interested in any of these?`,
            sender: 'other',
            status: 'received',
            timestamp: new Date().toLocaleTimeString(),
            fullTimestamp: new Date().toISOString()
          };
        } else {
          // They're just mentioning the farm
          return {
            id: Date.now() + 1,
            text: `Yes! Our garden is doing really well this season. The weather has been perfect for growing. What kind of vegetables do you usually like to cook with?`,
            sender: 'other',
            status: 'received',
            timestamp: new Date().toLocaleTimeString(),
            fullTimestamp: new Date().toISOString()
          };
        }
      }
    }
    
    // If they're asking about time/hours
    if (userTextLower.includes('time') || userTextLower.includes('open') || userTextLower.includes('when') || userTextLower.includes('hours')) {
      if (contactRole.includes('restaurant') || contactRole.includes('chef') || contactRole.includes('bakery')) {
        return {
          id: Date.now() + 1,
          text: `We're open from 8 AM to 10 PM daily! What time were you thinking of coming by? I can make sure to have something fresh ready for you.`,
          sender: 'other',
          status: 'received',
          timestamp: new Date().toLocaleTimeString(),
          fullTimestamp: new Date().toISOString()
        };
      } else if (contactRole.includes('supermarket') || contactRole.includes('market')) {
        return {
          id: Date.now() + 1,
          text: `We're open 7 AM to 9 PM! The morning is usually when we get the freshest produce in. What are you looking for?`,
          sender: 'other',
          status: 'received',
          timestamp: new Date().toLocaleTimeString(),
          fullTimestamp: new Date().toISOString()
        };
      }
    }
    
    // If they're asking what's available
    if (userTextLower.includes('available') || userTextLower.includes('have') || userTextLower.includes('what') || userTextLower.includes('menu')) {
      if (contactRole.includes('chef') || contactRole.includes('restaurant')) {
        return {
          id: Date.now() + 1,
          text: `Today I made fresh sourdough bread, some chicken curry, and a vegetable stir fry. I also have leftover pasta from lunch service. What sounds good to you?`,
          sender: 'other',
          status: 'received',
          timestamp: new Date().toLocaleTimeString(),
          fullTimestamp: new Date().toISOString()
        };
      } else if (contactRole.includes('supermarket')) {
        return {
          id: Date.now() + 1,
          text: `We have fresh produce, bread from this morning, dairy products, and lots of pantry staples. Is there something specific you're looking for?`,
          sender: 'other',
          status: 'received',
          timestamp: new Date().toLocaleTimeString(),
          fullTimestamp: new Date().toISOString()
        };
      }
    }
    
    // If they're asking about prices
    if (userTextLower.includes('price') || userTextLower.includes('cost') || userTextLower.includes('how much')) {
      if (contactRole.includes('chef') || contactRole.includes('restaurant')) {
        return {
          id: Date.now() + 1,
          text: `Everything is heavily discounted to prevent waste! The bread is UGX 2,000 (usually UGX 5,000), curry is UGX 3,500 (usually UGX 8,000). Much better than throwing it away, right?`,
          sender: 'other',
          status: 'received',
          timestamp: new Date().toLocaleTimeString(),
          fullTimestamp: new Date().toISOString()
        };
      } else if (contactRole.includes('supermarket')) {
        return {
          id: Date.now() + 1,
          text: `We discount everything 60-90% off retail to prevent waste. Fresh produce is usually UGX 1,000-2,000, bread around UGX 1,500. What's your budget?`,
          sender: 'other',
          status: 'received',
          timestamp: new Date().toLocaleTimeString(),
          fullTimestamp: new Date().toISOString()
        };
      }
    }
    
    // If they're asking about pickup/location
    if (userTextLower.includes('pickup') || userTextLower.includes('collect') || userTextLower.includes('where') || userTextLower.includes('address')) {
      return {
        id: Date.now() + 1,
        text: `I'm at 123 Main Street, near the park. Just let me know when you're coming and I'll have everything ready. What time works best for you?`,
        sender: 'other',
        status: 'received',
        timestamp: new Date().toLocaleTimeString(),
        fullTimestamp: new Date().toISOString()
      };
    }
    
    // If they're asking about dietary restrictions
    if (userTextLower.includes('vegetarian') || userTextLower.includes('vegan') || userTextLower.includes('gluten') || userTextLower.includes('halal')) {
      return {
        id: Date.now() + 1,
        text: `I have options for all dietary needs! Vegetarian, vegan, gluten-free, and halal options available. What are your preferences? I can make sure to have something that works for you.`,
        sender: 'other',
        status: 'received',
        timestamp: new Date().toLocaleTimeString(),
        fullTimestamp: new Date().toISOString()
      };
    }
    
    // If they're asking about quality/freshness
    if (userTextLower.includes('fresh') || userTextLower.includes('quality') || userTextLower.includes('good') || userTextLower.includes('safe')) {
      return {
        id: Date.now() + 1,
        text: `Absolutely! Everything is fresh and safe to eat. I follow strict food safety guidelines and only offer food that I would eat myself. Would you like me to describe what I have available?`,
        sender: 'other',
        status: 'received',
        timestamp: new Date().toLocaleTimeString(),
        fullTimestamp: new Date().toISOString()
      };
    }
    
    // If they're asking about environmental impact
    if (userTextLower.includes('waste') || userTextLower.includes('environment') || userTextLower.includes('eco') || userTextLower.includes('green')) {
      return {
        id: Date.now() + 1,
        text: `Great question! By rescuing this food, you're helping prevent waste and reduce CO₂ emissions. Every meal counts! Want to know your impact?`,
        sender: 'other',
        status: 'received',
        timestamp: new Date().toLocaleTimeString(),
        fullTimestamp: new Date().toISOString()
      };
    }
    
    // If they're asking "how are you" - respond naturally
    if (userTextLower.includes('how are you') || userTextLower.includes('how\'s it going')) {
      return {
        id: Date.now() + 1,
        text: `I'm doing great! Been busy in the kitchen today. How about you?`,
        sender: 'other',
        status: 'received',
        timestamp: new Date().toLocaleTimeString(),
        fullTimestamp: new Date().toISOString()
      };
    }
    
    // If they're saying thanks
    if (userTextLower.includes('thanks') || userTextLower.includes('thank you') || userTextLower.includes('thx')) {
      return {
        id: Date.now() + 1,
        text: `You're welcome! Happy to help reduce food waste together.`,
        sender: 'other',
        status: 'received',
        timestamp: new Date().toLocaleTimeString(),
        fullTimestamp: new Date().toISOString()
      };
    }
    
    // If they're saying goodbye
    if (userTextLower.includes('bye') || userTextLower.includes('goodbye') || userTextLower.includes('see you')) {
      return {
        id: Date.now() + 1,
        text: `See you soon! Don't forget to check back for more delicious food.`,
        sender: 'other',
        status: 'received',
        timestamp: new Date().toLocaleTimeString(),
        fullTimestamp: new Date().toISOString()
      };
    }
    
    // If they're asking a question (ends with ?)
    if (userTextLower.includes('?')) {
      return {
        id: Date.now() + 1,
        text: `That's a good question! I'd be happy to help. What specifically would you like to know about our food or services?`,
        sender: 'other',
        status: 'received',
        timestamp: new Date().toLocaleTimeString(),
        fullTimestamp: new Date().toISOString()
      };
    }
    
    // If they're making a positive comment
    if (userTextLower.includes('great') || userTextLower.includes('good') || userTextLower.includes('nice') || userTextLower.includes('cool') || userTextLower.includes('awesome')) {
      return {
        id: Date.now() + 1,
        text: `I'm glad you think so! What would you like to know more about?`,
        sender: 'other',
        status: 'received',
        timestamp: new Date().toLocaleTimeString(),
        fullTimestamp: new Date().toISOString()
      };
    }
    
    // For anything else - acknowledge and ask a relevant follow-up
    return {
      id: Date.now() + 1,
      text: `That sounds interesting! Tell me more about what you're looking for.`,
      sender: 'other',
      status: 'received',
      timestamp: new Date().toLocaleTimeString(),
      fullTimestamp: new Date().toISOString()
    };
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileMessage = {
        id: Date.now(),
        text: `📎 ${file.name}`,
        sender: 'user',
        status: 'sent',
        timestamp: new Date().toLocaleTimeString(),
        fullTimestamp: new Date().toISOString(),
        isFile: true,
        fileName: file.name,
        fileSize: file.size
      };

      const updatedMessages = [...localMessages, fileMessage];
      setLocalMessages(updatedMessages);
      saveMessagesToStorage(conversation.id, updatedMessages);
      
      if (onSendMessage) {
        onSendMessage(conversation.id, fileMessage);
      }
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Unknown time';
    
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return 'Invalid time';
    
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

  const getMessageStatus = (status) => {
    switch (status) {
      case 'sent':
        return '✓';
      case 'delivered':
        return '✓✓';
      case 'read':
        return '✓✓';
      default:
        return '✓';
    }
  };

  if (!conversation) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Chat Header */}
        <div className="bg-green-500 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-2xl">
              {conversation.avatar}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{conversation.name}</h3>
              <p className="text-green-100 text-sm">{conversation.role}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-green-600 rounded-full transition-colors">
              <Video size={20} />
            </button>
            <button className="p-2 hover:bg-green-600 rounded-full transition-colors">
              <Phone size={20} />
            </button>
            <button className="p-2 hover:bg-green-600 rounded-full transition-colors">
              <Search size={20} />
            </button>
            <button className="p-2 hover:bg-green-600 rounded-full transition-colors">
              <MoreVertical size={20} />
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-green-600 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {localMessages.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No messages yet</h3>
              <p className="text-gray-600">Start the conversation by sending a message!</p>
            </div>
          ) : (
            localMessages.map((message, index) => {
              const showDate = index === 0 || 
                (message.fullTimestamp && localMessages[index - 1]?.fullTimestamp &&
                new Date(message.fullTimestamp).toDateString() !== 
                new Date(localMessages[index - 1].fullTimestamp).toDateString());
              
              return (
                <div key={message.id}>
                  {/* Date Separator */}
                  {showDate && (
                    <div className="text-center my-4">
                      <span className="bg-white px-3 py-1 rounded-full text-xs text-gray-500 border">
                        {formatTime(message.fullTimestamp)}
                      </span>
                    </div>
                  )}
                  
                  {/* Message */}
                  <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'user' 
                        ? 'bg-green-500 text-white rounded-br-none' 
                        : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                    }`}>
                      {message.isFile ? (
                        <div className="flex items-center space-x-2">
                          <span>📎</span>
                          <span>{message.fileName}</span>
                          <span className="text-xs opacity-75">
                            ({(message.fileSize / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                      ) : (
                        <p className="text-sm">{message.text}</p>
                      )}
                      
                      <div className={`flex items-center justify-between mt-1 text-xs ${
                        message.sender === 'user' ? 'text-green-100' : 'text-gray-500'
                      }`}>
                        <span>{message.timestamp}</span>
                        {message.sender === 'user' && (
                          <span className="ml-2">{getMessageStatus(message.status)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 rounded-lg rounded-bl-none shadow-sm px-4 py-2">
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

        {/* Message Input */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-500 hover:text-green-500 transition-colors"
            >
              <Paperclip size={20} />
            </button>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx"
            />
            
            <div className="flex-1 relative">
              <textarea
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type a message..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none resize-none"
                rows={1}
                style={{ minHeight: '40px', maxHeight: '120px' }}
              />
            </div>
            
            <button
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
              className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="text-sm font-medium">Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModal; 