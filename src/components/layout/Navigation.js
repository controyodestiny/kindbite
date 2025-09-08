import React from 'react';
import { Home, Search, Users, Award, User, MessageCircle } from 'lucide-react';

const Navigation = ({ currentView, onViewChange, isOpen, onClose }) => {
  const navigationItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'community', icon: Users, label: 'Community' },
    { id: 'points', icon: Award, label: 'Points' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'messages', icon: MessageCircle, label: 'Messages' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="flex justify-around">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`flex flex-col items-center justify-center w-16 h-16 transition-colors duration-200 ${
                isActive
                  ? 'text-green-600 bg-green-50'
                  : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
