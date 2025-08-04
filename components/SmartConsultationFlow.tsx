import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { 
  Brain, 
  User, 
  Mic, 
  FileText, 
  CheckCircle, 
  Clock, 
  Activity, 
  ArrowRight,
  AlertTriangle,
  Users,
  Zap,
  RefreshCw
} from 'lucide-react';
import { getOptimalFlow, executeSmartActions } from '../utils/smartFlow';
import AudioRecorder from './AudioRecorder';
import TranscriptionResults from './TranscriptionResults';

interface SmartConsultationFlowProps {
  patient?: any;
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
  onReset?: () => void;
}

const SmartConsultationFlow: React.FC<SmartConsultationFlowProps> = ({
  patient,
  onSubmit,
  isSubmitting = false,
  onReset
}) => {
  // 🎯 ESTADOS PRINCIPALES
  const [currentStep, setCurrentStep] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptionData, setTranscriptionData] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);

  // 🧠 DECISIÓN INTELIGENTE
  const smartDecision = useMemo(() => {
    if (!patient) return null;
    return getOptimalFlow({
      age: patient.age,
      gender: patient.gender,
      symptoms: patient.symptoms || [],
      medications: patient.medications || [],
      isEmergency: patient.isEmergency || false,
      isFollowUp: patient.isFollowUp || false,
      hasTranscription: !!transcriptionData
    });
  }, [patient, transcriptionData]);

  // 📋 PASOS DINÁMICOS
  const steps = useMemo(() => {
    if (!smartDecision) return [];
    
    const baseSteps = [
      { id: 'start', title: 'Inicio Inteligente', icon: Brain },
      { id: 'patient', title: 'Identificación', icon: User },
      { id: 'recording', title: 'Grabación', icon: Mic },
      { id: 'analysis', title: 'Análisis IA', icon: Brain },
      { id: 'form', title: 'Formulario', icon: FileText },
      { id: 'finish', title: 'Finalización', icon: CheckCircle }
    ];

    // Filtrar pasos según la ruta inteligente
    if (smartDecision.route === 'emergency') {
      return baseSteps.filter(step => 
        ['start', 'patient', 'recording', 'analysis', 'form', 'finish'].includes(step.id)
      );
    } else if (smartDecision.route === 'quick') {
      return baseSteps.filter(step => 
        ['start', 'patient', 'recording', 'analysis', 'form', 'finish'].includes(step.id)
      );
    } else if (smartDecision.route === 'evolution') {
      return baseSteps.filter(step => 
        ['start', 'patient', 'recording', 'analysis', 'form', 'finish'].includes(step.id)
      );
    }

    return baseSteps;
  }, [smartDecision]);

  // ⏱️ TIEMPO ESTIMADO
  const estimatedTime = useMemo(() => {
    return smartDecision?.estimatedTime || 15;
  }, [smartDecision]);

  // 🎯 MANEJAR TRANSCRIPCIÓN COMPLETADA
  const handleTranscriptionComplete = useCallback((data: any) => {
    setTranscriptionData(data);
    setIsProcessing(false);
    
    // Extraer datos automáticamente
    if (data.transcription) {
      const extractedData = extractDataFromTranscription(data.transcription, data.analysis || '');
      setFormData(prev => ({ ...prev, ...extractedData }));
    }
    
    // Auto-avanzar después de un delay
    setTimeout(() => {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }, 2000);
  }, [steps.length]);

  // 📊 EXTRAER DATOS DE TRANSCRIPCIÓN
  const extractDataFromTranscription = (transcription: string, analysis: string) => {
    const text = `${transcription} ${analysis}`.toLowerCase();
    const extracted: any = {};

    // Síntomas comunes
    const symptoms = text.match(/\b(dolor|cansancio|fiebre|náusea|mareo|tos|estornudo|diarrea|estreñimiento|insomnio|ansiedad|depresión)\b/g);
    if (symptoms) {
      extracted.symptoms = [...new Set(symptoms)];
    }

    // Duración
    const durationMatch = text.match(/(\d+)\s*(días|semanas|meses|años)/);
    if (durationMatch) {
      extracted.duration = `${durationMatch[1]} ${durationMatch[2]}`;
    }

    // Medicamentos
    const medications = text.match(/\b(paracetamol|ibuprofeno|aspirina|omeprazol|metformina|losartán)\b/g);
    if (medications) {
      extracted.medications = medications;
    }

    // Severidad basada en palabras clave
    if (text.includes('muy') || text.includes('intenso') || text.includes('severo')) {
      extracted.severity = 'severo';
    } else if (text.includes('moderado') || text.includes('regular')) {
      extracted.severity = 'moderado';
    } else {
      extracted.severity = 'leve';
    }

    return extracted;
  };

  // 🏁 FINALIZAR CONSULTA
  const handleFinish = useCallback(() => {
    const finalData = {
      patient,
      transcription: transcriptionData,
      formData,
      flowDecision: smartDecision,
      elapsedTime,
      timestamp: new Date().toISOString(),
      folio: generateSmartFolio()
    };
    
    onSubmit(finalData);
  }, [patient, transcriptionData, formData, smartDecision, elapsedTime, onSubmit]);

  const generateSmartFolio = () => {
    const route = smartDecision?.route || 'complete';
    const prefix = {
      emergency: 'URG',
      evolution: 'EV',
      quick: 'QK',
      complete: 'HC'
    }[route];
    
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const time = date.toTimeString().slice(0, 5).replace(':', '');
    
    return `${prefix}-${dateStr}-${time}`;
  };

  // 🎨 RENDERIZADO DE CONTENIDO POR PASO
  const renderStepContent = () => {
    const step = steps[currentStep];
    
    switch (step?.id) {
      case 'start':
        return (
          <div className="text-center space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-xl">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Brain className="w-8 h-8 text-green-600" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                🎯 Flujo Inteligente Activado
              </h3>
              
              {smartDecision && (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Ruta Detectada:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        smartDecision.route === 'emergency' ? 'bg-red-100 text-red-700' :
                        smartDecision.route === 'evolution' ? 'bg-blue-100 text-blue-700' :
                        smartDecision.route === 'quick' ? 'bg-green-100 text-green-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {smartDecision.route.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between bg-white p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Tiempo estimado:</span>
                    </div>
                    <span className="font-medium text-blue-600">{estimatedTime} min</span>
                  </div>
                  
                  <div className="flex items-center justify-between bg-white p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                      <span className="text-sm text-gray-600">Prioridad:</span>
                    </div>
                    <span className={`font-medium ${
                      smartDecision.priority === 'high' ? 'text-red-600' :
                      smartDecision.priority === 'medium' ? 'text-orange-600' :
                      'text-green-600'
                    }`}>
                      {smartDecision.priority.toUpperCase()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
        
      case 'patient':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <User className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-800">
                  Identificación Inteligente del Paciente
                </h3>
              </div>
              
              {patient ? (
                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Nombre:</span>
                      <p className="text-gray-900">{patient.fullName || patient.nombre}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Edad:</span>
                      <p className="text-gray-900">{patient.age || patient.edad} años</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Género:</span>
                      <p className="text-gray-900">{patient.gender || patient.genero}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Teléfono:</span>
                      <p className="text-gray-900">{patient.phone || patient.telefono}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    No se encontró información del paciente
                  </p>
                  <div className="space-y-2">
                    <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                      🔍 Buscar Paciente
                    </button>
                    <button className="w-full px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50">
                      ➕ Crear Nuevo Paciente
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
        
      case 'recording':
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Mic className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-green-800">
                  Grabación Inteligente
                </h3>
              </div>
              
              <p className="text-gray-600 mb-4">
                {smartDecision?.route === 'emergency' 
                  ? '🚨 Grabación rápida para emergencia - Solo datos críticos'
                  : smartDecision?.route === 'quick'
                  ? '⚡ Grabación rápida - Datos esenciales'
                  : '🎙️ Grabación completa - Todos los detalles'
                }
              </p>
              
              <AudioRecorder
                onTranscriptionComplete={handleTranscriptionComplete}
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
              />
            </div>
          </div>
        );
        

        
      case 'form':
        return (
          <div className="space-y-6">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-orange-600" />
                <h3 className="text-lg font-semibold text-orange-800">
                  Formulario Inteligente
                </h3>
              </div>
              
              <p className="text-gray-600 mb-4">
                {transcriptionData 
                  ? '✅ Datos auto-completados - Revise y complete información adicional'
                  : '📋 Complete el formulario manualmente o espere la grabación'
                }
              </p>
              
              <div className="bg-white p-4 rounded-lg border border-orange-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Motivo de Consulta
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows={3}
                      placeholder="Describa el motivo de la consulta..."
                      defaultValue={formData.chiefComplaint || ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Síntomas Principales
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows={3}
                      placeholder="Liste los síntomas principales..."
                      defaultValue={formData.symptoms?.join(', ') || ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Medicamentos Actuales
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows={2}
                      placeholder="Medicamentos que toma actualmente..."
                      defaultValue={formData.medications?.join(', ') || ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observaciones
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows={2}
                      placeholder="Observaciones adicionales..."
                      defaultValue={formData.observations || ''}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'finish':
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-green-800">
                  Finalización Inteligente
                </h3>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-green-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">📊 Resumen de Consulta</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Folio:</span>
                        <span className="font-medium">{generateSmartFolio()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tiempo total:</span>
                        <span className="font-medium">{Math.round(elapsedTime / 1000 / 60)} min</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ruta utilizada:</span>
                        <span className="font-medium">{smartDecision?.route || 'complete'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Datos extraídos:</span>
                        <span className="font-medium">{transcriptionData ? '✅ Sí' : '❌ No'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">🎯 Acciones Disponibles</h4>
                    <div className="space-y-2">
                      <button 
                        onClick={handleFinish}
                        disabled={isSubmitting}
                        className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                      >
                        {isSubmitting ? 'Guardando...' : '💾 Guardar Consulta'}
                      </button>
                      <button className="w-full px-4 py-2 border border-green-500 text-green-500 rounded-lg hover:bg-green-50">
                        📄 Generar PDF
                      </button>
                      <button className="w-full px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50">
                        🔄 Nueva Consulta
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-600">Paso no encontrado</p>
          </div>
        );
    }
  };

  // ⏱️ ACTUALIZAR TIEMPO TRANSCURRIDO
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  if (!smartDecision) {
    return (
      <div className="text-center py-8">
        <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Cargando flujo inteligente...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🎯 HEADER INTELIGENTE */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-blue-500 to-green-500 p-2 rounded-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Smart Consultation Flow
                  </h1>
                  <p className="text-sm text-gray-600">
                    Flujo inteligente optimizado para {smartDecision.route}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600">
                    Paso {currentStep + 1}/{steps.length}
                  </span>
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
        </div>
      </div>

      {/* 📊 PROGRESO INTELIGENTE */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progreso</span>
              <span className="text-sm text-gray-500">
                {Math.round(((currentStep + 1) / steps.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between mt-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
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
                  <div className="ml-2 hidden sm:block">
                    <p className={`text-xs font-medium ${
                      index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-gray-400 mx-2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 📋 CONTENIDO PRINCIPAL */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderStepContent()}
        
        {/* 🎮 NAVEGACIÓN */}
        {currentStep < steps.length - 1 && steps[currentStep]?.id !== 'finish' && (
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
            >
              ← Anterior
            </button>
            
            <button
              onClick={() => setCurrentStep(Math.min(currentStep + 1, steps.length - 1))}
              className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Siguiente →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartConsultationFlow;