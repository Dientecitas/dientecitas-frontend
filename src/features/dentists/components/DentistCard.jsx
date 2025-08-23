import React from 'react';
import { 
  User, 
  MapPin, 
  Building, 
  Calendar, 
  Clock,
  Phone,
  Mail,
  Star,
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Power,
  Shield,
  CheckCircle,
  UserCheck,
  Award
} from 'lucide-react';
import Card from '../../../shared/components/ui/Card';
import LoadingButton from '../../../shared/components/ui/LoadingButton';
import { 
  formatNumber, 
  formatExperience,
  formatSchedule, 
  isDentistAvailable,
  getDentistStatusColor, 
  getDentistStatusText,
  getAvailabilityStatusColor,
  getAvailabilityStatusText,
  getMainSpecialty,
  formatRating,
  formatFullName
} from '../utils/dentistHelpers';

const DentistCard = ({ 
  dentist, 
  onView, 
  onEdit, 
  onDelete, 
  onToggleStatus,
  onApprove,
  onCall,
  onEmail,
  showActions = true,
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
        onView?.(dentist);
        break;
      case 'edit':
        onEdit?.(dentist);
        break;
      case 'delete':
        onDelete?.(dentist);
        break;
      case 'toggle':
        onToggleStatus?.(dentist);
        break;
      case 'approve':
        onApprove?.(dentist);
        break;
      case 'call':
        if (dentist.celular) {
          window.open(`tel:${dentist.celular}`);
        }
        break;
      case 'email':
        onEmail?.(dentist);
        break;
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const isAvailable = isDentistAvailable(dentist.horariosDisponibilidad, dentist.estadoDisponibilidad);
  const todaySchedule = formatSchedule(dentist.horariosDisponibilidad);
  const mainSpecialty = getMainSpecialty(dentist.especialidades);
  const fullName = formatFullName(dentist.nombres, dentist.apellidos);

  return (
    <Card className={`hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden ${className}`}>
      <div className="relative">
        {/* Foto del dentista */}
        <div className="relative h-48 bg-gray-200">
          {dentist.foto && !imageError ? (
            <img
              src={dentist.foto}
              alt={fullName}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
              <User className="w-16 h-16 text-blue-400" />
            </div>
          )}
          
          {/* Overlay con badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {dentist.verificado && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 flex items-center">
                <Shield className="w-3 h-3 mr-1" />
                Verificado
              </span>
            )}
            {dentist.aprobado && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 flex items-center">
                <CheckCircle className="w-3 h-3 mr-1" />
                Aprobado
              </span>
            )}
          </div>

          {/* Estado de disponibilidad */}
          <div className="absolute top-3 right-3">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAvailabilityStatusColor(dentist.estadoDisponibilidad)}`}>
              {getAvailabilityStatusText(dentist.estadoDisponibilidad)}
            </span>
          </div>

          {/* Menú de acciones */}
          {showActions && (
            <div className="absolute bottom-3 right-3" ref={menuRef}>
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
                    Ver perfil
                  </button>
                  <button
                    onClick={(e) => handleAction('edit', e)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </button>
                  {!dentist.aprobado && (
                    <button
                      onClick={(e) => handleAction('approve', e)}
                      className="w-full px-4 py-2 text-left text-sm text-green-700 hover:bg-green-50 flex items-center"
                    >
                      <UserCheck className="w-4 h-4 mr-2" />
                      Aprobar
                    </button>
                  )}
                  <button
                    onClick={(e) => handleAction('toggle', e)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    <Power className="w-4 h-4 mr-2" />
                    {dentist.activo ? 'Desactivar' : 'Activar'}
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={(e) => handleAction('delete', e)}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                    disabled={dentist.citasPendientes > 0}
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
        <div className="p-4 space-y-4">
          {/* Header con nombre y estado */}
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
                Dr. {fullName}
              </h3>
              <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getDentistStatusColor(dentist.activo, dentist.verificado, dentist.aprobado)}`}>
                {getDentistStatusText(dentist.activo, dentist.verificado, dentist.aprobado)}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 font-mono">
              {dentist.numeroColegiatura}
            </p>

            {/* Especialidad principal */}
            <div className="flex items-center">
              <Award className="w-4 h-4 text-purple-600 mr-1" />
              <span className="text-sm font-medium text-purple-700">
                {mainSpecialty}
              </span>
            </div>

            {/* Calificación */}
            {dentist.calificacionPromedio > 0 && (
              <div className="flex items-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(dentist.calificacionPromedio)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {formatRating(dentist.calificacionPromedio, dentist.totalReviews)}
                </span>
              </div>
            )}
          </div>

          {/* Experiencia */}
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            <span>{formatExperience(dentist.añosExperiencia)}</span>
          </div>

          {/* Consultorio */}
          <div className="flex items-center text-sm text-gray-500">
            <Building className="w-4 h-4 mr-2" />
            <span>{dentist.consultorio?.nombre || 'Consultorio no asignado'}</span>
          </div>

          {/* Horario de hoy */}
          <div className="flex items-center text-sm">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            <span className={`${isAvailable ? 'text-green-600' : 'text-red-600'} font-medium`}>
              {todaySchedule}
            </span>
          </div>

          {/* Servicios principales */}
          {dentist.serviciosOfrecidos && dentist.serviciosOfrecidos.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">Servicios:</div>
              <div className="flex flex-wrap gap-1">
                {dentist.serviciosOfrecidos.slice(0, 3).map((servicio, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                  >
                    {servicio}
                  </span>
                ))}
                {dentist.serviciosOfrecidos.length > 3 && (
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                    +{dentist.serviciosOfrecidos.length - 3} más
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Estadísticas */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <User className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {formatNumber(dentist.totalPacientes || 0)}
              </div>
              <div className="text-xs text-gray-500">Pacientes</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {formatNumber(dentist.citasCompletadasMes || 0)}
              </div>
              <div className="text-xs text-gray-500">Citas/Mes</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Clock className="w-4 h-4 text-orange-600" />
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {formatNumber(dentist.turnosDisponiblesHoy || 0)}
              </div>
              <div className="text-xs text-gray-500">Turnos Hoy</div>
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className="flex gap-2 pt-4 border-t border-gray-100">
            <LoadingButton
              size="sm"
              variant="outline"
              onClick={(e) => handleAction('view', e)}
              className="flex-1"
            >
              Ver perfil
            </LoadingButton>
            
            {/* Botones de contacto */}
            <div className="flex gap-1">
              {dentist.celular && (
                <LoadingButton
                  size="sm"
                  variant="outline"
                  onClick={(e) => handleAction('call', e)}
                  className="px-2"
                  title="Llamar"
                >
                  <Phone className="w-4 h-4" />
                </LoadingButton>
              )}
              
              {dentist.email && (
                <LoadingButton
                  size="sm"
                  variant="outline"
                  onClick={(e) => handleAction('email', e)}
                  className="px-2"
                  title="Email"
                >
                  <Mail className="w-4 h-4" />
                </LoadingButton>
              )}
            </div>
          </div>

          {/* Turnos disponibles hoy */}
          {dentist.turnosDisponiblesHoy > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-sm text-green-800 font-medium">
                  {dentist.turnosDisponiblesHoy} turnos disponibles hoy
                </span>
              </div>
            </div>
          )}

          {/* Pendiente de aprobación */}
          {!dentist.aprobado && dentist.verificado && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center">
                <UserCheck className="w-4 h-4 text-yellow-600 mr-2" />
                <span className="text-sm text-yellow-800 font-medium">
                  Pendiente de aprobación
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default DentistCard;