import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, Users, AlertTriangle } from 'lucide-react';
import Card from '../../../shared/components/ui/Card';
import LoadingButton from '../../../shared/components/ui/LoadingButton';
import { useAppointmentContext } from '../store/appointmentContext';
import { formatDate, getStatusColor, getStatusText } from '../utils/appointmentHelpers';

const AppointmentCalendar = ({ 
  appointments = [], 
  onDateSelect, 
  onView, 
  onEdit, 
  onDelete,
  loading = false 
}) => {
  const { ui, setSelectedDate, setCalendarView } = useAppointmentContext();
  
  const [currentDate, setCurrentDate] = useState(() => {
    if (ui.selectedDate) {
      const date = new Date(ui.selectedDate);
      return isNaN(date.getTime()) ? new Date() : date;
    }
    return new Date();
  });

  // Sincronizar fecha seleccionada - solo cuando currentDate cambia internamente
  useEffect(() => {
    const dateString = currentDate.toISOString().split('T')[0];
    if (ui.selectedDate !== dateString) {
      setSelectedDate(dateString);
    }
  }, [currentDate, setSelectedDate]);

  // Sincronizar cuando selectedDate cambia externamente - solo cuando ui.selectedDate cambia
  useEffect(() => {
    if (ui.selectedDate) {
      const date = new Date(ui.selectedDate);
      if (!isNaN(date.getTime())) {
        const currentDateString = currentDate.toISOString().split('T')[0];
        if (ui.selectedDate !== currentDateString) {
          setCurrentDate(date);
        }
      }
    }
  }, [ui.selectedDate]);

  // Navegación de fechas
  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    
    switch (ui.calendarView) {
      case 'day':
        newDate.setDate(newDate.getDate() + direction);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + (direction * 7));
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + direction);
        break;
    }
    
    setCurrentDate(newDate);
  };

  // Obtener citas para el período actual
  const getAppointmentsForPeriod = () => {
    const startDate = getStartDate();
    const endDate = getEndDate();
    
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.fecha);
      return appointmentDate >= startDate && appointmentDate <= endDate;
    });
  };

  // Calcular fecha de inicio del período
  const getStartDate = () => {
    const date = new Date(currentDate);
    
    switch (ui.calendarView) {
      case 'day':
        return date;
      case 'week':
        const dayOfWeek = date.getDay();
        const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        return new Date(date.getFullYear(), date.getMonth(), diff);
      case 'month':
        return new Date(date.getFullYear(), date.getMonth(), 1);
      default:
        return date;
    }
  };

  // Calcular fecha de fin del período
  const getEndDate = () => {
    const startDate = getStartDate();
    
    switch (ui.calendarView) {
      case 'day':
        return startDate;
      case 'week':
        const endWeek = new Date(startDate);
        endWeek.setDate(endWeek.getDate() + 6);
        return endWeek;
      case 'month':
        return new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
      default:
        return startDate;
    }
  };

  // Generar horas del día (8:00 - 18:00)
  const generateHours = () => {
    const hours = [];
    for (let i = 8; i <= 18; i++) {
      hours.push(`${i.toString().padStart(2, '0')}:00`);
    }
    return hours;
  };

  // Generar días de la semana
  const generateWeekDays = () => {
    const startDate = getStartDate();
    const days = [];
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(day.getDate() + i);
      days.push(day);
    }
    
    return days;
  };

  // Obtener color de fondo para tipo de cita
  const getAppointmentTypeColor = (tipoConsulta) => {
    switch (tipoConsulta) {
      case 'consulta':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'tratamiento':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cirugia':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'emergencia':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Renderizar vista de semana (como en la imagen)
  const renderWeekView = () => {
    const weekDays = generateWeekDays();
    const hours = generateHours();
    const weekAppointments = getAppointmentsForPeriod();
    
    return (
      <div className="bg-white rounded-lg border border-gray-200">
        {/* Header con navegación de fecha */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Ir a:</label>
              <input
                type="date"
                value={currentDate.toISOString().split('T')[0]}
                onChange={(e) => {
                  const newDate = new Date(e.target.value);
                  if (!isNaN(newDate.getTime())) {
                    setCurrentDate(newDate);
                  }
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <LoadingButton
                variant="outline"
                size="sm"
                onClick={() => navigateDate(-1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </LoadingButton>
              
              <h2 className="text-lg font-semibold text-gray-900 min-w-[200px] text-center">
                {currentDate.toLocaleDateString('es-ES', {
                  month: 'long',
                  year: 'numeric'
                })}
              </h2>
              
              <LoadingButton
                variant="outline"
                size="sm"
                onClick={() => navigateDate(1)}
              >
                <ChevronRight className="w-4 h-4" />
              </LoadingButton>
            </div>
            
            <LoadingButton
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
            >
              Hoy
            </LoadingButton>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={currentDate.getFullYear()}
              onChange={(e) => {
                const newDate = new Date(currentDate);
                newDate.setFullYear(parseInt(e.target.value));
                setCurrentDate(newDate);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              {Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() + i - 1;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
            
            <select
              value={currentDate.getMonth()}
              onChange={(e) => {
                const newDate = new Date(currentDate);
                newDate.setMonth(parseInt(e.target.value));
                setCurrentDate(newDate);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {new Date(2024, i, 1).toLocaleDateString('es-ES', { month: 'long' })}
                </option>
              ))}
            </select>

            <div className="text-sm text-gray-600">
              {getAppointmentsForPeriod().length} citas
            </div>
          </div>
        </div>

        {/* Grid del calendario semanal */}
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Header con días de la semana */}
            <div className="grid grid-cols-8 border-b border-gray-200">
              <div className="p-3 text-sm font-medium text-gray-600 border-r border-gray-200">
                Hora
              </div>
              {weekDays.map(day => (
                <div key={day.toISOString()} className="p-3 text-center border-r border-gray-200 last:border-r-0">
                  <div className="text-sm font-medium text-gray-900">
                    {day.toLocaleDateString('es-ES', { weekday: 'short' })}
                  </div>
                  <div className="text-lg font-bold text-gray-700">
                    {day.getDate()}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Grid de horas */}
            {hours.map(hour => (
              <div key={hour} className="grid grid-cols-8 border-b border-gray-100 min-h-[60px]">
                <div className="p-3 text-sm font-medium text-gray-600 border-r border-gray-200 bg-gray-50">
                  {hour}
                </div>
                {weekDays.map(day => {
                  const dayString = day.toISOString().split('T')[0];
                  const dayHourAppointments = weekAppointments.filter(appointment => 
                    appointment.fecha === dayString && 
                    appointment.horaInicio.startsWith(hour.split(':')[0])
                  );
                  
                  return (
                    <div 
                      key={`${dayString}-${hour}`} 
                      className="p-1 border-r border-gray-200 last:border-r-0 relative"
                    >
                      {dayHourAppointments.map(appointment => (
                        <div
                          key={appointment.id}
                          onClick={() => onView?.(appointment)}
                          className={`
                            p-2 rounded text-xs cursor-pointer mb-1 border
                            ${getAppointmentTypeColor(appointment.tipoConsulta)}
                            hover:opacity-80 transition-opacity
                          `}
                          title={`${appointment.paciente?.nombres} ${appointment.paciente?.apellidos} - ${appointment.motivo}`}
                        >
                          <div className="font-medium truncate">
                            {appointment.horaInicio}
                          </div>
                          <div className="truncate">
                            {appointment.tipoConsulta}
                          </div>
                          <div className="truncate text-xs opacity-75">
                            {appointment.paciente?.nombres}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Renderizar vista de día
  const renderDayView = () => {
    const hours = generateHours();
    const dayAppointments = getAppointmentsForPeriod();
    
    return (
      <div className="bg-white rounded-lg border border-gray-200">
        {/* Header del día */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <LoadingButton
              variant="outline"
              size="sm"
              onClick={() => navigateDate(-1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </LoadingButton>
            
            <h2 className="text-lg font-semibold text-gray-900">
              {currentDate.toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </h2>
            
            <LoadingButton
              variant="outline"
              size="sm"
              onClick={() => navigateDate(1)}
            >
              <ChevronRight className="w-4 h-4" />
            </LoadingButton>
          </div>

          <div className="text-sm text-gray-600">
            {dayAppointments.length} citas
          </div>
        </div>

        {/* Lista de horas del día */}
        <div className="divide-y divide-gray-100">
          {hours.map(hour => {
            const hourAppointments = dayAppointments.filter(appointment => 
              appointment.horaInicio.startsWith(hour.split(':')[0])
            );
            
            return (
              <div key={hour} className="flex min-h-[60px]">
                <div className="w-20 p-3 text-sm font-medium text-gray-600 bg-gray-50 border-r border-gray-200">
                  {hour}
                </div>
                <div className="flex-1 p-2">
                  {hourAppointments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {hourAppointments.map(appointment => (
                        <div
                          key={appointment.id}
                          onClick={() => onView?.(appointment)}
                          className={`
                            p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm
                            ${getAppointmentTypeColor(appointment.tipoConsulta)}
                          `}
                        >
                          <div className="font-medium text-sm">
                            {appointment.horaInicio} - {appointment.horaFin}
                          </div>
                          <div className="text-sm mt-1">
                            {appointment.paciente?.nombres} {appointment.paciente?.apellidos}
                          </div>
                          <div className="text-xs mt-1 opacity-75">
                            Dr. {appointment.dentista?.nombres}
                          </div>
                          <div className="text-xs mt-1">
                            {appointment.tipoConsulta}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                      Sin citas programadas
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Renderizar vista de mes
  const renderMonthView = () => {
    const startDate = getStartDate();
    const endDate = getEndDate();
    const monthAppointments = getAppointmentsForPeriod();
    
    // Generar días del mes
    const days = [];
    const firstDay = new Date(startDate);
    const lastDay = new Date(endDate);
    
    // Ajustar para mostrar semana completa
    const startOfWeek = new Date(firstDay);
    startOfWeek.setDate(firstDay.getDate() - firstDay.getDay() + 1);
    
    const endOfWeek = new Date(lastDay);
    endOfWeek.setDate(lastDay.getDate() + (7 - lastDay.getDay()));
    
    for (let d = new Date(startOfWeek); d <= endOfWeek; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    
    return (
      <div className="bg-white rounded-lg border border-gray-200">
        {/* Header del mes */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <LoadingButton
              variant="outline"
              size="sm"
              onClick={() => navigateDate(-1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </LoadingButton>
            
            <h2 className="text-lg font-semibold text-gray-900">
              {currentDate.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long'
              })}
            </h2>
            
            <LoadingButton
              variant="outline"
              size="sm"
              onClick={() => navigateDate(1)}
            >
              <ChevronRight className="w-4 h-4" />
            </LoadingButton>
          </div>

          <div className="text-sm text-gray-600">
            {monthAppointments.length} citas
          </div>
        </div>

        {/* Grid del mes */}
        <div className="grid grid-cols-7">
          {/* Header días de la semana */}
          {['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'].map(day => (
            <div key={day} className="p-3 text-sm font-medium text-gray-600 text-center border-b border-gray-200">
              {day}
            </div>
          ))}
          
          {/* Días del mes */}
          {days.map(day => {
            const dayString = day.toISOString().split('T')[0];
            const dayAppointments = monthAppointments.filter(appointment => appointment.fecha === dayString);
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isToday = day.toDateString() === new Date().toDateString();
            
            return (
              <div
                key={dayString}
                className={`min-h-[100px] p-2 border-b border-r border-gray-200 last:border-r-0 ${
                  isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                } ${isToday ? 'bg-blue-50' : ''}`}
                onClick={() => {
                  setCurrentDate(day);
                  onDateSelect?.(day);
                }}
              >
                <div className={`text-sm font-medium mb-2 ${
                  isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                } ${isToday ? 'text-blue-600' : ''}`}>
                  {day.getDate()}
                </div>
                <div className="space-y-1">
                  {dayAppointments.slice(0, 3).map(appointment => (
                    <div
                      key={appointment.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onView?.(appointment);
                      }}
                      className={`text-xs p-1 rounded cursor-pointer border ${getAppointmentTypeColor(appointment.tipoConsulta)}`}
                      title={`${appointment.horaInicio} - ${appointment.paciente?.nombres} ${appointment.paciente?.apellidos}`}
                    >
                      <div className="font-medium">
                        {appointment.horaInicio}
                      </div>
                      <div className="truncate">
                        {appointment.tipoConsulta}
                      </div>
                    </div>
                  ))}
                  {dayAppointments.length > 3 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{dayAppointments.length - 3} más
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <Card>
        <div className="animate-pulse space-y-4 p-6">
          <div className="h-8 bg-gray-300 rounded w-1/3"></div>
          <div className="grid grid-cols-8 gap-2">
            {Array.from({ length: 56 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  // Renderizar según la vista seleccionada
  const renderCalendarContent = () => {
    switch (ui.calendarView) {
      case 'day':
        return renderDayView();
      case 'week':
        return renderWeekView();
      case 'month':
        return renderMonthView();
      default:
        return renderWeekView();
    }
  };

  return (
    <div className="space-y-4">
      {renderCalendarContent()}
      
      {/* Leyenda */}
      <div className="flex items-center justify-center gap-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded border border-green-200"></div>
          <span className="text-xs text-gray-600">Consulta</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded border border-yellow-200"></div>
          <span className="text-xs text-gray-600">Tratamiento</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded border border-blue-200"></div>
          <span className="text-xs text-gray-600">Cirugía</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded border border-red-200"></div>
          <span className="text-xs text-gray-600">Emergencia</span>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCalendar;