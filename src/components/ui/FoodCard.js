import React from 'react';
import { MapPin, Clock, Star, Tag, Heart } from 'lucide-react';

const FoodCard = ({ food, onClick, onLikeToggle }) => {
  if (!food) {
    return null;
  }

  const getProviderColor = (provider) => {
    const colors = {
      'restaurant': 'bg-blue-100 text-blue-800',
      'bakery': 'bg-yellow-100 text-yellow-800',
      'supermarket': 'bg-green-100 text-green-800',
      'home': 'bg-purple-100 text-purple-800',
      'default': 'bg-gray-100 text-gray-800'
    };
    return colors[provider] || colors.default;
  };

  const handleLikeClick = (e) => {
    e.stopPropagation(); // Prevent opening the food modal
    if (onLikeToggle) {
      onLikeToggle(food.id, !food.isLiked);
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md border border-gray-200 p-4 cursor-pointer hover:shadow-lg transition-shadow duration-200 relative"
      onClick={() => onClick(food)}
    >
      {/* Like Button */}
      <button
        onClick={handleLikeClick}
        className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 z-10 ${
          food.isLiked 
            ? 'bg-red-500 text-white hover:bg-red-600' 
            : 'bg-white text-gray-400 hover:text-red-500 hover:bg-red-50'
        } shadow-md hover:shadow-lg`}
        title={food.isLiked ? 'Unlike this food' : 'Like this food'}
      >
        <Heart 
          size={18} 
          className={food.isLiked ? 'fill-current' : ''} 
        />
      </button>

      {/* Food Image/Icon */}
      <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-4xl">
        {food.image || '🍽️'}
      </div>

      {/* Food Info */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-800 text-lg">
          {food.name || 'Food Item'}
        </h3>
        
        <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getProviderColor(food.provider)}`}>
          {food.restaurant || 'Provider'}
        </div>

        <p className="text-gray-600 text-sm line-clamp-2">
          {food.description || 'No description available'}
        </p>

        {/* Price Section */}
        <div className="flex items-center justify-between">
          {food.discountedPrice === 0 ? (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-semibold">
              FREE
            </span>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 line-through text-sm">
                UGX {(food.originalPrice || 0).toLocaleString()}
              </span>
              <span className="text-green-600 font-semibold text-lg">
                UGX {(food.discountedPrice || 0).toLocaleString()}
              </span>
            </div>
          )}
          
          <span className="text-gray-500 text-sm">
            {food.quantity || 0} available
          </span>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <MapPin size={14} />
            <span>{food.distance || 'N/A'}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Clock size={14} />
            <span>{food.pickupWindow || 'N/A'}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Star size={14} />
            <span>{food.rating || 'N/A'}</span>
          </div>
        </div>

        {/* Dietary Tags */}
        {food.dietary && Array.isArray(food.dietary) && food.dietary.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {food.dietary.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                <Tag size={12} className="mr-1" />
                {tag}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-gray-400 text-xs">No dietary info</span>
        )}

        {/* Environmental Impact & Like Count */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-1 text-green-600 text-sm">
            <Heart size={14} />
            <span>Save {food.co2Saved || 0}kg CO₂</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">
              {food.likesCount || 0} likes
            </span>
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors duration-200">
              Reserve Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
