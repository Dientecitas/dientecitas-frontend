import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../shared/contexts/AuthContext';
import { GlobalLoadingProvider } from '../shared/contexts/GlobalLoadingContext';
import { DistrictProvider } from '../features/districts/store/districtContext';
import { ClinicProvider } from '../features/clinics/store/clinicContext';
import { DentistProvider } from '../features/dentists/store/dentistContext';
import { PatientProvider } from '../features/patients/store/patientContext';
import { ScheduleProvider } from '../features/schedule/store/scheduleContext';
import { AppointmentProvider } from '../features/appointments/store/appointmentContext';
import { BookingProvider } from '../features/booking/store/bookingContext';
import { PaymentProvider } from '../features/payments/store/paymentContext';
import { PatientPortalProvider } from '../features/patient-portal/store/patientContext';
import LoadingOverlay from '../shared/components/ui/LoadingOverlay';
import { useGlobalLoading } from '../shared/contexts/GlobalLoadingContext';
import Layout from '../shared/components/layout/Layout';
import ProtectedRoute from '../features/authentication/components/ProtectedRoute';
import LoginPage from '../features/authentication/pages/LoginPage';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import DistrictsPage from '../features/districts/pages/DistrictsPage';
import ClinicsPage from '../features/clinics/pages/ClinicsPage';
import DentistsPage from '../features/dentists/pages/DentistsPage';
import PatientsPage from '../features/patients/pages/PatientsPage';
import PatientDetailPage from '../features/patients/pages/PatientDetailPage';
import SchedulePage from '../features/schedule/pages/SchedulePage';
import AppointmentsPage from '../features/appointments/pages/AppointmentsPage';
import PaymentsPage from '../features/payments/pages/PaymentsPage';
import LandingPage from '../features/booking/pages/LandingPage';
import BookingPage from '../features/booking/pages/BookingPage';
import PatientProtectedRoute from '../features/patient-portal/components/PatientProtectedRoute';
import PatientAuthPage from '../features/patient-portal/pages/PatientAuthPage';
import PatientDashboardPage from '../features/patient-portal/pages/PatientDashboardPage';
import AppointmentHistoryPage from '../features/patient-portal/pages/AppointmentHistoryPage';

const AppContent = () => {
  const { isGlobalOverlayVisible, globalOverlayMessage, hideGlobalOverlay } = useGlobalLoading();

  return (
    <>
      <Layout>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/reservar" element={<LandingPage />} />
          <Route path="/reservar/cita" element={<BookingPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          
          {/* Rutas protegidas */}
          <Route path="/portal/auth" element={<PatientAuthPage />} />
          <Route
            path="/portal"
            element={
              <PatientProtectedRoute>
                <PatientDashboardPage />
              </PatientProtectedRoute>
            }
          />
          <Route
            path="/portal/citas"
            element={
              <PatientProtectedRoute>
                <AppointmentHistoryPage />
              </PatientProtectedRoute>
            }
          />
          
          {/* Ruta protegida básica */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Rutas de administrador */}
          <Route
            path="/districts"
            element={
              <ProtectedRoute roles={['admin']}>
                <DistrictsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/clinics"
            element={
              <ProtectedRoute roles={['admin']}>
                <ClinicsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dentists"
            element={
              <ProtectedRoute roles={['admin']}>
                <DentistsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/patients"
            element={
              <ProtectedRoute roles={['admin', 'dentista']}>
                <PatientsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/patients/:id"
            element={
              <ProtectedRoute roles={['admin', 'dentista']}>
                <PatientDetailPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/schedule"
            element={
              <ProtectedRoute roles={['admin', 'dentista']}>
                <SchedulePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/appointments"
            element={
              <ProtectedRoute roles={['admin']}>
                <AppointmentsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payments"
            element={
              <ProtectedRoute roles={['admin']}>
                <PaymentsPage />
              </ProtectedRoute>
            }
          />

          {/* Rutas de paciente */}
          <Route
            path="/book-appointment"
            element={
              <ProtectedRoute roles={['paciente']}>
                <div>Reservar Cita (Próximamente)</div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-appointments"
            element={
              <ProtectedRoute roles={['paciente']}>
                <div>Mis Citas (Próximamente)</div>
              </ProtectedRoute>
            }
          />

          {/* Redirecciones */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Layout>

      {/* Global Loading Overlay */}
      <LoadingOverlay
        visible={isGlobalOverlayVisible}
        message={globalOverlayMessage}
        onCancel={hideGlobalOverlay}
        portal={true}
      />
    </>
  );
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GlobalLoadingProvider>
          <DistrictProvider>
            <ClinicProvider>
              <DentistProvider>
                <PatientProvider>
                  <ScheduleProvider>
                    <AppointmentProvider>
                      <PaymentProvider>
                        <BookingProvider>
                          <PatientPortalProvider>
                            <AppContent />
                          </PatientPortalProvider>
                        </BookingProvider>
                      </PaymentProvider>
                    </AppointmentProvider>
                  </ScheduleProvider>
                </PatientProvider>
              </DentistProvider>
            </ClinicProvider>
          </DistrictProvider>
        </GlobalLoadingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRouter;