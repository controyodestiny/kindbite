import React, { useState, useEffect } from 'react';
import { X, CreditCard, Coins, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import paymentService from '../../services/paymentService';
import { useToast } from '../../contexts/ToastContext';

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  reservation, 
  onPaymentSuccess,
  userKindCoins = 0 
}) => {
  const [paymentMethod, setPaymentMethod] = useState('kindcoins'); // 'kindcoins' or 'card'
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (isOpen && paymentMethod === 'card') {
      loadPaymentMethods();
    }
  }, [isOpen, paymentMethod]);

  const loadPaymentMethods = async () => {
    try {
      setIsLoading(true);
      const methods = await paymentService.getPaymentMethods();
      setPaymentMethods(methods);
      if (methods.length > 0) {
        setSelectedCard(methods.find(m => m.is_default) || methods[0]);
      }
    } catch (error) {
      console.error('Error loading payment methods:', error);
      toast.error('Failed to load payment methods');
    } finally {
      setIsLoading(false);
    }
  };

  const calculatePayment = () => {
    if (!reservation) return { baseAmount: 0, fee: 0, total: 0, feeRate: 0 };
    
    const baseAmount = reservation.food_listing.discounted_price * reservation.quantity_reserved;
    return paymentService.calculatePaymentAmount(baseAmount, paymentMethod === 'kindcoins' ? 'KINDCOINS' : 'UGX');
  };

  const handlePayment = async () => {
    if (!reservation) return;

    setIsProcessing(true);
    
    try {
      if (paymentMethod === 'kindcoins') {
        const paymentAmount = calculatePayment();
        
        if (userKindCoins < paymentAmount.total) {
          toast.error('Insufficient KindCoins balance');
          return;
        }

        await paymentService.processKindCoinsPayment(reservation, paymentAmount.total);
        toast.success('Payment successful with KindCoins!');
        
      } else if (paymentMethod === 'card') {
        if (!selectedCard) {
          toast.error('Please select a payment method');
          return;
        }

        const paymentIntent = await paymentService.createPaymentIntent(reservation);
        const confirmedPayment = await paymentService.confirmPaymentIntent(
          paymentIntent.id, 
          selectedCard.id
        );
        
        toast.success('Payment successful!');
      }

      onPaymentSuccess?.(reservation);
      onClose();
      
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen || !reservation) return null;

  const paymentDetails = calculatePayment();
  const canPayWithKindCoins = userKindCoins >= paymentDetails.total;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Complete Payment</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Food Item Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-2xl">{reservation.food_listing.image_emoji}</span>
              <div>
                <h3 className="font-semibold text-gray-800">{reservation.food_listing.name}</h3>
                <p className="text-sm text-gray-600">{reservation.food_listing.restaurant_name}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Quantity:</span>
                <span className="ml-2 font-medium">{reservation.quantity_reserved}</span>
              </div>
              <div>
                <span className="text-gray-600">Price per item:</span>
                <span className="ml-2 font-medium">
                  {paymentService.formatCurrency(reservation.food_listing.discounted_price, 'UGX')}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Payment Method</h3>
            <div className="space-y-3">
              {/* KindCoins Option */}
              <div
                className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                  paymentMethod === 'kindcoins'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setPaymentMethod('kindcoins')}
              >
                <div className="flex items-center space-x-3">
                  <Coins className="w-6 h-6 text-yellow-500" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-800">KindCoins</span>
                      <span className="text-sm text-gray-600">
                        Balance: {userKindCoins} KindCoins
                      </span>
                    </div>
                    {!canPayWithKindCoins && (
                      <p className="text-sm text-red-600 mt-1">
                        Insufficient KindCoins balance
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Payment Option */}
              <div
                className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                  paymentMethod === 'card'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setPaymentMethod('card')}
              >
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-6 h-6 text-blue-500" />
                  <div className="flex-1">
                    <span className="font-medium text-gray-800">Credit/Debit Card</span>
                    <p className="text-sm text-gray-600">Pay with your saved card</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card Selection (if card payment) */}
          {paymentMethod === 'card' && (
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Select Card</h4>
              {isLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader className="w-5 h-5 animate-spin text-gray-400" />
                  <span className="ml-2 text-gray-600">Loading cards...</span>
                </div>
              ) : paymentMethods.length > 0 ? (
                <div className="space-y-2">
                  {paymentMethods.map((card) => (
                    <div
                      key={card.id}
                      className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                        selectedCard?.id === card.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedCard(card)}
                    >
                      <div className="flex items-center space-x-3">
                        <CreditCard className="w-5 h-5 text-gray-400" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">
                            •••• •••• •••• {card.last_four_digits}
                          </p>
                          <p className="text-sm text-gray-600">
                            {card.brand.toUpperCase()} • Expires {card.exp_month}/{card.exp_year}
                          </p>
                        </div>
                        {card.is_default && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <CreditCard className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">No saved cards found</p>
                  <p className="text-xs text-gray-400">Add a card in your profile settings</p>
                </div>
              )}
            </div>
          )}

          {/* Payment Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3">Payment Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">
                  {paymentService.formatCurrency(paymentDetails.baseAmount, paymentMethod === 'kindcoins' ? 'KINDCOINS' : 'UGX')}
                </span>
              </div>
              {paymentMethod === 'card' && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Processing fee ({paymentDetails.feeRate}%):</span>
                  <span className="font-medium">
                    {paymentService.formatCurrency(paymentDetails.fee, 'UGX')}
                  </span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-800">Total:</span>
                  <span className="font-bold text-lg">
                    {paymentService.formatCurrency(paymentDetails.total, paymentMethod === 'kindcoins' ? 'KINDCOINS' : 'UGX')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={isProcessing || (paymentMethod === 'kindcoins' && !canPayWithKindCoins) || (paymentMethod === 'card' && !selectedCard)}
              className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Pay Now</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;






