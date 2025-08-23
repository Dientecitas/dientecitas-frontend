import React, { useState } from 'react';
import { Plus, Grid3X3, List, RefreshCw } from 'lucide-react';
import { useDistrictContext } from '../store/districtContext';
import { useDistricts } from '../hooks/useDistricts';
import LoadingButton from '../../../shared/components/ui/LoadingButton';
import Card from '../../../shared/components/ui/Card';
import Modal from '../../../shared/components/ui/Modal';
import LoadingOverlay from '../../../shared/components/ui/LoadingOverlay';
import PageLoader from '../../../shared/components/ui/PageLoader';
import DistrictStats from '../components/DistrictStats';
import DistrictFilters from '../components/DistrictFilters';
import DistrictList from '../components/DistrictList';
import DistrictForm from '../components/DistrictForm';
import DeleteDistrictModal from '../components/DeleteDistrictModal';

const DistrictsPage = () => {
  const {
    ui,
    selectedDistrict,
    setViewMode,
    toggleModal,
    closeAllModals,
    setSelectedDistrict
  } = useDistrictContext();

  const { 
    createDistrict, 
    updateDistrict, 
    deleteDistrict, 
    loading, 
    fetchDistricts,
    districts
  } = useDistricts();

  // Show page loader on initial load
  if (loading.districts && !districts.length) {
    return (
      <PageLoader 
        message="Cargando distritos..." 
        description="Preparando el sistema de gestión"
        timeout={10000}
        onTimeout={() => console.error('Timeout loading districts')}
        onRetry={() => fetchDistricts()}
      />
    );
  }

  // Handlers para modales
  const handleCreateDistrict = async (data) => {
    const result = await createDistrict(data);
    if (result.success) {
      toggleModal('create', false);
    }
    return result;
  };

  const handleUpdateDistrict = async (data) => {
    if (!selectedDistrict) return;
    const result = await updateDistrict(selectedDistrict.id, data);
    if (result.success) {
      toggleModal('edit', false);
      setSelectedDistrict(null);
    }
    return result;
  };

  const handleDeleteDistrict = async (id) => {
    const result = await deleteDistrict(id);
    if (result.success) {
      toggleModal('delete', false);
      setSelectedDistrict(null);
    }
    return result;
  };

  const handleViewDistrict = (district) => {
    setSelectedDistrict(district);
    toggleModal('detail', true);
  };

  const handleEditDistrict = (district) => {
    setSelectedDistrict(district);
    toggleModal('edit', true);
  };

  const handleDeleteClick = (district) => {
    setSelectedDistrict(district);
    toggleModal('delete', true);
  };

  const handleRefresh = () => {
    fetchDistricts();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestión de Distritos
          </h1>
          <p className="text-gray-600 mt-1">
            Administra los distritos del sistema de citas odontológicas
          </p>
        </div>

        <div className="flex items-center gap-3">
          <LoadingButton
            variant="outline"
            onClick={handleRefresh}
            loading={loading.districts}
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
            Crear Distrito
          </LoadingButton>
        </div>
      </div>

      {/* Estadísticas */}
      <DistrictStats />

      {/* Filtros */}
      <DistrictFilters />

      {/* Lista de distritos */}
      <DistrictList
        onView={handleViewDistrict}
        onEdit={handleEditDistrict}
        onDelete={handleDeleteClick}
      />

      {/* Global loading overlay for operations */}
      <LoadingOverlay
        visible={loading.create}
        message="Creando distrito..."
        description="Esto puede tomar unos segundos"
        spinner="circle"
        backdrop="blur"
      />

      <LoadingOverlay
        visible={loading.delete}
        message="Eliminando distrito..."
        description="Verificando dependencias..."
        spinner="circle"
        backdrop="blur"
      />

      {/* Modal Crear Distrito */}
      <Modal
        isOpen={ui.modals.create}
        onClose={() => toggleModal('create', false)}
        title="Crear Nuevo Distrito"
        size="lg"
      >
        <DistrictForm
          onSubmit={handleCreateDistrict}
          onCancel={() => toggleModal('create', false)}
          loading={loading.create}
        />
      </Modal>

      {/* Modal Editar Distrito */}
      <Modal
        isOpen={ui.modals.edit}
        onClose={() => {
          toggleModal('edit', false);
          setSelectedDistrict(null);
        }}
        title="Editar Distrito"
        size="lg"
      >
        <DistrictForm
          initialData={selectedDistrict}
          onSubmit={handleUpdateDistrict}
          onCancel={() => {
            toggleModal('edit', false);
            setSelectedDistrict(null);
          }}
          loading={loading.update}
        />
      </Modal>

      {/* Modal Detalle Distrito */}
      <Modal
        isOpen={ui.modals.detail}
        onClose={() => {
          toggleModal('detail', false);
          setSelectedDistrict(null);
        }}
        title="Detalles del Distrito"
        size="xl"
      >
        {selectedDistrict && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Información General
                </h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Nombre</dt>
                    <dd className="text-sm text-gray-900">{selectedDistrict.nombre}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Código</dt>
                    <dd className="text-sm text-gray-900 font-mono">{selectedDistrict.codigo}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Provincia</dt>
                    <dd className="text-sm text-gray-900">{selectedDistrict.provincia}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Región</dt>
                    <dd className="text-sm text-gray-900">{selectedDistrict.region}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Población</dt>
                    <dd className="text-sm text-gray-900">
                      {selectedDistrict.poblacion ? selectedDistrict.poblacion.toLocaleString() : 'No especificada'}
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Estadísticas
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {selectedDistrict.cantidadConsultorios}
                    </div>
                    <div className="text-sm text-blue-600">Consultorios</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {selectedDistrict.cantidadDentistas}
                    </div>
                    <div className="text-sm text-green-600">Dentistas</div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {selectedDistrict.cantidadCitas}
                    </div>
                    <div className="text-sm text-orange-600">Citas</div>
                  </div>
                  <div className={`p-4 rounded-lg ${selectedDistrict.activo ? 'bg-green-50' : 'bg-red-50'}`}>
                    <div className={`text-sm font-medium ${selectedDistrict.activo ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedDistrict.activo ? 'Activo' : 'Inactivo'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Descripción
              </h3>
              <p className="text-gray-600">{selectedDistrict.descripcion}</p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <LoadingButton
                variant="outline"
                onClick={() => {
                  toggleModal('detail', false);
                  setSelectedDistrict(null);
                }}
              >
                Cerrar
              </LoadingButton>
              <LoadingButton
                onClick={() => {
                  toggleModal('detail', false);
                  handleEditDistrict(selectedDistrict);
                }}
              >
                Editar Distrito
              </LoadingButton>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Eliminar Distrito */}
      <DeleteDistrictModal
        isOpen={ui.modals.delete}
        onClose={() => {
          toggleModal('delete', false);
          setSelectedDistrict(null);
        }}
        onConfirm={handleDeleteDistrict}
        district={selectedDistrict}
        loading={loading.delete}
      />
    </div>
  );
};

export default DistrictsPage;