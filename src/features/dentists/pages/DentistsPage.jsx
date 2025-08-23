import React from 'react';
import { Plus, RefreshCw, User } from 'lucide-react';
import { useDentistContext } from '../store/dentistContext';
import { useDentists } from '../hooks/useDentists';
import LoadingButton from '../../../shared/components/ui/LoadingButton';
import Modal from '../../../shared/components/ui/Modal';
import LoadingOverlay from '../../../shared/components/ui/LoadingOverlay';
import PageLoader from '../../../shared/components/ui/PageLoader';
import DentistStats from '../components/DentistStats';
import DentistFilters from '../components/DentistFilters';
import DentistList from '../components/DentistList';
import DentistForm from '../components/DentistForm';
import DeleteDentistModal from '../components/DeleteDentistModal';
import { formatFullName, getMainSpecialty } from '../utils/dentistHelpers';

const DentistsPage = () => {
  const {
    ui,
    selectedDentist,
    toggleModal,
    setSelectedDentist
  } = useDentistContext();

  const { 
    createDentist, 
    updateDentist, 
    deleteDentist, 
    loading, 
    dentists,
    fetchDentists
  } = useDentists();

  // Show page loader on initial load
  if (loading.dentists && !dentists.length) {
    return (
      <PageLoader 
        message="Cargando dentistas..." 
        description="Preparando el sistema de gestión"
        timeout={10000}
        onTimeout={() => console.error('Timeout loading dentists')}
        onRetry={() => fetchDentists()}
      />
    );
  }

  // Handlers para modales
  const handleCreateDentist = async (data) => {
    const result = await createDentist(data);
    if (result.success) {
      toggleModal('create', false);
    }
    return result;
  };

  const handleUpdateDentist = async (data) => {
    if (!selectedDentist) return;
    const result = await updateDentist(selectedDentist.id, data);
    if (result.success) {
      toggleModal('edit', false);
      setSelectedDentist(null);
    }
  };

  const handleDeleteDentist = async (id) => {
    const result = await deleteDentist(id);
    if (result.success) {
      toggleModal('delete', false);
      setSelectedDentist(null);
    }
    return result;
  };

  const handleViewDentist = (dentist) => {
    setSelectedDentist(dentist);
    toggleModal('detail', true);
  };

  const handleEditDentist = (dentist) => {
    setSelectedDentist(dentist);
    toggleModal('edit', true);
  };

  const handleDeleteClick = (dentist) => {
    setSelectedDentist(dentist);
    toggleModal('delete', true);
  };

  const handleRefresh = () => {
    fetchDentists();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestión de Dentistas
          </h1>
          <p className="text-gray-600 mt-1">
            Administra los profesionales odontológicos del sistema
          </p>
        </div>

        <div className="flex items-center gap-3">
          <LoadingButton
            variant="outline"
            onClick={handleRefresh}
            loading={loading.dentists}
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
            Registrar Dentista
          </LoadingButton>
        </div>
      </div>

      {/* Estadísticas */}
      <DentistStats />

      {/* Filtros */}
      <DentistFilters />

      {/* Lista de dentistas */}
      <DentistList
        onView={handleViewDentist}
        onEdit={handleEditDentist}
        onDelete={handleDeleteClick}
      />

      {/* Global loading overlay for operations */}
      <LoadingOverlay
        visible={loading.create}
        message="Registrando dentista..."
        description="Esto puede tomar unos segundos"
        spinner="circle"
        backdrop="blur"
      />

      <LoadingOverlay
        visible={loading.delete}
        message="Eliminando dentista..."
        description="Verificando dependencias..."
        spinner="circle"
        backdrop="blur"
      />

      {/* Modal Crear Dentista */}
      <Modal
        isOpen={ui.modals.create}
        onClose={() => toggleModal('create', false)}
        title="Registrar Nuevo Dentista"
        size="xl"
      >
        <DentistForm
          onSubmit={handleCreateDentist}
          onCancel={() => toggleModal('create', false)}
          loading={loading.create}
        />
      </Modal>

      {/* Modal Editar Dentista */}
      <Modal
        isOpen={ui.modals.edit}
        onClose={() => {
          toggleModal('edit', false);
          setSelectedDentist(null);
        }}
        title="Editar Dentista"
        size="xl"
      >
        <DentistForm
          initialData={selectedDentist}
          onSubmit={handleUpdateDentist}
          onCancel={() => {
            toggleModal('edit', false);
            setSelectedDentist(null);
          }}
          loading={loading.update}
        />
      </Modal>

      {/* Modal Detalle Dentista */}
      <Modal
        isOpen={ui.modals.detail}
        onClose={() => {
          toggleModal('detail', false);
          setSelectedDentist(null);
        }}
        title="Perfil del Dentista"
        size="xl"
      >
        {selectedDentist && (
          <div className="space-y-6">
            {(() => {
              const fullName = formatFullName(selectedDentist.nombres, selectedDentist.apellidos);
              return (
                <>
            {/* Header con foto */}
            <div className="flex items-start space-x-4">
              {selectedDentist.foto ? (
                <img
                  src={selectedDentist.foto}
                  alt={fullName}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">
                  Dr. {formatFullName(selectedDentist.nombres, selectedDentist.apellidos)}
                </h3>
                <p className="text-lg text-gray-600">{getMainSpecialty(selectedDentist.especialidades)}</p>
                <p className="text-sm text-gray-500 font-mono">{selectedDentist.numeroColegiatura}</p>
              </div>
            </div>

            {/* Biografía */}
            {selectedDentist.biografia && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Biografía</h4>
                <p className="text-gray-600">{selectedDentist.biografia}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Información Personal
                </h4>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">DNI</dt>
                    <dd className="text-sm text-gray-900">{selectedDentist.dni}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="text-sm text-gray-900">{selectedDentist.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Celular</dt>
                    <dd className="text-sm text-gray-900">{selectedDentist.celular}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Dirección</dt>
                    <dd className="text-sm text-gray-900">{selectedDentist.direccion}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Información Profesional
                </h4>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Consultorio</dt>
                    <dd className="text-sm text-gray-900">{selectedDentist.consultorio?.nombre}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Experiencia</dt>
                    <dd className="text-sm text-gray-900">{selectedDentist.añosExperiencia} años</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Duración Consulta</dt>
                    <dd className="text-sm text-gray-900">{selectedDentist.duracionConsultaDefault} minutos</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Pacientes por Día</dt>
                    <dd className="text-sm text-gray-900">{selectedDentist.pacientesPorDia}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Estadísticas */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Estadísticas
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedDentist.totalPacientes || 0}
                  </div>
                  <div className="text-sm text-blue-600">Total Pacientes</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {selectedDentist.citasCompletadasMes || 0}
                  </div>
                  <div className="text-sm text-green-600">Citas del Mes</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {selectedDentist.citasPendientes || 0}
                  </div>
                  <div className="text-sm text-orange-600">Citas Pendientes</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {selectedDentist.calificacionPromedio?.toFixed(1) || '0.0'}
                  </div>
                  <div className="text-sm text-purple-600">Calificación</div>
                </div>
              </div>
            </div>

            {/* Especialidades */}
            {selectedDentist.especialidades && selectedDentist.especialidades.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Especialidades
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedDentist.especialidades.map((especialidad, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-full"
                    >
                      {especialidad.nombre}
                      {especialidad.certificado && ' ✓'}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Servicios */}
            {selectedDentist.serviciosOfrecidos && selectedDentist.serviciosOfrecidos.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Servicios Ofrecidos
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedDentist.serviciosOfrecidos.map((servicio, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                    >
                      {servicio}
                    </span>
                  ))}
                </div>
              </div>
            )}
                </>
              );
            })()}

            <div className="flex justify-end gap-3 pt-4 border-t">
              <LoadingButton
                variant="outline"
                onClick={() => {
                  toggleModal('detail', false);
                  setSelectedDentist(null);
                }}
              >
                Cerrar
              </LoadingButton>
              <LoadingButton
                onClick={() => {
                  toggleModal('detail', false);
                  handleEditDentist(selectedDentist);
                }}
              >
                Editar Dentista
              </LoadingButton>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Eliminar Dentista */}
      <DeleteDentistModal
        isOpen={ui.modals.delete}
        onClose={() => {
          toggleModal('delete', false);
          setSelectedDentist(null);
        }}
        onConfirm={handleDeleteDentist}
        dentist={selectedDentist}
        loading={loading.delete}
      />
    </div>
  );
};

export default DentistsPage;