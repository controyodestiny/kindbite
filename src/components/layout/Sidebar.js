import React from 'react';
import { 
  ChefHat, Home, Building, ShoppingBag, Gift, Stethoscope, 
  UserCheck, Coins, User, X, MessageCircle, Calendar, Users
} from 'lucide-react';

const Sidebar = ({ 
  isOpen,
  onClose,
  currentView,
  onViewChange,
  onAdminPanelOpen,
  userRole,
  onRoleChange,
  onAddFood
}) => {
  const userPanels = {
    cafe: { icon: ChefHat, title: "Cafe", color: "bg-orange-500" },
    restaurant: { icon: ChefHat, title: "Restaurant", color: "bg-orange-500" },
    retail: { icon: ShoppingBag, title: "Retail Shop", color: "bg-purple-500" },
    bakery: { icon: ChefHat, title: "Bakery", color: "bg-yellow-500" },
    grocery: { icon: ShoppingBag, title: "Grocery Store", color: "bg-green-500" },
    hotel: { icon: Building, title: "Hotel", color: "bg-red-500" },
    home: { icon: Home, title: "Home Kitchen", color: "bg-blue-500" },
    factory: { icon: Building, title: "Food Factory", color: "bg-gray-500" },
    supermarket: { icon: ShoppingBag, title: "Supermarket", color: "bg-purple-500" },
    verifier: { icon: Stethoscope, title: "Food Verifier", color: "bg-red-500" },
    ambassador: { icon: UserCheck, title: "Food Ambassador", color: "bg-green-500" },
    donor: { icon: Coins, title: "Donor/Buyer", color: "bg-indigo-500" },
    "end-user": { icon: User, title: "Food Seeker", color: "bg-teal-500" }
  };

  // Role-specific menu items
  const getRoleSpecificMenu = (role) => {
    const menus = {
      cafe: [
        { id: 'home', label: 'Dashboard', icon: Home },
        { id: 'add-food', label: 'Add Food Items', icon: ChefHat },
        { id: 'my-food', label: 'My Food Listings', icon: Calendar },
        { id: 'messages', label: 'Messages', icon: MessageCircle },
        { id: 'analytics', label: 'Analytics', icon: Coins },
        { id: 'profile', label: 'Profile', icon: User }
      ],
      restaurant: [
        { id: 'home', label: 'Dashboard', icon: Home },
        { id: 'add-food', label: 'Add Food Items', icon: ChefHat },
        { id: 'my-food', label: 'My Food Listings', icon: Calendar },
        { id: 'messages', label: 'Messages', icon: MessageCircle },
        { id: 'analytics', label: 'Analytics', icon: Coins },
        { id: 'profile', label: 'Profile', icon: User }
      ],
      retail: [
        { id: 'home', label: 'Dashboard', icon: Home },
        { id: 'add-food', label: 'Add Food Items', icon: ShoppingBag },
        { id: 'my-food', label: 'My Food Listings', icon: Calendar },
        { id: 'messages', label: 'Messages', icon: MessageCircle },
        { id: 'inventory', label: 'Inventory', icon: Building },
        { id: 'profile', label: 'Profile', icon: User }
      ],
      bakery: [
        { id: 'home', label: 'Dashboard', icon: Home },
        { id: 'add-food', label: 'Add Food Items', icon: ChefHat },
        { id: 'my-food', label: 'My Food Listings', icon: Calendar },
        { id: 'messages', label: 'Messages', icon: MessageCircle },
        { id: 'schedule', label: 'Baking Schedule', icon: Calendar },
        { id: 'profile', label: 'Profile', icon: User }
      ],
      grocery: [
        { id: 'home', label: 'Dashboard', icon: Home },
        { id: 'add-food', label: 'Add Food Items', icon: ShoppingBag },
        { id: 'my-food', label: 'My Food Listings', icon: Calendar },
        { id: 'messages', label: 'Messages', icon: MessageCircle },
        { id: 'inventory', label: 'Inventory', icon: Building },
        { id: 'profile', label: 'Profile', icon: User }
      ],
      hotel: [
        { id: 'home', label: 'Dashboard', icon: Home },
        { id: 'add-food', label: 'Add Food Items', icon: ChefHat },
        { id: 'my-food', label: 'My Food Listings', icon: Calendar },
        { id: 'messages', label: 'Messages', icon: MessageCircle },
        { id: 'events', label: 'Events', icon: Calendar },
        { id: 'profile', label: 'Profile', icon: User }
      ],
      // Default/Generic user roles
      donor: [
        { id: 'home', label: 'Dashboard', icon: Home },
        { id: 'search', label: 'Search Food', icon: ShoppingBag },
        { id: 'community', label: 'Community', icon: Users },
        { id: 'points', label: 'My Points', icon: Coins },
        { id: 'profile', label: 'My Profile', icon: User },
        { id: 'messages', label: 'Messages', icon: MessageCircle },
        { id: 'about', label: 'About KindBite', icon: Gift },
        { id: 'partners', label: 'Our Partners', icon: Building },
        { id: 'environment', label: 'Environmental Impact', icon: Stethoscope },
      ],
      "end-user": [
        { id: 'home', label: 'Dashboard', icon: Home },
        { id: 'search', label: 'Search Food', icon: ShoppingBag },
        { id: 'community', label: 'Community', icon: Users },
        { id: 'points', label: 'My Points', icon: Coins },
        { id: 'profile', label: 'My Profile', icon: User },
        { id: 'messages', label: 'Messages', icon: MessageCircle },
        { id: 'about', label: 'About KindBite', icon: Gift },
        { id: 'partners', label: 'Our Partners', icon: Building },
        { id: 'environment', label: 'Environmental Impact', icon: Stethoscope },
      ]
    };
    
    return menus[role] || menus["end-user"];
  };

  const currentRole = userPanels[userRole] || userPanels["end-user"];
  const menuItems = getRoleSpecificMenu(userRole);

  const sidebarContent = (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 ${currentRole.color} rounded-full flex items-center justify-center`}>
            <currentRole.icon size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{currentRole.title}</h2>
            <p className="text-sm text-gray-500">Navigation</p>
          </div>
        </div>
      </div>
      
      <div className="p-4 space-y-1">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'add-food') {
                  onViewChange('home');
                  if (onAddFood) {
                    onAddFood();
                  }
                } else {
                  onViewChange(item.id);
                }
                onClose();
              }}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors ${
                currentView === item.id ? 'bg-green-50 border border-green-200' : ''
              }`}
            >
              <div className={`w-8 h-8 ${currentRole.color} rounded-full flex items-center justify-center`}>
                <IconComponent size={16} className="text-white" />
              </div>
              <span className={`font-medium ${currentView === item.id ? 'text-green-700' : 'text-gray-700'}`}>
                {item.label}
              </span>
              {currentView === item.id && <div className="ml-auto w-2 h-2 bg-green-500 rounded-full"></div>}
            </button>
          );
        })}
      </div>
    </div>
  );

  // Mobile: slide-out menu
  return (
    isOpen && (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={onClose}>
        <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-lg overflow-y-auto" onClick={e => e.stopPropagation()}>
          {sidebarContent}
        </div>
      </div>
    )
  );
};

export default Sidebar;