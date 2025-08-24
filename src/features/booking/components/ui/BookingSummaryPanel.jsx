import React from 'react';
import { User, MapPin, Stethoscope, Calendar, Clock, DollarSign } from 'lucide-react';
import { formatCurrency, formatDate, formatTime } from '../../utils/bookingHelpers';

const BookingSummaryPanel = ({ 
  patient, 
  district, 
  service, 
  appointment, 
  pricing,
  className = '' 
}) => {
  if (!patient && !district && !service && !appointment) {
    return null;
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Resumen de tu Reserva
      </h3>
      
      <div className="space-y-4">
        {/* Patient Info */}
        {patient && (
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">
                {patient.nombres} {patient.apellidos}
              </div>
              <div className="text-sm text-gray-600">DNI: {patient.dni}</div>
              <div className="text-sm text-gray-600">{patient.telefono}</div>
            </div>
          </div>
        )}
        
        {/* District Info */}
        {district && (
          <div className="flex items-start space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <MapPin className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">{district.name}</div>
              <div className="text-sm text-gray-600">{district.address}</div>
              <div className="text-sm text-gray-600">{district.phone}</div>
            </div>
          </div>
        )}
        
        {/* Service Info */}
        {service && (
          <div className="flex items-start space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Stethoscope className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">{service.name}</div>
              <div className="text-sm text-gray-600">{service.category}</div>
              <div className="text-sm text-gray-600">{service.duration} minutos</div>
            </div>
          </div>
        )}
        
        {/* Appointment Info */}
        {appointment && (
          <div className="flex items-start space-x-3">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Calendar className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">
                {formatDate(new Date(appointment.date), 'EEEE, dd \'de\' MMMM')}
              </div>
              <div className="text-sm text-gray-600 flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{formatTime(appointment.timeSlot.time)}</span>
              </div>
              {appointment.dentist && (
                <div className="text-sm text-gray-600">
                  {appointment.dentist.name}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Pricing Summary */}
      {pricing && pricing.total > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span>{formatCurrency(pricing.subtotal)}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">IGV (18%):</span>
              <span>{formatCurrency(pricing.tax)}</span>
            </div>
            
            {pricing.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Descuento:</span>
                <span>-{formatCurrency(pricing.discount)}</span>
              </div>
            )}
            
            <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t border-gray-100">
              <span>Total:</span>
              <span className="flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                {formatCurrency(pricing.total)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingSummaryPanel;