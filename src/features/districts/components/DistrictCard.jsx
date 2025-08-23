import React from 'react';
import { MapPin, Building, Users, Calendar, MoreVertical, Edit, Trash2, Eye, Power } from 'lucide-react';
import Card from '../../../shared/components/ui/Card';
import Button from '../../../shared/components/ui/Button';
import LoadingButton from '../../../shared/components/ui/LoadingButton';
import { formatDate, formatNumber, getDistrictStatusColor, getDistrictStatusText } from '../utils/districtHelpers';

const DistrictCard = ({ 
  district, 
  onView, 
  onEdit, 
  onDelete, 
  onToggleStatus,
  showActions = true,
  className = '' 
}) => {
  const [showMenu, setShowMenu] = React.useState(false);
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
        onView?.(district);
        break;
      case 'edit':
        onEdit?.(district);
        break;
      case 'delete':
        onDelete?.(district);
        break;
      case 'toggle':
        onToggleStatus?.(district);
        break;
    }
  };

  return (
    <Card className={`hover:shadow-lg transition-all duration-200 cursor-pointer ${className}`}>
      <div className="space-y-4">
        {/* Header con estado y menú */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {district.nombre}
              </h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDistrictStatusColor(district.activo)}`}>
                {getDistrictStatusText(district.activo)}
              </span>
            </div>
            <p className="text-sm text-gray-600 font-mono">
              {district.codigo}
            </p>
          </div>

          {showActions && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
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
                    {district.activo ? 'Desactivar' : 'Activar'}
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={(e) => handleAction('delete', e)}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                    disabled={district.cantidadConsultorios > 0}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Descripción */}
        <p className="text-sm text-gray-600 line-clamp-2">
          {district.descripcion}
        </p>

        {/* Ubicación */}
        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{district.region}, {district.provincia}</span>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Building className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {formatNumber(district.cantidadConsultorios)}
            </div>
            <div className="text-xs text-gray-500">Consultorios</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Users className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {formatNumber(district.cantidadDentistas)}
            </div>
            <div className="text-xs text-gray-500">Dentistas</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Calendar className="w-4 h-4 text-orange-600" />
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {formatNumber(district.cantidadCitas)}
            </div>
            <div className="text-xs text-gray-500">Citas</div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          <span>
            Población: {district.poblacion ? formatNumber(district.poblacion) : 'N/A'}
          </span>
          <span>
            Creado: {formatDate(district.fechaCreacion)}
          </span>
        </div>

        {/* Acciones rápidas */}
        {showActions && (
          <div className="flex gap-2 pt-2">
            <LoadingButton
              size="sm"
              variant="outline"
              onClick={(e) => handleAction('view', e)}
              className="flex-1"
            >
              Ver detalles
            </LoadingButton>
            <LoadingButton
              size="sm"
              onClick={(e) => handleAction('edit', e)}
              className="flex-1"
            >
              Editar
            </LoadingButton>
          </div>
        )}
      </div>
    </Card>
  );
};

export default DistrictCard;