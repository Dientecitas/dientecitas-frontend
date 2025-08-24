import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { patientAuthService } from '../services/patientAuthService';
import { patientAppointmentService } from '../services/patientAppointmentService';

const PatientPortalContext = createContext();

const initialState = {
  // Auth state
  user: null,
  isAuthenticated: false,
  isLoading: false,
  authError: null,
  
  // Appointments state
  appointments: [],
  appointmentsLoading: false,
  appointmentsError: null,
  filters: {
    dateRange: 'all',
    status: 'all',
    dentist: 'all'
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0
  },
  
  // Rating state
  ratings: {},
  ratingLoading: false,
  ratingError: null
};

const patientReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_AUTH_ERROR':
      return { ...state, authError: action.payload, isLoading: false };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        authError: null,
        isLoading: false
      };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        authError: null,
        appointments: [],
        ratings: {}
      };
    
    case 'SET_APPOINTMENTS_LOADING':
      return { ...state, appointmentsLoading: action.payload };
    
    case 'SET_APPOINTMENTS':
      return {
        ...state,
        appointments: action.payload.appointments,
        pagination: { ...state.pagination, total: action.payload.total },
        appointmentsLoading: false,
        appointmentsError: null
      };
    
    case 'SET_APPOINTMENTS_ERROR':
      return {
        ...state,
        appointmentsError: action.payload,
        appointmentsLoading: false
      };
    
    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
        pagination: { ...state.pagination, page: 1 }
      };
    
    case 'SET_PAGE':
      return {
        ...state,
        pagination: { ...state.pagination, page: action.payload }
      };
    
    case 'SET_RATING_LOADING':
      return { ...state, ratingLoading: action.payload };
    
    case 'SET_RATING_SUCCESS':
      return {
        ...state,
        ratings: { ...state.ratings, [action.payload.appointmentId]: action.payload.rating },
        ratingLoading: false,
        ratingError: null
      };
    
    case 'SET_RATING_ERROR':
      return {
        ...state,
        ratingError: action.payload,
        ratingLoading: false
      };
    
    default:
      return state;
  }
};

export const PatientPortalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(patientReducer, initialState);

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('patientToken');
    const userData = localStorage.getItem('patientUser');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } catch (error) {
        localStorage.removeItem('patientToken');
        localStorage.removeItem('patientUser');
      }
    }
  }, []);

  const login = async (credentials) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const response = await patientAuthService.login(credentials);
      
      if (response.success) {
        localStorage.setItem('patientToken', response.data.token);
        localStorage.setItem('patientUser', JSON.stringify(response.data.user));
        dispatch({ type: 'LOGIN_SUCCESS', payload: response.data.user });
      } else {
        dispatch({ type: 'SET_AUTH_ERROR', payload: response.error });
      }
    } catch (error) {
      dispatch({ type: 'SET_AUTH_ERROR', payload: 'Error de conexión. Intente nuevamente.' });
    }
  };

  const register = async (userData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const response = await patientAuthService.register(userData);
      
      if (response.success) {
        localStorage.setItem('patientToken', response.data.token);
        localStorage.setItem('patientUser', JSON.stringify(response.data.user));
        dispatch({ type: 'LOGIN_SUCCESS', payload: response.data.user });
      } else {
        dispatch({ type: 'SET_AUTH_ERROR', payload: response.error });
      }
    } catch (error) {
      dispatch({ type: 'SET_AUTH_ERROR', payload: 'Error de conexión. Intente nuevamente.' });
    }
  };

  const logout = () => {
    localStorage.removeItem('patientToken');
    localStorage.removeItem('patientUser');
    dispatch({ type: 'LOGOUT' });
  };

  const loadAppointments = async () => {
    dispatch({ type: 'SET_APPOINTMENTS_LOADING', payload: true });
    
    try {
      const response = await patientAppointmentService.getAppointments({
        ...state.filters,
        ...state.pagination
      });
      
      if (response.success) {
        dispatch({ type: 'SET_APPOINTMENTS', payload: response.data });
      } else {
        dispatch({ type: 'SET_APPOINTMENTS_ERROR', payload: response.error });
      }
    } catch (error) {
      dispatch({ type: 'SET_APPOINTMENTS_ERROR', payload: 'Error al cargar citas.' });
    }
  };

  const setFilters = (filters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const setPage = (page) => {
    dispatch({ type: 'SET_PAGE', payload: page });
  };

  const submitRating = async (appointmentId, rating) => {
    dispatch({ type: 'SET_RATING_LOADING', payload: true });
    
    try {
      const response = await patientAppointmentService.submitRating(appointmentId, rating);
      
      if (response.success) {
        dispatch({ 
          type: 'SET_RATING_SUCCESS', 
          payload: { appointmentId, rating: response.data }
        });
        // Reload appointments to update rating status
        loadAppointments();
      } else {
        dispatch({ type: 'SET_RATING_ERROR', payload: response.error });
      }
    } catch (error) {
      dispatch({ type: 'SET_RATING_ERROR', payload: 'Error al enviar valoración.' });
    }
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    loadAppointments,
    setFilters,
    setPage,
    submitRating
  };

  return (
    <PatientPortalContext.Provider value={value}>
      {children}
    </PatientPortalContext.Provider>
  );
};

export const usePatientPortal = () => {
  const context = useContext(PatientPortalContext);
  if (!context) {
    throw new Error('usePatientPortal debe ser usado dentro de PatientPortalProvider');
  }
  return context;
};