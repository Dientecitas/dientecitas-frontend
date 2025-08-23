import React, { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

const LoadingButton = ({
  children,
  loading = false,
  disabled = false,
  loadingText,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  fullWidth = false,
  autoDisableTimeout = 0,
  showSuccessState = false,
  showErrorState = false,
  className = '',
  ...props
}) => {
  const [internalState, setInternalState] = useState('idle'); // idle, loading, success, error
  const [autoDisabled, setAutoDisabled] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const isLoading = loading || isProcessing || internalState === 'loading';
  const isDisabled = disabled || isLoading || autoDisabled;

  // Auto-disable timeout
  useEffect(() => {
    if (autoDisableTimeout > 0 && isLoading) {
      const timer = setTimeout(() => {
        setAutoDisabled(true);
        setTimeout(() => setAutoDisabled(false), autoDisableTimeout);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading, autoDisableTimeout]);

  // Handle success state
  useEffect(() => {
    if (showSuccessState && !loading && internalState === 'loading') {
      setInternalState('success');
      setTimeout(() => setInternalState('idle'), 2000);
    }
  }, [loading, showSuccessState, internalState]);

  // Reset internal state when external loading changes
  useEffect(() => {
    if (!loading && internalState === 'loading') {
      setInternalState('idle');
    }
  }, [loading, internalState]);

  const handleButtonClick = async (e) => {
    if (!onClick || isDisabled) return;

    // Prevent double clicks
    const now = Date.now();
    if (isProcessing) return;

    setIsProcessing(true);
    setInternalState('loading');
    
    try {
      await onClick(e);
      
      if (showSuccessState) {
        setInternalState('success');
        setTimeout(() => setInternalState('idle'), 2000);
      } else {
        setInternalState('idle');
      }
    } catch (error) {
      if (showErrorState) {
        setInternalState('error');
        setTimeout(() => setInternalState('idle'), 3000);
      } else {
        setInternalState('idle');
      }
      throw error;
    } finally {
      // Reset processing state after a short delay to prevent double clicks
      setTimeout(() => {
        setIsProcessing(false);
      }, 500);
    }
  };

  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 relative overflow-hidden';
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 disabled:bg-blue-400',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800 focus:ring-gray-500 disabled:bg-gray-100',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 disabled:bg-green-400',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 disabled:bg-red-400',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-blue-500 disabled:bg-gray-100',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500 disabled:text-gray-400'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };

  const stateVariants = {
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white'
  };

  const currentVariant = internalState === 'success' || internalState === 'error' 
    ? stateVariants[internalState] 
    : variants[variant];

  const disabledClasses = isDisabled 
    ? 'opacity-60 cursor-not-allowed' 
    : 'cursor-pointer';

  const widthClasses = fullWidth ? 'w-full' : '';

  const buttonClasses = `${baseClasses} ${currentVariant} ${sizes[size]} ${disabledClasses} ${widthClasses} ${className}`;

  const getDisplayContent = () => {
    if (internalState === 'success') {
      return (
        <>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Éxito
        </>
      );
    }

    if (internalState === 'error') {
      return (
        <>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Error
        </>
      );
    }

    if (isLoading) {
      return (
        <>
          <LoadingSpinner 
            type="circle" 
            size={size === 'sm' ? 'xs' : 'sm'} 
            color="white" 
          />
          {loadingText && <span className="ml-2">{loadingText}</span>}
        </>
      );
    }

    return (
      <>
        {icon && iconPosition === 'left' && (
          <span className="mr-2">{icon}</span>
        )}
        {children}
        {icon && iconPosition === 'right' && (
          <span className="ml-2">{icon}</span>
        )}
      </>
    );
  };

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={isDisabled}
      onClick={handleButtonClick}
      {...props}
    >
      {getDisplayContent()}
    </button>
  );
};

export default LoadingButton;