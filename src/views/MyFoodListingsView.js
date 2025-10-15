import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Calendar, MapPin, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import foodService from '../services/foodService';
import apiService from '../services/apiService';

const MyFoodListingsView = ({ onDeleteFood }) => {
  const { user } = useAuth();
  const toast = useToast();
  const [foodListings, setFoodListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // all, active, expired

  useEffect(() => {
    loadFoodListings();
    
    // Listen for refresh events from food management
    const handleRefresh = () => {
      loadFoodListings();
    };
    
    window.addEventListener('refreshMyFoodListings', handleRefresh);
    
    return () => {
      window.removeEventListener('refreshMyFoodListings', handleRefresh);
    };
  }, []);

  const loadFoodListings = async () => {
    try {
      setIsLoading(true);
      
      // Check if user is authenticated
      if (!user) {
        toast.error('You must be logged in to view your food listings');
        return;
      }
      
      // Check if we have a valid token
      const token = localStorage.getItem('kindbite_access_token');
      if (!token) {
        toast.error('Authentication token not found. Please login again.');
        return;
      }
      
      try {
        const data = await foodService.getMyFoodListings();
        console.log('My food listings data received:', data);
        // Ensure data is an array
        if (Array.isArray(data)) {
          setFoodListings(data);
        } else if (data && Array.isArray(data.results)) {
          setFoodListings(data.results);
        } else {
          console.log('No food listings data found, setting empty array');
          setFoodListings([]);
        }
      } catch (listingsError) {
        // If listings load fails with 403, try refreshing token and retry
        if (listingsError.status === 403) {
          console.log('Food listings load failed with 403, attempting token refresh...');
          const refreshSuccess = await apiService.refreshToken();
          if (refreshSuccess) {
            console.log('Token refreshed, retrying food listings load...');
            const retryData = await foodService.getMyFoodListings();
            console.log('Retry food listings data received:', retryData);
            // Ensure retry data is an array
            if (Array.isArray(retryData)) {
              setFoodListings(retryData);
            } else if (retryData && Array.isArray(retryData.results)) {
              setFoodListings(retryData.results);
            } else {
              console.log('No retry food listings data found, setting empty array');
              setFoodListings([]);
            }
          } else {
            throw new Error('Authentication failed. Please login again.');
          }
        } else {
          throw listingsError;
        }
      }
    } catch (error) {
      console.error('Error loading food listings:', error);
      if (error.status === 403) {
        toast.error('Authentication failed. Please login again.');
      } else {
        toast.error('Failed to load food listings');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'reserved': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'collected': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const filteredListings = Array.isArray(foodListings) ? foodListings.filter(listing => {
    switch (activeTab) {
      case 'active':
        return ['available', 'reserved'].includes(listing.status);
      case 'expired':
        return ['expired', 'collected'].includes(listing.status);
      default:
        return true;
    }
  }) : [];

  const handleDeleteListing = async (listingId) => {
    if (window.confirm('Are you sure you want to delete this food listing?')) {
      try {
        // Use the prop function which handles both API call and state updates
        await onDeleteFood(listingId);
        // The parent component will handle the refresh via the event system
      } catch (error) {
        console.error('Error deleting food listing:', error);
        toast.error('Failed to delete food listing. Please try again.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-24">
        <div className="p-4 lg:p-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            <p className="ml-3 text-gray-600">Loading your food listings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-24">
      <div className="p-4 lg:p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Calendar className="w-8 h-8 text-green-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">My Food Listings</h1>
                <p className="text-gray-600">Manage your food listings and track their status</p>
              </div>
            </div>
            <button
              onClick={() => {
                // This will trigger the food management modal
                window.dispatchEvent(new CustomEvent('openFoodManagement'));
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Add New Listing</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
            {[
              { id: 'all', label: 'All Listings', count: Array.isArray(foodListings) ? foodListings.length : 0 },
              { id: 'active', label: 'Active', count: Array.isArray(foodListings) ? foodListings.filter(l => ['available', 'reserved'].includes(l.status)).length : 0 },
              { id: 'expired', label: 'Expired', count: Array.isArray(foodListings) ? foodListings.filter(l => ['expired', 'collected'].includes(l.status)).length : 0 }
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

          {/* Food Listings */}
          {filteredListings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar size={64} className="text-gray-300 mx-auto mb-4" />
              <p className="text-xl font-semibold text-gray-700 mb-2">No food listings found</p>
              <p className="text-gray-500 mb-6">
                {activeTab === 'all' 
                  ? "You haven't created any food listings yet."
                  : `You don't have any ${activeTab} food listings.`
                }
              </p>
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('openFoodManagement'));
                }}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Create Your First Listing
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map(listing => (
                <div key={listing.id} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">{listing.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(listing.status)}`}>
                      {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{listing.description}</p>
                  
                  <div className="space-y-2 text-sm text-gray-700 mb-4">
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-2 text-green-500" />
                      <span>{listing.location || 'Location not specified'}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock size={16} className="mr-2 text-green-500" />
                      <span>Expires: {formatDate(listing.expiry_date)}</span>
                    </div>
                    <div className="flex items-center">
                      <span>Quantity: {listing.quantity}</span>
                    </div>
                    <div className="flex items-center">
                      <span>Price: ${listing.price || 'Free'}</span>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      <Eye size={16} />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteListing(listing.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyFoodListingsView;


