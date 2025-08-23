// API pública del slice de consultorios

// Páginas principales
export { default as ClinicsPage } from './pages/ClinicsPage';

// Componentes reutilizables
export { default as ClinicCard } from './components/ClinicCard';
export { default as ClinicList } from './components/ClinicList';
export { default as ClinicStats } from './components/ClinicStats';
export { default as ClinicForm } from './components/ClinicForm';

// Hooks para otros slices
export { default as useClinics } from './hooks/useClinics';
export { default as useClinicStats } from './hooks/useClinicStats';
export { default as useClinicForm } from './hooks/useClinicForm';

// Servicios para integración
export { clinicApi } from './services/clinicApi';

// Context
export { ClinicProvider, useClinicContext } from './store/clinicContext';

// Utilidades
export { 
  formatNumber,
  formatDate,
  formatSchedule,
  isClinicOpen,
  calculateDistance,
  formatDistance,
  validateBusinessHours,
  getClinicStatusColor,
  getClinicStatusText,
  getClinicTypeColor,
  getClinicTypeText
} from './utils/clinicHelpers';

// Tipos y constantes
export {
  ClinicType,
  ServiceOptions,
  SpecialtyOptions,
  EquipmentOptions,
  CertificationOptions,
  CleaningMethodOptions
} from './types/clinic.types';