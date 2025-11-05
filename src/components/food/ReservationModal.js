import React, { useState } from 'react';
import { X, MapPin, Clock, CreditCard, User, Phone, MessageCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import foodService from '../../services/foodService';

const ReservationModal = ({ food, isOpen, onClose }) => {
  const { user } = useAuth();
  const toast = useToast();
  const [formData, setFormData] = useState({
    quantity: 1,
    special_instructions: '',
    payment_method: 'cash', // cash, mobile_money, card
    contact_phone: user?.phone || '',
    contact_email: user?.email || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !food) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to make a reservation');
      return;
    }

    if (formData.quantity > food.available_quantity) {
      toast.error(`Only ${food.available_quantity} items available`);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const reservationData = {
        food_listing: food.id,
        quantity_reserved: parseInt(formData.quantity),
        special_instructions: formData.special_instructions,
        payment_method: formData.payment_method,
        contact_phone: formData.contact_phone,
        contact_email: formData.contact_email
      };

      const reservation = await foodService.createReservation(reservationData);
      
      toast.success('Reservation created successfully! You will be contacted for pickup details.');
      onClose();
      
      // Refresh the food listings to update availability
      window.dispatchEvent(new CustomEvent('refreshFoodListings'));
      
    } catch (error) {
      console.error('Error creating reservation:', error);
      toast.error(error.message || 'Failed to create reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPrice = formData.quantity * (food.discounted_price || food.discountedPrice || 0);
  const isFree = totalPrice === 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Reserve Food</h2>
              <p className="text-gray-600 text-sm">Complete your reservation</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Food Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="text-3xl">{food.image_emoji || food.image || '🍽️'}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{food.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{food.description}</p>
                
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin size={14} className="mr-2" />
                    <span>{food.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={14} className="mr-2" />
                    <span>{food.pickup_window || food.pickupWindow || 'N/A'}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">
                      {food.restaurant_name || food.restaurant || 'Provider'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ 
                    ...prev, 
                    quantity: Math.max(1, prev.quantity - 1) 
                  }))}
                  className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                >
                  -
                </button>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="1"
                  max={food.available_quantity || food.quantity || 1}
                  className="w-20 text-center border border-gray-300 rounded-lg px-3 py-2"
                />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ 
                    ...prev, 
                    quantity: Math.min(food.available_quantity || food.quantity || 1, prev.quantity + 1) 
                  }))}
                  className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                >
                  +
                </button>
                <span className="text-sm text-gray-600">
                  of {food.available_quantity || food.quantity || 0} available
                </span>
              </div>
            </div>

            {/* Payment Method */}
            {!isFree && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="cash">Cash on Pickup</option>
                  <option value="mobile_money">Mobile Money</option>
                  <option value="card">Credit/Debit Card</option>
                </select>
              </div>
            )}

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  name="contact_phone"
                  value={formData.contact_phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Your phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  name="contact_email"
                  value={formData.contact_email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Your email"
                />
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Instructions (Optional)
              </label>
              <textarea
                name="special_instructions"
                value={formData.special_instructions}
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Any special requests or notes..."
              />
            </div>

            {/* Price Summary */}
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Total Price:</span>
                <span className="text-lg font-bold text-green-600">
                  {isFree ? 'FREE' : `UGX ${totalPrice.toLocaleString()}`}
                </span>
              </div>
              {!isFree && (
                <div className="text-sm text-gray-600">
                  Payment: {formData.payment_method === 'cash' ? 'Cash on pickup' : 
                           formData.payment_method === 'mobile_money' ? 'Mobile Money' : 
                           'Credit/Debit Card'}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <CreditCard size={20} />
                  <span>{isFree ? 'Reserve Free Food' : 'Reserve & Pay'}</span>
                </>
              )}
            </button>
          </form>

          {/* Provider Contact Info */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Provider Contact</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center">
                <User size={14} className="mr-2" />
                <span>{food.restaurant_name || food.restaurant || 'Provider'}</span>
              </div>
              {food.provider_email && (
                <div className="flex items-center">
                  <MessageCircle size={14} className="mr-2" />
                  <span>{food.provider_email}</span>
                </div>
              )}
              {food.provider_phone && (
                <div className="flex items-center">
                  <Phone size={14} className="mr-2" />
                  <span>{food.provider_phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationModal;


















