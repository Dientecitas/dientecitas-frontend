import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import Modal from '../../../shared/components/ui/Modal';
import LoadingButton from '../../../shared/components/ui/LoadingButton';
import { formatNumber } from '../utils/districtHelpers';

const DeleteDistrictModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  district, 
  loading = false 
}) => {
  if (!district) return null;

  const hasConsultorios = district.cantidadConsultorios > 0;
  const hasDentistas = district.cantidadDentistas > 0;
  const hasCitas = district.cantidadCitas > 0;

  const canDelete = !hasConsultorios;

  const handleConfirm = () => {
    if (canDelete) {
      onConfirm(district.id);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Eliminar Distrito"
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
                  ¿Estás seguro de que deseas eliminar el distrito <strong>{district.nombre}</strong>?
                  Esta acción no se puede deshacer.
                </p>
              ) : (
                <p>
                  No se puede eliminar el distrito <strong>{district.nombre}</strong> porque tiene 
                  recursos asociados que deben ser eliminados o reasignados primero.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Información del distrito */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Información del distrito
          </h4>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="font-medium text-gray-500">Nombre:</dt>
              <dd className="text-gray-900">{district.nombre}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Código:</dt>
              <dd className="text-gray-900 font-mono">{district.codigo}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Provincia:</dt>
              <dd className="text-gray-900">{district.provincia}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Región:</dt>
              <dd className="text-gray-900">{district.region}</dd>
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
              <div className={`text-2xl font-bold ${hasConsultorios ? 'text-red-600' : 'text-gray-400'}`}>
                {formatNumber(district.cantidadConsultorios)}
              </div>
              <div className="text-xs text-gray-600">Consultorios</div>
              {hasConsultorios && (
                <div className="text-xs text-red-600 mt-1">⚠️ Bloqueante</div>
              )}
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${hasDentistas ? 'text-orange-600' : 'text-gray-400'}`}>
                {formatNumber(district.cantidadDentistas)}
              </div>
              <div className="text-xs text-gray-600">Dentistas</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${hasCitas ? 'text-blue-600' : 'text-gray-400'}`}>
                {formatNumber(district.cantidadCitas)}
              </div>
              <div className="text-xs text-gray-600">Citas</div>
            </div>
          </div>
        </div>

        {/* Instrucciones si no se puede eliminar */}
        {!canDelete && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-red-800 mb-2">
              Pasos para poder eliminar este distrito:
            </h4>
            <ol className="text-sm text-red-700 space-y-1 list-decimal list-inside">
              {hasConsultorios && (
                <li>Eliminar o reasignar los {formatNumber(district.cantidadConsultorios)} consultorios</li>
              )}
              {hasDentistas && (
                <li>Reasignar los {formatNumber(district.cantidadDentistas)} dentistas a otros distritos</li>
              )}
              {hasCitas && (
                <li>Gestionar las {formatNumber(district.cantidadCitas)} citas programadas</li>
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
              showSuccessState
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Eliminar Distrito
            </LoadingButton>
          )}
        </div>

        {/* Nota adicional */}
        <div className="text-xs text-gray-500 text-center pt-2 border-t">
          {canDelete ? (
            'Esta acción eliminará permanentemente el distrito del sistema'
          ) : (
            'Contacta al administrador del sistema si necesitas ayuda con la eliminación'
          )}
        </div>
      </div>
    </Modal>
  );
};

export default DeleteDistrictModal;