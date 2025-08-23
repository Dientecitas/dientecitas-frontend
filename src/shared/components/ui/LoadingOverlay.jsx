import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const LoadingOverlay = ({
  visible,
  message = 'Cargando...',
  description,
  spinner = 'circle',
  customSpinner,
  backdrop = 'blur',
  size = 'md',
  cancelable = false,
  onCancel,
  progress,
  container,
  portal = true,
  className = ''
}) => {
  // Handle escape key
  useEffect(() => {
    if (!visible || !cancelable) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape' && onCancel) {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [visible, cancelable, onCancel]);

  // Prevent body scroll when overlay is visible
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [visible]);

  if (!visible) return null;

  const backdropClasses = {
    blur: 'backdrop-blur-sm bg-black/30',
    dark: 'bg-black/50',
    transparent: 'bg-black/10'
  };

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg'
  };

  const overlayContent = (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${backdropClasses[backdrop]} ${className}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="loading-title"
      aria-describedby="loading-description"
    >
      <div className={`bg-white rounded-lg shadow-xl p-6 ${sizeClasses[size]} w-full relative`}>
        {/* Cancel button */}
        {cancelable && onCancel && (
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cancelar"
          >
            <X size={20} />
          </button>
        )}

        {/* Content */}
        <div className="text-center">
          {/* Spinner */}
          <div className="mb-4 flex justify-center">
            {customSpinner || (
              <LoadingSpinner 
                type={spinner} 
                size="lg" 
                color="primary" 
              />
            )}
          </div>

          {/* Message */}
          <h3 
            id="loading-title"
            className="text-lg font-medium text-gray-900 mb-2"
          >
            {message}
          </h3>

          {/* Description */}
          {description && (
            <p 
              id="loading-description"
              className="text-sm text-gray-600 mb-4"
            >
              {description}
            </p>
          )}

          {/* Progress bar */}
          {typeof progress === 'number' && (
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
              <div className="text-xs text-gray-600 mt-1">
                {Math.round(progress)}%
              </div>
            </div>
          )}

          {/* Cancel button (bottom) */}
          {cancelable && onCancel && (
            <button
              onClick={onCancel}
              className="mt-4 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Render in portal or directly
  if (portal) {
    const portalContainer = container || document.body;
    return createPortal(overlayContent, portalContainer);
  }

  return overlayContent;
};

export default LoadingOverlay;