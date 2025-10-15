import React from 'react';
import { MapPin, Leaf, TrendingUp, Award, Users, Search, Globe, Calendar } from 'lucide-react';
import FoodCard from '../components/ui/FoodCard';

const HomeView = ({ foodListings = [], onOpenFoodModal, onViewChange, onLikeToggle, onReserve, userStats, isLoadingStats, user, isLoadingFoods = false }) => {
  const handleFoodSelect = (food) => {
    if (onOpenFoodModal) {
      onOpenFoodModal(food);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-24">
      <div className="p-4 lg:p-6 space-y-6">
        {/* Hero Section - Role Specific */}
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
            {user?.user_role === 'end-user' 
              ? 'Welcome to KindBite' 
              : `Welcome back, ${user?.full_name || user?.first_name || 'Provider'}!`
            }
          </h1>
          <p className="text-gray-600 mb-6 text-lg">
            {user?.user_role === 'end-user' 
              ? 'Discover amazing food while helping the environment and community'
              : 'Manage your food listings and help reduce waste in your community'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {user?.user_role === 'end-user' ? (
              <>
                <button 
                  onClick={() => onViewChange && onViewChange('search')}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200"
                >
                  Find Food Now
                </button>
                <button 
                  onClick={() => onViewChange && onViewChange('community')}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200"
                >
                  Join Community
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => onViewChange && onViewChange('food-management')}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200"
                >
                  Add Food Listing
                </button>
                <button 
                  onClick={() => onViewChange && onViewChange('reservations')}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200"
                >
                  View Reservations
                </button>
              </>
            )}
          </div>
        </div>

        {/* Impact Stats - Role Specific */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {user?.user_role === 'end-user' ? (
            // Food Seeker Stats
            <>
              <div className="bg-white rounded-lg shadow-md p-4 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Leaf className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {userStats?.completed_reservations || 0}
                </div>
                <div className="text-sm text-gray-600">Meals Rescued</div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-4 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {userStats?.total_co2_saved || 0}
                </div>
                <div className="text-sm text-gray-600">CO₂ kg Saved</div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-4 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {userStats?.total_kindcoins_earned || 0}
                </div>
                <div className="text-sm text-gray-600">KindCoins Earned</div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-4 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {userStats?.total_reservations || 0}
                </div>
                <div className="text-sm text-gray-600">Total Reservations</div>
              </div>
            </>
          ) : (
            // Provider Stats
            <>
              <div className="bg-white rounded-lg shadow-md p-4 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Leaf className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {userStats?.active_listings || 0}
                </div>
                <div className="text-sm text-gray-600">Active Listings</div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-4 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {userStats?.total_reservations || 0}
                </div>
                <div className="text-sm text-gray-600">Total Reservations</div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-4 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {userStats?.total_co2_saved || 0}
                </div>
                <div className="text-sm text-gray-600">CO₂ kg Saved</div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-4 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {userStats?.average_rating || 0}★
                </div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
            </>
          )}
        </div>

        {/* Quick Actions - Role Specific */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {user?.user_role === 'end-user' ? (
              // Food Seeker Actions
              <>
                <button 
                  onClick={() => onViewChange && onViewChange('search')}
                  className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200"
                >
                  <Search className="w-8 h-8 text-green-600 mb-2" />
                  <span className="text-sm font-medium text-gray-700">Search Food</span>
                </button>
                
                <button 
                  onClick={() => onViewChange && onViewChange('environment')}
                  className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                >
                  <Leaf className="w-8 h-8 text-blue-600 mb-2" />
                  <span className="text-sm font-medium text-gray-700">Eco Impact</span>
                </button>
                
                <button 
                  onClick={() => onViewChange && onViewChange('reservations')}
                  className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200"
                >
                  <Calendar className="w-8 h-8 text-purple-600 mb-2" />
                  <span className="text-sm font-medium text-gray-700">My Reservations</span>
                </button>
                
                <button 
                  onClick={() => onViewChange && onViewChange('community')}
                  className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors duration-200"
                >
                  <Users className="w-8 h-8 text-orange-600 mb-2" />
                  <span className="text-sm font-medium text-gray-700">Community</span>
                </button>
              </>
            ) : (
              // Provider Actions
              <>
                <button 
                  onClick={() => onViewChange && onViewChange('food-management')}
                  className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200"
                >
                  <Search className="w-8 h-8 text-green-600 mb-2" />
                  <span className="text-sm font-medium text-gray-700">Manage Food</span>
                </button>
                
                <button 
                  onClick={() => onViewChange && onViewChange('reservations')}
                  className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                >
                  <Calendar className="w-8 h-8 text-blue-600 mb-2" />
                  <span className="text-sm font-medium text-gray-700">Reservations</span>
                </button>
                
                <button 
                  onClick={() => onViewChange && onViewChange('environment')}
                  className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200"
                >
                  <Leaf className="w-8 h-8 text-purple-600 mb-2" />
                  <span className="text-sm font-medium text-gray-700">Eco Impact</span>
                </button>
                
                <button 
                  onClick={() => onViewChange && onViewChange('community')}
                  className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors duration-200"
                >
                  <Users className="w-8 h-8 text-orange-600 mb-2" />
                  <span className="text-sm font-medium text-gray-700">Community</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Food Section - Role Specific */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <MapPin className="w-5 h-5 text-green-500 mr-2" />
              {user?.user_role === 'end-user' 
                ? 'Nearby Food Available' 
                : 'Your Food Listings'
              }
              {user?.user_role === 'end-user' && foodListings && foodListings.length > 0 && (
                <span className="ml-2 text-sm font-normal text-gray-600">
                  ({foodListings.filter(f => {
                    const price = f?.discounted_price || f?.discountedPrice || 0;
                    return price === 0 || price === '0' || price === '0.00' || parseFloat(price) === 0;
                  }).length} free)
                </span>
              )}
            </h2>
            <button 
              onClick={() => onViewChange && onViewChange(user?.user_role === 'end-user' ? 'search' : 'food-management')}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              {user?.user_role === 'end-user' ? 'View All →' : 'Manage All →'}
            </button>
          </div>

          {isLoadingFoods ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading food listings...</p>
            </div>
          ) : foodListings && foodListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {foodListings.slice(0, 6).map((food) => (
                <FoodCard
                  key={food.id || Math.random()}
                  food={food}
                  onClick={handleFoodSelect}
                  onLikeToggle={onLikeToggle}
                  onReserve={onReserve}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {user?.user_role === 'end-user' 
                  ? 'No food available nearby' 
                  : 'No food listings yet'
                }
              </h3>
              <p className="text-gray-600 mb-6">
                {user?.user_role === 'end-user' 
                  ? 'Check back later or search for food in other areas'
                  : 'Start by adding your first food listing to help reduce waste'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {user?.user_role === 'end-user' ? (
                  <>
                    <button 
                      onClick={() => onViewChange && onViewChange('search')}
                      className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200"
                    >
                      Search for Food
                    </button>
                    <button 
                      onClick={() => onViewChange && onViewChange('home')}
                      className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors duration-200"
                    >
                      Go Home
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => onViewChange && onViewChange('food-management')}
                      className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200"
                    >
                      Add Food Listing
                    </button>
                    <button 
                      onClick={() => onViewChange && onViewChange('home')}
                      className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors duration-200"
                    >
                      Go Home
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Points - Role Specific */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Your KindCoins</h3>
              <p className="text-gray-600">
                {user?.user_role === 'end-user' 
                  ? 'Earn points by rescuing food and helping the community'
                  : 'Earn points by providing food and helping reduce waste'
                }
              </p>
            </div>
            <div className="text-right">
              {isLoadingStats ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
                  <span className="ml-2 text-gray-600">Loading...</span>
                </div>
              ) : (
                <>
                  <div className="text-3xl font-bold text-green-600">
                    {userStats?.total_kindcoins_earned || user?.kind_coins || 0}
                  </div>
                  <div className="text-sm text-gray-500">Available Points</div>
                </>
              )}
            </div>
          </div>
          <button 
            onClick={() => onViewChange && onViewChange('points')}
            className="w-full mt-4 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors duration-200"
          >
            View Points History
          </button>
        </div>

        {/* Role-specific detailed stats */}
        {user?.user_role === 'end-user' && userStats && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Food Rescue Impact</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {userStats.total_reservations || 0}
                </div>
                <div className="text-sm text-gray-600">Total Reservations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {userStats.completed_reservations || 0}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {userStats.total_co2_saved || 0} kg
                </div>
                <div className="text-sm text-gray-600">CO₂ Saved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {userStats.average_rating || 0}★
                </div>
                <div className="text-sm text-gray-600">Avg Rating</div>
              </div>
            </div>
          </div>
        )}

        {/* Provider detailed stats */}
        {user?.user_role !== 'end-user' && userStats && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Provider Impact</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {userStats.total_listings || 0}
                </div>
                <div className="text-sm text-gray-600">Total Listings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {userStats.active_listings || 0}
                </div>
                <div className="text-sm text-gray-600">Active Listings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {userStats.total_reservations || 0}
                </div>
                <div className="text-sm text-gray-600">Total Reservations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {userStats.average_rating || 0}★
                </div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeView;
