import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Calendar, Heart, Shield, Users } from 'lucide-react';
import { usePatientPortal } from '../store/patientContext';
import AuthToggle from '../components/auth/AuthToggle';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';

const PatientAuthPage = () => {
  const { isAuthenticated, login, register, isLoading, authError } = usePatientPortal();
  const [isLogin, setIsLogin] = useState(true);

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/portal" replace />;
  }

  const handleLogin = async (data) => {
    await login(data);
  };

  const handleRegister = async (data) => {
    await register(data);
  };

  const features = [
    {
      icon: Calendar,
      title: 'Gestiona tus Citas',
      description: 'Ve tu historial completo y programa nuevas citas fácilmente'
    },
    {
      icon: Heart,
      title: 'Cuida tu Salud',
      description: 'Mantén un registro de todos tus tratamientos dentales'
    },
    {
      icon: Shield,
      title: 'Datos Seguros',
      description: 'Tu información médica está protegida con los más altos estándares'
    },
    {
      icon: Users,
      title: 'Profesionales Expertos',
      description: 'Accede a un equipo de dentistas especializados y certificados'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex min-h-screen">
        {/* Left Panel - Features */}
        <div className="hidden lg:flex lg:w-1/2 bg-blue-600 text-white p-12 flex-col justify-center">
          <div className="max-w-md">
            <div className="flex items-center space-x-2 mb-8">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold">Dientecitas</span>
            </div>
            
            <h1 className="text-4xl font-bold mb-6">
              Tu sonrisa es nuestra prioridad
            </h1>
            
            <p className="text-xl text-blue-100 mb-12">
              Accede a tu portal personal y gestiona todas tus citas dentales de forma fácil y segura.
            </p>
            
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="bg-blue-500 p-2 rounded-lg flex-shrink-0">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-blue-100 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Auth Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">Dientecitas</span>
              </div>
              <p className="text-gray-600">Portal del Paciente</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {isLogin ? 'Bienvenido de vuelta' : 'Crear cuenta nueva'}
                </h2>
                <p className="text-gray-600">
                  {isLogin 
                    ? 'Ingresa a tu portal personal' 
                    : 'Únete a nuestra comunidad de pacientes'
                  }
                </p>
              </div>

              <AuthToggle isLogin={isLogin} onToggle={setIsLogin} />

              {isLogin ? (
                <LoginForm
                  onSubmit={handleLogin}
                  isLoading={isLoading}
                  error={authError}
                />
              ) : (
                <RegisterForm
                  onSubmit={handleRegister}
                  isLoading={isLoading}
                  error={authError}
                />
              )}

              {/* Demo Credentials */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-xs font-semibold text-gray-700 mb-2">Credenciales de prueba:</p>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>Email: juan.perez@email.com</p>
                  <p>Documento: 12345678</p>
                  <p>Contraseña: password123</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-8 text-sm text-gray-600">
              <p>
                ¿Necesitas ayuda?{' '}
                <button className="text-blue-600 hover:text-blue-500 font-medium">
                  Contacta con soporte
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientAuthPage;