import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  Star, 
  TrendingUp,
  ArrowRight,
  User,
  Stethoscope
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { usePatientPortal } from '../store/patientContext';
import { patientAppointmentService } from '../services/patientAppointmentService';
import PatientHeader from '../components/ui/PatientHeader';
import AppointmentCard from '../components/appointments/AppointmentCard';
import LoadingButton from '../../../shared/components/ui/LoadingButton';

const PatientDashboardPage = () => {
  const { user } = usePatientPortal();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    
    try {
      // Load stats
      const statsResponse = await patientAppointmentService.getAppointmentStats();
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      // Load recent appointments (last 3)
      const appointmentsResponse = await patientAppointmentService.getAppointments({
        page: 1,
        limit: 3
      });
      if (appointmentsResponse.success) {
        setRecentAppointments(appointmentsResponse.data.appointments);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue' }) => {
    const colorClasses = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      purple: 'bg-purple-100 text-purple-600'
    };

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center">
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && (
              <p className="text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PatientHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PatientHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {getGreeting()}, {user?.nombre}
          </h1>
          <p className="text-gray-600">
            Aquí tienes un resumen de tu actividad dental
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Calendar}
            title="Total de Citas"
            value={stats?.total || 0}
            subtitle="Desde tu registro"
            color="blue"
          />
          
          <StatCard
            icon={CheckCircle}
            title="Citas Completadas"
            value={stats?.completadas || 0}
            subtitle={`${stats?.pendientes || 0} pendientes`}
            color="green"
          />
          
          <StatCard
            icon={Star}
            title="Valoraciones"
            value={stats?.conRating || 0}
            subtitle="Citas valoradas"
            color="yellow"
          />
          
          <StatCard
            icon={TrendingUp}
            title="Este Año"
            value={new Date().getFullYear()}
            subtitle="Cuidando tu sonrisa"
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Appointments */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Citas Recientes
                  </h2>
                  <LoadingButton
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/portal/citas')}
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    Ver todas
                  </LoadingButton>
                </div>
              </div>
              
              <div className="p-6">
                {recentAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {recentAppointments.map((appointment) => (
                      <div key={appointment.id} className="border border-gray-100 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-900">
                            {appointment.servicio.nombre}
                          </h3>
                          <span className={`
                            px-2 py-1 rounded-full text-xs font-medium
                            ${appointment.estado === 'completada' 
                              ? 'bg-green-100 text-green-800'
                              : appointment.estado === 'pendiente'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                            }
                          `}>
                            {appointment.estado}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {format(new Date(appointment.fecha), "dd/MM/yyyy")}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{appointment.hora}</span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{appointment.dentista.nombre}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No tienes citas registradas
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Programa tu primera cita para comenzar
                    </p>
                    <LoadingButton
                      variant="primary"
                      onClick={() => navigate('/reservar/cita')}
                    >
                      Reservar Cita
                    </LoadingButton>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Next Appointment */}
            {stats?.proximaCita && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Próxima Cita
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Stethoscope className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">{stats.proximaCita.servicio.nombre}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {format(new Date(stats.proximaCita.fecha), "dd 'de' MMMM", { locale: es })}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{stats.proximaCita.hora}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-600">
                    <User className="w-4 h-4" />
                    <span>{stats.proximaCita.dentista.nombre}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Acciones Rápidas
              </h3>
              
              <div className="space-y-3">
                <LoadingButton
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/reservar/cita')}
                  icon={<Calendar className="w-4 h-4" />}
                >
                  Reservar Nueva Cita
                </LoadingButton>
                
                <LoadingButton
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/portal/citas')}
                  icon={<Clock className="w-4 h-4" />}
                >
                  Ver Historial Completo
                </LoadingButton>
              </div>
            </div>

            {/* Health Tips */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Consejo del Día
              </h3>
              
              <p className="text-gray-700 text-sm mb-4">
                Recuerda cepillarte los dientes al menos 2 veces al día y usar hilo dental 
                para mantener una sonrisa saludable.
              </p>
              
              <div className="flex items-center text-blue-600 text-sm font-medium">
                <TrendingUp className="w-4 h-4 mr-1" />
                Cuida tu sonrisa diariamente
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboardPage;