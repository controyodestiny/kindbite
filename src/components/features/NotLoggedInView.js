import React, { useState, useEffect } from 'react';
import { Heart, Lock, User, ArrowRight, Sparkles } from 'lucide-react';

const NotLoggedInView = ({ onLoginClick, onSignupClick }) => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  const messages = [
    "Welcome to KindBite! 🌟",
    "Please sign in to continue",
    "Join our food rescue community",
    "Let's make a difference together! 💚"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % messages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  console.log('NotLoggedInView rendering with props:', { onLoginClick, onSignupClick });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-6 pt-20 overflow-y-auto">
      <div className="max-w-md w-full text-center">
        {/* Animated Lock Icon */}
        <div className="relative mb-12 p-8 pt-12">
          <div className={`w-32 h-32 mx-auto bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-2xl transform transition-all duration-1000 ${
            isAnimating ? 'scale-105' : 'scale-100'
          }`}>
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

        {/* Animated Message */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold text-gray-800 mb-4 transform transition-all duration-1000 ${
            isAnimating ? 'translate-y-8 opacity-0' : 'translate-y-0 opacity-100'
          }`}>
            {messages[currentMessage]}
          </h1>
          
          <div className="flex justify-center space-x-1 mb-6">
            {messages.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentMessage ? 'bg-green-500 scale-125' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <p className="text-gray-600 text-lg leading-relaxed">
            Sign in to access all features and join our amazing community of food rescuers! 🍽️
          </p>
        </div>

        {/* Cute Features Preview */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-lg transform hover:scale-105 transition-all duration-300">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Heart size={24} className="text-green-500" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Rescue Food</h3>
            <p className="text-sm text-gray-600">Save meals from waste</p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-lg transform hover:scale-105 transition-all duration-300">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Sparkles size={24} className="text-blue-500" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Earn Points</h3>
            <p className="text-sm text-gray-600">Get rewarded for helping</p>
          </div>
        </div>

        {/* Login and Signup Buttons */}
        <div className="flex flex-col gap-4 justify-center mb-8">
          <button
            onClick={() => {
              console.log('Login button clicked');
              if (onLoginClick) onLoginClick();
            }}
            className="group bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3 w-full"
          >
            <User size={20} />
            <span>Login</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
          </button>
          
          <button
            onClick={() => {
              console.log('Signup button clicked');
              if (onSignupClick) onSignupClick();
            }}
            className="group bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3 w-full"
          >
            <User size={20} />
            <span>Sign In</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>

        {/* Fun Facts */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/50 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 font-medium">
              Join 10,000+ food rescuers worldwide! 🌍
            </span>
          </div>
        </div>

        {/* Animated Background Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
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
