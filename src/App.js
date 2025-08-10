import React, { useState } from 'react';
import { 
  MapPin, Star, Clock, Heart, Users, Gift, Search, Filter, ShoppingBag, User, Home, Award, Bell, 
  MessageCircle, UserPlus, Bot, X, Menu, Calendar, Trophy, Send, Phone, Mail,
  Shield, Stethoscope, ChefHat, Building, UserCheck, Coins
} from 'lucide-react';

const KindBiteApp = () => {
  const [currentView, setCurrentView] = useState('home');
  const [userRole, setUserRole] = useState('end-user');
  const [selectedFood, setSelectedFood] = useState(null);
  const [userPoints, setUserPoints] = useState(245);
  const [notifications, setNotifications] = useState(3);
  const [showAIChat, setShowAIChat] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [menuSticky, setMenuSticky] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [aiMessages, setAiMessages] = useState([]);
  const [aiInput, setAiInput] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [searchTerm, setSearchTerm] = useState('');

  // Enhanced food listings with all provider types
  const foodListings = [
    {
      id: 1,
      restaurant: "Mama's Kitchen",
      name: "Mixed Rice & Chicken",
      description: "Delicious local rice with grilled chicken and vegetables",
      originalPrice: 15000,
      discountedPrice: 5000,
      quantity: 8,
      rating: 4.8,
      distance: "0.3 km",
      pickupWindow: "5:00 PM - 7:00 PM",
      dietary: ["Halal", "Gluten-Free"],
      image: "🍛",
      co2Saved: 2.4,
      provider: "restaurant"
    },
    {
      id: 2,
      restaurant: "The Nakasero Home",
      name: "Vegetarian Combo",
      description: "Fresh salad, soup, and bread rolls from home kitchen",
      originalPrice: 12000,
      discountedPrice: 0,
      quantity: 12,
      rating: 4.6,
      distance: "0.7 km",
      pickupWindow: "6:00 PM - 8:00 PM",
      dietary: ["Vegetarian", "Vegan"],
      image: "🥗",
      co2Saved: 1.8,
      provider: "home"
    },
    {
      id: 3,
      restaurant: "Uganda Food Industries",
      name: "Bread & Pastries - End of Day",
      description: "Fresh bread, rolls, and pastries from today's production",
      originalPrice: 8000,
      discountedPrice: 2000,
      quantity: 25,
      rating: 4.5,
      distance: "2.1 km",
      pickupWindow: "4:00 PM - 6:00 PM",
      dietary: ["Contains Gluten"],
      image: "🍞",
      co2Saved: 1.6,
      provider: "factory"
    },
    {
      id: 4,
      restaurant: "Shoprite Kampala",
      name: "Fresh Produce Clearance",
      description: "Slightly overripe fruits and vegetables, perfect for cooking",
      originalPrice: 5000,
      discountedPrice: 1500,
      quantity: 40,
      rating: 4.3,
      distance: "1.8 km",
      pickupWindow: "7:00 PM - 9:00 PM",
      dietary: ["Organic", "Vegetarian", "Vegan"],
      image: "🥕",
      co2Saved: 2.8,
      provider: "supermarket"
    },
    {
      id: 5,
      restaurant: "Corner Café & Bakery",
      name: "Coffee Shop Surplus",
      description: "Sandwiches, pastries, and salads from today's café service",
      originalPrice: 12000,
      discountedPrice: 3000,
      quantity: 18,
      rating: 4.6,
      distance: "0.9 km",
      pickupWindow: "5:30 PM - 7:30 PM",
      dietary: ["Vegetarian Options"],
      image: "🥪",
      co2Saved: 2.1,
      provider: "retail"
    }
  ];

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

  const keyPartners = [
    { name: "World Food Programme", logo: "🌍", type: "UN Agency", contribution: "Global food security expertise and logistics support" },
    { name: "Unilever Foundation", logo: "🏢", type: "Corporate Partner", contribution: "Sustainable living initiatives and food safety standards" },
    { name: "Gates Foundation", logo: "💡", type: "Philanthropic", contribution: "Technology innovation and community health programs" }
  ];

  const environmentalMetrics = [
    { icon: "💧", title: "Water Saved", value: "12,450L", description: "Water that would have been wasted in food production", color: "text-blue-600" },
    { icon: "📦", title: "Packaging Reduced", value: "890kg", description: "Less packaging waste through direct food sharing", color: "text-orange-600" }
  ];

  const friends = [
    { id: 1, name: "Emma K.", status: "online", lastMessage: "Just rescued some food nearby!" },
    { id: 2, name: "David M.", status: "offline", lastMessage: "Thanks for the tip about the free meals" }
  ];

  const newsItems = [
    { id: 1, title: "KindBite Kampala Reaches 10,000 Meals Saved!", content: "Our community has successfully rescued 10,000 meals from waste.", date: "2 days ago", type: "celebration", image: "🎉" },
    { id: 2, title: "New Partnership with Makerere University", content: "Students can now access discounted meals from campus restaurants.", date: "1 week ago", type: "news", image: "🎓" }
  ];

  const impactData = {
    today: { meals: 12, co2: 8.4, kindcoins: 245, water: 125, packaging: 1.2, foodMiles: 0.3, treesEquiv: 2, carKmEquiv: 35 },
    week: { meals: 45, co2: 32.1, kindcoins: 890, water: 485, packaging: 4.8, foodMiles: 1.2, treesEquiv: 7, carKmEquiv: 134 },
    month: { meals: 156, co2: 125.6, kindcoins: 3240, water: 1845, packaging: 18.2, foodMiles: 4.8, treesEquiv: 28, carKmEquiv: 524 },
    year: { meals: 1840, co2: 1456.8, kindcoins: 38750, water: 22145, packaging: 218.6, foodMiles: 58.2, treesEquiv: 325, carKmEquiv: 6089 }
  };

  // Helper functions
  const sendAIMessage = () => {
    if (!aiInput.trim()) return;
    const userMessage = { sender: 'user', text: aiInput, timestamp: new Date() };
    setAiMessages(prev => [...prev, userMessage]);
    setTimeout(() => {
      const aiResponse = { sender: 'ai', text: `I can help you with KindBite! For "${aiInput}", I recommend checking nearby restaurants or connecting with a food ambassador in your area.`, timestamp: new Date() };
      setAiMessages(prev => [...prev, aiResponse]);
    }, 1000);
    setAiInput('');
  };

  const handleReserve = (food) => {
    alert(`Reserved: ${food.name} from ${food.restaurant}`);
    setSelectedFood(null);
    setUserPoints(prev => prev + 10);
  };

  const getProviderLabel = (provider) => {
    switch(provider) {
      case 'home': return 'Home Kitchen';
      case 'factory': return 'Food Factory';
      case 'supermarket': return 'Supermarket';
      case 'retail': return 'Retail Shop';
      default: return 'Restaurant';
    }
  };

  const getProviderColor = (provider) => {
    switch(provider) {
      case 'home': return 'bg-blue-100 text-blue-600';
      case 'factory': return 'bg-gray-100 text-gray-600';
      case 'supermarket': return 'bg-purple-100 text-purple-600';
      case 'retail': return 'bg-pink-100 text-pink-600';
      default: return 'bg-orange-100 text-orange-600';
    }
  };

  // Components
  const Header = ({ title }) => (
    <div className="bg-green-600 text-white p-4 rounded-b-lg shadow-lg">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <button onClick={() => setShowMenu(!showMenu)} className="p-1 hover:bg-green-700 rounded">
            <Menu size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold">KindBite</h1>
            <p className="text-green-100 text-sm">{title}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={() => setShowAIChat(true)} className="p-1 hover:bg-green-700 rounded">
            <Bot size={20} />
          </button>
          <div className="relative">
            <Bell size={20} />
            {notifications > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {notifications}
              </span>
            )}
          </div>
        </div>
      </div>

      {showMenu && (
        <div className={`fixed inset-0 z-50 ${menuSticky ? '' : 'bg-black bg-opacity-50'}`} onClick={menuSticky ? undefined : () => setShowMenu(false)}>
          <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-lg overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="bg-green-600 text-white p-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">Menu</h2>
                <div className="flex items-center space-x-2">
                  <button onClick={() => setMenuSticky(!menuSticky)} className={`p-1 hover:bg-green-700 rounded ${menuSticky ? 'bg-green-700' : ''}`}>
                    📌
                  </button>
                  <button onClick={() => setShowMenu(false)}>
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
                      <button key={key} onClick={() => { setUserRole(key); setCurrentView('home'); if (!menuSticky) setShowMenu(false); }} className={`w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors ${userRole === key ? 'bg-green-50 border border-green-200' : ''}`}>
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

              <div className="border-t border-gray-200 my-4"></div>
              
              <button onClick={() => { setCurrentView('about'); if (!menuSticky) setShowMenu(false); }} className="w-full text-left p-3 hover:bg-gray-100 rounded-lg flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">ℹ️</span>
                </div>
                <span className="text-gray-700">About KindBite</span>
              </button>
              
              <button onClick={() => { setCurrentView('partners'); if (!menuSticky) setShowMenu(false); }} className="w-full text-left p-3 hover:bg-gray-100 rounded-lg flex items-center space-x-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 text-sm">🤝</span>
                </div>
                <span className="text-gray-700">Our Partners</span>
              </button>
              
              <button onClick={() => { setCurrentView('environment'); if (!menuSticky) setShowMenu(false); }} className="w-full text-left p-3 hover:bg-gray-100 rounded-lg flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm">🌱</span>
                </div>
                <span className="text-gray-700">Environmental Impact</span>
              </button>
              
              <button onClick={() => { setCurrentView('news'); if (!menuSticky) setShowMenu(false); }} className="w-full text-left p-3 hover:bg-gray-100 rounded-lg flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Calendar size={16} className="text-yellow-600" />
                </div>
                <span className="text-gray-700">News & Celebrations</span>
              </button>
              
              <button onClick={() => { setCurrentView('chat'); if (!menuSticky) setShowMenu(false); }} className="w-full text-left p-3 hover:bg-gray-100 rounded-lg flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <MessageCircle size={16} className="text-green-600" />
                </div>
                <span className="text-gray-700">Messages & Friends</span>
              </button>
              
              <button onClick={() => { setCurrentView('panels'); if (!menuSticky) setShowMenu(false); }} className="w-full text-left p-3 hover:bg-gray-100 rounded-lg flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users size={16} className="text-purple-600" />
                </div>
                <span className="text-gray-700">User Panels</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const Navigation = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around items-center max-w-md mx-auto">
        <button onClick={() => setCurrentView('home')} className={`flex flex-col items-center p-2 ${currentView === 'home' ? 'text-green-600' : 'text-gray-400'}`}>
          <Home size={20} />
          <span className="text-xs mt-1">Home</span>
        </button>
        <button onClick={() => setCurrentView('search')} className={`flex flex-col items-center p-2 ${currentView === 'search' ? 'text-green-600' : 'text-gray-400'}`}>
          <Search size={20} />
          <span className="text-xs mt-1">Search</span>
        </button>
        <button onClick={() => setCurrentView('community')} className={`flex flex-col items-center p-2 ${currentView === 'community' ? 'text-green-600' : 'text-gray-400'}`}>
          <Users size={20} />
          <span className="text-xs mt-1">Community</span>
        </button>
        <button onClick={() => setCurrentView('points')} className={`flex flex-col items-center p-2 ${currentView === 'points' ? 'text-green-600' : 'text-gray-400'}`}>
          <Award size={20} />
          <span className="text-xs mt-1">Points</span>
        </button>
        <button onClick={() => setCurrentView('profile')} className={`flex flex-col items-center p-2 ${currentView === 'profile' ? 'text-green-600' : 'text-gray-400'}`}>
          <User size={20} />
          <span className="text-xs mt-1">Profile</span>
        </button>
      </div>
    </div>
  );

  const FoodCard = ({ food, onSelect }) => (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onSelect && onSelect(food)}>
      <div className="flex items-start space-x-3">
        <div className="text-4xl">{food.image}</div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-800">{food.name}</h3>
              <p className="text-sm text-gray-600">{food.restaurant}</p>
              <span className={`text-xs px-2 py-1 rounded-full ${getProviderColor(food.provider)}`}>
                {getProviderLabel(food.provider)}
              </span>
            </div>
            <div className="text-right">
              {food.discountedPrice === 0 ? (
                <span className="text-green-600 font-bold">FREE</span>
              ) : (
                <div>
                  <span className="text-gray-400 line-through text-sm">UGX {food.originalPrice.toLocaleString()}</span>
                  <span className="text-green-600 font-bold block">UGX {food.discountedPrice.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-1">{food.description}</p>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center"><MapPin size={14} className="mr-1" />{food.distance}</div>
              <div className="flex items-center"><Clock size={14} className="mr-1" />{food.pickupWindow}</div>
              <div className="flex items-center"><Star size={14} className="mr-1 text-yellow-500" />{food.rating}</div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex space-x-1">
              {food.dietary.map((tag, index) => (
                <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">{tag}</span>
              ))}
            </div>
            <div className="text-xs text-green-600 flex items-center">
              <Heart size={12} className="mr-1" />
              {food.co2Saved}kg CO₂ • {(food.co2Saved * 10).toFixed(0)}L water saved
            </div>
          </div>
          <div className="mt-2 text-sm">
            <span className="text-orange-600 font-medium">{food.quantity} plates left</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Views
  const HomeView = () => (
    <div>
      <Header title="Rescue food, earn KindCoins" />
      <div className="p-4">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-4">
          <h3 className="font-semibold text-gray-800 mb-3">Your Impact Today</h3>
          <div className="grid grid-cols-3 gap-4 text-center mb-4">
            <div>
              <div className="text-2xl font-bold text-green-600">12</div>
              <div className="text-xs text-gray-600">Meals Saved</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">8.4kg</div>
              <div className="text-xs text-gray-600">CO₂ Prevented</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{userPoints}</div>
              <div className="text-xs text-gray-600">KindCoins</div>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-3">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm font-bold text-blue-500">25L</div>
                <div className="text-xs text-gray-500">Water Saved</div>
              </div>
              <div>
                <div className="text-sm font-bold text-orange-500">1.2kg</div>
                <div className="text-xs text-gray-500">Packaging Reduced</div>
              </div>
              <div>
                <div className="text-sm font-bold text-green-500">0.3km</div>
                <div className="text-xs text-gray-500">Food Miles Cut</div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-6">
          <button onClick={() => setCurrentView('search')} className="bg-white border border-gray-200 rounded-lg p-3 text-center hover:shadow-md transition-shadow">
            <Search className="mx-auto mb-2 text-green-600" size={20} />
            <span className="text-xs font-medium">Find Food</span>
          </button>
          <button onClick={() => setCurrentView('environment')} className="bg-white border border-gray-200 rounded-lg p-3 text-center hover:shadow-md transition-shadow">
            <span className="text-xl mb-2 block">🌱</span>
            <span className="text-xs font-medium">Eco Impact</span>
          </button>
          <button onClick={() => setCurrentView('partners')} className="bg-white border border-gray-200 rounded-lg p-3 text-center hover:shadow-md transition-shadow">
            <span className="text-xl mb-2 block">🤝</span>
            <span className="text-xs font-medium">Partners</span>
          </button>
        </div>
        <h3 className="font-semibold text-gray-800 mb-3">Nearby Food Available</h3>
        {foodListings.slice(0, 3).map(food => (
          <FoodCard key={food.id} food={food} onSelect={setSelectedFood} />
        ))}
      </div>
    </div>
  );

  const SearchView = () => {
    const filteredFoods = foodListings.filter(food => {
      const matchesSearch = searchTerm === '' || 
        food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        food.restaurant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        food.description.toLowerCase().includes(searchTerm.toLowerCase());

      if (activeFilter === 'All') return matchesSearch;
      if (activeFilter === 'Free') return matchesSearch && food.discountedPrice === 0;
      if (activeFilter === 'Restaurants') return matchesSearch && food.provider === 'restaurant';
      if (activeFilter === 'Home Kitchens') return matchesSearch && food.provider === 'home';
      if (activeFilter === 'Food Factories') return matchesSearch && food.provider === 'factory';
      if (activeFilter === 'Supermarkets') return matchesSearch && food.provider === 'supermarket';
      if (activeFilter === 'Retail Shops') return matchesSearch && food.provider === 'retail';
      if (activeFilter === 'Vegetarian') return matchesSearch && food.dietary.some(tag => tag.toLowerCase().includes('vegetarian'));
      if (activeFilter === 'Halal') return matchesSearch && food.dietary.some(tag => tag.toLowerCase().includes('halal'));
      if (activeFilter === 'Near Me') return matchesSearch && parseFloat(food.distance) < 1;
      
      return matchesSearch;
    });

    return (
      <div>
        <Header title="Find Available Food" />
        <div className="p-4">
          <div className="flex space-x-2 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search for food..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500" 
              />
            </div>
            <button className="bg-gray-100 p-2 rounded-lg hover:bg-gray-200">
              <Filter size={20} className="text-gray-600" />
            </button>
          </div>
          
          <div className="flex space-x-2 mb-6 overflow-x-auto">
            {['All', 'Free', 'Restaurants', 'Home Kitchens', 'Food Factories', 'Supermarkets', 'Retail Shops', 'Vegetarian', 'Halal', 'Near Me'].map((filter, index) => (
              <button 
                key={index} 
                onClick={() => setActiveFilter(filter)} 
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                  activeFilter === filter ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          
          {filteredFoods.length > 0 ? (
            filteredFoods.map(food => (
              <FoodCard key={food.id} food={food} onSelect={setSelectedFood} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Search size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No food found</p>
              <p className="text-sm">
                {searchTerm ? `No results for "${searchTerm}"` : `No results for "${activeFilter}"`}
              </p>
              <p className="text-sm">Try a different search term or filter!</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const CommunityView = () => (
    <div>
      <Header title="Community Hub" />
      <div className="p-4 space-y-6">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Community Impact</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">3,247</div>
              <div className="text-xs text-gray-600">Active Providers</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">28,456</div>
              <div className="text-xs text-gray-600">Items Rescued</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">18.9T</div>
              <div className="text-xs text-gray-600">CO₂ Saved</div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => setCurrentView('news')} className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-md">
            <Calendar className="mx-auto mb-2 text-blue-600" size={24} />
            <span className="text-sm font-medium">News & Events</span>
          </button>
          <button onClick={() => setCurrentView('chat')} className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-md">
            <MessageCircle className="mx-auto mb-2 text-green-600" size={24} />
            <span className="text-sm font-medium">Messages</span>
          </button>
        </div>
      </div>
    </div>
  );

  const PointsView = () => (
    <div>
      <Header title="KindCoins & Rewards" />
      <div className="p-4">
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white mb-6">
          <div className="text-center">
            <h2 className="text-lg font-medium">Your Balance</h2>
            <div className="text-4xl font-bold mt-2">{userPoints}</div>
            <div className="text-sm opacity-90">KindCoins</div>
          </div>
        </div>
        <h3 className="font-semibold text-gray-800 mb-3">Community Leaderboard</h3>
        <div className="bg-white rounded-lg shadow-md">
          {[
            { name: "Roshni L.", points: 1240, rank: 1 },
            { name: "Rania L.", points: 980, rank: 2 },
            { name: "You", points: userPoints, rank: 3 },
            { name: "Robert L.", points: 210, rank: 4 }
          ].map((user, index) => (
            <div key={index} className={`p-4 flex justify-between items-center ${user.name === 'You' ? 'bg-green-50' : ''} ${index < 3 ? 'border-b border-gray-200' : ''}`}>
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${user.rank === 1 ? 'bg-yellow-500 text-white' : user.rank === 2 ? 'bg-gray-400 text-white' : user.rank === 3 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {user.rank}
                </div>
                <span className={`font-medium ${user.name === 'You' ? 'text-green-600' : 'text-gray-800'}`}>
                  {user.name}
                </span>
              </div>
              <span className="font-bold text-gray-800">{user.points}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ProfileView = () => {
    const currentData = impactData[selectedPeriod];
    const periodLabels = { today: 'Today', week: 'This Week', month: 'This Month', year: 'This Year' };

    return (
      <div>
        <Header title="Your Profile & Impact" />
        <div className="p-4 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User size={40} className="text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Roshni L.</h2>
              <p className="text-sm text-gray-600">Kampala, Uganda</p>
              <p className="text-sm text-blue-600 mt-1">Makerere University</p>
              <div className="flex items-center justify-center space-x-2 mt-2">
                <span className="text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full">Active Community Member</span>
                <span className="text-sm text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full">🌱 Eco Warrior</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-semibold text-gray-800 mb-4 text-center">Your Environmental Impact</h3>
            <div className="grid grid-cols-4 gap-2 mb-6">
              {Object.entries(periodLabels).map(([key, label]) => (
                <button key={key} onClick={() => setSelectedPeriod(key)} className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors ${selectedPeriod === key ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {label}
                </button>
              ))}
            </div>
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3 text-center">{periodLabels[selectedPeriod]} Impact</h4>
              <div className="grid grid-cols-3 gap-4 text-center mb-4">
                <div>
                  <div className="text-2xl font-bold text-green-600">{currentData.meals}</div>
                  <div className="text-xs text-gray-600">Meals Saved</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{currentData.co2}kg</div>
                  <div className="text-xs text-gray-600">CO₂ Prevented</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">{currentData.kindcoins}</div>
                  <div className="text-xs text-gray-600">KindCoins</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AboutView = () => (
    <div>
      <Header title="About KindBite" />
      <div className="p-4 space-y-8">
        <div className="bg-gradient-to-br from-green-600 via-green-500 to-blue-600 rounded-2xl p-6 text-white text-center">
          <div className="text-6xl mb-4">🌍</div>
          <h2 className="text-2xl font-bold mb-2">KindBite</h2>
          <p className="text-green-100 mb-4">Connecting Hearts, Reducing Waste, Fighting Hunger</p>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="text-2xl font-bold">28K+</div>
              <div className="text-xs opacity-90">Items Rescued</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="text-2xl font-bold">3.2K</div>
              <div className="text-xs opacity-90">Active Providers</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="text-2xl font-bold">19T</div>
              <div className="text-xs opacity-90">CO₂ Saved</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Our Mission</h3>
          <p className="text-gray-600 text-center leading-relaxed">
            To create a global ecosystem where food waste becomes food security, connecting restaurants, 
            home kitchens, food factories, supermarkets, and retail shops with communities in need.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Complete Food Ecosystem</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(userPanels).slice(0, 5).map(([key, panel]) => {
              const IconComponent = panel.icon;
              return (
                <div key={key} className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className={`w-12 h-12 ${panel.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                    <IconComponent size={20} className="text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-800 text-sm mb-2">{panel.title}</h4>
                  <p className="text-xs text-gray-600">
                    {key === 'restaurant' && "Traditional food establishments"}
                    {key === 'home' && "Community food sharing"}
                    {key === 'factory' && "Production facilities"}
                    {key === 'supermarket' && "Large retail stores"}
                    {key === 'retail' && "Small shops & cafés"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const PartnersView = () => (
    <div>
      <Header title="Our Global Partners" />
      <div className="p-4 space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white text-center">
          <div className="text-4xl mb-3">🤝</div>
          <h2 className="text-xl font-bold mb-2">Global Partnership Network</h2>
          <p className="text-blue-100 text-sm">Working together to fight hunger, reduce waste, and protect our planet</p>
        </div>
        <div className="space-y-4">
          {keyPartners.map((partner, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
                  {partner.logo}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-800">{partner.name}</h3>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">{partner.type}</span>
                  </div>
                  <p className="text-sm text-gray-600">{partner.contribution}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const EnvironmentView = () => (
    <div>
      <Header title="Environmental Impact" />
      <div className="p-4 space-y-6">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white text-center">
          <div className="text-4xl mb-3">🌍</div>
          <h2 className="text-xl font-bold mb-2">Saving Our Planet</h2>
          <p className="text-green-100 text-sm">Every meal rescued makes a difference for our environment</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {environmentalMetrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4 text-center">
              <div className="text-3xl mb-2">{metric.icon}</div>
              <div className={`text-xl font-bold ${metric.color}`}>{metric.value}</div>
              <div className="text-xs font-medium text-gray-800 mb-1">{metric.title}</div>
              <div className="text-xs text-gray-600">{metric.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const NewsView = () => (
    <div>
      <Header title="News & Celebrations" />
      <div className="p-4 space-y-4">
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-6 text-white text-center">
          <div className="text-4xl mb-3">🎉</div>
          <h2 className="text-xl font-bold mb-2">Community News</h2>
        </div>
        {newsItems.map(item => (
          <div key={item.id} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">{item.image}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{item.content}</p>
                <p className="text-xs text-gray-400">{item.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ChatView = () => (
    <div>
      <Header title="Messages & Friends" />
      <div className="p-4">
        <div className="space-y-3">
          {friends.map(friend => (
            <div key={friend.id} className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                  <User size={20} className="text-gray-600" />
                </div>
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${friend.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">{friend.name}</h4>
                <p className="text-sm text-gray-600">{friend.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const UserPanelsView = () => (
    <div>
      <Header title="User Panels" />
      <div className="p-4 space-y-4">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white text-center mb-6">
          <div className="text-4xl mb-3">👥</div>
          <h2 className="text-xl font-bold mb-2">KindBite Community Roles</h2>
          <p className="text-purple-100 text-sm">Choose your role in fighting hunger and saving the environment</p>
        </div>

        {Object.entries(userPanels).map(([key, panel]) => {
          const IconComponent = panel.icon;
          return (
            <div key={key} className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => { setUserRole(key); setCurrentView('home'); }}>
              <div className="flex items-center space-x-3 mb-3">
                <div className={`w-12 h-12 ${panel.color} rounded-full flex items-center justify-center`}>
                  <IconComponent size={24} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{panel.title}</h3>
                  <p className="text-sm text-gray-600">
                    {key === 'restaurant' && "Food establishments listing surplus meals"}
                    {key === 'home' && "Home kitchens sharing extra food"}
                    {key === 'factory' && "Food production facilities managing overstock"}
                    {key === 'supermarket' && "Large stores redistributing near-expiry products"}
                    {key === 'retail' && "Small shops sharing unsold daily items"}
                    {key === 'verifier' && "Volunteer doctors ensuring food safety"}
                    {key === 'ambassador' && "Community volunteers bridging offline users"}
                    {key === 'donor' && "Supporters funding the ecosystem"}
                    {key === 'end-user' && "Individuals accessing affordable meals"}
                  </p>
                </div>
                {userRole === key && <div className="w-3 h-3 bg-green-500 rounded-full"></div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Main render
  const renderCurrentView = () => {
    if (currentView === 'home' && userRole !== 'end-user') {
      return (
        <div>
          <Header title={`${userPanels[userRole]?.title} Dashboard`} />
          <div className="p-4 text-center py-8">
            <div className="text-6xl mb-4">
              {userRole === 'restaurant' ? '🍽️' : 
               userRole === 'home' ? '🏠' : 
               userRole === 'factory' ? '🏭' :
               userRole === 'supermarket' ? '🛒' :
               userRole === 'retail' ? '🏪' :
               userRole === 'verifier' ? '🩺' : 
               userRole === 'ambassador' ? '✅' : '💰'}
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Welcome to {userPanels[userRole]?.title}</h2>
            <p className="text-gray-600 mb-6">This is your specialized dashboard for managing your role in the KindBite ecosystem.</p>
            <div className="bg-white rounded-lg shadow-md p-4 max-w-sm mx-auto">
              <h3 className="font-semibold text-gray-800 mb-3">Today's Performance</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold text-orange-600">
                    {userRole === 'factory' ? '156' : userRole === 'supermarket' ? '89' : userRole === 'retail' ? '34' : '23'}
                  </div>
                  <div className="text-xs text-gray-600">Items Listed</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-green-600">
                    {userRole === 'factory' ? '142' : userRole === 'supermarket' ? '76' : userRole === 'retail' ? '28' : '18'}
                  </div>
                  <div className="text-xs text-gray-600">Completed</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-purple-600">
                    {userRole === 'factory' ? '2,840' : userRole === 'supermarket' ? '1,560' : userRole === 'retail' ? '680' : '340'}
                  </div>
                  <div className="text-xs text-gray-600">KindCoins</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    switch(currentView) {
      case 'search': return <SearchView />;
      case 'community': return <CommunityView />;
      case 'points': return <PointsView />;
      case 'profile': return <ProfileView />;
      case 'about': return <AboutView />;
      case 'partners': return <PartnersView />;
      case 'environment': return <EnvironmentView />;
      case 'news': return <NewsView />;
      case 'chat': return <ChatView />;
      case 'panels': return <UserPanelsView />;
      default: return <HomeView />;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-20">
      {renderCurrentView()}

      {selectedFood && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-lg max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-800">{selectedFood.name}</h2>
              <button onClick={() => setSelectedFood(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="text-center mb-4">
              <div className="text-6xl mb-2">{selectedFood.image}</div>
              <h3 className="font-semibold text-gray-700">{selectedFood.restaurant}</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${getProviderColor(selectedFood.provider)}`}>
                {getProviderLabel(selectedFood.provider)}
              </span>
            </div>
            <button onClick={() => handleReserve(selectedFood)} className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
              Reserve Item
            </button>
          </div>
        </div>
      )}

      {showAIChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full h-96 flex flex-col">
            <div className="bg-green-600 text-white p-4 rounded-t-lg flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Bot size={20} />
                <span className="font-semibold">KindBite AI Assistant</span>
              </div>
              <button onClick={() => setShowAIChat(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 p-4">
              {aiMessages.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <Bot size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>Hi! I'm your KindBite AI assistant.</p>
                  <p className="text-sm">Ask me about finding food, different provider types, or how KindBite works!</p>
                </div>
              )}
              {aiMessages.map((message, index) => (
                <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
                  <div className={`max-w-xs p-3 rounded-lg ${message.sender === 'user' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <input type="text" value={aiInput} onChange={(e) => setAiInput(e.target.value)} placeholder="Ask about food factories, supermarkets..." className="flex-1 p-2 border border-gray-300 rounded-lg" onKeyPress={(e) => e.key === 'Enter' && sendAIMessage()} />
                <button onClick={sendAIMessage} className="bg-green-600 text-white p-2 rounded-lg">
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Navigation />
    </div>
  );
};

export default KindBiteApp;