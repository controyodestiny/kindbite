import React, { useState, useMemo } from 'react';
import { Search, Filter, MapPin, Clock, Star, SortAsc, SortDesc, Heart, Zap } from 'lucide-react';
import FoodCard from '../components/ui/FoodCard';

const SearchView = ({ foodListings = [], onOpenFoodModal, onViewChange, onLikeToggle }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('distance');
  const [sortOrder, setSortOrder] = useState('asc');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [maxDistance, setMaxDistance] = useState(10);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleFoodSelect = (food) => {
    if (onOpenFoodModal && food) {
      onOpenFoodModal(food);
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
        (food.restaurant && typeof food.restaurant === 'string' && food.restaurant.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (food.description && typeof food.description === 'string' && food.description.toLowerCase().includes(searchTerm.toLowerCase()));

      // Advanced filter matching
      let matchesFilter = true;
      try {
        switch (activeFilter) {
          case 'vegetarian':
            matchesFilter = food.dietary && Array.isArray(food.dietary) && food.dietary.includes('Vegetarian');
            break;
          case 'halal':
            matchesFilter = food.dietary && Array.isArray(food.dietary) && food.dietary.includes('Halal');
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
            matchesFilter = food.discountedPrice === 0 || food.discountedPrice === '0';
            break;
          case 'under-1000':
            matchesFilter = food.discountedPrice && food.discountedPrice <= 1000;
            break;
          case 'high-rated':
            matchesFilter = food.rating && parseFloat(food.rating) >= 4.0;
            break;
          default:
            matchesFilter = true;
        }
      } catch (error) {
        console.warn('Error processing filter for food item:', food, error);
        matchesFilter = false;
      }

      // Price range filter
      const price = food.discountedPrice || 0;
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
            aValue = a.discountedPrice || 0;
            bValue = b.discountedPrice || 0;
            break;
          case 'rating':
            aValue = a.rating ? parseFloat(a.rating) : 0;
            bValue = b.rating ? parseFloat(b.rating) : 0;
            break;
          case 'co2-saved':
            aValue = a.co2Saved || 0;
            bValue = b.co2Saved || 0;
            break;
          case 'pickup-time':
            aValue = a.pickupWindow ? new Date().getTime() : 999999999999;
            bValue = b.pickupWindow ? new Date().getTime() : 999999999999;
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
    { id: 'vegetarian', label: 'Vegetarian', icon: '🥬', count: safeFoodListings.filter(f => f?.dietary?.includes('Vegetarian')).length },
    { id: 'halal', label: 'Halal', icon: '☪️', count: safeFoodListings.filter(f => f?.dietary?.includes('Halal')).length },
    { id: 'near-me', label: 'Near Me', icon: '📍', count: safeFoodListings.filter(f => f?.distance && parseFloat(f.distance.match(/(\d+(?:\.\d+)?)/)?.[1] || 999) <= maxDistance).length },
    { id: 'free', label: 'Free', icon: '🎁', count: safeFoodListings.filter(f => f?.discountedPrice === 0).length },
    { id: 'under-1000', label: 'Under 1000', icon: '💰', count: safeFoodListings.filter(f => f?.discountedPrice && f.discountedPrice <= 1000).length },
    { id: 'high-rated', label: 'Top Rated', icon: '⭐', count: safeFoodListings.filter(f => f?.rating && parseFloat(f.rating) >= 4.0).length }
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
        free: filteredAndSortedFoods.filter(f => f && (f.discountedPrice === 0 || f.discountedPrice === '0')).length,
        vegetarian: filteredAndSortedFoods.filter(f => f && f.dietary && Array.isArray(f.dietary) && f.dietary.includes('Vegetarian')).length,
        topRated: filteredAndSortedFoods.filter(f => f && f.rating && !isNaN(parseFloat(f.rating)) && parseFloat(f.rating) >= 4).length,
        avgPrice: filteredAndSortedFoods.length > 0 ? 
          Math.round(filteredAndSortedFoods.reduce((sum, f) => sum + (f.discountedPrice || 0), 0) / filteredAndSortedFoods.length) : 0,
        totalCO2Saved: filteredAndSortedFoods.reduce((sum, f) => sum + (f.co2Saved || 0), 0)
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
            Find Your Perfect Meal
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
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
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

          {/* Food Listings */}
          {filteredAndSortedFoods.length > 0 ? (
            <div className="space-y-4">
              {filteredAndSortedFoods.map((food, index) => (
                <FoodCard 
                  key={food?.id || `food-${index}`} 
                  food={food} 
                  onSelect={handleFoodSelect}
                  onLikeToggle={onLikeToggle}
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
