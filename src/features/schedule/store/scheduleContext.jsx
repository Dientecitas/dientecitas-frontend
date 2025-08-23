import React, { createContext, useContext, useReducer, useEffect } from 'react';

const ScheduleContext = createContext();

// Estados iniciales
const initialState = {
  // Datos
  timeSlots: [],
  selectedTimeSlot: null,
  templates: [],
  exceptions: [],
  stats: null,
  
  // Paginación
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  },
  
  // Filtros
  filters: {
    fechaEspecifica: '',
    fechaDesde: '',
    fechaHasta: '',
    dentistas: [],
    consultorios: [],
    distritos: [],
    estados: [],
    tiposTurno: [],
    duracionMin: null,
    duracionMax: null,
    horaInicioDesde: '',
    horaInicioHasta: '',
    soloRecurrentes: false,
    conCapacidadDisponible: false,
    precioMin: null,
    precioMax: null,
    serviciosPermitidos: [],
    sortBy: 'fecha',
    sortOrder: 'asc',
    groupBy: null
  },
  
  // Estados de carga
  loading: {
    timeSlots: false,
    create: false,
    update: false,
    delete: false,
    bulk: false,
    stats: false,
    templates: false,
    exceptions: false,
    conflicts: false,
    availability: false
  },
  
  // Errores
  errors: {
    timeSlots: null,
    create: null,
    update: null,
    delete: null,
    bulk: null,
    stats: null,
    templates: null,
    exceptions: null,
    conflicts: null,
    availability: null
  },
  
  // Estados de UI
  ui: {
    viewMode: 'calendar', // 'calendar' | 'grid' | 'list'
    calendarView: 'week', // 'day' | 'week' | 'month'
    showFilters: false,
    selectedIds: [],
    selectedDate: new Date().toISOString().split('T')[0],
    modals: {
      create: false,
      edit: false,
      delete: false,
      bulk: false,
      template: false,
      exception: false,
      conflicts: false
    },
    bulkAction: null,
    draggedSlot: null,
    isCreatingSlot: false,
    creationMode: 'single' // 'single' | 'bulk' | 'recurring'
  },
  
  // Conflictos y validaciones
  conflicts: [],
  validationErrors: [],
  
  // Real-time y sincronización
  realTime: {
    connected: false,
    lastSync: null,
    pendingUpdates: [],
    optimisticUpdates: []
  },
  
  // Configuraciones
  settings: {
    autoRefresh: true,
    refreshInterval: 30000, // 30 segundos
    showConflicts: true,
    enableOptimisticUpdates: true,
    enableRealTimeUpdates: true
  }
};

// Reducer
const scheduleReducer = (state, action) => {
  switch (action.type) {
    // Acciones de datos
    case 'SET_TIME_SLOTS':
      return {
        ...state,
        timeSlots: action.payload.data,
        pagination: action.payload.pagination
      };
    
    case 'ADD_TIME_SLOT':
      return {
        ...state,
        timeSlots: [action.payload, ...state.timeSlots]
      };
    
    case 'UPDATE_TIME_SLOT':
      return {
        ...state,
        timeSlots: state.timeSlots.map(slot =>
          slot.id === action.payload.id ? action.payload : slot
        ),
        selectedTimeSlot: state.selectedTimeSlot?.id === action.payload.id 
          ? action.payload 
          : state.selectedTimeSlot
      };
    
    case 'REMOVE_TIME_SLOT':
      return {
        ...state,
        timeSlots: state.timeSlots.filter(slot => slot.id !== action.payload),
        selectedTimeSlot: state.selectedTimeSlot?.id === action.payload 
          ? null 
          : state.selectedTimeSlot,
        ui: {
          ...state.ui,
          selectedIds: state.ui.selectedIds.filter(id => id !== action.payload)
        }
      };
    
    case 'BULK_UPDATE_TIME_SLOTS':
      return {
        ...state,
        timeSlots: state.timeSlots.map(slot =>
          action.payload.ids.includes(slot.id) 
            ? { ...slot, ...action.payload.updates }
            : slot
        ),
        ui: {
          ...state.ui,
          selectedIds: []
        }
      };
    
    case 'SET_SELECTED_TIME_SLOT':
      return {
        ...state,
        selectedTimeSlot: action.payload
      };
    
    case 'SET_TEMPLATES':
      return {
        ...state,
        templates: action.payload
      };
    
    case 'ADD_TEMPLATE':
      return {
        ...state,
        templates: [action.payload, ...state.templates]
      };
    
    case 'SET_EXCEPTIONS':
      return {
        ...state,
        exceptions: action.payload
      };
    
    case 'ADD_EXCEPTION':
      return {
        ...state,
        exceptions: [action.payload, ...state.exceptions]
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
    
    case 'SET_CALENDAR_VIEW':
      return {
        ...state,
        ui: { ...state.ui, calendarView: action.payload }
      };
    
    case 'SET_SELECTED_DATE':
      return {
        ...state,
        ui: { ...state.ui, selectedDate: action.payload }
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
          selectedIds: action.payload ? state.timeSlots.map(s => s.id) : []
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
    
    case 'SET_DRAGGED_SLOT':
      return {
        ...state,
        ui: { ...state.ui, draggedSlot: action.payload }
      };
    
    case 'SET_CREATION_MODE':
      return {
        ...state,
        ui: { ...state.ui, creationMode: action.payload }
      };
    
    // Acciones de conflictos
    case 'SET_CONFLICTS':
      return {
        ...state,
        conflicts: action.payload
      };
    
    case 'ADD_CONFLICT':
      return {
        ...state,
        conflicts: [action.payload, ...state.conflicts]
      };
    
    case 'REMOVE_CONFLICT':
      return {
        ...state,
        conflicts: state.conflicts.filter(c => c.id !== action.payload)
      };
    
    // Acciones de real-time
    case 'SET_REAL_TIME_STATUS':
      return {
        ...state,
        realTime: { ...state.realTime, ...action.payload }
      };
    
    case 'ADD_PENDING_UPDATE':
      return {
        ...state,
        realTime: {
          ...state.realTime,
          pendingUpdates: [...state.realTime.pendingUpdates, action.payload]
        }
      };
    
    case 'CLEAR_PENDING_UPDATES':
      return {
        ...state,
        realTime: {
          ...state.realTime,
          pendingUpdates: []
        }
      };
    
    default:
      return state;
  }
};

// Provider
export const ScheduleProvider = ({ children }) => {
  const [state, dispatch] = useReducer(scheduleReducer, initialState);

  // Cargar filtros desde localStorage al inicializar
  useEffect(() => {
    const savedFilters = localStorage.getItem('schedule-filters');
    const savedViewMode = localStorage.getItem('schedule-view-mode');
    const savedCalendarView = localStorage.getItem('schedule-calendar-view');
    
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
    
    if (savedCalendarView) {
      dispatch({ type: 'SET_CALENDAR_VIEW', payload: savedCalendarView });
    }
  }, []);

  // Guardar filtros en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('schedule-filters', JSON.stringify(state.filters));
  }, [state.filters]);

  // Guardar modo de vista en localStorage
  useEffect(() => {
    localStorage.setItem('schedule-view-mode', state.ui.viewMode);
  }, [state.ui.viewMode]);

  // Guardar vista de calendario en localStorage
  useEffect(() => {
    localStorage.setItem('schedule-calendar-view', state.ui.calendarView);
  }, [state.ui.calendarView]);

  // Auto-refresh si está habilitado
  useEffect(() => {
    if (!state.settings.autoRefresh) return;

    const interval = setInterval(() => {
      // Solo refrescar si no hay operaciones en curso
      const hasActiveOperations = Object.values(state.loading).some(Boolean);
      if (!hasActiveOperations) {
        // Trigger refresh
        dispatch({ type: 'SET_REAL_TIME_STATUS', payload: { lastSync: Date.now() } });
      }
    }, state.settings.refreshInterval);

    return () => clearInterval(interval);
  }, [state.settings.autoRefresh, state.settings.refreshInterval, state.loading]);

  // Acciones
  const actions = {
    // Datos
    setTimeSlots: (data, pagination) => {
      dispatch({ type: 'SET_TIME_SLOTS', payload: { data, pagination } });
    },
    
    addTimeSlot: (slot) => {
      dispatch({ type: 'ADD_TIME_SLOT', payload: slot });
    },
    
    updateTimeSlot: (slot) => {
      dispatch({ type: 'UPDATE_TIME_SLOT', payload: slot });
    },
    
    removeTimeSlot: (id) => {
      dispatch({ type: 'REMOVE_TIME_SLOT', payload: id });
    },
    
    bulkUpdateTimeSlots: (ids, updates) => {
      dispatch({ type: 'BULK_UPDATE_TIME_SLOTS', payload: { ids, updates } });
    },
    
    setSelectedTimeSlot: (slot) => {
      dispatch({ type: 'SET_SELECTED_TIME_SLOT', payload: slot });
    },
    
    setTemplates: (templates) => {
      dispatch({ type: 'SET_TEMPLATES', payload: templates });
    },
    
    addTemplate: (template) => {
      dispatch({ type: 'ADD_TEMPLATE', payload: template });
    },
    
    setExceptions: (exceptions) => {
      dispatch({ type: 'SET_EXCEPTIONS', payload: exceptions });
    },
    
    addException: (exception) => {
      dispatch({ type: 'ADD_EXCEPTION', payload: exception });
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
    
    setCalendarView: (view) => {
      dispatch({ type: 'SET_CALENDAR_VIEW', payload: view });
    },
    
    setSelectedDate: (date) => {
      dispatch({ type: 'SET_SELECTED_DATE', payload: date });
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
    
    setDraggedSlot: (slot) => {
      dispatch({ type: 'SET_DRAGGED_SLOT', payload: slot });
    },
    
    setCreationMode: (mode) => {
      dispatch({ type: 'SET_CREATION_MODE', payload: mode });
    },
    
    // Conflictos
    setConflicts: (conflicts) => {
      dispatch({ type: 'SET_CONFLICTS', payload: conflicts });
    },
    
    addConflict: (conflict) => {
      dispatch({ type: 'ADD_CONFLICT', payload: conflict });
    },
    
    removeConflict: (id) => {
      dispatch({ type: 'REMOVE_CONFLICT', payload: id });
    },
    
    // Real-time
    setRealTimeStatus: (status) => {
      dispatch({ type: 'SET_REAL_TIME_STATUS', payload: status });
    },
    
    addPendingUpdate: (update) => {
      dispatch({ type: 'ADD_PENDING_UPDATE', payload: update });
    },
    
    clearPendingUpdates: () => {
      dispatch({ type: 'CLEAR_PENDING_UPDATES' });
    }
  };

  const value = {
    ...state,
    ...actions
  };

  return (
    <ScheduleContext.Provider value={value}>
      {children}
    </ScheduleContext.Provider>
  );
};

// Hook personalizado
export const useScheduleContext = () => {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error('useScheduleContext debe ser usado dentro de ScheduleProvider');
  }
  return context;
};

export default ScheduleContext;