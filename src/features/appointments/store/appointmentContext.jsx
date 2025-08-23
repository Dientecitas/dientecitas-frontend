import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppointmentContext = createContext();

// Estados iniciales
const initialState = {
  // Datos
  appointments: [],
  selectedAppointment: null,
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
    fechaDesde: '',
    fechaHasta: '',
    estados: [],
    dentistas: [],
    pacientes: [],
    consultorios: [],
    tiposConsulta: [],
    prioridades: [],
    estadosPago: [],
    sortBy: 'fecha',
    sortOrder: 'desc'
  },
  
  // Estados de carga
  loading: {
    appointments: false,
    create: false,
    update: false,
    cancel: false,
    reschedule: false,
    checkin: false,
    complete: false,
    stats: false,
    export: false
  },
  
  // Errores
  errors: {
    appointments: null,
    create: null,
    update: null,
    cancel: null,
    reschedule: null,
    checkin: null,
    complete: null,
    stats: null,
    export: null
  },
  
  // Estados de UI
  ui: {
    viewMode: 'list', // 'list' | 'calendar' | 'cards'
    showFilters: false,
    selectedIds: [],
    modals: {
      create: false,
      edit: false,
      cancel: false,
      reschedule: false,
      detail: false,
      checkin: false,
      payment: false
    },
    activeTab: 'all' // 'all' | 'today' | 'upcoming' | 'completed'
  }
};

// Reducer
const appointmentReducer = (state, action) => {
  switch (action.type) {
    // Acciones de datos
    case 'SET_APPOINTMENTS':
      return {
        ...state,
        appointments: action.payload.data,
        pagination: action.payload.pagination
      };
    
    case 'ADD_APPOINTMENT':
      return {
        ...state,
        appointments: [action.payload, ...state.appointments]
      };
    
    case 'UPDATE_APPOINTMENT':
      return {
        ...state,
        appointments: state.appointments.map(appointment =>
          appointment.id === action.payload.id ? action.payload : appointment
        ),
        selectedAppointment: state.selectedAppointment?.id === action.payload.id 
          ? action.payload 
          : state.selectedAppointment
      };
    
    case 'REMOVE_APPOINTMENT':
      return {
        ...state,
        appointments: state.appointments.filter(appointment => appointment.id !== action.payload),
        selectedAppointment: state.selectedAppointment?.id === action.payload 
          ? null 
          : state.selectedAppointment
      };
    
    case 'SET_SELECTED_APPOINTMENT':
      return {
        ...state,
        selectedAppointment: action.payload
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
    
    default:
      return state;
  }
};

// Provider
export const AppointmentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appointmentReducer, initialState);

  // Cargar filtros desde localStorage al inicializar
  useEffect(() => {
    const savedFilters = localStorage.getItem('appointment-filters');
    if (savedFilters) {
      try {
        const parsedFilters = JSON.parse(savedFilters);
        dispatch({ type: 'SET_FILTERS', payload: parsedFilters });
      } catch (error) {
        console.warn('Error al cargar filtros guardados:', error);
      }
    }
  }, []);

  // Guardar filtros en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('appointment-filters', JSON.stringify(state.filters));
  }, [state.filters]);

  // Acciones
  const actions = {
    // Datos
    setAppointments: (data, pagination) => {
      dispatch({ type: 'SET_APPOINTMENTS', payload: { data, pagination } });
    },
    
    addAppointment: (appointment) => {
      dispatch({ type: 'ADD_APPOINTMENT', payload: appointment });
    },
    
    updateAppointment: (appointment) => {
      dispatch({ type: 'UPDATE_APPOINTMENT', payload: appointment });
    },
    
    removeAppointment: (id) => {
      dispatch({ type: 'REMOVE_APPOINTMENT', payload: id });
    },
    
    setSelectedAppointment: (appointment) => {
      dispatch({ type: 'SET_SELECTED_APPOINTMENT', payload: appointment });
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
    }
  };

  const value = {
    ...state,
    ...actions
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
};

// Hook personalizado
export const useAppointmentContext = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointmentContext debe ser usado dentro de AppointmentProvider');
  }
  return context;
};

export default AppointmentContext;