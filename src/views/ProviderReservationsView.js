import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, User, Phone, MessageCircle, Mail, CheckCircle, XCircle, AlertCircle, Eye, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import foodService from '../services/foodService';
import apiService from '../services/apiService';

const ProviderReservationsView = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // pending, confirmed, completed, cancelled
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadReservations();
    
    // Listen for reservation updates
    const handleReservationUpdate = () => {
      loadReservations();
    };
    
    window.addEventListener('reservationCreated', handleReservationUpdate);
    window.addEventListener('reservationUpdated', handleReservationUpdate);
    
    return () => {
      window.removeEventListener('reservationCreated', handleReservationUpdate);
      window.removeEventListener('reservationUpdated', handleReservationUpdate);
    };
  }, []);

  const loadReservations = async () => {
    try {
      setIsLoading(true);
      
      if (!user) {
        toast.error('You must be logged in to view reservations');
        return;
      }
      
      const token = localStorage.getItem('kindbite_access_token');
      if (!token) {
        toast.error('Authentication token not found. Please login again.');
        return;
      }
      
      try {
        const data = await foodService.getUserReservations();
        console.log('Provider reservations data received:', data);
        
        // Handle different response formats
        if (Array.isArray(data)) {
          setReservations(data);
        } else if (data && Array.isArray(data.results)) {
          setReservations(data.results);
        } else if (data && Array.isArray(data.reservations)) {
          setReservations(data.reservations);
        } else if (data && data.id) {
          // Single reservation object
          setReservations([data]);
        } else {
          setReservations([]);
        }
      } catch (reservationError) {
        if (reservationError.status === 403) {
          const refreshSuccess = await apiService.refreshToken();
          if (refreshSuccess) {
            const retryData = await foodService.getUserReservations();
            // Handle different response formats
            if (Array.isArray(retryData)) {
              setReservations(retryData);
            } else if (retryData && Array.isArray(retryData.results)) {
              setReservations(retryData.results);
            } else if (retryData && Array.isArray(retryData.reservations)) {
              setReservations(retryData.reservations);
            } else if (retryData && retryData.id) {
              // Single reservation object
              setReservations([retryData]);
            } else {
              setReservations([]);
            }
          } else {
            throw new Error('Authentication failed. Please login again.');
          }
        } else {
          throw reservationError;
        }
      }
    } catch (error) {
      console.error('Error loading reservations:', error);
      if (error.status === 403) {
        toast.error('Authentication failed. Please login again.');
      } else {
        toast.error('Failed to load reservations');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateReservationStatus = async (reservationId, newStatus) => {
    try {
      // Call the API to update reservation status
      const updatedReservation = await foodService.updateReservationStatus(reservationId, newStatus);
      
      // Update local state
      setReservations(prev => 
        prev.map(reservation => 
          reservation.id === reservationId 
            ? updatedReservation
            : reservation
        )
      );
      
      // Dispatch event to refresh seeker reservations
      window.dispatchEvent(new CustomEvent('reservationStatusChanged'));
      
      toast.success(`Reservation ${newStatus} successfully`);
      
    } catch (error) {
      console.error('Error updating reservation:', error);
      toast.error('Failed to update reservation');
    }
  };

  const sendEmailNotification = async (reservationId, status) => {
    try {
      // This would integrate with your email service
      console.log(`Sending email notification for reservation ${reservationId} with status ${status}`);
      // Implementation would go here
    } catch (error) {
      console.error('Error sending email notification:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'picked_up': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'picked_up': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredReservations = Array.isArray(reservations) ? reservations.filter(reservation => {
    switch (activeTab) {
      case 'pending':
        return reservation.status === 'pending';
      case 'confirmed':
        return reservation.status === 'confirmed';
      case 'completed':
        return ['completed', 'picked_up'].includes(reservation.status);
      case 'cancelled':
        return reservation.status === 'cancelled';
      default:
        return true;
    }
  }) : [];

  const getRoleSpecificTitle = () => {
    switch(user?.user_role) {
      case 'restaurant': return 'Restaurant Reservations';
      case 'home': return 'Home Kitchen Reservations';
      case 'factory': return 'Factory Reservations';
      case 'supermarket': return 'Supermarket Reservations';
      case 'retail': return 'Retail Shop Reservations';
      default: return 'Food Reservations';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-24">
        <div className="p-4 lg:p-6">
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-24">
      <div className="p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Calendar className="w-8 h-8 text-green-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{getRoleSpecificTitle()}</h1>
                <p className="text-gray-600">Manage food reservations from customers</p>
              </div>
            </div>
            <button
              onClick={loadReservations}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {[
              { id: 'pending', label: 'Pending', count: Array.isArray(reservations) ? reservations.filter(r => r.status === 'pending').length : 0 },
              { id: 'confirmed', label: 'Confirmed', count: Array.isArray(reservations) ? reservations.filter(r => r.status === 'confirmed').length : 0 },
              { id: 'completed', label: 'Completed', count: Array.isArray(reservations) ? reservations.filter(r => ['completed', 'picked_up'].includes(r.status)).length : 0 },
              { id: 'cancelled', label: 'Cancelled', count: Array.isArray(reservations) ? reservations.filter(r => r.status === 'cancelled').length : 0 }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Reservations List */}
        <div className="space-y-4">
          {filteredReservations.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No reservations found</h3>
              <p className="text-gray-600">
                {activeTab === 'pending' 
                  ? "You don't have any pending reservations."
                  : `You don't have any ${activeTab} reservations.`
                }
              </p>
            </div>
          ) : (
            filteredReservations.map(reservation => (
              <div key={reservation.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{reservation.food_listing?.image_emoji || '🍽️'}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {reservation.food_listing?.name || 'Food Item'}
                      </h3>
                      <p className="text-gray-600">
                        Reserved by: {reservation.seeker_name || 'Unknown Customer'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(reservation.status)}`}>
                      {getStatusIcon(reservation.status)}
                      <span>{reservation.status?.charAt(0).toUpperCase() + reservation.status?.slice(1)}</span>
                    </span>
                    <button
                      onClick={() => {
                        setSelectedReservation(reservation);
                        setShowDetails(true);
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Pickup Date</p>
                      <p className="font-medium text-gray-800">
                        {formatDate(reservation.food_listing?.pickup_date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Pickup Time</p>
                      <p className="font-medium text-gray-800">
                        {reservation.food_listing?.pickup_window_start} - {reservation.food_listing?.pickup_window_end}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Quantity</p>
                      <p className="font-medium text-gray-800">
                        {reservation.quantity_reserved} item{reservation.quantity_reserved > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium text-gray-800">
                        {reservation.food_listing?.location}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Customer Contact Information */}
                {reservation.seeker && (
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Customer Contact Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Name</p>
                          <p className="font-medium text-gray-800">
                            {reservation.seeker.first_name} {reservation.seeker.last_name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="font-medium text-gray-800">
                            {reservation.seeker_phone || 'Not provided'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium text-gray-800">
                            {reservation.seeker_email || 'Not provided'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Location</p>
                          <p className="font-medium text-gray-800">
                            {reservation.seeker.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Special Instructions */}
                {reservation.special_instructions && (
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Special Instructions</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {reservation.special_instructions}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex flex-wrap gap-2">
                    {reservation.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateReservationStatus(reservation.id, 'confirmed')}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm flex items-center space-x-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Confirm</span>
                        </button>
                        <button
                          onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm flex items-center space-x-2"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>
                      </>
                    )}
                    {reservation.status === 'confirmed' && (
                      <button
                        onClick={() => updateReservationStatus(reservation.id, 'completed')}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center space-x-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Mark as Picked Up</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        // This would open email client or send email
                        window.location.href = `mailto:${reservation.seeker_email}?subject=KindBite Reservation - ${reservation.food_listing?.name}`;
                      }}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm flex items-center space-x-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Contact Customer</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Reservation Details Modal */}
      {showDetails && selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Reservation Details</h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              {/* Detailed reservation information would go here */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800">Food Item</h3>
                  <p className="text-gray-600">{selectedReservation.food_listing?.name}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Customer</h3>
                  <p className="text-gray-600">
                    {selectedReservation.seeker_name}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Contact</h3>
                  <p className="text-gray-600">{selectedReservation.seeker_email}</p>
                  <p className="text-gray-600">{selectedReservation.seeker_phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderReservationsView;
