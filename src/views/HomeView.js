import React from 'react';
import { Search } from 'lucide-react';
import FoodCard from '../components/ui/FoodCard';

const HomeView = ({ 
  userPoints, 
  foodListings, 
  onFoodSelect, 
  onViewChange 
}) => (
  <div>
    <div className="p-4 lg:p-6">
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-4 lg:p-6 lg:mb-6">
        <h3 className="font-semibold text-gray-800 mb-3 lg:text-lg">
          Your Impact Today
        </h3>
        <div className="grid grid-cols-3 gap-4 text-center mb-4 lg:gap-6">
          <div>
            <div className="font-bold text-green-600 text-2xl lg:text-3xl">12</div>
            <div className="text-gray-600 text-xs lg:text-sm">Meals Saved</div>
          </div>
          <div>
            <div className="font-bold text-blue-600 text-2xl lg:text-3xl">8.4kg</div>
            <div className="text-gray-600 text-xs lg:text-sm">CO₂ Prevented</div>
          </div>
          <div>
            <div className="font-bold text-purple-600 text-2xl lg:text-3xl">{userPoints}</div>
            <div className="text-gray-600 text-xs lg:text-sm">KindCoins</div>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-3">
          <div className="grid grid-cols-3 gap-4 text-center lg:gap-6">
            <div>
              <div className="font-bold text-blue-500 text-sm lg:text-lg">25L</div>
              <div className="text-gray-500 text-xs lg:text-sm">Water Saved</div>
            </div>
            <div>
              <div className="font-bold text-orange-500 text-sm lg:text-lg">1.2kg</div>
              <div className="text-gray-500 text-xs lg:text-sm">Packaging Reduced</div>
            </div>
            <div>
              <div className="font-bold text-green-500 text-sm lg:text-lg">0.3km</div>
              <div className="text-gray-500 text-xs lg:text-sm">Food Miles Cut</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-3 mb-6 lg:gap-4 lg:mb-8">
        <button 
          onClick={() => onViewChange('search')} 
          className="bg-white border border-gray-200 rounded-lg p-3 text-center hover:shadow-md transition-shadow"
        >
          <Search className="mx-auto mb-2 text-green-600 w-5 h-5 lg:w-6 lg:h-6" />
          <span className="font-medium text-xs lg:text-sm">Find Food</span>
        </button>
        <button 
          onClick={() => onViewChange('environment')} 
          className="bg-white border border-gray-200 rounded-lg p-3 text-center hover:shadow-md transition-shadow"
        >
          <span className="mb-2 block text-xl lg:text-2xl">🌱</span>
          <span className="font-medium text-xs lg:text-sm">Eco Impact</span>
        </button>
        <button 
          onClick={() => onViewChange('partners')} 
          className="bg-white border border-gray-200 rounded-lg p-3 text-center hover:shadow-md transition-shadow"
        >
          <span className="mb-2 block text-xl lg:text-2xl">🤝</span>
          <span className="font-medium text-xs lg:text-sm">Partners</span>
        </button>
        <button 
          onClick={() => onViewChange('community')} 
          className="bg-white border border-gray-200 rounded-lg p-3 text-center hover:shadow-md transition-shadow"
        >
          <span className="mb-2 block text-xl lg:text-2xl">👥</span>
          <span className="font-medium text-xs lg:text-sm">Community</span>
        </button>
      </div>
      
      <h3 className="font-semibold text-gray-800 mb-3 lg:text-lg lg:mb-4">
        Nearby Food Available
      </h3>
      <div className="space-y-4 lg:space-y-6">
        {foodListings.slice(0, 6).map(food => (
          <FoodCard 
            key={food.id} 
            food={food} 
            onSelect={onFoodSelect} 
          />
        ))}
      </div>
    </div>
  </div>
);

export default HomeView;
