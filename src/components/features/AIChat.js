import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, ThumbsUp, ThumbsDown, Loader } from 'lucide-react';
import chatService from '../../services/chatService';
import { useToast } from '../../contexts/ToastContext';

const AIChat = ({ 
  showAIChat, 
  onClose
}) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const messagesEndRef = useRef(null);
  const toast = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (showAIChat && messages.length === 0) {
      // Show welcome message when chat opens
      setMessages([{
        id: 'welcome',
        message_type: 'ai',
        content: `👋 Hello! I'm your KindBite AI Assistant.

I'm here to help you with:
🍽️ **Food & Nutrition** - Recipes, ingredients, and healthy eating tips
🌱 **Sustainability** - Reducing food waste and environmental impact
🛡️ **Food Safety** - Safe handling, storage, and pickup guidelines
📱 **KindBite Platform** - How to use our features and earn KindCoins

What would you like to know about?`,
        created_at: new Date().toISOString()
      }]);
    }
  }, [showAIChat, messages.length]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message to chat
    const userMsg = {
      id: Date.now(),
      message_type: 'user',
      content: userMessage,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      const response = await chatService.sendMessage(userMessage, currentSessionId);
      
      // Update session ID if this is a new chat
      if (!currentSessionId) {
        setCurrentSessionId(response.session_id);
      }

      // Add AI response to chat
      const aiMsg = {
        ...response.ai_response,
        id: response.ai_response.id || Date.now() + 1
      };
      setMessages(prev => [...prev, aiMsg]);

    } catch (error) {
      console.error('Chat error:', error);
      toast.error(error.message || 'Failed to send message. Please try again.');
      
      // Add error message to chat
      const errorMsg = {
        id: Date.now() + 1,
        message_type: 'ai',
        content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFeedback = async (messageId, rating) => {
    try {
      await chatService.submitFeedback(messageId, rating);
      toast.success('Thank you for your feedback!');
    } catch (error) {
      toast.error('Failed to submit feedback');
    }
  };

  if (!showAIChat) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg flex flex-col max-w-md w-full h-96 lg:w-96 lg:h-[500px] lg:max-w-2xl">
        <div className="bg-green-600 text-white p-4 rounded-t-lg flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Bot size={20} className="lg:w-6 lg:h-6" />
            <span className="font-semibold lg:text-lg">
              KindBite AI Assistant
            </span>
          </div>
          <button onClick={onClose} className="hover:bg-green-700 rounded p-1">
            <X size={20} className="lg:w-6 lg:h-6" />
          </button>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.message_type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
              <div className={`max-w-xs lg:max-w-md ${message.message_type === 'user' ? 'ml-12' : 'mr-12'}`}>
                <div className={`p-3 rounded-lg ${
                  message.message_type === 'user' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-800'
                } lg:p-4`}>
                  <div className="text-sm lg:text-base whitespace-pre-wrap">
                    {message.content}
                  </div>
                  
                  {/* Feedback buttons for AI messages */}
                  {message.message_type === 'ai' && message.id !== 'welcome' && (
                    <div className="flex items-center space-x-2 mt-2 pt-2 border-t border-gray-200">
                      <span className="text-xs text-gray-500">Was this helpful?</span>
                      <button
                        onClick={() => handleFeedback(message.id, 5)}
                        className="text-green-600 hover:text-green-700 transition-colors"
                        title="Good response"
                      >
                        <ThumbsUp size={14} />
                      </button>
                      <button
                        onClick={() => handleFeedback(message.id, 2)}
                        className="text-red-600 hover:text-red-700 transition-colors"
                        title="Poor response"
                      >
                        <ThumbsDown size={14} />
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Timestamp */}
                <div className={`text-xs text-gray-400 mt-1 ${
                  message.message_type === 'user' ? 'text-right' : 'text-left'
                }`}>
                  {new Date(message.created_at).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="max-w-xs lg:max-w-md mr-12">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-lg lg:p-4">
                  <div className="flex items-center space-x-2">
                    <Loader size={16} className="animate-spin" />
                    <span className="text-sm">AI is thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyPress={handleKeyPress}
              placeholder="Ask about food, KindBite features, sustainability..." 
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 lg:p-3 lg:text-base" 
              disabled={isLoading}
            />
            <button 
              onClick={handleSendMessage} 
              disabled={isLoading || !input.trim()}
              className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader size={16} className="animate-spin lg:w-5 lg:h-5" />
              ) : (
                <Send size={16} className="lg:w-5 lg:h-5" />
              )}
            </button>
          </div>
          
          {/* Quick suggestion buttons */}
          <div className="flex flex-wrap gap-2 mt-3">
            {[
              "What is KindBite?",
              "How do I earn KindCoins?",
              "Food safety tips",
              "Reduce food waste"
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setInput(suggestion)}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-full transition-colors"
                disabled={isLoading}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
