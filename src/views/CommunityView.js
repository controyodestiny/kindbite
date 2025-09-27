import React from 'react';
import { Users, Calendar, MessageCircle } from 'lucide-react';

const CommunityView = ({ onViewChange }) => {
  return (
    <div>
      <div className="p-4 space-y-6 lg:p-6 lg:space-y-8">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-3 lg:text-lg">
            Community Impact
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center lg:gap-6">
            <div>
              <div className="font-bold text-green-600 text-2xl lg:text-3xl">3,247</div>
              <div className="text-gray-600 text-xs lg:text-sm">Active Providers</div>
            </div>
            <div>
              <div className="font-bold text-blue-600 text-2xl lg:text-3xl">28,456</div>
              <div className="text-gray-600 text-xs lg:text-sm">Items Rescued</div>
            </div>
            <div>
              <div className="font-bold text-purple-600 text-2xl lg:text-3xl">18.9T</div>
              <div className="text-gray-600 text-xs lg:text-sm">CO₂ Saved</div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 lg:gap-6">
          <button 
            onClick={() => onViewChange('news')} 
            className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow"
          >
            <Calendar className="mx-auto mb-2 text-blue-600 w-6 h-6 lg:w-8 lg:h-8" />
            <span className="font-medium text-sm lg:text-base">News & Events</span>
          </button>
          <button 
            onClick={() => onViewChange('chat')} 
            className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow"
          >
            <MessageCircle className="mx-auto mb-2 text-green-600 w-6 h-6 lg:w-8 lg:h-8" />
            <span className="font-medium text-sm lg:text-base">Messages</span>
          </button>
          <button 
            onClick={() => onViewChange('panels')} 
            className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow"
          >
            <Users className="mx-auto mb-2 text-purple-600 w-6 h-6 lg:w-8 lg:h-8" />
            <span className="font-medium text-sm lg:text-base">User Panels</span>
          </button>
        </div>

          {/* Back to Home Button */}
          <div className="text-center mt-6">
            <button
              onClick={() => onViewChange && onViewChange('home')}
              className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200"
            >
              Back to Home
            </button>
          </div>
      </div>
    </div>
  );
};

export default CommunityView;
