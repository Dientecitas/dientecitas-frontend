import React, { useState, useEffect } from 'react';
import { Search, Filter, X, Download, RotateCcw, User, Building, Heart, Calendar, Shield } from 'lucide-react';
import LoadingButton from '../../../shared/components/ui/LoadingButton';
import { usePatientContext } from '../store/patientContext';
import { usePatients } from '../hooks/usePatients';
import { useClinics } from '../../clinics/hooks/useClinics';
import { useDentists } from '../../dentists/hooks/useDentists';
import { GenderOptions, SortOptions, SortOrderOptions, InsuranceProviders } from '../types/patient.types';

const PatientFilters = () => {
  const {
    filters,
    ui,
    setFilters,
    clearFilters,
    toggleFilters
  } = usePatientContext();

  const { fetchPatients, exportPatients, loading, getSearchSuggestions } = usePatients();
  const { clinics, loading: loadingClinics } = useClinics();
  const { dentists, loading: loadingDentists } = useDentists();

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
    fetchPatients(newFilters, { page: 1, limit: 12 });
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
      consultorio: '',
      dentista: '',
      distrito: '',
      edadMin: null,
      edadMax: null,
      genero: '',
      tieneSeguro: null,
      activo: null,
      verificado: null,
      registroCompleto: null,
      ultimaCitaDesde: '',
      ultimaCitaHasta: '',
      riesgoOdontologico: [],
      estadoCitas: 'todos',
      origenRegistro: '',
      sortBy: 'nombre',
      sortOrder: 'asc'
    });
    fetchPatients({
      search: '',
      consultorio: '',
      dentista: '',
      distrito: '',
      edadMin: null,
      edadMax: null,
      genero: '',
      tieneSeguro: null,
      activo: null,
      verificado: null,
      registroCompleto: null,
      ultimaCitaDesde: '',
      ultimaCitaHasta: '',
      riesgoOdontologico: [],
      estadoCitas: 'todos',
      origenRegistro: '',
      sortBy: 'nombre',
      sortOrder: 'asc'
    }, { page: 1, limit: 12 });
  };

  // Exportar datos
  const handleExport = async () => {
    await exportPatients(filters);
  };

  // Contar filtros activos
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.consultorio) count++;
    if (filters.dentista) count++;
    if (filters.distrito) count++;
    if (filters.edadMin !== null) count++;
    if (filters.edadMax !== null) count++;
    if (filters.genero) count++;
    if (filters.tieneSeguro !== null) count++;
    if (filters.activo !== null) count++;
    if (filters.verificado !== null) count++;
    if (filters.registroCompleto !== null) count++;
    if (filters.ultimaCitaDesde) count++;
    if (filters.ultimaCitaHasta) count++;
    if (filters.riesgoOdontologico && filters.riesgoOdontologico.length > 0) count++;
    if (filters.estadoCitas !== 'todos') count++;
    if (filters.origenRegistro) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();
  const activeClinics = clinics?.filter(c => c.activo) || [];
  const activeDentists = dentists?.filter(d => d.activo) || [];

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda y controles principales */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Búsqueda con sugerencias */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar por nombre, DNI, teléfono, email..."
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
                value={filters.consultorio}
                onChange={(e) => handleFilterChange('consultorio', e.target.value)}
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

            {/* Dentista */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <User className="w-4 h-4 inline mr-1" />
                Dentista
              </label>
              <select
                value={filters.dentista}
                onChange={(e) => handleFilterChange('dentista', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loadingDentists}
              >
                <option value="">Todos los dentistas</option>
                {activeDentists.map(dentista => (
                  <option key={dentista.id} value={dentista.id}>
                    Dr. {dentista.nombres} {dentista.apellidos}
                  </option>
                ))}
              </select>
            </div>

            {/* Género */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Género
              </label>
              <select
                value={filters.genero}
                onChange={(e) => handleFilterChange('genero', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos los géneros</option>
                {GenderOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
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

          {/* Filtros de edad */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Edad Mínima
              </label>
              <input
                type="number"
                value={filters.edadMin || ''}
                onChange={(e) => handleFilterChange('edadMin', e.target.value ? Number(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
                min="0"
                max="120"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Edad Máxima
              </label>
              <input
                type="number"
                value={filters.edadMax || ''}
                onChange={(e) => handleFilterChange('edadMax', e.target.value ? Number(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="120"
                min="0"
                max="120"
              />
            </div>
          </div>

          {/* Filtros médicos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.tieneSeguro === true}
                  onChange={(e) => handleFilterChange('tieneSeguro', e.target.checked ? true : null)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700 flex items-center">
                  <Shield className="w-4 h-4 mr-1" />
                  Con seguro médico
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
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.registroCompleto === true}
                  onChange={(e) => handleFilterChange('registroCompleto', e.target.checked ? true : null)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Registro completo
                </span>
              </label>
            </div>
          </div>

          {/* Filtros de fechas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="w-4 h-4 inline mr-1" />
                Última Cita Desde
              </label>
              <input
                type="date"
                value={filters.ultimaCitaDesde}
                onChange={(e) => handleFilterChange('ultimaCitaDesde', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Última Cita Hasta
              </label>
              <input
                type="date"
                value={filters.ultimaCitaHasta}
                onChange={(e) => handleFilterChange('ultimaCitaHasta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Riesgo odontológico */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Heart className="w-4 h-4 inline mr-1" />
              Riesgo Odontológico
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { range: [1, 2], label: 'Bajo (1-2)', color: 'green' },
                { range: [3, 4], label: 'Medio (3-4)', color: 'yellow' },
                { range: [5, 7], label: 'Alto (5-7)', color: 'orange' },
                { range: [8, 10], label: 'Crítico (8-10)', color: 'red' }
              ].map(risk => (
                <label key={risk.label} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.riesgoOdontologico?.toString() === risk.range.toString()}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleFilterChange('riesgoOdontologico', risk.range);
                      } else {
                        handleFilterChange('riesgoOdontologico', []);
                      }
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className={`ml-2 text-sm text-${risk.color}-700`}>{risk.label}</span>
                </label>
              ))}
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
              {filters.consultorio && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                  Consultorio: {activeClinics.find(c => c.id === filters.consultorio)?.nombre}
                  <button
                    onClick={() => handleFilterChange('consultorio', '')}
                    className="ml-1 text-green-600 hover:text-green-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.dentista && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                  Dentista: Dr. {activeDentists.find(d => d.id === filters.dentista)?.nombres}
                  <button
                    onClick={() => handleFilterChange('dentista', '')}
                    className="ml-1 text-purple-600 hover:text-purple-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.genero && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-pink-100 text-pink-800">
                  Género: {GenderOptions.find(g => g.value === filters.genero)?.label}
                  <button
                    onClick={() => handleFilterChange('genero', '')}
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

export default PatientFilters;