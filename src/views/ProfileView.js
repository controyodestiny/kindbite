import React, { useState, useEffect, useRef } from 'react';
import { Edit3, Save, X, Camera, MapPin, Calendar, Award, Heart, Leaf, Users, TrendingUp } from 'lucide-react';
import apiService from '../services/api';

const ProfileView = ({ onViewChange, user, onLogout, onProfileImageChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.username || 'Alex Johnson',
    occupation: 'Software Developer',
    location: 'Kampala, Uganda',
    bio: 'Passionate about food rescue and environmental sustainability. Love trying new cuisines and reducing food waste.',
    email: user?.email || 'alex.johnson@email.com',
    phone: '+256 123 456 789',
    dietaryPreferences: ['Vegetarian', 'Halal'],
    favoriteCuisines: ['Italian', 'Indian', 'Local Ugandan'],
    joinDate: user?.joinDate || '2024-01-15'
  });
  const [profileImage, setProfileImage] = useState(null);
  const [fileInputRef] = useState(useRef());
  const [isLoading, setIsLoading] = useState(false);
  const [userStats, setUserStats] = useState({
    kindCoins: 245,
    mealsRescued: 12,
    co2Saved: 8.4,
    waterSaved: 84,
    communityRank: 'Eco Warrior',
    streakDays: 7,
    totalDonations: 3,
    favoriteFood: 'Chapati & Beans'
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Load from localStorage if available
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        setProfileData(prev => ({ ...prev, ...parsedProfile }));
        if (parsedProfile.profileImage) {
          setProfileImage(parsedProfile.profileImage);
          // Also update the header profile image
          if (onProfileImageChange) {
            onProfileImageChange(parsedProfile.profileImage);
          }
        }
      }
      
    } catch (error) {
      console.warn('Could not load user data:', error);
      // Keep default values
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage to persist data
      const savedProfileData = {
        ...profileData,
        profileImage: profileImage
      };
      console.log('Saving profile data to localStorage:', savedProfileData);
      localStorage.setItem('userProfile', JSON.stringify(savedProfileData));
      console.log('Profile data saved successfully');
      
      // Update local state
      setIsEditing(false);
      
      // Show success feedback
      alert('Profile updated successfully!');
      
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelClick = () => {
    // Reload saved data to discard changes
    loadUserData();
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log('Profile image changed:', e.target.result);
        setProfileImage(e.target.result);
        // Pass the new profile image to the parent component
        if (onProfileImageChange) {
          console.log('Calling onProfileImageChange with:', e.target.result);
          onProfileImageChange(e.target.result);
        } else {
          console.log('onProfileImageChange function not provided');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addDietaryPreference = (preference) => {
    if (!profileData.dietaryPreferences.includes(preference)) {
      setProfileData(prev => ({
        ...prev,
        dietaryPreferences: [...prev.dietaryPreferences, preference]
      }));
    }
  };

  const removeDietaryPreference = (preference) => {
    setProfileData(prev => ({
      ...prev,
      dietaryPreferences: prev.dietaryPreferences.filter(p => p !== preference)
    }));
  };

  const addFavoriteCuisine = (cuisine) => {
    if (!profileData.favoriteCuisines.includes(cuisine)) {
      setProfileData(prev => ({
        ...prev,
        favoriteCuisines: [...prev.favoriteCuisines, cuisine]
      }));
    }
  };

  const removeFavoriteCuisine = (cuisine) => {
    setProfileData(prev => ({
      ...prev,
      favoriteCuisines: prev.favoriteCuisines.filter(c => c !== cuisine)
    }));
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 'Eco Warrior': return 'from-green-500 to-emerald-500';
      case 'Food Hero': return 'from-blue-500 to-cyan-500';
      case 'Community Leader': return 'from-purple-500 to-pink-500';
      case 'Sustainability Champion': return 'from-orange-500 to-red-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 pt-20 pb-24">
      <div className="p-4 lg:p-6 space-y-6">
        {/* Profile Header */}
        <div className="card-premium p-6 text-center">
          <div className="relative inline-block mb-6">
            <div 
              className={`w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-4 border-white shadow-2xl cursor-pointer transition-all duration-300 ${
                isEditing ? 'hover:scale-105 hover:shadow-3xl' : ''
              }`}
              onClick={handleImageClick}
            >
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                  <span className="text-white text-4xl lg:text-5xl font-bold">
                    {profileData.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
              )}
              {isEditing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <Camera size={32} className="text-white" />
                </div>
              )}
            </div>
            
            {/* Edit Badge */}
            {isEditing && (
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-green-500 to-blue-500 text-white p-2 rounded-full shadow-lg">
                <Edit3 size={16} />
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
            {isEditing ? (
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="text-center bg-transparent border-b-2 border-green-500 focus:outline-none focus:border-blue-500"
              />
            ) : (
              profileData.name
            )}
          </h1>

          <p className="text-lg text-gray-600 mb-4">
            {isEditing ? (
              <input
                type="text"
                value={profileData.occupation}
                onChange={(e) => handleInputChange('occupation', e.target.value)}
                className="text-center bg-transparent border-b-2 border-green-500 focus:outline-none focus:border-blue-500"
              />
            ) : (
              profileData.occupation
            )}
          </p>

          {/* Action Buttons */}
          <div className="flex space-x-4 mb-6">
            {isEditing ? (
              <>
                <button
                  onClick={handleSaveClick}
                  disabled={isLoading}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
                >
                  <Save size={20} />
                  <span>Save Changes</span>
                </button>
                <button
                  onClick={handleCancelClick}
                  disabled={isLoading}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
                >
                  <X size={20} />
                  <span>Cancel</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleEditClick}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200 flex items-center space-x-2"
              >
                <Edit3 size={20} />
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mt-6">
            <button
              onClick={() => onViewChange && onViewChange('home')}
              className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200"
            >
              Back to Home
            </button>
            <button
              onClick={onLogout}
              className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors duration-200"
            >
              Logout
            </button>
          </div>

        </div>

        {/* User Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card-premium p-6 text-center group hover-lift">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Award size={32} className="text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">{userStats.kindCoins}</div>
            <div className="text-gray-600 font-medium">KindCoins</div>
          </div>

          <div className="card-premium p-6 text-center group hover-lift">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Heart size={32} className="text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">{userStats.mealsRescued}</div>
            <div className="text-gray-600 font-medium">Meals Rescued</div>
          </div>

          <div className="card-premium p-6 text-center group hover-lift">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Leaf size={32} className="text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">{userStats.co2Saved}kg</div>
            <div className="text-gray-600 font-medium">CO₂ Saved</div>
          </div>

          <div className="card-premium p-6 text-center group hover-lift">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <TrendingUp size={32} className="text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">{userStats.streakDays}</div>
            <div className="text-gray-600 font-medium">Day Streak</div>
          </div>
        </div>

        {/* Community Rank */}
        <div className="card-premium p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Community Rank</h3>
          <div className="text-center">
            <div className={`inline-block bg-gradient-to-r ${getRankColor(userStats.communityRank)} text-white px-6 py-3 rounded-2xl font-bold text-xl shadow-lg`}>
              {userStats.communityRank}
            </div>
            <p className="text-gray-600 mt-3">Keep up the great work! You're making a real difference.</p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="card-premium p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Users size={20} className="text-green-500 mr-2" />
              Personal Information
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors duration-300"
                    placeholder="Enter your location"
                  />
                ) : (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin size={16} />
                    <span>{profileData.location}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors duration-300"
                    placeholder="Enter your email"
                  />
                ) : (
                  <span className="text-gray-600">{profileData.email}</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors duration-300"
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <span className="text-gray-600">{profileData.phone}</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Join Date</label>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar size={16} />
                  <span>{new Date(profileData.joinDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="card-premium p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Heart size={20} className="text-green-500 mr-2" />
              Preferences
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Preferences</label>
                <div className="flex flex-wrap gap-2">
                  {profileData.dietaryPreferences.map((pref, index) => (
                    <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2">
                      <span>{pref}</span>
                      {isEditing && (
                        <button
                          onClick={() => removeDietaryPreference(pref)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </span>
                  ))}
                  {isEditing && (
                    <button
                      onClick={() => addDietaryPreference('Vegan')}
                      className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors duration-300"
                    >
                      + Add
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Favorite Cuisines</label>
                <div className="flex flex-wrap gap-2">
                  {profileData.favoriteCuisines.map((cuisine, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2">
                      <span>{cuisine}</span>
                      {isEditing && (
                        <button
                          onClick={() => removeFavoriteCuisine(cuisine)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </span>
                  ))}
                  {isEditing && (
                    <button
                      onClick={() => addFavoriteCuisine('Thai')}
                      className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors duration-300"
                    >
                      + Add
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                {isEditing ? (
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows="3"
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors duration-300 resize-none"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-gray-600">{profileData.bio}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="card-premium p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Recent Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-3xl mb-2">🎯</div>
              <div className="font-semibold text-green-800">7-Day Streak</div>
              <div className="text-sm text-green-600">Keep it up!</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-3xl mb-2">🌱</div>
              <div className="font-semibold text-blue-800">Eco Warrior</div>
              <div className="text-sm text-blue-600">8.4kg CO₂ saved</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-3xl mb-2">🤝</div>
              <div className="font-semibold text-purple-800">Community Helper</div>
              <div className="text-sm text-purple-600">3 donations made</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
