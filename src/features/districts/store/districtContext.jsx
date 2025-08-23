import React, { createContext, useContext, useReducer, useEffect } from 'react';

const DistrictContext = createContext();

// Estados iniciales
const initialState = {
  // Datos
  districts: [],
  selectedDistrict: null,
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
    provincia: '',
    region: '',
    activo: null,
    sortBy: 'nombre',
    sortOrder: 'asc'
  },
  
  // Estados de carga
  loading: {
    districts: false,
    create: false,
    update: false,
    delete: false,
    stats: false,
    export: false
  },
  
  // Errores
  errors: {
    districts: null,
    create: null,
    update: null,
    delete: null,
    stats: null,
    export: null
  },
  
  // Estados de UI
  ui: {
    viewMode: 'table', // 'table' | 'cards'
    showFilters: false,
    selectedIds: [],
    modals: {
      create: false,
      edit: false,
      delete: false,
      detail: false
    }
  }
};

// Reducer
const districtReducer = (state, action) => {
  switch (action.type) {
    // Acciones de datos
    case 'SET_DISTRICTS':
      return {
        ...state,
        districts: action.payload.data,
        pagination: action.payload.pagination
      };
    
    case 'ADD_DISTRICT':
      return {
        ...state,
        districts: [action.payload, ...state.districts]
      };
    
    case 'UPDATE_DISTRICT':
      return {
        ...state,
        districts: state.districts.map(district =>
          district.id === action.payload.id ? action.payload : district
        ),
        selectedDistrict: state.selectedDistrict?.id === action.payload.id 
          ? action.payload 
          : state.selectedDistrict
      };
    
    case 'REMOVE_DISTRICT':
      return {
        ...state,
        districts: state.districts.filter(district => district.id !== action.payload),
        selectedDistrict: state.selectedDistrict?.id === action.payload 
          ? null 
          : state.selectedDistrict
      };
    
    case 'SET_SELECTED_DISTRICT':
      return {
        ...state,
        selectedDistrict: action.payload
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
    
    default:
      return state;
  }
};

// Provider
export const DistrictProvider = ({ children }) => {
  const [state, dispatch] = useReducer(districtReducer, initialState);

  // Cargar filtros desde localStorage al inicializar
  useEffect(() => {
    const savedFilters = localStorage.getItem('district-filters');
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
    localStorage.setItem('district-filters', JSON.stringify(state.filters));
  }, [state.filters]);

  // Acciones
  const actions = {
    // Datos
    setDistricts: (data, pagination) => {
      dispatch({ type: 'SET_DISTRICTS', payload: { data, pagination } });
    },
    
    addDistrict: (district) => {
      dispatch({ type: 'ADD_DISTRICT', payload: district });
    },
    
    updateDistrict: (district) => {
      dispatch({ type: 'UPDATE_DISTRICT', payload: district });
    },
    
    removeDistrict: (id) => {
      dispatch({ type: 'REMOVE_DISTRICT', payload: id });
    },
    
    setSelectedDistrict: (district) => {
      dispatch({ type: 'SET_SELECTED_DISTRICT', payload: district });
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
    }
  };

  const value = {
    ...state,
    ...actions
  };

  return (
    <DistrictContext.Provider value={value}>
      {children}
    </DistrictContext.Provider>
  );
};

// Hook personalizado
export const useDistrictContext = () => {
  const context = useContext(DistrictContext);
  if (!context) {
    throw new Error('useDistrictContext debe ser usado dentro de DistrictProvider');
  }
  return context;
};

export default DistrictContext;