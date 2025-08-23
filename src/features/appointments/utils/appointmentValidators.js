import * as yup from 'yup';
import { addDays, addMonths, parseISO, isAfter, isBefore } from 'date-fns';

// Esquemas de validación por pasos
export const patientStepSchema = yup.object().shape({
  pacienteId: yup
    .string()
    .required('Debe seleccionar un paciente'),

  tipoConsulta: yup
    .string()
    .required('Debe seleccionar el tipo de consulta')
    .oneOf(['primera_vez', 'control', 'tratamiento', 'emergencia', 'seguimiento']),

  prioridad: yup
    .string()
    .required('Debe seleccionar la prioridad')
    .oneOf(['baja', 'normal', 'alta', 'urgente']),

  motivo: yup
    .string()
    .required('El motivo de la consulta es requerido')
    .min(10, 'El motivo debe tener al menos 10 caracteres')
    .max(500, 'El motivo no puede exceder 500 caracteres')
});

export const scheduleStepSchema = yup.object().shape({
  fecha: yup
    .string()
    .required('La fecha es requerida')
    .test('future-date', 'La fecha debe ser futura', (value) => {
      if (!value) return false;
      const selectedDate = parseISO(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return isAfter(selectedDate, today) || selectedDate.getTime() === today.getTime();
    })
    .test('max-advance', 'No se pueden programar citas con más de 6 meses de anticipación', (value) => {
      if (!value) return false;
      const selectedDate = parseISO(value);
      const maxDate = addMonths(new Date(), 6);
      return isBefore(selectedDate, maxDate);
    }),

  horaInicio: yup
    .string()
    .required('La hora de inicio es requerida')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato de hora inválido (HH:mm)'),

  dentistaId: yup
    .string()
    .required('Debe seleccionar un dentista'),

  consultorioId: yup
    .string()
    .required('Debe seleccionar un consultorio')
});

export const servicesStepSchema = yup.object().shape({
  servicios: yup
    .array()
    .min(1, 'Debe seleccionar al menos un servicio')
    .of(yup.object().shape({
      id: yup.string().required(),
      servicio: yup.string().required(),
      duracion: yup.number().min(1).required(),
      costo: yup.number().min(0).required()
    }))
});

export const reviewStepSchema = yup.object().shape({
  observaciones: yup
    .string()
    .max(1000, 'Las observaciones no pueden exceder 1000 caracteres')
});

// Esquema de validación principal para citas
export const appointmentValidationSchema = yup.object().shape({
  // Información básica
  fecha: yup
    .string()
    .required('La fecha es requerida')
    .test('future-date', 'La fecha debe ser futura', (value) => {
      if (!value) return false;
      const selectedDate = parseISO(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return isAfter(selectedDate, today) || selectedDate.getTime() === today.getTime();
    })
    .test('max-advance', 'No se pueden programar citas con más de 6 meses de anticipación', (value) => {
      if (!value) return false;
      const selectedDate = parseISO(value);
      const maxDate = addMonths(new Date(), 6);
      return isBefore(selectedDate, maxDate);
    }),

  horaInicio: yup
    .string()
    .required('La hora de inicio es requerida')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato de hora inválido (HH:mm)'),

  duracion: yup
    .number()
    .required('La duración es requerida')
    .min(15, 'Duración mínima de 15 minutos')
    .max(480, 'Duración máxima de 8 horas')
    .test('multiple-of-15', 'La duración debe ser múltiplo de 15 minutos', (value) => {
      return value % 15 === 0;
    }),

  // Relaciones requeridas
  pacienteId: yup
    .string()
    .required('Debe seleccionar un paciente'),

  dentistaId: yup
    .string()
    .required('Debe seleccionar un dentista'),

  consultorioId: yup
    .string()
    .required('Debe seleccionar un consultorio'),

  // Información de la cita
  tipoConsulta: yup
    .string()
    .required('Debe seleccionar el tipo de consulta')
    .oneOf(['primera_vez', 'control', 'tratamiento', 'emergencia', 'seguimiento']),

  prioridad: yup
    .string()
    .required('Debe seleccionar la prioridad')
    .oneOf(['baja', 'normal', 'alta', 'urgente']),

  motivo: yup
    .string()
    .required('El motivo de la consulta es requerido')
    .min(10, 'El motivo debe tener al menos 10 caracteres')
    .max(500, 'El motivo no puede exceder 500 caracteres'),

  observaciones: yup
    .string()
    .max(1000, 'Las observaciones no pueden exceder 1000 caracteres'),

  // Validaciones condicionales
  servicios: yup
    .array()
    .min(1, 'Debe seleccionar al menos un servicio')
    .of(yup.object().shape({
      id: yup.string().required(),
      servicio: yup.string().required(),
      duracion: yup.number().min(1).required(),
      costo: yup.number().min(0).required()
    }))
});

// Esquema para reagendamiento
export const rescheduleValidationSchema = yup.object().shape({
  nuevaFecha: yup
    .string()
    .required('La nueva fecha es requerida')
    .test('future-date', 'La nueva fecha debe ser futura', (value) => {
      if (!value) return false;
      const selectedDate = parseISO(value);
      const now = new Date();
      return isAfter(selectedDate, now);
    }),

  nuevaHora: yup
    .string()
    .required('La nueva hora es requerida')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato de hora inválido'),

  motivo: yup
    .string()
    .required('El motivo del reagendamiento es requerido')
    .min(10, 'El motivo debe tener al menos 10 caracteres')
    .max(200, 'El motivo no puede exceder 200 caracteres'),

  solicitadoPor: yup
    .string()
    .required('Debe especificar quién solicita el reagendamiento')
    .oneOf(['paciente', 'dentista', 'admin', 'sistema'])
});

// Esquema para cancelación
export const cancellationValidationSchema = yup.object().shape({
  motivo: yup
    .string()
    .required('El motivo de cancelación es requerido')
    .min(10, 'El motivo debe tener al menos 10 caracteres')
    .max(200, 'El motivo no puede exceder 200 caracteres'),

  categoria: yup
    .string()
    .required('Debe seleccionar la categoría de cancelación')
    .oneOf(['paciente', 'dentista', 'emergencia', 'sistema']),

  solicitadoPor: yup
    .string()
    .required('Debe especificar quién solicita la cancelación'),

  aceptaTerminos: yup
    .boolean()
    .oneOf([true], 'Debe aceptar los términos y condiciones de cancelación')
});

// Esquema para check-in
export const checkInValidationSchema = yup.object().shape({
  temperaturaCorpral: yup
    .number()
    .min(35, 'Temperatura muy baja')
    .max(42, 'Temperatura muy alta'),

  sintomas: yup
    .array()
    .of(yup.string()),

  acompañantes: yup
    .array()
    .of(yup.string()),

  documentosVerificados: yup
    .boolean()
    .oneOf([true], 'Debe verificar los documentos del paciente'),

  seguroVerificado: yup
    .boolean(),

  consentimientoTratamiento: yup
    .boolean()
    .oneOf([true], 'Debe obtener el consentimiento para el tratamiento')
});

// Esquema para notas de tratamiento
export const treatmentNotesValidationSchema = yup.object().shape({
  procedimientos: yup
    .array()
    .min(1, 'Debe registrar al menos un procedimiento')
    .of(yup.object().shape({
      procedimiento: yup.string().required('Nombre del procedimiento requerido'),
      diente: yup.string(),
      superficie: yup.string(),
      horaInicio: yup.string().required('Hora de inicio requerida'),
      horaFin: yup.string().required('Hora de fin requerida'),
      exito: yup.boolean().required(),
      notas: yup.string().required('Notas del procedimiento requeridas')
    })),

  materialesUtilizados: yup
    .array()
    .of(yup.object().shape({
      material: yup.string().required(),
      cantidad: yup.number().min(1).required(),
      lote: yup.string(),
      vencimiento: yup.string()
    })),

  resultados: yup
    .string()
    .required('Debe describir los resultados del tratamiento')
    .min(20, 'Los resultados deben tener al menos 20 caracteres'),

  proximosParos: yup
    .string()
    .max(500, 'Los próximos pasos no pueden exceder 500 caracteres'),

  complicaciones: yup
    .string()
    .max(500, 'La descripción de complicaciones no puede exceder 500 caracteres')
});

// Esquema para seguimiento
export const followUpValidationSchema = yup.object().shape({
  tipo: yup
    .string()
    .required('Debe seleccionar el tipo de seguimiento')
    .oneOf(['llamada', 'mensaje', 'cita', 'email']),

  programadoPara: yup
    .string()
    .required('Debe programar la fecha de seguimiento')
    .test('future-date', 'La fecha de seguimiento debe ser futura', (value) => {
      if (!value) return false;
      const followUpDate = parseISO(value);
      const now = new Date();
      return isAfter(followUpDate, now);
    }),

  notas: yup
    .string()
    .max(500, 'Las notas no pueden exceder 500 caracteres'),

  recordatorios: yup
    .array()
    .of(yup.object().shape({
      tipo: yup.string().oneOf(['email', 'sms', 'whatsapp', 'push']),
      tiempoAntes: yup.number().min(1).max(168) // 1 hora a 1 semana
    }))
});

// Validadores de negocio personalizados
export const businessRuleValidators = {
  // Validar que no haya conflictos de horario
  validateTimeConflicts: async (appointmentData, existingAppointments) => {
    const conflicts = [];
    
    existingAppointments.forEach(existing => {
      if (existing.fecha === appointmentData.fecha) {
        // Verificar solapamiento de horarios
        const newStart = parseISO(`${appointmentData.fecha}T${appointmentData.horaInicio}`);
        const newEnd = parseISO(`${appointmentData.fecha}T${appointmentData.horaFin}`);
        const existingStart = parseISO(`${existing.fecha}T${existing.horaInicio}`);
        const existingEnd = parseISO(`${existing.fecha}T${existing.horaFin}`);
        
        if (newStart < existingEnd && existingStart < newEnd) {
          conflicts.push({
            type: 'TIME_OVERLAP',
            message: 'Conflicto de horario detectado',
            conflictingAppointment: existing
          });
        }
      }
    });
    
    return {
      valid: conflicts.length === 0,
      conflicts
    };
  },

  // Validar capacidad del consultorio
  validateClinicCapacity: async (consultorioId, fecha, hora) => {
    // Implementar lógica de validación de capacidad
    // Por ahora retornamos válido
    return {
      valid: true,
      capacity: {
        current: 1,
        maximum: 10
      }
    };
  },

  // Validar disponibilidad del dentista
  validateDentistAvailability: async (dentistaId, fecha, horaInicio, duracion) => {
    // Implementar lógica de validación de disponibilidad
    // Por ahora retornamos válido
    return {
      valid: true,
      schedule: {
        available: true,
        workingHours: {
          start: '08:00',
          end: '18:00'
        }
      }
    };
  },

  // Validar elegibilidad del paciente
  validatePatientEligibility: async (pacienteId, servicios) => {
    // Implementar lógica de validación de elegibilidad
    // Verificar historial médico, alergias, etc.
    return {
      valid: true,
      eligibility: {
        medicalClearance: true,
        insuranceCoverage: true,
        allergies: []
      }
    };
  },

  // Validar políticas de reagendamiento
  validateReschedulePolicy: async (appointmentId, newDateTime, reason) => {
    // Implementar lógica de políticas de reagendamiento
    return {
      valid: true,
      policy: {
        allowed: true,
        charges: 0,
        restrictions: []
      }
    };
  },

  // Validar políticas de cancelación
  validateCancellationPolicy: async (appointmentId, reason, requestedBy) => {
    // Implementar lógica de políticas de cancelación
    return {
      valid: true,
      policy: {
        allowed: true,
        refundAmount: 0,
        penalties: 0
      }
    };
  }
};

// Validador compuesto para crear citas
export const validateAppointmentCreation = async (appointmentData, context = {}) => {
  const errors = [];
  
  try {
    // Validación de esquema básico
    await appointmentValidationSchema.validate(appointmentData, { abortEarly: false });
  } catch (validationError) {
    errors.push(...validationError.errors.map(error => ({
      type: 'VALIDATION_ERROR',
      message: error,
      field: validationError.path
    })));
  }
  
  // Validaciones de negocio
  if (context.existingAppointments) {
    const conflictValidation = await businessRuleValidators.validateTimeConflicts(
      appointmentData, 
      context.existingAppointments
    );
    
    if (!conflictValidation.valid) {
      errors.push(...conflictValidation.conflicts);
    }
  }
  
  // Validar disponibilidad del dentista
  const dentistValidation = await businessRuleValidators.validateDentistAvailability(
    appointmentData.dentistaId,
    appointmentData.fecha,
    appointmentData.horaInicio,
    appointmentData.duracion
  );
  
  if (!dentistValidation.valid) {
    errors.push({
      type: 'DENTIST_UNAVAILABLE',
      message: 'El dentista no está disponible en el horario seleccionado'
    });
  }
  
  // Validar capacidad del consultorio
  const capacityValidation = await businessRuleValidators.validateClinicCapacity(
    appointmentData.consultorioId,
    appointmentData.fecha,
    appointmentData.horaInicio
  );
  
  if (!capacityValidation.valid) {
    errors.push({
      type: 'CLINIC_AT_CAPACITY',
      message: 'El consultorio ha alcanzado su capacidad máxima'
    });
  }
  
  // Validar elegibilidad del paciente
  const eligibilityValidation = await businessRuleValidators.validatePatientEligibility(
    appointmentData.pacienteId,
    appointmentData.servicios
  );
  
  if (!eligibilityValidation.valid) {
    errors.push({
      type: 'PATIENT_NOT_ELIGIBLE',
      message: 'El paciente no es elegible para los servicios seleccionados'
    });
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

// Validador para actualización de citas
export const validateAppointmentUpdate = async (appointmentId, updateData, context = {}) => {
  const errors = [];
  
  // Validaciones específicas para actualización
  if (updateData.estado && context.currentAppointment) {
    const validTransitions = getValidStatusTransitions(context.currentAppointment.estado);
    
    if (!validTransitions.includes(updateData.estado)) {
      errors.push({
        type: 'INVALID_STATUS_TRANSITION',
        message: `No se puede cambiar de ${context.currentAppointment.estado} a ${updateData.estado}`
      });
    }
  }
  
  // Si se cambia fecha/hora, validar conflictos
  if (updateData.fecha || updateData.horaInicio) {
    const appointmentData = {
      ...context.currentAppointment,
      ...updateData
    };
    
    const conflictValidation = await businessRuleValidators.validateTimeConflicts(
      appointmentData,
      context.existingAppointments?.filter(a => a.id !== appointmentId) || []
    );
    
    if (!conflictValidation.valid) {
      errors.push(...conflictValidation.conflicts);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

// Obtener transiciones de estado válidas
export const getValidStatusTransitions = (currentStatus) => {
  const transitions = {
    programada: ['confirmada', 'reagendada', 'cancelada'],
    confirmada: ['en_sala_espera', 'no_show', 'reagendada', 'cancelada'],
    en_sala_espera: ['en_consulta', 'cancelada'],
    en_consulta: ['completada', 'en_pausa', 'requiere_seguimiento'],
    en_pausa: ['en_consulta', 'reagendada'],
    completada: ['requiere_seguimiento'],
    no_show: ['reagendada', 'cancelada'],
    reagendada: ['programada', 'cancelada'],
    cancelada: [], // Estado final
    requiere_seguimiento: ['completada'] // Después del seguimiento
  };
  
  return transitions[currentStatus] || [];
};