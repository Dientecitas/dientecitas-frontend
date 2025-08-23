// Configuración de autenticación
export const AUTH_CONFIG = {
  KEYCLOAK_ENABLED: false, // Flag para habilitar/deshabilitar Keycloak
  KEYCLOAK_URL: 'http://localhost:8080/auth',
  KEYCLOAK_REALM: 'dientecitas',
  KEYCLOAK_CLIENT_ID: 'dientecitas-app'
};

// Usuarios mock para desarrollo
export const mockUsers = [
  {
    id: '1',
    email: 'admin@dientecitas.com',
    password: 'admin123',
    nombre: 'Admin',
    apellido: 'Sistema',
    roles: ['admin'],
    permissions: ['all']
  },
  {
    id: '2',
    email: 'dentista@dientecitas.com',
    password: 'dentista123',
    nombre: 'Dr. Juan',
    apellido: 'Pérez',
    roles: ['dentista'],
    permissions: ['manage_appointments', 'view_patients']
  },
  {
    id: '3',
    email: 'paciente@dientecitas.com',
    password: 'paciente123',
    nombre: 'María',
    apellido: 'González',
    roles: ['paciente'],
    permissions: ['book_appointments', 'view_own_appointments']
  }
];

// Datos de ejemplo
export const mockDistricts = [
  { id: '1', nombre: 'Centro', descripcion: 'Distrito Centro de la ciudad', activo: true },
  { id: '2', nombre: 'Norte', descripcion: 'Zona Norte residencial', activo: true },
  { id: '3', nombre: 'Sur', descripcion: 'Sector Sur comercial', activo: true }
];

export const mockClinics = [
  { id: '1', nombre: 'Clínica Dental Centro', direccion: 'Av. Principal 123', telefono: '555-0001', distritoId: '1', activo: true },
  { id: '2', nombre: 'Sonrisas Centro', direccion: 'Calle Central 456', telefono: '555-0002', distritoId: '1', activo: true },
  { id: '3', nombre: 'Dental Norte', direccion: 'Av. Norte 789', telefono: '555-0003', distritoId: '2', activo: true },
  { id: '4', nombre: 'Clínica Norte Plus', direccion: 'Calle Norte 321', telefono: '555-0004', distritoId: '2', activo: true },
  { id: '5', nombre: 'Sur Dental Care', direccion: 'Av. Sur 654', telefono: '555-0005', distritoId: '3', activo: true },
  { id: '6', nombre: 'Sonrisas del Sur', direccion: 'Calle Sur 987', telefono: '555-0006', distritoId: '3', activo: true }
];

export const mockDentists = [
  { id: '1', nombre: 'Dr. Carlos', apellido: 'Rodríguez', especialidad: 'Ortodoncia', telefono: '555-1001', email: 'carlos@dientecitas.com', consultorioId: '1', activo: true },
  { id: '2', nombre: 'Dra. Ana', apellido: 'García', especialidad: 'Endodoncia', telefono: '555-1002', email: 'ana@dientecitas.com', consultorioId: '1', activo: true },
  { id: '3', nombre: 'Dr. Luis', apellido: 'Martínez', especialidad: 'Cirugía Oral', telefono: '555-1003', email: 'luis@dientecitas.com', consultorioId: '2', activo: true },
  { id: '4', nombre: 'Dra. Carmen', apellido: 'López', especialidad: 'Periodoncia', telefono: '555-1004', email: 'carmen@dientecitas.com', consultorioId: '3', activo: true },
  { id: '5', nombre: 'Dr. Miguel', apellido: 'Sánchez', especialidad: 'Implantología', telefono: '555-1005', email: 'miguel@dientecitas.com', consultorioId: '4', activo: true },
  { id: '6', nombre: 'Dra. Isabel', apellido: 'Romero', especialidad: 'Odontopediatría', telefono: '555-1006', email: 'isabel@dientecitas.com', consultorioId: '5', activo: true },
  { id: '7', nombre: 'Dr. Pedro', apellido: 'Jiménez', especialidad: 'Estética Dental', telefono: '555-1007', email: 'pedro@dientecitas.com', consultorioId: '6', activo: true }
];