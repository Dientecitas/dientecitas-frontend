import React, { useState, useEffect } from 'react';
import { Search, Filter, X, Download, RotateCcw, User, Building, Award, Clock } from 'lucide-react';
import LoadingButton from '../../../shared/components/ui/LoadingButton';
import { useDentistContext } from '../store/dentistContext';
import { useDentists } from '../hooks/useDentists';
import { useClinics } from '../../clinics/hooks/useClinics';
import { SpecialtyOptions, SortOptions, SortOrderOptions } from '../types/dentist.types';

const DentistFilters = () => {
  const {
    filters,
    ui,
    setFilters,
    clearFilters,
    toggleFilters
  } = useDentistContext();

  const { fetchDentists, exportDentists, loading, getSearchSuggestions } = useDentists();
  const { clinics, loading: loadingClinics } = useClinics();

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
    fetchDentists(newFilters, { page: 1, limit: 12 });
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
      consultorioId: '',
      especialidades: [],
      añosExperienciaMin: null,
      añosExperienciaMax: null,
      disponibleHoy: false,
      conTurnosLibres: false,
      calificacionMin: null,
      activo: null,
      verificado: null,
      aprobado: null,
      sortBy: 'nombre',
      sortOrder: 'asc'
    });
    fetchDentists({
      search: '',
      consultorioId: '',
      especialidades: [],
      añosExperienciaMin: null,
      añosExperienciaMax: null,
      disponibleHoy: false,
      conTurnosLibres: false,
      calificacionMin: null,
      activo: null,
      verificado: null,
      aprobado: null,
      sortBy: 'nombre',
      sortOrder: 'asc'
    }, { page: 1, limit: 12 });
  };

  // Exportar datos
  const handleExport = async () => {
    await exportDentists(filters);
  };

  // Manejar cambios en arrays (especialidades)
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
    if (filters.consultorioId) count++;
    if (filters.especialidades && filters.especialidades.length > 0) count++;
    if (filters.añosExperienciaMin !== null) count++;
    if (filters.añosExperienciaMax !== null) count++;
    if (filters.disponibleHoy) count++;
    if (filters.conTurnosLibres) count++;
    if (filters.calificacionMin !== null) count++;
    if (filters.activo !== null) count++;
    if (filters.verificado !== null) count++;
    if (filters.aprobado !== null) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();
  const activeClinics = clinics?.filter(c => c.activo) || [];

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda y controles principales */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Búsqueda con sugerencias */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar por nombre, DNI, especialidad, consultorio..."
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
            {/* Consultorio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Building className="w-4 h-4 inline mr-1" />
                Consultorio
              </label>
              <select
                value={filters.consultorioId}
                onChange={(e) => handleFilterChange('consultorioId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loadingClinics}
              >
                <option value="">Todos los consultorios</option>
                {activeClinics.map(consultorio => (
                  <option key={consultorio.id} value={consultorio.id}>
                    {consultorio.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Años de experiencia mínima */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Clock className="w-4 h-4 inline mr-1" />
                Experiencia Mínima
              </label>
              <input
                type="number"
                value={filters.añosExperienciaMin || ''}
                onChange={(e) => handleFilterChange('añosExperienciaMin', e.target.value ? Number(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Años"
                min="0"
                max="50"
              />
            </div>

            {/* Calificación mínima */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Calificación Mínima
              </label>
              <select
                value={filters.calificacionMin || ''}
                onChange={(e) => handleFilterChange('calificacionMin', e.target.value ? Number(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Cualquier calificación</option>
                <option value="4.5">4.5+ estrellas</option>
                <option value="4.0">4.0+ estrellas</option>
                <option value="3.5">3.5+ estrellas</option>
                <option value="3.0">3.0+ estrellas</option>
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
          </div>

          {/* Especialidades */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Award className="w-4 h-4 inline mr-1" />
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.disponibleHoy}
                  onChange={(e) => handleFilterChange('disponibleHoy', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700 flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  Disponible hoy
                </span>
              </label>
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.conTurnosLibres}
                  onChange={(e) => handleFilterChange('conTurnosLibres', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Con turnos libres
                </span>
              </label>
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.verificado === true}
                  onChange={(e) => handleFilterChange('verificado', e.target.checked ? true : null)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Solo verificados
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
              {filters.consultorioId && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                  Consultorio: {activeClinics.find(c => c.id === filters.consultorioId)?.nombre}
                  <button
                    onClick={() => handleFilterChange('consultorioId', '')}
                    className="ml-1 text-green-600 hover:text-green-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.especialidades && filters.especialidades.length > 0 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                  {filters.especialidades.length} especialidad{filters.especialidades.length > 1 ? 'es' : ''}
                  <button
                    onClick={() => handleFilterChange('especialidades', [])}
                    className="ml-1 text-purple-600 hover:text-purple-800"
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

export default DentistFilters;