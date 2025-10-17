import React from 'react';
import Toast from './Toast';
import useToast from '../../hooks/useToast';

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className="pointer-events-auto"
          style={{
            position: 'fixed',
            top: `${20 + index * 80}px`,
            right: '20px',
            zIndex: 50 + index
          }}
        >
          <Toast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
            position="custom"
          />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;





















