import React, { createContext, useContext, useReducer, useEffect } from 'react';

const PatientContext = createContext();

// Estados iniciales
const initialState = {
  // Datos
  patients: [],
  selectedPatient: null,
  stats: null,
  
  // Paginación
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  },
  
  // Filtros
  filters: {
    search: '',
    consultorio: '',
    dentista: '',
    distrito: '',
    edadMin: null,
    edadMax: null,
    genero: '',
    tieneSeguro: null,
    activo: null,
    verificado: null,
    registroCompleto: null,
    ultimaCitaDesde: '',
    ultimaCitaHasta: '',
    riesgoOdontologico: [],
    estadoCitas: 'todos',
    origenRegistro: '',
    sortBy: 'nombre',
    sortOrder: 'asc'
  },
  
  // Estados de carga
  loading: {
    patients: false,
    create: false,
    update: false,
    delete: false,
    bulk: false,
    stats: false,
    export: false,
    medical: false,
    communication: false
  },
  
  // Errores
  errors: {
    patients: null,
    create: null,
    update: null,
    delete: null,
    bulk: null,
    stats: null,
    export: null,
    medical: null,
    communication: null
  },
  
  // Estados de UI
  ui: {
    viewMode: 'cards', // 'table' | 'cards'
    showFilters: false,
    selectedIds: [],
    modals: {
      create: false,
      edit: false,
      delete: false,
      detail: false,
      medical: false,
      communication: false,
      consent: false,
      bulk: false
    },
    bulkAction: null,
    activeTab: 'summary' // Para PatientDetail
  },
  
  // Medical data
  medicalAlerts: {},
  communicationHistory: {},
  consentStatus: {}
};

// Reducer
const patientReducer = (state, action) => {
  switch (action.type) {
    // Acciones de datos
    case 'SET_PATIENTS':
      return {
        ...state,
        patients: action.payload.data,
        pagination: action.payload.pagination
      };
    
    case 'ADD_PATIENT':
      return {
        ...state,
        patients: [action.payload, ...state.patients]
      };
    
    case 'UPDATE_PATIENT':
      return {
        ...state,
        patients: state.patients.map(patient =>
          patient.id === action.payload.id ? action.payload : patient
        ),
        selectedPatient: state.selectedPatient?.id === action.payload.id 
          ? action.payload 
          : state.selectedPatient
      };
    
    case 'REMOVE_PATIENT':
      return {
        ...state,
        patients: state.patients.filter(patient => patient.id !== action.payload),
        selectedPatient: state.selectedPatient?.id === action.payload 
          ? null 
          : state.selectedPatient,
        ui: {
          ...state.ui,
          selectedIds: state.ui.selectedIds.filter(id => id !== action.payload)
        }
      };
    
    case 'BULK_UPDATE_PATIENTS':
      return {
        ...state,
        patients: state.patients.map(patient =>
          action.payload.ids.includes(patient.id) 
            ? { ...patient, ...action.payload.updates }
            : patient
        ),
        ui: {
          ...state.ui,
          selectedIds: []
        }
      };
    
    case 'SET_SELECTED_PATIENT':
      return {
        ...state,
        selectedPatient: action.payload
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
    
    case 'TOGGLE_SELECTION':
      const { selectedIds } = state.ui;
      const isSelected = selectedIds.includes(action.payload);
      return {
        ...state,
        ui: {
          ...state.ui,
          selectedIds: isSelected
            ? selectedIds.filter(id => id !== action.payload)
            : [...selectedIds, action.payload]
        }
      };
    
    case 'SELECT_ALL':
      return {
        ...state,
        ui: {
          ...state.ui,
          selectedIds: action.payload ? state.patients.map(p => p.id) : []
        }
      };
    
    case 'SET_BULK_ACTION':
      return {
        ...state,
        ui: { ...state.ui, bulkAction: action.payload }
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
    
    // Acciones médicas
    case 'SET_MEDICAL_ALERTS':
      return {
        ...state,
        medicalAlerts: {
          ...state.medicalAlerts,
          [action.payload.patientId]: action.payload.alerts
        }
      };
    
    case 'SET_COMMUNICATION_HISTORY':
      return {
        ...state,
        communicationHistory: {
          ...state.communicationHistory,
          [action.payload.patientId]: action.payload.history
        }
      };
    
    case 'SET_CONSENT_STATUS':
      return {
        ...state,
        consentStatus: {
          ...state.consentStatus,
          [action.payload.patientId]: action.payload.status
        }
      };
    
    default:
      return state;
  }
};

// Provider
export const PatientProvider = ({ children }) => {
  const [state, dispatch] = useReducer(patientReducer, initialState);

  // Cargar filtros desde localStorage al inicializar
  useEffect(() => {
    const savedFilters = localStorage.getItem('patient-filters');
    const savedViewMode = localStorage.getItem('patient-view-mode');
    
    if (savedFilters) {
      try {
        const parsedFilters = JSON.parse(savedFilters);
        dispatch({ type: 'SET_FILTERS', payload: parsedFilters });
      } catch (error) {
        console.warn('Error al cargar filtros guardados:', error);
      }
    }
    
    if (savedViewMode) {
      dispatch({ type: 'SET_VIEW_MODE', payload: savedViewMode });
    }
  }, []);

  // Guardar filtros en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('patient-filters', JSON.stringify(state.filters));
  }, [state.filters]);

  // Guardar modo de vista en localStorage
  useEffect(() => {
    localStorage.setItem('patient-view-mode', state.ui.viewMode);
  }, [state.ui.viewMode]);

  // Acciones
  const actions = {
    // Datos
    setPatients: (data, pagination) => {
      dispatch({ type: 'SET_PATIENTS', payload: { data, pagination } });
    },
    
    addPatient: (patient) => {
      dispatch({ type: 'ADD_PATIENT', payload: patient });
    },
    
    updatePatient: (patient) => {
      dispatch({ type: 'UPDATE_PATIENT', payload: patient });
    },
    
    removePatient: (id) => {
      dispatch({ type: 'REMOVE_PATIENT', payload: id });
    },
    
    bulkUpdatePatients: (ids, updates) => {
      dispatch({ type: 'BULK_UPDATE_PATIENTS', payload: { ids, updates } });
    },
    
    setSelectedPatient: (patient) => {
      dispatch({ type: 'SET_SELECTED_PATIENT', payload: patient });
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
    
    toggleSelection: (id) => {
      dispatch({ type: 'TOGGLE_SELECTION', payload: id });
    },
    
    selectAll: (select) => {
      dispatch({ type: 'SELECT_ALL', payload: select });
    },
    
    setBulkAction: (action) => {
      dispatch({ type: 'SET_BULK_ACTION', payload: action });
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
    
    // Medical actions
    setMedicalAlerts: (patientId, alerts) => {
      dispatch({ type: 'SET_MEDICAL_ALERTS', payload: { patientId, alerts } });
    },
    
    setCommunicationHistory: (patientId, history) => {
      dispatch({ type: 'SET_COMMUNICATION_HISTORY', payload: { patientId, history } });
    },
    
    setConsentStatus: (patientId, status) => {
      dispatch({ type: 'SET_CONSENT_STATUS', payload: { patientId, status } });
    }
  };

  const value = {
    ...state,
    ...actions
  };

  return (
    <PatientContext.Provider value={value}>
      {children}
    </PatientContext.Provider>
  );
};

// Hook personalizado
export const usePatientContext = () => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatientContext debe ser usado dentro de PatientProvider');
  }
  return context;
};

export default PatientContext;