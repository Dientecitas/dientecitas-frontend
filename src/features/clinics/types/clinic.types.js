// Tipos y interfaces para el módulo de consultorios
export const ClinicType = {
  PUBLICA: 'publica',
  PRIVADA: 'privada',
  MIXTA: 'mixta'
};

export const ImageType = {
  EXTERIOR: 'exterior',
  RECEPCION: 'recepcion',
  CONSULTORIO: 'consultorio',
  EQUIPOS: 'equipos',
  OTROS: 'otros'
};

export const DaysOfWeek = [
  'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'
];

export const ServiceOptions = [
  'Limpieza dental',
  'Ortodoncia',
  'Implantes',
  'Blanqueamiento',
  'Endodoncia',
  'Periodoncia',
  'Cirugía oral',
  'Odontopediatría',
  'Prótesis dental',
  'Estética dental',
  'Radiografías',
  'Urgencias dentales'
];

export const SpecialtyOptions = [
  'Odontología General',
  'Ortodoncia',
  'Implantología',
  'Endodoncia',
  'Periodoncia',
  'Cirugía Oral y Maxilofacial',
  'Odontopediatría',
  'Prostodoncia',
  'Patología Oral',
  'Radiología Oral'
];

export const EquipmentOptions = [
  'Rayos X Digital',
  'Autoclave',
  'Unidades Dentales Modernas',
  'Scanner Intraoral',
  'Láser Dental',
  'Microscopio Dental',
  'Cámara Intraoral',
  'Ultrasonido Dental',
  'Fotopolimerizadora LED',
  'Sistema de Aspiración Central'
];

export const CertificationOptions = [
  'ISO 9001',
  'Certificación Sanitaria',
  'DIGESA',
  'Certificación de Bioseguridad',
  'Acreditación Internacional',
  'Certificación Ambiental'
];

export const CleaningMethodOptions = [
  'Desinfección UV',
  'Esterilización por calor húmedo',
  'Productos certificados',
  'Ozono',
  'Plasma de peróxido de hidrógeno',
  'Desinfección por vapor'
];

// Validaciones
export const CLINIC_VALIDATION = {
  NOMBRE_MIN_LENGTH: 3,
  NOMBRE_MAX_LENGTH: 100,
  DESCRIPCION_MIN_LENGTH: 10,
  DESCRIPCION_MAX_LENGTH: 500,
  CODIGO_PATTERN: /^[A-Z]{2}-[A-Z]{2,3}-\d{3}$/,
  TELEFONO_PATTERN: /^\+51-\d{1}-\d{7}$/,
  CAPACIDAD_MIN: 1,
  CAPACIDAD_MAX: 50,
  MAX_IMAGES: 10,
  MAX_IMAGE_SIZE: 5 * 1024 * 1024 // 5MB
};

export const SortOptions = [
  { value: 'nombre', label: 'Nombre' },
  { value: 'distrito', label: 'Distrito' },
  { value: 'fechaCreacion', label: 'Fecha de Creación' },
  { value: 'cantidadDentistas', label: 'Cantidad de Dentistas' },
  { value: 'calificacion', label: 'Calificación' }
];

export const SortOrderOptions = [
  { value: 'asc', label: 'Ascendente' },
  { value: 'desc', label: 'Descendente' }
];