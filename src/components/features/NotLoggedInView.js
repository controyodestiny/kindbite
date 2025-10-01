import React from 'react';
import { Heart, Lock, User, ArrowRight, Sparkles } from 'lucide-react';

const NotLoggedInView = ({ onLoginClick, onSignupClick }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-6 pt-20 overflow-y-auto">
      <div className="max-w-md w-full text-center">
        {/* Animated Lock Icon */}
        <div className="relative mb-12 p-8 pt-12">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-2xl transform transition-all duration-1000">
            <Lock size={40} className="text-white" />
          </div>
          
          {/* Floating Hearts */}
          <div className="absolute top-4 right-4 animate-bounce">
            <Heart size={20} className="text-red-400 fill-current" />
          </div>
          <div className="absolute bottom-4 left-4 animate-bounce" style={{ animationDelay: '0.5s' }}>
            <Heart size={16} className="text-pink-400 fill-current" />
          </div>
          <div className="absolute top-8 left-2 animate-bounce" style={{ animationDelay: '1s' }}>
            <Heart size={14} className="text-purple-400 fill-current" />
          </div>
        </div>

        {/* Welcome Message */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-4">
            Welcome to <span className="text-green-600">KindBite</span>
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Your journey to a sustainable and delicious future starts here.
          </p>
        </div>

        {/* Login and Signup Buttons */}
        <div className="flex flex-col gap-4 justify-center mb-8">
          <button
            onClick={onLoginClick}
            className="group bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3 w-full"
          >
            <User size={20} />
            <span>Login</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
          </button>
          
          <button
            onClick={onSignupClick}
            className="group bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3 w-full"
          >
            <User size={20} />
            <span>Sign Up</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Free Food</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Reduce Waste</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>Help Community</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span>Save Money</span>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-10 w-4 h-4 bg-green-300 rounded-full animate-ping opacity-20"></div>
          <div className="absolute top-40 right-20 w-6 h-6 bg-blue-300 rounded-full animate-ping opacity-20" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-40 left-20 w-3 h-3 bg-purple-300 rounded-full animate-ping opacity-20" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 right-10 w-5 h-5 bg-pink-300 rounded-full animate-ping opacity-20" style={{ animationDelay: '0.5s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default NotLoggedInView;