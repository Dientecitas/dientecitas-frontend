import { useState, useEffect, useCallback } from 'react';
import { clinicApi } from '../services/clinicApi';

export const useClinicStats = (clinicId = null) => {
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
      if (clinicId) {
        statsData = await clinicApi.getClinicStatsById(clinicId);
      } else {
        statsData = await clinicApi.getClinicStats();
      }
      
      setStats(statsData);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [clinicId]);

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

    if (clinicId) {
      // Métricas específicas del consultorio
      return {
        dentistas: stats.dentistas,
        citasHoy: stats.citasHoy,
        citasMes: stats.citasMes,
        turnosDisponibles: stats.turnosDisponibles,
        calificacion: stats.calificacion,
        capacidadUtilizada: stats.capacidadUtilizada,
        eficiencia: stats.citasMes > 0 ? Math.round((stats.citasHoy / (stats.citasMes / 30)) * 100) : 0,
        ocupacion: stats.capacidadUtilizada
      };
    } else {
      // Métricas generales
      const porcentajeActivos = stats.totalConsultorios > 0 
        ? Math.round((stats.consultoriosActivos / stats.totalConsultorios) * 100) 
        : 0;
      
      const porcentajeInactivos = 100 - porcentajeActivos;
      
      const porcentajeVerificados = stats.totalConsultorios > 0
        ? Math.round((stats.consultoriosVerificados / stats.totalConsultorios) * 100)
        : 0;
      
      return {
        ...stats,
        porcentajeActivos,
        porcentajeInactivos,
        porcentajeVerificados,
        densidadConsultorios: stats.consultoriosActivos > 0 
          ? Math.round((stats.totalConsultorios / stats.consultoriosActivos) * 100) / 100 
          : 0,
        eficienciaPromedio: stats.totalConsultorios > 0
          ? Math.round((stats.totalDentistas / stats.totalConsultorios) * 100) / 100
          : 0
      };
    }
  }, [stats, clinicId]);

  // Obtener datos para gráficos
  const getChartData = useCallback(() => {
    const metrics = getMetrics();
    if (!metrics) return null;

    if (clinicId) {
      // Datos para gráficos del consultorio específico
      return {
        actividad: [
          { name: 'Citas Hoy', value: metrics.citasHoy, color: '#3B82F6' },
          { name: 'Turnos Disponibles', value: metrics.turnosDisponibles, color: '#10B981' }
        ],
        ocupacion: [
          { name: 'Utilizada', value: metrics.capacidadUtilizada, color: '#F59E0B' },
          { name: 'Disponible', value: 100 - metrics.capacidadUtilizada, color: '#E5E7EB' }
        ]
      };
    } else {
      // Datos para gráficos generales
      return {
        estados: [
          { name: 'Activos', value: metrics.consultoriosActivos, color: '#10B981' },
          { name: 'Inactivos', value: metrics.consultoriosInactivos, color: '#EF4444' }
        ],
        tipos: [
          { name: 'Públicas', value: metrics.consultoriosPorTipo.publica, color: '#3B82F6' },
          { name: 'Privadas', value: metrics.consultoriosPorTipo.privada, color: '#8B5CF6' },
          { name: 'Mixtas', value: metrics.consultoriosPorTipo.mixta, color: '#F59E0B' }
        ],
        verificacion: [
          { name: 'Verificados', value: metrics.consultoriosVerificados, color: '#10B981' },
          { name: 'Pendientes', value: metrics.totalConsultorios - metrics.consultoriosVerificados, color: '#F59E0B' }
        ],
        servicios: metrics.serviciosMasOfrecidos?.slice(0, 5).map((item, index) => ({
          name: item.servicio,
          value: item.cantidad,
          color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index]
        })) || [],
        especialidades: metrics.especialidadesMasComunes?.slice(0, 5).map((item, index) => ({
          name: item.especialidad,
          value: item.cantidad,
          color: ['#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'][index]
        })) || []
      };
    }
  }, [getMetrics, clinicId]);

  // Comparar con período anterior (simulado)
  const getComparison = useCallback(() => {
    const metrics = getMetrics();
    if (!metrics) return null;

    // Simulación de datos del período anterior
    const previousPeriodFactor = 0.85 + Math.random() * 0.3; // Entre 85% y 115%
    
    if (clinicId) {
      return {
        dentistas: {
          current: metrics.dentistas,
          previous: Math.floor(metrics.dentistas * previousPeriodFactor),
          change: Math.round(((metrics.dentistas / (metrics.dentistas * previousPeriodFactor)) - 1) * 100)
        },
        citasHoy: {
          current: metrics.citasHoy,
          previous: Math.floor(metrics.citasHoy * previousPeriodFactor),
          change: Math.round(((metrics.citasHoy / (metrics.citasHoy * previousPeriodFactor)) - 1) * 100)
        },
        citasMes: {
          current: metrics.citasMes,
          previous: Math.floor(metrics.citasMes * previousPeriodFactor),
          change: Math.round(((metrics.citasMes / (metrics.citasMes * previousPeriodFactor)) - 1) * 100)
        }
      };
    } else {
      return {
        totalConsultorios: {
          current: metrics.totalConsultorios,
          previous: Math.floor(metrics.totalConsultorios * previousPeriodFactor),
          change: Math.round(((metrics.totalConsultorios / (metrics.totalConsultorios * previousPeriodFactor)) - 1) * 100)
        },
        consultoriosActivos: {
          current: metrics.consultoriosActivos,
          previous: Math.floor(metrics.consultoriosActivos * previousPeriodFactor),
          change: Math.round(((metrics.consultoriosActivos / (metrics.consultoriosActivos * previousPeriodFactor)) - 1) * 100)
        },
        totalDentistas: {
          current: metrics.totalDentistas,
          previous: Math.floor(metrics.totalDentistas * previousPeriodFactor),
          change: Math.round(((metrics.totalDentistas / (metrics.totalDentistas * previousPeriodFactor)) - 1) * 100)
        }
      };
    }
  }, [getMetrics, clinicId]);

  // Obtener tendencias (simulado)
  const getTrends = useCallback(() => {
    if (!stats) return null;

    // Generar datos de tendencia simulados para los últimos 7 días
    const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    
    if (clinicId) {
      return {
        citas: days.map(day => ({
          day,
          value: Math.floor(Math.random() * 20) + 5
        })),
        ocupacion: days.map(day => ({
          day,
          value: Math.floor(Math.random() * 40) + 60
        }))
      };
    } else {
      return {
        consultorios: days.map(day => ({
          day,
          activos: Math.floor(Math.random() * 5) + stats.consultoriosActivos - 2,
          nuevos: Math.floor(Math.random() * 3)
        })),
        dentistas: days.map(day => ({
          day,
          total: Math.floor(Math.random() * 10) + stats.totalDentistas - 5
        }))
      };
    }
  }, [stats, clinicId]);

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

export default useClinicStats;