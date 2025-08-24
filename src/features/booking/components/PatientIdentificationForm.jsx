import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Search, UserPlus, Loader2 } from 'lucide-react';
import { patientIdentificationSchema, patientRegistrationSchema } from '../utils/bookingValidations';
import { bookingApi } from '../services/bookingApi';
import { useBooking } from '../store/bookingContext';
import Input from '../../../shared/components/ui/Input';
import LoadingButton from '../../../shared/components/ui/LoadingButton';
import Card from '../../../shared/components/ui/Card';

const PatientIdentificationForm = () => {
  const { setPatient, setLoading, setError, clearError } = useBooking();
  const [searchMode, setSearchMode] = useState(true);
  const [patientFound, setPatientFound] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // Form para búsqueda por DNI
  const searchForm = useForm({
    resolver: yupResolver(patientIdentificationSchema),
    defaultValues: { dni: '' }
  });

  // Form para registro de nuevo paciente
  const registerForm = useForm({
    resolver: yupResolver(patientRegistrationSchema),
    defaultValues: {
      dni: '',
      nombres: '',
      apellidos: '',
      telefono: '',
      email: '',
      fechaNacimiento: ''
    }
  });

  const handleSearch = async (data) => {
    setIsSearching(true);
    clearError('search');
    
    try {
      const response = await bookingApi.searchPatientByDNI(data.dni);
      
      if (response.success && response.data) {
        setPatientFound(response.data);
        setPatient(response.data);
      } else {
        // Paciente no encontrado, mostrar formulario de registro
        setPatientFound(null);
        setSearchMode(false);
        registerForm.setValue('dni', data.dni);
      }
    } catch (error) {
      setError('search', 'Error al buscar paciente. Intente nuevamente.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleRegister = async (data) => {
    setIsRegistering(true);
    clearError('register');
    
    try {
      const response = await bookingApi.createPatient(data);
      
      if (response.success) {
        setPatient(response.data);
        setPatientFound(response.data);
      } else {
        setError('register', 'Error al registrar paciente. Intente nuevamente.');
      }
    } catch (error) {
      setError('register', 'Error al registrar paciente. Intente nuevamente.');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleNewSearch = () => {
    setSearchMode(true);
    setPatientFound(null);
    searchForm.reset();
    registerForm.reset();
    clearError('search');
    clearError('register');
  };

  if (patientFound) {
    return (
      <Card title="Paciente Identificado" className="max-w-2xl mx-auto">
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-800 font-medium">Paciente encontrado</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Nombres y Apellidos</label>
                <p className="text-gray-900">{patientFound.nombres} {patientFound.apellidos}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">DNI</label>
                <p className="text-gray-900">{patientFound.dni}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Teléfono</label>
                <p className="text-gray-900">{patientFound.telefono}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <p className="text-gray-900">{patientFound.email}</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <LoadingButton
              variant="outline"
              onClick={handleNewSearch}
            >
              Buscar Otro Paciente
            </LoadingButton>
          </div>
        </div>
      </Card>
    );
  }

  if (searchMode) {
    return (
      <Card title="Identificación del Paciente" className="max-w-2xl mx-auto">
        <form onSubmit={searchForm.handleSubmit(handleSearch)} className="space-y-6">
          <div className="text-center mb-6">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-gray-600">
              Ingresa tu DNI para buscar tus datos o registrarte como nuevo paciente
            </p>
          </div>

          <Input
            label="Número de DNI"
            name="dni"
            register={searchForm.register}
            error={searchForm.formState.errors.dni?.message}
            placeholder="12345678"
            maxLength={8}
          />

          <LoadingButton
            type="submit"
            variant="primary"
            loading={isSearching}
            loadingText="Buscando..."
            className="w-full"
            icon={<Search className="w-4 h-4" />}
          >
            Buscar Paciente
          </LoadingButton>
        </form>
      </Card>
    );
  }

  return (
    <Card title="Registro de Nuevo Paciente" className="max-w-2xl mx-auto">
      <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-6">
        <div className="text-center mb-6">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-gray-600">
            No encontramos tu DNI en nuestros registros. Completa tus datos para continuar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="DNI"
            name="dni"
            register={registerForm.register}
            error={registerForm.formState.errors.dni?.message}
            disabled
          />

          <Input
            label="Fecha de Nacimiento"
            name="fechaNacimiento"
            type="date"
            register={registerForm.register}
            error={registerForm.formState.errors.fechaNacimiento?.message}
          />

          <Input
            label="Nombres"
            name="nombres"
            register={registerForm.register}
            error={registerForm.formState.errors.nombres?.message}
            placeholder="Juan Carlos"
          />

          <Input
            label="Apellidos"
            name="apellidos"
            register={registerForm.register}
            error={registerForm.formState.errors.apellidos?.message}
            placeholder="Pérez López"
          />

          <Input
            label="Teléfono"
            name="telefono"
            register={registerForm.register}
            error={registerForm.formState.errors.telefono?.message}
            placeholder="987654321"
          />

          <Input
            label="Email"
            name="email"
            type="email"
            register={registerForm.register}
            error={registerForm.formState.errors.email?.message}
            placeholder="juan@email.com"
          />
        </div>

        <div className="flex justify-between space-x-4">
          <LoadingButton
            type="button"
            variant="outline"
            onClick={handleNewSearch}
          >
            Buscar Otro Paciente
          </LoadingButton>

          <LoadingButton
            type="submit"
            variant="primary"
            loading={isRegistering}
            loadingText="Registrando..."
            icon={<UserPlus className="w-4 h-4" />}
          >
            Registrar Paciente
          </LoadingButton>
        </div>
      </form>
    </Card>
  );
};

export default PatientIdentificationForm;