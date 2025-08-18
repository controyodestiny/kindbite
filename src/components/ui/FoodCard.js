import React from 'react';
import { MapPin, Star, Clock, Heart } from 'lucide-react';

const FoodCard = ({ food, onSelect }) => {
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

  return (
    <div 
      className="bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow lg:p-6 lg:mb-6" 
      onClick={() => onSelect && onSelect(food)}
    >
      <div className="flex items-start space-x-3 lg:space-x-4">
        <div className="text-4xl lg:text-5xl">{food.image}</div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 lg:text-lg">
                {food.name}
              </h3>
              <p className="text-sm text-gray-600 lg:text-base">
                {food.restaurant}
              </p>
              <span className="text-xs px-2 py-1 rounded-full lg:text-sm lg:px-3 lg:py-1 ${getProviderColor(food.provider)}">
                {getProviderLabel(food.provider)}
              </span>
            </div>
            <div className="text-right ml-2">
              {food.discountedPrice === 0 ? (
                <span className="text-green-600 font-bold lg:text-lg">FREE</span>
              ) : (
                <div>
                  <span className="text-gray-400 line-through text-sm lg:text-base">
                    UGX {food.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-green-600 font-bold block lg:text-lg">
                    UGX {food.discountedPrice.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mt-1 lg:text-base lg:mt-2">
            {food.description}
          </p>
          
          <div className="flex items-center justify-between mt-3 lg:mt-4">
            <div className="flex items-center space-x-4 text-sm text-gray-500 lg:text-base lg:space-x-6">
              <div className="flex items-center">
                <MapPin size={14} className="mr-1 lg:w-4 lg:h-4" />
                {food.distance}
              </div>
              <div className="flex items-center">
                <Clock size={14} className="mr-1 lg:w-4 lg:h-4" />
                {food.pickupWindow}
              </div>
              <div className="flex items-center">
                <Star size={14} className="mr-1 text-yellow-500 lg:w-4 lg:h-4" />
                {food.rating}
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-2 lg:mt-3">
            <div className="flex space-x-1">
              {food.dietary.map((tag, index) => (
                <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs lg:text-sm lg:px-3 lg:py-1">
                  {tag}
                </span>
              ))}
            </div>
            <div className="text-xs text-green-600 flex items-center lg:text-sm">
              <Heart size={12} className="mr-1 lg:w-3 lg:h-3" />
              {food.co2Saved}kg CO₂ • {(food.co2Saved * 10).toFixed(0)}L water saved
            </div>
          </div>
          
          <div className="mt-2 text-sm lg:text-base lg:mt-3">
            <span className="text-orange-600 font-medium">{food.quantity} plates left</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
