import React, { useState } from 'react';
import { Users, Heart, Leaf, Award, ChevronDown } from 'lucide-react';

const WelcomeScreen = ({ onGetStarted, onLogin, onSignup }) => {
  const [openKey, setOpenKey] = useState(null);

  const toggle = (key) => {
    setOpenKey((current) => (current === key ? null : key));
  };

  const ecosystemOptions = [
    {
      key: 'restaurants',
      icon: '🍽️',
      title: 'Restaurants',
      summary: 'List surplus meals, set pickup times, and reduce daily waste.',
      details: [
        'Post discounted surplus meals in minutes',
        'Control pickup windows and quantities',
        'Earn KindCoins and community recognition',
      ],
    },
    {
      key: 'home_kitchens',
      icon: '🏠',
      title: 'Home Kitchens',
      summary: 'Share extra portions safely with nearby neighbors.',
      details: [
        'Verified guidelines for safe sharing',
        'Limit by day and portion size',
        'Support local families and reduce waste',
      ],
    },
    {
      key: 'factories',
      icon: '🏭',
      title: 'Food Factories',
      summary: 'Move excess inventory quickly to nonprofits and buyers.',
      details: [
        'Bulk listings via CSV/API',
        'Automated pickup and logistics matching',
        'Compliance-friendly donation receipts',
      ],
    },
    {
      key: 'supermarkets',
      icon: '🛒',
      title: 'Supermarkets',
      summary: 'Clear near-expiry goods and reward eco‑friendly shoppers.',
      details: [
        'Dynamic markdowns for near-expiry items',
        'Local pickup scheduling',
        'Impact analytics and leaderboards',
      ],
    },
    {
      key: 'retail',
      icon: '🏪',
      title: 'Retail Shops',
      summary: 'Bundle slow movers into value packs for the community.',
      details: [
        'Create limited-time bundles',
        'Drive foot traffic with pickups',
        'Earn KindCoins for sustainability',
      ],
    },
    {
      key: 'verifiers',
      icon: '🩺',
      title: 'Verifiers',
      summary: 'Verify recipients and report safety/quality checks.',
      details: [
        'Simple verification flows',
        'Anonymous issue reporting',
        'Community trust building',
      ],
    },
    {
      key: 'ambassadors',
      icon: '✅',
      title: 'Ambassadors',
      summary: 'Onboard new partners and host local food-rescue drives.',
      details: [
        'Invite and mentor local partners',
        'Host monthly rescue events',
        'Earn badges and KindCoins',
      ],
    },
    {
      key: 'donors',
      icon: '💰',
      title: 'Donors',
      summary: 'Sponsor meals and CO₂ savings where they matter most.',
      details: [
        'Fund targeted rescue campaigns',
        'Transparent impact reporting',
        'Tax-friendly receipts (where applicable)',
      ],
    },
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header with Login/Signup buttons */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-green-600">KindBite</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={onLogin}
                className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Login
              </button>
              <button 
                onClick={onSignup}
                className="bg-green-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-600 transition-colors duration-200"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center p-4 min-h-[calc(100vh-80px)]">
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
            <div className="flex flex-wrap gap-4 items-start">
              {ecosystemOptions.map((opt) => {
                const isOpen = openKey === opt.key;
                return (
                  <div key={opt.key} className="basis-full sm:basis-[calc((100%_-_1rem_*_2)_/_3)] flex-grow-0 flex-shrink-0">
                    <div className="border rounded-lg">
                    <button
                      type="button"
                      className={`w-full flex items-center justify-between p-4 text-left focus:outline-none focus:ring-2 focus:ring-green-500 rounded-lg ${
                        isOpen ? 'bg-green-50' : 'bg-white'
                      }`}
                      aria-expanded={isOpen}
                      aria-controls={`ecosystem-panel-${opt.key}`}
                      onClick={() => toggle(opt.key)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggle(opt.key);
                        }
                      }}
                    >
                      <span className="flex items-center space-x-3">
                        <span className="text-2xl" aria-hidden="true">{opt.icon}</span>
                        <span className="font-medium text-gray-800">{opt.title}</span>
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                    <div
                      id={`ecosystem-panel-${opt.key}`}
                      className={`overflow-hidden transition-all duration-300 ${
                        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="px-4 pb-4 text-sm text-gray-600">
                        <p className="mb-2">{opt.summary}</p>
                        <ul className="list-disc pl-5 space-y-1">
                          {opt.details.map((d, idx) => (
                            <li key={idx}>{d}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    </div>
                  </div>
                );
              })}
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
    </div>
  );
};

export default WelcomeScreen;