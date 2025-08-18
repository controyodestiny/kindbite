import React from 'react';
import { Search, Filter } from 'lucide-react';
import FoodCard from '../components/ui/FoodCard';

const SearchView = ({ 
  searchTerm, 
  onSearchChange, 
  activeFilter, 
  onFilterChange, 
  foodListings, 
  onFoodSelect 
}) => {
  const filteredFoods = foodListings.filter(food => {
    const matchesSearch = searchTerm === '' || 
      food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.restaurant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeFilter === 'All') return matchesSearch;
    if (activeFilter === 'Free') return matchesSearch && food.discountedPrice === 0;
    if (activeFilter === 'Restaurants') return matchesSearch && food.provider === 'restaurant';
    if (activeFilter === 'Home Kitchens') return matchesSearch && food.provider === 'home';
    if (activeFilter === 'Food Factories') return matchesSearch && food.provider === 'factory';
    if (activeFilter === 'Supermarkets') return matchesSearch && food.provider === 'supermarket';
    if (activeFilter === 'Retail Shops') return matchesSearch && food.provider === 'retail';
    if (activeFilter === 'Vegetarian') return matchesSearch && food.dietary.some(tag => tag.toLowerCase().includes('vegetarian'));
    if (activeFilter === 'Halal') return matchesSearch && food.dietary.some(tag => tag.toLowerCase().includes('halal'));
    if (activeFilter === 'Near Me') return matchesSearch && parseFloat(food.distance) < 1;
    
    return matchesSearch;
  });

  const filters = [
    'All', 'Free', 'Restaurants', 'Home Kitchens', 'Food Factories', 
    'Supermarkets', 'Retail Shops', 'Vegetarian', 'Halal', 'Near Me'
  ];

  return (
    <div>
      <div className="p-4 lg:p-6">
        <div className="flex space-x-2 mb-4 lg:mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4 lg:w-5 lg:h-5" />
            <input 
              type="text" 
              placeholder="Search for food..."
              value={searchTerm}
              onChange={onSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 lg:py-3 lg:text-base" 
            />
          </div>
          <button className="bg-gray-100 p-2 rounded-lg hover:bg-gray-200 lg:p-3">
            <Filter size={20} className="text-gray-600 lg:w-6 lg:h-6" />
          </button>
        </div>
        
        <div className="flex space-x-2 mb-6 overflow-x-auto lg:mb-8 lg:space-x-3">
          {filters.map((filter, index) => (
            <button 
              key={index} 
              onClick={() => onFilterChange(filter)} 
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors lg:px-5 lg:py-2 lg:text-base ${
                activeFilter === filter 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        
        {filteredFoods.length > 0 ? (
          <div className="space-y-4 lg:space-y-6">
            {filteredFoods.map(food => (
              <FoodCard 
                key={food.id} 
                food={food} 
                onSelect={onFoodSelect} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 lg:py-12">
            <Search size={48} className="mx-auto mb-4 text-gray-300 lg:w-16 lg:h-16" />
            <p className="lg:text-lg">No food found</p>
            <p className="text-sm lg:text-base">
              {searchTerm ? `No results for "${searchTerm}"` : `No results for "${activeFilter}"`}
            </p>
            <p className="text-sm lg:text-base">
              Try a different search term or filter!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchView;
