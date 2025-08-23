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

export const formatCelular = (celular) => {
  if (!celular) return '';
  // Formato: 987654321 (9-11 dígitos)
  const cleaned = celular.replace(/\D/g, '');
  return cleaned;
};

export const generateDentistCode = (nombres, apellidos) => {
  const firstNameInitial = nombres.charAt(0).toUpperCase();
  const lastNameInitial = apellidos.split(' ')[0].charAt(0).toUpperCase();
  const randomNumber = Math.floor(Math.random() * 9000) + 1000;
  return `DR-${firstNameInitial}${lastNameInitial}-${randomNumber}`;
};

export const validateDNI = (dni) => {
  const pattern = /^\d{8}$/;
  return pattern.test(dni);
};

export const validateColegiatura = (colegiatura) => {
  const pattern = /^COP-\d{5}$/;
  return pattern.test(colegiatura);
};

export const getDentistStatusColor = (activo, verificado, aprobado) => {
  if (!activo) return 'text-red-600 bg-red-100';
  if (!verificado) return 'text-yellow-600 bg-yellow-100';
  if (!aprobado) return 'text-orange-600 bg-orange-100';
  return 'text-green-600 bg-green-100';
};

export const getDentistStatusText = (activo, verificado, aprobado) => {
  if (!activo) return 'Inactivo';
  if (!verificado) return 'Pendiente Verificación';
  if (!aprobado) return 'Pendiente Aprobación';
  return 'Activo';
};

export const getAvailabilityStatusColor = (estado) => {
  switch (estado) {
    case 'disponible':
      return 'text-green-600 bg-green-100';
    case 'ocupado':
      return 'text-blue-600 bg-blue-100';
    case 'descanso':
      return 'text-yellow-600 bg-yellow-100';
    case 'no_disponible':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

export const getAvailabilityStatusText = (estado) => {
  switch (estado) {
    case 'disponible':
      return 'Disponible';
    case 'ocupado':
      return 'Ocupado';
    case 'descanso':
      return 'En Descanso';
    case 'no_disponible':
      return 'No Disponible';
    default:
      return 'Estado Desconocido';
  }
};

export const getSpecialtyCategoryColor = (categoria) => {
  switch (categoria) {
    case 'general':
      return 'text-blue-600 bg-blue-100';
    case 'especializada':
      return 'text-purple-600 bg-purple-100';
    case 'subespecializada':
      return 'text-orange-600 bg-orange-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

export const formatExperience = (años) => {
  if (años === 0) return 'Recién graduado';
  if (años === 1) return '1 año de experiencia';
  return `${años} años de experiencia`;
};

export const formatSchedule = (horarios) => {
  if (!horarios || horarios.length === 0) return 'Horarios no definidos';
  
  const today = new Date().toLocaleDateString('es-PE', { weekday: 'long' }).toLowerCase();
  const todaySchedule = horarios.find(h => h.dia === today);
  
  if (!todaySchedule || !todaySchedule.disponible) {
    return 'No disponible hoy';
  }
  
  const { horaInicio, horaFin, descansos } = todaySchedule;
  
  if (descansos && descansos.length > 0) {
    const mainBreak = descansos[0];
    return `${horaInicio}-${mainBreak.horaInicio}, ${mainBreak.horaFin}-${horaFin}`;
  }
  
  return `${horaInicio}-${horaFin}`;
};

export const isDentistAvailable = (horarios, estadoDisponibilidad) => {
  if (estadoDisponibilidad !== 'disponible') return false;
  if (!horarios || horarios.length === 0) return false;
  
  const now = new Date();
  const currentDay = now.toLocaleDateString('es-PE', { weekday: 'long' }).toLowerCase();
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM
  
  const todaySchedule = horarios.find(h => h.dia === currentDay);
  
  if (!todaySchedule || !todaySchedule.disponible) return false;
  
  const { horaInicio, horaFin, descansos } = todaySchedule;
  
  // Check if current time is within working hours
  if (currentTime >= horaInicio && currentTime <= horaFin) {
    // Check if it's not during break time
    if (descansos && descansos.length > 0) {
      return !descansos.some(descanso => 
        currentTime >= descanso.horaInicio && currentTime <= descanso.horaFin
      );
    }
    return true;
  }
  
  return false;
};

export const getNextAvailableSlot = (horarios) => {
  if (!horarios || horarios.length === 0) return null;
  
  const now = new Date();
  const currentDay = now.toLocaleDateString('es-PE', { weekday: 'long' }).toLowerCase();
  const currentTime = now.toTimeString().slice(0, 5);
  
  // Check today first
  const todaySchedule = horarios.find(h => h.dia === currentDay);
  if (todaySchedule && todaySchedule.disponible && currentTime < todaySchedule.horaFin) {
    return {
      dia: 'hoy',
      hora: currentTime < todaySchedule.horaInicio ? todaySchedule.horaInicio : 'Próximo turno disponible'
    };
  }
  
  // Check next working day
  const daysOrder = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
  const currentDayIndex = daysOrder.indexOf(currentDay);
  
  for (let i = 1; i <= 7; i++) {
    const nextDayIndex = (currentDayIndex + i) % 7;
    const nextDay = daysOrder[nextDayIndex];
    const nextSchedule = horarios.find(h => h.dia === nextDay);
    
    if (nextSchedule && nextSchedule.disponible) {
      return {
        dia: nextDay,
        hora: nextSchedule.horaInicio
      };
    }
  }
  
  return null;
};

export const calculateAge = (fechaNacimiento) => {
  if (!fechaNacimiento) return null;
  const birth = new Date(fechaNacimiento);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

export const formatFullName = (nombres, apellidos) => {
  return `${nombres} ${apellidos}`.trim();
};

export const getMainSpecialty = (especialidades) => {
  if (!especialidades || especialidades.length === 0) return 'Odontología General';
  
  // Priorizar especialidades certificadas
  const certified = especialidades.find(e => e.certificado);
  if (certified) return certified.nombre;
  
  return especialidades[0].nombre;
};

export const formatRating = (rating, totalReviews) => {
  if (!rating || totalReviews === 0) return 'Sin calificaciones';
  return `${rating.toFixed(1)} (${totalReviews} reseña${totalReviews > 1 ? 's' : ''})`;
};

export const exportDentistsToCSV = (dentists) => {
  const headers = [
    'Código',
    'Nombres',
    'Apellidos',
    'DNI',
    'Email',
    'Teléfono',
    'Especialidad Principal',
    'Consultorio',
    'Años Experiencia',
    'Estado',
    'Verificado',
    'Aprobado',
    'Calificación',
    'Total Pacientes',
    'Fecha Ingreso'
  ];

  const csvContent = [
    headers.join(','),
    ...dentists.map(dentist => [
      dentist.codigo || '',
      `"${dentist.nombres}"`,
      `"${dentist.apellidos}"`,
      dentist.dni,
      dentist.email,
      dentist.telefono,
      getMainSpecialty(dentist.especialidades),
      dentist.consultorio?.nombre || 'N/A',
      dentist.añosExperiencia,
      dentist.activo ? 'Activo' : 'Inactivo',
      dentist.verificado ? 'Verificado' : 'Pendiente',
      dentist.aprobado ? 'Aprobado' : 'Pendiente',
      dentist.calificacionPromedio || 0,
      dentist.totalPacientes || 0,
      formatDate(dentist.fechaIngreso)
    ].join(','))
  ].join('\n');

  return csvContent;
};

export const calculateDentistStats = (dentists) => {
  const total = dentists.length;
  const activos = dentists.filter(d => d.activo).length;
  const verificados = dentists.filter(d => d.verificado).length;
  const aprobados = dentists.filter(d => d.aprobado).length;
  const disponibles = dentists.filter(d => d.estadoDisponibilidad === 'disponible').length;

  // Especialidades más comunes
  const especialidadesCount = {};
  dentists.forEach(dentist => {
    dentist.especialidades?.forEach(esp => {
      especialidadesCount[esp.nombre] = (especialidadesCount[esp.nombre] || 0) + 1;
    });
  });

  const especialidadesMasComunes = Object.entries(especialidadesCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([especialidad, cantidad]) => ({ especialidad, cantidad }));

  // Promedio de experiencia
  const totalExperiencia = dentists.reduce((sum, d) => sum + (d.añosExperiencia || 0), 0);
  const promedioExperiencia = total > 0 ? Math.round((totalExperiencia / total) * 100) / 100 : 0;

  // Promedio de pacientes
  const totalPacientes = dentists.reduce((sum, d) => sum + (d.totalPacientes || 0), 0);
  const promedioPacientes = total > 0 ? Math.round((totalPacientes / total) * 100) / 100 : 0;

  return {
    totalDentistas: total,
    dentistasActivos: activos,
    dentistasInactivos: total - activos,
    dentistasVerificados: verificados,
    dentistasAprobados: aprobados,
    dentistasDisponibles: disponibles,
    promedioExperiencia,
    promedioPacientesPorDentista: promedioPacientes,
    especialidadesMasComunes,
    porcentajeActivos: total > 0 ? Math.round((activos / total) * 100) : 0,
    porcentajeVerificados: total > 0 ? Math.round((verificados / total) * 100) : 0,
    porcentajeAprobados: total > 0 ? Math.round((aprobados / total) * 100) : 0
  };
};

export const filterDentists = (dentists, filters) => {
  return dentists.filter(dentist => {
    // Filtro de búsqueda
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        dentist.nombres.toLowerCase().includes(searchLower) ||
        dentist.apellidos.toLowerCase().includes(searchLower) ||
        dentist.dni.includes(searchLower) ||
        dentist.email.toLowerCase().includes(searchLower) ||
        dentist.numeroColegiatura.toLowerCase().includes(searchLower) ||
        dentist.especialidades?.some(e => e.nombre.toLowerCase().includes(searchLower)) ||
        dentist.consultorio?.nombre.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Filtro por consultorio
    if (filters.consultorioId && dentist.consultorioId !== filters.consultorioId) {
      return false;
    }

    // Filtro por especialidades
    if (filters.especialidades && filters.especialidades.length > 0) {
      const hasSpecialty = filters.especialidades.some(esp => 
        dentist.especialidades?.some(e => e.nombre === esp)
      );
      if (!hasSpecialty) return false;
    }

    // Filtro por años de experiencia
    if (filters.añosExperienciaMin !== null && dentist.añosExperiencia < filters.añosExperienciaMin) {
      return false;
    }
    if (filters.añosExperienciaMax !== null && dentist.añosExperiencia > filters.añosExperienciaMax) {
      return false;
    }

    // Filtro por disponibilidad hoy
    if (filters.disponibleHoy && !isDentistAvailable(dentist.horariosDisponibilidad, dentist.estadoDisponibilidad)) {
      return false;
    }

    // Filtro por turnos libres
    if (filters.conTurnosLibres && (!dentist.turnosDisponiblesHoy || dentist.turnosDisponiblesHoy === 0)) {
      return false;
    }

    // Filtro por calificación mínima
    if (filters.calificacionMin && (!dentist.calificacionPromedio || dentist.calificacionPromedio < filters.calificacionMin)) {
      return false;
    }

    // Filtros de estado
    if (filters.activo !== null && dentist.activo !== filters.activo) {
      return false;
    }
    if (filters.verificado !== null && dentist.verificado !== filters.verificado) {
      return false;
    }
    if (filters.aprobado !== null && dentist.aprobado !== filters.aprobado) {
      return false;
    }

    return true;
  });
};

export const sortDentists = (dentists, sortBy, sortOrder) => {
  return [...dentists].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    // Manejar diferentes tipos de datos
    if (sortBy === 'nombre') {
      aValue = `${a.nombres} ${a.apellidos}`.toLowerCase();
      bValue = `${b.nombres} ${b.apellidos}`.toLowerCase();
    } else if (sortBy === 'especialidad') {
      aValue = getMainSpecialty(a.especialidades).toLowerCase();
      bValue = getMainSpecialty(b.especialidades).toLowerCase();
    } else if (sortBy === 'consultorio') {
      aValue = a.consultorio?.nombre || '';
      bValue = b.consultorio?.nombre || '';
    } else if (sortBy === 'fechaIngreso') {
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

export const validateBusinessHours = (horarios) => {
  if (!horarios || horarios.length === 0) return false;
  
  // At least one day should be available
  const hasAvailableDay = horarios.some(h => h.disponible);
  if (!hasAvailableDay) return false;
  
  // Validate time format and logic for available days
  for (const horario of horarios) {
    if (horario.disponible) {
      if (!horario.horaInicio || !horario.horaFin) return false;
      if (horario.horaInicio >= horario.horaFin) return false;
      
      // Validate break times
      if (horario.descansos && horario.descansos.length > 0) {
        for (const descanso of horario.descansos) {
          if (!descanso.horaInicio || !descanso.horaFin) return false;
          if (descanso.horaInicio >= descanso.horaFin) return false;
          if (descanso.horaInicio < horario.horaInicio || descanso.horaFin > horario.horaFin) return false;
        }
      }
    }
  }
  
  return true;
};

export const getDefaultSchedule = () => {
  return [
    { dia: 'lunes', disponible: true, horaInicio: '08:00', horaFin: '18:00', descansos: [{ horaInicio: '12:00', horaFin: '13:00', tipo: 'almuerzo' }] },
    { dia: 'martes', disponible: true, horaInicio: '08:00', horaFin: '18:00', descansos: [{ horaInicio: '12:00', horaFin: '13:00', tipo: 'almuerzo' }] },
    { dia: 'miercoles', disponible: true, horaInicio: '08:00', horaFin: '18:00', descansos: [{ horaInicio: '12:00', horaFin: '13:00', tipo: 'almuerzo' }] },
    { dia: 'jueves', disponible: true, horaInicio: '08:00', horaFin: '18:00', descansos: [{ horaInicio: '12:00', horaFin: '13:00', tipo: 'almuerzo' }] },
    { dia: 'viernes', disponible: true, horaInicio: '08:00', horaFin: '18:00', descansos: [{ horaInicio: '12:00', horaFin: '13:00', tipo: 'almuerzo' }] },
    { dia: 'sabado', disponible: true, horaInicio: '08:00', horaFin: '14:00', descansos: [] },
    { dia: 'domingo', disponible: false, descansos: [] }
  ];
};

export const formatLanguages = (idiomas) => {
  if (!idiomas || idiomas.length === 0) return 'No especificado';
  
  return idiomas
    .filter(idioma => idioma.idioma !== 'Español') // No mostrar español como es nativo
    .map(idioma => `${idioma.idioma} (${idioma.nivel})`)
    .join(', ');
};

export const calculateWorkingHours = (horarios) => {
  if (!horarios || horarios.length === 0) return 0;
  
  let totalMinutes = 0;
  
  horarios.forEach(horario => {
    if (horario.disponible && horario.horaInicio && horario.horaFin) {
      const [startHour, startMin] = horario.horaInicio.split(':').map(Number);
      const [endHour, endMin] = horario.horaFin.split(':').map(Number);
      
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      
      let dayMinutes = endMinutes - startMinutes;
      
      // Restar descansos
      if (horario.descansos && horario.descansos.length > 0) {
        horario.descansos.forEach(descanso => {
          const [breakStartHour, breakStartMin] = descanso.horaInicio.split(':').map(Number);
          const [breakEndHour, breakEndMin] = descanso.horaFin.split(':').map(Number);
          
          const breakStartMinutes = breakStartHour * 60 + breakStartMin;
          const breakEndMinutes = breakEndHour * 60 + breakEndMin;
          
          dayMinutes -= (breakEndMinutes - breakStartMinutes);
        });
      }
      
      totalMinutes += dayMinutes;
    }
  });
  
  return Math.round(totalMinutes / 60 * 100) / 100; // Horas con decimales
};