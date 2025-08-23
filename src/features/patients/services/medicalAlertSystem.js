// Sistema de alertas médicas para compliance HIPAA
export const medicalAlertSystem = {
  generateAlerts: (patient) => {
    const alerts = [];
    
    // Alergias críticas
    if (patient.alergias && patient.alergias.length > 0) {
      patient.alergias.forEach(allergy => {
        if (allergy.severidad === 'severa') {
          alerts.push({
            type: 'CRITICAL_ALLERGY',
            message: `ALERGIA SEVERA: ${allergy.alergia}`,
            priority: 'high',
            color: 'red',
            patientId: patient.id,
            timestamp: new Date().toISOString()
          });
        }
      });
    }
    
    // Condiciones médicas críticas
    const criticalConditions = [
      'diabetes', 'hipertension', 'enfermedad_cardiaca', 
      'anticoagulante', 'marcapasos', 'embarazo'
    ];
    
    if (patient.condicionesMedicas && patient.condicionesMedicas.length > 0) {
      patient.condicionesMedicas.forEach(condition => {
        if (criticalConditions.some(cc => 
          condition.condicion.toLowerCase().includes(cc))) {
          alerts.push({
            type: 'MEDICAL_CONDITION',
            message: `Condición Crítica: ${condition.condicion}`,
            priority: condition.controlado ? 'medium' : 'high',
            color: condition.controlado ? 'orange' : 'red',
            patientId: patient.id,
            timestamp: new Date().toISOString()
          });
        }
      });
    }
    
    // Medicamentos con interacciones
    if (patient.medicamentosActuales && patient.medicamentosActuales.length > 0) {
      const interactions = checkDrugInteractions(patient.medicamentosActuales);
      interactions.forEach(interaction => {
        alerts.push({
          type: 'DRUG_INTERACTION',
          message: `Posible interacción: ${interaction.drugs.join(' + ')}`,
          priority: 'medium',
          color: 'yellow',
          patientId: patient.id,
          timestamp: new Date().toISOString()
        });
      });
    }
    
    // Edad avanzada
    if (patient.edad >= 65) {
      alerts.push({
        type: 'AGE_CONSIDERATION',
        message: 'Paciente adulto mayor - considerar precauciones',
        priority: 'low',
        color: 'blue',
        patientId: patient.id,
        timestamp: new Date().toISOString()
      });
    }
    
    // Alto riesgo
    if (patient.puntuacionRiesgo >= 8) {
      alerts.push({
        type: 'HIGH_RISK',
        message: 'Paciente de alto riesgo odontológico',
        priority: 'high',
        color: 'red',
        patientId: patient.id,
        timestamp: new Date().toISOString()
      });
    }
    
    return alerts;
  },
  
  checkEmergencyStatus: (patient) => {
    const emergencyFlags = [];
    
    // Factores de riesgo alto
    if (patient.puntuacionRiesgo >= 8) {
      emergencyFlags.push('HIGH_RISK_PATIENT');
    }
    
    // Alergias severas a anestésicos
    if (patient.alergias && patient.alergias.length > 0) {
      const anestheticAllergies = patient.alergias.filter(a => 
        ['lidocaina', 'articaina', 'benzocaina'].includes(a.alergia.toLowerCase())
      );
      
      if (anestheticAllergies.length > 0) {
        emergencyFlags.push('ANESTHETIC_ALLERGY');
      }
    }
    
    return emergencyFlags;
  },
  
  validateMedicalData: (medicalData) => {
    const errors = [];

    // Validar alergias
    if (medicalData.alergias) {
      medicalData.alergias.forEach((allergy, index) => {
        if (!allergy.alergia) {
          errors.push(`Alergia ${index + 1}: Nombre de alergia requerido`);
        }
        if (!allergy.severidad) {
          errors.push(`Alergia ${index + 1}: Severidad requerida`);
        }
      });
    }

    // Validar condiciones médicas
    if (medicalData.condicionesMedicas) {
      medicalData.condicionesMedicas.forEach((condition, index) => {
        if (!condition.condicion) {
          errors.push(`Condición ${index + 1}: Nombre de condición requerido`);
        }
      });
    }

    // Validar medicamentos
    if (medicalData.medicamentosActuales) {
      medicalData.medicamentosActuales.forEach((med, index) => {
        if (!med.medicamento) {
          errors.push(`Medicamento ${index + 1}: Nombre requerido`);
        }
        if (!med.dosis) {
          errors.push(`Medicamento ${index + 1}: Dosis requerida`);
        }
      });
    }

    return errors;
  }
};

// Función auxiliar para verificar interacciones medicamentosas
const checkDrugInteractions = (medications) => {
  const interactions = [];
  
  // Interacciones conocidas (simplificado)
  const knownInteractions = {
    'warfarin': ['aspirina', 'ibuprofeno'],
    'aspirina': ['warfarin', 'clopidogrel'],
    'metformina': ['alcohol']
  };

  medications.forEach(med1 => {
    medications.forEach(med2 => {
      if (med1.id !== med2.id) {
        const med1Name = med1.medicamento.toLowerCase();
        const med2Name = med2.medicamento.toLowerCase();
        
        if (knownInteractions[med1Name]?.includes(med2Name)) {
          interactions.push({
            drugs: [med1.medicamento, med2.medicamento],
            severity: 'moderate',
            recommendation: 'Consultar con médico antes del tratamiento'
          });
        }
      }
    });
  });

  return interactions;
};

export default medicalAlertSystem;