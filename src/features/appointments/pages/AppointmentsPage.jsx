import { Calendar, Clock, Edit, Eye, Grid3X3, List, Plus, RefreshCw, User } from 'lucide-react';
import LoadingButton from '../../../shared/components/ui/LoadingButton';
import LoadingOverlay from '../../../shared/components/ui/LoadingOverlay';
import Modal from '../../../shared/components/ui/Modal';
import PageLoader from '../../../shared/components/ui/PageLoader';
import AppointmentCalendar from '../components/AppointmentCalendar';
import AppointmentFilters from '../components/AppointmentFilters';
import AppointmentForm from '../components/AppointmentForm';
import AppointmentList from '../components/AppointmentList';
import AppointmentCards from '../components/AppointmentCards'; // Agregar import
import AppointmentStats from '../components/AppointmentStats';
import { useAppointments } from '../hooks/useAppointments';
import { useAppointmentContext } from '../store/appointmentContext';

// Mock data para testing
const mockPatients = [
  {
    id: 'p1',
    nombres: 'Juan Carlos',
    apellidos: 'Pérez García',
    dni: '12345678',
    telefono: '987654321',
    email: 'juan.perez@email.com'
  },
  {
    id: 'p2',
    nombres: 'Ana María',
    apellidos: 'Rodríguez Silva',
    dni: '87654321',
    telefono: '987654322',
    email: 'ana.rodriguez@email.com'
  },
  {
    id: 'p3',
    nombres: 'Luis Alberto',
    apellidos: 'Vargas Torres',
    dni: '11223344',
    telefono: '987654323',
    email: 'luis.vargas@email.com'
  }
];

const mockDentists = [
  {
    id: 'd1',
    nombres: 'Dr. María Elena',
    apellidos: 'González López',
    especialidad: 'Odontología General',
    telefono: '987123456'
  },
  {
    id: 'd2',
    nombres: 'Dr. Carlos Alberto',
    apellidos: 'Mendoza Ruiz',
    especialidad: 'Endodoncia',
    telefono: '987123457'
  }
];

const mockClinics = [
  {
    id: 'c1',
    nombre: 'Consultorio Central',
    direccion: 'Av. Principal 123, Miraflores',
    telefono: '01-234-5678'
  },
  {
    id: 'c2',
    nombre: 'Consultorio Norte',
    direccion: 'Jr. Los Olivos 456, San Isidro',
    telefono: '01-234-5679'
  }
];

const mockAvailableSlots = [
  {
    id: 'slot1',
    fecha: '2024-03-16',
    horaInicio: '09:00',
    horaFin: '09:30',
    dentistaId: 'd1',
    consultorioId: 'c1',
    disponible: true
  },
  {
    id: 'slot2',
    fecha: '2024-03-16',
    horaInicio: '10:00',
    horaFin: '10:30',
    dentistaId: 'd2',
    consultorioId: 'c2',
    disponible: true
  }
];

const AppointmentsPage = () => {
  const {
    ui,
    selectedAppointment,
    setViewMode,
    toggleModal,
    closeAllModals,
    setSelectedAppointment
  } = useAppointmentContext();

  const { 
    createAppointment, 
    updateAppointment, 
    cancelAppointment, 
    loading, 
    fetchAppointments,
    appointments
  } = useAppointments();

  // Show page loader on initial load
  if (loading.appointments && appointments.length === 0) {
    return (
      <PageLoader 
        message="Cargando citas..." 
        description="Preparando el sistema de gestión de citas"
        timeout={10000}
        onTimeout={() => console.error('Timeout loading appointments')}
        onRetry={() => fetchAppointments()}
      />
    );
  }

  // Handlers para modales
  const handleCreateAppointment = async (data) => {
    const result = await createAppointment(data);
    if (result.success) {
      toggleModal('create', false);
    }
    return result;
  };

  const handleUpdateAppointment = async (data) => {
    if (!selectedAppointment) return;
    const result = await updateAppointment(selectedAppointment.id, data);
    if (result.success) {
      toggleModal('edit', false);
      setSelectedAppointment(null);
    }
    return result;
  };

  const handleCancelAppointment = async (id) => {
    const result = await cancelAppointment(id);
    if (result.success) {
      toggleModal('cancel', false);
      setSelectedAppointment(null);
    }
    return result;
  };

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    toggleModal('detail', true);
  };

  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    toggleModal('edit', true);
  };

  const handleCancelClick = (appointment) => {
    setSelectedAppointment(appointment);
    toggleModal('cancel', true);
  };

  const handleRefresh = () => {
    fetchAppointments();
  };

  const handleDateSelect = (date) => {
    // Lógica para cuando se selecciona una fecha en el calendario
    console.log('Fecha seleccionada:', date);
  };

  const renderMainContent = () => {
    switch (ui.viewMode) {
      case 'calendar':
        return (
          <AppointmentCalendar
            appointments={appointments}
            onDateSelect={handleDateSelect}
            onView={handleViewAppointment}
            loading={loading.appointments}
          />
        );
      case 'grid':
        return (
          <AppointmentCards
            appointments={appointments}
            onView={handleViewAppointment}
            onEdit={handleEditAppointment}
            loading={loading.appointments}
          />
        );
      case 'list':
      default:
        return (
          <AppointmentList
            onView={handleViewAppointment}
            onEdit={handleEditAppointment}
            onCancel={handleCancelClick}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestión de Citas
          </h1>
          <p className="text-gray-600 mt-1">
            Administra las citas del sistema odontológico
          </p>
        </div>

        <div className="flex items-center gap-3">
          <LoadingButton
            variant="outline"
            onClick={handleRefresh}
            loading={loading.appointments}
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
            Nueva Cita
          </LoadingButton>
        </div>
      </div>

      {/* Estadísticas */}
      <AppointmentStats />

      {/* Filtros */}
      <AppointmentFilters />

      {/* Contenido principal */}
      <div className="space-y-6">
        {/* Controles de vista */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            Citas ({appointments.length})
          </h3>
          <div className="flex items-center gap-2">
            <LoadingButton
              variant={ui.viewMode === 'grid' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </LoadingButton>
            <LoadingButton
              variant={ui.viewMode === 'list' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </LoadingButton>
            <LoadingButton
              variant={ui.viewMode === 'calendar' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('calendar')}
            >
              <Calendar className="w-4 h-4" />
            </LoadingButton>
          </div>
        </div>

        {/* Contenido según vista seleccionada */}
        {renderMainContent()}
      </div>

      {/* Global loading overlay for operations */}
      <LoadingOverlay
        visible={loading.create}
        message="Creando cita..."
        description="Esto puede tomar unos segundos"
        spinner="circle"
        backdrop="blur"
      />

      <LoadingOverlay
        visible={loading.cancel}
        message="Cancelando cita..."
        description="Procesando cancelación..."
        spinner="circle"
        backdrop="blur"
      />

      {/* Modal Crear Cita */}
      <Modal
        isOpen={ui.modals.create}
        onClose={() => toggleModal('create', false)}
        title="Nueva Cita"
        size="xl"
      >
        <AppointmentForm
          onSubmit={handleCreateAppointment}
          onCancel={() => toggleModal('create', false)}
          loading={loading.create}
        />
      </Modal>

      {/* Modal Editar Cita */}
      <Modal
        isOpen={ui.modals.edit}
        onClose={() => {
          toggleModal('edit', false);
          setSelectedAppointment(null);
        }}
        title="Editar Cita"
        size="xl"
      >
        <AppointmentForm
          initialData={selectedAppointment}
          onSubmit={handleUpdateAppointment}
          onCancel={() => {
            toggleModal('edit', false);
            setSelectedAppointment(null);
          }}
          loading={loading.update}
        />
      </Modal>

      {/* Modal Detalle Cita */}
      <Modal
        isOpen={ui.modals.detail}
        onClose={() => {
          toggleModal('detail', false);
          setSelectedAppointment(null);
        }}
        title="Detalles de la Cita"
        size="xl"
      >
        {selectedAppointment && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Información de la Cita
                </h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Número</dt>
                    <dd className="text-sm text-gray-900 font-mono">{selectedAppointment.numero}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Fecha y Hora</dt>
                    <dd className="text-sm text-gray-900">
                      {selectedAppointment.fecha} - {selectedAppointment.horaInicio}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Duración</dt>
                    <dd className="text-sm text-gray-900">{selectedAppointment.duracion} minutos</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Estado</dt>
                    <dd className="text-sm text-gray-900">{selectedAppointment.estado}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Participantes
                </h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Paciente</dt>
                    <dd className="text-sm text-gray-900">
                      {selectedAppointment.paciente?.nombres} {selectedAppointment.paciente?.apellidos}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Dentista</dt>
                    <dd className="text-sm text-gray-900">
                      {selectedAppointment.dentista?.nombres} {selectedAppointment.dentista?.apellidos}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Consultorio</dt>
                    <dd className="text-sm text-gray-900">{selectedAppointment.consultorio?.nombre}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Servicios
              </h3>
              <div className="space-y-2">
                {selectedAppointment.servicios?.map((servicio, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-900">{servicio.servicio}</span>
                    <span className="text-sm text-gray-600">S/ {servicio.costo}</span>
                  </div>
                ))}
              </div>
            </div>

            {selectedAppointment.motivo && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Motivo de la Consulta
                </h3>
                <p className="text-gray-600">{selectedAppointment.motivo}</p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
              <LoadingButton
                variant="outline"
                onClick={() => {
                  toggleModal('detail', false);
                  setSelectedAppointment(null);
                }}
              >
                Cerrar
              </LoadingButton>
              <LoadingButton
                onClick={() => {
                  toggleModal('detail', false);
                  handleEditAppointment(selectedAppointment);
                }}
              >
                Editar Cita
              </LoadingButton>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Cancelar Cita */}
      <Modal
        isOpen={ui.modals.cancel}
        onClose={() => {
          toggleModal('cancel', false);
          setSelectedAppointment(null);
        }}
        title="Cancelar Cita"
        size="md"
      >
        {selectedAppointment && (
          <div className="space-y-4">
            <p className="text-gray-600">
              ¿Estás seguro de que deseas cancelar la cita de{' '}
              <strong>
                {selectedAppointment.paciente?.nombres} {selectedAppointment.paciente?.apellidos}
              </strong>{' '}
              programada para el {selectedAppointment.fecha} a las {selectedAppointment.horaInicio}?
            </p>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <LoadingButton
                variant="outline"
                onClick={() => {
                  toggleModal('cancel', false);
                  setSelectedAppointment(null);
                }}
                disabled={loading.cancel}
              >
                No, mantener cita
              </LoadingButton>
              
              <LoadingButton
                variant="danger"
                onClick={() => handleCancelAppointment(selectedAppointment.id)}
                loading={loading.cancel}
                loadingText="Cancelando..."
                disabled={loading.cancel}
                showSuccessState
              >
                Sí, cancelar cita
              </LoadingButton>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AppointmentsPage;