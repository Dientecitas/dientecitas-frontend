import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight, User, Loader2 } from 'lucide-react';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isBefore, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { useBooking } from '../store/bookingContext';
import { bookingApi } from '../services/bookingApi';
import TimeSlotButton from './ui/TimeSlotButton';
import Card from '../../../shared/components/ui/Card';
import LoadingButton from '../../../shared/components/ui/LoadingButton';

const AppointmentScheduler = () => {
  const { district, service, appointment, setAppointment, setLoading, setError, clearError } = useBooking();
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [availableDates, setAvailableDates] = useState([]);

  useEffect(() => {
    generateAvailableDates();
  }, []);

  useEffect(() => {
    if (selectedDate && district && service) {
      loadTimeSlots();
    }
  }, [selectedDate, district, service]);

  const generateAvailableDates = () => {
    const today = new Date();
    const dates = [];
    
    // Generar próximos 30 días (excluyendo domingos)
    for (let i = 1; i <= 30; i++) {
      const date = addDays(today, i);
      if (date.getDay() !== 0) { // Excluir domingos
        dates.push(date);
      }
    }
    
    setAvailableDates(dates);
  };

  const loadTimeSlots = async () => {
    setIsLoadingSlots(true);
    clearError('timeSlots');
    
    try {
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      const response = await bookingApi.getAvailableTimeSlots(
        district.id, 
        service.id, 
        dateString
      );
      
      if (response.success) {
        setAvailableSlots(response.data);
      } else {
        setError('timeSlots', 'Error al cargar horarios disponibles.');
      }
    } catch (error) {
      setError('timeSlots', 'Error al cargar horarios disponibles.');
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSlotSelect = async (slot) => {
    setSelectedSlot(slot);
    
    // Reservar temporalmente el slot
    try {
      await bookingApi.reserveTimeSlot(slot.id, 5); // 5 minutos de reserva
      
      setAppointment({
        date: format(selectedDate, 'yyyy-MM-dd'),
        timeSlot: slot,
        dentist: slot.dentist
      });
    } catch (error) {
      setError('timeSlots', 'Error al reservar el horario. Intente con otro.');
    }
  };

  const isDateAvailable = (date) => {
    return availableDates.some(availableDate => 
      isSameDay(availableDate, date)
    );
  };

  const isDateDisabled = (date) => {
    return isBefore(date, startOfDay(new Date())) || !isDateAvailable(date);
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Agregar días del mes anterior para completar la primera semana
    const startDate = new Date(monthStart);
    const startDay = startDate.getDay();
    const daysToAdd = startDay === 0 ? 6 : startDay - 1;
    
    for (let i = daysToAdd; i > 0; i--) {
      const prevDay = new Date(monthStart);
      prevDay.setDate(prevDay.getDate() - i);
      days.unshift(prevDay);
    }

    // Agregar días del mes siguiente para completar la última semana
    while (days.length < 42) {
      const nextDay = new Date(days[days.length - 1]);
      nextDay.setDate(nextDay.getDate() + 1);
      days.push(nextDay);
    }

    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Encabezados de días */}
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
        
        {/* Días del calendario */}
        {days.map((day, index) => {
          const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isAvailable = isDateAvailable(day);
          const isDisabled = isDateDisabled(day);
          const isTodayDate = isToday(day);

          return (
            <button
              key={index}
              onClick={() => !isDisabled && handleDateSelect(day)}
              disabled={isDisabled}
              className={`
                p-2 text-sm rounded-lg transition-colors relative
                ${!isCurrentMonth ? 'text-gray-300' : ''}
                ${isSelected ? 'bg-blue-600 text-white' : ''}
                ${!isSelected && isAvailable && isCurrentMonth ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''}
                ${!isSelected && !isAvailable && isCurrentMonth ? 'text-gray-400' : ''}
                ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                ${isTodayDate && !isSelected ? 'ring-2 ring-blue-300' : ''}
              `}
            >
              {day.getDate()}
              {isAvailable && isCurrentMonth && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <Card title="Programar Fecha y Hora" className="max-w-6xl mx-auto">
      <div className="space-y-6">
        <div className="text-center mb-6">
          <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-orange-600" />
          </div>
          <p className="text-gray-600">
            Selecciona la fecha y hora más conveniente para tu cita de {service?.name}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calendario */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {format(currentMonth, 'MMMM yyyy', { locale: es })}
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => navigateMonth(-1)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigateMonth(1)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              {renderCalendar()}
            </div>

            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-100 rounded border border-green-300"></div>
                <span className="text-gray-600">Disponible</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-600 rounded"></div>
                <span className="text-gray-600">Seleccionado</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-200 rounded"></div>
                <span className="text-gray-600">No disponible</span>
              </div>
            </div>
          </div>

          {/* Horarios disponibles */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {selectedDate ? (
                <>Horarios para {format(selectedDate, 'dd \'de\' MMMM', { locale: es })}</>
              ) : (
                'Selecciona una fecha'
              )}
            </h3>

            {selectedDate ? (
              <div className="space-y-4">
                {isLoadingSlots ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Cargando horarios...</p>
                    </div>
                  </div>
                ) : availableSlots.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {availableSlots.map((slot) => (
                      <TimeSlotButton
                        key={slot.id}
                        slot={slot}
                        selected={selectedSlot?.id === slot.id}
                        onSelect={handleSlotSelect}
                        showDentist={true}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">
                      No hay horarios disponibles para esta fecha
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">
                  Selecciona una fecha en el calendario para ver los horarios disponibles
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Cita programada */}
        {appointment && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-orange-800 font-medium">Cita programada</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Fecha</label>
                <p className="text-gray-900">
                  {format(new Date(appointment.date), 'dd \'de\' MMMM \'de\' yyyy', { locale: es })}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Hora</label>
                <p className="text-gray-900 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {appointment.timeSlot.time}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Profesional</label>
                <p className="text-gray-900 flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {appointment.dentist?.name || 'Por asignar'}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </Card>
  );
};

export default AppointmentScheduler;