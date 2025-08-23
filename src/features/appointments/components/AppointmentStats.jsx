import React from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign
} from 'lucide-react';
import Card from '../../../shared/components/ui/Card';
import { useAppointmentContext } from '../store/appointmentContext';
import { useAppointments } from '../hooks/useAppointments';
import { formatCurrency } from '../utils/appointmentHelpers';

const AppointmentStats = () => {
  const { appointments } = useAppointmentContext();
  const { getAppointmentStats } = useAppointments();

  const stats = getAppointmentStats();

  const statCards = [
    {
      title: 'Total Citas',
      value: stats.totalAppointments,
      icon: Calendar,
      color: 'blue',
      trend: stats.totalTrend,
      description: 'Citas programadas'
    },
    {
      title: 'Completadas',
      value: stats.completedAppointments,
      icon: CheckCircle,
      color: 'green',
      trend: stats.completedTrend,
      description: 'Citas finalizadas'
    },
    {
      title: 'Pendientes',
      value: stats.pendingAppointments,
      icon: Clock,
      color: 'yellow',
      trend: stats.pendingTrend,
      description: 'Por realizar'
    },
    {
      title: 'Canceladas',
      value: stats.cancelledAppointments,
      icon: XCircle,
      color: 'red',
      trend: stats.cancelledTrend,
      description: 'No realizadas'
    },
    {
      title: 'Tasa Asistencia',
      value: `${stats.attendanceRate}%`,
      icon: Users,
      color: 'purple',
      trend: stats.attendanceTrend,
      description: 'Pacientes que asisten'
    },
    {
      title: 'Ingresos',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: 'indigo',
      trend: stats.revenueTrend,
      description: 'Ingresos totales'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
      red: 'bg-red-50 text-red-600 border-red-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
      indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200'
    };
    return colors[color] || colors.blue;
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return TrendingUp;
    if (trend < 0) return TrendingDown;
    return null;
  };

  const getTrendColor = (trend) => {
    if (trend > 0) return 'text-green-500';
    if (trend < 0) return 'text-red-500';
    return 'text-gray-500';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statCards.map((stat, index) => {
        const IconComponent = stat.icon;
        const TrendIcon = getTrendIcon(stat.trend);
        
        return (
          <Card key={index} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-2 rounded-lg border ${getColorClasses(stat.color)}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </h3>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </span>
                  
                  {TrendIcon && stat.trend !== 0 && (
                    <div className={`flex items-center gap-1 ${getTrendColor(stat.trend)}`}>
                      <TrendIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {Math.abs(stat.trend)}%
                      </span>
                    </div>
                  )}
                </div>
                
                <p className="text-xs text-gray-500 mt-1">
                  {stat.description}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default AppointmentStats;