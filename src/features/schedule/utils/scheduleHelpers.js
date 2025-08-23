import { format, parseISO, addDays, differenceInMinutes } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    return format(parseISO(dateString), 'dd/MM/yyyy', { locale: es });
  } catch (error) {
    return dateString;
  }
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  try {
    return format(parseISO(dateString), 'dd/MM/yyyy HH:mm', { locale: es });
  } catch (error) {
    return dateString;
  }
};

export const formatTime = (timeString) => {
  if (!timeString) return '';
  return timeString;
};

export const formatNumber = (number) => {
  if (typeof number !== 'number') return '0';
  return new Intl.NumberFormat('es-PE').format(number);
};

export const calculateSlotDuration = (horaInicio, horaFin) => {
  if (!horaInicio || !horaFin) return 0;
  
  const start = new Date(`2000-01-01T${horaInicio}:00`);
  const end = new Date(`2000-01-01T${horaFin}:00`);
  
  return differenceInMinutes(end, start);
};

export const getTimeSlotStatusColor = (estado) => {
  switch (estado) {
    case 'disponible':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'reservado':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'ocupado':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'bloqueado':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'cancelado':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getTimeSlotStatusText = (estado) => {
  switch (estado) {
    case 'disponible':
      return 'Disponible';
    case 'reservado':
      return 'Reservado';
    case 'ocupado':
      return 'Ocupado';
    case 'bloqueado':
      return 'Bloqueado';
    case 'cancelado':
      return 'Cancelado';
    default:
      return 'Desconocido';
  }
};

export const isSlotAvailable = (timeSlot) => {
  return timeSlot.estado === 'disponible' && 
         timeSlot.citasActuales < timeSlot.capacidadMaxima;
};

export const getSlotCapacityPercentage = (timeSlot) => {
  if (!timeSlot.capacidadMaxima) return 0;
  return Math.round((timeSlot.citasActuales / timeSlot.capacidadMaxima) * 100);
};

export const calculateOptimalCapacity = (historicalData, constraints = {}) => {
  const {
    maxCapacity = 10,
    minUtilization = 0.7,
    targetUtilization = 0.85
  } = constraints;

  // Análisis de demanda histórica
  const avgDemand = historicalData.reduce((sum, data) => sum + data.demand, 0) / historicalData.length;
  const peakDemand = Math.max(...historicalData.map(data => data.demand));
  
  // Cálculo de capacidad óptima
  const baseCapacity = Math.ceil(avgDemand / targetUtilization);
  const peakCapacity = Math.ceil(peakDemand / minUtilization);
  
  const optimalCapacity = Math.min(
    Math.max(baseCapacity, peakCapacity),
    maxCapacity
  );

  return {
    optimal: optimalCapacity,
    utilization: avgDemand / optimalCapacity,
    peakUtilization: peakDemand / optimalCapacity,
    recommendation: generateCapacityRecommendation(optimalCapacity, avgDemand, peakDemand)
  };
};

export const generateRecurringSlots = (pattern, dateRange) => {
  const slots = [];
  const { tipo, frecuencia, diasSemana, fechaInicio, fechaFin } = pattern;
  
  let currentDate = new Date(fechaInicio);
  const endDate = new Date(fechaFin);
  
  while (currentDate <= endDate) {
    if (shouldCreateSlotForDate(currentDate, pattern)) {
      slots.push({
        fecha: currentDate.toISOString().split('T')[0],
        esRecurrente: true,
        grupoRecurrenciaId: pattern.id,
        patronRecurrencia: pattern
      });
    }
    
    currentDate = getNextRecurrenceDate(currentDate, pattern);
  }
  
  return slots;
};

export const detectScheduleConflicts = (timeSlots) => {
  const conflicts = [];
  
  // Agrupar por dentista y fecha
  const slotsByDentistAndDate = groupSlotsByDentistAndDate(timeSlots);
  
  Object.entries(slotsByDentistAndDate).forEach(([key, slots]) => {
    const [dentistaId, fecha] = key.split('|');
    
    // Detectar solapamientos de tiempo
    for (let i = 0; i < slots.length; i++) {
      for (let j = i + 1; j < slots.length; j++) {
        const slot1 = slots[i];
        const slot2 = slots[j];
        
        if (hasTimeOverlap(slot1, slot2)) {
          conflicts.push({
            id: `conflict-${slot1.id}-${slot2.id}`,
            type: 'TIME_OVERLAP',
            message: `Solapamiento entre turnos de ${slot1.horaInicio} y ${slot2.horaInicio}`,
            affectedSlots: [slot1, slot2],
            severity: 'high',
            autoResolvable: true
          });
        }
      }
    }
  });
  
  return conflicts;
};

export const optimizeTimeSlotDistribution = (timeSlots, objectives = {}) => {
  const {
    maximizeUtilization = 0.4,
    minimizeWaitTimes = 0.3,
    maximizeRevenue = 0.2,
    balanceWorkload = 0.1
  } = objectives;

  // Calcular métricas actuales
  const currentMetrics = calculateDistributionMetrics(timeSlots);
  
  // Generar distribución optimizada
  const optimizedSlots = [...timeSlots];
  
  // Algoritmo de optimización simple
  optimizedSlots.sort((a, b) => {
    const scoreA = calculateSlotScore(a, objectives);
    const scoreB = calculateSlotScore(b, objectives);
    return scoreB - scoreA;
  });
  
  const optimizedMetrics = calculateDistributionMetrics(optimizedSlots);
  
  return {
    originalSlots: timeSlots,
    optimizedSlots,
    improvement: {
      utilization: optimizedMetrics.utilization - currentMetrics.utilization,
      revenue: optimizedMetrics.revenue - currentMetrics.revenue,
      efficiency: optimizedMetrics.efficiency - currentMetrics.efficiency
    },
    recommendations: generateOptimizationRecommendations(currentMetrics, optimizedMetrics)
  };
};

export const calculateDemandForecast = (historicalData, forecastPeriod) => {
  // Análisis de tendencias
  const trends = analyzeTrends(historicalData);
  
  // Factores estacionales
  const seasonalFactors = calculateSeasonalFactors(historicalData);
  
  // Predicción simple basada en tendencias
  const forecast = [];
  
  for (let i = 0; i < forecastPeriod; i++) {
    const baseValue = trends.average;
    const trendAdjustment = trends.slope * i;
    const seasonalAdjustment = seasonalFactors[i % seasonalFactors.length];
    
    const predictedValue = baseValue + trendAdjustment + seasonalAdjustment;
    
    forecast.push({
      period: i + 1,
      predictedDemand: Math.max(0, Math.round(predictedValue)),
      confidence: calculateConfidence(trends, seasonalFactors, i)
    });
  }
  
  return {
    forecast,
    trends,
    seasonalFactors,
    accuracy: calculateForecastAccuracy(historicalData)
  };
};

export const validateScheduleConstraints = (timeSlot, constraints = {}) => {
  const violations = [];
  
  // Validar duración
  if (constraints.minDuration && timeSlot.duracion < constraints.minDuration) {
    violations.push({
      type: 'MIN_DURATION',
      message: `Duración mínima ${constraints.minDuration} minutos`,
      current: timeSlot.duracion
    });
  }
  
  if (constraints.maxDuration && timeSlot.duracion > constraints.maxDuration) {
    violations.push({
      type: 'MAX_DURATION',
      message: `Duración máxima ${constraints.maxDuration} minutos`,
      current: timeSlot.duracion
    });
  }
  
  // Validar horarios de trabajo
  if (constraints.businessHours) {
    const slotStart = timeSlot.horaInicio;
    const slotEnd = timeSlot.horaFin;
    const businessStart = constraints.businessHours.inicio;
    const businessEnd = constraints.businessHours.fin;
    
    if (slotStart < businessStart || slotEnd > businessEnd) {
      violations.push({
        type: 'OUTSIDE_BUSINESS_HOURS',
        message: `Fuera del horario laboral (${businessStart} - ${businessEnd})`,
        current: `${slotStart} - ${slotEnd}`
      });
    }
  }
  
  // Validar capacidad
  if (constraints.maxCapacity && timeSlot.capacidadMaxima > constraints.maxCapacity) {
    violations.push({
      type: 'CAPACITY_EXCEEDED',
      message: `Capacidad máxima ${constraints.maxCapacity}`,
      current: timeSlot.capacidadMaxima
    });
  }
  
  return {
    valid: violations.length === 0,
    violations,
    score: calculateConstraintScore(timeSlot, constraints)
  };
};

// Funciones auxiliares
const shouldCreateSlotForDate = (date, pattern) => {
  const dayOfWeek = date.getDay() || 7; // Convertir domingo (0) a 7
  
  switch (pattern.tipo) {
    case 'diario':
      return true;
    case 'semanal':
      return pattern.diasSemana?.includes(dayOfWeek) || false;
    case 'mensual':
      return pattern.diasMes?.includes(date.getDate()) || false;
    default:
      return false;
  }
};

const getNextRecurrenceDate = (currentDate, pattern) => {
  const nextDate = new Date(currentDate);
  
  switch (pattern.tipo) {
    case 'diario':
      nextDate.setDate(nextDate.getDate() + pattern.frecuencia);
      break;
    case 'semanal':
      nextDate.setDate(nextDate.getDate() + (7 * pattern.frecuencia));
      break;
    case 'mensual':
      nextDate.setMonth(nextDate.getMonth() + pattern.frecuencia);
      break;
    default:
      nextDate.setDate(nextDate.getDate() + 1);
  }
  
  return nextDate;
};

const hasTimeOverlap = (slot1, slot2) => {
  const start1 = timeToMinutes(slot1.horaInicio);
  const end1 = timeToMinutes(slot1.horaFin);
  const start2 = timeToMinutes(slot2.horaInicio);
  const end2 = timeToMinutes(slot2.horaFin);

  return start1 < end2 && end1 > start2;
};

const timeToMinutes = (timeString) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

const groupSlotsByDentistAndDate = (timeSlots) => {
  return timeSlots.reduce((groups, slot) => {
    const key = `${slot.dentistaId}|${slot.fecha}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(slot);
    return groups;
  }, {});
};

const calculateDistributionMetrics = (timeSlots) => {
  const totalSlots = timeSlots.length;
  const occupiedSlots = timeSlots.filter(s => s.estado === 'ocupado').length;
  const totalRevenue = timeSlots.reduce((sum, slot) => sum + (slot.precioFinal || 0), 0);
  
  return {
    utilization: totalSlots > 0 ? occupiedSlots / totalSlots : 0,
    revenue: totalRevenue,
    efficiency: totalSlots > 0 ? totalRevenue / totalSlots : 0,
    averageCapacity: totalSlots > 0 ? timeSlots.reduce((sum, slot) => sum + slot.capacidadMaxima, 0) / totalSlots : 0
  };
};

const calculateSlotScore = (slot, objectives) => {
  let score = 0;
  
  // Factor de utilización
  const utilizationScore = slot.citasActuales / slot.capacidadMaxima;
  score += utilizationScore * objectives.maximizeUtilization;
  
  // Factor de ingresos
  const revenueScore = (slot.precioFinal || 0) / 1000; // Normalizar
  score += revenueScore * objectives.maximizeRevenue;
  
  // Factor de demanda
  const demandScore = (slot.puntuacionDemanda || 5) / 10;
  score += demandScore * objectives.balanceWorkload;
  
  return score;
};

const analyzeTrends = (historicalData) => {
  if (historicalData.length < 2) {
    return { average: 0, slope: 0, variance: 0 };
  }
  
  const values = historicalData.map(d => d.value);
  const average = values.reduce((sum, val) => sum + val, 0) / values.length;
  
  // Calcular pendiente (tendencia)
  const n = values.length;
  const sumX = (n * (n - 1)) / 2;
  const sumY = values.reduce((sum, val) => sum + val, 0);
  const sumXY = values.reduce((sum, val, index) => sum + (val * index), 0);
  const sumX2 = values.reduce((sum, val, index) => sum + (index * index), 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  
  // Calcular varianza
  const variance = values.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / n;
  
  return { average, slope, variance };
};

const calculateSeasonalFactors = (historicalData) => {
  // Simplificado: calcular factores por mes
  const monthlyData = Array(12).fill(0);
  const monthlyCounts = Array(12).fill(0);
  
  historicalData.forEach(data => {
    const month = new Date(data.date).getMonth();
    monthlyData[month] += data.value;
    monthlyCounts[month]++;
  });
  
  const monthlyAverages = monthlyData.map((sum, index) => 
    monthlyCounts[index] > 0 ? sum / monthlyCounts[index] : 0
  );
  
  const overallAverage = monthlyAverages.reduce((sum, avg) => sum + avg, 0) / 12;
  
  return monthlyAverages.map(avg => avg - overallAverage);
};

const calculateConfidence = (trends, seasonalFactors, period) => {
  // Confianza basada en varianza y estacionalidad
  const baseConfidence = 0.8;
  const variancePenalty = Math.min(trends.variance / 100, 0.3);
  const seasonalBonus = Math.abs(seasonalFactors[period % seasonalFactors.length]) < 10 ? 0.1 : 0;
  
  return Math.max(0.1, Math.min(1.0, baseConfidence - variancePenalty + seasonalBonus));
};

const calculateForecastAccuracy = (historicalData) => {
  // Simplificado: calcular precisión basada en varianza
  if (historicalData.length < 3) return 0.5;
  
  const values = historicalData.map(d => d.value);
  const average = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / values.length;
  const standardDeviation = Math.sqrt(variance);
  
  // Accuracy inversamente proporcional a la desviación estándar
  const accuracy = Math.max(0.1, Math.min(1.0, 1 - (standardDeviation / average)));
  
  return Math.round(accuracy * 100) / 100;
};

const generateCapacityRecommendation = (optimal, avgDemand, peakDemand) => {
  if (optimal === avgDemand) {
    return 'Capacidad óptima para demanda promedio';
  } else if (optimal > avgDemand) {
    return `Aumentar capacidad en ${optimal - avgDemand} para manejar picos de demanda`;
  } else {
    return `Reducir capacidad en ${avgDemand - optimal} para mejorar eficiencia`;
  }
};

const generateOptimizationRecommendations = (current, optimized) => {
  const recommendations = [];
  
  if (optimized.utilization > current.utilization) {
    recommendations.push({
      type: 'utilization',
      message: `Mejora de utilización: +${Math.round((optimized.utilization - current.utilization) * 100)}%`,
      priority: 'high'
    });
  }
  
  if (optimized.revenue > current.revenue) {
    recommendations.push({
      type: 'revenue',
      message: `Incremento de ingresos: +S/ ${Math.round(optimized.revenue - current.revenue)}`,
      priority: 'medium'
    });
  }
  
  if (optimized.efficiency > current.efficiency) {
    recommendations.push({
      type: 'efficiency',
      message: `Mejora de eficiencia: +${Math.round((optimized.efficiency - current.efficiency) * 100)}%`,
      priority: 'medium'
    });
  }
  
  return recommendations;
};

const calculateConstraintScore = (timeSlot, constraints) => {
  let score = 100; // Puntuación base
  
  // Penalizar por violaciones
  const violations = validateScheduleConstraints(timeSlot, constraints).violations;
  score -= violations.length * 20;
  
  // Bonificar por características deseables
  if (timeSlot.estado === 'disponible') score += 10;
  if (timeSlot.capacidadMaxima > 1) score += 5;
  if (timeSlot.esRecurrente) score += 5;
  
  return Math.max(0, Math.min(100, score));
};

export const optimizeSlotPricing = (timeSlot, marketData = {}) => {
  const basePrice = timeSlot.tarifaBase || 100;
  
  // Factores de pricing
  const demandFactor = calculateDemandFactor(timeSlot, marketData);
  const timeFactor = calculateTimeFactor(timeSlot.horaInicio);
  const capacityFactor = calculateCapacityFactor(timeSlot);
  
  const optimizedPrice = basePrice * demandFactor * timeFactor * capacityFactor;
  
  return {
    basePrice,
    factors: {
      demand: demandFactor,
      time: timeFactor,
      capacity: capacityFactor
    },
    optimizedPrice: Math.round(optimizedPrice * 100) / 100,
    priceChange: optimizedPrice - basePrice
  };
};

// Funciones auxiliares para pricing
const calculateDemandFactor = (timeSlot, marketData) => {
  const demandScore = timeSlot.puntuacionDemanda || 5;
  return 0.8 + (demandScore / 10) * 0.4; // Rango: 0.8 - 1.2
};

const calculateTimeFactor = (horaInicio) => {
  const hour = parseInt(horaInicio.split(':')[0]);
  
  // Horarios premium (mañana temprano y tarde)
  if ((hour >= 8 && hour <= 10) || (hour >= 16 && hour <= 18)) {
    return 1.1;
  }
  
  // Horarios normales
  if (hour >= 11 && hour <= 15) {
    return 1.0;
  }
  
  // Horarios menos demandados
  return 0.9;
};

const calculateCapacityFactor = (timeSlot) => {
  const utilizationRate = timeSlot.citasActuales / timeSlot.capacidadMaxima;
  
  if (utilizationRate >= 0.8) return 1.2; // Alta demanda
  if (utilizationRate >= 0.5) return 1.0; // Demanda normal
  return 0.9; // Baja demanda
};