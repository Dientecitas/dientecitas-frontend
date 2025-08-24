import { usePatientPortal } from '../store/patientContext';

export const usePatientAppointments = () => {
  const {
    appointments,
    appointmentsLoading,
    appointmentsError,
    filters,
    pagination,
    loadAppointments,
    setFilters,
    setPage
  } = usePatientPortal();

  const refreshAppointments = () => {
    loadAppointments();
  };

  const filterAppointments = (newFilters) => {
    setFilters(newFilters);
  };

  return {
    appointments,
    loading: appointmentsLoading,
    error: appointmentsError,
    filters,
    pagination,
    loadAppointments,
    refreshAppointments,
    filterAppointments,
    setPage
  };
};