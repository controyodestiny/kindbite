import React, { useState } from 'react';
import { X } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthModal = ({ isOpen, onClose, onLogin, onRegister }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (loginData) => {
    setIsLoading(true);
    try {
      await onLogin(loginData);
      onClose();
    } catch (error) {
      console.error('Login error:', error);
      // Error toast is handled in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (registerData) => {
    setIsLoading(true);
    try {
      await onRegister(registerData);
      onClose();
    } catch (error) {
      console.error('Registration error:', error);
      // Error toast is handled in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const switchToLogin = () => {
    setIsLoginMode(true);
  };

  const switchToRegister = () => {
    setIsLoginMode(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div 
        className="relative w-full max-w-2xl sm:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto scrollbar-hide"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitScrollbar: { display: 'none' }
        }}
      >
        {isLoginMode ? (
          <LoginForm
            onLogin={handleLogin}
            onSwitchToRegister={switchToRegister}
            isLoading={isLoading}
            onClose={onClose}
          />
        ) : (
          <RegisterForm
            onRegister={handleRegister}
            onSwitchToLogin={switchToLogin}
            isLoading={isLoading}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
};

export default AuthModal;
