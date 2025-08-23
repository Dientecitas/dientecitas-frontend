import React from 'react';
import { AlertTriangle, X, Calendar, Clock, Users } from 'lucide-react';
import Modal from '../../../shared/components/ui/Modal';
import LoadingButton from '../../../shared/components/ui/LoadingButton';
import { formatDate, formatTime } from '../utils/scheduleHelpers';

const DeleteScheduleModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  timeSlot, 
  loading = false 
}) => {
  if (!timeSlot) return null;

  const hasCitas = timeSlot.citasActuales > 0;
  const isRecurring = timeSlot.esRecurrente;
  const isOccupied = timeSlot.estado === 'ocupado';

  const canDelete = !hasCitas && !isOccupied;

  const handleConfirm = () => {
    if (canDelete) {
      onConfirm(timeSlot.id);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Eliminar Turno"
      size="md"
    >
      <div className="space-y-6">
        {/* Advertencia */}
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <AlertTriangle className={`h-6 w-6 ${canDelete ? 'text-yellow-600' : 'text-red-600'}`} />
          </div>
          <div className="flex-1">
            <h3 className={`text-sm font-medium ${canDelete ? 'text-yellow-800' : 'text-red-800'}`}>
              {canDelete ? 'Confirmar eliminación' : 'No se puede eliminar'}
            </h3>
            <div className={`mt-2 text-sm ${canDelete ? 'text-yellow-700' : 'text-red-700'}`}>
              {canDelete ? (
                <p>
                  ¿Estás seguro de que deseas eliminar este turno?
                  {isRecurring && ' Esta acción afectará toda la serie recurrente.'}
                </p>
              ) : (
                <p>
                  No se puede eliminar este turno porque {hasCitas ? 'tiene citas asignadas' : 'está ocupado'}.
                  {isRecurring && ' Además, es parte de una serie recurrente.'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Información del turno */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Información del turno
          </h4>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="font-medium text-gray-500">Fecha:</dt>
              <dd className="text-gray-900">{formatDate(timeSlot.fecha)}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Horario:</dt>
              <dd className="text-gray-900">{timeSlot.horaInicio} - {timeSlot.horaFin}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Duración:</dt>
              <dd className="text-gray-900">{timeSlot.duracion} minutos</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Tipo:</dt>
              <dd className="text-gray-900">{timeSlot.tipoTurno}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Dentista:</dt>
              <dd className="text-gray-900">
                Dr. {timeSlot.dentista?.nombres} {timeSlot.dentista?.apellidos}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Consultorio:</dt>
              <dd className="text-gray-900">{timeSlot.consultorio?.nombre}</dd>
            </div>
          </dl>
        </div>

        {/* Estado actual */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Estado actual
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${hasCitas ? 'text-red-600' : 'text-gray-400'}`}>
                {timeSlot.citasActuales || 0}
              </div>
              <div className="text-xs text-gray-600">Citas Asignadas</div>
              {hasCitas && (
                <div className="text-xs text-red-600 mt-1">⚠️ Bloqueante</div>
              )}
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {timeSlot.capacidadMaxima}
              </div>
              <div className="text-xs text-gray-600">Capacidad Máxima</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                timeSlot.estado === 'disponible' ? 'text-green-600' :
                timeSlot.estado === 'ocupado' ? 'text-blue-600' :
                timeSlot.estado === 'reservado' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {timeSlot.vecesReservado || 0}
              </div>
              <div className="text-xs text-gray-600">Veces Reservado</div>
            </div>
          </div>
        </div>

        {/* Información de recurrencia */}
        {isRecurring && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">
              Turno Recurrente
            </h4>
            <p className="text-sm text-blue-700">
              Este turno es parte de una serie recurrente. Eliminar este turno afectará:
            </p>
            <ul className="text-sm text-blue-700 mt-2 list-disc list-inside">
              <li>Todos los turnos futuros de la serie</li>
              <li>Las citas ya programadas en turnos futuros</li>
              <li>Las notificaciones automáticas configuradas</li>
            </ul>
          </div>
        )}

        {/* Instrucciones si no se puede eliminar */}
        {!canDelete && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-red-800 mb-2">
              Pasos para poder eliminar este turno:
            </h4>
            <ol className="text-sm text-red-700 space-y-1 list-decimal list-inside">
              {hasCitas && (
                <li>Cancelar o mover las {timeSlot.citasActuales} citas asignadas</li>
              )}
              {isOccupied && (
                <li>Cambiar el estado del turno de "ocupado" a "disponible"</li>
              )}
              {isRecurring && (
                <li>Considerar eliminar toda la serie recurrente o crear una excepción</li>
              )}
            </ol>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <LoadingButton
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </LoadingButton>
          
          {canDelete && (
            <LoadingButton
              variant="danger"
              onClick={handleConfirm}
              loading={loading}
              loadingText="Eliminando..."
              disabled={loading}
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Eliminar Turno{isRecurring ? ' y Serie' : ''}
            </LoadingButton>
          )}
        </div>

        {/* Nota adicional */}
        <div className="text-xs text-gray-500 text-center pt-2 border-t">
          {canDelete ? (
            'Esta acción eliminará permanentemente el turno del sistema'
          ) : (
            'Resuelve los conflictos antes de eliminar el turno'
          )}
        </div>
      </div>
    </Modal>
  );
};

export default DeleteScheduleModal;