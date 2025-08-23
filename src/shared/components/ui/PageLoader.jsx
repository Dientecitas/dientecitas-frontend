import React, { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import Button from './Button';

const PageLoader = ({
  message = 'Cargando página...',
  description,
  timeout = 10000,
  onTimeout,
  onRetry,
  showLogo = true,
  className = ''
}) => {
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (timeout <= 0) return;

    const timer = setTimeout(() => {
      setHasTimedOut(true);
      onTimeout?.();
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout, onTimeout, retryCount]);

  const handleRetry = () => {
    setHasTimedOut(false);
    setRetryCount(prev => prev + 1);
    onRetry?.();
  };

  if (hasTimedOut) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-gray-50 ${className}`}>
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mb-6">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Error de carga
            </h2>
            <p className="text-gray-600">
              La página está tardando más de lo esperado en cargar.
            </p>
          </div>

          <Button
            onClick={handleRetry}
            variant="primary"
            icon={<RefreshCw className="w-4 h-4" />}
          >
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gray-50 ${className}`}>
      <div className="text-center max-w-md mx-auto p-6">
        {/* Logo */}
        {showLogo && (
          <div className="mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Dientecitas</h1>
          </div>
        )}

        {/* Loading spinner */}
        <div className="mb-6">
          <LoadingSpinner type="circle" size="lg" color="primary" />
        </div>

        {/* Message */}
        <h2 className="text-lg font-medium text-gray-900 mb-2">
          {message}
        </h2>

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-600 mb-4">
            {description}
          </p>
        )}

        {/* Progress indicator */}
        <div className="flex justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1.4s'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageLoader;