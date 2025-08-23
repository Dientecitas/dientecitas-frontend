import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { getDefaultSchedule } from '../utils/dentistHelpers';

// Schema de validación completo
const dentistSchema = yup.object().shape({
  nombres: yup
    .string()
    .required('Los nombres son requeridos')
    .min(2, 'Mínimo 2 caracteres')
    .max(50, 'Máximo 50 caracteres')
    .trim(),
  
  apellidos: yup
    .string()
    .required('Los apellidos son requeridos')
    .min(2, 'Mínimo 2 caracteres')
    .max(50, 'Máximo 50 caracteres')
    .trim(),
  
  dni: yup
    .string()
    .required('El DNI es requerido')
    .matches(/^\d{8}$/, 'El DNI debe tener 8 dígitos')
    .trim(),
  
  email: yup
    .string()
    .required('El email es requerido')
    .email('Email inválido'),
  
  celular: yup
    .string()
    .required('El celular es requerido')
    .matches(/^\d{9,11}$/, 'Debe tener entre 9 y 11 dígitos'),
  
  numeroColegiatura: yup
    .string()
    .required('El número de colegiatura es requerido')
    .matches(/^COP-\d{5}$/, 'Formato: COP-12345'),
  
  consultorioId: yup
    .string()
    .required('El consultorio es requerido'),
  
  añosExperiencia: yup
    .number()
    .required('Los años de experiencia son requeridos')
    .min(0, 'Mínimo 0 años')
    .max(50, 'Máximo 50 años'),
  
  especialidades: yup
    .array()
    .min(1, 'Debe seleccionar al menos una especialidad'),
  
  duracionConsultaDefault: yup
    .number()
    .required('La duración de consulta es requerida')
    .min(15, 'Mínimo 15 minutos')
    .max(180, 'Máximo 180 minutos'),
  
  pacientesPorDia: yup
    .number()
    .required('Los pacientes por día son requeridos')
    .min(1, 'Mínimo 1 paciente')
    .max(50, 'Máximo 50 pacientes'),
  
  turnosDisponibles: yup
    .array()
    .of(
      yup.object().shape({
        fecha: yup.date().required('La fecha es requerida'),
        horaInicio: yup.string().required('La hora de inicio es requerida'),
        horaFin: yup.string().required('La hora de fin es requerida')
      })
    )
    .min(1, 'Debe agregar al menos un turno disponible')
});

export const useDentistForm = (initialData = null, onSubmit = null) => {
  const defaultValues = {
    nombres: '',
    apellidos: '',
    dni: '',
    fechaNacimiento: '',
    genero: 'masculino',
    celular: '',
    email: '',
    direccion: '',
    numeroColegiatura: '',
    especialidades: [],
    consultorioId: '',
    añosExperiencia: 0,
    duracionConsultaDefault: 30,
    pacientesPorDia: 10,
    biografia: '',
    serviciosOfrecidos: [],
    activo: true,
    verificado: false,
    aprobado: false,
    turnosDisponibles: [],
    ...initialData
  };

  const form = useForm({
    resolver: yupResolver(dentistSchema),
    defaultValues,
    mode: 'onChange'
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty, isSubmitting },
    watch,
    setValue,
    reset,
    clearErrors,
    setError,
    getValues,
    trigger
  } = form;

  // Estado para multi-step
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    { 
      id: 'personal', 
      title: 'Información Personal', 
      fields: ['nombres', 'apellidos', 'dni', 'fechaNacimiento', 'genero', 'celular', 'email', 'direccion'] 
    },
    { 
      id: 'professional', 
      title: 'Información Profesional', 
      fields: ['numeroColegiatura', 'añosExperiencia', 'consultorioId', 'especialidades', 'biografia'] 
    },
    { 
      id: 'services', 
      title: 'Servicios y Configuración', 
      fields: ['duracionConsultaDefault', 'pacientesPorDia', 'serviciosOfrecidos'] 
    },
    { 
      id: 'turnos', 
      title: 'Turnos Disponibles', 
      fields: ['turnosDisponibles'] 
    },
    { 
      id: 'status', 
      title: 'Estado y Permisos', 
      fields: ['activo', 'verificado', 'aprobado'] 
    }
  ];

  // Validar paso actual
  const validateCurrentStep = async () => {
    const currentStepFields = steps[currentStep].fields;
    const values = getValues();
    
    // Validar cada campo del paso actual
    for (const field of currentStepFields) {
      const isValid = await trigger(field);
      if (!isValid) {
        return false;
      }
    }
    
    // Validaciones específicas por paso
    if (currentStep === 1) { // Información Profesional
      if (!values.especialidades || values.especialidades.length === 0) {
        return false;
      }
    }
    
    if (currentStep === 3) { // Turnos Disponibles
      if (!values.turnosDisponibles || values.turnosDisponibles.length === 0) {
        return false;
      }
    }
    
    return true;
  };

  // Navegación entre pasos
  const nextStep = async () => {
    const isStepValid = await validateCurrentStep();
    if (isStepValid && currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const goToStep = async (stepIndex) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      // Si vamos hacia adelante, validar pasos intermedios
      if (stepIndex > currentStep) {
        for (let i = currentStep; i < stepIndex; i++) {
          setCurrentStep(i);
          const isValid = await validateCurrentStep();
          if (!isValid) {
            return false;
          }
        }
      }
      setCurrentStep(stepIndex);
      return true;
    }
    return false;
  };

  // Manejar envío del formulario
  const onFormSubmit = async (data) => {
    if (onSubmit) {
      try {
        const result = await onSubmit(data);
        return result;
      } catch (error) {
        if (error.message.includes('DNI')) {
          setError('dni', { message: error.message });
        } else if (error.message.includes('colegiatura')) {
          setError('numeroColegiatura', { message: error.message });
        } else if (error.message.includes('email')) {
          setError('email', { message: error.message });
        } else {
          setError('root', { message: error.message });
        }
        throw error;
      }
    }
  };

  // Resetear formulario
  const resetForm = (newData = null) => {
    const resetData = newData || defaultValues;
    reset(resetData);
    setCurrentStep(0);
  };

  return {
    // Métodos del formulario
    register,
    handleSubmit: handleSubmit(onFormSubmit),
    watch,
    setValue,
    reset: resetForm,
    clearErrors,
    setError,
    getValues,
    trigger,
    
    // Estados
    errors,
    isValid,
    isDirty,
    isSubmitting,
    
    // Multi-step
    currentStep,
    steps,
    nextStep,
    prevStep,
    goToStep,
    validateCurrentStep,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === steps.length - 1,
    
    // Utilidades
    isEditMode: !!initialData
  };
};

export default useDentistForm;