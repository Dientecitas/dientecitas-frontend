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
  MessageCircle,
  CheckSquare,
  Square,
  User,
  AlertTriangle,
  Heart,
  Shield
} from 'lucide-react';
import LoadingButton from '../../../shared/components/ui/LoadingButton';
import Card from '../../../shared/components/ui/Card';
import TableLoader from '../../../shared/components/ui/TableLoader';
import PatientCard from './PatientCard';
import { usePatientContext } from '../store/patientContext';
import { usePatients } from '../hooks/usePatients';
import { 
  formatDate, 
  formatFullName,
  calculateAge,
  getRiskLevelColor,
  getRiskLevelText,
  getPatientStatusColor,
  getPatientStatusText,
  formatInsuranceInfo
} from '../utils/patientHelpers';

const CardsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <Card key={i} className="animate-pulse">
        <div className="space-y-4">
          <div className="h-32 bg-gray-300 rounded"></div>
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

const PatientList = ({ 
  onView, 
  onEdit, 
  onDelete, 
  onToggleStatus,
  showActions = true,
  showMedicalInfo = true 
}) => {
  const {
    patients,
    pagination,
    ui,
    setViewMode,
    setSelectedPatient,
    toggleSelection,
    selectAll,
    setBulkAction
  } = usePatientContext();

  const { selectedIds } = ui;

  const { 
    loading, 
    changePage, 
    changeLimit,
    toggleStatus,
    bulkUpdate
  } = usePatients();

  const [actionLoading, setActionLoading] = React.useState({});

  // Manejar acciones individuales
  const handleAction = async (action, patient) => {
    setActionLoading(prev => ({ ...prev, [patient.id]: true }));
    
    try {
      switch (action) {
        case 'view':
          setSelectedPatient(patient);
          onView?.(patient);
          break;
        case 'edit':
          setSelectedPatient(patient);
          onEdit?.(patient);
          break;
        case 'delete':
          setSelectedPatient(patient);
          onDelete?.(patient);
          break;
        case 'toggle':
          await toggleStatus(patient.id);
          break;
        case 'call':
          if (patient.telefono) {
            window.open(`tel:${patient.telefono}`);
          }
          break;
        case 'email':
          if (patient.email) {
            window.open(`mailto:${patient.email}`);
          }
          break;
        case 'message':
          // Implementar sistema de mensajería
          console.log('Enviar mensaje a:', patient.nombres);
          break;
      }
    } finally {
      setActionLoading(prev => ({ ...prev, [patient.id]: false }));
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

  const handleSelectItem = (patientId) => {
    toggleSelection(patientId);
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
            disabled={pagination.page === 1 || loading.patients}
          >
            Anterior
          </LoadingButton>
          <LoadingButton
            variant="outline"
            onClick={() => changePage(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages || loading.patients}
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
              disabled={loading.patients}
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
                disabled={pagination.page === 1 || loading.patients}
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
                  disabled={loading.patients}
                  className="rounded-none"
                >
                  {page}
                </LoadingButton>
              ))}

              <LoadingButton
                variant="outline"
                size="sm"
                onClick={() => changePage(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages || loading.patients}
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
              {selectedIds.length} paciente{selectedIds.length > 1 ? 's' : ''} seleccionado{selectedIds.length > 1 ? 's' : ''}
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
          Lista de Pacientes ({pagination.total})
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

      {loading.patients ? (
        <TableLoader rows={5} columns={9} />
      ) : patients.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-2">No se encontraron pacientes</div>
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
                    onClick={() => handleSelectAll(selectedIds.length !== patients.length)}
                    className="flex items-center"
                  >
                    {selectedIds.length === patients.length ? (
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
                  Paciente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Información Médica
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Citas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seguro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Riesgo
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
              {patients.map((patient) => {
                const fullName = formatFullName(patient.nombres, patient.apellidos);
                const age = calculateAge(patient.fechaNacimiento);
                const hasCriticalAllergies = patient.alergias?.some(a => a.severidad === 'severa');
                const hasMedicalConditions = patient.condicionesMedicas?.length > 0;
                
                return (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleSelectItem(patient.id)}
                        className="flex items-center"
                      >
                        {selectedIds.includes(patient.id) ? (
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Square className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {patient.foto ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={patient.foto}
                              alt={fullName}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <User className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 flex items-center">
                            {fullName}
                            {hasCriticalAllergies && (
                              <AlertTriangle className="w-4 h-4 text-red-500 ml-2" title="Alergias severas" />
                            )}
                            {hasMedicalConditions && (
                              <Heart className="w-4 h-4 text-orange-500 ml-1" title="Condiciones médicas" />
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            DNI: {patient.dni} • {age} años
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{patient.telefono}</div>
                      <div className="text-sm text-gray-500">{patient.email}</div>
                      <div className="text-sm text-gray-500">{patient.distrito}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {patient.alergias?.length > 0 && (
                          <div className="text-xs text-red-600">
                            {patient.alergias.length} alergia{patient.alergias.length > 1 ? 's' : ''}
                          </div>
                        )}
                        {patient.condicionesMedicas?.length > 0 && (
                          <div className="text-xs text-orange-600">
                            {patient.condicionesMedicas.length} condición{patient.condicionesMedicas.length > 1 ? 'es' : ''}
                          </div>
                        )}
                        {patient.medicamentosActuales?.length > 0 && (
                          <div className="text-xs text-blue-600">
                            {patient.medicamentosActuales.length} medicamento{patient.medicamentosActuales.length > 1 ? 's' : ''}
                          </div>
                        )}
                        {(!patient.alergias?.length && !patient.condicionesMedicas?.length && !patient.medicamentosActuales?.length) && (
                          <div className="text-xs text-gray-500">Sin información médica</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{patient.totalCitas || 0} total</div>
                      <div className="text-sm text-gray-500">
                        {patient.ultimaCita ? `Última: ${formatDate(patient.ultimaCita)}` : 'Sin citas'}
                      </div>
                      {patient.proximaCita && (
                        <div className="text-sm text-green-600">
                          Próxima: {formatDate(patient.proximaCita)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        {patient.informacionSeguro?.tieneSeguro ? (
                          <div>
                            <div className="text-gray-900">{patient.informacionSeguro.compañia}</div>
                            <div className="text-gray-500">{patient.informacionSeguro.coberturaDental}% cobertura</div>
                          </div>
                        ) : (
                          <span className="text-gray-500">Sin seguro</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskLevelColor(patient.puntuacionRiesgo)}`}>
                        {getRiskLevelText(patient.puntuacionRiesgo)} ({patient.puntuacionRiesgo}/10)
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPatientStatusColor(patient.activo, patient.verificado, patient.registroCompleto)}`}>
                        {getPatientStatusText(patient.activo, patient.verificado, patient.registroCompleto)}
                      </span>
                    </td>
                    {showActions && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <LoadingButton
                            size="sm"
                            variant="outline"
                            onClick={() => handleAction('view', patient)}
                          >
                            <Eye className="w-4 h-4" />
                          </LoadingButton>
                          <LoadingButton
                            size="sm"
                            variant="outline"
                            onClick={() => handleAction('edit', patient)}
                          >
                            <Edit className="w-4 h-4" />
                          </LoadingButton>
                          <LoadingButton
                            size="sm"
                            variant="outline"
                            onClick={() => handleAction('call', patient)}
                          >
                            <Phone className="w-4 h-4" />
                          </LoadingButton>
                          <LoadingButton
                            size="sm"
                            variant="outline"
                            onClick={() => handleAction('toggle', patient)}
                            loading={actionLoading[patient.id]}
                          >
                            <Power className="w-4 h-4" />
                          </LoadingButton>
                          <LoadingButton
                            size="sm"
                            variant="danger"
                            onClick={() => handleAction('delete', patient)}
                            disabled={patient.proximaCita && new Date(patient.proximaCita) > new Date()}
                          >
                            <Trash2 className="w-4 h-4" />
                          </LoadingButton>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
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
          Pacientes ({pagination.total})
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

      {loading.patients ? (
        <CardsSkeleton />
      ) : patients.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <div className="text-gray-500 mb-2">No se encontraron pacientes</div>
            <p className="text-sm text-gray-400">
              Intenta ajustar los filtros de búsqueda
            </p>
          </div>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patients.map((patient) => (
              <PatientCard
                key={patient.id}
                patient={patient}
                onView={() => handleAction('view', patient)}
                onEdit={() => handleAction('edit', patient)}
                onDelete={() => handleAction('delete', patient)}
                onToggleStatus={() => handleAction('toggle', patient)}
                onCall={() => handleAction('call', patient)}
                onEmail={() => handleAction('email', patient)}
                onMessage={() => handleAction('message', patient)}
                showActions={showActions}
                showMedicalInfo={showMedicalInfo}
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

export default PatientList;