import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    return format(parseISO(dateString), 'dd/MM/yyyy', { locale: es });
  } catch (error) {
    return dateString;
  }
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  try {
    return format(parseISO(dateString), 'dd/MM/yyyy HH:mm', { locale: es });
  } catch (error) {
    return dateString;
  }
};

export const formatNumber = (number) => {
  if (typeof number !== 'number') return '0';
  return new Intl.NumberFormat('es-PE').format(number);
};

export const generateDistrictCode = (nombre, provincia) => {
  const provinceCode = provincia.substring(0, 2).toUpperCase();
  const randomNumber = Math.floor(Math.random() * 900) + 100;
  return `${provinceCode}-${randomNumber}`;
};

export const validateDistrictCode = (codigo) => {
  const pattern = /^[A-Z]{2}-\d{3}$/;
  return pattern.test(codigo);
};

export const getDistrictStatusColor = (activo) => {
  return activo ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
};

export const getDistrictStatusText = (activo) => {
  return activo ? 'Activo' : 'Inactivo';
};

export const calculateDistrictStats = (districts) => {
  const total = districts.length;
  const activos = districts.filter(d => d.activo).length;
  const inactivos = total - activos;
  const totalConsultorios = districts.reduce((sum, d) => sum + (d.cantidadConsultorios || 0), 0);
  const totalDentistas = districts.reduce((sum, d) => sum + (d.cantidadDentistas || 0), 0);
  const promedioConsultorios = total > 0 ? Math.round(totalConsultorios / total * 100) / 100 : 0;

  return {
    totalDistritos: total,
    distritosActivos: activos,
    distritosInactivos: inactivos,
    totalConsultorios,
    totalDentistas,
    promedioConsultoriosPorDistrito: promedioConsultorios
  };
};

export const filterDistricts = (districts, filters) => {
  return districts.filter(district => {
    // Filtro de búsqueda
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        district.nombre.toLowerCase().includes(searchLower) ||
        district.descripcion.toLowerCase().includes(searchLower) ||
        district.codigo.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Filtro por provincia
    if (filters.provincia && district.provincia !== filters.provincia) {
      return false;
    }

    // Filtro por región
    if (filters.region && district.region !== filters.region) {
      return false;
    }

    // Filtro por estado
    if (filters.activo !== null && district.activo !== filters.activo) {
      return false;
    }

    return true;
  });
};

export const sortDistricts = (districts, sortBy, sortOrder) => {
  return [...districts].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    // Manejar diferentes tipos de datos
    if (sortBy === 'fechaCreacion') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    } else if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) {
      return sortOrder === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

export const exportDistrictsToCSV = (districts) => {
  const headers = [
    'Código',
    'Nombre',
    'Descripción',
    'Provincia',
    'Región',
    'Población',
    'Estado',
    'Consultorios',
    'Dentistas',
    'Fecha Creación'
  ];

  const csvContent = [
    headers.join(','),
    ...districts.map(district => [
      district.codigo,
      `"${district.nombre}"`,
      `"${district.descripcion}"`,
      district.provincia,
      district.region,
      district.poblacion || 0,
      district.activo ? 'Activo' : 'Inactivo',
      district.cantidadConsultorios || 0,
      district.cantidadDentistas || 0,
      formatDate(district.fechaCreacion)
    ].join(','))
  ].join('\n');

  return csvContent;
};