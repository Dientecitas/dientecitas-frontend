import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, User, MapPin, Eye, Edit, X } from 'lucide-react';
import { useAppointmentContext } from '../store/appointmentContext';
import { useAppointments } from '../hooks/useAppointments';
import { formatDate, formatTime, getStatusColor, getStatusText } from '../utils/appointmentHelpers';
import LoadingButton from '../../../shared/components/ui/LoadingButton';
import Card from '../../../shared/components/ui/Card';

const AppointmentCalendar = ({ onView, onEdit, onCancel }) => {
  const { appointments, filters } = useAppointmentContext();
  const { loading } = useAppointments();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'month', 'week', 'day'

  // Generate calendar data based on current view
  const calendarData = useMemo(() => {
    const filteredAppointments = appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.fecha);
      
      switch (viewMode) {
        case 'month':
          return appointmentDate.getMonth() === currentDate.getMonth() &&
                 appointmentDate.getFullYear() === currentDate.getFullYear();
        case 'week':
          const weekStart = new Date(currentDate);
          weekStart.setDate(currentDate.getDate() - currentDate.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          return appointmentDate >= weekStart && appointmentDate <= weekEnd;
        case 'day':
          return appointmentDate.toDateString() === currentDate.toDateString();
        default:
          return true;
      }
    });

    return filteredAppointments;
  }, [appointments, currentDate, viewMode]);

  // Navigation functions
  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    switch (viewMode) {
      case 'month':
        newDate.setMonth(currentDate.getMonth() - 1);
        break;
      case 'week':
        newDate.setDate(currentDate.getDate() - 7);
        break;
      case 'day':
        newDate.setDate(currentDate.getDate() - 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const navigateNext = () => {
    const newDate = new Date(currentDate);
    switch (viewMode) {
      case 'month':
        newDate.setMonth(currentDate.getMonth() + 1);
        break;
      case 'week':
        newDate.setDate(currentDate.getDate() + 7);
        break;
      case 'day':
        newDate.setDate(currentDate.getDate() + 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get calendar title based on view mode
  const getCalendarTitle = () => {
    const options = { 
      year: 'numeric', 
      month: 'long',
      ...(viewMode === 'day' && { day: 'numeric' })
    };
    
    if (viewMode === 'week') {
      const weekStart = new Date(currentDate);
      weekStart.setDate(currentDate.getDate() - currentDate.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      return `${weekStart.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} - ${weekEnd.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    }
    
    return currentDate.toLocaleDateString('es-ES', options);
  };

  // Generate calendar grid for month view
  const generateMonthGrid = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDateObj = new Date(startDate);
    
    for (let i = 0; i < 42; i++) { // 6 weeks * 7 days
      const dayAppointments = calendarData.filter(apt => 
        new Date(apt.fecha).toDateString() === currentDateObj.toDateString()
      );
      
      days.push({
        date: new Date(currentDateObj),
        isCurrentMonth: currentDateObj.getMonth() === month,
        isToday: currentDateObj.toDateString() === new Date().toDateString(),
        appointments: dayAppointments
      });
      
      currentDateObj.setDate(currentDateObj.getDate() + 1);
    }
    
    return days;
  };

  // Render appointment card
  const renderAppointmentCard = (appointment, isCompact = false) => (
    <div
      key={appointment.id}
      className={`p-2 rounded-lg border-l-4 mb-2 cursor-pointer hover:shadow-md transition-shadow ${getStatusColor(appointment.estado)} bg-white`}
      onClick={() => onView(appointment)}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-3 h-3 text-gray-500" />
            <span className="text-sm font-medium text-gray-900">
              {formatTime(appointment.horaInicio)}
            </span>
            {!isCompact && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.estado)}`}>
                {getStatusText(appointment.estado)}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 mb-1">
            <User className="w-3 h-3 text-gray-500" />
            <span className="text-sm text-gray-700 truncate">
              {appointment.paciente?.nombres} {appointment.paciente?.apellidos}
            </span>
          </div>
          
          {!isCompact && appointment.dentista && (
            <div className="flex items-center gap-2 mb-1">
              <User className="w-3 h-3 text-blue-500" />
              <span className="text-xs text-gray-600 truncate">
                Dr. {appointment.dentista.nombres} {appointment.dentista.apellidos}
              </span>
            </div>
          )}
          
          {!isCompact && appointment.consultorio && (
            <div className="flex items-center gap-2">
              <MapPin className="w-3 h-3 text-green-500" />
              <span className="text-xs text-gray-600 truncate">
                {appointment.consultorio.nombre}
              </span>
            </div>
          )}
        </div>
        
        {!isCompact && (
          <div className="flex gap-1 ml-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView(appointment);
              }}
              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
              title="Ver detalles"
            >
              <Eye className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(appointment);
              }}
              className="p-1 text-gray-400 hover:text-green-600 transition-colors"
              title="Editar"
            >
              <Edit className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCancel(appointment);
              }}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
              title="Cancelar"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Render month view
  const renderMonthView = () => {
    const days = generateMonthGrid();
    const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    return (
      <div className="bg-white rounded-lg border">
        {/* Week day headers */}
        <div className="grid grid-cols-7 border-b">
          {weekDays.map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-700 border-r last:border-r-0">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => (
            <div
              key={index}
              className={`min-h-[120px] p-2 border-r border-b last:border-r-0 ${
                !day.isCurrentMonth ? 'bg-gray-50' : 'bg-white'
              } ${day.isToday ? 'bg-blue-50' : ''}`}
            >
              <div className={`text-sm font-medium mb-2 ${
                day.isToday ? 'text-blue-600' : 
                day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {day.date.getDate()}
              </div>
              
              <div className="space-y-1">
                {day.appointments.slice(0, 3).map(appointment => 
                  renderAppointmentCard(appointment, true)
                )}
                {day.appointments.length > 3 && (
                  <div className="text-xs text-gray-500 text-center py-1">
                    +{day.appointments.length - 3} más
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render week view
  const renderWeekView = () => {
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - currentDate.getDay());
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      weekDays.push(day);
    }

    return (
      <div className="bg-white rounded-lg border">
        <div className="grid grid-cols-7 border-b">
          {weekDays.map(day => {
            const dayAppointments = calendarData.filter(apt => 
              new Date(apt.fecha).toDateString() === day.toDateString()
            );
            
            return (
              <div key={day.toISOString()} className="p-4 border-r last:border-r-0">
                <div className={`text-center mb-3 ${
                  day.toDateString() === new Date().toDateString() ? 'text-blue-600 font-semibold' : 'text-gray-700'
                }`}>
                  <div className="text-sm font-medium">
                    {day.toLocaleDateString('es-ES', { weekday: 'short' })}
                  </div>
                  <div className="text-lg">
                    {day.getDate()}
                  </div>
                </div>
                
                <div className="space-y-2 min-h-[300px]">
                  {dayAppointments.map(appointment => 
                    renderAppointmentCard(appointment)
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render day view
  const renderDayView = () => {
    const dayAppointments = calendarData.sort((a, b) => 
      a.horaInicio.localeCompare(b.horaInicio)
    );

    return (
      <Card className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {currentDate.toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
          <p className="text-sm text-gray-600">
            {dayAppointments.length} cita{dayAppointments.length !== 1 ? 's' : ''} programada{dayAppointments.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="space-y-3">
          {dayAppointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No hay citas programadas para este día</p>
            </div>
          ) : (
            dayAppointments.map(appointment => 
              renderAppointmentCard(appointment)
            )
          )}
        </div>
      </Card>
    );
  };

  if (loading.appointments) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Cargando calendario...</span>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <LoadingButton
              variant="outline"
              size="sm"
              onClick={navigatePrevious}
            >
              <ChevronLeft className="w-4 h-4" />
            </LoadingButton>
            
            <h2 className="text-xl font-semibold text-gray-900 min-w-[200px] text-center">
              {getCalendarTitle()}
            </h2>
            
            <LoadingButton
              variant="outline"
              size="sm"
              onClick={navigateNext}
            >
              <ChevronRight className="w-4 h-4" />
            </LoadingButton>
          </div>
          
          <LoadingButton
            variant="outline"
            size="sm"
            onClick={goToToday}
          >
            Hoy
          </LoadingButton>
        </div>
        
        {/* View Mode Switcher */}
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          {[
            { mode: 'month', label: 'Mes' },
            { mode: 'week', label: 'Semana' },
            { mode: 'day', label: 'Día' }
          ].map(({ mode, label }) => (
            <LoadingButton
              key={mode}
              variant={viewMode === mode ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode(mode)}
              className="rounded-md"
            >
              {label}
            </LoadingButton>
          ))}
        </div>
      </div>

      {/* Calendar Content */}
      <div>
        {viewMode === 'month' && renderMonthView()}
        {viewMode === 'week' && renderWeekView()}
        {viewMode === 'day' && renderDayView()}
      </div>

      {/* Summary */}
      <div className="flex justify-between items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
        <span>
          Total: {calendarData.length} cita{calendarData.length !== 1 ? 's' : ''}
        </span>
        <span>
          Vista: {viewMode === 'month' ? 'Mensual' : viewMode === 'week' ? 'Semanal' : 'Diaria'}
        </span>
      </div>
    </div>
  );
};

export default AppointmentCalendar;