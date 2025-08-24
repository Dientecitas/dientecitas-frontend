import React, { useEffect, useState } from 'react';
import { 
  Calendar, 
  Filter, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Download,
  Star
} from 'lucide-react';
import { usePatientPortal } from '../store/patientContext';
import { patientAppointmentService } from '../services/patientAppointmentService';
import PatientHeader from '../components/ui/PatientHeader';
import AppointmentCard from '../components/appointments/AppointmentCard';
import RatingModal from '../components/appointments/RatingModal';
import LoadingButton from '../../../shared/components/ui/LoadingButton';

const AppointmentHistoryPage = () => {
  const { 
    appointments, 
    appointmentsLoading, 
    filters, 
    pagination,
    loadAppointments,
    setFilters,
    setPage,
    submitRating,
    ratingLoading
  } = usePatientPortal();

  const [dentists, setDentists] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);

  useEffect(() => {
    loadAppointments();
    loadDentists();
  }, [filters, pagination.page]);

  const loadDentists = async () => {
    try {
      const response = await patientAppointmentService.getDentists();
      if (response.success) {
        setDentists(response.data);
      }
    } catch (error) {
      console.error('Error loading dentists:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ [key]: value });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRateAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowRatingModal(true);
  };

  const handleSubmitRating = async (appointmentId, rating) => {
    await submitRating(appointmentId, rating);
    setShowRatingModal(false);
    setSelectedAppointment(null);
  };

  const clearFilters = () => {
    setFilters({
      dateRange: 'all',
      status: 'all',
      dentist: 'all'
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.dateRange !== 'all') count++;
    if (filters.status !== 'all') count++;
    if (filters.dentist !== 'all') count++;
    return count;
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <div className="min-h-screen bg-gray-50">
      <PatientHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Historial de Citas
          </h1>
          <p className="text-gray-600">
            Revisa todas tus citas dentales y comparte tu experiencia
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <LoadingButton
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  icon={<Filter className="w-4 h-4" />}
                >
                  Filtros
                  {getActiveFiltersCount() > 0 && (
                    <span className="ml-1 bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                      {getActiveFiltersCount()}
                    </span>
                  )}
                </LoadingButton>

                {getActiveFiltersCount() > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Total: {pagination.total} citas</span>
              </div>
            </div>
          </div>

          {showFilters && (
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Date Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Período
                  </label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">Todas las fechas</option>
                    <option value="30days">Últimos 30 días</option>
                    <option value="3months">Últimos 3 meses</option>
                    <option value="6months">Últimos 6 meses</option>
                    <option value="1year">Último año</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="completada">Completadas</option>
                    <option value="pendiente">Pendientes</option>
                    <option value="cancelada">Canceladas</option>
                  </select>
                </div>

                {/* Dentist Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dentista
                  </label>
                  <select
                    value={filters.dentist}
                    onChange={(e) => handleFilterChange('dentist', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">Todos los dentistas</option>
                    {dentists.map((dentist) => (
                      <option key={dentist.id} value={dentist.id}>
                        {dentist.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Appointments List */}
        {appointmentsLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : appointments.length > 0 ? (
          <>
            <div className="space-y-4 mb-8">
              {appointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onRate={handleRateAppointment}
                  isRatingLoading={ratingLoading}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-6 py-4">
                <div className="text-sm text-gray-600">
                  Mostrando {((pagination.page - 1) * pagination.limit) + 1} a{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} de{' '}
                  {pagination.total} citas
                </div>

                <div className="flex items-center space-x-2">
                  <LoadingButton
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    icon={<ChevronLeft className="w-4 h-4" />}
                  >
                    Anterior
                  </LoadingButton>

                  <div className="flex space-x-1">
                    {[...Array(totalPages)].map((_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`
                            px-3 py-1 text-sm rounded-lg transition-colors
                            ${page === pagination.page
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-600 hover:bg-gray-100'
                            }
                          `}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <LoadingButton
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === totalPages}
                    icon={<ChevronRight className="w-4 h-4" />}
                  >
                    Siguiente
                  </LoadingButton>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron citas
            </h3>
            <p className="text-gray-600 mb-6">
              {getActiveFiltersCount() > 0
                ? 'Intenta ajustar los filtros para ver más resultados'
                : 'Aún no tienes citas registradas en el sistema'
              }
            </p>
            {getActiveFiltersCount() > 0 ? (
              <LoadingButton
                variant="outline"
                onClick={clearFilters}
              >
                Limpiar Filtros
              </LoadingButton>
            ) : (
              <LoadingButton
                variant="primary"
                onClick={() => window.location.href = '/reservar/cita'}
              >
                Reservar Primera Cita
              </LoadingButton>
            )}
          </div>
        )}
      </div>

      {/* Rating Modal */}
      <RatingModal
        isOpen={showRatingModal}
        onClose={() => {
          setShowRatingModal(false);
          setSelectedAppointment(null);
        }}
        appointment={selectedAppointment}
        onSubmit={handleSubmitRating}
        isLoading={ratingLoading}
      />
    </div>
  );
};

export default AppointmentHistoryPage;