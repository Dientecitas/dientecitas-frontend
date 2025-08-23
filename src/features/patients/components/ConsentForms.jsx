import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Download,
  Eye,
  Signature,
  X,
  Plus
} from 'lucide-react';
import Card from '../../../shared/components/ui/Card';
import LoadingButton from '../../../shared/components/ui/LoadingButton';
import Modal from '../../../shared/components/ui/Modal';
import { useConsentManagement } from '../hooks/useConsentManagement';
import { CONSENT_TYPES } from '../constants/medicalConstants';
import { formatDate, formatDateTime } from '../utils/patientHelpers';

const ConsentForms = ({ 
  patientId, 
  patient,
  onUpdate,
  readOnly = false 
}) => {
  const {
    consents,
    loading,
    error,
    fetchConsents,
    createConsent,
    signConsent,
    revokeConsent,
    generateConsentForm,
    checkConsentStatus,
    getRequiredConsents
  } = useConsentManagement(patientId);

  const [showSignModal, setShowSignModal] = useState(false);
  const [selectedConsent, setSelectedConsent] = useState(null);
  const [signature, setSignature] = useState('');
  const [consentStatus, setConsentStatus] = useState(null);

  // Cargar consentimientos al montar
  useEffect(() => {
    if (patientId) {
      fetchConsents(patientId);
    }
  }, [patientId, fetchConsents]);

  // Verificar estado de consentimientos
  useEffect(() => {
    if (patientId) {
      checkConsentStatus(patientId, 'general').then(setConsentStatus);
    }
  }, [patientId, checkConsentStatus, consents]);

  // Manejar firma de consentimiento
  const handleSignConsent = async () => {
    if (!selectedConsent || !signature.trim()) return;

    try {
      const result = await signConsent(selectedConsent.id, { data: signature });
      if (result.success) {
        setShowSignModal(false);
        setSelectedConsent(null);
        setSignature('');
        onUpdate?.();
      }
    } catch (error) {
      console.error('Error signing consent:', error);
    }
  };

  // Manejar revocación de consentimiento
  const handleRevokeConsent = async (consentId) => {
    if (!confirm('¿Está seguro de que desea revocar este consentimiento?')) return;

    try {
      const result = await revokeConsent(consentId);
      if (result.success) {
        onUpdate?.();
      }
    } catch (error) {
      console.error('Error revoking consent:', error);
    }
  };

  // Obtener estado visual del consentimiento
  const getConsentStatusDisplay = (consent) => {
    if (consent.revocado) {
      return {
        icon: X,
        color: 'red',
        text: 'Revocado',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800'
      };
    }
    
    if (consent.firmado) {
      if (consent.renovacionRequerida) {
        return {
          icon: Clock,
          color: 'yellow',
          text: 'Renovación Requerida',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800'
        };
      }
      return {
        icon: CheckCircle,
        color: 'green',
        text: 'Firmado',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800'
      };
    }
    
    return {
      icon: Clock,
      color: 'orange',
      text: 'Pendiente',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-800'
    };
  };

  if (loading && consents.length === 0) {
    return (
      <Card title="Consentimientos y Autorizaciones">
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
      <Card title="Consentimientos y Autorizaciones" className="border-red-200 bg-red-50">
        <div className="text-red-700">
          Error al cargar los consentimientos: {error}
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estado general de consentimientos */}
      {consentStatus && (
        <Card title="Estado de Consentimientos">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                consentStatus.allRequiredSigned ? 'text-green-600' : 'text-red-600'
              }`}>
                {consentStatus.allRequiredSigned ? 'Completo' : 'Incompleto'}
              </div>
              <div className="text-sm text-gray-600">Estado General</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {consents.filter(c => c.firmado).length}
              </div>
              <div className="text-sm text-gray-600">Firmados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {consentStatus.expiringSoon?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Por Vencer</div>
            </div>
          </div>
        </Card>
      )}

      {/* Lista de consentimientos */}
      <Card title="Consentimientos y Autorizaciones">
        <div className="space-y-4">
          {/* Header con acciones */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Lista de Consentimientos ({consents.length})
            </h3>
            {!readOnly && (
              <LoadingButton
                size="sm"
                onClick={() => {/* Implementar crear nuevo consentimiento */}}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Consentimiento
              </LoadingButton>
            )}
          </div>

          {consents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay consentimientos registrados
              </h3>
              <p className="text-gray-600">
                Los consentimientos son necesarios para realizar tratamientos
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {consents.map((consent) => {
                const status = getConsentStatusDisplay(consent);
                const StatusIcon = status.icon;
                
                return (
                  <div key={consent.id} className="p-4 rounded-lg border border-gray-200 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-gray-900">{consent.tipo}</h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.bgColor} ${status.textColor} flex items-center`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {status.text}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Fecha:</span> {formatDate(consent.fecha)}
                          </div>
                          <div>
                            <span className="font-medium">Versión:</span> {consent.version}
                          </div>
                          {consent.vencimiento && (
                            <div>
                              <span className="font-medium">Vence:</span> {formatDate(consent.vencimiento)}
                            </div>
                          )}
                        </div>

                        {consent.firmado && consent.fechaFirma && (
                          <div className="mt-2 text-xs text-gray-500">
                            Firmado el {formatDateTime(consent.fechaFirma)}
                          </div>
                        )}
                      </div>

                      {/* Acciones */}
                      <div className="flex items-center gap-2 ml-4">
                        <LoadingButton
                          size="sm"
                          variant="outline"
                          onClick={() => {/* Implementar ver documento */}}
                        >
                          <Eye className="w-4 h-4" />
                        </LoadingButton>
                        
                        {!consent.firmado && !readOnly && (
                          <LoadingButton
                            size="sm"
                            onClick={() => {
                              setSelectedConsent(consent);
                              setShowSignModal(true);
                            }}
                          >
                            <Signature className="w-4 h-4" />
                          </LoadingButton>
                        )}
                        
                        {consent.firmado && !readOnly && (
                          <LoadingButton
                            size="sm"
                            variant="outline"
                            onClick={() => handleRevokeConsent(consent.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </LoadingButton>
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

      {/* Consentimientos requeridos faltantes */}
      {consentStatus && consentStatus.missingConsents.length > 0 && (
        <Card title="Consentimientos Requeridos Faltantes" className="border-orange-200 bg-orange-50">
          <div className="space-y-3">
            {consentStatus.missingConsents.map((missingConsent, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200">
                <div>
                  <h4 className="font-medium text-gray-900">{missingConsent.name}</h4>
                  <p className="text-sm text-gray-600">{missingConsent.description}</p>
                </div>
                {!readOnly && (
                  <LoadingButton
                    size="sm"
                    onClick={() => {/* Implementar generar consentimiento */}}
                  >
                    Generar
                  </LoadingButton>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Modal de firma digital */}
      <Modal
        isOpen={showSignModal}
        onClose={() => {
          setShowSignModal(false);
          setSelectedConsent(null);
          setSignature('');
        }}
        title="Firmar Consentimiento"
        size="md"
      >
        {selectedConsent && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {selectedConsent.tipo}
              </h3>
              <p className="text-sm text-gray-600">
                Versión: {selectedConsent.version}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                Al firmar este consentimiento, usted acepta los términos y condiciones 
                del tratamiento dental propuesto. Esta firma tiene validez legal.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Firma Digital
              </label>
              <input
                type="text"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Escriba su nombre completo como firma"
              />
              <p className="text-xs text-gray-500 mt-1">
                Su firma será registrada con fecha y hora para validez legal
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <LoadingButton
                variant="outline"
                onClick={() => {
                  setShowSignModal(false);
                  setSelectedConsent(null);
                  setSignature('');
                }}
              >
                Cancelar
              </LoadingButton>
              <LoadingButton
                onClick={handleSignConsent}
                loading={loading}
                disabled={!signature.trim()}
              >
                <Signature className="w-4 h-4 mr-2" />
                Firmar Consentimiento
              </LoadingButton>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ConsentForms;