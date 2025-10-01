import React from 'react';

const FoodModal = ({ selectedFood, onClose, onReserve }) => {
  if (!selectedFood) return null;

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 lg:items-center overflow-y-auto">
      <div className="bg-white rounded-t-lg w-full max-w-md lg:rounded-lg lg:max-w-lg lg:w-auto lg:mx-4 my-4">
        <div className="p-4 lg:p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="font-bold text-gray-800 text-xl lg:text-2xl">
              {selectedFood.name}
            </h2>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              ✕
            </button>
          </div>
          
          <div className="text-center mb-4">
            <div className="mb-2 text-6xl lg:text-7xl">
              {selectedFood.image}
            </div>
            <h3 className="font-semibold text-gray-700 lg:text-lg">
              {selectedFood.restaurant}
            </h3>
            <span className="text-xs px-2 py-1 rounded-full lg:text-sm lg:px-3 lg:py-1 ${getProviderColor(selectedFood.provider)}">
              {getProviderLabel(selectedFood.provider)}
            </span>
          </div>
          
          <div className="space-y-3 mb-6 lg:space-y-4">
            <div className="text-center">
              <p className="text-gray-600 text-sm lg:text-base">
                {selectedFood.description}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="font-bold text-green-600 lg:text-lg">
                  {selectedFood.discountedPrice === 0 ? 'FREE' : `UGX ${selectedFood.discountedPrice.toLocaleString()}`}
                </div>
                <div className="text-xs text-gray-500 lg:text-sm">
                  {selectedFood.discountedPrice === 0 ? 'No Cost' : 'Discounted Price'}
                </div>
              </div>
              <div>
                <div className="font-bold text-orange-600 lg:text-lg">
                  {selectedFood.quantity}
                </div>
                <div className="text-xs text-gray-500 lg:text-sm">
                  Plates Left
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-green-600 lg:text-base">
                🌱 {selectedFood.co2Saved}kg CO₂ saved • {(selectedFood.co2Saved * 10).toFixed(0)}L water saved
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => onReserve(selectedFood.id)} 
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors lg:py-4 lg:text-lg"
          >
            Reserve Item
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodModal;
