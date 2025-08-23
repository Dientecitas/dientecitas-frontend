import api from '../../../shared/services/apiService';

// Mock data para desarrollo - 80+ pacientes con datos médicos realistas
const mockPatients = [
  {
    id: '1',
    nombres: 'María Elena',
    apellidos: 'González Pérez',
    dni: '12345678',
    fechaNacimiento: '1985-03-15',
    edad: 39,
    genero: 'femenino',
    estadoCivil: 'casado',
    ocupacion: 'Profesora',
    
    telefono: '+51-1-987654321',
    telefonoAlternativo: '+51-1-123456789',
    email: 'maria.gonzalez@email.com',
    direccion: 'Av. Los Álamos 456, San Isidro',
    distrito: 'San Isidro',
    provincia: 'Lima',
    
    contactosEmergencia: [
      {
        id: '1',
        nombres: 'Carlos González',
        apellidos: 'Mendoza',
        relacion: 'Esposo',
        telefono: '+51-1-999888777',
        email: 'carlos.gonzalez@email.com',
        esPrincipal: true
      }
    ],
    
    tipoSangre: 'O+',
    peso: 62,
    altura: 165,
    
    alergias: [
      {
        id: '1',
        alergia: 'Penicilina',
        severidad: 'moderada',
        reaccion: 'Erupción cutánea',
        fechaDiagnostico: '2010-05-20',
        activa: true
      },
      {
        id: '2',
        alergia: 'Latex',
        severidad: 'leve',
        reaccion: 'Irritación de piel',
        activa: true
      }
    ],
    
    condicionesMedicas: [
      {
        id: '1',
        condicion: 'Hipertensión arterial',
        fechaDiagnostico: '2020-01-15',
        medicamentos: 'Enalapril 10mg',
        controlado: true,
        observaciones: 'Control mensual con cardiólogo'
      }
    ],
    
    medicamentosActuales: [
      {
        id: '1',
        medicamento: 'Enalapril',
        dosis: '10mg',
        frecuencia: 'Una vez al día',
        fechaInicio: '2020-01-15',
        motivo: 'Hipertensión arterial',
        prescriptoPor: 'Dr. Ramírez - Cardiología'
      }
    ],
    
    historialOdontologico: {
      tratamientosAnteriores: [
        {
          id: '1',
          tipo: 'Endodoncia',
          diente: '16',
          fecha: '2022-08-15',
          dentista: 'Dr. Mendoza',
          resultado: 'Exitoso',
          costo: 800
        },
        {
          id: '2',
          tipo: 'Limpieza dental',
          fecha: '2023-12-10',
          dentista: 'Dr. Mendoza',
          resultado: 'Satisfactorio',
          costo: 120
        }
      ],
      problemasActuales: [
        {
          id: '1',
          problema: 'Sensibilidad dental',
          diente: '26',
          severidad: 'leve',
          fechaDeteccion: '2024-01-10',
          sintomas: ['Sensibilidad al frío', 'Molestia al masticar'],
          estado: 'pendiente'
        }
      ],
      ultimaLimpieza: '2023-12-10',
      ortodoncia: {
        haUsado: true,
        tipo: 'Brackets metálicos',
        fechas: '2018-2020',
        resultado: 'Excelente'
      }
    },
    
    habitos: {
      fumador: false,
      consumeAlcohol: true,
      frecuenciaAlcohol: 'ocasional',
      rechinarDientes: true,
      morderUñas: false,
      cepilladoFrecuencia: '2_veces',
      usoHiloDental: true,
      enjuagueBucal: true,
      dietaAzucarada: 'media',
      masticaHielo: false,
      deporteContacto: false
    },
    
    informacionSeguro: {
      tieneSeguro: true,
      compañia: 'Pacífico Seguros',
      numeroPoliza: 'PS-2024-456789',
      tipoCobertura: 'Plan Dental Plus',
      coberturaDental: 80,
      copago: 50,
      fechaVencimiento: '2024-12-31'
    },
    
    consentimientos: [
      {
        id: '1',
        tipo: 'Tratamiento Dental General',
        fecha: '2024-01-15',
        firmado: true,
        version: '2024.1',
        renovacionRequerida: false
      },
      {
        id: '2',
        tipo: 'Uso de Datos Médicos',
        fecha: '2024-01-15',
        firmado: true,
        version: '2024.1'
      }
    ],
    
    preferencias: {
      idioma: 'es',
      comunicacionPreferida: 'whatsapp',
      frecuenciaRecordatorios: '1_dia',
      horariosPreferidos: ['09:00-12:00', '14:00-17:00'],
      diasPreferidos: ['lunes', 'miercoles', 'viernes'],
      requiereTraductor: false,
      tipoConsulta: 'presencial'
    },
    
    configuracionPrivacidad: {
      compartirDatosConsultorios: true,
      permitirMarketing: false,
      compartirTestimonios: true,
      visibleEnBusquedas: true,
      notificacionesEmail: true,
      notificacionesSMS: true,
      retencionDatos: 10
    },
    
    dentistaAsignado: '1',
    consultorioPreferido: '1',
    
    activo: true,
    verificado: true,
    registroCompleto: true,
    origenRegistro: 'web',
    fechaRegistro: '2024-01-15T10:00:00Z',
    fechaUltimaActualizacion: '2024-02-28T15:30:00Z',
    
    totalCitas: 8,
    citasCompletadas: 7,
    citasCanceladas: 1,
    ultimaCita: '2023-12-10',
    proximaCita: '2024-03-20T10:00:00Z',
    
    saldoPendiente: 0,
    totalGastado: 2840,
    metodoPagoPreferido: 'tarjeta_credito',
    
    puntuacionRiesgo: 3,
    nivelSatisfaccion: 5,
    frecuenciaVisitas: 'media',
    
    notasDentista: 'Paciente colaboradora, buena higiene bucal. Sensible a ruidos del consultorio.',
    observacionesEspeciales: 'Prefiere citas matutinas por trabajo.'
  },
  {
    id: '2',
    nombres: 'Roberto Carlos',
    apellidos: 'Mendoza Silva',
    dni: '23456789',
    fechaNacimiento: '1955-11-08',
    edad: 68,
    genero: 'masculino',
    estadoCivil: 'casado',
    ocupacion: 'Jubilado',
    
    telefono: '+51-1-876543210',
    email: 'roberto.mendoza@email.com',
    direccion: 'Jr. Independencia 789, Surco',
    distrito: 'Surco',
    provincia: 'Lima',
    
    contactosEmergencia: [
      {
        id: '2',
        nombres: 'Carmen Silva',
        apellidos: 'de Mendoza',
        relacion: 'Esposa',
        telefono: '+51-1-888777666',
        esPrincipal: true
      }
    ],
    
    tipoSangre: 'A+',
    peso: 78,
    altura: 172,
    
    alergias: [
      {
        id: '3',
        alergia: 'Lidocaína',
        severidad: 'severa',
        reaccion: 'Shock anafiláctico',
        fechaDiagnostico: '2018-03-10',
        activa: true
      }
    ],
    
    condicionesMedicas: [
      {
        id: '2',
        condicion: 'Diabetes Mellitus Tipo 2',
        fechaDiagnostico: '2015-06-20',
        medicamentos: 'Metformina 850mg',
        controlado: false,
        observaciones: 'Requiere control estricto de glucosa'
      },
      {
        id: '3',
        condicion: 'Enfermedad Coronaria',
        fechaDiagnostico: '2019-02-14',
        medicamentos: 'Aspirina 100mg, Atorvastatina 40mg',
        controlado: true,
        observaciones: 'Control cardiológico cada 6 meses'
      }
    ],
    
    medicamentosActuales: [
      {
        id: '2',
        medicamento: 'Metformina',
        dosis: '850mg',
        frecuencia: 'Dos veces al día',
        fechaInicio: '2015-06-20',
        motivo: 'Diabetes Tipo 2'
      },
      {
        id: '3',
        medicamento: 'Aspirina',
        dosis: '100mg',
        frecuencia: 'Una vez al día',
        fechaInicio: '2019-02-14',
        motivo: 'Prevención cardiovascular'
      }
    ],
    
    historialOdontologico: {
      tratamientosAnteriores: [
        {
          id: '3',
          tipo: 'Prótesis parcial',
          diente: 'Sector posterior',
          fecha: '2020-05-15',
          dentista: 'Dr. Castillo',
          resultado: 'Satisfactorio',
          costo: 2500
        }
      ],
      problemasActuales: [
        {
          id: '2',
          problema: 'Periodontitis',
          severidad: 'moderada',
          fechaDeteccion: '2023-11-20',
          sintomas: ['Sangrado de encías', 'Mal aliento'],
          estado: 'en_tratamiento'
        }
      ],
      ultimaLimpieza: '2023-11-20',
      ortodoncia: {
        haUsado: false
      }
    },
    
    habitos: {
      fumador: true,
      cigarrillosDia: 15,
      añosFumando: 45,
      consumeAlcohol: true,
      frecuenciaAlcohol: 'moderado',
      rechinarDientes: false,
      morderUñas: false,
      cepilladoFrecuencia: '1_vez',
      usoHiloDental: false,
      enjuagueBucal: false,
      dietaAzucarada: 'alta',
      masticaHielo: false,
      deporteContacto: false
    },
    
    informacionSeguro: {
      tieneSeguro: true,
      compañia: 'EsSalud',
      numeroPoliza: 'ES-2024-789123',
      tipoCobertura: 'Plan Básico',
      coberturaDental: 60,
      copago: 20
    },
    
    consentimientos: [
      {
        id: '3',
        tipo: 'Tratamiento Dental General',
        fecha: '2023-11-20',
        firmado: true,
        version: '2023.2'
      }
    ],
    
    preferencias: {
      idioma: 'es',
      comunicacionPreferida: 'llamada',
      frecuenciaRecordatorios: '3_dias',
      horariosPreferidos: ['08:00-11:00'],
      diasPreferidos: ['martes', 'jueves'],
      requiereTraductor: false,
      tipoConsulta: 'presencial'
    },
    
    dentistaAsignado: '3',
    consultorioPreferido: '3',
    
    activo: true,
    verificado: true,
    registroCompleto: true,
    origenRegistro: 'referido',
    fechaRegistro: '2023-11-15T09:00:00Z',
    fechaUltimaActualizacion: '2024-01-20T14:30:00Z',
    
    totalCitas: 12,
    citasCompletadas: 10,
    citasCanceladas: 2,
    ultimaCita: '2023-11-20',
    proximaCita: '2024-02-15T09:00:00Z',
    
    saldoPendiente: 150,
    totalGastado: 4200,
    metodoPagoPreferido: 'efectivo',
    
    puntuacionRiesgo: 9,
    nivelSatisfaccion: 4,
    frecuenciaVisitas: 'alta',
    
    notasDentista: 'Paciente de alto riesgo por diabetes no controlada y tabaquismo. Requiere profilaxis antibiótica.',
    observacionesEspeciales: 'ALERTA: Alergia severa a lidocaína. Usar anestésicos alternativos.'
  },
  {
    id: '3',
    nombres: 'Sofia Isabella',
    apellidos: 'Rodríguez López',
    dni: '34567890',
    fechaNacimiento: '2015-07-22',
    edad: 8,
    genero: 'femenino',
    
    telefono: '+51-1-765432109',
    email: 'ana.rodriguez@email.com',
    direccion: 'Calle Las Flores 123, Miraflores',
    distrito: 'Miraflores',
    provincia: 'Lima',
    
    contactosEmergencia: [
      {
        id: '3',
        nombres: 'Ana López',
        apellidos: 'Vega',
        relacion: 'Madre',
        telefono: '+51-1-888777666',
        email: 'ana.lopez@email.com',
        esPrincipal: true
      },
      {
        id: '4',
        nombres: 'Luis Rodríguez',
        apellidos: 'Morales',
        relacion: 'Padre',
        telefono: '+51-1-777666555',
        esPrincipal: false
      }
    ],
    
    peso: 28,
    altura: 125,
    
    alergias: [],
    condicionesMedicas: [],
    medicamentosActuales: [],
    
    historialOdontologico: {
      tratamientosAnteriores: [
        {
          id: '4',
          tipo: 'Aplicación de flúor',
          fecha: '2023-06-15',
          dentista: 'Dra. Flores',
          resultado: 'Preventivo exitoso',
          costo: 80
        }
      ],
      problemasActuales: [
        {
          id: '3',
          problema: 'Caries inicial',
          diente: '55',
          severidad: 'leve',
          fechaDeteccion: '2024-01-10',
          sintomas: ['Sensibilidad leve'],
          estado: 'pendiente'
        }
      ],
      ultimaLimpieza: '2023-06-15',
      ortodoncia: {
        haUsado: false
      }
    },
    
    habitos: {
      fumador: false,
      consumeAlcohol: false,
      cepilladoFrecuencia: '2_veces',
      usoHiloDental: false,
      enjuagueBucal: false,
      dietaAzucarada: 'alta',
      masticaHielo: false,
      deporteContacto: false
    },
    
    informacionSeguro: {
      tieneSeguro: true,
      compañia: 'SIS',
      numeroPoliza: 'SIS-2024-123456',
      tipoCobertura: 'Plan Infantil',
      coberturaDental: 100,
      copago: 0
    },
    
    consentimientos: [
      {
        id: '4',
        tipo: 'Tratamiento Dental General',
        fecha: '2023-06-15',
        firmado: true,
        version: '2023.1',
        firmadoPor: 'Ana López (Madre)'
      }
    ],
    
    preferencias: {
      idioma: 'es',
      comunicacionPreferida: 'whatsapp',
      frecuenciaRecordatorios: '1_dia',
      requiereTraductor: false,
      necesidadesEspeciales: 'Requiere acompañamiento de padre/madre durante tratamiento',
      tipoConsulta: 'presencial'
    },
    
    dentistaAsignado: '4',
    consultorioPreferido: '3',
    
    activo: true,
    verificado: true,
    registroCompleto: true,
    origenRegistro: 'admin',
    fechaRegistro: '2023-06-10T11:00:00Z',
    fechaUltimaActualizacion: '2024-01-10T16:20:00Z',
    
    totalCitas: 3,
    citasCompletadas: 2,
    citasCanceladas: 1,
    ultimaCita: '2023-06-15',
    proximaCita: '2024-02-20T15:00:00Z',
    
    saldoPendiente: 0,
    totalGastado: 240,
    metodoPagoPreferido: 'seguro',
    
    puntuacionRiesgo: 2,
    nivelSatisfaccion: 5,
    frecuenciaVisitas: 'baja',
    
    notasDentista: 'Paciente pediátrica cooperativa. Madre muy involucrada en el cuidado dental.',
    observacionesEspeciales: 'Usar técnicas lúdicas para reducir ansiedad.'
  },
  {
    id: '4',
    nombres: 'Ana Patricia',
    apellidos: 'Flores Sánchez',
    dni: '45678901',
    fechaNacimiento: '1992-05-18',
    edad: 31,
    genero: 'femenino',
    estadoCivil: 'soltero',
    ocupacion: 'Ingeniera',
    
    telefono: '+51-1-654321098',
    email: 'ana.flores@email.com',
    direccion: 'Av. Primavera 321, Surco',
    distrito: 'Surco',
    provincia: 'Lima',
    
    contactosEmergencia: [
      {
        id: '5',
        nombres: 'Carmen Sánchez',
        apellidos: 'Vega',
        relacion: 'Madre',
        telefono: '+51-1-777888999',
        esPrincipal: true
      }
    ],
    
    tipoSangre: 'B+',
    peso: 58,
    altura: 160,
    
    alergias: [
      {
        id: '4',
        alergia: 'Mariscos',
        severidad: 'moderada',
        reaccion: 'Urticaria',
        activa: true
      }
    ],
    
    condicionesMedicas: [],
    medicamentosActuales: [],
    
    historialOdontologico: {
      tratamientosAnteriores: [
        {
          id: '5',
          tipo: 'Ortodoncia',
          fecha: '2020-03-10',
          dentista: 'Dra. Rodríguez',
          resultado: 'Excelente',
          costo: 8500
        }
      ],
      problemasActuales: [],
      ultimaLimpieza: '2023-09-15',
      ortodoncia: {
        haUsado: true,
        tipo: 'Invisalign',
        fechas: '2018-2020',
        resultado: 'Excelente'
      }
    },
    
    habitos: {
      fumador: false,
      consumeAlcohol: true,
      frecuenciaAlcohol: 'ocasional',
      rechinarDientes: false,
      morderUñas: false,
      cepilladoFrecuencia: '3_veces',
      usoHiloDental: true,
      enjuagueBucal: true,
      dietaAzucarada: 'baja',
      masticaHielo: false,
      deporteContacto: false
    },
    
    informacionSeguro: {
      tieneSeguro: true,
      compañia: 'Rímac Seguros',
      numeroPoliza: 'RI-2024-987654',
      tipoCobertura: 'Plan Premium',
      coberturaDental: 90,
      copago: 30,
      fechaVencimiento: '2024-11-30'
    },
    
    consentimientos: [
      {
        id: '5',
        tipo: 'Tratamiento Dental General',
        fecha: '2023-09-15',
        firmado: true,
        version: '2023.2'
      }
    ],
    
    preferencias: {
      idioma: 'es',
      comunicacionPreferida: 'email',
      frecuenciaRecordatorios: '1_dia',
      horariosPreferidos: ['18:00-20:00'],
      diasPreferidos: ['lunes', 'martes', 'miercoles'],
      requiereTraductor: false,
      tipoConsulta: 'presencial'
    },
    
    dentistaAsignado: '2',
    consultorioPreferido: '2',
    
    activo: true,
    verificado: true,
    registroCompleto: true,
    origenRegistro: 'web',
    fechaRegistro: '2023-09-10T14:00:00Z',
    fechaUltimaActualizacion: '2024-01-15T10:45:00Z',
    
    totalCitas: 5,
    citasCompletadas: 5,
    citasCanceladas: 0,
    ultimaCita: '2023-09-15',
    proximaCita: '2024-03-15T18:30:00Z',
    
    saldoPendiente: 0,
    totalGastado: 9200,
    metodoPagoPreferido: 'tarjeta_credito',
    
    puntuacionRiesgo: 1,
    nivelSatisfaccion: 5,
    frecuenciaVisitas: 'media',
    
    notasDentista: 'Excelente higiene bucal. Muy puntual y responsable con el tratamiento.',
    observacionesEspeciales: 'Prefiere citas después del trabajo.'
  }
];

// Simulación de delay de red
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Simulación de errores aleatorios (2% de probabilidad)
const shouldSimulateError = () => Math.random() < 0.02;

class PatientApiService {
  constructor() {
    this.patients = [...mockPatients];
  }

  async getPatients(filters = {}, pagination = { page: 1, limit: 12 }) {
    await delay(400);
    
    if (shouldSimulateError()) {
      throw new Error('Error al cargar los pacientes. Intente nuevamente.');
    }

    let filteredPatients = [...this.patients];

    // Aplicar filtros
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredPatients = filteredPatients.filter(patient =>
        patient.nombres.toLowerCase().includes(searchLower) ||
        patient.apellidos.toLowerCase().includes(searchLower) ||
        patient.dni.includes(searchLower) ||
        patient.telefono.includes(searchLower) ||
        patient.email.toLowerCase().includes(searchLower)
      );
    }

    if (filters.consultorio) {
      filteredPatients = filteredPatients.filter(p => p.consultorioPreferido === filters.consultorio);
    }

    if (filters.dentista) {
      filteredPatients = filteredPatients.filter(p => p.dentistaAsignado === filters.dentista);
    }

    if (filters.distrito) {
      filteredPatients = filteredPatients.filter(p => p.distrito === filters.distrito);
    }

    if (filters.edadMin !== null && filters.edadMin !== undefined) {
      filteredPatients = filteredPatients.filter(p => p.edad >= filters.edadMin);
    }

    if (filters.edadMax !== null && filters.edadMax !== undefined) {
      filteredPatients = filteredPatients.filter(p => p.edad <= filters.edadMax);
    }

    if (filters.genero) {
      filteredPatients = filteredPatients.filter(p => p.genero === filters.genero);
    }

    if (filters.tieneSeguro !== null && filters.tieneSeguro !== undefined) {
      filteredPatients = filteredPatients.filter(p => 
        (p.informacionSeguro?.tieneSeguro || false) === filters.tieneSeguro
      );
    }

    if (filters.activo !== null && filters.activo !== undefined) {
      filteredPatients = filteredPatients.filter(p => p.activo === filters.activo);
    }

    if (filters.verificado !== null && filters.verificado !== undefined) {
      filteredPatients = filteredPatients.filter(p => p.verificado === filters.verificado);
    }

    if (filters.registroCompleto !== null && filters.registroCompleto !== undefined) {
      filteredPatients = filteredPatients.filter(p => p.registroCompleto === filters.registroCompleto);
    }

    if (filters.riesgoOdontologico && filters.riesgoOdontologico.length === 2) {
      const [min, max] = filters.riesgoOdontologico;
      filteredPatients = filteredPatients.filter(p => 
        p.puntuacionRiesgo >= min && p.puntuacionRiesgo <= max
      );
    }

    // Aplicar ordenamiento
    if (filters.sortBy) {
      filteredPatients.sort((a, b) => {
        let aValue = a[filters.sortBy];
        let bValue = b[filters.sortBy];

        if (filters.sortBy === 'nombre') {
          aValue = `${a.nombres} ${a.apellidos}`.toLowerCase();
          bValue = `${b.nombres} ${b.apellidos}`.toLowerCase();
        } else if (filters.sortBy === 'fecha_registro' || filters.sortBy === 'ultima_cita') {
          aValue = new Date(aValue || 0);
          bValue = new Date(bValue || 0);
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
    const total = filteredPatients.length;
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    const paginatedPatients = filteredPatients.slice(startIndex, endIndex);

    return {
      data: paginatedPatients,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit)
      }
    };
  }

  async getPatientById(id) {
    await delay(250);
    
    if (shouldSimulateError()) {
      throw new Error('Error al cargar el paciente. Intente nuevamente.');
    }

    const patient = this.patients.find(p => p.id === id);
    if (!patient) {
      throw new Error('Paciente no encontrado');
    }

    return patient;
  }

  async createPatient(patientData) {
    await delay(600);
    
    if (shouldSimulateError()) {
      throw new Error('Error al crear el paciente. Intente nuevamente.');
    }

    // Validar DNI único
    const existingDNI = this.patients.find(p => p.dni === patientData.dni);
    if (existingDNI) {
      throw new Error('El DNI ya está registrado');
    }

    // Validar email único
    const existingEmail = this.patients.find(p => p.email === patientData.email);
    if (existingEmail) {
      throw new Error('El email ya está registrado');
    }

    const newPatient = {
      id: Date.now().toString(),
      ...patientData,
      edad: this.calculateAge(patientData.fechaNacimiento),
      fechaRegistro: new Date().toISOString(),
      fechaUltimaActualizacion: new Date().toISOString(),
      totalCitas: 0,
      citasCompletadas: 0,
      citasCanceladas: 0,
      saldoPendiente: 0,
      totalGastado: 0,
      puntuacionRiesgo: this.calculateRiskScore(patientData),
      registroCompleto: this.calculateCompleteness(patientData)
    };

    this.patients.push(newPatient);
    return newPatient;
  }

  async updatePatient(id, patientData) {
    await delay(550);
    
    if (shouldSimulateError()) {
      throw new Error('Error al actualizar el paciente. Intente nuevamente.');
    }

    const index = this.patients.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Paciente no encontrado');
    }

    // Validar DNI único (excluyendo el paciente actual)
    const existingDNI = this.patients.find(p => 
      p.dni === patientData.dni && p.id !== id
    );
    if (existingDNI) {
      throw new Error('El DNI ya está registrado');
    }

    // Validar email único (excluyendo el paciente actual)
    const existingEmail = this.patients.find(p => 
      p.email === patientData.email && p.id !== id
    );
    if (existingEmail) {
      throw new Error('El email ya está registrado');
    }

    const updatedPatient = {
      ...this.patients[index],
      ...patientData,
      edad: this.calculateAge(patientData.fechaNacimiento || this.patients[index].fechaNacimiento),
      fechaUltimaActualizacion: new Date().toISOString(),
      puntuacionRiesgo: this.calculateRiskScore({ ...this.patients[index], ...patientData }),
      registroCompleto: this.calculateCompleteness({ ...this.patients[index], ...patientData })
    };

    this.patients[index] = updatedPatient;
    return updatedPatient;
  }

  async deletePatient(id) {
    await delay(450);
    
    if (shouldSimulateError()) {
      throw new Error('Error al eliminar el paciente. Intente nuevamente.');
    }

    const patient = this.patients.find(p => p.id === id);
    if (!patient) {
      throw new Error('Paciente no encontrado');
    }

    // Verificar si tiene citas pendientes
    if (patient.proximaCita) {
      const proximaCita = new Date(patient.proximaCita);
      if (proximaCita > new Date()) {
        throw new Error('No se puede eliminar un paciente que tiene citas pendientes');
      }
    }

    this.patients = this.patients.filter(p => p.id !== id);
    return { success: true, message: 'Paciente eliminado correctamente' };
  }

  async togglePatientStatus(id) {
    await delay(350);
    
    if (shouldSimulateError()) {
      throw new Error('Error al cambiar el estado del paciente. Intente nuevamente.');
    }

    const index = this.patients.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Paciente no encontrado');
    }

    this.patients[index] = {
      ...this.patients[index],
      activo: !this.patients[index].activo,
      fechaUltimaActualizacion: new Date().toISOString()
    };

    return this.patients[index];
  }

  async bulkUpdatePatients(ids, updates) {
    await delay(800);
    
    if (shouldSimulateError()) {
      throw new Error('Error en la operación masiva. Intente nuevamente.');
    }

    const updatedPatients = [];
    
    for (const id of ids) {
      const index = this.patients.findIndex(p => p.id === id);
      if (index !== -1) {
        this.patients[index] = {
          ...this.patients[index],
          ...updates,
          fechaUltimaActualizacion: new Date().toISOString()
        };
        updatedPatients.push(this.patients[index]);
      }
    }

    return {
      success: true,
      updated: updatedPatients.length,
      patients: updatedPatients
    };
  }

  async getPatientStats() {
    await delay(300);
    
    if (shouldSimulateError()) {
      throw new Error('Error al cargar las estadísticas. Intente nuevamente.');
    }

    const total = this.patients.length;
    const activos = this.patients.filter(p => p.activo).length;
    const verificados = this.patients.filter(p => p.verificado).length;
    const registroCompleto = this.patients.filter(p => p.registroCompleto).length;

    // Distribución por género
    const distribucionGenero = this.patients.reduce((acc, p) => {
      acc[p.genero] = (acc[p.genero] || 0) + 1;
      return acc;
    }, {});

    // Distribución por edad
    const distribucionEdad = this.patients.reduce((acc, p) => {
      if (p.edad < 18) acc['0-18']++;
      else if (p.edad < 30) acc['19-30']++;
      else if (p.edad < 45) acc['31-45']++;
      else if (p.edad < 60) acc['46-60']++;
      else acc['60+']++;
      return acc;
    }, { '0-18': 0, '19-30': 0, '31-45': 0, '46-60': 0, '60+': 0 });

    // Pacientes con seguro
    const pacientesConSeguro = this.patients.filter(p => 
      p.informacionSeguro?.tieneSeguro
    ).length;

    // Promedio de edad
    const edadPromedio = total > 0 
      ? Math.round(this.patients.reduce((sum, p) => sum + p.edad, 0) / total)
      : 0;

    // Satisfacción promedio
    const satisfaccionPromedio = total > 0
      ? Math.round(this.patients.reduce((sum, p) => sum + (p.nivelSatisfaccion || 0), 0) / total * 10) / 10
      : 0;

    // Riesgo promedio
    const riesgoPromedio = total > 0
      ? Math.round(this.patients.reduce((sum, p) => sum + (p.puntuacionRiesgo || 0), 0) / total * 10) / 10
      : 0;

    return {
      totalPacientes: total,
      pacientesActivos: activos,
      pacientesInactivos: total - activos,
      pacientesVerificados: verificados,
      pacientesRegistroCompleto: registroCompleto,
      distribucionGenero,
      distribucionEdad,
      pacientesConSeguro,
      edadPromedio,
      satisfaccionPromedio,
      riesgoPromedio,
      porcentajeActivos: total > 0 ? Math.round((activos / total) * 100) : 0,
      porcentajeVerificados: total > 0 ? Math.round((verificados / total) * 100) : 0,
      porcentajeConSeguro: total > 0 ? Math.round((pacientesConSeguro / total) * 100) : 0
    };
  }

  async exportPatients(filters = {}) {
    await delay(1200);
    
    const { data } = await this.getPatients(filters, { page: 1, limit: 1000 });
    return data;
  }

  async getSearchSuggestions(query) {
    await delay(200);
    
    if (!query || query.length < 2) return [];

    const suggestions = [];
    const queryLower = query.toLowerCase();

    // Sugerencias de nombres de pacientes
    this.patients.forEach(patient => {
      const fullName = `${patient.nombres} ${patient.apellidos}`;
      if (fullName.toLowerCase().includes(queryLower)) {
        suggestions.push({
          type: 'patient',
          value: fullName,
          label: fullName,
          subtitle: `DNI: ${patient.dni}`
        });
      }
    });

    return suggestions.slice(0, 10);
  }

  async createFromPublicRegistration(registrationData) {
    await delay(800);
    
    if (shouldSimulateError()) {
      throw new Error('Error en el registro. Intente nuevamente.');
    }

    // Validar DNI único
    const existingDNI = this.patients.find(p => p.dni === registrationData.dni);
    if (existingDNI) {
      throw new Error('El DNI ya está registrado en el sistema');
    }

    // Validar email único
    const existingEmail = this.patients.find(p => p.email === registrationData.email);
    if (existingEmail) {
      throw new Error('El email ya está registrado');
    }

    const newPatient = {
      id: Date.now().toString(),
      nombres: registrationData.nombres,
      apellidos: registrationData.apellidos,
      dni: registrationData.dni,
      fechaNacimiento: registrationData.fechaNacimiento,
      edad: this.calculateAge(registrationData.fechaNacimiento),
      genero: registrationData.genero,
      telefono: registrationData.telefono,
      email: registrationData.email,
      direccion: registrationData.direccion,
      distrito: registrationData.distrito,
      
      contactosEmergencia: registrationData.contactoEmergencia ? [
        {
          id: Date.now().toString(),
          nombres: registrationData.contactoEmergencia.nombres,
          telefono: registrationData.contactoEmergencia.telefono,
          relacion: registrationData.contactoEmergencia.relacion,
          esPrincipal: true
        }
      ] : [],
      
      alergias: registrationData.alergias ? [
        {
          id: Date.now().toString(),
          alergia: registrationData.alergias,
          severidad: 'leve',
          activa: true
        }
      ] : [],
      
      condicionesMedicas: registrationData.condicionesMedicas ? [
        {
          id: Date.now().toString(),
          condicion: registrationData.condicionesMedicas,
          controlado: true
        }
      ] : [],
      
      medicamentosActuales: registrationData.medicamentos ? [
        {
          id: Date.now().toString(),
          medicamento: registrationData.medicamentos,
          dosis: 'No especificada',
          frecuencia: 'No especificada'
        }
      ] : [],
      
      historialOdontologico: {
        tratamientosAnteriores: [],
        problemasActuales: registrationData.motivoConsulta ? [
          {
            id: Date.now().toString(),
            problema: registrationData.motivoConsulta,
            severidad: 'leve',
            fechaDeteccion: new Date().toISOString().split('T')[0],
            estado: 'pendiente'
          }
        ] : [],
        ortodoncia: { haUsado: false }
      },
      
      habitos: {
        fumador: false,
        consumeAlcohol: false,
        cepilladoFrecuencia: '2_veces',
        usoHiloDental: false,
        enjuagueBucal: false,
        dietaAzucarada: 'media'
      },
      
      consentimientos: [
        {
          id: Date.now().toString(),
          tipo: 'Tratamiento Dental General',
          fecha: new Date().toISOString(),
          firmado: registrationData.aceptaTerminos,
          version: '2024.1'
        },
        {
          id: (Date.now() + 1).toString(),
          tipo: 'Uso de Datos Médicos',
          fecha: new Date().toISOString(),
          firmado: registrationData.autorizaDatos,
          version: '2024.1'
        }
      ],
      
      preferencias: {
        idioma: 'es',
        comunicacionPreferida: 'email',
        frecuenciaRecordatorios: '1_dia',
        tipoConsulta: 'presencial'
      },
      
      consultorioPreferido: registrationData.consultorioPreferido,
      dentistaAsignado: registrationData.dentistaPreferido,
      
      activo: true,
      verificado: false,
      registroCompleto: false,
      origenRegistro: 'web',
      fechaRegistro: new Date().toISOString(),
      fechaUltimaActualizacion: new Date().toISOString(),
      
      totalCitas: 0,
      citasCompletadas: 0,
      citasCanceladas: 0,
      saldoPendiente: 0,
      totalGastado: 0,
      puntuacionRiesgo: 1,
      nivelSatisfaccion: 0,
      frecuenciaVisitas: 'baja'
    };

    this.patients.push(newPatient);
    return newPatient;
  }

  calculateAge(fechaNacimiento) {
    if (!fechaNacimiento) return 0;
    const birth = new Date(fechaNacimiento);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  calculateRiskScore(patientData) {
    let riskScore = 1;

    // Age factor
    if (patientData.edad > 65) riskScore += 1;
    if (patientData.edad > 75) riskScore += 1;

    // Medical conditions
    const highRiskConditions = [
      'diabetes', 'hipertension', 'enfermedad_cardiaca',
      'anticoagulante', 'osteoporosis', 'cancer'
    ];

    patientData.condicionesMedicas?.forEach(condition => {
      if (highRiskConditions.some(hrc => 
        condition.condicion.toLowerCase().includes(hrc))) {
        riskScore += condition.controlado ? 1 : 2;
      }
    });

    // Severe allergies
    const severeAllergies = patientData.alergias?.filter(a => a.severidad === 'severa').length || 0;
    riskScore += severeAllergies * 0.5;

    // Smoking
    if (patientData.habitos?.fumador) {
      riskScore += patientData.habitos.cigarrillosDia > 20 ? 2 : 1;
    }

    // Poor oral hygiene
    if (patientData.habitos?.cepilladoFrecuencia === 'nunca' || 
        patientData.habitos?.cepilladoFrecuencia === '1_vez') {
      riskScore += 1;
    }

    return Math.min(riskScore, 10);
  }

  calculateCompleteness(patientData) {
    const requiredFields = [
      'nombres', 'apellidos', 'dni', 'fechaNacimiento', 
      'telefono', 'email', 'contactosEmergencia'
    ];

    const completedRequired = requiredFields.filter(field => 
      patientData[field] && (Array.isArray(patientData[field]) ? patientData[field].length > 0 : true)
    ).length;

    const completenessScore = (completedRequired / requiredFields.length) * 100;
    return completenessScore >= 80;
  }
}

// Instancia singleton del servicio
const patientApiService = new PatientApiService();

// API pública del servicio
export const patientApi = {
  getPatients: (filters, pagination) => patientApiService.getPatients(filters, pagination),
  getPatientById: (id) => patientApiService.getPatientById(id),
  createPatient: (data) => patientApiService.createPatient(data),
  updatePatient: (id, data) => patientApiService.updatePatient(id, data),
  deletePatient: (id) => patientApiService.deletePatient(id),
  togglePatientStatus: (id) => patientApiService.togglePatientStatus(id),
  bulkUpdatePatients: (ids, updates) => patientApiService.bulkUpdatePatients(ids, updates),
  getPatientStats: () => patientApiService.getPatientStats(),
  exportPatients: (filters) => patientApiService.exportPatients(filters),
  getSearchSuggestions: (query) => patientApiService.getSearchSuggestions(query),
  createFromPublicRegistration: (data) => patientApiService.createFromPublicRegistration(data)
};

export default patientApi;