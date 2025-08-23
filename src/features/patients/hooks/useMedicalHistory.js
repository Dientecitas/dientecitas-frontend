import { useState, useCallback } from 'react';
import { medicalAlertSystem } from '../services/medicalAlertSystem';
import { hipaaCompliance } from '../services/hipaaCompliance';

export const useMedicalHistory = (patientId = null) => {
  const [medicalHistory, setMedicalHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar historial médico completo
  const fetchMedicalHistory = useCallback(async (id) => {
    const targetPatientId = id || patientId;
    if (!targetPatientId) return;

    setLoading(true);
    setError(null);

    try {
      // Audit access para compliance HIPAA
      await hipaaCompliance.auditAccess(
        'current_user_id', 
        targetPatientId, 
        'READ', 
        'medical_history'
      );

      // Simular carga de historial médico
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockHistory = {
        patientId: targetPatientId,
        alergias: [],
        condicionesMedicas: [],
        medicamentosActuales: [],
        historialOdontologico: {
          tratamientosAnteriores: [],
          problemasActuales: [],
          ultimaLimpieza: null
        },
        lastUpdated: new Date().toISOString()
      };

      setMedicalHistory(mockHistory);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  // Actualizar condición médica
  const updateMedicalCondition = useCallback(async (patientId, condition) => {
    setLoading(true);
    try {
      await hipaaCompliance.auditAccess(
        'current_user_id', 
        patientId, 
        'UPDATE', 
        'medical_condition'
      );

      // Simular actualización
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return { success: true, data: condition };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Agregar alergia con evaluación de severidad
  const addAllergy = useCallback(async (patientId, allergy) => {
    setLoading(true);
    try {
      await hipaaCompliance.auditAccess(
        'current_user_id', 
        patientId, 
        'CREATE', 
        'allergy'
      );

      // Validar severidad de la alergia
      if (allergy.severidad === 'severa') {
        console.warn('ALERTA: Alergia severa registrada para paciente', patientId);
      }

      await new Promise(resolve => setTimeout(resolve, 300));
      
      return { success: true, data: allergy };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Verificar interacciones medicamentosas
  const checkDrugInteractions = useCallback(async (medications) => {
    if (!medications || medications.length < 2) return [];

    try {
      // Interacciones conocidas (simplificado)
      const knownInteractions = {
        'warfarin': ['aspirina', 'ibuprofeno'],
        'aspirina': ['warfarin', 'clopidogrel'],
        'metformina': ['alcohol']
      };

      const interactions = [];

      medications.forEach(med1 => {
        medications.forEach(med2 => {
          if (med1.id !== med2.id) {
            const med1Name = med1.medicamento.toLowerCase();
            const med2Name = med2.medicamento.toLowerCase();
            
            if (knownInteractions[med1Name]?.includes(med2Name)) {
              interactions.push({
                drugs: [med1.medicamento, med2.medicamento],
                severity: 'moderate',
                recommendation: 'Consultar con médico antes del tratamiento - riesgo de sangrado'
              });
            }
          }
        });
      });

      return interactions;
    } catch (error) {
      console.error('Error checking drug interactions:', error);
      return [];
    }
  }, []);

  // Generar evaluación de riesgo
  const generateRiskAssessment = useCallback(async (patientId) => {
    setLoading(true);
    try {
      await hipaaCompliance.auditAccess(
        'current_user_id', 
        patientId, 
        'READ', 
        'risk_assessment'
      );

      // Simular cálculo de riesgo
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const riskAssessment = {
        score: Math.floor(Math.random() * 10) + 1,
        factors: ['Edad avanzada', 'Diabetes no controlada'],
        recommendations: ['Control médico previo', 'Profilaxis antibiótica'],
        lastCalculated: new Date().toISOString()
      };

      return riskAssessment;
    } catch (error) {
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Validar datos médicos
  const validateMedicalData = useCallback((historyData) => {
    return medicalAlertSystem.validateMedicalData(historyData);
  }, []);

  // Exportar resumen médico
  const exportMedicalSummary = useCallback(async (patientId, format = 'pdf') => {
    setLoading(true);
    try {
      await hipaaCompliance.auditAccess(
        'current_user_id', 
        patientId, 
        'EXPORT', 
        'medical_summary'
      );

      // Simular generación de reporte
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        downloadUrl: `#medical-summary-${patientId}.${format}`,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Seguimiento de progreso de tratamiento
  const trackTreatmentProgress = useCallback(async (patientId, treatmentId) => {
    try {
      await hipaaCompliance.auditAccess(
        'current_user_id', 
        patientId, 
        'READ', 
        'treatment_progress'
      );

      // Simular seguimiento
      const progress = {
        treatmentId,
        currentPhase: 'Fase 2 de 3',
        completionPercentage: 65,
        nextAppointment: '2024-03-15',
        notes: 'Progreso satisfactorio'
      };

      return progress;
    } catch (error) {
      console.error('Error tracking treatment progress:', error);
      return null;
    }
  }, []);

  return {
    // Datos
    medicalHistory,
    
    // Estados
    loading,
    error,
    
    // Acciones
    fetchMedicalHistory,
    updateMedicalCondition,
    addAllergy,
    checkDrugInteractions,
    generateRiskAssessment,
    validateMedicalData,
    exportMedicalSummary,
    trackTreatmentProgress,
    
    // Utilidades
    isLoading: loading,
    hasError: !!error,
    hasData: !!medicalHistory
  };
};

export default useMedicalHistory;