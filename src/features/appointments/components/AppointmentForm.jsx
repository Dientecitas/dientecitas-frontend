import React, { useEffect, useState } from 'react';
import { Save, X, Calendar, Clock, User, DollarSign, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '../../../shared/components/ui/LoadingButton';
import Input from '../../../shared/components/ui/Input';
import Card from '../../../shared/components/ui/Card';
import { appointmentValidationSchema } from '../utils/appointmentValidators';
import { AppointmentTypeOptions, PriorityOptions, ServiceOptions } from '../types/appointment.types';
import { formatDate, formatTime, calculateEndTime } from '../utils/appointmentHelpers';

const STEPS = [
  {
    id: 'patient',
    title: 'Información del Paciente',
    description: 'Selecciona el paciente y tipo de consulta',
    icon: User,
    fields: ['pacienteId', 'tipoConsulta', 'prioridad', 'motivo']
  },
  {
    id: 'schedule',
    title: 'Programación',
    description: 'Selecciona fecha, hora y recursos',
    icon: Calendar,
    fields: ['fecha', 'horaInicio', 'dentistaId', 'consultorioId']
  },
  {
    id: 'services',
    title: 'Servicios',
    description: 'Selecciona los servicios a realizar',
    icon: DollarSign,
    fields: ['servicios']
  },
  {
    id: 'review',
    title: 'Revisión',
    description: 'Revisa y confirma la información',
    icon: Check,
    fields: ['observaciones']
  }
];

const AppointmentForm = ({ 
  initialData = null, 
  onSubmit, 
  onCancel, 
  loading = false,
  title = null,
  availableSlots = [
    {
      id: 'slot1',
      fecha: '2025-08-25',
      horaInicio: '09:00',
      horaFin: '09:30',
      dentistaId: 'd1',
      consultorioId: 'c1',
      disponible: true
    },
    {
      id: 'slot2',
      fecha: '2025-08-25',
      horaInicio: '09:30',
      horaFin: '10:00',
      dentistaId: 'd1',
      consultorioId: 'c1',
      disponible: true
    },
    {
      id: 'slot3',
      fecha: '2025-08-25',
      horaInicio: '10:00',
      horaFin: '10:30',
      dentistaId: 'd1',
      consultorioId: 'c1',
      disponible: true
    },
    {
      id: 'slot4',
      fecha: '2025-08-25',
      horaInicio: '11:00',
      horaFin: '11:30',
      dentistaId: 'd2',
      consultorioId: 'c2',
      disponible: true
    },
    {
      id: 'slot5',
      fecha: '2025-08-26',
      horaInicio: '14:00',
      horaFin: '14:30',
      dentistaId: 'd1',
      consultorioId: 'c1',
      disponible: true
    },
    {
      id: 'slot6',
      fecha: '2025-08-26',
      horaInicio: '15:00',
      horaFin: '15:30',
      dentistaId: 'd2',
      consultorioId: 'c2',
      disponible: true
    },
    {
      id: 'slot7',
      fecha: '2025-08-25',
      horaInicio: '08:00',
      horaFin: '08:30',
      dentistaId: 'd1',
      consultorioId: 'c1',
      disponible: true
    },
    {
      id: 'slot8',
      fecha: '2025-08-25',
      horaInicio: '08:30',
      horaFin: '09:00',
      dentistaId: 'd1',
      consultorioId: 'c1',
      disponible: true
    },
    {
      id: 'slot9',
      fecha: '2025-08-25',
      horaInicio: '10:30',
      horaFin: '11:00',
      dentistaId: 'd1',
      consultorioId: 'c1',
      disponible: true
    },
    {
      id: 'slot10',
      fecha: '2025-08-25',
      horaInicio: '11:30',
      horaFin: '12:00',
      dentistaId: 'd1',
      consultorioId: 'c1',
      disponible: true
    },
    {
      id: 'slot11',
      fecha: '2025-08-25',
      horaInicio: '14:00',
      horaFin: '14:30',
      dentistaId: 'd2',
      consultorioId: 'c2',
      disponible: true
    },
    {
      id: 'slot12',
      fecha: '2025-08-25',
      horaInicio: '14:30',
      horaFin: '15:00',
      dentistaId: 'd2',
      consultorioId: 'c2',
      disponible: true
    },
    {
      id: 'slot13',
      fecha: '2025-08-25',
      horaInicio: '15:00',
      horaFin: '15:30',
      dentistaId: 'd2',
      consultorioId: 'c2',
      disponible: true
    },
    {
      id: 'slot14',
      fecha: '2025-08-25',
      horaInicio: '15:30',
      horaFin: '16:00',
      dentistaId: 'd2',
      consultorioId: 'c2',
      disponible: true
    },
    {
      id: 'slot15',
      fecha: '2025-08-25',
      horaInicio: '16:00',
      horaFin: '16:30',
      dentistaId: 'd3',
      consultorioId: 'c3',
      disponible: true
    },
    {
      id: 'slot16',
      fecha: '2025-08-25',
      horaInicio: '16:30',
      horaFin: '17:00',
      dentistaId: 'd3',
      consultorioId: 'c3',
      disponible: true
    },
    {
      id: 'slot17',
      fecha: '2025-08-26',
      horaInicio: '08:00',
      horaFin: '08:30',
      dentistaId: 'd1',
      consultorioId: 'c1',
      disponible: true
    },
    {
      id: 'slot18',
      fecha: '2025-08-26',
      horaInicio: '09:00',
      horaFin: '09:30',
      dentistaId: 'd1',
      consultorioId: 'c1',
      disponible: true
    },
    {
      id: 'slot19',
      fecha: '2025-08-26',
      horaInicio: '10:00',
      horaFin: '10:30',
      dentistaId: 'd2',
      consultorioId: 'c2',
      disponible: true
    },
    {
      id: 'slot20',
      fecha: '2025-08-26',
      horaInicio: '11:00',
      horaFin: '11:30',
      dentistaId: 'd2',
      consultorioId: 'c2',
      disponible: true
    },
    {
      id: 'slot21',
      fecha: '2025-08-27',
      horaInicio: '08:30',
      horaFin: '09:00',
      dentistaId: 'd1',
      consultorioId: 'c1',
      disponible: true
    },
    {
      id: 'slot22',
      fecha: '2025-08-27',
      horaInicio: '09:30',
      horaFin: '10:00',
      dentistaId: 'd1',
      consultorioId: 'c1',
      disponible: true
    },
    {
      id: 'slot23',
      fecha: '2025-08-27',
      horaInicio: '13:00',
      horaFin: '13:30',
      dentistaId: 'd3',
      consultorioId: 'c3',
      disponible: true
    },
    {
      id: 'slot24',
      fecha: '2025-08-27',
      horaInicio: '13:30',
      horaFin: '14:00',
      dentistaId: 'd3',
      consultorioId: 'c3',
      disponible: true
    },
    {
      id: 'slot25',
      fecha: '2025-08-27',
      horaInicio: '08:00',
      horaFin: '08:30',
      dentistaId: 'd2',
      consultorioId: 'c2',
      disponible: true
    },
    {
      id: 'slot26',
      fecha: '2025-08-27',
      horaInicio: '08:30',
      horaFin: '09:00',
      dentistaId: 'd2',
      consultorioId: 'c2',
      disponible: true
    },
    {
      id: 'slot27',
      fecha: '2025-08-27',
      horaInicio: '09:00',
      horaFin: '09:30',
      dentistaId: 'd2',
      consultorioId: 'c2',
      disponible: true
    },
    {
      id: 'slot28',
      fecha: '2025-08-27',
      horaInicio: '10:00',
      horaFin: '10:30',
      dentistaId: 'd2',
      consultorioId: 'c2',
      disponible: true
    },
    {
      id: 'slot29',
      fecha: '2025-08-27',
      horaInicio: '14:00',
      horaFin: '14:30',
      dentistaId: 'd2',
      consultorioId: 'c2',
      disponible: true
    },
    {
      id: 'slot30',
      fecha: '2025-08-27',
      horaInicio: '15:00',
      horaFin: '15:30',
      dentistaId: 'd2',
      consultorioId: 'c2',
      disponible: true
    },
    {
      id: 'slot31',
      fecha: '2025-08-27',
      horaInicio: '16:00',
      horaFin: '16:30',
      dentistaId: 'd2',
      consultorioId: 'c2',
      disponible: true
    }
  ],
  patients = [
    {
      id: 'p1',
      nombres: 'Juan Carlos',
      apellidos: 'Pérez García',
      dni: '12345678',
      telefono: '987654321',
      email: 'juan.perez@email.com'
    },
    {
      id: 'p2',
      nombres: 'Ana María',
      apellidos: 'Rodríguez Silva',
      dni: '87654321',
      telefono: '987654322',
      email: 'ana.rodriguez@email.com'
    },
    {
      id: 'p3',
      nombres: 'Luis Alberto',
      apellidos: 'Vargas Torres',
      dni: '11223344',
      telefono: '987654323',
      email: 'luis.vargas@email.com'
    },
    {
      id: 'p4',
      nombres: 'Carmen Rosa',
      apellidos: 'Mendoza Flores',
      dni: '44332211',
      telefono: '987654324',
      email: 'carmen.mendoza@email.com'
    },
    {
      id: 'p5',
      nombres: 'Roberto',
      apellidos: 'Sánchez Morales',
      dni: '55667788',
      telefono: '987654325',
      email: 'roberto.sanchez@email.com'
    }
  ],
  dentists = [
    {
      id: 'd1',
      nombres: 'Dr. María Elena',
      apellidos: 'González López',
      especialidad: 'Odontología General',
      telefono: '987123456',
      email: 'maria.gonzalez@dientecitas.com'
    },
    {
      id: 'd2',
      nombres: 'Dr. Carlos Alberto',
      apellidos: 'Mendoza Ruiz',
      especialidad: 'Endodoncia',
      telefono: '987123457',
      email: 'carlos.mendoza@dientecitas.com'
    },
    {
      id: 'd3',
      nombres: 'Dra. Patricia',
      apellidos: 'Vásquez Castro',
      especialidad: 'Ortodoncia',
      telefono: '987123458',
      email: 'patricia.vasquez@dientecitas.com'
    },
    {
      id: 'd4',
      nombres: 'Dr. Fernando',
      apellidos: 'Ramírez Torres',
      especialidad: 'Cirugía Oral',
      telefono: '987123459',
      email: 'fernando.ramirez@dientecitas.com'
    }
  ],
  clinics = [
    {
      id: 'c1',
      nombre: 'Consultorio Central',
      direccion: 'Av. Principal 123, Miraflores',
      telefono: '01-234-5678',
      distrito: 'Miraflores'
    },
    {
      id: 'c2',
      nombre: 'Consultorio Norte',
      direccion: 'Jr. Los Olivos 456, San Isidro',
      telefono: '01-234-5679',
      distrito: 'San Isidro'
    },
    {
      id: 'c3',
      nombre: 'Consultorio Sur',
      direccion: 'Av. Surco 789, Surco',
      telefono: '01-234-5680',
      distrito: 'Surco'
    },
    {
      id: 'c4',
      nombre: 'Consultorio Este',
      direccion: 'Calle La Molina 321, La Molina',
      telefono: '01-234-5681',
      distrito: 'La Molina'
    }
  ]
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedServices, setSelectedServices] = useState(initialData?.servicios || []);
  const [totalDuration, setTotalDuration] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  
  // Usar datos por defecto si no se pasan como props
  const finalPatients = patients || [
    {
      id: 'p1',
      nombres: 'Juan Carlos',
      apellidos: 'Pérez García',
      dni: '12345678',
      telefono: '987654321',
      email: 'juan.perez@email.com'
    },
    {
      id: 'p2',
      nombres: 'Ana María',
      apellidos: 'Rodríguez Silva',
      dni: '87654321',
      telefono: '987654322',
      email: 'ana.rodriguez@email.com'
    },
    {
      id: 'p3',
      nombres: 'Luis Alberto',
      apellidos: 'Vargas Torres',
      dni: '11223344',
      telefono: '987654323',
      email: 'luis.vargas@email.com'
    }
  ];
  
  const finalDentists = dentists || [
    {
      id: 'd1',
      nombres: 'Dr. María Elena',
      apellidos: 'González López',
      especialidad: 'Odontología General',
      telefono: '987123456',
      email: 'maria.gonzalez@dientecitas.com'
    },
    {
      id: 'd2',
      nombres: 'Dr. Carlos Alberto',
      apellidos: 'Mendoza Ruiz',
      especialidad: 'Endodoncia',
      telefono: '987123457',
      email: 'carlos.mendoza@dientecitas.com'
    }
  ];
  
  const finalClinics = clinics || [
    {
      id: 'c1',
      nombre: 'Consultorio Central',
      direccion: 'Av. Principal 123, Miraflores',
      telefono: '01-234-5678',
      distrito: 'Miraflores'
    },
    {
      id: 'c2',
      nombre: 'Consultorio Norte',
      direccion: 'Jr. Los Olivos 456, San Isidro',
      telefono: '01-234-5679',
      distrito: 'San Isidro'
    }
  ];
  
  const finalAvailableSlots = availableSlots || [
    // Horarios para 25 de agosto 2025
    { id: 'slot1', fecha: '2025-08-25', horaInicio: '08:00', horaFin: '08:30', dentistaId: 'd1', consultorioId: 'c1', disponible: true },
    { id: 'slot2', fecha: '2025-08-25', horaInicio: '09:00', horaFin: '09:30', dentistaId: 'd1', consultorioId: 'c1', disponible: true },
    { id: 'slot3', fecha: '2025-08-25', horaInicio: '10:00', horaFin: '10:30', dentistaId: 'd2', consultorioId: 'c2', disponible: true },
    
    // Horarios para 27 de agosto 2025 - Dr. Carlos (d2) + Consultorio Norte (c2)
    { id: 'slot21', fecha: '2025-08-27', horaInicio: '08:00', horaFin: '08:30', dentistaId: 'd2', consultorioId: 'c2', disponible: true },
    { id: 'slot22', fecha: '2025-08-27', horaInicio: '08:30', horaFin: '09:00', dentistaId: 'd2', consultorioId: 'c2', disponible: true },
    { id: 'slot23', fecha: '2025-08-27', horaInicio: '09:00', horaFin: '09:30', dentistaId: 'd2', consultorioId: 'c2', disponible: true },
    { id: 'slot24', fecha: '2025-08-27', horaInicio: '10:00', horaFin: '10:30', dentistaId: 'd2', consultorioId: 'c2', disponible: true },
    { id: 'slot25', fecha: '2025-08-27', horaInicio: '14:00', horaFin: '14:30', dentistaId: 'd2', consultorioId: 'c2', disponible: true },
    { id: 'slot26', fecha: '2025-08-27', horaInicio: '15:00', horaFin: '15:30', dentistaId: 'd2', consultorioId: 'c2', disponible: true },
    { id: 'slot27', fecha: '2025-08-27', horaInicio: '16:00', horaFin: '16:30', dentistaId: 'd2', consultorioId: 'c2', disponible: true }
  ];

  // Debug: Log available slots
  console.log('Available slots:', finalAvailableSlots);

  const isEditMode = !!initialData;
  const formTitle = title || (isEditMode ? 'Editar Cita' : 'Nueva Cita');
  const currentStepData = STEPS[currentStep];

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    trigger,
    getValues
  } = useForm({
    resolver: yupResolver(appointmentValidationSchema),
    mode: 'onChange',
    defaultValues: {
      fecha: initialData?.fecha || '',
      horaInicio: initialData?.horaInicio || '',
      pacienteId: initialData?.pacienteId || '',
      dentistaId: initialData?.dentistaId || '',
      consultorioId: initialData?.consultorioId || '',
      tipoConsulta: initialData?.tipoConsulta || 'primera_vez',
      prioridad: initialData?.prioridad || 'normal',
      motivo: initialData?.motivo || '',
      observaciones: initialData?.observaciones || ''
    }
  });

  const watchedFields = watch(['fecha', 'dentistaId', 'consultorioId']);
  
  // Debug: Log watched fields and filtering process
  console.log('=== DEBUG INFO ===');
  console.log('Watched fields:', watchedFields);
  console.log('All available slots:', availableSlots);
  console.log('Available times after filtering:', availableTimes);

  // Calcular duración y costo total cuando cambian los servicios
  useEffect(() => {
    const duration = selectedServices.reduce((sum, service) => sum + service.duracion, 0);
    const cost = selectedServices.reduce((sum, service) => sum + service.costo, 0);
    
    setTotalDuration(duration);
    setTotalCost(cost);
    setValue('duracion', duration);
  }, [selectedServices, setValue]);

  // Actualizar horarios disponibles cuando cambian fecha, dentista o consultorio
  useEffect(() => {
    const [fecha, dentistaId, consultorioId] = watchedFields;
    
    console.log('=== FILTERING SLOTS ===');
    console.log('Filtering with:', { fecha, dentistaId, consultorioId });
    console.log('Total slots to filter:', finalAvailableSlots.length);
    
    if (fecha && dentistaId && consultorioId) {
      const slotsForDate = finalAvailableSlots.filter(slot => 
        slot.fecha === fecha && 
        slot.dentistaId === dentistaId && 
        slot.consultorioId === consultorioId &&
        slot.disponible
      );
      
      console.log('Slots matching criteria:', slotsForDate);
      console.log('Found', slotsForDate.length, 'available slots');
      
      // Debug individual filter conditions
      const dateMatches = finalAvailableSlots.filter(slot => slot.fecha === fecha);
      const dentistMatches = finalAvailableSlots.filter(slot => slot.dentistaId === dentistaId);
      const clinicMatches = finalAvailableSlots.filter(slot => slot.consultorioId === consultorioId);
      console.log('Date matches:', dateMatches.length, 'Dentist matches:', dentistMatches.length, 'Clinic matches:', clinicMatches.length);
      
      setAvailableTimes(slotsForDate);
    } else {
      setAvailableTimes([]);
    }
  }, [watchedFields, finalAvailableSlots]);

  // Validar paso actual
  const validateCurrentStep = async () => {
    const fieldsToValidate = currentStepData.fields;
    const isStepValid = await trigger(fieldsToValidate);
    
    // Validación especial para servicios
    if (currentStep === 2 && selectedServices.length === 0) {
      return false;
    }
    
    return isStepValid;
  };

  // Navegar al siguiente paso
  const handleNextStep = async () => {
    const isValid = await validateCurrentStep();
    
    if (isValid) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  // Navegar al paso anterior
  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Navegar a un paso específico
  const handleStepClick = async (stepIndex) => {
    if (stepIndex < currentStep || completedSteps.has(stepIndex)) {
      setCurrentStep(stepIndex);
    } else if (stepIndex === currentStep + 1) {
      await handleNextStep();
    }
  };

  // Manejar selección de servicios
  const handleServiceToggle = (service) => {
    const isSelected = selectedServices.find(s => s.id === service.id);
    
    if (isSelected) {
      setSelectedServices(prev => prev.filter(s => s.id !== service.id));
    } else {
      setSelectedServices(prev => [...prev, service]);
    }
  };

  // Manejar envío del formulario
  const onFormSubmit = async (data) => {
    const appointmentData = {
      ...data,
      servicios: selectedServices,
      duracion: totalDuration,
      horaFin: calculateEndTime(data.horaInicio, totalDuration),
      costo: {
        subtotal: totalCost,
        total: totalCost,
        estadoPago: 'pendiente'
      }
    };

    try {
      await onSubmit(appointmentData);
    } catch (error) {
      console.error('Error al guardar cita:', error);
    }
  };

  // Renderizar indicador de pasos
  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-8">
      {STEPS.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = completedSteps.has(index);
        const isClickable = index <= currentStep || completedSteps.has(index);
        const IconComponent = step.icon;

        return (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => isClickable && handleStepClick(index)}
                disabled={!isClickable}
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  isActive
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : isCompleted
                    ? 'bg-green-600 border-green-600 text-white'
                    : isClickable
                    ? 'border-gray-300 text-gray-500 hover:border-blue-300'
                    : 'border-gray-200 text-gray-300 cursor-not-allowed'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <IconComponent className="w-5 h-5" />
                )}
              </button>
              <div className="mt-2 text-center">
                <div className={`text-sm font-medium ${
                  isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </div>
                <div className="text-xs text-gray-400 hidden sm:block">
                  {step.description}
                </div>
              </div>
            </div>
            
            {index < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 ${
                completedSteps.has(index) ? 'bg-green-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );

  // Renderizar paso 1: Información del paciente
  const renderPatientStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Paciente *
          </label>
          <select
            {...register('pacienteId')}
            className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.pacienteId ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Seleccionar paciente</option>
            {finalPatients.map(patient => (
              <option key={patient.id} value={patient.id}>
                {patient.nombres} {patient.apellidos} - {patient.dni}
              </option>
            ))}
          </select>
          {errors.pacienteId && (
            <p className="mt-1 text-sm text-red-600">{errors.pacienteId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Consulta *
          </label>
          <select
            {...register('tipoConsulta')}
            className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.tipoConsulta ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            {AppointmentTypeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.tipoConsulta && (
            <p className="mt-1 text-sm text-red-600">{errors.tipoConsulta.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Prioridad
        </label>
        <select
          {...register('prioridad')}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {PriorityOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Input
          label="Motivo de la consulta"
          name="motivo"
          register={register}
          error={errors.motivo?.message}
          placeholder="Describe el motivo principal de la consulta"
          required
        />
      </div>
    </div>
  );

  // Renderizar paso 2: Programación
  const renderScheduleStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dentista *
          </label>
          <select
            {...register('dentistaId')}
            className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.dentistaId ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Seleccionar dentista</option>
            {finalDentists.map(dentist => (
              <option key={dentist.id} value={dentist.id}>
                {dentist.nombres} {dentist.apellidos} - {dentist.especialidad}
              </option>
            ))}
          </select>
          {errors.dentistaId && (
            <p className="mt-1 text-sm text-red-600">{errors.dentistaId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Consultorio *
          </label>
          <select
            {...register('consultorioId')}
            className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.consultorioId ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Seleccionar consultorio</option>
            {finalClinics.map(clinic => (
              <option key={clinic.id} value={clinic.id}>
                {clinic.nombre} - {clinic.direccion}
              </option>
            ))}
          </select>
          {errors.consultorioId && (
            <p className="mt-1 text-sm text-red-600">{errors.consultorioId.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Input
            label="Fecha"
            type="date"
            name="fecha"
            register={register}
            error={errors.fecha?.message}
            required
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hora de Inicio *
          </label>
          <select
            {...register('horaInicio')}
            className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.horaInicio ? 'border-red-300' : 'border-gray-300'
            }`}
            disabled={availableTimes.length === 0}
          >
            <option value="">Seleccionar hora</option>
            {availableTimes.map(slot => (
              <option key={slot.id} value={slot.horaInicio}>
                {formatTime(slot.horaInicio)} - {formatTime(slot.horaFin)}
              </option>
            ))}
          </select>
          {errors.horaInicio && (
            <p className="mt-1 text-sm text-red-600">{errors.horaInicio.message}</p>
          )}
          {availableTimes.length === 0 && watchedFields.every(Boolean) && (
            <p className="mt-1 text-sm text-orange-600">
              No hay horarios disponibles para la selección actual
            </p>
          )}
          {availableTimes.length === 0 && watchedFields.every(Boolean) && (
            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
              <strong>Debug Info:</strong><br/>
              Fecha: {watchedFields[0]}<br/>
              Dentista ID: {watchedFields[1]}<br/>
              Consultorio ID: {watchedFields[2]}<br/>
              <em>Revisa la consola del navegador para más detalles</em>
            </div>
          )}
          {availableTimes.length === 0 && !watchedFields.every(Boolean) && (
            <p className="mt-1 text-sm text-gray-500">
              Selecciona fecha, dentista y consultorio para ver horarios disponibles
            </p>
          )}
        </div>
      </div>
    </div>
  );

  // Renderizar paso 3: Servicios
  const renderServicesStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Selecciona los servicios a realizar
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ServiceOptions.map(service => (
            <div
              key={service.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedServices.find(s => s.id === service.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleServiceToggle(service)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{service.servicio}</h4>
                  <p className="text-sm text-gray-600">{service.categoria}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    S/ {service.costo}
                  </div>
                  <div className="text-sm text-gray-500">
                    {service.duracion} min
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={!!selectedServices.find(s => s.id === service.id)}
                onChange={() => handleServiceToggle(service)}
                className="mt-2"
                readOnly
              />
            </div>
          ))}
        </div>

        {selectedServices.length === 0 && (
          <p className="text-sm text-red-600 mt-2">
            Debe seleccionar al menos un servicio
          </p>
        )}
      </div>

      {selectedServices.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Resumen de Servicios</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <Clock className="w-4 h-4 text-gray-400 mr-2" />
              <span>Duración total: {totalDuration} minutos</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
              <span>Costo total: S/ {totalCost}</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-600">Servicios: </span>
            <span className="text-sm text-gray-900">
              {selectedServices.map(s => s.servicio).join(', ')}
            </span>
          </div>
        </div>
      )}
    </div>
  );

  // Renderizar paso 4: Revisión
  const renderReviewStep = () => {
    const formData = getValues();
    const selectedPatient = finalPatients.find(p => p.id === formData.pacienteId);
    const selectedDentist = finalDentists.find(d => d.id === formData.dentistaId);
    const selectedClinic = finalClinics.find(c => c.id === formData.consultorioId);

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Revisa la información de la cita
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Información del Paciente">
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Paciente:</dt>
                <dd className="text-sm text-gray-900">
                  {selectedPatient ? `${selectedPatient.nombres} ${selectedPatient.apellidos}` : 'No seleccionado'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Tipo de consulta:</dt>
                <dd className="text-sm text-gray-900">
                  {AppointmentTypeOptions.find(t => t.value === formData.tipoConsulta)?.label}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Prioridad:</dt>
                <dd className="text-sm text-gray-900">
                  {PriorityOptions.find(p => p.value === formData.prioridad)?.label}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Motivo:</dt>
                <dd className="text-sm text-gray-900">{formData.motivo}</dd>
              </div>
            </dl>
          </Card>

          <Card title="Programación">
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Fecha:</dt>
                <dd className="text-sm text-gray-900">{formatDate(formData.fecha)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Hora:</dt>
                <dd className="text-sm text-gray-900">
                  {formatTime(formData.horaInicio)} - {formatTime(calculateEndTime(formData.horaInicio, totalDuration))}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Dentista:</dt>
                <dd className="text-sm text-gray-900">
                  {selectedDentist ? `${selectedDentist.nombres} ${selectedDentist.apellidos}` : 'No seleccionado'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Consultorio:</dt>
                <dd className="text-sm text-gray-900">
                  {selectedClinic ? selectedClinic.nombre : 'No seleccionado'}
                </dd>
              </div>
            </dl>
          </Card>
        </div>

        <Card title="Servicios y Costos">
          <div className="space-y-3">
            {selectedServices.map(service => (
              <div key={service.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-gray-900">{service.servicio}</span>
                  <span className="text-xs text-gray-600 ml-2">({service.duracion} min)</span>
                </div>
                <span className="text-sm font-medium text-gray-900">S/ {service.costo}</span>
              </div>
            ))}
            <div className="border-t pt-3 flex justify-between items-center">
              <span className="font-medium text-gray-900">Total:</span>
              <span className="font-bold text-lg text-gray-900">S/ {totalCost}</span>
            </div>
          </div>
        </Card>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Observaciones adicionales
          </label>
          <textarea
            {...register('observaciones')}
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Observaciones adicionales, instrucciones especiales, etc."
          />
        </div>
      </div>
    );
  };

  // Renderizar contenido del paso actual
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderPatientStep();
      case 1:
        return renderScheduleStep();
      case 2:
        return renderServicesStep();
      case 3:
        return renderReviewStep();
      default:
        return null;
    }
  };

  return (
    <Card title={formTitle}>
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
        {/* Indicador de pasos */}
        {renderStepIndicator()}

        {/* Contenido del paso actual */}
        <div className="min-h-[400px]">
          {renderStepContent()}
        </div>

        {/* Error general */}
        {errors.root && (
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
            {errors.root.message}
          </div>
        )}

        {/* Botones de navegación */}
        <div className="flex justify-between items-center pt-6 border-t">
          <div>
            {currentStep > 0 && (
              <LoadingButton
                type="button"
                variant="outline"
                onClick={handlePreviousStep}
                disabled={loading}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Anterior
              </LoadingButton>
            )}
          </div>

          <div className="flex gap-3">
            <LoadingButton
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </LoadingButton>

            {currentStep < STEPS.length - 1 ? (
              <LoadingButton
                type="button"
                onClick={handleNextStep}
                disabled={loading}
              >
                Siguiente
                <ChevronRight className="w-4 h-4 ml-2" />
              </LoadingButton>
            ) : (
              <LoadingButton
                type="submit"
                loading={loading}
                loadingText={isEditMode ? 'Actualizando...' : 'Creando...'}
                disabled={!isValid || loading || selectedServices.length === 0}
                showSuccessState
              >
                <Save className="w-4 h-4 mr-2" />
                {isEditMode ? 'Actualizar' : 'Crear'} Cita
              </LoadingButton>
            )}
          </div>
        </div>

        {/* Indicador de progreso */}
        <div className="text-center">
          <span className="text-sm text-gray-500">
            Paso {currentStep + 1} de {STEPS.length}
          </span>
        </div>
      </form>
    </Card>
  );
};

export default AppointmentForm;