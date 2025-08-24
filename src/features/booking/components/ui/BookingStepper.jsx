import React from 'react';
import { Check, User, MapPin, Stethoscope, Calendar, CreditCard, CheckCircle } from 'lucide-react';
import { BookingSteps } from '../../types/bookingTypes';

const BookingStepper = ({ currentStep, completedSteps = [] }) => {
  const steps = [
    {
      id: BookingSteps.PATIENT_IDENTIFICATION,
      title: 'Identificación',
      icon: User,
      description: 'Datos del paciente'
    },
    {
      id: BookingSteps.DISTRICT_SELECTION,
      title: 'Ubicación',
      icon: MapPin,
      description: 'Seleccionar distrito'
    },
    {
      id: BookingSteps.SERVICE_SELECTION,
      title: 'Servicio',
      icon: Stethoscope,
      description: 'Elegir tratamiento'
    },
    {
      id: BookingSteps.APPOINTMENT_SCHEDULING,
      title: 'Fecha y Hora',
      icon: Calendar,
      description: 'Programar cita'
    },
    {
      id: BookingSteps.PAYMENT_PROCESSING,
      title: 'Pago',
      icon: CreditCard,
      description: 'Procesar pago'
    },
    {
      id: BookingSteps.CONFIRMATION,
      title: 'Confirmación',
      icon: CheckCircle,
      description: 'Reserva confirmada'
    }
  ];

  const getStepStatus = (stepId) => {
    if (completedSteps.includes(stepId)) return 'completed';
    if (stepId === currentStep) return 'current';
    if (stepId < currentStep) return 'completed';
    return 'pending';
  };

  const getStepClasses = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-600 text-white border-green-600';
      case 'current':
        return 'bg-blue-600 text-white border-blue-600';
      default:
        return 'bg-gray-100 text-gray-400 border-gray-300';
    }
  };

  const getConnectorClasses = (stepId) => {
    const isCompleted = completedSteps.includes(stepId) || stepId < currentStep;
    return isCompleted ? 'bg-green-600' : 'bg-gray-300';
  };

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          const Icon = step.icon;
          
          return (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div className={`
                  w-12 h-12 rounded-full border-2 flex items-center justify-center
                  transition-all duration-200 relative z-10
                  ${getStepClasses(status)}
                `}>
                  {status === 'completed' ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                </div>
                
                {/* Step Info */}
                <div className="mt-2 text-center">
                  <div className={`text-sm font-medium ${
                    status === 'current' ? 'text-blue-600' : 
                    status === 'completed' ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 hidden sm:block">
                    {step.description}
                  </div>
                </div>
              </div>
              
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-4">
                  <div className={`
                    h-1 rounded-full transition-all duration-300
                    ${getConnectorClasses(step.id)}
                  `} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Progress Bar */}
      <div className="mt-6 bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${(currentStep / steps.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default BookingStepper;