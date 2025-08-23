// Servicio de comunicación multi-canal para pacientes
export const communicationService = {
  // Envío de mensajes por canal preferido
  sendMessage: async (patientId, message, type = 'general') => {
    try {
      // En una implementación real, esto obtendría el paciente de la API
      const messageData = {
        patientId,
        message,
        type,
        timestamp: new Date().toISOString(),
        priority: type === 'emergency' ? 'high' : 'normal'
      };
      
      // Simular envío exitoso
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        success: true,
        messageId: Date.now().toString(),
        sentAt: new Date().toISOString(),
        channel: 'email', // Canal por defecto
        ...messageData
      };
    } catch (error) {
      throw new Error(`Error enviando mensaje: ${error.message}`);
    }
  },
  
  // Recordatorios de citas automatizados
  sendAppointmentReminder: async (patientId, appointmentData) => {
    try {
      const message = generateAppointmentReminderMessage(appointmentData, 'es');
      
      return await communicationService.sendMessage(
        patientId, 
        message, 
        'appointment_reminder'
      );
    } catch (error) {
      throw new Error(`Error enviando recordatorio: ${error.message}`);
    }
  },
  
  // Seguimiento post-tratamiento
  sendPostTreatmentFollowup: async (patientId, treatmentData) => {
    const followupSchedule = [
      { days: 1, type: 'immediate_care' },
      { days: 7, type: 'week_followup' },
      { days: 30, type: 'month_followup' }
    ];
    
    const results = [];
    
    for (const followup of followupSchedule) {
      const message = generateFollowupMessage(treatmentData, followup.type, 'es');
      
      // En una implementación real, esto programaría el mensaje
      results.push({
        type: followup.type,
        scheduledFor: new Date(Date.now() + (followup.days * 24 * 60 * 60 * 1000)),
        message
      });
    }
    
    return results;
  },
  
  // Comunicación de emergencia
  sendEmergencyAlert: async (patientId, alertType, urgencyLevel = 'high') => {
    try {
      const alertMessage = generateEmergencyMessage(alertType, urgencyLevel);
      
      // Enviar mensaje de emergencia
      const result = await communicationService.sendMessage(
        patientId, 
        alertMessage, 
        'emergency'
      );
      
      // Log de emergencia
      console.log('Emergency alert sent:', {
        patientId,
        alertType,
        urgencyLevel,
        timestamp: new Date().toISOString()
      });
      
      return result;
    } catch (error) {
      throw new Error(`Error enviando alerta de emergencia: ${error.message}`);
    }
  },
  
  // Campañas de salud preventiva
  sendHealthCampaign: async (patientIds, campaignData) => {
    const results = [];
    
    for (const patientId of patientIds) {
      try {
        const personalizedMessage = personalizeHealthMessage(
          campaignData.template, 
          { nombres: 'Paciente' } // Simplificado para mock
        );
        
        const result = await communicationService.sendMessage(
          patientId, 
          personalizedMessage, 
          'health_campaign'
        );
        
        results.push({ patientId, success: true, result });
      } catch (error) {
        results.push({ patientId, success: false, error: error.message });
      }
    }
    
    return {
      campaign: campaignData.name,
      totalSent: results.filter(r => r.success).length,
      totalFailed: results.filter(r => !r.success).length,
      details: results
    };
  }
};

// Generadores de mensajes personalizados
const generateAppointmentReminderMessage = (appointment, language = 'es') => {
  const messages = {
    es: `Hola, te recordamos tu cita odontológica el ${appointment.fecha} a las ${appointment.hora}. Si necesitas reprogramar, contacta con nosotros.`,
    en: `Hello, this is a reminder of your dental appointment on ${appointment.fecha} at ${appointment.hora}. Please contact us if you need to reschedule.`
  };
  return messages[language] || messages.es;
};

const generateFollowupMessage = (treatment, type, language = 'es') => {
  const templates = {
    es: {
      immediate_care: `Esperamos que te encuentres bien después de tu tratamiento. Recuerda seguir las indicaciones post-tratamiento.`,
      week_followup: `Ha pasado una semana desde tu tratamiento. ¿Cómo te sientes? Si tienes alguna consulta, estamos aquí para ayudarte.`,
      month_followup: `¡Hola! Ha pasado un mes desde tu tratamiento. Nos gustaría saber cómo has estado.`
    }
  };
  return templates[language][type] || templates.es[type];
};

const generateEmergencyMessage = (alertType, urgencyLevel) => {
  const messages = {
    medical_emergency: 'ALERTA MÉDICA: Se requiere atención inmediata.',
    appointment_urgent: 'CITA URGENTE: Por favor contacte inmediatamente.',
    treatment_complication: 'COMPLICACIÓN: Requiere evaluación médica.'
  };
  
  return messages[alertType] || 'Alerta médica importante';
};

const personalizeHealthMessage = (template, patient) => {
  let message = template;
  
  // Reemplazar variables del paciente
  message = message.replace('{{nombre}}', patient.nombres || 'Paciente');
  
  return message;
};

export default communicationService;