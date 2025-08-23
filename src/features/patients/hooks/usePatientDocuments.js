import { useState, useCallback } from 'react';
import { hipaaCompliance } from '../services/hipaaCompliance';

export const usePatientDocuments = (patientId = null) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});

  // Subir documento con clasificación médica
  const uploadDocument = useCallback(async (targetPatientId, file, documentType) => {
    const id = targetPatientId || patientId;
    if (!id || !file) throw new Error('Patient ID y archivo requeridos');

    setLoading(true);
    setError(null);

    try {
      await hipaaCompliance.auditAccess(
        'current_user_id', 
        id, 
        'UPLOAD', 
        'document'
      );

      // Validar tipo de archivo
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'image/dicom'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Tipo de archivo no permitido');
      }

      // Validar tamaño (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('Archivo muy grande (máximo 10MB)');
      }

      // Simular progreso de upload
      setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
      
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploadProgress(prev => ({ ...prev, [file.name]: progress }));
      }

      const newDocument = {
        id: Date.now().toString(),
        patientId: id,
        nombre: file.name,
        tipo: documentType,
        tamaño: file.size,
        fechaSubida: new Date().toISOString(),
        url: URL.createObjectURL(file),
        clasificacion: getDocumentClassification(documentType),
        encriptado: isDocumentSensitive(documentType)
      };

      setDocuments(prev => [newDocument, ...prev]);
      setUploadProgress(prev => {
        const { [file.name]: removed, ...rest } = prev;
        return rest;
      });

      return { success: true, data: newDocument };
    } catch (err) {
      setError(err.message);
      setUploadProgress(prev => {
        const { [file.name]: removed, ...rest } = prev;
        return rest;
      });
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  // Obtener documentos con filtrado de privacidad
  const fetchDocuments = useCallback(async (targetPatientId, filters = {}) => {
    const id = targetPatientId || patientId;
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      await hipaaCompliance.auditAccess(
        'current_user_id', 
        id, 
        'READ', 
        'documents'
      );

      // Simular carga de documentos
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const mockDocuments = [
        {
          id: '1',
          patientId: id,
          nombre: 'Radiografía panorámica',
          tipo: 'radiografia',
          fechaSubida: '2024-01-15T10:00:00Z',
          tamaño: 2048576,
          clasificacion: 'medical_imaging',
          encriptado: true
        },
        {
          id: '2',
          patientId: id,
          nombre: 'Consentimiento firmado',
          tipo: 'consentimiento',
          fechaSubida: '2024-01-15T09:30:00Z',
          tamaño: 512000,
          clasificacion: 'legal_document',
          encriptado: true
        }
      ];

      // Aplicar filtros
      let filteredDocuments = mockDocuments;
      if (filters.tipo) {
        filteredDocuments = filteredDocuments.filter(doc => doc.tipo === filters.tipo);
      }

      setDocuments(filteredDocuments);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  // Compartir documento con controles de acceso
  const shareDocument = useCallback(async (documentId, recipients) => {
    setLoading(true);
    try {
      await hipaaCompliance.auditAccess(
        'current_user_id', 
        patientId, 
        'SHARE', 
        'document'
      );

      // Validar permisos de compartir
      const document = documents.find(doc => doc.id === documentId);
      if (!document) {
        throw new Error('Documento no encontrado');
      }

      if (document.encriptado && !hasEncryptionPermissions()) {
        throw new Error('Sin permisos para compartir documentos encriptados');
      }

      // Simular compartir
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const shareRecord = {
        documentId,
        recipients,
        sharedAt: new Date().toISOString(),
        sharedBy: 'current_user_id',
        accessLevel: 'read_only'
      };

      return { success: true, data: shareRecord };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [patientId, documents]);

  // Archivar documento con políticas de retención
  const archiveDocument = useCallback(async (documentId) => {
    setLoading(true);
    try {
      await hipaaCompliance.auditAccess(
        'current_user_id', 
        patientId, 
        'ARCHIVE', 
        'document'
      );

      // Aplicar políticas de retención
      const document = documents.find(doc => doc.id === documentId);
      const retentionPolicy = getRetentionPolicy(document.tipo);

      // Simular archivado
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setDocuments(prev => prev.map(doc => 
        doc.id === documentId 
          ? { 
              ...doc, 
              archivado: true, 
              fechaArchivado: new Date().toISOString(),
              politicaRetencion: retentionPolicy
            }
          : doc
      ));

      return { success: true, message: 'Documento archivado exitosamente' };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [patientId, documents]);

  // Generar reporte médico
  const generateReport = useCallback(async (targetPatientId, reportType) => {
    const id = targetPatientId || patientId;
    
    setLoading(true);
    try {
      await hipaaCompliance.auditAccess(
        'current_user_id', 
        id, 
        'GENERATE', 
        'medical_report'
      );

      // Simular generación de reporte
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const report = {
        id: Date.now().toString(),
        patientId: id,
        tipo: reportType,
        generadoEn: new Date().toISOString(),
        url: `#report-${reportType}-${id}.pdf`,
        validoHasta: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      };

      return { success: true, data: report };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  // Validar integridad del documento
  const validateDocumentIntegrity = useCallback(async (documentId) => {
    try {
      const document = documents.find(doc => doc.id === documentId);
      if (!document) {
        throw new Error('Documento no encontrado');
      }

      // Simular validación de integridad
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const validation = {
        documentId,
        integro: true,
        checksum: 'abc123def456',
        validatedAt: new Date().toISOString(),
        algorithm: 'SHA-256'
      };

      return validation;
    } catch (error) {
      console.error('Error validating document integrity:', error);
      return null;
    }
  }, [documents]);

  return {
    // Datos
    documents,
    uploadProgress,
    
    // Estados
    loading,
    error,
    
    // Acciones
    uploadDocument,
    fetchDocuments,
    shareDocument,
    archiveDocument,
    generateReport,
    validateDocumentIntegrity,
    
    // Utilidades
    isLoading: loading,
    hasError: !!error,
    hasData: documents.length > 0,
    getDocumentsByType: (type) => documents.filter(doc => doc.tipo === type),
    getRecentDocuments: (days = 30) => {
      const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      return documents.filter(doc => new Date(doc.fechaSubida) >= cutoffDate);
    }
  };
};

// Funciones auxiliares
const getDocumentClassification = (documentType) => {
  const classifications = {
    'radiografia': 'medical_imaging',
    'consentimiento': 'legal_document',
    'receta': 'prescription',
    'reporte': 'medical_report',
    'foto_clinica': 'clinical_photo',
    'laboratorio': 'lab_result'
  };
  
  return classifications[documentType] || 'general_document';
};

const isDocumentSensitive = (documentType) => {
  const sensitiveTypes = [
    'radiografia', 'foto_clinica', 'reporte', 'laboratorio', 'consentimiento'
  ];
  
  return sensitiveTypes.includes(documentType);
};

const hasEncryptionPermissions = () => {
  // En una implementación real, verificaría permisos del usuario actual
  return true;
};

const getRetentionPolicy = (documentType) => {
  const policies = {
    'radiografia': { years: 10, reason: 'Regulación médica' },
    'consentimiento': { years: 7, reason: 'Regulación legal' },
    'reporte': { years: 7, reason: 'Historial médico' },
    'foto_clinica': { years: 5, reason: 'Documentación clínica' }
  };
  
  return policies[documentType] || { years: 5, reason: 'Política general' };
};

export default usePatientDocuments;