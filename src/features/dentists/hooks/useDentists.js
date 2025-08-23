import { useCallback, useEffect } from 'react';
import { useDentistContext } from '../store/dentistContext';
import { dentistApi } from '../services/dentistApi';
import { useLoading } from '../../../shared/hooks/useLoading';

export const useDentists = () => {
  const {
    dentists,
    pagination,
    filters,
    loading,
    errors,
    stats,
    ui,
    setDentists,
    addDentist,
    updateDentist,
    removeDentist,
    bulkUpdateDentists,
    setStats,
    setLoading,
    setError,
    clearError,
    setPagination
  } = useDentistContext();
  
  const { withLoading, isLoading: isLoadingHook } = useLoading();

  // Cargar dentistas
  const fetchDentists = useCallback(async (customFilters = null, customPagination = null) => {
    const currentFilters = customFilters || filters;
    const currentPagination = customPagination || pagination;

    try {
      clearError('dentists');
      const response = await withLoading('fetch-dentists', async () => {
        return await dentistApi.getDentists(currentFilters, currentPagination);
      });
      setDentists(response.data, response.pagination);
    } catch (error) {
      setError('dentists', error.message);
    }
  }, [filters, pagination, setDentists, setError, clearError, withLoading]);

  // Crear dentista
  const createDentist = useCallback(async (dentistData) => {
    try {
      clearError('create');
      const newDentist = await withLoading('create-dentist', async () => {
        return await dentistApi.createDentist(dentistData);
      });
      addDentist(newDentist);
      
      // Recargar estadísticas
      await fetchStats();
      
      return { success: true, data: newDentist };
    } catch (error) {
      setError('create', error.message);
      return { success: false, error: error.message };
    }
  }, [addDentist, setError, clearError, withLoading]);

  // Actualizar dentista
  const updateDentistById = useCallback(async (id, dentistData) => {
    try {
      clearError('update');
      const updatedDentist = await withLoading('update-dentist', async () => {
        return await dentistApi.updateDentist(id, dentistData);
      });
      updateDentist(updatedDentist);
      
      // Recargar estadísticas
      await fetchStats();
      
      return { success: true, data: updatedDentist };
    } catch (error) {
      setError('update', error.message);
      return { success: false, error: error.message };
    }
  }, [updateDentist, setError, clearError, withLoading]);

  // Eliminar dentista
  const deleteDentist = useCallback(async (id) => {
    try {
      clearError('delete');
      await withLoading('delete-dentist', async () => {
        return await dentistApi.deleteDentist(id);
      });
      removeDentist(id);
      
      // Recargar estadísticas
      await fetchStats();
      
      return { success: true };
    } catch (error) {
      setError('delete', error.message);
      return { success: false, error: error.message };
    }
  }, [removeDentist, setError, clearError, withLoading]);

  // Cambiar estado del dentista
  const toggleStatus = useCallback(async (id) => {
    try {
      clearError('update');
      const updatedDentist = await withLoading('toggle-status', async () => {
        return await dentistApi.toggleDentistStatus(id);
      });
      updateDentist(updatedDentist);
      
      return { success: true, data: updatedDentist };
    } catch (error) {
      setError('update', error.message);
      return { success: false, error: error.message };
    }
  }, [updateDentist, setError, clearError, withLoading]);

  // Aprobar dentista
  const approveDentist = useCallback(async (id) => {
    try {
      clearError('approve');
      const approvedDentist = await withLoading('approve-dentist', async () => {
        return await dentistApi.approveDentist(id);
      });
      updateDentist(approvedDentist);
      
      return { success: true, data: approvedDentist };
    } catch (error) {
      setError('approve', error.message);
      return { success: false, error: error.message };
    }
  }, [updateDentist, setError, clearError, withLoading]);

  // Operaciones masivas
  const bulkUpdate = useCallback(async (ids, updates) => {
    try {
      clearError('bulk');
      const result = await withLoading('bulk-update', async () => {
        return await dentistApi.bulkUpdateDentists(ids, updates);
      });
      
      bulkUpdateDentists(ids, updates);
      
      // Recargar estadísticas
      await fetchStats();
      
      return { success: true, data: result };
    } catch (error) {
      setError('bulk', error.message);
      return { success: false, error: error.message };
    }
  }, [bulkUpdateDentists, setError, clearError, withLoading]);

  // Cargar estadísticas
  const fetchStats = useCallback(async () => {
    try {
      clearError('stats');
      const statsData = await withLoading('fetch-stats', async () => {
        return await dentistApi.getDentistStats();
      });
      setStats(statsData);
    } catch (error) {
      setError('stats', error.message);
    }
  }, [setStats, setError, clearError, withLoading]);

  // Exportar dentistas
  const exportDentists = useCallback(async (customFilters = null) => {
    const currentFilters = customFilters || filters;
    
    try {
      clearError('export');
      const data = await withLoading('export-dentists', async () => {
        return await dentistApi.exportDentists(currentFilters);
      });
      
      // Crear CSV
      const headers = [
        'Nombres',
        'Apellidos',
        'DNI',
        'Email',
        'Teléfono',
        'Especialidad Principal',
        'Consultorio',
        'Años Experiencia',
        'Estado',
        'Verificado',
        'Aprobado',
        'Calificación',
        'Total Pacientes',
        'Fecha Ingreso'
      ];

      const csvContent = [
        headers.join(','),
        ...data.map(dentist => [
          `"${dentist.nombres}"`,
          `"${dentist.apellidos}"`,
          dentist.dni,
          dentist.email,
          dentist.celular,
          dentist.especialidades?.[0]?.nombre || 'Odontología General',
          dentist.consultorio?.nombre || 'N/A',
          dentist.añosExperiencia,
          dentist.activo ? 'Activo' : 'Inactivo',
          dentist.verificado ? 'Verificado' : 'Pendiente',
          dentist.aprobado ? 'Aprobado' : 'Pendiente',
          dentist.calificacionPromedio || 0,
          dentist.totalPacientes || 0,
          new Date(dentist.fechaIngreso).toLocaleDateString('es-PE')
        ].join(','))
      ].join('\n');

      // Descargar archivo
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `dentistas_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return { success: true };
    } catch (error) {
      setError('export', error.message);
      return { success: false, error: error.message };
    }
  }, [filters, setError, clearError, withLoading]);

  // Obtener sugerencias de búsqueda
  const getSearchSuggestions = useCallback(async (query) => {
    if (!query || query.length < 2) return [];
    
    try {
      const suggestions = await dentistApi.getSearchSuggestions(query);
      return suggestions;
    } catch (error) {
      console.warn('Error obteniendo sugerencias:', error);
      return [];
    }
  }, []);

  // Cambiar página
  const changePage = useCallback((page) => {
    setPagination({ page });
    fetchDentists(null, { ...pagination, page });
  }, [pagination, setPagination, fetchDentists]);

  // Cambiar límite por página
  const changeLimit = useCallback((limit) => {
    setPagination({ page: 1, limit });
    fetchDentists(null, { page: 1, limit });
  }, [setPagination, fetchDentists]);

  // Efecto para cargar datos iniciales
  useEffect(() => {
    if (dentists.length === 0) {
      fetchDentists();
      fetchStats();
    }
  }, []); // Solo al montar el componente

  return {
    // Datos
    dentists,
    pagination,
    filters,
    stats,
    ui,
    
    // Estados
    loading: {
      dentists: isLoadingHook('fetch-dentists'),
      create: isLoadingHook('create-dentist'),
      update: isLoadingHook('update-dentist'),
      delete: isLoadingHook('delete-dentist'),
      bulk: isLoadingHook('bulk-update'),
      stats: isLoadingHook('fetch-stats'),
      export: isLoadingHook('export-dentists'),
      approve: isLoadingHook('approve-dentist'),
      toggle: isLoadingHook('toggle-status')
    },
    errors,
    
    // Acciones
    fetchDentists,
    createDentist,
    updateDentist: updateDentistById,
    deleteDentist,
    toggleStatus,
    approveDentist,
    bulkUpdate,
    fetchStats,
    exportDentists,
    getSearchSuggestions,
    changePage,
    changeLimit,
    
    // Utilidades
    isLoading: (key) => isLoadingHook(key),
    hasError: (key) => !!errors[key],
    getError: (key) => errors[key]
  };
};

export default useDentists;