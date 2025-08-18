import React from 'react';
import { Bot, X, Send } from 'lucide-react';

const AIChat = ({ 
  showAIChat, 
  onClose, 
  aiMessages, 
  aiInput, 
  onAiInputChange, 
  onSendMessage 
}) => {
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
          {aiMessages.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <Bot size={48} className="mx-auto mb-4 text-gray-300 lg:w-14 lg:h-14" />
              <p className="lg:text-lg">
                Hi! I'm your KindBite AI assistant.
              </p>
              <p className="text-sm lg:text-base">
                Ask me about finding food, different provider types, or how KindBite works!
              </p>
            </div>
          )}
          
          {aiMessages.map((message, index) => (
            <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
              <div className={`max-w-xs p-3 rounded-lg ${
                message.sender === 'user' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-800'
              } lg:max-w-md lg:p-4`}>
                <p className="text-sm lg:text-base">
                  {message.text}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <input 
              type="text" 
              value={aiInput} 
              onChange={onAiInputChange} 
              placeholder="Ask about food factories, supermarkets..." 
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 lg:p-3 lg:text-base" 
              onKeyPress={(e) => e.key === 'Enter' && onSendMessage()} 
            />
            <button 
              onClick={onSendMessage} 
              className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Send size={16} className="lg:w-5 lg:h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
