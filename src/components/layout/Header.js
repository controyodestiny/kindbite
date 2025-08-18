import React from 'react';
import { Menu, Bot, Bell } from 'lucide-react';

const Header = ({ title, onMenuToggle, onAIChatToggle, notifications, isLargeScreen }) => (
  <div className="bg-green-600 text-white p-4 rounded-b-lg shadow-lg">
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-3">
        {!isLargeScreen && (
          <button onClick={onMenuToggle} className="p-1 hover:bg-green-700 rounded">
            <Menu size={20} />
          </button>
        )}
        {!isLargeScreen && (
          <div>
            <h1 className="text-xl font-bold lg:text-2xl">KindBite</h1>
            <p className="text-green-100 text-sm lg:text-base">{title}</p>
          </div>
        )}
      </div>
      
      {/* Center title on desktop */}
      {isLargeScreen && (
        <div className="flex-1 text-center">
          <h1 className="text-xl font-bold lg:text-2xl">KindBite</h1>
          <p className="text-green-100 text-sm lg:text-base">{title}</p>
        </div>
      )}
      
      <div className="flex items-center space-x-3">
        <button onClick={onAIChatToggle} className="p-1 hover:bg-green-700 rounded">
          <Bot size={20} className="lg:w-6 lg:h-6" />
        </button>
        <div className="relative">
          <Bell size={20} className="lg:w-6 lg:h-6" />
          {notifications > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
              {notifications}
            </span>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default Header;
