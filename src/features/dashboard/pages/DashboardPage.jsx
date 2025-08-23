import React from 'react';
import { useAuth } from '../../../shared/contexts/AuthContext';
import AdminDashboard from '../components/AdminDashboard';
import DentistDashboard from '../components/DentistDashboard';
import PatientDashboard from '../components/PatientDashboard';

const DashboardPage = () => {
  const { user } = useAuth();
  const userRole = user?.roles?.[0];

  const renderDashboard = () => {
    switch (userRole) {
      case 'admin':
        return <AdminDashboard />;
      case 'dentista':
        return <DentistDashboard />;
      case 'paciente':
        return <PatientDashboard />;
      default:
        return <div>Dashboard no disponible</div>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard
        </h1>
        <p className="text-gray-600 mt-1">
          Bienvenido, {user?.nombre} {user?.apellido}
        </p>
      </div>

      {renderDashboard()}
    </div>
  );
};

export default DashboardPage;