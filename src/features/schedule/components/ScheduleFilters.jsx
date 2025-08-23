import React, { useState, useEffect } from 'react';
import { Search, Filter, X, Download, RotateCcw, Calendar, Clock, Users, Building } from 'lucide-react';
import LoadingButton from '../../../shared/components/ui/LoadingButton';
import { useScheduleContext } from '../store/scheduleContext';
import { useSchedule } from '../hooks/useSchedule';
import { useDentists } from '../../dentists/hooks/useDentists';
import { useClinics } from '../../clinics/hooks/useClinics';
import { AppointmentTypeOptions, SortOptions, SortOrderOptions } from '../types/schedule.types';

const ScheduleFilters = () => {
  const {
    filters,
    ui,
    setFilters,
    clearFilters,
    toggleFilters
  } = useScheduleContext();

  const { fetchTimeSlots, loading } = useSchedule();
  const { dentists, loading: loadingDentists } = useDentists();
  const { clinics, loading: loadingClinics } = useClinics();

  // Estados locales para los filtros
  const [localFilters, setLocalFilters] = useState(filters);
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Sincronizar filtros locales con el contexto
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Debounce para aplicar filtros
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      if (JSON.stringify(localFilters) !== JSON.stringify(filters)) {
        handleFiltersChange(localFilters);
      }
    }, 300);

    setSearchTimeout(timeout);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [localFilters]);

  // Manejar cambios en filtros
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    fetchTimeSlots(newFilters, { page: 1, limit: 20 });
  };

  // Manejar cambio local de filtros
  const handleLocalFilterChange = (field, value) => {
    setLocalFilters(prev => ({ ...prev, [field]: value }));
  };

  // Limpiar filtros
  const handleClearFilters = () => {
    const clearedFilters = {
      fechaDesde: '',
      fechaHasta: '',
      dentistas: [],
      consultorios: [],
      distritos: [],
      estados: [],
      tiposTurno: [],
      duracionMin: null,
      duracionMax: null,
      horaInicioDesde: '',
      horaInicioHasta: '',
      soloRecurrentes: false,
      conCapacidadDisponible: false,
      precioMin: null,
      precioMax: null,
      serviciosPermitidos: [],
      sortBy: 'fecha',
      sortOrder: 'asc',
      groupBy: null
    };
    
    clearFilters();
    setLocalFilters(clearedFilters);
    fetchTimeSlots(clearedFilters, { page: 1, limit: 20 });
  };

  // Manejar cambios en arrays
  const handleArrayChange = (field, value, checked) => {
    const currentArray = localFilters[field] || [];
    let newArray;
    
    if (checked) {
      newArray = [...currentArray, value];
    } else {
      newArray = currentArray.filter(item => item !== value);
    }
    
    handleLocalFilterChange(field, newArray);
  };

  // Contar filtros activos
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.fechaDesde) count++;
    if (filters.fechaHasta) count++;
    if (filters.dentistas && filters.dentistas.length > 0) count++;
    if (filters.consultorios && filters.consultorios.length > 0) count++;
    if (filters.estados && filters.estados.length > 0) count++;
    if (filters.tiposTurno && filters.tiposTurno.length > 0) count++;
    if (filters.duracionMin) count++;
    if (filters.duracionMax) count++;
    if (filters.horaInicioDesde) count++;
    if (filters.horaInicioHasta) count++;
    if (filters.soloRecurrentes) count++;
    if (filters.conCapacidadDisponible) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();
  const activeDentists = dentists?.filter(d => d.activo) || [];
  const activeClinics = clinics?.filter(c => c.activo) || [];

  return (
    <div className="space-y-4">
      {/* Controles principales */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Selector de fecha específica */}
        <div className="flex items-center gap-4">
          <Calendar className="w-4 h-4 text-gray-400" />
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Ir a fecha:</label>
            <input
              type="date"
              value={localFilters.fechaEspecifica || ''}
              onChange={(e) => {
                handleLocalFilterChange('fechaEspecifica', e.target.value);
                // Auto-aplicar cuando se selecciona una fecha específica
                if (e.target.value) {
                  handleFiltersChange({
                    ...localFilters,
                    fechaEspecifica: e.target.value,
                    fechaDesde: e.target.value,
                    fechaHasta: e.target.value
                  });
                }
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Rango de fechas */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">o rango:</span>
          <input
            type="date"
            value={localFilters.fechaDesde}
            onChange={(e) => handleLocalFilterChange('fechaDesde', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Fecha desde"
          />
          <span className="text-gray-500">hasta</span>
          <input
            type="date"
            value={localFilters.fechaHasta}
            onChange={(e) => handleLocalFilterChange('fechaHasta', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Fecha hasta"
          />
        </div>

        {/* Presets de fecha */}
        <div className="flex items-center gap-2">
          <LoadingButton
            variant="outline"
            size="sm"
            onClick={() => {
              const today = new Date().toISOString().split('T')[0];
              const filters = {
                ...localFilters,
                fechaEspecifica: today,
                fechaDesde: today,
                fechaHasta: today
              };
              setLocalFilters(filters);
              handleFiltersChange(filters);
            }}
          >
            Hoy
          </LoadingButton>
          
          <LoadingButton
            variant="outline"
            size="sm"
            onClick={() => {
              const today = new Date();
              const startOfWeek = new Date(today);
              const day = today.getDay();
              const diff = today.getDate() - day + (day === 0 ? -6 : 1);
              startOfWeek.setDate(diff);
              
              const endOfWeek = new Date(startOfWeek);
              endOfWeek.setDate(startOfWeek.getDate() + 6);
              
              const filters = {
                ...localFilters,
                fechaEspecifica: '',
                fechaDesde: startOfWeek.toISOString().split('T')[0],
                fechaHasta: endOfWeek.toISOString().split('T')[0]
              };
              setLocalFilters(filters);
              handleFiltersChange(filters);
            }}
          >
            Esta Semana
          </LoadingButton>
          
          <LoadingButton
            variant="outline"
            size="sm"
            onClick={() => {
              const today = new Date();
              const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
              const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
              
              const filters = {
                ...localFilters,
                fechaEspecifica: '',
                fechaDesde: startOfMonth.toISOString().split('T')[0],
                fechaHasta: endOfMonth.toISOString().split('T')[0]
              };
              setLocalFilters(filters);
              handleFiltersChange(filters);
            }}
          >
            Este Mes
          </LoadingButton>
        </div>

        {/* Controles */}
        <div className="flex gap-2 ml-auto">
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
            onClick={() => {/* Implementar export */}}
            loading={loading.export}
            loadingText="Exportando..."
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
            {/* Dentistas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Users className="w-4 h-4 inline mr-1" />
                Dentistas
              </label>
              <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-2">
                {activeDentists.map(dentista => (
                  <label key={dentista.id} className="flex items-center py-1">
                    <input
                      type="checkbox"
                      checked={localFilters.dentistas.includes(dentista.id)}
                      onChange={(e) => handleArrayChange('dentistas', dentista.id, e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Dr. {dentista.nombres} {dentista.apellidos}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Consultorios */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Building className="w-4 h-4 inline mr-1" />
                Consultorios
              </label>
              <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-2">
                {activeClinics.map(consultorio => (
                  <label key={consultorio.id} className="flex items-center py-1">
                    <input
                      type="checkbox"
                      checked={localFilters.consultorios.includes(consultorio.id)}
                      onChange={(e) => handleArrayChange('consultorios', consultorio.id, e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {consultorio.nombre}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Estados */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estados
              </label>
              <div className="space-y-1">
                {[
                  { value: 'disponible', label: 'Disponible' },
                  { value: 'reservado', label: 'Reservado' },
                  { value: 'ocupado', label: 'Ocupado' },
                  { value: 'bloqueado', label: 'Bloqueado' }
                ].map(estado => (
                  <label key={estado.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={localFilters.estados.includes(estado.value)}
                      onChange={(e) => handleArrayChange('estados', estado.value, e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{estado.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tipos de turno */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipos de Turno
              </label>
              <div className="space-y-1">
                {AppointmentTypeOptions.map(tipo => (
                  <label key={tipo.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={localFilters.tiposTurno.includes(tipo.value)}
                      onChange={(e) => handleArrayChange('tiposTurno', tipo.value, e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{tipo.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Filtros de tiempo */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Clock className="w-4 h-4 inline mr-1" />
                Hora Inicio Desde
              </label>
              <input
                type="time"
                value={localFilters.horaInicioDesde}
                onChange={(e) => handleLocalFilterChange('horaInicioDesde', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora Inicio Hasta
              </label>
              <input
                type="time"
                value={localFilters.horaInicioHasta}
                onChange={(e) => handleLocalFilterChange('horaInicioHasta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duración Mínima (min)
              </label>
              <input
                type="number"
                value={localFilters.duracionMin || ''}
                onChange={(e) => handleLocalFilterChange('duracionMin', e.target.value ? Number(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="15"
                step="15"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duración Máxima (min)
              </label>
              <input
                type="number"
                value={localFilters.duracionMax || ''}
                onChange={(e) => handleLocalFilterChange('duracionMax', e.target.value ? Number(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="15"
                step="15"
              />
            </div>
          </div>

          {/* Filtros especiales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={localFilters.soloRecurrentes}
                  onChange={(e) => handleLocalFilterChange('soloRecurrentes', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Solo turnos recurrentes
                </span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={localFilters.conCapacidadDisponible}
                  onChange={(e) => handleLocalFilterChange('conCapacidadDisponible', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Con capacidad disponible
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
                value={localFilters.sortBy}
                onChange={(e) => handleLocalFilterChange('sortBy', e.target.value)}
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
                value={localFilters.sortOrder}
                onChange={(e) => handleLocalFilterChange('sortOrder', e.target.value)}
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
              {filters.fechaDesde && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                  Desde: {filters.fechaDesde}
                  <button
                    onClick={() => handleLocalFilterChange('fechaDesde', '')}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.fechaHasta && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                  Hasta: {filters.fechaHasta}
                  <button
                    onClick={() => handleLocalFilterChange('fechaHasta', '')}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.dentistas && filters.dentistas.length > 0 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                  {filters.dentistas.length} dentista{filters.dentistas.length > 1 ? 's' : ''}
                  <button
                    onClick={() => handleLocalFilterChange('dentistas', [])}
                    className="ml-1 text-green-600 hover:text-green-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.estados && filters.estados.length > 0 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                  {filters.estados.length} estado{filters.estados.length > 1 ? 's' : ''}
                  <button
                    onClick={() => handleLocalFilterChange('estados', [])}
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

export default ScheduleFilters;