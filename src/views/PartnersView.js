import React from 'react';
import { Award, Star, Users, Globe, Heart, TrendingUp, Trophy, Medal, Crown } from 'lucide-react';

const PartnersView = ({ onViewChange }) => {
  // Partners ranked by popularity/performance
  const rankedPartners = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      type: "Food Verifier",
      logo: "🩺",
      rating: 4.9,
      mealsVerified: 2847,
      co2Saved: 6832.8,
      contribution: "Most trusted food verifier, highest verification rate",
      tier: "Crown Partner",
      tierColor: "bg-gradient-to-r from-yellow-300 to-yellow-500",
      rank: 1,
      rankIcon: "👑"
    },
    {
      id: 2,
      name: "Mama's Kitchen",
      type: "Restaurant",
      logo: "🍽️",
      rating: 4.9,
      mealsRescued: 1247,
      co2Saved: 2992.8,
      contribution: "Highest volume food provider, consistently listing surplus meals",
      tier: "Platinum Partner",
      tierColor: "bg-gradient-to-r from-yellow-400 to-yellow-600",
      rank: 2,
      rankIcon: "🥇"
    },
    {
      id: 3,
      name: "Kampala Food Factory",
      type: "Factory",
      logo: "🏭",
      rating: 4.8,
      mealsRescued: 1156,
      co2Saved: 2774.4,
      contribution: "Largest factory partner, bulk surplus management",
      tier: "Gold Partner",
      tierColor: "bg-gradient-to-r from-yellow-500 to-yellow-700",
      rank: 3,
      rankIcon: "🥈"
    },
    {
      id: 4,
      name: "The Nakasero Home",
      type: "Home Kitchen",
      logo: "🏠",
      rating: 4.8,
      mealsRescued: 892,
      co2Saved: 2140.8,
      contribution: "Most reliable home kitchen, zero waste policy",
      tier: "Gold Partner",
      tierColor: "bg-gradient-to-r from-yellow-500 to-yellow-700",
      rank: 4,
      rankIcon: "🥉"
    },
    {
      id: 5,
      name: "Sweet Dreams Bakery",
      type: "Restaurant",
      logo: "🍞",
      rating: 4.7,
      mealsRescued: 756,
      co2Saved: 1814.4,
      contribution: "Most creative surplus solutions, bakery rescue specialist",
      tier: "Silver Partner",
      tierColor: "bg-gradient-to-r from-gray-400 to-gray-600",
      rank: 5,
      rankIcon: "4️⃣"
    },
    {
      id: 6,
      name: "Shoprite Kampala",
      type: "Supermarket",
      logo: "🛒",
      rating: 4.6,
      mealsRescued: 743,
      co2Saved: 1783.2,
      contribution: "Best produce rescue program, daily listings",
      tier: "Silver Partner",
      tierColor: "bg-gradient-to-r from-gray-400 to-gray-600",
      rank: 6,
      rankIcon: "5️⃣"
    },
    {
      id: 7,
      name: "Dr. Michael Chen",
      type: "Food Verifier",
      logo: "🩺",
      rating: 4.7,
      mealsVerified: 2156,
      co2Saved: 5174.4,
      contribution: "Expert in food safety standards, rapid verification",
      tier: "Silver Partner",
      tierColor: "bg-gradient-to-r from-gray-400 to-gray-600",
      rank: 7,
      rankIcon: "6️⃣"
    },
    {
      id: 8,
      name: "Green Market Kampala",
      type: "Supermarket",
      logo: "🛒",
      rating: 4.5,
      mealsRescued: 634,
      co2Saved: 1521.6,
      contribution: "Organic produce specialist, eco-friendly packaging",
      tier: "Bronze Partner",
      tierColor: "bg-gradient-to-r from-amber-600 to-amber-800",
      rank: 8,
      rankIcon: "7️⃣"
    },
    {
      id: 9,
      name: "Emma's Home Bakery",
      type: "Home Kitchen",
      logo: "🏠",
      rating: 4.6,
      mealsRescued: 445,
      co2Saved: 1068,
      contribution: "Artisan bread specialist, gluten-free options",
      tier: "Bronze Partner",
      tierColor: "bg-gradient-to-r from-amber-600 to-amber-800",
      rank: 9,
      rankIcon: "8️⃣"
    },
    {
      id: 10,
      name: "Dr. Lisa Thompson",
      type: "Food Verifier",
      logo: "🩺",
      rating: 4.6,
      mealsVerified: 1892,
      co2Saved: 4540.8,
      contribution: "Nutrition expert, dietary restriction specialist",
      tier: "Bronze Partner",
      tierColor: "bg-gradient-to-r from-amber-600 to-amber-800",
      rank: 10,
      rankIcon: "9️⃣"
    }
  ];

  // Partner categories with actual provider names
  const partnerCategories = [
    {
      category: "Food Verifiers",
      count: 3,
      totalMeals: 6895,
      icon: "🩺",
      color: "text-purple-600",
      description: "Expert food safety professionals",
      providers: [
        "Dr. Sarah Johnson",
        "Dr. Michael Chen", 
        "Dr. Lisa Thompson"
      ]
    },
    {
      category: "Restaurants",
      count: 45,
      totalMeals: 8500,
      icon: "🍽️",
      color: "text-red-600",
      description: "Professional food establishments",
      providers: [
        "Mama's Kitchen",
        "Sweet Dreams Bakery",
        "Kampala Deli",
        "Urban Bistro",
        "The Green Plate"
      ]
    },
    {
      category: "Home Kitchens",
      count: 28,
      totalMeals: 3200,
      icon: "🏠",
      color: "text-blue-600",
      description: "Home-based food providers",
      providers: [
        "The Nakasero Home",
        "Emma's Home Bakery",
        "Mama Grace's Kitchen",
        "David's Home Delights",
        "Sarah's Sweet Treats"
      ]
    },
    {
      category: "Food Factories",
      count: 12,
      totalMeals: 6800,
      icon: "🏭",
      color: "text-orange-600",
      description: "Industrial food producers",
      providers: [
        "Kampala Food Factory",
        "Uganda Grain Co.",
        "Fresh Produce Ltd",
        "Bakery Solutions Inc",
        "Meat Processing Plant"
      ]
    },
    {
      category: "Supermarkets",
      count: 18,
      totalMeals: 4100,
      icon: "🛒",
      color: "text-green-600",
      description: "Retail food chains",
      providers: [
        "Shoprite Kampala",
        "Green Market Kampala",
        "Miko Supermart",
        "Lilo Supermart",
        "Fresh Foods Plus"
      ]
    },
    {
      category: "Local Markets",
      count: 35,
      totalMeals: 2800,
      icon: "🏪",
      color: "text-purple-600",
      description: "Small food retailers",
      providers: [
        "Nakasero Market",
        "Owino Market",
        "Kisekka Market",
        "Wandegeya Market",
        "Old Taxi Park Market"
      ]
    }
  ];

  const partnershipBenefits = [
    {
      icon: "🌟",
      title: "Increased Visibility",
      description: "Get discovered by more customers looking for quality food"
    },
    {
      icon: "💰",
      title: "Revenue Growth",
      description: "Turn surplus food into additional income streams"
    },
    {
      icon: "🌱",
      title: "Environmental Impact",
      description: "Reduce food waste and contribute to sustainability goals"
    },
    {
      icon: "🤝",
      title: "Community Building",
      description: "Connect with food-conscious customers in your area"
    },
    {
      icon: "📊",
      title: "Analytics & Insights",
      description: "Track performance and optimize your food rescue operations"
    },
    {
      icon: "🏆",
      title: "Recognition",
      description: "Earn badges and recognition for your contributions"
    }
  ];

  const getRankDisplay = (rank) => {
    if (rank === 1) return { icon: "👑", color: "text-yellow-500", label: "Crown" };
    if (rank === 2) return { icon: "🥇", color: "text-yellow-400", label: "Gold" };
    if (rank === 3) return { icon: "🥈", color: "text-yellow-500", label: "Silver" };
    if (rank <= 5) return { icon: "🥉", color: "text-yellow-600", label: "Bronze" };
    if (rank <= 10) return { icon: "⭐", color: "text-blue-500", label: "Star" };
    return { icon: "✨", color: "text-gray-500", label: "Rising" };
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
        <h1 className="text-2xl font-bold text-gray-800 mt-2">Our Partners</h1>
        <p className="text-gray-600">Meet the amazing food providers and verifiers making KindBite possible</p>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 text-center">
        <div className="text-6xl mb-4">🤝</div>
        <h2 className="text-2xl font-bold mb-2">Partner Network</h2>
        <p className="text-green-100">Together we're building a sustainable food ecosystem</p>
      </div>

      <div className="p-4 lg:p-6">
        {/* Partner Categories with Provider Lists */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Users className="w-5 h-5 text-blue-600 mr-2" />
            Partner Categories & Providers
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {partnerCategories.map((category, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`text-2xl ${category.color}`}>{category.icon}</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{category.category}</h4>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="text-2xl font-bold text-green-600 mb-1">{category.count}</div>
                  <div className="text-xs text-gray-500">Partners</div>
                </div>

                <div className="mb-3">
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    {category.category === "Food Verifiers" ? "Meals Verified" : "Meals Rescued"}: {category.totalMeals.toLocaleString()}
                  </div>
                </div>

                {/* Provider List */}
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-xs font-medium text-gray-600 mb-2">Top Providers:</div>
                  <ul className="space-y-1">
                    {category.providers.map((provider, providerIndex) => (
                      <li key={providerIndex} className="text-sm text-gray-700 flex items-center">
                        <span className="text-gray-400 mr-2">•</span>
                        {provider}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Partners - Ranked by Performance */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Trophy className="w-5 h-5 text-yellow-600 mr-2" />
            Top 10 Partners - Ranked by Performance
          </h3>
          <div className="space-y-4">
            {rankedPartners.map((partner) => {
              const rankDisplay = getRankDisplay(partner.rank);
              return (
                <div key={partner.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  {/* Rank Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`text-2xl ${rankDisplay.color}`}>{rankDisplay.icon}</div>
                      <div className="text-3xl">{partner.logo}</div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{partner.name}</h4>
                        <p className="text-sm text-gray-600">{partner.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`${partner.tierColor} text-white px-3 py-1 rounded-full text-xs font-medium`}>
                        {partner.tier}
                      </div>
                      <div className="text-2xl font-bold text-gray-400">#{partner.rank}</div>
                    </div>
                  </div>
                  
                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="font-semibold">{partner.rating}</span>
                      </div>
                      <div className="text-xs text-gray-500">Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-green-600">
                        {partner.type === "Food Verifier" ? partner.mealsVerified : partner.mealsRescued}
                      </div>
                      <div className="text-xs text-gray-500">
                        {partner.type === "Food Verifier" ? "Meals Verified" : "Meals Rescued"}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-blue-600">{partner.co2Saved}kg</div>
                      <div className="text-xs text-gray-500">CO₂ Saved</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-purple-600">{rankDisplay.label}</div>
                      <div className="text-xs text-gray-500">Rank</div>
                    </div>
                  </div>
                  
                  {/* Why They're Special */}
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Why they're special:</span> {partner.contribution}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Partnership Benefits */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Heart className="w-5 h-5 text-red-600 mr-2" />
            Benefits of Partnering with KindBite
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {partnershipBenefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl">{benefit.icon}</div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">{benefit.title}</h4>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-lg text-center">
          <div className="text-4xl mb-4">🚀</div>
          <h3 className="text-xl font-bold mb-2">Want to Become a Partner?</h3>
          <p className="text-green-100 mb-4">Join our network and help reduce food waste while growing your business</p>
          <button 
            onClick={() => onViewChange('home')}
            className="bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Get Started Today
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

export default PartnersView; 