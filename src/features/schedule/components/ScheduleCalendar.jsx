import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, Users, AlertTriangle } from 'lucide-react';
import Card from '../../../shared/components/ui/Card';
import LoadingButton from '../../../shared/components/ui/LoadingButton';
import { useScheduleContext } from '../store/scheduleContext';
import { useSchedule } from '../hooks/useSchedule';
import { formatDate, getTimeSlotStatusColor, getTimeSlotStatusText } from '../utils/scheduleHelpers';

const ScheduleCalendar = ({ onView, onEdit, onDelete }) => {
  const { ui, selectedDate, setSelectedDate } = useScheduleContext();
  const { timeSlots, loading } = useSchedule();
  
  const [currentDate, setCurrentDate] = useState(() => {
    const date = new Date(selectedDate);
    return isNaN(date.getTime()) ? new Date() : date;
  });

  // Sincronizar fecha seleccionada
  useEffect(() => {
    setSelectedDate(currentDate.toISOString().split('T')[0]);
  }, [currentDate, setSelectedDate]);

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

  // Obtener turnos para el período actual
  const getTimeSlotsForPeriod = () => {
    const startDate = getStartDate();
    const endDate = getEndDate();
    
    return timeSlots.filter(slot => {
      const slotDate = new Date(slot.fecha);
      return slotDate >= startDate && slotDate <= endDate;
    });
  };

  // Calcular fecha de inicio del período
  const getStartDate = () => {
    // Ensure currentDate is valid
    if (!currentDate || isNaN(currentDate.getTime())) {
      return new Date();
    }
    
    const date = new Date(currentDate.getTime());
    
    switch (ui.calendarView) {
      case 'day':
        return date;
      case 'week':
        const dayOfWeek = date.getDay();
        const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        const weekStart = new Date(date.getFullYear(), date.getMonth(), diff);
        return isNaN(weekStart.getTime()) ? new Date() : weekStart;
      case 'month':
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        return isNaN(monthStart.getTime()) ? new Date() : monthStart;
      default:
        return date;
    }
  };

  // Calcular fecha de fin del período
  const getEndDate = () => {
    const startDate = getStartDate();
    
    // Ensure startDate is valid
    if (!startDate || isNaN(startDate.getTime())) {
      return new Date();
    }
    
    switch (ui.calendarView) {
      case 'day':
        return startDate;
      case 'week':
        const endWeek = new Date(startDate);
        endWeek.setDate(endWeek.getDate() + 6);
        return isNaN(endWeek.getTime()) ? new Date() : endWeek;
      case 'month':
        const monthEnd = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
        return isNaN(monthEnd.getTime()) ? new Date() : monthEnd;
      default:
        return startDate;
    }
  };

  // Generar horas del día
  const generateHours = () => {
    const hours = [];
    for (let i = 8; i <= 20; i++) {
      hours.push(`${i.toString().padStart(2, '0')}:00`);
    }
    return hours;
  };

  // Generar días de la semana
  const generateWeekDays = () => {
    const startDate = getStartDate();
    
    // Ensure startDate is valid
    if (!startDate || isNaN(startDate.getTime())) {
      return [new Date()];
    }
    
    const days = [];
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(day.getDate() + i);
      
      // Only add valid dates
      if (!isNaN(day.getTime())) {
        days.push(day);
      }
    }
    
    return days.length > 0 ? days : [new Date()];
  };

  // Renderizar vista de día
  const renderDayView = () => {
    const hours = generateHours();
    const daySlots = getTimeSlotsForPeriod();
    
    return (
      <div className="grid grid-cols-1 gap-1">
        {hours.map(hour => {
          const hourSlots = daySlots.filter(slot => slot.horaInicio.startsWith(hour.split(':')[0]));
          
          return (
            <div key={hour} className="flex items-center border-b border-gray-100 py-2">
              <div className="w-16 text-sm font-medium text-gray-600">
                {hour}
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {hourSlots.map(slot => (
                  <div
                    key={slot.id}
                    onClick={() => onView(slot)}
                    className={`p-2 rounded cursor-pointer transition-colors ${getTimeSlotStatusColor(slot.estado)} hover:opacity-80`}
                  >
                    <div className="text-xs font-medium">
                      {slot.horaInicio} - {slot.horaFin}
                    </div>
                    <div className="text-xs text-gray-600">
                      Dr. {slot.dentista?.nombres}
                    </div>
                    <div className="text-xs">
                      {slot.citasActuales}/{slot.capacidadMaxima}
                    </div>
                  </div>
                ))}
                {hourSlots.length === 0 && (
                  <div className="text-xs text-gray-400 p-2">
                    Sin turnos programados
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Renderizar vista de semana
  const renderWeekView = () => {
    const weekDays = generateWeekDays();
    const hours = generateHours();
    const weekSlots = getTimeSlotsForPeriod();
    
    return (
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Header con días */}
          <div className="grid grid-cols-8 gap-1 mb-2">
            <div className="text-sm font-medium text-gray-600 p-2">Hora</div>
            {weekDays.map(day => (
              <div key={day.toISOString()} className="text-sm font-medium text-gray-900 p-2 text-center">
                <div>{day.toLocaleDateString('es-ES', { weekday: 'short' })}</div>
                <div className="text-xs text-gray-500">{day.getDate()}</div>
              </div>
            ))}
          </div>
          
          {/* Grid de horas */}
          {hours.map(hour => (
            <div key={hour} className="grid grid-cols-8 gap-1 border-b border-gray-100">
              <div className="text-sm text-gray-600 p-2 font-medium">
                {hour}
              </div>
              {weekDays.map(day => {
                const dayString = day.toISOString().split('T')[0];
                const dayHourSlots = weekSlots.filter(slot => 
                  slot.fecha === dayString && slot.horaInicio.startsWith(hour.split(':')[0])
                );
                
                return (
                  <div key={`${dayString}-${hour}`} className="p-1 min-h-16">
                    {dayHourSlots.map(slot => (
                      <div
                        key={slot.id}
                        onClick={() => onView(slot)}
                        className={`p-1 rounded text-xs cursor-pointer mb-1 ${getTimeSlotStatusColor(slot.estado)}`}
                      >
                        <div className="font-medium truncate">
                          {slot.horaInicio}
                        </div>
                        <div className="truncate">
                          {slot.tipoTurno}
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
    );
  };

  // Renderizar vista de mes
  const renderMonthView = () => {
    const startDate = getStartDate();
    const endDate = getEndDate();
    const monthSlots = getTimeSlotsForPeriod();
    
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
      <div className="grid grid-cols-7 gap-1">
        {/* Header días de la semana */}
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
          <div key={day} className="text-sm font-medium text-gray-600 p-2 text-center">
            {day}
          </div>
        ))}
        
        {/* Días del mes */}
        {days.map(day => {
          const dayString = day.toISOString().split('T')[0];
          const daySlots = monthSlots.filter(slot => slot.fecha === dayString);
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          
          return (
            <div
              key={dayString}
              className={`min-h-24 p-1 border border-gray-200 ${
                isCurrentMonth ? 'bg-white' : 'bg-gray-50'
              }`}
            >
              <div className={`text-sm font-medium mb-1 ${
                isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {day.getDate()}
              </div>
              <div className="space-y-1">
                {daySlots.slice(0, 3).map(slot => (
                  <div
                    key={slot.id}
                    onClick={() => onView(slot)}
                    className={`text-xs p-1 rounded cursor-pointer ${getTimeSlotStatusColor(slot.estado)}`}
                  >
                    {slot.horaInicio}
                  </div>
                ))}
                {daySlots.length > 3 && (
                  <div className="text-xs text-gray-500">
                    +{daySlots.length - 3} más
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading.timeSlots) {
    return (
      <Card title="Calendario de Turnos">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 rounded w-1/3"></div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="h-20 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      {/* Header del calendario */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* Selector de fecha específica */}
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
            
            <h2 className="text-xl font-semibold text-gray-900">
              {currentDate.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                ...(ui.calendarView === 'day' && { day: 'numeric' })
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

        {/* Selector de año y mes */}
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
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            {getTimeSlotsForPeriod().length} turnos
          </span>
        </div>
      </div>

      {/* Contenido del calendario */}
      <div className="min-h-96">
        {ui.calendarView === 'day' && renderDayView()}
        {ui.calendarView === 'week' && renderWeekView()}
        {ui.calendarView === 'month' && renderMonthView()}
      </div>

      {/* Leyenda */}
      <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-xs text-gray-600">Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
          <span className="text-xs text-gray-600">Reservado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-xs text-gray-600">Ocupado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span className="text-xs text-gray-600">Bloqueado</span>
        </div>
      </div>
    </Card>
  );
};

export default ScheduleCalendar;