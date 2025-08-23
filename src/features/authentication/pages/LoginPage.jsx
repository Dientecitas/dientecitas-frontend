import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../../shared/contexts/AuthContext';
import LoginForm from '../components/LoginForm';
import { UserCheck } from 'lucide-react';

const LoginPage = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-lg flex items-center justify-center">
            <UserCheck className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Bienvenido a Dientecitas
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sistema de gestión de citas odontológicas
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          <LoginForm />

          <div className="mt-6 text-center">
            <Link
              to="/auth/register"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              ¿No tienes cuenta? Regístrate aquí
            </Link>
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
            <p className="font-semibold mb-1">Usuarios de prueba:</p>
            <p>Admin: admin@dientecitas.com / admin123</p>
            <p>Dentista: dentista@dientecitas.com / dentista123</p>
            <p>Paciente: paciente@dientecitas.com / paciente123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;