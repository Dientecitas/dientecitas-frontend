import React, { useState, useEffect } from 'react';
import { Search, Filter, X, Download, RotateCcw, MapPin, Building, Users, Clock } from 'lucide-react';
import LoadingButton from '../../../shared/components/ui/LoadingButton';
import { useClinicContext } from '../store/clinicContext';
import { useClinics } from '../hooks/useClinics';
import { useDistricts } from '../../districts/hooks/useDistricts';
import { ServiceOptions, SpecialtyOptions, SortOptions, SortOrderOptions } from '../types/clinic.types';

const ClinicFilters = () => {
  const {
    filters,
    ui,
    setFilters,
    clearFilters,
    toggleFilters
  } = useClinicContext();

  const { fetchClinics, exportClinics, loading, getSearchSuggestions } = useClinics();
  const { districts, loading: loadingDistricts } = useDistricts();

  // Estados locales para los filtros
  const [localFilters, setLocalFilters] = useState(filters);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

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

  // Obtener sugerencias de búsqueda
  useEffect(() => {
    const getSuggestions = async () => {
      if (localFilters.search && localFilters.search.length >= 2) {
        try {
          const suggestions = await getSearchSuggestions(localFilters.search);
          setSearchSuggestions(suggestions);
          setShowSuggestions(true);
        } catch (error) {
          setSearchSuggestions([]);
        }
      } else {
        setSearchSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(getSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [localFilters.search, getSearchSuggestions]);

  // Manejar cambios en filtros
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Resetear página al cambiar filtros
    fetchClinics(newFilters, { page: 1, limit: 12 });
  };

  // Manejar cambio local de búsqueda
  const handleSearchChange = (value) => {
    setLocalFilters(prev => ({ ...prev, search: value }));
  };

  // Manejar selección de sugerencia
  const handleSuggestionSelect = (suggestion) => {
    setLocalFilters(prev => ({ ...prev, search: suggestion.value }));
    setShowSuggestions(false);
    handleFilterChange('search', suggestion.value);
  };

  // Limpiar filtros
  const handleClearFilters = () => {
    clearFilters();
    setLocalFilters({
      search: '',
      distritoId: '',
      tipoClinica: '',
      servicios: [],
      especialidades: [],
      activo: null,
      verificado: null,
      conDentistasDisponibles: false,
      conTurnosHoy: false,
      sortBy: 'nombre',
      sortOrder: 'asc'
    });
    fetchClinics({
      search: '',
      distritoId: '',
      tipoClinica: '',
      servicios: [],
      especialidades: [],
      activo: null,
      verificado: null,
      conDentistasDisponibles: false,
      conTurnosHoy: false,
      sortBy: 'nombre',
      sortOrder: 'asc'
    }, { page: 1, limit: 12 });
  };

  // Exportar datos
  const handleExport = async () => {
    await exportClinics(filters);
  };

  // Manejar cambios en arrays (servicios, especialidades)
  const handleArrayChange = (key, value, checked) => {
    const currentArray = filters[key] || [];
    let newArray;
    
    if (checked) {
      newArray = [...currentArray, value];
    } else {
      newArray = currentArray.filter(item => item !== value);
    }
    
    handleFilterChange(key, newArray);
  };

  // Contar filtros activos
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.distritoId) count++;
    if (filters.tipoClinica) count++;
    if (filters.servicios && filters.servicios.length > 0) count++;
    if (filters.especialidades && filters.especialidades.length > 0) count++;
    if (filters.activo !== null) count++;
    if (filters.verificado !== null) count++;
    if (filters.conDentistasDisponibles) count++;
    if (filters.conTurnosHoy) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda y controles principales */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Búsqueda con sugerencias */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar por nombre, dirección, servicios..."
            value={localFilters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => setShowSuggestions(searchSuggestions.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
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

          {/* Sugerencias de búsqueda */}
          {showSuggestions && searchSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
              {searchSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionSelect(suggestion)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center"
                >
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {suggestion.label}
                    </div>
                    {suggestion.subtitle && (
                      <div className="text-xs text-gray-500">
                        {suggestion.subtitle}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 capitalize">
                    {suggestion.type}
                  </div>
                </button>
              ))}
            </div>
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
            {/* Distrito */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MapPin className="w-4 h-4 inline mr-1" />
                Distrito
              </label>
              <select
                value={filters.distritoId}
                onChange={(e) => handleFilterChange('distritoId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loadingDistricts}
              >
                <option value="">Todos los distritos</option>
                {districts.filter(d => d.activo).map(distrito => (
                  <option key={distrito.id} value={distrito.id}>
                    {distrito.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Tipo de clínica */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Building className="w-4 h-4 inline mr-1" />
                Tipo de Clínica
              </label>
              <select
                value={filters.tipoClinica}
                onChange={(e) => handleFilterChange('tipoClinica', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos los tipos</option>
                <option value="publica">Pública</option>
                <option value="privada">Privada</option>
                <option value="mixta">Mixta</option>
              </select>
            </div>

            {/* Estado activo */}
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

            {/* Verificado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Verificación
              </label>
              <select
                value={filters.verificado === null ? '' : filters.verificado.toString()}
                onChange={(e) => {
                  const value = e.target.value === '' ? null : e.target.value === 'true';
                  handleFilterChange('verificado', value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos</option>
                <option value="true">Verificados</option>
                <option value="false">Pendientes</option>
              </select>
            </div>
          </div>

          {/* Servicios */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Servicios
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-32 overflow-y-auto">
              {ServiceOptions.map(servicio => (
                <label key={servicio} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.servicios?.includes(servicio) || false}
                    onChange={(e) => handleArrayChange('servicios', servicio, e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{servicio}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Especialidades */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Especialidades
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-32 overflow-y-auto">
              {SpecialtyOptions.map(especialidad => (
                <label key={especialidad} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.especialidades?.includes(especialidad) || false}
                    onChange={(e) => handleArrayChange('especialidades', especialidad, e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{especialidad}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Filtros de disponibilidad */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.conDentistasDisponibles}
                  onChange={(e) => handleFilterChange('conDentistasDisponibles', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700 flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  Con dentistas disponibles
                </span>
              </label>
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.conTurnosHoy}
                  onChange={(e) => handleFilterChange('conTurnosHoy', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Con turnos disponibles hoy
                </span>
              </label>
            </div>
          </div>

          {/* Ordenamiento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ordenar por
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {SortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Orden
              </label>
              <select
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {SortOrderOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
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
              {filters.distritoId && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                  Distrito: {districts.find(d => d.id === filters.distritoId)?.nombre}
                  <button
                    onClick={() => handleFilterChange('distritoId', '')}
                    className="ml-1 text-green-600 hover:text-green-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.tipoClinica && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                  Tipo: {filters.tipoClinica === 'publica' ? 'Pública' : filters.tipoClinica === 'privada' ? 'Privada' : 'Mixta'}
                  <button
                    onClick={() => handleFilterChange('tipoClinica', '')}
                    className="ml-1 text-purple-600 hover:text-purple-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.servicios && filters.servicios.length > 0 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                  {filters.servicios.length} servicio{filters.servicios.length > 1 ? 's' : ''}
                  <button
                    onClick={() => handleFilterChange('servicios', [])}
                    className="ml-1 text-orange-600 hover:text-orange-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.especialidades && filters.especialidades.length > 0 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-pink-100 text-pink-800">
                  {filters.especialidades.length} especialidad{filters.especialidades.length > 1 ? 'es' : ''}
                  <button
                    onClick={() => handleFilterChange('especialidades', [])}
                    className="ml-1 text-pink-600 hover:text-pink-800"
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

export default ClinicFilters;