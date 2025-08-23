import React from 'react';
import { AlertTriangle, X, Heart, Shield, Calendar } from 'lucide-react';
import Modal from '../../../shared/components/ui/Modal';
import LoadingButton from '../../../shared/components/ui/LoadingButton';
import { formatNumber, formatFullName, formatDate } from '../utils/patientHelpers';

const DeletePatientModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  patient, 
  loading = false 
}) => {
  if (!patient) return null;

  const hasUpcomingAppointments = patient.proximaCita && new Date(patient.proximaCita) > new Date();
  const hasMedicalHistory = patient.totalCitas > 0;
  const hasPendingBalance = patient.saldoPendiente > 0;
  const hasCriticalAllergies = patient.alergias?.some(a => a.severidad === 'severa');
  const hasMedicalConditions = patient.condicionesMedicas?.length > 0;

  const canDelete = !hasUpcomingAppointments;
  const fullName = formatFullName(patient.nombres, patient.apellidos);

  const handleConfirm = () => {
    if (canDelete) {
      onConfirm(patient.id);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Eliminar Paciente"
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
              {canDelete ? 'Confirmar eliminación de expediente médico' : 'No se puede eliminar el expediente'}
            </h3>
            <div className={`mt-2 text-sm ${canDelete ? 'text-yellow-700' : 'text-red-700'}`}>
              {canDelete ? (
                <p>
                  ¿Estás seguro de que deseas eliminar el expediente médico de <strong>{fullName}</strong>?
                  Esta acción eliminará permanentemente todos los datos médicos y no se puede deshacer.
                </p>
              ) : (
                <p>
                  No se puede eliminar el expediente de <strong>{fullName}</strong> porque tiene 
                  citas programadas que deben ser canceladas o completadas primero.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Información del paciente */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Información del paciente
          </h4>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="font-medium text-gray-500">Nombre:</dt>
              <dd className="text-gray-900">{fullName}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">DNI:</dt>
              <dd className="text-gray-900">{patient.dni}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Edad:</dt>
              <dd className="text-gray-900">{patient.edad} años</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Teléfono:</dt>
              <dd className="text-gray-900">{patient.telefono}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Email:</dt>
              <dd className="text-gray-900">{patient.email}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Registro:</dt>
              <dd className="text-gray-900">{formatDate(patient.fechaRegistro)}</dd>
            </div>
          </dl>
        </div>

        {/* Historial médico y citas */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Historial médico y citas
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${hasUpcomingAppointments ? 'text-red-600' : 'text-gray-400'}`}>
                {hasUpcomingAppointments ? '1+' : '0'}
              </div>
              <div className="text-xs text-gray-600">Citas Pendientes</div>
              {hasUpcomingAppointments && (
                <div className="text-xs text-red-600 mt-1">⚠️ Bloqueante</div>
              )}
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${hasMedicalHistory ? 'text-blue-600' : 'text-gray-400'}`}>
                {formatNumber(patient.totalCitas || 0)}
              </div>
              <div className="text-xs text-gray-600">Total Citas</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${hasPendingBalance ? 'text-orange-600' : 'text-gray-400'}`}>
                S/ {formatNumber(patient.saldoPendiente || 0)}
              </div>
              <div className="text-xs text-gray-600">Saldo Pendiente</div>
            </div>
          </div>
        </div>

        {/* Información médica crítica */}
        {(hasCriticalAllergies || hasMedicalConditions) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-red-800 mb-3 flex items-center">
              <Heart className="w-4 h-4 mr-2" />
              Información médica crítica
            </h4>
            
            {hasCriticalAllergies && (
              <div className="mb-3">
                <dt className="text-xs font-medium text-red-700 mb-1">Alergias severas:</dt>
                <dd className="text-xs text-red-800">
                  {patient.alergias.filter(a => a.severidad === 'severa').map(a => a.alergia).join(', ')}
                </dd>
              </div>
            )}
            
            {hasMedicalConditions && (
              <div>
                <dt className="text-xs font-medium text-red-700 mb-1">Condiciones médicas:</dt>
                <dd className="text-xs text-red-800">
                  {patient.condicionesMedicas.map(c => c.condicion).join(', ')}
                </dd>
              </div>
            )}
          </div>
        )}

        {/* Contactos de emergencia */}
        {patient.contactosEmergencia?.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-3 flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Contactos de emergencia
            </h4>
            {patient.contactosEmergencia.slice(0, 2).map((contacto, index) => (
              <div key={index} className="text-xs text-blue-700">
                <strong>{contacto.nombres}</strong> ({contacto.relacion}) - {contacto.telefono}
              </div>
            ))}
          </div>
        )}

        {/* Instrucciones si no se puede eliminar */}
        {!canDelete && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-red-800 mb-2">
              Pasos para poder eliminar este expediente:
            </h4>
            <ol className="text-sm text-red-700 space-y-1 list-decimal list-inside">
              {hasUpcomingAppointments && (
                <li>Cancelar o completar las citas programadas</li>
              )}
              {hasPendingBalance && (
                <li>Resolver el saldo pendiente de S/ {formatNumber(patient.saldoPendiente)}</li>
              )}
              <li>Verificar que no hay tratamientos en curso</li>
              <li>Notificar al paciente sobre la eliminación del expediente</li>
            </ol>
          </div>
        )}

        {/* Advertencia sobre retención de datos médicos */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">
            Política de retención de datos médicos
          </h4>
          <p className="text-xs text-yellow-700">
            Los datos médicos se mantendrán archivados por 10 años según las regulaciones de salud.
            Los datos personales se eliminarán inmediatamente tras la confirmación.
          </p>
        </div>

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
              loadingText="Eliminando expediente..."
              disabled={loading}
              showSuccessState
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Eliminar Expediente
            </LoadingButton>
          )}
        </div>

        {/* Nota adicional */}
        <div className="text-xs text-gray-500 text-center pt-2 border-t">
          {canDelete ? (
            'Esta acción eliminará permanentemente el expediente médico del sistema'
          ) : (
            'Contacta al administrador médico si necesitas ayuda con la eliminación'
          )}
        </div>
      </div>
    </Modal>
  );
};

export default DeletePatientModal;