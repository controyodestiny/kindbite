import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, User, Phone, MessageCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import foodService from '../services/foodService';
import apiService from '../services/apiService';

const ReservationsView = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming'); // upcoming, completed, cancelled
  const [lastUpdateTime, setLastUpdateTime] = useState(null);

  useEffect(() => {
    loadReservations();
    
    // Listen for reservation updates
    const handleReservationUpdate = () => {
      loadReservations();
    };
    
    window.addEventListener('reservationCreated', handleReservationUpdate);
    window.addEventListener('reservationUpdated', handleReservationUpdate);
    window.addEventListener('reservationStatusChanged', handleReservationUpdate);
    
    return () => {
      window.removeEventListener('reservationCreated', handleReservationUpdate);
      window.removeEventListener('reservationUpdated', handleReservationUpdate);
      window.removeEventListener('reservationStatusChanged', handleReservationUpdate);
    };
  }, []);

  const loadReservations = async () => {
    try {
      setIsLoading(true);
      
      // Check if user is authenticated
      if (!user) {
        toast.error('You must be logged in to view reservations');
        return;
      }
      
      // Check if we have a valid token
      const token = localStorage.getItem('kindbite_access_token');
      if (!token) {
        toast.error('Authentication token not found. Please login again.');
        return;
      }
      
      try {
        const data = await foodService.getUserReservations();
        console.log('Reservations data received:', data);
        // Handle different response formats
        if (Array.isArray(data)) {
          setReservations(data);
        } else if (data && Array.isArray(data.results)) {
          console.log('First reservation details:', data.results[0]);
          setReservations(data.results);
        } else if (data && Array.isArray(data.reservations)) {
          console.log('First reservation details:', data.reservations[0]);
          setReservations(data.reservations);
        } else {
          console.log('No reservations data found, setting empty array');
          setReservations([]);
        }
        
        setLastUpdateTime(new Date());
      } catch (reservationError) {
        // If reservations load fails with 403, try refreshing token and retry
        if (reservationError.status === 403) {
          console.log('Reservations load failed with 403, attempting token refresh...');
          const refreshSuccess = await apiService.refreshToken();
          if (refreshSuccess) {
            console.log('Token refreshed, retrying reservations load...');
            const retryData = await foodService.getUserReservations();
            console.log('Retry reservations data received:', retryData);
            // Handle different response formats for retry
            if (Array.isArray(retryData)) {
              setReservations(retryData);
            } else if (retryData && Array.isArray(retryData.results)) {
              setReservations(retryData.results);
            } else if (retryData && Array.isArray(retryData.reservations)) {
              setReservations(retryData.reservations);
            } else {
              console.log('No retry reservations data found, setting empty array');
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <span className="w-2 h-2 bg-green-500 rounded-full"></span>;
      case 'pending': return <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>;
      case 'cancelled': return <span className="w-2 h-2 bg-red-500 rounded-full"></span>;
      case 'completed': return <span className="w-2 h-2 bg-blue-500 rounded-full"></span>;
      default: return <span className="w-2 h-2 bg-gray-500 rounded-full"></span>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Not specified';
    try {
      // Handle different time formats
      let time;
      if (timeString.includes('T')) {
        // If it's a full datetime string
        time = new Date(timeString);
      } else if (timeString.includes(':')) {
        // If it's just time like "14:30:00"
        time = new Date(`2000-01-01T${timeString}`);
      } else {
        // If it's a timestamp
        time = new Date(timeString);
      }
      
      if (isNaN(time.getTime())) return 'Invalid Time';
      return time.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Invalid Time';
    }
  };

  const filteredReservations = Array.isArray(reservations) ? reservations.filter(reservation => {
    switch (activeTab) {
      case 'upcoming':
        return ['confirmed', 'pending'].includes(reservation.status);
      case 'completed':
        return reservation.status === 'completed';
      case 'cancelled':
        return reservation.status === 'cancelled';
      default:
        return true;
    }
  }) : [];

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
                <h1 className="text-2xl font-bold text-gray-800">My Reservations</h1>
                <p className="text-gray-600">
                  Manage your food reservations
                  {lastUpdateTime && (
                    <span className="text-xs text-gray-500 ml-2">
                      Last updated: {lastUpdateTime.toLocaleTimeString()}
                    </span>
                  )}
                </p>
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
              { id: 'upcoming', label: 'Upcoming', count: Array.isArray(reservations) ? reservations.filter(r => ['confirmed', 'pending'].includes(r.status)).length : 0 },
              { id: 'completed', label: 'Completed', count: Array.isArray(reservations) ? reservations.filter(r => r.status === 'completed').length : 0 },
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
                {activeTab === 'upcoming' 
                  ? "You don't have any upcoming reservations."
                  : `You don't have any ${activeTab} reservations.`
                }
              </p>
            </div>
          ) : (
            filteredReservations.map(reservation => (
              <div key={reservation.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{reservation.food_listing?.image || '🍽️'}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {reservation.food_listing?.name || 'Food Item'}
                      </h3>
                      <p className="text-gray-600">
                        {reservation.food_listing?.restaurant_name || reservation.food_listing?.provider?.business_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(reservation.status)}`}>
                      {getStatusIcon(reservation.status)}
                      <span>{reservation.status?.charAt(0).toUpperCase() + reservation.status?.slice(1)}</span>
                    </span>
                    {reservation.status === 'pending' && (
                      <span className="text-xs text-gray-500">Waiting for confirmation</span>
                    )}
                    {reservation.status === 'confirmed' && (
                      <span className="text-xs text-green-600">✓ Confirmed by provider</span>
                    )}
                    {reservation.status === 'completed' && (
                      <span className="text-xs text-blue-600">✓ Food picked up</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Pickup Date</p>
                      <p className="font-medium text-gray-800">
                        {formatDate(reservation.food_listing?.pickup_date || reservation.pickup_date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Pickup Time</p>
                      <p className="font-medium text-gray-800">
                        {formatTime(reservation.food_listing?.pickup_window || reservation.pickup_time)}
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

                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Quantity</p>
                      <p className="font-medium text-gray-800">
                        {reservation.quantity_reserved || reservation.quantity || 1} item{(reservation.quantity_reserved || reservation.quantity || 1) > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                {reservation.food_listing?.provider && (
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {reservation.food_listing.provider.phone}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MessageCircle className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {reservation.food_listing.provider.email}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        {reservation.status === 'confirmed' && (
                          <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm">
                            Cancel
                          </button>
                        )}
                        <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm">
                          Contact Provider
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationsView;
