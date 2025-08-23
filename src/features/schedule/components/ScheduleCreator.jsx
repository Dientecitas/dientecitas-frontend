import React, { useState } from 'react';
import { Save, X, Calendar, Clock, Users, Wand2, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import LoadingButton from '../../../shared/components/ui/LoadingButton';
import Input from '../../../shared/components/ui/Input';
import Card from '../../../shared/components/ui/Card';
import { useDentists } from '../../dentists/hooks/useDentists';
import { useClinics } from '../../clinics/hooks/useClinics';
import { AppointmentTypeOptions, TimeIntervals } from '../types/schedule.types';

const ScheduleCreator = ({ 
  initialData = null, 
  onSubmit, 
  onCancel, 
  loading = false,
  title = null 
}) => {
  const { dentists, loading: loadingDentists } = useDentists();
  const { clinics, loading: loadingClinics } = useClinics();

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Paso 1: Información básica
    fecha: '',
    horaInicio: '',
    horaFin: '',
    duracion: 30,
    dentistaId: '',
    consultorioId: '',
    
    // Paso 2: Configuración del turno
    tipoTurno: 'consulta',
    prioridad: 'normal',
    capacidadMaxima: 1,
    serviciosPermitidos: [],
    
    // Paso 3: Configuraciones avanzadas
    configuraciones: {
      permiteCancelacion: true,
      tiempoCancelacion: 24,
      permiteReagendamiento: true,
      confirmacionRequerida: false,
      recordatoriosAutomaticos: true,
      tiemposRecordatorio: [24, 2]
    },
    
    // Paso 4: Recurrencia (opcional)
    esRecurrente: false,
    patronRecurrencia: {
      tipo: 'semanal',
      frecuencia: 1,
      diasSemana: [],
      fechaFin: ''
    },
    
    ...initialData
  });

  const [errors, setErrors] = useState({});
  const isEditMode = !!initialData;
  const formTitle = title || (isEditMode ? 'Editar Turno' : 'Crear Turnos');

  const steps = [
    { id: 'basic', title: 'Información Básica', icon: Calendar },
    { id: 'config', title: 'Configuración', icon: Users },
    { id: 'advanced', title: 'Opciones Avanzadas', icon: Clock },
    { id: 'recurrence', title: 'Recurrencia', icon: Wand2 }
  ];

  // Validar paso actual
  const validateCurrentStep = () => {
    const stepErrors = {};
    
    switch (currentStep) {
      case 0: // Información básica
        if (!formData.fecha) stepErrors.fecha = 'Fecha requerida';
        if (!formData.horaInicio) stepErrors.horaInicio = 'Hora inicio requerida';
        if (!formData.horaFin) stepErrors.horaFin = 'Hora fin requerida';
        if (!formData.dentistaId) stepErrors.dentistaId = 'Dentista requerido';
        if (!formData.consultorioId) stepErrors.consultorioId = 'Consultorio requerido';
        if (formData.horaInicio >= formData.horaFin) {
          stepErrors.horaFin = 'Hora fin debe ser posterior a hora inicio';
        }
        break;
        
      case 1: // Configuración
        if (!formData.tipoTurno) stepErrors.tipoTurno = 'Tipo de turno requerido';
        if (formData.capacidadMaxima < 1) stepErrors.capacidadMaxima = 'Capacidad mínima 1';
        if (formData.serviciosPermitidos.length === 0) {
          stepErrors.serviciosPermitidos = 'Al menos un servicio debe estar permitido';
        }
        break;
        
      case 2: // Avanzadas
        if (formData.configuraciones.permiteCancelacion && !formData.configuraciones.tiempoCancelacion) {
          stepErrors.tiempoCancelacion = 'Tiempo de cancelación requerido';
        }
        break;
        
      case 3: // Recurrencia
        if (formData.esRecurrente) {
          if (!formData.patronRecurrencia.fechaFin) {
            stepErrors.fechaFin = 'Fecha fin requerida para recurrencia';
          }
          if (formData.patronRecurrencia.tipo === 'semanal' && formData.patronRecurrencia.diasSemana.length === 0) {
            stepErrors.diasSemana = 'Seleccione al menos un día de la semana';
          }
        }
        break;
    }
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  // Navegación entre pasos
  const nextStep = () => {
    if (validateCurrentStep() && currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Actualizar datos del formulario
  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  // Actualizar configuraciones anidadas
  const updateConfig = (field, value) => {
    setFormData(prev => ({
      ...prev,
      configuraciones: {
        ...prev.configuraciones,
        [field]: value
      }
    }));
  };

  // Actualizar patrón de recurrencia
  const updateRecurrence = (field, value) => {
    setFormData(prev => ({
      ...prev,
      patronRecurrencia: {
        ...prev.patronRecurrencia,
        [field]: value
      }
    }));
  };

  // Calcular duración automáticamente
  const calculateDuration = () => {
    if (formData.horaInicio && formData.horaFin) {
      const start = new Date(`2000-01-01T${formData.horaInicio}:00`);
      const end = new Date(`2000-01-01T${formData.horaFin}:00`);
      const duration = (end - start) / (1000 * 60);
      updateFormData('duracion', duration);
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting schedule:', error);
    }
  };

  // Renderizar paso actual
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderBasicInfo();
      case 1:
        return renderConfiguration();
      case 2:
        return renderAdvancedOptions();
      case 3:
        return renderRecurrence();
      default:
        return renderBasicInfo();
    }
  };

  // Paso 1: Información básica
  const renderBasicInfo = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
        Información Básica del Turno
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Fecha"
          type="date"
          value={formData.fecha}
          onChange={(e) => updateFormData('fecha', e.target.value)}
          error={errors.fecha}
          min={new Date().toISOString().split('T')[0]}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dentista *
          </label>
          <select
            value={formData.dentistaId}
            onChange={(e) => updateFormData('dentistaId', e.target.value)}
            className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.dentistaId ? 'border-red-300' : 'border-gray-300'
            }`}
            disabled={loadingDentists}
          >
            <option value="">Seleccionar dentista</option>
            {dentists.filter(d => d.activo).map(dentista => (
              <option key={dentista.id} value={dentista.id}>
                Dr. {dentista.nombres} {dentista.apellidos} - {dentista.especialidades?.[0]?.nombre || 'General'}
              </option>
            ))}
          </select>
          {errors.dentistaId && (
            <p className="mt-1 text-sm text-red-600">{errors.dentistaId}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Consultorio *
          </label>
          <select
            value={formData.consultorioId}
            onChange={(e) => updateFormData('consultorioId', e.target.value)}
            className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.consultorioId ? 'border-red-300' : 'border-gray-300'
            }`}
            disabled={loadingClinics}
          >
            <option value="">Seleccionar consultorio</option>
            {clinics.filter(c => c.activo).map(consultorio => (
              <option key={consultorio.id} value={consultorio.id}>
                {consultorio.nombre} - {consultorio.distrito?.nombre}
              </option>
            ))}
          </select>
          {errors.consultorioId && (
            <p className="mt-1 text-sm text-red-600">{errors.consultorioId}</p>
          )}
        </div>

        <Input
          label="Hora Inicio"
          type="time"
          value={formData.horaInicio}
          onChange={(e) => {
            updateFormData('horaInicio', e.target.value);
            calculateDuration();
          }}
          error={errors.horaInicio}
          required
        />

        <Input
          label="Hora Fin"
          type="time"
          value={formData.horaFin}
          onChange={(e) => {
            updateFormData('horaFin', e.target.value);
            calculateDuration();
          }}
          error={errors.horaFin}
          required
        />

        <Input
          label="Duración (minutos)"
          type="number"
          value={formData.duracion}
          onChange={(e) => updateFormData('duracion', Number(e.target.value))}
          min="15"
          max="240"
          step="15"
          required
        />
      </div>
    </div>
  );

  // Paso 2: Configuración
  const renderConfiguration = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
        Configuración del Turno
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Turno *
          </label>
          <select
            value={formData.tipoTurno}
            onChange={(e) => updateFormData('tipoTurno', e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {AppointmentTypeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label} ({option.duration} min)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prioridad
          </label>
          <select
            value={formData.prioridad}
            onChange={(e) => updateFormData('prioridad', e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="normal">Normal</option>
            <option value="alta">Alta</option>
            <option value="urgente">Urgente</option>
          </select>
        </div>

        <Input
          label="Capacidad Máxima"
          type="number"
          value={formData.capacidadMaxima}
          onChange={(e) => updateFormData('capacidadMaxima', Number(e.target.value))}
          min="1"
          max="10"
          required
        />

        <Input
          label="Tarifa Base (S/)"
          type="number"
          value={formData.tarifaBase || ''}
          onChange={(e) => updateFormData('tarifaBase', Number(e.target.value))}
          min="0"
          step="0.01"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Servicios Permitidos *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">
          {['Consulta General', 'Limpieza dental', 'Endodoncia', 'Ortodoncia', 'Implantes', 'Cirugía oral'].map(servicio => (
            <label key={servicio} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.serviciosPermitidos.includes(servicio)}
                onChange={(e) => {
                  const newServicios = e.target.checked
                    ? [...formData.serviciosPermitidos, servicio]
                    : formData.serviciosPermitidos.filter(s => s !== servicio);
                  updateFormData('serviciosPermitidos', newServicios);
                }}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">{servicio}</span>
            </label>
          ))}
        </div>
        {errors.serviciosPermitidos && (
          <p className="mt-1 text-sm text-red-600">{errors.serviciosPermitidos}</p>
        )}
      </div>
    </div>
  );

  // Paso 3: Opciones avanzadas
  const renderAdvancedOptions = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
        Configuraciones Avanzadas
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={formData.configuraciones.permiteCancelacion}
            onChange={(e) => updateConfig('permiteCancelacion', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">
            Permite cancelación
          </label>
        </div>

        {formData.configuraciones.permiteCancelacion && (
          <Input
            label="Tiempo mínimo para cancelación (horas)"
            type="number"
            value={formData.configuraciones.tiempoCancelacion}
            onChange={(e) => updateConfig('tiempoCancelacion', Number(e.target.value))}
            min="1"
            max="168"
            error={errors.tiempoCancelacion}
          />
        )}

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={formData.configuraciones.permiteReagendamiento}
            onChange={(e) => updateConfig('permiteReagendamiento', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">
            Permite reagendamiento
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={formData.configuraciones.confirmacionRequerida}
            onChange={(e) => updateConfig('confirmacionRequerida', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">
            Requiere confirmación
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={formData.configuraciones.recordatoriosAutomaticos}
            onChange={(e) => updateConfig('recordatoriosAutomaticos', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">
            Recordatorios automáticos
          </label>
        </div>
      </div>
    </div>
  );

  // Paso 4: Recurrencia
  const renderRecurrence = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
        Configuración de Recurrencia
      </h3>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={formData.esRecurrente}
          onChange={(e) => updateFormData('esRecurrente', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label className="ml-2 block text-sm text-gray-900">
          Crear turnos recurrentes
        </label>
      </div>

      {formData.esRecurrente && (
        <div className="space-y-4 ml-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Recurrencia
              </label>
              <select
                value={formData.patronRecurrencia.tipo}
                onChange={(e) => updateRecurrence('tipo', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="diario">Diario</option>
                <option value="semanal">Semanal</option>
                <option value="mensual">Mensual</option>
              </select>
            </div>

            <Input
              label="Frecuencia"
              type="number"
              value={formData.patronRecurrencia.frecuencia}
              onChange={(e) => updateRecurrence('frecuencia', Number(e.target.value))}
              min="1"
              max="12"
            />
          </div>

          {formData.patronRecurrencia.tipo === 'semanal' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Días de la Semana
              </label>
              <div className="grid grid-cols-7 gap-2">
                {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day, index) => (
                  <label key={day} className="flex flex-col items-center">
                    <input
                      type="checkbox"
                      checked={formData.patronRecurrencia.diasSemana.includes(index + 1)}
                      onChange={(e) => {
                        const newDays = e.target.checked
                          ? [...formData.patronRecurrencia.diasSemana, index + 1]
                          : formData.patronRecurrencia.diasSemana.filter(d => d !== index + 1);
                        updateRecurrence('diasSemana', newDays);
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-xs text-gray-700 mt-1">{day}</span>
                  </label>
                ))}
              </div>
              {errors.diasSemana && (
                <p className="mt-1 text-sm text-red-600">{errors.diasSemana}</p>
              )}
            </div>
          )}

          <Input
            label="Fecha de Fin"
            type="date"
            value={formData.patronRecurrencia.fechaFin}
            onChange={(e) => updateRecurrence('fechaFin', e.target.value)}
            error={errors.fechaFin}
            min={formData.fecha}
          />
        </div>
      )}
    </div>
  );

  return (
    <Card title={formTitle}>
      {/* Indicador de progreso */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setCurrentStep(index)}
                className={`flex items-center text-sm font-medium ${
                  index === currentStep
                    ? 'text-blue-600'
                    : index < currentStep
                    ? 'text-green-600'
                    : 'text-gray-400'
                }`}
              >
                <span className={`flex items-center justify-center w-8 h-8 rounded-full border-2 mr-2 ${
                  index === currentStep
                    ? 'border-blue-600 bg-blue-50'
                    : index < currentStep
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-300 bg-gray-50'
                }`}>
                  {index < currentStep ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <StepIcon className="w-4 h-4" />
                  )}
                </span>
                <span className="hidden sm:inline">{step.title}</span>
              </button>
            );
          })}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Contenido del paso actual */}
      {renderCurrentStep()}

      {/* Navegación */}
      <div className="flex justify-between pt-6 border-t">
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
          
          {currentStep > 0 && (
            <LoadingButton
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={loading}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Anterior
            </LoadingButton>
          )}
        </div>

        <div>
          {currentStep < steps.length - 1 ? (
            <LoadingButton
              type="button"
              onClick={nextStep}
              disabled={loading}
            >
              Siguiente
              <ChevronRight className="w-4 h-4 ml-2" />
            </LoadingButton>
          ) : (
            <LoadingButton
              type="button"
              onClick={handleSubmit}
              loading={loading}
              loadingText={isEditMode ? 'Actualizando...' : 'Creando...'}
              disabled={loading}
            >
              <Save className="w-4 h-4 mr-2" />
              {isEditMode ? 'Actualizar' : 'Crear'} Turno{formData.esRecurrente ? 's' : ''}
            </LoadingButton>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ScheduleCreator;