import { usePatientPortal } from '../store/patientContext';

export const useAppointmentRating = () => {
  const {
    ratings,
    ratingLoading,
    ratingError,
    submitRating
  } = usePatientPortal();

  const submitAppointmentRating = async (appointmentId, ratingData) => {
    return await submitRating(appointmentId, ratingData);
  };

  const getRating = (appointmentId) => {
    return ratings[appointmentId] || null;
  };

  return {
    ratings,
    isSubmitting: ratingLoading,
    submitSuccess: !ratingError && !ratingLoading,
    error: ratingError,
    submitRating: submitAppointmentRating,
    getRating
  };
};