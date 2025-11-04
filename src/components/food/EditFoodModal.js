/**
 * EditFoodModal - Modal for editing existing food listings
 * Allows food providers to update their food items
 */
import React, { useState, useEffect } from 'react';
import { X, Edit, Clock, MapPin, DollarSign, Leaf, Tag } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import foodService from '../../services/foodService';

const EditFoodModal = ({ isOpen, onClose, onFoodUpdated, foodItem }) => {
  const [formData, setFormData] = useState({
    name: '',
    restaurant_name: '',
    description: '',
    original_price: '',
    discounted_price: '',
    quantity: '',
    pickup_date: '',
    pickup_window_start: '',
    pickup_window_end: '',
    location: '',
    dietary_info: [],
    image_emoji: '🍽️',
    co2_saved: '0'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const toast = useToast();

  // Dietary options
  const dietaryOptions = [
    'Halal', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 
    'Nut-Free', 'Organic', 'Contains Gluten', 'Vegetarian Options'
  ];

  // Food emoji options
  const emojiOptions = [
    '🍽️', '🍛', '🥗', '🍞', '🥪', '🍕', '🍜', '🍲', '🥘', '🍱',
    '🍰', '🧁', '🍪', '🍩', '🥧', '🍮', '🍯', '🥛', '☕', '🍵'
  ];

  // Initialize form data when food item changes
  useEffect(() => {
    if (foodItem) {
      setFormData({
        name: foodItem.name || '',
        restaurant_name: foodItem.restaurant || foodItem.restaurant_name || '',
        description: foodItem.description || '',
        original_price: foodItem.originalPrice?.toString() || '',
        discounted_price: foodItem.discountedPrice?.toString() || '',
        quantity: foodItem.quantity?.toString() || '',
        pickup_date: foodItem.pickupDate || '',
        pickup_window_start: foodItem.pickupWindowStart || '',
        pickup_window_end: foodItem.pickupWindowEnd || '',
        location: foodItem.location || '',
        dietary_info: foodItem.dietary || [],
        image_emoji: foodItem.image || '🍽️',
        co2_saved: foodItem.co2Saved?.toString() || '0'
      });
    }
  }, [foodItem]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleDietaryChange = (dietary) => {
    setFormData(prev => ({
      ...prev,
      dietary_info: prev.dietary_info.includes(dietary)
        ? prev.dietary_info.filter(d => d !== dietary)
        : [...prev.dietary_info, dietary]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Food name is required';
    if (!formData.restaurant_name.trim()) newErrors.restaurant_name = 'Restaurant name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.original_price || parseFloat(formData.original_price) <= 0) {
      newErrors.original_price = 'Original price must be greater than 0';
    }
    if (!formData.discounted_price || parseFloat(formData.discounted_price) < 0) {
      newErrors.discounted_price = 'Discounted price cannot be negative';
    }
    if (parseFloat(formData.discounted_price) > parseFloat(formData.original_price)) {
      newErrors.discounted_price = 'Discounted price cannot be higher than original price';
    }
    if (!formData.quantity || parseInt(formData.quantity) <= 0) {
      newErrors.quantity = 'Quantity must be at least 1';
    }
    if (!formData.pickup_date) newErrors.pickup_date = 'Pickup date is required';
    if (!formData.pickup_window_start) newErrors.pickup_window_start = 'Pickup start time is required';
    if (!formData.pickup_window_end) newErrors.pickup_window_end = 'Pickup end time is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    
    // Validate pickup times
    if (formData.pickup_window_start && formData.pickup_window_end) {
      if (formData.pickup_window_start >= formData.pickup_window_end) {
        newErrors.pickup_window_end = 'End time must be after start time';
      }
    }
    
    // Validate pickup date is not in the past (only if changing date)
    if (formData.pickup_date) {
      const pickupDate = new Date(formData.pickup_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (pickupDate < today) {
        newErrors.pickup_date = 'Pickup date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsLoading(true);
    
    try {
      const foodData = {
        name: formData.name,
        restaurant: formData.restaurant_name,
        description: formData.description,
        originalPrice: parseFloat(formData.original_price),
        discountedPrice: parseFloat(formData.discounted_price),
        quantity: parseInt(formData.quantity),
        pickupDate: formData.pickup_date,
        pickupWindowStart: formData.pickup_window_start,
        pickupWindowEnd: formData.pickup_window_end,
        location: formData.location,
        dietary: formData.dietary_info,
        image: formData.image_emoji,
        co2Saved: parseFloat(formData.co2_saved)
      };

      const updatedFood = await foodService.updateFood(foodItem.id, foodData);
      
      toast.success('Food item updated successfully!');
      onFoodUpdated(updatedFood);
      handleClose();
      
    } catch (error) {
      console.error('Error updating food:', error);
      toast.error(error.message || 'Failed to update food item. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      restaurant_name: '',
      description: '',
      original_price: '',
      discounted_price: '',
      quantity: '',
      pickup_date: '',
      pickup_window_start: '',
      pickup_window_end: '',
      location: '',
      dietary_info: [],
      image_emoji: '🍽️',
      co2_saved: '0'
    });
    setErrors({});
    onClose();
  };

  if (!isOpen || !foodItem) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <Edit className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">Edit Food Item</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 flex items-center space-x-2">
              <Tag className="w-5 h-5" />
              <span>Basic Information</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Food Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Mixed Rice & Chicken"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Restaurant/Business Name *
                </label>
                <input
                  type="text"
                  name="restaurant_name"
                  value={formData.restaurant_name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.restaurant_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Mama's Kitchen"
                />
                {errors.restaurant_name && <p className="text-red-500 text-xs mt-1">{errors.restaurant_name}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe the food item..."
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 flex items-center space-x-2">
              <DollarSign className="w-5 h-5" />
              <span>Pricing</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Original Price (UGX) *
                </label>
                <input
                  type="number"
                  name="original_price"
                  value={formData.original_price}
                  onChange={handleInputChange}
                  min="0"
                  step="100"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.original_price ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="15000"
                />
                {errors.original_price && <p className="text-red-500 text-xs mt-1">{errors.original_price}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discounted Price (UGX) *
                </label>
                <input
                  type="number"
                  name="discounted_price"
                  value={formData.discounted_price}
                  onChange={handleInputChange}
                  min="0"
                  step="100"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.discounted_price ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="5000"
                />
                {errors.discounted_price && <p className="text-red-500 text-xs mt-1">{errors.discounted_price}</p>}
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Availability</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min="1"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.quantity ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="8"
                />
                {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pickup Date *
                </label>
                <input
                  type="date"
                  name="pickup_date"
                  value={formData.pickup_date}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.pickup_date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.pickup_date && <p className="text-red-500 text-xs mt-1">{errors.pickup_date}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CO2 Saved (kg)
                </label>
                <input
                  type="number"
                  name="co2_saved"
                  value={formData.co2_saved}
                  onChange={handleInputChange}
                  min="0"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="2.4"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pickup Start Time *
                </label>
                <input
                  type="time"
                  name="pickup_window_start"
                  value={formData.pickup_window_start}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.pickup_window_start ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.pickup_window_start && <p className="text-red-500 text-xs mt-1">{errors.pickup_window_start}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pickup End Time *
                </label>
                <input
                  type="time"
                  name="pickup_window_end"
                  value={formData.pickup_window_end}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.pickup_window_end ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.pickup_window_end && <p className="text-red-500 text-xs mt-1">{errors.pickup_window_end}</p>}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>Location</span>
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pickup Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.location ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Nakasero, Kampala"
              />
              {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
            </div>
          </div>

          {/* Dietary Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 flex items-center space-x-2">
              <Leaf className="w-5 h-5" />
              <span>Dietary Information</span>
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select applicable dietary options
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {dietaryOptions.map((option) => (
                  <label key={option} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.dietary_info.includes(option)}
                      onChange={() => handleDietaryChange(option)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Food Emoji */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">Food Emoji</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose an emoji for your food item
              </label>
              <div className="grid grid-cols-10 gap-2">
                {emojiOptions.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, image_emoji: emoji }))}
                    className={`w-10 h-10 text-2xl border-2 rounded-lg flex items-center justify-center transition-colors ${
                      formData.image_emoji === emoji
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4" />
                  <span>Update Food Item</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFoodModal;






























