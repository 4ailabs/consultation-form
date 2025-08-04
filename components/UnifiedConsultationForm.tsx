import React, { useState, useCallback, useEffect } from 'react';
import { ArrowLeft, Save, Mic, FileText, User, Baby, Brain, AlertCircle } from 'lucide-react';
import AudioRecorder from './AudioRecorder';
import TranscriptionResults from './TranscriptionResults';
import { useConsultations } from '../hooks/useSupabase';
import { analyzeFormData, type AIAnalysisResult } from '../utils/aiAnalysis';

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
  const [currentStep, setCurrentStep] = useState<'patient' | 'recording' | 'form' | 'analysis' | 'complete'>('patient');
  const [useRecording, setUseRecording] = useState<boolean>(false);
  const [transcriptionData, setTranscriptionData] = useState<any>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [formData, setFormData] = useState({
    // Datos del paciente
    patient_id: patient?.id || '',
    patient_name: patient?.full_name || '',
    patient_age: patient?.age || '',
    patient_gender: patient?.gender || '',
    
    // Tipo de consulta
    consultation_type: 'adulto',
    
    // Datos personales completos
    personalData: {
      fullName: patient?.full_name || '',
      dateOfBirth: '',
      age: patient?.age || '',
      gender: patient?.gender || '',
      maritalStatus: '',
      occupation: '',
      phone: patient?.phone || '',
      email: '',
      address: '',
      emergencyContact: {
        name: '',
        relationship: '',
        phone: ''
      }
    },
    
    // Motivo de consulta
    chiefComplaint: {
      reason: '',
      duration: '',
      severity: 'Leve',
      aggravatingFactors: '',
      relievingFactors: ''
    },
    
    // Historia médica
    medicalHistory: {
      presentIllness: '',
      pastMedicalHistory: '',
      allergies: '',
      medications: '',
      familyHistory: ''
    },
    
    // Revisión por sistemas
    systemReview: {
      cardiovascular: '',
      respiratory: '',
      gastrointestinal: '',
      genitourinary: '',
      musculoskeletal: '',
      neurological: '',
      dermatological: '',
      psychological: ''
    },
    
    // Estilo de vida
    lifestyle: {
      physicalActivity: '',
      nutrition: '',
      sleep: '',
      mentalHealth: '',
      toxicHabits: ''
    },
    
    // Signos vitales
    vitalSigns: {
      bloodPressure: '',
      heartRate: '',
      respiratoryRate: '',
      temperature: '',
      oxygenSaturation: '',
      weight: '',
      height: '',
      bmi: ''
    },
    
    // Examen físico
    physicalExam: {
      general: '',
      head: '',
      neck: '',
      chest: '',
      cardiovascular: '',
      respiratory: '',
      abdomen: '',
      extremities: '',
      neurological: '',
      skin: ''
    },
    
    // Datos pediátricos (si aplica)
    pediatricData: {
      birthWeight: '',
      birthLength: '',
      gestationalAge: '',
      deliveryType: 'Vaginal',
      complications: '',
      developmentalMilestones: {
        social: '',
        language: '',
        motor: '',
        cognitive: ''
      },
      immunizations: '',
      growthChart: ''
    },
    
    // Diagnóstico y tratamiento
    diagnosis: '',
    treatmentPlan: '',
    recommendations: '',
    followUp: '',
    
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
      // Generar folio para la consulta
      const folio = `CONS-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Date.now().toString().slice(-6)}`;
      
      const consultationData = {
        patient_id: formData.patient_id,
        folio,
        form_type: formData.consultation_type,
        flow_type: 'complete',
        chief_complaint: formData.chiefComplaint.reason,
        symptoms: formData.chiefComplaint.reason ? [formData.chiefComplaint.reason] : [],
        medications: formData.medicalHistory.medications ? [formData.medicalHistory.medications] : [],
        observations: formData.followUp,
        transcription: formData.transcription,
        ai_analysis: aiAnalysis ? JSON.stringify(aiAnalysis) : null,
        extracted_data: {
          // Datos personales
          personalData: formData.personalData,
          
          // Motivo de consulta
          chiefComplaint: formData.chiefComplaint,
          
          // Historia médica
          medicalHistory: formData.medicalHistory,
          
          // Revisión por sistemas
          systemReview: formData.systemReview,
          
          // Estilo de vida
          lifestyle: formData.lifestyle,
          
          // Signos vitales
          vitalSigns: formData.vitalSigns,
          
          // Examen físico
          physicalExam: formData.physicalExam,
          
          // Datos pediátricos
          pediatricData: formData.pediatricData,
          
          // Diagnóstico y tratamiento
          diagnosis: formData.diagnosis,
          treatmentPlan: formData.treatmentPlan,
          recommendations: formData.recommendations,
          followUp: formData.followUp
        },
        elapsed_time: 0,
        estimated_time: 15,
        status: 'completed'
      };

      await createConsultation(consultationData);
      setCurrentStep('complete');
    } catch (error) {
      console.error('Error guardando consulta:', error);
      alert('Error guardando consulta: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    }
  }, [formData, aiAnalysis, createConsultation]);

  const handleAnalyzeWithAI = useCallback(async () => {
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeFormData(formData);
      setAiAnalysis(analysis);
      setCurrentStep('analysis');
    } catch (error) {
      console.error('Error en análisis de IA:', error);
      alert('Error en análisis de IA: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setIsAnalyzing(false);
    }
  }, [formData]);

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

      {/* Opciones de flujo */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-800 mb-3">¿Cómo quieres proceder?</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => {
              setUseRecording(false);
              setCurrentStep('form');
            }}
            className="flex flex-col items-center p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <FileText className="w-8 h-8 text-gray-600 mb-2" />
            <span className="font-medium text-gray-900">Solo Formulario</span>
            <span className="text-sm text-gray-600">Llenar manualmente</span>
          </button>
          
          <button
            onClick={() => {
              setUseRecording(true);
              setCurrentStep('recording');
            }}
            className="flex flex-col items-center p-4 border-2 border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors"
          >
            <Mic className="w-8 h-8 text-gray-600 mb-2" />
            <span className="font-medium text-gray-900">Solo Grabación</span>
            <span className="text-sm text-gray-600">Transcripción automática</span>
          </button>
          
          <button
            onClick={() => {
              setUseRecording(true);
              setCurrentStep('recording');
            }}
            className="flex flex-col items-center p-4 border-2 border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <div className="flex gap-1 mb-2">
              <Mic className="w-6 h-6 text-gray-600" />
              <FileText className="w-6 h-6 text-gray-600" />
            </div>
            <span className="font-medium text-gray-900">Grabación + Formulario</span>
            <span className="text-sm text-gray-600">Combinar ambos</span>
          </button>
        </div>
      </div>

      <div className="flex gap-3">
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
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Grabación de la Consulta</h3>
          <button
            onClick={() => setCurrentStep('form')}
            className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Saltar Grabación
          </button>
        </div>
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
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => setCurrentStep('form')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Continuar al Formulario
            </button>
            <button
              onClick={() => {
                // Si solo queríamos grabación, guardar directamente
                if (!useRecording) {
                  handleFormSubmit();
                } else {
                  setCurrentStep('form');
                }
              }}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Guardar Solo Transcripción
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderFormStep = () => (
    <div className="space-y-6">
      {/* Mostrar transcripción si existe */}
      {transcriptionData && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">📝 Transcripción Disponible</h4>
          <p className="text-sm text-blue-800 mb-2">
            Se ha generado una transcripción automática de la grabación. 
            Puedes usarla como referencia para llenar el formulario.
          </p>
          <details className="text-sm">
            <summary className="cursor-pointer text-blue-700 hover:text-blue-900">
              Ver transcripción completa
            </summary>
            <div className="mt-2 p-3 bg-white rounded border">
              <p className="text-gray-800 whitespace-pre-wrap">{transcriptionData.transcription}</p>
            </div>
          </details>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Historia Clínica Completa</h3>
        
        {/* Datos Personales */}
        <div className="mb-8">
          <h4 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">📋 Datos Personales</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
              <input
                type="text"
                value={formData.personalData.fullName}
                onChange={(e) => setFormData({
                  ...formData,
                  personalData: { ...formData.personalData, fullName: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
              <input
                type="date"
                value={formData.personalData.dateOfBirth}
                onChange={(e) => setFormData({
                  ...formData,
                  personalData: { ...formData.personalData, dateOfBirth: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Edad</label>
              <input
                type="number"
                value={formData.personalData.age}
                onChange={(e) => setFormData({
                  ...formData,
                  personalData: { ...formData.personalData, age: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Género</label>
              <select
                value={formData.personalData.gender}
                onChange={(e) => setFormData({
                  ...formData,
                  personalData: { ...formData.personalData, gender: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccionar</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado Civil</label>
              <input
                type="text"
                value={formData.personalData.maritalStatus}
                onChange={(e) => setFormData({
                  ...formData,
                  personalData: { ...formData.personalData, maritalStatus: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ocupación</label>
              <input
                type="text"
                value={formData.personalData.occupation}
                onChange={(e) => setFormData({
                  ...formData,
                  personalData: { ...formData.personalData, occupation: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input
                type="tel"
                value={formData.personalData.phone}
                onChange={(e) => setFormData({
                  ...formData,
                  personalData: { ...formData.personalData, phone: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.personalData.email}
                onChange={(e) => setFormData({
                  ...formData,
                  personalData: { ...formData.personalData, email: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
              <input
                type="text"
                value={formData.personalData.address}
                onChange={(e) => setFormData({
                  ...formData,
                  personalData: { ...formData.personalData, address: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Motivo de Consulta */}
        <div className="mb-8">
          <h4 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">🏥 Motivo de Consulta</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Motivo Principal</label>
              <textarea
                value={formData.chiefComplaint.reason}
                onChange={(e) => setFormData({
                  ...formData,
                  chiefComplaint: { ...formData.chiefComplaint, reason: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Describa el motivo principal de la consulta..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duración</label>
              <input
                type="text"
                value={formData.chiefComplaint.duration}
                onChange={(e) => setFormData({
                  ...formData,
                  chiefComplaint: { ...formData.chiefComplaint, duration: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: 3 días, 2 semanas..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Severidad</label>
              <select
                value={formData.chiefComplaint.severity}
                onChange={(e) => setFormData({
                  ...formData,
                  chiefComplaint: { ...formData.chiefComplaint, severity: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Leve">Leve</option>
                <option value="Moderado">Moderado</option>
                <option value="Severo">Severo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Factores Agravantes</label>
              <textarea
                value={formData.chiefComplaint.aggravatingFactors}
                onChange={(e) => setFormData({
                  ...formData,
                  chiefComplaint: { ...formData.chiefComplaint, aggravatingFactors: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
                placeholder="¿Qué empeora los síntomas?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Factores Aliviadores</label>
              <textarea
                value={formData.chiefComplaint.relievingFactors}
                onChange={(e) => setFormData({
                  ...formData,
                  chiefComplaint: { ...formData.chiefComplaint, relievingFactors: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
                placeholder="¿Qué alivia los síntomas?"
              />
            </div>
          </div>
        </div>

        {/* Historia Médica */}
        <div className="mb-8">
          <h4 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">📋 Historia Médica</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Enfermedad Actual</label>
              <textarea
                value={formData.medicalHistory.presentIllness}
                onChange={(e) => setFormData({
                  ...formData,
                  medicalHistory: { ...formData.medicalHistory, presentIllness: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Describa la enfermedad actual..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Antecedentes Médicos</label>
              <textarea
                value={formData.medicalHistory.pastMedicalHistory}
                onChange={(e) => setFormData({
                  ...formData,
                  medicalHistory: { ...formData.medicalHistory, pastMedicalHistory: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Enfermedades previas, cirugías..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alergias</label>
              <textarea
                value={formData.medicalHistory.allergies}
                onChange={(e) => setFormData({
                  ...formData,
                  medicalHistory: { ...formData.medicalHistory, allergies: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
                placeholder="Alergias conocidas..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Medicamentos</label>
              <textarea
                value={formData.medicalHistory.medications}
                onChange={(e) => setFormData({
                  ...formData,
                  medicalHistory: { ...formData.medicalHistory, medications: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
                placeholder="Medicamentos actuales..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Historia Familiar</label>
              <textarea
                value={formData.medicalHistory.familyHistory}
                onChange={(e) => setFormData({
                  ...formData,
                  medicalHistory: { ...formData.medicalHistory, familyHistory: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
                placeholder="Enfermedades en la familia..."
              />
            </div>
          </div>
        </div>

        {/* Signos Vitales */}
        <div className="mb-8">
          <h4 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">💓 Signos Vitales</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Presión Arterial</label>
              <input
                type="text"
                value={formData.vitalSigns.bloodPressure}
                onChange={(e) => setFormData({
                  ...formData,
                  vitalSigns: { ...formData.vitalSigns, bloodPressure: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="120/80"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Frecuencia Cardíaca</label>
              <input
                type="text"
                value={formData.vitalSigns.heartRate}
                onChange={(e) => setFormData({
                  ...formData,
                  vitalSigns: { ...formData.vitalSigns, heartRate: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="72 bpm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Frecuencia Respiratoria</label>
              <input
                type="text"
                value={formData.vitalSigns.respiratoryRate}
                onChange={(e) => setFormData({
                  ...formData,
                  vitalSigns: { ...formData.vitalSigns, respiratoryRate: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="16 rpm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Temperatura</label>
              <input
                type="text"
                value={formData.vitalSigns.temperature}
                onChange={(e) => setFormData({
                  ...formData,
                  vitalSigns: { ...formData.vitalSigns, temperature: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="36.5°C"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Saturación de Oxígeno</label>
              <input
                type="text"
                value={formData.vitalSigns.oxygenSaturation}
                onChange={(e) => setFormData({
                  ...formData,
                  vitalSigns: { ...formData.vitalSigns, oxygenSaturation: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="98%"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Peso</label>
              <input
                type="text"
                value={formData.vitalSigns.weight}
                onChange={(e) => setFormData({
                  ...formData,
                  vitalSigns: { ...formData.vitalSigns, weight: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="70 kg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Altura</label>
              <input
                type="text"
                value={formData.vitalSigns.height}
                onChange={(e) => setFormData({
                  ...formData,
                  vitalSigns: { ...formData.vitalSigns, height: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="170 cm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">IMC</label>
              <input
                type="text"
                value={formData.vitalSigns.bmi}
                onChange={(e) => setFormData({
                  ...formData,
                  vitalSigns: { ...formData.vitalSigns, bmi: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="24.2"
              />
            </div>
          </div>
        </div>

        {/* Diagnóstico y Tratamiento */}
        <div className="mb-8">
          <h4 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">🔬 Diagnóstico y Tratamiento</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Diagnóstico</label>
              <textarea
                value={formData.diagnosis}
                onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Diagnóstico provisional..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plan de Tratamiento</label>
              <textarea
                value={formData.treatmentPlan}
                onChange={(e) => setFormData({...formData, treatmentPlan: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Tratamiento recomendado..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recomendaciones</label>
              <textarea
                value={formData.recommendations}
                onChange={(e) => setFormData({...formData, recommendations: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Recomendaciones para el paciente..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Seguimiento</label>
              <textarea
                value={formData.followUp}
                onChange={(e) => setFormData({...formData, followUp: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Plan de seguimiento..."
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleAnalyzeWithAI}
            disabled={loading || isAnalyzing}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
          >
            <Brain className="w-4 h-4" />
            {isAnalyzing ? 'Analizando...' : 'Analizar con IA'}
          </button>
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

  const renderAnalysisStep = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-medium text-gray-900">Análisis de IA</h3>
        </div>
        
        {aiAnalysis ? (
          <div className="space-y-4">
            {/* Resumen Clínico */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">📋 Resumen Clínico</h4>
              <p className="text-blue-800">{aiAnalysis.resumen_clinico}</p>
            </div>

            {/* Posibles Relaciones */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">🔗 Posibles Relaciones</h4>
              <p className="text-green-800">{aiAnalysis.posibles_relaciones}</p>
            </div>

            {/* Sugerencias Diagnósticas */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-900 mb-2">🔍 Sugerencias Diagnósticas</h4>
              <ul className="list-disc list-inside text-yellow-800">
                {aiAnalysis.sugerencias_diagnosticas.map((sugerencia, index) => (
                  <li key={index}>{sugerencia}</li>
                ))}
              </ul>
            </div>

            {/* Recomendaciones Nutricionales */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">🥗 Recomendaciones Nutricionales</h4>
              <div className="space-y-2">
                {aiAnalysis.recomendaciones_nutricionales.map((rec, index) => (
                  <div key={index} className="bg-white p-3 rounded border">
                    <p className="font-medium text-purple-800">{rec.nutriente}</p>
                    <p className="text-sm text-purple-700">{rec.justificacion}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recomendaciones de Estilo de Vida */}
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-medium text-orange-900 mb-2">🏃 Recomendaciones de Estilo de Vida</h4>
              <ul className="list-disc list-inside text-orange-800">
                {aiAnalysis.recomendaciones_estilo_vida.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>

            {/* Disclaimer */}
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <p className="text-sm text-red-800">{aiAnalysis.disclaimer}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Analizando datos con IA...</p>
          </div>
        )}

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
            onClick={() => setCurrentStep('form')}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Volver al Formulario
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
          {useRecording && (
            <span className={`px-2 py-1 rounded ${currentStep === 'recording' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}>
              2. Grabación
            </span>
          )}
          <span className={`px-2 py-1 rounded ${currentStep === 'form' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}>
            {useRecording ? '3. Formulario' : '2. Formulario'}
          </span>
          <span className={`px-2 py-1 rounded ${currentStep === 'analysis' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}>
            {useRecording ? '4. Análisis IA' : '3. Análisis IA'}
          </span>
          <span className={`px-2 py-1 rounded ${currentStep === 'complete' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}>
            {useRecording ? '5. Completado' : '4. Completado'}
          </span>
        </div>
      </div>

      {/* Contenido del paso actual */}
      {currentStep === 'patient' && renderPatientStep()}
      {currentStep === 'recording' && renderRecordingStep()}
      {currentStep === 'form' && renderFormStep()}
      {currentStep === 'analysis' && renderAnalysisStep()}
      {currentStep === 'complete' && renderCompleteStep()}
    </div>
  );
};

export default UnifiedConsultationForm; 