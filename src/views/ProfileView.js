import React, { useState, useEffect } from 'react';
import { User, Edit3, Save, X, Eye, EyeOff, Camera, Phone, Mail, MapPin, Building } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import apiService from '../services/apiService';

const ProfileView = ({ userPoints }) => {
  const { user, isAuthenticated, updateUser } = useAuth();
  const toast = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form states
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    location: '',
    business_name: '',
    profile_image: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  
  const impactData = {
    today: { meals: 12, co2: 8.4, kindcoins: 245, water: 125, packaging: 1.2, foodMiles: 0.3, treesEquiv: 2, carKmEquiv: 35 },
    week: { meals: 45, co2: 32.1, kindcoins: 890, water: 485, packaging: 4.8, foodMiles: 1.2, treesEquiv: 7, carKmEquiv: 134 },
    month: { meals: 156, co2: 125.6, kindcoins: 3240, water: 1845, packaging: 18.2, foodMiles: 4.8, treesEquiv: 28, carKmEquiv: 524 },
    year: { meals: 1840, co2: 1456.8, kindcoins: 38750, water: 22145, packaging: 218.6, foodMiles: 58.2, treesEquiv: 325, carKmEquiv: 6089 }
  };

  const currentData = impactData[selectedPeriod];
  const periodLabels = { today: 'Today', week: 'This Week', month: 'This Month', year: 'This Year' };

  // Initialize form data when user changes
  useEffect(() => {
    if (user) {
      setProfileData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        business_name: user.business_name || '',
        profile_image: user.profile_image || ''
      });
    }
  }, [user]);

  // Handle profile data changes
  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle password data changes
  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      
      // Check if user is authenticated
      if (!user || !isAuthenticated) {
        toast.error('You must be logged in to update your profile');
        return;
      }
      
      // Check if we have a valid token
      const token = localStorage.getItem('kindbite_access_token');
      if (!token) {
        toast.error('Authentication token not found. Please login again.');
        return;
      }
      
      console.log('Attempting to update profile for user:', user.email);
      
      try {
        const updatedUser = await apiService.updateProfile(profileData);
        updateUser(updatedUser);
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      } catch (profileError) {
        // If profile update fails with 403, try refreshing token and retry
        if (profileError.status === 403) {
          console.log('Profile update failed with 403, attempting token refresh...');
          const refreshSuccess = await apiService.refreshToken();
          if (refreshSuccess) {
            console.log('Token refreshed, retrying profile update...');
            const retryUpdatedUser = await apiService.updateProfile(profileData);
            updateUser(retryUpdatedUser);
            setIsEditing(false);
            toast.success('Profile updated successfully!');
          } else {
            throw new Error('Authentication failed. Please login again.');
          }
        } else {
          throw profileError;
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.status === 403) {
        toast.error('Authentication failed. Please login again.');
      } else {
        toast.error(error.message || 'Failed to update profile. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Change password
  const handleChangePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.new_password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    try {
      setIsLoading(true);
      
      try {
        await apiService.changePassword({
          current_password: passwordData.current_password,
          new_password: passwordData.new_password
        });
        setIsChangingPassword(false);
        setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
        toast.success('Password changed successfully!');
      } catch (passwordError) {
        // If password change fails with 403, try refreshing token and retry
        if (passwordError.status === 403) {
          console.log('Password change failed with 403, attempting token refresh...');
          const refreshSuccess = await apiService.refreshToken();
          if (refreshSuccess) {
            console.log('Token refreshed, retrying password change...');
            await apiService.changePassword({
              current_password: passwordData.current_password,
              new_password: passwordData.new_password
            });
            setIsChangingPassword(false);
            setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
            toast.success('Password changed successfully!');
          } else {
            throw new Error('Authentication failed. Please login again.');
          }
        } else {
          throw passwordError;
        }
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.message || 'Failed to change password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false);
    setProfileData({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      location: user?.location || '',
      business_name: user?.business_name || '',
      profile_image: user?.profile_image || ''
    });
  };

  // Cancel password change
  const handleCancelPasswordChange = () => {
    setIsChangingPassword(false);
    setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
  };

  return (
    <div>
      <div className="p-4 space-y-6 lg:p-6 lg:space-y-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-gray-800">Profile Information</h2>
            {!isEditing && !isChangingPassword && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Edit3 size={16} />
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          <div className="text-center">
            <div className="relative w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 lg:w-32 lg:h-32 overflow-hidden">
              {profileData.profile_image ? (
                <img 
                  src={profileData.profile_image} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={40} className="text-green-600 lg:w-14 lg:h-14" />
              )}
              {isEditing && (
                <button className="absolute bottom-0 right-0 bg-green-500 text-white rounded-full p-1 hover:bg-green-600 transition-colors">
                  <Camera size={12} />
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      value={profileData.first_name}
                      onChange={(e) => handleProfileChange('first_name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={profileData.last_name}
                      onChange={(e) => handleProfileChange('last_name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => handleProfileChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => handleProfileChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                  <input
                    type="text"
                    value={profileData.business_name}
                    onChange={(e) => handleProfileChange('business_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    <Save size={16} />
                    <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <X size={16} />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="font-semibold text-gray-800 text-xl lg:text-2xl">
                  {user?.first_name} {user?.last_name}
                </h2>
                <div className="space-y-2 mt-3">
                  <div className="flex items-center justify-center space-x-2 text-gray-600">
                    <Mail size={16} />
                    <span className="text-sm lg:text-lg">{user?.email}</span>
                  </div>
                  {user?.phone && (
                    <div className="flex items-center justify-center space-x-2 text-gray-600">
                      <Phone size={16} />
                      <span className="text-sm lg:text-lg">{user.phone}</span>
                    </div>
                  )}
                  {user?.location && (
                    <div className="flex items-center justify-center space-x-2 text-gray-600">
                      <MapPin size={16} />
                      <span className="text-sm lg:text-lg">{user.location}</span>
                    </div>
                  )}
                  {user?.business_name && (
                    <div className="flex items-center justify-center space-x-2 text-blue-600">
                      <Building size={16} />
                      <span className="text-sm lg:text-lg">{user.business_name}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-center space-x-2 mt-4">
                  <span className="text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm lg:text-base lg:px-4 lg:py-2">
                    Active Community Member
                  </span>
                  <span className="text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full text-sm lg:text-base lg:px-4 lg:py-2">
                    🌱 Eco Warrior
                  </span>
                </div>
              </div>
            )}
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

        {/* Password Change Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-gray-800">Security Settings</h3>
            {!isChangingPassword && !isEditing && (
              <button
                onClick={() => setIsChangingPassword(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Eye size={16} />
                <span>Change Password</span>
              </button>
            )}
          </div>

          {isChangingPassword ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwordData.current_password}
                    onChange={(e) => handlePasswordChange('current_password', e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwordData.new_password}
                    onChange={(e) => handlePasswordChange('new_password', e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters long</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirm_password}
                  onChange={(e) => handlePasswordChange('confirm_password', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleChangePassword}
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  <Save size={16} />
                  <span>{isLoading ? 'Changing...' : 'Change Password'}</span>
                </button>
                <button
                  onClick={handleCancelPasswordChange}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <X size={16} />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-600">
              <p className="text-sm">Keep your account secure with a strong password</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
