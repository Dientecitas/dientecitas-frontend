import { usePatientPortal } from '../store/patientContext';

export const usePatientAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    authError,
    login,
    register,
    logout
  } = usePatientPortal();

  return {
    user,
    isAuthenticated,
    isLoading,
    error: authError,
    login,
    register,
    logout
  };
};