// Tipos y interfaces para el módulo de dentistas
export const DentistStatus = {
  DISPONIBLE: 'disponible',
  OCUPADO: 'ocupado',
  DESCANSO: 'descanso',
  NO_DISPONIBLE: 'no_disponible'
};

export const SpecialtyCategory = {
  GENERAL: 'general',
  ESPECIALIZADA: 'especializada',
  SUBESPECIALIZADA: 'subespecializada'
};

export const SpecialtyOptions = [
  'Odontología General',
  'Ortodoncia',
  'Endodoncia',
  'Periodoncia',
  'Cirugía Oral y Maxilofacial',
  'Implantología',
  'Odontopediatría',
  'Prostodoncia',
  'Patología Oral',
  'Radiología Oral',
  'Estética Dental',
  'Odontología Preventiva'
];

export const ServiceOptions = [
  'Consultas Generales',
  'Limpieza Dental',
  'Ortodoncia',
  'Implantes Dentales',
  'Endodoncia',
  'Blanqueamiento Dental',
  'Cirugía Oral',
  'Prótesis Dentales',
  'Periodoncia',
  'Odontopediatría',
  'Urgencias Dentales',
  'Radiografías Dentales'
];

export const LanguageOptions = [
  { code: 'es', name: 'Español' },
  { code: 'en', name: 'Inglés' },
  { code: 'pt', name: 'Portugués' },
  { code: 'fr', name: 'Francés' },
  { code: 'it', name: 'Italiano' },
  { code: 'de', name: 'Alemán' }
];

export const LanguageLevels = [
  'basico',
  'intermedio', 
  'avanzado',
  'nativo'
];

export const DaysOfWeek = [
  'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'
];

export const UniversityDegrees = [
  'bachiller',
  'licenciatura',
  'maestria',
  'doctorado'
];

export const SortOptions = [
  { value: 'nombre', label: 'Nombre' },
  { value: 'especialidad', label: 'Especialidad' },
  { value: 'experiencia', label: 'Años de Experiencia' },
  { value: 'calificacion', label: 'Calificación' },
  { value: 'fechaIngreso', label: 'Fecha de Ingreso' },
  { value: 'consultorio', label: 'Consultorio' }
];

export const SortOrderOptions = [
  { value: 'asc', label: 'Ascendente' },
  { value: 'desc', label: 'Descendente' }
];

// Validaciones
export const DENTIST_VALIDATION = {
  NOMBRES_MIN_LENGTH: 2,
  NOMBRES_MAX_LENGTH: 50,
  APELLIDOS_MIN_LENGTH: 2,
  APELLIDOS_MAX_LENGTH: 50,
  DNI_PATTERN: /^\d{8}$/,
  CELULAR_PATTERN: /^\d{9,11}$/,
  COLEGIATURA_PATTERN: /^COP-\d{5}$/,
  EXPERIENCIA_MIN: 0,
  EXPERIENCIA_MAX: 50,
  CONSULTA_DURACION_MIN: 15,
  CONSULTA_DURACION_MAX: 180,
  PACIENTES_DIA_MIN: 1,
  PACIENTES_DIA_MAX: 50,
  PRECIO_MIN: 1,
  PRECIO_MAX: 10000,
  MAX_ESPECIALIDADES: 5,
  MAX_CERTIFICACIONES: 20,
  MAX_UNIVERSIDADES: 5
};