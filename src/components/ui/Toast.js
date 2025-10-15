import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ 
  message, 
  type = 'info', 
  duration = 5000, 
  onClose,
  position = 'top-right' 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Start animation after mount
    setTimeout(() => setIsAnimating(true), 10);

    // Auto close after duration
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStyles = () => {
    const baseStyles = "flex items-start space-x-3 p-4 rounded-lg shadow-lg border max-w-sm w-full transition-all duration-300 ease-in-out";
    
    const typeStyles = {
      success: "bg-green-50 border-green-200 text-green-800",
      error: "bg-red-50 border-red-200 text-red-800",
      warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
      info: "bg-blue-50 border-blue-200 text-blue-800"
    };

    const positionStyles = {
      'top-right': `fixed top-4 right-4 z-50 ${isAnimating ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`,
      'top-left': `fixed top-4 left-4 z-50 ${isAnimating ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`,
      'bottom-right': `fixed bottom-4 right-4 z-50 ${isAnimating ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`,
      'bottom-left': `fixed bottom-4 left-4 z-50 ${isAnimating ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`,
      'top-center': `fixed top-4 left-1/2 transform -translate-x-1/2 z-50 ${isAnimating ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`,
      'bottom-center': `fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 ${isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`
    };

    return `${baseStyles} ${typeStyles[type]} ${positionStyles[position]}`;
  };

  return (
    <div className={getStyles()}>
      {getIcon()}
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button
        onClick={handleClose}
        className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;




















