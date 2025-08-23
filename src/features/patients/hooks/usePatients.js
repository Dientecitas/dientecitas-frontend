import { useCallback, useEffect } from 'react';
import { usePatientContext } from '../store/patientContext';
import { patientApi } from '../services/patientApi';
import { useLoading } from '../../../shared/hooks/useLoading';
import { generateMedicalAlerts, calculateRiskScore } from '../utils/patientHelpers';

export const usePatients = () => {
  const {
    patients,
    pagination,
    filters,
    loading,
    errors,
    stats,
    ui,
    medicalAlerts,
    setPatients,
    addPatient,
    updatePatient,
    removePatient,
    bulkUpdatePatients,
    setStats,
    setLoading,
    setError,
    clearError,
    setPagination,
    setMedicalAlerts
  } = usePatientContext();
  
  const { withLoading, isLoading: isLoadingHook } = useLoading();

  // Cargar pacientes
  const fetchPatients = useCallback(async (customFilters = null, customPagination = null) => {
    const currentFilters = customFilters || filters;
    const currentPagination = customPagination || pagination;

    try {
      clearError('patients');
      const response = await withLoading('fetch-patients', async () => {
        return await patientApi.getPatients(currentFilters, currentPagination);
      });
      setPatients(response.data, response.pagination);
      
      // Generar alertas médicas para cada paciente
      response.data.forEach(patient => {
        const alerts = generateMedicalAlerts(patient);
        if (alerts.length > 0) {
          setMedicalAlerts(patient.id, alerts);
        }
      });
    } catch (error) {
      setError('patients', error.message);
    }
  }, [filters, pagination, setPatients, setError, clearError, withLoading, setMedicalAlerts]);

  // Crear paciente
  const createPatient = useCallback(async (patientData) => {
    try {
      clearError('create');
      const newPatient = await withLoading('create-patient', async () => {
        return await patientApi.createPatient(patientData);
      });
      addPatient(newPatient);
      
      // Generar alertas médicas
      const alerts = generateMedicalAlerts(newPatient);
      if (alerts.length > 0) {
        setMedicalAlerts(newPatient.id, alerts);
      }
      
      // Recargar estadísticas
      await fetchStats();
      
      return { success: true, data: newPatient };
    } catch (error) {
      setError('create', error.message);
      return { success: false, error: error.message };
    }
  }, [addPatient, setError, clearError, withLoading, setMedicalAlerts]);

  // Crear paciente desde registro público
  const createPatientFromPublicRegistration = useCallback(async (registrationData) => {
    try {
      clearError('create');
      const newPatient = await withLoading('create-patient', async () => {
        return await patientApi.createFromPublicRegistration(registrationData);
      });
      addPatient(newPatient);
      
      // Generar alertas médicas
      const alerts = generateMedicalAlerts(newPatient);
      if (alerts.length > 0) {
        setMedicalAlerts(newPatient.id, alerts);
      }
      
      return { success: true, data: newPatient };
    } catch (error) {
      setError('create', error.message);
      return { success: false, error: error.message };
    }
  }, [addPatient, setError, clearError, withLoading, setMedicalAlerts]);

  // Actualizar paciente
  const updatePatientById = useCallback(async (id, patientData) => {
    try {
      clearError('update');
      const updatedPatient = await withLoading('update-patient', async () => {
        return await patientApi.updatePatient(id, patientData);
      });
      updatePatient(updatedPatient);
      
      // Actualizar alertas médicas
      const alerts = generateMedicalAlerts(updatedPatient);
      setMedicalAlerts(updatedPatient.id, alerts);
      
      // Recargar estadísticas
      await fetchStats();
      
      return { success: true, data: updatedPatient };
    } catch (error) {
      setError('update', error.message);
      return { success: false, error: error.message };
    }
  }, [updatePatient, setError, clearError, withLoading, setMedicalAlerts]);

  // Eliminar paciente
  const deletePatient = useCallback(async (id) => {
    try {
      clearError('delete');
      await withLoading('delete-patient', async () => {
        return await patientApi.deletePatient(id);
      });
      removePatient(id);
      
      // Recargar estadísticas
      await fetchStats();
      
      return { success: true };
    } catch (error) {
      setError('delete', error.message);
      return { success: false, error: error.message };
    }
  }, [removePatient, setError, clearError, withLoading]);

  // Cambiar estado del paciente
  const toggleStatus = useCallback(async (id) => {
    try {
      clearError('update');
      const updatedPatient = await withLoading('toggle-status', async () => {
        return await patientApi.togglePatientStatus(id);
      });
      updatePatient(updatedPatient);
      
      return { success: true, data: updatedPatient };
    } catch (error) {
      setError('update', error.message);
      return { success: false, error: error.message };
    }
  }, [updatePatient, setError, clearError, withLoading]);

  // Operaciones masivas
  const bulkUpdate = useCallback(async (ids, updates) => {
    try {
      clearError('bulk');
      const result = await withLoading('bulk-update', async () => {
        return await patientApi.bulkUpdatePatients(ids, updates);
      });
      
      bulkUpdatePatients(ids, updates);
      
      // Recargar estadísticas
      await fetchStats();
      
      return { success: true, data: result };
    } catch (error) {
      setError('bulk', error.message);
      return { success: false, error: error.message };
    }
  }, [bulkUpdatePatients, setError, clearError, withLoading]);

  // Cargar estadísticas
  const fetchStats = useCallback(async () => {
    try {
      clearError('stats');
      const statsData = await withLoading('fetch-stats', async () => {
        return await patientApi.getPatientStats();
      });
      setStats(statsData);
    } catch (error) {
      setError('stats', error.message);
    }
  }, [setStats, setError, clearError, withLoading]);

  // Exportar pacientes
  const exportPatients = useCallback(async (customFilters = null) => {
    const currentFilters = customFilters || filters;
    
    try {
      clearError('export');
      const data = await withLoading('export-patients', async () => {
        return await patientApi.exportPatients(currentFilters);
      });
      
      // Crear CSV
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
        ...data.map(patient => [
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
          patient.ultimaCita || '',
          patient.puntuacionRiesgo || 0,
          patient.activo ? 'Activo' : 'Inactivo',
          new Date(patient.fechaRegistro).toLocaleDateString('es-PE')
        ].join(','))
      ].join('\n');

      // Descargar archivo
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `pacientes_${new Date().toISOString().split('T')[0]}.csv`);
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
      const suggestions = await patientApi.getSearchSuggestions(query);
      return suggestions;
    } catch (error) {
      console.warn('Error obteniendo sugerencias:', error);
      return [];
    }
  }, []);

  // Cambiar página
  const changePage = useCallback((page) => {
    setPagination({ page });
    fetchPatients(null, { ...pagination, page });
  }, [pagination, setPagination, fetchPatients]);

  // Cambiar límite por página
  const changeLimit = useCallback((limit) => {
    setPagination({ page: 1, limit });
    fetchPatients(null, { page: 1, limit });
  }, [setPagination, fetchPatients]);

  // Efecto para cargar datos iniciales
  useEffect(() => {
    if (patients.length === 0) {
      fetchPatients();
      fetchStats();
    }
  }, []); // Solo al montar el componente

  return {
    // Datos
    patients,
    pagination,
    filters,
    stats,
    ui,
    medicalAlerts,
    
    // Estados
    loading: {
      patients: isLoadingHook('fetch-patients'),
      create: isLoadingHook('create-patient'),
      update: isLoadingHook('update-patient'),
      delete: isLoadingHook('delete-patient'),
      bulk: isLoadingHook('bulk-update'),
      stats: isLoadingHook('fetch-stats'),
      export: isLoadingHook('export-patients'),
      toggle: isLoadingHook('toggle-status')
    },
    errors,
    
    // Acciones
    fetchPatients,
    createPatient,
    createPatientFromPublicRegistration,
    updatePatient: updatePatientById,
    deletePatient,
    toggleStatus,
    bulkUpdate,
    fetchStats,
    exportPatients,
    getSearchSuggestions,
    changePage,
    changeLimit,
    
    // Utilidades
    isLoading: (key) => isLoadingHook(key),
    hasError: (key) => !!errors[key],
    getError: (key) => errors[key],
    getMedicalAlerts: (patientId) => medicalAlerts[patientId] || []
  };
};

export default usePatients;