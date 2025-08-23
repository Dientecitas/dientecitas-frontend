import React from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Clock,
  AlertTriangle,
  Shield,
  Heart,
  Activity,
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Power,
  MessageCircle,
  FileText
} from 'lucide-react';
import Card from '../../../shared/components/ui/Card';
import LoadingButton from '../../../shared/components/ui/LoadingButton';
import { 
  formatDate,
  formatFullName,
  calculateAge,
  getRiskLevelColor,
  getRiskLevelText,
  getPatientStatusColor,
  getPatientStatusText,
  formatInsuranceInfo
} from '../utils/patientHelpers';

const PatientCard = ({ 
  patient, 
  onView, 
  onEdit, 
  onDelete, 
  onToggleStatus,
  onCall,
  onEmail,
  onMessage,
  showActions = true,
  showMedicalInfo = true,
  className = '' 
}) => {
  const [showMenu, setShowMenu] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);
  const menuRef = React.useRef(null);

  // Cerrar menú al hacer click fuera
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAction = (action, event) => {
    event.stopPropagation();
    setShowMenu(false);
    
    switch (action) {
      case 'view':
        onView?.(patient);
        break;
      case 'edit':
        onEdit?.(patient);
        break;
      case 'delete':
        onDelete?.(patient);
        break;
      case 'toggle':
        onToggleStatus?.(patient);
        break;
      case 'call':
        onCall?.(patient);
        break;
      case 'email':
        onEmail?.(patient);
        break;
      case 'message':
        onMessage?.(patient);
        break;
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const fullName = formatFullName(patient.nombres, patient.apellidos);
  const age = calculateAge(patient.fechaNacimiento);
  const hasUpcomingAppointment = patient.proximaCita && new Date(patient.proximaCita) > new Date();
  const hasCriticalAllergies = patient.alergias?.some(a => a.severidad === 'severa');
  const hasMedicalConditions = patient.condicionesMedicas?.length > 0;

  return (
    <Card className={`hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden ${className}`}>
      <div className="relative">
        {/* Foto del paciente */}
        <div className="relative h-32 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
          {patient.foto && !imageError ? (
            <img
              src={patient.foto}
              alt={fullName}
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
              onError={handleImageError}
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg">
              <User className="w-10 h-10 text-blue-400" />
            </div>
          )}
          
          {/* Medical alerts overlay */}
          {showMedicalInfo && (hasCriticalAllergies || patient.puntuacionRiesgo >= 8) && (
            <div className="absolute top-2 left-2">
              <div className="flex items-center space-x-1">
                {hasCriticalAllergies && (
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center" title="Alergias severas">
                    <AlertTriangle className="w-4 h-4 text-white" />
                  </div>
                )}
                {patient.puntuacionRiesgo >= 8 && (
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center" title="Alto riesgo">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Estado del paciente */}
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPatientStatusColor(patient.activo, patient.verificado, patient.registroCompleto)}`}>
              {getPatientStatusText(patient.activo, patient.verificado, patient.registroCompleto)}
            </span>
          </div>

          {/* Menú de acciones */}
          {showActions && (
            <div className="absolute bottom-2 right-2" ref={menuRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="p-2 bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white rounded-full shadow-md transition-all"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMenu && (
                <div className="absolute right-0 bottom-12 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                  <button
                    onClick={(e) => handleAction('view', e)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver expediente
                  </button>
                  <button
                    onClick={(e) => handleAction('edit', e)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </button>
                  <button
                    onClick={(e) => handleAction('message', e)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Enviar mensaje
                  </button>
                  <button
                    onClick={(e) => handleAction('toggle', e)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    <Power className="w-4 h-4 mr-2" />
                    {patient.activo ? 'Desactivar' : 'Activar'}
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={(e) => handleAction('delete', e)}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                    disabled={hasUpcomingAppointment}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Contenido de la tarjeta */}
        <div className="p-4 space-y-3">
          {/* Header con nombre y edad */}
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
              {fullName}
            </h3>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>DNI: {patient.dni}</span>
              <span>{age} años</span>
            </div>
          </div>

          {/* Información de contacto */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center text-gray-600">
              <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">{patient.telefono}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">{patient.email}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">{patient.distrito}</span>
            </div>
          </div>

          {/* Información médica crítica */}
          {showMedicalInfo && (
            <div className="space-y-2">
              {/* Alergias críticas */}
              {hasCriticalAllergies && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                  <div className="flex items-center">
                    <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                    <span className="text-xs text-red-800 font-medium">
                      Alergias severas
                    </span>
                  </div>
                  <div className="text-xs text-red-700 mt-1">
                    {patient.alergias.filter(a => a.severidad === 'severa').map(a => a.alergia).join(', ')}
                  </div>
                </div>
              )}

              {/* Condiciones médicas */}
              {hasMedicalConditions && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-2">
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 text-orange-600 mr-2" />
                    <span className="text-xs text-orange-800 font-medium">
                      Condiciones médicas
                    </span>
                  </div>
                  <div className="text-xs text-orange-700 mt-1">
                    {patient.condicionesMedicas.slice(0, 2).map(c => c.condicion).join(', ')}
                    {patient.condicionesMedicas.length > 2 && ` +${patient.condicionesMedicas.length - 2} más`}
                  </div>
                </div>
              )}

              {/* Puntuación de riesgo */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Riesgo odontológico:</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskLevelColor(patient.puntuacionRiesgo)}`}>
                  {getRiskLevelText(patient.puntuacionRiesgo)} ({patient.puntuacionRiesgo}/10)
                </span>
              </div>
            </div>
          )}

          {/* Información del seguro */}
          {patient.informacionSeguro?.tieneSeguro && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
              <div className="flex items-center">
                <Shield className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-xs text-blue-800 font-medium">
                  {formatInsuranceInfo(patient.informacionSeguro)}
                </span>
              </div>
            </div>
          )}

          {/* Próxima cita */}
          {hasUpcomingAppointment && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-2">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-xs text-green-800 font-medium">
                  Próxima cita: {formatDate(patient.proximaCita)}
                </span>
              </div>
            </div>
          )}

          {/* Estadísticas del paciente */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {patient.totalCitas || 0}
              </div>
              <div className="text-xs text-gray-500">Citas</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {patient.ultimaCita ? formatDate(patient.ultimaCita) : 'N/A'}
              </div>
              <div className="text-xs text-gray-500">Última</div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-semibold ${patient.saldoPendiente > 0 ? 'text-red-600' : 'text-green-600'}`}>
                S/ {patient.saldoPendiente || 0}
              </div>
              <div className="text-xs text-gray-500">Saldo</div>
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className="flex gap-2 pt-3 border-t border-gray-100">
            <LoadingButton
              size="sm"
              variant="outline"
              onClick={(e) => handleAction('view', e)}
              className="flex-1"
            >
              Ver expediente
            </LoadingButton>
            
            {/* Botones de contacto */}
            <div className="flex gap-1">
              <LoadingButton
                size="sm"
                variant="outline"
                onClick={(e) => handleAction('call', e)}
                className="px-2"
                title="Llamar"
              >
                <Phone className="w-4 h-4" />
              </LoadingButton>
              
              <LoadingButton
                size="sm"
                variant="outline"
                onClick={(e) => handleAction('email', e)}
                className="px-2"
                title="Email"
              >
                <Mail className="w-4 h-4" />
              </LoadingButton>
              
              <LoadingButton
                size="sm"
                variant="outline"
                onClick={(e) => handleAction('message', e)}
                className="px-2"
                title="Mensaje"
              >
                <MessageCircle className="w-4 h-4" />
              </LoadingButton>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PatientCard;