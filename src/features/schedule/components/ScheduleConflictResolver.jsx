import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, X, Wand2, Clock, Users } from 'lucide-react';
import Card from '../../../shared/components/ui/Card';
import LoadingButton from '../../../shared/components/ui/LoadingButton';
import { useScheduleConflicts } from '../hooks/useScheduleConflicts';
import { formatDate, formatTime } from '../utils/scheduleHelpers';

const ScheduleConflictResolver = ({ conflicts, onResolve, onCancel }) => {
  const {
    resolveConflict,
    getResolutionSuggestions,
    validateResolution,
    loading
  } = useScheduleConflicts();

  const [selectedConflict, setSelectedConflict] = useState(null);
  const [resolutionSuggestions, setResolutionSuggestions] = useState([]);
  const [selectedResolution, setSelectedResolution] = useState(null);

  // Cargar sugerencias cuando se selecciona un conflicto
  useEffect(() => {
    if (selectedConflict) {
      getResolutionSuggestions(selectedConflict.id).then(suggestions => {
        setResolutionSuggestions(suggestions);
      });
    }
  }, [selectedConflict, getResolutionSuggestions]);

  // Obtener color del tipo de conflicto
  const getConflictTypeColor = (type) => {
    switch (type) {
      case 'TIME_OVERLAP':
        return 'text-red-600 bg-red-100';
      case 'CAPACITY_EXCEEDED':
        return 'text-orange-600 bg-orange-100';
      case 'RESOURCE_CONFLICT':
        return 'text-yellow-600 bg-yellow-100';
      case 'BUSINESS_RULE_VIOLATION':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Obtener texto del tipo de conflicto
  const getConflictTypeText = (type) => {
    switch (type) {
      case 'TIME_OVERLAP':
        return 'Solapamiento de Horarios';
      case 'CAPACITY_EXCEEDED':
        return 'Capacidad Excedida';
      case 'RESOURCE_CONFLICT':
        return 'Conflicto de Recursos';
      case 'BUSINESS_RULE_VIOLATION':
        return 'Violación de Reglas';
      default:
        return 'Conflicto Desconocido';
    }
  };

  // Manejar resolución de conflicto
  const handleResolveConflict = async (conflictId, resolution) => {
    try {
      const result = await resolveConflict(conflictId, resolution);
      if (result.success) {
        onResolve();
      }
    } catch (error) {
      console.error('Error resolving conflict:', error);
    }
  };

  // Resolver todos los conflictos automáticamente
  const handleAutoResolveAll = async () => {
    try {
      for (const conflict of conflicts) {
        const suggestions = await getResolutionSuggestions(conflict.id);
        if (suggestions.length > 0) {
          const bestSuggestion = suggestions[0]; // Tomar la mejor sugerencia
          await resolveConflict(conflict.id, bestSuggestion);
        }
      }
      onResolve();
    } catch (error) {
      console.error('Error auto-resolving conflicts:', error);
    }
  };

  if (!conflicts || conflicts.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay conflictos detectados
          </h3>
          <p className="text-gray-600">
            Todos los turnos están correctamente configurados
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con resumen */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {conflicts.length} Conflicto{conflicts.length > 1 ? 's' : ''} Detectado{conflicts.length > 1 ? 's' : ''}
              </h3>
              <p className="text-sm text-gray-600">
                Selecciona un conflicto para ver opciones de resolución
              </p>
            </div>
          </div>
          <LoadingButton
            onClick={handleAutoResolveAll}
            loading={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Wand2 className="w-4 h-4 mr-2" />
            Resolver Automáticamente
          </LoadingButton>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista de conflictos */}
        <Card title="Lista de Conflictos">
          <div className="space-y-3">
            {conflicts.map((conflict, index) => (
              <div
                key={conflict.id || index}
                onClick={() => setSelectedConflict(conflict)}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedConflict?.id === conflict.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConflictTypeColor(conflict.type)}`}>
                        {getConflictTypeText(conflict.type)}
                      </span>
                      <span className="text-xs text-gray-500">
                        Prioridad: {conflict.priority || 'Media'}
                      </span>
                    </div>
                    
                    <h4 className="font-medium text-gray-900 mb-1">
                      {conflict.message || 'Conflicto detectado'}
                    </h4>
                    
                    {conflict.affectedSlots && (
                      <p className="text-sm text-gray-600">
                        Afecta {conflict.affectedSlots.length} turno{conflict.affectedSlots.length > 1 ? 's' : ''}
                      </p>
                    )}
                    
                    {conflict.details && (
                      <p className="text-xs text-gray-500 mt-1">
                        {conflict.details}
                      </p>
                    )}
                  </div>
                  
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Panel de resolución */}
        <Card title="Opciones de Resolución">
          {selectedConflict ? (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-800 mb-2">
                  {getConflictTypeText(selectedConflict.type)}
                </h4>
                <p className="text-sm text-red-700">
                  {selectedConflict.message || 'Descripción del conflicto no disponible'}
                </p>
                {selectedConflict.details && (
                  <p className="text-xs text-red-600 mt-2">
                    {selectedConflict.details}
                  </p>
                )}
              </div>

              {/* Turnos afectados */}
              {selectedConflict.affectedSlots && selectedConflict.affectedSlots.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2">
                    Turnos Afectados
                  </h5>
                  <div className="space-y-2">
                    {selectedConflict.affectedSlots.map((slot, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <span className="text-sm font-medium">
                            {slot.fecha} • {slot.horaInicio} - {slot.horaFin}
                          </span>
                          <div className="text-xs text-gray-600">
                            Dr. {slot.dentista?.nombres} • {slot.consultorio?.nombre}
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          slot.estado === 'disponible' ? 'bg-green-100 text-green-800' :
                          slot.estado === 'ocupado' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {slot.estado}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sugerencias de resolución */}
              {resolutionSuggestions.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2">
                    Sugerencias de Resolución
                  </h5>
                  <div className="space-y-2">
                    {resolutionSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedResolution(suggestion)}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedResolution?.id === suggestion.id
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h6 className="font-medium text-gray-900">
                              {suggestion.title}
                            </h6>
                            <p className="text-sm text-gray-600 mt-1">
                              {suggestion.description}
                            </p>
                            {suggestion.impact && (
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                <span>Impacto: {suggestion.impact.level}</span>
                                <span>Tiempo: {suggestion.impact.timeRequired}</span>
                                <span>Costo: {suggestion.impact.cost}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              suggestion.confidence > 0.8 ? 'bg-green-100 text-green-800' :
                              suggestion.confidence > 0.6 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {Math.round(suggestion.confidence * 100)}% confianza
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <LoadingButton
                  variant="outline"
                  onClick={() => setSelectedConflict(null)}
                >
                  Cancelar
                </LoadingButton>
                
                {selectedResolution && (
                  <LoadingButton
                    onClick={() => handleResolveConflict(selectedConflict.id, selectedResolution)}
                    loading={loading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Aplicar Resolución
                  </LoadingButton>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Selecciona un Conflicto
              </h3>
              <p className="text-gray-600">
                Elige un conflicto de la lista para ver las opciones de resolución
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Botones principales */}
      <div className="flex justify-end gap-3">
        <LoadingButton
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          <X className="w-4 h-4 mr-2" />
          Cerrar
        </LoadingButton>
      </div>
    </div>
  );
};

export default ScheduleConflictResolver;