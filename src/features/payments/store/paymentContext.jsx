import React, { createContext, useContext, useReducer, useEffect } from 'react';

const PaymentContext = createContext();

// Estados iniciales
const initialState = {
  // Datos
  payments: [],
  selectedPayment: null,
  stats: null,
  
  // Paginación
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  },
  
  // Filtros
  filters: {
    search: '',
    dateFrom: '',
    dateTo: '',
    status: [],
    paymentMethods: [],
    gateways: [],
    amountMin: '',
    amountMax: '',
    currencies: [],
    hasInsurance: null,
    hasInstallments: null,
    hasRefunds: null,
    riskLevels: [],
    patients: [],
    clinics: [],
    dentists: [],
    sortBy: 'createdAt',
    sortOrder: 'desc'
  },
  
  // Estados de carga
  loading: {
    payments: false,
    process: false,
    refund: false,
    verify: false,
    stats: false,
    export: false,
    insurance: false,
    installments: false,
    fraud: false
  },
  
  // Errores
  errors: {
    payments: null,
    process: null,
    refund: null,
    verify: null,
    stats: null,
    export: null,
    insurance: null,
    installments: null,
    fraud: null
  },
  
  // Estados de UI
  ui: {
    viewMode: 'table', // 'table' | 'cards' | 'analytics'
    showFilters: false,
    selectedIds: [],
    modals: {
      process: false,
      refund: false,
      installment: false,
      insurance: false,
      fraud: false,
      detail: false,
      receipt: false
    },
    activeTab: 'all' // 'all' | 'pending' | 'completed' | 'failed'
  },
  
  // Configuración de gateways
  gateways: {
    available: [],
    active: [],
    configuration: {}
  },
  
  // Datos auxiliares
  paymentMethods: [],
  currencies: [],
  insuranceProviders: [],
  installmentOptions: []
};

// Reducer
const paymentReducer = (state, action) => {
  switch (action.type) {
    // Acciones de datos
    case 'SET_PAYMENTS':
      return {
        ...state,
        payments: action.payload.data,
        pagination: action.payload.pagination
      };
    
    case 'ADD_PAYMENT':
      return {
        ...state,
        payments: [action.payload, ...state.payments]
      };
    
    case 'UPDATE_PAYMENT':
      return {
        ...state,
        payments: state.payments.map(payment =>
          payment.id === action.payload.id ? action.payload : payment
        ),
        selectedPayment: state.selectedPayment?.id === action.payload.id 
          ? action.payload 
          : state.selectedPayment
      };
    
    case 'REMOVE_PAYMENT':
      return {
        ...state,
        payments: state.payments.filter(payment => payment.id !== action.payload),
        selectedPayment: state.selectedPayment?.id === action.payload 
          ? null 
          : state.selectedPayment
      };
    
    case 'SET_SELECTED_PAYMENT':
      return {
        ...state,
        selectedPayment: action.payload
      };
    
    case 'SET_STATS':
      return {
        ...state,
        stats: action.payload
      };
    
    // Acciones de filtros
    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      };
    
    case 'CLEAR_FILTERS':
      return {
        ...state,
        filters: {
          ...initialState.filters,
          sortBy: state.filters.sortBy,
          sortOrder: state.filters.sortOrder
        }
      };
    
    case 'SET_PAGINATION':
      return {
        ...state,
        pagination: { ...state.pagination, ...action.payload }
      };
    
    // Acciones de loading
    case 'SET_LOADING':
      return {
        ...state,
        loading: { ...state.loading, [action.payload.key]: action.payload.value }
      };
    
    // Acciones de errores
    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.payload.key]: action.payload.value }
      };
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.payload]: null }
      };
    
    case 'CLEAR_ALL_ERRORS':
      return {
        ...state,
        errors: { ...initialState.errors }
      };
    
    // Acciones de UI
    case 'SET_VIEW_MODE':
      return {
        ...state,
        ui: { ...state.ui, viewMode: action.payload }
      };
    
    case 'TOGGLE_FILTERS':
      return {
        ...state,
        ui: { ...state.ui, showFilters: !state.ui.showFilters }
      };
    
    case 'SET_SELECTED_IDS':
      return {
        ...state,
        ui: { ...state.ui, selectedIds: action.payload }
      };
    
    case 'TOGGLE_MODAL':
      return {
        ...state,
        ui: {
          ...state.ui,
          modals: {
            ...state.ui.modals,
            [action.payload.modal]: action.payload.value
          }
        }
      };
    
    case 'CLOSE_ALL_MODALS':
      return {
        ...state,
        ui: {
          ...state.ui,
          modals: { ...initialState.ui.modals }
        }
      };
    
    case 'SET_ACTIVE_TAB':
      return {
        ...state,
        ui: { ...state.ui, activeTab: action.payload }
      };
    
    // Acciones de gateways
    case 'SET_GATEWAYS':
      return {
        ...state,
        gateways: { ...state.gateways, ...action.payload }
      };
    
    default:
      return state;
  }
};

// Provider
export const PaymentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(paymentReducer, initialState);

  // Cargar configuración desde localStorage
  useEffect(() => {
    const savedFilters = localStorage.getItem('payment-filters');
    if (savedFilters) {
      try {
        const parsedFilters = JSON.parse(savedFilters);
        dispatch({ type: 'SET_FILTERS', payload: parsedFilters });
      } catch (error) {
        console.warn('Error al cargar filtros de pagos:', error);
      }
    }
  }, []);

  // Guardar filtros en localStorage
  useEffect(() => {
    localStorage.setItem('payment-filters', JSON.stringify(state.filters));
  }, [state.filters]);

  // Acciones
  const actions = {
    // Datos
    setPayments: (data, pagination) => {
      dispatch({ type: 'SET_PAYMENTS', payload: { data, pagination } });
    },
    
    addPayment: (payment) => {
      dispatch({ type: 'ADD_PAYMENT', payload: payment });
    },
    
    updatePayment: (payment) => {
      dispatch({ type: 'UPDATE_PAYMENT', payload: payment });
    },
    
    removePayment: (id) => {
      dispatch({ type: 'REMOVE_PAYMENT', payload: id });
    },
    
    setSelectedPayment: (payment) => {
      dispatch({ type: 'SET_SELECTED_PAYMENT', payload: payment });
    },
    
    setStats: (stats) => {
      dispatch({ type: 'SET_STATS', payload: stats });
    },
    
    // Filtros
    setFilters: (filters) => {
      dispatch({ type: 'SET_FILTERS', payload: filters });
    },
    
    clearFilters: () => {
      dispatch({ type: 'CLEAR_FILTERS' });
    },
    
    setPagination: (pagination) => {
      dispatch({ type: 'SET_PAGINATION', payload: pagination });
    },
    
    // Loading
    setLoading: (key, value) => {
      dispatch({ type: 'SET_LOADING', payload: { key, value } });
    },
    
    // Errores
    setError: (key, value) => {
      dispatch({ type: 'SET_ERROR', payload: { key, value } });
    },
    
    clearError: (key) => {
      dispatch({ type: 'CLEAR_ERROR', payload: key });
    },
    
    clearAllErrors: () => {
      dispatch({ type: 'CLEAR_ALL_ERRORS' });
    },
    
    // UI
    setViewMode: (mode) => {
      dispatch({ type: 'SET_VIEW_MODE', payload: mode });
    },
    
    toggleFilters: () => {
      dispatch({ type: 'TOGGLE_FILTERS' });
    },
    
    setSelectedIds: (ids) => {
      dispatch({ type: 'SET_SELECTED_IDS', payload: ids });
    },
    
    toggleModal: (modal, value) => {
      dispatch({ type: 'TOGGLE_MODAL', payload: { modal, value } });
    },
    
    closeAllModals: () => {
      dispatch({ type: 'CLOSE_ALL_MODALS' });
    },
    
    setActiveTab: (tab) => {
      dispatch({ type: 'SET_ACTIVE_TAB', payload: tab });
    },
    
    // Gateways
    setGateways: (gateways) => {
      dispatch({ type: 'SET_GATEWAYS', payload: gateways });
    }
  };

  const value = {
    ...state,
    ...actions
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};

// Hook personalizado
export const usePaymentContext = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePaymentContext debe ser usado dentro de PaymentProvider');
  }
  return context;
};

export default PaymentContext;