import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    return format(parseISO(dateString), 'dd/MM/yyyy', { locale: es });
  } catch (error) {
    return dateString;
  }
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  try {
    return format(parseISO(dateString), 'dd/MM/yyyy HH:mm', { locale: es });
  } catch (error) {
    return dateString;
  }
};

export const formatNumber = (number) => {
  if (typeof number !== 'number') return '0';
  return new Intl.NumberFormat('es-PE').format(number);
};

export const formatPhone = (phone) => {
  if (!phone) return '';
  // Formato: +51-1-1234567
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 9) {
    return `+51-1-${cleaned}`;
  }
  return phone;
};

export const generateClinicCode = (nombre, distrito, tipo) => {
  const distritoCode = distrito.substring(0, 2).toUpperCase();
  const tipoCode = tipo === 'publica' ? 'PUB' : tipo === 'privada' ? 'PRI' : 'MIX';
  const randomNumber = Math.floor(Math.random() * 900) + 100;
  return `${distritoCode}-${tipoCode}-${randomNumber}`;
};

export const validateClinicCode = (codigo) => {
  const pattern = /^[A-Z]{2}-[A-Z]{2,3}-\d{3}$/;
  return pattern.test(codigo);
};

export const getClinicStatusColor = (activo, verificado) => {
  if (!activo) return 'text-red-600 bg-red-100';
  if (!verificado) return 'text-yellow-600 bg-yellow-100';
  return 'text-green-600 bg-green-100';
};

export const getClinicStatusText = (activo, verificado) => {
  if (!activo) return 'Inactivo';
  if (!verificado) return 'Pendiente Verificación';
  return 'Activo';
};

export const getClinicTypeColor = (tipo) => {
  switch (tipo) {
    case 'publica':
      return 'text-blue-600 bg-blue-100';
    case 'privada':
      return 'text-purple-600 bg-purple-100';
    case 'mixta':
      return 'text-orange-600 bg-orange-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

export const getClinicTypeText = (tipo) => {
  switch (tipo) {
    case 'publica':
      return 'Pública';
    case 'privada':
      return 'Privada';
    case 'mixta':
      return 'Mixta';
    default:
      return 'No especificado';
  }
};

export const formatAddress = (direccion, referencia) => {
  if (!direccion) return '';
  return referencia ? `${direccion} (${referencia})` : direccion;
};

export const formatSchedule = (horarios) => {
  if (!horarios || horarios.length === 0) return 'Horarios no definidos';
  
  const today = new Date().toLocaleDateString('es-PE', { weekday: 'long' }).toLowerCase();
  const todaySchedule = horarios.find(h => h.dia === today);
  
  if (!todaySchedule || !todaySchedule.abierto) {
    return 'Cerrado hoy';
  }
  
  const { horaInicio, horaFin, descansoInicio, descansoFin } = todaySchedule;
  
  if (descansoInicio && descansoFin) {
    return `${horaInicio}-${descansoInicio}, ${descansoFin}-${horaFin}`;
  }
  
  return `${horaInicio}-${horaFin}`;
};

export const isClinicOpen = (horarios) => {
  if (!horarios || horarios.length === 0) return false;
  
  const now = new Date();
  const currentDay = now.toLocaleDateString('es-PE', { weekday: 'long' }).toLowerCase();
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM
  
  const todaySchedule = horarios.find(h => h.dia === currentDay);
  
  if (!todaySchedule || !todaySchedule.abierto) return false;
  
  const { horaInicio, horaFin, descansoInicio, descansoFin } = todaySchedule;
  
  // Check if current time is within operating hours
  if (currentTime >= horaInicio && currentTime <= horaFin) {
    // Check if it's not during break time
    if (descansoInicio && descansoFin) {
      return !(currentTime >= descansoInicio && currentTime <= descansoFin);
    }
    return true;
  }
  
  return false;
};

export const calculateDistance = (coord1, coord2) => {
  if (!coord1 || !coord2) return null;
  
  const R = 6371; // Radio de la Tierra en km
  const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
  const dLng = (coord2.lng - coord1.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
};

export const formatDistance = (distance) => {
  if (!distance) return '';
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance}km`;
};

export const validateBusinessHours = (horarios) => {
  if (!horarios || horarios.length === 0) return false;
  
  // At least one day should be open
  const hasOpenDay = horarios.some(h => h.abierto);
  if (!hasOpenDay) return false;
  
  // Validate time format and logic for open days
  for (const horario of horarios) {
    if (horario.abierto) {
      if (!horario.horaInicio || !horario.horaFin) return false;
      if (horario.horaInicio >= horario.horaFin) return false;
      
      // If break time is defined, validate it
      if (horario.descansoInicio && horario.descansoFin) {
        if (horario.descansoInicio >= horario.descansoFin) return false;
        if (horario.descansoInicio <= horario.horaInicio || horario.descansoFin >= horario.horaFin) return false;
      }
    }
  }
  
  return true;
};

export const getDefaultSchedule = () => {
  return [
    { dia: 'lunes', abierto: true, horaInicio: '08:00', horaFin: '18:00', descansoInicio: '12:00', descansoFin: '13:00' },
    { dia: 'martes', abierto: true, horaInicio: '08:00', horaFin: '18:00', descansoInicio: '12:00', descansoFin: '13:00' },
    { dia: 'miercoles', abierto: true, horaInicio: '08:00', horaFin: '18:00', descansoInicio: '12:00', descansoFin: '13:00' },
    { dia: 'jueves', abierto: true, horaInicio: '08:00', horaFin: '18:00', descansoInicio: '12:00', descansoFin: '13:00' },
    { dia: 'viernes', abierto: true, horaInicio: '08:00', horaFin: '18:00', descansoInicio: '12:00', descansoFin: '13:00' },
    { dia: 'sabado', abierto: true, horaInicio: '08:00', horaFin: '14:00' },
    { dia: 'domingo', abierto: false }
  ];
};

export const exportClinicsToCSV = (clinics) => {
  const headers = [
    'Código',
    'Nombre',
    'Descripción',
    'Distrito',
    'Dirección',
    'Teléfono',
    'Email',
    'Tipo',
    'Estado',
    'Verificado',
    'Capacidad',
    'Dentistas',
    'Servicios',
    'Fecha Creación'
  ];

  const csvContent = [
    headers.join(','),
    ...clinics.map(clinic => [
      clinic.codigo,
      `"${clinic.nombre}"`,
      `"${clinic.descripcion}"`,
      clinic.distrito?.nombre || 'N/A',
      `"${clinic.direccion}"`,
      clinic.telefono,
      clinic.email || '',
      getClinicTypeText(clinic.tipoClinica),
      clinic.activo ? 'Activo' : 'Inactivo',
      clinic.verificado ? 'Verificado' : 'Pendiente',
      clinic.capacidadConsultorios,
      clinic.cantidadDentistas || 0,
      `"${clinic.servicios?.join(', ') || ''}"`,
      formatDate(clinic.fechaCreacion)
    ].join(','))
  ].join('\n');

  return csvContent;
};

export const calculateClinicStats = (clinics) => {
  const total = clinics.length;
  const activos = clinics.filter(c => c.activo).length;
  const inactivos = total - activos;
  const verificados = clinics.filter(c => c.verificado).length;
  const totalDentistas = clinics.reduce((sum, c) => sum + (c.cantidadDentistas || 0), 0);
  const totalCapacidad = clinics.reduce((sum, c) => sum + (c.capacidadConsultorios || 0), 0);

  // Consultorios por tipo
  const porTipo = clinics.reduce((acc, clinic) => {
    acc[clinic.tipoClinica] = (acc[clinic.tipoClinica] || 0) + 1;
    return acc;
  }, {});

  // Servicios más ofrecidos
  const serviciosCount = {};
  clinics.forEach(clinic => {
    clinic.servicios?.forEach(servicio => {
      serviciosCount[servicio] = (serviciosCount[servicio] || 0) + 1;
    });
  });

  const serviciosMasOfrecidos = Object.entries(serviciosCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([servicio, cantidad]) => ({ servicio, cantidad }));

  // Especialidades más comunes
  const especialidadesCount = {};
  clinics.forEach(clinic => {
    clinic.especialidades?.forEach(especialidad => {
      especialidadesCount[especialidad] = (especialidadesCount[especialidad] || 0) + 1;
    });
  });

  const especialidadesMasComunes = Object.entries(especialidadesCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([especialidad, cantidad]) => ({ especialidad, cantidad }));

  return {
    totalConsultorios: total,
    consultoriosActivos: activos,
    consultoriosInactivos: inactivos,
    consultoriosVerificados: verificados,
    promedioConsultoriosPorDistrito: total > 0 ? Math.round((total / new Set(clinics.map(c => c.distritoId)).size) * 100) / 100 : 0,
    totalDentistas,
    promedioDentistasPorConsultorio: total > 0 ? Math.round((totalDentistas / total) * 100) / 100 : 0,
    promedioCapacidadPorConsultorio: total > 0 ? Math.round((totalCapacidad / total) * 100) / 100 : 0,
    consultoriosPorTipo: {
      publica: porTipo.publica || 0,
      privada: porTipo.privada || 0,
      mixta: porTipo.mixta || 0
    },
    serviciosMasOfrecidos,
    especialidadesMasComunes
  };
};

export const filterClinics = (clinics, filters) => {
  return clinics.filter(clinic => {
    // Filtro de búsqueda
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        clinic.nombre.toLowerCase().includes(searchLower) ||
        clinic.descripcion.toLowerCase().includes(searchLower) ||
        clinic.codigo.toLowerCase().includes(searchLower) ||
        clinic.direccion.toLowerCase().includes(searchLower) ||
        clinic.distrito?.nombre.toLowerCase().includes(searchLower) ||
        clinic.servicios?.some(s => s.toLowerCase().includes(searchLower)) ||
        clinic.especialidades?.some(e => e.toLowerCase().includes(searchLower));
      if (!matchesSearch) return false;
    }

    // Filtro por distrito
    if (filters.distritoId && clinic.distritoId !== filters.distritoId) {
      return false;
    }

    // Filtro por tipo
    if (filters.tipoClinica && clinic.tipoClinica !== filters.tipoClinica) {
      return false;
    }

    // Filtro por servicios
    if (filters.servicios && filters.servicios.length > 0) {
      const hasService = filters.servicios.some(servicio => 
        clinic.servicios?.includes(servicio)
      );
      if (!hasService) return false;
    }

    // Filtro por especialidades
    if (filters.especialidades && filters.especialidades.length > 0) {
      const hasSpecialty = filters.especialidades.some(especialidad => 
        clinic.especialidades?.includes(especialidad)
      );
      if (!hasSpecialty) return false;
    }

    // Filtro por estado activo
    if (filters.activo !== null && clinic.activo !== filters.activo) {
      return false;
    }

    // Filtro por verificado
    if (filters.verificado !== null && clinic.verificado !== filters.verificado) {
      return false;
    }

    // Filtro por dentistas disponibles
    if (filters.conDentistasDisponibles && (!clinic.cantidadDentistas || clinic.cantidadDentistas === 0)) {
      return false;
    }

    // Filtro por turnos hoy
    if (filters.conTurnosHoy && (!clinic.turnosDisponiblesHoy || clinic.turnosDisponiblesHoy === 0)) {
      return false;
    }

    return true;
  });
};

export const sortClinics = (clinics, sortBy, sortOrder) => {
  return [...clinics].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    // Manejar diferentes tipos de datos
    if (sortBy === 'distrito') {
      aValue = a.distrito?.nombre || '';
      bValue = b.distrito?.nombre || '';
    } else if (sortBy === 'fechaCreacion') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
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