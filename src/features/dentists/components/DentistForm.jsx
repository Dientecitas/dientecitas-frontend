import React from 'react';
import { Save, X, ChevronLeft, ChevronRight, Check, User, UserCheck, Settings, Calendar, Clock } from 'lucide-react';
import LoadingButton from '../../../shared/components/ui/LoadingButton';
import Input from '../../../shared/components/ui/Input';
import Card from '../../../shared/components/ui/Card';
import { useDentistForm } from '../hooks/useDentistForm';
import { useClinics } from '../../clinics/hooks/useClinics';
import { SpecialtyOptions, ServiceOptions, DaysOfWeek } from '../types/dentist.types';

const DentistForm = ({ 
  initialData = null, 
  onSubmit, 
  onCancel, 
  loading = false,
  title = null 
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    errors,
    isValid,
    isDirty,
    isSubmitting,
    isEditMode,
    currentStep,
    steps,
    nextStep,
    prevStep,
    goToStep,
    validateCurrentStep,
    isFirstStep,
    isLastStep
  } = useDentistForm(initialData, onSubmit);

  const { clinics, loading: loadingClinics } = useClinics();

  const formTitle = title || (isEditMode ? 'Editar Dentista' : 'Crear Dentista');
  const activeClinics = clinics?.filter(c => c.activo) || [];

  // Renderizar paso actual
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderPersonalInfo();
      case 1:
        return renderProfessionalInfo();
      case 2:
        return renderServicesInfo();
      case 3:
        return renderScheduleInfo();
      case 4:
        return renderStatusInfo();
      default:
        return renderPersonalInfo();
    }
  };

  // Paso 1: Información Personal
  const renderPersonalInfo = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <User className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-medium text-gray-900">Información Personal</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Nombres"
          name="nombres"
          register={register}
          error={errors.nombres?.message}
          placeholder="Ej: Carlos Alberto"
          required
        />

        <Input
          label="Apellidos"
          name="apellidos"
          register={register}
          error={errors.apellidos?.message}
          placeholder="Ej: Mendoza Herrera"
          required
        />

        <Input
          label="DNI"
          name="dni"
          register={register}
          error={errors.dni?.message}
          placeholder="12345678"
          maxLength="8"
          required
        />

        <Input
          label="Fecha de Nacimiento"
          name="fechaNacimiento"
          type="date"
          register={register}
          error={errors.fechaNacimiento?.message}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Género
          </label>
          <select
            {...register('genero')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        <Input
          label="Celular"
          name="celular"
          register={register}
          error={errors.celular?.message}
          placeholder="987654321"
          required
        />

        <div className="md:col-span-2">
          <Input
            label="Email"
            name="email"
            type="email"
            register={register}
            error={errors.email?.message}
            placeholder="dentista@email.com"
            required
          />
        </div>

        <div className="md:col-span-2">
          <Input
            label="Dirección"
            name="direccion"
            register={register}
            error={errors.direccion?.message}
            placeholder="Av. Los Álamos 456, San Isidro"
          />
        </div>
      </div>
    </div>
  );

  // Paso 2: Información Profesional
  const renderProfessionalInfo = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <UserCheck className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-medium text-gray-900">Información Profesional</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Número de Colegiatura"
          name="numeroColegiatura"
          register={register}
          error={errors.numeroColegiatura?.message}
          placeholder="COP-12345"
          className="font-mono"
          required
        />

        <Input
          label="Años de Experiencia"
          name="añosExperiencia"
          type="number"
          register={register}
          error={errors.añosExperiencia?.message}
          placeholder="5"
          min="0"
          max="50"
          required
        />

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Consultorio *
          </label>
          <select
            {...register('consultorioId')}
            className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.consultorioId ? 'border-red-300' : 'border-gray-300'
            }`}
            disabled={loadingClinics}
          >
            <option value="">Seleccionar consultorio</option>
            {activeClinics.map(consultorio => (
              <option key={consultorio.id} value={consultorio.id}>
                {consultorio.nombre} - {consultorio.distrito?.nombre}
              </option>
            ))}
          </select>
          {errors.consultorioId && (
            <p className="mt-1 text-sm text-red-600">{errors.consultorioId.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Especialidades *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
            {SpecialtyOptions.map(especialidad => (
              <label key={especialidad} className="flex items-center">
                <input
                  type="checkbox"
                  value={especialidad}
                  {...register('especialidades')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{especialidad}</span>
              </label>
            ))}
          </div>
          {errors.especialidades && (
            <p className="mt-1 text-sm text-red-600">{errors.especialidades.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Biografía Profesional
          </label>
          <textarea
            {...register('biografia')}
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Descripción profesional, especialidades, experiencia destacada..."
          />
        </div>
      </div>
    </div>
  );

  // Paso 3: Servicios y Configuración
  const renderServicesInfo = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-medium text-gray-900">Servicios y Configuración</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Duración Consulta por Defecto (minutos)"
          name="duracionConsultaDefault"
          type="number"
          register={register}
          error={errors.duracionConsultaDefault?.message}
          placeholder="30"
          min="15"
          max="180"
          step="15"
          required
        />

        <Input
          label="Pacientes por Día"
          name="pacientesPorDia"
          type="number"
          register={register}
          error={errors.pacientesPorDia?.message}
          placeholder="10"
          min="1"
          max="50"
          required
        />

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Servicios Ofrecidos
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
            {ServiceOptions.map(servicio => (
              <label key={servicio} className="flex items-center">
                <input
                  type="checkbox"
                  value={servicio}
                  {...register('serviciosOfrecidos')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{servicio}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Paso 4: Horarios Disponibles
  const renderScheduleInfo = () => {
    const turnos = watch('turnosDisponibles') || [];
    
    const addTurno = () => {
      const newTurnos = [...turnos, {
        id: Date.now().toString(),
        fecha: '',
        horaInicio: '',
        horaFin: ''
      }];
      setValue('turnosDisponibles', newTurnos);
    };

    const removeTurno = (index) => {
      const newTurnos = turnos.filter((_, i) => i !== index);
      setValue('turnosDisponibles', newTurnos);
    };

    const updateTurno = (index, field, value) => {
      const newTurnos = [...turnos];
      newTurnos[index] = {
        ...newTurnos[index],
        [field]: value
      };
      setValue('turnosDisponibles', newTurnos);
    };

    const getTodayDate = () => {
      return new Date().toISOString().split('T')[0];
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-medium text-gray-900">Turnos Disponibles</h3>
          <span className="text-sm text-gray-500">({turnos.length} turnos configurados)</span>
        </div>
        
        {turnos.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No hay turnos configurados</h4>
            <p className="text-gray-600 mb-4">Agrega turnos disponibles para que los pacientes puedan reservar citas</p>
            <LoadingButton
              type="button"
              onClick={addTurno}
              variant="primary"
              size="sm"
            >
              <Clock className="w-4 h-4 mr-2" />
              Agregar Primer Turno
            </LoadingButton>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-900">Lista de Turnos</h4>
              <LoadingButton
                type="button"
                onClick={addTurno}
                variant="outline"
                size="sm"
              >
                <Clock className="w-4 h-4 mr-2" />
                Agregar Turno
              </LoadingButton>
            </div>
            
            <div className="max-h-64 overflow-y-auto space-y-3">
              {turnos.map((turno, index) => (
                <div key={turno.id || index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-sm font-medium text-gray-900">Turno {index + 1}</h5>
                    <LoadingButton
                      type="button"
                      onClick={() => removeTurno(index)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </LoadingButton>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Fecha *
                      </label>
                      <input
                        type="date"
                        value={turno.fecha}
                        min={getTodayDate()}
                        onChange={(e) => updateTurno(index, 'fecha', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Hora Inicio *
                      </label>
                      <input
                        type="time"
                        value={turno.horaInicio}
                        onChange={(e) => updateTurno(index, 'horaInicio', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Hora Fin *
                      </label>
                      <input
                        type="time"
                        value={turno.horaFin}
                        onChange={(e) => updateTurno(index, 'horaFin', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {errors.turnosDisponibles && (
          <p className="text-sm text-red-600">{errors.turnosDisponibles.message}</p>
        )}
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Información sobre turnos:</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Debe agregar al menos un turno disponible</li>
            <li>• Cada turno representa un slot específico de tiempo</li>
            <li>• Los pacientes podrán reservar citas en estos turnos</li>
            <li>• No se pueden agregar fechas anteriores a hoy</li>
          </ul>
        </div>
      </div>
    );
  };

  // Paso 5: Estado y Permisos
  const renderStatusInfo = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-medium text-gray-900">Estado y Permisos</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('activo')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">
            Dentista activo
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('verificado')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">
            Documentos verificados
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('aprobado')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">
            Aprobado para trabajar
          </label>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Información sobre los estados:</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• <strong>Activo:</strong> El dentista puede recibir citas</li>
            <li>• <strong>Verificado:</strong> Los documentos han sido revisados</li>
            <li>• <strong>Aprobado:</strong> Autorizado para trabajar en el sistema</li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <Card title={formTitle}>
      {/* Indicador de progreso */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          {steps.map((step, index) => (
            <button
              key={step.id}
              type="button"
              onClick={() => goToStep(index)}
              className={`flex items-center text-sm font-medium transition-colors ${
                index === currentStep
                  ? 'text-blue-600'
                  : index < currentStep
                  ? 'text-green-600'
                  : 'text-gray-400'
              }`}
            >
              <span className={`flex items-center justify-center w-8 h-8 rounded-full border-2 mr-2 transition-colors ${
                index === currentStep
                  ? 'border-blue-600 bg-blue-50'
                  : index < currentStep
                  ? 'border-green-600 bg-green-50'
                  : 'border-gray-300 bg-gray-50'
              }`}>
                {index < currentStep ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </span>
              <span className="hidden sm:inline">{step.title}</span>
            </button>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Renderizar paso actual */}
        {renderCurrentStep()}

        {/* Error general */}
        {errors.root && (
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
            {errors.root.message}
          </div>
        )}

        {/* Navegación entre pasos */}
        <div className="flex justify-between pt-6 border-t">
          <div className="flex gap-3">
            <LoadingButton
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading || isSubmitting}
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </LoadingButton>
            
            {!isFirstStep && (
              <LoadingButton
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={loading || isSubmitting}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Anterior
              </LoadingButton>
            )}
          </div>

          <div>
            {!isLastStep ? (
              <LoadingButton
                type="button"
                onClick={nextStep}
                disabled={loading || isSubmitting}
              >
                Siguiente
                <ChevronRight className="w-4 h-4 ml-2" />
              </LoadingButton>
            ) : (
              <LoadingButton
                type="submit"
                loading={loading || isSubmitting}
                loadingText={isEditMode ? 'Actualizando...' : 'Creando...'}
                disabled={!isValid || loading || isSubmitting}
                showSuccessState
              >
                <Save className="w-4 h-4 mr-2" />
                {isEditMode ? 'Actualizar' : 'Crear'} Dentista
              </LoadingButton>
            )}
          </div>
        </div>

        {/* Indicador de cambios */}
        {isEditMode && isDirty && (
          <div className="text-xs text-orange-600 text-center">
            Hay cambios sin guardar
          </div>
        )}
      </form>
    </Card>
  );
};

export default DentistForm;