// Servicio de análisis de IA para formularios médicos
export interface AIAnalysisResult {
  resumen_clinico: string;
  posibles_relaciones: string;
  sugerencias_diagnosticas: string[];
  recomendaciones_nutricionales: Array<{
    nutriente: string;
    justificacion: string;
  }>;
  recomendaciones_estilo_vida: string[];
  disclaimer: string;
}

export const analyzeFormData = async (formData: any): Promise<AIAnalysisResult> => {
  try {
    // Formatear datos para el análisis
    const promptData = formatFormDataForAnalysis(formData);
    
    // Llamar a la API de Gemini (usando el mismo endpoint que la transcripción)
    const response = await fetch('https://clinica-transcripcion.vercel.app/api/transcription/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formData: promptData,
        type: 'form_analysis'
      }),
    });

    if (!response.ok) {
      throw new Error('Error en el análisis de IA');
    }

    const result = await response.json();
    return result.analysis;
  } catch (error) {
    console.error('Error en análisis de IA:', error);
    // Retornar análisis básico en caso de error
    return generateBasicAnalysis(formData);
  }
};

const formatFormDataForAnalysis = (formData: any): string => {
  let analysisText = `Análisis de Formulario Médico\n\n`;
  
  // Información del paciente
  if (formData.patient_name) {
    analysisText += `Paciente: ${formData.patient_name}\n`;
  }
  if (formData.patient_age) {
    analysisText += `Edad: ${formData.patient_age} años\n`;
  }
  if (formData.patient_gender) {
    analysisText += `Género: ${formData.patient_gender}\n`;
  }
  
  // Síntomas principales
  if (formData.main_symptoms) {
    analysisText += `Síntomas Principales: ${formData.main_symptoms}\n`;
  }
  if (formData.symptom_duration) {
    analysisText += `Duración: ${formData.symptom_duration}\n`;
  }
  if (formData.symptom_severity) {
    analysisText += `Severidad: ${formData.symptom_severity}\n`;
  }
  
  // Antecedentes
  if (formData.medical_history) {
    analysisText += `Antecedentes Médicos: ${formData.medical_history}\n`;
  }
  if (formData.current_medications) {
    analysisText += `Medicamentos Actuales: ${formData.current_medications}\n`;
  }
  if (formData.allergies) {
    analysisText += `Alergias: ${formData.allergies}\n`;
  }
  
  // Signos vitales
  if (formData.vital_signs) {
    const vitals = formData.vital_signs;
    if (vitals.blood_pressure) analysisText += `Presión Arterial: ${vitals.blood_pressure}\n`;
    if (vitals.heart_rate) analysisText += `Frecuencia Cardíaca: ${vitals.heart_rate}\n`;
    if (vitals.temperature) analysisText += `Temperatura: ${vitals.temperature}\n`;
    if (vitals.weight) analysisText += `Peso: ${vitals.weight}\n`;
    if (vitals.height) analysisText += `Altura: ${vitals.height}\n`;
  }
  
  // Diagnóstico y tratamiento
  if (formData.diagnosis) {
    analysisText += `Diagnóstico: ${formData.diagnosis}\n`;
  }
  if (formData.treatment_plan) {
    analysisText += `Plan de Tratamiento: ${formData.treatment_plan}\n`;
  }
  if (formData.recommendations) {
    analysisText += `Recomendaciones: ${formData.recommendations}\n`;
  }
  
  // Transcripción si existe
  if (formData.transcription) {
    analysisText += `Transcripción: ${formData.transcription}\n`;
  }
  
  return analysisText;
};

const generateBasicAnalysis = (formData: any): AIAnalysisResult => {
  return {
    resumen_clinico: `Paciente ${formData.patient_name || 'sin nombre'} presenta ${formData.main_symptoms || 'síntomas no especificados'}.`,
    posibles_relaciones: "Se requiere análisis más detallado para identificar relaciones entre sistemas.",
    sugerencias_diagnosticas: ["Evaluación clínica completa recomendada"],
    recomendaciones_nutricionales: [
      {
        nutriente: "Evaluación nutricional",
        justificacion: "Se requiere evaluación completa del estado nutricional"
      }
    ],
    recomendaciones_estilo_vida: ["Mantener hábitos saludables", "Seguir recomendaciones médicas"],
    disclaimer: "Este es un análisis básico generado automáticamente. Siempre consulte con un profesional de la salud para diagnóstico y tratamiento."
  };
}; 