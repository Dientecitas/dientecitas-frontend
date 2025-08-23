import React, { createContext, useContext, useReducer, useEffect } from 'react';

const DentistContext = createContext();

// Estados iniciales
const initialState = {
  // Datos
  dentists: [],
  selectedDentist: null,
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
    consultorioId: '',
    especialidades: [],
    añosExperienciaMin: null,
    añosExperienciaMax: null,
    disponibleHoy: false,
    conTurnosLibres: false,
    calificacionMin: null,
    activo: null,
    verificado: null,
    aprobado: null,
    sortBy: 'nombre',
    sortOrder: 'asc'
  },
  
  // Estados de carga
  loading: {
    dentists: false,
    create: false,
    update: false,
    delete: false,
    bulk: false,
    stats: false,
    export: false,
    approve: false
  },
  
  // Errores
  errors: {
    dentists: null,
    create: null,
    update: null,
    delete: null,
    bulk: null,
    stats: null,
    export: null,
    approve: null
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
      approve: false,
      bulk: false
    },
    bulkAction: null
  }
};

// Reducer
const dentistReducer = (state, action) => {
  switch (action.type) {
    // Acciones de datos
    case 'SET_DENTISTS':
      return {
        ...state,
        dentists: action.payload.data,
        pagination: action.payload.pagination
      };
    
    case 'ADD_DENTIST':
      return {
        ...state,
        dentists: [action.payload, ...state.dentists]
      };
    
    case 'UPDATE_DENTIST':
      return {
        ...state,
        dentists: state.dentists.map(dentist =>
          dentist.id === action.payload.id ? action.payload : dentist
        ),
        selectedDentist: state.selectedDentist?.id === action.payload.id 
          ? action.payload 
          : state.selectedDentist
      };
    
    case 'REMOVE_DENTIST':
      return {
        ...state,
        dentists: state.dentists.filter(dentist => dentist.id !== action.payload),
        selectedDentist: state.selectedDentist?.id === action.payload 
          ? null 
          : state.selectedDentist,
        ui: {
          ...state.ui,
          selectedIds: state.ui.selectedIds.filter(id => id !== action.payload)
        }
      };
    
    case 'BULK_UPDATE_DENTISTS':
      return {
        ...state,
        dentists: state.dentists.map(dentist =>
          action.payload.ids.includes(dentist.id) 
            ? { ...dentist, ...action.payload.updates }
            : dentist
        ),
        ui: {
          ...state.ui,
          selectedIds: []
        }
      };
    
    case 'SET_SELECTED_DENTIST':
      return {
        ...state,
        selectedDentist: action.payload
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
          selectedIds: action.payload ? state.dentists.map(d => d.id) : []
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
    
    default:
      return state;
  }
};

// Provider
export const DentistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dentistReducer, initialState);

  // Cargar filtros desde localStorage al inicializar
  useEffect(() => {
    const savedFilters = localStorage.getItem('dentist-filters');
    const savedViewMode = localStorage.getItem('dentist-view-mode');
    
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
    localStorage.setItem('dentist-filters', JSON.stringify(state.filters));
  }, [state.filters]);

  // Guardar modo de vista en localStorage
  useEffect(() => {
    localStorage.setItem('dentist-view-mode', state.ui.viewMode);
  }, [state.ui.viewMode]);

  // Acciones
  const actions = {
    // Datos
    setDentists: (data, pagination) => {
      dispatch({ type: 'SET_DENTISTS', payload: { data, pagination } });
    },
    
    addDentist: (dentist) => {
      dispatch({ type: 'ADD_DENTIST', payload: dentist });
    },
    
    updateDentist: (dentist) => {
      dispatch({ type: 'UPDATE_DENTIST', payload: dentist });
    },
    
    removeDentist: (id) => {
      dispatch({ type: 'REMOVE_DENTIST', payload: id });
    },
    
    bulkUpdateDentists: (ids, updates) => {
      dispatch({ type: 'BULK_UPDATE_DENTISTS', payload: { ids, updates } });
    },
    
    setSelectedDentist: (dentist) => {
      dispatch({ type: 'SET_SELECTED_DENTIST', payload: dentist });
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
    }
  };

  const value = {
    ...state,
    ...actions
  };

  return (
    <DentistContext.Provider value={value}>
      {children}
    </DentistContext.Provider>
  );
};

// Hook personalizado
export const useDentistContext = () => {
  const context = useContext(DentistContext);
  if (!context) {
    throw new Error('useDentistContext debe ser usado dentro de DentistProvider');
  }
  return context;
};

export default DentistContext;