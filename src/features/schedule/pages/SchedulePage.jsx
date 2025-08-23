import React, { useState } from 'react';
import { Plus, RefreshCw, Calendar, Grid3X3, List, BarChart3, Settings } from 'lucide-react';
import { useScheduleContext } from '../store/scheduleContext';
import { useSchedule } from '../hooks/useSchedule';
import LoadingButton from '../../../shared/components/ui/LoadingButton';
import Modal from '../../../shared/components/ui/Modal';
import LoadingOverlay from '../../../shared/components/ui/LoadingOverlay';
import PageLoader from '../../../shared/components/ui/PageLoader';
import ScheduleStats from '../components/ScheduleStats';
import ScheduleFilters from '../components/ScheduleFilters';
import ScheduleCalendar from '../components/ScheduleCalendar';
import TimeSlotGrid from '../components/TimeSlotGrid';
import ScheduleCreator from '../components/ScheduleCreator';
import ScheduleConflictResolver from '../components/ScheduleConflictResolver';
import DeleteScheduleModal from '../components/DeleteScheduleModal';

const SchedulePage = () => {
  const {
    ui,
    selectedTimeSlot,
    conflicts,
    toggleModal,
    setSelectedTimeSlot,
    setViewMode,
    setCalendarView
  } = useScheduleContext();

  const { 
    createTimeSlot, 
    updateTimeSlot, 
    deleteTimeSlot, 
    loading, 
    timeSlots,
    fetchTimeSlots,
    hasConflicts,
    getConflictCount
  } = useSchedule();

  // Show page loader on initial load
  if (loading.timeSlots && !timeSlots.length) {
    return (
      <PageLoader 
        message="Cargando sistema de turnos..." 
        description="Preparando calendario y disponibilidad"
        timeout={10000}
        onTimeout={() => console.error('Timeout loading schedule')}
        onRetry={() => fetchTimeSlots()}
      />
    );
  }

  // Handlers para modales
  const handleCreateTimeSlot = async (data) => {
    const result = await createTimeSlot(data);
    if (result.success) {
      toggleModal('create', false);
    }
    return result;
  };

  const handleUpdateTimeSlot = async (data) => {
    if (!selectedTimeSlot) return;
    const result = await updateTimeSlot(selectedTimeSlot.id, data);
    if (result.success) {
      toggleModal('edit', false);
      setSelectedTimeSlot(null);
    }
    return result;
  };

  const handleDeleteTimeSlot = async (id) => {
    const result = await deleteTimeSlot(id);
    if (result.success) {
      toggleModal('delete', false);
      setSelectedTimeSlot(null);
    }
    return result;
  };

  const handleViewTimeSlot = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
    toggleModal('detail', true);
  };

  const handleEditTimeSlot = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
    toggleModal('edit', true);
  };

  const handleDeleteClick = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
    toggleModal('delete', true);
  };

  const handleRefresh = () => {
    fetchTimeSlots();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestión de Turnos
          </h1>
          <p className="text-gray-600 mt-1">
            Administra la disponibilidad y horarios de los dentistas
          </p>
        </div>

        <div className="flex items-center gap-3">
          <LoadingButton
            variant="outline"
            onClick={handleRefresh}
            loading={loading.timeSlots}
            loadingText="Actualizando..."
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </LoadingButton>

          <LoadingButton
            variant="outline"
            onClick={() => toggleModal('analytics', true)}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </LoadingButton>

          <LoadingButton
            onClick={() => toggleModal('create', true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Crear Turnos
          </LoadingButton>
        </div>
      </div>

      {/* Alertas de conflictos */}
      {hasConflicts && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <Calendar className="w-5 h-5 text-red-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Conflictos de Horarios Detectados
                </h3>
                <p className="text-sm text-red-600">
                  {getConflictCount()} conflictos requieren atención
                </p>
              </div>
            </div>
            <LoadingButton
              size="sm"
              onClick={() => toggleModal('conflicts', true)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Resolver Conflictos
            </LoadingButton>
          </div>
        </div>
      )}

      {/* Estadísticas */}
      <ScheduleStats />

      {/* Filtros */}
      <ScheduleFilters />

      {/* Controles de vista */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Vista:</span>
          <div className="flex items-center gap-2">
            <LoadingButton
              variant={ui.viewMode === 'calendar' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('calendar')}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Calendario
            </LoadingButton>
            <LoadingButton
              variant={ui.viewMode === 'grid' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-4 h-4 mr-2" />
              Grilla
            </LoadingButton>
            <LoadingButton
              variant={ui.viewMode === 'list' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4 mr-2" />
              Lista
            </LoadingButton>
          </div>
        </div>

        {ui.viewMode === 'calendar' && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Período:</span>
            <LoadingButton
              variant={ui.calendarView === 'day' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setCalendarView('day')}
            >
              Día
            </LoadingButton>
            <LoadingButton
              variant={ui.calendarView === 'week' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setCalendarView('week')}
            >
              Semana
            </LoadingButton>
            <LoadingButton
              variant={ui.calendarView === 'month' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setCalendarView('month')}
            >
              Mes
            </LoadingButton>
          </div>
        )}
      </div>

      {/* Vista principal */}
      {ui.viewMode === 'calendar' && (
        <ScheduleCalendar
          onView={handleViewTimeSlot}
          onEdit={handleEditTimeSlot}
          onDelete={handleDeleteClick}
        />
      )}

      {ui.viewMode === 'grid' && (
        <TimeSlotGrid
          onView={handleViewTimeSlot}
          onEdit={handleEditTimeSlot}
          onDelete={handleDeleteClick}
        />
      )}

      {ui.viewMode === 'list' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Lista de Turnos ({timeSlots.length})
          </h3>
          <div className="space-y-3">
            {timeSlots.map((timeSlot) => (
              <div key={timeSlot.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div>
                  <h4 className="font-medium text-gray-900">
                    {timeSlot.fecha} • {timeSlot.horaInicio} - {timeSlot.horaFin}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {timeSlot.dentista?.nombres} {timeSlot.dentista?.apellidos} • {timeSlot.consultorio?.nombre}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      timeSlot.estado === 'disponible' ? 'bg-green-100 text-green-800' :
                      timeSlot.estado === 'reservado' ? 'bg-yellow-100 text-yellow-800' :
                      timeSlot.estado === 'ocupado' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {timeSlot.estado}
                    </span>
                    <span className="text-xs text-gray-500">
                      {timeSlot.duracion} min • {timeSlot.tipoTurno}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <LoadingButton
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewTimeSlot(timeSlot)}
                  >
                    Ver
                  </LoadingButton>
                  <LoadingButton
                    size="sm"
                    onClick={() => handleEditTimeSlot(timeSlot)}
                  >
                    Editar
                  </LoadingButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Global loading overlay for operations */}
      <LoadingOverlay
        visible={loading.create}
        message="Creando turnos..."
        description="Validando disponibilidad y conflictos"
        spinner="circle"
        backdrop="blur"
      />

      <LoadingOverlay
        visible={loading.bulk}
        message="Procesando turnos masivos..."
        description="Esto puede tomar varios minutos"
        spinner="circle"
        backdrop="blur"
      />

      <LoadingOverlay
        visible={loading.delete}
        message="Eliminando turnos..."
        description="Verificando impacto en citas existentes"
        spinner="circle"
        backdrop="blur"
      />

      {/* Modal Crear Turnos */}
      <Modal
        isOpen={ui.modals.create}
        onClose={() => toggleModal('create', false)}
        title="Crear Nuevos Turnos"
        size="xl"
      >
        <ScheduleCreator
          onSubmit={handleCreateTimeSlot}
          onCancel={() => toggleModal('create', false)}
          loading={loading.create}
        />
      </Modal>

      {/* Modal Editar Turno */}
      <Modal
        isOpen={ui.modals.edit}
        onClose={() => {
          toggleModal('edit', false);
          setSelectedTimeSlot(null);
        }}
        title="Editar Turno"
        size="lg"
      >
        <ScheduleCreator
          initialData={selectedTimeSlot}
          onSubmit={handleUpdateTimeSlot}
          onCancel={() => {
            toggleModal('edit', false);
            setSelectedTimeSlot(null);
          }}
          loading={loading.update}
        />
      </Modal>

      {/* Modal Detalle Turno */}
      <Modal
        isOpen={ui.modals.detail}
        onClose={() => {
          toggleModal('detail', false);
          setSelectedTimeSlot(null);
        }}
        title="Detalles del Turno"
        size="lg"
      >
        {selectedTimeSlot && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Información del Turno
                </h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Fecha y Hora</dt>
                    <dd className="text-sm text-gray-900">
                      {selectedTimeSlot.fecha} • {selectedTimeSlot.horaInicio} - {selectedTimeSlot.horaFin}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Duración</dt>
                    <dd className="text-sm text-gray-900">{selectedTimeSlot.duracion} minutos</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Dentista</dt>
                    <dd className="text-sm text-gray-900">
                      Dr. {selectedTimeSlot.dentista?.nombres} {selectedTimeSlot.dentista?.apellidos}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Consultorio</dt>
                    <dd className="text-sm text-gray-900">{selectedTimeSlot.consultorio?.nombre}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Tipo de Turno</dt>
                    <dd className="text-sm text-gray-900">{selectedTimeSlot.tipoTurno}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Estado</dt>
                    <dd className="text-sm text-gray-900">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        selectedTimeSlot.estado === 'disponible' ? 'bg-green-100 text-green-800' :
                        selectedTimeSlot.estado === 'reservado' ? 'bg-yellow-100 text-yellow-800' :
                        selectedTimeSlot.estado === 'ocupado' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {selectedTimeSlot.estado}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Configuración
                </h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Capacidad</dt>
                    <dd className="text-sm text-gray-900">
                      {selectedTimeSlot.citasActuales} / {selectedTimeSlot.capacidadMaxima}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Precio</dt>
                    <dd className="text-sm text-gray-900">
                      S/ {selectedTimeSlot.precioFinal || selectedTimeSlot.tarifaBase || 0}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Servicios Permitidos</dt>
                    <dd className="text-sm text-gray-900">
                      {selectedTimeSlot.serviciosPermitidos?.join(', ') || 'Todos'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Recurrente</dt>
                    <dd className="text-sm text-gray-900">
                      {selectedTimeSlot.esRecurrente ? 'Sí' : 'No'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Veces Reservado</dt>
                    <dd className="text-sm text-gray-900">{selectedTimeSlot.vecesReservado || 0}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Puntuación Demanda</dt>
                    <dd className="text-sm text-gray-900">
                      {selectedTimeSlot.puntuacionDemanda || 0}/10
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <LoadingButton
                variant="outline"
                onClick={() => {
                  toggleModal('detail', false);
                  setSelectedTimeSlot(null);
                }}
              >
                Cerrar
              </LoadingButton>
              <LoadingButton
                onClick={() => {
                  toggleModal('detail', false);
                  handleEditTimeSlot(selectedTimeSlot);
                }}
              >
                Editar Turno
              </LoadingButton>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Resolver Conflictos */}
      <Modal
        isOpen={ui.modals.conflicts}
        onClose={() => toggleModal('conflicts', false)}
        title="Resolver Conflictos de Horarios"
        size="xl"
      >
        <ScheduleConflictResolver
          conflicts={conflicts}
          onResolve={() => {
            toggleModal('conflicts', false);
            fetchTimeSlots();
          }}
          onCancel={() => toggleModal('conflicts', false)}
        />
      </Modal>

      {/* Modal Eliminar Turno */}
      <DeleteScheduleModal
        isOpen={ui.modals.delete}
        onClose={() => {
          toggleModal('delete', false);
          setSelectedTimeSlot(null);
        }}
        onConfirm={handleDeleteTimeSlot}
        timeSlot={selectedTimeSlot}
        loading={loading.delete}
      />
    </div>
  );
};

export default SchedulePage;