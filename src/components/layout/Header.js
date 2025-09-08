import React from 'react';
import { Menu, Bot, Bell } from 'lucide-react';

const Header = ({ onMenuToggle, onAIChatToggle, onNotificationsToggle, notifications = [], isLargeScreen = true }) => {
  return (
    <div className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-40">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Menu Button */}
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <Menu size={24} className="text-gray-600" />
        </button>

        {/* Logo/Title */}
        <h1 className="text-xl font-bold text-gray-800">KindBite</h1>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          {/* AI Chat Button */}
          <button
            onClick={onAIChatToggle}
            className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors duration-200"
          >
            <Bot size={20} />
          </button>

          {/* Notifications Button */}
          <button
            onClick={onNotificationsToggle}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 relative"
          >
            <Bell size={20} className="text-gray-600" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notifications.length > 99 ? '99+' : notifications.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
