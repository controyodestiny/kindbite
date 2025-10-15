import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, MapPin, Clock, Star, SortAsc, SortDesc, Heart, Zap } from 'lucide-react';
import FoodCard from '../components/ui/FoodCard';

const SearchView = ({ 
  foodListings = [], 
  onFoodSelect, 
  onViewChange, 
  loading = false,
  error = null,
  onRefresh,
  title = "Search Food" 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('distance');
  const [sortOrder, setSortOrder] = useState('asc');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [maxDistance, setMaxDistance] = useState(10);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Listen for refresh events from reservation modal
  useEffect(() => {
    const handleRefresh = () => {
      if (onRefresh) {
        onRefresh();
      }
    };

    window.addEventListener('refreshFoodListings', handleRefresh);
    return () => window.removeEventListener('refreshFoodListings', handleRefresh);
  }, [onRefresh]);

  const handleFoodSelect = (food) => {
    if (onFoodSelect && food) {
      onFoodSelect(food);
    }
  };

  // Enhanced safety checks - ensure foodListings is an array and handle edge cases
  const safeFoodListings = Array.isArray(foodListings) ? foodListings : [];
  
  // Advanced filtering and sorting with real functionality
  const filteredAndSortedFoods = useMemo(() => {
    let filtered = safeFoodListings.filter(food => {
      // Skip invalid food objects
      if (!food || typeof food !== 'object') {
        return false;
      }
      
      // Search matching with null checks
      const matchesSearch = !searchTerm || 
        (food.name && typeof food.name === 'string' && food.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (food.restaurant_name && typeof food.restaurant_name === 'string' && food.restaurant_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (food.restaurant && typeof food.restaurant === 'string' && food.restaurant.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (food.description && typeof food.description === 'string' && food.description.toLowerCase().includes(searchTerm.toLowerCase()));

      // Advanced filter matching
      let matchesFilter = true;
      try {
        switch (activeFilter) {
          case 'vegetarian':
            matchesFilter = (food.dietary_info && Array.isArray(food.dietary_info) && food.dietary_info.includes('Vegetarian')) ||
                           (food.dietary && Array.isArray(food.dietary) && food.dietary.includes('Vegetarian'));
            break;
          case 'halal':
            matchesFilter = (food.dietary_info && Array.isArray(food.dietary_info) && food.dietary_info.includes('Halal')) ||
                           (food.dietary && Array.isArray(food.dietary) && food.dietary.includes('Halal'));
            break;
          case 'vegan':
            matchesFilter = (food.dietary_info && Array.isArray(food.dietary_info) && food.dietary_info.includes('Vegan')) ||
                           (food.dietary && Array.isArray(food.dietary) && food.dietary.includes('Vegan'));
            break;
          case 'gluten-free':
            matchesFilter = (food.dietary_info && Array.isArray(food.dietary_info) && food.dietary_info.includes('Gluten-Free')) ||
                           (food.dietary && Array.isArray(food.dietary) && food.dietary.includes('Gluten-Free'));
            break;
          case 'near-me':
            if (food.distance && typeof food.distance === 'string') {
              const distanceMatch = food.distance.match(/(\d+(?:\.\d+)?)\s*km/);
              matchesFilter = distanceMatch && parseFloat(distanceMatch[1]) <= maxDistance;
            } else {
              matchesFilter = false;
            }
            break;
          case 'free':
            const discountedPrice = food.discounted_price || food.discountedPrice || 0;
            matchesFilter = discountedPrice === 0 || discountedPrice === '0' || discountedPrice === '0.00' || parseFloat(discountedPrice) === 0;
            break;
          case 'under-1000':
            const price1 = food.discounted_price || food.discountedPrice || 0;
            matchesFilter = price1 && price1 <= 1000;
            break;
          case 'under-5000':
            const price2 = food.discounted_price || food.discountedPrice || 0;
            matchesFilter = price2 && price2 <= 5000;
            break;
          case 'high-rated':
            matchesFilter = food.rating && parseFloat(food.rating) >= 4.0;
            break;
          case 'restaurant':
            matchesFilter = food.provider_type === 'restaurant' || food.provider === 'restaurant';
            break;
          case 'home-kitchen':
            matchesFilter = food.provider_type === 'home' || food.provider === 'home';
            break;
          case 'bakery':
            matchesFilter = food.provider_type === 'bakery' || food.provider === 'bakery';
            break;
          case 'supermarket':
            matchesFilter = food.provider_type === 'supermarket' || food.provider === 'supermarket';
            break;
          default:
            matchesFilter = true;
        }
      } catch (error) {
        console.warn('Error processing filter for food item:', food, error);
        matchesFilter = false;
      }

      // Price range filter
      const price = food.discounted_price || food.discountedPrice || 0;
      const matchesPrice = price >= priceRange[0] && price <= priceRange[1];

      return matchesSearch && matchesFilter && matchesPrice;
    });

    // Smart sorting with real logic
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      try {
        switch (sortBy) {
          case 'distance':
            aValue = a.distance ? parseFloat(a.distance.match(/(\d+(?:\.\d+)?)/)?.[1] || 999) : 999;
            bValue = b.distance ? parseFloat(b.distance.match(/(\d+(?:\.\d+)?)/)?.[1] || 999) : 999;
            break;
          case 'price':
            aValue = a.discounted_price || a.discountedPrice || 0;
            bValue = b.discounted_price || b.discountedPrice || 0;
            break;
          case 'rating':
            aValue = a.rating ? parseFloat(a.rating) : 0;
            bValue = b.rating ? parseFloat(b.rating) : 0;
            break;
          case 'co2-saved':
            aValue = a.co2_saved || a.co2Saved || 0;
            bValue = b.co2_saved || b.co2Saved || 0;
            break;
          case 'pickup-time':
            aValue = a.pickup_window || a.pickupWindow ? new Date().getTime() : 999999999999;
            bValue = b.pickup_window || b.pickupWindow ? new Date().getTime() : 999999999999;
            break;
          default:
            aValue = 0;
            bValue = 0;
        }
      } catch (error) {
        aValue = 0;
        bValue = 0;
      }

      if (sortOrder === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });

    return filtered;
  }, [safeFoodListings, searchTerm, activeFilter, sortBy, sortOrder, priceRange, maxDistance]);

  const filters = [
    { id: 'all', label: 'All', icon: '🍽️', count: safeFoodListings.length },
    { id: 'free', label: 'Free', icon: '🎁', count: safeFoodListings.filter(f => {
      const price = f?.discounted_price || f?.discountedPrice || 0;
      return price === 0 || price === '0' || price === '0.00' || parseFloat(price) === 0;
    }).length, highlight: true },
    { id: 'vegetarian', label: 'Vegetarian', icon: '🥬', count: safeFoodListings.filter(f => f?.dietary_info?.includes('Vegetarian') || f?.dietary?.includes('Vegetarian')).length },
    { id: 'halal', label: 'Halal', icon: '☪️', count: safeFoodListings.filter(f => f?.dietary_info?.includes('Halal') || f?.dietary?.includes('Halal')).length },
    { id: 'vegan', label: 'Vegan', icon: '🌱', count: safeFoodListings.filter(f => f?.dietary_info?.includes('Vegan') || f?.dietary?.includes('Vegan')).length },
    { id: 'gluten-free', label: 'Gluten-Free', icon: '🌾', count: safeFoodListings.filter(f => f?.dietary_info?.includes('Gluten-Free') || f?.dietary?.includes('Gluten-Free')).length },
    { id: 'near-me', label: 'Near Me', icon: '📍', count: safeFoodListings.filter(f => f?.distance && parseFloat(f.distance.match(/(\d+(?:\.\d+)?)/)?.[1] || 999) <= maxDistance).length },
    { id: 'under-1000', label: 'Under 1000', icon: '💰', count: safeFoodListings.filter(f => (f?.discounted_price || f?.discountedPrice || 0) <= 1000).length },
    { id: 'under-5000', label: 'Under 5000', icon: '💵', count: safeFoodListings.filter(f => (f?.discounted_price || f?.discountedPrice || 0) <= 5000).length },
    { id: 'high-rated', label: 'Top Rated', icon: '⭐', count: safeFoodListings.filter(f => f?.rating && parseFloat(f.rating) >= 4.0).length },
    { id: 'restaurant', label: 'Restaurants', icon: '🏪', count: safeFoodListings.filter(f => f?.provider_type === 'restaurant' || f?.provider === 'restaurant').length },
    { id: 'home-kitchen', label: 'Home Kitchens', icon: '🏠', count: safeFoodListings.filter(f => f?.provider_type === 'home' || f?.provider === 'home').length },
    { id: 'bakery', label: 'Bakeries', icon: '🥖', count: safeFoodListings.filter(f => f?.provider_type === 'bakery' || f?.provider === 'bakery').length },
    { id: 'supermarket', label: 'Supermarkets', icon: '🛒', count: safeFoodListings.filter(f => f?.provider_type === 'supermarket' || f?.provider === 'supermarket').length }
  ];

  const sortOptions = [
    { id: 'distance', label: 'Distance', icon: MapPin },
    { id: 'price', label: 'Price', icon: Zap },
    { id: 'rating', label: 'Rating', icon: Star },
    { id: 'co2-saved', label: 'CO₂ Saved', icon: Heart },
    { id: 'pickup-time', label: 'Pickup Time', icon: Clock }
  ];

  // Smart search suggestions
  const searchSuggestions = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) return [];
    
    const suggestions = new Set();
    safeFoodListings.forEach(food => {
      if (food?.name?.toLowerCase().includes(searchTerm.toLowerCase())) {
        suggestions.add(food.name);
      }
      if (food?.restaurant?.toLowerCase().includes(searchTerm.toLowerCase())) {
        suggestions.add(food.restaurant);
      }
    });
    
    return Array.from(suggestions).slice(0, 5);
  }, [searchTerm, safeFoodListings]);

  // Safe statistics calculation
  const getStats = () => {
    try {
      return {
        total: filteredAndSortedFoods.length,
        free: filteredAndSortedFoods.filter(f => {
          if (!f) return false;
          const price = f.discounted_price || f.discountedPrice || 0;
          return price === 0 || price === '0' || price === '0.00' || parseFloat(price) === 0;
        }).length,
        vegetarian: filteredAndSortedFoods.filter(f => f && ((f.dietary_info && Array.isArray(f.dietary_info) && f.dietary_info.includes('Vegetarian')) || (f.dietary && Array.isArray(f.dietary) && f.dietary.includes('Vegetarian')))).length,
        topRated: filteredAndSortedFoods.filter(f => f && f.rating && !isNaN(parseFloat(f.rating)) && parseFloat(f.rating) >= 4).length,
        avgPrice: filteredAndSortedFoods.length > 0 ? 
          Math.round(filteredAndSortedFoods.reduce((sum, f) => sum + (f.discounted_price || f.discountedPrice || 0), 0) / filteredAndSortedFoods.length) : 0,
        totalCO2Saved: filteredAndSortedFoods.reduce((sum, f) => sum + (f.co2_saved || f.co2Saved || 0), 0)
      };
    } catch (error) {
      console.warn('Error calculating stats:', error);
      return { total: 0, free: 0, vegetarian: 0, topRated: 0, avgPrice: 0, totalCO2Saved: 0 };
    }
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 pt-20 pb-24">
      <div className="p-4 lg:p-6 space-y-6">
        {/* Search Header */}
        <div className="card-premium p-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6 text-center">
            {title}
          </h1>
          
          {/* Advanced Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 lg:w-6 lg:h-6" />
            <input
              type="text"
              placeholder="Search for food, restaurants, or cuisines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl text-lg focus:border-green-500 focus:outline-none transition-all duration-300 hover:border-gray-300 lg:py-5 lg:text-xl"
            />
            
            {/* Search Suggestions */}
            {searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border-2 border-gray-200 rounded-xl mt-2 shadow-lg z-10">
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchTerm(suggestion)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                  >
                    <Search size={16} className="inline mr-2 text-gray-400" />
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Advanced Filters Toggle */}
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center space-x-2 px-4 py-2 text-green-600 hover:text-green-700 font-medium transition-colors duration-300"
            >
              <Filter size={20} />
              <span>{showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters</span>
            </button>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range (UGX)</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 10000])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Max Distance */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Distance (km)</label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-center text-sm text-gray-600">{maxDistance} km</div>
              </div>

              {/* Sort Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <div className="flex space-x-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  >
                    {sortOptions.map(option => (
                      <option key={option.id} value={option.id}>{option.label}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors duration-200"
                  >
                    {sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  activeFilter === filter.id
                    ? 'bg-green-500 text-white'
                    : filter.highlight
                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-2 border-yellow-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-1">{filter.icon}</span>
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              {stats.total} {stats.total === 1 ? 'Result' : 'Results'} Found
            </h2>
            
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-green-600 hover:text-green-700 font-medium text-sm hover:underline transition-colors duration-300"
              >
                Clear Search
              </button>
            )}
          </div>

          {/* Free Foods Highlight Section */}
          {stats.free > 0 && activeFilter !== 'free' && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">🎁</div>
                  <div>
                    <h3 className="text-lg font-bold text-yellow-800">
                      {stats.free} Free Food{stats.free !== 1 ? 's' : ''} Available!
                    </h3>
                    <p className="text-yellow-700 text-sm">
                      Don't miss out on completely free food items
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveFilter('free')}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
                >
                  View Free Foods
                </button>
              </div>
            </div>
          )}

          {/* Food Listings */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading food listings...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">❌</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Error loading food</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <button 
                onClick={onRefresh}
                className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          ) : filteredAndSortedFoods.length > 0 ? (
            <div className="space-y-4">
              {filteredAndSortedFoods.map((food, index) => (
                <FoodCard 
                  key={food?.id || `food-${index}`} 
                  food={food} 
                  onClick={handleFoodSelect}
                />
              ))}
            </div>
          ) : (
            <div className="card-premium p-12 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {searchTerm ? 'No results found' : 'No food available'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? `Try adjusting your search terms or filters`
                  : 'Check back later or search for food in other areas!'
                }
              </p>
              
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 mr-3"
                >
                  Clear Search
                </button>
              )}
              
              <button 
                onClick={() => onViewChange && onViewChange('home')}
                className="bg-gradient-to-r from-gray-500 to-slate-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Go Home
              </button>
            </div>
          )}
        </div>

        {/* Enhanced Statistics */}
        {filteredAndSortedFoods.length > 0 && (
          <div className="card-premium p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Search Summary</h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Results</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.free}</div>
                <div className="text-sm text-gray-600">Free Meals</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{stats.vegetarian}</div>
                <div className="text-sm text-gray-600">Vegetarian</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{stats.topRated}</div>
                <div className="text-sm text-gray-600">Top Rated</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-indigo-600">UGX {stats.avgPrice}</div>
                <div className="text-sm text-gray-600">Avg Price</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600">{stats.totalCO2Saved}kg</div>
                <div className="text-sm text-gray-600">CO₂ Saved</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchView;
