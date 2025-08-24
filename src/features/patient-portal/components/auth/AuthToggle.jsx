import React from 'react';

const AuthToggle = ({ isLogin, onToggle }) => {
  return (
    <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
      <button
        onClick={() => onToggle(true)}
        className={`
          flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200
          ${isLogin
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
          }
        `}
      >
        Iniciar Sesión
      </button>
      <button
        onClick={() => onToggle(false)}
        className={`
          flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200
          ${!isLogin
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
          }
        `}
      >
        Registrarse
      </button>
    </div>
  );
};

export default AuthToggle;