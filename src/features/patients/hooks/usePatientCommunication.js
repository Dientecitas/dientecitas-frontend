import { useState, useCallback } from 'react';
import { communicationService } from '../services/communicationService';
import { hipaaCompliance } from '../services/hipaaCompliance';

export const usePatientCommunication = (patientId = null) => {
  const [communications, setCommunications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Enviar mensaje con encriptación
  const sendMessage = useCallback(async (targetPatientId, message, type = 'general') => {
    const id = targetPatientId || patientId;
    if (!id) throw new Error('Patient ID requerido');

    setLoading(true);
    setError(null);

    try {
      // Audit access para compliance HIPAA
      await hipaaCompliance.auditAccess(
        'current_user_id', 
        id, 
        'SEND_MESSAGE', 
        'patient_communication'
      );

      const result = await communicationService.sendMessage(id, message, type);
      
      // Actualizar historial local
      setCommunications(prev => [result, ...prev]);
      
      return { success: true, data: result };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  // Obtener historial de mensajes con controles de privacidad
  const getMessageHistory = useCallback(async (targetPatientId) => {
    const id = targetPatientId || patientId;
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      await hipaaCompliance.auditAccess(
        'current_user_id', 
        id, 
        'READ', 
        'communication_history'
      );

      // Simular carga de historial
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const mockHistory = [
        {
          id: '1',
          type: 'appointment_reminder',
          message: 'Recordatorio de cita para mañana',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          channel: 'email',
          status: 'delivered'
        },
        {
          id: '2',
          type: 'treatment_followup',
          message: '¿Cómo te sientes después del tratamiento?',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          channel: 'sms',
          status: 'read'
        }
      ];

      setCommunications(mockHistory);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  // Programar recordatorio
  const scheduleReminder = useCallback(async (targetPatientId, reminderType, datetime) => {
    const id = targetPatientId || patientId;
    
    setLoading(true);
    try {
      await hipaaCompliance.auditAccess(
        'current_user_id', 
        id, 
        'SCHEDULE', 
        'reminder'
      );

      // Simular programación
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const reminder = {
        id: Date.now().toString(),
        patientId: id,
        type: reminderType,
        scheduledFor: datetime,
        status: 'scheduled',
        createdAt: new Date().toISOString()
      };

      return { success: true, data: reminder };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  // Comunicación masiva
  const sendBulkCommunication = useCallback(async (patientIds, message, type = 'general') => {
    setLoading(true);
    try {
      // Audit para comunicación masiva
      await hipaaCompliance.auditAccess(
        'current_user_id', 
        'bulk_patients', 
        'BULK_SEND', 
        'bulk_communication'
      );

      const results = await communicationService.sendHealthCampaign(
        patientIds, 
        { name: 'Bulk Communication', template: message }
      );
      
      return { success: true, data: results };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener preferencias de comunicación
  const getPatientPreferences = useCallback(async (targetPatientId) => {
    const id = targetPatientId || patientId;
    
    try {
      // Simular carga de preferencias
      const preferences = {
        comunicacionPreferida: 'email',
        frecuenciaRecordatorios: '1_dia',
        idioma: 'es',
        notificacionesEmail: true,
        notificacionesSMS: true
      };

      return preferences;
    } catch (error) {
      console.error('Error getting patient preferences:', error);
      return null;
    }
  }, [patientId]);

  // Actualizar preferencias de comunicación
  const updateCommunicationPreferences = useCallback(async (targetPatientId, preferences) => {
    const id = targetPatientId || patientId;
    
    setLoading(true);
    try {
      await hipaaCompliance.auditAccess(
        'current_user_id', 
        id, 
        'UPDATE', 
        'communication_preferences'
      );

      // Simular actualización
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return { success: true, data: preferences };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  // Seguimiento de engagement de comunicación
  const trackCommunicationEngagement = useCallback(async (communicationId) => {
    try {
      // Simular tracking
      const engagement = {
        communicationId,
        opened: true,
        openedAt: new Date().toISOString(),
        clicked: false,
        responded: false
      };

      return engagement;
    } catch (error) {
      console.error('Error tracking engagement:', error);
      return null;
    }
  }, []);

  // Generar reporte de comunicación
  const generateCommunicationReport = useCallback(async (dateRange) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const report = {
        period: dateRange,
        totalMessages: 150,
        deliveryRate: 98.5,
        openRate: 75.2,
        responseRate: 45.8,
        channelBreakdown: {
          email: 60,
          sms: 30,
          whatsapp: 10
        },
        generatedAt: new Date().toISOString()
      };

      return report;
    } catch (error) {
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // Datos
    communications,
    
    // Estados
    loading,
    error,
    
    // Acciones
    sendMessage,
    getMessageHistory,
    scheduleReminder,
    sendBulkCommunication,
    getPatientPreferences,
    updateCommunicationPreferences,
    trackCommunicationEngagement,
    generateCommunicationReport,
    
    // Utilidades
    isLoading: loading,
    hasError: !!error,
    hasData: communications.length > 0
  };
};

export default usePatientCommunication;