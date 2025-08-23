import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ProvinceOptions, RegionOptions, DISTRICT_VALIDATION } from '../types/district.types';
import { generateDistrictCode } from '../utils/districtHelpers';

// Schema de validación
const districtSchema = yup.object().shape({
  nombre: yup
    .string()
    .required('El nombre es requerido')
    .min(DISTRICT_VALIDATION.NOMBRE_MIN_LENGTH, `Mínimo ${DISTRICT_VALIDATION.NOMBRE_MIN_LENGTH} caracteres`)
    .max(DISTRICT_VALIDATION.NOMBRE_MAX_LENGTH, `Máximo ${DISTRICT_VALIDATION.NOMBRE_MAX_LENGTH} caracteres`)
    .trim(),
  
  descripcion: yup
    .string()
    .required('La descripción es requerida')
    .min(DISTRICT_VALIDATION.DESCRIPCION_MIN_LENGTH, `Mínimo ${DISTRICT_VALIDATION.DESCRIPCION_MIN_LENGTH} caracteres`)
    .max(DISTRICT_VALIDATION.DESCRIPCION_MAX_LENGTH, `Máximo ${DISTRICT_VALIDATION.DESCRIPCION_MAX_LENGTH} caracteres`)
    .trim(),
  
  codigo: yup
    .string()
    .required('El código es requerido')
    .matches(DISTRICT_VALIDATION.CODIGO_PATTERN, 'El código debe tener el formato XX-000 (ej: LI-001)')
    .trim()
    .uppercase(),
  
  provincia: yup
    .string()
    .required('La provincia es requerida')
    .oneOf(ProvinceOptions, 'Seleccione una provincia válida'),
  
  region: yup
    .string()
    .required('La región es requerida'),
  
  poblacion: yup
    .number()
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value;
    })
    .min(DISTRICT_VALIDATION.POBLACION_MIN, 'La población debe ser mayor a 0')
    .integer('La población debe ser un número entero'),
  
  activo: yup
    .boolean()
    .required()
});

export const useDistrictForm = (initialData = null, onSubmit = null) => {
  const defaultValues = {
    nombre: '',
    descripcion: '',
    codigo: '',
    provincia: '',
    region: '',
    poblacion: null,
    activo: true,
    ...initialData
  };

  const form = useForm({
    resolver: yupResolver(districtSchema),
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
    setError
  } = form;

  // Observar cambios en provincia para actualizar regiones disponibles
  const selectedProvincia = watch('provincia');
  const selectedRegion = watch('region');

  // Obtener regiones disponibles según la provincia seleccionada
  const getAvailableRegions = () => {
    if (!selectedProvincia) return [];
    return RegionOptions[selectedProvincia] || [];
  };

  // Generar código automáticamente
  const generateCode = () => {
    const nombre = watch('nombre');
    const provincia = watch('provincia');
    
    if (nombre && provincia) {
      const code = generateDistrictCode(nombre, provincia);
      setValue('codigo', code);
      clearErrors('codigo');
    }
  };

  // Validar región cuando cambia la provincia
  const handleProvinciaChange = (provincia) => {
    setValue('provincia', provincia);
    
    // Limpiar región si no es válida para la nueva provincia
    const availableRegions = RegionOptions[provincia] || [];
    if (selectedRegion && !availableRegions.includes(selectedRegion)) {
      setValue('region', '');
    }
    
    clearErrors('provincia');
  };

  // Manejar envío del formulario
  const onFormSubmit = async (data) => {
    if (onSubmit) {
      try {
        await onSubmit(data);
      } catch (error) {
        // Manejar errores específicos del servidor
        if (error.message.includes('código')) {
          setError('codigo', { message: error.message });
        } else if (error.message.includes('nombre')) {
          setError('nombre', { message: error.message });
        } else {
          // Error general
          setError('root', { message: error.message });
        }
      }
    }
  };

  // Resetear formulario con nuevos datos
  const resetForm = (newData = null) => {
    const resetData = newData || defaultValues;
    reset(resetData);
  };

  // Validar si el formulario tiene cambios
  const hasChanges = () => {
    return isDirty;
  };

  // Obtener datos del formulario
  const getFormData = () => {
    return watch();
  };

  // Validar campo específico
  const validateField = async (fieldName) => {
    try {
      await districtSchema.validateAt(fieldName, getFormData());
      clearErrors(fieldName);
      return true;
    } catch (error) {
      setError(fieldName, { message: error.message });
      return false;
    }
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
    
    // Estados
    errors,
    isValid,
    isDirty,
    isSubmitting,
    
    // Datos
    formData: getFormData(),
    availableRegions: getAvailableRegions(),
    
    // Utilidades
    generateCode,
    handleProvinciaChange,
    hasChanges,
    validateField,
    
    // Opciones
    provinceOptions: ProvinceOptions,
    regionOptions: getAvailableRegions()
  };
};

export default useDistrictForm;