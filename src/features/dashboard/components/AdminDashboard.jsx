import React from 'react';
import { Users, Calendar, MapPin, Building, TrendingUp, Clock } from 'lucide-react';
import Card from '../../../shared/components/ui/Card';

const AdminDashboard = () => {
  const stats = [
    { name: 'Total Pacientes', value: '1,234', icon: Users, color: 'blue', change: '+12%' },
    { name: 'Citas Hoy', value: '23', icon: Calendar, color: 'green', change: '+5%' },
    { name: 'Distritos Activos', value: '3', icon: MapPin, color: 'purple', change: '0%' },
    { name: 'Consultorios', value: '6', icon: Building, color: 'orange', change: '+1' },
    { name: 'Ingresos del Mes', value: '$15,420', icon: TrendingUp, color: 'emerald', change: '+18%' },
    { name: 'Turnos Disponibles', value: '156', icon: Clock, color: 'red', change: '-8%' }
  ];

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} className="relative overflow-hidden">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <span className={`ml-2 text-sm ${
                    stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Gráficos y tablas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Citas por Día" className="h-64">
          <div className="flex items-center justify-center h-full text-gray-500">
            Gráfico de citas por día
          </div>
        </Card>

        <Card title="Especialidades Más Solicitadas" className="h-64">
          <div className="space-y-3">
            {['Ortodoncia', 'Endodoncia', 'Limpieza Dental', 'Cirugía Oral'].map((specialty, index) => (
              <div key={specialty} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{specialty}</span>
                <div className="flex items-center space-x-2">
                  <div className={`h-2 w-16 rounded-full bg-blue-${(index + 1) * 200}`}></div>
                  <span className="text-xs text-gray-500">{(40 - index * 8)}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Actividad reciente */}
      <Card title="Actividad Reciente">
        <div className="space-y-4">
          {[
            { action: 'Nueva cita programada', user: 'María González', time: 'Hace 5 min' },
            { action: 'Dentista registrado', user: 'Dr. Carlos Rodríguez', time: 'Hace 15 min' },
            { action: 'Pago procesado', user: 'Luis Martínez', time: 'Hace 30 min' },
            { action: 'Cita cancelada', user: 'Ana Pérez', time: 'Hace 1 hora' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-xs text-gray-600">{activity.user}</p>
              </div>
              <span className="text-xs text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;