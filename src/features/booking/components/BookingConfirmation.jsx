import React, { useState, useEffect } from 'react';
import { CheckCircle, Download, Calendar, Mail, Phone, MapPin, Clock, User, CreditCard, FileText, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useBooking } from '../store/bookingContext';
import { bookingApi } from '../services/bookingApi';
import { formatCurrency, generateBookingCode } from '../utils/bookingHelpers';
import Card from '../../../shared/components/ui/Card';
import LoadingButton from '../../../shared/components/ui/LoadingButton';

const BookingConfirmation = () => {
  const { patient, district, service, appointment, payment, pricing, completeBooking } = useBooking();
  const [bookingCode, setBookingCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(true);
  const [emailSent, setEmailSent] = useState(false);
  const [pdfGenerated, setPdfGenerated] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    processBooking();
  }, []);

  const processBooking = async () => {
    try {
      setIsProcessing(true);
      
      // Generar código de reserva
      const code = generateBookingCode();
      setBookingCode(code);

      // Crear la reserva
      const bookingData = {
        patient,
        district,
        service,
        appointment,
        payment,
        pricing,
        code
      };

      const response = await bookingApi.createBooking(bookingData);
      
      if (response.success) {
        completeBooking(response.data);
        
        // Enviar email de confirmación
        try {
          await bookingApi.sendConfirmationEmail(patient.email, response.data);
          setEmailSent(true);
        } catch (emailError) {
          console.warn('Error enviando email:', emailError);
        }
      } else {
        setError('Error al procesar la reserva. Contacte con soporte.');
      }
    } catch (error) {
      setError('Error al procesar la reserva. Intente nuevamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const bookingData = {
        code: bookingCode,
        patient,
        district,
        service,
        appointment,
        payment,
        pricing
      };

      const response = await bookingApi.generateBookingPDF(bookingData);
      
      if (response.success) {
        // Crear enlace de descarga
        const link = document.createElement('a');
        link.href = response.data.pdfUrl;
        link.download = response.data.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setPdfGenerated(true);
      }
    } catch (error) {
      console.error('Error generando PDF:', error);
    }
  };

  const handleAddToCalendar = () => {
    const startDate = new Date(`${appointment.date}T${appointment.timeSlot.time}`);
    const endDate = new Date(startDate.getTime() + (service.duration * 60000));
    
    const event = {
      title: `Cita Dental - ${service.name}`,
      start: startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
      end: endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
      description: `Cita en ${district.name} - ${service.name}`,
      location: district.address
    };

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start}/${event.end}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
    
    window.open(googleCalendarUrl, '_blank');
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Mi Cita Dental - Dientecitas',
      text: `Cita confirmada para ${format(new Date(appointment.date), 'dd/MM/yyyy')} a las ${appointment.timeSlot.time}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copiar al clipboard
      navigator.clipboard.writeText(`${shareData.text} - ${shareData.url}`);
      alert('Información copiada al portapapeles');
    }
  };

  if (isProcessing) {
    return (
      <Card className="max-w-2xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Procesando tu reserva...
          </h3>
          <p className="text-gray-600">
            Estamos confirmando tu cita y enviando la información
          </p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="max-w-2xl mx-auto">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error en la Reserva
          </h3>
          <p className="text-gray-600 mb-6">
            {error}
          </p>
          <LoadingButton
            variant="primary"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </LoadingButton>
        </div>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header de confirmación */}
      <Card className="text-center">
        <div className="py-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Reserva Confirmada!
          </h1>
          
          <p className="text-lg text-gray-600 mb-4">
            Tu cita ha sido programada exitosamente
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block">
            <div className="text-sm text-blue-800 font-medium">Código de Reserva</div>
            <div className="text-2xl font-bold text-blue-900">{bookingCode}</div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Detalles de la cita */}
        <Card title="Detalles de tu Cita">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <User className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <div className="font-medium text-gray-900">Paciente</div>
                <div className="text-gray-600">{patient.nombres} {patient.apellidos}</div>
                <div className="text-sm text-gray-500">DNI: {patient.dni}</div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <div className="font-medium text-gray-900">Ubicación</div>
                <div className="text-gray-600">{district.name}</div>
                <div className="text-sm text-gray-500">{district.address}</div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <div className="font-medium text-gray-900">Servicio</div>
                <div className="text-gray-600">{service.name}</div>
                <div className="text-sm text-gray-500">{service.category} • {service.duration} min</div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <div className="font-medium text-gray-900">Fecha y Hora</div>
                <div className="text-gray-600">
                  {format(new Date(appointment.date), 'EEEE, dd \'de\' MMMM \'de\' yyyy', { locale: es })}
                </div>
                <div className="text-sm text-gray-500 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {appointment.timeSlot.time}
                </div>
              </div>
            </div>

            {appointment.dentist && (
              <div className="flex items-start space-x-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="font-medium text-gray-900">Profesional</div>
                  <div className="text-gray-600">{appointment.dentist.name}</div>
                  <div className="text-sm text-gray-500">{appointment.dentist.specialty}</div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Información de pago */}
        <Card title="Información de Pago">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <div className="font-medium text-gray-900">Método de Pago</div>
                <div className="text-gray-600">
                  {payment.method === 'card' && 'Tarjeta de Crédito/Débito'}
                  {payment.method === 'transfer' && 'Transferencia Bancaria'}
                  {payment.method === 'cash' && 'Pago en Consultorio'}
                </div>
                <div className="text-sm text-gray-500">
                  Estado: {payment.status === 'approved' ? 'Aprobado' : 'Pendiente'}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(pricing.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>IGV (18%):</span>
                  <span>{formatCurrency(pricing.tax)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                  <span>Total:</span>
                  <span>{formatCurrency(pricing.total)}</span>
                </div>
              </div>
            </div>

            {payment.transactionId && (
              <div className="text-xs text-gray-500">
                ID de Transacción: {payment.transactionId}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Acciones */}
      <Card title="Próximos Pasos">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <LoadingButton
              variant="primary"
              onClick={handleDownloadPDF}
              icon={<Download className="w-4 h-4" />}
              className="w-full"
            >
              Descargar PDF
            </LoadingButton>

            <LoadingButton
              variant="outline"
              onClick={handleAddToCalendar}
              icon={<Calendar className="w-4 h-4" />}
              className="w-full"
            >
              Agregar al Calendario
            </LoadingButton>

            <LoadingButton
              variant="outline"
              onClick={handleShare}
              icon={<Share2 className="w-4 h-4" />}
              className="w-full"
            >
              Compartir
            </LoadingButton>

            <LoadingButton
              variant="outline"
              onClick={() => window.location.href = '/'}
              className="w-full"
            >
              Volver al Inicio
            </LoadingButton>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <div className="font-medium text-blue-900">Confirmación por Email</div>
                <div className="text-sm text-blue-800">
                  {emailSent 
                    ? `Hemos enviado los detalles de tu cita a ${patient.email}`
                    : 'Enviando confirmación por email...'
                  }
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Phone className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <div className="font-medium text-yellow-900">Información Importante</div>
                <div className="text-sm text-yellow-800 space-y-1">
                  <p>• Llega 15 minutos antes de tu cita</p>
                  <p>• Trae tu DNI y este comprobante</p>
                  <p>• Para reprogramar, llama al {district.phone}</p>
                  <p>• Cancelaciones con 24h de anticipación</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BookingConfirmation;