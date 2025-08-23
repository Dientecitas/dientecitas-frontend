import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, 
  Edit, 
  ArrowLeft, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  Heart,
  FileText,
  MessageCircle,
  Shield,
  Activity,
  AlertTriangle
} from 'lucide-react';
import Card from '../../../shared/components/ui/Card';
import LoadingButton from '../../../shared/components/ui/LoadingButton';
import PageLoader from '../../../shared/components/ui/PageLoader';
import MedicalHistory from '../components/MedicalHistory';
import PatientCommunication from '../components/PatientCommunication';
import ConsentForms from '../components/ConsentForms';
import PatientDocuments from '../components/PatientDocuments';
import { usePatients } from '../hooks/usePatients';
import { 
  formatFullName, 
  formatDate, 
  calculateAge,
  getRiskLevelColor,
  getRiskLevelText,
  getPatientStatusColor,
  getPatientStatusText,
  formatInsuranceInfo
} from '../utils/patientHelpers';

const PatientDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { patients, loading, getMedicalAlerts } = usePatients();
  
  const [patient, setPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [medicalAlerts, setMedicalAlerts] = useState([]);

  // Buscar paciente en la lista cargada o cargar individualmente
  useEffect(() => {
    const foundPatient = patients.find(p => p.id === id);
    if (foundPatient) {
      setPatient(foundPatient);
      const alerts = getMedicalAlerts(foundPatient.id);
      setMedicalAlerts(alerts);
    } else if (!loading.patients) {
      // En una implementación real, cargaría el paciente individual
      console.log('Loading individual patient:', id);
    }
  }, [id, patients, loading.patients, getMedicalAlerts]);

  const tabs = [
    { id: 'summary', label: 'Resumen', icon: Activity },
    { id: 'medical', label: 'Historial Médico', icon: Heart },
    { id: 'communication', label: 'Comunicación', icon: MessageCircle },
    { id: 'documents', label: 'Documentos', icon: FileText },
    { id: 'consents', label: 'Consentimientos', icon: Shield }
  ];

  // Mostrar loader si está cargando
  if (loading.patients && !patient) {
    return (
      <PageLoader 
        message="Cargando expediente médico..." 
        description="Accediendo a información del paciente"
        timeout={10000}
      />
    );
  }

  // Mostrar error si no se encuentra el paciente
  if (!loading.patients && !patient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full text-center">
          <div className="p-6">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Paciente no encontrado
            </h2>
            <p className="text-gray-600 mb-4">
              El paciente con ID {id} no existe o no tienes permisos para verlo.
            </p>
            <LoadingButton
              onClick={() => navigate('/patients')}
              variant="outline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Pacientes
            </LoadingButton>
          </div>
        </Card>
      </div>
    );
  }

  const fullName = formatFullName(patient.nombres, patient.apellidos);
  const age = calculateAge(patient.fechaNacimiento);
  const hasUpcomingAppointment = patient.proximaCita && new Date(patient.proximaCita) > new Date();

  // Renderizar resumen del paciente
  const renderSummary = () => (
    <div className="space-y-6">
      {/* Alertas médicas críticas */}
      {medicalAlerts.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-sm font-medium text-red-800 mb-2">
                Alertas Médicas Críticas
              </h3>
              <div className="space-y-1">
                {medicalAlerts.map((alert, index) => (
                  <div key={index} className="text-sm text-red-700">
                    • {alert.message}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Información general */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Información Personal">
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="text-sm text-gray-900">{patient.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Teléfono</dt>
              <dd className="text-sm text-gray-900">{patient.telefono}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Dirección</dt>
              <dd className="text-sm text-gray-900">{patient.direccion}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Distrito</dt>
              <dd className="text-sm text-gray-900">{patient.distrito}</dd>
            </div>
            {patient.ocupacion && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Ocupación</dt>
                <dd className="text-sm text-gray-900">{patient.ocupacion}</dd>
              </div>
            )}
          </dl>
        </Card>

        <Card title="Información Médica">
          <dl className="space-y-3">
            {patient.tipoSangre && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Tipo de Sangre</dt>
                <dd className="text-sm text-gray-900">{patient.tipoSangre}</dd>
              </div>
            )}
            <div>
              <dt className="text-sm font-medium text-gray-500">Alergias</dt>
              <dd className="text-sm text-gray-900">
                {patient.alergias?.length > 0 
                  ? patient.alergias.map(a => `${a.alergia} (${a.severidad})`).join(', ')
                  : 'Ninguna conocida'
                }
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Condiciones Médicas</dt>
              <dd className="text-sm text-gray-900">
                {patient.condicionesMedicas?.length > 0 
                  ? patient.condicionesMedicas.map(c => c.condicion).join(', ')
                  : 'Ninguna'
                }
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Riesgo Odontológico</dt>
              <dd className="text-sm text-gray-900">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskLevelColor(patient.puntuacionRiesgo)}`}>
                  {getRiskLevelText(patient.puntuacionRiesgo)} ({patient.puntuacionRiesgo}/10)
                </span>
              </dd>
            </div>
          </dl>
        </Card>
      </div>

      {/* Estadísticas del paciente */}
      <Card title="Estadísticas">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">
              {patient.totalCitas || 0}
            </div>
            <div className="text-sm text-blue-600">Total Citas</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">
              {patient.citasCompletadas || 0}
            </div>
            <div className="text-sm text-green-600">Completadas</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-600">
              S/ {patient.totalGastado || 0}
            </div>
            <div className="text-sm text-orange-600">Total Gastado</div>
          </div>
          <div className={`p-4 rounded-lg text-center ${
            patient.saldoPendiente > 0 ? 'bg-red-50' : 'bg-green-50'
          }`}>
            <div className={`text-2xl font-bold ${
              patient.saldoPendiente > 0 ? 'text-red-600' : 'text-green-600'
            }`}>
              S/ {patient.saldoPendiente || 0}
            </div>
            <div className={`text-sm ${
              patient.saldoPendiente > 0 ? 'text-red-600' : 'text-green-600'
            }`}>
              Saldo Pendiente
            </div>
          </div>
        </div>
      </Card>

      {/* Próxima cita */}
      {hasUpcomingAppointment && (
        <Card title="Próxima Cita" className="border-green-200 bg-green-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-green-600 mr-3" />
              <div>
                <div className="font-medium text-green-900">
                  {formatDate(patient.proximaCita)}
                </div>
                <div className="text-sm text-green-700">
                  Cita programada
                </div>
              </div>
            </div>
            <LoadingButton
              size="sm"
              variant="outline"
              onClick={() => {/* Implementar ver detalles de cita */}}
            >
              Ver Detalles
            </LoadingButton>
          </div>
        </Card>
      )}

      {/* Información del seguro */}
      {patient.informacionSeguro?.tieneSeguro && (
        <Card title="Información del Seguro">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">Compañía</dt>
              <dd className="text-sm text-gray-900">{patient.informacionSeguro.compañia}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Número de Póliza</dt>
              <dd className="text-sm text-gray-900 font-mono">{patient.informacionSeguro.numeroPoliza}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Cobertura Dental</dt>
              <dd className="text-sm text-gray-900">{patient.informacionSeguro.coberturaDental}%</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Copago</dt>
              <dd className="text-sm text-gray-900">S/ {patient.informacionSeguro.copago}</dd>
            </div>
            </dl>
          </div>
        </Card>
      )}

      {/* Contactos de emergencia */}
      {patient.contactosEmergencia?.length > 0 && (
        <Card title="Contactos de Emergencia">
          <div className="space-y-3">
            {patient.contactosEmergencia.map((contacto, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">
                    {contacto.nombres} {contacto.apellidos}
                    {contacto.esPrincipal && (
                      <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        Principal
                      </span>
                    )}
                  </h4>
                  <p className="text-sm text-gray-600">{contacto.relacion}</p>
                  <p className="text-sm text-gray-600">{contacto.telefono}</p>
                  {contacto.email && (
                    <p className="text-sm text-gray-600">{contacto.email}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <LoadingButton
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`tel:${contacto.telefono}`)}
                  >
                    <Phone className="w-4 h-4" />
                  </LoadingButton>
                  {contacto.email && (
                    <LoadingButton
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(`mailto:${contacto.email}`)}
                    >
                      <Mail className="w-4 h-4" />
                    </LoadingButton>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );

  if (!patient) {
    return <PageLoader message="Cargando expediente médico..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header del expediente */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <LoadingButton
            variant="outline"
            onClick={() => navigate('/patients')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </LoadingButton>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Expediente Médico
            </h1>
            <p className="text-gray-600 mt-1">
              {fullName} • DNI: {patient.dni}
            </p>
          </div>
        </div>

        <LoadingButton
          onClick={() => navigate(`/patients/${id}/edit`)}
        >
          <Edit className="w-4 h-4 mr-2" />
          Editar Paciente
        </LoadingButton>
      </div>

      {/* Información del paciente */}
      <Card>
        <div className="flex items-start space-x-6">
          {/* Foto del paciente */}
          <div className="flex-shrink-0">
            {patient.foto ? (
              <img
                src={patient.foto}
                alt={fullName}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>

          {/* Información básica */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">{fullName}</h2>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getPatientStatusColor(patient.activo, patient.verificado, patient.registroCompleto)}`}>
                {getPatientStatusText(patient.activo, patient.verificado, patient.registroCompleto)}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                {age} años • {patient.genero}
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                {patient.telefono}
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                {patient.email}
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                {patient.distrito}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Registro: {formatDate(patient.fechaRegistro)}
              </div>
              <div className="flex items-center">
                <Heart className="w-4 h-4 mr-2" />
                Riesgo: <span className={`ml-1 px-2 py-1 text-xs rounded-full ${getRiskLevelColor(patient.puntuacionRiesgo)}`}>
                  {getRiskLevelText(patient.puntuacionRiesgo)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Navegación por pestañas */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <TabIcon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Contenido de la pestaña activa */}
      <div className="min-h-96">
        {activeTab === 'summary' && renderSummary()}
        {activeTab === 'medical' && (
          <MedicalHistory 
            patientId={patient.id} 
            patient={patient}
            onUpdate={() => {/* Implementar actualización */}}
          />
        )}
        {activeTab === 'communication' && (
          <PatientCommunication 
            patientId={patient.id} 
            patient={patient}
            onUpdate={() => {/* Implementar actualización */}}
          />
        )}
        {activeTab === 'documents' && (
          <PatientDocuments 
            patientId={patient.id} 
            patient={patient}
            onUpdate={() => {/* Implementar actualización */}}
          />
        )}
        {activeTab === 'consents' && (
          <ConsentForms 
            patientId={patient.id} 
            patient={patient}
            onUpdate={() => {/* Implementar actualización */}}
          />
        )}
      </div>
    </div>
  );
};

export default PatientDetailPage;