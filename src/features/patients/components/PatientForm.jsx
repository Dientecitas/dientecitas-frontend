import React from 'react';
import { Save, X, ChevronLeft, ChevronRight, Check, User, Heart, Shield, Phone, Calendar, Settings } from 'lucide-react';
import LoadingButton from '../../../shared/components/ui/LoadingButton';
import Input from '../../../shared/components/ui/Input';
import Card from '../../../shared/components/ui/Card';
import { usePatientForm } from '../hooks/usePatientForm';
import { useClinics } from '../../clinics/hooks/useClinics';
import { useDentists } from '../../dentists/hooks/useDentists';
import { 
  GenderOptions, 
  MaritalStatusOptions, 
  BloodTypeOptions,
  AllergyOptions,
  AllergySeverityOptions,
  MedicalConditionOptions,
  InsuranceProviders,
  CommunicationChannels,
  ReminderFrequencyOptions,
  BrushingFrequencyOptions,
  DietSugarOptions,
  AlcoholFrequencyOptions,
  RelationshipOptions,
  LanguageOptions
} from '../types/patient.types';

const PatientForm = ({ 
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
    isLastStep,
    addEmergencyContact,
    removeEmergencyContact,
    addAllergy,
    removeAllergy,
    addMedicalCondition,
    removeMedicalCondition,
    addCurrentMedication,
    removeCurrentMedication
  } = usePatientForm(initialData, onSubmit);

  const { clinics, loading: loadingClinics } = useClinics();
  const { dentists, loading: loadingDentists } = useDentists();

  const formTitle = title || (isEditMode ? 'Editar Paciente' : 'Registrar Paciente');
  const activeClinics = clinics?.filter(c => c.activo) || [];
  const activeDentists = dentists?.filter(d => d.activo) || [];

  // Renderizar paso actual
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderPersonalInfo();
      case 1:
        return renderContactInfo();
      case 2:
        return renderEmergencyContacts();
      case 3:
        return renderMedicalInfo();
      case 4:
        return renderHabitsInfo();
      case 5:
        return renderInsurancePreferences();
      case 6:
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
          placeholder="Ej: María Elena"
          required
        />

        <Input
          label="Apellidos"
          name="apellidos"
          register={register}
          error={errors.apellidos?.message}
          placeholder="Ej: González Pérez"
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
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Género *
          </label>
          <select
            {...register('genero')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {GenderOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.genero && (
            <p className="mt-1 text-sm text-red-600">{errors.genero.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado Civil
          </label>
          <select
            {...register('estadoCivil')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {MaritalStatusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <Input
            label="Ocupación"
            name="ocupacion"
            register={register}
            error={errors.ocupacion?.message}
            placeholder="Ej: Profesora, Ingeniero, Estudiante"
          />
        </div>
      </div>
    </div>
  );

  // Paso 2: Contacto y Ubicación
  const renderContactInfo = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Phone className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-medium text-gray-900">Contacto y Ubicación</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Teléfono Principal"
          name="telefono"
          register={register}
          error={errors.telefono?.message}
          placeholder="+51-1-987654321"
          required
        />

        <Input
          label="Teléfono Alternativo"
          name="telefonoAlternativo"
          register={register}
          error={errors.telefonoAlternativo?.message}
          placeholder="+51-1-123456789"
        />

        <div className="md:col-span-2">
          <Input
            label="Email"
            name="email"
            type="email"
            register={register}
            error={errors.email?.message}
            placeholder="paciente@email.com"
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
            required
          />
        </div>

        <Input
          label="Distrito"
          name="distrito"
          register={register}
          error={errors.distrito?.message}
          placeholder="San Isidro"
        />

        <Input
          label="Provincia"
          name="provincia"
          register={register}
          error={errors.provincia?.message}
          placeholder="Lima"
        />
      </div>
    </div>
  );

  // Paso 3: Contactos de Emergencia
  const renderEmergencyContacts = () => {
    const contacts = watch('contactosEmergencia') || [];
    
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-medium text-gray-900">Contactos de Emergencia</h3>
          <span className="text-sm text-gray-500">({contacts.length} contactos)</span>
        </div>
        
        {contacts.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No hay contactos de emergencia</h4>
            <p className="text-gray-600 mb-4">Agrega al menos un contacto de emergencia</p>
            <LoadingButton
              type="button"
              onClick={addEmergencyContact}
              variant="primary"
              size="sm"
            >
              <Phone className="w-4 h-4 mr-2" />
              Agregar Contacto
            </LoadingButton>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-900">Lista de Contactos</h4>
              <LoadingButton
                type="button"
                onClick={addEmergencyContact}
                variant="outline"
                size="sm"
                disabled={contacts.length >= 5}
              >
                <Phone className="w-4 h-4 mr-2" />
                Agregar Contacto
              </LoadingButton>
            </div>
            
            <div className="space-y-3">
              {contacts.map((contact, index) => (
                <div key={contact.id || index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-sm font-medium text-gray-900">
                      Contacto {index + 1} {contact.esPrincipal && '(Principal)'}
                    </h5>
                    <LoadingButton
                      type="button"
                      onClick={() => removeEmergencyContact(index)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      disabled={contacts.length === 1}
                    >
                      <X className="w-4 h-4" />
                    </LoadingButton>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      label="Nombres y Apellidos"
                      value={contact.nombres}
                      onChange={(e) => {
                        const newContacts = [...contacts];
                        newContacts[index] = { ...newContacts[index], nombres: e.target.value };
                        setValue('contactosEmergencia', newContacts);
                      }}
                      placeholder="Nombre completo"
                      required
                    />
                    <Input
                      label="Teléfono"
                      value={contact.telefono}
                      onChange={(e) => {
                        const newContacts = [...contacts];
                        newContacts[index] = { ...newContacts[index], telefono: e.target.value };
                        setValue('contactosEmergencia', newContacts);
                      }}
                      placeholder="+51-1-999888777"
                      required
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Relación *
                      </label>
                      <select
                        value={contact.relacion}
                        onChange={(e) => {
                          const newContacts = [...contacts];
                          newContacts[index] = { ...newContacts[index], relacion: e.target.value };
                          setValue('contactosEmergencia', newContacts);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Seleccionar relación</option>
                        {RelationshipOptions.map(relation => (
                          <option key={relation} value={relation}>
                            {relation}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={contact.esPrincipal}
                        onChange={(e) => {
                          const newContacts = [...contacts];
                          // Solo uno puede ser principal
                          newContacts.forEach((c, i) => {
                            c.esPrincipal = i === index ? e.target.checked : false;
                          });
                          setValue('contactosEmergencia', newContacts);
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Contacto principal</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {errors.contactosEmergencia && (
          <p className="text-sm text-red-600">{errors.contactosEmergencia.message}</p>
        )}
      </div>
    );
  };

  // Paso 4: Información Médica
  const renderMedicalInfo = () => {
    const alergias = watch('alergias') || [];
    const condiciones = watch('condicionesMedicas') || [];
    const medicamentos = watch('medicamentosActuales') || [];
    
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-medium text-gray-900">Información Médica</h3>
        </div>
        
        {/* Información física básica */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Sangre
            </label>
            <select
              {...register('tipoSangre')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar</option>
              {BloodTypeOptions.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Peso (kg)"
            name="peso"
            type="number"
            register={register}
            error={errors.peso?.message}
            placeholder="65"
            min="0.5"
            max="300"
            step="0.1"
          />

          <Input
            label="Altura (cm)"
            name="altura"
            type="number"
            register={register}
            error={errors.altura?.message}
            placeholder="165"
            min="30"
            max="250"
          />
        </div>

        {/* Alergias */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-900">Alergias ({alergias.length})</h4>
            <LoadingButton
              type="button"
              onClick={addAllergy}
              variant="outline"
              size="sm"
              disabled={alergias.length >= 20}
            >
              Agregar Alergia
            </LoadingButton>
          </div>
          
          {alergias.length === 0 ? (
            <div className="text-center py-4 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">No hay alergias registradas</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alergias.map((alergia, index) => (
                <div key={alergia.id || index} className="border border-gray-200 rounded-lg p-3 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <h6 className="text-sm font-medium text-gray-900">Alergia {index + 1}</h6>
                    <LoadingButton
                      type="button"
                      onClick={() => removeAllergy(index)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </LoadingButton>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Alergia *
                      </label>
                      <select
                        value={alergia.alergia}
                        onChange={(e) => {
                          const newAlergias = [...alergias];
                          newAlergias[index] = { ...newAlergias[index], alergia: e.target.value };
                          setValue('alergias', newAlergias);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        required
                      >
                        <option value="">Seleccionar alergia</option>
                        {AllergyOptions.map(option => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Severidad *
                      </label>
                      <select
                        value={alergia.severidad}
                        onChange={(e) => {
                          const newAlergias = [...alergias];
                          newAlergias[index] = { ...newAlergias[index], severidad: e.target.value };
                          setValue('alergias', newAlergias);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        required
                      >
                        {AllergySeverityOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Input
                      label="Reacción"
                      value={alergia.reaccion}
                      onChange={(e) => {
                        const newAlergias = [...alergias];
                        newAlergias[index] = { ...newAlergias[index], reaccion: e.target.value };
                        setValue('alergias', newAlergias);
                      }}
                      placeholder="Describe la reacción"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Condiciones Médicas */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-900">Condiciones Médicas ({condiciones.length})</h4>
            <LoadingButton
              type="button"
              onClick={addMedicalCondition}
              variant="outline"
              size="sm"
              disabled={condiciones.length >= 15}
            >
              Agregar Condición
            </LoadingButton>
          </div>
          
          {condiciones.length === 0 ? (
            <div className="text-center py-4 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">No hay condiciones médicas registradas</p>
            </div>
          ) : (
            <div className="space-y-3">
              {condiciones.map((condicion, index) => (
                <div key={condicion.id || index} className="border border-gray-200 rounded-lg p-3 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <h6 className="text-sm font-medium text-gray-900">Condición {index + 1}</h6>
                    <LoadingButton
                      type="button"
                      onClick={() => removeMedicalCondition(index)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </LoadingButton>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Condición *
                      </label>
                      <select
                        value={condicion.condicion}
                        onChange={(e) => {
                          const newCondiciones = [...condiciones];
                          newCondiciones[index] = { ...newCondiciones[index], condicion: e.target.value };
                          setValue('condicionesMedicas', newCondiciones);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        required
                      >
                        <option value="">Seleccionar condición</option>
                        {MedicalConditionOptions.map(option => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={condicion.controlado}
                          onChange={(e) => {
                            const newCondiciones = [...condiciones];
                            newCondiciones[index] = { ...newCondiciones[index], controlado: e.target.checked };
                            setValue('condicionesMedicas', newCondiciones);
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Controlado</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <Input
                      label="Medicamentos"
                      value={condicion.medicamentos}
                      onChange={(e) => {
                        const newCondiciones = [...condiciones];
                        newCondiciones[index] = { ...newCondiciones[index], medicamentos: e.target.value };
                        setValue('condicionesMedicas', newCondiciones);
                      }}
                      placeholder="Medicamentos para esta condición"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Medicamentos Actuales */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-900">Medicamentos Actuales ({medicamentos.length})</h4>
            <LoadingButton
              type="button"
              onClick={addCurrentMedication}
              variant="outline"
              size="sm"
              disabled={medicamentos.length >= 30}
            >
              Agregar Medicamento
            </LoadingButton>
          </div>
          
          {medicamentos.length === 0 ? (
            <div className="text-center py-4 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">No hay medicamentos actuales registrados</p>
            </div>
          ) : (
            <div className="space-y-3">
              {medicamentos.map((medicamento, index) => (
                <div key={medicamento.id || index} className="border border-gray-200 rounded-lg p-3 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <h6 className="text-sm font-medium text-gray-900">Medicamento {index + 1}</h6>
                    <LoadingButton
                      type="button"
                      onClick={() => removeCurrentMedication(index)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </LoadingButton>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Input
                      label="Medicamento"
                      value={medicamento.medicamento}
                      onChange={(e) => {
                        const newMedicamentos = [...medicamentos];
                        newMedicamentos[index] = { ...newMedicamentos[index], medicamento: e.target.value };
                        setValue('medicamentosActuales', newMedicamentos);
                      }}
                      placeholder="Nombre del medicamento"
                      required
                    />
                    <Input
                      label="Dosis"
                      value={medicamento.dosis}
                      onChange={(e) => {
                        const newMedicamentos = [...medicamentos];
                        newMedicamentos[index] = { ...newMedicamentos[index], dosis: e.target.value };
                        setValue('medicamentosActuales', newMedicamentos);
                      }}
                      placeholder="10mg, 1 tableta"
                      required
                    />
                    <Input
                      label="Frecuencia"
                      value={medicamento.frecuencia}
                      onChange={(e) => {
                        const newMedicamentos = [...medicamentos];
                        newMedicamentos[index] = { ...newMedicamentos[index], frecuencia: e.target.value };
                        setValue('medicamentosActuales', newMedicamentos);
                      }}
                      placeholder="Una vez al día"
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Paso 5: Hábitos y Estilo de Vida
  const renderHabitsInfo = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-medium text-gray-900">Hábitos y Estilo de Vida</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hábitos de riesgo */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900">Hábitos de Riesgo</h4>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('habitos.fumador')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Fumador
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('habitos.consumeAlcohol')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Consume alcohol
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('habitos.rechinarDientes')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Rechina los dientes (bruxismo)
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('habitos.morderUñas')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Se muerde las uñas
            </label>
          </div>
        </div>

        {/* Higiene bucal */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900">Higiene Bucal</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Frecuencia de Cepillado
            </label>
            <select
              {...register('habitos.cepilladoFrecuencia')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {BrushingFrequencyOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('habitos.usoHiloDental')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Usa hilo dental
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('habitos.enjuagueBucal')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Usa enjuague bucal
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dieta Azucarada
            </label>
            <select
              {...register('habitos.dietaAzucarada')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {DietSugarOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  // Paso 6: Seguro y Preferencias
  const renderInsurancePreferences = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-medium text-gray-900">Seguro y Preferencias</h3>
      </div>
      
      {/* Información del seguro */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-900">Información del Seguro</h4>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('informacionSeguro.tieneSeguro')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">
            Tiene seguro médico
          </label>
        </div>

        {watch('informacionSeguro.tieneSeguro') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Compañía de Seguro
              </label>
              <select
                {...register('informacionSeguro.compañia')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccionar compañía</option>
                {InsuranceProviders.map(provider => (
                  <option key={provider} value={provider}>
                    {provider}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Número de Póliza"
              name="informacionSeguro.numeroPoliza"
              register={register}
              placeholder="PS-2024-456789"
            />

            <Input
              label="Cobertura Dental (%)"
              name="informacionSeguro.coberturaDental"
              type="number"
              register={register}
              placeholder="80"
              min="0"
              max="100"
            />

            <Input
              label="Copago (S/)"
              name="informacionSeguro.copago"
              type="number"
              register={register}
              placeholder="50"
              min="0"
            />
          </div>
        )}
      </div>

      {/* Preferencias de comunicación */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-900">Preferencias de Comunicación</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Idioma Preferido
            </label>
            <select
              {...register('preferencias.idioma')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {LanguageOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Canal de Comunicación Preferido
            </label>
            <select
              {...register('preferencias.comunicacionPreferida')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {CommunicationChannels.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Frecuencia de Recordatorios
            </label>
            <select
              {...register('preferencias.frecuenciaRecordatorios')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {ReminderFrequencyOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Consultorio Preferido
            </label>
            <select
              {...register('consultorioPreferido')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loadingClinics}
            >
              <option value="">Seleccionar consultorio</option>
              {activeClinics.map(consultorio => (
                <option key={consultorio.id} value={consultorio.id}>
                  {consultorio.nombre} - {consultorio.distrito?.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  // Paso 7: Estado y Permisos
  const renderStatusInfo = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-blue-600" />
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
            Paciente activo
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

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Información sobre los estados:</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• <strong>Activo:</strong> El paciente puede agendar citas</li>
            <li>• <strong>Verificado:</strong> Los documentos han sido revisados</li>
            <li>• <strong>Registro Completo:</strong> Se calcula automáticamente</li>
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
                loadingText={isEditMode ? 'Actualizando...' : 'Registrando...'}
                disabled={!isValid || loading || isSubmitting}
                showSuccessState
              >
                <Save className="w-4 h-4 mr-2" />
                {isEditMode ? 'Actualizar' : 'Registrar'} Paciente
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

export default PatientForm;