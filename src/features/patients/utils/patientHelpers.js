import { format, parseISO, differenceInYears } from 'date-fns';
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

export const calculateAge = (fechaNacimiento) => {
  if (!fechaNacimiento) return null;
  try {
    return differenceInYears(new Date(), parseISO(fechaNacimiento));
  } catch (error) {
    return null;
  }
};

export const formatFullName = (nombres, apellidos) => {
  return `${nombres} ${apellidos}`.trim();
};

export const formatPhone = (phone) => {
  if (!phone) return '';
  // Formato: +51-1-987654321
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 9) {
    return `+51-1-${cleaned}`;
  }
  return phone;
};

export const validateDNI = (dni) => {
  const pattern = /^\d{8}$/;
  return pattern.test(dni);
};

export const calculateBMI = (peso, altura) => {
  if (!peso || !altura) return null;
  const alturaMetros = altura / 100;
  const bmi = peso / (alturaMetros * alturaMetros);
  return Math.round(bmi * 10) / 10;
};

export const getBMICategory = (bmi) => {
  if (!bmi) return 'No calculado';
  if (bmi < 18.5) return 'Bajo peso';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Sobrepeso';
  return 'Obesidad';
};

export const getAgeGroup = (edad) => {
  if (edad < 18) return 'Menor de edad';
  if (edad < 30) return 'Adulto joven';
  if (edad < 45) return 'Adulto';
  if (edad < 60) return 'Adulto maduro';
  return 'Adulto mayor';
};

export const calculateRiskScore = (patient) => {
  let riskScore = 1; // Base score

  // Age factor
  if (patient.edad > 65) riskScore += 1;
  if (patient.edad > 75) riskScore += 1;

  // Medical conditions
  const highRiskConditions = [
    'diabetes', 'hipertension', 'enfermedad_cardiaca',
    'anticoagulante', 'osteoporosis', 'cancer'
  ];

  patient.condicionesMedicas?.forEach(condition => {
    if (highRiskConditions.some(hrc => 
      condition.condicion.toLowerCase().includes(hrc))) {
      riskScore += condition.controlado ? 1 : 2;
    }
  });

  // Severe allergies
  const severeAllergies = patient.alergias?.filter(a => a.severidad === 'severa').length || 0;
  riskScore += severeAllergies * 0.5;

  // Smoking
  if (patient.habitos?.fumador) {
    riskScore += patient.habitos.cigarrillosDia > 20 ? 2 : 1;
  }

  // Poor oral hygiene
  if (patient.habitos?.cepilladoFrecuencia === 'nunca' || 
      patient.habitos?.cepilladoFrecuencia === '1_vez') {
    riskScore += 1;
  }

  // Multiple medications (polypharmacy)
  if (patient.medicamentosActuales?.length > 5) {
    riskScore += 1;
  }

  return Math.min(riskScore, 10); // Cap at 10
};

export const getRiskLevelColor = (riskScore) => {
  if (riskScore <= 2) return 'text-green-600 bg-green-100';
  if (riskScore <= 4) return 'text-yellow-600 bg-yellow-100';
  if (riskScore <= 6) return 'text-orange-600 bg-orange-100';
  return 'text-red-600 bg-red-100';
};

export const getRiskLevelText = (riskScore) => {
  if (riskScore <= 2) return 'Bajo';
  if (riskScore <= 4) return 'Medio';
  if (riskScore <= 6) return 'Alto';
  return 'Crítico';
};

export const generateMedicalAlerts = (patient) => {
  const alerts = [];

  // Alergias críticas
  patient.alergias?.forEach(allergy => {
    if (allergy.severidad === 'severa') {
      alerts.push({
        type: 'CRITICAL_ALLERGY',
        message: `ALERGIA SEVERA: ${allergy.alergia}`,
        priority: 'high',
        color: 'red'
      });
    }
  });

  // Condiciones médicas críticas
  const criticalConditions = [
    'diabetes', 'hipertension', 'enfermedad_cardiaca', 
    'anticoagulante', 'marcapasos', 'embarazo'
  ];

  patient.condicionesMedicas?.forEach(condition => {
    if (criticalConditions.some(cc => 
      condition.condicion.toLowerCase().includes(cc))) {
      alerts.push({
        type: 'MEDICAL_CONDITION',
        message: `Condición Crítica: ${condition.condicion}`,
        priority: 'medium',
        color: 'orange'
      });
    }
  });

  // Edad avanzada
  if (patient.edad >= 65) {
    alerts.push({
      type: 'AGE_CONSIDERATION',
      message: 'Paciente adulto mayor - considerar precauciones',
      priority: 'low',
      color: 'blue'
    });
  }

  // Alto riesgo
  if (patient.puntuacionRiesgo >= 8) {
    alerts.push({
      type: 'HIGH_RISK',
      message: 'Paciente de alto riesgo odontológico',
      priority: 'high',
      color: 'red'
    });
  }

  return alerts;
};

export const checkDrugInteractions = (medications) => {
  const interactions = [];
  
  // Interacciones conocidas (simplificado)
  const knownInteractions = {
    'warfarin': ['aspirina', 'ibuprofeno'],
    'aspirina': ['warfarin', 'clopidogrel'],
    'metformina': ['alcohol']
  };

  medications.forEach(med1 => {
    medications.forEach(med2 => {
      if (med1.id !== med2.id) {
        const med1Name = med1.medicamento.toLowerCase();
        const med2Name = med2.medicamento.toLowerCase();
        
        if (knownInteractions[med1Name]?.includes(med2Name)) {
          interactions.push({
            drugs: [med1.medicamento, med2.medicamento],
            severity: 'moderate',
            recommendation: 'Consultar con médico antes del tratamiento'
          });
        }
      }
    });
  });

  return interactions;
};

export const validateMedicalData = (medicalData) => {
  const errors = [];

  // Validar alergias
  if (medicalData.alergias) {
    medicalData.alergias.forEach((allergy, index) => {
      if (!allergy.alergia) {
        errors.push(`Alergia ${index + 1}: Nombre de alergia requerido`);
      }
      if (!allergy.severidad) {
        errors.push(`Alergia ${index + 1}: Severidad requerida`);
      }
    });
  }

  // Validar condiciones médicas
  if (medicalData.condicionesMedicas) {
    medicalData.condicionesMedicas.forEach((condition, index) => {
      if (!condition.condicion) {
        errors.push(`Condición ${index + 1}: Nombre de condición requerido`);
      }
    });
  }

  // Validar medicamentos
  if (medicalData.medicamentosActuales) {
    medicalData.medicamentosActuales.forEach((med, index) => {
      if (!med.medicamento) {
        errors.push(`Medicamento ${index + 1}: Nombre requerido`);
      }
      if (!med.dosis) {
        errors.push(`Medicamento ${index + 1}: Dosis requerida`);
      }
    });
  }

  return errors;
};

export const formatMedicalHistory = (historial) => {
  if (!historial) return 'Sin historial médico';

  const sections = [];

  if (historial.tratamientosAnteriores?.length > 0) {
    sections.push(`${historial.tratamientosAnteriores.length} tratamientos previos`);
  }

  if (historial.problemasActuales?.length > 0) {
    sections.push(`${historial.problemasActuales.length} problemas actuales`);
  }

  if (historial.ultimaLimpieza) {
    sections.push(`Última limpieza: ${formatDate(historial.ultimaLimpieza)}`);
  }

  return sections.join(' • ') || 'Sin historial registrado';
};

export const getPatientStatusColor = (activo, verificado, registroCompleto) => {
  if (!activo) return 'text-red-600 bg-red-100';
  if (!verificado) return 'text-yellow-600 bg-yellow-100';
  if (!registroCompleto) return 'text-orange-600 bg-orange-100';
  return 'text-green-600 bg-green-100';
};

export const getPatientStatusText = (activo, verificado, registroCompleto) => {
  if (!activo) return 'Inactivo';
  if (!verificado) return 'Pendiente Verificación';
  if (!registroCompleto) return 'Registro Incompleto';
  return 'Activo';
};

export const formatInsuranceInfo = (seguro) => {
  if (!seguro || !seguro.tieneSeguro) return 'Sin seguro';
  
  const coverage = seguro.coberturaDental ? `${seguro.coberturaDental}% cobertura` : '';
  return `${seguro.compañia} ${coverage}`.trim();
};

export const calculateProfileCompleteness = (patient) => {
  const requiredFields = [
    'nombres', 'apellidos', 'dni', 'fechaNacimiento', 
    'telefono', 'email', 'contactosEmergencia'
  ];

  const medicalFields = [
    'alergias', 'condicionesMedicas', 'medicamentosActuales'
  ];

  const completedRequired = requiredFields.filter(field => 
    patient[field] && (Array.isArray(patient[field]) ? patient[field].length > 0 : true)
  ).length;

  const completedMedical = medicalFields.filter(field => 
    patient[field] !== undefined && patient[field] !== null
  ).length;

  const completenessScore = (
    (completedRequired / requiredFields.length) * 0.7 +
    (completedMedical / medicalFields.length) * 0.3
  ) * 100;

  return {
    complete: completenessScore >= 80,
    score: Math.round(completenessScore),
    missingRequired: requiredFields.filter(field => !patient[field]),
    missingMedical: medicalFields.filter(field => !patient[field])
  };
};

export const exportPatientsToCSV = (patients) => {
  const headers = [
    'Nombres',
    'Apellidos',
    'DNI',
    'Edad',
    'Género',
    'Teléfono',
    'Email',
    'Distrito',
    'Dentista Asignado',
    'Consultorio Preferido',
    'Total Citas',
    'Última Cita',
    'Riesgo Odontológico',
    'Estado',
    'Fecha Registro'
  ];

  const csvContent = [
    headers.join(','),
    ...patients.map(patient => [
      `"${patient.nombres}"`,
      `"${patient.apellidos}"`,
      patient.dni,
      patient.edad,
      patient.genero,
      patient.telefono,
      patient.email,
      patient.distrito || '',
      patient.dentistaAsignado || '',
      patient.consultorioPreferido || '',
      patient.totalCitas || 0,
      patient.ultimaCita ? formatDate(patient.ultimaCita) : '',
      patient.puntuacionRiesgo || 0,
      getPatientStatusText(patient.activo, patient.verificado, patient.registroCompleto),
      formatDate(patient.fechaRegistro)
    ].join(','))
  ].join('\n');

  return csvContent;
};

export const filterPatients = (patients, filters) => {
  return patients.filter(patient => {
    // Filtro de búsqueda
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        patient.nombres.toLowerCase().includes(searchLower) ||
        patient.apellidos.toLowerCase().includes(searchLower) ||
        patient.dni.includes(searchLower) ||
        patient.telefono.includes(searchLower) ||
        patient.email.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Filtro por consultorio
    if (filters.consultorio && patient.consultorioPreferido !== filters.consultorio) {
      return false;
    }

    // Filtro por dentista
    if (filters.dentista && patient.dentistaAsignado !== filters.dentista) {
      return false;
    }

    // Filtro por distrito
    if (filters.distrito && patient.distrito !== filters.distrito) {
      return false;
    }

    // Filtro por edad
    if (filters.edadMin !== null && patient.edad < filters.edadMin) {
      return false;
    }
    if (filters.edadMax !== null && patient.edad > filters.edadMax) {
      return false;
    }

    // Filtro por género
    if (filters.genero && patient.genero !== filters.genero) {
      return false;
    }

    // Filtro por seguro
    if (filters.tieneSeguro !== null) {
      const tieneSeguro = patient.informacionSeguro?.tieneSeguro || false;
      if (tieneSeguro !== filters.tieneSeguro) {
        return false;
      }
    }

    // Filtros de estado
    if (filters.activo !== null && patient.activo !== filters.activo) {
      return false;
    }
    if (filters.verificado !== null && patient.verificado !== filters.verificado) {
      return false;
    }
    if (filters.registroCompleto !== null && patient.registroCompleto !== filters.registroCompleto) {
      return false;
    }

    // Filtro por riesgo odontológico
    if (filters.riesgoOdontologico && filters.riesgoOdontologico.length === 2) {
      const [min, max] = filters.riesgoOdontologico;
      if (patient.puntuacionRiesgo < min || patient.puntuacionRiesgo > max) {
        return false;
      }
    }

    return true;
  });
};

export const sortPatients = (patients, sortBy, sortOrder) => {
  return [...patients].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    // Manejar diferentes tipos de datos
    if (sortBy === 'nombre') {
      aValue = `${a.nombres} ${a.apellidos}`.toLowerCase();
      bValue = `${b.nombres} ${b.apellidos}`.toLowerCase();
    } else if (sortBy === 'fecha_registro' || sortBy === 'ultima_cita') {
      aValue = new Date(aValue || 0);
      bValue = new Date(bValue || 0);
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

export const generatePatientCode = (nombres, apellidos, fechaNacimiento) => {
  const firstNameInitial = nombres.charAt(0).toUpperCase();
  const lastNameInitial = apellidos.split(' ')[0].charAt(0).toUpperCase();
  const birthYear = new Date(fechaNacimiento).getFullYear().toString().slice(-2);
  const randomNumber = Math.floor(Math.random() * 900) + 100;
  return `PAC-${firstNameInitial}${lastNameInitial}${birthYear}-${randomNumber}`;
};

export const validateEmergencyContact = (contact) => {
  const errors = [];
  
  if (!contact.nombres) errors.push('Nombre requerido');
  if (!contact.telefono) errors.push('Teléfono requerido');
  if (!contact.relacion) errors.push('Relación requerida');
  
  if (contact.telefono && !formatPhone(contact.telefono)) {
    errors.push('Formato de teléfono inválido');
  }

  return errors;
};

export const formatMedicalConditions = (condiciones) => {
  if (!condiciones || condiciones.length === 0) return 'Ninguna';
  
  return condiciones.map(c => {
    const status = c.controlado ? '(controlado)' : '(no controlado)';
    return `${c.condicion} ${status}`;
  }).join(', ');
};

export const formatAllergies = (alergias) => {
  if (!alergias || alergias.length === 0) return 'Ninguna conocida';
  
  return alergias.map(a => {
    const severity = a.severidad === 'severa' ? ' ⚠️' : '';
    return `${a.alergia}${severity}`;
  }).join(', ');
};

export const formatCurrentMedications = (medicamentos) => {
  if (!medicamentos || medicamentos.length === 0) return 'Ninguno';
  
  return medicamentos.map(m => 
    `${m.medicamento} ${m.dosis} (${m.frecuencia})`
  ).join(', ');
};

export const calculateNextAppointmentRecommendation = (patient) => {
  const riskScore = patient.puntuacionRiesgo || 1;
  const lastVisit = patient.ultimaCita ? new Date(patient.ultimaCita) : null;
  
  // Recomendaciones basadas en riesgo
  let recommendedInterval; // en meses
  
  if (riskScore >= 8) {
    recommendedInterval = 3; // Cada 3 meses para alto riesgo
  } else if (riskScore >= 5) {
    recommendedInterval = 4; // Cada 4 meses para riesgo medio
  } else {
    recommendedInterval = 6; // Cada 6 meses para bajo riesgo
  }

  if (!lastVisit) {
    return {
      recommended: true,
      urgency: 'high',
      reason: 'Primera consulta pendiente'
    };
  }

  const monthsSinceLastVisit = differenceInYears(new Date(), lastVisit) * 12;
  
  if (monthsSinceLastVisit >= recommendedInterval) {
    return {
      recommended: true,
      urgency: monthsSinceLastVisit >= recommendedInterval * 1.5 ? 'high' : 'medium',
      reason: `${Math.floor(monthsSinceLastVisit)} meses desde última consulta`
    };
  }

  return {
    recommended: false,
    nextRecommendedDate: new Date(lastVisit.getTime() + (recommendedInterval * 30 * 24 * 60 * 60 * 1000))
  };
};