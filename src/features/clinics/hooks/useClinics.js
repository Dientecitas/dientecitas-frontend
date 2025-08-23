import { useCallback, useEffect } from 'react';
import { useClinicContext } from '../store/clinicContext';
import { clinicApi } from '../services/clinicApi';
import { useLoading } from '../../../shared/hooks/useLoading';

export const useClinics = () => {
  const {
    clinics,
    pagination,
    filters,
    loading,
    errors,
    stats,
    ui,
    setClinics,
    addClinic,
    updateClinic,
    removeClinic,
    bulkUpdateClinics,
    setStats,
    setLoading,
    setError,
    clearError,
    setPagination
  } = useClinicContext();
  
  const { withLoading, isLoading: isLoadingHook } = useLoading();

  // Cargar consultorios
  const fetchClinics = useCallback(async (customFilters = null, customPagination = null) => {
    const currentFilters = customFilters || filters;
    const currentPagination = customPagination || pagination;

    try {
      clearError('clinics');
      const response = await withLoading('fetch-clinics', async () => {
        return await clinicApi.getClinics(currentFilters, currentPagination);
      });
      setClinics(response.data, response.pagination);
    } catch (error) {
      setError('clinics', error.message);
    }
  }, [filters, pagination, setClinics, setError, clearError, withLoading]);

  // Crear consultorio
  const createClinic = useCallback(async (clinicData) => {
    try {
      clearError('create');
      const newClinic = await withLoading('create-clinic', async () => {
        return await clinicApi.createClinic(clinicData);
      });
      addClinic(newClinic);
      
      // Recargar estadísticas
      await fetchStats();
      
      return { success: true, data: newClinic };
    } catch (error) {
      setError('create', error.message);
      return { success: false, error: error.message };
    }
  }, [addClinic, setError, clearError, withLoading]);

  // Actualizar consultorio
  const updateClinicById = useCallback(async (id, clinicData) => {
    try {
      clearError('update');
      const updatedClinic = await withLoading('update-clinic', async () => {
        return await clinicApi.updateClinic(id, clinicData);
      });
      updateClinic(updatedClinic);
      
      // Recargar estadísticas
      await fetchStats();
      
      return { success: true, data: updatedClinic };
    } catch (error) {
      setError('update', error.message);
      return { success: false, error: error.message };
    }
  }, [updateClinic, setError, clearError, withLoading]);

  // Eliminar consultorio
  const deleteClinic = useCallback(async (id) => {
    try {
      clearError('delete');
      await withLoading('delete-clinic', async () => {
        return await clinicApi.deleteClinic(id);
      });
      removeClinic(id);
      
      // Recargar estadísticas
      await fetchStats();
      
      return { success: true };
    } catch (error) {
      setError('delete', error.message);
      return { success: false, error: error.message };
    }
  }, [removeClinic, setError, clearError, withLoading]);

  // Cambiar estado del consultorio
  const toggleStatus = useCallback(async (id) => {
    try {
      clearError('update');
      const updatedClinic = await withLoading('toggle-status', async () => {
        return await clinicApi.toggleClinicStatus(id);
      });
      updateClinic(updatedClinic);
      
      return { success: true, data: updatedClinic };
    } catch (error) {
      setError('update', error.message);
      return { success: false, error: error.message };
    }
  }, [updateClinic, setError, clearError, withLoading]);

  // Operaciones masivas
  const bulkUpdate = useCallback(async (ids, updates) => {
    try {
      clearError('bulk');
      const result = await withLoading('bulk-update', async () => {
        return await clinicApi.bulkUpdateClinics(ids, updates);
      });
      
      bulkUpdateClinics(ids, updates);
      
      // Recargar estadísticas
      await fetchStats();
      
      return { success: true, data: result };
    } catch (error) {
      setError('bulk', error.message);
      return { success: false, error: error.message };
    }
  }, [bulkUpdateClinics, setError, clearError, withLoading]);

  // Cargar estadísticas
  const fetchStats = useCallback(async () => {
    try {
      clearError('stats');
      const statsData = await withLoading('fetch-stats', async () => {
        return await clinicApi.getClinicStats();
      });
      setStats(statsData);
    } catch (error) {
      setError('stats', error.message);
    }
  }, [setStats, setError, clearError, withLoading]);

  // Exportar consultorios
  const exportClinics = useCallback(async (customFilters = null) => {
    const currentFilters = customFilters || filters;
    
    try {
      clearError('export');
      const data = await withLoading('export-clinics', async () => {
        return await clinicApi.exportClinics(currentFilters);
      });
      
      // Crear CSV
      const headers = [
        'Código',
        'Nombre',
        'Descripción',
        'Distrito',
        'Dirección',
        'Teléfono',
        'Email',
        'Tipo',
        'Estado',
        'Verificado',
        'Capacidad',
        'Dentistas',
        'Servicios',
        'Especialidades',
        'Fecha Creación'
      ];

      const csvContent = [
        headers.join(','),
        ...data.map(clinic => [
          clinic.codigo,
          `"${clinic.nombre}"`,
          `"${clinic.descripcion}"`,
          clinic.distrito?.nombre || 'N/A',
          `"${clinic.direccion}"`,
          clinic.telefono,
          clinic.email || '',
          clinic.tipoClinica === 'publica' ? 'Pública' : clinic.tipoClinica === 'privada' ? 'Privada' : 'Mixta',
          clinic.activo ? 'Activo' : 'Inactivo',
          clinic.verificado ? 'Verificado' : 'Pendiente',
          clinic.capacidadConsultorios,
          clinic.cantidadDentistas || 0,
          `"${clinic.servicios?.join(', ') || ''}"`,
          `"${clinic.especialidades?.join(', ') || ''}"`,
          new Date(clinic.fechaCreacion).toLocaleDateString('es-PE')
        ].join(','))
      ].join('\n');

      // Descargar archivo
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `consultorios_${new Date().toISOString().split('T')[0]}.csv`);
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
      const suggestions = await clinicApi.getSearchSuggestions(query);
      return suggestions;
    } catch (error) {
      console.warn('Error obteniendo sugerencias:', error);
      return [];
    }
  }, []);

  // Obtener consultorios cercanos
  const getNearbyClinic = useCallback(async (lat, lng, radius = 5) => {
    try {
      const nearbyClinics = await clinicApi.getNearbyClinics(lat, lng, radius);
      return nearbyClinics;
    } catch (error) {
      console.warn('Error obteniendo consultorios cercanos:', error);
      return [];
    }
  }, []);

  // Subir imagen
  const uploadImage = useCallback(async (clinicId, imageData) => {
    try {
      clearError('images');
      const newImage = await withLoading('upload-image', async () => {
        return await clinicApi.uploadClinicImage(clinicId, imageData);
      });
      
      // Actualizar el consultorio con la nueva imagen
      const clinic = clinics.find(c => c.id === clinicId);
      if (clinic) {
        const updatedClinic = {
          ...clinic,
          imagenes: [...(clinic.imagenes || []), newImage],
          imagenPrincipal: clinic.imagenPrincipal || newImage.url
        };
        updateClinic(updatedClinic);
      }
      
      return { success: true, data: newImage };
    } catch (error) {
      setError('images', error.message);
      return { success: false, error: error.message };
    }
  }, [clinics, updateClinic, setError, clearError, withLoading]);

  // Eliminar imagen
  const deleteImage = useCallback(async (clinicId, imageId) => {
    try {
      clearError('images');
      await withLoading('delete-image', async () => {
        return await clinicApi.deleteClinicImage(clinicId, imageId);
      });
      
      // Actualizar el consultorio removiendo la imagen
      const clinic = clinics.find(c => c.id === clinicId);
      if (clinic && clinic.imagenes) {
        const updatedImages = clinic.imagenes.filter(img => img.id !== imageId);
        const deletedImage = clinic.imagenes.find(img => img.id === imageId);
        
        const updatedClinic = {
          ...clinic,
          imagenes: updatedImages,
          imagenPrincipal: clinic.imagenPrincipal === deletedImage?.url && updatedImages.length > 0
            ? updatedImages[0].url
            : clinic.imagenPrincipal
        };
        updateClinic(updatedClinic);
      }
      
      return { success: true };
    } catch (error) {
      setError('images', error.message);
      return { success: false, error: error.message };
    }
  }, [clinics, updateClinic, setError, clearError, withLoading]);

  // Cambiar página
  const changePage = useCallback((page) => {
    setPagination({ page });
    fetchClinics(null, { ...pagination, page });
  }, [pagination, setPagination, fetchClinics]);

  // Cambiar límite por página
  const changeLimit = useCallback((limit) => {
    setPagination({ page: 1, limit });
    fetchClinics(null, { page: 1, limit });
  }, [setPagination, fetchClinics]);

  // Efecto para cargar datos iniciales
  useEffect(() => {
    if (clinics.length === 0) {
      fetchClinics();
      fetchStats();
    }
  }, []); // Solo al montar el componente

  return {
    // Datos
    clinics,
    pagination,
    filters,
    stats,
    ui,
    
    // Estados
    loading: {
      clinics: isLoadingHook('fetch-clinics'),
      create: isLoadingHook('create-clinic'),
      update: isLoadingHook('update-clinic'),
      delete: isLoadingHook('delete-clinic'),
      bulk: isLoadingHook('bulk-update'),
      stats: isLoadingHook('fetch-stats'),
      export: isLoadingHook('export-clinics'),
      images: isLoadingHook('upload-image') || isLoadingHook('delete-image'),
      toggle: isLoadingHook('toggle-status')
    },
    errors,
    
    // Acciones
    fetchClinics,
    createClinic,
    updateClinic: updateClinicById,
    deleteClinic,
    toggleStatus,
    bulkUpdate,
    fetchStats,
    exportClinics,
    getSearchSuggestions,
    getNearbyClinic,
    uploadImage,
    deleteImage,
    changePage,
    changeLimit,
    
    // Utilidades
    isLoading: (key) => isLoadingHook(key),
    hasError: (key) => !!errors[key],
    getError: (key) => errors[key]
  };
};

export default useClinics;