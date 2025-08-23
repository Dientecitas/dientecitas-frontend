import React, { useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { useClinicContext } from '../store/clinicContext';
import { useClinics } from '../hooks/useClinics';
import LoadingButton from '../../../shared/components/ui/LoadingButton';
import Modal from '../../../shared/components/ui/Modal';
import LoadingOverlay from '../../../shared/components/ui/LoadingOverlay';
import PageLoader from '../../../shared/components/ui/PageLoader';
import ClinicStats from '../components/ClinicStats';
import ClinicFilters from '../components/ClinicFilters';
import ClinicList from '../components/ClinicList';
import ClinicForm from '../components/ClinicForm';
import DeleteClinicModal from '../components/DeleteClinicModal';

const ClinicsPage = () => {
  const {
    ui,
    selectedClinic,
    toggleModal,
    closeAllModals,
    setSelectedClinic
  } = useClinicContext();

  const { 
    createClinic, 
    updateClinic, 
    deleteClinic, 
    loading, 
    clinics
  } = useClinics();

  // Show page loader on initial load
  if (loading.clinics && !clinics.length) {
    return (
      <PageLoader 
        message="Cargando consultorios..." 
        description="Preparando el sistema de gestión"
        timeout={10000}
        onTimeout={() => console.error('Timeout loading clinics')}
      />
    );
  }

  // Handlers para modales
  const handleCreateClinic = async (data) => {
    const result = await createClinic(data);
    if (result.success) {
      toggleModal('create', false);
    }
    return result;
  };

  const handleUpdateClinic = async (data) => {
    if (!selectedClinic) return;
    const result = await updateClinic(selectedClinic.id, data);
    if (result.success) {
      toggleModal('edit', false);
      setSelectedClinic(null);
    }
    return result;
  };

  const handleDeleteClinic = async (id) => {
    const result = await deleteClinic(id);
    if (result.success) {
      toggleModal('delete', false);
      setSelectedClinic(null);
    }
    return result;
  };

  const handleViewClinic = (clinic) => {
    setSelectedClinic(clinic);
    toggleModal('detail', true);
  };

  const handleEditClinic = (clinic) => {
    setSelectedClinic(clinic);
    toggleModal('edit', true);
  };

  const handleDeleteClick = (clinic) => {
    setSelectedClinic(clinic);
    toggleModal('delete', true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestión de Consultorios
          </h1>
          <p className="text-gray-600 mt-1">
            Administra los consultorios odontológicos del sistema
          </p>
        </div>

        <div className="flex items-center gap-3">
          <LoadingButton
            variant="outline"
            onClick={() => window.location.reload()}
            loading={loading.clinics}
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
            Crear Consultorio
          </LoadingButton>
        </div>
      </div>

      {/* Estadísticas */}
      <ClinicStats />

      {/* Filtros */}
      <ClinicFilters />

      {/* Lista de consultorios */}
      <ClinicList
        onView={handleViewClinic}
        onEdit={handleEditClinic}
        onDelete={handleDeleteClick}
      />

      {/* Global loading overlay for operations */}
      <LoadingOverlay
        visible={loading.create}
        message="Creando consultorio..."
        description="Esto puede tomar unos segundos"
        spinner="circle"
        backdrop="blur"
      />

      <LoadingOverlay
        visible={loading.delete}
        message="Eliminando consultorio..."
        description="Verificando dependencias..."
        spinner="circle"
        backdrop="blur"
      />

      {/* Modal Crear Consultorio */}
      <Modal
        isOpen={ui.modals.create}
        onClose={() => toggleModal('create', false)}
        title="Crear Nuevo Consultorio"
        size="xl"
      >
        <ClinicForm
          onSubmit={handleCreateClinic}
          onCancel={() => toggleModal('create', false)}
          loading={loading.create}
        />
      </Modal>

      {/* Modal Editar Consultorio */}
      <Modal
        isOpen={ui.modals.edit}
        onClose={() => {
          toggleModal('edit', false);
          setSelectedClinic(null);
        }}
        title="Editar Consultorio"
        size="xl"
      >
        <ClinicForm
          initialData={selectedClinic}
          onSubmit={handleUpdateClinic}
          onCancel={() => {
            toggleModal('edit', false);
            setSelectedClinic(null);
          }}
          loading={loading.update}
        />
      </Modal>

      {/* Modal Detalle Consultorio */}
      <Modal
        isOpen={ui.modals.detail}
        onClose={() => {
          toggleModal('detail', false);
          setSelectedClinic(null);
        }}
        title="Detalles del Consultorio"
        size="xl"
      >
        {selectedClinic && (
          <div className="space-y-6">
            {/* Imagen principal */}
            {selectedClinic.imagenPrincipal && (
              <div className="w-full h-64 rounded-lg overflow-hidden">
                <img
                  src={selectedClinic.imagenPrincipal}
                  alt={selectedClinic.nombre}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Información General
                </h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Nombre</dt>
                    <dd className="text-sm text-gray-900">{selectedClinic.nombre}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Código</dt>
                    <dd className="text-sm text-gray-900 font-mono">{selectedClinic.codigo}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Tipo</dt>
                    <dd className="text-sm text-gray-900">
                      {selectedClinic.tipoClinica === 'publica' ? 'Pública' : 
                       selectedClinic.tipoClinica === 'privada' ? 'Privada' : 'Mixta'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Distrito</dt>
                    <dd className="text-sm text-gray-900">{selectedClinic.distrito?.nombre}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Dirección</dt>
                    <dd className="text-sm text-gray-900">{selectedClinic.direccion}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Teléfono</dt>
                    <dd className="text-sm text-gray-900">{selectedClinic.telefono}</dd>
                  </div>
                  {selectedClinic.email && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Email</dt>
                      <dd className="text-sm text-gray-900">{selectedClinic.email}</dd>
                    </div>
                  )}
                  {selectedClinic.sitioWeb && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Sitio Web</dt>
                      <dd className="text-sm text-gray-900">
                        <a 
                          href={selectedClinic.sitioWeb} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {selectedClinic.sitioWeb}
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Estadísticas
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {selectedClinic.cantidadDentistas || 0}
                    </div>
                    <div className="text-sm text-blue-600">Dentistas</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {selectedClinic.cantidadCitasHoy || 0}
                    </div>
                    <div className="text-sm text-green-600">Citas Hoy</div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {selectedClinic.capacidadConsultorios}
                    </div>
                    <div className="text-sm text-orange-600">Capacidad</div>
                  </div>
                  <div className={`p-4 rounded-lg ${selectedClinic.activo ? 'bg-green-50' : 'bg-red-50'}`}>
                    <div className={`text-sm font-medium ${selectedClinic.activo ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedClinic.activo ? 'Activo' : 'Inactivo'}
                    </div>
                    <div className={`text-sm ${selectedClinic.verificado ? 'text-green-600' : 'text-yellow-600'}`}>
                      {selectedClinic.verificado ? 'Verificado' : 'Pendiente'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Descripción
              </h3>
              <p className="text-gray-600">{selectedClinic.descripcion}</p>
            </div>

            {/* Servicios */}
            {selectedClinic.servicios && selectedClinic.servicios.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Servicios
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedClinic.servicios.map((servicio, index) => (
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

            {/* Especialidades */}
            {selectedClinic.especialidades && selectedClinic.especialidades.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Especialidades
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedClinic.especialidades.map((especialidad, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full"
                    >
                      {especialidad}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
              <LoadingButton
                variant="outline"
                onClick={() => {
                  toggleModal('detail', false);
                  setSelectedClinic(null);
                }}
              >
                Cerrar
              </LoadingButton>
              <LoadingButton
                onClick={() => {
                  toggleModal('detail', false);
                  handleEditClinic(selectedClinic);
                }}
              >
                Editar Consultorio
              </LoadingButton>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Eliminar Consultorio */}
      <DeleteClinicModal
        isOpen={ui.modals.delete}
        onClose={() => {
          toggleModal('delete', false);
          setSelectedClinic(null);
        }}
        onConfirm={handleDeleteClinic}
        clinic={selectedClinic}
        loading={loading.delete}
      />
    </div>
  );
};

export default ClinicsPage;