import React, { createContext, useContext, useReducer, useEffect } from 'react';

const ClinicContext = createContext();

// Estados iniciales
const initialState = {
  // Datos
  clinics: [],
  selectedClinic: null,
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
    distritoId: '',
    tipoClinica: '',
    servicios: [],
    especialidades: [],
    activo: null,
    verificado: null,
    conDentistasDisponibles: false,
    conTurnosHoy: false,
    sortBy: 'nombre',
    sortOrder: 'asc'
  },
  
  // Estados de carga
  loading: {
    clinics: false,
    create: false,
    update: false,
    delete: false,
    bulk: false,
    stats: false,
    export: false,
    images: false
  },
  
  // Errores
  errors: {
    clinics: null,
    create: null,
    update: null,
    delete: null,
    bulk: null,
    stats: null,
    export: null,
    images: null
  },
  
  // Estados de UI
  ui: {
    viewMode: 'cards', // 'table' | 'cards' | 'map'
    showFilters: false,
    selectedIds: [],
    modals: {
      create: false,
      edit: false,
      delete: false,
      detail: false,
      gallery: false,
      bulk: false
    },
    bulkAction: null, // 'activate' | 'deactivate' | 'verify' | 'delete'
    imageUploadProgress: {}
  },
  
  // Cache y metadata
  cache: {
    searchSuggestions: {},
    nearbyCache: {},
    lastFetch: null
  },
  
  // Drafts para formularios
  drafts: {
    create: null,
    edit: {}
  }
};

// Reducer
const clinicReducer = (state, action) => {
  switch (action.type) {
    // Acciones de datos
    case 'SET_CLINICS':
      return {
        ...state,
        clinics: action.payload.data,
        pagination: action.payload.pagination,
        cache: {
          ...state.cache,
          lastFetch: Date.now()
        }
      };
    
    case 'ADD_CLINIC':
      return {
        ...state,
        clinics: [action.payload, ...state.clinics]
      };
    
    case 'UPDATE_CLINIC':
      return {
        ...state,
        clinics: state.clinics.map(clinic =>
          clinic.id === action.payload.id ? action.payload : clinic
        ),
        selectedClinic: state.selectedClinic?.id === action.payload.id 
          ? action.payload 
          : state.selectedClinic
      };
    
    case 'REMOVE_CLINIC':
      return {
        ...state,
        clinics: state.clinics.filter(clinic => clinic.id !== action.payload),
        selectedClinic: state.selectedClinic?.id === action.payload 
          ? null 
          : state.selectedClinic,
        ui: {
          ...state.ui,
          selectedIds: state.ui.selectedIds.filter(id => id !== action.payload)
        }
      };
    
    case 'BULK_UPDATE_CLINICS':
      return {
        ...state,
        clinics: state.clinics.map(clinic =>
          action.payload.ids.includes(clinic.id) 
            ? { ...clinic, ...action.payload.updates }
            : clinic
        ),
        ui: {
          ...state.ui,
          selectedIds: []
        }
      };
    
    case 'SET_SELECTED_CLINIC':
      return {
        ...state,
        selectedClinic: action.payload
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
          selectedIds: action.payload ? state.clinics.map(c => c.id) : []
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
    
    // Acciones de cache
    case 'SET_SEARCH_SUGGESTIONS':
      return {
        ...state,
        cache: {
          ...state.cache,
          searchSuggestions: {
            ...state.cache.searchSuggestions,
            [action.payload.query]: action.payload.suggestions
          }
        }
      };
    
    case 'SET_NEARBY_CACHE':
      return {
        ...state,
        cache: {
          ...state.cache,
          nearbyCache: {
            ...state.cache.nearbyCache,
            [action.payload.key]: action.payload.data
          }
        }
      };
    
    // Acciones de drafts
    case 'SAVE_DRAFT':
      return {
        ...state,
        drafts: {
          ...state.drafts,
          [action.payload.type]: action.payload.data
        }
      };
    
    case 'CLEAR_DRAFT':
      return {
        ...state,
        drafts: {
          ...state.drafts,
          [action.payload]: null
        }
      };
    
    // Acciones de upload
    case 'SET_UPLOAD_PROGRESS':
      return {
        ...state,
        ui: {
          ...state.ui,
          imageUploadProgress: {
            ...state.ui.imageUploadProgress,
            [action.payload.clinicId]: action.payload.progress
          }
        }
      };
    
    case 'CLEAR_UPLOAD_PROGRESS':
      return {
        ...state,
        ui: {
          ...state.ui,
          imageUploadProgress: {
            ...state.ui.imageUploadProgress,
            [action.payload]: undefined
          }
        }
      };
    
    default:
      return state;
  }
};

// Provider
export const ClinicProvider = ({ children }) => {
  const [state, dispatch] = useReducer(clinicReducer, initialState);

  // Cargar filtros desde localStorage al inicializar
  useEffect(() => {
    const savedFilters = localStorage.getItem('clinic-filters');
    const savedViewMode = localStorage.getItem('clinic-view-mode');
    
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
    localStorage.setItem('clinic-filters', JSON.stringify(state.filters));
  }, [state.filters]);

  // Guardar modo de vista en localStorage
  useEffect(() => {
    localStorage.setItem('clinic-view-mode', state.ui.viewMode);
  }, [state.ui.viewMode]);

  // Auto-save drafts
  useEffect(() => {
    if (state.drafts.create) {
      localStorage.setItem('clinic-draft-create', JSON.stringify(state.drafts.create));
    }
  }, [state.drafts.create]);

  // Cleanup de cache antiguo
  useEffect(() => {
    const cleanup = () => {
      const now = Date.now();
      const maxAge = 10 * 60 * 1000; // 10 minutos
      
      // Limpiar suggestions cache
      const newSuggestions = {};
      Object.entries(state.cache.searchSuggestions).forEach(([query, data]) => {
        if (data.timestamp && now - data.timestamp < maxAge) {
          newSuggestions[query] = data;
        }
      });
      
      if (Object.keys(newSuggestions).length !== Object.keys(state.cache.searchSuggestions).length) {
        dispatch({
          type: 'SET_SEARCH_SUGGESTIONS',
          payload: { suggestions: newSuggestions }
        });
      }
    };

    const interval = setInterval(cleanup, 5 * 60 * 1000); // Cada 5 minutos
    return () => clearInterval(interval);
  }, [state.cache.searchSuggestions]);

  // Acciones
  const actions = {
    // Datos
    setClinics: (data, pagination) => {
      dispatch({ type: 'SET_CLINICS', payload: { data, pagination } });
    },
    
    addClinic: (clinic) => {
      dispatch({ type: 'ADD_CLINIC', payload: clinic });
    },
    
    updateClinic: (clinic) => {
      dispatch({ type: 'UPDATE_CLINIC', payload: clinic });
    },
    
    removeClinic: (id) => {
      dispatch({ type: 'REMOVE_CLINIC', payload: id });
    },
    
    bulkUpdateClinics: (ids, updates) => {
      dispatch({ type: 'BULK_UPDATE_CLINICS', payload: { ids, updates } });
    },
    
    setSelectedClinic: (clinic) => {
      dispatch({ type: 'SET_SELECTED_CLINIC', payload: clinic });
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
    
    // Cache
    setSearchSuggestions: (query, suggestions) => {
      dispatch({ 
        type: 'SET_SEARCH_SUGGESTIONS', 
        payload: { 
          query, 
          suggestions: { 
            data: suggestions, 
            timestamp: Date.now() 
          } 
        } 
      });
    },
    
    setNearbyCache: (key, data) => {
      dispatch({ 
        type: 'SET_NEARBY_CACHE', 
        payload: { 
          key, 
          data: { 
            ...data, 
            timestamp: Date.now() 
          } 
        } 
      });
    },
    
    // Drafts
    saveDraft: (type, data) => {
      dispatch({ type: 'SAVE_DRAFT', payload: { type, data } });
    },
    
    clearDraft: (type) => {
      dispatch({ type: 'CLEAR_DRAFT', payload: type });
    },
    
    // Upload
    setUploadProgress: (clinicId, progress) => {
      dispatch({ type: 'SET_UPLOAD_PROGRESS', payload: { clinicId, progress } });
    },
    
    clearUploadProgress: (clinicId) => {
      dispatch({ type: 'CLEAR_UPLOAD_PROGRESS', payload: clinicId });
    }
  };

  const value = {
    ...state,
    ...actions
  };

  return (
    <ClinicContext.Provider value={value}>
      {children}
    </ClinicContext.Provider>
  );
};

// Hook personalizado
export const useClinicContext = () => {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error('useClinicContext debe ser usado dentro de ClinicProvider');
  }
  return context;
};

export default ClinicContext;