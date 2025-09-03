import React from 'react';
import { 
  ChefHat, Home, Building, ShoppingBag, Gift, Stethoscope, 
  UserCheck, Coins, User, X, MessageCircle, Calendar, Users
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ 
  onViewChange, 
  showMenu, 
  onMenuToggle, 
  menuSticky, 
  onMenuStickyToggle,
  isLargeScreen
}) => {
  const { user } = useAuth();
  const userPanels = {
    restaurant: { icon: ChefHat, title: "Restaurant", color: "bg-orange-500" },
    home: { icon: Home, title: "Home Kitchen", color: "bg-blue-500" },
    factory: { icon: Building, title: "Food Factory", color: "bg-gray-500" },
    supermarket: { icon: ShoppingBag, title: "Supermarket", color: "bg-purple-500" },
    retail: { icon: Gift, title: "Retail Shop", color: "bg-pink-500" },
    verifier: { icon: Stethoscope, title: "Food Verifier", color: "bg-red-500" },
    ambassador: { icon: UserCheck, title: "Food Ambassador", color: "bg-green-500" },
    donor: { icon: Coins, title: "Donor/Buyer", color: "bg-indigo-500" },
    "end-user": { icon: User, title: "Food Seeker", color: "bg-teal-500" }
  };

  const sidebarContent = (
    <div className="bg-white shadow-lg overflow-y-auto h-full">
      <div className="bg-green-600 text-white p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Menu</h2>
          <div className="flex items-center space-x-2">
            <button 
              onClick={onMenuStickyToggle} 
              className={`p-1 hover:bg-green-700 rounded ${menuSticky ? 'bg-green-700' : ''}`}
            >
              📌
            </button>
            {!isLargeScreen && (
              <button onClick={onMenuToggle}>
                <X size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-4 space-y-1">
        {user && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Your Role</h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 ${userPanels[user.userRole]?.color || 'bg-gray-500'} rounded-full flex items-center justify-center`}>
                  {React.createElement(userPanels[user.userRole]?.icon || User, { size: 16, className: "text-white" })}
                </div>
                <div>
                  <div className="font-medium text-green-700">{userPanels[user.userRole]?.title || 'User'}</div>
                  <div className="text-xs text-green-600">{user.businessName || `${user.firstName} ${user.lastName}`}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-gray-200 my-4"></div>
        
        {[
          { view: 'about', icon: 'ℹ️', label: 'About KindBite', color: 'bg-blue-100' },
          { view: 'partners', icon: '🤝', label: 'Our Partners', color: 'bg-indigo-100' },
          { view: 'environment', icon: '🌱', label: 'Environmental Impact', color: 'bg-green-100' },
          { view: 'news', icon: Calendar, label: 'News & Celebrations', color: 'bg-yellow-100' },
          { view: 'chat', icon: MessageCircle, label: 'Messages & Friends', color: 'bg-green-100' },
          { view: 'panels', icon: Users, label: 'User Panels', color: 'bg-purple-100' }
        ].map(({ view, icon, label, color }) => (
          <button 
            key={view}
            onClick={() => { 
              onViewChange(view); 
              if (!menuSticky && !isLargeScreen) onMenuToggle(); 
            }} 
            className="w-full text-left p-3 hover:bg-gray-100 rounded-lg flex items-center space-x-3"
          >
            <div className={`w-8 h-8 ${color} rounded-full flex items-center justify-center`}>
              {typeof icon === 'string' ? (
                <span className="text-blue-600 font-bold text-sm">{icon}</span>
              ) : (
                <icon size={16} className="text-yellow-600" />
              )}
            </div>
            <span className="text-gray-700">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // Desktop: always visible sidebar, Mobile: slide-out menu
  if (isLargeScreen) {
    return (
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg overflow-y-auto z-30">
        {sidebarContent}
      </div>
    );
  }

  // Mobile: slide-out menu
  return (
    showMenu && (
      <div className={`fixed inset-0 z-50 ${menuSticky ? '' : 'bg-black bg-opacity-50'}`} onClick={menuSticky ? undefined : onMenuToggle}>
        <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-lg overflow-y-auto" onClick={e => e.stopPropagation()}>
          {sidebarContent}
        </div>
      </div>
    )
  );
};

export default Sidebar;
