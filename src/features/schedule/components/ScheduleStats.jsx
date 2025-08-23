import React from 'react';
import { Calendar, Clock, Users, TrendingUp, TrendingDown, Activity, AlertTriangle } from 'lucide-react';
import Card from '../../../shared/components/ui/Card';
import { useSchedule } from '../hooks/useSchedule';
import { formatNumber } from '../utils/scheduleHelpers';

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

const ScheduleStats = ({ showComparison = true }) => {
  const { stats, loading, error } = useSchedule();

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
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
          title="Total Turnos"
          value={stats?.totalTurnos || 0}
          icon={Calendar}
          color="blue"
          loading={loading.stats}
        />
        <StatCard
          title="Turnos Disponibles"
          value={stats?.turnosDisponibles || 0}
          icon={Clock}
          color="green"
          loading={loading.stats}
          subtitle={`${stats?.totalTurnos > 0 ? Math.round((stats?.turnosDisponibles / stats?.totalTurnos) * 100) : 0}% del total`}
        />
        <StatCard
          title="Turnos Ocupados"
          value={stats?.turnosOcupados || 0}
          icon={Users}
          color="purple"
          loading={loading.stats}
        />
        <StatCard
          title="Tasa Utilización"
          value={`${stats?.tasaUtilizacion || 0}%`}
          icon={TrendingUp}
          color="orange"
          loading={loading.stats}
        />
      </div>

      {/* Métricas secundarias */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Turnos Bloqueados"
          value={stats?.turnosBloqueados || 0}
          icon={AlertTriangle}
          color="red"
          loading={loading.stats}
        />
        <StatCard
          title="Tasa No-Show"
          value={`${stats?.tasaNoShow || 0}%`}
          icon={Activity}
          color="yellow"
          loading={loading.stats}
        />
        <StatCard
          title="Ingresos Potenciales"
          value={`S/ ${formatNumber(stats?.ingresosPotenciales || 0)}`}
          icon={TrendingUp}
          color="green"
          loading={loading.stats}
        />
      </div>

      {/* Distribución por hora */}
      <Card title="Distribución por Hora">
        <div className="space-y-3">
          {stats?.distribucionPorHora?.slice(0, 8).map((hourData, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{hourData.hora}</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${hourData.tasaOcupacion}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-12 text-right">
                  {Math.round(hourData.tasaOcupacion)}%
                </span>
              </div>
            </div>
          )) || (
            <div className="text-center text-gray-500 py-4">
              No hay datos de distribución disponibles
            </div>
          )}
        </div>
      </Card>

      {/* Eficiencia por dentista */}
      <Card title="Eficiencia por Dentista">
        <div className="space-y-3">
          {stats?.eficienciaPorDentista?.slice(0, 5).map((dentistData, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{dentistData.dentistaNombre}</h4>
                <p className="text-sm text-gray-600">
                  {dentistData.totalTurnos} turnos • {Math.round(dentistData.tasaUtilizacion)}% utilización
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900">
                  {Math.round(dentistData.tasaUtilizacion)}%
                </div>
                <div className="text-xs text-gray-500">
                  {dentistData.tasaNoShow}% no-show
                </div>
              </div>
            </div>
          )) || (
            <div className="text-center text-gray-500 py-4">
              No hay datos de eficiencia disponibles
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ScheduleStats;