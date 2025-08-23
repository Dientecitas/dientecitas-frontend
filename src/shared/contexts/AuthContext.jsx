import React, { createContext, useContext, useReducer, useEffect } from 'react';
import Cookies from 'js-cookie';
import { mockUsers, AUTH_CONFIG } from '../utils/constants';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        error: null,
        isLoading: false
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false
      };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isKeycloakEnabled: AUTH_CONFIG.KEYCLOAK_ENABLED
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Verificar si hay una sesión activa
    const token = Cookies.get('token');
    const userData = Cookies.get('user');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } catch (error) {
        Cookies.remove('token');
        Cookies.remove('user');
      }
    }
  }, []);

  const login = async (credentials) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Simulación de login (reemplazar con API real)
      const user = mockUsers.find(
        u => u.email === credentials.email && u.password === credentials.password
      );

      if (!user) {
        throw new Error('Credenciales inválidas');
      }

      // Generar token simulado
      const token = btoa(JSON.stringify({ userId: user.id, exp: Date.now() + 86400000 }));
      
      // Guardar en cookies
      Cookies.set('token', token, { expires: 1 });
      Cookies.set('user', JSON.stringify(user), { expires: 1 });

      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const register = async (userData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Verificar si el email ya existe
      const existingUser = mockUsers.find(u => u.email === userData.email);
      if (existingUser) {
        throw new Error('El email ya está registrado');
      }

      // Crear nuevo usuario (simulado)
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        roles: ['paciente'],
        permissions: ['book_appointments', 'view_own_appointments']
      };

      // En una app real, esto sería una llamada a la API
      mockUsers.push(newUser);

      dispatch({ type: 'LOGIN_SUCCESS', payload: newUser });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    dispatch({ type: 'LOGOUT' });
  };

  const changePassword = async (passwords) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Simulación de cambio de contraseña
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // En una app real, aquí iría la lógica de cambio de contraseña
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    changePassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};