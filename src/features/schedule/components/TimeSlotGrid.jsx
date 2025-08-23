import React from 'react';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Clock, 
  Users, 
  Calendar,
  ChevronLeft, 
  ChevronRight,
  CheckSquare,
  Square
} from 'lucide-react';
import LoadingButton from '../../../shared/components/ui/LoadingButton';
import Card from '../../../shared/components/ui/Card';
import TableLoader from '../../../shared/components/ui/TableLoader';
import { useScheduleContext } from '../store/scheduleContext';
import { useSchedule } from '../hooks/useSchedule';
import { 
  formatDate, 
  formatTime,
  getTimeSlotStatusColor,
  getTimeSlotStatusText,
  calculateSlotDuration
} from '../utils/scheduleHelpers';

const TimeSlotGrid = ({ onView, onEdit, onDelete, showActions = true }) => {
  const {
    timeSlots,
    pagination,
    ui,
    toggleSelection,
    selectAll,
    setBulkAction
  } = useScheduleContext();

  const { selectedIds } = ui;

  const { 
    loading, 
    changePage, 
    changeLimit,
    bulkUpdate
  } = useSchedule();

  const [actionLoading, setActionLoading] = React.useState({});

  // Manejar acciones individuales
  const handleAction = async (action, timeSlot) => {
    setActionLoading(prev => ({ ...prev, [timeSlot.id]: true }));
    
    try {
      switch (action) {
        case 'view':
          onView?.(timeSlot);
          break;
        case 'edit':
          onEdit?.(timeSlot);
          break;
        case 'delete':
          onDelete?.(timeSlot);
          break;
      }
    } finally {
      setActionLoading(prev => ({ ...prev, [timeSlot.id]: false }));
    }
  };

  // Manejar acciones masivas
  const handleBulkAction = async (action) => {
    if (selectedIds.length === 0) return;

    let updates = {};
    switch (action) {
      case 'block':
        updates = { estado: 'bloqueado' };
        break;
      case 'unblock':
        updates = { estado: 'disponible' };
        break;
      case 'increase_capacity':
        updates = { capacidadMaxima: (slot) => slot.capacidadMaxima + 1 };
        break;
    }

    await bulkUpdate(selectedIds, updates);
    setBulkAction(null);
  };

  // Manejar selección
  const handleSelectAll = (checked) => {
    selectAll(checked);
  };

  const handleSelectItem = (timeSlotId) => {
    toggleSelection(timeSlotId);
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
            disabled={pagination.page === 1 || loading.timeSlots}
          >
            Anterior
          </LoadingButton>
          <LoadingButton
            variant="outline"
            onClick={() => changePage(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages || loading.timeSlots}
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
              turnos
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={pagination.limit}
              onChange={(e) => changeLimit(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
              disabled={loading.timeSlots}
            >
              <option value={20}>20 por página</option>
              <option value={50}>50 por página</option>
              <option value={100}>100 por página</option>
            </select>

            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <LoadingButton
                variant="outline"
                size="sm"
                onClick={() => changePage(pagination.page - 1)}
                disabled={pagination.page === 1 || loading.timeSlots}
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
                  disabled={loading.timeSlots}
                  className="rounded-none"
                >
                  {page}
                </LoadingButton>
              ))}

              <LoadingButton
                variant="outline"
                size="sm"
                onClick={() => changePage(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages || loading.timeSlots}
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

  // Toolbar de acciones masivas
  const BulkActionsToolbar = () => {
    if (selectedIds.length === 0) return null;

    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-sm font-medium text-blue-900">
              {selectedIds.length} turno{selectedIds.length > 1 ? 's' : ''} seleccionado{selectedIds.length > 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <LoadingButton
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction('block')}
              loading={loading.bulk}
            >
              Bloquear
            </LoadingButton>
            <LoadingButton
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction('unblock')}
              loading={loading.bulk}
            >
              Desbloquear
            </LoadingButton>
            <LoadingButton
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction('increase_capacity')}
              loading={loading.bulk}
            >
              Aumentar Capacidad
            </LoadingButton>
            <LoadingButton
              size="sm"
              variant="outline"
              onClick={() => selectAll(false)}
            >
              Cancelar
            </LoadingButton>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Grilla de Turnos ({pagination.total})
        </h3>
      </div>

      <BulkActionsToolbar />

      {loading.timeSlots ? (
        <TableLoader rows={10} columns={9} />
      ) : timeSlots.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <div className="text-gray-500 mb-2">No hay turnos programados</div>
          <p className="text-sm text-gray-400">
            Crea turnos para que los pacientes puedan reservar citas
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSelectAll(selectedIds.length !== timeSlots.length)}
                    className="flex items-center"
                  >
                    {selectedIds.length === timeSlots.length ? (
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                    ) : selectedIds.length > 0 ? (
                      <div className="w-4 h-4 bg-blue-600 border-2 border-blue-600 rounded flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-sm"></div>
                      </div>
                    ) : (
                      <Square className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha y Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dentista
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Consultorio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                {showActions && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {timeSlots.map((timeSlot) => (
                <tr key={timeSlot.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleSelectItem(timeSlot.id)}
                      className="flex items-center"
                    >
                      {selectedIds.includes(timeSlot.id) ? (
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Square className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatDate(timeSlot.fecha)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {timeSlot.horaInicio} - {timeSlot.horaFin}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      Dr. {timeSlot.dentista?.nombres} {timeSlot.dentista?.apellidos}
                    </div>
                    <div className="text-sm text-gray-500">
                      {timeSlot.dentista?.especialidades?.[0]?.nombre || 'Odontología General'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{timeSlot.consultorio?.nombre}</div>
                    <div className="text-sm text-gray-500">{timeSlot.distrito?.nombre}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{timeSlot.tipoTurno}</div>
                    <div className="text-sm text-gray-500">{timeSlot.duracion} min</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-900">
                        {timeSlot.citasActuales} / {timeSlot.capacidadMaxima}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                      <div 
                        className={`h-1 rounded-full ${
                          timeSlot.citasActuales === timeSlot.capacidadMaxima ? 'bg-red-500' :
                          timeSlot.citasActuales / timeSlot.capacidadMaxima > 0.8 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ 
                          width: `${(timeSlot.citasActuales / timeSlot.capacidadMaxima) * 100}%` 
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      S/ {timeSlot.precioFinal || timeSlot.tarifaBase || 0}
                    </div>
                    {timeSlot.factorDemanda !== 1.0 && (
                      <div className="text-xs text-gray-500">
                        Factor: {timeSlot.factorDemanda}x
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTimeSlotStatusColor(timeSlot.estado)}`}>
                      {getTimeSlotStatusText(timeSlot.estado)}
                    </span>
                    {timeSlot.esRecurrente && (
                      <div className="text-xs text-blue-600 mt-1">Recurrente</div>
                    )}
                  </td>
                  {showActions && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <LoadingButton
                          size="sm"
                          variant="outline"
                          onClick={() => handleAction('view', timeSlot)}
                        >
                          <Eye className="w-4 h-4" />
                        </LoadingButton>
                        <LoadingButton
                          size="sm"
                          variant="outline"
                          onClick={() => handleAction('edit', timeSlot)}
                        >
                          <Edit className="w-4 h-4" />
                        </LoadingButton>
                        <LoadingButton
                          size="sm"
                          variant="danger"
                          onClick={() => handleAction('delete', timeSlot)}
                          disabled={timeSlot.citasActuales > 0}
                          loading={actionLoading[timeSlot.id]}
                        >
                          <Trash2 className="w-4 h-4" />
                        </LoadingButton>
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
    </Card>
  );
};

export default TimeSlotGrid;