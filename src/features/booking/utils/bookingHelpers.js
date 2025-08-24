import { format, addDays, startOfWeek, endOfWeek, isWeekend } from 'date-fns';
import { es } from 'date-fns/locale';

export const generateBookingCode = () => {
  const date = format(new Date(), 'yyyyMMdd');
  const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  return `BK-${date}-${random}`;
};

export const calculateServiceDuration = (serviceType) => {
  const durations = {
    'Limpieza y Prevención': 60,
    'Ortodoncia': 90,
    'Endodoncia': 120,
    'Cirugía Oral': 90,
    'Odontología Estética': 120,
    'Odontopediatría': 45,
    'Periodoncia': 90,
    'Implantes': 150
  };
  
  return durations[serviceType] || 60;
};

export const formatAppointmentData = (bookingData) => {
  return {
    pacienteId: bookingData.patient.id,
    distritoId: bookingData.district.id,
    servicioId: bookingData.service.id,
    fecha: bookingData.appointment.date,
    hora: bookingData.appointment.timeSlot.time,
    duracion: calculateServiceDuration(bookingData.service.category),
    observaciones: `Reserva online - Código: ${bookingData.bookingCode}`,
    estado: 'Programado',
    metodoPago: bookingData.payment.method,
    montoTotal: bookingData.pricing.total
  };
};

export const isSlotAvailable = (slot, serviceId, duration) => {
  if (!slot.available) return false;
  if (slot.duration < duration) return false;
  if (slot.reserved && new Date(slot.reservedUntil) > new Date()) return false;
  
  return true;
};

export const generateTimeSlots = (startHour = 8, endHour = 18, interval = 30) => {
  const slots = [];
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push({
        id: `${hour}-${minute}`,
        time,
        available: true,
        duration: interval
      });
    }
  }
  
  return slots;
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(amount);
};

export const calculatePricing = (service, discounts = []) => {
  const subtotal = service.price;
  const tax = subtotal * 0.18; // IGV 18%
  const discountAmount = discounts.reduce((total, discount) => {
    return total + (discount.type === 'percentage' 
      ? subtotal * (discount.value / 100)
      : discount.value);
  }, 0);
  
  const total = subtotal + tax - discountAmount;
  
  return {
    subtotal,
    tax,
    discount: discountAmount,
    total: Math.max(0, total)
  };
};

export const getAvailableDates = (daysAhead = 30) => {
  const dates = [];
  const today = new Date();
  
  for (let i = 1; i <= daysAhead; i++) {
    const date = addDays(today, i);
    if (!isWeekend(date)) { // Solo días laborables
      dates.push(date);
    }
  }
  
  return dates;
};

export const formatDate = (date, formatStr = 'dd/MM/yyyy') => {
  return format(date, formatStr, { locale: es });
};

export const formatTime = (time) => {
  return format(new Date(`2000-01-01T${time}`), 'HH:mm');
};