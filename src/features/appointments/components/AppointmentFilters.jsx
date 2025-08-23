import React, { useState } from 'react';
import { Search, Filter, X, Calendar, User, MapPin, Clock, DollarSign } from 'lucide-react';
import { useAppointmentContext } from '../store/appointmentContext';
import { AppointmentStatusOptions, AppointmentTypeOptions, PriorityOptions } from '../types/appointment.types';
import LoadingButton from '../../../shared/components/ui/LoadingButton';
import Card from '../../../shared/components/ui/Card';

const AppointmentFilters = () => {
  const { filters, setFilters, clearFilters } = useAppointmentContext();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value
    });
  };

  const handleArrayFilterChange = (key, value, checked) => {
    const currentArray = filters[key] || [];
    if (checked) {
      handleFilterChange(key, [...currentArray, value]);
    } else {
      handleFilterChange(key, currentArray.filter(item => item !== value));
    }
  };

  const handleClearFilters = () => {
    clearFilters();
    setShowAdvanced(false);
  };

  const hasActiveFilters = Object.values(filters).some(value => {
    if (Array.isArray(value)) return value.length > 0;
    return value !== '' && value !== null && value !== undefined;
  });

  return (
    <Card className="mb-6">
      <div className="space-y-4">
        {/* Filtros básicos */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Búsqueda general */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por paciente, dentista..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Fecha desde */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="date"
              value={filters.fechaDesde || ''}
              onChange={(e) => handleFilterChange('fechaDesde', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Fecha hasta */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="date"
              value={filters.fechaHasta || ''}
              onChange={(e) => handleFilterChange('fechaHasta', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Estados */}
          <select
            value={filters.estado || ''}
            onChange={(e) => handleFilterChange('estado', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos los estados</option>
            {AppointmentStatusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Botones de control */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LoadingButton
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <Filter className="w-4 h-4 mr-2" />
              {showAdvanced ? 'Ocultar filtros' : 'Más filtros'}
            </LoadingButton>

            {hasActiveFilters && (
              <LoadingButton
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
              >
                <X className="w-4 h-4 mr-2" />
                Limpiar filtros
              </LoadingButton>
            )}
          </div>

          <div className="text-sm text-gray-500">
            {hasActiveFilters && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Filtros activos
              </span>
            )}
          </div>
        </div>

        {/* Filtros avanzados */}
        {showAdvanced && (
          <div className="border-t pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Tipo de consulta */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Consulta
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {AppointmentTypeOptions.map(option => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(filters.tiposConsulta || []).includes(option.value)}
                        onChange={(e) => handleArrayFilterChange('tiposConsulta', option.value, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Prioridades */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prioridad
                </label>
                <div className="space-y-2">
                  {PriorityOptions.map(option => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(filters.prioridades || []).includes(option.value)}
                        onChange={(e) => handleArrayFilterChange('prioridades', option.value, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Estados de pago */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado de Pago
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'pendiente', label: 'Pendiente' },
                    { value: 'parcial', label: 'Parcial' },
                    { value: 'pagado', label: 'Pagado' },
                    { value: 'reembolsado', label: 'Reembolsado' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(filters.estadosPago || []).includes(option.value)}
                        onChange={(e) => handleArrayFilterChange('estadosPago', option.value, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Filtros de rango */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Rango de duración */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="inline w-4 h-4 mr-1" />
                  Duración (minutos)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Mín"
                    value={filters.duracionMinima || ''}
                    onChange={(e) => handleFilterChange('duracionMinima', e.target.value ? parseInt(e.target.value) : '')}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Máx"
                    value={filters.duracionMaxima || ''}
                    onChange={(e) => handleFilterChange('duracionMaxima', e.target.value ? parseInt(e.target.value) : '')}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Rango de valor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="inline w-4 h-4 mr-1" />
                  Valor (S/)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Mín"
                    value={filters.valorMinimo || ''}
                    onChange={(e) => handleFilterChange('valorMinimo', e.target.value ? parseFloat(e.target.value) : '')}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Máx"
                    value={filters.valorMaximo || ''}
                    onChange={(e) => handleFilterChange('valorMaximo', e.target.value ? parseFloat(e.target.value) : '')}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Filtros adicionales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Pacientes (placeholder - en implementación real sería un select con datos) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline w-4 h-4 mr-1" />
                  Paciente
                </label>
                <input
                  type="text"
                  placeholder="Buscar paciente..."
                  value={filters.pacienteSearch || ''}
                  onChange={(e) => handleFilterChange('pacienteSearch', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Dentistas (placeholder) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline w-4 h-4 mr-1" />
                  Dentista
                </label>
                <input
                  type="text"
                  placeholder="Buscar dentista..."
                  value={filters.dentistaSearch || ''}
                  onChange={(e) => handleFilterChange('dentistaSearch', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Consultorios (placeholder) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline w-4 h-4 mr-1" />
                  Consultorio
                </label>
                <input
                  type="text"
                  placeholder="Buscar consultorio..."
                  value={filters.consultorioSearch || ''}
                  onChange={(e) => handleFilterChange('consultorioSearch', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Filtros booleanos */}
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.conSeguimiento || false}
                  onChange={(e) => handleFilterChange('conSeguimiento', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Con seguimiento</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.conEncuesta || false}
                  onChange={(e) => handleFilterChange('conEncuesta', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Con encuesta</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.soloUrgentes || false}
                  onChange={(e) => handleFilterChange('soloUrgentes', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Solo urgentes</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AppointmentFilters;