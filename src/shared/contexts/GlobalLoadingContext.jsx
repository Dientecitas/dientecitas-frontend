import React, { createContext, useContext, useReducer, useCallback } from 'react';

const GlobalLoadingContext = createContext();

const initialState = {
  operations: {},
  globalOverlay: {
    visible: false,
    message: '',
    cancelable: false,
    progress: null
  }
};

const globalLoadingReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_OPERATION':
      return {
        ...state,
        operations: {
          ...state.operations,
          [action.payload.key]: {
            priority: action.payload.priority || 0,
            timestamp: Date.now()
          }
        }
      };

    case 'REMOVE_OPERATION':
      const { [action.payload]: removed, ...remainingOperations } = state.operations;
      return {
        ...state,
        operations: remainingOperations
      };

    case 'SHOW_GLOBAL_OVERLAY':
      return {
        ...state,
        globalOverlay: {
          visible: true,
          message: action.payload.message || 'Cargando...',
          cancelable: action.payload.cancelable || false,
          progress: action.payload.progress || null
        }
      };

    case 'HIDE_GLOBAL_OVERLAY':
      return {
        ...state,
        globalOverlay: {
          ...state.globalOverlay,
          visible: false
        }
      };

    case 'UPDATE_OVERLAY_PROGRESS':
      return {
        ...state,
        globalOverlay: {
          ...state.globalOverlay,
          progress: action.payload
        }
      };

    default:
      return state;
  }
};

export const GlobalLoadingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(globalLoadingReducer, initialState);

  const addLoadingOperation = useCallback((key, priority = 0) => {
    dispatch({
      type: 'ADD_OPERATION',
      payload: { key, priority }
    });
  }, []);

  const removeLoadingOperation = useCallback((key) => {
    dispatch({
      type: 'REMOVE_OPERATION',
      payload: key
    });
  }, []);

  const showGlobalOverlay = useCallback((message, cancelable = false, progress = null) => {
    dispatch({
      type: 'SHOW_GLOBAL_OVERLAY',
      payload: { message, cancelable, progress }
    });
  }, []);

  const hideGlobalOverlay = useCallback(() => {
    dispatch({ type: 'HIDE_GLOBAL_OVERLAY' });
  }, []);

  const updateOverlayProgress = useCallback((progress) => {
    dispatch({
      type: 'UPDATE_OVERLAY_PROGRESS',
      payload: progress
    });
  }, []);

  const globalLoading = Object.keys(state.operations).length > 0;
  const isGlobalOverlayVisible = state.globalOverlay.visible;
  const globalOverlayMessage = state.globalOverlay.message;

  const value = {
    globalLoading,
    addLoadingOperation,
    removeLoadingOperation,
    showGlobalOverlay,
    hideGlobalOverlay,
    updateOverlayProgress,
    isGlobalOverlayVisible,
    globalOverlayMessage,
    globalOverlayProgress: state.globalOverlay.progress,
    globalOverlayCancelable: state.globalOverlay.cancelable,
    operationsCount: Object.keys(state.operations).length
  };

  return (
    <GlobalLoadingContext.Provider value={value}>
      {children}
    </GlobalLoadingContext.Provider>
  );
};

export const useGlobalLoading = () => {
  const context = useContext(GlobalLoadingContext);
  if (!context) {
    throw new Error('useGlobalLoading debe ser usado dentro de GlobalLoadingProvider');
  }
  return context;
};

export default GlobalLoadingContext;