import { format, parseISO, addMinutes, differenceInMinutes, isToday, isTomorrow, isYesterday } from 'date-fns';
import { es } from 'date-fns/locale';

// Formateo de fechas y horas
export const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = parseISO(dateString);
    
    if (isToday(date)) return 'Hoy';
    if (isTomorrow(date)) return 'Mañana';
    if (isYesterday(date)) return 'Ayer';
    
    return format(date, 'dd/MM/yyyy', { locale: es });
  } catch (error) {
    return dateString;
  }
};

export const formatDateTime = (dateString, timeString) => {
  if (!dateString || !timeString) return '';
  try {
    const dateTime = parseISO(`${dateString}T${timeString}`);
    return format(dateTime, 'dd/MM/yyyy HH:mm', { locale: es });
  } catch (error) {
    return `${dateString} ${timeString}`;
  }
};

export const formatTime = (timeString) => {
  if (!timeString) return '';
  try {
    // Si viene en formato HH:mm, lo devolvemos tal como está
    if (timeString.match(/^\d{2}:\d{2}$/)) {
      return timeString;
    }
    // Si viene en formato ISO, extraemos la hora
    const date = parseISO(timeString);
    return format(date, 'HH:mm');
  } catch (error) {
    return timeString;
  }
};

export const formatDuration = (minutes) => {
  if (!minutes) return '0 min';
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 0) {
    return `${remainingMinutes} min`;
  } else if (remainingMinutes === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${remainingMinutes}min`;
  }
};

// Cálculos de tiempo
export const calculateEndTime = (startTime, durationMinutes) => {
  if (!startTime || !durationMinutes) return '';
  
  try {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);
    
    const endDate = addMinutes(startDate, durationMinutes);
    return format(endDate, 'HH:mm');
  } catch (error) {
    return '';
  }
};

export const calculateTimeBetween = (appointment1, appointment2) => {
  try {
    const end1 = parseISO(`${appointment1.fecha}T${appointment1.horaFin}`);
    const start2 = parseISO(`${appointment2.fecha}T${appointment2.horaInicio}`);
    
    return Math.abs(differenceInMinutes(end1, start2));
  } catch (error) {
    return 0;
  }
};

export const timeOverlap = (appointment1, appointment2) => {
  if (appointment1.fecha !== appointment2.fecha) return false;
  
  try {
    const start1 = parseISO(`${appointment1.fecha}T${appointment1.horaInicio}`);
    const end1 = parseISO(`${appointment1.fecha}T${appointment1.horaFin}`);
    const start2 = parseISO(`${appointment2.fecha}T${appointment2.horaInicio}`);
    const end2 = parseISO(`${appointment2.fecha}T${appointment2.horaFin}`);
    
    return start1 < end2 && start2 < end1;
  } catch (error) {
    return false;
  }
};

// Formateo de moneda
export const formatCurrency = (amount, currency = 'PEN') => {
  if (typeof amount !== 'number') return 'S/ 0.00';
  
  const currencySymbols = {
    PEN: 'S/',
    USD: '$',
    EUR: '€'
  };
  
  const symbol = currencySymbols[currency] || 'S/';
  return `${symbol} ${amount.toFixed(2)}`;
};

// Estados de citas
export const getStatusColor = (status) => {
  const colors = {
    programada: 'bg-blue-100 text-blue-800',
    confirmada: 'bg-green-100 text-green-800',
    en_sala_espera: 'bg-yellow-100 text-yellow-800',
    en_consulta: 'bg-purple-100 text-purple-800',
    completada: 'bg-green-100 text-green-800',
    no_show: 'bg-red-100 text-red-800',
    cancelada: 'bg-gray-100 text-gray-800',
    reagendada: 'bg-orange-100 text-orange-800',
    en_pausa: 'bg-yellow-100 text-yellow-800',
    requiere_seguimiento: 'bg-indigo-100 text-indigo-800'
  };
  
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export const getStatusText = (status) => {
  const texts = {
    programada: 'Programada',
    confirmada: 'Confirmada',
    en_sala_espera: 'En Sala de Espera',
    en_consulta: 'En Consulta',
    completada: 'Completada',
    no_show: 'No Asistió',
    cancelada: 'Cancelada',
    reagendada: 'Reagendada',
    en_pausa: 'En Pausa',
    requiere_seguimiento: 'Requiere Seguimiento'
  };
  
  return texts[status] || status;
};

export const getPriorityColor = (priority) => {
  const colors = {
    baja: 'bg-gray-100 text-gray-800',
    normal: 'bg-blue-100 text-blue-800',
    alta: 'bg-orange-100 text-orange-800',
    urgente: 'bg-red-100 text-red-800'
  };
  
  return colors[priority] || 'bg-gray-100 text-gray-800';
};

export const getPriorityText = (priority) => {
  const texts = {
    baja: 'Baja',
    normal: 'Normal',
    alta: 'Alta',
    urgente: 'Urgente'
  };
  
  return texts[priority] || priority;
};

// Generación de números de cita
export const generateAppointmentNumber = () => {
  const year = new Date().getFullYear();
  const timestamp = Date.now().toString().slice(-6);
  return `AP-${year}-${timestamp}`;
};

// Validaciones
export const isAppointmentEditable = (appointment) => {
  const editableStates = ['programada', 'confirmada'];
  return editableStates.includes(appointment.estado);
};

export const isAppointmentCancellable = (appointment) => {
  const cancellableStates = ['programada', 'confirmada', 'en_sala_espera'];
  return cancellableStates.includes(appointment.estado);
};

export const canCheckIn = (appointment) => {
  return appointment.estado === 'confirmada';
};

export const canStartTreatment = (appointment) => {
  return appointment.estado === 'en_sala_espera';
};

export const canComplete = (appointment) => {
  return appointment.estado === 'en_consulta';
};

// Cálculos de estadísticas
export const calculateAppointmentStats = (appointments) => {
  const total = appointments.length;
  const completed = appointments.filter(a => a.estado === 'completada').length;
  const cancelled = appointments.filter(a => a.estado === 'cancelada').length;
  const noShows = appointments.filter(a => a.estado === 'no_show').length;
  const pending = appointments.filter(a => ['programada', 'confirmada'].includes(a.estado)).length;
  
  const attendanceRate = total > 0 ? ((completed / total) * 100).toFixed(1) : 0;
  const cancellationRate = total > 0 ? ((cancelled / total) * 100).toFixed(1) : 0;
  const noShowRate = total > 0 ? ((noShows / total) * 100).toFixed(1) : 0;
  
  const totalRevenue = appointments
    .filter(a => a.estado === 'completada' && a.costo?.estadoPago === 'pagado')
    .reduce((sum, a) => sum + (a.costo?.total || 0), 0);
  
  const averageRevenue = completed > 0 ? totalRevenue / completed : 0;
  
  return {
    total,
    completed,
    cancelled,
    noShows,
    pending,
    attendanceRate: parseFloat(attendanceRate),
    cancellationRate: parseFloat(cancellationRate),
    noShowRate: parseFloat(noShowRate),
    totalRevenue,
    averageRevenue
  };
};

// Filtros y búsqueda
export const filterAppointments = (appointments, filters) => {
  return appointments.filter(appointment => {
    // Filtro de búsqueda
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        appointment.numero?.toLowerCase().includes(searchLower) ||
        appointment.paciente?.nombres?.toLowerCase().includes(searchLower) ||
        appointment.paciente?.apellidos?.toLowerCase().includes(searchLower) ||
        appointment.dentista?.nombres?.toLowerCase().includes(searchLower) ||
        appointment.dentista?.apellidos?.toLowerCase().includes(searchLower) ||
        appointment.motivo?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Filtro por rango de fechas
    if (filters.fechaDesde && appointment.fecha < filters.fechaDesde) return false;
    if (filters.fechaHasta && appointment.fecha > filters.fechaHasta) return false;

    // Filtro por estados
    if (filters.estados?.length > 0 && !filters.estados.includes(appointment.estado)) return false;

    // Filtro por dentistas
    if (filters.dentistas?.length > 0 && !filters.dentistas.includes(appointment.dentistaId)) return false;

    // Filtro por pacientes
    if (filters.pacientes?.length > 0 && !filters.pacientes.includes(appointment.pacienteId)) return false;

    // Filtro por tipos de consulta
    if (filters.tiposConsulta?.length > 0 && !filters.tiposConsulta.includes(appointment.tipoConsulta)) return false;

    // Filtro por prioridades
    if (filters.prioridades?.length > 0 && !filters.prioridades.includes(appointment.prioridad)) return false;

    return true;
  });
};

export const sortAppointments = (appointments, sortBy, sortOrder) => {
  return [...appointments].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    // Manejar diferentes tipos de datos
    if (sortBy === 'fecha') {
      aValue = new Date(`${a.fecha} ${a.horaInicio}`);
      bValue = new Date(`${b.fecha} ${b.horaInicio}`);
    } else if (sortBy === 'paciente') {
      aValue = `${a.paciente?.nombres} ${a.paciente?.apellidos}`.toLowerCase();
      bValue = `${b.paciente?.nombres} ${b.paciente?.apellidos}`.toLowerCase();
    } else if (sortBy === 'dentista') {
      aValue = `${a.dentista?.nombres} ${a.dentista?.apellidos}`.toLowerCase();
      bValue = `${b.dentista?.nombres} ${b.dentista?.apellidos}`.toLowerCase();
    } else if (sortBy === 'valor') {
      aValue = a.costo?.total || 0;
      bValue = b.costo?.total || 0;
    } else if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) {
      return sortOrder === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

// Exportación de datos
export const exportAppointmentsToCSV = (appointments) => {
  const headers = [
    'Número',
    'Fecha',
    'Hora Inicio',
    'Hora Fin',
    'Paciente',
    'Dentista',
    'Consultorio',
    'Tipo Consulta',
    'Estado',
    'Prioridad',
    'Servicios',
    'Duración (min)',
    'Costo Total',
    'Estado Pago',
    'Motivo',
    'Fecha Creación'
  ];

  const csvContent = [
    headers.join(','),
    ...appointments.map(appointment => [
      appointment.numero,
      appointment.fecha,
      appointment.horaInicio,
      appointment.horaFin,
      `"${appointment.paciente?.nombres} ${appointment.paciente?.apellidos}"`,
      `"${appointment.dentista?.nombres} ${appointment.dentista?.apellidos}"`,
      `"${appointment.consultorio?.nombre}"`,
      appointment.tipoConsulta,
      appointment.estado,
      appointment.prioridad,
      `"${appointment.servicios?.map(s => s.servicio).join('; ')}"`,
      appointment.duracion || 0,
      appointment.costo?.total || 0,
      appointment.costo?.estadoPago || 'pendiente',
      `"${appointment.motivo || ''}"`,
      formatDate(appointment.fechaCreacion)
    ].join(','))
  ].join('\n');

  return csvContent;
};

// Utilidades para notificaciones
export const shouldSendReminder = (appointment, reminderType) => {
  const now = new Date();
  const appointmentDateTime = new Date(`${appointment.fecha} ${appointment.horaInicio}`);
  const hoursUntilAppointment = differenceInMinutes(appointmentDateTime, now) / 60;

  const reminderTimes = {
    initial: 24 * 7, // 7 días antes
    day_before: 24, // 1 día antes
    final: 2 // 2 horas antes
  };

  const reminderTime = reminderTimes[reminderType];
  return reminderTime && hoursUntilAppointment <= reminderTime && hoursUntilAppointment > 0;
};

export const getNextReminderType = (appointment) => {
  const sentReminders = appointment.recordatoriosEnviados?.map(r => r.tipo) || [];
  
  if (!sentReminders.includes('initial')) return 'initial';
  if (!sentReminders.includes('day_before')) return 'day_before';
  if (!sentReminders.includes('final')) return 'final';
  
  return null;
};

// Validaciones de negocio
export const validateAppointmentConflicts = (newAppointment, existingAppointments) => {
  const conflicts = [];
  
  existingAppointments.forEach(existing => {
    if (existing.id === newAppointment.id) return; // Skip self
    
    // Conflicto de paciente
    if (existing.pacienteId === newAppointment.pacienteId && 
        existing.fecha === newAppointment.fecha &&
        timeOverlap(existing, newAppointment)) {
      conflicts.push({
        type: 'PATIENT_CONFLICT',
        message: 'El paciente ya tiene una cita en este horario',
        conflictingAppointment: existing
      });
    }
    
    // Conflicto de dentista
    if (existing.dentistaId === newAppointment.dentistaId && 
        existing.fecha === newAppointment.fecha &&
        timeOverlap(existing, newAppointment)) {
      conflicts.push({
        type: 'DENTIST_CONFLICT',
        message: 'El dentista ya tiene una cita en este horario',
        conflictingAppointment: existing
      });
    }
    
    // Conflicto de consultorio
    if (existing.consultorioId === newAppointment.consultorioId && 
        existing.fecha === newAppointment.fecha &&
        timeOverlap(existing, newAppointment)) {
      conflicts.push({
        type: 'CLINIC_CONFLICT',
        message: 'El consultorio ya está ocupado en este horario',
        conflictingAppointment: existing
      });
    }
  });
  
  return conflicts;
};