import React from 'react';
import { useBooking } from '../store/bookingContext';
import { BookingSteps } from '../types/bookingTypes';
import BookingStepper from '../components/ui/BookingStepper';
import BookingSummaryPanel from '../components/ui/BookingSummaryPanel';
import PatientIdentificationForm from '../components/PatientIdentificationForm';
import DistrictSelector from '../components/DistrictSelector';
import ServiceSelector from '../components/ServiceSelector';
import AppointmentScheduler from '../components/AppointmentScheduler';
import PaymentProcessor from '../components/PaymentProcessor';
import BookingConfirmation from '../components/BookingConfirmation';
import LoadingButton from '../../../shared/components/ui/LoadingButton';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const BookingPage = () => {
  const {
    currentStep,
    patient,
    district,
    service,
    appointment,
    payment,
    pricing,
    previousStep,
    nextStep
  } = useBooking();

  // Determinar si se puede navegar
  const canGoNext = () => {
    switch (currentStep) {
      case BookingSteps.PATIENT_IDENTIFICATION:
        return !!patient;
      case BookingSteps.DISTRICT_SELECTION:
        return !!district;
      case BookingSteps.SERVICE_SELECTION:
        return !!service;
      case BookingSteps.APPOINTMENT_SCHEDULING:
        return !!appointment;
      case BookingSteps.PAYMENT_PROCESSING:
        return !!payment;
      default:
        return false;
    }
  };

  const canGoPrevious = () => {
    return currentStep > BookingSteps.PATIENT_IDENTIFICATION;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case BookingSteps.PATIENT_IDENTIFICATION:
        return <PatientIdentificationForm />;
      
      case BookingSteps.DISTRICT_SELECTION:
        return (
          <DistrictSelector />
        );
      
      case BookingSteps.SERVICE_SELECTION:
        return (
          <ServiceSelector />
        );
      
      case BookingSteps.APPOINTMENT_SCHEDULING:
        return (
          <AppointmentScheduler />
        );
      
      case BookingSteps.PAYMENT_PROCESSING:
        return (
          <PaymentProcessor />
        );
      
      case BookingSteps.CONFIRMATION:
        return (
          <BookingConfirmation />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">Dientecitas</span>
            </div>
            
            <div className="text-sm text-gray-600">
              Reserva tu cita online
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stepper */}
        <div className="mb-8">
          <BookingStepper currentStep={currentStep} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {renderStepContent()}
            
            {/* Navigation Buttons */}
            {currentStep !== BookingSteps.CONFIRMATION && (
              <div className="flex justify-between mt-8 max-w-2xl mx-auto">
                <LoadingButton
                  variant="outline"
                  onClick={previousStep}
                  disabled={!canGoPrevious()}
                  icon={<ArrowLeft className="w-4 h-4" />}
                  iconPosition="left"
                >
                  Anterior
                </LoadingButton>
                
                <LoadingButton
                  variant="primary"
                  onClick={nextStep}
                  disabled={!canGoNext()}
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                >
                  Siguiente
                </LoadingButton>
              </div>
            )}
          </div>

          {/* Summary Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <BookingSummaryPanel
                patient={patient}
                district={district}
                service={service}
                appointment={appointment}
                pricing={pricing}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;