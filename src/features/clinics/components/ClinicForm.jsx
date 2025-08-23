import React from 'react';
import { Save, X, Wand2, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import LoadingButton from '../../../shared/components/ui/LoadingButton';
import Input from '../../../shared/components/ui/Input';
import Card from '../../../shared/components/ui/Card';
import { useClinicForm } from '../hooks/useClinicForm';
import { useDistricts } from '../../districts/hooks/useDistricts';
import { 
  ServiceOptions, 
  SpecialtyOptions, 
  EquipmentOptions,
  CertificationOptions,
  CleaningMethodOptions
} from '../types/clinic.types';

const ClinicForm = ({ 
  initialData = null, 
  onSubmit, 
  onCancel, 
  loading = false,
  title = null 
}) => {
  const {
    register,
    handleSubmit,
    errors,
    isValid,
    isDirty,
    isSubmitting,
    generateCode,
    getValues,
    isEditMode,
    currentStep,
    steps,
    nextStep,
    prevStep,
    goToStep,
    validateCurrentStep,
    isFirstStep,
    isLastStep
  } = useClinicForm(initialData, onSubmit);

  const { districts, loading: loadingDistricts } = useDistricts();

  const formTitle = title || (isEditMode ? 'Editar Consultorio' : 'Crear Consultorio');
  const activeDistricts = districts?.filter(d => d.activo) || [];

  // Renderizar paso actual
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderBasicInfo();
      case 1:
        return renderContactInfo();
      case 2:
        return renderServicesInfo();
      case 3:
        return renderAdvancedInfo();
      default:
        return renderBasicInfo();
    }
  };

  // Paso 1: Información Básica
  const renderBasicInfo = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
        Información Básica
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Input
            label="Nombre del Consultorio"
            name="nombre"
            register={register}
            error={errors.nombre?.message}
            placeholder="Ej: Clínica Dental San Borja"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción *
          </label>
          <textarea
            {...register('descripcion')}
            rows={3}
            className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.descripcion ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Descripción detallada del consultorio..."
          />
          {errors.descripcion && (
            <p className="mt-1 text-sm text-red-600">{errors.descripcion.message}</p>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Código del Consultorio *
            </label>
            {!isEditMode && (
              <button
                type="button"
                onClick={() => {
                  const values = getValues();
                  if (values.nombre && values.distritoId && values.tipoClinica) {
                    generateCode();
                  }
                }}
                className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded hover:bg-blue-200 transition-colors"
              >
                <Wand2 className="w-3 h-3 mr-1" />
                Generar
              </button>
            )}
          </div>
          <Input
            name="codigo"
            register={register}
            error={errors.codigo?.message}
            placeholder="XX-XXX-000"
            className="font-mono"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Distrito *
          </label>
          <select
            {...register('distritoId')}
            className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.distritoId ? 'border-red-300' : 'border-gray-300'
            }`}
            disabled={loadingDistricts}
          >
            <option value="">Seleccionar distrito</option>
            {activeDistricts.map(distrito => (
              <option key={distrito.id} value={distrito.id}>
                {distrito.nombre}
              </option>
            ))}
          </select>
          {errors.distritoId && (
            <p className="mt-1 text-sm text-red-600">{errors.distritoId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Clínica *
          </label>
          <select
            {...register('tipoClinica')}
            className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.tipoClinica ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Seleccionar tipo</option>
            <option value="publica">Pública</option>
            <option value="privada">Privada</option>
            <option value="mixta">Mixta</option>
          </select>
          {errors.tipoClinica && (
            <p className="mt-1 text-sm text-red-600">{errors.tipoClinica.message}</p>
          )}
        </div>

        <div>
          <Input
            label="Capacidad de Consultorios"
            name="capacidadConsultorios"
            type="number"
            register={register}
            error={errors.capacidadConsultorios?.message}
            placeholder="1"
            min="1"
            max="50"
            required
          />
        </div>
      </div>
    </div>
  );

  // Paso 2: Contacto y Ubicación
  const renderContactInfo = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
        Contacto y Ubicación
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Input
            label="Dirección"
            name="direccion"
            register={register}
            error={errors.direccion?.message}
            placeholder="Av. San Borja Norte 1234"
            required
          />
        </div>

        <div className="md:col-span-2">
          <Input
            label="Referencia de Dirección (opcional)"
            name="referenciaDireccion"
            register={register}
            error={errors.referenciaDireccion?.message}
            placeholder="Frente al Hospital Nacional"
          />
        </div>

        <div>
          <Input
            label="Teléfono"
            name="telefono"
            register={register}
            error={errors.telefono?.message}
            placeholder="+51-1-2234567"
            required
          />
        </div>

        <div>
          <Input
            label="Email (opcional)"
            name="email"
            type="email"
            register={register}
            error={errors.email?.message}
            placeholder="info@clinica.com"
          />
        </div>

        <div className="md:col-span-2">
          <Input
            label="Sitio Web (opcional)"
            name="sitioWeb"
            type="url"
            register={register}
            error={errors.sitioWeb?.message}
            placeholder="https://www.clinica.com"
          />
        </div>
      </div>
    </div>
  );

  // Paso 3: Servicios y Especialidades
  const renderServicesInfo = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
        Servicios y Especialidades
      </h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Servicios Ofrecidos *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
          {ServiceOptions.map(servicio => (
            <label key={servicio} className="flex items-center">
              <input
                type="checkbox"
                value={servicio}
                {...register('servicios')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">{servicio}</span>
            </label>
          ))}
        </div>
        {errors.servicios && (
          <p className="mt-1 text-sm text-red-600">{errors.servicios.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Especialidades *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">
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
    </div>
  );

  // Paso 4: Configuración Avanzada
  const renderAdvancedInfo = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
        Configuración Avanzada
      </h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Equipamiento
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">
          {EquipmentOptions.map(equipo => (
            <label key={equipo} className="flex items-center">
              <input
                type="checkbox"
                value={equipo}
                {...register('equipamiento')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">{equipo}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Certificaciones
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">
          {CertificationOptions.map(cert => (
            <label key={cert} className="flex items-center">
              <input
                type="checkbox"
                value={cert}
                {...register('certificaciones')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">{cert}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Métodos de Limpieza *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">
          {CleaningMethodOptions.map(metodo => (
            <label key={metodo} className="flex items-center">
              <input
                type="checkbox"
                value={metodo}
                {...register('metodosLimpieza')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">{metodo}</span>
            </label>
          ))}
        </div>
        {errors.metodosLimpieza && (
          <p className="mt-1 text-sm text-red-600">{errors.metodosLimpieza.message}</p>
        )}
      </div>

      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900">Estado del Consultorio</h4>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('activo')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">
            Consultorio activo
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('verificado')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">
            Consultorio verificado
          </label>
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
                  <span>{index + 1}</span>
                )}
              </span>
              {step.title}
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
                disabled={!validateCurrentStep() || loading || isSubmitting}
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
              >
                <Save className="w-4 h-4 mr-2" />
                {isEditMode ? 'Actualizar' : 'Crear'} Consultorio
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

export default ClinicForm;