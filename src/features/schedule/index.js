// API pública del slice de turnos

// Páginas principales
export { default as SchedulePage } from './pages/SchedulePage';
export { default as CreateSchedulePage } from './pages/CreateSchedulePage';
export { default as BulkSchedulePage } from './pages/BulkSchedulePage';
export { default as ScheduleAnalyticsPage } from './pages/ScheduleAnalyticsPage';
export { default as TemplateManagementPage } from './pages/TemplateManagementPage';
export { default as CapacityPlanningPage } from './pages/CapacityPlanningPage';

// Componentes reutilizables
export { default as ScheduleCalendar } from './components/ScheduleCalendar';
export { default as TimeSlotGrid } from './components/TimeSlotGrid';
export { default as AvailabilityMatrix } from './components/AvailabilityMatrix';
export { default as ScheduleCreator } from './components/ScheduleCreator';
export { default as BulkScheduleManager } from './components/BulkScheduleManager';
export { default as ScheduleConflictResolver } from './components/ScheduleConflictResolver';
export { default as TimeSlotCard } from './components/TimeSlotCard';
export { default as ScheduleFilters } from './components/ScheduleFilters';
export { default as ScheduleStats } from './components/ScheduleStats';
export { default as RecurringSchedule } from './components/RecurringSchedule';
export { default as ExceptionManager } from './components/ExceptionManager';
export { default as ScheduleTemplates } from './components/ScheduleTemplates';
export { default as CapacityManager } from './components/CapacityManager';
export { default as ScheduleAnalytics } from './components/ScheduleAnalytics';
export { default as DeleteScheduleModal } from './components/DeleteScheduleModal';

// Hooks para integración
export { default as useSchedule } from './hooks/useSchedule';
export { default as useTimeSlots } from './hooks/useTimeSlots';
export { default as useAvailability } from './hooks/useAvailability';
export { default as useScheduleConflicts } from './hooks/useScheduleConflicts';
export { default as useRecurringSchedule } from './hooks/useRecurringSchedule';
export { default as useScheduleTemplates } from './hooks/useScheduleTemplates';
export { default as useCapacityPlanning } from './hooks/useCapacityPlanning';
export { default as useScheduleAnalytics } from './hooks/useScheduleAnalytics';

// Servicios y algoritmos
export { scheduleApi } from './services/scheduleApi';
export { default as timeSlotEngine } from './services/timeSlotEngine';
export { default as conflictResolver } from './services/conflictResolver';
export { default as capacityCalculator } from './services/capacityCalculator';

// Algoritmos especializados
export { default as slotGenerator } from './algorithms/slotGenerator';
export { default as conflictDetection } from './algorithms/conflictDetection';
export { default as capacityOptimizer } from './algorithms/capacityOptimizer';
export { default as demandPredictor } from './algorithms/demandPredictor';

// Context
export { ScheduleProvider, useScheduleContext } from './store/scheduleContext';

// Utilidades especializadas
export { 
  calculateOptimalCapacity,
  generateRecurringSlots,
  detectScheduleConflicts,
  optimizeTimeSlotDistribution,
  calculateDemandForecast,
  validateScheduleConstraints,
  formatScheduleTime,
  calculateSlotDuration,
  getTimeSlotStatus,
  isSlotAvailable,
  getSlotConflicts,
  optimizeSlotPricing
} from './utils/scheduleHelpers';

// Tipos y constantes
export {
  TimeSlotStatus,
  AppointmentType,
  Priority,
  RecurrenceType,
  ExceptionType,
  DaysOfWeek,
  AppointmentTypeOptions,
  TimeIntervals,
  SortOptions,
  SortOrderOptions,
  ConflictTypes,
  OptimizationObjectives
} from './types/schedule.types';