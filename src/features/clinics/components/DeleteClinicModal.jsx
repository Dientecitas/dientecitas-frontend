import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import Modal from '../../../shared/components/ui/Modal';
import LoadingButton from '../../../shared/components/ui/LoadingButton';
import { formatNumber } from '../utils/clinicHelpers';

const DeleteClinicModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  clinic, 
  loading = false 
}) => {
  if (!clinic) return null;

  const hasDentistas = clinic.cantidadDentistas > 0;
  const hasCitas = clinic.cantidadCitasHoy > 0 || clinic.cantidadCitasMes > 0;

  const canDelete = !hasDentistas;

  const handleConfirm = () => {
    if (canDelete) {
      onConfirm(clinic.id);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Eliminar Consultorio"
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
                  ¿Estás seguro de que deseas eliminar el consultorio <strong>{clinic.nombre}</strong>?
                  Esta acción no se puede deshacer.
                </p>
              ) : (
                <p>
                  No se puede eliminar el consultorio <strong>{clinic.nombre}</strong> porque tiene 
                  dentistas asociados que deben ser reasignados primero.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Información del consultorio */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Información del consultorio
          </h4>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="font-medium text-gray-500">Nombre:</dt>
              <dd className="text-gray-900">{clinic.nombre}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Código:</dt>
              <dd className="text-gray-900 font-mono">{clinic.codigo}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Distrito:</dt>
              <dd className="text-gray-900">{clinic.distrito?.nombre || 'N/A'}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Tipo:</dt>
              <dd className="text-gray-900">
                {clinic.tipoClinica === 'publica' ? 'Pública' : 
                 clinic.tipoClinica === 'privada' ? 'Privada' : 'Mixta'}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Dirección:</dt>
              <dd className="text-gray-900">{clinic.direccion}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Teléfono:</dt>
              <dd className="text-gray-900">{clinic.telefono}</dd>
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
              <div className={`text-2xl font-bold ${hasDentistas ? 'text-red-600' : 'text-gray-400'}`}>
                {formatNumber(clinic.cantidadDentistas || 0)}
              </div>
              <div className="text-xs text-gray-600">Dentistas</div>
              {hasDentistas && (
                <div className="text-xs text-red-600 mt-1">⚠️ Bloqueante</div>
              )}
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${hasCitas ? 'text-orange-600' : 'text-gray-400'}`}>
                {formatNumber(clinic.cantidadCitasHoy || 0)}
              </div>
              <div className="text-xs text-gray-600">Citas Hoy</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${clinic.cantidadCitasMes > 0 ? 'text-blue-600' : 'text-gray-400'}`}>
                {formatNumber(clinic.cantidadCitasMes || 0)}
              </div>
              <div className="text-xs text-gray-600">Citas del Mes</div>
            </div>
          </div>
        </div>

        {/* Servicios y especialidades */}
        {(clinic.servicios?.length > 0 || clinic.especialidades?.length > 0) && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Servicios y especialidades
            </h4>
            {clinic.servicios?.length > 0 && (
              <div className="mb-3">
                <dt className="text-xs font-medium text-gray-500 mb-1">Servicios:</dt>
                <dd className="text-xs text-gray-700">
                  {clinic.servicios.join(', ')}
                </dd>
              </div>
            )}
            {clinic.especialidades?.length > 0 && (
              <div>
                <dt className="text-xs font-medium text-gray-500 mb-1">Especialidades:</dt>
                <dd className="text-xs text-gray-700">
                  {clinic.especialidades.join(', ')}
                </dd>
              </div>
            )}
          </div>
        )}

        {/* Instrucciones si no se puede eliminar */}
        {!canDelete && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-red-800 mb-2">
              Pasos para poder eliminar este consultorio:
            </h4>
            <ol className="text-sm text-red-700 space-y-1 list-decimal list-inside">
              {hasDentistas && (
                <li>Reasignar los {formatNumber(clinic.cantidadDentistas)} dentistas a otros consultorios</li>
              )}
              {hasCitas && (
                <li>Gestionar las citas programadas ({formatNumber(clinic.cantidadCitasMes)} este mes)</li>
              )}
              <li>Verificar que no hay equipamiento o recursos físicos pendientes</li>
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
              Eliminar Consultorio
            </LoadingButton>
          )}
        </div>

        {/* Nota adicional */}
        <div className="text-xs text-gray-500 text-center pt-2 border-t">
          {canDelete ? (
            'Esta acción eliminará permanentemente el consultorio del sistema'
          ) : (
            'Contacta al administrador del sistema si necesitas ayuda con la eliminación'
          )}
        </div>
      </div>
    </Modal>
  );
};

export default DeleteClinicModal;