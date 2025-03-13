import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';

interface ToastProps {
  message: string;
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> & { show: (message: string, duration?: number) => void } = 
({ message, duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const toastStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '20px',
    left: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '12px 16px',
    backgroundColor: 'green',
    color: 'white',
    borderRadius: '4px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
    zIndex: 9999, 
  };

  const closeButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    padding: '0',
    display: 'flex',
  };

  return (
    <div style={toastStyle}>
      <span>{message}</span>
      <button 
        style={closeButtonStyle}
        onClick={onClose}
        aria-label="Close"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
  );
};

Toast.show = (message: string, duration?: number) => {
  const toastContainer = document.createElement('div');
  document.body.appendChild(toastContainer);

  const root = createRoot(toastContainer);
  
  const handleClose = () => {
    root.unmount();
    document.body.removeChild(toastContainer);
  };

  root.render(<Toast message={message} duration={duration} onClose={handleClose} />);
};

export default Toast;