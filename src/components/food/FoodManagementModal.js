import React, { useState } from 'react';
import { X, Plus, Edit, Trash2, Eye } from 'lucide-react';
import AddFoodForm from './AddFoodForm';

const FoodManagementModal = ({ isOpen, onClose, user, userFoodListings, onAddFood, onUpdateFood, onDeleteFood }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFood, setEditingFood] = useState(null);

  if (!isOpen) return null;

  const handleAddFood = (newFood) => {
    onAddFood(newFood);
    setShowAddForm(false);
  };

  const handleEditFood = (food) => {
    setEditingFood(food);
    setShowAddForm(true);
  };

  const handleDeleteFood = (foodId) => {
    if (window.confirm('Are you sure you want to delete this food item?')) {
      onDeleteFood(foodId);
    }
  };

  const getRoleSpecificTitle = () => {
    switch(user?.userRole) {
      case 'restaurant': return 'Restaurant Menu Management';
      case 'home': return 'Home Kitchen Management';
      case 'factory': return 'Factory Production Management';
      case 'supermarket': return 'Supermarket Inventory';
      case 'retail': return 'Retail Shop Management';
      default: return 'Food Management';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-hide"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitScrollbar: { display: 'none' }
        }}
      >
        {showAddForm ? (
          <AddFoodForm
            user={user}
            onClose={() => {
              setShowAddForm(false);
              setEditingFood(null);
            }}
            onAddFood={handleAddFood}
            editingFood={editingFood}
          />
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-4xl mx-auto relative">
            <button
              onClick={onClose}
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-lg hover:bg-gray-50 transition-colors z-10"
            >
              <X size={18} className="text-gray-600" />
            </button>
            
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{getRoleSpecificTitle()}</h2>
              <p className="text-gray-600">Manage your food listings</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{userFoodListings.length}</div>
                <div className="text-sm text-green-600">Total Items</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {userFoodListings.reduce((sum, food) => sum + food.quantity, 0)}
                </div>
                <div className="text-sm text-blue-600">Total Quantity</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {userFoodListings.reduce((sum, food) => sum + food.co2Saved, 0).toFixed(1)}kg
                </div>
                <div className="text-sm text-purple-600">CO₂ Saved</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  UGX {userFoodListings.reduce((sum, food) => sum + (food.originalPrice - food.discountedPrice), 0).toLocaleString()}
                </div>
                <div className="text-sm text-orange-600">Total Savings</div>
              </div>
            </div>

            {/* Add New Food Button */}
            <div className="mb-6">
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Plus size={20} />
                <span>Add New Food Item</span>
              </button>
            </div>

            {/* Food Listings */}
            <div className="space-y-4">
              {userFoodListings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-4">🍽️</div>
                  <p className="text-lg">No food items yet</p>
                  <p className="text-sm">Add your first food item to get started!</p>
                </div>
              ) : (
                userFoodListings.map((food) => (
                  <div key={food.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start space-x-4">
                      <div className="text-4xl">{food.image}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-800 text-lg">{food.name}</h3>
                            <p className="text-gray-600 text-sm">{food.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                              <span>📍 {food.location}</span>
                              <span>🕒 {food.pickupWindow}</span>
                              <span>📦 {food.quantity} available</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">
                              {food.discountedPrice === 0 ? 'FREE' : `UGX ${food.discountedPrice.toLocaleString()}`}
                            </div>
                            {food.originalPrice > food.discountedPrice && (
                              <div className="text-sm text-gray-400 line-through">
                                UGX {food.originalPrice.toLocaleString()}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex space-x-1">
                            {food.dietary.map((tag, index) => (
                              <span key={index} className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="text-sm text-green-600">
                            🌱 {food.co2Saved}kg CO₂ saved
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-2 mt-4">
                      <button
                        onClick={() => handleEditFood(food)}
                        className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-sm hover:bg-blue-200 transition-colors flex items-center space-x-1"
                      >
                        <Edit size={14} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteFood(food.id)}
                        className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-sm hover:bg-red-200 transition-colors flex items-center space-x-1"
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodManagementModal;
