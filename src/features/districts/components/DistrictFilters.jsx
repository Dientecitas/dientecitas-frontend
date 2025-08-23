import React, { useState, useEffect } from 'react';
import { Search, Filter, X, Download, RotateCcw } from 'lucide-react';
import LoadingButton from '../../../shared/components/ui/LoadingButton';
import Input from '../../../shared/components/ui/Input';
import { useDistrictContext } from '../store/districtContext';
import { ProvinceOptions, RegionOptions, SortOptions, SortOrderOptions } from '../types/district.types';
import { useDistricts } from '../hooks/useDistricts';

const DistrictFilters = () => {
  const {
    filters,
    ui,
    setFilters,
    clearFilters,
    toggleFilters
  } = useDistrictContext();

  const { fetchDistricts, exportDistricts, loading } = useDistricts();

  // Estados locales para los filtros
  const [localFilters, setLocalFilters] = useState(filters);
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Sincronizar filtros locales con el contexto
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Debounce para la búsqueda
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      if (localFilters.search !== filters.search) {
        handleFilterChange('search', localFilters.search);
      }
    }, 300);

    setSearchTimeout(timeout);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [localFilters.search]);

  // Manejar cambios en filtros
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Resetear página al cambiar filtros
    fetchDistricts(newFilters, { page: 1, limit: 10 });
  };

  // Manejar cambio local de búsqueda
  const handleSearchChange = (value) => {
    setLocalFilters(prev => ({ ...prev, search: value }));
  };

  // Limpiar filtros
  const handleClearFilters = () => {
    clearFilters();
    setLocalFilters({
      search: '',
      provincia: '',
      region: '',
      activo: null,
      sortBy: 'nombre',
      sortOrder: 'asc'
    });
    fetchDistricts({
      search: '',
      provincia: '',
      region: '',
      activo: null,
      sortBy: 'nombre',
      sortOrder: 'asc'
    }, { page: 1, limit: 10 });
  };

  // Exportar datos
  const handleExport = async () => {
    await exportDistricts(filters);
  };

  // Obtener regiones disponibles
  const getAvailableRegions = () => {
    if (!filters.provincia) return [];
    return RegionOptions[filters.provincia] || [];
  };

  // Contar filtros activos
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.provincia) count++;
    if (filters.region) count++;
    if (filters.activo !== null) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda y controles principales */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Búsqueda */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar por nombre, descripción o código..."
            value={localFilters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {localFilters.search && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Controles */}
        <div className="flex gap-2">
          <LoadingButton
            variant="outline"
            onClick={toggleFilters}
            className="relative"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtros
            {activeFiltersCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </LoadingButton>

          <LoadingButton
            variant="outline"
            onClick={handleExport}
            loading={loading.export}
            loadingText="Exportando..."
            disabled={loading.export}
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </LoadingButton>
        </div>
      </div>

      {/* Panel de filtros avanzados */}
      {ui.showFilters && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900">Filtros Avanzados</h3>
            <LoadingButton
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              disabled={activeFiltersCount === 0}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Limpiar
            </LoadingButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Provincia */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Provincia
              </label>
              <select
                value={filters.provincia}
                onChange={(e) => {
                  handleFilterChange('provincia', e.target.value);
                  // Limpiar región si no es válida para la nueva provincia
                  if (filters.region && !RegionOptions[e.target.value]?.includes(filters.region)) {
                    handleFilterChange('region', '');
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todas las provincias</option>
                {ProvinceOptions.map(provincia => (
                  <option key={provincia} value={provincia}>
                    {provincia}
                  </option>
                ))}
              </select>
            </div>

            {/* Región */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Región
              </label>
              <select
                value={filters.region}
                onChange={(e) => handleFilterChange('region', e.target.value)}
                disabled={!filters.provincia}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Todas las regiones</option>
                {getAvailableRegions().map(region => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={filters.activo === null ? '' : filters.activo.toString()}
                onChange={(e) => {
                  const value = e.target.value === '' ? null : e.target.value === 'true';
                  handleFilterChange('activo', value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos los estados</option>
                <option value="true">Activos</option>
                <option value="false">Inactivos</option>
              </select>
            </div>

            {/* Ordenamiento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ordenar por
              </label>
              <div className="flex gap-2">
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {SortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <select
                  value={filters.sortOrder}
                  onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {SortOrderOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Resumen de filtros activos */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
              <span className="text-sm text-gray-600">Filtros activos:</span>
              {filters.search && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                  Búsqueda: "{filters.search}"
                  <button
                    onClick={() => handleFilterChange('search', '')}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.provincia && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                  Provincia: {filters.provincia}
                  <button
                    onClick={() => handleFilterChange('provincia', '')}
                    className="ml-1 text-green-600 hover:text-green-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.region && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                  Región: {filters.region}
                  <button
                    onClick={() => handleFilterChange('region', '')}
                    className="ml-1 text-purple-600 hover:text-purple-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.activo !== null && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                  Estado: {filters.activo ? 'Activo' : 'Inactivo'}
                  <button
                    onClick={() => handleFilterChange('activo', null)}
                    className="ml-1 text-orange-600 hover:text-orange-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DistrictFilters;