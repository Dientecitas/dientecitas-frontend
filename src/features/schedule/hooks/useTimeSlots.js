import { useCallback, useState } from 'react';
import { useScheduleContext } from '../store/scheduleContext';
import { scheduleApi } from '../services/scheduleApi';
import { useLoading } from '../../../shared/hooks/useLoading';

export const useTimeSlots = () => {
  const {
    timeSlots,
    setTimeSlots,
    addTimeSlot,
    updateTimeSlot,
    removeTimeSlot,
    setError,
    clearError
  } = useScheduleContext();
  
  const { withLoading, isLoading: isLoadingHook } = useLoading();
  const [temporalReservations, setTemporalReservations] = useState(new Map());

  // Obtener slots disponibles con criterios específicos
  const getAvailableSlots = useCallback(async (criteria) => {
    try {
      clearError('availability');
      const response = await withLoading('get-available-slots', async () => {
        return await scheduleApi.getAvailability(criteria);
      });
      return { success: true, data: response };
    } catch (error) {
      setError('availability', error.message);
      return { success: false, error: error.message };
    }
  }, [setError, clearError, withLoading]);

  // Reservar slot temporalmente
  const reserveSlot = useCallback(async (slotId, duration = 15) => {
    try {
      clearError('reserve');
      
      // Verificar disponibilidad actual
      const slot = timeSlots.find(s => s.id === slotId);
      if (!slot || slot.estado !== 'disponible') {
        throw new Error('Slot no disponible');
      }
      
      if (slot.citasActuales >= slot.capacidadMaxima) {
        throw new Error('Capacidad máxima alcanzada');
      }

      // Crear reserva temporal
      const reservationId = `temp-${Date.now()}`;
      const expiresAt = new Date(Date.now() + (duration * 60 * 1000));
      
      const reservation = {
        id: reservationId,
        slotId,
        expiresAt,
        createdAt: new Date()
      };
      
      // Guardar reserva temporal
      setTemporalReservations(prev => new Map(prev.set(reservationId, reservation)));
      
      // Actualizar slot
      const updatedSlot = {
        ...slot,
        estado: 'reservado',
        reservadoHasta: expiresAt.toISOString()
      };
      
      updateTimeSlot(updatedSlot);
      
      // Auto-liberar después del tiempo especificado
      setTimeout(() => {
        releaseSlot(reservationId);
      }, duration * 60 * 1000);
      
      return { 
        success: true, 
        reservationId,
        expiresAt: expiresAt.toISOString()
      };
    } catch (error) {
      setError('reserve', error.message);
      return { success: false, error: error.message };
    }
  }, [timeSlots, updateTimeSlot, setError, clearError]);

  // Liberar slot reservado temporalmente
  const releaseSlot = useCallback((reservationId) => {
    const reservation = temporalReservations.get(reservationId);
    if (!reservation) return;

    const slot = timeSlots.find(s => s.id === reservation.slotId);
    if (slot && slot.estado === 'reservado') {
      const updatedSlot = {
        ...slot,
        estado: 'disponible',
        reservadoHasta: null
      };
      
      updateTimeSlot(updatedSlot);
    }
    
    // Remover reserva temporal
    setTemporalReservations(prev => {
      const newMap = new Map(prev);
      newMap.delete(reservationId);
      return newMap;
    });
  }, [timeSlots, temporalReservations, updateTimeSlot]);

  // Verificar disponibilidad en tiempo real
  const checkSlotAvailability = useCallback(async (slotId) => {
    try {
      const response = await scheduleApi.getTimeSlotById(slotId);
      const slot = response;
      
      return {
        available: slot.estado === 'disponible' && slot.citasActuales < slot.capacidadMaxima,
        slot,
        capacityRemaining: slot.capacidadMaxima - slot.citasActuales,
        nextAvailable: slot.estado !== 'disponible' ? await findNextAvailableSlot(slot) : null
      };
    } catch (error) {
      return { available: false, error: error.message };
    }
  }, []);

  // Obtener recomendaciones de slots
  const getSlotRecommendations = useCallback(async (preferences) => {
    try {
      clearError('recommendations');
      
      // Filtrar slots disponibles
      const availableSlots = timeSlots.filter(slot => 
        slot.estado === 'disponible' && 
        slot.citasActuales < slot.capacidadMaxima
      );
      
      // Aplicar preferencias
      let recommendedSlots = availableSlots;
      
      if (preferences.dentistaId) {
        recommendedSlots = recommendedSlots.filter(slot => slot.dentistaId === preferences.dentistaId);
      }
      
      if (preferences.consultorioId) {
        recommendedSlots = recommendedSlots.filter(slot => slot.consultorioId === preferences.consultorioId);
      }
      
      if (preferences.tipoTurno) {
        recommendedSlots = recommendedSlots.filter(slot => 
          slot.serviciosPermitidos?.includes(preferences.tipoTurno)
        );
      }
      
      if (preferences.fechaPreferida) {
        recommendedSlots = recommendedSlots.filter(slot => slot.fecha === preferences.fechaPreferida);
      }
      
      if (preferences.horaPreferida) {
        recommendedSlots = recommendedSlots.filter(slot => 
          slot.horaInicio >= preferences.horaPreferida.inicio &&
          slot.horaFin <= preferences.horaPreferida.fin
        );
      }
      
      // Ordenar por puntuación de recomendación
      recommendedSlots.sort((a, b) => {
        const scoreA = calculateRecommendationScore(a, preferences);
        const scoreB = calculateRecommendationScore(b, preferences);
        return scoreB - scoreA;
      });
      
      return { 
        success: true, 
        recommendations: recommendedSlots.slice(0, 10),
        totalAvailable: availableSlots.length
      };
    } catch (error) {
      setError('recommendations', error.message);
      return { success: false, error: error.message };
    }
  }, [timeSlots, setError, clearError]);

  // Calcular pricing dinámico
  const calculateSlotPricing = useCallback(async (slotId) => {
    try {
      const slot = timeSlots.find(s => s.id === slotId);
      if (!slot) throw new Error('Slot no encontrado');
      
      const basePrice = slot.tarifaBase || 100;
      const demandFactor = (slot.puntuacionDemanda || 5) / 10;
      const capacityFactor = 1 - (slot.citasActuales / slot.capacidadMaxima) * 0.2;
      const timeFactor = calculateTimePricingFactor(slot.horaInicio);
      
      const finalPrice = basePrice * (1 + demandFactor * 0.3) * capacityFactor * timeFactor;
      
      return {
        basePrice,
        factors: {
          demand: demandFactor,
          capacity: capacityFactor,
          time: timeFactor
        },
        finalPrice: Math.round(finalPrice * 100) / 100
      };
    } catch (error) {
      return { error: error.message };
    }
  }, [timeSlots]);

  // Obtener conflictos de un slot específico
  const getSlotConflicts = useCallback(async (slotId) => {
    try {
      const slot = timeSlots.find(s => s.id === slotId);
      if (!slot) return [];
      
      const conflicts = [];
      
      // Buscar solapamientos con otros slots del mismo dentista
      const sameDate = timeSlots.filter(s => 
        s.dentistaId === slot.dentistaId && 
        s.fecha === slot.fecha && 
        s.id !== slot.id
      );
      
      sameDate.forEach(otherSlot => {
        if (hasTimeOverlap(slot, otherSlot)) {
          conflicts.push({
            type: 'TIME_OVERLAP',
            conflictingSlot: otherSlot,
            severity: 'high'
          });
        }
      });
      
      // Verificar capacidad del consultorio
      const sameTimeSlots = timeSlots.filter(s => 
        s.consultorioId === slot.consultorioId &&
        s.fecha === slot.fecha &&
        s.horaInicio === slot.horaInicio &&
        s.id !== slot.id
      );
      
      const totalCapacity = sameTimeSlots.reduce((sum, s) => sum + s.capacidadMaxima, 0) + slot.capacidadMaxima;
      const clinicCapacity = slot.consultorio?.capacidadConsultorios || 10;
      
      if (totalCapacity > clinicCapacity) {
        conflicts.push({
          type: 'CAPACITY_EXCEEDED',
          message: `Capacidad del consultorio excedida: ${totalCapacity}/${clinicCapacity}`,
          severity: 'medium'
        });
      }
      
      return conflicts;
    } catch (error) {
      console.error('Error getting slot conflicts:', error);
      return [];
    }
  }, [timeSlots]);

  // Limpiar reservas expiradas
  const cleanupExpiredReservations = useCallback(() => {
    const now = new Date();
    const expiredReservations = [];
    
    temporalReservations.forEach((reservation, id) => {
      if (reservation.expiresAt <= now) {
        expiredReservations.push(id);
      }
    });
    
    expiredReservations.forEach(id => {
      releaseSlot(id);
    });
  }, [temporalReservations, releaseSlot]);

  // Limpiar reservas expiradas cada minuto
  React.useEffect(() => {
    const interval = setInterval(cleanupExpiredReservations, 60000);
    return () => clearInterval(interval);
  }, [cleanupExpiredReservations]);

  return {
    // Datos
    timeSlots,
    temporalReservations: Array.from(temporalReservations.values()),
    
    // Estados
    loading: {
      availability: isLoadingHook('get-available-slots'),
      reserve: isLoadingHook('reserve-slot'),
      recommendations: isLoadingHook('get-recommendations')
    },
    
    // Acciones
    getAvailableSlots,
    reserveSlot,
    releaseSlot,
    checkSlotAvailability,
    getSlotRecommendations,
    calculateSlotPricing,
    getSlotConflicts,
    cleanupExpiredReservations,
    
    // Utilidades
    isLoading: (key) => isLoadingHook(key),
    hasTemporalReservations: temporalReservations.size > 0,
    getReservationById: (id) => temporalReservations.get(id)
  };
};

// Funciones auxiliares
const findNextAvailableSlot = async (currentSlot) => {
  // Implementación simplificada
  return null;
};

const hasTimeOverlap = (slot1, slot2) => {
  const start1 = timeToMinutes(slot1.horaInicio);
  const end1 = timeToMinutes(slot1.horaFin);
  const start2 = timeToMinutes(slot2.horaInicio);
  const end2 = timeToMinutes(slot2.horaFin);

  return start1 < end2 && end1 > start2;
};

const timeToMinutes = (timeString) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

const calculateRecommendationScore = (slot, preferences) => {
  let score = 0;
  
  // Puntuación base por demanda
  score += (slot.puntuacionDemanda || 5) * 10;
  
  // Bonificar por capacidad disponible
  const availableCapacity = slot.capacidadMaxima - slot.citasActuales;
  score += availableCapacity * 5;
  
  // Bonificar por precio competitivo
  if (slot.precioFinal && slot.precioFinal <= (preferences.presupuestoMaximo || Infinity)) {
    score += 20;
  }
  
  // Penalizar por distancia temporal de preferencias
  if (preferences.horaPreferida) {
    const preferredHour = parseInt(preferences.horaPreferida.inicio.split(':')[0]);
    const slotHour = parseInt(slot.horaInicio.split(':')[0]);
    const hourDiff = Math.abs(preferredHour - slotHour);
    score -= hourDiff * 2;
  }
  
  return Math.max(0, score);
};

const calculateTimePricingFactor = (horaInicio) => {
  const hour = parseInt(horaInicio.split(':')[0]);
  
  // Horarios premium
  if ((hour >= 8 && hour <= 10) || (hour >= 16 && hour <= 18)) {
    return 1.1;
  }
  
  // Horarios normales
  if (hour >= 11 && hour <= 15) {
    return 1.0;
  }
  
  // Horarios con descuento
  return 0.9;
};

export default useTimeSlots;