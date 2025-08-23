import { useState, useEffect, useCallback } from 'react';
import { dentistApi } from '../services/dentistApi';

export const useDentistStats = (dentistId = null) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Cargar estadísticas
  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const statsData = await dentistApi.getDentistStats();
      setStats(statsData);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refrescar estadísticas
  const refreshStats = useCallback(() => {
    fetchStats();
  }, [fetchStats]);

  // Cargar estadísticas al montar
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Auto-refresh cada 5 minutos
  useEffect(() => {
    const interval = setInterval(() => {
      fetchStats();
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, [fetchStats]);

  // Calcular métricas adicionales
  const getMetrics = useCallback(() => {
    if (!stats) return null;

    return {
      ...stats,
      porcentajeDisponibles: stats.totalDentistas > 0 
        ? Math.round((stats.dentistasDisponibles / stats.totalDentistas) * 100) 
        : 0,
      densidadPorConsultorio: stats.totalDentistas > 0 
        ? Math.round((stats.totalDentistas / (stats.totalDentistas / 3)) * 100) / 100 
        : 0
    };
  }, [stats]);

  // Obtener datos para gráficos
  const getChartData = useCallback(() => {
    const metrics = getMetrics();
    if (!metrics) return null;

    return {
      estados: [
        { name: 'Activos', value: metrics.dentistasActivos, color: '#10B981' },
        { name: 'Inactivos', value: metrics.dentistasInactivos, color: '#EF4444' }
      ],
      verificacion: [
        { name: 'Verificados', value: metrics.dentistasVerificados, color: '#10B981' },
        { name: 'Pendientes', value: metrics.totalDentistas - metrics.dentistasVerificados, color: '#F59E0B' }
      ],
      aprobacion: [
        { name: 'Aprobados', value: metrics.dentistasAprobados, color: '#10B981' },
        { name: 'Pendientes', value: metrics.totalDentistas - metrics.dentistasAprobados, color: '#F59E0B' }
      ],
      disponibilidad: [
        { name: 'Disponibles', value: metrics.dentistasDisponibles, color: '#10B981' },
        { name: 'No Disponibles', value: metrics.totalDentistas - metrics.dentistasDisponibles, color: '#EF4444' }
      ],
      especialidades: metrics.especialidadesMasComunes?.slice(0, 5).map((item, index) => ({
        name: item.especialidad,
        value: item.cantidad,
        color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index]
      })) || []
    };
  }, [getMetrics]);

  return {
    // Datos
    stats,
    metrics: getMetrics(),
    chartData: getChartData(),
    lastUpdated,
    
    // Estados
    loading,
    error,
    
    // Acciones
    refreshStats,
    
    // Utilidades
    isLoading: loading,
    hasError: !!error,
    hasData: !!stats,
    isStale: lastUpdated && (Date.now() - lastUpdated.getTime()) > 5 * 60 * 1000 // 5 minutos
  };
};

export default useDentistStats;