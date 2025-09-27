import React from 'react';
import { Leaf, TrendingUp, Globe, Recycle, TreePine, Zap } from 'lucide-react';

const EnvironmentView = ({ onViewChange }) => {
  const environmentalStats = [
    {
      icon: "🌱",
      title: "CO₂ Reduction",
      value: "2.4 kg",
      description: "per food item rescued",
      color: "text-green-600"
    },
    {
      icon: "💧",
      title: "Water Saved",
      value: "25L",
      description: "per meal rescued",
      color: "text-blue-600"
    },
    {
      icon: "🗑️",
      title: "Waste Prevented",
      value: "1.2 kg",
      description: "packaging reduced",
      color: "text-orange-600"
    },
    {
      icon: "🚚",
      title: "Food Miles",
      value: "0.3 km",
      description: "average pickup distance",
      color: "text-purple-600"
    }
  ];

  const environmentalBenefits = [
    {
      icon: "🌍",
      title: "Climate Impact",
      description: "Food waste contributes to 8% of global greenhouse gas emissions. By rescuing food, we're directly reducing methane production in landfills.",
      impact: "Prevents 2.4kg CO₂ per rescued item"
    },
    {
      icon: "💧",
      title: "Water Conservation",
      description: "Producing food requires massive amounts of water. Rescuing food means that water wasn't wasted on food that would have been thrown away.",
      impact: "Saves 25L of water per rescued meal"
    },
    {
      icon: "🌱",
      title: "Land Preservation",
      description: "Less food waste means less agricultural land needed, preserving natural habitats and reducing deforestation.",
      impact: "Reduces agricultural land pressure"
    },
    {
      icon: "♻️",
      title: "Circular Economy",
      description: "KindBite creates a circular food system where surplus becomes opportunity, reducing the need for new production.",
      impact: "Promotes sustainable consumption"
    }
  ];

  const userImpact = {
    totalMeals: 47,
    totalCO2: 112.8,
    totalWater: 1175,
    totalWaste: 56.4,
    rank: "Eco Warrior"
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => onViewChange('home')}
            className="text-green-600 hover:text-green-700"
          >
            ← Back to Home
          </button>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mt-2">Environmental Impact</h1>
        <p className="text-gray-600">See how KindBite is helping save the planet, one meal at a time</p>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 text-center">
        <div className="text-6xl mb-4">🌍</div>
        <h2 className="text-2xl font-bold mb-2">Your Environmental Impact</h2>
        <p className="text-green-100">Every food rescue makes a difference for our planet</p>
      </div>

      {/* Personal Impact Stats */}
      <div className="p-4 lg:p-6">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Leaf className="w-5 h-5 text-green-600 mr-2" />
            Your Impact This Month
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {environmentalStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-sm font-medium text-gray-700">{stat.title}</div>
                <div className="text-xs text-gray-500">{stat.description}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-green-50 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-700 mb-2">🏆 {userImpact.rank}</div>
            <p className="text-green-700">You've rescued {userImpact.totalMeals} meals this month!</p>
          </div>
        </div>

        {/* Environmental Benefits */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Globe className="w-5 h-5 text-blue-600 mr-2" />
            How KindBite Helps the Environment
          </h3>
          <div className="space-y-4">
            {environmentalBenefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl">{benefit.icon}</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1">{benefit.title}</h4>
                  <p className="text-gray-600 text-sm mb-2">{benefit.description}</p>
                  <div className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                    {benefit.impact}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Impact */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 text-purple-600 mr-2" />
            Global Impact Through KindBite
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl mb-2">🌱</div>
              <h4 className="font-semibold text-gray-800 mb-2">Community Impact</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 15,000+ meals rescued monthly</li>
                <li>• 36,000 kg CO₂ prevented</li>
                <li>• 375,000L water saved</li>
                <li>• 18,000 kg waste reduced</li>
              </ul>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-3xl mb-2">♻️</div>
              <h4 className="font-semibold text-gray-800 mb-2">Environmental Goals</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Reduce food waste by 50%</li>
                <li>• Cut CO₂ emissions by 100,000 kg</li>
                <li>• Save 1 million liters of water</li>
                <li>• Create zero-waste communities</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-lg text-center">
          <div className="text-4xl mb-4">🚀</div>
          <h3 className="text-xl font-bold mb-2">Ready to Make a Difference?</h3>
          <p className="text-green-100 mb-4">Every food rescue helps protect our planet</p>
          <button 
            onClick={() => onViewChange('search')}
            className="bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Find Food to Rescue
          </button>
        </div>

        {/* Back to Home Button */}
        <div className="text-center mt-6">
          <button
            onClick={() => onViewChange && onViewChange('home')}
            className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentView; 