import React from 'react';
import { Menu, Bot, Bell } from 'lucide-react';

const Header = ({ onMenuToggle, onAIChatToggle, onNotificationsToggle, onHomeClick, notifications = [], isLargeScreen = true, userRole = 'end-user', isAuthenticated = false, user = null, onLoginClick, onSignupClick, onProfileClick, profileImage = null }) => {
  return (
    <div className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-40">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Menu Button - Only show when authenticated */}
        {isAuthenticated && (
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <Menu size={24} className="text-gray-600" />
          </button>
        )}

        {/* Logo/Title */}
        <h1 className="text-xl font-bold text-gray-800">KindBite</h1>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          {/* AI Chat Button - Always show */}
          <button
            onClick={onAIChatToggle}
            className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors duration-200"
          >
            <Bot size={20} />
          </button>

          {/* Home Button - Only show when authenticated */}
          {isAuthenticated && (
            <button
              onClick={onHomeClick}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              title="Go to Home"
            >
              <span className="text-lg">🏠</span>
            </button>
          )}

          {/* Authentication Buttons */}
          {!isAuthenticated ? (
            <div className="flex space-x-2">
              <button
                onClick={onLoginClick}
                className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors duration-200"
              >
                Login
              </button>
                     <button
                       onClick={onSignupClick}
                       className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200"
                     >
                       Sign Up
                     </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={onProfileClick}
                className="w-8 h-8 rounded-full overflow-hidden hover:scale-105 transition-transform duration-200 cursor-pointer"
              >
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-sm font-semibold">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </button>
            </div>
          )}

          {/* Notifications Button - Only show when authenticated */}
          {isAuthenticated && (
            <button
              onClick={onNotificationsToggle}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 relative"
            >
              <Bell size={20} className="text-gray-600" />
              {notifications.filter(n => !n.isRead).length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.filter(n => !n.isRead).length > 99 ? '99+' : notifications.filter(n => !n.isRead).length}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
