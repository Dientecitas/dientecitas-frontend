// Tipos y opciones para el módulo de citas
export const AppointmentStatus = {
  PROGRAMADA: 'programada',
  CONFIRMADA: 'confirmada',
  EN_SALA_ESPERA: 'en_sala_espera',
  EN_CONSULTA: 'en_consulta',
  COMPLETADA: 'completada',
  NO_SHOW: 'no_show',
  CANCELADA: 'cancelada',
  REAGENDADA: 'reagendada',
  EN_PAUSA: 'en_pausa',
  REQUIERE_SEGUIMIENTO: 'requiere_seguimiento'
};

export const AppointmentTypeOptions = [
  { value: 'primera_vez', label: 'Primera Vez' },
  { value: 'control', label: 'Control' },
  { value: 'tratamiento', label: 'Tratamiento' },
  { value: 'emergencia', label: 'Emergencia' },
  { value: 'seguimiento', label: 'Seguimiento' }
];

export const PriorityOptions = [
  { value: 'baja', label: 'Baja' },
  { value: 'normal', label: 'Normal' },
  { value: 'alta', label: 'Alta' },
  { value: 'urgente', label: 'Urgente' }
];

export const ServiceOptions = [
  {
    id: 'limpieza',
    servicio: 'Limpieza Dental',
    categoria: 'Preventiva',
    duracion: 45,
    costo: 80,
    descripcion: 'Limpieza dental profesional con fluorización'
  },
  {
    id: 'consulta',
    servicio: 'Consulta General',
    categoria: 'Diagnóstico',
    duracion: 30,
    costo: 50,
    descripcion: 'Consulta y evaluación dental general'
  },
  {
    id: 'empaste',
    servicio: 'Empaste Dental',
    categoria: 'Restaurativa',
    duracion: 60,
    costo: 120,
    descripcion: 'Empaste con resina compuesta'
  },
  {
    id: 'extraccion',
    servicio: 'Extracción Dental',
    categoria: 'Cirugía',
    duracion: 45,
    costo: 100,
    descripcion: 'Extracción dental simple'
  },
  {
    id: 'endodoncia',
    servicio: 'Endodoncia',
    categoria: 'Especializada',
    duracion: 90,
    costo: 300,
    descripcion: 'Tratamiento de conducto radicular'
  },
  {
    id: 'ortodoncia',
    servicio: 'Consulta Ortodoncia',
    categoria: 'Especializada',
    duracion: 60,
    costo: 150,
    descripcion: 'Evaluación y consulta ortodóntica'
  },
  {
    id: 'blanqueamiento',
    servicio: 'Blanqueamiento Dental',
    categoria: 'Estética',
    duracion: 75,
    costo: 200,
    descripcion: 'Blanqueamiento dental profesional'
  },
  {
    id: 'protesis',
    servicio: 'Prótesis Dental',
    categoria: 'Rehabilitación',
    duracion: 120,
    costo: 500,
    descripcion: 'Evaluación y colocación de prótesis'
  }
];

export const PaymentStatusOptions = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'parcial', label: 'Pago Parcial' },
  { value: 'pagado', label: 'Pagado' },
  { value: 'reembolsado', label: 'Reembolsado' }
];

export const AttendanceStatusOptions = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'asistio', label: 'Asistió' },
  { value: 'no_asistio', label: 'No Asistió' },
  { value: 'llegada_tardia', label: 'Llegada Tardía' }
];

export const AppointmentStatusOptions = [
  { value: AppointmentStatus.PROGRAMADA, label: 'Programada' },
  { value: AppointmentStatus.CONFIRMADA, label: 'Confirmada' },
  { value: AppointmentStatus.EN_SALA_ESPERA, label: 'En Sala de Espera' },
  { value: AppointmentStatus.EN_CONSULTA, label: 'En Consulta' },
  { value: AppointmentStatus.COMPLETADA, label: 'Completada' },
  { value: AppointmentStatus.NO_SHOW, label: 'No Show' },
  { value: AppointmentStatus.CANCELADA, label: 'Cancelada' },
  { value: AppointmentStatus.REAGENDADA, label: 'Reagendada' },
  { value: AppointmentStatus.EN_PAUSA, label: 'En Pausa' },
  { value: AppointmentStatus.REQUIERE_SEGUIMIENTO, label: 'Requiere Seguimiento' }
];

// Estados válidos para transiciones
export const ValidTransitions = {
  [AppointmentStatus.PROGRAMADA]: [
    AppointmentStatus.CONFIRMADA,
    AppointmentStatus.REAGENDADA,
    AppointmentStatus.CANCELADA
  ],
  [AppointmentStatus.CONFIRMADA]: [
    AppointmentStatus.EN_SALA_ESPERA,
    AppointmentStatus.NO_SHOW,
    AppointmentStatus.REAGENDADA,
    AppointmentStatus.CANCELADA
  ],
  [AppointmentStatus.EN_SALA_ESPERA]: [
    AppointmentStatus.EN_CONSULTA,
    AppointmentStatus.CANCELADA
  ],
  [AppointmentStatus.EN_CONSULTA]: [
    AppointmentStatus.COMPLETADA,
    AppointmentStatus.EN_PAUSA,
    AppointmentStatus.REQUIERE_SEGUIMIENTO
  ],
  [AppointmentStatus.EN_PAUSA]: [
    AppointmentStatus.EN_CONSULTA,
    AppointmentStatus.REAGENDADA
  ],
  [AppointmentStatus.COMPLETADA]: [
    AppointmentStatus.REQUIERE_SEGUIMIENTO
  ],
  [AppointmentStatus.NO_SHOW]: [
    AppointmentStatus.REAGENDADA,
    AppointmentStatus.CANCELADA
  ],
  [AppointmentStatus.REAGENDADA]: [
    AppointmentStatus.PROGRAMADA,
    AppointmentStatus.CANCELADA
  ],
  [AppointmentStatus.CANCELADA]: [],
  [AppointmentStatus.REQUIERE_SEGUIMIENTO]: [
    AppointmentStatus.COMPLETADA
  ]
};

// Configuración de colores por estado
export const StatusColors = {
  [AppointmentStatus.PROGRAMADA]: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200'
  },
  [AppointmentStatus.CONFIRMADA]: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200'
  },
  [AppointmentStatus.EN_SALA_ESPERA]: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200'
  },
  [AppointmentStatus.EN_CONSULTA]: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    border: 'border-purple-200'
  },
  [AppointmentStatus.COMPLETADA]: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
    border: 'border-emerald-200'
  },
  [AppointmentStatus.NO_SHOW]: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200'
  },
  [AppointmentStatus.CANCELADA]: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-200'
  },
  [AppointmentStatus.REAGENDADA]: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    border: 'border-orange-200'
  },
  [AppointmentStatus.EN_PAUSA]: {
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    border: 'border-amber-200'
  },
  [AppointmentStatus.REQUIERE_SEGUIMIENTO]: {
    bg: 'bg-indigo-100',
    text: 'text-indigo-800',
    border: 'border-indigo-200'
  }
};

// Configuración de colores por prioridad
export const PriorityColors = {
  baja: {
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    border: 'border-gray-200'
  },
  normal: {
    bg: 'bg-blue-100',
    text: 'text-blue-600',
    border: 'border-blue-200'
  },
  alta: {
    bg: 'bg-orange-100',
    text: 'text-orange-600',
    border: 'border-orange-200'
  },
  urgente: {
    bg: 'bg-red-100',
    text: 'text-red-600',
    border: 'border-red-200'
  }
};

// Tipos de reserva
export const BookingTypes = {
  ONLINE: 'online',
  TELEFONO: 'telefono',
  PRESENCIAL: 'presencial',
  ADMIN: 'admin'
};

// Métodos de check-in
export const CheckInMethods = {
  APP: 'app',
  KIOSCO: 'kiosco',
  RECEPCION: 'recepcion'
};

// Tipos de seguimiento
export const FollowUpTypes = {
  LLAMADA: 'llamada',
  MENSAJE: 'mensaje',
  CITA: 'cita',
  EMAIL: 'email'
};

// Categorías de cancelación
export const CancellationCategories = {
  PACIENTE: 'paciente',
  DENTISTA: 'dentista',
  EMERGENCIA: 'emergencia',
  SISTEMA: 'sistema'
};

export default {
  AppointmentStatus,
  AppointmentTypeOptions,
  PriorityOptions,
  ServiceOptions,
  PaymentStatusOptions,
  AttendanceStatusOptions,
  ValidTransitions,
  StatusColors,
  PriorityColors,
  BookingTypes,
  CheckInMethods,
  FollowUpTypes,
  CancellationCategories
};