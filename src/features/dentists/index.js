// API pública del slice de dentistas

// Páginas principales
export { default as DentistsPage } from './pages/DentistsPage';

// Componentes reutilizables
export { default as DentistCard } from './components/DentistCard';
export { default as DentistList } from './components/DentistList';
export { default as DentistStats } from './components/DentistStats';
export { default as DentistForm } from './components/DentistForm';

// Hooks para otros slices
export { default as useDentists } from './hooks/useDentists';
export { default as useDentistStats } from './hooks/useDentistStats';
export { default as useDentistForm } from './hooks/useDentistForm';

// Servicios para integración
export { dentistApi } from './services/dentistApi';

// Context
export { DentistProvider, useDentistContext } from './store/dentistContext';

// Utilidades
export { 
  formatNumber,
  formatDate,
  formatExperience,
  formatSchedule,
  isDentistAvailable,
  getDentistStatusColor,
  getDentistStatusText,
  getAvailabilityStatusColor,
  getAvailabilityStatusText,
  getMainSpecialty,
  formatFullName,
  formatRating
} from './utils/dentistHelpers';

// Tipos y constantes
export {
  DentistStatus,
  SpecialtyOptions,
  ServiceOptions,
  LanguageOptions,
  DaysOfWeek
} from './types/dentist.types';