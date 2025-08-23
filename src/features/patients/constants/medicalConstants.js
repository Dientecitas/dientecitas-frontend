// Constantes médicas para el sistema de pacientes

export const MEDICAL_CONDITIONS = [
  // Condiciones cardiovasculares
  'Hipertensión arterial',
  'Enfermedad coronaria',
  'Arritmias cardíacas',
  'Insuficiencia cardíaca',
  'Marcapasos',
  
  // Condiciones endocrinas
  'Diabetes Mellitus Tipo 1',
  'Diabetes Mellitus Tipo 2',
  'Hipotiroidismo',
  'Hipertiroidismo',
  
  // Condiciones respiratorias
  'Asma',
  'EPOC',
  'Apnea del sueño',
  
  // Condiciones neurológicas
  'Epilepsia',
  'Migraña',
  'Parkinson',
  'Alzheimer',
  
  // Condiciones hematológicas
  'Anemia',
  'Hemofilia',
  'Trastornos de coagulación',
  'Leucemia',
  
  // Condiciones autoinmunes
  'Artritis reumatoide',
  'Lupus',
  'Esclerosis múltiple',
  
  // Condiciones óseas
  'Osteoporosis',
  'Osteoartritis',
  
  // Condiciones psiquiátricas
  'Depresión',
  'Ansiedad',
  'Trastorno bipolar',
  'Esquizofrenia',
  
  // Condiciones específicas odontológicas
  'Bruxismo',
  'Xerostomía',
  'Gingivitis crónica',
  'Periodontitis',
  'TMJ (Trastorno temporomandibular)',
  
  // Condiciones especiales
  'Embarazo',
  'Lactancia',
  'Cáncer (especificar)',
  'VIH/SIDA',
  'Hepatitis B',
  'Hepatitis C',
  'Trasplante de órganos',
  'Quimioterapia',
  'Radioterapia'
];

export const INSURANCE_PROVIDERS = [
  'EsSalud',
  'SIS (Seguro Integral de Salud)',
  'Pacífico Seguros',
  'Rímac Seguros',
  'La Positiva Seguros',
  'Mapfre Perú',
  'Interseguro',
  'HDI Seguros',
  'Chubb Seguros',
  'Seguros Sura',
  'Particular (Sin seguro)'
];

export const CONSENT_TYPES = [
  {
    id: 'general_treatment',
    name: 'Tratamiento Dental General',
    required: true,
    description: 'Consentimiento para procedimientos dentales básicos',
    minAge: 18,
    parentalConsentRequired: true
  },
  {
    id: 'anesthesia',
    name: 'Anestesia Local',
    required: false,
    description: 'Consentimiento para uso de anestesia local',
    riskLevel: 'low'
  },
  {
    id: 'oral_surgery',
    name: 'Cirugía Oral',
    required: false,
    description: 'Consentimiento para procedimientos quirúrgicos',
    riskLevel: 'high'
  },
  {
    id: 'orthodontics',
    name: 'Tratamiento Ortodóncico',
    required: false,
    description: 'Consentimiento para tratamiento de ortodoncia',
    duration: '12-24 meses'
  },
  {
    id: 'implants',
    name: 'Implantes Dentales',
    required: false,
    description: 'Consentimiento para colocación de implantes',
    riskLevel: 'medium'
  },
  {
    id: 'data_usage',
    name: 'Uso de Datos Médicos',
    required: true,
    description: 'Autorización para uso y almacenamiento de datos médicos',
    hipaaRequired: true
  },
  {
    id: 'photography',
    name: 'Fotografías Clínicas',
    required: false,
    description: 'Autorización para tomar fotografías con fines clínicos'
  }
];

export const RISK_FACTORS = {
  // Factores de edad
  AGE_FACTORS: {
    'pediatric': { min: 0, max: 17, riskMultiplier: 1.2 },
    'adult': { min: 18, max: 64, riskMultiplier: 1.0 },
    'elderly': { min: 65, max: 120, riskMultiplier: 1.5 }
  },
  
  // Factores médicos
  MEDICAL_FACTORS: {
    'diabetes_controlled': { riskScore: 1 },
    'diabetes_uncontrolled': { riskScore: 3 },
    'hypertension': { riskScore: 1 },
    'heart_disease': { riskScore: 2 },
    'bleeding_disorders': { riskScore: 3 },
    'immunocompromised': { riskScore: 2 }
  },
  
  // Factores de hábitos
  HABIT_FACTORS: {
    'smoking_light': { riskScore: 1 },      // < 10 cigarrillos/día
    'smoking_moderate': { riskScore: 2 },   // 10-20 cigarrillos/día
    'smoking_heavy': { riskScore: 3 },      // > 20 cigarrillos/día
    'poor_oral_hygiene': { riskScore: 2 },
    'bruxism': { riskScore: 1 },
    'high_sugar_diet': { riskScore: 1 }
  },
  
  // Factores de medicamentos
  MEDICATION_FACTORS: {
    'anticoagulants': { riskScore: 2 },
    'bisphosphonates': { riskScore: 2 },
    'immunosuppressants': { riskScore: 2 },
    'polypharmacy': { riskScore: 1 }        // > 5 medicamentos
  }
};

export const COMMUNICATION_CHANNELS = [
  { value: 'email', label: 'Email', icon: 'Mail', secure: true },
  { value: 'sms', label: 'SMS', icon: 'MessageSquare', secure: false },
  { value: 'whatsapp', label: 'WhatsApp', icon: 'MessageCircle', secure: true },
  { value: 'llamada', label: 'Llamada telefónica', icon: 'Phone', secure: true },
  { value: 'portal', label: 'Portal del paciente', icon: 'Globe', secure: true }
];

export const MEDICAL_ALERT_TYPES = {
  CRITICAL_ALLERGY: {
    type: 'critical_allergy',
    priority: 'high',
    color: 'red',
    icon: 'AlertTriangle',
    autoNotify: true
  },
  MEDICAL_CONDITION: {
    type: 'medical_condition',
    priority: 'medium',
    color: 'orange',
    icon: 'Heart',
    autoNotify: false
  },
  DRUG_INTERACTION: {
    type: 'drug_interaction',
    priority: 'medium',
    color: 'yellow',
    icon: 'AlertCircle',
    autoNotify: true
  },
  AGE_CONSIDERATION: {
    type: 'age_consideration',
    priority: 'low',
    color: 'blue',
    icon: 'Info',
    autoNotify: false
  },
  HIGH_RISK: {
    type: 'high_risk',
    priority: 'high',
    color: 'red',
    icon: 'Shield',
    autoNotify: true
  },
  OVERDUE_CHECKUP: {
    type: 'overdue_checkup',
    priority: 'low',
    color: 'gray',
    icon: 'Calendar',
    autoNotify: false
  }
};

export const PATIENT_VALIDATION_RULES = {
  NOMBRES_MIN_LENGTH: 2,
  NOMBRES_MAX_LENGTH: 50,
  APELLIDOS_MIN_LENGTH: 2,
  APELLIDOS_MAX_LENGTH: 50,
  DNI_PATTERN: /^\d{8}$/,
  TELEFONO_PATTERN: /^\+51-\d{1}-\d{9}$/,
  PESO_MIN: 0.5,
  PESO_MAX: 300,
  ALTURA_MIN: 30,
  ALTURA_MAX: 250,
  EDAD_MIN: 0,
  EDAD_MAX: 120,
  MAX_EMERGENCY_CONTACTS: 5,
  MAX_ALLERGIES: 20,
  MAX_CONDITIONS: 15,
  MAX_MEDICATIONS: 30
};

export const PRIVACY_SETTINGS = {
  DATA_RETENTION_OPTIONS: [
    { years: 5, label: '5 años (mínimo legal)' },
    { years: 7, label: '7 años (recomendado)' },
    { years: 10, label: '10 años (máximo)' },
    { years: -1, label: 'Indefinido (hasta solicitud)' }
  ],
  
  SHARING_LEVELS: {
    NONE: 'none',
    CLINIC_ONLY: 'clinic_only',
    NETWORK: 'network',
    RESEARCH: 'research'
  },
  
  NOTIFICATION_TYPES: {
    APPOINTMENTS: 'appointments',
    TREATMENTS: 'treatments',
    BILLING: 'billing',
    MARKETING: 'marketing',
    EMERGENCY: 'emergency'
  }
};

export default {
  MEDICAL_CONDITIONS,
  INSURANCE_PROVIDERS,
  CONSENT_TYPES,
  RISK_FACTORS,
  COMMUNICATION_CHANNELS,
  MEDICAL_ALERT_TYPES,
  PATIENT_VALIDATION_RULES,
  PRIVACY_SETTINGS
};