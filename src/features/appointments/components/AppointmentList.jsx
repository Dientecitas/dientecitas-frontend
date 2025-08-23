import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Power, 
  ChevronLeft, 
  ChevronRight,
  Grid3X3,
  List,
  MoreVertical,
  Calendar,
  Clock,
  User,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import LoadingButton from '../../../shared/components/ui/LoadingButton';
import Card from '../../../shared/components/ui/Card';
import TableLoader from '../../../shared/components/ui/TableLoader';
import { useAppointmentContext } from '../store/appointmentContext';
import { useAppointments } from '../hooks/useAppointments';
import { formatDate, formatTime, formatCurrency, getStatusColor, getStatusText } from '../utils/appointmentHelpers';

const AppointmentList = ({ 
  onView, 
  onEdit, 
  onCancel, 
  onReschedule,
  onCheckIn,
  onComplete,
  showActions = true 
}) => {
  const {
    appointments,
    pagination,
    ui,
    setViewMode,
    setSelectedIds
  } = useAppointmentContext();

  const { 
    loading, 
    changePage, 
    changeLimit,
    changeStatus,
    bulkUpdateStatus
  } = useAppointments();

  const [selectedAppointments, setSelectedAppointments] = useState([]);
  const [actionLoading, setActionLoading] = useState({});

  // Manejar selección múltiple
  const handleSelectAll = (checked) => {
    if (checked) {
      const allIds = appointments.map(apt => apt.id);
      setSelectedAppointments(allIds);
      setSelectedIds(allIds);
    } else {
      setSelectedAppointments([]);
      setSelectedIds([]);
    }
  };

  const handleSelectAppointment = (appointmentId, checked) => {
    let newSelection;
    if (checked) {
      newSelection = [...selectedAppointments, appointmentId];
    } else {
      newSelection = selectedAppointments.filter(id => id !== appointmentId);
    }
    setSelectedAppointments(newSelection);
    setSelectedIds(newSelection);
  };

  // Manejar acciones individuales
  const handleAction = async (action, appointment) => {
    setActionLoading(prev => ({ ...prev, [appointment.id]: true }));
    
    try {
      switch (action) {
        case 'view':
          onView?.(appointment);
          break;
        case 'edit':
          onEdit?.(appointment);
          break;
        case 'cancel':
          onCancel?.(appointment);
          break;
        case 'reschedule':
          onReschedule?.(appointment);
          break;
        case 'checkin':
          await changeStatus(appointment.id, 'en_sala_espera', {
            motivo: 'Check-in realizado',
            userId: 'current-user'
          });
          onCheckIn?.(appointment);
          break;
        case 'complete':
          await changeStatus(appointment.id, 'completada', {
            motivo: 'Cita completada',
            userId: 'current-user'
          });
          onComplete?.(appointment);
          break;
      }
    } finally {
      setActionLoading(prev => ({ ...prev, [appointment.id]: false }));
    }
  };

  // Acciones masivas
  const handleBulkAction = async (action) => {
    if (selectedAppointments.length === 0) return;

    try {
      switch (action) {
        case 'confirm':
          await bulkUpdateStatus(selectedAppointments, 'confirmada', {
            motivo: 'Confirmación masiva',
            userId: 'current-user'
          });
          break;
        case 'cancel':
          await bulkUpdateStatus(selectedAppointments, 'cancelada', {
            motivo: 'Cancelación masiva',
            userId: 'current-user'
          });
          break;
      }
      setSelectedAppointments([]);
      setSelectedIds([]);
    } catch (error) {
      console.error('Error en acción masiva:', error);
    }
  };

  // Obtener acciones disponibles por estado
  const getAvailableActions = (appointment) => {
    const actions = [];
    
    actions.push({ key: 'view', label: 'Ver detalles', icon: Eye });
    
    if (['programada', 'confirmada'].includes(appointment.estado)) {
      actions.push({ key: 'edit', label: 'Editar', icon: Edit });
      actions.push({ key: 'reschedule', label: 'Reagendar', icon: Calendar });
      actions.push({ key: 'cancel', label: 'Cancelar', icon: XCircle });
    }
    
    if (appointment.estado === 'confirmada') {
      actions.push({ key: 'checkin', label: 'Check-in', icon: CheckCircle });
    }
    
    if (appointment.estado === 'en_consulta') {
      actions.push({ key: 'complete', label: 'Completar', icon: CheckCircle });
    }
    
    return actions;
  };

  // Componente de paginación
  const Pagination = () => {
    if (pagination.totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(1, pagination.page - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
        <div className="flex justify-between flex-1 sm:hidden">
          <LoadingButton
            variant="outline"
            onClick={() => changePage(pagination.page - 1)}
            disabled={pagination.page === 1 || loading.appointments}
          >
            Anterior
          </LoadingButton>
          <LoadingButton
            variant="outline"
            onClick={() => changePage(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages || loading.appointments}
          >
            Siguiente
          </LoadingButton>
        </div>

        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Mostrando{' '}
              <span className="font-medium">
                {(pagination.page - 1) * pagination.limit + 1}
              </span>{' '}
              a{' '}
              <span className="font-medium">
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </span>{' '}
              de{' '}
              <span className="font-medium">{pagination.total}</span>{' '}
              citas
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={pagination.limit}
              onChange={(e) => changeLimit(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
              disabled={loading.appointments}
            >
              <option value={10}>10 por página</option>
              <option value={25}>25 por página</option>
              <option value={50}>50 por página</option>
            </select>

            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <LoadingButton
                variant="outline"
                size="sm"
                onClick={() => changePage(pagination.page - 1)}
                disabled={pagination.page === 1 || loading.appointments}
                className="rounded-r-none"
              >
                <ChevronLeft className="w-4 h-4" />
              </LoadingButton>

              {pages.map(page => (
                <LoadingButton
                  key={page}
                  variant={page === pagination.page ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => changePage(page)}
                  disabled={loading.appointments}
                  className="rounded-none"
                >
                  {page}
                </LoadingButton>
              ))}

              <LoadingButton
                variant="outline"
                size="sm"
                onClick={() => changePage(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages || loading.appointments}
                className="rounded-l-none"
              >
                <ChevronRight className="w-4 h-4" />
              </LoadingButton>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <div className="space-y-4">
        {/* Header con controles */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            Citas ({pagination.total})
          </h3>
          <div className="flex items-center gap-2">
            <LoadingButton
              variant="outline"
              size="sm"
              onClick={() => setViewMode('cards')}
            >
              <Grid3X3 className="w-4 h-4" />
            </LoadingButton>
            <LoadingButton
              variant="primary"
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </LoadingButton>
          </div>
        </div>

        {/* Acciones masivas */}
        {selectedAppointments.length > 0 && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <span className="text-sm text-blue-700">
              {selectedAppointments.length} citas seleccionadas
            </span>
            <LoadingButton
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction('confirm')}
            >
              Confirmar
            </LoadingButton>
            <LoadingButton
              size="sm"
              variant="danger"
              onClick={() => handleBulkAction('cancel')}
            >
              Cancelar
            </LoadingButton>
          </div>
        )}

        {/* Tabla de citas */}
        {loading.appointments ? (
          <TableLoader rows={5} columns={8} />
        ) : appointments.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <div className="text-gray-500 mb-2">No se encontraron citas</div>
            <p className="text-sm text-gray-400">
              Intenta ajustar los filtros de búsqueda
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedAppointments.length === appointments.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cita
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paciente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dentista
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha y Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Servicios
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Costo
                  </th>
                  {showActions && (
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedAppointments.includes(appointment.id)}
                        onChange={(e) => handleSelectAppointment(appointment.id, e.target.checked)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.numero}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.tipoConsulta}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-500" />
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {appointment.paciente?.nombres} {appointment.paciente?.apellidos}
                          </div>
                          <div className="text-sm text-gray-500">
                            {appointment.paciente?.telefono}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {appointment.dentista?.nombres} {appointment.dentista?.apellidos}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.dentista?.especialidad}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm text-gray-900">
                            {formatDate(appointment.fecha)}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatTime(appointment.horaInicio)} - {formatTime(appointment.horaFin)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {appointment.servicios?.map(s => s.servicio).join(', ')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.duracion} min
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.estado)}`}>
                        {getStatusText(appointment.estado)}
                      </span>
                      {appointment.prioridad === 'urgente' && (
                        <AlertCircle className="h-4 w-4 text-red-500 ml-2 inline" />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(appointment.costo?.total || 0)}
                          </div>
                          <div className={`text-xs ${
                            appointment.costo?.estadoPago === 'pagado' 
                              ? 'text-green-600' 
                              : 'text-orange-600'
                          }`}>
                            {appointment.costo?.estadoPago || 'pendiente'}
                          </div>
                        </div>
                      </div>
                    </td>
                    {showActions && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          {getAvailableActions(appointment).slice(0, 2).map(action => (
                            <LoadingButton
                              key={action.key}
                              size="sm"
                              variant="outline"
                              onClick={() => handleAction(action.key, appointment)}
                              loading={actionLoading[appointment.id]}
                              title={action.label}
                            >
                              <action.icon className="w-4 h-4" />
                            </LoadingButton>
                          ))}
                          
                          {getAvailableActions(appointment).length > 2 && (
                            <div className="relative group">
                              <LoadingButton
                                size="sm"
                                variant="outline"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </LoadingButton>
                              
                              <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                {getAvailableActions(appointment).slice(2).map(action => (
                                  <button
                                    key={action.key}
                                    onClick={() => handleAction(action.key, appointment)}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                                  >
                                    <action.icon className="w-4 h-4 mr-2" />
                                    {action.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pagination />
      </div>
    </Card>
  );
};

export default AppointmentList;