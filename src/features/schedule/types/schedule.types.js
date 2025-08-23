// Tipos y interfaces para el módulo de turnos
export const TimeSlotStatus = {
  DISPONIBLE: 'disponible',
  RESERVADO: 'reservado',
  OCUPADO: 'ocupado',
  BLOQUEADO: 'bloqueado',
  CANCELADO: 'cancelado'
};

export const AppointmentType = {
  CONSULTA: 'consulta',
  TRATAMIENTO: 'tratamiento',
  EMERGENCIA: 'emergencia',
  SEGUIMIENTO: 'seguimiento',
  CIRUGIA: 'cirugia'
};

export const Priority = {
  NORMAL: 'normal',
  ALTA: 'alta',
  URGENTE: 'urgente'
};

export const RecurrenceType = {
  DIARIO: 'diario',
  SEMANAL: 'semanal',
  MENSUAL: 'mensual',
  PERSONALIZADO: 'personalizado'
};

export const ExceptionType = {
  VACACIONES: 'vacaciones',
  ENFERMEDAD: 'enfermedad',
  CAPACITACION: 'capacitacion',
  PERSONAL: 'personal',
  FERIADO: 'feriado',
  MANTENIMIENTO: 'mantenimiento'
};

export const DaysOfWeek = [
  { value: 1, label: 'Lunes', short: 'Lun' },
  { value: 2, label: 'Martes', short: 'Mar' },
  { value: 3, label: 'Miércoles', short: 'Mié' },
  { value: 4, label: 'Jueves', short: 'Jue' },
  { value: 5, label: 'Viernes', short: 'Vie' },
  { value: 6, label: 'Sábado', short: 'Sáb' },
  { value: 7, label: 'Domingo', short: 'Dom' }
];

export const AppointmentTypeOptions = [
  { value: 'consulta', label: 'Consulta General', duration: 30, color: 'blue' },
  { value: 'tratamiento', label: 'Tratamiento', duration: 60, color: 'green' },
  { value: 'emergencia', label: 'Emergencia', duration: 45, color: 'red' },
  { value: 'seguimiento', label: 'Seguimiento', duration: 30, color: 'orange' },
  { value: 'cirugia', label: 'Cirugía', duration: 120, color: 'purple' }
];

export const TimeIntervals = [
  { value: 15, label: '15 minutos' },
  { value: 30, label: '30 minutos' },
  { value: 45, label: '45 minutos' },
  { value: 60, label: '1 hora' },
  { value: 90, label: '1.5 horas' },
  { value: 120, label: '2 horas' }
];

export const SortOptions = [
  { value: 'fecha', label: 'Fecha' },
  { value: 'hora', label: 'Hora' },
  { value: 'dentista', label: 'Dentista' },
  { value: 'demanda', label: 'Demanda' },
  { value: 'precio', label: 'Precio' },
  { value: 'disponibilidad', label: 'Disponibilidad' }
];

export const SortOrderOptions = [
  { value: 'asc', label: 'Ascendente' },
  { value: 'desc', label: 'Descendente' }
];

// Validaciones
export const SCHEDULE_VALIDATION = {
  DURACION_MIN: 15,
  DURACION_MAX: 240,
  CAPACIDAD_MIN: 1,
  CAPACIDAD_MAX: 10,
  ANTICIPACION_MAX_MESES: 6,
  TIEMPO_CANCELACION_MIN: 1,
  MAX_TURNOS_POR_DIA: 20,
  TIEMPO_PREPARACION_MAX: 60
};

export const ConflictTypes = {
  TIME_OVERLAP: 'time_overlap',
  CAPACITY_EXCEEDED: 'capacity_exceeded',
  RESOURCE_CONFLICT: 'resource_conflict',
  BUSINESS_RULE_VIOLATION: 'business_rule_violation',
  PREFERENCE_CONFLICT: 'preference_conflict'
};

export const OptimizationObjectives = {
  MAXIMIZE_UTILIZATION: 'maximize_utilization',
  MINIMIZE_WAIT_TIMES: 'minimize_wait_times',
  MAXIMIZE_REVENUE: 'maximize_revenue',
  BALANCE_WORKLOAD: 'balance_workload'
};