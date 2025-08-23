import { useState, useEffect, useCallback } from 'react';
import { districtApi } from '../services/districtApi';

export const useDistrictStats = (districtId = null) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Cargar estadísticas
  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let statsData;
      if (districtId) {
        statsData = await districtApi.getDistrictStatsById(districtId);
      } else {
        statsData = await districtApi.getDistrictStats();
      }
      
      setStats(statsData);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [districtId]);

  // Refrescar estadísticas
  const refreshStats = useCallback(() => {
    fetchStats();
  }, [fetchStats]);

  // Cargar estadísticas al montar o cuando cambie el ID
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

    if (districtId) {
      // Métricas específicas del distrito
      return {
        consultorios: stats.consultorios,
        dentistas: stats.dentistas,
        citas: stats.citas,
        citasUltimoMes: stats.citasUltimoMes,
        promedioConsultoriosPorDentista: stats.promedioConsultoriosPorDentista,
        eficiencia: stats.dentistas > 0 ? Math.round((stats.citas / stats.dentistas) * 100) / 100 : 0,
        ocupacion: stats.consultorios > 0 ? Math.round((stats.dentistas / stats.consultorios) * 100) : 0
      };
    } else {
      // Métricas generales
      const porcentajeActivos = stats.totalDistritos > 0 
        ? Math.round((stats.distritosActivos / stats.totalDistritos) * 100) 
        : 0;
      
      const porcentajeInactivos = 100 - porcentajeActivos;
      
      return {
        ...stats,
        porcentajeActivos,
        porcentajeInactivos,
        densidadConsultorios: stats.distritosActivos > 0 
          ? Math.round((stats.totalConsultorios / stats.distritosActivos) * 100) / 100 
          : 0,
        densidadDentistas: stats.distritosActivos > 0 
          ? Math.round((stats.totalDentistas / stats.distritosActivos) * 100) / 100 
          : 0
      };
    }
  }, [stats, districtId]);

  // Obtener datos para gráficos
  const getChartData = useCallback(() => {
    const metrics = getMetrics();
    if (!metrics) return null;

    if (districtId) {
      // Datos para gráficos del distrito específico
      return {
        recursos: [
          { name: 'Consultorios', value: metrics.consultorios, color: '#3B82F6' },
          { name: 'Dentistas', value: metrics.dentistas, color: '#10B981' }
        ],
        actividad: [
          { name: 'Citas Totales', value: metrics.citas, color: '#F59E0B' },
          { name: 'Último Mes', value: metrics.citasUltimoMes, color: '#EF4444' }
        ]
      };
    } else {
      // Datos para gráficos generales
      return {
        estados: [
          { name: 'Activos', value: metrics.distritosActivos, color: '#10B981' },
          { name: 'Inactivos', value: metrics.distritosInactivos, color: '#EF4444' }
        ],
        recursos: [
          { name: 'Consultorios', value: metrics.totalConsultorios, color: '#3B82F6' },
          { name: 'Dentistas', value: metrics.totalDentistas, color: '#8B5CF6' }
        ],
        distribucion: [
          { name: 'Distritos', value: metrics.totalDistritos, color: '#06B6D4' },
          { name: 'Consultorios', value: metrics.totalConsultorios, color: '#3B82F6' },
          { name: 'Dentistas', value: metrics.totalDentistas, color: '#8B5CF6' }
        ]
      };
    }
  }, [getMetrics, districtId]);

  // Comparar con período anterior (simulado)
  const getComparison = useCallback(() => {
    const metrics = getMetrics();
    if (!metrics) return null;

    // Simulación de datos del período anterior
    const previousPeriodFactor = 0.85 + Math.random() * 0.3; // Entre 85% y 115%
    
    if (districtId) {
      return {
        consultorios: {
          current: metrics.consultorios,
          previous: Math.floor(metrics.consultorios * previousPeriodFactor),
          change: Math.round(((metrics.consultorios / (metrics.consultorios * previousPeriodFactor)) - 1) * 100)
        },
        dentistas: {
          current: metrics.dentistas,
          previous: Math.floor(metrics.dentistas * previousPeriodFactor),
          change: Math.round(((metrics.dentistas / (metrics.dentistas * previousPeriodFactor)) - 1) * 100)
        },
        citas: {
          current: metrics.citas,
          previous: Math.floor(metrics.citas * previousPeriodFactor),
          change: Math.round(((metrics.citas / (metrics.citas * previousPeriodFactor)) - 1) * 100)
        }
      };
    } else {
      return {
        totalDistritos: {
          current: metrics.totalDistritos,
          previous: Math.floor(metrics.totalDistritos * previousPeriodFactor),
          change: Math.round(((metrics.totalDistritos / (metrics.totalDistritos * previousPeriodFactor)) - 1) * 100)
        },
        distritosActivos: {
          current: metrics.distritosActivos,
          previous: Math.floor(metrics.distritosActivos * previousPeriodFactor),
          change: Math.round(((metrics.distritosActivos / (metrics.distritosActivos * previousPeriodFactor)) - 1) * 100)
        },
        totalConsultorios: {
          current: metrics.totalConsultorios,
          previous: Math.floor(metrics.totalConsultorios * previousPeriodFactor),
          change: Math.round(((metrics.totalConsultorios / (metrics.totalConsultorios * previousPeriodFactor)) - 1) * 100)
        }
      };
    }
  }, [getMetrics, districtId]);

  return {
    // Datos
    stats,
    metrics: getMetrics(),
    chartData: getChartData(),
    comparison: getComparison(),
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

export default useDistrictStats;