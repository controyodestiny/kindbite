import React from 'react';
import { Home, Search, Users, Award, User } from 'lucide-react';

const Navigation = ({ currentView, onViewChange }) => (
  <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-40">
    <div className="flex justify-around items-center max-w-md mx-auto">
      {[
        { id: 'home', icon: Home, label: 'Home' },
        { id: 'search', icon: Search, label: 'Search' },
        { id: 'community', icon: Users, label: 'Community' },
        { id: 'points', icon: Award, label: 'Points' },
        { id: 'profile', icon: User, label: 'Profile' }
      ].map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => onViewChange(id)}
          className={`flex flex-col items-center p-2 transition-colors ${
            currentView === id ? 'text-green-600' : 'text-gray-400'
          }`}
        >
          <Icon size={20} />
          <span className="text-xs mt-1">{label}</span>
        </button>
      ))}
    </div>
  </div>
);

export default Navigation;
