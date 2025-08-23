import React, { useState } from 'react';
import { 
  ChevronLeft,
  ChevronRight,
  Calendar
} from 'lucide-react';
import Card from '../../../shared/components/ui/Card';
import LoadingButton from '../../../shared/components/ui/LoadingButton';

const AppointmentCalendar = ({ 
  appointments = [],
  onDateSelect,
  onViewChange,
  currentDate = new Date(),
  loading = false 
}) => {
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [viewMode, setViewMode] = useState('Mes'); // Mes, Semana, Día

  // Obtener información del mes actual
  const monthNames = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();

  // Navegar entre meses
  const navigateMonth = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(currentMonth + direction);
    setSelectedDate(newDate);
  };

  // Obtener días del mes
  const getDaysInMonth = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Días del mes anterior
    const prevMonth = new Date(currentYear, currentMonth - 1, 0);
    const daysInPrevMonth = prevMonth.getDate();
    
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        date: new Date(currentYear, currentMonth - 1, daysInPrevMonth - i)
      });
    }

    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        date: new Date(currentYear, currentMonth, day)
      });
    }

    // Días del próximo mes
    const remainingCells = 42 - days.length; // 6 semanas × 7 días
    for (let day = 1; day <= remainingCells; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        date: new Date(currentYear, currentMonth + 1, day)
      });
    }

    return days;
  };

  // Obtener citas para una fecha específica
  const getAppointmentsForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return appointments.filter(apt => {
      const aptDate = new Date(apt.fecha).toISOString().split('T')[0];
      return aptDate === dateString;
    });
  };

  const days = getDaysInMonth();
  const today = new Date();

  if (loading) {
    return (
      <Card>
        <div className="animate-pulse p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
            <div className="flex space-x-2">
              <div className="h-8 bg-gray-200 rounded w-16"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {[...Array(42)].map((_, index) => (
              <div key={index} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-4">
        {/* Header del calendario */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <LoadingButton
              variant="outline"
              size="sm"
              onClick={() => navigateMonth(-1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </LoadingButton>
            
            <h2 className="text-lg font-semibold text-gray-900">
              {monthNames[currentMonth]} de {currentYear}
            </h2>
            
            <LoadingButton
              variant="outline"
              size="sm"
              onClick={() => navigateMonth(1)}
            >
              <ChevronRight className="w-4 h-4" />
            </LoadingButton>
          </div>

          <div className="flex items-center space-x-2">
            <LoadingButton
              variant="outline"
              size="sm"
              onClick={() => setSelectedDate(new Date())}
            >
              Hoy
            </LoadingButton>
            
            {['Mes', 'Semana', 'Día'].map((mode) => (
              <LoadingButton
                key={mode}
                variant={viewMode === mode ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode(mode)}
              >
                {mode}
              </LoadingButton>
            ))}
          </div>
        </div>

        {/* Días de la semana */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {dayNames.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-500 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Grilla del calendario */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((dayInfo, index) => {
            const dayAppointments = getAppointmentsForDate(dayInfo.date);
            const isToday = dayInfo.date.toDateString() === today.toDateString();
            const isSelected = dayInfo.date.toDateString() === selectedDate.toDateString();

            return (
              <div
                key={index}
                className={`
                  min-h-[80px] p-2 border border-gray-200 rounded cursor-pointer
                  transition-colors hover:bg-gray-50
                  ${!dayInfo.isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'}
                  ${isToday ? 'ring-2 ring-blue-500' : ''}
                  ${isSelected ? 'bg-blue-50' : ''}
                `}
                onClick={() => {
                  setSelectedDate(dayInfo.date);
                  onDateSelect?.(dayInfo.date);
                }}
              >
                <div className="text-sm font-medium mb-1">
                  {dayInfo.day}
                </div>
                
                {dayAppointments.length > 0 && (
                  <div className="space-y-1">
                    {dayAppointments.slice(0, 2).map((apt) => (
                      <div
                        key={apt.id}
                        className={`
                          text-xs p-1 rounded truncate
                          ${apt.estado === 'confirmada' ? 'bg-green-100 text-green-800' : ''}
                          ${apt.estado === 'programada' ? 'bg-blue-100 text-blue-800' : ''}
                          ${apt.estado === 'completada' ? 'bg-gray-100 text-gray-800' : ''}
                        `}
                      >
                        {apt.paciente?.nombres} {apt.paciente?.apellidos}
                      </div>
                    ))}
                    
                    {dayAppointments.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{dayAppointments.length - 2} más
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default AppointmentCalendar;