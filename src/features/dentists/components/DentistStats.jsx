import React from 'react';
import { User, Users, Award, TrendingUp, TrendingDown, Activity, Shield, CheckCircle } from 'lucide-react';
import Card from '../../../shared/components/ui/Card';
import { useDentistStats } from '../hooks/useDentistStats';
import { formatNumber } from '../utils/dentistHelpers';

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

const DentistStats = ({ showComparison = true }) => {
  const { metrics, chartData, loading, error, refreshStats } = useDentistStats();

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
          <button
            onClick={refreshStats}
            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Dentistas"
          value={metrics?.totalDentistas || 0}
          icon={Users}
          color="blue"
          loading={loading}
        />
        <StatCard
          title="Dentistas Activos"
          value={metrics?.dentistasActivos || 0}
          icon={Activity}
          color="green"
          loading={loading}
          subtitle={`${metrics?.porcentajeActivos || 0}% del total`}
        />
        <StatCard
          title="Verificados"
          value={metrics?.dentistasVerificados || 0}
          icon={Shield}
          color="purple"
          loading={loading}
          subtitle={`${metrics?.porcentajeVerificados || 0}% del total`}
        />
        <StatCard
          title="Aprobados"
          value={metrics?.dentistasAprobados || 0}
          icon={CheckCircle}
          color="orange"
          loading={loading}
          subtitle={`${metrics?.porcentajeAprobados || 0}% del total`}
        />
      </div>

      {/* Métricas secundarias */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Disponibles Hoy"
          value={metrics?.dentistasDisponibles || 0}
          icon={User}
          color="indigo"
          loading={loading}
          subtitle={`${metrics?.porcentajeDisponibles || 0}% disponibles`}
        />
        <StatCard
          title="Experiencia Promedio"
          value={`${metrics?.promedioExperiencia || 0} años`}
          icon={Award}
          color="pink"
          loading={loading}
        />
        <StatCard
          title="Pacientes Promedio"
          value={metrics?.promedioPacientesPorDentista || 0}
          icon={TrendingUp}
          color="cyan"
          loading={loading}
          subtitle="Por dentista"
        />
      </div>

      {/* Distribución por estado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Distribución por Estado">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                <span className="text-sm font-medium text-gray-700">Activos</span>
              </div>
              <div className="flex items-center">
                <span className="text-lg font-semibold text-gray-900 mr-2">
                  {formatNumber(metrics?.dentistasActivos || 0)}
                </span>
                <span className="text-sm text-gray-500">
                  ({metrics?.porcentajeActivos || 0}%)
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 rounded mr-3"></div>
                <span className="text-sm font-medium text-gray-700">Verificados</span>
              </div>
              <div className="flex items-center">
                <span className="text-lg font-semibold text-gray-900 mr-2">
                  {formatNumber(metrics?.dentistasVerificados || 0)}
                </span>
                <span className="text-sm text-gray-500">
                  ({metrics?.porcentajeVerificados || 0}%)
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded mr-3"></div>
                <span className="text-sm font-medium text-gray-700">Aprobados</span>
              </div>
              <div className="flex items-center">
                <span className="text-lg font-semibold text-gray-900 mr-2">
                  {formatNumber(metrics?.dentistasAprobados || 0)}
                </span>
                <span className="text-sm text-gray-500">
                  ({metrics?.porcentajeAprobados || 0}%)
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Especialidades Más Comunes">
          <div className="space-y-3">
            {metrics?.especialidadesMasComunes?.slice(0, 5).map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 truncate flex-1 mr-2">{item.especialidad}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full bg-blue-${(index + 1) * 100 + 200}`}
                      style={{ 
                        width: `${metrics.totalDentistas > 0 
                          ? (item.cantidad / metrics.totalDentistas) * 100 
                          : 0}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 w-8 text-right">{item.cantidad}</span>
                </div>
              </div>
            )) || (
              <div className="text-center text-gray-500 py-4">
                No hay datos disponibles
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DentistStats;