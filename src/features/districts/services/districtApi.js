import api from '../../../shared/services/apiService';

// Mock data para desarrollo
const mockDistricts = [
  {
    id: '1',
    nombre: 'Miraflores',
    descripcion: 'Distrito turístico y comercial de Lima, conocido por sus parques y centros comerciales',
    codigo: 'LI-001',
    provincia: 'Lima',
    region: 'Lima Metropolitana',
    poblacion: 85065,
    activo: true,
    fechaCreacion: '2024-01-15T10:00:00Z',
    fechaActualizacion: '2024-01-15T10:00:00Z',
    cantidadConsultorios: 12,
    cantidadDentistas: 28,
    cantidadCitas: 450
  },
  {
    id: '2',
    nombre: 'San Isidro',
    descripcion: 'Distrito financiero de Lima, centro de negocios y oficinas corporativas',
    codigo: 'LI-002',
    provincia: 'Lima',
    region: 'Lima Metropolitana',
    poblacion: 54206,
    activo: true,
    fechaCreacion: '2024-01-15T10:00:00Z',
    fechaActualizacion: '2024-01-15T10:00:00Z',
    cantidadConsultorios: 8,
    cantidadDentistas: 18,
    cantidadCitas: 320
  },
  {
    id: '3',
    nombre: 'Surco',
    descripcion: 'Distrito residencial moderno con centros comerciales y universidades',
    codigo: 'LI-003',
    provincia: 'Lima',
    region: 'Lima Sur',
    poblacion: 357648,
    activo: true,
    fechaCreacion: '2024-01-16T09:30:00Z',
    fechaActualizacion: '2024-01-16T09:30:00Z',
    cantidadConsultorios: 15,
    cantidadDentistas: 35,
    cantidadCitas: 680
  },
  {
    id: '4',
    nombre: 'San Borja',
    descripcion: 'Distrito residencial con buena infraestructura y servicios de salud',
    codigo: 'LI-004',
    provincia: 'Lima',
    region: 'Lima Sur',
    poblacion: 111928,
    activo: true,
    fechaCreacion: '2024-01-16T11:00:00Z',
    fechaActualizacion: '2024-01-16T11:00:00Z',
    cantidadConsultorios: 6,
    cantidadDentistas: 14,
    cantidadCitas: 280
  },
  {
    id: '5',
    nombre: 'Callao',
    descripcion: 'Puerto principal del Perú, distrito histórico y comercial',
    codigo: 'CA-001',
    provincia: 'Callao',
    region: 'Callao Metropolitano',
    poblacion: 415888,
    activo: true,
    fechaCreacion: '2024-01-17T08:00:00Z',
    fechaActualizacion: '2024-01-17T08:00:00Z',
    cantidadConsultorios: 10,
    cantidadDentistas: 22,
    cantidadCitas: 420
  },
  {
    id: '6',
    nombre: 'La Molina',
    descripcion: 'Distrito residencial de clase media alta con universidades prestigiosas',
    codigo: 'LI-005',
    provincia: 'Lima',
    region: 'Lima Este',
    poblacion: 178172,
    activo: true,
    fechaCreacion: '2024-01-17T14:00:00Z',
    fechaActualizacion: '2024-01-17T14:00:00Z',
    cantidadConsultorios: 9,
    cantidadDentistas: 20,
    cantidadCitas: 360
  },
  {
    id: '7',
    nombre: 'Los Olivos',
    descripcion: 'Distrito emergente de Lima Norte con gran crecimiento poblacional',
    codigo: 'LI-006',
    provincia: 'Lima',
    region: 'Lima Norte',
    poblacion: 371229,
    activo: true,
    fechaCreacion: '2024-01-18T09:00:00Z',
    fechaActualizacion: '2024-01-18T09:00:00Z',
    cantidadConsultorios: 7,
    cantidadDentistas: 16,
    cantidadCitas: 310
  },
  {
    id: '8',
    nombre: 'San Juan de Miraflores',
    descripcion: 'Distrito popular de Lima Sur con alta densidad poblacional',
    codigo: 'LI-007',
    provincia: 'Lima',
    region: 'Lima Sur',
    poblacion: 404001,
    activo: false,
    fechaCreacion: '2024-01-18T16:00:00Z',
    fechaActualizacion: '2024-01-20T10:00:00Z',
    cantidadConsultorios: 4,
    cantidadDentistas: 8,
    cantidadCitas: 150
  },
  {
    id: '9',
    nombre: 'Pueblo Libre',
    descripcion: 'Distrito histórico con museos y centros culturales importantes',
    codigo: 'LI-008',
    provincia: 'Lima',
    region: 'Lima Centro',
    poblacion: 74164,
    activo: true,
    fechaCreacion: '2024-01-19T11:30:00Z',
    fechaActualizacion: '2024-01-19T11:30:00Z',
    cantidadConsultorios: 5,
    cantidadDentistas: 11,
    cantidadCitas: 220
  },
  {
    id: '10',
    nombre: 'Bellavista',
    descripcion: 'Distrito del Callao con desarrollo comercial y residencial',
    codigo: 'CA-002',
    provincia: 'Callao',
    region: 'Callao Metropolitano',
    poblacion: 71833,
    activo: true,
    fechaCreacion: '2024-01-19T15:00:00Z',
    fechaActualizacion: '2024-01-19T15:00:00Z',
    cantidadConsultorios: 3,
    cantidadDentistas: 7,
    cantidadCitas: 140
  }
];

// Simulación de delay de red
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Simulación de errores aleatorios (5% de probabilidad)
const shouldSimulateError = () => Math.random() < 0.05;

class DistrictApiService {
  constructor() {
    this.districts = [...mockDistricts];
  }

  async getDistricts(filters = {}, pagination = { page: 1, limit: 10 }) {
    await delay(300);
    
    if (shouldSimulateError()) {
      throw new Error('Error al cargar los distritos. Intente nuevamente.');
    }

    let filteredDistricts = [...this.districts];

    // Aplicar filtros
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredDistricts = filteredDistricts.filter(district =>
        district.nombre.toLowerCase().includes(searchLower) ||
        district.descripcion.toLowerCase().includes(searchLower) ||
        district.codigo.toLowerCase().includes(searchLower)
      );
    }

    if (filters.provincia) {
      filteredDistricts = filteredDistricts.filter(d => d.provincia === filters.provincia);
    }

    if (filters.region) {
      filteredDistricts = filteredDistricts.filter(d => d.region === filters.region);
    }

    if (filters.activo !== null && filters.activo !== undefined) {
      filteredDistricts = filteredDistricts.filter(d => d.activo === filters.activo);
    }

    // Aplicar ordenamiento
    if (filters.sortBy) {
      filteredDistricts.sort((a, b) => {
        let aValue = a[filters.sortBy];
        let bValue = b[filters.sortBy];

        if (filters.sortBy === 'fechaCreacion') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        } else if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Aplicar paginación
    const total = filteredDistricts.length;
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    const paginatedDistricts = filteredDistricts.slice(startIndex, endIndex);

    return {
      data: paginatedDistricts,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit)
      }
    };
  }

  async getDistrictById(id) {
    await delay(200);
    
    if (shouldSimulateError()) {
      throw new Error('Error al cargar el distrito. Intente nuevamente.');
    }

    const district = this.districts.find(d => d.id === id);
    if (!district) {
      throw new Error('Distrito no encontrado');
    }

    return district;
  }

  async createDistrict(districtData) {
    await delay(500);
    
    if (shouldSimulateError()) {
      throw new Error('Error al crear el distrito. Intente nuevamente.');
    }

    // Validar código único
    const existingCode = this.districts.find(d => d.codigo === districtData.codigo);
    if (existingCode) {
      throw new Error('El código del distrito ya existe');
    }

    // Validar nombre único
    const existingName = this.districts.find(d => 
      d.nombre.toLowerCase() === districtData.nombre.toLowerCase()
    );
    if (existingName) {
      throw new Error('Ya existe un distrito con ese nombre');
    }

    const newDistrict = {
      id: Date.now().toString(),
      ...districtData,
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
      cantidadConsultorios: 0,
      cantidadDentistas: 0,
      cantidadCitas: 0
    };

    this.districts.push(newDistrict);
    return newDistrict;
  }

  async updateDistrict(id, districtData) {
    await delay(500);
    
    if (shouldSimulateError()) {
      throw new Error('Error al actualizar el distrito. Intente nuevamente.');
    }

    const index = this.districts.findIndex(d => d.id === id);
    if (index === -1) {
      throw new Error('Distrito no encontrado');
    }

    // Validar código único (excluyendo el distrito actual)
    const existingCode = this.districts.find(d => 
      d.codigo === districtData.codigo && d.id !== id
    );
    if (existingCode) {
      throw new Error('El código del distrito ya existe');
    }

    // Validar nombre único (excluyendo el distrito actual)
    const existingName = this.districts.find(d => 
      d.nombre.toLowerCase() === districtData.nombre.toLowerCase() && d.id !== id
    );
    if (existingName) {
      throw new Error('Ya existe un distrito con ese nombre');
    }

    const updatedDistrict = {
      ...this.districts[index],
      ...districtData,
      fechaActualizacion: new Date().toISOString()
    };

    this.districts[index] = updatedDistrict;
    return updatedDistrict;
  }

  async deleteDistrict(id) {
    await delay(400);
    
    if (shouldSimulateError()) {
      throw new Error('Error al eliminar el distrito. Intente nuevamente.');
    }

    const district = this.districts.find(d => d.id === id);
    if (!district) {
      throw new Error('Distrito no encontrado');
    }

    // Verificar si tiene consultorios asociados
    if (district.cantidadConsultorios > 0) {
      throw new Error('No se puede eliminar un distrito que tiene consultorios asociados');
    }

    this.districts = this.districts.filter(d => d.id !== id);
    return { success: true, message: 'Distrito eliminado correctamente' };
  }

  async toggleDistrictStatus(id) {
    await delay(300);
    
    if (shouldSimulateError()) {
      throw new Error('Error al cambiar el estado del distrito. Intente nuevamente.');
    }

    const index = this.districts.findIndex(d => d.id === id);
    if (index === -1) {
      throw new Error('Distrito no encontrado');
    }

    this.districts[index] = {
      ...this.districts[index],
      activo: !this.districts[index].activo,
      fechaActualizacion: new Date().toISOString()
    };

    return this.districts[index];
  }

  async getDistrictStats() {
    await delay(200);
    
    if (shouldSimulateError()) {
      throw new Error('Error al cargar las estadísticas. Intente nuevamente.');
    }

    const total = this.districts.length;
    const activos = this.districts.filter(d => d.activo).length;
    const inactivos = total - activos;
    const totalConsultorios = this.districts.reduce((sum, d) => sum + d.cantidadConsultorios, 0);
    const totalDentistas = this.districts.reduce((sum, d) => sum + d.cantidadDentistas, 0);
    const promedioConsultorios = total > 0 ? Math.round(totalConsultorios / total * 100) / 100 : 0;

    return {
      totalDistritos: total,
      distritosActivos: activos,
      distritosInactivos: inactivos,
      totalConsultorios,
      totalDentistas,
      promedioConsultoriosPorDistrito: promedioConsultorios
    };
  }

  async getDistrictStatsById(id) {
    await delay(200);
    
    const district = this.districts.find(d => d.id === id);
    if (!district) {
      throw new Error('Distrito no encontrado');
    }

    return {
      consultorios: district.cantidadConsultorios,
      dentistas: district.cantidadDentistas,
      citas: district.cantidadCitas,
      citasUltimoMes: Math.floor(district.cantidadCitas * 0.3),
      promedioConsultoriosPorDentista: district.cantidadDentistas > 0 
        ? Math.round(district.cantidadConsultorios / district.cantidadDentistas * 100) / 100 
        : 0
    };
  }

  async exportDistricts(filters = {}) {
    await delay(1000);
    
    const { data } = await this.getDistricts(filters, { page: 1, limit: 1000 });
    return data;
  }
}

// Instancia singleton del servicio
const districtApiService = new DistrictApiService();

// API pública del servicio
export const districtApi = {
  getDistricts: (filters, pagination) => districtApiService.getDistricts(filters, pagination),
  getDistrictById: (id) => districtApiService.getDistrictById(id),
  createDistrict: (data) => districtApiService.createDistrict(data),
  updateDistrict: (id, data) => districtApiService.updateDistrict(id, data),
  deleteDistrict: (id) => districtApiService.deleteDistrict(id),
  toggleDistrictStatus: (id) => districtApiService.toggleDistrictStatus(id),
  getDistrictStats: () => districtApiService.getDistrictStats(),
  getDistrictStatsById: (id) => districtApiService.getDistrictStatsById(id),
  exportDistricts: (filters) => districtApiService.exportDistricts(filters)
};

export default districtApi;