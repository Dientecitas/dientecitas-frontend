import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import Modal from '../../../shared/components/ui/Modal';
import LoadingButton from '../../../shared/components/ui/LoadingButton';
import { formatNumber, formatFullName, getMainSpecialty } from '../utils/dentistHelpers';

const DeleteDentistModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  dentist, 
  loading = false 
}) => {
  if (!dentist) return null;

  const hasCitasPendientes = dentist.citasPendientes > 0;
  const hasPacientes = dentist.totalPacientes > 0;

  const canDelete = !hasCitasPendientes;
  const fullName = formatFullName(dentist.nombres, dentist.apellidos);

  const handleConfirm = () => {
    if (canDelete) {
      onConfirm(dentist.id);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Eliminar Dentista"
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
                  ¿Estás seguro de que deseas eliminar al Dr. <strong>{fullName}</strong>?
                  Esta acción no se puede deshacer.
                </p>
              ) : (
                <p>
                  No se puede eliminar al Dr. <strong>{fullName}</strong> porque tiene 
                  citas pendientes que deben ser reasignadas primero.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Información del dentista */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Información del dentista
          </h4>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="font-medium text-gray-500">Nombre:</dt>
              <dd className="text-gray-900">Dr. {fullName}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">DNI:</dt>
              <dd className="text-gray-900">{dentist.dni}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Colegiatura:</dt>
              <dd className="text-gray-900 font-mono">{dentist.numeroColegiatura}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Especialidad:</dt>
              <dd className="text-gray-900">{getMainSpecialty(dentist.especialidades)}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Consultorio:</dt>
              <dd className="text-gray-900">{dentist.consultorio?.nombre || 'No asignado'}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Email:</dt>
              <dd className="text-gray-900">{dentist.email}</dd>
            </div>
          </dl>
        </div>

        {/* Recursos asociados */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Recursos asociados
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${hasCitasPendientes ? 'text-red-600' : 'text-gray-400'}`}>
                {formatNumber(dentist.citasPendientes || 0)}
              </div>
              <div className="text-xs text-gray-600">Citas Pendientes</div>
              {hasCitasPendientes && (
                <div className="text-xs text-red-600 mt-1">⚠️ Bloqueante</div>
              )}
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${hasPacientes ? 'text-orange-600' : 'text-gray-400'}`}>
                {formatNumber(dentist.totalPacientes || 0)}
              </div>
              <div className="text-xs text-gray-600">Total Pacientes</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${dentist.citasCompletadasMes > 0 ? 'text-blue-600' : 'text-gray-400'}`}>
                {formatNumber(dentist.citasCompletadasMes || 0)}
              </div>
              <div className="text-xs text-gray-600">Citas del Mes</div>
            </div>
          </div>
        </div>

        {/* Especialidades y servicios */}
        {(dentist.especialidades?.length > 0 || dentist.serviciosOfrecidos?.length > 0) && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Especialidades y servicios
            </h4>
            {dentist.especialidades?.length > 0 && (
              <div className="mb-3">
                <dt className="text-xs font-medium text-gray-500 mb-1">Especialidades:</dt>
                <dd className="text-xs text-gray-700">
                  {dentist.especialidades.map(e => e.nombre).join(', ')}
                </dd>
              </div>
            )}
            {dentist.serviciosOfrecidos?.length > 0 && (
              <div>
                <dt className="text-xs font-medium text-gray-500 mb-1">Servicios:</dt>
                <dd className="text-xs text-gray-700">
                  {dentist.serviciosOfrecidos.join(', ')}
                </dd>
              </div>
            )}
          </div>
        )}

        {/* Instrucciones si no se puede eliminar */}
        {!canDelete && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-red-800 mb-2">
              Pasos para poder eliminar este dentista:
            </h4>
            <ol className="text-sm text-red-700 space-y-1 list-decimal list-inside">
              {hasCitasPendientes && (
                <li>Reasignar las {formatNumber(dentist.citasPendientes)} citas pendientes a otros dentistas</li>
              )}
              {hasPacientes && (
                <li>Notificar a los {formatNumber(dentist.totalPacientes)} pacientes sobre el cambio</li>
              )}
              <li>Verificar que no hay equipamiento o recursos asignados</li>
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
              showSuccessState
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Eliminar Dentista
            </LoadingButton>
          )}
        </div>

        {/* Nota adicional */}
        <div className="text-xs text-gray-500 text-center pt-2 border-t">
          {canDelete ? (
            'Esta acción eliminará permanentemente al dentista del sistema'
          ) : (
            'Contacta al administrador del sistema si necesitas ayuda con la eliminación'
          )}
        </div>
      </div>
    </Modal>
  );
};

export default DeleteDentistModal;