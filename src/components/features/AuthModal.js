import React, { useState } from 'react';
import { X, User, Mail, Lock, Eye, EyeOff, LogIn, UserPlus, Phone, Smartphone } from 'lucide-react';

const AuthModal = ({ isOpen, onClose, mode, onModeChange, onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: ''
  });
  const [loginMethod, setLoginMethod] = useState('email'); // 'email', 'phone', 'gmail'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (mode === 'signup' && !formData.role) {
      newErrors.role = 'Please select your role';
    }

    if (mode === 'signup') {
      if (loginMethod === 'email') {
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Email is invalid';
        }
      } else if (loginMethod === 'phone') {
        if (!formData.phone.trim()) {
          newErrors.phone = 'Phone number is required';
        } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone)) {
          newErrors.phone = 'Phone number is invalid';
        }
      }
    } else {
      // For login, validate based on login method
      if (loginMethod === 'email') {
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Email is invalid';
        }
      } else if (loginMethod === 'phone') {
        if (!formData.phone.trim()) {
          newErrors.phone = 'Phone number is required';
        } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone)) {
          newErrors.phone = 'Phone number is invalid';
        }
      }
    }

    if (loginMethod !== 'gmail') {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }

      if (mode === 'signup' && loginMethod !== 'gmail') {
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Simulate authentication
      const userData = {
        id: Date.now(),
        username: formData.username,
        email: loginMethod === 'email' ? formData.email : null,
        phone: loginMethod === 'phone' ? formData.phone : null,
        loginMethod: loginMethod,
        profilePicture: null,
        role: formData.role || 'user',
        joinDate: new Date().toISOString()
      };

      onLogin(userData);
      
      // Reset form
      setFormData({
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: ''
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden my-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                {mode === 'login' ? <LogIn size={24} /> : <UserPlus size={24} />}
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {mode === 'login' ? 'Welcome Back!' : 'Join KindBite'}
                </h2>
                <p className="text-green-100 text-sm">
                  {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors duration-300"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-6">
          {/* Login Method Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Sign in with:</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setLoginMethod('email')}
                className={`p-3 rounded-xl border-2 transition-all duration-300 flex items-center justify-center space-x-2 ${
                  loginMethod === 'email' 
                    ? 'border-green-500 bg-green-50 text-green-700' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Mail size={16} />
                <span className="text-sm font-medium">Email</span>
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('phone')}
                className={`p-3 rounded-xl border-2 transition-all duration-300 flex items-center justify-center space-x-2 ${
                  loginMethod === 'phone' 
                    ? 'border-green-500 bg-green-50 text-green-700' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Phone size={16} />
                <span className="text-sm font-medium">Phone</span>
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('gmail')}
                className={`p-3 rounded-xl border-2 transition-all duration-300 flex items-center justify-center space-x-2 ${
                  loginMethod === 'gmail' 
                    ? 'border-green-500 bg-green-50 text-green-700' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Smartphone size={16} />
                <span className="text-sm font-medium">Gmail</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors duration-300 ${
                    errors.username ? 'border-red-500' : 'border-gray-200 focus:border-green-500'
                  }`}
                  placeholder="Enter your username"
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>

            {/* Email/Phone Input */}
            {(mode === 'signup' || (mode === 'login' && loginMethod !== 'gmail')) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {loginMethod === 'email' ? 'Email' : 'Phone Number'}
                </label>
                <div className="relative">
                  {loginMethod === 'email' ? (
                    <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  ) : (
                    <Phone size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  )}
                  <input
                    type={loginMethod === 'email' ? 'email' : 'tel'}
                    name={loginMethod === 'email' ? 'email' : 'phone'}
                    value={loginMethod === 'email' ? formData.email : formData.phone}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors duration-300 ${
                      errors[loginMethod === 'email' ? 'email' : 'phone'] ? 'border-red-500' : 'border-gray-200 focus:border-green-500'
                    }`}
                    placeholder={loginMethod === 'email' ? 'Enter your email' : 'Enter your phone number'}
                  />
                </div>
                {errors[loginMethod === 'email' ? 'email' : 'phone'] && (
                  <p className="text-red-500 text-sm mt-1">{errors[loginMethod === 'email' ? 'email' : 'phone']}</p>
                )}
              </div>
            )}

            {/* Gmail Sign-in Button */}
            {loginMethod === 'gmail' && (
              <div>
                <button
                  type="button"
                  className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors duration-300 flex items-center justify-center space-x-2"
                >
                  <Smartphone size={20} />
                  <span>Continue with Gmail</span>
                </button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  You'll be redirected to Google for authentication
                </p>
              </div>
            )}

            {/* Password - Only show when not using Gmail */}
            {loginMethod !== 'gmail' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl focus:outline-none transition-colors duration-300 ${
                      errors.password ? 'border-red-500' : 'border-gray-200 focus:border-green-500'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>
            )}

            {/* Role Selection (Signup only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What's your role?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'cafe', label: 'Cafe', icon: '☕' },
                    { value: 'restaurant', label: 'Restaurant', icon: '🍽️' },
                    { value: 'retail', label: 'Retail Shop', icon: '🏪' },
                    { value: 'bakery', label: 'Bakery', icon: '🥖' },
                    { value: 'grocery', label: 'Grocery Store', icon: '🛒' },
                    { value: 'hotel', label: 'Hotel', icon: '🏨' }
                  ].map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, role: role.value }))}
                      className={`p-3 rounded-xl border-2 transition-all duration-300 flex items-center justify-center space-x-2 ${
                        formData.role === role.value
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-lg">{role.icon}</span>
                      <span className="text-sm font-medium">{role.label}</span>
                    </button>
                  ))}
                </div>
                {errors.role && (
                  <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                )}
              </div>
            )}

            {/* Confirm Password (Signup only and not Gmail) */}
            {mode === 'signup' && loginMethod !== 'gmail' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl focus:outline-none transition-colors duration-300 ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-200 focus:border-green-500'
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Mode Toggle */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
            </p>
            <button
              onClick={() => onModeChange(mode === 'login' ? 'signup' : 'login')}
              className="text-green-600 hover:text-green-700 font-semibold mt-1"
            >
              {mode === 'login' ? 'Sign up here' : 'Sign in here'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
