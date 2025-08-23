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
  MoreVertical
} from 'lucide-react';
import LoadingButton from '../../../shared/components/ui/LoadingButton';
import Card from '../../../shared/components/ui/Card';
import TableLoader from '../../../shared/components/ui/TableLoader';
import DistrictCard from './DistrictCard';
import { useDistrictContext } from '../store/districtContext';
import { useDistricts } from '../hooks/useDistricts';
import { formatDate, formatNumber, getDistrictStatusColor, getDistrictStatusText } from '../utils/districtHelpers';

const CardsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <Card key={i} className="animate-pulse">
        <div className="space-y-4">
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

const DistrictList = ({ 
  onView, 
  onEdit, 
  onDelete, 
  onToggleStatus,
  showActions = true 
}) => {
  const {
    districts,
    pagination,
    ui,
    setViewMode,
    toggleModal,
    setSelectedDistrict
  } = useDistrictContext();

  const { 
    loading, 
    changePage, 
    changeLimit,
    toggleStatus 
  } = useDistricts();

  const [actionLoading, setActionLoading] = React.useState({});

  // Manejar acciones
  const handleAction = async (action, district) => {
    setActionLoading(prev => ({ ...prev, [district.id]: true }));
    
    try {
      switch (action) {
        case 'view':
          setSelectedDistrict(district);
          onView?.(district);
          break;
        case 'edit':
          setSelectedDistrict(district);
          onEdit?.(district);
          break;
        case 'delete':
          setSelectedDistrict(district);
          onDelete?.(district);
          break;
        case 'toggle':
          await toggleStatus(district.id);
          break;
      }
    } finally {
      setActionLoading(prev => ({ ...prev, [district.id]: false }));
    }
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
            disabled={pagination.page === 1 || loading.districts}
          >
            Anterior
          </LoadingButton>
          <LoadingButton
            variant="outline"
            onClick={() => changePage(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages || loading.districts}
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
              disabled={loading.districts}
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
                disabled={pagination.page === 1 || loading.districts}
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
                  disabled={loading.districts}
                  className="rounded-none"
                >
                  {page}
                </LoadingButton>
              ))}

              <LoadingButton
                variant="outline"
                size="sm"
                onClick={() => changePage(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages || loading.districts}
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

  // Vista de tabla
  const TableView = () => (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Lista de Distritos ({pagination.total})
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

      {loading.districts ? (
        <TableLoader rows={5} columns={6} />
      ) : districts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-2">No se encontraron distritos</div>
          <p className="text-sm text-gray-400">
            Intenta ajustar los filtros de búsqueda
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Distrito
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ubicación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recursos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                {showActions && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {districts.map((district) => (
                <tr key={district.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {district.nombre}
                      </div>
                      <div className="text-sm text-gray-500 font-mono">
                        {district.codigo}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{district.provincia}</div>
                    <div className="text-sm text-gray-500">{district.region}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-blue-600">
                        {formatNumber(district.cantidadConsultorios)} consultorios
                      </span>
                      <span className="text-green-600">
                        {formatNumber(district.cantidadDentistas)} dentistas
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDistrictStatusColor(district.activo)}`}>
                      {getDistrictStatusText(district.activo)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(district.fechaCreacion)}
                  </td>
                  {showActions && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <LoadingButton
                          size="sm"
                          variant="outline"
                          onClick={() => handleAction('view', district)}
                        >
                          <Eye className="w-4 h-4" />
                        </LoadingButton>
                        <LoadingButton
                          size="sm"
                          variant="outline"
                          onClick={() => handleAction('edit', district)}
                        >
                          <Edit className="w-4 h-4" />
                        </LoadingButton>
                        <LoadingButton
                          size="sm"
                          variant="outline"
                          onClick={() => handleAction('toggle', district)}
                          loading={actionLoading[district.id]}
                        >
                          <Power className="w-4 h-4" />
                        </LoadingButton>
                        <LoadingButton
                          size="sm"
                          variant="danger"
                          onClick={() => handleAction('delete', district)}
                          disabled={district.cantidadConsultorios > 0}
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
          Distritos ({pagination.total})
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

      {loading.districts ? (
        <CardsSkeleton />
      ) : districts.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <div className="text-gray-500 mb-2">No se encontraron distritos</div>
            <p className="text-sm text-gray-400">
              Intenta ajustar los filtros de búsqueda
            </p>
          </div>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {districts.map((district) => (
              <DistrictCard
                key={district.id}
                district={district}
                onView={() => handleAction('view', district)}
                onEdit={() => handleAction('edit', district)}
                onDelete={() => handleAction('delete', district)}
                onToggleStatus={() => handleAction('toggle', district)}
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

export default DistrictList;