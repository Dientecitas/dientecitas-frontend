import { useCallback, useEffect } from 'react';
import { useDistrictContext } from '../store/districtContext';
import { districtApi } from '../services/districtApi';
import { useLoading } from '../../../shared/hooks/useLoading';

export const useDistricts = () => {
  const {
    districts,
    pagination,
    filters,
    loading,
    errors,
    stats,
    setDistricts,
    addDistrict,
    updateDistrict,
    removeDistrict,
    setStats,
    setLoading,
    setError,
    clearError,
    setPagination
  } = useDistrictContext();
  
  const { withLoading, isLoading: isLoadingHook } = useLoading();

  // Cargar distritos
  const fetchDistricts = useCallback(async (customFilters = null, customPagination = null) => {
    const currentFilters = customFilters || filters;
    const currentPagination = customPagination || pagination;

    try {
      clearError('districts');
      const response = await withLoading('fetch-districts', async () => {
        return await districtApi.getDistricts(currentFilters, currentPagination);
      });
      setDistricts(response.data, response.pagination);
    } catch (error) {
      setError('districts', error.message);
    }
  }, [filters, pagination, setDistricts, setError, clearError, withLoading]);

  // Crear distrito
  const createDistrict = useCallback(async (districtData) => {
    try {
      clearError('create');
      const newDistrict = await withLoading('create-district', async () => {
        return await districtApi.createDistrict(districtData);
      });
      addDistrict(newDistrict);
      
      // Recargar estadísticas
      await fetchStats();
      
      return { success: true, data: newDistrict };
    } catch (error) {
      setError('create', error.message);
      return { success: false, error: error.message };
    }
  }, [addDistrict, setError, clearError, withLoading]);

  // Actualizar distrito
  const updateDistrictById = useCallback(async (id, districtData) => {
    try {
      clearError('update');
      const updatedDistrict = await withLoading('update-district', async () => {
        return await districtApi.updateDistrict(id, districtData);
      });
      updateDistrict(updatedDistrict);
      
      // Recargar estadísticas
      await fetchStats();
      
      return { success: true, data: updatedDistrict };
    } catch (error) {
      setError('update', error.message);
      return { success: false, error: error.message };
    }
  }, [updateDistrict, setError, clearError, withLoading]);

  // Eliminar distrito
  const deleteDistrict = useCallback(async (id) => {
    try {
      clearError('delete');
      await withLoading('delete-district', async () => {
        return await districtApi.deleteDistrict(id);
      });
      removeDistrict(id);
      
      // Recargar estadísticas
      await fetchStats();
      
      return { success: true };
    } catch (error) {
      setError('delete', error.message);
      return { success: false, error: error.message };
    }
  }, [removeDistrict, setError, clearError, withLoading]);

  // Cambiar estado del distrito
  const toggleStatus = useCallback(async (id) => {
    try {
      clearError('update');
      const updatedDistrict = await withLoading('toggle-status', async () => {
        return await districtApi.toggleDistrictStatus(id);
      });
      updateDistrict(updatedDistrict);
      
      return { success: true, data: updatedDistrict };
    } catch (error) {
      setError('update', error.message);
      return { success: false, error: error.message };
    }
  }, [updateDistrict, setError, clearError, withLoading]);

  // Cargar estadísticas
  const fetchStats = useCallback(async () => {
    try {
      clearError('stats');
      const statsData = await withLoading('fetch-stats', async () => {
        return await districtApi.getDistrictStats();
      });
      setStats(statsData);
    } catch (error) {
      setError('stats', error.message);
    }
  }, [setStats, setError, clearError, withLoading]);

  // Exportar distritos
  const exportDistricts = useCallback(async (customFilters = null) => {
    const currentFilters = customFilters || filters;
    
    try {
      clearError('export');
      const data = await withLoading('export-districts', async () => {
        return await districtApi.exportDistricts(currentFilters);
      });
      
      // Crear CSV
      const headers = [
        'Código',
        'Nombre',
        'Descripción',
        'Provincia',
        'Región',
        'Población',
        'Estado',
        'Consultorios',
        'Dentistas',
        'Fecha Creación'
      ];

      const csvContent = [
        headers.join(','),
        ...data.map(district => [
          district.codigo,
          `"${district.nombre}"`,
          `"${district.descripcion}"`,
          district.provincia,
          district.region,
          district.poblacion || 0,
          district.activo ? 'Activo' : 'Inactivo',
          district.cantidadConsultorios || 0,
          district.cantidadDentistas || 0,
          new Date(district.fechaCreacion).toLocaleDateString('es-PE')
        ].join(','))
      ].join('\n');

      // Descargar archivo
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `distritos_${new Date().toISOString().split('T')[0]}.csv`);
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

  // Cambiar página
  const changePage = useCallback((page) => {
    setPagination({ page });
    fetchDistricts(null, { ...pagination, page });
  }, [pagination, setPagination, fetchDistricts]);

  // Cambiar límite por página
  const changeLimit = useCallback((limit) => {
    setPagination({ page: 1, limit });
    fetchDistricts(null, { page: 1, limit });
  }, [setPagination, fetchDistricts]);

  // Efecto para cargar datos iniciales
  useEffect(() => {
    if (districts.length === 0) {
      fetchDistricts();
      fetchStats();
    }
  }, []); // Solo al montar el componente

  return {
    // Datos
    districts,
    pagination,
    filters,
    stats,
    
    // Estados
    loading: {
      districts: isLoadingHook('fetch-districts'),
      create: isLoadingHook('create-district'),
      update: isLoadingHook('update-district'),
      delete: isLoadingHook('delete-district'),
      stats: isLoadingHook('fetch-stats'),
      export: isLoadingHook('export-districts'),
      toggle: isLoadingHook('toggle-status')
    },
    errors,
    
    // Acciones
    fetchDistricts,
    createDistrict,
    updateDistrict: updateDistrictById,
    deleteDistrict,
    toggleStatus,
    fetchStats,
    exportDistricts,
    changePage,
    changeLimit,
    
    // Utilidades
    isLoading: (key) => isLoadingHook(key),
    hasError: (key) => !!errors[key],
    getError: (key) => errors[key]
  };
};

export default useDistricts;