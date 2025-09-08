import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, MessageCircle, Brain, Sparkles } from 'lucide-react';
import apiService from '../../services/api';

const AIChat = ({ showAIChat, onClose, aiMessages, aiInput, onAiInputChange, onSendMessage, foodListings }) => {
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [conversationContext, setConversationContext] = useState([]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [aiMessages]);

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
      
      // Send user message
      onSendMessage(userMessage);

      // Show typing indicator
      setIsTyping(true);
      
      try {
        // Send message to backend API
        const response = await apiService.sendAIMessage(aiInput);
        
        // Create AI message from backend response
        const aiMessage = {
          id: Date.now() + 1,
          text: response.response || "I'm sorry, I couldn't process your request. Please try again.",
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString(),
          fullTimestamp: new Date().toISOString()
        };

        // Add AI response to conversation context
        setConversationContext(prev => [...prev, { role: 'assistant', content: aiMessage.text }]);
        
        // Send AI message
        onSendMessage(aiMessage);
        
      } catch (error) {
        console.error('AI Chat error:', error);
        
        // Fallback response if API fails
        const fallbackMessage = {
          id: Date.now() + 1,
          text: "I'm having trouble connecting right now. Please try again later or check your internet connection.",
          error: true,
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString(),
          fullTimestamp: new Date().toISOString()
        };
        
        onSendMessage(fallbackMessage);
      } finally {
        setIsTyping(false);
      }

      // Clear input
      onAiInputChange({ target: { value: '' } });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="ai-chat-premium h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6 rounded-t-3xl">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Bot size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold">AI Food Assistant</h2>
              <p className="text-green-100 text-sm">Powered by OpenAI • Remembers our conversations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-xl transition-colors duration-300"
          >
            <X size={24} />
          </button>
        </div>

        {/* AI Capabilities */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-xl text-center">
            <Brain size={20} className="mx-auto mb-1" />
            <div className="text-xs font-medium">Memory</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-xl text-center">
            <MessageCircle size={20} className="mx-auto mb-1" />
            <div className="text-xs font-medium">Context</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-xl text-center">
            <Sparkles size={20} className="mx-auto mb-1" />
            <div className="text-xs font-medium">Intelligent</div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {aiMessages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot size={32} className="text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Welcome to AI Food Assistant!</h3>
            <p className="text-gray-600 mb-6">I'm here to help you find great food, understand sustainability, and make the most of KindBite.</p>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
              <button
                onClick={() => onAiInputChange({ target: { value: "How does food rescue work?" } })}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-xl text-sm font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                How does food rescue work?
              </button>
              <button
                onClick={() => onAiInputChange({ target: { value: "What food is available near me?" } })}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-xl text-sm font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                What food is available?
              </button>
              <button
                onClick={() => onAiInputChange({ target: { value: "Tell me about environmental impact" } })}
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-3 rounded-xl text-sm font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Environmental impact
              </button>
              <button
                onClick={() => onAiInputChange({ target: { value: "Help me find vegetarian options" } })}
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3 rounded-xl text-sm font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Vegetarian options
              </button>
            </div>
          </div>
        ) : (
          aiMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-2xl ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
                    : 'bg-white border-2 border-gray-100 text-gray-800 shadow-lg'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
                <div className={`text-xs mt-2 ${
                  message.sender === 'user' ? 'text-green-100' : 'text-gray-500'
                }`}>
                  {message.timestamp}
                </div>
              </div>
            </div>
          ))
        )}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border-2 border-gray-100 text-gray-800 shadow-lg p-4 rounded-2xl">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-gray-500">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <textarea
              value={aiInput}
              onChange={onAiInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about food rescue, sustainability, or finding great meals..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl resize-none focus:border-green-500 focus:outline-none transition-all duration-300"
              rows={1}
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!aiInput.trim() || isTyping}
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-3 rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <Send size={20} />
          </button>
        </div>
        
        <div className="mt-3 text-xs text-gray-500 text-center">
          Powered by OpenAI • Your conversations are saved for context
        </div>
      </div>
    </div>
  );
};

export default AIChat; 