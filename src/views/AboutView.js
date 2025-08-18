import React from 'react';

const AboutView = () => (
  <div>
          <div className="p-4 space-y-8 lg:p-6 lg:space-y-10">
        <div className="bg-gradient-to-br from-green-600 via-green-500 to-blue-600 rounded-2xl p-6 text-white text-center">
          <div className="mb-4 text-6xl lg:text-8xl">🌍</div>
          <h2 className="font-bold mb-2 text-2xl lg:text-3xl">KindBite</h2>
          <p className="mb-4 text-green-100 lg:text-lg">
            Connecting Hearts, Reducing Waste, Fighting Hunger
          </p>
          <div className="grid grid-cols-3 gap-4 mt-6 lg:gap-6">
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="font-bold text-2xl lg:text-3xl">28K+</div>
              <div className="opacity-90 text-xs lg:text-sm">Items Rescued</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="font-bold text-2xl lg:text-3xl">3.2K</div>
              <div className="opacity-90 text-xs lg:text-sm">Active Providers</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="font-bold text-2xl lg:text-3xl">19T</div>
              <div className="opacity-90 text-xs lg:text-sm">CO₂ Saved</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-bold text-gray-800 mb-4 text-center text-lg lg:text-xl">
            Our Mission
          </h3>
          <p className="text-gray-600 text-center leading-relaxed lg:text-lg">
            To create a global ecosystem where food waste becomes food security, connecting restaurants, 
            home kitchens, food factories, supermarkets, and retail shops with communities in need.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-bold text-gray-800 mb-6 text-center text-lg lg:text-xl">
            Complete Food Ecosystem
          </h3>
          <div className="grid grid-cols-3 gap-4 lg:gap-6">
            {[
              { icon: '🍽️', title: 'Restaurants', desc: 'Traditional food establishments' },
              { icon: '🏠', title: 'Home Kitchens', desc: 'Community food sharing' },
              { icon: '🏭', title: 'Food Factories', desc: 'Production facilities' },
              { icon: '🛒', title: 'Supermarkets', desc: 'Large retail stores' },
              { icon: '🏪', title: 'Retail Shops', desc: 'Small shops & cafés' },
              { icon: '🩺', title: 'Food Verifiers', desc: 'Volunteer doctors ensuring safety' }
            ].map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="mb-3 text-2xl lg:text-3xl">{item.icon}</div>
                <h4 className="font-semibold text-gray-800 mb-2 text-sm lg:text-base">
                  {item.title}
                </h4>
                <p className="text-gray-600 text-xs lg:text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
  </div>
);

export default AboutView;
