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
  Map,
  Phone,
  Mail,
  Globe,
  CheckSquare,
  Square
} from 'lucide-react';
import LoadingButton from '../../../shared/components/ui/LoadingButton';
import Card from '../../../shared/components/ui/Card';
import TableLoader from '../../../shared/components/ui/TableLoader';
import ClinicCard from './ClinicCard';
import { useClinicContext } from '../store/clinicContext';
import { useClinics } from '../hooks/useClinics';
import { 
  formatDate, 
  formatNumber, 
  formatSchedule,
  isClinicOpen,
  getClinicStatusColor, 
  getClinicStatusText,
  getClinicTypeColor,
  getClinicTypeText
} from '../utils/clinicHelpers';

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

const ClinicList = ({ 
  onView, 
  onEdit, 
  onDelete, 
  onToggleStatus,
  showActions = true 
}) => {
  const {
    clinics,
    pagination,
    ui,
    setViewMode,
    toggleModal,
    setSelectedClinic,
    toggleSelection,
    selectAll,
    setBulkAction
  } = useClinicContext();

  const { selectedIds } = ui;

  const { 
    loading, 
    changePage, 
    changeLimit,
    toggleStatus,
    bulkUpdate
  } = useClinics();

  const [actionLoading, setActionLoading] = React.useState({});

  // Manejar acciones individuales
  const handleAction = async (action, clinic) => {
    setActionLoading(prev => ({ ...prev, [clinic.id]: true }));
    
    try {
      switch (action) {
        case 'view':
          setSelectedClinic(clinic);
          onView?.(clinic);
          break;
        case 'edit':
          setSelectedClinic(clinic);
          onEdit?.(clinic);
          break;
        case 'delete':
          setSelectedClinic(clinic);
          onDelete?.(clinic);
          break;
        case 'toggle':
          await toggleStatus(clinic.id);
          break;
        case 'call':
          if (clinic.telefono) {
            window.open(`tel:${clinic.telefono}`);
          }
          break;
        case 'email':
          if (clinic.email) {
            window.open(`mailto:${clinic.email}`);
          }
          break;
        case 'website':
          if (clinic.sitioWeb) {
            window.open(clinic.sitioWeb, '_blank');
          }
          break;
      }
    } finally {
      setActionLoading(prev => ({ ...prev, [clinic.id]: false }));
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
      case 'unverify':
        updates = { verificado: false };
        break;
    }

    await bulkUpdate(selectedIds, updates);
    setBulkAction(null);
  };

  // Manejar selección
  const handleSelectAll = (checked) => {
    selectAll(checked);
  };

  const handleSelectItem = (clinicId) => {
    toggleSelection(clinicId);
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
            disabled={pagination.page === 1 || loading.clinics}
          >
            Anterior
          </LoadingButton>
          <LoadingButton
            variant="outline"
            onClick={() => changePage(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages || loading.clinics}
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
              disabled={loading.clinics}
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
                disabled={pagination.page === 1 || loading.clinics}
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
                  disabled={loading.clinics}
                  className="rounded-none"
                >
                  {page}
                </LoadingButton>
              ))}

              <LoadingButton
                variant="outline"
                size="sm"
                onClick={() => changePage(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages || loading.clinics}
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
              {selectedIds.length} consultorio{selectedIds.length > 1 ? 's' : ''} seleccionado{selectedIds.length > 1 ? 's' : ''}
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
              onClick={() => handleBulkAction('deactivate')}
              loading={loading.bulk}
            >
              Desactivar
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
          Lista de Consultorios ({pagination.total})
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
          <LoadingButton
            variant="outline"
            size="sm"
            onClick={() => setViewMode('map')}
          >
            <Map className="w-4 h-4" />
          </LoadingButton>
        </div>
      </div>

      <BulkActionsToolbar />

      {loading.clinics ? (
        <TableLoader rows={5} columns={8} />
      ) : clinics.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-2">No se encontraron consultorios</div>
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
                  <button
                    onClick={() => handleSelectAll(selectedIds.length !== clinics.length)}
                    className="flex items-center"
                  >
                    {selectedIds.length === clinics.length ? (
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
                  Consultorio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ubicación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Horario Hoy
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recursos
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
              {clinics.map((clinic) => (
                <tr key={clinic.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleSelectItem(clinic.id)}
                      className="flex items-center"
                    >
                      {selectedIds.includes(clinic.id) ? (
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Square className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {clinic.imagenPrincipal ? (
                          <img
                            className="h-10 w-10 rounded-lg object-cover"
                            src={clinic.imagenPrincipal}
                            alt={clinic.nombre}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                            <Building className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {clinic.nombre}
                        </div>
                        <div className="text-sm text-gray-500 font-mono">
                          {clinic.codigo}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{clinic.direccion}</div>
                    <div className="text-sm text-gray-500">{clinic.distrito?.nombre}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getClinicTypeColor(clinic.tipoClinica)}`}>
                      {getClinicTypeText(clinic.tipoClinica)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {clinic.telefono && (
                        <button
                          onClick={() => handleAction('call', clinic)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Llamar"
                        >
                          <Phone className="w-4 h-4" />
                        </button>
                      )}
                      {clinic.email && (
                        <button
                          onClick={() => handleAction('email', clinic)}
                          className="text-green-600 hover:text-green-800"
                          title="Email"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                      )}
                      {clinic.sitioWeb && (
                        <button
                          onClick={() => handleAction('website', clinic)}
                          className="text-purple-600 hover:text-purple-800"
                          title="Sitio web"
                        >
                          <Globe className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <span className={`${isClinicOpen(clinic.horarios) ? 'text-green-600' : 'text-red-600'} font-medium`}>
                        {formatSchedule(clinic.horarios)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-blue-600">
                        {formatNumber(clinic.cantidadDentistas || 0)} dentistas
                      </span>
                      <span className="text-gray-600">
                        {formatNumber(clinic.capacidadConsultorios)} cap.
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getClinicStatusColor(clinic.activo, clinic.verificado)}`}>
                        {getClinicStatusText(clinic.activo, clinic.verificado)}
                      </span>
                    </div>
                  </td>
                  {showActions && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <LoadingButton
                          size="sm"
                          variant="outline"
                          onClick={() => handleAction('view', clinic)}
                        >
                          <Eye className="w-4 h-4" />
                        </LoadingButton>
                        <LoadingButton
                          size="sm"
                          variant="outline"
                          onClick={() => handleAction('edit', clinic)}
                        >
                          <Edit className="w-4 h-4" />
                        </LoadingButton>
                        <LoadingButton
                          size="sm"
                          variant="outline"
                          onClick={() => handleAction('toggle', clinic)}
                          loading={actionLoading[clinic.id]}
                        >
                          <Power className="w-4 h-4" />
                        </LoadingButton>
                        <LoadingButton
                          size="sm"
                          variant="danger"
                          onClick={() => handleAction('delete', clinic)}
                          disabled={clinic.cantidadDentistas > 0}
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

  // Vista de tarjetas
  const CardsView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          Consultorios ({pagination.total})
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
          <LoadingButton
            variant="outline"
            size="sm"
            onClick={() => setViewMode('map')}
          >
            <Map className="w-4 h-4" />
          </LoadingButton>
        </div>
      </div>

      <BulkActionsToolbar />

      {loading.clinics ? (
        <CardsSkeleton />
      ) : clinics.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <div className="text-gray-500 mb-2">No se encontraron consultorios</div>
            <p className="text-sm text-gray-400">
              Intenta ajustar los filtros de búsqueda
            </p>
          </div>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clinics.map((clinic) => (
              <ClinicCard
                key={clinic.id}
                clinic={clinic}
                onView={() => handleAction('view', clinic)}
                onEdit={() => handleAction('edit', clinic)}
                onDelete={() => handleAction('delete', clinic)}
                onToggleStatus={() => handleAction('toggle', clinic)}
                onCall={() => handleAction('call', clinic)}
                onEmail={() => handleAction('email', clinic)}
                onWebsite={() => handleAction('website', clinic)}
                showActions={showActions}
              />
            ))}
          </div>
          <Pagination />
        </>
      )}
    </div>
  );

  // Vista de mapa (placeholder)
  const MapView = () => (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Mapa de Consultorios ({pagination.total})
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
            variant="outline"
            size="sm"
            onClick={() => setViewMode('table')}
          >
            <List className="w-4 h-4" />
          </LoadingButton>
          <LoadingButton
            variant="primary"
            size="sm"
            onClick={() => setViewMode('map')}
          >
            <Map className="w-4 h-4" />
          </LoadingButton>
        </div>
      </div>

      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <Map className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Vista de Mapa</h3>
          <p className="text-gray-600">
            La integración con mapas estará disponible próximamente
          </p>
        </div>
      </div>
    </Card>
  );

  // Renderizar vista según el modo seleccionado
  const renderView = () => {
    switch (ui.viewMode) {
      case 'table':
        return <TableView />;
      case 'map':
        return <MapView />;
      case 'cards':
      default:
        return <CardsView />;
    }
  };

  return renderView();
};

export default ClinicList;