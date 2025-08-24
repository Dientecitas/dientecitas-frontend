import { mockDistricts, mockServices, mockPatients, mockDentists, generateMockTimeSlots } from './mockData';
import { generateBookingCode } from '../utils/bookingHelpers';

// Simulación de delays de red
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const bookingApi = {
  // Servicios de pacientes
  searchPatientByDNI: async (dni) => {
    await delay(800);
    const patient = mockPatients.find(p => p.dni === dni);
    return { success: true, data: patient };
  },

  createPatient: async (patientData) => {
    await delay(1000);
    const newPatient = {
      id: Date.now().toString(),
      ...patientData
    };
    mockPatients.push(newPatient);
    return { success: true, data: newPatient };
  },

  // Servicios de distritos
  getDistricts: async () => {
    await delay(500);
    return { success: true, data: mockDistricts };
  },

  getDistrictById: async (id) => {
    await delay(300);
    const district = mockDistricts.find(d => d.id === id);
    return { success: true, data: district };
  },

  // Servicios de servicios médicos
  getServices: async (districtId = null) => {
    await delay(600);
    // En una implementación real, filtrarías por distrito
    return { success: true, data: mockServices };
  },

  getServiceById: async (id) => {
    await delay(300);
    const service = mockServices.find(s => s.id === id);
    return { success: true, data: service };
  },

  // Servicios de horarios
  getAvailableTimeSlots: async (districtId, serviceId, date) => {
    await delay(800);
    const slots = generateMockTimeSlots(date, districtId);
    return { success: true, data: slots };
  },

  reserveTimeSlot: async (slotId, duration = 5) => {
    await delay(500);
    // Simular reserva temporal del slot
    const reservedUntil = new Date(Date.now() + duration * 60 * 1000);
    return { 
      success: true, 
      data: { 
        slotId, 
        reservedUntil,
        message: `Slot reservado por ${duration} minutos`
      }
    };
  },

  // Servicios de pago
  processPayment: async (paymentData) => {
    await delay(2000);
    
    // Simular diferentes resultados de pago
    const success = Math.random() > 0.1; // 90% de éxito
    
    if (success) {
      return {
        success: true,
        data: {
          transactionId: `TXN-${Date.now()}`,
          status: 'approved',
          amount: paymentData.amount,
          method: paymentData.method,
          timestamp: new Date().toISOString()
        }
      };
    } else {
      return {
        success: false,
        error: 'Error en el procesamiento del pago. Intente nuevamente.'
      };
    }
  },

  // Servicios de reserva
  createBooking: async (bookingData) => {
    await delay(1200);
    
    const booking = {
      id: Date.now().toString(),
      code: generateBookingCode(),
      ...bookingData,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    return { success: true, data: booking };
  },

  getBookingByCode: async (code) => {
    await delay(500);
    // Simular búsqueda de reserva
    return { 
      success: true, 
      data: {
        id: '1',
        code,
        status: 'confirmed',
        patient: mockPatients[0],
        district: mockDistricts[0],
        service: mockServices[0],
        appointment: {
          date: '2024-01-15',
          time: '10:00',
          dentist: mockDentists[0]
        }
      }
    };
  },

  // Servicios de notificación
  sendConfirmationEmail: async (email, bookingData) => {
    await delay(1000);
    return { 
      success: true, 
      message: `Email de confirmación enviado a ${email}`
    };
  },

  generateBookingPDF: async (bookingData) => {
    await delay(800);
    return { 
      success: true, 
      data: {
        pdfUrl: `data:application/pdf;base64,${btoa('PDF content mock')}`,
        filename: `reserva-${bookingData.code}.pdf`
      }
    };
  }
};

export default bookingApi;