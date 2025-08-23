// Tipos y interfaces para el módulo de distritos
export const DistrictStatus = {
  ACTIVE: true,
  INACTIVE: false
};

export const ProvinceOptions = [
  'Lima',
  'Callao',
  'Huarochirí',
  'Cañete',
  'Yauyos'
];

export const RegionOptions = {
  'Lima': ['Lima Metropolitana', 'Lima Centro', 'Lima Norte', 'Lima Sur', 'Lima Este'],
  'Callao': ['Callao Metropolitano'],
  'Huarochirí': ['Sierra de Lima'],
  'Cañete': ['Costa Sur'],
  'Yauyos': ['Sierra Central']
};

export const SortOptions = [
  { value: 'nombre', label: 'Nombre' },
  { value: 'fechaCreacion', label: 'Fecha de Creación' },
  { value: 'cantidadConsultorios', label: 'Cantidad de Consultorios' },
  { value: 'poblacion', label: 'Población' }
];

export const SortOrderOptions = [
  { value: 'asc', label: 'Ascendente' },
  { value: 'desc', label: 'Descendente' }
];

// Validaciones
export const DISTRICT_VALIDATION = {
  NOMBRE_MIN_LENGTH: 2,
  NOMBRE_MAX_LENGTH: 50,
  DESCRIPCION_MIN_LENGTH: 10,
  DESCRIPCION_MAX_LENGTH: 200,
  CODIGO_PATTERN: /^[A-Z]{2}-\d{3}$/,
  POBLACION_MIN: 1
};