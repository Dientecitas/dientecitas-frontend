import React, { useEffect } from 'react';
import { Save, X, Wand2 } from 'lucide-react';
import LoadingButton from '../../../shared/components/ui/LoadingButton';
import Input from '../../../shared/components/ui/Input';
import Card from '../../../shared/components/ui/Card';
import { useDistrictForm } from '../hooks/useDistrictForm';
import { ProvinceOptions, RegionOptions } from '../types/district.types';

const DistrictForm = ({ 
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
    formData,
    availableRegions,
    generateCode,
    handleProvinciaChange,
    hasChanges,
    provinceOptions,
    regionOptions
  } = useDistrictForm(initialData, onSubmit);

  // Generar código automáticamente cuando cambie nombre o provincia
  useEffect(() => {
    if (!initialData && formData.nombre && formData.provincia && !formData.codigo) {
      generateCode();
    }
  }, [formData.nombre, formData.provincia, initialData, generateCode]);

  const isEditMode = !!initialData;
  const formTitle = title || (isEditMode ? 'Editar Distrito' : 'Crear Distrito');

  return (
    <Card title={formTitle}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Input
              label="Nombre del Distrito"
              name="nombre"
              register={register}
              error={errors.nombre?.message}
              placeholder="Ej: Miraflores"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              {...register('descripcion')}
              rows={3}
              className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.descripcion ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Descripción detallada del distrito..."
            />
            {errors.descripcion && (
              <p className="mt-1 text-sm text-red-600">{errors.descripcion.message}</p>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Código del Distrito
              </label>
              {!isEditMode && (
                <LoadingButton
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={generateCode}
                  disabled={!formData.nombre || !formData.provincia}
                  className="text-xs"
                >
                  <Wand2 className="w-3 h-3 mr-1" />
                  Generar
                </LoadingButton>
              )}
            </div>
            <Input
              name="codigo"
              register={register}
              error={errors.codigo?.message}
              placeholder="LI-001"
              className="font-mono"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Formato: XX-000 (ej: LI-001, CA-002)
            </p>
          </div>

          <div>
            <Input
              label="Población (opcional)"
              name="poblacion"
              type="number"
              register={register}
              error={errors.poblacion?.message}
              placeholder="85065"
              min="1"
            />
          </div>
        </div>

        {/* Ubicación */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
            Ubicación
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Provincia *
              </label>
              <select
                {...register('provincia')}
                onChange={(e) => handleProvinciaChange(e.target.value)}
                className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.provincia ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar provincia</option>
                {provinceOptions.map(provincia => (
                  <option key={provincia} value={provincia}>
                    {provincia}
                  </option>
                ))}
              </select>
              {errors.provincia && (
                <p className="mt-1 text-sm text-red-600">{errors.provincia.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Región *
              </label>
              <select
                {...register('region')}
                disabled={!formData.provincia}
                className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  errors.region ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar región</option>
                {regionOptions.map(region => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
              {errors.region && (
                <p className="mt-1 text-sm text-red-600">{errors.region.message}</p>
              )}
              {!formData.provincia && (
                <p className="mt-1 text-xs text-gray-500">
                  Seleccione una provincia primero
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Estado */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
            Estado
          </h3>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('activo')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Distrito activo
            </label>
          </div>
          <p className="text-xs text-gray-500">
            Los distritos inactivos no aparecerán en las opciones de selección
          </p>
        </div>

        {/* Error general */}
        {errors.root && (
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
            {errors.root.message}
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <LoadingButton
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading || isSubmitting}
          >
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </LoadingButton>
          
          <LoadingButton
            type="submit"
            loading={loading || isSubmitting}
            loadingText={isEditMode ? 'Actualizando...' : 'Creando...'}
            disabled={!isValid || loading || isSubmitting}
            showSuccessState
          >
            <Save className="w-4 h-4 mr-2" />
            {isEditMode ? 'Actualizar' : 'Crear'} Distrito
          </LoadingButton>
        </div>

        {/* Indicador de cambios */}
        {isEditMode && hasChanges() && (
          <div className="text-xs text-orange-600 text-center">
            Hay cambios sin guardar
          </div>
        )}
      </form>
    </Card>
  );
};

export default DistrictForm;