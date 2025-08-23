import { useState, useCallback, useRef } from 'react';

export const usePreventDoubleClick = (options = {}) => {
  const {
    delay = 1000,
    onError,
    resetOnError = true
  } = options;

  const [isProcessing, setIsProcessing] = useState(false);
  const lastClickRef = useRef(0);
  const timeoutRef = useRef(null);

  const reset = useCallback(() => {
    setIsProcessing(false);
    lastClickRef.current = 0;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const handleClick = useCallback(async (fn) => {
    const now = Date.now();
    
    // Check if still processing
    if (isProcessing) {
      return;
    }

    // Check if within delay period
    if (now - lastClickRef.current < delay) {
      return;
    }

    lastClickRef.current = now;
    setIsProcessing(true);

    try {
      await fn();
    } catch (error) {
      if (onError) {
        onError(error);
      }
      
      if (resetOnError) {
        reset();
        throw error;
      }
      
      throw error;
    } finally {
      // Set timeout to reset processing state
      timeoutRef.current = setTimeout(() => {
        setIsProcessing(false);
      }, Math.max(delay, 100));
    }
  }, [delay, isProcessing, onError, resetOnError, reset]);

  return {
    handleClick,
    isProcessing,
    reset
  };
};

export default usePreventDoubleClick;