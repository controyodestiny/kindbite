import React, { memo } from 'react';
import { MapPin, Leaf, TrendingUp, Award, Users, Search, Globe } from 'lucide-react';
import FoodCard from '../components/ui/FoodCard';

const HomeView = memo(({ foodListings = [], onOpenFoodModal, onViewChange, onLikeToggle, onReserve }) => {
  const handleFoodSelect = (food) => {
    if (onOpenFoodModal) {
      onOpenFoodModal(food);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-24">
      <div className="p-4 lg:p-6 space-y-6">
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
            Welcome to KindBite
          </h1>
          <p className="text-gray-600 mb-6 text-lg">
            Discover amazing food while helping the environment and community
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={() => onViewChange && onViewChange('search')}
              className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200"
            >
              Find Food Now
            </button>
            <button 
              onClick={() => onViewChange && onViewChange('community')}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200"
            >
              Join Community
            </button>
          </div>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Leaf className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800">2,847</div>
            <div className="text-sm text-gray-600">Meals Rescued</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800">7,123</div>
            <div className="text-sm text-gray-600">CO₂ kg Saved</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800">156</div>
            <div className="text-sm text-gray-600">Active Partners</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800">1,234</div>
            <div className="text-sm text-gray-600">Community Members</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <button 
              onClick={() => onViewChange && onViewChange('search')}
              className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200"
            >
              <Search className="w-8 h-8 text-green-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Search Food</span>
            </button>
            
            <button 
              onClick={() => onViewChange && onViewChange('environment')}
              className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
            >
              <Leaf className="w-8 h-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Eco Impact</span>
            </button>
            
            <button 
              onClick={() => onViewChange && onViewChange('partners')}
              className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200"
            >
              <Globe className="w-8 h-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Partners</span>
            </button>
            
            <button 
              onClick={() => onViewChange && onViewChange('community')}
              className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors duration-200"
            >
              <Users className="w-8 h-8 text-orange-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Community</span>
            </button>
          </div>
        </div>

        {/* Nearby Food Available */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <MapPin className="w-5 h-5 text-green-500 mr-2" />
              Nearby Food Available
            </h2>
            <button 
              onClick={() => onViewChange && onViewChange('search')}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              View All →
            </button>
          </div>

          {foodListings && foodListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {foodListings.slice(0, 6).map((food) => (
                <FoodCard
                  key={food.id || Math.random()}
                  food={food}
                  onClick={handleFoodSelect}
                  onLikeToggle={onLikeToggle}
                  onReserve={onReserve}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No food available nearby</h3>
              <p className="text-gray-600 mb-6">Check back later or search for food in other areas</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button 
                  onClick={() => onViewChange && onViewChange('search')}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200"
                >
                  Search for Food
                </button>
                <button 
                  onClick={() => onViewChange && onViewChange('home')}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors duration-200"
                >
                  Go Home
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Points */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Your KindCoins</h3>
              <p className="text-gray-600">Earn points by rescuing food and helping the community</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">245</div>
              <div className="text-sm text-gray-500">Available Points</div>
            </div>
          </div>
          <button 
            onClick={() => onViewChange && onViewChange('points')}
            className="w-full mt-4 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors duration-200"
          >
            View Points History
          </button>
        </div>
      </div>
    </div>
  );
});

export default HomeView;
