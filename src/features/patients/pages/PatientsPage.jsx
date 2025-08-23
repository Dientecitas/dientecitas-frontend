import React from 'react';
import { Plus, RefreshCw, User, Heart, Shield } from 'lucide-react';
import { usePatientContext } from '../store/patientContext';
import { usePatients } from '../hooks/usePatients';
import LoadingButton from '../../../shared/components/ui/LoadingButton';
import Modal from '../../../shared/components/ui/Modal';
import LoadingOverlay from '../../../shared/components/ui/LoadingOverlay';
import PageLoader from '../../../shared/components/ui/PageLoader';
import PatientStats from '../components/PatientStats';
import PatientFilters from '../components/PatientFilters';
import PatientList from '../components/PatientList';
import PatientForm from '../components/PatientForm';
import DeletePatientModal from '../components/DeletePatientModal';
import { formatFullName } from '../utils/patientHelpers';

const PatientsPage = () => {
  const {
    ui,
    selectedPatient,
    toggleModal,
    setSelectedPatient
  } = usePatientContext();

  const { 
    createPatient, 
    updatePatient, 
    deletePatient, 
    loading, 
    patients,
    fetchPatients,
    getMedicalAlerts
  } = usePatients();

  // Show page loader on initial load
  if (loading.patients && !patients.length) {
    return (
      <PageLoader 
        message="Cargando pacientes..." 
        description="Preparando el sistema médico"
        timeout={10000}
        onTimeout={() => console.error('Timeout loading patients')}
        onRetry={() => fetchPatients()}
      />
    );
  }

  // Handlers para modales
  const handleCreatePatient = async (data) => {
    const result = await createPatient(data);
    if (result.success) {
      toggleModal('create', false);
    }
    return result;
  };

  const handleUpdatePatient = async (data) => {
    if (!selectedPatient) return;
    const result = await updatePatient(selectedPatient.id, data);
    if (result.success) {
      toggleModal('edit', false);
      setSelectedPatient(null);
    }
    return result;
  };

  const handleDeletePatient = async (id) => {
    const result = await deletePatient(id);
    if (result.success) {
      toggleModal('delete', false);
      setSelectedPatient(null);
    }
    return result;
  };

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    toggleModal('detail', true);
  };

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    toggleModal('edit', true);
  };

  const handleDeleteClick = (patient) => {
    setSelectedPatient(patient);
    toggleModal('delete', true);
  };

  const handleRefresh = () => {
    fetchPatients();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestión de Pacientes
          </h1>
          <p className="text-gray-600 mt-1">
            Administra los expedientes médicos y datos de pacientes
          </p>
        </div>

        <div className="flex items-center gap-3">
          <LoadingButton
            variant="outline"
            onClick={handleRefresh}
            loading={loading.patients}
            loadingText="Actualizando..."
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </LoadingButton>

          <LoadingButton
            onClick={() => toggleModal('create', true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Registrar Paciente
          </LoadingButton>
        </div>
      </div>

      {/* Estadísticas */}
      <PatientStats />

      {/* Filtros */}
      <PatientFilters />

      {/* Lista de pacientes */}
      <PatientList
        onView={handleViewPatient}
        onEdit={handleEditPatient}
        onDelete={handleDeleteClick}
      />

      {/* Global loading overlay for operations */}
      <LoadingOverlay
        visible={loading.create}
        message="Registrando paciente..."
        description="Procesando información médica"
        spinner="circle"
        backdrop="blur"
      />

      <LoadingOverlay
        visible={loading.delete}
        message="Eliminando paciente..."
        description="Verificando historial médico..."
        spinner="circle"
        backdrop="blur"
      />

      {/* Modal Crear Paciente */}
      <Modal
        isOpen={ui.modals.create}
        onClose={() => toggleModal('create', false)}
        title="Registrar Nuevo Paciente"
        size="xl"
      >
        <PatientForm
          onSubmit={handleCreatePatient}
          onCancel={() => toggleModal('create', false)}
          loading={loading.create}
        />
      </Modal>

      {/* Modal Editar Paciente */}
      <Modal
        isOpen={ui.modals.edit}
        onClose={() => {
          toggleModal('edit', false);
          setSelectedPatient(null);
        }}
        title="Editar Paciente"
        size="xl"
      >
        <PatientForm
          initialData={selectedPatient}
          onSubmit={handleUpdatePatient}
          onCancel={() => {
            toggleModal('edit', false);
            setSelectedPatient(null);
          }}
          loading={loading.update}
        />
      </Modal>

      {/* Modal Detalle Paciente */}
      <Modal
        isOpen={ui.modals.detail}
        onClose={() => {
          toggleModal('detail', false);
          setSelectedPatient(null);
        }}
        title="Expediente Médico"
        size="xl"
      >
        {selectedPatient && (
          <div className="space-y-6">
            {/* Header del expediente */}
            <div className="flex items-start space-x-4">
              {selectedPatient.foto ? (
                <img
                  src={selectedPatient.foto}
                  alt={formatFullName(selectedPatient.nombres, selectedPatient.apellidos)}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">
                  {formatFullName(selectedPatient.nombres, selectedPatient.apellidos)}
                </h3>
                <p className="text-lg text-gray-600">DNI: {selectedPatient.dni}</p>
                <p className="text-sm text-gray-500">{selectedPatient.edad} años • {selectedPatient.genero}</p>
                
                {/* Alertas médicas */}
                {getMedicalAlerts(selectedPatient.id).length > 0 && (
                  <div className="mt-2 space-y-1">
                    {getMedicalAlerts(selectedPatient.id).map((alert, index) => (
                      <div key={index} className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${alert.color}-100 text-${alert.color}-800 mr-2`}>
                        <Heart className="w-3 h-3 mr-1" />
                        {alert.message}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Información Personal
                </h4>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="text-sm text-gray-900">{selectedPatient.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Teléfono</dt>
                    <dd className="text-sm text-gray-900">{selectedPatient.telefono}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Dirección</dt>
                    <dd className="text-sm text-gray-900">{selectedPatient.direccion}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Distrito</dt>
                    <dd className="text-sm text-gray-900">{selectedPatient.distrito}</dd>
                  </div>
                  {selectedPatient.ocupacion && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Ocupación</dt>
                      <dd className="text-sm text-gray-900">{selectedPatient.ocupacion}</dd>
                    </div>
                  )}
                </dl>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Información Médica
                </h4>
                <dl className="space-y-3">
                  {selectedPatient.tipoSangre && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Tipo de Sangre</dt>
                      <dd className="text-sm text-gray-900">{selectedPatient.tipoSangre}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Alergias</dt>
                    <dd className="text-sm text-gray-900">
                      {selectedPatient.alergias?.length > 0 
                        ? selectedPatient.alergias.map(a => `${a.alergia} (${a.severidad})`).join(', ')
                        : 'Ninguna conocida'
                      }
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Condiciones Médicas</dt>
                    <dd className="text-sm text-gray-900">
                      {selectedPatient.condicionesMedicas?.length > 0 
                        ? selectedPatient.condicionesMedicas.map(c => c.condicion).join(', ')
                        : 'Ninguna'
                      }
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Riesgo Odontológico</dt>
                    <dd className="text-sm text-gray-900">
                      {selectedPatient.puntuacionRiesgo}/10 
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        selectedPatient.puntuacionRiesgo <= 3 ? 'bg-green-100 text-green-800' :
                        selectedPatient.puntuacionRiesgo <= 6 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {selectedPatient.puntuacionRiesgo <= 3 ? 'Bajo' :
                         selectedPatient.puntuacionRiesgo <= 6 ? 'Medio' : 'Alto'}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Estadísticas del paciente */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Estadísticas
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedPatient.totalCitas || 0}
                  </div>
                  <div className="text-sm text-blue-600">Total Citas</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {selectedPatient.citasCompletadas || 0}
                  </div>
                  <div className="text-sm text-green-600">Completadas</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    S/ {selectedPatient.totalGastado || 0}
                  </div>
                  <div className="text-sm text-orange-600">Total Gastado</div>
                </div>
                <div className={`p-4 rounded-lg ${selectedPatient.saldoPendiente > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
                  <div className={`text-2xl font-bold ${selectedPatient.saldoPendiente > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    S/ {selectedPatient.saldoPendiente || 0}
                  </div>
                  <div className={`text-sm ${selectedPatient.saldoPendiente > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    Saldo Pendiente
                  </div>
                </div>
              </div>
            </div>

            {/* Información del seguro */}
            {selectedPatient.informacionSeguro?.tieneSeguro && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Información del Seguro
                </h4>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-blue-700">Compañía</dt>
                      <dd className="text-sm text-blue-900">{selectedPatient.informacionSeguro.compañia}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-blue-700">Número de Póliza</dt>
                      <dd className="text-sm text-blue-900 font-mono">{selectedPatient.informacionSeguro.numeroPoliza}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-blue-700">Cobertura Dental</dt>
                      <dd className="text-sm text-blue-900">{selectedPatient.informacionSeguro.coberturaDental}%</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-blue-700">Copago</dt>
                      <dd className="text-sm text-blue-900">S/ {selectedPatient.informacionSeguro.copago}</dd>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Contactos de emergencia */}
            {selectedPatient.contactosEmergencia?.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Contactos de Emergencia
                </h4>
                <div className="space-y-3">
                  {selectedPatient.contactosEmergencia.map((contacto, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium text-gray-900">
                            {contacto.nombres} {contacto.apellidos}
                            {contacto.esPrincipal && (
                              <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                Principal
                              </span>
                            )}
                          </h5>
                          <p className="text-sm text-gray-600">{contacto.relacion}</p>
                          <p className="text-sm text-gray-600">{contacto.telefono}</p>
                          {contacto.email && (
                            <p className="text-sm text-gray-600">{contacto.email}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
              <LoadingButton
                variant="outline"
                onClick={() => {
                  toggleModal('detail', false);
                  setSelectedPatient(null);
                }}
              >
                Cerrar
              </LoadingButton>
              <LoadingButton
                onClick={() => {
                  toggleModal('detail', false);
                  handleEditPatient(selectedPatient);
                }}
              >
                Editar Paciente
              </LoadingButton>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Eliminar Paciente */}
      <DeletePatientModal
        isOpen={ui.modals.delete}
        onClose={() => {
          toggleModal('delete', false);
          setSelectedPatient(null);
        }}
        onConfirm={handleDeletePatient}
        patient={selectedPatient}
        loading={loading.delete}
      />
    </div>
  );
};

export default PatientsPage;