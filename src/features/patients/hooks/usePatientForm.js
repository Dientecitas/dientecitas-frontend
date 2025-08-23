import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { PATIENT_VALIDATION } from '../types/patient.types';
import { calculateAge, validateDNI, formatPhone } from '../utils/patientHelpers';

// Schema de validación médica completa
const patientSchema = yup.object().shape({
  nombres: yup
    .string()
    .required('Los nombres son requeridos')
    .min(PATIENT_VALIDATION.NOMBRES_MIN_LENGTH, `Mínimo ${PATIENT_VALIDATION.NOMBRES_MIN_LENGTH} caracteres`)
    .max(PATIENT_VALIDATION.NOMBRES_MAX_LENGTH, `Máximo ${PATIENT_VALIDATION.NOMBRES_MAX_LENGTH} caracteres`)
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo letras y espacios')
    .trim(),
  
  apellidos: yup
    .string()
    .required('Los apellidos son requeridos')
    .min(PATIENT_VALIDATION.APELLIDOS_MIN_LENGTH, `Mínimo ${PATIENT_VALIDATION.APELLIDOS_MIN_LENGTH} caracteres`)
    .max(PATIENT_VALIDATION.APELLIDOS_MAX_LENGTH, `Máximo ${PATIENT_VALIDATION.APELLIDOS_MAX_LENGTH} caracteres`)
    .trim(),
  
  dni: yup
    .string()
    .required('El DNI es requerido')
    .matches(PATIENT_VALIDATION.DNI_PATTERN, 'El DNI debe tener 8 dígitos')
    .trim(),
  
  fechaNacimiento: yup
    .date()
    .required('La fecha de nacimiento es requerida')
    .max(new Date(), 'No puede ser fecha futura')
    .test('realistic-age', 'Edad no realista', (value) => {
      const age = calculateAge(value?.toISOString());
      return age >= 0 && age <= 120;
    }),
  
  genero: yup
    .string()
    .required('El género es requerido')
    .oneOf(['masculino', 'femenino', 'otro', 'prefiero_no_decir'], 'Género inválido'),
  
  telefono: yup
    .string()
    .required('El teléfono es requerido')
    .matches(PATIENT_VALIDATION.TELEFONO_PATTERN, 'Formato: +51-1-987654321'),
  
  email: yup
    .string()
    .required('El email es requerido')
    .email('Email inválido'),
  
  direccion: yup
    .string()
    .required('La dirección es requerida')
    .min(10, 'Mínimo 10 caracteres')
    .max(200, 'Máximo 200 caracteres'),
  
  contactosEmergencia: yup
    .array()
    .min(1, 'Al menos un contacto de emergencia es requerido')
    .max(PATIENT_VALIDATION.MAX_EMERGENCY_CONTACTS, `Máximo ${PATIENT_VALIDATION.MAX_EMERGENCY_CONTACTS} contactos`)
    .of(
      yup.object().shape({
        nombres: yup.string().required('Nombres requeridos'),
        telefono: yup.string()
          .required('Teléfono requerido')
          .matches(PATIENT_VALIDATION.TELEFONO_PATTERN, 'Formato inválido'),
        relacion: yup.string().required('Relación requerida')
      })
    ),
  
  peso: yup
    .number()
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value;
    })
    .min(PATIENT_VALIDATION.PESO_MIN, `Peso mínimo ${PATIENT_VALIDATION.PESO_MIN} kg`)
    .max(PATIENT_VALIDATION.PESO_MAX, `Peso máximo ${PATIENT_VALIDATION.PESO_MAX} kg`),
  
  altura: yup
    .number()
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value;
    })
    .min(PATIENT_VALIDATION.ALTURA_MIN, `Altura mínima ${PATIENT_VALIDATION.ALTURA_MIN} cm`)
    .max(PATIENT_VALIDATION.ALTURA_MAX, `Altura máxima ${PATIENT_VALIDATION.ALTURA_MAX} cm`),
  
  alergias: yup
    .array()
    .max(PATIENT_VALIDATION.MAX_ALLERGIES, `Máximo ${PATIENT_VALIDATION.MAX_ALLERGIES} alergias`)
    .of(
      yup.object().shape({
        alergia: yup.string().required('Nombre de alergia requerido'),
        severidad: yup.string()
          .required('Severidad requerida')
          .oneOf(['leve', 'moderada', 'severa'], 'Severidad inválida'),
        reaccion: yup.string().when('severidad', {
          is: 'severa',
          then: (schema) => schema.required('Descripción de reacción requerida para alergias severas')
        })
      })
    ),
  
  condicionesMedicas: yup
    .array()
    .max(PATIENT_VALIDATION.MAX_CONDITIONS, `Máximo ${PATIENT_VALIDATION.MAX_CONDITIONS} condiciones`)
    .of(
      yup.object().shape({
        condicion: yup.string().required('Nombre de condición requerido'),
        controlado: yup.boolean(),
        medicamentos: yup.string().when('controlado', {
          is: false,
          then: (schema) => schema.required('Especificar medicamentos para condición no controlada')
        })
      })
    ),
  
  medicamentosActuales: yup
    .array()
    .max(PATIENT_VALIDATION.MAX_MEDICATIONS, `Máximo ${PATIENT_VALIDATION.MAX_MEDICATIONS} medicamentos`)
    .of(
      yup.object().shape({
        medicamento: yup.string().required('Nombre medicamento requerido'),
        dosis: yup.string().required('Dosis requerida'),
        frecuencia: yup.string().required('Frecuencia requerida')
      })
    ),
  
  activo: yup.boolean().required(),
  verificado: yup.boolean().required()
});

export const usePatientForm = (initialData = null, onSubmit = null) => {
  const defaultValues = {
    nombres: '',
    apellidos: '',
    dni: '',
    fechaNacimiento: '',
    genero: 'masculino',
    estadoCivil: 'soltero',
    ocupacion: '',
    telefono: '',
    telefonoAlternativo: '',
    email: '',
    direccion: '',
    distrito: '',
    provincia: 'Lima',
    contactosEmergencia: [
      {
        id: Date.now().toString(),
        nombres: '',
        apellidos: '',
        relacion: '',
        telefono: '',
        email: '',
        esPrincipal: true
      }
    ],
    tipoSangre: '',
    peso: null,
    altura: null,
    alergias: [],
    condicionesMedicas: [],
    medicamentosActuales: [],
    habitos: {
      fumador: false,
      consumeAlcohol: false,
      frecuenciaAlcohol: 'nunca',
      rechinarDientes: false,
      morderUñas: false,
      cepilladoFrecuencia: '2_veces',
      usoHiloDental: false,
      enjuagueBucal: false,
      dietaAzucarada: 'media',
      masticaHielo: false,
      deporteContacto: false
    },
    informacionSeguro: {
      tieneSeguro: false,
      compañia: '',
      numeroPoliza: '',
      tipoCobertura: '',
      coberturaDental: null,
      copago: null,
      fechaVencimiento: ''
    },
    preferencias: {
      idioma: 'es',
      comunicacionPreferida: 'email',
      frecuenciaRecordatorios: '1_dia',
      horariosPreferidos: [],
      diasPreferidos: [],
      requiereTraductor: false,
      tipoConsulta: 'presencial'
    },
    activo: true,
    verificado: false,
    ...initialData
  };

  const form = useForm({
    resolver: yupResolver(patientSchema),
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

  // Estado para el multi-step
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    { 
      id: 'personal', 
      title: 'Información Personal', 
      fields: ['nombres', 'apellidos', 'dni', 'fechaNacimiento', 'genero', 'estadoCivil', 'ocupacion'] 
    },
    { 
      id: 'contact', 
      title: 'Contacto y Ubicación', 
      fields: ['telefono', 'telefonoAlternativo', 'email', 'direccion', 'distrito', 'provincia'] 
    },
    { 
      id: 'emergency', 
      title: 'Contactos de Emergencia', 
      fields: ['contactosEmergencia'] 
    },
    { 
      id: 'medical', 
      title: 'Información Médica', 
      fields: ['tipoSangre', 'peso', 'altura', 'alergias', 'condicionesMedicas', 'medicamentosActuales'] 
    },
    { 
      id: 'habits', 
      title: 'Hábitos y Estilo de Vida', 
      fields: ['habitos'] 
    },
    { 
      id: 'insurance', 
      title: 'Seguro y Preferencias', 
      fields: ['informacionSeguro', 'preferencias'] 
    },
    { 
      id: 'status', 
      title: 'Estado y Permisos', 
      fields: ['activo', 'verificado'] 
    }
  ];

  // Validar paso actual
  const validateCurrentStep = () => {
    const currentStepFields = steps[currentStep].fields;
    const values = getValues();
    
    for (const field of currentStepFields) {
      if (field === 'contactosEmergencia') {
        if (!values[field] || values[field].length === 0) {
          return false;
        }
        // Validar que al menos un contacto esté completo
        const validContacts = values[field].filter(contact => 
          contact.nombres && contact.telefono && contact.relacion
        );
        if (validContacts.length === 0) {
          return false;
        }
      } else if (field === 'alergias' || field === 'condicionesMedicas' || field === 'medicamentosActuales') {
        // Estos campos pueden estar vacíos
        continue;
      } else if (field === 'habitos' || field === 'informacionSeguro' || field === 'preferencias') {
        // Campos de objeto, validar estructura básica
        continue;
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

  // Manejar contactos de emergencia
  const addEmergencyContact = () => {
    const contacts = getValues('contactosEmergencia') || [];
    const newContact = {
      id: Date.now().toString(),
      nombres: '',
      apellidos: '',
      relacion: '',
      telefono: '',
      email: '',
      esPrincipal: contacts.length === 0
    };
    setValue('contactosEmergencia', [...contacts, newContact]);
  };

  const removeEmergencyContact = (index) => {
    const contacts = getValues('contactosEmergencia') || [];
    const newContacts = contacts.filter((_, i) => i !== index);
    
    // Si eliminamos el contacto principal, hacer principal al primero
    if (newContacts.length > 0 && !newContacts.some(c => c.esPrincipal)) {
      newContacts[0].esPrincipal = true;
    }
    
    setValue('contactosEmergencia', newContacts);
  };

  // Manejar alergias
  const addAllergy = () => {
    const allergies = getValues('alergias') || [];
    const newAllergy = {
      id: Date.now().toString(),
      alergia: '',
      severidad: 'leve',
      reaccion: '',
      activa: true
    };
    setValue('alergias', [...allergies, newAllergy]);
  };

  const removeAllergy = (index) => {
    const allergies = getValues('alergias') || [];
    setValue('alergias', allergies.filter((_, i) => i !== index));
  };

  // Manejar condiciones médicas
  const addMedicalCondition = () => {
    const conditions = getValues('condicionesMedicas') || [];
    const newCondition = {
      id: Date.now().toString(),
      condicion: '',
      fechaDiagnostico: '',
      medicamentos: '',
      controlado: true,
      observaciones: ''
    };
    setValue('condicionesMedicas', [...conditions, newCondition]);
  };

  const removeMedicalCondition = (index) => {
    const conditions = getValues('condicionesMedicas') || [];
    setValue('condicionesMedicas', conditions.filter((_, i) => i !== index));
  };

  // Manejar medicamentos actuales
  const addCurrentMedication = () => {
    const medications = getValues('medicamentosActuales') || [];
    const newMedication = {
      id: Date.now().toString(),
      medicamento: '',
      dosis: '',
      frecuencia: '',
      fechaInicio: '',
      motivo: '',
      prescriptoPor: ''
    };
    setValue('medicamentosActuales', [...medications, newMedication]);
  };

  const removeCurrentMedication = (index) => {
    const medications = getValues('medicamentosActuales') || [];
    setValue('medicamentosActuales', medications.filter((_, i) => i !== index));
  };

  // Manejar envío del formulario
  const onFormSubmit = async (data) => {
    if (onSubmit) {
      try {
        // Calcular edad automáticamente
        data.edad = calculateAge(data.fechaNacimiento);
        
        await onSubmit(data);
      } catch (error) {
        if (error.message.includes('DNI')) {
          setError('dni', { message: error.message });
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
    isEditMode: !!initialData,
    
    // Multi-step
    currentStep,
    steps,
    nextStep,
    prevStep,
    goToStep,
    validateCurrentStep,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === steps.length - 1,
    
    // Helpers para arrays
    addEmergencyContact,
    removeEmergencyContact,
    addAllergy,
    removeAllergy,
    addMedicalCondition,
    removeMedicalCondition,
    addCurrentMedication,
    removeCurrentMedication
  };
};

export default usePatientForm;