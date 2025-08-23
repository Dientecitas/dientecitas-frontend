// Servicio avanzado de resolución de conflictos de horarios
export const conflictResolver = {
  // Generar sugerencias de resolución
  generateResolutionSuggestions: async (conflict) => {
    const suggestions = [];
    
    switch (conflict.type) {
      case 'TIME_OVERLAP':
        suggestions.push(...await generateTimeOverlapSuggestions(conflict));
        break;
      case 'CAPACITY_EXCEEDED':
        suggestions.push(...await generateCapacitySuggestions(conflict));
        break;
      case 'RESOURCE_CONFLICT':
        suggestions.push(...await generateResourceSuggestions(conflict));
        break;
      case 'BUSINESS_RULE_VIOLATION':
        suggestions.push(...await generateBusinessRuleSuggestions(conflict));
        break;
    }
    
    // Ordenar por confianza y factibilidad
    return suggestions.sort((a, b) => {
      const scoreA = (a.confidence || 0) * (a.feasibility || 0);
      const scoreB = (b.confidence || 0) * (b.feasibility || 0);
      return scoreB - scoreA;
    });
  },

  // Resolver conflicto automáticamente
  resolveConflict: async (conflictId, resolution) => {
    try {
      // Validar resolución
      const validation = await conflictResolver.validateResolution(resolution);
      if (!validation.valid) {
        throw new Error(`Resolución inválida: ${validation.errors.join(', ')}`);
      }

      // Aplicar resolución
      const result = await applyResolution(resolution);
      
      return {
        success: true,
        conflictId,
        resolution,
        result,
        appliedAt: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        conflictId,
        error: error.message
      };
    }
  },

  // Validar resolución antes de aplicar
  validateResolution: async (resolution) => {
    const errors = [];
    
    // Validaciones básicas
    if (!resolution.action) {
      errors.push('Acción de resolución requerida');
    }
    
    if (!resolution.affectedSlots || resolution.affectedSlots.length === 0) {
      errors.push('Slots afectados requeridos');
    }
    
    // Validaciones específicas por tipo de acción
    switch (resolution.action) {
      case 'MOVE_SLOT':
        if (!resolution.newTime) {
          errors.push('Nueva hora requerida para mover slot');
        }
        break;
      case 'ADJUST_CAPACITY':
        if (!resolution.newCapacity || resolution.newCapacity < 1) {
          errors.push('Nueva capacidad válida requerida');
        }
        break;
      case 'SPLIT_SLOT':
        if (!resolution.splitPoints || resolution.splitPoints.length === 0) {
          errors.push('Puntos de división requeridos');
        }
        break;
    }
    
    return {
      valid: errors.length === 0,
      errors,
      warnings: generateResolutionWarnings(resolution)
    };
  }
};

// Generadores de sugerencias específicas
const generateTimeOverlapSuggestions = async (conflict) => {
  const suggestions = [];
  const { affectedSlots } = conflict;
  
  if (!affectedSlots || affectedSlots.length < 2) return suggestions;
  
  // Sugerencia 1: Mover uno de los slots
  suggestions.push({
    id: 'move-slot-1',
    title: 'Mover primer turno',
    description: 'Mover el primer turno a un horario disponible adyacente',
    action: 'MOVE_SLOT',
    affectedSlots: [affectedSlots[0].id],
    newTime: await findNextAvailableTime(affectedSlots[0]),
    confidence: 0.8,
    feasibility: 0.9,
    impact: {
      level: 'low',
      timeRequired: '5 minutos',
      cost: 'Ninguno'
    }
  });
  
  // Sugerencia 2: Ajustar duración
  suggestions.push({
    id: 'adjust-duration',
    title: 'Ajustar duración de turnos',
    description: 'Reducir la duración de ambos turnos para eliminar solapamiento',
    action: 'ADJUST_DURATION',
    affectedSlots: affectedSlots.map(s => s.id),
    newDurations: calculateAdjustedDurations(affectedSlots),
    confidence: 0.7,
    feasibility: 0.8,
    impact: {
      level: 'medium',
      timeRequired: '10 minutos',
      cost: 'Posible reducción de ingresos'
    }
  });
  
  // Sugerencia 3: Dividir slot largo
  if (affectedSlots.some(s => s.duracion > 60)) {
    suggestions.push({
      id: 'split-long-slot',
      title: 'Dividir turno largo',
      description: 'Dividir el turno más largo en múltiples turnos menores',
      action: 'SPLIT_SLOT',
      affectedSlots: [affectedSlots.find(s => s.duracion > 60).id],
      splitPoints: calculateOptimalSplitPoints(affectedSlots.find(s => s.duracion > 60)),
      confidence: 0.6,
      feasibility: 0.7,
      impact: {
        level: 'medium',
        timeRequired: '15 minutos',
        cost: 'Reorganización de citas'
      }
    });
  }
  
  return suggestions;
};

const generateCapacitySuggestions = async (conflict) => {
  const suggestions = [];
  
  // Sugerencia 1: Aumentar capacidad
  suggestions.push({
    id: 'increase-capacity',
    title: 'Aumentar capacidad del turno',
    description: 'Incrementar la capacidad máxima para acomodar más citas',
    action: 'ADJUST_CAPACITY',
    newCapacity: conflict.requiredCapacity,
    confidence: 0.9,
    feasibility: 0.8,
    impact: {
      level: 'low',
      timeRequired: '2 minutos',
      cost: 'Posible sobrecarga del dentista'
    }
  });
  
  // Sugerencia 2: Crear turno adicional
  suggestions.push({
    id: 'create-additional-slot',
    title: 'Crear turno adicional',
    description: 'Crear un nuevo turno en horario adyacente',
    action: 'CREATE_ADDITIONAL_SLOT',
    suggestedTime: await findAdjacentAvailableTime(conflict.affectedSlots[0]),
    confidence: 0.7,
    feasibility: 0.9,
    impact: {
      level: 'low',
      timeRequired: '5 minutos',
      cost: 'Recursos adicionales'
    }
  });
  
  return suggestions;
};

const generateResourceSuggestions = async (conflict) => {
  const suggestions = [];
  
  // Sugerencia 1: Reasignar consultorio
  suggestions.push({
    id: 'reassign-clinic',
    title: 'Reasignar consultorio',
    description: 'Mover el turno a un consultorio con disponibilidad',
    action: 'REASSIGN_RESOURCE',
    newResource: await findAvailableClinic(conflict.timeSlot),
    confidence: 0.8,
    feasibility: 0.7,
    impact: {
      level: 'medium',
      timeRequired: '10 minutos',
      cost: 'Posible inconveniente para pacientes'
    }
  });
  
  return suggestions;
};

const generateBusinessRuleSuggestions = async (conflict) => {
  const suggestions = [];
  
  // Sugerencia 1: Ajustar configuración
  suggestions.push({
    id: 'adjust-configuration',
    title: 'Ajustar configuración del turno',
    description: 'Modificar la configuración para cumplir con las reglas de negocio',
    action: 'ADJUST_CONFIGURATION',
    newConfiguration: generateCompliantConfiguration(conflict),
    confidence: 0.9,
    feasibility: 0.9,
    impact: {
      level: 'low',
      timeRequired: '3 minutos',
      cost: 'Ninguno'
    }
  });
  
  return suggestions;
};

// Funciones auxiliares
const findNextAvailableTime = async (slot) => {
  // Buscar próximo horario disponible
  const currentTime = timeToMinutes(slot.horaInicio);
  const duration = slot.duracion;
  
  // Buscar en intervalos de 15 minutos
  for (let offset = 15; offset <= 240; offset += 15) {
    const newStartTime = minutesToTime(currentTime + offset);
    const newEndTime = minutesToTime(currentTime + offset + duration);
    
    // Verificar si el nuevo horario está disponible
    const isAvailable = await checkTimeAvailability(slot.dentistaId, slot.fecha, newStartTime, newEndTime);
    if (isAvailable) {
      return { horaInicio: newStartTime, horaFin: newEndTime };
    }
  }
  
  return null;
};

const calculateAdjustedDurations = (slots) => {
  // Calcular duraciones ajustadas para eliminar solapamiento
  const adjustments = {};
  
  slots.forEach(slot => {
    const minDuration = 15; // Duración mínima
    const maxReduction = slot.duracion - minDuration;
    const suggestedReduction = Math.min(15, maxReduction);
    
    adjustments[slot.id] = slot.duracion - suggestedReduction;
  });
  
  return adjustments;
};

const calculateOptimalSplitPoints = (slot) => {
  const duration = slot.duracion;
  const minSlotDuration = 30;
  
  if (duration < minSlotDuration * 2) return [];
  
  // Dividir en slots de duración óptima
  const numSlots = Math.floor(duration / minSlotDuration);
  const slotDuration = Math.floor(duration / numSlots);
  
  const splitPoints = [];
  for (let i = 1; i < numSlots; i++) {
    const splitTime = timeToMinutes(slot.horaInicio) + (slotDuration * i);
    splitPoints.push(minutesToTime(splitTime));
  }
  
  return splitPoints;
};

const findAdjacentAvailableTime = async (slot) => {
  // Buscar horario adyacente disponible
  const slotEnd = timeToMinutes(slot.horaFin);
  const newStartTime = minutesToTime(slotEnd + 15); // 15 min después
  const newEndTime = minutesToTime(slotEnd + 15 + slot.duracion);
  
  return { horaInicio: newStartTime, horaFin: newEndTime };
};

const findAvailableClinic = async (timeSlot) => {
  // En una implementación real, buscaría consultorios disponibles
  return {
    id: 'clinic-alt',
    nombre: 'Consultorio Alternativo',
    disponible: true
  };
};

const generateCompliantConfiguration = (conflict) => {
  // Generar configuración que cumpla con reglas de negocio
  return {
    permiteCancelacion: true,
    tiempoCancelacion: 24,
    confirmacionRequerida: false,
    capacidadMaxima: 1
  };
};

const applyResolution = async (resolution) => {
  // Aplicar la resolución seleccionada
  switch (resolution.action) {
    case 'MOVE_SLOT':
      return await moveSlot(resolution);
    case 'ADJUST_CAPACITY':
      return await adjustCapacity(resolution);
    case 'ADJUST_DURATION':
      return await adjustDuration(resolution);
    case 'SPLIT_SLOT':
      return await splitSlot(resolution);
    case 'CREATE_ADDITIONAL_SLOT':
      return await createAdditionalSlot(resolution);
    default:
      throw new Error(`Acción de resolución no soportada: ${resolution.action}`);
  }
};

const moveSlot = async (resolution) => {
  // Implementar movimiento de slot
  return {
    action: 'MOVE_SLOT',
    success: true,
    changes: [`Slot movido a ${resolution.newTime.horaInicio}`]
  };
};

const adjustCapacity = async (resolution) => {
  // Implementar ajuste de capacidad
  return {
    action: 'ADJUST_CAPACITY',
    success: true,
    changes: [`Capacidad ajustada a ${resolution.newCapacity}`]
  };
};

const adjustDuration = async (resolution) => {
  // Implementar ajuste de duración
  return {
    action: 'ADJUST_DURATION',
    success: true,
    changes: Object.entries(resolution.newDurations).map(([slotId, duration]) => 
      `Slot ${slotId} ajustado a ${duration} minutos`
    )
  };
};

const splitSlot = async (resolution) => {
  // Implementar división de slot
  return {
    action: 'SPLIT_SLOT',
    success: true,
    changes: [`Slot dividido en ${resolution.splitPoints.length + 1} turnos`]
  };
};

const createAdditionalSlot = async (resolution) => {
  // Implementar creación de slot adicional
  return {
    action: 'CREATE_ADDITIONAL_SLOT',
    success: true,
    changes: [`Nuevo slot creado en ${resolution.suggestedTime.horaInicio}`]
  };
};

// Funciones auxiliares
const timeToMinutes = (timeString) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

const checkTimeAvailability = async (dentistaId, fecha, horaInicio, horaFin) => {
  // En una implementación real, verificaría disponibilidad en la base de datos
  return Math.random() > 0.3; // 70% de probabilidad de estar disponible
};

const generateResolutionWarnings = (resolution) => {
  const warnings = [];
  
  if (resolution.action === 'MOVE_SLOT' && resolution.impact?.level === 'high') {
    warnings.push('Mover este turno puede afectar citas ya programadas');
  }
  
  if (resolution.action === 'ADJUST_CAPACITY' && resolution.newCapacity > 5) {
    warnings.push('Alta capacidad puede sobrecargar al dentista');
  }
  
  return warnings;
};

export default conflictResolver;