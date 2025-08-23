import api from '../../../shared/services/apiService';

// Mock data para desarrollo
const generateTodayTimeSlots = () => {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const dayAfterTomorrow = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  return [
    {
      id: 'today-1',
      fecha: today,
      horaInicio: '09:00',
      horaFin: '09:45',
      duracion: 45,
      dentistaId: '1',
      consultorioId: '1',
      distritoId: '4',
      dentista: { id: '1', nombres: 'Carlos Alberto', apellidos: 'Mendoza Herrera' },
      consultorio: { id: '1', nombre: 'Clínica Dental San Borja' },
      distrito: { id: '4', nombre: 'San Borja' },
      estado: 'disponible',
      tipoTurno: 'consulta',
      prioridad: 'normal',
      serviciosPermitidos: ['Consulta General', 'Limpieza dental'],
      capacidadMaxima: 1,
      citasActuales: 0,
      tarifaBase: 100,
      factorDemanda: 1.0,
      precioFinal: 100,
      esRecurrente: false,
      configuraciones: {
        permiteCancelacion: true,
        tiempoCancelacion: 24,
        permiteReagendamiento: true,
        confirmacionRequerida: false,
        recordatoriosAutomaticos: true,
        tiemposRecordatorio: [24, 2]
      },
      restricciones: {
        requiereAprobacion: false,
        soloNuevosPacientes: false,
        requiereSeguro: false,
        edadMinima: 18
      },
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
      creadoPor: 'admin-1',
      version: 1,
      vecesReservado: 0,
      vecesNoShow: 0,
      puntuacionDemanda: 5,
      tiempoPromedioReserva: 0
    },
    {
      id: 'today-2',
      fecha: today,
      horaInicio: '10:00',
      horaFin: '11:00',
      duracion: 60,
      dentistaId: '1',
      consultorioId: '1',
      distritoId: '4',
      dentista: { id: '1', nombres: 'Carlos Alberto', apellidos: 'Mendoza Herrera' },
      consultorio: { id: '1', nombre: 'Clínica Dental San Borja' },
      distrito: { id: '4', nombre: 'San Borja' },
      estado: 'reservado',
      tipoTurno: 'tratamiento',
      prioridad: 'normal',
      pacienteId: '1',
      reservadoHasta: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      serviciosPermitidos: ['Endodoncia', 'Tratamiento de conducto'],
      capacidadMaxima: 1,
      citasActuales: 1,
      tarifaBase: 450,
      factorDemanda: 1.2,
      precioFinal: 540,
      esRecurrente: false,
      configuraciones: {
        permiteCancelacion: true,
        tiempoCancelacion: 48,
        permiteReagendamiento: true,
        confirmacionRequerida: true,
        recordatoriosAutomaticos: true,
        tiemposRecordatorio: [48, 24, 2]
      },
      restricciones: {
        requiereAprobacion: true,
        requiereSeguro: true,
        edadMinima: 16
      },
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
      creadoPor: 'dentist-1',
      version: 1,
      vecesReservado: 1,
      vecesNoShow: 0,
      puntuacionDemanda: 8,
      tiempoPromedioReserva: 45
    },
    {
      id: 'today-3',
      fecha: today,
      horaInicio: '14:00',
      horaFin: '15:30',
      duracion: 90,
      dentistaId: '2',
      consultorioId: '2',
      distritoId: '1',
      dentista: { id: '2', nombres: 'María Elena', apellidos: 'Rodríguez Vega' },
      consultorio: { id: '2', nombre: 'Centro Odontológico Miraflores' },
      distrito: { id: '1', nombre: 'Miraflores' },
      estado: 'ocupado',
      tipoTurno: 'cirugia',
      prioridad: 'alta',
      citaId: 'cita-today-1',
      pacienteId: '2',
      serviciosPermitidos: ['Cirugía oral', 'Extracción'],
      capacidadMaxima: 1,
      citasActuales: 1,
      tarifaBase: 800,
      factorDemanda: 1.5,
      precioFinal: 1200,
      esRecurrente: false,
      configuraciones: {
        permiteCancelacion: true,
        tiempoCancelacion: 72,
        permiteReagendamiento: false,
        confirmacionRequerida: true,
        recordatoriosAutomaticos: true,
        tiemposRecordatorio: [72, 48, 24]
      },
      restricciones: {
        requiereAprobacion: true,
        requiereSeguro: true,
        edadMinima: 18,
        segurosAceptados: ['Pacífico Seguros', 'Rímac Seguros']
      },
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
      creadoPor: 'dentist-2',
      version: 1,
      vecesReservado: 1,
      vecesNoShow: 0,
      puntuacionDemanda: 9,
      tiempoPromedioReserva: 30
    },
    {
      id: 'tomorrow-1',
      fecha: tomorrow,
      horaInicio: '08:00',
      horaFin: '08:30',
      duracion: 30,
      dentistaId: '4',
      consultorioId: '3',
      distritoId: '3',
      dentista: { id: '4', nombres: 'Ana Patricia', apellidos: 'Flores Sánchez' },
      consultorio: { id: '3', nombre: 'Policlínico Dental Surco' },
      distrito: { id: '3', nombre: 'Surco' },
      estado: 'disponible',
      tipoTurno: 'consulta',
      prioridad: 'normal',
      serviciosPermitidos: ['Consulta Pediátrica', 'Limpieza infantil'],
      capacidadMaxima: 2,
      citasActuales: 0,
      tarifaBase: 70,
      factorDemanda: 0.9,
      precioFinal: 63,
      esRecurrente: true,
      grupoRecurrenciaId: 'rec-2',
      configuraciones: {
        permiteCancelacion: true,
        tiempoCancelacion: 12,
        permiteReagendamiento: true,
        confirmacionRequerida: false,
        recordatoriosAutomaticos: true,
        tiemposRecordatorio: [24, 2]
      },
      restricciones: {
        requiereAprobacion: false,
        edadMaxima: 16,
        soloNuevosPacientes: false
      },
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
      creadoPor: 'dentist-4',
      version: 1,
      vecesReservado: 0,
      vecesNoShow: 0,
      puntuacionDemanda: 6,
      tiempoPromedioReserva: 0
    },
    {
      id: 'day-after-1',
      fecha: dayAfterTomorrow,
      horaInicio: '16:00',
      horaFin: '17:00',
      duracion: 60,
      dentistaId: '3',
      consultorioId: '3',
      distritoId: '3',
      dentista: { id: '3', nombres: 'Luis Fernando', apellidos: 'Castillo Morales' },
      consultorio: { id: '3', nombre: 'Policlínico Dental Surco' },
      distrito: { id: '3', nombre: 'Surco' },
      estado: 'disponible',
      tipoTurno: 'tratamiento',
      prioridad: 'normal',
      serviciosPermitidos: ['Endodoncia', 'Blanqueamiento'],
      capacidadMaxima: 1,
      citasActuales: 0,
      tarifaBase: 450,
      factorDemanda: 1.1,
      precioFinal: 495,
      esRecurrente: false,
      configuraciones: {
        permiteCancelacion: true,
        tiempoCancelacion: 24,
        permiteReagendamiento: true,
        confirmacionRequerida: true,
        recordatoriosAutomaticos: true,
        tiemposRecordatorio: [24, 2]
      },
      restricciones: {
        requiereAprobacion: true,
        requiereSeguro: true
      },
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
      creadoPor: 'admin-1',
      version: 1,
      vecesReservado: 0,
      vecesNoShow: 0,
      puntuacionDemanda: 7,
      tiempoPromedioReserva: 0
    }
  ];
};

const mockTimeSlots = [
  ...generateTodayTimeSlots(),
  {
    id: '1',
    fecha: '2024-03-15',
    horaInicio: '09:00',
    horaFin: '09:45',
    duracion: 45,
    dentistaId: '1',
    consultorioId: '1',
    distritoId: '4',
    dentista: { id: '1', nombres: 'Carlos Alberto', apellidos: 'Mendoza Herrera' },
    consultorio: { id: '1', nombre: 'Clínica Dental San Borja' },
    distrito: { id: '4', nombre: 'San Borja' },
    estado: 'disponible',
    tipoTurno: 'consulta',
    prioridad: 'normal',
    serviciosPermitidos: ['Consulta General', 'Limpieza dental'],
    capacidadMaxima: 1,
    citasActuales: 0,
    tarifaBase: 100,
    factorDemanda: 1.0,
    precioFinal: 100,
    esRecurrente: true,
    grupoRecurrenciaId: 'rec-1',
    configuraciones: {
      permiteCancelacion: true,
      tiempoCancelacion: 24,
      permiteReagendamiento: true,
      confirmacionRequerida: false,
      recordatoriosAutomaticos: true,
      tiemposRecordatorio: [24, 2]
    },
    restricciones: {
      requiereAprobacion: false,
      soloNuevosPacientes: false,
      requiereSeguro: false,
      edadMinima: 18
    },
    fechaCreacion: '2024-02-15T10:00:00Z',
    fechaActualizacion: '2024-02-15T10:00:00Z',
    creadoPor: 'admin-1',
    version: 1,
    vecesReservado: 5,
    vecesNoShow: 1,
    puntuacionDemanda: 7,
    tiempoPromedioReserva: 120
  },
  {
    id: '2',
    fecha: '2024-03-15',
    horaInicio: '10:00',
    horaFin: '11:00',
    duracion: 60,
    dentistaId: '1',
    consultorioId: '1',
    distritoId: '4',
    dentista: { id: '1', nombres: 'Carlos Alberto', apellidos: 'Mendoza Herrera' },
    consultorio: { id: '1', nombre: 'Clínica Dental San Borja' },
    distrito: { id: '4', nombre: 'San Borja' },
    estado: 'reservado',
    tipoTurno: 'tratamiento',
    prioridad: 'normal',
    pacienteId: '1',
    reservadoHasta: '2024-03-15T10:00:00Z',
    serviciosPermitidos: ['Endodoncia', 'Tratamiento de conducto'],
    capacidadMaxima: 1,
    citasActuales: 1,
    tarifaBase: 450,
    factorDemanda: 1.2,
    precioFinal: 540,
    esRecurrente: false,
    configuraciones: {
      permiteCancelacion: true,
      tiempoCancelacion: 48,
      permiteReagendamiento: true,
      confirmacionRequerida: true,
      recordatoriosAutomaticos: true,
      tiemposRecordatorio: [48, 24, 2]
    },
    restricciones: {
      requiereAprobacion: true,
      requiereSeguro: true,
      edadMinima: 16
    },
    fechaCreacion: '2024-02-10T14:30:00Z',
    fechaActualizacion: '2024-02-28T09:15:00Z',
    creadoPor: 'dentist-1',
    version: 2,
    vecesReservado: 8,
    vecesNoShow: 0,
    puntuacionDemanda: 9,
    tiempoPromedioReserva: 45
  },
  {
    id: '3',
    fecha: '2024-03-15',
    horaInicio: '14:00',
    horaFin: '15:30',
    duracion: 90,
    dentistaId: '2',
    consultorioId: '2',
    distritoId: '1',
    dentista: { id: '2', nombres: 'María Elena', apellidos: 'Rodríguez Vega' },
    consultorio: { id: '2', nombre: 'Centro Odontológico Miraflores' },
    distrito: { id: '1', nombre: 'Miraflores' },
    estado: 'ocupado',
    tipoTurno: 'cirugia',
    prioridad: 'alta',
    citaId: 'cita-123',
    pacienteId: '2',
    serviciosPermitidos: ['Cirugía oral', 'Extracción'],
    capacidadMaxima: 1,
    citasActuales: 1,
    tarifaBase: 800,
    factorDemanda: 1.5,
    precioFinal: 1200,
    esRecurrente: false,
    configuraciones: {
      permiteCancelacion: true,
      tiempoCancelacion: 72,
      permiteReagendamiento: false,
      confirmacionRequerida: true,
      recordatoriosAutomaticos: true,
      tiemposRecordatorio: [72, 48, 24]
    },
    restricciones: {
      requiereAprobacion: true,
      requiereSeguro: true,
      edadMinima: 18,
      segurosAceptados: ['Pacífico Seguros', 'Rímac Seguros']
    },
    fechaCreacion: '2024-02-05T16:00:00Z',
    fechaActualizacion: '2024-03-01T11:30:00Z',
    creadoPor: 'dentist-2',
    version: 3,
    vecesReservado: 12,
    vecesNoShow: 1,
    puntuacionDemanda: 8,
    tiempoPromedioReserva: 30
  },
  {
    id: '4',
    fecha: '2024-03-16',
    horaInicio: '08:00',
    horaFin: '08:30',
    duracion: 30,
    dentistaId: '4',
    consultorioId: '3',
    distritoId: '3',
    dentista: { id: '4', nombres: 'Ana Patricia', apellidos: 'Flores Sánchez' },
    consultorio: { id: '3', nombre: 'Policlínico Dental Surco' },
    distrito: { id: '3', nombre: 'Surco' },
    estado: 'disponible',
    tipoTurno: 'consulta',
    prioridad: 'normal',
    serviciosPermitidos: ['Consulta Pediátrica', 'Limpieza infantil'],
    capacidadMaxima: 2,
    citasActuales: 0,
    tarifaBase: 70,
    factorDemanda: 0.9,
    precioFinal: 63,
    esRecurrente: true,
    grupoRecurrenciaId: 'rec-2',
    configuraciones: {
      permiteCancelacion: true,
      tiempoCancelacion: 12,
      permiteReagendamiento: true,
      confirmacionRequerida: false,
      recordatoriosAutomaticos: true,
      tiemposRecordatorio: [24, 2]
    },
    restricciones: {
      requiereAprobacion: false,
      edadMaxima: 16,
      soloNuevosPacientes: false
    },
    fechaCreacion: '2024-02-20T08:00:00Z',
    fechaActualizacion: '2024-02-20T08:00:00Z',
    creadoPor: 'dentist-4',
    version: 1,
    vecesReservado: 15,
    vecesNoShow: 2,
    puntuacionDemanda: 6,
    tiempoPromedioReserva: 180
  },
  {
    id: '5',
    fecha: '2024-03-16',
    horaInicio: '16:00',
    horaFin: '17:00',
    duracion: 60,
    dentistaId: '3',
    consultorioId: '3',
    distritoId: '3',
    dentista: { id: '3', nombres: 'Luis Fernando', apellidos: 'Castillo Morales' },
    consultorio: { id: '3', nombre: 'Policlínico Dental Surco' },
    distrito: { id: '3', nombre: 'Surco' },
    estado: 'bloqueado',
    tipoTurno: 'tratamiento',
    prioridad: 'normal',
    motivoBloqueo: 'Capacitación en nuevas técnicas',
    serviciosPermitidos: ['Endodoncia', 'Blanqueamiento'],
    capacidadMaxima: 1,
    citasActuales: 0,
    tarifaBase: 450,
    factorDemanda: 1.1,
    precioFinal: 495,
    esRecurrente: false,
    configuraciones: {
      permiteCancelacion: false,
      permiteReagendamiento: false,
      confirmacionRequerida: true,
      recordatoriosAutomaticos: false
    },
    restricciones: {
      requiereAprobacion: true,
      requiereSeguro: true
    },
    fechaCreacion: '2024-02-12T13:45:00Z',
    fechaActualizacion: '2024-02-25T10:20:00Z',
    creadoPor: 'admin-1',
    version: 2,
    vecesReservado: 0,
    vecesNoShow: 0,
    puntuacionDemanda: 0,
    tiempoPromedioReserva: 0
  }
];

const mockScheduleTemplates = [
  {
    id: '1',
    dentistaId: '1',
    nombre: 'Horario Regular Dr. Mendoza',
    descripcion: 'Horario estándar de lunes a viernes con consultas y tratamientos',
    activo: true,
    horariosSemanal: [
      {
        diaSemana: 1,
        activo: true,
        horaInicio: '09:00',
        horaFin: '18:00',
        descansos: [
          { inicio: '13:00', fin: '14:00', motivo: 'Almuerzo' }
        ],
        configuracionEspecial: {
          duracionConsulta: 45,
          tiposCitaPermitidos: ['consulta', 'tratamiento'],
          capacidadAdicional: 0
        }
      },
      {
        diaSemana: 2,
        activo: true,
        horaInicio: '09:00',
        horaFin: '18:00',
        descansos: [
          { inicio: '13:00', fin: '14:00', motivo: 'Almuerzo' }
        ]
      },
      {
        diaSemana: 3,
        activo: true,
        horaInicio: '09:00',
        horaFin: '18:00',
        descansos: [
          { inicio: '13:00', fin: '14:00', motivo: 'Almuerzo' }
        ]
      },
      {
        diaSemana: 4,
        activo: true,
        horaInicio: '09:00',
        horaFin: '18:00',
        descansos: [
          { inicio: '13:00', fin: '14:00', motivo: 'Almuerzo' }
        ]
      },
      {
        diaSemana: 5,
        activo: true,
        horaInicio: '09:00',
        horaFin: '18:00',
        descansos: [
          { inicio: '13:00', fin: '14:00', motivo: 'Almuerzo' }
        ]
      },
      {
        diaSemana: 6,
        activo: true,
        horaInicio: '08:00',
        horaFin: '14:00',
        descansos: []
      },
      {
        diaSemana: 7,
        activo: false,
        descansos: []
      }
    ],
    duracionConsultaDefault: 45,
    tiempoDescansoEntreCitas: 15,
    maxCitasPorDia: 12,
    tiempoAlmuerzo: { inicio: '13:00', fin: '14:00' },
    tiposCitaPermitidos: [
      {
        tipo: 'consulta',
        duracion: 45,
        preparacion: 10,
        limpieza: 5,
        requiereAprobacion: false,
        disponibleEnHorarios: ['mañana', 'tarde']
      },
      {
        tipo: 'tratamiento',
        duracion: 60,
        preparacion: 15,
        limpieza: 10,
        requiereAprobacion: true,
        disponibleEnHorarios: ['mañana', 'tarde']
      }
    ],
    fechaVigenciaInicio: '2024-03-01',
    aplicarAutomaticamente: true,
    diasAnticipacion: 30,
    fechaCreacion: '2024-02-15T10:00:00Z',
    fechaActualizacion: '2024-02-15T10:00:00Z'
  },
  {
    id: '2',
    dentistaId: '2',
    nombre: 'Horario Ortodoncista Dra. Rodríguez',
    descripcion: 'Horario especializado para tratamientos de ortodoncia',
    activo: true,
    horariosSemanal: [
      {
        diaSemana: 1,
        activo: true,
        horaInicio: '08:30',
        horaFin: '17:30',
        descansos: [
          { inicio: '12:30', fin: '13:30', motivo: 'Almuerzo' }
        ]
      },
      {
        diaSemana: 2,
        activo: true,
        horaInicio: '08:30',
        horaFin: '17:30',
        descansos: [
          { inicio: '12:30', fin: '13:30', motivo: 'Almuerzo' }
        ]
      },
      {
        diaSemana: 3,
        activo: true,
        horaInicio: '08:30',
        horaFin: '17:30',
        descansos: [
          { inicio: '12:30', fin: '13:30', motivo: 'Almuerzo' }
        ]
      },
      {
        diaSemana: 4,
        activo: true,
        horaInicio: '08:30',
        horaFin: '17:30',
        descansos: [
          { inicio: '12:30', fin: '13:30', motivo: 'Almuerzo' }
        ]
      },
      {
        diaSemana: 5,
        activo: true,
        horaInicio: '08:30',
        horaFin: '17:30',
        descansos: [
          { inicio: '12:30', fin: '13:30', motivo: 'Almuerzo' }
        ]
      },
      {
        diaSemana: 6,
        activo: false,
        descansos: []
      },
      {
        diaSemana: 7,
        activo: false,
        descansos: []
      }
    ],
    duracionConsultaDefault: 30,
    tiempoDescansoEntreCitas: 10,
    maxCitasPorDia: 16,
    tiempoAlmuerzo: { inicio: '12:30', fin: '13:30' },
    tiposCitaPermitidos: [
      {
        tipo: 'consulta',
        duracion: 30,
        preparacion: 5,
        limpieza: 5,
        requiereAprobacion: false,
        disponibleEnHorarios: ['mañana', 'tarde']
      },
      {
        tipo: 'tratamiento',
        duracion: 60,
        preparacion: 10,
        limpieza: 10,
        requiereAprobacion: false,
        disponibleEnHorarios: ['mañana', 'tarde']
      }
    ],
    fechaVigenciaInicio: '2024-01-15',
    aplicarAutomaticamente: true,
    diasAnticipacion: 45,
    fechaCreacion: '2024-01-10T09:00:00Z',
    fechaActualizacion: '2024-02-01T15:20:00Z'
  }
];

const mockScheduleExceptions = [
  {
    id: '1',
    dentistaId: '1',
    fecha: '2024-03-25',
    todoDia: true,
    tipo: 'vacaciones',
    motivo: 'Vacaciones familiares',
    descripcion: 'Viaje familiar programado',
    aprobado: true,
    creadoPor: 'dentist-1',
    aprobadoPor: 'admin-1',
    fechaAprobacion: '2024-02-20T10:00:00Z',
    citasAfectadas: [],
    turnosAfectados: ['slot-25', 'slot-26', 'slot-27'],
    notificarPacientes: true,
    mensajePersonalizado: 'El Dr. Mendoza estará de vacaciones. Reprogramaremos su cita.',
    fechaCreacion: '2024-02-15T14:00:00Z',
    fechaActualizacion: '2024-02-20T10:00:00Z'
  },
  {
    id: '2',
    dentistaId: '2',
    fecha: '2024-03-20',
    horaInicio: '14:00',
    horaFin: '17:30',
    todoDia: false,
    tipo: 'capacitacion',
    motivo: 'Curso de actualización en ortodoncia',
    descripcion: 'Seminario sobre nuevas técnicas de ortodoncia invisible',
    aprobado: true,
    creadoPor: 'admin-1',
    aprobadoPor: 'admin-1',
    fechaAprobacion: '2024-02-18T09:00:00Z',
    citasAfectadas: ['cita-45'],
    turnosAfectados: ['slot-30', 'slot-31'],
    notificarPacientes: true,
    fechaCreacion: '2024-02-18T09:00:00Z',
    fechaActualizacion: '2024-02-18T09:00:00Z'
  }
];

// Simulación de delay de red
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Simulación de errores aleatorios (2% de probabilidad)
const shouldSimulateError = () => Math.random() < 0.02;

class ScheduleApiService {
  constructor() {
    this.timeSlots = [...mockTimeSlots];
    this.templates = [...mockScheduleTemplates];
    this.exceptions = [...mockScheduleExceptions];
  }

  async getTimeSlots(filters = {}, pagination = { page: 1, limit: 20 }) {
    await delay(400);
    
    if (shouldSimulateError()) {
      throw new Error('Error al cargar los turnos. Intente nuevamente.');
    }

    let filteredSlots = [...this.timeSlots];

    // Aplicar filtros
    if (filters.fechaDesde) {
      filteredSlots = filteredSlots.filter(slot => slot.fecha >= filters.fechaDesde);
    }

    if (filters.fechaHasta) {
      filteredSlots = filteredSlots.filter(slot => slot.fecha <= filters.fechaHasta);
    }

    if (filters.dentistas && filters.dentistas.length > 0) {
      filteredSlots = filteredSlots.filter(slot => filters.dentistas.includes(slot.dentistaId));
    }

    if (filters.consultorios && filters.consultorios.length > 0) {
      filteredSlots = filteredSlots.filter(slot => filters.consultorios.includes(slot.consultorioId));
    }

    if (filters.estados && filters.estados.length > 0) {
      filteredSlots = filteredSlots.filter(slot => filters.estados.includes(slot.estado));
    }

    if (filters.tiposTurno && filters.tiposTurno.length > 0) {
      filteredSlots = filteredSlots.filter(slot => filters.tiposTurno.includes(slot.tipoTurno));
    }

    if (filters.duracionMin) {
      filteredSlots = filteredSlots.filter(slot => slot.duracion >= filters.duracionMin);
    }

    if (filters.duracionMax) {
      filteredSlots = filteredSlots.filter(slot => slot.duracion <= filters.duracionMax);
    }

    if (filters.horaInicioDesde) {
      filteredSlots = filteredSlots.filter(slot => slot.horaInicio >= filters.horaInicioDesde);
    }

    if (filters.horaInicioHasta) {
      filteredSlots = filteredSlots.filter(slot => slot.horaInicio <= filters.horaInicioHasta);
    }

    if (filters.conCapacidadDisponible) {
      filteredSlots = filteredSlots.filter(slot => slot.citasActuales < slot.capacidadMaxima);
    }

    if (filters.soloRecurrentes) {
      filteredSlots = filteredSlots.filter(slot => slot.esRecurrente);
    }

    // Aplicar ordenamiento
    if (filters.sortBy) {
      filteredSlots.sort((a, b) => {
        let aValue = a[filters.sortBy];
        let bValue = b[filters.sortBy];

        if (filters.sortBy === 'dentista') {
          aValue = a.dentista?.nombres || '';
          bValue = b.dentista?.nombres || '';
        } else if (filters.sortBy === 'fecha') {
          aValue = new Date(`${a.fecha} ${a.horaInicio}`);
          bValue = new Date(`${b.fecha} ${b.horaInicio}`);
        } else if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Aplicar paginación
    const total = filteredSlots.length;
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    const paginatedSlots = filteredSlots.slice(startIndex, endIndex);

    return {
      data: paginatedSlots,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit)
      }
    };
  }

  async getTimeSlotById(id) {
    await delay(250);
    
    if (shouldSimulateError()) {
      throw new Error('Error al cargar el turno. Intente nuevamente.');
    }

    const timeSlot = this.timeSlots.find(slot => slot.id === id);
    if (!timeSlot) {
      throw new Error('Turno no encontrado');
    }

    return timeSlot;
  }

  async createTimeSlot(slotData) {
    await delay(600);
    
    if (shouldSimulateError()) {
      throw new Error('Error al crear el turno. Intente nuevamente.');
    }

    // Validar conflictos de tiempo
    const conflicts = await this.detectTimeConflicts(slotData);
    if (conflicts.length > 0) {
      throw new Error('Conflicto de horarios detectado');
    }

    const newSlot = {
      id: Date.now().toString(),
      ...slotData,
      estado: 'disponible',
      citasActuales: 0,
      factorDemanda: 1.0,
      precioFinal: slotData.tarifaBase || 100,
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
      version: 1,
      vecesReservado: 0,
      vecesNoShow: 0,
      puntuacionDemanda: 5,
      tiempoPromedioReserva: 0
    };

    this.timeSlots.push(newSlot);
    return newSlot;
  }

  async updateTimeSlot(id, slotData) {
    await delay(550);
    
    if (shouldSimulateError()) {
      throw new Error('Error al actualizar el turno. Intente nuevamente.');
    }

    const index = this.timeSlots.findIndex(slot => slot.id === id);
    if (index === -1) {
      throw new Error('Turno no encontrado');
    }

    // Validar conflictos si se cambian horarios
    if (slotData.horaInicio || slotData.horaFin || slotData.fecha) {
      const conflicts = await this.detectTimeConflicts({ ...this.timeSlots[index], ...slotData });
      if (conflicts.length > 0) {
        throw new Error('Conflicto de horarios detectado');
      }
    }

    const updatedSlot = {
      ...this.timeSlots[index],
      ...slotData,
      fechaActualizacion: new Date().toISOString(),
      version: this.timeSlots[index].version + 1
    };

    this.timeSlots[index] = updatedSlot;
    return updatedSlot;
  }

  async deleteTimeSlot(id) {
    await delay(450);
    
    if (shouldSimulateError()) {
      throw new Error('Error al eliminar el turno. Intente nuevamente.');
    }

    const slot = this.timeSlots.find(s => s.id === id);
    if (!slot) {
      throw new Error('Turno no encontrado');
    }

    // Verificar si tiene citas asignadas
    if (slot.citasActuales > 0) {
      throw new Error('No se puede eliminar un turno que tiene citas asignadas');
    }

    this.timeSlots = this.timeSlots.filter(s => s.id !== id);
    return { success: true, message: 'Turno eliminado correctamente' };
  }

  async bulkCreateTimeSlots(slotsData) {
    await delay(1200);
    
    if (shouldSimulateError()) {
      throw new Error('Error en la creación masiva. Intente nuevamente.');
    }

    const results = [];
    const errors = [];

    for (const slotData of slotsData) {
      try {
        const newSlot = await this.createTimeSlot(slotData);
        results.push(newSlot);
      } catch (error) {
        errors.push({
          slotData,
          error: error.message
        });
      }
    }

    return {
      success: true,
      created: results.length,
      errors: errors.length,
      results,
      errors
    };
  }

  async getAvailability(criteria) {
    await delay(300);
    
    const { dentistaId, fecha, tipoTurno } = criteria;
    
    const availableSlots = this.timeSlots.filter(slot => 
      slot.dentistaId === dentistaId &&
      slot.fecha === fecha &&
      slot.estado === 'disponible' &&
      (!tipoTurno || slot.serviciosPermitidos.includes(tipoTurno))
    );

    return {
      fecha,
      dentistaId,
      totalSlots: availableSlots.length,
      availableSlots: availableSlots.map(slot => ({
        id: slot.id,
        horaInicio: slot.horaInicio,
        horaFin: slot.horaFin,
        duracion: slot.duracion,
        precio: slot.precioFinal,
        capacidadDisponible: slot.capacidadMaxima - slot.citasActuales
      }))
    };
  }

  async detectTimeConflicts(slotData) {
    await delay(200);
    
    const conflicts = [];
    const { dentistaId, fecha, horaInicio, horaFin } = slotData;

    const existingSlots = this.timeSlots.filter(slot => 
      slot.dentistaId === dentistaId &&
      slot.fecha === fecha &&
      slot.id !== slotData.id // Excluir el slot actual si es una actualización
    );

    for (const existing of existingSlots) {
      if (this.hasTimeOverlap(
        { inicio: horaInicio, fin: horaFin },
        { inicio: existing.horaInicio, fin: existing.horaFin }
      )) {
        conflicts.push({
          type: 'TIME_OVERLAP',
          conflictingSlot: existing,
          overlapMinutes: this.calculateOverlapMinutes(
            horaInicio, horaFin,
            existing.horaInicio, existing.horaFin
          )
        });
      }
    }

    return conflicts;
  }

  async getScheduleStats() {
    await delay(300);
    
    if (shouldSimulateError()) {
      throw new Error('Error al cargar las estadísticas. Intente nuevamente.');
    }

    const total = this.timeSlots.length;
    const disponibles = this.timeSlots.filter(s => s.estado === 'disponible').length;
    const reservados = this.timeSlots.filter(s => s.estado === 'reservado').length;
    const ocupados = this.timeSlots.filter(s => s.estado === 'ocupado').length;
    const bloqueados = this.timeSlots.filter(s => s.estado === 'bloqueado').length;

    // Calcular utilización
    const totalCapacidad = this.timeSlots.reduce((sum, slot) => sum + slot.capacidadMaxima, 0);
    const capacidadUsada = this.timeSlots.reduce((sum, slot) => sum + slot.citasActuales, 0);
    const tasaUtilizacion = totalCapacidad > 0 ? (capacidadUsada / totalCapacidad) * 100 : 0;

    // Calcular tasa de no-show
    const totalReservados = this.timeSlots.reduce((sum, slot) => sum + slot.vecesReservado, 0);
    const totalNoShows = this.timeSlots.reduce((sum, slot) => sum + slot.vecesNoShow, 0);
    const tasaNoShow = totalReservados > 0 ? (totalNoShows / totalReservados) * 100 : 0;

    // Distribución por hora
    const distribucionPorHora = {};
    this.timeSlots.forEach(slot => {
      const hora = slot.horaInicio;
      if (!distribucionPorHora[hora]) {
        distribucionPorHora[hora] = { hora, totalTurnos: 0, turnosDisponibles: 0, tasaOcupacion: 0 };
      }
      distribucionPorHora[hora].totalTurnos++;
      if (slot.estado === 'disponible') {
        distribucionPorHora[hora].turnosDisponibles++;
      }
    });

    Object.values(distribucionPorHora).forEach(hourData => {
      hourData.tasaOcupacion = hourData.totalTurnos > 0 
        ? ((hourData.totalTurnos - hourData.turnosDisponibles) / hourData.totalTurnos) * 100 
        : 0;
    });

    // Eficiencia por dentista
    const dentistStats = {};
    this.timeSlots.forEach(slot => {
      const dentistaId = slot.dentistaId;
      if (!dentistStats[dentistaId]) {
        dentistStats[dentistaId] = {
          dentistaId,
          dentistaNombre: slot.dentista?.nombres || 'Dentista',
          totalTurnos: 0,
          turnosUtilizados: 0,
          vecesReservado: 0,
          vecesNoShow: 0
        };
      }
      
      const stats = dentistStats[dentistaId];
      stats.totalTurnos++;
      stats.vecesReservado += slot.vecesReservado;
      stats.vecesNoShow += slot.vecesNoShow;
      
      if (slot.estado === 'ocupado' || slot.estado === 'reservado') {
        stats.turnosUtilizados++;
      }
    });

    const eficienciaPorDentista = Object.values(dentistStats).map(stats => ({
      ...stats,
      tasaUtilizacion: stats.totalTurnos > 0 ? (stats.turnosUtilizados / stats.totalTurnos) * 100 : 0,
      tasaNoShow: stats.vecesReservado > 0 ? (stats.vecesNoShow / stats.vecesReservado) * 100 : 0
    }));

    return {
      totalTurnos: total,
      turnosDisponibles: disponibles,
      turnosReservados: reservados,
      turnosOcupados: ocupados,
      turnosBloqueados: bloqueados,
      tasaUtilizacion: Math.round(tasaUtilizacion * 100) / 100,
      tasaNoShow: Math.round(tasaNoShow * 100) / 100,
      distribucionPorHora: Object.values(distribucionPorHora),
      eficienciaPorDentista,
      ingresosPotenciales: this.timeSlots.reduce((sum, slot) => sum + (slot.precioFinal || 0), 0),
      ingresosRealizados: this.timeSlots
        .filter(slot => slot.estado === 'ocupado')
        .reduce((sum, slot) => sum + (slot.precioFinal || 0), 0)
    };
  }

  async generateRecurringSlots(pattern) {
    await delay(800);
    
    if (shouldSimulateError()) {
      throw new Error('Error al generar turnos recurrentes. Intente nuevamente.');
    }

    const generatedSlots = [];
    const { dentistaId, fechaInicio, fechaFin, configuracion, recurrencia } = pattern;

    let currentDate = new Date(fechaInicio);
    const endDate = new Date(fechaFin);
    const grupoRecurrenciaId = `rec-${Date.now()}`;

    while (currentDate <= endDate) {
      if (this.shouldCreateSlotForDate(currentDate, recurrencia)) {
        const slotData = {
          dentistaId,
          fecha: currentDate.toISOString().split('T')[0],
          horaInicio: configuracion.horaInicio,
          horaFin: configuracion.horaFin,
          duracion: configuracion.duracion,
          tipoTurno: configuracion.tipoTurno,
          capacidadMaxima: configuracion.capacidadMaxima,
          serviciosPermitidos: configuracion.serviciosPermitidos,
          esRecurrente: true,
          grupoRecurrenciaId,
          patronRecurrencia: recurrencia,
          configuraciones: configuracion.configuraciones || {}
        };

        try {
          const newSlot = await this.createTimeSlot(slotData);
          generatedSlots.push(newSlot);
        } catch (error) {
          console.warn(`Error creating slot for ${currentDate.toISOString()}:`, error);
        }
      }

      // Avanzar fecha según patrón
      currentDate = this.getNextDate(currentDate, recurrencia);
    }

    return {
      success: true,
      generatedCount: generatedSlots.length,
      grupoRecurrenciaId,
      slots: generatedSlots
    };
  }

  async getScheduleTemplates(dentistaId = null) {
    await delay(200);
    
    let templates = [...this.templates];
    
    if (dentistaId) {
      templates = templates.filter(t => t.dentistaId === dentistaId);
    }

    return templates.filter(t => t.activo);
  }

  async createScheduleTemplate(templateData) {
    await delay(500);
    
    if (shouldSimulateError()) {
      throw new Error('Error al crear la plantilla. Intente nuevamente.');
    }

    const newTemplate = {
      id: Date.now().toString(),
      ...templateData,
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString()
    };

    this.templates.push(newTemplate);
    return newTemplate;
  }

  async applyTemplate(templateId, dateRange) {
    await delay(1000);
    
    const template = this.templates.find(t => t.id === templateId);
    if (!template) {
      throw new Error('Plantilla no encontrada');
    }

    const generatedSlots = [];
    let currentDate = new Date(dateRange.fechaInicio);
    const endDate = new Date(dateRange.fechaFin);

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay() || 7; // Convertir domingo (0) a 7
      const daySchedule = template.horariosSemanal.find(h => h.diaSemana === dayOfWeek);

      if (daySchedule && daySchedule.activo) {
        const daySlots = this.generateSlotsForDay(currentDate, daySchedule, template);
        generatedSlots.push(...daySlots);
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Crear los slots generados
    const results = [];
    for (const slotData of generatedSlots) {
      try {
        const newSlot = await this.createTimeSlot(slotData);
        results.push(newSlot);
      } catch (error) {
        console.warn('Error creating slot from template:', error);
      }
    }

    return {
      success: true,
      templateId,
      generatedCount: results.length,
      slots: results
    };
  }

  async getScheduleExceptions(dentistaId, dateRange) {
    await delay(200);
    
    let exceptions = [...this.exceptions];
    
    if (dentistaId) {
      exceptions = exceptions.filter(e => e.dentistaId === dentistaId);
    }

    if (dateRange) {
      exceptions = exceptions.filter(e => 
        e.fecha >= dateRange.fechaInicio && e.fecha <= dateRange.fechaFin
      );
    }

    return exceptions;
  }

  async createScheduleException(exceptionData) {
    await delay(400);
    
    const newException = {
      id: Date.now().toString(),
      ...exceptionData,
      aprobado: false,
      citasAfectadas: [],
      turnosAfectados: [],
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString()
    };

    // Encontrar turnos afectados
    const affectedSlots = this.timeSlots.filter(slot => 
      slot.dentistaId === exceptionData.dentistaId &&
      slot.fecha === exceptionData.fecha &&
      (exceptionData.todoDia || 
        (slot.horaInicio >= exceptionData.horaInicio && slot.horaFin <= exceptionData.horaFin))
    );

    newException.turnosAfectados = affectedSlots.map(slot => slot.id);

    this.exceptions.push(newException);
    return newException;
  }

  // Métodos auxiliares
  hasTimeOverlap(time1, time2) {
    const start1 = this.timeToMinutes(time1.inicio);
    const end1 = this.timeToMinutes(time1.fin);
    const start2 = this.timeToMinutes(time2.inicio);
    const end2 = this.timeToMinutes(time2.fin);

    return start1 < end2 && end1 > start2;
  }

  calculateOverlapMinutes(start1, end1, start2, end2) {
    const startOverlap = Math.max(this.timeToMinutes(start1), this.timeToMinutes(start2));
    const endOverlap = Math.min(this.timeToMinutes(end1), this.timeToMinutes(end2));
    return Math.max(0, endOverlap - startOverlap);
  }

  timeToMinutes(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }

  shouldCreateSlotForDate(date, recurrencia) {
    const dayOfWeek = date.getDay() || 7;
    
    switch (recurrencia.tipo) {
      case 'diario':
        return true;
      case 'semanal':
        return recurrencia.diasSemana?.includes(dayOfWeek) || false;
      case 'mensual':
        return recurrencia.diasMes?.includes(date.getDate()) || false;
      default:
        return false;
    }
  }

  getNextDate(currentDate, recurrencia) {
    const nextDate = new Date(currentDate);
    
    switch (recurrencia.tipo) {
      case 'diario':
        nextDate.setDate(nextDate.getDate() + recurrencia.frecuencia);
        break;
      case 'semanal':
        nextDate.setDate(nextDate.getDate() + (7 * recurrencia.frecuencia));
        break;
      case 'mensual':
        nextDate.setMonth(nextDate.getMonth() + recurrencia.frecuencia);
        break;
      default:
        nextDate.setDate(nextDate.getDate() + 1);
    }
    
    return nextDate;
  }

  generateSlotsForDay(date, daySchedule, template) {
    const slots = [];
    const dateString = date.toISOString().split('T')[0];
    
    let currentTime = this.timeToMinutes(daySchedule.horaInicio);
    const endTime = this.timeToMinutes(daySchedule.horaFin);
    const slotDuration = daySchedule.configuracionEspecial?.duracionConsulta || template.duracionConsultaDefault;
    const breakTime = template.tiempoDescansoEntreCitas;

    while (currentTime + slotDuration <= endTime) {
      // Verificar si está en horario de descanso
      const isBreakTime = daySchedule.descansos.some(descanso => {
        const breakStart = this.timeToMinutes(descanso.inicio);
        const breakEnd = this.timeToMinutes(descanso.fin);
        return currentTime >= breakStart && currentTime < breakEnd;
      });

      if (!isBreakTime) {
        const horaInicio = this.minutesToTime(currentTime);
        const horaFin = this.minutesToTime(currentTime + slotDuration);

        slots.push({
          dentistaId: template.dentistaId,
          consultorioId: template.consultorioId || '1', // Default
          fecha: dateString,
          horaInicio,
          horaFin,
          duracion: slotDuration,
          tipoTurno: 'consulta',
          capacidadMaxima: 1,
          serviciosPermitidos: ['Consulta General'],
          tarifaBase: 100
        });
      }

      currentTime += slotDuration + breakTime;
    }

    return slots;
  }

  minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }
}

// Instancia singleton del servicio
const scheduleApiService = new ScheduleApiService();

// API pública del servicio
export const scheduleApi = {
  getTimeSlots: (filters, pagination) => scheduleApiService.getTimeSlots(filters, pagination),
  getTimeSlotById: (id) => scheduleApiService.getTimeSlotById(id),
  createTimeSlot: (data) => scheduleApiService.createTimeSlot(data),
  updateTimeSlot: (id, data) => scheduleApiService.updateTimeSlot(id, data),
  deleteTimeSlot: (id) => scheduleApiService.deleteTimeSlot(id),
  bulkCreateTimeSlots: (slotsData) => scheduleApiService.bulkCreateTimeSlots(slotsData),
  getAvailability: (criteria) => scheduleApiService.getAvailability(criteria),
  detectTimeConflicts: (slotData) => scheduleApiService.detectTimeConflicts(slotData),
  getScheduleStats: () => scheduleApiService.getScheduleStats(),
  generateRecurringSlots: (pattern) => scheduleApiService.generateRecurringSlots(pattern),
  getScheduleTemplates: (dentistaId) => scheduleApiService.getScheduleTemplates(dentistaId),
  createScheduleTemplate: (data) => scheduleApiService.createScheduleTemplate(data),
  applyTemplate: (templateId, dateRange) => scheduleApiService.applyTemplate(templateId, dateRange),
  getScheduleExceptions: (dentistaId, dateRange) => scheduleApiService.getScheduleExceptions(dentistaId, dateRange),
  createScheduleException: (data) => scheduleApiService.createScheduleException(data)
};

export default scheduleApi;