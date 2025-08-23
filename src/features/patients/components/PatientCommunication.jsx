import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Send, 
  Phone, 
  Mail, 
  Calendar, 
  Bell,
  Clock,
  CheckCircle,
  AlertCircle,
  Filter
} from 'lucide-react';
import Card from '../../../shared/components/ui/Card';
import LoadingButton from '../../../shared/components/ui/LoadingButton';
import Input from '../../../shared/components/ui/Input';
import { usePatientCommunication } from '../hooks/usePatientCommunication';
import { CommunicationChannels } from '../types/patient.types';
import { formatDateTime } from '../utils/patientHelpers';

const PatientCommunication = ({ 
  patientId, 
  patient,
  onUpdate,
  readOnly = false 
}) => {
  const {
    communications,
    loading,
    error,
    sendMessage,
    getMessageHistory,
    scheduleReminder,
    getPatientPreferences,
    updateCommunicationPreferences
  } = usePatientCommunication(patientId);

  const [activeTab, setActiveTab] = useState('messages');
  const [newMessage, setNewMessage] = useState('');
  const [messageType, setMessageType] = useState('general');
  const [preferences, setPreferences] = useState(null);
  const [filterType, setFilterType] = useState('all');

  // Cargar datos al montar
  useEffect(() => {
    if (patientId) {
      getMessageHistory(patientId);
      getPatientPreferences(patientId).then(setPreferences);
    }
  }, [patientId, getMessageHistory, getPatientPreferences]);

  const tabs = [
    { id: 'messages', label: 'Mensajes', icon: MessageCircle },
    { id: 'reminders', label: 'Recordatorios', icon: Bell },
    { id: 'preferences', label: 'Preferencias', icon: Clock }
  ];

  const messageTypes = [
    { value: 'general', label: 'Mensaje General', color: 'blue' },
    { value: 'appointment_reminder', label: 'Recordatorio de Cita', color: 'green' },
    { value: 'treatment_followup', label: 'Seguimiento de Tratamiento', color: 'orange' },
    { value: 'emergency', label: 'Emergencia', color: 'red' },
    { value: 'health_education', label: 'Educación en Salud', color: 'purple' }
  ];

  // Enviar nuevo mensaje
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const result = await sendMessage(patientId, newMessage, messageType);
      if (result.success) {
        setNewMessage('');
        setMessageType('general');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Programar recordatorio
  const handleScheduleReminder = async (reminderType, datetime) => {
    try {
      const result = await scheduleReminder(patientId, reminderType, datetime);
      if (result.success) {
        // Actualizar lista de recordatorios
        console.log('Recordatorio programado:', result.data);
      }
    } catch (error) {
      console.error('Error scheduling reminder:', error);
    }
  };

  // Filtrar comunicaciones
  const filteredCommunications = communications.filter(comm => {
    if (filterType === 'all') return true;
    return comm.type === filterType;
  });

  // Renderizar lista de mensajes
  const renderMessages = () => (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          <Filter className="w-4 h-4 mr-2 text-gray-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">Todos los mensajes</option>
            {messageTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Nuevo mensaje */}
      {!readOnly && (
        <Card title="Enviar Mensaje">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Mensaje
                </label>
                <select
                  value={messageType}
                  onChange={(e) => setMessageType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  {messageTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Canal Preferido
                </label>
                <div className="text-sm text-gray-600 py-2">
                  {preferences?.comunicacionPreferida || 'Email'}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mensaje
              </label>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Escriba su mensaje aquí..."
              />
            </div>

            <div className="flex justify-end">
              <LoadingButton
                onClick={handleSendMessage}
                loading={loading}
                disabled={!newMessage.trim() || loading}
              >
                <Send className="w-4 h-4 mr-2" />
                Enviar Mensaje
              </LoadingButton>
            </div>
          </div>
        </Card>
      )}

      {/* Historial de mensajes */}
      <Card title={`Historial de Comunicaciones (${filteredCommunications.length})`}>
        {filteredCommunications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No hay comunicaciones registradas
          </div>
        ) : (
          <div className="space-y-3">
            {filteredCommunications.map((communication) => (
              <div key={communication.id} className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        messageTypes.find(t => t.value === communication.type)?.color === 'red' ? 'bg-red-100 text-red-800' :
                        messageTypes.find(t => t.value === communication.type)?.color === 'green' ? 'bg-green-100 text-green-800' :
                        messageTypes.find(t => t.value === communication.type)?.color === 'orange' ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {messageTypes.find(t => t.value === communication.type)?.label || 'General'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {communication.channel}
                      </span>
                      <span className={`text-xs ${
                        communication.status === 'delivered' ? 'text-green-600' :
                        communication.status === 'read' ? 'text-blue-600' :
                        'text-gray-600'
                      }`}>
                        {communication.status === 'delivered' ? 'Entregado' :
                         communication.status === 'read' ? 'Leído' :
                         'Enviado'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-900 mb-2">
                      {communication.message}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDateTime(communication.timestamp)}
                    </p>
                  </div>
                  <div className="ml-4">
                    {communication.status === 'delivered' && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {communication.status === 'read' && (
                      <CheckCircle className="w-5 h-5 text-blue-500" />
                    )}
                    {communication.status === 'failed' && (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );

  // Renderizar recordatorios
  const renderReminders = () => (
    <div className="space-y-4">
      <Card title="Programar Recordatorio">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Recordatorio
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option value="appointment">Cita Programada</option>
                <option value="medication">Tomar Medicamento</option>
                <option value="followup">Seguimiento</option>
                <option value="checkup">Control Médico</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha y Hora
              </label>
              <input
                type="datetime-local"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mensaje del Recordatorio
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Mensaje personalizado para el recordatorio..."
            />
          </div>

          <div className="flex justify-end">
            <LoadingButton
              onClick={() => handleScheduleReminder('appointment', new Date())}
              loading={loading}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Programar Recordatorio
            </LoadingButton>
          </div>
        </div>
      </Card>
    </div>
  );

  // Renderizar preferencias
  const renderPreferences = () => (
    <div className="space-y-4">
      <Card title="Preferencias de Comunicación">
        {preferences ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Canal Preferido
                </label>
                <select
                  value={preferences.comunicacionPreferida}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev,
                    comunicacionPreferida: e.target.value
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  disabled={readOnly}
                >
                  {CommunicationChannels.map(channel => (
                    <option key={channel.value} value={channel.value}>
                      {channel.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frecuencia de Recordatorios
                </label>
                <select
                  value={preferences.frecuenciaRecordatorios}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev,
                    frecuenciaRecordatorios: e.target.value
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  disabled={readOnly}
                >
                  <option value="ninguno">No enviar recordatorios</option>
                  <option value="1_dia">1 día antes</option>
                  <option value="3_dias">3 días antes</option>
                  <option value="1_semana">1 semana antes</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-900">
                Tipos de Notificaciones
              </h4>
              
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.notificacionesEmail}
                    onChange={(e) => setPreferences(prev => ({
                      ...prev,
                      notificacionesEmail: e.target.checked
                    }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    disabled={readOnly}
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Notificaciones por Email
                  </span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.notificacionesSMS}
                    onChange={(e) => setPreferences(prev => ({
                      ...prev,
                      notificacionesSMS: e.target.checked
                    }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    disabled={readOnly}
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Notificaciones por SMS
                  </span>
                </label>
              </div>
            </div>

            {!readOnly && (
              <div className="flex justify-end pt-4 border-t">
                <LoadingButton
                  onClick={() => updateCommunicationPreferences(patientId, preferences)}
                  loading={loading}
                >
                  Guardar Preferencias
                </LoadingButton>
              </div>
            )}
          </div>
        ) : (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        )}
      </Card>
    </div>
  );

  if (loading && communications.length === 0) {
    return (
      <Card title="Comunicación con Paciente">
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
      <Card title="Comunicación con Paciente" className="border-red-200 bg-red-50">
        <div className="text-red-700">
          Error al cargar las comunicaciones: {error}
        </div>
      </Card>
    );
  }

  return (
    <Card title="Comunicación con Paciente">
      {/* Navegación por pestañas */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Información del canal preferido */}
      {preferences && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <MessageCircle className="w-4 h-4 text-blue-600 mr-2" />
            <span className="text-sm text-blue-800">
              Canal preferido: <strong>{preferences.comunicacionPreferida}</strong>
            </span>
            <span className="ml-4 text-sm text-blue-600">
              Recordatorios: {preferences.frecuenciaRecordatorios}
            </span>
          </div>
        </div>
      )}

      {/* Contenido de la pestaña activa */}
      <div className="min-h-64">
        {activeTab === 'messages' && renderMessages()}
        {activeTab === 'reminders' && renderReminders()}
        {activeTab === 'preferences' && renderPreferences()}
      </div>
    </Card>
  );
};

export default PatientCommunication;