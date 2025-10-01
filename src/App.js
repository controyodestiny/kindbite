import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import AIChat from './components/features/IntelligentAIChat';
import FoodModal from './components/features/FoodModal';
import AuthModal from './components/features/AuthModal';
import NotLoggedInView from './components/features/NotLoggedInView';
import HomeView from './views/HomeView';
import SearchView from './views/SearchView';
import CommunityView from './views/CommunityView';
import PointsView from './views/PointsView';
import ProfileView from './views/ProfileView';
import AboutView from './views/AboutView';
import MessagesView from './views/MessagesView';
import EnvironmentView from './views/EnvironmentView';
import PartnersView from './views/PartnersView';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [userRole, setUserRole] = useState('cafe');
  const [showSidebar, setShowSidebar] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAddFoodModal, setShowAddFoodModal] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [profileImage, setProfileImage] = useState(null);

  const [foodListings, setFoodListings] = useState([
    {
      id: 1,
      name: "Mixed Vegetable Stir Fry",
      restaurant: "Green Garden Cafe",
      category: "Vegetarian",
      originalPrice: 0,
      discountedPrice: 0,
      rating: 4.5,
      image: "🥗",
      description: "Fresh mixed vegetables stir-fried with aromatic spices",
      isReserved: false,
      isLiked: false,
      quantity: 5,
      co2Saved: 2.3
    },
    {
      id: 2,
      name: "Chicken Biryani",
      restaurant: "Spice Palace",
      category: "Non-Vegetarian",
      originalPrice: 0,
      discountedPrice: 0,
      rating: 4.8,
      image: "🍗",
      description: "Fragrant basmati rice with tender chicken and aromatic spices",
      isReserved: false,
      isLiked: false,
      quantity: 3,
      co2Saved: 3.1
    }
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Food Available",
      message: "Mixed Vegetable Stir Fry is now available at Green Garden Cafe",
      timestamp: "2 minutes ago",
      isRead: false
    }
  ]);

  useEffect(() => {
    const savedUser = localStorage.getItem('kindbite_user');
    const savedAuth = localStorage.getItem('kindbite_authenticated');
    const savedProfileImage = localStorage.getItem('kindbite_profile_image');
    
    if (savedAuth === 'true' && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setIsAuthenticated(true);
        setUser(userData);
        setUserRole(userData.role || 'cafe');
    } catch (error) {
        console.error('Error loading user data:', error);
      }
    }
    
    if (savedProfileImage) {
      setProfileImage(savedProfileImage);
    }
  }, []);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    setUserRole(userData.role || 'cafe');
    setShowAuthModal(false);
    localStorage.setItem('kindbite_user', JSON.stringify(userData));
    localStorage.setItem('kindbite_authenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setCurrentView('home');
    localStorage.removeItem('kindbite_user');
    localStorage.removeItem('kindbite_authenticated');
    localStorage.removeItem('kindbite_profile_image');
  };

  const handleFoodLikeToggle = (foodId) => {
    setFoodListings(prev => prev.map(food =>
      food.id === foodId ? { ...food, isLiked: !food.isLiked } : food
    ));
  };

  const handleFoodReserve = (foodId) => {
    setFoodListings(prev => prev.map(food =>
      food.id === foodId ? { ...food, isReserved: !food.isReserved } : food
    ));
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView foodListings={foodListings} onLikeToggle={handleFoodLikeToggle} onReserve={handleFoodReserve} onOpenFoodModal={(food) => { setSelectedFood(food); setShowFoodModal(true); }} onViewChange={setCurrentView} />;
      case 'search':
        return <SearchView foodListings={foodListings} onLikeToggle={handleFoodLikeToggle} onReserve={handleFoodReserve} onOpenFoodModal={(food) => { setSelectedFood(food); setShowFoodModal(true); }} onViewChange={setCurrentView} />;
      case 'my-food':
        return <SearchView foodListings={foodListings.filter(f => f.restaurant === (user?.username || 'Your Restaurant'))} onLikeToggle={handleFoodLikeToggle} onReserve={handleFoodReserve} onOpenFoodModal={(food) => { setSelectedFood(food); setShowFoodModal(true); }} onViewChange={setCurrentView} title="My Food Listings" />;
      case 'reservations':
        return <MessagesView />;
      case 'analytics':
        return <PointsView onViewChange={setCurrentView} />;
      case 'inventory':
        return <SearchView foodListings={foodListings.filter(f => f.restaurant === (user?.username || 'Your Store'))} onLikeToggle={handleFoodLikeToggle} onReserve={handleFoodReserve} onOpenFoodModal={(food) => { setSelectedFood(food); setShowFoodModal(true); }} onViewChange={setCurrentView} title="Inventory" />;
      case 'schedule':
        return <SearchView foodListings={foodListings.filter(f => f.restaurant === (user?.username || 'Your Bakery'))} onLikeToggle={handleFoodLikeToggle} onReserve={handleFoodReserve} onOpenFoodModal={(food) => { setSelectedFood(food); setShowFoodModal(true); }} onViewChange={setCurrentView} title="Baking Schedule" />;
      case 'events':
        return <SearchView foodListings={foodListings.filter(f => f.restaurant === (user?.username || 'Your Hotel'))} onLikeToggle={handleFoodLikeToggle} onReserve={handleFoodReserve} onOpenFoodModal={(food) => { setSelectedFood(food); setShowFoodModal(true); }} onViewChange={setCurrentView} title="Events" />;
      case 'community':
        return <CommunityView onViewChange={setCurrentView} />;
      case 'points':
        return <PointsView onViewChange={setCurrentView} />;
      case 'profile':
        return <ProfileView user={user} onLogout={handleLogout} onProfileImageChange={(img) => { setProfileImage(img); localStorage.setItem('kindbite_profile_image', img); }} onViewChange={setCurrentView} />;
      case 'about':
        return <AboutView />;
      case 'messages':
        return (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setCurrentView('community')}
              style={{
                position: 'fixed',
                top: '88px',
                left: '24px',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'rgba(0, 0, 0, 0.05)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(0, 0, 0, 0.1)';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(0, 0, 0, 0.05)';
                e.target.style.transform = 'scale(1)';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <MessagesView />
          </div>
        );
      case 'environment':
        return (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setCurrentView('community')}
              style={{
                position: 'fixed',
                top: '88px',
                left: '24px',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'rgba(0, 0, 0, 0.05)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(0, 0, 0, 0.1)';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(0, 0, 0, 0.05)';
                e.target.style.transform = 'scale(1)';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <div style={{ minHeight: '100vh', background: 'white', paddingTop: '32px' }}>
              <div style={{ maxWidth: '1016px', margin: '0 auto', padding: '32px 24px' }}>
                <h1 style={{ fontSize: '36px', fontWeight: '600', color: '#111', marginBottom: '12px' }}>
                  🌱 Eco Impact
                </h1>
                <p style={{ fontSize: '16px', color: '#767676', marginBottom: '32px' }}>
                  How KindBite is helping save the planet
                </p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                  <div style={{ background: 'white', border: '1px solid #efefef', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>🌍</div>
                    <div style={{ fontSize: '32px', fontWeight: '700', color: '#111', marginBottom: '4px' }}>38 tons</div>
                    <div style={{ fontSize: '14px', color: '#767676' }}>CO₂ Emissions Saved</div>
                  </div>

                  <div style={{ background: 'white', border: '1px solid #efefef', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>💧</div>
                    <div style={{ fontSize: '32px', fontWeight: '700', color: '#111', marginBottom: '4px' }}>245K L</div>
                    <div style={{ fontSize: '14px', color: '#767676' }}>Water Conserved</div>
                  </div>

                  <div style={{ background: 'white', border: '1px solid #efefef', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>🌾</div>
                    <div style={{ fontSize: '32px', fontWeight: '700', color: '#111', marginBottom: '4px' }}>18K kg</div>
                    <div style={{ fontSize: '14px', color: '#767676' }}>Food Waste Prevented</div>
                  </div>

                  <div style={{ background: 'white', border: '1px solid #efefef', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>⚡</div>
                    <div style={{ fontSize: '32px', fontWeight: '700', color: '#111', marginBottom: '4px' }}>42K kWh</div>
                    <div style={{ fontSize: '14px', color: '#767676' }}>Energy Saved</div>
                  </div>
                </div>

                <div style={{ background: 'white', border: '1px solid #efefef', borderRadius: '16px', padding: '32px', marginBottom: '32px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#111', marginBottom: '20px' }}>
                    Why Food Rescue Matters
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'start' }}>
                      <div style={{ fontSize: '32px', flexShrink: 0 }}>🌡️</div>
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#111', marginBottom: '4px' }}>Reduces Global Warming</div>
                        <div style={{ fontSize: '15px', color: '#767676' }}>Food waste produces methane, a greenhouse gas 25x more potent than CO₂</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', alignItems: 'start' }}>
                      <div style={{ fontSize: '32px', flexShrink: 0 }}>💰</div>
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#111', marginBottom: '4px' }}>Saves Resources</div>
                        <div style={{ fontSize: '15px', color: '#767676' }}>Every meal saved conserves the water, energy, and land used to produce it</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', alignItems: 'start' }}>
                      <div style={{ fontSize: '32px', flexShrink: 0 }}>🤝</div>
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#111', marginBottom: '4px' }}>Helps Communities</div>
                        <div style={{ fontSize: '15px', color: '#767676' }}>Connecting surplus food with those who need it strengthens our community</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', alignItems: 'start' }}>
                      <div style={{ fontSize: '32px', flexShrink: 0 }}>🌱</div>
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#111', marginBottom: '4px' }}>Protects Biodiversity</div>
                        <div style={{ fontSize: '15px', color: '#767676' }}>Less food waste means less pressure on natural ecosystems and wildlife</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ background: '#111', borderRadius: '16px', padding: '32px', textAlign: 'center', color: 'white' }}>
                  <div style={{ fontSize: '32px', marginBottom: '16px' }}>🎯</div>
                  <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '12px' }}>Our Goal</h3>
                  <p style={{ fontSize: '16px', opacity: 0.9 }}>
                    Together, we're working to reduce food waste by 50% in our community by 2025
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'partners':
        return <PartnersView onViewChange={setCurrentView} />;
      case 'news':
        return (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setCurrentView('community')}
              style={{
                position: 'fixed',
                top: '88px',
                left: '24px',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'rgba(0, 0, 0, 0.05)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(0, 0, 0, 0.1)';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(0, 0, 0, 0.05)';
                e.target.style.transform = 'scale(1)';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <div style={{ minHeight: '100vh', background: 'white', paddingTop: '32px' }}>
              <div style={{ maxWidth: '1016px', margin: '0 auto', padding: '32px 24px' }}>
                <h1 style={{ fontSize: '36px', fontWeight: '600', color: '#111', marginBottom: '32px' }}>
                  News & Events
                </h1>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ background: 'white', border: '1px solid #efefef', borderRadius: '16px', padding: '24px', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                    <div style={{ fontSize: '20px', fontWeight: '600', color: '#111', marginBottom: '12px' }}>🎉 New Feature: Messages</div>
                    <div style={{ fontSize: '15px', color: '#767676', marginBottom: '12px' }}>WhatsApp-like messaging is now available! Connect with food providers and community members.</div>
                    <div style={{ fontSize: '14px', color: '#999' }}>2 hours ago</div>
                  </div>

                  <div style={{ background: 'white', border: '1px solid #efefef', borderRadius: '16px', padding: '24px', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                    <div style={{ fontSize: '20px', fontWeight: '600', color: '#111', marginBottom: '12px' }}>🌱 Earth Day Event</div>
                    <div style={{ fontSize: '15px', color: '#767676', marginBottom: '12px' }}>Join us for a special food rescue event on April 22nd!</div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', color: '#999' }}>1 day ago</span>
                      <span style={{ background: '#efefef', color: '#111', padding: '4px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: '600' }}>Upcoming</span>
                    </div>
                  </div>

                  <div style={{ background: 'white', border: '1px solid #efefef', borderRadius: '16px', padding: '24px', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                    <div style={{ fontSize: '20px', fontWeight: '600', color: '#111', marginBottom: '12px' }}>🏆 Top Contributors</div>
                    <div style={{ fontSize: '15px', color: '#767676', marginBottom: '12px' }}>Congratulations to our amazing community members who saved over 500kg of food this month!</div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', color: '#999' }}>3 days ago</span>
                      <span style={{ background: '#efefef', color: '#111', padding: '4px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: '600' }}>Achievement</span>
                    </div>
                  </div>

                  <div style={{ background: 'white', border: '1px solid #efefef', borderRadius: '16px', padding: '24px', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                    <div style={{ fontSize: '20px', fontWeight: '600', color: '#111', marginBottom: '12px' }}>🍲 Cooking Workshop</div>
                    <div style={{ fontSize: '15px', color: '#767676', marginBottom: '12px' }}>Learn how to cook with surplus ingredients! Free workshop this Saturday at 2 PM.</div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', color: '#999' }}>5 days ago</span>
                      <span style={{ background: '#efefef', color: '#111', padding: '4px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: '600' }}>Event</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'panels':
        return (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setCurrentView('community')}
              style={{
                position: 'fixed',
                top: '88px',
                left: '24px',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'rgba(0, 0, 0, 0.05)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(0, 0, 0, 0.1)';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(0, 0, 0, 0.05)';
                e.target.style.transform = 'scale(1)';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <div style={{ minHeight: '100vh', background: 'white', paddingTop: '32px' }}>
              <div style={{ maxWidth: '1016px', margin: '0 auto', padding: '32px 24px' }}>
                <h1 style={{ fontSize: '36px', fontWeight: '600', color: '#111', marginBottom: '12px' }}>
                  User Panels
                </h1>
                <p style={{ fontSize: '16px', color: '#767676', marginBottom: '32px' }}>
                  Active community members making a difference
                </p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                  <div style={{ background: 'white', border: '1px solid #efefef', borderRadius: '16px', padding: '32px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>👨‍🍳</div>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#111', marginBottom: '8px' }}>Restaurants</div>
                    <div style={{ fontSize: '40px', fontWeight: '700', color: '#111', marginBottom: '4px' }}>156</div>
                    <div style={{ fontSize: '14px', color: '#767676' }}>Active providers</div>
                  </div>

                  <div style={{ background: 'white', border: '1px solid #efefef', borderRadius: '16px', padding: '32px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>🛒</div>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#111', marginBottom: '8px' }}>Retailers</div>
                    <div style={{ fontSize: '40px', fontWeight: '700', color: '#111', marginBottom: '4px' }}>89</div>
                    <div style={{ fontSize: '14px', color: '#767676' }}>Stores & Markets</div>
                  </div>

                  <div style={{ background: 'white', border: '1px solid #efefef', borderRadius: '16px', padding: '32px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏠</div>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#111', marginBottom: '8px' }}>Home Cooks</div>
                    <div style={{ fontSize: '40px', fontWeight: '700', color: '#111', marginBottom: '4px' }}>234</div>
                    <div style={{ fontSize: '14px', color: '#767676' }}>Home kitchens</div>
                  </div>

                  <div style={{ background: 'white', border: '1px solid #efefef', borderRadius: '16px', padding: '32px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>🌾</div>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#111', marginBottom: '8px' }}>Donors</div>
                    <div style={{ fontSize: '40px', fontWeight: '700', color: '#111', marginBottom: '4px' }}>512</div>
                    <div style={{ fontSize: '14px', color: '#767676' }}>Generous givers</div>
                  </div>

                  <div style={{ background: 'white', border: '1px solid #efefef', borderRadius: '16px', padding: '32px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>👤</div>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#111', marginBottom: '8px' }}>Food Seekers</div>
                    <div style={{ fontSize: '40px', fontWeight: '700', color: '#111', marginBottom: '4px' }}>1,204</div>
                    <div style={{ fontSize: '14px', color: '#767676' }}>Community members</div>
                  </div>

                  <div style={{ background: 'white', border: '1px solid #efefef', borderRadius: '16px', padding: '32px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#111', marginBottom: '8px' }}>Verifiers</div>
                    <div style={{ fontSize: '40px', fontWeight: '700', color: '#111', marginBottom: '4px' }}>45</div>
                    <div style={{ fontSize: '14px', color: '#767676' }}>Quality checkers</div>
                  </div>
                </div>

                <div style={{ background: 'white', border: '1px solid #efefef', borderRadius: '16px', padding: '32px', marginTop: '32px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#111', marginBottom: '24px', textAlign: 'center' }}>📊 Total Impact</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', textAlign: 'center' }}>
                    <div>
                      <div style={{ fontSize: '36px', fontWeight: '700', color: '#111', marginBottom: '4px' }}>2,240</div>
                      <div style={{ fontSize: '14px', color: '#767676' }}>Total Users</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '36px', fontWeight: '700', color: '#111', marginBottom: '4px' }}>15.2K</div>
                      <div style={{ fontSize: '14px', color: '#767676' }}>Meals Saved</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '36px', fontWeight: '700', color: '#111', marginBottom: '4px' }}>38 tons</div>
                      <div style={{ fontSize: '14px', color: '#767676' }}>CO₂ Reduced</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <HomeView foodListings={foodListings} onLikeToggle={handleFoodLikeToggle} onReserve={handleFoodReserve} onOpenFoodModal={(food) => { setSelectedFood(food); setShowFoodModal(true); }} onViewChange={setCurrentView} />;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 overflow-x-hidden">
        <Header onMenuToggle={() => setShowSidebar(!showSidebar)} onAIChatToggle={() => setShowAIChat(!showAIChat)} onNotificationsToggle={() => setShowNotifications(!showNotifications)} onHomeClick={() => setCurrentView('home')} notifications={notifications} isLargeScreen={window.innerWidth >= 1024} isAuthenticated={isAuthenticated} user={user} onLoginClick={() => { setAuthMode('login'); setShowAuthModal(true); }} onSignupClick={() => { setAuthMode('signup'); setShowAuthModal(true); }} onProfileClick={() => setCurrentView('profile')} profileImage={profileImage} />
        <NotLoggedInView onLoginClick={() => { setAuthMode('login'); setShowAuthModal(true); }} onSignupClick={() => { setAuthMode('signup'); setShowAuthModal(true); }} />
        {showAuthModal && <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} mode={authMode} onModeChange={setAuthMode} onLogin={handleLogin} />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <Header
        onMenuToggle={() => setShowSidebar(!showSidebar)}
        onAIChatToggle={() => setShowAIChat(!showAIChat)}
        onNotificationsToggle={() => setShowNotifications(!showNotifications)} 
        onHomeClick={() => { 
          setCurrentView('home'); 
          setShowSidebar(false);
        }} 
        notifications={notifications} 
        isLargeScreen={window.innerWidth >= 1024}
        isAuthenticated={isAuthenticated} 
        user={user} 
        onLoginClick={() => { setAuthMode('login'); setShowAuthModal(true); }} 
        onSignupClick={() => { setAuthMode('signup'); setShowAuthModal(true); }} 
        onProfileClick={() => setCurrentView('profile')} 
        profileImage={profileImage} 
      />
      <Sidebar
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
        currentView={currentView}
        onViewChange={(view) => { 
          setCurrentView(view); 
          setShowSidebar(false); 
        }} 
        userRole={userRole} 
        onRoleChange={setUserRole} 
        onAddFood={() => setShowAddFoodModal(true)} 
      />
      <main className="pt-20 pb-24 min-h-screen overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderCurrentView()}
        </div>
      </main>
      {showFoodModal && selectedFood && <FoodModal selectedFood={selectedFood} onClose={() => { setShowFoodModal(false); setSelectedFood(null); }} onReserve={() => handleFoodReserve(selectedFood.id)} />}
      {showNotifications && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Notifications</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))} 
                  className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 font-medium"
                >
                  Mark All Read
                </button>
                <button onClick={() => setShowNotifications(false)} className="text-gray-500 hover:text-gray-700 text-2xl leading-none">✕</button>
              </div>
            </div>
              {notifications.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No notifications</p>
              ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className={`p-3 rounded-lg cursor-pointer transition-colors ${n.isRead ? 'bg-gray-50 text-gray-600' : 'bg-blue-50 text-blue-900 font-medium'}`} onClick={() => setNotifications(prev => prev.map(notif => notif.id === n.id ? { ...notif, isRead: true } : notif))}>
                    <p className="font-semibold">{n.title}</p>
                    <p className="text-sm">{n.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{n.timestamp}</p>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>
      )}
      {showAIChat && <AIChat showAIChat={showAIChat} onClose={() => setShowAIChat(false)} foodListings={foodListings} />}
      {showAddFoodModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">Add New Food Item</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              setFoodListings(prev => [{
                id: Date.now(),
                name: fd.get('name'),
                restaurant: user?.username || 'Your Restaurant',
                category: fd.get('category'),
                originalPrice: 0,
                discountedPrice: 0,
                rating: 4.0,
                image: fd.get('category') === 'Vegetarian' ? '🥗' : fd.get('category') === 'Non-Vegetarian' ? '🍗' : '🌱',
                description: fd.get('description'),
                isReserved: false,
                isLiked: false,
                quantity: 5,
                co2Saved: 2.0
              }, ...prev]);
              setShowAddFoodModal(false);
              e.target.reset();
            }}>
              <input type="text" name="name" required placeholder="Food Name" className="w-full border p-2 rounded mb-3" />
              <select name="category" required className="w-full border p-2 rounded mb-3">
                <option value="Vegetarian">Vegetarian</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
                <option value="Vegan">Vegan</option>
              </select>
              <textarea name="description" required placeholder="Description" className="w-full border p-2 rounded mb-3" rows={3} />
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowAddFoodModal(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showAuthModal && <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} mode={authMode} onModeChange={setAuthMode} onLogin={handleLogin} />}
    </div>
  );
}

export default App;