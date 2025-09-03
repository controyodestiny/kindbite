import React, { useState } from 'react';
import { X, Upload, Clock, MapPin, DollarSign, Package, Leaf } from 'lucide-react';

const AddFoodForm = ({ user, onClose, onAddFood }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    originalPrice: '',
    discountedPrice: '',
    quantity: '',
    pickupWindow: '',
    dietary: [],
    image: '🍽️',
    location: user?.location || '',
    co2Saved: 2.0
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dietaryOptions = [
    'Halal', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 
    'Organic', 'Contains Nuts', 'Spicy', 'Low Sodium'
  ];

  const foodImages = [
    '🍽️', '🍛', '🥗', '🍕', '🍔', '🌮', '🥙', '🍜', '🍲', '🥘',
    '🍞', '🥐', '🧁', '🍰', '🍪', '🥤', '☕', '🍵', '🥛', '🧃'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
      dietary: prev.dietary.includes(dietary)
        ? prev.dietary.filter(d => d !== dietary)
        : [...prev.dietary, dietary]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Food name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.originalPrice || formData.originalPrice <= 0) {
      newErrors.originalPrice = 'Original price is required';
    }
    
    if (!formData.discountedPrice || formData.discountedPrice < 0) {
      newErrors.discountedPrice = 'Discounted price is required';
    }
    
    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = 'Quantity is required';
    }
    
    if (!formData.pickupWindow.trim()) {
      newErrors.pickupWindow = 'Pickup window is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const newFood = {
        id: Date.now(),
        restaurant: user?.businessName || `${user?.firstName} ${user?.lastName}`,
        name: formData.name,
        description: formData.description,
        originalPrice: parseInt(formData.originalPrice),
        discountedPrice: parseInt(formData.discountedPrice),
        quantity: parseInt(formData.quantity),
        rating: 4.5, // Default rating
        distance: "0.5 km", // Default distance
        pickupWindow: formData.pickupWindow,
        dietary: formData.dietary,
        image: formData.image,
        co2Saved: parseFloat(formData.co2Saved),
        provider: user?.userRole || 'restaurant',
        location: formData.location,
        createdAt: new Date().toISOString()
      };

      await onAddFood(newFood);
      onClose();
    } catch (error) {
      console.error('Error adding food:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleSpecificTitle = () => {
    switch(user?.userRole) {
      case 'restaurant': return 'Add Menu Item';
      case 'home': return 'Share Home-Cooked Meal';
      case 'factory': return 'List Production Surplus';
      case 'supermarket': return 'Add Clearance Item';
      case 'retail': return 'List Shop Item';
      default: return 'Add Food Item';
    }
  };

  const getRoleSpecificDescription = () => {
    switch(user?.userRole) {
      case 'restaurant': return 'Add surplus meals from your restaurant';
      case 'home': return 'Share your home-cooked meals with the community';
      case 'factory': return 'List surplus products from your production';
      case 'supermarket': return 'Add clearance items from your store';
      case 'retail': return 'List items from your shop';
      default: return 'Add food items for the community';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-2xl mx-auto relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-lg hover:bg-gray-50 transition-colors z-10"
      >
        <X size={18} className="text-gray-600" />
      </button>
      
      <div className="text-center mb-4">
        <div className="text-3xl mb-2">{formData.image}</div>
        <h2 className="text-xl font-bold text-gray-800">{getRoleSpecificTitle()}</h2>
        <p className="text-gray-600 text-sm">{getRoleSpecificDescription()}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Food Image Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Food Image
          </label>
          <div className="grid grid-cols-10 gap-2">
            {foodImages.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, image: emoji }))}
                className={`p-2 border-2 rounded-lg text-lg hover:bg-gray-50 ${
                  formData.image === emoji ? 'border-green-500 bg-green-50' : 'border-gray-200'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Food Name and Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Food Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Mixed Rice & Chicken"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity Available
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.quantity ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., 10"
              min="1"
            />
            {errors.quantity && (
              <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Describe your food item..."
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
          )}
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Original Price (UGX)
            </label>
            <input
              type="number"
              name="originalPrice"
              value={formData.originalPrice}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.originalPrice ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., 15000"
              min="0"
            />
            {errors.originalPrice && (
              <p className="text-red-500 text-xs mt-1">{errors.originalPrice}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discounted Price (UGX)
            </label>
            <input
              type="number"
              name="discountedPrice"
              value={formData.discountedPrice}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.discountedPrice ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., 5000 (0 for free)"
              min="0"
            />
            {errors.discountedPrice && (
              <p className="text-red-500 text-xs mt-1">{errors.discountedPrice}</p>
            )}
          </div>
        </div>

        {/* Pickup Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pickup Window
            </label>
            <input
              type="text"
              name="pickupWindow"
              value={formData.pickupWindow}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.pickupWindow ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., 5:00 PM - 7:00 PM"
            />
            {errors.pickupWindow && (
              <p className="text-red-500 text-xs mt-1">{errors.pickupWindow}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.location ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Kampala, Uganda"
            />
            {errors.location && (
              <p className="text-red-500 text-xs mt-1">{errors.location}</p>
            )}
          </div>
        </div>

        {/* Dietary Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dietary Information
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {dietaryOptions.map((dietary) => (
              <button
                key={dietary}
                type="button"
                onClick={() => handleDietaryChange(dietary)}
                className={`p-2 text-xs border rounded-lg transition-all ${
                  formData.dietary.includes(dietary)
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {dietary}
              </button>
            ))}
          </div>
        </div>

        {/* Environmental Impact */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CO₂ Saved (kg)
          </label>
          <input
            type="number"
            name="co2Saved"
            value={formData.co2Saved}
            onChange={handleChange}
            step="0.1"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="e.g., 2.4"
            min="0"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Upload size={20} />
              <span>Add Food Item</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddFoodForm;
