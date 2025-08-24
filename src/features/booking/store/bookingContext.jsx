import React, { createContext, useContext, useReducer } from 'react';
import { BookingSteps } from '../types/bookingTypes';

const BookingContext = createContext();

const initialState = {
  currentStep: BookingSteps.PATIENT_IDENTIFICATION,
  maxStep: BookingSteps.CONFIRMATION,
  patient: null,
  district: null,
  service: null,
  appointment: null,
  payment: null,
  booking: null,
  pricing: {
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0
  },
  canNavigate: {
    next: false,
    previous: false
  },
  loading: {
    patient: false,
    districts: false,
    services: false,
    timeSlots: false,
    payment: false,
    booking: false
  },
  errors: {}
};

const bookingReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.value
        }
      };

    case 'SET_ERROR':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.key]: action.payload.message
        }
      };

    case 'CLEAR_ERROR':
      const { [action.payload]: removed, ...remainingErrors } = state.errors;
      return {
        ...state,
        errors: remainingErrors
      };

    case 'SET_PATIENT':
      return {
        ...state,
        patient: action.payload,
        canNavigate: {
          ...state.canNavigate,
          next: true
        }
      };

    case 'SET_DISTRICT':
      return {
        ...state,
        district: action.payload,
        service: null, // Reset service when district changes
        appointment: null,
      };

    case 'SET_SERVICE':
      return {
        ...state,
        service: action.payload,
        appointment: null, // Reset appointment when service changes
        pricing: action.payload ? {
          subtotal: action.payload.price,
          tax: action.payload.price * 0.18,
          discount: 0,
          total: action.payload.price * 1.18
        } : initialState.pricing
      };

    case 'SET_APPOINTMENT':
      return {
        ...state,
        appointment: action.payload
      };

    case 'SET_PAYMENT':
      return {
        ...state,
        payment: action.payload
      };

    case 'SET_PRICING':
      return {
        ...state,
        pricing: action.payload
      };

    case 'COMPLETE_BOOKING':
      return {
        ...state,
        booking: action.payload,
        currentStep: BookingSteps.CONFIRMATION
      };

    case 'NEXT_STEP':
      const nextStep = Math.min(state.currentStep + 1, state.maxStep);
      return {
        ...state,
        currentStep: nextStep,
        canNavigate: {
          next: nextStep < state.maxStep,
          previous: nextStep > BookingSteps.PATIENT_IDENTIFICATION
        }
      };

    case 'PREVIOUS_STEP':
      const prevStep = Math.max(state.currentStep - 1, BookingSteps.PATIENT_IDENTIFICATION);
      return {
        ...state,
        currentStep: prevStep,
        canNavigate: {
          next: true,
          previous: prevStep > BookingSteps.PATIENT_IDENTIFICATION
        }
      };

    case 'GO_TO_STEP':
      return {
        ...state,
        currentStep: action.payload,
        canNavigate: {
          next: action.payload < state.maxStep,
          previous: action.payload > BookingSteps.PATIENT_IDENTIFICATION
        }
      };

    case 'RESET_BOOKING':
      return {
        ...initialState,
        loading: { ...initialState.loading }
      };

    default:
      return state;
  }
};

export const BookingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  const setLoading = (key, value) => {
    dispatch({ type: 'SET_LOADING', payload: { key, value } });
  };

  const setError = (key, message) => {
    dispatch({ type: 'SET_ERROR', payload: { key, message } });
  };

  const clearError = (key) => {
    dispatch({ type: 'CLEAR_ERROR', payload: key });
  };

  const setPatient = (patient) => {
    dispatch({ type: 'SET_PATIENT', payload: patient });
  };

  const setDistrict = (district) => {
    dispatch({ type: 'SET_DISTRICT', payload: district });
  };

  const setService = (service) => {
    dispatch({ type: 'SET_SERVICE', payload: service });
  };

  const setAppointment = (appointment) => {
    dispatch({ type: 'SET_APPOINTMENT', payload: appointment });
  };

  const setPayment = (payment) => {
    dispatch({ type: 'SET_PAYMENT', payload: payment });
  };

  const setPricing = (pricing) => {
    dispatch({ type: 'SET_PRICING', payload: pricing });
  };

  const completeBooking = (booking) => {
    dispatch({ type: 'COMPLETE_BOOKING', payload: booking });
  };

  const nextStep = () => {
    dispatch({ type: 'NEXT_STEP' });
  };

  const previousStep = () => {
    dispatch({ type: 'PREVIOUS_STEP' });
  };

  const goToStep = (step) => {
    dispatch({ type: 'GO_TO_STEP', payload: step });
  };

  const resetBooking = () => {
    dispatch({ type: 'RESET_BOOKING' });
  };

  const value = {
    ...state,
    setLoading,
    setError,
    clearError,
    setPatient,
    setDistrict,
    setService,
    setAppointment,
    setPayment,
    setPricing,
    completeBooking,
    nextStep,
    previousStep,
    goToStep,
    resetBooking
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking debe ser usado dentro de BookingProvider');
  }
  return context;
};

export default BookingContext;