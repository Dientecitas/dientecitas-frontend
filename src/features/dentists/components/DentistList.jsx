import React from 'react';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Power, 
  ChevronLeft, 
  ChevronRight,
  Grid3X3,
  List,
  Phone,
  Mail,
  CheckSquare,
  Square,
  UserCheck
} from 'lucide-react';
import LoadingButton from '../../../shared/components/ui/LoadingButton';
import Card from '../../../shared/components/ui/Card';
import TableLoader from '../../../shared/components/ui/TableLoader';
import DentistCard from './DentistCard';
import { useDentistContext } from '../store/dentistContext';
import { useDentists } from '../hooks/useDentists';
import { 
  formatDate, 
  formatNumber, 
  formatExperience,
  formatSchedule,
  isDentistAvailable,
  getDentistStatusColor, 
  getDentistStatusText,
  getAvailabilityStatusColor,
  getAvailabilityStatusText,
  getMainSpecialty,
  formatFullName
} from '../utils/dentistHelpers';

const CardsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <Card key={i} className="animate-pulse">
        <div className="space-y-4">
          <div className="h-48 bg-gray-300 rounded"></div>
          <div className="h-6 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
          <div className="flex justify-between">
            <div className="h-8 bg-gray-300 rounded w-20"></div>
            <div className="h-8 bg-gray-300 rounded w-20"></div>
          </div>
        </div>
      </Card>
    ))}
  </div>
);

const DentistList = ({ 
  onView, 
  onEdit, 
  onDelete, 
  onToggleStatus,
  onApprove,
  showActions = true 
}) => {
  const {
    dentists,
    pagination,
    ui,
    setViewMode,
    setSelectedDentist,
    toggleSelection,
    selectAll,
    setBulkAction
  } = useDentistContext();

  const { selectedIds } = ui;

  const { 
    loading, 
    changePage, 
    changeLimit,
    toggleStatus,
    approveDentist,
    bulkUpdate
  } = useDentists();

  const [actionLoading, setActionLoading] = React.useState({});

  // Manejar acciones individuales
  const handleAction = async (action, dentist) => {
    setActionLoading(prev => ({ ...prev, [dentist.id]: true }));
    
    try {
      switch (action) {
        case 'view':
          setSelectedDentist(dentist);
          onView?.(dentist);
          break;
        case 'edit':
          setSelectedDentist(dentist);
          onEdit?.(dentist);
          break;
        case 'delete':
          setSelectedDentist(dentist);
          onDelete?.(dentist);
          break;
        case 'toggle':
          await toggleStatus(dentist.id);
          break;
        case 'approve':
          await approveDentist(dentist.id);
          break;
        case 'call':
          if (dentist.celular) {
            window.open(`tel:${dentist.celular}`);
          }
          break;
        case 'email':
          if (dentist.email) {
            window.open(`mailto:${dentist.email}`);
          }
          break;
      }
    } finally {
      setActionLoading(prev => ({ ...prev, [dentist.id]: false }));
    }
  };

  // Manejar acciones masivas
  const handleBulkAction = async (action) => {
    if (selectedIds.length === 0) return;

    let updates = {};
    switch (action) {
      case 'activate':
        updates = { activo: true };
        break;
      case 'deactivate':
        updates = { activo: false };
        break;
      case 'verify':
        updates = { verificado: true };
        break;
      case 'approve':
        updates = { aprobado: true };
        break;
    }

    await bulkUpdate(selectedIds, updates);
    setBulkAction(null);
  };

  // Manejar selección
  const handleSelectAll = (checked) => {
    selectAll(checked);
  };

  const handleSelectItem = (dentistId) => {
    toggleSelection(dentistId);
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
            disabled={pagination.page === 1 || loading.dentists}
          >
            Anterior
          </LoadingButton>
          <LoadingButton
            variant="outline"
            onClick={() => changePage(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages || loading.dentists}
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
              resultados
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={pagination.limit}
              onChange={(e) => changeLimit(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
              disabled={loading.dentists}
            >
              <option value={12}>12 por página</option>
              <option value={24}>24 por página</option>
              <option value={48}>48 por página</option>
            </select>

            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <LoadingButton
                variant="outline"
                size="sm"
                onClick={() => changePage(pagination.page - 1)}
                disabled={pagination.page === 1 || loading.dentists}
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
                  disabled={loading.dentists}
                  className="rounded-none"
                >
                  {page}
                </LoadingButton>
              ))}

              <LoadingButton
                variant="outline"
                size="sm"
                onClick={() => changePage(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages || loading.dentists}
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
              {selectedIds.length} dentista{selectedIds.length > 1 ? 's' : ''} seleccionado{selectedIds.length > 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <LoadingButton
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction('activate')}
              loading={loading.bulk}
            >
              Activar
            </LoadingButton>
            <LoadingButton
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction('verify')}
              loading={loading.bulk}
            >
              Verificar
            </LoadingButton>
            <LoadingButton
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction('approve')}
              loading={loading.bulk}
            >
              Aprobar
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

  // Vista de tabla
  const TableView = () => (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Lista de Dentistas ({pagination.total})
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
            onClick={() => setViewMode('table')}
          >
            <List className="w-4 h-4" />
          </LoadingButton>
        </div>
      </div>

      <BulkActionsToolbar />

      {loading.dentists ? (
        <TableLoader rows={5} columns={8} />
      ) : dentists.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-2">No se encontraron dentistas</div>
          <p className="text-sm text-gray-400">
            Intenta ajustar los filtros de búsqueda
          </p>
        </div>
      ) : (
        <div className="overflow-hidden">
          <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSelectAll(selectedIds.length !== dentists.length)}
                    className="flex items-center"
                  >
                    {selectedIds.length === dentists.length ? (
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
                  Dentista
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Especialidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Consultorio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Experiencia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Disponibilidad
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
              {dentists.map((dentist) => (
                <tr key={dentist.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleSelectItem(dentist.id)}
                      className="flex items-center"
                    >
                      {selectedIds.includes(dentist.id) ? (
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Square className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {dentist.foto ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={dentist.foto}
                            alt={formatFullName(dentist.nombres, dentist.apellidos)}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          Dr. {formatFullName(dentist.nombres, dentist.apellidos)}
                        </div>
                        <div className="text-sm text-gray-500 font-mono">
                          {dentist.numeroColegiatura}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{getMainSpecialty(dentist.especialidades)}</div>
                    <div className="text-sm text-gray-500">{formatExperience(dentist.añosExperiencia)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{dentist.consultorio?.nombre || 'No asignado'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{dentist.añosExperiencia} años</div>
                    <div className="text-sm text-gray-500">{formatNumber(dentist.totalPacientes)} pacientes</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {dentist.celular && (
                        <button
                          onClick={() => handleAction('call', dentist)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Llamar"
                        >
                          <Phone className="w-4 h-4" />
                        </button>
                      )}
                      {dentist.email && (
                        <button
                          onClick={() => handleAction('email', dentist)}
                          className="text-green-600 hover:text-green-800"
                          title="Email"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAvailabilityStatusColor(dentist.estadoDisponibilidad)}`}>
                        {getAvailabilityStatusText(dentist.estadoDisponibilidad)}
                      </span>
                      <div className="text-xs text-gray-500">
                        {dentist.turnosDisponiblesHoy} turnos hoy
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDentistStatusColor(dentist.activo, dentist.verificado, dentist.aprobado)}`}>
                        {getDentistStatusText(dentist.activo, dentist.verificado, dentist.aprobado)}
                      </span>
                    </div>
                  </td>
                  {showActions && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <LoadingButton
                          size="sm"
                          variant="outline"
                          onClick={() => handleAction('view', dentist)}
                        >
                          <Eye className="w-4 h-4" />
                        </LoadingButton>
                        <LoadingButton
                          size="sm"
                          variant="outline"
                          onClick={() => handleAction('edit', dentist)}
                        >
                          <Edit className="w-4 h-4" />
                        </LoadingButton>
                        {!dentist.aprobado && (
                          <LoadingButton
                            size="sm"
                            variant="success"
                            onClick={() => handleAction('approve', dentist)}
                            loading={actionLoading[dentist.id]}
                          >
                            <UserCheck className="w-4 h-4" />
                          </LoadingButton>
                        )}
                        <LoadingButton
                          size="sm"
                          variant="outline"
                          onClick={() => handleAction('toggle', dentist)}
                          loading={actionLoading[dentist.id]}
                        >
                          <Power className="w-4 h-4" />
                        </LoadingButton>
                        <LoadingButton
                          size="sm"
                          variant="danger"
                          onClick={() => handleAction('delete', dentist)}
                          disabled={dentist.citasPendientes > 0}
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
        </div>
      )}

      <Pagination />
    </Card>
  );

  // Vista de tarjetas
  const CardsView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          Dentistas ({pagination.total})
        </h3>
        <div className="flex items-center gap-2">
          <LoadingButton
            variant="primary"
            size="sm"
            onClick={() => setViewMode('cards')}
          >
            <Grid3X3 className="w-4 h-4" />
          </LoadingButton>
          <LoadingButton
            variant="outline"
            size="sm"
            onClick={() => setViewMode('table')}
          >
            <List className="w-4 h-4" />
          </LoadingButton>
        </div>
      </div>

      <BulkActionsToolbar />

      {loading.dentists ? (
        <CardsSkeleton />
      ) : dentists.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <div className="text-gray-500 mb-2">No se encontraron dentistas</div>
            <p className="text-sm text-gray-400">
              Intenta ajustar los filtros de búsqueda
            </p>
          </div>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dentists.map((dentist) => (
              <DentistCard
                key={dentist.id}
                dentist={dentist}
                onView={() => handleAction('view', dentist)}
                onEdit={() => handleAction('edit', dentist)}
                onDelete={() => handleAction('delete', dentist)}
                onToggleStatus={() => handleAction('toggle', dentist)}
                onApprove={() => handleAction('approve', dentist)}
                onCall={() => handleAction('call', dentist)}
                onEmail={() => handleAction('email', dentist)}
                showActions={showActions}
              />
            ))}
          </div>
          <Pagination />
        </>
      )}
    </div>
  );

  return ui.viewMode === 'table' ? <TableView /> : <CardsView />;
};

export default DentistList;