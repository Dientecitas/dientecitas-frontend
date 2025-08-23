import React from 'react';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import Card from '../../../shared/components/ui/Card';
import Button from '../../../shared/components/ui/Button';

const PatientDashboard = () => {
  const nextAppointment = {
    date: '2024-01-15',
    time: '10:30',
    dentist: 'Dr. Juan Pérez',
    clinic: 'Clínica Dental Centro',
    address: 'Av. Principal 123',
    treatment: 'Limpieza dental'
  };

  const recentAppointments = [
    { date: '2023-12-20', dentist: 'Dr. Juan Pérez', treatment: 'Consulta general', status: 'Completada' },
    { date: '2023-11-15', dentist: 'Dra. Ana García', treatment: 'Endodoncia', status: 'Completada' },
    { date: '2023-10-10', dentist: 'Dr. Juan Pérez', treatment: 'Limpieza dental', status: 'Completada' }
  ];

  return (
    <div className="space-y-6">
      {/* Próxima cita */}
      <Card title="Próxima Cita" className="border-l-4 border-l-blue-600">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">
                {new Date(nextAppointment.date).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">{nextAppointment.time}</span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">{nextAppointment.dentist}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gray-600" />
              <div className="text-sm text-gray-600">
                <div>{nextAppointment.clinic}</div>
                <div className="text-xs">{nextAppointment.address}</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between">
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Tratamiento</h4>
              <p className="text-sm text-gray-600">{nextAppointment.treatment}</p>
            </div>
            <div className="space-y-2 mt-4">
              <Button size="sm" className="w-full">
                Ver Detalles
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                Reprogramar
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Acciones rápidas */}
        <Card title="Acciones Rápidas">
          <div className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Reservar Nueva Cita
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Clock className="w-4 h-4 mr-2" />
              Ver Mis Citas
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <User className="w-4 h-4 mr-2" />
              Actualizar Perfil
            </Button>
          </div>
        </Card>

        {/* Historial reciente */}
        <Card title="Historial Reciente">
          <div className="space-y-3">
            {recentAppointments.map((appointment, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-900">{appointment.treatment}</p>
                  <p className="text-xs text-gray-600">{appointment.dentist}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(appointment.date).toLocaleDateString('es-ES')}
                  </p>
                </div>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                  {appointment.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recordatorios */}
      <Card title="Recordatorios">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Clock className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Próxima cita en 3 días
              </h3>
              <p className="mt-1 text-sm text-yellow-700">
                No olvides tu cita del 15 de enero a las 10:30 AM
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PatientDashboard;