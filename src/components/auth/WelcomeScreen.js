import React from 'react';
import { Users, Heart, Leaf, Award } from 'lucide-react';

const WelcomeScreen = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <div className="text-8xl mb-4">🌍</div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">KindBite</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connecting Hearts, Reducing Waste, Fighting Hunger
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Community Driven</h3>
            <p className="text-gray-600">
              Join a network of restaurants, home kitchens, factories, and volunteers working together to reduce food waste.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Fight Hunger</h3>
            <p className="text-gray-600">
              Help provide affordable meals to those in need while supporting local businesses and reducing waste.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <Leaf className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Save the Planet</h3>
            <p className="text-gray-600">
              Track your environmental impact and earn KindCoins for every meal saved and CO₂ prevented.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-8 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Join Our Ecosystem</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🍽️</span>
              <span>Restaurants</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🏠</span>
              <span>Home Kitchens</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🏭</span>
              <span>Food Factories</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🛒</span>
              <span>Supermarkets</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🏪</span>
              <span>Retail Shops</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🩺</span>
              <span>Food Verifiers</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">✅</span>
              <span>Ambassadors</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">💰</span>
              <span>Donors</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onGetStarted}
            className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Award className="w-6 h-6" />
            <span>Get Started</span>
          </button>
          <button className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition-colors">
            Learn More
          </button>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Already making a difference? <span className="text-green-600 font-semibold">28,456+ items rescued</span> and counting!
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
