import React from 'react';
import { 
  Calendar,
  Clock,
  User,
  DollarSign,
  Eye,
  Edit
} from 'lucide-react';
import Card from '../../../shared/components/ui/Card';
import LoadingButton from '../../../shared/components/ui/LoadingButton';
import { formatDate, formatTime, formatCurrency, getStatusColor, getStatusText } from '../utils/appointmentHelpers';

const AppointmentCards = ({ 
  appointments,
  onView,
  onEdit,
  loading = false 
}) => {
  if (loading) {
    return (
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (appointments.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <div className="text-gray-500 mb-2">No se encontraron citas</div>
          <p className="text-sm text-gray-400">
            Intenta ajustar los filtros de búsqueda
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            {/* Header con nombre y estado */}
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium text-gray-900">
                  {appointment.paciente?.nombres} {appointment.paciente?.apellidos}
                </h3>
                <p className="text-sm text-gray-500">{appointment.numero}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.estado)}`}>
                {getStatusText(appointment.estado)}
              </span>
            </div>

            {/* Fecha y hora */}
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{formatDate(appointment.fecha)}</span>
            </div>

            <div className="flex items-center text-sm text-gray-600 mb-2">
              <Clock className="w-4 h-4 mr-2" />
              <span>{formatTime(appointment.horaInicio)} - {formatTime(appointment.horaFin)}</span>
            </div>

            {/* Dentista */}
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <User className="w-4 h-4 mr-2" />
              <span>
                Dr. {appointment.dentista?.nombres} {appointment.dentista?.apellidos}
              </span>
            </div>

            {/* Servicio */}
            <div className="text-sm text-gray-700 mb-3">
              {appointment.servicios?.map(s => s.servicio).join(', ')}
            </div>
            <div className="text-xs text-gray-500 mb-3">
              {appointment.duracion} min
            </div>

            {/* Costo */}
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm font-medium text-gray-900">
                <DollarSign className="w-4 h-4 mr-1" />
                {formatCurrency(appointment.costo?.total || 0)}
              </div>
              <div className="flex space-x-2">
                <LoadingButton
                  size="sm"
                  variant="outline"
                  onClick={() => onView?.(appointment)}
                  title="Ver detalles"
                >
                  <Eye className="w-4 h-4" />
                </LoadingButton>
                <LoadingButton
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit?.(appointment)}
                  title="Editar"
                >
                  <Edit className="w-4 h-4" />
                </LoadingButton>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default AppointmentCards;