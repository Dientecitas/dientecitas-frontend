import React, { useState, useEffect } from 'react';
import { Heart, AlertTriangle, Plus, X, Calendar, Pill, Activity, FileText } from 'lucide-react';
import Card from '../../../shared/components/ui/Card';
import LoadingButton from '../../../shared/components/ui/LoadingButton';
import Input from '../../../shared/components/ui/Input';
import { useMedicalHistory } from '../hooks/useMedicalHistory';
import { medicalAlertSystem } from '../services/medicalAlertSystem';
import { 
  AllergyOptions, 
  AllergySeverityOptions, 
  MedicalConditionOptions 
} from '../types/patient.types';
import { formatDate } from '../utils/patientHelpers';

const MedicalHistory = ({ 
  patientId, 
  patient, 
  onUpdate,
  readOnly = false,
  showAlerts = true 
}) => {
  const {
    medicalHistory,
    loading,
    error,
    fetchMedicalHistory,
    updateMedicalCondition,
    addAllergy,
    checkDrugInteractions
  } = useMedicalHistory(patientId);

  const [activeTab, setActiveTab] = useState('overview');
  const [medicalAlerts, setMedicalAlerts] = useState([]);
  const [drugInteractions, setDrugInteractions] = useState([]);

  // Cargar historial al montar
  useEffect(() => {
    if (patientId) {
      fetchMedicalHistory(patientId);
    }
  }, [patientId, fetchMedicalHistory]);

  // Generar alertas médicas cuando cambie el paciente
  useEffect(() => {
    if (patient) {
      const alerts = medicalAlertSystem.generateAlerts(patient);
      setMedicalAlerts(alerts);
    }
  }, [patient]);

  // Verificar interacciones medicamentosas
  useEffect(() => {
    if (patient?.medicamentosActuales && patient.medicamentosActuales.length > 1) {
      checkDrugInteractions(patient.medicamentosActuales).then(interactions => {
        setDrugInteractions(interactions);
      });
    }
  }, [patient?.medicamentosActuales, checkDrugInteractions]);

  const tabs = [
    { id: 'overview', label: 'Resumen Médico', icon: Activity },
    { id: 'allergies', label: 'Alergias', icon: AlertTriangle },
    { id: 'conditions', label: 'Condiciones', icon: Heart },
    { id: 'medications', label: 'Medicamentos', icon: Pill },
    { id: 'dental', label: 'Historial Dental', icon: FileText }
  ];

  if (loading) {
    return (
      <Card title="Historial Médico">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card title="Historial Médico" className="border-red-200 bg-red-50">
        <div className="text-red-700">
          Error al cargar el historial médico: {error}
        </div>
      </Card>
    );
  }

  // Renderizar resumen médico
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Alertas médicas críticas */}
      {showAlerts && medicalAlerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-red-800 mb-3 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Alertas Médicas Críticas
          </h4>
          <div className="space-y-2">
            {medicalAlerts.map((alert, index) => (
              <div key={index} className={`p-2 rounded text-sm bg-${alert.color}-100 text-${alert.color}-800`}>
                {alert.message}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interacciones medicamentosas */}
      {drugInteractions.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-yellow-800 mb-3 flex items-center">
            <Pill className="w-4 h-4 mr-2" />
            Posibles Interacciones Medicamentosas
          </h4>
          <div className="space-y-2">
            {drugInteractions.map((interaction, index) => (
              <div key={index} className="p-2 rounded text-sm bg-yellow-100 text-yellow-800">
                <strong>{interaction.drugs.join(' + ')}</strong>
                <br />
                {interaction.recommendation}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resumen de información médica */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Alergias" className="h-32">
          <div className="text-2xl font-bold text-red-600">
            {patient?.alergias?.length || 0}
          </div>
          <div className="text-sm text-gray-600">
            {patient?.alergias?.filter(a => a.severidad === 'severa').length || 0} severas
          </div>
        </Card>

        <Card title="Condiciones Médicas" className="h-32">
          <div className="text-2xl font-bold text-orange-600">
            {patient?.condicionesMedicas?.length || 0}
          </div>
          <div className="text-sm text-gray-600">
            {patient?.condicionesMedicas?.filter(c => !c.controlado).length || 0} no controladas
          </div>
        </Card>

        <Card title="Medicamentos Actuales" className="h-32">
          <div className="text-2xl font-bold text-blue-600">
            {patient?.medicamentosActuales?.length || 0}
          </div>
          <div className="text-sm text-gray-600">
            {drugInteractions.length} interacciones
          </div>
        </Card>
      </div>

      {/* Puntuación de riesgo */}
      <Card title="Evaluación de Riesgo Odontológico">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-gray-900">
              {patient?.puntuacionRiesgo || 1}/10
            </div>
            <div className={`text-sm font-medium ${
              (patient?.puntuacionRiesgo || 1) <= 3 ? 'text-green-600' :
              (patient?.puntuacionRiesgo || 1) <= 6 ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {(patient?.puntuacionRiesgo || 1) <= 3 ? 'Riesgo Bajo' :
               (patient?.puntuacionRiesgo || 1) <= 6 ? 'Riesgo Medio' :
               'Riesgo Alto'}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Última evaluación:</div>
            <div className="text-sm text-gray-900">
              {formatDate(patient?.fechaUltimaActualizacion)}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  // Renderizar alergias
  const renderAllergies = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          Alergias ({patient?.alergias?.length || 0})
        </h3>
        {!readOnly && (
          <LoadingButton
            size="sm"
            onClick={() => {/* Implementar agregar alergia */}}
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Alergia
          </LoadingButton>
        )}
      </div>

      {!patient?.alergias || patient.alergias.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No hay alergias registradas
        </div>
      ) : (
        <div className="space-y-3">
          {patient.alergias.map((alergia, index) => (
            <div key={index} className={`p-4 rounded-lg border ${
              alergia.severidad === 'severa' ? 'border-red-200 bg-red-50' :
              alergia.severidad === 'moderada' ? 'border-yellow-200 bg-yellow-50' :
              'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{alergia.alergia}</h4>
                  <p className="text-sm text-gray-600">
                    Severidad: <span className={`font-medium ${
                      alergia.severidad === 'severa' ? 'text-red-600' :
                      alergia.severidad === 'moderada' ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {alergia.severidad}
                    </span>
                  </p>
                  {alergia.reaccion && (
                    <p className="text-sm text-gray-600">
                      Reacción: {alergia.reaccion}
                    </p>
                  )}
                  {alergia.fechaDiagnostico && (
                    <p className="text-xs text-gray-500">
                      Diagnosticada: {formatDate(alergia.fechaDiagnostico)}
                    </p>
                  )}
                </div>
                {alergia.severidad === 'severa' && (
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Renderizar condiciones médicas
  const renderConditions = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          Condiciones Médicas ({patient?.condicionesMedicas?.length || 0})
        </h3>
        {!readOnly && (
          <LoadingButton
            size="sm"
            onClick={() => {/* Implementar agregar condición */}}
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Condición
          </LoadingButton>
        )}
      </div>

      {!patient?.condicionesMedicas || patient.condicionesMedicas.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No hay condiciones médicas registradas
        </div>
      ) : (
        <div className="space-y-3">
          {patient.condicionesMedicas.map((condicion, index) => (
            <div key={index} className={`p-4 rounded-lg border ${
              condicion.controlado ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{condicion.condicion}</h4>
                  <p className="text-sm text-gray-600">
                    Estado: <span className={`font-medium ${
                      condicion.controlado ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {condicion.controlado ? 'Controlado' : 'No controlado'}
                    </span>
                  </p>
                  {condicion.medicamentos && (
                    <p className="text-sm text-gray-600">
                      Medicamentos: {condicion.medicamentos}
                    </p>
                  )}
                  {condicion.fechaDiagnostico && (
                    <p className="text-xs text-gray-500">
                      Diagnosticada: {formatDate(condicion.fechaDiagnostico)}
                    </p>
                  )}
                  {condicion.observaciones && (
                    <p className="text-sm text-gray-600 mt-2">
                      {condicion.observaciones}
                    </p>
                  )}
                </div>
                <Heart className={`w-6 h-6 ${
                  condicion.controlado ? 'text-green-500' : 'text-orange-500'
                }`} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Renderizar medicamentos actuales
  const renderMedications = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          Medicamentos Actuales ({patient?.medicamentosActuales?.length || 0})
        </h3>
        {!readOnly && (
          <LoadingButton
            size="sm"
            onClick={() => {/* Implementar agregar medicamento */}}
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Medicamento
          </LoadingButton>
        )}
      </div>

      {!patient?.medicamentosActuales || patient.medicamentosActuales.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No hay medicamentos actuales registrados
        </div>
      ) : (
        <div className="space-y-3">
          {patient.medicamentosActuales.map((medicamento, index) => (
            <div key={index} className="p-4 rounded-lg border border-blue-200 bg-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{medicamento.medicamento}</h4>
                  <p className="text-sm text-gray-600">
                    Dosis: {medicamento.dosis} • Frecuencia: {medicamento.frecuencia}
                  </p>
                  {medicamento.motivo && (
                    <p className="text-sm text-gray-600">
                      Motivo: {medicamento.motivo}
                    </p>
                  )}
                  {medicamento.prescriptoPor && (
                    <p className="text-xs text-gray-500">
                      Prescrito por: {medicamento.prescriptoPor}
                    </p>
                  )}
                  {medicamento.fechaInicio && (
                    <p className="text-xs text-gray-500">
                      Desde: {formatDate(medicamento.fechaInicio)}
                    </p>
                  )}
                </div>
                <Pill className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Renderizar historial dental
  const renderDentalHistory = () => (
    <div className="space-y-6">
      {/* Tratamientos anteriores */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-3">
          Tratamientos Anteriores
        </h4>
        {!patient?.historialOdontologico?.tratamientosAnteriores || 
         patient.historialOdontologico.tratamientosAnteriores.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No hay tratamientos anteriores registrados
          </div>
        ) : (
          <div className="space-y-3">
            {patient.historialOdontologico.tratamientosAnteriores.map((tratamiento, index) => (
              <div key={index} className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium text-gray-900">{tratamiento.tipo}</h5>
                    {tratamiento.diente && (
                      <p className="text-sm text-gray-600">Diente: {tratamiento.diente}</p>
                    )}
                    <p className="text-sm text-gray-600">
                      Fecha: {formatDate(tratamiento.fecha)}
                    </p>
                    {tratamiento.dentista && (
                      <p className="text-sm text-gray-600">
                        Dentista: {tratamiento.dentista}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">
                      Resultado: {tratamiento.resultado}
                    </p>
                    {tratamiento.costo && (
                      <p className="text-sm text-gray-600">
                        Costo: S/ {tratamiento.costo}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Problemas actuales */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-3">
          Problemas Actuales
        </h4>
        {!patient?.historialOdontologico?.problemasActuales || 
         patient.historialOdontologico.problemasActuales.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No hay problemas actuales registrados
          </div>
        ) : (
          <div className="space-y-3">
            {patient.historialOdontologico.problemasActuales.map((problema, index) => (
              <div key={index} className={`p-3 rounded-lg border ${
                problema.severidad === 'urgente' ? 'border-red-200 bg-red-50' :
                problema.severidad === 'severa' ? 'border-orange-200 bg-orange-50' :
                'border-yellow-200 bg-yellow-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium text-gray-900">{problema.problema}</h5>
                    {problema.diente && (
                      <p className="text-sm text-gray-600">Diente: {problema.diente}</p>
                    )}
                    <p className="text-sm text-gray-600">
                      Severidad: <span className={`font-medium ${
                        problema.severidad === 'urgente' ? 'text-red-600' :
                        problema.severidad === 'severa' ? 'text-orange-600' :
                        'text-yellow-600'
                      }`}>
                        {problema.severidad}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Detectado: {formatDate(problema.fechaDeteccion)}
                    </p>
                    {problema.sintomas && problema.sintomas.length > 0 && (
                      <p className="text-sm text-gray-600">
                        Síntomas: {problema.sintomas.join(', ')}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">
                      Estado: <span className={`font-medium ${
                        problema.estado === 'resuelto' ? 'text-green-600' :
                        problema.estado === 'en_tratamiento' ? 'text-blue-600' :
                        'text-orange-600'
                      }`}>
                        {problema.estado === 'resuelto' ? 'Resuelto' :
                         problema.estado === 'en_tratamiento' ? 'En tratamiento' :
                         'Pendiente'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Información de ortodoncia */}
      {patient?.historialOdontologico?.ortodoncia?.haUsado && (
        <Card title="Historial de Ortodoncia">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              <strong>Tipo:</strong> {patient.historialOdontologico.ortodoncia.tipo}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Período:</strong> {patient.historialOdontologico.ortodoncia.fechas}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Resultado:</strong> {patient.historialOdontologico.ortodoncia.resultado}
            </p>
          </div>
        </Card>
      )}
    </div>
  );

  return (
    <Card title="Historial Médico" className="min-h-96">
      {/* Navegación por pestañas */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenido de la pestaña activa */}
      <div className="min-h-64">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'allergies' && renderAllergies()}
        {activeTab === 'conditions' && renderConditions()}
        {activeTab === 'medications' && renderMedications()}
        {activeTab === 'dental' && renderDentalHistory()}
      </div>
    </Card>
  );
};

export default MedicalHistory;