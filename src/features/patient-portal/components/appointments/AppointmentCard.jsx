import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Stethoscope, 
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign
} from 'lucide-react';
import StarRating from '../ui/StarRating';
import LoadingButton from '../../../../shared/components/ui/LoadingButton';

const AppointmentCard = ({ appointment, onRate, isRatingLoading }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'completada':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          label: 'Completada'
        };
      case 'pendiente':
        return {
          icon: AlertCircle,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          label: 'Pendiente'
        };
      case 'cancelada':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          label: 'Cancelada'
        };
      default:
        return {
          icon: AlertCircle,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          label: status
        };
    }
  };

  const statusConfig = getStatusConfig(appointment.estado);
  const StatusIcon = statusConfig.icon;
  const appointmentDate = new Date(appointment.fecha);
  const canRate = appointment.estado === 'completada' && !appointment.rating;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        {/* Header with date and status */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {appointment.servicio.nombre}
            </h3>
            <p className="text-sm text-gray-600">
              {format(appointmentDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: es })}
            </p>
          </div>
          
          <div className={`
            inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
            ${statusConfig.color} ${statusConfig.bgColor}
          `}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {statusConfig.label}
          </div>
        </div>

        {/* Appointment details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{appointment.hora}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>{appointment.dentista.nombre}</span>
              <span className="text-xs text-gray-500">({appointment.dentista.especialidad})</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Stethoscope className="w-4 h-4" />
              <span>{appointment.servicio.categoria}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <div>{appointment.clinica.nombre}</div>
                <div className="text-xs text-gray-500">{appointment.clinica.direccion}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <DollarSign className="w-4 h-4" />
              <span>S/ {appointment.precio}</span>
            </div>
          </div>
        </div>

        {/* Observations */}
        {appointment.observaciones && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Observaciones:</span> {appointment.observaciones}
            </p>
          </div>
        )}

        {/* Rating section */}
        <div className="border-t border-gray-100 pt-4">
          {appointment.rating ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Tu valoración:</span>
                <StarRating rating={appointment.rating.stars} readonly size="sm" />
              </div>
              
              {appointment.rating.comment && (
                <p className="text-sm text-gray-600 italic">
                  "{appointment.rating.comment}"
                </p>
              )}
              
              <p className="text-xs text-gray-500">
                Valorado el {format(new Date(appointment.rating.fecha), "dd/MM/yyyy")}
              </p>
            </div>
          ) : canRate ? (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">¿Cómo fue tu experiencia?</span>
              <LoadingButton
                variant="outline"
                size="sm"
                onClick={() => onRate(appointment)}
                loading={isRatingLoading}
                icon={<Star className="w-4 h-4" />}
              >
                Valorar
              </LoadingButton>
            </div>
          ) : appointment.estado === 'completada' ? (
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <CheckCircle className="w-4 h-4" />
              <span>Cita completada</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;