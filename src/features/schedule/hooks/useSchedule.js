import { useCallback, useEffect } from 'react';
import { useScheduleContext } from '../store/scheduleContext';
import { scheduleApi } from '../services/scheduleApi';
import { useLoading } from '../../../shared/hooks/useLoading';

export const useSchedule = () => {
  const {
    timeSlots,
    pagination,
    filters,
    loading,
    errors,
    stats,
    ui,
    conflicts,
    setTimeSlots,
    addTimeSlot,
    updateTimeSlot,
    removeTimeSlot,
    bulkUpdateTimeSlots,
    setStats,
    setLoading,
    setError,
    clearError,
    setPagination,
    setConflicts,
    addConflict
  } = useScheduleContext();
  
  const { withLoading, isLoading: isLoadingHook } = useLoading();

  // Cargar turnos
  const fetchTimeSlots = useCallback(async (customFilters = null, customPagination = null) => {
    const currentFilters = customFilters || filters;
    const currentPagination = customPagination || pagination;

    try {
      clearError('timeSlots');
      const response = await withLoading('fetch-timeslots', async () => {
        return await scheduleApi.getTimeSlots(currentFilters, currentPagination);
      });
      setTimeSlots(response.data, response.pagination);
    } catch (error) {
      setError('timeSlots', error.message);
    }
  }, [filters, pagination, setTimeSlots, setError, clearError, withLoading]);

  // Crear turno
  const createTimeSlot = useCallback(async (slotData) => {
    try {
      clearError('create');
      
      // Detectar conflictos antes de crear
      const conflicts = await withLoading('detect-conflicts', async () => {
        return await scheduleApi.detectTimeConflicts(slotData);
      });

      if (conflicts.length > 0) {
        setConflicts(conflicts);
        throw new Error('Se detectaron conflictos de horarios');
      }

      const newSlot = await withLoading('create-timeslot', async () => {
        return await scheduleApi.createTimeSlot(slotData);
      });
      
      addTimeSlot(newSlot);
      
      // Recargar estadísticas
      await fetchStats();
      
      return { success: true, data: newSlot };
    } catch (error) {
      setError('create', error.message);
      return { success: false, error: error.message };
    }
  }, [addTimeSlot, setError, clearError, withLoading, setConflicts]);

  // Crear turnos masivos
  const bulkCreateTimeSlots = useCallback(async (slotsData) => {
    try {
      clearError('bulk');
      const result = await withLoading('bulk-create', async () => {
        return await scheduleApi.bulkCreateTimeSlots(slotsData);
      });
      
      // Agregar slots creados exitosamente
      result.results.forEach(slot => addTimeSlot(slot));
      
      // Recargar estadísticas
      await fetchStats();
      
      return { 
        success: true, 
        data: result,
        created: result.created,
        errors: result.errors
      };
    } catch (error) {
      setError('bulk', error.message);
      return { success: false, error: error.message };
    }
  }, [addTimeSlot, setError, clearError, withLoading]);

  // Actualizar turno
  const updateTimeSlotById = useCallback(async (id, slotData) => {
    try {
      clearError('update');
      
      // Detectar conflictos si se cambian horarios
      if (slotData.horaInicio || slotData.horaFin || slotData.fecha) {
        const conflicts = await withLoading('detect-conflicts', async () => {
          return await scheduleApi.detectTimeConflicts({ ...timeSlots.find(s => s.id === id), ...slotData });
        });

        if (conflicts.length > 0) {
          setConflicts(conflicts);
          throw new Error('Se detectaron conflictos de horarios');
        }
      }

      const updatedSlot = await withLoading('update-timeslot', async () => {
        return await scheduleApi.updateTimeSlot(id, slotData);
      });
      
      updateTimeSlot(updatedSlot);
      
      // Recargar estadísticas
      await fetchStats();
      
      return { success: true, data: updatedSlot };
    } catch (error) {
      setError('update', error.message);
      return { success: false, error: error.message };
    }
  }, [timeSlots, updateTimeSlot, setError, clearError, withLoading, setConflicts]);

  // Eliminar turno
  const deleteTimeSlot = useCallback(async (id) => {
    try {
      clearError('delete');
      await withLoading('delete-timeslot', async () => {
        return await scheduleApi.deleteTimeSlot(id);
      });
      
      removeTimeSlot(id);
      
      // Recargar estadísticas
      await fetchStats();
      
      return { success: true };
    } catch (error) {
      setError('delete', error.message);
      return { success: false, error: error.message };
    }
  }, [removeTimeSlot, setError, clearError, withLoading]);

  // Operaciones masivas
  const bulkUpdate = useCallback(async (ids, updates) => {
    try {
      clearError('bulk');
      
      // Validar que las actualizaciones no causen conflictos
      for (const id of ids) {
        if (updates.horaInicio || updates.horaFin || updates.fecha) {
          const slot = timeSlots.find(s => s.id === id);
          if (slot) {
            const conflicts = await scheduleApi.detectTimeConflicts({ ...slot, ...updates });
            if (conflicts.length > 0) {
              throw new Error(`Conflictos detectados para turno ${id}`);
            }
          }
        }
      }
      
      bulkUpdateTimeSlots(ids, updates);
      
      // Recargar estadísticas
      await fetchStats();
      
      return { success: true };
    } catch (error) {
      setError('bulk', error.message);
      return { success: false, error: error.message };
    }
  }, [timeSlots, bulkUpdateTimeSlots, setError, clearError]);

  // Cargar estadísticas
  const fetchStats = useCallback(async () => {
    try {
      clearError('stats');
      const statsData = await withLoading('fetch-stats', async () => {
        return await scheduleApi.getScheduleStats();
      });
      setStats(statsData);
    } catch (error) {
      setError('stats', error.message);
    }
  }, [setStats, setError, clearError, withLoading]);

  // Obtener disponibilidad
  const getAvailability = useCallback(async (criteria) => {
    try {
      clearError('availability');
      const availability = await withLoading('get-availability', async () => {
        return await scheduleApi.getAvailability(criteria);
      });
      return { success: true, data: availability };
    } catch (error) {
      setError('availability', error.message);
      return { success: false, error: error.message };
    }
  }, [setError, clearError, withLoading]);

  // Generar turnos recurrentes
  const generateRecurringSlots = useCallback(async (pattern) => {
    try {
      clearError('bulk');
      const result = await withLoading('generate-recurring', async () => {
        return await scheduleApi.generateRecurringSlots(pattern);
      });
      
      // Agregar slots generados
      result.slots.forEach(slot => addTimeSlot(slot));
      
      // Recargar estadísticas
      await fetchStats();
      
      return { success: true, data: result };
    } catch (error) {
      setError('bulk', error.message);
      return { success: false, error: error.message };
    }
  }, [addTimeSlot, setError, clearError, withLoading]);

  // Detectar conflictos
  const detectConflicts = useCallback(async (slotData) => {
    try {
      clearError('conflicts');
      const conflicts = await withLoading('detect-conflicts', async () => {
        return await scheduleApi.detectTimeConflicts(slotData);
      });
      
      if (conflicts.length > 0) {
        setConflicts(conflicts);
      }
      
      return { success: true, data: conflicts };
    } catch (error) {
      setError('conflicts', error.message);
      return { success: false, error: error.message };
    }
  }, [setConflicts, setError, clearError, withLoading]);

  // Cambiar página
  const changePage = useCallback((page) => {
    setPagination({ page });
    fetchTimeSlots(null, { ...pagination, page });
  }, [pagination, setPagination, fetchTimeSlots]);

  // Cambiar límite por página
  const changeLimit = useCallback((limit) => {
    setPagination({ page: 1, limit });
    fetchTimeSlots(null, { page: 1, limit });
  }, [setPagination, fetchTimeSlots]);

  // Efecto para cargar datos iniciales
  useEffect(() => {
    if (timeSlots.length === 0) {
      fetchTimeSlots();
      fetchStats();
    }
  }, []); // Solo al montar el componente

  return {
    // Datos
    timeSlots,
    pagination,
    filters,
    stats,
    ui,
    conflicts,
    
    // Estados
    loading: {
      timeSlots: isLoadingHook('fetch-timeslots'),
      create: isLoadingHook('create-timeslot'),
      update: isLoadingHook('update-timeslot'),
      delete: isLoadingHook('delete-timeslot'),
      bulk: isLoadingHook('bulk-create') || isLoadingHook('generate-recurring'),
      stats: isLoadingHook('fetch-stats'),
      availability: isLoadingHook('get-availability'),
      conflicts: isLoadingHook('detect-conflicts')
    },
    errors,
    
    // Acciones
    fetchTimeSlots,
    createTimeSlot,
    bulkCreateTimeSlots,
    updateTimeSlot: updateTimeSlotById,
    deleteTimeSlot,
    bulkUpdate,
    fetchStats,
    getAvailability,
    generateRecurringSlots,
    detectConflicts,
    changePage,
    changeLimit,
    
    // Utilidades
    isLoading: (key) => isLoadingHook(key),
    hasError: (key) => !!errors[key],
    getError: (key) => errors[key],
    hasConflicts: conflicts.length > 0,
    getConflictCount: () => conflicts.length
  };
};

export default useSchedule;