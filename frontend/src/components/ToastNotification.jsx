import React, { useEffect, useState } from 'react';

const ToastNotification = ({ message, type = 'success', onClose, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'from-[#00BFA6] to-[#2962FF] border-[#00BFA6]/40';
      case 'levelup':
        return 'from-[#FFD54F] to-[#FF6B6B] border-[#FFD54F]/40 animate-pulse';
      case 'achievement':
        return 'from-[#BB86FC] to-[#2962FF] border-[#BB86FC]/40';
      default:
        return 'from-[#00BFA6] to-[#2962FF] border-[#00BFA6]/40';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'levelup':
        return '🚀';
      case 'achievement':
        return '🏆';
      default:
        return '✨';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div 
        className={`bg-gradient-to-r ${getToastStyles()} backdrop-blur-lg border-2 rounded-2xl p-4 shadow-2xl transform transition-all duration-300 ${
          isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
        } hover:-translate-y-1`}
      >
        <div className="flex items-center space-x-3">
          <div className="text-2xl animate-bounce">
            {getIcon()}
          </div>
          <div>
            <p className="text-white font-semibold">
              {message}
            </p>
            {type === 'levelup' && (
              <div className="flex space-x-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i}
                    className="w-1 h-1 bg-[#FFD54F] rounded-full animate-ping"
                    style={{ animationDelay: `${i * 100}ms` }}
                  />
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => {
              setIsExiting(true);
              setTimeout(() => {
                setIsVisible(false);
                onClose();
              }, 300);
            }}
            className="text-white/70 hover:text-white transition-colors duration-300"
          >
            ✕
          </button>
        </div>

        {/* Confetti Effect for Level Up */}
        {type === 'levelup' && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-[#FFD54F] animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 1000}ms`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ToastNotification;