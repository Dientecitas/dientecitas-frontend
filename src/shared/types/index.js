// Tipos principales del sistema
export const UserRoles = {
  ADMIN: 'admin',
  DENTISTA: 'dentista',
  PACIENTE: 'paciente'
};

export const AppointmentStates = {
  LIBRE: 'Libre',
  PROGRAMADO: 'Programado',
  CANCELADO: 'Cancelado',
  REPROGRAMADO: 'Reprogramado',
  ATENDIDO: 'Atendido'
};

export const PaymentStates = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};