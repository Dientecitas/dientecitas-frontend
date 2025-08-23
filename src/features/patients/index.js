// API pública del slice de pacientes

// Páginas principales
export { default as PatientsPage } from './pages/PatientsPage';
export { default as PatientDetailPage } from './pages/PatientDetailPage';
export { default as CreatePatientPage } from './pages/CreatePatientPage';
export { default as EditPatientPage } from './pages/EditPatientPage';
export { default as PatientDashboard } from './pages/PatientDashboard';
export { default as MyProfilePage } from './pages/MyProfilePage';
export { default as PublicRegistrationPage } from './pages/PublicRegistrationPage';
export { default as MedicalHistoryPage } from './pages/MedicalHistoryPage';
export { default as ConsentManagementPage } from './pages/ConsentManagementPage';

// Componentes reutilizables
export { default as PatientCard } from './components/PatientCard';
export { default as PatientList } from './components/PatientList';
export { default as PatientProfile } from './components/PatientProfile';
export { default as PatientForm } from './components/PatientForm';
export { default as PatientFilters } from './components/PatientFilters';
export { default as PatientStats } from './components/PatientStats';
export { default as MedicalHistory } from './components/MedicalHistory';
export { default as TreatmentPlan } from './components/TreatmentPlan';
export { default as ConsentForms } from './components/ConsentForms';
export { default as PatientCommunication } from './components/PatientCommunication';
export { default as PatientDocuments } from './components/PatientDocuments';
export { default as EmergencyContacts } from './components/EmergencyContacts';
export { default as InsuranceInformation } from './components/InsuranceInformation';
export { default as PaymentHistory } from './components/PaymentHistory';
export { default as DeletePatientModal } from './components/DeletePatientModal';

// Hooks para otros slices
export { default as usePatients } from './hooks/usePatients';
export { default as usePatientForm } from './hooks/usePatientForm';
export { default as usePatientStats } from './hooks/usePatientStats';
export { default as useMedicalHistory } from './hooks/useMedicalHistory';
export { default as usePatientCommunication } from './hooks/usePatientCommunication';
export { default as useConsentManagement } from './hooks/useConsentManagement';
export { default as usePatientDocuments } from './hooks/usePatientDocuments';

// Servicios para integración
export { patientApi } from './services/patientApi';
export { communicationService } from './services/communicationService';
export { medicalAlertSystem } from './services/medicalAlertSystem';
export { hipaaCompliance } from './services/hipaaCompliance';

// Context
export { PatientProvider, usePatientContext } from './store/patientContext';

// Utilidades médicas
export { 
  calculateAge,
  calculateRiskScore,
  validateMedicalData,
  generateMedicalAlerts,
  formatMedicalHistory,
  checkDrugInteractions,
  formatPatientName,
  formatMedicalDate,
  getMedicalStatusColor,
  getMedicalStatusText,
  validateDNI,
  formatPhone,
  calculateBMI,
  getAgeGroup,
  formatInsuranceInfo
} from './utils/patientHelpers';

// Tipos y constantes
export {
  PatientStatus,
  GenderOptions,
  BloodTypeOptions,
  AllergyOptions,
  MedicalConditionOptions,
  InsuranceProviders,
  ConsentTypes,
  CommunicationChannels,
  RiskLevels
} from './types/patient.types';

// Constantes médicas
export {
  MEDICAL_CONDITIONS,
  INSURANCE_PROVIDERS,
  CONSENT_TYPES,
  RISK_FACTORS
} from './constants/medicalConstants';