import React from 'react';
import { 
  MapPin, 
  Building, 
  Users, 
  Calendar, 
  Clock,
  Phone,
  Mail,
  Globe,
  Star,
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Power,
  Shield,
  CheckCircle
} from 'lucide-react';
import Card from '../../../shared/components/ui/Card';
import LoadingButton from '../../../shared/components/ui/LoadingButton';
import { 
  formatNumber, 
  formatSchedule, 
  isClinicOpen,
  getClinicStatusColor, 
  getClinicStatusText,
  getClinicTypeColor,
  getClinicTypeText
} from '../utils/clinicHelpers';

const ClinicCard = ({ 
  clinic, 
  onView, 
  onEdit, 
  onDelete, 
  onToggleStatus,
  onCall,
  onEmail,
  onWebsite,
  showActions = true,
  showDistance = false,
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
        onView?.(clinic);
        break;
      case 'edit':
        onEdit?.(clinic);
        break;
      case 'delete':
        onDelete?.(clinic);
        break;
      case 'toggle':
        onToggleStatus?.(clinic);
        break;
      case 'call':
        onCall?.(clinic);
        break;
      case 'email':
        onEmail?.(clinic);
        break;
      case 'website':
        onWebsite?.(clinic);
        break;
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const isOpen = isClinicOpen(clinic.horarios);
  const todaySchedule = formatSchedule(clinic.horarios);

  return (
    <Card className={`hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden ${className}`}>
      <div className="relative">
        {/* Imagen principal */}
        <div className="relative h-48 bg-gray-200 overflow-hidden">
          {clinic.imagenPrincipal && !imageError ? (
            <img
              src={clinic.imagenPrincipal}
              alt={clinic.nombre}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
              <Building className="w-16 h-16 text-blue-400" />
            </div>
          )}
          
          {/* Overlay con badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getClinicTypeColor(clinic.tipoClinica)}`}>
              {getClinicTypeText(clinic.tipoClinica)}
            </span>
            {clinic.verificado && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 flex items-center">
                <Shield className="w-3 h-3 mr-1" />
                Verificado
              </span>
            )}
          </div>

          {/* Estado abierto/cerrado */}
          <div className="absolute top-3 right-3">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isOpen ? 'Abierto' : 'Cerrado'}
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
                <div className="absolute right-0 bottom-12 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                  <button
                    onClick={(e) => handleAction('view', e)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver detalles
                  </button>
                  <button
                    onClick={(e) => handleAction('edit', e)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </button>
                  <button
                    onClick={(e) => handleAction('toggle', e)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    <Power className="w-4 h-4 mr-2" />
                    {clinic.activo ? 'Desactivar' : 'Activar'}
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={(e) => handleAction('delete', e)}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                    disabled={clinic.cantidadDentistas > 0}
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
                {clinic.nombre}
              </h3>
              <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getClinicStatusColor(clinic.activo, clinic.verificado)}`}>
                {getClinicStatusText(clinic.activo, clinic.verificado)}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 font-mono">
              {clinic.codigo}
            </p>

            {/* Calificación */}
            {clinic.calificacionPromedio > 0 && (
              <div className="flex items-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(clinic.calificacionPromedio)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {clinic.calificacionPromedio.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {/* Descripción */}
          <p className="text-sm text-gray-600 line-clamp-2">
            {clinic.descripcion}
          </p>

          {/* Ubicación */}
          <div className="flex items-start text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div>{clinic.direccion}</div>
              <div className="font-medium">{clinic.distrito?.nombre}</div>
              {showDistance && clinic.distance && (
                <div className="text-blue-600 font-medium">
                  {clinic.distance < 1 
                    ? `${Math.round(clinic.distance * 1000)}m` 
                    : `${clinic.distance}km`}
                </div>
              )}
            </div>
          </div>

          {/* Horario de hoy */}
          <div className="flex items-center text-sm">
            <Clock className="w-4 h-4 mr-2 text-gray-400" />
            <span className={`${isOpen ? 'text-green-600' : 'text-red-600'} font-medium`}>
              {todaySchedule}
            </span>
          </div>

          {/* Servicios principales */}
          {clinic.servicios && clinic.servicios.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">Servicios:</div>
              <div className="flex flex-wrap gap-1">
                {clinic.servicios.slice(0, 3).map((servicio, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                  >
                    {servicio}
                  </span>
                ))}
                {clinic.servicios.length > 3 && (
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                    +{clinic.servicios.length - 3} más
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Estadísticas */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Users className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {formatNumber(clinic.cantidadDentistas || 0)}
              </div>
              <div className="text-xs text-gray-500">Dentistas</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {formatNumber(clinic.cantidadCitasHoy || 0)}
              </div>
              <div className="text-xs text-gray-500">Citas Hoy</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Building className="w-4 h-4 text-orange-600" />
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {formatNumber(clinic.capacidadConsultorios || 0)}
              </div>
              <div className="text-xs text-gray-500">Capacidad</div>
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
              Ver detalles
            </LoadingButton>
            
            {/* Botones de contacto */}
            <div className="flex gap-1">
              {clinic.telefono && (
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
              
              {clinic.email && (
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
              
              {clinic.sitioWeb && (
                <LoadingButton
                  size="sm"
                  variant="outline"
                  onClick={(e) => handleAction('website', e)}
                  className="px-2"
                  title="Sitio web"
                >
                  <Globe className="w-4 h-4" />
                </LoadingButton>
              )}
            </div>
          </div>

          {/* Turnos disponibles hoy */}
          {clinic.turnosDisponiblesHoy > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-sm text-green-800 font-medium">
                  {clinic.turnosDisponiblesHoy} turnos disponibles hoy
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ClinicCard;