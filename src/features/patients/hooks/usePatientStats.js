import { useState, useEffect, useCallback } from 'react';
import { patientApi } from '../services/patientApi';

export const usePatientStats = (patientId = null) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Cargar estadísticas
  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const statsData = await patientApi.getPatientStats();
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

    const porcentajeInactivos = 100 - (stats.porcentajeActivos || 0);
    const porcentajeSinSeguro = 100 - (stats.porcentajeConSeguro || 0);
    const porcentajeNoVerificados = 100 - (stats.porcentajeVerificados || 0);

    return {
      ...stats,
      porcentajeInactivos,
      porcentajeSinSeguro,
      porcentajeNoVerificados,
      densidadPacientesPorConsultorio: stats.totalPacientes > 0 
        ? Math.round((stats.totalPacientes / 10) * 100) / 100 // Asumiendo ~10 consultorios
        : 0,
      pacientesNuevosMes: Math.floor((stats.totalPacientes || 0) * 0.1), // Simulado
      tasaRetencion: Math.round(((stats.pacientesActivos || 0) / (stats.totalPacientes || 1)) * 100)
    };
  }, [stats]);

  // Obtener datos para gráficos
  const getChartData = useCallback(() => {
    const metrics = getMetrics();
    if (!metrics) return null;

    return {
      estados: [
        { name: 'Activos', value: metrics.pacientesActivos, color: '#10B981' },
        { name: 'Inactivos', value: metrics.pacientesInactivos, color: '#EF4444' }
      ],
      genero: Object.entries(metrics.distribucionGenero || {}).map(([genero, cantidad], index) => ({
        name: genero.charAt(0).toUpperCase() + genero.slice(1),
        value: cantidad,
        color: ['#3B82F6', '#EC4899', '#8B5CF6'][index] || '#6B7280'
      })),
      edad: Object.entries(metrics.distribucionEdad || {}).map(([rango, cantidad], index) => ({
        name: rango,
        value: cantidad,
        color: ['#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index] || '#6B7280'
      })),
      seguro: [
        { name: 'Con Seguro', value: metrics.pacientesConSeguro, color: '#10B981' },
        { name: 'Sin Seguro', value: metrics.totalPacientes - metrics.pacientesConSeguro, color: '#EF4444' }
      ],
      verificacion: [
        { name: 'Verificados', value: metrics.pacientesVerificados, color: '#10B981' },
        { name: 'Pendientes', value: metrics.totalPacientes - metrics.pacientesVerificados, color: '#F59E0B' }
      ]
    };
  }, [getMetrics]);

  // Comparar con período anterior (simulado)
  const getComparison = useCallback(() => {
    const metrics = getMetrics();
    if (!metrics) return null;

    // Simulación de datos del período anterior
    const previousPeriodFactor = 0.85 + Math.random() * 0.3; // Entre 85% y 115%
    
    return {
      totalPacientes: {
        current: metrics.totalPacientes,
        previous: Math.floor(metrics.totalPacientes * previousPeriodFactor),
        change: Math.round(((metrics.totalPacientes / (metrics.totalPacientes * previousPeriodFactor)) - 1) * 100)
      },
      pacientesActivos: {
        current: metrics.pacientesActivos,
        previous: Math.floor(metrics.pacientesActivos * previousPeriodFactor),
        change: Math.round(((metrics.pacientesActivos / (metrics.pacientesActivos * previousPeriodFactor)) - 1) * 100)
      },
      pacientesNuevos: {
        current: metrics.pacientesNuevosMes,
        previous: Math.floor(metrics.pacientesNuevosMes * previousPeriodFactor),
        change: Math.round(((metrics.pacientesNuevosMes / (metrics.pacientesNuevosMes * previousPeriodFactor)) - 1) * 100)
      }
    };
  }, [getMetrics]);

  // Obtener tendencias (simulado)
  const getTrends = useCallback(() => {
    if (!stats) return null;

    // Generar datos de tendencia simulados para los últimos 7 días
    const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    
    return {
      registros: days.map(day => ({
        day,
        value: Math.floor(Math.random() * 10) + 2
      })),
      citas: days.map(day => ({
        day,
        value: Math.floor(Math.random() * 50) + 20
      })),
      satisfaccion: days.map(day => ({
        day,
        value: Math.round((Math.random() * 2 + 3) * 10) / 10 // Entre 3.0 y 5.0
      }))
    };
  }, [stats]);

  return {
    // Datos
    stats,
    metrics: getMetrics(),
    chartData: getChartData(),
    comparison: getComparison(),
    trends: getTrends(),
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

export default usePatientStats;