import { useState, useCallback, useRef } from 'react';

export const useLoading = (initialStates = {}) => {
  const [loadingStates, setLoadingStates] = useState(initialStates);
  const timeoutsRef = useRef({});

  const setLoading = useCallback((key, loading) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: loading
    }));

    // Clear timeout if exists
    if (timeoutsRef.current[key]) {
      clearTimeout(timeoutsRef.current[key]);
      delete timeoutsRef.current[key];
    }

    // Auto-cleanup after 30 seconds to prevent memory leaks
    if (loading) {
      timeoutsRef.current[key] = setTimeout(() => {
        setLoadingStates(prev => ({
          ...prev,
          [key]: false
        }));
        delete timeoutsRef.current[key];
      }, 30000);
    }
  }, []);

  const startLoading = useCallback((key) => {
    setLoading(key, true);
  }, [setLoading]);

  const stopLoading = useCallback((key) => {
    setLoading(key, false);
  }, [setLoading]);

  const isLoading = useCallback((key) => {
    if (!key) {
      return Object.values(loadingStates).some(Boolean);
    }
    return Boolean(loadingStates[key]);
  }, [loadingStates]);

  const withLoading = useCallback(async (key, fn) => {
    startLoading(key);
    try {
      const result = await fn();
      return result;
    } catch (error) {
      throw error;
    } finally {
      stopLoading(key);
    }
  }, [startLoading, stopLoading]);

  const clearAll = useCallback(() => {
    // Clear all timeouts
    Object.values(timeoutsRef.current).forEach(clearTimeout);
    timeoutsRef.current = {};
    
    // Clear all loading states
    setLoadingStates({});
  }, []);

  return {
    isLoading,
    setLoading,
    startLoading,
    stopLoading,
    withLoading,
    loadingStates,
    clearAll
  };
};

export default useLoading;