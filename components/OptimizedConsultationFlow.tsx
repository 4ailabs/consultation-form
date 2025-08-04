import React, { useState, useCallback, useEffect } from 'react';
import { 
  User, 
  Baby, 
  Mic, 
  Square, 
  Play, 
  Pause, 
  Upload, 
  Trash2, 
  Loader2, 
  FileAudio,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Save,
  Download,
  Brain
} from 'lucide-react';
import AudioRecorder from './AudioRecorder';
import TranscriptionResults from './TranscriptionResults';

interface Patient {
  id: string;
  folio: string;
  fullName: string;
  age: number;
  gender: 'Masculino' | 'Femenino';
  phone: string;
  formType: 'adulto' | 'pediatrico';
}

interface ConsultationStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  component?: React.ReactNode;
}

interface OptimizedConsultationFlowProps {
  patient?: Patient;
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
  onReset?: () => void;
}

const OptimizedConsultationFlow: React.FC<OptimizedConsultationFlowProps> = ({
  patient,
  onSubmit,
  isSubmitting = false,
  onReset
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptionData, setTranscriptionData] = useState<{
    transcription: string;
    analysis: string;
  } | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [autoTranscribe, setAutoTranscribe] = useState(true);

  // Determinar tipo de formulario basado en el paciente
  const formType = patient?.formType || 'adulto';

  // Pasos del flujo optimizado
  const steps: ConsultationStep[] = [
    {
      id: 'identification',
      title: 'Identificación',
      description: 'Datos del paciente',
      status: patient ? 'completed' : 'active'
    },
    {
      id: 'recording',
      title: 'Grabación Inteligente',
      description: 'Grabación y transcripción automática',
      status: 'pending'
    },
    {
      id: 'ai-analysis',
      title: 'Análisis con IA',
      description: 'Procesamiento automático',
      status: 'pending'
    },
    {
      id: 'form-completion',
      title: 'Completar Formulario',
      description: 'Datos adicionales',
      status: 'pending'
    },
    {
      id: 'review',
      title: 'Revisión y Generación',
      description: 'PDF y resumen',
      status: 'pending'
    }
  ];

  // Actualizar estado de pasos
  useEffect(() => {
    if (patient) {
      steps[0].status = 'completed';
    }
    if (transcriptionData) {
      steps[1].status = 'completed';
      steps[2].status = 'completed';
    }
  }, [patient, transcriptionData]);

  const handleTranscriptionComplete = useCallback((transcription: string, analysis: string) => {
    setTranscriptionData({ transcription, analysis });
    
    // Auto-llenar formulario con datos de la transcripción
    if (autoTranscribe) {
      const extractedData = extractDataFromTranscription(transcription, analysis);
      setFormData(prev => ({ ...prev, ...extractedData }));
    }
    
    // Avanzar automáticamente al siguiente paso
    setTimeout(() => {
      setCurrentStep(3); // Ir al formulario
    }, 2000);
  }, [autoTranscribe]);

  const extractDataFromTranscription = (transcription: string, analysis: string) => {
    // Lógica para extraer datos relevantes de la transcripción
    const extracted: any = {};
    
    // Extraer síntomas comunes
    const symptoms = [
      'dolor', 'fiebre', 'tos', 'fatiga', 'náusea', 'vómito', 'diarrea',
      'dolor de cabeza', 'mareo', 'insomnio', 'ansiedad', 'depresión'
    ];
    
    symptoms.forEach(symptom => {
      if (transcription.toLowerCase().includes(symptom)) {
        if (!extracted.symptoms) extracted.symptoms = [];
        extracted.symptoms.push(symptom);
      }
    });

    // Extraer medicamentos
    const medications = transcription.match(/\b(paracetamol|ibuprofeno|aspirina|omeprazol|metformina|losartán)\b/gi);
    if (medications) {
      extracted.medications = medications;
    }

    // Extraer duración
    const durationMatch = transcription.match(/(\d+)\s*(días|semanas|meses|años)/i);
    if (durationMatch) {
      extracted.duration = `${durationMatch[1]} ${durationMatch[2]}`;
    }

    return extracted;
  };

  const handleStepComplete = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Finalizar consulta
      const finalData = {
        patient,
        transcription: transcriptionData,
        formData,
        timestamp: new Date().toISOString(),
        folio: generateFolio()
      };
      onSubmit(finalData);
    }
  }, [currentStep, steps.length, patient, transcriptionData, formData, onSubmit]);

  const generateFolio = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `HC-${year}${month}${day}-${random}`;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Identificación
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">
                {patient ? 'Paciente Identificado' : 'Identificar Paciente'}
              </h3>
              
              {patient ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      {formType === 'adulto' ? (
                        <User className="w-6 h-6 text-blue-600" />
                      ) : (
                        <Baby className="w-6 h-6 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{patient.fullName}</h4>
                      <p className="text-sm text-gray-600">
                        {patient.folio} • {patient.age} años • {patient.gender}
                      </p>
                      <p className="text-sm text-gray-500">{patient.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-700">Paciente verificado</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Busca un paciente existente o registra uno nuevo para continuar.
                  </p>
                  <div className="flex space-x-4">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                      Buscar Paciente
                    </button>
                    <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
                      Nuevo Paciente
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 1: // Grabación
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-4">
                Grabación Inteligente
              </h3>
              <p className="text-gray-600 mb-4">
                Graba la consulta y obtén transcripción automática con análisis de IA.
              </p>
              
              <div className="flex items-center space-x-4 mb-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={autoTranscribe}
                    onChange={(e) => setAutoTranscribe(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">
                    Transcribir automáticamente
                  </span>
                </label>
              </div>
            </div>
            
            <AudioRecorder
              onTranscriptionComplete={handleTranscriptionComplete}
              isRecording={isRecording}
              setIsRecording={setIsRecording}
            />
          </div>
        );

      case 2: // Análisis IA
        return (
          <div className="space-y-6">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Brain className="w-6 h-6 text-purple-600" />
                <h3 className="text-lg font-semibold text-purple-800">
                  Análisis con Inteligencia Artificial
                </h3>
              </div>
              
              {isProcessing ? (
                <div className="flex items-center space-x-3">
                  <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                  <span className="text-purple-700">Procesando con IA...</span>
                </div>
              ) : transcriptionData ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-700">Análisis completado</span>
                  </div>
                  
                  <TranscriptionResults
                    transcription={transcriptionData.transcription}
                    analysis={transcriptionData.analysis}
                    onUseTranscription={(text) => {
                      setFormData(prev => ({ ...prev, chiefComplaint: text }));
                    }}
                    onUseAnalysis={(text) => {
                      setFormData(prev => ({ ...prev, aiAnalysis: text }));
                    }}
                  />
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <span className="text-yellow-700">Esperando transcripción...</span>
                </div>
              )}
            </div>
          </div>
        );

      case 3: // Formulario
        return (
          <div className="space-y-6">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-orange-800 mb-4">
                Completar Formulario
              </h3>
              <p className="text-gray-600 mb-4">
                Revisa y completa la información extraída automáticamente.
              </p>
              
              {/* Aquí iría el formulario adaptativo */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motivo de Consulta
                  </label>
                  <textarea
                    value={formData.chiefComplaint || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, chiefComplaint: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Descripción del motivo de consulta..."
                  />
                </div>
                
                {formData.symptoms && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Síntomas Identificados
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {formData.symptoms.map((symptom: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {formData.medications && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medicamentos Mencionados
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {formData.medications.map((med: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                        >
                          {med}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 4: // Revisión
        return (
          <div className="space-y-6">
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-indigo-800 mb-4">
                Revisión y Generación
              </h3>
              <p className="text-gray-600 mb-4">
                Revisa toda la información y genera el reporte final.
              </p>
              
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border">
                  <h4 className="font-medium text-gray-900 mb-2">Resumen de la Consulta</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>Paciente:</strong> {patient?.fullName}</p>
                    <p><strong>Folio:</strong> {generateFolio()}</p>
                    <p><strong>Fecha:</strong> {new Date().toLocaleDateString()}</p>
                    <p><strong>Duración:</strong> {transcriptionData ? 'Completada' : 'Pendiente'}</p>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">
                    <Save className="w-4 h-4" />
                    <span>Guardar Consulta</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                    <Download className="w-4 h-4" />
                    <span>Generar PDF</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Consulta Optimizada
              </h1>
              <p className="text-sm text-gray-600">
                Flujo inteligente para consultas médicas
              </p>
            </div>
            <button
                              onClick={onReset}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index < currentStep
                      ? 'bg-green-500 text-white'
                      : index === currentStep
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {index < currentStep ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${
                      index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-gray-400 mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderStepContent()}
        
        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          
          <button
            onClick={handleStepComplete}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {currentStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OptimizedConsultationFlow; 