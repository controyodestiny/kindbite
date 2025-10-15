import React, { useState } from 'react';
import { MapPin, Clock, Star, Tag, Heart, CreditCard } from 'lucide-react';
import ReservationModal from '../food/ReservationModal';
import { useAuth } from '../../contexts/AuthContext';

const FoodCard = ({ food, onClick, onLikeToggle, onReserve }) => {
  const { user } = useAuth();
  const [showReservationModal, setShowReservationModal] = useState(false);

  if (!food || typeof food !== 'object') {
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
      <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
        {food.image_url && typeof food.image_url === 'string' && food.image_url.length > 0 && (food.image_url.startsWith && food.image_url.startsWith('http')) ? (
          <img 
            src={food.image_url} 
            alt={food.name}
            className="w-full h-full object-cover rounded-lg"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className={`w-full h-full flex items-center justify-center text-4xl ${food.image_url && typeof food.image_url === 'string' && food.image_url.length > 0 && (food.image_url.startsWith && food.image_url.startsWith('http')) ? 'hidden' : 'flex'}`}>
          {food.image_emoji || food.image || '🍽️'}
        </div>
      </div>

      {/* Food Info */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-800 text-lg">
          {food.name || 'Food Item'}
        </h3>
        
        <div className="flex items-center justify-between mb-2">
          <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getProviderColor(food.provider_type || food.provider)}`}>
            {food.restaurant_name || food.restaurant || 'Provider'}
          </div>
          {food.provider_type && (
            <span className="text-xs text-gray-500 capitalize">
              {food.provider_type}
            </span>
          )}
        </div>

        <p className="text-gray-600 text-sm line-clamp-2">
          {food.description || 'No description available'}
        </p>

        {/* Price Section */}
        <div className="flex items-center justify-between">
          {food.discounted_price === 0 ? (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-semibold">
              FREE
            </span>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 line-through text-sm">
                UGX {(food.original_price || 0).toLocaleString()}
              </span>
              <span className="text-green-600 font-semibold text-lg">
                UGX {(food.discounted_price || 0).toLocaleString()}
              </span>
            </div>
          )}
          
          <span className="text-gray-500 text-sm">
            {food.available_quantity || food.quantity || 0} available
          </span>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <MapPin size={14} />
            <span>{food.distance || food.location || 'N/A'}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Clock size={14} />
            <span>{food.pickup_window || food.pickupWindow || food.pickup_date || 'N/A'}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Star size={14} />
            <span>{food.rating || 'N/A'}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <span className="text-xs">📦 {food.available_quantity || food.quantity || 0}</span>
          </div>
        </div>

        {/* Dietary Tags */}
        {(food.dietary_info && Array.isArray(food.dietary_info) && food.dietary_info.length > 0) || 
         (food.dietary && Array.isArray(food.dietary) && food.dietary.length > 0) ? (
          <div className="flex flex-wrap gap-1">
            {(food.dietary_info || food.dietary || []).map((tag, index) => (
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
            <span>Save {food.co2_saved || food.co2Saved || 0}kg CO₂</span>
            {food.water_saved && <span className="ml-2">💧 {food.water_saved}L</span>}
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">
              {food.likesCount || 0} likes
            </span>
            
            {/* Show different buttons based on user role */}
            {user?.user_role === 'end-user' ? (
              // Food seekers can reserve
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowReservationModal(true);
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 bg-green-500 text-white hover:bg-green-600 flex items-center space-x-1"
              >
                <CreditCard size={14} />
                <span>Reserve Now</span>
              </button>
            ) : user?.user_role && ['restaurant', 'home', 'factory', 'supermarket', 'retail'].includes(user.user_role) ? (
              // Providers see their own listings with view button
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (onClick) onClick(food);
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 bg-blue-500 text-white hover:bg-blue-600"
              >
                View Details
              </button>
            ) : (
              // Default reserve button for other cases
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (onReserve) {
                    onReserve(food.id, !food.isReserved);
                  }
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  food.isReserved 
                    ? 'bg-gray-500 text-white cursor-not-allowed' 
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
                disabled={food.isReserved}
              >
                {food.isReserved ? 'Reserved' : 'Reserve Now'}
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Reservation Modal */}
      <ReservationModal
        food={food}
        isOpen={showReservationModal}
        onClose={() => setShowReservationModal(false)}
      />
    </div>
  );
};

export default FoodCard;
