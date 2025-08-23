import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Upload, 
  Download, 
  Eye, 
  Share2, 
  Archive,
  Image,
  File,
  Shield,
  Calendar
} from 'lucide-react';
import Card from '../../../shared/components/ui/Card';
import LoadingButton from '../../../shared/components/ui/LoadingButton';
import { usePatientDocuments } from '../hooks/usePatientDocuments';
import { formatDate, formatNumber } from '../utils/patientHelpers';

const PatientDocuments = ({ 
  patientId, 
  patient,
  onUpdate,
  readOnly = false 
}) => {
  const {
    documents,
    uploadProgress,
    loading,
    error,
    uploadDocument,
    fetchDocuments,
    shareDocument,
    archiveDocument,
    generateReport,
    getDocumentsByType,
    getRecentDocuments
  } = usePatientDocuments(patientId);

  const [activeFilter, setActiveFilter] = useState('all');
  const [dragOver, setDragOver] = useState(false);

  // Cargar documentos al montar
  useEffect(() => {
    if (patientId) {
      fetchDocuments(patientId);
    }
  }, [patientId, fetchDocuments]);

  const documentTypes = [
    { value: 'all', label: 'Todos', icon: FileText },
    { value: 'radiografia', label: 'Radiografías', icon: Image },
    { value: 'consentimiento', label: 'Consentimientos', icon: Shield },
    { value: 'reporte', label: 'Reportes', icon: File },
    { value: 'foto_clinica', label: 'Fotos Clínicas', icon: Image },
    { value: 'laboratorio', label: 'Laboratorio', icon: FileText }
  ];

  // Filtrar documentos
  const filteredDocuments = activeFilter === 'all' 
    ? documents 
    : getDocumentsByType(activeFilter);

  // Manejar subida de archivo
  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;

    for (const file of files) {
      try {
        const documentType = detectDocumentType(file);
        await uploadDocument(patientId, file, documentType);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  // Detectar tipo de documento
  const detectDocumentType = (file) => {
    const fileName = file.name.toLowerCase();
    
    if (fileName.includes('radiografia') || fileName.includes('xray')) {
      return 'radiografia';
    }
    if (fileName.includes('consentimiento') || fileName.includes('consent')) {
      return 'consentimiento';
    }
    if (fileName.includes('reporte') || fileName.includes('report')) {
      return 'reporte';
    }
    if (file.type.startsWith('image/')) {
      return 'foto_clinica';
    }
    
    return 'general';
  };

  // Manejar drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  };

  // Obtener icono del documento
  const getDocumentIcon = (document) => {
    switch (document.tipo) {
      case 'radiografia':
      case 'foto_clinica':
        return Image;
      case 'consentimiento':
        return Shield;
      case 'reporte':
        return File;
      default:
        return FileText;
    }
  };

  // Formatear tamaño de archivo
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading && documents.length === 0) {
    return (
      <Card title="Documentos Médicos">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card title="Documentos Médicos" className="border-red-200 bg-red-50">
        <div className="text-red-700">
          Error al cargar los documentos: {error}
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas de documentos */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <div className="text-2xl font-bold text-blue-600">{documents.length}</div>
          <div className="text-sm text-gray-600">Total Documentos</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {getRecentDocuments(30).length}
          </div>
          <div className="text-sm text-gray-600">Últimos 30 días</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {documents.filter(d => d.encriptado).length}
          </div>
          <div className="text-sm text-gray-600">Encriptados</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {documents.filter(d => d.archivado).length}
          </div>
          <div className="text-sm text-gray-600">Archivados</div>
        </Card>
      </div>

      {/* Área de subida de archivos */}
      {!readOnly && (
        <Card title="Subir Documentos">
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragOver 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Subir Documentos Médicos
            </h3>
            <p className="text-gray-600 mb-4">
              Arrastra archivos aquí o haz clic para seleccionar
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.dicom"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <LoadingButton
                as="span"
                variant="outline"
                className="cursor-pointer"
              >
                Seleccionar Archivos
              </LoadingButton>
            </label>
            <p className="text-xs text-gray-500 mt-2">
              Formatos permitidos: PDF, JPG, PNG, DICOM (máximo 10MB)
            </p>
          </div>

          {/* Progreso de subida */}
          {Object.keys(uploadProgress).length > 0 && (
            <div className="mt-4 space-y-2">
              {Object.entries(uploadProgress).map(([fileName, progress]) => (
                <div key={fileName} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 flex-1 truncate">{fileName}</span>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-12 text-right">{progress}%</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Lista de documentos */}
      <Card title="Documentos Médicos">
        <div className="space-y-4">
          {/* Filtros por tipo */}
          <div className="flex flex-wrap gap-2">
            {documentTypes.map((type) => {
              const TypeIcon = type.icon;
              const count = type.value === 'all' ? documents.length : getDocumentsByType(type.value).length;
              
              return (
                <button
                  key={type.value}
                  onClick={() => setActiveFilter(type.value)}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeFilter === type.value
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <TypeIcon className="w-4 h-4 mr-2" />
                  {type.label} ({count})
                </button>
              );
            })}
          </div>

          {/* Lista de documentos */}
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay documentos
              </h3>
              <p className="text-gray-600">
                {activeFilter === 'all' 
                  ? 'No hay documentos subidos para este paciente'
                  : `No hay documentos del tipo "${documentTypes.find(t => t.value === activeFilter)?.label}"`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDocuments.map((document) => {
                const DocumentIcon = getDocumentIcon(document);
                
                return (
                  <div key={document.id} className="p-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex-shrink-0">
                          <DocumentIcon className="w-8 h-8 text-blue-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">
                            {document.nombre}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>Tipo: {document.tipo}</span>
                            <span>Tamaño: {formatFileSize(document.tamaño)}</span>
                            <span>Subido: {formatDate(document.fechaSubida)}</span>
                          </div>
                          {document.encriptado && (
                            <div className="flex items-center mt-1">
                              <Shield className="w-3 h-3 text-green-500 mr-1" />
                              <span className="text-xs text-green-600">Encriptado</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Acciones */}
                      <div className="flex items-center gap-2 ml-4">
                        <LoadingButton
                          size="sm"
                          variant="outline"
                          onClick={() => {/* Implementar vista previa */}}
                        >
                          <Eye className="w-4 h-4" />
                        </LoadingButton>
                        
                        <LoadingButton
                          size="sm"
                          variant="outline"
                          onClick={() => {/* Implementar descarga */}}
                        >
                          <Download className="w-4 h-4" />
                        </LoadingButton>
                        
                        {!readOnly && (
                          <>
                            <LoadingButton
                              size="sm"
                              variant="outline"
                              onClick={() => shareDocument(document.id, [])}
                            >
                              <Share2 className="w-4 h-4" />
                            </LoadingButton>
                            
                            <LoadingButton
                              size="sm"
                              variant="outline"
                              onClick={() => archiveDocument(document.id)}
                              className="text-orange-600 hover:text-orange-700"
                            >
                              <Archive className="w-4 h-4" />
                            </LoadingButton>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>

      {/* Acciones rápidas */}
      {!readOnly && (
        <Card title="Generar Reportes">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <LoadingButton
              variant="outline"
              onClick={() => generateReport(patientId, 'medical_summary')}
              loading={loading}
              className="flex-col h-20"
            >
              <FileText className="w-6 h-6 mb-2" />
              Resumen Médico
            </LoadingButton>
            
            <LoadingButton
              variant="outline"
              onClick={() => generateReport(patientId, 'treatment_history')}
              loading={loading}
              className="flex-col h-20"
            >
              <Calendar className="w-6 h-6 mb-2" />
              Historial de Tratamientos
            </LoadingButton>
            
            <LoadingButton
              variant="outline"
              onClick={() => generateReport(patientId, 'consent_summary')}
              loading={loading}
              className="flex-col h-20"
            >
              <Shield className="w-6 h-6 mb-2" />
              Estado de Consentimientos
            </LoadingButton>
          </div>
        </Card>
      )}
    </div>
  );
};

// Función auxiliar para formatear tamaño de archivo
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default PatientDocuments;