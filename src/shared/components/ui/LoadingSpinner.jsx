import React from 'react';

const LoadingSpinner = ({ 
  type = 'circle', 
  size = 'md', 
  color = 'primary', 
  speed = 'normal',
  className = '' 
}) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    white: 'text-white',
    gray: 'text-gray-400',
    success: 'text-green-600',
    danger: 'text-red-600'
  };

  const speedClasses = {
    slow: 'animate-spin-slow',
    normal: 'animate-spin',
    fast: 'animate-spin-fast'
  };

  const baseClasses = `${sizeClasses[size]} ${colorClasses[color]} ${speedClasses[speed]} ${className}`;

  const renderSpinner = () => {
    switch (type) {
      case 'dots':
        return (
          <div className={`flex space-x-1 ${className}`} role="status" aria-label="Cargando">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`${sizeClasses[size]} ${colorClasses[color]} bg-current rounded-full animate-pulse`}
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1.4s'
                }}
              />
            ))}
          </div>
        );

      case 'bars':
        return (
          <div className={`flex space-x-1 ${className}`} role="status" aria-label="Cargando">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-1 ${sizeClasses[size].split(' ')[1]} ${colorClasses[color]} bg-current animate-pulse`}
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '1.2s'
                }}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <div
            className={`${baseClasses} bg-current rounded-full animate-pulse`}
            role="status"
            aria-label="Cargando"
          />
        );

      case 'ring':
        return (
          <div
            className={`${baseClasses} border-2 border-current border-t-transparent rounded-full`}
            role="status"
            aria-label="Cargando"
          />
        );

      case 'circle':
      default:
        return (
          <svg
            className={baseClasses}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            role="status"
            aria-label="Cargando"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        );
    }
  };

  return renderSpinner();
};

export default LoadingSpinner;