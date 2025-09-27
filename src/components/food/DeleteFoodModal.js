/**
 * DeleteFoodModal - Modal for confirming food deletion
 * Provides a confirmation dialog before deleting food items
 */
import React, { useState } from 'react';
import { X, Trash2, AlertTriangle, Info } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import foodService from '../../services/foodService';

const DeleteFoodModal = ({ isOpen, onClose, onFoodDeleted, foodItem }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const toast = useToast();

  const expectedConfirmText = 'DELETE';
  const isConfirmValid = confirmText === expectedConfirmText;

  const handleDelete = async () => {
    if (!isConfirmValid) {
      toast.error('Please type "DELETE" to confirm');
      return;
    }

    setIsLoading(true);
    
    try {
      await foodService.deleteFoodListing(foodItem.id);
      
      toast.success('Food item deleted successfully!');
      onFoodDeleted(foodItem.id);
      handleClose();
      
    } catch (error) {
      console.error('Error deleting food:', error);
      toast.error(error.message || 'Failed to delete food item. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setConfirmText('');
    onClose();
  };

  if (!isOpen || !foodItem) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <Trash2 className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-semibold text-gray-800">Delete Food Item</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Warning Icon and Message */}
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Are you sure you want to delete this food item?
              </h3>
              <p className="text-gray-600 text-sm">
                This action cannot be undone. The food item will be permanently removed from your listings.
              </p>
            </div>
          </div>

          {/* Food Item Details */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{foodItem.image || '🍽️'}</span>
              <div>
                <h4 className="font-medium text-gray-800">{foodItem.name}</h4>
                <p className="text-sm text-gray-600">{foodItem.restaurant || foodItem.restaurant_name}</p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <p><span className="font-medium">Quantity:</span> {foodItem.quantity}</p>
              <p><span className="font-medium">Price:</span> UGX {foodItem.originalPrice?.toLocaleString()} → UGX {foodItem.discountedPrice?.toLocaleString()}</p>
              <p><span className="font-medium">Pickup:</span> {foodItem.pickupDate} at {foodItem.pickupWindow || foodItem.location}</p>
            </div>
          </div>

          {/* Impact Information */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800 mb-1">Impact of deletion:</p>
                <ul className="text-yellow-700 space-y-1">
                  <li>• Any existing reservations will be cancelled</li>
                  <li>• Users who reserved this item will be notified</li>
                  <li>• This food item will no longer be available for rescue</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Confirmation Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              To confirm deletion, type <span className="font-mono bg-gray-100 px-2 py-1 rounded">DELETE</span> below:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                confirmText && !isConfirmValid ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Type DELETE to confirm"
              autoComplete="off"
            />
            {confirmText && !isConfirmValid && (
              <p className="text-red-500 text-xs">Please type exactly "DELETE" to confirm</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={!isConfirmValid || isLoading}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Delete Food Item</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteFoodModal;




