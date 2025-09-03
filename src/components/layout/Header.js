import React from 'react';
import { Menu, Bot, Bell, LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header = ({ title, onMenuToggle, onAIChatToggle, notifications, isLargeScreen, onAuthToggle }) => {
  const { user, logout } = useAuth();
  
  return (
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
        
        {user ? (
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <div className="text-sm font-medium">{user.firstName} {user.lastName}</div>
              <div className="text-xs text-green-100">{user.userRole}</div>
            </div>
            <button 
              onClick={logout}
              className="p-1 hover:bg-green-700 rounded"
              title="Logout"
            >
              <LogOut size={20} className="lg:w-6 lg:h-6" />
            </button>
          </div>
        ) : (
          <button 
            onClick={onAuthToggle}
            className="flex items-center space-x-2 px-3 py-1 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
          >
            <User size={16} />
            <span className="text-sm">Sign In</span>
          </button>
        )}
      </div>
    </div>
  </div>
  );
};

export default Header;
