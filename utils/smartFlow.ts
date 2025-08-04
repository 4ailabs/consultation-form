// 🧠 Smart Flow Engine - Motor de decisiones inteligentes para consultas médicas

export interface FlowDecision {
  route: 'emergency' | 'quick' | 'evolution' | 'complete';
  estimatedTime: number;
  priority: 'high' | 'medium' | 'low';
  requiredSteps: string[];
  optionalSteps: string[];
  aiAnalysisLevel: 'basic' | 'detailed' | 'comprehensive';
  autoFillLevel: 'minimal' | 'partial' | 'complete';
}

export interface PatientContext {
  age: number;
  gender?: string;
  hasHistory?: boolean;
  lastVisit?: string;
  symptoms: string[];
  medications?: string[];
  severity?: 'leve' | 'moderado' | 'grave';
  emergency?: boolean;
  isEmergency?: boolean;
  isFollowUp?: boolean;
  hasTranscription?: boolean;
}

export interface SmartAction {
  type: 'auto_fill' | 'suggest' | 'validate' | 'optimize';
  target: string;
  data: any;
  confidence: number;
}

/**
 * 🎯 Algoritmo inteligente que decide el mejor flujo de consulta
 */
export function getOptimalFlow(context: PatientContext): FlowDecision {
  // 🚨 EMERGENCIA - Máxima prioridad
  if (context.emergency || context.isEmergency || context.severity === 'grave') {
    return {
      route: 'emergency',
      estimatedTime: 5,
      priority: 'high',
      requiredSteps: ['identification', 'critical_data', 'immediate_action'],
      optionalSteps: ['detailed_history'],
      aiAnalysisLevel: 'basic',
      autoFillLevel: 'minimal'
    };
  }

  // 🔄 EVOLUCIÓN - Seguimiento de paciente existente
  if ((context.hasHistory || context.isFollowUp) && context.lastVisit) {
    const daysSinceLastVisit = Math.floor((Date.now() - new Date(context.lastVisit).getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceLastVisit < 30) {
      return {
        route: 'evolution',
        estimatedTime: 10,
        priority: 'medium',
        requiredSteps: ['identification', 'changes', 'evolution_data'],
        optionalSteps: ['full_history', 'ai_analysis'],
        aiAnalysisLevel: 'detailed',
        autoFillLevel: 'partial'
      };
    }
  }

  // ⚡ RÁPIDA - Consulta simple para síntomas leves
  if ((context.severity === 'leve' || !context.severity) && context.symptoms.length <= 2) {
    return {
      route: 'quick',
      estimatedTime: 8,
      priority: 'medium',
      requiredSteps: ['identification', 'basic_symptoms', 'quick_assessment'],
      optionalSteps: ['ai_analysis'],
      aiAnalysisLevel: 'basic',
      autoFillLevel: 'partial'
    };
  }

  // 📋 COMPLETA - Consulta detallada por defecto
  return {
    route: 'complete',
    estimatedTime: 20,
    priority: 'medium',
    requiredSteps: ['identification', 'full_history', 'detailed_symptoms', 'ai_analysis'],
    optionalSteps: ['additional_tests', 'specialist_referral'],
    aiAnalysisLevel: 'comprehensive',
    autoFillLevel: 'complete'
  };
}

/**
 * 🎬 Ejecuta acciones inteligentes basadas en el contexto
 */
export function executeSmartActions(
  context: PatientContext, 
  transcription: string, 
  analysis: string
): SmartAction[] {
  const actions: SmartAction[] = [];

  // 🔍 Extracción automática de datos
  const extractedData = extractDataFromText(transcription, analysis);
  
  // 📝 Auto-completado inteligente
  if (extractedData.symptoms.length > 0) {
    actions.push({
      type: 'auto_fill',
      target: 'symptoms',
      data: extractedData.symptoms,
      confidence: 0.85
    });
  }

  if (extractedData.medications.length > 0) {
    actions.push({
      type: 'auto_fill',
      target: 'medications',
      data: extractedData.medications,
      confidence: 0.90
    });
  }

  // 🎯 Sugerencias inteligentes
  if (context.age > 65) {
    actions.push({
      type: 'suggest',
      target: 'geriatric_assessment',
      data: { recommended: true, priority: 'high' },
      confidence: 0.95
    });
  }

  if (extractedData.symptoms.some(s => s.toLowerCase().includes('dolor'))) {
    actions.push({
      type: 'suggest',
      target: 'pain_assessment',
      data: { scale: '1-10', location: extractedData.painLocation },
      confidence: 0.80
    });
  }

  // ✅ Validación automática
  if (extractedData.bloodPressure) {
    actions.push({
      type: 'validate',
      target: 'blood_pressure',
      data: { 
        value: extractedData.bloodPressure,
        isNormal: isNormalBloodPressure(extractedData.bloodPressure)
      },
      confidence: 0.88
    });
  }

  return actions;
}

/**
 * 🔍 Extrae datos estructurados del texto transcrito
 */
function extractDataFromText(transcription: string, analysis: string): any {
  const data = {
    symptoms: [] as string[],
    medications: [] as string[],
    painLocation: '',
    bloodPressure: '',
    allergies: [] as string[]
  };

  const text = `${transcription} ${analysis}`.toLowerCase();

  // Extraer síntomas comunes
  const symptomKeywords = [
    'dolor', 'fiebre', 'tos', 'fatiga', 'náusea', 'vómito', 'diarrea',
    'mareo', 'dolor de cabeza', 'dolor de estómago', 'dolor de espalda'
  ];

  symptomKeywords.forEach(symptom => {
    if (text.includes(symptom)) {
      data.symptoms.push(symptom);
    }
  });

  // Extraer medicamentos
  const medicationPattern = /(?:tomo|estoy tomando|medicamento|pastilla)\s+([a-zA-Záéíóúñ\s]+)/gi;
  const medicationMatches = text.match(medicationPattern);
  if (medicationMatches) {
    data.medications = medicationMatches.map(match => match.replace(/(?:tomo|estoy tomando|medicamento|pastilla)\s+/i, '').trim());
  }

  // Extraer presión arterial
  const bpPattern = /(\d{2,3}\/\d{2,3})\s*(?:mmHg|presión|tensión)/i;
  const bpMatch = text.match(bpPattern);
  if (bpMatch) {
    data.bloodPressure = bpMatch[1];
  }

  return data;
}

/**
 * ✅ Valida si la presión arterial es normal
 */
function isNormalBloodPressure(bp: string): boolean {
  const [systolic, diastolic] = bp.split('/').map(Number);
  return systolic >= 90 && systolic <= 140 && diastolic >= 60 && diastolic <= 90;
}

/**
 * 🧠 Motor de flujo inteligente
 */
export class SmartFlowEngine {
  private context: PatientContext;
  private decision: FlowDecision;

  constructor(context: PatientContext) {
    this.context = context;
    this.decision = getOptimalFlow(context);
  }

  getDecision(): FlowDecision {
    return this.decision;
  }

  getNextStep(currentStep: string): string | null {
    const stepIndex = this.decision.requiredSteps.indexOf(currentStep);
    if (stepIndex === -1 || stepIndex === this.decision.requiredSteps.length - 1) {
      return null;
    }
    return this.decision.requiredSteps[stepIndex + 1];
  }

  shouldSkipStep(step: string): boolean {
    return !this.decision.requiredSteps.includes(step);
  }

  getEstimatedTimeRemaining(currentStep: string): number {
    const stepIndex = this.decision.requiredSteps.indexOf(currentStep);
    const remainingSteps = this.decision.requiredSteps.length - stepIndex - 1;
    const timePerStep = this.decision.estimatedTime / this.decision.requiredSteps.length;
    return Math.round(remainingSteps * timePerStep);
  }
}