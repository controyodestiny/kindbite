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
  onRoleChange
}) => {
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
            <button className="p-1 hover:bg-green-700 rounded">
              📌
            </button>
            <button onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4 space-y-1">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Switch Role</h3>
          <div className="space-y-1">
            {Object.entries(userPanels).map(([key, panel]) => {
              const IconComponent = panel.icon;
              return (
                <button 
                  key={key} 
                  onClick={() => { 
                    console.log('Switching to role:', key);
                    onRoleChange(key);
                    onViewChange('home'); 
                    onClose(); 
                  }} 
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors ${
                    userRole === key ? 'bg-green-50 border border-green-200' : ''
                  }`}
                >
                  <div className={`w-8 h-8 ${panel.color} rounded-full flex items-center justify-center`}>
                    <IconComponent size={16} className="text-white" />
                  </div>
                  <span className={`font-medium ${userRole === key ? 'text-green-700' : 'text-gray-700'}`}>
                    {panel.title}
                  </span>
                  {userRole === key && <div className="ml-auto w-2 h-2 bg-green-500 rounded-full"></div>}
                </button>
              );
            })}
          </div>
        </div>
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
