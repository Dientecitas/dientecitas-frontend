import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  Calendar, 
  Users, 
  MapPin, 
  Building, 
  UserCheck,
  Clock,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getNavigationItems = (userRole) => {
    const commonItems = [
      { name: 'Dashboard', href: '/dashboard', icon: Home }
    ];

    if (userRole === 'admin') {
      return [
        ...commonItems,
        { name: 'Distritos', href: '/districts', icon: MapPin },
        { name: 'Consultorios', href: '/clinics', icon: Building },
        { name: 'Dentistas', href: '/dentists', icon: UserCheck },
        { name: 'Pacientes', href: '/patients', icon: Users },
        { name: 'Turnos', href: '/schedule', icon: Clock },
        { name: 'Citas', href: '/appointments', icon: Calendar },
        { name: 'Pagos', href: '/payments', icon: CreditCard }
      ];
    }

    if (userRole === 'dentista') {
      return [
        ...commonItems,
        { name: 'Mi Agenda', href: '/schedule', icon: Calendar },
        { name: 'Mis Pacientes', href: '/patients', icon: Users },
        { name: 'Turnos', href: '/time-slots', icon: Clock }
      ];
    }

    if (userRole === 'paciente') {
      return [
        ...commonItems,
        { name: 'Reservar Cita', href: '/reservar/cita', icon: Calendar }
      ];
    }

    return commonItems;
  };

  const navigationItems = getNavigationItems(user?.roles?.[0]);

  return (
    <div className={`bg-white shadow-lg transition-all duration-300 flex flex-col h-full ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">Dientecitas</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      <nav className="mt-6 px-3">
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
              {!isCollapsed && item.name}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="mt-auto p-3 border-t border-gray-200">
        {!isCollapsed && (
          <div className="px-3 py-2 mb-2">
            <p className="text-sm font-medium text-gray-900">{user?.nombre} {user?.apellido}</p>
            <p className="text-xs text-gray-600">{user?.email}</p>
          </div>
        )}
        
        <button
          onClick={logout}
          className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100"
        >
          <LogOut className="w-5 h-5 mr-3 flex-shrink-0" />
          {!isCollapsed && 'Cerrar Sesión'}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;