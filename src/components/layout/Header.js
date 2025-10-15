import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bot, Bell, LogOut, User, Settings } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';

const Header = ({ onMenuToggle, onAIChatToggle, onNotificationsToggle, onHomeClick, isLargeScreen = true, userRole = 'end-user', isAuthenticated = false, user = null, onLoginClick, onSignupClick, onProfileClick, onLogout, profileImage = null }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  const { unreadCount } = useNotifications();

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <div className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-40">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Menu Button - Only show when authenticated and on mobile */}
        {isAuthenticated && !isLargeScreen && (
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <Menu size={24} className="text-gray-600" />
          </button>
        )}

        {/* Logo/Title */}
        <h1 className={`text-xl font-bold text-gray-800 ${isAuthenticated && !isLargeScreen ? '' : 'ml-0'}`}>KindBite</h1>

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
              {/* User Profile Dropdown */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
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
                      {user?.first_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    {/* User Info */}
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.first_name} {user?.last_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user?.email}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <button
                      onClick={() => {
                        onProfileClick();
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <User size={16} />
                      <span>Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        // Add settings functionality later
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <Settings size={16} />
                      <span>Settings</span>
                    </button>

                    <div className="border-t border-gray-100 my-1"></div>

                    <button
                      onClick={() => {
                        onLogout();
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notifications Button - Only show when authenticated */}
          {isAuthenticated && (
            <button
              onClick={onNotificationsToggle}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 relative"
            >
              <Bell size={20} className="text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
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
