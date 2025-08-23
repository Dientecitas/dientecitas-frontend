import React from 'react';
import { 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield,
  Building,
  Smartphone
} from 'lucide-react';
import Card from '../../../shared/components/ui/Card';
import { usePayments } from '../hooks/usePayments';
import { formatCurrency, formatPercentage } from '../utils/paymentHelpers';

const StatCard = ({ title, value, icon: Icon, color, change, loading, subtitle }) => {
  const getChangeColor = (change) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeIcon = (change) => {
    if (change > 0) return TrendingUp;
    if (change < 0) return TrendingDown;
    return null;
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
              {value}
            </p>
            {change !== undefined && ChangeIcon && (
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

const PaymentStats = ({ showComparison = true, period = 'month' }) => {
  const { stats: rawStats, loading, error } = usePayments();
  const stats = rawStats || {};

  if (error?.stats) {
    return (
      <Card className="border-red-200 bg-red-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Error al cargar estadísticas
              </h3>
              <p className="text-sm text-red-600">{error?.stats}</p>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Estadísticas principales
  const mainStats = [
    {
      title: 'Ingresos Totales',
      value: formatCurrency(stats?.totalAmount || 0),
      icon: DollarSign,
      color: 'green',
      change: 12.5,
      subtitle: `${stats?.totalPayments || 0} transacciones`
    },
    {
      title: 'Tasa de Éxito',
      value: formatPercentage(stats?.successRate || 0),
      icon: CheckCircle,
      color: 'blue',
      change: 2.1,
      subtitle: 'Pagos exitosos'
    },
    {
      title: 'Monto Promedio',
      value: formatCurrency(stats?.averageAmount || 0),
      icon: TrendingUp,
      color: 'purple',
      change: -1.8,
      subtitle: 'Por transacción'
    },
    {
      title: 'Tasa de Fraude',
      value: formatPercentage(stats?.fraudRate || 0),
      icon: Shield,
      color: 'red',
      change: -0.5,
      subtitle: 'Transacciones bloqueadas'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            change={showComparison ? stat.change : undefined}
            loading={loading.stats}
            subtitle={stat.subtitle}
          />
        ))}
      </div>

      {/* Distribución por método de pago */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Distribución por Método de Pago">
          {loading.stats ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-gray-300 rounded mr-3"></div>
                    <div className="h-4 bg-gray-300 rounded w-24"></div>
                  </div>
                  <div className="h-4 bg-gray-300 rounded w-16"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {stats?.paymentMethodDistribution?.map((method, index) => {
                const IconComponent = getPaymentMethodIcon(method.method);
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <IconComponent className="w-4 h-4 text-gray-600 mr-3" />
                      <div>
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {method.method.replace('_', ' ')}
                        </span>
                        <div className="text-xs text-gray-500">
                          {method.count} transacciones
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {formatPercentage(method.percentage)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatCurrency(method.totalAmount)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card title="Rendimiento de Gateways">
          {loading.stats ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-gray-300 rounded mr-3"></div>
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                  </div>
                  <div className="h-4 bg-gray-300 rounded w-16"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {stats?.gatewayPerformance?.map((gateway, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Building className="w-4 h-4 text-gray-600 mr-3" />
                    <div>
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {gateway.gateway}
                      </span>
                      <div className="text-xs text-gray-500">
                        {gateway.count} transacciones
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {formatPercentage(gateway.successRate)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Comisiones: {formatCurrency(gateway.totalFees)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Tendencias mensuales */}
      <Card title="Tendencias de Ingresos">
        {loading.stats ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {stats?.monthlyTrends?.map((trend, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(trend.month).toLocaleDateString('es-ES', { 
                      year: 'numeric', 
                      month: 'long' 
                    })}
                  </span>
                  <div className="text-xs text-gray-500">
                    {trend.count} transacciones
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(trend.amount)}
                  </div>
                  <div className="text-xs text-gray-500">
                    Promedio: {formatCurrency(trend.amount / trend.count)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

// Función auxiliar para obtener icono del método de pago
const getPaymentMethodIcon = (method) => {
  const icons = {
    credit_card: CreditCard,
    debit_card: CreditCard,
    bank_transfer: Building,
    digital_wallet: Smartphone,
    cash: DollarSign
  };
  return icons[method] || DollarSign;
};

export default PaymentStats;