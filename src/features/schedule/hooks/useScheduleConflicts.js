import { useCallback } from 'react';
import { useScheduleContext } from '../store/scheduleContext';
import { scheduleApi } from '../services/scheduleApi';
import { conflictResolver } from '../services/conflictResolver';
import { useLoading } from '../../../shared/hooks/useLoading';

export const useScheduleConflicts = () => {
  const {
    conflicts,
    timeSlots,
    setConflicts,
    addConflict,
    removeConflict,
    setError,
    clearError
  } = useScheduleContext();
  
  const { withLoading, isLoading: isLoadingHook } = useLoading();

  // Detectar conflictos en tiempo real
  const detectConflicts = useCallback(async (scheduleData) => {
    try {
      clearError('conflicts');
      const detectedConflicts = await withLoading('detect-conflicts', async () => {
        return await scheduleApi.detectTimeConflicts(scheduleData);
      });
      
      setConflicts(detectedConflicts);
      return { success: true, data: detectedConflicts };
    } catch (error) {
      setError('conflicts', error.message);
      return { success: false, error: error.message };
    }
  }, [setConflicts, setError, clearError, withLoading]);

  // Obtener detalles de un conflicto específico
  const getConflictDetails = useCallback(async (conflictId) => {
    try {
      const conflict = conflicts.find(c => c.id === conflictId);
      if (!conflict) throw new Error('Conflicto no encontrado');
      
      // Enriquecer con información adicional
      const enrichedConflict = {
        ...conflict,
        affectedSlots: conflict.affectedSlots?.map(slotId => 
          timeSlots.find(s => s.id === slotId)
        ).filter(Boolean) || [],
        impactAssessment: await assessConflictImpact(conflict),
        resolutionComplexity: calculateResolutionComplexity(conflict)
      };
      
      return { success: true, data: enrichedConflict };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, [conflicts, timeSlots]);

  // Obtener sugerencias de resolución
  const getResolutionSuggestions = useCallback(async (conflictId) => {
    try {
      clearError('suggestions');
      
      const conflict = conflicts.find(c => c.id === conflictId);
      if (!conflict) throw new Error('Conflicto no encontrado');
      
      const suggestions = await withLoading('get-suggestions', async () => {
        return await conflictResolver.generateResolutionSuggestions(conflict);
      });
      
      // Ordenar por confianza y factibilidad
      const sortedSuggestions = suggestions.sort((a, b) => {
        const scoreA = (a.confidence || 0) * (a.feasibility || 0);
        const scoreB = (b.confidence || 0) * (b.feasibility || 0);
        return scoreB - scoreA;
      });
      
      return sortedSuggestions;
    } catch (error) {
      setError('suggestions', error.message);
      return [];
    }
  }, [conflicts, setError, clearError, withLoading]);

  // Resolver conflicto con una solución específica
  const resolveConflict = useCallback(async (conflictId, resolution) => {
    try {
      clearError('resolve');
      
      const result = await withLoading('resolve-conflict', async () => {
        return await conflictResolver.resolveConflict(conflictId, resolution);
      });
      
      if (result.success) {
        // Remover conflicto resuelto
        removeConflict(conflictId);
        
        // Actualizar slots afectados si es necesario
        if (result.updatedSlots) {
          result.updatedSlots.forEach(slot => {
            const existingSlot = timeSlots.find(s => s.id === slot.id);
            if (existingSlot) {
              // Actualizar slot en el contexto
              // updateTimeSlot(slot);
            }
          });
        }
      }
      
      return result;
    } catch (error) {
      setError('resolve', error.message);
      return { success: false, error: error.message };
    }
  }, [removeConflict, timeSlots, setError, clearError, withLoading]);

  // Validar resolución antes de aplicar
  const validateResolution = useCallback(async (resolution) => {
    try {
      const validation = await conflictResolver.validateResolution(resolution);
      return validation;
    } catch (error) {
      return { valid: false, errors: [error.message] };
    }
  }, []);

  // Resolver múltiples conflictos automáticamente
  const autoResolveConflicts = useCallback(async (conflictIds) => {
    try {
      clearError('auto-resolve');
      
      const results = await withLoading('auto-resolve', async () => {
        const resolutions = [];
        
        for (const conflictId of conflictIds) {
          const suggestions = await getResolutionSuggestions(conflictId);
          if (suggestions.length > 0) {
            const bestSuggestion = suggestions[0];
            const result = await resolveConflict(conflictId, bestSuggestion);
            resolutions.push({ conflictId, result });
          }
        }
        
        return resolutions;
      });
      
      const successful = results.filter(r => r.result.success).length;
      const failed = results.filter(r => !r.result.success).length;
      
      return {
        success: true,
        resolved: successful,
        failed,
        details: results
      };
    } catch (error) {
      setError('auto-resolve', error.message);
      return { success: false, error: error.message };
    }
  }, [getResolutionSuggestions, resolveConflict, setError, clearError, withLoading]);

  // Obtener historial de conflictos
  const getConflictHistory = useCallback(async (dateRange) => {
    try {
      // En una implementación real, esto consultaría el historial
      const mockHistory = [
        {
          id: 'hist-1',
          date: '2024-03-10',
          type: 'TIME_OVERLAP',
          resolved: true,
          resolutionTime: 15, // minutos
          impact: 'low'
        }
      ];
      
      return { success: true, data: mockHistory };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  // Configurar prevención de conflictos
  const preventConflicts = useCallback(async (rules) => {
    try {
      // Configurar reglas de prevención
      const preventionRules = {
        enableRealTimeValidation: true,
        autoResolveSimpleConflicts: true,
        notifyOnComplexConflicts: true,
        ...rules
      };
      
      // En una implementación real, esto configuraría el sistema
      console.log('Conflict prevention rules configured:', preventionRules);
      
      return { success: true, rules: preventionRules };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  return {
    // Datos
    conflicts,
    conflictCount: conflicts.length,
    hasConflicts: conflicts.length > 0,
    
    // Estados
    loading: {
      detect: isLoadingHook('detect-conflicts'),
      resolve: isLoadingHook('resolve-conflict'),
      suggestions: isLoadingHook('get-suggestions'),
      autoResolve: isLoadingHook('auto-resolve')
    },
    
    // Acciones
    detectConflicts,
    getConflictDetails,
    getResolutionSuggestions,
    resolveConflict,
    validateResolution,
    autoResolveConflicts,
    getConflictHistory,
    preventConflicts,
    
    // Utilidades
    isLoading: (key) => isLoadingHook(key),
    getConflictById: (id) => conflicts.find(c => c.id === id),
    getConflictsByType: (type) => conflicts.filter(c => c.type === type),
    getHighPriorityConflicts: () => conflicts.filter(c => c.priority === 'high'),
    canAutoResolve: (conflictId) => {
      const conflict = conflicts.find(c => c.id === conflictId);
      return conflict?.autoResolvable || false;
    }
  };
};

// Funciones auxiliares
const assessConflictImpact = async (conflict) => {
  // Evaluar el impacto del conflicto
  const impact = {
    level: 'medium',
    affectedAppointments: conflict.affectedSlots?.length || 0,
    estimatedResolutionTime: 30, // minutos
    businessImpact: 'medium',
    patientImpact: 'low'
  };
  
  if (conflict.type === 'TIME_OVERLAP') {
    impact.level = 'high';
    impact.businessImpact = 'high';
  }
  
  return impact;
};

const calculateResolutionComplexity = (conflict) => {
  let complexity = 1; // Base complexity
  
  // Aumentar complejidad por número de slots afectados
  complexity += (conflict.affectedSlots?.length || 0) * 0.5;
  
  // Aumentar complejidad por tipo de conflicto
  if (conflict.type === 'CAPACITY_EXCEEDED') complexity += 1;
  if (conflict.type === 'BUSINESS_RULE_VIOLATION') complexity += 2;
  
  return Math.min(5, complexity); // Cap at 5
};

export default useScheduleConflicts;