import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CLINIC_VALIDATION } from '../types/clinic.types';
import { generateClinicCode, getDefaultSchedule } from '../utils/clinicHelpers';

// Schema de validación simplificado
const clinicSchema = yup.object().shape({
  nombre: yup
    .string()
    .required('El nombre es requerido')
    .min(CLINIC_VALIDATION.NOMBRE_MIN_LENGTH, `Mínimo ${CLINIC_VALIDATION.NOMBRE_MIN_LENGTH} caracteres`)
    .max(CLINIC_VALIDATION.NOMBRE_MAX_LENGTH, `Máximo ${CLINIC_VALIDATION.NOMBRE_MAX_LENGTH} caracteres`)
    .trim(),
  
  descripcion: yup
    .string()
    .required('La descripción es requerida')
    .min(CLINIC_VALIDATION.DESCRIPCION_MIN_LENGTH, `Mínimo ${CLINIC_VALIDATION.DESCRIPCION_MIN_LENGTH} caracteres`)
    .max(CLINIC_VALIDATION.DESCRIPCION_MAX_LENGTH, `Máximo ${CLINIC_VALIDATION.DESCRIPCION_MAX_LENGTH} caracteres`)
    .trim(),
  
  codigo: yup
    .string()
    .required('El código es requerido')
    .matches(CLINIC_VALIDATION.CODIGO_PATTERN, 'El código debe tener el formato XX-XXX-000')
    .trim()
    .uppercase(),
  
  distritoId: yup
    .string()
    .required('El distrito es requerido'),
  
  direccion: yup
    .string()
    .required('La dirección es requerida')
    .min(10, 'Mínimo 10 caracteres')
    .max(200, 'Máximo 200 caracteres')
    .trim(),
  
  telefono: yup
    .string()
    .required('El teléfono es requerido')
    .matches(CLINIC_VALIDATION.TELEFONO_PATTERN, 'Formato: +51-1-1234567'),
  
  email: yup
    .string()
    .email('Email inválido')
    .max(100, 'Máximo 100 caracteres'),
  
  capacidadConsultorios: yup
    .number()
    .required('La capacidad es requerida')
    .min(CLINIC_VALIDATION.CAPACIDAD_MIN, `Mínimo ${CLINIC_VALIDATION.CAPACIDAD_MIN} consultorio`)
    .max(CLINIC_VALIDATION.CAPACIDAD_MAX, `Máximo ${CLINIC_VALIDATION.CAPACIDAD_MAX} consultorios`)
    .integer('Debe ser un número entero'),
  
  tipoClinica: yup
    .string()
    .required('El tipo de clínica es requerido')
    .oneOf(['publica', 'privada', 'mixta'], 'Tipo de clínica inválido'),
  
  servicios: yup
    .array()
    .of(yup.string())
    .min(1, 'Debe seleccionar al menos un servicio'),
  
  especialidades: yup
    .array()
    .of(yup.string())
    .min(1, 'Debe seleccionar al menos una especialidad'),
  
  metodosLimpieza: yup
    .array()
    .of(yup.string())
    .min(1, 'Debe seleccionar al menos un método de limpieza'),
  
  activo: yup.boolean().required(),
  verificado: yup.boolean().required()
});

export const useClinicForm = (initialData = null, onSubmit = null) => {
  const defaultValues = {
    nombre: '',
    descripcion: '',
    codigo: '',
    distritoId: '',
    direccion: '',
    referenciaDireccion: '',
    telefono: '',
    email: '',
    sitioWeb: '',
    capacidadConsultorios: 1,
    tipoClinica: 'privada',
    servicios: [],
    especialidades: [],
    equipamiento: [],
    certificaciones: [],
    metodosLimpieza: [],
    activo: true,
    verificado: false,
    ...initialData
  };

  const form = useForm({
    resolver: yupResolver(clinicSchema),
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
    getValues
  } = form;

  // Estado para el multi-step (sin useEffect problemáticos)
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    { id: 'basic', title: 'Información Básica', fields: ['nombre', 'descripcion', 'codigo', 'distritoId', 'tipoClinica', 'capacidadConsultorios'] },
    { id: 'contact', title: 'Contacto y Ubicación', fields: ['direccion', 'referenciaDireccion', 'telefono', 'email', 'sitioWeb'] },
    { id: 'services', title: 'Servicios y Especialidades', fields: ['servicios', 'especialidades'] },
    { id: 'advanced', title: 'Configuración Avanzada', fields: ['equipamiento', 'certificaciones', 'metodosLimpieza', 'activo', 'verificado'] }
  ];

  // Validar paso actual
  const validateCurrentStep = () => {
    const currentStepFields = steps[currentStep].fields;
    const values = getValues();
    
    for (const field of currentStepFields) {
      if (field === 'servicios' || field === 'especialidades' || field === 'metodosLimpieza') {
        if (!values[field] || values[field].length === 0) {
          return false;
        }
      } else if (field === 'activo' || field === 'verificado') {
        // Campos booleanos siempre son válidos
        continue;
      } else if (!values[field]) {
        return false;
      }
    }
    return true;
  };

  // Navegación entre pasos
  const nextStep = () => {
    if (currentStep < steps.length - 1 && validateCurrentStep()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const goToStep = (stepIndex) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStep(stepIndex);
    }
  };
  // Generar código manualmente
  const generateCode = () => {
    const values = getValues();
    const { nombre, distritoId, tipoClinica } = values;
    
    if (nombre && distritoId && tipoClinica) {
      const distritoNames = {
        '1': 'Miraflores',
        '2': 'San Isidro', 
        '3': 'Surco',
        '4': 'San Borja',
        '5': 'Callao',
        '6': 'La Molina',
        '7': 'Los Olivos'
      };
      
      const distritoName = distritoNames[distritoId] || 'XX';
      const code = generateClinicCode(nombre, distritoName, tipoClinica);
      setValue('codigo', code);
      clearErrors('codigo');
    }
  };

  // Manejar envío del formulario
  const onFormSubmit = async (data) => {
    if (onSubmit) {
      try {
        await onSubmit(data);
      } catch (error) {
        if (error.message.includes('código')) {
          setError('codigo', { message: error.message });
        } else if (error.message.includes('nombre')) {
          setError('nombre', { message: error.message });
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
    register,
    handleSubmit: handleSubmit(onFormSubmit),
    watch,
    setValue,
    reset: resetForm,
    clearErrors,
    setError,
    getValues,
    errors,
    isValid,
    isDirty,
    isSubmitting,
    generateCode,
    isEditMode: !!initialData,
    // Multi-step
    currentStep,
    steps,
    nextStep,
    prevStep,
    goToStep,
    validateCurrentStep,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === steps.length - 1
  };
};