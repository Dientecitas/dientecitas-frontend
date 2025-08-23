import api from '../../../shared/services/apiService';

// Mock data para desarrollo
const mockDentists = [
  {
    id: '1',
    nombres: 'Carlos Alberto',
    apellidos: 'Mendoza Herrera',
    dni: '12345678',
    fechaNacimiento: '1985-03-15',
    genero: 'masculino',
    celular: '987654321',
    email: 'carlos.mendoza@email.com',
    direccion: 'Av. Los Álamos 456, San Isidro',
    
    numeroColegiatura: 'COP-15478',
    especialidades: [
      {
        id: '1',
        nombre: 'Odontología General',
        categoria: 'general',
        certificado: true,
        fechaCertificacion: '2010-12-15'
      },
      {
        id: '2', 
        nombre: 'Implantología',
        categoria: 'especializada',
        certificado: true,
        fechaCertificacion: '2018-08-20'
      }
    ],
    consultorioId: '1',
    consultorio: { id: '1', nombre: 'Clínica Dental San Borja' },
    
    añosExperiencia: 15,
    universidades: [
      {
        id: '1',
        nombre: 'Universidad Nacional Mayor de San Marcos',
        carrera: 'Odontología',
        grado: 'licenciatura',
        añoGraduacion: 2008,
        pais: 'Perú'
      }
    ],
    
    idiomas: [
      { idioma: 'Español', nivel: 'nativo', certificado: false },
      { idioma: 'Inglés', nivel: 'avanzado', certificado: true }
    ],
    
    horariosDisponibilidad: [
      {
        dia: 'lunes',
        disponible: true,
        horaInicio: '09:00',
        horaFin: '18:00',
        descansos: [
          {
            horaInicio: '13:00',
            horaFin: '14:00',
            tipo: 'almuerzo',
            descripcion: 'Hora de almuerzo'
          }
        ]
      },
      {
        dia: 'martes',
        disponible: true,
        horaInicio: '09:00',
        horaFin: '18:00',
        descansos: [
          {
            horaInicio: '13:00',
            horaFin: '14:00',
            tipo: 'almuerzo'
          }
        ]
      },
      {
        dia: 'miercoles',
        disponible: true,
        horaInicio: '09:00',
        horaFin: '18:00',
        descansos: [
          {
            horaInicio: '13:00',
            horaFin: '14:00',
            tipo: 'almuerzo'
          }
        ]
      },
      {
        dia: 'jueves',
        disponible: true,
        horaInicio: '09:00',
        horaFin: '18:00',
        descansos: [
          {
            horaInicio: '13:00',
            horaFin: '14:00',
            tipo: 'almuerzo'
          }
        ]
      },
      {
        dia: 'viernes',
        disponible: true,
        horaInicio: '09:00',
        horaFin: '18:00',
        descansos: [
          {
            horaInicio: '13:00',
            horaFin: '14:00',
            tipo: 'almuerzo'
          }
        ]
      },
      {
        dia: 'sabado',
        disponible: true,
        horaInicio: '08:00',
        horaFin: '14:00',
        descansos: []
      },
      {
        dia: 'domingo',
        disponible: false,
        descansos: []
      }
    ],
    
    estadoDisponibilidad: 'disponible',
    duracionConsultaDefault: 45,
    tiempoDescansoEntreCitas: 15,
    pacientesPorDia: 12,
    
    biografia: 'Odontólogo especialista en implantología con más de 15 años de experiencia. Graduado de la UNMSM con especialización en Implantología Oral.',
    foto: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg',
    
    tarifas: [
      {
        servicio: 'Consulta General',
        precio: 100,
        moneda: 'PEN',
        duracion: 45,
        descripcion: 'Evaluación completa y diagnóstico',
        requiereConsulta: false,
        categoria: 'Consultas'
      },
      {
        servicio: 'Implante Dental',
        precio: 2500,
        moneda: 'PEN',
        duracion: 90,
        descripcion: 'Implante + corona cerámica',
        requiereConsulta: true,
        categoria: 'Implantología'
      }
    ],
    
    serviciosOfrecidos: [
      'Consultas Generales',
      'Implantes Dentales',
      'Rehabilitación Oral',
      'Cirugía Oral Menor',
      'Prótesis Fijas',
      'Blanqueamiento Dental'
    ],
    
    activo: true,
    verificado: true,
    aprobado: true,
    fechaIngreso: '2020-03-01',
    fechaCreacion: '2024-01-15T10:00:00Z',
    fechaActualizacion: '2024-02-10T15:30:00Z',
    
    totalPacientes: 340,
    citasCompletadasMes: 85,
    citasPendientes: 12,
    calificacionPromedio: 4.8,
    totalReviews: 127,
    turnosDisponiblesHoy: 3,
    
    tiempoPromedioConsulta: 42,
    tasaCancelacion: 5.2,
    tasaReagendamiento: 8.1,
    puntuacionSatisfaccion: 4.7
  },
  {
    id: '2',
    nombres: 'María Elena',
    apellidos: 'Rodríguez Vega',
    dni: '23456789',
    fechaNacimiento: '1988-07-22',
    genero: 'femenino',
    celular: '876543210',
    email: 'maria.rodriguez@email.com',
    direccion: 'Calle Las Flores 123, Miraflores',
    
    numeroColegiatura: 'COP-18234',
    especialidades: [
      {
        id: '3',
        nombre: 'Ortodoncia',
        categoria: 'especializada',
        certificado: true,
        fechaCertificacion: '2015-06-10'
      },
      {
        id: '4',
        nombre: 'Ortodoncia Invisible',
        categoria: 'subespecializada',
        certificado: true,
        fechaCertificacion: '2020-03-15'
      }
    ],
    consultorioId: '2',
    consultorio: { id: '2', nombre: 'Centro Odontológico Miraflores' },
    
    añosExperiencia: 12,
    universidades: [
      {
        id: '2',
        nombre: 'Universidad Peruana Cayetano Heredia',
        carrera: 'Odontología',
        grado: 'licenciatura',
        añoGraduacion: 2012,
        pais: 'Perú'
      }
    ],
    
    idiomas: [
      { idioma: 'Español', nivel: 'nativo', certificado: false },
      { idioma: 'Inglés', nivel: 'intermedio', certificado: false },
      { idioma: 'Francés', nivel: 'basico', certificado: false }
    ],
    
    horariosDisponibilidad: [
      {
        dia: 'lunes',
        disponible: true,
        horaInicio: '08:30',
        horaFin: '17:30',
        descansos: [
          {
            horaInicio: '12:30',
            horaFin: '13:30',
            tipo: 'almuerzo'
          }
        ]
      },
      {
        dia: 'martes',
        disponible: true,
        horaInicio: '08:30',
        horaFin: '17:30',
        descansos: [
          {
            horaInicio: '12:30',
            horaFin: '13:30',
            tipo: 'almuerzo'
          }
        ]
      },
      {
        dia: 'miercoles',
        disponible: true,
        horaInicio: '08:30',
        horaFin: '17:30',
        descansos: [
          {
            horaInicio: '12:30',
            horaFin: '13:30',
            tipo: 'almuerzo'
          }
        ]
      },
      {
        dia: 'jueves',
        disponible: true,
        horaInicio: '08:30',
        horaFin: '17:30',
        descansos: [
          {
            horaInicio: '12:30',
            horaFin: '13:30',
            tipo: 'almuerzo'
          }
        ]
      },
      {
        dia: 'viernes',
        disponible: true,
        horaInicio: '08:30',
        horaFin: '17:30',
        descansos: [
          {
            horaInicio: '12:30',
            horaFin: '13:30',
            tipo: 'almuerzo'
          }
        ]
      },
      {
        dia: 'sabado',
        disponible: false,
        descansos: []
      },
      {
        dia: 'domingo',
        disponible: false,
        descansos: []
      }
    ],
    
    estadoDisponibilidad: 'ocupado',
    duracionConsultaDefault: 30,
    tiempoDescansoEntreCitas: 10,
    pacientesPorDia: 16,
    
    biografia: 'Ortodoncista especializada en tratamientos invisibles y estética dental. Certificada en sistemas Invisalign y ortodoncia lingual.',
    foto: 'https://images.pexels.com/photos/5215161/pexels-photo-5215161.jpeg',
    
    tarifas: [
      {
        servicio: 'Consulta Ortodóncica',
        precio: 120,
        moneda: 'PEN',
        duracion: 30,
        descripcion: 'Evaluación ortodóncica completa',
        requiereConsulta: false,
        categoria: 'Consultas'
      },
      {
        servicio: 'Tratamiento Invisalign',
        precio: 8500,
        moneda: 'PEN',
        duracion: 60,
        descripcion: 'Tratamiento completo con alineadores',
        requiereConsulta: true,
        categoria: 'Ortodoncia'
      }
    ],
    
    serviciosOfrecidos: [
      'Ortodoncia Tradicional',
      'Ortodoncia Invisible',
      'Ortodoncia Lingual',
      'Retenedores',
      'Consultas Ortodóncicas'
    ],
    
    activo: true,
    verificado: true,
    aprobado: true,
    fechaIngreso: '2021-01-15',
    fechaCreacion: '2024-01-16T09:30:00Z',
    fechaActualizacion: '2024-02-08T11:20:00Z',
    
    totalPacientes: 280,
    citasCompletadasMes: 72,
    citasPendientes: 8,
    calificacionPromedio: 4.9,
    totalReviews: 89,
    turnosDisponiblesHoy: 0,
    
    tiempoPromedioConsulta: 28,
    tasaCancelacion: 3.1,
    tasaReagendamiento: 6.8,
    puntuacionSatisfaccion: 4.8
  },
  {
    id: '3',
    nombres: 'Luis Fernando',
    apellidos: 'Castillo Morales',
    dni: '34567890',
    fechaNacimiento: '1990-11-08',
    genero: 'masculino',
    celular: '765432109',
    email: 'luis.castillo@email.com',
    direccion: 'Jr. Independencia 789, Surco',
    
    numeroColegiatura: 'COP-20156',
    especialidades: [
      {
        id: '5',
        nombre: 'Endodoncia',
        categoria: 'especializada',
        certificado: true,
        fechaCertificacion: '2018-04-12'
      },
      {
        id: '6',
        nombre: 'Odontología Estética',
        categoria: 'especializada',
        certificado: false
      }
    ],
    consultorioId: '3',
    consultorio: { id: '3', nombre: 'Policlínico Dental Surco' },
    
    añosExperiencia: 8,
    universidades: [
      {
        id: '3',
        nombre: 'Universidad Científica del Sur',
        carrera: 'Odontología',
        grado: 'licenciatura',
        añoGraduacion: 2016,
        pais: 'Perú'
      }
    ],
    
    idiomas: [
      { idioma: 'Español', nivel: 'nativo', certificado: false },
      { idioma: 'Inglés', nivel: 'basico', certificado: false }
    ],
    
    horariosDisponibilidad: [
      {
        dia: 'lunes',
        disponible: true,
        horaInicio: '10:00',
        horaFin: '19:00',
        descansos: [
          {
            horaInicio: '14:00',
            horaFin: '15:00',
            tipo: 'almuerzo'
          }
        ]
      },
      {
        dia: 'martes',
        disponible: true,
        horaInicio: '10:00',
        horaFin: '19:00',
        descansos: [
          {
            horaInicio: '14:00',
            horaFin: '15:00',
            tipo: 'almuerzo'
          }
        ]
      },
      {
        dia: 'miercoles',
        disponible: true,
        horaInicio: '10:00',
        horaFin: '19:00',
        descansos: [
          {
            horaInicio: '14:00',
            horaFin: '15:00',
            tipo: 'almuerzo'
          }
        ]
      },
      {
        dia: 'jueves',
        disponible: true,
        horaInicio: '10:00',
        horaFin: '19:00',
        descansos: [
          {
            horaInicio: '14:00',
            horaFin: '15:00',
            tipo: 'almuerzo'
          }
        ]
      },
      {
        dia: 'viernes',
        disponible: true,
        horaInicio: '10:00',
        horaFin: '19:00',
        descansos: [
          {
            horaInicio: '14:00',
            horaFin: '15:00',
            tipo: 'almuerzo'
          }
        ]
      },
      {
        dia: 'sabado',
        disponible: true,
        horaInicio: '09:00',
        horaFin: '13:00',
        descansos: []
      },
      {
        dia: 'domingo',
        disponible: false,
        descansos: []
      }
    ],
    
    estadoDisponibilidad: 'descanso',
    duracionConsultaDefault: 60,
    tiempoDescansoEntreCitas: 10,
    pacientesPorDia: 8,
    
    biografia: 'Endodoncista especializado en tratamientos de conducto y estética dental. Enfoque en técnicas mínimamente invasivas.',
    foto: 'https://images.pexels.com/photos/5215159/pexels-photo-5215159.jpeg',
    
    tarifas: [
      {
        servicio: 'Consulta Endodóncica',
        precio: 80,
        moneda: 'PEN',
        duracion: 30,
        descripcion: 'Evaluación especializada',
        requiereConsulta: false,
        categoria: 'Consultas'
      },
      {
        servicio: 'Endodoncia',
        precio: 450,
        moneda: 'PEN',
        duracion: 90,
        descripcion: 'Tratamiento de conducto completo',
        requiereConsulta: true,
        categoria: 'Endodoncia'
      }
    ],
    
    serviciosOfrecidos: [
      'Endodoncia',
      'Blanqueamiento Dental',
      'Carillas Dentales',
      'Consultas Especializadas'
    ],
    
    activo: true,
    verificado: true,
    aprobado: true,
    fechaIngreso: '2021-08-10',
    fechaCreacion: '2024-01-17T08:00:00Z',
    fechaActualizacion: '2024-02-12T16:45:00Z',
    
    totalPacientes: 195,
    citasCompletadasMes: 48,
    citasPendientes: 6,
    calificacionPromedio: 4.6,
    totalReviews: 73,
    turnosDisponiblesHoy: 1,
    
    tiempoPromedioConsulta: 58,
    tasaCancelacion: 4.8,
    tasaReagendamiento: 7.2,
    puntuacionSatisfaccion: 4.5
  },
  {
    id: '4',
    nombres: 'Ana Patricia',
    apellidos: 'Flores Sánchez',
    dni: '45678901',
    fechaNacimiento: '1992-05-18',
    genero: 'femenino',
    celular: '654321098',
    email: 'ana.flores@email.com',
    direccion: 'Av. Primavera 321, Surco',
    
    numeroColegiatura: 'COP-22890',
    especialidades: [
      {
        id: '7',
        nombre: 'Odontopediatría',
        categoria: 'especializada',
        certificado: true,
        fechaCertificacion: '2019-09-25'
      }
    ],
    consultorioId: '3',
    consultorio: { id: '3', nombre: 'Policlínico Dental Surco' },
    
    añosExperiencia: 6,
    universidades: [
      {
        id: '4',
        nombre: 'Universidad Inca Garcilaso de la Vega',
        carrera: 'Odontología',
        grado: 'licenciatura',
        añoGraduacion: 2018,
        pais: 'Perú'
      }
    ],
    
    idiomas: [
      { idioma: 'Español', nivel: 'nativo', certificado: false },
      { idioma: 'Inglés', nivel: 'intermedio', certificado: true }
    ],
    
    horariosDisponibilidad: [
      {
        dia: 'lunes',
        disponible: true,
        horaInicio: '08:00',
        horaFin: '16:00',
        descansos: [
          {
            horaInicio: '12:00',
            horaFin: '13:00',
            tipo: 'almuerzo'
          }
        ]
      },
      {
        dia: 'martes',
        disponible: true,
        horaInicio: '08:00',
        horaFin: '16:00',
        descansos: [
          {
            horaInicio: '12:00',
            horaFin: '13:00',
            tipo: 'almuerzo'
          }
        ]
      },
      {
        dia: 'miercoles',
        disponible: true,
        horaInicio: '08:00',
        horaFin: '16:00',
        descansos: [
          {
            horaInicio: '12:00',
            horaFin: '13:00',
            tipo: 'almuerzo'
          }
        ]
      },
      {
        dia: 'jueves',
        disponible: true,
        horaInicio: '08:00',
        horaFin: '16:00',
        descansos: [
          {
            horaInicio: '12:00',
            horaFin: '13:00',
            tipo: 'almuerzo'
          }
        ]
      },
      {
        dia: 'viernes',
        disponible: true,
        horaInicio: '08:00',
        horaFin: '16:00',
        descansos: [
          {
            horaInicio: '12:00',
            horaFin: '13:00',
            tipo: 'almuerzo'
          }
        ]
      },
      {
        dia: 'sabado',
        disponible: false,
        descansos: []
      },
      {
        dia: 'domingo',
        disponible: false,
        descansos: []
      }
    ],
    
    estadoDisponibilidad: 'disponible',
    duracionConsultaDefault: 30,
    tiempoDescansoEntreCitas: 5,
    pacientesPorDia: 20,
    
    biografia: 'Odontopediatra especializada en el cuidado dental infantil. Enfoque en técnicas lúdicas y manejo de ansiedad en niños.',
    foto: 'https://images.pexels.com/photos/5215165/pexels-photo-5215165.jpeg',
    
    tarifas: [
      {
        servicio: 'Consulta Pediátrica',
        precio: 70,
        moneda: 'PEN',
        duracion: 30,
        descripcion: 'Evaluación dental infantil',
        requiereConsulta: false,
        categoria: 'Consultas'
      },
      {
        servicio: 'Limpieza Infantil',
        precio: 90,
        moneda: 'PEN',
        duracion: 30,
        descripcion: 'Profilaxis para niños',
        requiereConsulta: false,
        categoria: 'Prevención'
      }
    ],
    
    serviciosOfrecidos: [
      'Consultas Pediátricas',
      'Limpieza Dental Infantil',
      'Aplicación de Flúor',
      'Sellantes Dentales',
      'Tratamiento de Caries'
    ],
    
    activo: true,
    verificado: true,
    aprobado: true,
    fechaIngreso: '2022-02-01',
    fechaCreacion: '2024-01-18T09:00:00Z',
    fechaActualizacion: '2024-02-05T14:30:00Z',
    
    totalPacientes: 156,
    citasCompletadasMes: 92,
    citasPendientes: 15,
    calificacionPromedio: 4.7,
    totalReviews: 45,
    turnosDisponiblesHoy: 5,
    
    tiempoPromedioConsulta: 25,
    tasaCancelacion: 8.5,
    tasaReagendamiento: 12.3,
    puntuacionSatisfaccion: 4.6
  }
];

// Simulación de delay de red
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Simulación de errores aleatorios (3% de probabilidad)
const shouldSimulateError = () => Math.random() < 0.03;

class DentistApiService {
  constructor() {
    this.dentists = [...mockDentists];
  }

  async getDentists(filters = {}, pagination = { page: 1, limit: 12 }) {
    await delay(400);
    
    if (shouldSimulateError()) {
      throw new Error('Error al cargar los dentistas. Intente nuevamente.');
    }

    let filteredDentists = [...this.dentists];

    // Aplicar filtros
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredDentists = filteredDentists.filter(dentist =>
        dentist.nombres.toLowerCase().includes(searchLower) ||
        dentist.apellidos.toLowerCase().includes(searchLower) ||
        dentist.dni.includes(searchLower) ||
        dentist.email.toLowerCase().includes(searchLower) ||
        dentist.numeroColegiatura.toLowerCase().includes(searchLower) ||
        dentist.especialidades?.some(e => e.nombre.toLowerCase().includes(searchLower)) ||
        dentist.consultorio?.nombre.toLowerCase().includes(searchLower)
      );
    }

    if (filters.consultorioId) {
      filteredDentists = filteredDentists.filter(d => d.consultorioId === filters.consultorioId);
    }

    if (filters.especialidades && filters.especialidades.length > 0) {
      filteredDentists = filteredDentists.filter(d => 
        filters.especialidades.some(esp => d.especialidades?.some(e => e.nombre === esp))
      );
    }

    if (filters.añosExperienciaMin !== null && filters.añosExperienciaMin !== undefined) {
      filteredDentists = filteredDentists.filter(d => d.añosExperiencia >= filters.añosExperienciaMin);
    }

    if (filters.añosExperienciaMax !== null && filters.añosExperienciaMax !== undefined) {
      filteredDentists = filteredDentists.filter(d => d.añosExperiencia <= filters.añosExperienciaMax);
    }

    if (filters.disponibleHoy) {
      filteredDentists = filteredDentists.filter(d => d.estadoDisponibilidad === 'disponible');
    }

    if (filters.conTurnosLibres) {
      filteredDentists = filteredDentists.filter(d => d.turnosDisponiblesHoy > 0);
    }

    if (filters.calificacionMin) {
      filteredDentists = filteredDentists.filter(d => d.calificacionPromedio >= filters.calificacionMin);
    }

    if (filters.activo !== null && filters.activo !== undefined) {
      filteredDentists = filteredDentists.filter(d => d.activo === filters.activo);
    }

    if (filters.verificado !== null && filters.verificado !== undefined) {
      filteredDentists = filteredDentists.filter(d => d.verificado === filters.verificado);
    }

    if (filters.aprobado !== null && filters.aprobado !== undefined) {
      filteredDentists = filteredDentists.filter(d => d.aprobado === filters.aprobado);
    }

    // Aplicar ordenamiento
    if (filters.sortBy) {
      filteredDentists.sort((a, b) => {
        let aValue = a[filters.sortBy];
        let bValue = b[filters.sortBy];

        if (filters.sortBy === 'nombre') {
          aValue = `${a.nombres} ${a.apellidos}`.toLowerCase();
          bValue = `${b.nombres} ${b.apellidos}`.toLowerCase();
        } else if (filters.sortBy === 'especialidad') {
          aValue = a.especialidades?.[0]?.nombre || '';
          bValue = b.especialidades?.[0]?.nombre || '';
        } else if (filters.sortBy === 'consultorio') {
          aValue = a.consultorio?.nombre || '';
          bValue = b.consultorio?.nombre || '';
        } else if (filters.sortBy === 'fechaIngreso') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
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
    const total = filteredDentists.length;
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    const paginatedDentists = filteredDentists.slice(startIndex, endIndex);

    return {
      data: paginatedDentists,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit)
      }
    };
  }

  async getDentistById(id) {
    await delay(250);
    
    if (shouldSimulateError()) {
      throw new Error('Error al cargar el dentista. Intente nuevamente.');
    }

    const dentist = this.dentists.find(d => d.id === id);
    if (!dentist) {
      throw new Error('Dentista no encontrado');
    }

    return dentist;
  }

  async createDentist(dentistData) {
    await delay(600);
    
    if (shouldSimulateError()) {
      throw new Error('Error al crear el dentista. Intente nuevamente.');
    }

    // Validar DNI único
    const existingDNI = this.dentists.find(d => d.dni === dentistData.dni);
    if (existingDNI) {
      throw new Error('El DNI ya está registrado');
    }

    // Validar colegiatura única
    const existingColegiatura = this.dentists.find(d => d.numeroColegiatura === dentistData.numeroColegiatura);
    if (existingColegiatura) {
      throw new Error('El número de colegiatura ya está registrado');
    }

    // Validar email único
    const existingEmail = this.dentists.find(d => d.email === dentistData.email);
    if (existingEmail) {
      throw new Error('El email ya está registrado');
    }

    const newDentist = {
      id: Date.now().toString(),
      ...dentistData,
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
      totalPacientes: 0,
      citasCompletadasMes: 0,
      citasPendientes: 0,
      calificacionPromedio: 0,
      totalReviews: 0,
      turnosDisponiblesHoy: 0,
      tiempoPromedioConsulta: dentistData.duracionConsultaDefault || 30,
      tasaCancelacion: 0,
      tasaReagendamiento: 0,
      puntuacionSatisfaccion: 0
    };

    this.dentists.push(newDentist);
    return newDentist;
  }

  async updateDentist(id, dentistData) {
    await delay(550);
    
    if (shouldSimulateError()) {
      throw new Error('Error al actualizar el dentista. Intente nuevamente.');
    }

    const index = this.dentists.findIndex(d => d.id === id);
    if (index === -1) {
      throw new Error('Dentista no encontrado');
    }

    // Validar DNI único (excluyendo el dentista actual)
    const existingDNI = this.dentists.find(d => 
      d.dni === dentistData.dni && d.id !== id
    );
    if (existingDNI) {
      throw new Error('El DNI ya está registrado');
    }

    // Validar colegiatura única (excluyendo el dentista actual)
    const existingColegiatura = this.dentists.find(d => 
      d.numeroColegiatura === dentistData.numeroColegiatura && d.id !== id
    );
    if (existingColegiatura) {
      throw new Error('El número de colegiatura ya está registrado');
    }

    // Validar email único (excluyendo el dentista actual)
    const existingEmail = this.dentists.find(d => 
      d.email === dentistData.email && d.id !== id
    );
    if (existingEmail) {
      throw new Error('El email ya está registrado');
    }

    const updatedDentist = {
      ...this.dentists[index],
      ...dentistData,
      fechaActualizacion: new Date().toISOString()
    };

    this.dentists[index] = updatedDentist;
    return updatedDentist;
  }

  async deleteDentist(id) {
    await delay(450);
    
    if (shouldSimulateError()) {
      throw new Error('Error al eliminar el dentista. Intente nuevamente.');
    }

    const dentist = this.dentists.find(d => d.id === id);
    if (!dentist) {
      throw new Error('Dentista no encontrado');
    }

    // Verificar si tiene citas pendientes
    if (dentist.citasPendientes > 0) {
      throw new Error('No se puede eliminar un dentista que tiene citas pendientes');
    }

    this.dentists = this.dentists.filter(d => d.id !== id);
    return { success: true, message: 'Dentista eliminado correctamente' };
  }

  async toggleDentistStatus(id) {
    await delay(350);
    
    if (shouldSimulateError()) {
      throw new Error('Error al cambiar el estado del dentista. Intente nuevamente.');
    }

    const index = this.dentists.findIndex(d => d.id === id);
    if (index === -1) {
      throw new Error('Dentista no encontrado');
    }

    this.dentists[index] = {
      ...this.dentists[index],
      activo: !this.dentists[index].activo,
      fechaActualizacion: new Date().toISOString()
    };

    return this.dentists[index];
  }

  async approveDentist(id) {
    await delay(400);
    
    if (shouldSimulateError()) {
      throw new Error('Error al aprobar el dentista. Intente nuevamente.');
    }

    const index = this.dentists.findIndex(d => d.id === id);
    if (index === -1) {
      throw new Error('Dentista no encontrado');
    }

    this.dentists[index] = {
      ...this.dentists[index],
      aprobado: true,
      verificado: true,
      fechaActualizacion: new Date().toISOString()
    };

    return this.dentists[index];
  }

  async bulkUpdateDentists(ids, updates) {
    await delay(800);
    
    if (shouldSimulateError()) {
      throw new Error('Error en la operación masiva. Intente nuevamente.');
    }

    const updatedDentists = [];
    
    for (const id of ids) {
      const index = this.dentists.findIndex(d => d.id === id);
      if (index !== -1) {
        this.dentists[index] = {
          ...this.dentists[index],
          ...updates,
          fechaActualizacion: new Date().toISOString()
        };
        updatedDentists.push(this.dentists[index]);
      }
    }

    return {
      success: true,
      updated: updatedDentists.length,
      dentists: updatedDentists
    };
  }

  async getDentistStats() {
    await delay(300);
    
    if (shouldSimulateError()) {
      throw new Error('Error al cargar las estadísticas. Intente nuevamente.');
    }

    const total = this.dentists.length;
    const activos = this.dentists.filter(d => d.activo).length;
    const verificados = this.dentists.filter(d => d.verificado).length;
    const aprobados = this.dentists.filter(d => d.aprobado).length;
    const disponibles = this.dentists.filter(d => d.estadoDisponibilidad === 'disponible').length;

    // Especialidades más comunes
    const especialidadesCount = {};
    this.dentists.forEach(dentist => {
      dentist.especialidades?.forEach(esp => {
        especialidadesCount[esp.nombre] = (especialidadesCount[esp.nombre] || 0) + 1;
      });
    });

    const especialidadesMasComunes = Object.entries(especialidadesCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([especialidad, cantidad]) => ({ especialidad, cantidad }));

    // Promedio de experiencia
    const totalExperiencia = this.dentists.reduce((sum, d) => sum + (d.añosExperiencia || 0), 0);
    const promedioExperiencia = total > 0 ? Math.round((totalExperiencia / total) * 100) / 100 : 0;

    // Promedio de pacientes
    const totalPacientes = this.dentists.reduce((sum, d) => sum + (d.totalPacientes || 0), 0);
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
  }

  async exportDentists(filters = {}) {
    await delay(1200);
    
    const { data } = await this.getDentists(filters, { page: 1, limit: 1000 });
    return data;
  }

  async getSearchSuggestions(query) {
    await delay(200);
    
    if (!query || query.length < 2) return [];

    const suggestions = [];
    const queryLower = query.toLowerCase();

    // Sugerencias de nombres de dentistas
    this.dentists.forEach(dentist => {
      const fullName = `${dentist.nombres} ${dentist.apellidos}`;
      if (fullName.toLowerCase().includes(queryLower)) {
        suggestions.push({
          type: 'dentist',
          value: fullName,
          label: fullName,
          subtitle: dentist.especialidades?.[0]?.nombre || 'Odontología General'
        });
      }
    });

    // Sugerencias de especialidades
    const allSpecialties = [...new Set(this.dentists.flatMap(d => d.especialidades?.map(e => e.nombre) || []))];
    allSpecialties.forEach(specialty => {
      if (specialty.toLowerCase().includes(queryLower)) {
        suggestions.push({
          type: 'specialty',
          value: specialty,
          label: specialty,
          subtitle: 'Especialidad'
        });
      }
    });

    return suggestions.slice(0, 10);
  }
}

// Instancia singleton del servicio
const dentistApiService = new DentistApiService();

// API pública del servicio
export const dentistApi = {
  getDentists: (filters, pagination) => dentistApiService.getDentists(filters, pagination),
  getDentistById: (id) => dentistApiService.getDentistById(id),
  createDentist: (data) => dentistApiService.createDentist(data),
  updateDentist: (id, data) => dentistApiService.updateDentist(id, data),
  deleteDentist: (id) => dentistApiService.deleteDentist(id),
  toggleDentistStatus: (id) => dentistApiService.toggleDentistStatus(id),
  approveDentist: (id) => dentistApiService.approveDentist(id),
  bulkUpdateDentists: (ids, updates) => dentistApiService.bulkUpdateDentists(ids, updates),
  getDentistStats: () => dentistApiService.getDentistStats(),
  exportDentists: (filters) => dentistApiService.exportDentists(filters),
  getSearchSuggestions: (query) => dentistApiService.getSearchSuggestions(query)
};

export default dentistApi;