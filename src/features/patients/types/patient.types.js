// Tipos y interfaces para el módulo de pacientes
export const PatientStatus = {
  ACTIVE: 'activo',
  INACTIVE: 'inactivo',
  SUSPENDED: 'suspendido',
  DECEASED: 'fallecido'
};

export const GenderOptions = [
  { value: 'masculino', label: 'Masculino' },
  { value: 'femenino', label: 'Femenino' },
  { value: 'otro', label: 'Otro' },
  { value: 'prefiero_no_decir', label: 'Prefiero no decir' }
];

export const BloodTypeOptions = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
];

export const MaritalStatusOptions = [
  { value: 'soltero', label: 'Soltero(a)' },
  { value: 'casado', label: 'Casado(a)' },
  { value: 'conviviente', label: 'Conviviente' },
  { value: 'divorciado', label: 'Divorciado(a)' },
  { value: 'viudo', label: 'Viudo(a)' }
];

export const AllergyOptions = [
  'Penicilina',
  'Lidocaína',
  'Articaína',
  'Benzocaína',
  'Latex',
  'Yodo',
  'Aspirina',
  'Ibuprofeno',
  'Sulfas',
  'Mariscos',
  'Frutos secos',
  'Polen',
  'Polvo',
  'Metales (níquel, cromo)',
  'Anestésicos locales',
  'Antibióticos',
  'Antiinflamatorios'
];

export const AllergySeverityOptions = [
  { value: 'leve', label: 'Leve', color: 'yellow' },
  { value: 'moderada', label: 'Moderada', color: 'orange' },
  { value: 'severa', label: 'Severa', color: 'red' }
];

export const MedicalConditionOptions = [
  'Diabetes Mellitus Tipo 1',
  'Diabetes Mellitus Tipo 2',
  'Hipertensión arterial',
  'Enfermedad coronaria',
  'Arritmias cardíacas',
  'Asma',
  'EPOC',
  'Epilepsia',
  'Migraña',
  'Artritis reumatoide',
  'Osteoporosis',
  'Hipotiroidismo',
  'Hipertiroidismo',
  'Anemia',
  'Hemofilia',
  'Trastornos de coagulación',
  'Cáncer (especificar)',
  'VIH/SIDA',
  'Hepatitis B',
  'Hepatitis C',
  'Embarazo',
  'Lactancia',
  'Marcapasos',
  'Prótesis articulares',
  'Trastornos psiquiátricos',
  'Trastornos alimentarios'
];

export const InsuranceProviders = [
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

export const ConsentTypes = [
  {
    id: 'general_treatment',
    name: 'Tratamiento Dental General',
    required: true,
    description: 'Consentimiento para procedimientos dentales básicos'
  },
  {
    id: 'anesthesia',
    name: 'Anestesia Local',
    required: false,
    description: 'Consentimiento para uso de anestesia local'
  },
  {
    id: 'oral_surgery',
    name: 'Cirugía Oral',
    required: false,
    description: 'Consentimiento para procedimientos quirúrgicos'
  },
  {
    id: 'orthodontics',
    name: 'Tratamiento Ortodóncico',
    required: false,
    description: 'Consentimiento para tratamiento de ortodoncia'
  },
  {
    id: 'implants',
    name: 'Implantes Dentales',
    required: false,
    description: 'Consentimiento para colocación de implantes'
  },
  {
    id: 'data_usage',
    name: 'Uso de Datos Médicos',
    required: true,
    description: 'Autorización para uso y almacenamiento de datos médicos'
  },
  {
    id: 'photography',
    name: 'Fotografías Clínicas',
    required: false,
    description: 'Autorización para tomar fotografías con fines clínicos'
  }
];

export const CommunicationChannels = [
  { value: 'email', label: 'Email', icon: 'Mail' },
  { value: 'sms', label: 'SMS', icon: 'MessageSquare' },
  { value: 'whatsapp', label: 'WhatsApp', icon: 'MessageCircle' },
  { value: 'llamada', label: 'Llamada telefónica', icon: 'Phone' }
];

export const ReminderFrequencyOptions = [
  { value: 'ninguno', label: 'No enviar recordatorios' },
  { value: '1_dia', label: '1 día antes' },
  { value: '3_dias', label: '3 días antes' },
  { value: '1_semana', label: '1 semana antes' }
];

export const BrushingFrequencyOptions = [
  { value: 'nunca', label: 'Nunca' },
  { value: '1_vez', label: '1 vez al día' },
  { value: '2_veces', label: '2 veces al día' },
  { value: '3_veces', label: '3 veces al día' },
  { value: 'mas_3', label: 'Más de 3 veces al día' }
];

export const DietSugarOptions = [
  { value: 'baja', label: 'Baja en azúcar' },
  { value: 'media', label: 'Moderada' },
  { value: 'alta', label: 'Alta en azúcar' }
];

export const AlcoholFrequencyOptions = [
  { value: 'nunca', label: 'Nunca' },
  { value: 'ocasional', label: 'Ocasional (fines de semana)' },
  { value: 'moderado', label: 'Moderado (2-3 veces por semana)' },
  { value: 'frecuente', label: 'Frecuente (diario)' }
];

export const RiskLevels = [
  { value: 1, label: 'Muy Bajo', color: 'green' },
  { value: 2, label: 'Bajo', color: 'green' },
  { value: 3, label: 'Bajo-Medio', color: 'yellow' },
  { value: 4, label: 'Medio', color: 'yellow' },
  { value: 5, label: 'Medio', color: 'yellow' },
  { value: 6, label: 'Medio-Alto', color: 'orange' },
  { value: 7, label: 'Alto', color: 'orange' },
  { value: 8, label: 'Alto', color: 'red' },
  { value: 9, label: 'Muy Alto', color: 'red' },
  { value: 10, label: 'Crítico', color: 'red' }
];

export const LanguageOptions = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
  { value: 'qu', label: 'Quechua' }
];

export const RelationshipOptions = [
  'Padre',
  'Madre',
  'Esposo(a)',
  'Hijo(a)',
  'Hermano(a)',
  'Abuelo(a)',
  'Tío(a)',
  'Primo(a)',
  'Amigo(a)',
  'Tutor legal',
  'Otro'
];

export const SortOptions = [
  { value: 'nombre', label: 'Nombre' },
  { value: 'fecha_registro', label: 'Fecha de Registro' },
  { value: 'ultima_cita', label: 'Última Cita' },
  { value: 'edad', label: 'Edad' },
  { value: 'total_citas', label: 'Total de Citas' },
  { value: 'riesgo', label: 'Puntuación de Riesgo' },
  { value: 'satisfaccion', label: 'Nivel de Satisfacción' }
];

export const SortOrderOptions = [
  { value: 'asc', label: 'Ascendente' },
  { value: 'desc', label: 'Descendente' }
];

// Validaciones
export const PATIENT_VALIDATION = {
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

export const MEDICAL_ALERT_TYPES = {
  CRITICAL_ALLERGY: 'critical_allergy',
  MEDICAL_CONDITION: 'medical_condition',
  DRUG_INTERACTION: 'drug_interaction',
  AGE_CONSIDERATION: 'age_consideration',
  OVERDUE_CHECKUP: 'overdue_checkup',
  HIGH_RISK: 'high_risk',
  INSURANCE_EXPIRED: 'insurance_expired',
  CONSENT_EXPIRED: 'consent_expired'
};

export const COMMUNICATION_TYPES = {
  APPOINTMENT_REMINDER: 'appointment_reminder',
  TREATMENT_FOLLOWUP: 'treatment_followup',
  HEALTH_EDUCATION: 'health_education',
  EMERGENCY_ALERT: 'emergency_alert',
  BILLING_NOTICE: 'billing_notice',
  GENERAL_MESSAGE: 'general_message',
  SURVEY_REQUEST: 'survey_request'
};