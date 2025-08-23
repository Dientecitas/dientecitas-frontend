import { useState, useEffect, useCallback } from 'react';
import { useAppointmentContext } from '../store/appointmentContext';
import { useLoading } from '../../../shared/hooks/useLoading';

// Mock data para desarrollo
const mockAppointments = [
  {
    id: '1',
    numero: 'AP-2024-001234',
    fecha: '2024-03-15',
    horaInicio: '09:00',
    horaFin: '09:45',
    duracion: 45,
    estado: 'confirmada',
    tipoConsulta: 'primera_vez',
    prioridad: 'normal',
    motivo: 'Limpieza dental y revisión general',
    paciente: {
      id: 'p1',
      nombres: 'Juan Carlos',
      apellidos: 'Pérez García',
      dni: '12345678',
      telefono: '987654321',
      email: 'juan.perez@email.com'
    },
    dentista: {
      id: 'd1',
      nombres: 'Dr. María',
      apellidos: 'González López',
      especialidad: 'Odontología General',
      telefono: '987123456'
    },
    consultorio: {
      id: 'c1',
      nombre: 'Consultorio Central',
      direccion: 'Av. Principal 123, Lima',
      telefono: '01-234-5678'
    },
    servicios: [
      {
        id: 'limpieza',
        servicio: 'Limpieza Dental',
        categoria: 'Preventiva',
        duracion: 45,
        costo: 80
      }
    ],
    costo: {
      subtotal: 80,
      total: 80,
      estadoPago: 'pendiente',
      moneda: 'PEN'
    },
    asistencia: 'pendiente',
    fechaCreacion: '2024-03-10T10:00:00Z',
    fechaActualizacion: '2024-03-10T10:00:00Z'
  },
  {
    id: '2',
    numero: 'AP-2024-001235',
    fecha: '2024-03-15',
    horaInicio: '10:00',
    horaFin: '11:00',
    duracion: 60,
    estado: 'programada',
    tipoConsulta: 'tratamiento',
    prioridad: 'alta',
    motivo: 'Empaste dental en molar superior',
    paciente: {
      id: 'p2',
      nombres: 'Ana María',
      apellidos: 'Rodríguez Silva',
      dni: '87654321',
      telefono: '987654322',
      email: 'ana.rodriguez@email.com'
    },
    dentista: {
      id: 'd2',
      nombres: 'Dr. Carlos',
      apellidos: 'Mendoza Ruiz',
      especialidad: 'Endodoncia',
      telefono: '987123457'
    },
    consultorio: {
      id: 'c1',
      nombre: 'Consultorio Central',
      direccion: 'Av. Principal 123, Lima',
      telefono: '01-234-5678'
    },
    servicios: [
      {
        id: 'empaste',
        servicio: 'Empaste Dental',
        categoria: 'Restaurativa',
        duracion: 60,
        costo: 120
      }
    ],
    costo: {
      subtotal: 120,
      total: 120,
      estadoPago: 'pendiente',
      moneda: 'PEN'
    },
    asistencia: 'pendiente',
    fechaCreacion: '2024-03-11T14:30:00Z',
    fechaActualizacion: '2024-03-11T14:30:00Z'
  },
  {
    id: '3',
    numero: 'AP-2024-001236',
    fecha: '2024-03-14',
    horaInicio: '15:00',
    horaFin: '15:30',
    duracion: 30,
    estado: 'completada',
    tipoConsulta: 'control',
    prioridad: 'normal',
    motivo: 'Control post-tratamiento',
    paciente: {
      id: 'p3',
      nombres: 'Luis Alberto',
      apellidos: 'Vargas Torres',
      dni: '11223344',
      telefono: '987654323',
      email: 'luis.vargas@email.com'
    },
    dentista: {
      id: 'd1',
      nombres: 'Dr. María',
      apellidos: 'González López',
      especialidad: 'Odontología General',
      telefono: '987123456'
    },
    consultorio: {
      id: 'c2',
      nombre: 'Consultorio Norte',
      direccion: 'Jr. Los Olivos 456, Lima',
      telefono: '01-234-5679'
    },
    servicios: [
      {
        id: 'consulta',
        servicio: 'Consulta General',
        categoria: 'Diagnóstico',
        duracion: 30,
        costo: 50
      }
    ],
    costo: {
      subtotal: 50,
      total: 50,
      estadoPago: 'pagado',
      moneda: 'PEN',
      fechaPago: '2024-03-14T15:30:00Z',
      referenciaPago: 'PAY-2024-001'
    },
    asistencia: 'asistio',
    fechaCreacion: '2024-03-12T09:15:00Z',
    fechaActualizacion: '2024-03-14T15:30:00Z'
  }
];

// Mock data para pacientes, dentistas y consultorios
const mockPatients = [
  {
    id: 'p1',
    nombres: 'Juan Carlos',
    apellidos: 'Pérez García',
    dni: '12345678'
  },
  {
    id: 'p2',
    nombres: 'Ana María',
    apellidos: 'Rodríguez Silva',
    dni: '87654321'
  },
  {
    id: 'p3',
    nombres: 'Luis Alberto',
    apellidos: 'Vargas Torres',
    dni: '11223344'
  }
];

const mockDentists = [
  {
    id: 'd1',
    nombres: 'Dr. María',
    apellidos: 'González López',
    especialidad: 'Odontología General'
  },
  {
    id: 'd2',
    nombres: 'Dr. Carlos',
    apellidos: 'Mendoza Ruiz',
    especialidad: 'Endodoncia'
  }
];

const mockClinics = [
  {
    id: 'c1',
    nombre: 'Consultorio Central',
    direccion: 'Av. Principal 123, Lima'
  },
  {
    id: 'c2',
    nombre: 'Consultorio Norte',
    direccion: 'Jr. Los Olivos 456, Lima'
  }
];

const mockAvailableSlots = [
  {
    id: 'slot1',
    fecha: '2024-03-16',
    horaInicio: '09:00',
    horaFin: '09:30',
    dentistaId: 'd1',
    consultorioId: 'c1',
    disponible: true
  },
  {
    id: 'slot2',
    fecha: '2024-03-16',
    horaInicio: '09:30',
    horaFin: '10:00',
    dentistaId: 'd1',
    consultorioId: 'c1',
    disponible: true
  },
  {
    id: 'slot3',
    fecha: '2024-03-16',
    horaInicio: '10:00',
    horaFin: '10:30',
    dentistaId: 'd2',
    consultorioId: 'c1',
    disponible: true
  }
];

export const useAppointments = () => {
  const {
    appointments,
    filters,
    pagination,
    loading,
    error,
    setAppointments,
    addAppointment,
    updateAppointment,
    removeAppointment,
    setLoading,
    setError,
    clearError
  } = useAppointmentContext();

  const { isLoading, startLoading, stopLoading } = useLoading();

  // Estados locales para operaciones específicas
  const [operationLoading, setOperationLoading] = useState({
    create: false,
    update: false,
    cancel: false,
    reschedule: false,
    checkIn: false
  });

  // Simular delay para operaciones async
  const simulateDelay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));

  // Fetch appointments con filtros
  const fetchAppointments = useCallback(async (customFilters = {}) => {
    try {
      setLoading('appointments', true);
      clearError('appointments');
      
      await simulateDelay(800);
      
      // Aplicar filtros a los datos mock
      let filteredAppointments = [...mockAppointments];
      
      const activeFilters = { ...filters, ...customFilters };
      
      // Filtrar por fecha
      if (activeFilters.fechaDesde) {
        filteredAppointments = filteredAppointments.filter(
          apt => apt.fecha >= activeFilters.fechaDesde
        );
      }
      
      if (activeFilters.fechaHasta) {
        filteredAppointments = filteredAppointments.filter(
          apt => apt.fecha <= activeFilters.fechaHasta
        );
      }
      
      // Filtrar por estados
      if (activeFilters.estados && activeFilters.estados.length > 0) {
        filteredAppointments = filteredAppointments.filter(
          apt => activeFilters.estados.includes(apt.estado)
        );
      }
      
      // Filtrar por dentistas
      if (activeFilters.dentistas && activeFilters.dentistas.length > 0) {
        filteredAppointments = filteredAppointments.filter(
          apt => activeFilters.dentistas.includes(apt.dentistaId)
        );
      }
      
      // Filtrar por pacientes
      if (activeFilters.pacientes && activeFilters.pacientes.length > 0) {
        filteredAppointments = filteredAppointments.filter(
          apt => activeFilters.pacientes.includes(apt.pacienteId)
        );
      }
      
      // Búsqueda por texto
      if (activeFilters.search) {
        const searchTerm = activeFilters.search.toLowerCase();
        filteredAppointments = filteredAppointments.filter(apt =>
          apt.numero.toLowerCase().includes(searchTerm) ||
          apt.paciente.nombres.toLowerCase().includes(searchTerm) ||
          apt.paciente.apellidos.toLowerCase().includes(searchTerm) ||
          apt.dentista.nombres.toLowerCase().includes(searchTerm) ||
          apt.dentista.apellidos.toLowerCase().includes(searchTerm) ||
          apt.motivo.toLowerCase().includes(searchTerm)
        );
      }
      
      // Calcular paginación
      const currentPage = pagination.page || 1;
      const limit = pagination.limit || 10;
      const total = filteredAppointments.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (currentPage - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedAppointments = filteredAppointments.slice(startIndex, endIndex);
      
      // Construir objeto de paginación completo
      const paginationData = {
        page: currentPage,
        limit,
        total,
        totalPages,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1
      };
      
      setAppointments(paginatedAppointments, paginationData);
      
      return {
        success: true,
        data: paginatedAppointments,
        total,
        pagination: paginationData
      };
      
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('appointments', 'Error al cargar las citas');
      return {
        success: false,
        error: error.message
      };
    } finally {
      setLoading('appointments', false);
    }
  }, [filters, setAppointments, setLoading, setError, clearError]);

  // Crear nueva cita
  const createAppointment = useCallback(async (appointmentData) => {
    try {
      setOperationLoading(prev => ({ ...prev, create: true }));
      setLoading('create', true);
      clearError('create');
      
      await simulateDelay(1500);
      
      // Simular validaciones
      if (!appointmentData.pacienteId) {
        throw new Error('Paciente es requerido');
      }
      
      if (!appointmentData.dentistaId) {
        throw new Error('Dentista es requerido');
      }
      
      if (!appointmentData.fecha || !appointmentData.horaInicio) {
        throw new Error('Fecha y hora son requeridas');
      }
      
      // Crear nueva cita
      const newAppointment = {
        id: `apt_${Date.now()}`,
        numero: `AP-2024-${String(Date.now()).slice(-6)}`,
        ...appointmentData,
        estado: 'programada',
        asistencia: 'pendiente',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        // Poblar datos relacionados (simulado)
        paciente: mockPatients.find(p => p.id === appointmentData.pacienteId),
        dentista: mockDentists.find(d => d.id === appointmentData.dentistaId),
        consultorio: mockClinics.find(c => c.id === appointmentData.consultorioId)
      };
      
      addAppointment(newAppointment);
      
      return {
        success: true,
        appointment: newAppointment,
        message: 'Cita creada exitosamente'
      };
      
    } catch (error) {
      console.error('Error creating appointment:', error);
      setError('create', error.message);
      return {
        success: false,
        error: error.message
      };
    } finally {
      setOperationLoading(prev => ({ ...prev, create: false }));
      setLoading('create', false);
    }
  }, [addAppointment, setLoading, setError, clearError]);

  // Actualizar cita existente
  const updateAppointmentData = useCallback(async (appointmentId, updateData) => {
    try {
      setOperationLoading(prev => ({ ...prev, update: true }));
      setLoading('update', true);
      clearError('update');
      
      await simulateDelay(1200);
      
      const existingAppointment = appointments.find(apt => apt.id === appointmentId);
      if (!existingAppointment) {
        throw new Error('Cita no encontrada');
      }
      
      const updatedAppointment = {
        ...existingAppointment,
        ...updateData,
        fechaActualizacion: new Date().toISOString()
      };
      
      updateAppointment(appointmentId, updatedAppointment);
      
      return {
        success: true,
        appointment: updatedAppointment,
        message: 'Cita actualizada exitosamente'
      };
      
    } catch (error) {
      console.error('Error updating appointment:', error);
      setError('update', error.message);
      return {
        success: false,
        error: error.message
      };
    } finally {
      setOperationLoading(prev => ({ ...prev, update: false }));
      setLoading('update', false);
    }
  }, [appointments, updateAppointment, setLoading, setError, clearError]);

  // Cancelar cita
  const cancelAppointment = useCallback(async (appointmentId, reason = '') => {
    try {
      setOperationLoading(prev => ({ ...prev, cancel: true }));
      setLoading('cancel', true);
      clearError('cancel');
      
      await simulateDelay(1000);
      
      const existingAppointment = appointments.find(apt => apt.id === appointmentId);
      if (!existingAppointment) {
        throw new Error('Cita no encontrada');
      }
      
      const cancelledAppointment = {
        ...existingAppointment,
        estado: 'cancelada',
        cancelacion: {
          fecha: new Date().toISOString(),
          motivo: reason,
          categoria: 'admin',
          solicitadoPor: 'admin'
        },
        fechaActualizacion: new Date().toISOString()
      };
      
      updateAppointment(appointmentId, cancelledAppointment);
      
      return {
        success: true,
        appointment: cancelledAppointment,
        message: 'Cita cancelada exitosamente'
      };
      
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      setError('cancel', error.message);
      return {
        success: false,
        error: error.message
      };
    } finally {
      setOperationLoading(prev => ({ ...prev, cancel: false }));
      setLoading('cancel', false);
    }
  }, [appointments, updateAppointment, setLoading, setError, clearError]);

  // Reagendar cita
  const rescheduleAppointment = useCallback(async (appointmentId, newDateTime, reason = '') => {
    try {
      setOperationLoading(prev => ({ ...prev, reschedule: true }));
      setLoading('reschedule', true);
      clearError('reschedule');
      
      await simulateDelay(1500);
      
      const existingAppointment = appointments.find(apt => apt.id === appointmentId);
      if (!existingAppointment) {
        throw new Error('Cita no encontrada');
      }
      
      const rescheduledAppointment = {
        ...existingAppointment,
        ...newDateTime,
        estado: 'reagendada',
        reagendamientos: [
          ...(existingAppointment.reagendamientos || []),
          {
            id: `resc_${Date.now()}`,
            fechaOriginal: existingAppointment.fecha,
            horaOriginal: existingAppointment.horaInicio,
            fechaNueva: newDateTime.fecha,
            horaNueva: newDateTime.horaInicio,
            motivo: reason,
            solicitadoPor: 'admin',
            fecha: new Date().toISOString()
          }
        ],
        fechaActualizacion: new Date().toISOString()
      };
      
      updateAppointment(appointmentId, rescheduledAppointment);
      
      return {
        success: true,
        appointment: rescheduledAppointment,
        message: 'Cita reagendada exitosamente'
      };
      
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      setError('reschedule', error.message);
      return {
        success: false,
        error: error.message
      };
    } finally {
      setOperationLoading(prev => ({ ...prev, reschedule: false }));
      setLoading('reschedule', false);
    }
  }, [appointments, updateAppointment, setLoading, setError, clearError]);

  // Check-in de paciente
  const checkInPatient = useCallback(async (appointmentId, checkInData = {}) => {
    try {
      setOperationLoading(prev => ({ ...prev, checkIn: true }));
      setLoading('checkIn', true);
      clearError('checkIn');
      
      await simulateDelay(800);
      
      const existingAppointment = appointments.find(apt => apt.id === appointmentId);
      if (!existingAppointment) {
        throw new Error('Cita no encontrada');
      }
      
      if (existingAppointment.estado !== 'confirmada') {
        throw new Error('Solo se puede hacer check-in de citas confirmadas');
      }
      
      const checkedInAppointment = {
        ...existingAppointment,
        estado: 'en_sala_espera',
        asistencia: 'asistio',
        checkIn: {
          fecha: new Date().toISOString(),
          metodo: 'recepcion',
          ...checkInData
        },
        fechaActualizacion: new Date().toISOString()
      };
      
      updateAppointment(appointmentId, checkedInAppointment);
      
      return {
        success: true,
        appointment: checkedInAppointment,
        message: 'Check-in realizado exitosamente'
      };
      
    } catch (error) {
      console.error('Error during check-in:', error);
      setError('checkIn', error.message);
      return {
        success: false,
        error: error.message
      };
    } finally {
      setOperationLoading(prev => ({ ...prev, checkIn: false }));
      setLoading('checkIn', false);
    }
  }, [appointments, updateAppointment, setLoading, setError, clearError]);

  // Obtener datos auxiliares
  const getPatients = useCallback(async () => {
    await simulateDelay(300);
    return mockPatients;
  }, []);

  const getDentists = useCallback(async () => {
    await simulateDelay(300);
    return mockDentists;
  }, []);

  const getClinics = useCallback(async () => {
    await simulateDelay(300);
    return mockClinics;
  }, []);

  const getAvailableSlots = useCallback(async (filters = {}) => {
    await simulateDelay(500);
    return mockAvailableSlots.filter(slot => {
      if (filters.fecha && slot.fecha !== filters.fecha) return false;
      if (filters.dentistaId && slot.dentistaId !== filters.dentistaId) return false;
      if (filters.consultorioId && slot.consultorioId !== filters.consultorioId) return false;
      return slot.disponible;
    });
  }, []);

  // Estadísticas de citas
  const getAppointmentStats = useCallback(() => {
    const total = appointments.length;
    const programadas = appointments.filter(apt => apt.estado === 'programada').length;
    const confirmadas = appointments.filter(apt => apt.estado === 'confirmada').length;
    const completadas = appointments.filter(apt => apt.estado === 'completada').length;
    const canceladas = appointments.filter(apt => apt.estado === 'cancelada').length;
    const noShows = appointments.filter(apt => apt.estado === 'no_show').length;
    
    return {
      total,
      programadas,
      confirmadas,
      completadas,
      canceladas,
      noShows,
      tasaAsistencia: total > 0 ? ((completadas / total) * 100).toFixed(1) : 0,
      tasaCancelacion: total > 0 ? ((canceladas / total) * 100).toFixed(1) : 0
    };
  }, [appointments]);

  // Cargar datos iniciales
  useEffect(() => {
    if (appointments.length === 0) {
      fetchAppointments();
    }
  }, [fetchAppointments, appointments.length]);

  return {
    // Datos
    appointments,
    filters,
    pagination,
    
    // Estados de carga
    loading: {
      appointments: loading.appointments || false,
      create: loading.create || operationLoading.create,
      update: loading.update || operationLoading.update,
      cancel: loading.cancel || operationLoading.cancel,
      reschedule: loading.reschedule || operationLoading.reschedule,
      checkIn: loading.checkIn || operationLoading.checkIn
    },
    
    // Errores
    error,
    
    // Operaciones principales
    fetchAppointments,
    createAppointment,
    updateAppointment: updateAppointmentData,
    cancelAppointment,
    rescheduleAppointment,
    checkInPatient,
    
    // Datos auxiliares
    getPatients,
    getDentists,
    getClinics,
    getAvailableSlots,
    
    // Estadísticas
    getAppointmentStats,
    
    // Utilidades
    clearError
  };
};

export default useAppointments;