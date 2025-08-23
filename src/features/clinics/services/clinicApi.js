import api from '../../../shared/services/apiService';

// Mock data para desarrollo
const mockClinics = [
  {
    id: '1',
    nombre: 'Clínica Dental San Borja',
    descripcion: 'Clínica dental especializada en odontología integral con más de 15 años de experiencia',
    codigo: 'SB-PRI-001',
    distritoId: '4', // San Borja
    distrito: { id: '4', nombre: 'San Borja' },
    direccion: 'Av. San Borja Norte 1234',
    referenciaDireccion: 'Frente al Hospital Nacional Dos de Mayo',
    telefono: '+51-1-2234567',
    email: 'info@clinicasanborja.com',
    sitioWeb: 'https://clinicasanborja.com',
    coordenadas: { lat: -12.0864, lng: -77.0081 },
    horarios: [
      { dia: 'lunes', abierto: true, horaInicio: '08:00', horaFin: '20:00', descansoInicio: '13:00', descansoFin: '14:00' },
      { dia: 'martes', abierto: true, horaInicio: '08:00', horaFin: '20:00', descansoInicio: '13:00', descansoFin: '14:00' },
      { dia: 'miercoles', abierto: true, horaInicio: '08:00', horaFin: '20:00', descansoInicio: '13:00', descansoFin: '14:00' },
      { dia: 'jueves', abierto: true, horaInicio: '08:00', horaFin: '20:00', descansoInicio: '13:00', descansoFin: '14:00' },
      { dia: 'viernes', abierto: true, horaInicio: '08:00', horaFin: '20:00', descansoInicio: '13:00', descansoFin: '14:00' },
      { dia: 'sabado', abierto: true, horaInicio: '08:00', horaFin: '14:00' },
      { dia: 'domingo', abierto: false }
    ],
    servicios: ['Limpieza dental', 'Ortodoncia', 'Implantes', 'Blanqueamiento', 'Endodoncia'],
    especialidades: ['Odontología General', 'Ortodoncia', 'Implantología'],
    capacidadConsultorios: 8,
    tipoClinica: 'privada',
    certificaciones: ['ISO 9001', 'Certificación Sanitaria', 'DIGESA'],
    equipamiento: ['Rayos X Digital', 'Autoclave', 'Unidades Dentales Modernas', 'Scanner Intraoral'],
    metodosLimpieza: ['Desinfección UV', 'Esterilización por calor húmedo', 'Productos certificados'],
    imagenes: [
      { id: '1', url: 'https://images.pexels.com/photos/305568/pexels-photo-305568.jpeg', tipo: 'exterior', orden: 1, descripcion: 'Fachada principal' },
      { id: '2', url: 'https://images.pexels.com/photos/287237/pexels-photo-287237.jpeg', tipo: 'recepcion', orden: 2, descripcion: 'Área de recepción' }
    ],
    imagenPrincipal: 'https://images.pexels.com/photos/305568/pexels-photo-305568.jpeg',
    activo: true,
    verificado: true,
    fechaCreacion: '2024-01-15T10:00:00Z',
    fechaActualizacion: '2024-02-10T15:30:00Z',
    cantidadDentistas: 6,
    cantidadCitasHoy: 24,
    cantidadCitasMes: 680,
    calificacionPromedio: 4.7,
    turnosDisponiblesHoy: 8,
    tarifas: [
      { servicio: 'Consulta General', precio: 80, moneda: 'PEN', descripcion: 'Evaluación y diagnóstico' },
      { servicio: 'Limpieza Dental', precio: 120, moneda: 'PEN', descripcion: 'Profilaxis completa' }
    ]
  },
  {
    id: '2',
    nombre: 'Centro Odontológico Miraflores',
    descripcion: 'Centro odontológico moderno con tecnología de vanguardia y especialistas certificados',
    codigo: 'MI-PRI-002',
    distritoId: '1', // Miraflores
    distrito: { id: '1', nombre: 'Miraflores' },
    direccion: 'Av. Larco 456',
    referenciaDireccion: 'Cerca al Parque Kennedy',
    telefono: '+51-1-3345678',
    email: 'contacto@centromiraflores.com',
    sitioWeb: 'https://centromiraflores.com',
    coordenadas: { lat: -12.1196, lng: -77.0365 },
    horarios: [
      { dia: 'lunes', abierto: true, horaInicio: '09:00', horaFin: '19:00', descansoInicio: '13:00', descansoFin: '14:00' },
      { dia: 'martes', abierto: true, horaInicio: '09:00', horaFin: '19:00', descansoInicio: '13:00', descansoFin: '14:00' },
      { dia: 'miercoles', abierto: true, horaInicio: '09:00', horaFin: '19:00', descansoInicio: '13:00', descansoFin: '14:00' },
      { dia: 'jueves', abierto: true, horaInicio: '09:00', horaFin: '19:00', descansoInicio: '13:00', descansoFin: '14:00' },
      { dia: 'viernes', abierto: true, horaInicio: '09:00', horaFin: '19:00', descansoInicio: '13:00', descansoFin: '14:00' },
      { dia: 'sabado', abierto: true, horaInicio: '09:00', horaFin: '15:00' },
      { dia: 'domingo', abierto: false }
    ],
    servicios: ['Limpieza dental', 'Blanqueamiento', 'Estética dental', 'Prótesis dental', 'Urgencias dentales'],
    especialidades: ['Odontología General', 'Estética Dental', 'Prostodoncia'],
    capacidadConsultorios: 5,
    tipoClinica: 'privada',
    certificaciones: ['Certificación Sanitaria', 'DIGESA', 'Certificación de Bioseguridad'],
    equipamiento: ['Rayos X Digital', 'Autoclave', 'Láser Dental', 'Cámara Intraoral'],
    metodosLimpieza: ['Desinfección UV', 'Productos certificados', 'Ozono'],
    imagenes: [
      { id: '3', url: 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg', tipo: 'exterior', orden: 1, descripcion: 'Entrada principal' },
      { id: '4', url: 'https://images.pexels.com/photos/3845812/pexels-photo-3845812.jpeg', tipo: 'consultorio', orden: 2, descripcion: 'Consultorio moderno' }
    ],
    imagenPrincipal: 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg',
    activo: true,
    verificado: true,
    fechaCreacion: '2024-01-16T09:30:00Z',
    fechaActualizacion: '2024-02-08T11:20:00Z',
    cantidadDentistas: 4,
    cantidadCitasHoy: 18,
    cantidadCitasMes: 520,
    calificacionPromedio: 4.5,
    turnosDisponiblesHoy: 6,
    tarifas: [
      { servicio: 'Consulta General', precio: 100, moneda: 'PEN', descripcion: 'Evaluación completa' },
      { servicio: 'Blanqueamiento', precio: 350, moneda: 'PEN', descripcion: 'Blanqueamiento profesional' }
    ]
  },
  {
    id: '3',
    nombre: 'Policlínico Dental Surco',
    descripcion: 'Policlínico dental con amplia gama de servicios y atención las 24 horas para urgencias',
    codigo: 'SU-MIX-003',
    distritoId: '3', // Surco
    distrito: { id: '3', nombre: 'Surco' },
    direccion: 'Av. Benavides 789',
    referenciaDireccion: 'Al lado del Centro Comercial El Polo',
    telefono: '+51-1-4456789',
    email: 'info@policlinicosurco.com',
    coordenadas: { lat: -12.1348, lng: -76.9787 },
    horarios: [
      { dia: 'lunes', abierto: true, horaInicio: '07:00', horaFin: '22:00', descansoInicio: '12:00', descansoFin: '13:00' },
      { dia: 'martes', abierto: true, horaInicio: '07:00', horaFin: '22:00', descansoInicio: '12:00', descansoFin: '13:00' },
      { dia: 'miercoles', abierto: true, horaInicio: '07:00', horaFin: '22:00', descansoInicio: '12:00', descansoFin: '13:00' },
      { dia: 'jueves', abierto: true, horaInicio: '07:00', horaFin: '22:00', descansoInicio: '12:00', descansoFin: '13:00' },
      { dia: 'viernes', abierto: true, horaInicio: '07:00', horaFin: '22:00', descansoInicio: '12:00', descansoFin: '13:00' },
      { dia: 'sabado', abierto: true, horaInicio: '08:00', horaFin: '18:00' },
      { dia: 'domingo', abierto: true, horaInicio: '08:00', horaFin: '16:00' }
    ],
    servicios: ['Limpieza dental', 'Ortodoncia', 'Implantes', 'Cirugía oral', 'Urgencias dentales', 'Odontopediatría'],
    especialidades: ['Odontología General', 'Ortodoncia', 'Cirugía Oral y Maxilofacial', 'Odontopediatría'],
    capacidadConsultorios: 12,
    tipoClinica: 'mixta',
    certificaciones: ['ISO 9001', 'Certificación Sanitaria', 'DIGESA', 'Acreditación Internacional'],
    equipamiento: ['Rayos X Digital', 'Autoclave', 'Unidades Dentales Modernas', 'Scanner Intraoral', 'Microscopio Dental'],
    metodosLimpieza: ['Desinfección UV', 'Esterilización por calor húmedo', 'Productos certificados', 'Plasma de peróxido de hidrógeno'],
    imagenes: [
      { id: '5', url: 'https://images.pexels.com/photos/3845774/pexels-photo-3845774.jpeg', tipo: 'exterior', orden: 1, descripcion: 'Fachada del policlínico' },
      { id: '6', url: 'https://images.pexels.com/photos/3845775/pexels-photo-3845775.jpeg', tipo: 'recepcion', orden: 2, descripcion: 'Recepción amplia' }
    ],
    imagenPrincipal: 'https://images.pexels.com/photos/3845774/pexels-photo-3845774.jpeg',
    activo: true,
    verificado: true,
    fechaCreacion: '2024-01-17T08:00:00Z',
    fechaActualizacion: '2024-02-12T16:45:00Z',
    cantidadDentistas: 10,
    cantidadCitasHoy: 45,
    cantidadCitasMes: 1200,
    calificacionPromedio: 4.3,
    turnosDisponiblesHoy: 15,
    tarifas: [
      { servicio: 'Consulta General', precio: 60, moneda: 'PEN', descripcion: 'Evaluación básica' },
      { servicio: 'Urgencia Dental', precio: 80, moneda: 'PEN', descripcion: 'Atención de urgencia' }
    ]
  },
  {
    id: '4',
    nombre: 'Clínica Dental Los Olivos',
    descripcion: 'Clínica dental comunitaria enfocada en brindar servicios de calidad a precios accesibles',
    codigo: 'LO-PUB-004',
    distritoId: '7', // Los Olivos
    distrito: { id: '7', nombre: 'Los Olivos' },
    direccion: 'Av. Alfredo Mendiola 321',
    referenciaDireccion: 'Frente al Mercado Central',
    telefono: '+51-1-5567890',
    email: 'atencion@clinicalosolivos.gob.pe',
    coordenadas: { lat: -11.9611, lng: -77.0753 },
    horarios: [
      { dia: 'lunes', abierto: true, horaInicio: '08:00', horaFin: '17:00', descansoInicio: '12:00', descansoFin: '13:00' },
      { dia: 'martes', abierto: true, horaInicio: '08:00', horaFin: '17:00', descansoInicio: '12:00', descansoFin: '13:00' },
      { dia: 'miercoles', abierto: true, horaInicio: '08:00', horaFin: '17:00', descansoInicio: '12:00', descansoFin: '13:00' },
      { dia: 'jueves', abierto: true, horaInicio: '08:00', horaFin: '17:00', descansoInicio: '12:00', descansoFin: '13:00' },
      { dia: 'viernes', abierto: true, horaInicio: '08:00', horaFin: '17:00', descansoInicio: '12:00', descansoFin: '13:00' },
      { dia: 'sabado', abierto: true, horaInicio: '08:00', horaFin: '13:00' },
      { dia: 'domingo', abierto: false }
    ],
    servicios: ['Limpieza dental', 'Endodoncia', 'Prótesis dental', 'Odontopediatría'],
    especialidades: ['Odontología General', 'Endodoncia', 'Odontopediatría'],
    capacidadConsultorios: 6,
    tipoClinica: 'publica',
    certificaciones: ['Certificación Sanitaria', 'DIGESA'],
    equipamiento: ['Rayos X Digital', 'Autoclave', 'Unidades Dentales Modernas'],
    metodosLimpieza: ['Esterilización por calor húmedo', 'Productos certificados'],
    imagenes: [
      { id: '7', url: 'https://images.pexels.com/photos/3845807/pexels-photo-3845807.jpeg', tipo: 'exterior', orden: 1, descripcion: 'Entrada principal' },
      { id: '8', url: 'https://images.pexels.com/photos/3845808/pexels-photo-3845808.jpeg', tipo: 'consultorio', orden: 2, descripcion: 'Consultorio equipado' }
    ],
    imagenPrincipal: 'https://images.pexels.com/photos/3845807/pexels-photo-3845807.jpeg',
    activo: true,
    verificado: true,
    fechaCreacion: '2024-01-18T09:00:00Z',
    fechaActualizacion: '2024-02-05T14:30:00Z',
    cantidadDentistas: 5,
    cantidadCitasHoy: 30,
    cantidadCitasMes: 850,
    calificacionPromedio: 4.1,
    turnosDisponiblesHoy: 12,
    tarifas: [
      { servicio: 'Consulta General', precio: 30, moneda: 'PEN', descripcion: 'Evaluación básica subsidiada' },
      { servicio: 'Limpieza Dental', precio: 50, moneda: 'PEN', descripcion: 'Profilaxis básica' }
    ]
  },
  {
    id: '5',
    nombre: 'Dental Care Callao',
    descripcion: 'Centro dental especializado en implantología y cirugía oral con equipos de última generación',
    codigo: 'CA-PRI-005',
    distritoId: '5', // Callao
    distrito: { id: '5', nombre: 'Callao' },
    direccion: 'Av. Sáenz Peña 654',
    referenciaDireccion: 'Cerca al Puerto del Callao',
    telefono: '+51-1-6678901',
    email: 'info@dentalcarecallao.com',
    sitioWeb: 'https://dentalcarecallao.com',
    coordenadas: { lat: -12.0621, lng: -77.1286 },
    horarios: [
      { dia: 'lunes', abierto: true, horaInicio: '08:30', horaFin: '18:30', descansoInicio: '13:00', descansoFin: '14:00' },
      { dia: 'martes', abierto: true, horaInicio: '08:30', horaFin: '18:30', descansoInicio: '13:00', descansoFin: '14:00' },
      { dia: 'miercoles', abierto: true, horaInicio: '08:30', horaFin: '18:30', descansoInicio: '13:00', descansoFin: '14:00' },
      { dia: 'jueves', abierto: true, horaInicio: '08:30', horaFin: '18:30', descansoInicio: '13:00', descansoFin: '14:00' },
      { dia: 'viernes', abierto: true, horaInicio: '08:30', horaFin: '18:30', descansoInicio: '13:00', descansoFin: '14:00' },
      { dia: 'sabado', abierto: true, horaInicio: '08:30', horaFin: '14:30' },
      { dia: 'domingo', abierto: false }
    ],
    servicios: ['Implantes', 'Cirugía oral', 'Periodoncia', 'Prótesis dental', 'Radiografías'],
    especialidades: ['Implantología', 'Cirugía Oral y Maxilofacial', 'Periodoncia'],
    capacidadConsultorios: 4,
    tipoClinica: 'privada',
    certificaciones: ['ISO 9001', 'Certificación Sanitaria', 'DIGESA', 'Certificación de Bioseguridad'],
    equipamiento: ['Rayos X Digital', 'Autoclave', 'Scanner Intraoral', 'Microscopio Dental', 'Láser Dental'],
    metodosLimpieza: ['Desinfección UV', 'Esterilización por calor húmedo', 'Productos certificados', 'Ozono'],
    imagenes: [
      { id: '9', url: 'https://images.pexels.com/photos/3845813/pexels-photo-3845813.jpeg', tipo: 'exterior', orden: 1, descripcion: 'Fachada moderna' },
      { id: '10', url: 'https://images.pexels.com/photos/3845814/pexels-photo-3845814.jpeg', tipo: 'equipos', orden: 2, descripcion: 'Equipos especializados' }
    ],
    imagenPrincipal: 'https://images.pexels.com/photos/3845813/pexels-photo-3845813.jpeg',
    activo: true,
    verificado: true,
    fechaCreacion: '2024-01-19T11:30:00Z',
    fechaActualizacion: '2024-02-09T10:15:00Z',
    cantidadDentistas: 3,
    cantidadCitasHoy: 12,
    cantidadCitasMes: 360,
    calificacionPromedio: 4.8,
    turnosDisponiblesHoy: 4,
    tarifas: [
      { servicio: 'Consulta Especializada', precio: 120, moneda: 'PEN', descripcion: 'Evaluación especializada' },
      { servicio: 'Implante Dental', precio: 1500, moneda: 'PEN', descripcion: 'Implante completo' }
    ]
  }
];

// Simulación de delay de red
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Simulación de errores aleatorios (3% de probabilidad)
const shouldSimulateError = () => Math.random() < 0.03;

class ClinicApiService {
  constructor() {
    this.clinics = [...mockClinics];
  }

  async getClinics(filters = {}, pagination = { page: 1, limit: 10 }) {
    await delay(400);
    
    if (shouldSimulateError()) {
      throw new Error('Error al cargar los consultorios. Intente nuevamente.');
    }

    let filteredClinics = [...this.clinics];

    // Aplicar filtros
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredClinics = filteredClinics.filter(clinic =>
        clinic.nombre.toLowerCase().includes(searchLower) ||
        clinic.descripcion.toLowerCase().includes(searchLower) ||
        clinic.codigo.toLowerCase().includes(searchLower) ||
        clinic.direccion.toLowerCase().includes(searchLower) ||
        clinic.distrito?.nombre.toLowerCase().includes(searchLower) ||
        clinic.servicios?.some(s => s.toLowerCase().includes(searchLower)) ||
        clinic.especialidades?.some(e => e.toLowerCase().includes(searchLower))
      );
    }

    if (filters.distritoId) {
      filteredClinics = filteredClinics.filter(c => c.distritoId === filters.distritoId);
    }

    if (filters.tipoClinica) {
      filteredClinics = filteredClinics.filter(c => c.tipoClinica === filters.tipoClinica);
    }

    if (filters.servicios && filters.servicios.length > 0) {
      filteredClinics = filteredClinics.filter(c => 
        filters.servicios.some(servicio => c.servicios?.includes(servicio))
      );
    }

    if (filters.especialidades && filters.especialidades.length > 0) {
      filteredClinics = filteredClinics.filter(c => 
        filters.especialidades.some(especialidad => c.especialidades?.includes(especialidad))
      );
    }

    if (filters.activo !== null && filters.activo !== undefined) {
      filteredClinics = filteredClinics.filter(c => c.activo === filters.activo);
    }

    if (filters.verificado !== null && filters.verificado !== undefined) {
      filteredClinics = filteredClinics.filter(c => c.verificado === filters.verificado);
    }

    if (filters.conDentistasDisponibles) {
      filteredClinics = filteredClinics.filter(c => c.cantidadDentistas > 0);
    }

    if (filters.conTurnosHoy) {
      filteredClinics = filteredClinics.filter(c => c.turnosDisponiblesHoy > 0);
    }

    // Aplicar ordenamiento
    if (filters.sortBy) {
      filteredClinics.sort((a, b) => {
        let aValue = a[filters.sortBy];
        let bValue = b[filters.sortBy];

        if (filters.sortBy === 'distrito') {
          aValue = a.distrito?.nombre || '';
          bValue = b.distrito?.nombre || '';
        } else if (filters.sortBy === 'fechaCreacion') {
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
    const total = filteredClinics.length;
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    const paginatedClinics = filteredClinics.slice(startIndex, endIndex);

    return {
      data: paginatedClinics,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit)
      }
    };
  }

  async getClinicById(id) {
    await delay(250);
    
    if (shouldSimulateError()) {
      throw new Error('Error al cargar el consultorio. Intente nuevamente.');
    }

    const clinic = this.clinics.find(c => c.id === id);
    if (!clinic) {
      throw new Error('Consultorio no encontrado');
    }

    return clinic;
  }

  async createClinic(clinicData) {
    await delay(600);
    
    if (shouldSimulateError()) {
      throw new Error('Error al crear el consultorio. Intente nuevamente.');
    }

    // Validar código único
    const existingCode = this.clinics.find(c => c.codigo === clinicData.codigo);
    if (existingCode) {
      throw new Error('El código del consultorio ya existe');
    }

    // Validar nombre único en el distrito
    const existingName = this.clinics.find(c => 
      c.nombre.toLowerCase() === clinicData.nombre.toLowerCase() && 
      c.distritoId === clinicData.distritoId
    );
    if (existingName) {
      throw new Error('Ya existe un consultorio con ese nombre en el distrito');
    }

    // Validar email único
    if (clinicData.email) {
      const existingEmail = this.clinics.find(c => c.email === clinicData.email);
      if (existingEmail) {
        throw new Error('El email ya está registrado');
      }
    }

    const newClinic = {
      id: Date.now().toString(),
      ...clinicData,
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
      cantidadDentistas: 0,
      cantidadCitasHoy: 0,
      cantidadCitasMes: 0,
      calificacionPromedio: 0,
      turnosDisponiblesHoy: 0,
      imagenes: [],
      tarifas: []
    };

    this.clinics.push(newClinic);
    return newClinic;
  }

  async updateClinic(id, clinicData) {
    await delay(550);
    
    if (shouldSimulateError()) {
      throw new Error('Error al actualizar el consultorio. Intente nuevamente.');
    }

    const index = this.clinics.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Consultorio no encontrado');
    }

    // Validar código único (excluyendo el consultorio actual)
    const existingCode = this.clinics.find(c => 
      c.codigo === clinicData.codigo && c.id !== id
    );
    if (existingCode) {
      throw new Error('El código del consultorio ya existe');
    }

    // Validar nombre único en el distrito (excluyendo el consultorio actual)
    const existingName = this.clinics.find(c => 
      c.nombre.toLowerCase() === clinicData.nombre.toLowerCase() && 
      c.distritoId === clinicData.distritoId && 
      c.id !== id
    );
    if (existingName) {
      throw new Error('Ya existe un consultorio con ese nombre en el distrito');
    }

    // Validar email único (excluyendo el consultorio actual)
    if (clinicData.email) {
      const existingEmail = this.clinics.find(c => 
        c.email === clinicData.email && c.id !== id
      );
      if (existingEmail) {
        throw new Error('El email ya está registrado');
      }
    }

    const updatedClinic = {
      ...this.clinics[index],
      ...clinicData,
      fechaActualizacion: new Date().toISOString()
    };

    this.clinics[index] = updatedClinic;
    return updatedClinic;
  }

  async deleteClinic(id) {
    await delay(450);
    
    if (shouldSimulateError()) {
      throw new Error('Error al eliminar el consultorio. Intente nuevamente.');
    }

    const clinic = this.clinics.find(c => c.id === id);
    if (!clinic) {
      throw new Error('Consultorio no encontrado');
    }

    // Verificar si tiene dentistas asociados
    if (clinic.cantidadDentistas > 0) {
      throw new Error('No se puede eliminar un consultorio que tiene dentistas asociados');
    }

    this.clinics = this.clinics.filter(c => c.id !== id);
    return { success: true, message: 'Consultorio eliminado correctamente' };
  }

  async toggleClinicStatus(id) {
    await delay(350);
    
    if (shouldSimulateError()) {
      throw new Error('Error al cambiar el estado del consultorio. Intente nuevamente.');
    }

    const index = this.clinics.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Consultorio no encontrado');
    }

    this.clinics[index] = {
      ...this.clinics[index],
      activo: !this.clinics[index].activo,
      fechaActualizacion: new Date().toISOString()
    };

    return this.clinics[index];
  }

  async bulkUpdateClinics(ids, updates) {
    await delay(800);
    
    if (shouldSimulateError()) {
      throw new Error('Error en la operación masiva. Intente nuevamente.');
    }

    const updatedClinics = [];
    
    for (const id of ids) {
      const index = this.clinics.findIndex(c => c.id === id);
      if (index !== -1) {
        this.clinics[index] = {
          ...this.clinics[index],
          ...updates,
          fechaActualizacion: new Date().toISOString()
        };
        updatedClinics.push(this.clinics[index]);
      }
    }

    return {
      success: true,
      updated: updatedClinics.length,
      clinics: updatedClinics
    };
  }

  async getClinicStats() {
    await delay(300);
    
    if (shouldSimulateError()) {
      throw new Error('Error al cargar las estadísticas. Intente nuevamente.');
    }

    const total = this.clinics.length;
    const activos = this.clinics.filter(c => c.activo).length;
    const inactivos = total - activos;
    const verificados = this.clinics.filter(c => c.verificado).length;
    const totalDentistas = this.clinics.reduce((sum, c) => sum + (c.cantidadDentistas || 0), 0);
    const totalCapacidad = this.clinics.reduce((sum, c) => sum + (c.capacidadConsultorios || 0), 0);

    // Consultorios por tipo
    const porTipo = this.clinics.reduce((acc, clinic) => {
      acc[clinic.tipoClinica] = (acc[clinic.tipoClinica] || 0) + 1;
      return acc;
    }, {});

    // Servicios más ofrecidos
    const serviciosCount = {};
    this.clinics.forEach(clinic => {
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
    this.clinics.forEach(clinic => {
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
      promedioConsultoriosPorDistrito: total > 0 ? Math.round((total / new Set(this.clinics.map(c => c.distritoId)).size) * 100) / 100 : 0,
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
  }

  async getClinicStatsById(id) {
    await delay(250);
    
    const clinic = this.clinics.find(c => c.id === id);
    if (!clinic) {
      throw new Error('Consultorio no encontrado');
    }

    return {
      dentistas: clinic.cantidadDentistas,
      citasHoy: clinic.cantidadCitasHoy,
      citasMes: clinic.cantidadCitasMes,
      turnosDisponibles: clinic.turnosDisponiblesHoy,
      calificacion: clinic.calificacionPromedio,
      capacidadUtilizada: clinic.capacidadConsultorios > 0 
        ? Math.round((clinic.cantidadDentistas / clinic.capacidadConsultorios) * 100) 
        : 0
    };
  }

  async exportClinics(filters = {}) {
    await delay(1200);
    
    const { data } = await this.getClinics(filters, { page: 1, limit: 1000 });
    return data;
  }

  async uploadClinicImage(clinicId, imageData) {
    await delay(800);
    
    if (shouldSimulateError()) {
      throw new Error('Error al subir la imagen. Intente nuevamente.');
    }

    const clinic = this.clinics.find(c => c.id === clinicId);
    if (!clinic) {
      throw new Error('Consultorio no encontrado');
    }

    const newImage = {
      id: Date.now().toString(),
      url: `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/pexels-photo.jpeg`,
      tipo: imageData.tipo || 'otros',
      descripcion: imageData.descripcion || '',
      orden: (clinic.imagenes?.length || 0) + 1
    };

    if (!clinic.imagenes) {
      clinic.imagenes = [];
    }

    clinic.imagenes.push(newImage);
    
    if (!clinic.imagenPrincipal) {
      clinic.imagenPrincipal = newImage.url;
    }

    return newImage;
  }

  async deleteClinicImage(clinicId, imageId) {
    await delay(400);
    
    const clinic = this.clinics.find(c => c.id === clinicId);
    if (!clinic) {
      throw new Error('Consultorio no encontrado');
    }

    if (!clinic.imagenes) {
      throw new Error('Imagen no encontrada');
    }

    const imageIndex = clinic.imagenes.findIndex(img => img.id === imageId);
    if (imageIndex === -1) {
      throw new Error('Imagen no encontrada');
    }

    const deletedImage = clinic.imagenes[imageIndex];
    clinic.imagenes.splice(imageIndex, 1);

    // Si era la imagen principal, asignar otra
    if (clinic.imagenPrincipal === deletedImage.url && clinic.imagenes.length > 0) {
      clinic.imagenPrincipal = clinic.imagenes[0].url;
    }

    return { success: true, message: 'Imagen eliminada correctamente' };
  }

  async getSearchSuggestions(query) {
    await delay(200);
    
    if (!query || query.length < 2) return [];

    const suggestions = [];
    const queryLower = query.toLowerCase();

    // Sugerencias de nombres de consultorios
    this.clinics.forEach(clinic => {
      if (clinic.nombre.toLowerCase().includes(queryLower)) {
        suggestions.push({
          type: 'clinic',
          value: clinic.nombre,
          label: clinic.nombre,
          subtitle: clinic.distrito?.nombre
        });
      }
    });

    // Sugerencias de servicios
    const allServices = [...new Set(this.clinics.flatMap(c => c.servicios || []))];
    allServices.forEach(service => {
      if (service.toLowerCase().includes(queryLower)) {
        suggestions.push({
          type: 'service',
          value: service,
          label: service,
          subtitle: 'Servicio'
        });
      }
    });

    // Sugerencias de especialidades
    const allSpecialties = [...new Set(this.clinics.flatMap(c => c.especialidades || []))];
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

  async getNearbyClinics(lat, lng, radius = 5) {
    await delay(400);
    
    const nearbyClinics = this.clinics.filter(clinic => {
      if (!clinic.coordenadas) return false;
      
      const distance = this.calculateDistance(
        { lat, lng },
        clinic.coordenadas
      );
      
      return distance <= radius;
    });

    return nearbyClinics.map(clinic => ({
      ...clinic,
      distance: this.calculateDistance({ lat, lng }, clinic.coordenadas)
    })).sort((a, b) => a.distance - b.distance);
  }

  calculateDistance(coord1, coord2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
    const dLng = (coord2.lng - coord1.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return Math.round(distance * 100) / 100;
  }
}

// Instancia singleton del servicio
const clinicApiService = new ClinicApiService();

// API pública del servicio
export const clinicApi = {
  getClinics: (filters, pagination) => clinicApiService.getClinics(filters, pagination),
  getClinicById: (id) => clinicApiService.getClinicById(id),
  createClinic: (data) => clinicApiService.createClinic(data),
  updateClinic: (id, data) => clinicApiService.updateClinic(id, data),
  deleteClinic: (id) => clinicApiService.deleteClinic(id),
  toggleClinicStatus: (id) => clinicApiService.toggleClinicStatus(id),
  bulkUpdateClinics: (ids, updates) => clinicApiService.bulkUpdateClinics(ids, updates),
  getClinicStats: () => clinicApiService.getClinicStats(),
  getClinicStatsById: (id) => clinicApiService.getClinicStatsById(id),
  exportClinics: (filters) => clinicApiService.exportClinics(filters),
  uploadClinicImage: (clinicId, imageData) => clinicApiService.uploadClinicImage(clinicId, imageData),
  deleteClinicImage: (clinicId, imageId) => clinicApiService.deleteClinicImage(clinicId, imageId),
  getSearchSuggestions: (query) => clinicApiService.getSearchSuggestions(query),
  getNearbyClinics: (lat, lng, radius) => clinicApiService.getNearbyClinics(lat, lng, radius)
};

export default clinicApi;