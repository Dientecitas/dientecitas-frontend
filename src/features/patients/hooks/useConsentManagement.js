import { useState, useCallback } from 'react';
import { hipaaCompliance } from '../services/hipaaCompliance';
import { CONSENT_TYPES } from '../constants/medicalConstants';

export const useConsentManagement = (patientId = null) => {
  const [consents, setConsents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener consentimientos con seguimiento de versiones
  const fetchConsents = useCallback(async (targetPatientId) => {
    const id = targetPatientId || patientId;
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      await hipaaCompliance.auditAccess(
        'current_user_id', 
        id, 
        'READ', 
        'consents'
      );

      // Simular carga de consentimientos
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const mockConsents = [
        {
          id: '1',
          tipo: 'Tratamiento Dental General',
          fecha: '2024-01-15',
          firmado: true,
          version: '2024.1',
          renovacionRequerida: false,
          vencimiento: '2025-01-15'
        },
        {
          id: '2',
          tipo: 'Uso de Datos Médicos',
          fecha: '2024-01-15',
          firmado: true,
          version: '2024.1',
          renovacionRequerida: false
        }
      ];

      setConsents(mockConsents);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  // Crear nuevo consentimiento
  const createConsent = useCallback(async (targetPatientId, consentData) => {
    const id = targetPatientId || patientId;
    
    setLoading(true);
    try {
      await hipaaCompliance.auditAccess(
        'current_user_id', 
        id, 
        'CREATE', 
        'consent'
      );

      // Simular creación
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newConsent = {
        id: Date.now().toString(),
        patientId: id,
        ...consentData,
        createdAt: new Date().toISOString(),
        status: 'pending_signature'
      };

      setConsents(prev => [newConsent, ...prev]);
      
      return { success: true, data: newConsent };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  // Firmar consentimiento con validación legal
  const signConsent = useCallback(async (consentId, signature) => {
    setLoading(true);
    try {
      // Validar firma digital
      if (!signature || !signature.data) {
        throw new Error('Firma digital requerida');
      }

      await hipaaCompliance.auditAccess(
        'current_user_id', 
        patientId, 
        'SIGN', 
        'consent'
      );

      // Simular proceso de firma
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Actualizar consentimiento
      setConsents(prev => prev.map(consent => 
        consent.id === consentId 
          ? { 
              ...consent, 
              firmado: true, 
              fechaFirma: new Date().toISOString(),
              firmaDigital: signature.data,
              status: 'signed'
            }
          : consent
      ));

      return { success: true, message: 'Consentimiento firmado exitosamente' };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  // Revocar consentimiento con evaluación de impacto
  const revokeConsent = useCallback(async (consentId) => {
    setLoading(true);
    try {
      await hipaaCompliance.auditAccess(
        'current_user_id', 
        patientId, 
        'REVOKE', 
        'consent'
      );

      // Evaluar impacto de la revocación
      const impactAssessment = {
        affectedTreatments: [],
        requiredActions: ['Suspender tratamientos relacionados'],
        legalImplications: 'Paciente puede continuar con tratamientos alternativos'
      };

      // Simular revocación
      await new Promise(resolve => setTimeout(resolve, 400));
      
      setConsents(prev => prev.map(consent => 
        consent.id === consentId 
          ? { 
              ...consent, 
              revocado: true, 
              fechaRevocacion: new Date().toISOString(),
              status: 'revoked'
            }
          : consent
      ));

      return { success: true, impact: impactAssessment };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  // Generar formulario de consentimiento
  const generateConsentForm = useCallback(async (templateId, patientData) => {
    setLoading(true);
    try {
      const template = CONSENT_TYPES.find(t => t.id === templateId);
      if (!template) {
        throw new Error('Template de consentimiento no encontrado');
      }

      // Simular generación de formulario
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const consentForm = {
        templateId,
        patientId: patientData.id,
        title: template.name,
        content: `Formulario de consentimiento para ${template.description}`,
        requiredSignature: true,
        generatedAt: new Date().toISOString()
      };

      return { success: true, data: consentForm };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Verificar estado de consentimientos para procedimiento
  const checkConsentStatus = useCallback(async (targetPatientId, procedure) => {
    const id = targetPatientId || patientId;
    
    try {
      await hipaaCompliance.auditAccess(
        'current_user_id', 
        id, 
        'CHECK', 
        'consent_status'
      );

      // Determinar consentimientos requeridos para el procedimiento
      const requiredConsents = CONSENT_TYPES.filter(consent => {
        if (procedure === 'cirugia_oral') {
          return ['general_treatment', 'oral_surgery', 'anesthesia'].includes(consent.id);
        }
        if (procedure === 'ortodoncia') {
          return ['general_treatment', 'orthodontics'].includes(consent.id);
        }
        return consent.required;
      });

      const currentConsents = consents.filter(c => c.firmado && !c.revocado);
      
      const status = {
        procedure,
        allRequiredSigned: requiredConsents.every(req => 
          currentConsents.some(curr => curr.tipo === req.name)
        ),
        missingConsents: requiredConsents.filter(req => 
          !currentConsents.some(curr => curr.tipo === req.name)
        ),
        expiringSoon: currentConsents.filter(consent => {
          if (!consent.vencimiento) return false;
          const expiryDate = new Date(consent.vencimiento);
          const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
          return expiryDate <= thirtyDaysFromNow;
        })
      };

      return status;
    } catch (error) {
      console.error('Error checking consent status:', error);
      return null;
    }
  }, [patientId, consents]);

  // Programar renovación de consentimiento
  const scheduleConsentRenewal = useCallback(async (consentId, renewalDate) => {
    setLoading(true);
    try {
      await hipaaCompliance.auditAccess(
        'current_user_id', 
        patientId, 
        'SCHEDULE', 
        'consent_renewal'
      );

      // Simular programación de renovación
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setConsents(prev => prev.map(consent => 
        consent.id === consentId 
          ? { 
              ...consent, 
              renovacionProgramada: renewalDate,
              renovacionRequerida: true
            }
          : consent
      ));

      return { success: true, message: 'Renovación programada exitosamente' };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  // Exportar historial de consentimientos
  const exportConsentHistory = useCallback(async (targetPatientId) => {
    const id = targetPatientId || patientId;
    
    setLoading(true);
    try {
      await hipaaCompliance.auditAccess(
        'current_user_id', 
        id, 
        'EXPORT', 
        'consent_history'
      );

      // Simular generación de reporte
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return {
        success: true,
        downloadUrl: `#consent-history-${id}.pdf`,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  return {
    // Datos
    consents,
    
    // Estados
    loading,
    error,
    
    // Acciones
    fetchConsents,
    createConsent,
    signConsent,
    revokeConsent,
    generateConsentForm,
    checkConsentStatus,
    scheduleConsentRenewal,
    exportConsentHistory,
    
    // Utilidades
    isLoading: loading,
    hasError: !!error,
    hasData: consents.length > 0,
    getRequiredConsents: (procedure) => {
      return CONSENT_TYPES.filter(consent => {
        if (procedure === 'cirugia_oral') {
          return ['general_treatment', 'oral_surgery', 'anesthesia'].includes(consent.id);
        }
        if (procedure === 'ortodoncia') {
          return ['general_treatment', 'orthodontics'].includes(consent.id);
        }
        return consent.required;
      });
    }
  };
};

export default useConsentManagement;