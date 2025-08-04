import React, { useState, useCallback, useEffect } from 'react';
import { ArrowLeft, Save, Mic, FileText, User, Baby } from 'lucide-react';
import AudioRecorder from './AudioRecorder';
import TranscriptionResults from './TranscriptionResults';
import { useConsultations } from '../hooks/useSupabase';

interface UnifiedConsultationFormProps {
  patient?: any;
  onComplete: () => void;
  onBack: () => void;
}

const UnifiedConsultationForm: React.FC<UnifiedConsultationFormProps> = ({
  patient,
  onComplete,
  onBack
}) => {
  const [currentStep, setCurrentStep] = useState<'patient' | 'recording' | 'form' | 'complete'>('patient');
  const [transcriptionData, setTranscriptionData] = useState<any>(null);
  const [formData, setFormData] = useState({
    // Datos del paciente
    patient_id: patient?.id || '',
    patient_name: patient?.full_name || '',
    patient_age: patient?.age || '',
    patient_gender: patient?.gender || '',
    
    // Tipo de consulta
    consultation_type: 'adulto',
    
    // Síntomas principales
    main_symptoms: '',
    symptom_duration: '',
    symptom_severity: 'leve',
    
    // Antecedentes
    medical_history: '',
    current_medications: '',
    allergies: '',
    
    // Examen físico
    vital_signs: {
      blood_pressure: '',
      heart_rate: '',
      temperature: '',
      weight: '',
      height: ''
    },
    
    // Diagnóstico y tratamiento
    diagnosis: '',
    treatment_plan: '',
    recommendations: '',
    
    // Notas adicionales
    notes: '',
    
    // Datos de transcripción
    transcription: '',
    ai_analysis: null
  });

  const { createConsultation, loading } = useConsultations();

  // Actualizar datos del paciente cuando se selecciona
  useEffect(() => {
    if (patient) {
      setFormData(prev => ({
        ...prev,
        patient_id: patient.id,
        patient_name: patient.full_name,
        patient_age: patient.age,
        patient_gender: patient.gender
      }));
    }
  }, [patient]);

  const handleTranscriptionComplete = useCallback((data: any) => {
    setTranscriptionData(data);
    setFormData(prev => ({
      ...prev,
      transcription: data.transcription || '',
      ai_analysis: data.analysis || null
    }));
    setCurrentStep('form');
  }, []);

  const handleFormSubmit = useCallback(async () => {
    try {
      const consultationData = {
        patient_id: formData.patient_id,
        consultation_type: formData.consultation_type,
        main_symptoms: formData.main_symptoms,
        symptom_duration: formData.symptom_duration,
        symptom_severity: formData.symptom_severity,
        medical_history: formData.medical_history,
        current_medications: formData.current_medications,
        allergies: formData.allergies,
        vital_signs: formData.vital_signs,
        diagnosis: formData.diagnosis,
        treatment_plan: formData.treatment_plan,
        recommendations: formData.recommendations,
        notes: formData.notes,
        transcription: formData.transcription,
        ai_analysis: formData.ai_analysis,
        status: 'completed'
      };

      await createConsultation(consultationData);
      setCurrentStep('complete');
    } catch (error) {
      console.error('Error guardando consulta:', error);
    }
  }, [formData, createConsultation]);

  const renderPatientStep = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Información del Paciente</h3>
      
      {patient ? (
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <div className="flex items-center gap-3">
            <User className="w-6 h-6 text-blue-600" />
            <div>
              <p className="font-medium text-blue-900">{patient.full_name}</p>
              <p className="text-sm text-blue-700">
                {patient.age} años • {patient.gender} • {patient.folio}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 p-4 rounded-lg mb-6">
          <p className="text-yellow-800">
            No se ha seleccionado un paciente. Esta consulta se guardará sin asociar a un paciente específico.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Consulta
          </label>
          <select
            value={formData.consultation_type}
            onChange={(e) => setFormData({...formData, consultation_type: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="adulto">Adulto</option>
            <option value="pediatrico">Pediátrico</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setCurrentStep('recording')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Continuar a Grabación
        </button>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );

  const renderRecordingStep = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Grabación de la Consulta</h3>
        <p className="text-gray-600 mb-4">
          Graba la consulta para obtener una transcripción automática y análisis con IA.
        </p>
        <AudioRecorder onTranscriptionComplete={handleTranscriptionComplete} />
      </div>

      {transcriptionData && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Resultados de la Transcripción</h3>
          <TranscriptionResults 
            transcription={transcriptionData.transcription}
            analysis={transcriptionData.analysis}
            onUseTranscription={() => setCurrentStep('form')}
          />
        </div>
      )}
    </div>
  );

  const renderFormStep = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Formulario de Consulta</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Síntomas principales */}
          <div className="md:col-span-2">
            <h4 className="text-md font-medium text-gray-800 mb-3">Síntomas Principales</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Síntomas Principales *
                </label>
                <textarea
                  value={formData.main_symptoms}
                  onChange={(e) => setFormData({...formData, main_symptoms: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describa los síntomas principales..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duración
                </label>
                <input
                  type="text"
                  value={formData.symptom_duration}
                  onChange={(e) => setFormData({...formData, symptom_duration: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: 3 días"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Severidad
                </label>
                <select
                  value={formData.symptom_severity}
                  onChange={(e) => setFormData({...formData, symptom_severity: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="leve">Leve</option>
                  <option value="moderado">Moderado</option>
                  <option value="severo">Severo</option>
                </select>
              </div>
            </div>
          </div>

          {/* Antecedentes */}
          <div className="md:col-span-2">
            <h4 className="text-md font-medium text-gray-800 mb-3">Antecedentes</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Antecedentes Médicos
                </label>
                <textarea
                  value={formData.medical_history}
                  onChange={(e) => setFormData({...formData, medical_history: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Enfermedades previas, cirugías..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medicamentos Actuales
                </label>
                <textarea
                  value={formData.current_medications}
                  onChange={(e) => setFormData({...formData, current_medications: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Medicamentos que toma actualmente..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alergias
                </label>
                <textarea
                  value={formData.allergies}
                  onChange={(e) => setFormData({...formData, allergies: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Alergias conocidas..."
                />
              </div>
            </div>
          </div>

          {/* Signos vitales */}
          <div className="md:col-span-2">
            <h4 className="text-md font-medium text-gray-800 mb-3">Signos Vitales</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Presión Arterial
                </label>
                <input
                  type="text"
                  value={formData.vital_signs.blood_pressure}
                  onChange={(e) => setFormData({
                    ...formData, 
                    vital_signs: {...formData.vital_signs, blood_pressure: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="120/80"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frecuencia Cardíaca
                </label>
                <input
                  type="text"
                  value={formData.vital_signs.heart_rate}
                  onChange={(e) => setFormData({
                    ...formData, 
                    vital_signs: {...formData.vital_signs, heart_rate: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="72 bpm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Temperatura
                </label>
                <input
                  type="text"
                  value={formData.vital_signs.temperature}
                  onChange={(e) => setFormData({
                    ...formData, 
                    vital_signs: {...formData.vital_signs, temperature: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="36.5°C"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Peso
                </label>
                <input
                  type="text"
                  value={formData.vital_signs.weight}
                  onChange={(e) => setFormData({
                    ...formData, 
                    vital_signs: {...formData.vital_signs, weight: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="70 kg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Altura
                </label>
                <input
                  type="text"
                  value={formData.vital_signs.height}
                  onChange={(e) => setFormData({
                    ...formData, 
                    vital_signs: {...formData.vital_signs, height: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="170 cm"
                />
              </div>
            </div>
          </div>

          {/* Diagnóstico y tratamiento */}
          <div className="md:col-span-2">
            <h4 className="text-md font-medium text-gray-800 mb-3">Diagnóstico y Tratamiento</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Diagnóstico
                </label>
                <textarea
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Diagnóstico provisional..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plan de Tratamiento
                </label>
                <textarea
                  value={formData.treatment_plan}
                  onChange={(e) => setFormData({...formData, treatment_plan: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Tratamiento recomendado..."
                />
              </div>
            </div>
          </div>

          {/* Recomendaciones y notas */}
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recomendaciones
                </label>
                <textarea
                  value={formData.recommendations}
                  onChange={(e) => setFormData({...formData, recommendations: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Recomendaciones para el paciente..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notas Adicionales
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Notas adicionales..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleFormSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Guardando...' : 'Guardar Consulta'}
          </button>
          <button
            onClick={() => setCurrentStep('recording')}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Volver a Grabación
          </button>
        </div>
      </div>
    </div>
  );

  const renderCompleteStep = () => (
    <div className="bg-white rounded-lg shadow p-6 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FileText className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Consulta Guardada Exitosamente</h3>
      <p className="text-gray-600 mb-6">
        La consulta ha sido guardada en la base de datos con toda la información.
      </p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={onComplete}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Ver Historial
        </button>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
        >
          Volver al Dashboard
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Nueva Consulta</h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className={`px-2 py-1 rounded ${currentStep === 'patient' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}>
            1. Paciente
          </span>
          <span className={`px-2 py-1 rounded ${currentStep === 'recording' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}>
            2. Grabación
          </span>
          <span className={`px-2 py-1 rounded ${currentStep === 'form' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}>
            3. Formulario
          </span>
          <span className={`px-2 py-1 rounded ${currentStep === 'complete' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}>
            4. Completado
          </span>
        </div>
      </div>

      {/* Contenido del paso actual */}
      {currentStep === 'patient' && renderPatientStep()}
      {currentStep === 'recording' && renderRecordingStep()}
      {currentStep === 'form' && renderFormStep()}
      {currentStep === 'complete' && renderCompleteStep()}
    </div>
  );
};

export default UnifiedConsultationForm; 