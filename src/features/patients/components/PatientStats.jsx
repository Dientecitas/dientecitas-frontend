import React from 'react';
import { Users, User, Heart, Shield, TrendingUp, TrendingDown, Activity, Calendar } from 'lucide-react';
import Card from '../../../shared/components/ui/Card';
import { usePatients } from '../hooks/usePatients';
import { formatNumber } from '../utils/patientHelpers';

const StatCard = ({ title, value, icon: Icon, color, change, loading, subtitle }) => {
  const getChangeColor = (change) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeIcon = (change) => {
    if (change > 0) return TrendingUp;
    if (change < 0) return TrendingDown;
    return Activity;
  };

  const ChangeIcon = getChangeIcon(change);

  if (loading) {
    return (
      <Card className="animate-pulse">
        <div className="flex items-center">
          <div className={`p-3 rounded-lg bg-${color}-100`}>
            <div className="w-6 h-6 bg-gray-300 rounded"></div>
          </div>
          <div className="ml-4 flex-1">
            <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
            <div className="h-6 bg-gray-300 rounded w-16"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">
              {typeof value === 'string' ? value : formatNumber(value)}
            </p>
            {change !== undefined && (
              <div className={`ml-2 flex items-center ${getChangeColor(change)}`}>
                <ChangeIcon className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">
                  {Math.abs(change)}%
                </span>
              </div>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </Card>
  );
};

const PatientStats = ({ showComparison = true }) => {
  const { stats, loading, error } = usePatients();

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <Activity className="w-5 h-5 text-red-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error al cargar estadísticas
              </h3>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Pacientes"
          value={stats?.totalPacientes || 0}
          icon={Users}
          color="blue"
          loading={loading.stats}
        />
        <StatCard
          title="Pacientes Activos"
          value={stats?.pacientesActivos || 0}
          icon={Activity}
          color="green"
          loading={loading.stats}
          subtitle={`${stats?.porcentajeActivos || 0}% del total`}
        />
        <StatCard
          title="Verificados"
          value={stats?.pacientesVerificados || 0}
          icon={Shield}
          color="purple"
          loading={loading.stats}
          subtitle={`${stats?.porcentajeVerificados || 0}% del total`}
        />
        <StatCard
          title="Con Seguro"
          value={stats?.pacientesConSeguro || 0}
          icon={Heart}
          color="orange"
          loading={loading.stats}
          subtitle={`${stats?.porcentajeConSeguro || 0}% del total`}
        />
      </div>

      {/* Métricas secundarias */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Edad Promedio"
          value={`${stats?.edadPromedio || 0} años`}
          icon={User}
          color="indigo"
          loading={loading.stats}
        />
        <StatCard
          title="Satisfacción Promedio"
          value={`${stats?.satisfaccionPromedio || 0}/5`}
          icon={TrendingUp}
          color="pink"
          loading={loading.stats}
        />
        <StatCard
          title="Riesgo Promedio"
          value={`${stats?.riesgoPromedio || 0}/10`}
          icon={Activity}
          color="cyan"
          loading={loading.stats}
        />
      </div>

      {/* Distribuciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Distribución por Género">
          <div className="space-y-4">
            {stats?.distribucionGenero && Object.entries(stats.distribucionGenero).map(([genero, cantidad]) => (
              <div key={genero} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded mr-3 ${
                    genero === 'masculino' ? 'bg-blue-500' : 
                    genero === 'femenino' ? 'bg-pink-500' : 'bg-gray-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-700 capitalize">{genero}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-lg font-semibold text-gray-900 mr-2">
                    {formatNumber(cantidad)}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({stats.totalPacientes > 0 
                      ? Math.round((cantidad / stats.totalPacientes) * 100) 
                      : 0}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Distribución por Edad">
          <div className="space-y-4">
            {stats?.distribucionEdad && Object.entries(stats.distribucionEdad).map(([rango, cantidad]) => (
              <div key={rango} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                  <span className="text-sm font-medium text-gray-700">{rango} años</span>
                </div>
                <div className="flex items-center">
                  <span className="text-lg font-semibold text-gray-900 mr-2">
                    {formatNumber(cantidad)}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({stats.totalPacientes > 0 
                      ? Math.round((cantidad / stats.totalPacientes) * 100) 
                      : 0}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PatientStats;