import React from 'react';
import { Calendar, Users, Clock, TrendingUp } from 'lucide-react';
import Card from '../../../shared/components/ui/Card';

const DentistDashboard = () => {
  const stats = [
    { name: 'Citas Hoy', value: '8', icon: Calendar, color: 'blue' },
    { name: 'Pacientes Este Mes', value: '45', icon: Users, color: 'green' },
    { name: 'Horas Trabajadas', value: '32h', icon: Clock, color: 'purple' },
    { name: 'Ingresos del Mes', value: '$3,240', icon: TrendingUp, color: 'orange' }
  ];

  const appointments = [
    { time: '09:00', patient: 'María García', treatment: 'Limpieza dental' },
    { time: '10:30', patient: 'Carlos López', treatment: 'Endodoncia' },
    { time: '14:00', patient: 'Ana Martínez', treatment: 'Consulta general' },
    { time: '15:30', patient: 'Luis Rodríguez', treatment: 'Ortodoncia' }
  ];

  return (
    <div className="space-y-6">
      {/* Métricas del dentista */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <div className="flex items-center">
              <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agenda del día */}
        <Card title="Agenda de Hoy">
          <div className="space-y-3">
            {appointments.map((appointment, index) => (
              <div key={index} className="flex items-center p-3 rounded-lg border border-gray-100">
                <div className="text-sm font-medium text-blue-600 w-16">
                  {appointment.time}
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-900">{appointment.patient}</p>
                  <p className="text-xs text-gray-600">{appointment.treatment}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Pacientes recientes */}
        <Card title="Pacientes Recientes">
          <div className="space-y-3">
            {['María García', 'Carlos López', 'Ana Martínez', 'Luis Rodríguez'].map((patient, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium">{patient.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-900">{patient}</span>
                </div>
                <button className="text-xs text-blue-600 hover:text-blue-700">
                  Ver historial
                </button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DentistDashboard;