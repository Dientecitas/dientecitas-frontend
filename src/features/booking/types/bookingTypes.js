// Tipos para el sistema de reserva de citas
export const BookingSteps = {
  PATIENT_IDENTIFICATION: 1,
  DISTRICT_SELECTION: 2,
  SERVICE_SELECTION: 3,
  APPOINTMENT_SCHEDULING: 4,
  PAYMENT_PROCESSING: 5,
  CONFIRMATION: 6
};

export const PaymentMethods = {
  CARD: 'card',
  TRANSFER: 'transfer',
  CASH: 'cash'
};

export const BookingStatus = {
  DRAFT: 'draft',
  RESERVED: 'reserved',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled'
};

export const ServiceCategories = {
  CLEANING: 'Limpieza y Prevención',
  ORTHODONTICS: 'Ortodoncia',
  ENDODONTICS: 'Endodoncia',
  ORAL_SURGERY: 'Cirugía Oral',
  COSMETIC: 'Odontología Estética',
  PEDIATRIC: 'Odontopediatría',
  PERIODONTICS: 'Periodoncia',
  IMPLANTS: 'Implantes'
};