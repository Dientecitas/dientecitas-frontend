import { format, subDays, subMonths } from 'date-fns';

// Mock data for patient appointments
const mockAppointments = [
  {
    id: '1',
    patientId: '1',
    fecha: '2024-01-20',
    hora: '10:00',
    dentista: {
      id: '1',
      nombre: 'Dr. Carlos Rodríguez',
      especialidad: 'Ortodoncia'
    },
    clinica: {
      id: '1',
      nombre: 'Clínica Dental Centro',
      direccion: 'Av. Principal 123, Centro'
    },
    servicio: {
      id: '1',
      nombre: 'Limpieza Dental',
      categoria: 'Limpieza y Prevención'
    },
    estado: 'completada',
    observaciones: 'Limpieza rutinaria completada sin complicaciones',
    precio: 80,
    rating: {
      stars: 5,
      comment: 'Excelente atención, muy profesional',
      categories: {
        atencion: 5,
        puntualidad: 5,
        instalaciones: 4,
        tratamiento: 5
      },
      fecha: '2024-01-20'
    }
  },
  {
    id: '2',
    patientId: '1',
    fecha: '2024-01-15',
    hora: '14:30',
    dentista: {
      id: '2',
      nombre: 'Dra. Ana García',
      especialidad: 'Endodoncia'
    },
    clinica: {
      id: '2',
      nombre: 'Sonrisas Centro',
      direccion: 'Calle Central 456, Centro'
    },
    servicio: {
      id: '2',
      nombre: 'Consulta General',
      categoria: 'Consulta'
    },
    estado: 'completada',
    observaciones: 'Evaluación general, se recomienda limpieza',
    precio: 60,
    rating: null
  },
  {
    id: '3',
    patientId: '1',
    fecha: '2024-02-05',
    hora: '09:00',
    dentista: {
      id: '1',
      nombre: 'Dr. Carlos Rodríguez',
      especialidad: 'Ortodoncia'
    },
    clinica: {
      id: '1',
      nombre: 'Clínica Dental Centro',
      direccion: 'Av. Principal 123, Centro'
    },
    servicio: {
      id: '3',
      nombre: 'Blanqueamiento Dental',
      categoria: 'Odontología Estética'
    },
    estado: 'pendiente',
    observaciones: 'Cita programada para blanqueamiento',
    precio: 250,
    rating: null
  },
  {
    id: '4',
    patientId: '1',
    fecha: '2023-12-10',
    hora: '16:00',
    dentista: {
      id: '3',
      nombre: 'Dr. Luis Martínez',
      especialidad: 'Cirugía Oral'
    },
    clinica: {
      id: '3',
      nombre: 'Dental Norte',
      direccion: 'Av. Norte 789, Norte'
    },
    servicio: {
      id: '4',
      nombre: 'Extracción Simple',
      categoria: 'Cirugía Oral'
    },
    estado: 'cancelada',
    observaciones: 'Cancelada por el paciente',
    precio: 150,
    rating: null
  },
  {
    id: '5',
    patientId: '2',
    fecha: '2024-01-25',
    hora: '11:30',
    dentista: {
      id: '2',
      nombre: 'Dra. Ana García',
      especialidad: 'Endodoncia'
    },
    clinica: {
      id: '2',
      nombre: 'Sonrisas Centro',
      direccion: 'Calle Central 456, Centro'
    },
    servicio: {
      id: '5',
      nombre: 'Endodoncia',
      categoria: 'Endodoncia'
    },
    estado: 'completada',
    observaciones: 'Tratamiento de conducto exitoso',
    precio: 350,
    rating: {
      stars: 4,
      comment: 'Buen tratamiento, aunque fue un poco doloroso',
      categories: {
        atencion: 4,
        puntualidad: 5,
        instalaciones: 4,
        tratamiento: 4
      },
      fecha: '2024-01-25'
    }
  }
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const filterAppointmentsByDate = (appointments, dateRange) => {
  const now = new Date();
  
  switch (dateRange) {
    case '30days':
      return appointments.filter(apt => 
        new Date(apt.fecha) >= subDays(now, 30)
      );
    case '3months':
      return appointments.filter(apt => 
        new Date(apt.fecha) >= subMonths(now, 3)
      );
    case '6months':
      return appointments.filter(apt => 
        new Date(apt.fecha) >= subMonths(now, 6)
      );
    case '1year':
      return appointments.filter(apt => 
        new Date(apt.fecha) >= subMonths(now, 12)
      );
    default:
      return appointments;
  }
};

export const patientAppointmentService = {
  getAppointments: async (params = {}) => {
    await delay(800);
    
    const { 
      dateRange = 'all', 
      status = 'all', 
      dentist = 'all',
      page = 1,
      limit = 10
    } = params;
    
    // Get current patient ID from token (mock implementation)
    const token = localStorage.getItem('patientToken');
    if (!token) {
      return { success: false, error: 'No autorizado' };
    }
    
    const patientId = token.split('_')[1];
    
    // Filter appointments by patient
    let appointments = mockAppointments.filter(apt => apt.patientId === patientId);
    
    // Apply filters
    appointments = filterAppointmentsByDate(appointments, dateRange);
    
    if (status !== 'all') {
      appointments = appointments.filter(apt => apt.estado === status);
    }
    
    if (dentist !== 'all') {
      appointments = appointments.filter(apt => apt.dentista.id === dentist);
    }
    
    // Sort by date (most recent first)
    appointments.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    // Pagination
    const total = appointments.length;
    const startIndex = (page - 1) * limit;
    const paginatedAppointments = appointments.slice(startIndex, startIndex + limit);
    
    return {
      success: true,
      data: {
        appointments: paginatedAppointments,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  getAppointmentById: async (appointmentId) => {
    await delay(500);
    
    const appointment = mockAppointments.find(apt => apt.id === appointmentId);
    
    if (appointment) {
      return {
        success: true,
        data: appointment
      };
    }
    
    return {
      success: false,
      error: 'Cita no encontrada'
    };
  },

  submitRating: async (appointmentId, ratingData) => {
    await delay(1000);
    
    const appointmentIndex = mockAppointments.findIndex(apt => apt.id === appointmentId);
    
    if (appointmentIndex === -1) {
      return {
        success: false,
        error: 'Cita no encontrada'
      };
    }
    
    const rating = {
      ...ratingData,
      fecha: new Date().toISOString().split('T')[0]
    };
    
    mockAppointments[appointmentIndex].rating = rating;
    
    return {
      success: true,
      data: rating
    };
  },

  getDentists: async () => {
    await delay(300);
    
    // Extract unique dentists from appointments
    const dentists = mockAppointments.reduce((acc, apt) => {
      if (!acc.find(d => d.id === apt.dentista.id)) {
        acc.push(apt.dentista);
      }
      return acc;
    }, []);
    
    return {
      success: true,
      data: dentists
    };
  },

  getAppointmentStats: async () => {
    await delay(500);
    
    const token = localStorage.getItem('patientToken');
    if (!token) {
      return { success: false, error: 'No autorizado' };
    }
    
    const patientId = token.split('_')[1];
    const appointments = mockAppointments.filter(apt => apt.patientId === patientId);
    
    const stats = {
      total: appointments.length,
      completadas: appointments.filter(apt => apt.estado === 'completada').length,
      pendientes: appointments.filter(apt => apt.estado === 'pendiente').length,
      canceladas: appointments.filter(apt => apt.estado === 'cancelada').length,
      conRating: appointments.filter(apt => apt.rating !== null).length,
      proximaCita: appointments
        .filter(apt => apt.estado === 'pendiente' && new Date(apt.fecha) > new Date())
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))[0] || null
    };
    
    return {
      success: true,
      data: stats
    };
  }
};