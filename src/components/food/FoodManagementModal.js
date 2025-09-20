import React, { useState, useEffect } from 'react';
import { X, Plus, Edit, Trash2, Eye, RefreshCw } from 'lucide-react';
import AddFoodModal from './AddFoodModal';
import EditFoodModal from './EditFoodModal';
import DeleteFoodModal from './DeleteFoodModal';
import foodService from '../../services/foodService';
import { useToast } from '../../contexts/ToastContext';

const FoodManagementModal = ({ isOpen, onClose, user, userFoodListings, onAddFood, onUpdateFood, onDeleteFood }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [deletingFood, setDeletingFood] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [foodStats, setFoodStats] = useState(null);
  const toast = useToast();

  // Load food statistics when modal opens
  useEffect(() => {
    if (isOpen && user) {
      loadFoodStats();
    }
  }, [isOpen, user]);

  const loadFoodStats = async () => {
    try {
      const stats = await foodService.getFoodStats();
      setFoodStats(stats);
    } catch (error) {
      console.error('Failed to load food stats:', error);
    }
  };

  const handleAddFood = (newFood) => {
    onAddFood(newFood);
    setShowAddModal(false);
    loadFoodStats(); // Refresh stats
  };

  const handleEditFood = (food) => {
    setEditingFood(food);
    setShowEditModal(true);
  };

  const handleUpdateFood = (updatedFood) => {
    onUpdateFood(updatedFood);
    setShowEditModal(false);
    setEditingFood(null);
    loadFoodStats(); // Refresh stats
  };

  const handleDeleteFood = (food) => {
    setDeletingFood(food);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = (foodId) => {
    onDeleteFood(foodId);
    setShowDeleteModal(false);
    setDeletingFood(null);
    loadFoodStats(); // Refresh stats
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await loadFoodStats();
      toast.success('Food listings refreshed!');
    } catch (error) {
      toast.error('Failed to refresh food listings');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const getRoleSpecificTitle = () => {
    switch(user?.user_role) {
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
        {/* Main Food Management Interface */}
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
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="mt-2 px-3 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-1 mx-auto disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {foodStats?.total_listings || userFoodListings.length}
                </div>
                <div className="text-sm text-green-600">Total Items</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {foodStats?.active_listings || userFoodListings.filter(f => f.isAvailable).length}
                </div>
                <div className="text-sm text-blue-600">Active Items</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {foodStats?.total_co2_saved || userFoodListings.reduce((sum, food) => sum + (food.co2Saved || 0), 0).toFixed(1)}kg
                </div>
                <div className="text-sm text-purple-600">CO₂ Saved</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {foodStats?.total_kindcoins_earned || 0}
                </div>
                <div className="text-sm text-orange-600">KindCoins Earned</div>
              </div>
            </div>

            {/* Add New Food Button */}
            <div className="mb-6">
              <button
                onClick={() => setShowAddModal(true)}
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
                              <span>🕒 {food.pickupWindow || `${food.pickupDate} ${food.pickupWindowStart}-${food.pickupWindowEnd}`}</span>
                              <span>📦 {food.availableQuantity || food.quantity} available</span>
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
                            {(food.dietary || food.dietary_info || []).map((tag, index) => (
                              <span key={index} className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="text-sm text-green-600">
                            🌱 {food.co2Saved || 0}kg CO₂ saved
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
                        onClick={() => handleDeleteFood(food)}
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

        {/* Modals */}
        <AddFoodModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onFoodAdded={handleAddFood}
        />

        <EditFoodModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingFood(null);
          }}
          onFoodUpdated={handleUpdateFood}
          foodItem={editingFood}
        />

        <DeleteFoodModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setDeletingFood(null);
          }}
          onFoodDeleted={handleConfirmDelete}
          foodItem={deletingFood}
        />
      </div>
    </div>
  );
};

export default FoodManagementModal;
