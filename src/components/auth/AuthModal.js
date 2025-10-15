import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthModal = ({ isOpen, onClose, onLogin, onRegister, initialMode = 'login' }) => {
  const [isLoginMode, setIsLoginMode] = useState(initialMode === 'login');
  const [isLoading, setIsLoading] = useState(false);

  // Update mode when initialMode prop changes
  useEffect(() => {
    setIsLoginMode(initialMode === 'login');
  }, [initialMode]);

  // Defensive check for onClose function
  const handleClose = () => {
    if (typeof onClose === 'function') {
      onClose();
    } else {
      console.warn('onClose function is not defined');
    }
  };

  if (!isOpen) return null;

  const handleLogin = async (loginData) => {
    setIsLoading(true);
    try {
      await onLogin(loginData);
      handleClose();
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
      handleClose();
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
            onClose={handleClose}
          />
        ) : (
          <RegisterForm
            onRegister={handleRegister}
            onSwitchToLogin={switchToLogin}
            isLoading={isLoading}
            onClose={handleClose}
          />
        )}
      </div>
    </div>
  );
};

export default AuthModal;
