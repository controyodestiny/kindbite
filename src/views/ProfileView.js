import React, { useState } from 'react';
import { User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ProfileView = ({ userPoints }) => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  
  const impactData = {
    today: { meals: 12, co2: 8.4, kindcoins: 245, water: 125, packaging: 1.2, foodMiles: 0.3, treesEquiv: 2, carKmEquiv: 35 },
    week: { meals: 45, co2: 32.1, kindcoins: 890, water: 485, packaging: 4.8, foodMiles: 1.2, treesEquiv: 7, carKmEquiv: 134 },
    month: { meals: 156, co2: 125.6, kindcoins: 3240, water: 1845, packaging: 18.2, foodMiles: 4.8, treesEquiv: 28, carKmEquiv: 524 },
    year: { meals: 1840, co2: 1456.8, kindcoins: 38750, water: 22145, packaging: 218.6, foodMiles: 58.2, treesEquiv: 325, carKmEquiv: 6089 }
  };

  const currentData = impactData[selectedPeriod];
  const periodLabels = { today: 'Today', week: 'This Week', month: 'This Month', year: 'This Year' };

  return (
    <div>
      <div className="p-4 space-y-6 lg:p-6 lg:space-y-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 lg:w-32 lg:h-32">
              <User size={40} className="text-green-600 lg:w-14 lg:h-14" />
            </div>
            <h2 className="font-semibold text-gray-800 text-xl lg:text-2xl">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-gray-600 text-sm lg:text-lg">{user?.location}</p>
            {user?.businessName && (
              <p className="text-blue-600 mt-1 text-sm lg:text-lg">{user.businessName}</p>
            )}
            <div className="flex items-center justify-center space-x-2 mt-2">
              <span className="text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm lg:text-base lg:px-4 lg:py-2">
                Active Community Member
              </span>
              <span className="text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full text-sm lg:text-base lg:px-4 lg:py-2">
                🌱 Eco Warrior
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-semibold text-gray-800 mb-4 text-center lg:text-lg">
            Your Environmental Impact
          </h3>
          <div className="grid grid-cols-4 gap-2 mb-6 lg:gap-4">
            {Object.entries(periodLabels).map(([key, label]) => (
              <button 
                key={key} 
                onClick={() => setSelectedPeriod(key)} 
                className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors lg:text-sm lg:py-3 lg:px-4 ${
                  selectedPeriod === key 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3 text-center lg:text-lg">
              {periodLabels[selectedPeriod]} Impact
            </h4>
            <div className="grid grid-cols-3 gap-4 text-center mb-4 lg:gap-6">
              <div>
                <div className="font-bold text-green-600 text-xl lg:text-2xl">
                  {currentData.meals}
                </div>
                <div className="text-gray-600 text-xs lg:text-sm">Meals Saved</div>
              </div>
              <div>
                <div className="font-bold text-blue-600 text-xl lg:text-2xl">
                  {currentData.co2}kg
                </div>
                <div className="text-gray-600 text-xs lg:text-sm">CO₂ Prevented</div>
              </div>
              <div>
                <div className="font-bold text-purple-600 text-xl lg:text-2xl">
                  {currentData.kindcoins}
                </div>
                <div className="text-gray-600 text-xs lg:text-sm">KindCoins</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
