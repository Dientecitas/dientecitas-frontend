import React from 'react';
import { MapPin, Building, Users, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import Card from '../../../shared/components/ui/Card';
import { useDistrictStats } from '../hooks/useDistrictStats';
import { formatNumber } from '../utils/districtHelpers';

const StatCard = ({ title, value, icon: Icon, color, change, loading }) => {
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
              {formatNumber(value)}
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
        </div>
      </div>
    </Card>
  );
};

const DistrictStats = ({ districtId = null, showComparison = true }) => {
  const { metrics, comparison, loading, error, refreshStats } = useDistrictStats(districtId);

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

  if (districtId) {
    // Estadísticas específicas del distrito
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Consultorios"
          value={metrics?.consultorios || 0}
          icon={Building}
          color="blue"
          change={showComparison ? comparison?.consultorios?.change : undefined}
          loading={loading}
        />
        <StatCard
          title="Dentistas"
          value={metrics?.dentistas || 0}
          icon={Users}
          color="green"
          change={showComparison ? comparison?.dentistas?.change : undefined}
          loading={loading}
        />
        <StatCard
          title="Citas Totales"
          value={metrics?.citas || 0}
          icon={Activity}
          color="orange"
          change={showComparison ? comparison?.citas?.change : undefined}
          loading={loading}
        />
        <StatCard
          title="Eficiencia"
          value={`${metrics?.eficiencia || 0}`}
          icon={TrendingUp}
          color="purple"
          loading={loading}
        />
      </div>
    );
  }

  // Estadísticas generales
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Distritos"
          value={metrics?.totalDistritos || 0}
          icon={MapPin}
          color="blue"
          change={showComparison ? comparison?.totalDistritos?.change : undefined}
          loading={loading}
        />
        <StatCard
          title="Distritos Activos"
          value={metrics?.distritosActivos || 0}
          icon={Activity}
          color="green"
          change={showComparison ? comparison?.distritosActivos?.change : undefined}
          loading={loading}
        />
        <StatCard
          title="Total Consultorios"
          value={metrics?.totalConsultorios || 0}
          icon={Building}
          color="purple"
          change={showComparison ? comparison?.totalConsultorios?.change : undefined}
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Dentistas"
          value={metrics?.totalDentistas || 0}
          icon={Users}
          color="orange"
          loading={loading}
        />
        <StatCard
          title="Promedio Consultorios"
          value={metrics?.promedioConsultoriosPorDistrito || 0}
          icon={TrendingUp}
          color="indigo"
          loading={loading}
        />
        <StatCard
          title="Densidad Dentistas"
          value={metrics?.densidadDentistas || 0}
          icon={Activity}
          color="pink"
          loading={loading}
        />
      </div>

      {/* Métricas adicionales */}
      <Card title="Distribución por Estado">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {metrics?.porcentajeActivos || 0}%
            </div>
            <div className="text-sm text-gray-600">Activos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {metrics?.porcentajeInactivos || 0}%
            </div>
            <div className="text-sm text-gray-600">Inactivos</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DistrictStats;