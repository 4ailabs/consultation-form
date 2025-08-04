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
    
    // Crear un prompt más detallado para el análisis
    const analysisPrompt = `
Eres un médico especialista con amplia experiencia clínica. Analiza la siguiente historia clínica completa y proporciona un análisis médico detallado y profesional.

${promptData}

Por favor, proporciona un análisis médico completo que incluya:

1. **RESUMEN CLÍNICO**: Síntesis concisa de la situación del paciente, incluyendo edad, género, motivo principal de consulta y hallazgos más relevantes.

2. **POSIBLES RELACIONES**: Identifica posibles relaciones entre los diferentes sistemas del cuerpo basándote en los síntomas, antecedentes y signos vitales. Considera:
   - Relaciones entre sistemas (cardiovascular, respiratorio, gastrointestinal, etc.)
   - Factores de riesgo identificados
   - Patrones de síntomas que sugieran condiciones específicas

3. **SUGERENCIAS DIAGNÓSTICAS**: Lista de posibles diagnósticos diferenciales basados en la información disponible, ordenados por probabilidad:
   - Diagnósticos principales a considerar
   - Condiciones secundarias que podrían estar presentes
   - Diagnósticos de exclusión importantes

4. **RECOMENDACIONES NUTRICIONALES**: Sugerencias específicas de nutrición y suplementos:
   - Nutrientes específicos que podrían beneficiar al paciente
   - Justificación médica para cada recomendación
   - Consideraciones especiales basadas en la edad, género y condiciones

5. **RECOMENDACIONES DE ESTILO DE VIDA**: Cambios específicos recomendados:
   - Actividad física apropiada
   - Modificaciones en hábitos diarios
   - Estrategias de manejo del estrés
   - Prevención de complicaciones

6. **DISCLAIMER**: Aviso médico importante sobre las limitaciones del análisis.

Responde en formato JSON con la siguiente estructura:
{
  "resumen_clinico": "texto del resumen",
  "posibles_relaciones": "texto de las relaciones",
  "sugerencias_diagnosticas": ["diagnóstico 1", "diagnóstico 2", "..."],
  "recomendaciones_nutricionales": [
    {
      "nutriente": "nombre del nutriente",
      "justificacion": "justificación médica"
    }
  ],
  "recomendaciones_estilo_vida": ["recomendación 1", "recomendación 2", "..."],
  "disclaimer": "texto del disclaimer"
}
`;

    // Llamar a la API de Gemini (usar backend local que ya está funcionando)
    const response = await fetch('http://localhost:3001/api/transcription/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formData: analysisPrompt,
        type: 'form_analysis'
      }),
    });

    if (!response.ok) {
      throw new Error('Error en el análisis de IA');
    }

    const result = await response.json();
    
    // Intentar parsear el JSON de la respuesta
    try {
      if (typeof result.analysis === 'string') {
        return JSON.parse(result.analysis);
      }
      return result.analysis;
    } catch (parseError) {
      console.error('Error parseando respuesta de IA:', parseError);
      return generateBasicAnalysis(formData);
    }
  } catch (error) {
    console.error('Error en análisis de IA:', error);
    // Retornar análisis básico en caso de error
    return generateBasicAnalysis(formData);
  }
};

const formatFormDataForAnalysis = (formData: any): string => {
  let analysisText = `HISTORIA CLÍNICA COMPLETA - ANÁLISIS MÉDICO\n`;
  analysisText += `==============================================\n\n`;
  
  // INFORMACIÓN DEL PACIENTE
  analysisText += `📋 INFORMACIÓN DEL PACIENTE:\n`;
  analysisText += `----------------------------\n`;
  if (formData.personalData?.fullName) analysisText += `Nombre: ${formData.personalData.fullName}\n`;
  if (formData.personalData?.age) analysisText += `Edad: ${formData.personalData.age} años\n`;
  if (formData.personalData?.gender) analysisText += `Género: ${formData.personalData.gender}\n`;
  if (formData.personalData?.maritalStatus) analysisText += `Estado Civil: ${formData.personalData.maritalStatus}\n`;
  if (formData.personalData?.occupation) analysisText += `Ocupación: ${formData.personalData.occupation}\n`;
  if (formData.personalData?.phone) analysisText += `Teléfono: ${formData.personalData.phone}\n`;
  if (formData.personalData?.email) analysisText += `Email: ${formData.personalData.email}\n`;
  if (formData.personalData?.address) analysisText += `Dirección: ${formData.personalData.address}\n`;
  analysisText += `\n`;
  
  // MOTIVO DE CONSULTA
  analysisText += `🏥 MOTIVO DE CONSULTA:\n`;
  analysisText += `----------------------\n`;
  if (formData.chiefComplaint?.reason) analysisText += `Motivo Principal: ${formData.chiefComplaint.reason}\n`;
  if (formData.chiefComplaint?.duration) analysisText += `Duración: ${formData.chiefComplaint.duration}\n`;
  if (formData.chiefComplaint?.severity) analysisText += `Severidad: ${formData.chiefComplaint.severity}\n`;
  if (formData.chiefComplaint?.aggravatingFactors) analysisText += `Factores Agravantes: ${formData.chiefComplaint.aggravatingFactors}\n`;
  if (formData.chiefComplaint?.relievingFactors) analysisText += `Factores Aliviadores: ${formData.chiefComplaint.relievingFactors}\n`;
  analysisText += `\n`;
  
  // HISTORIA MÉDICA
  analysisText += `📋 HISTORIA MÉDICA:\n`;
  analysisText += `-------------------\n`;
  if (formData.medicalHistory?.presentIllness) analysisText += `Enfermedad Actual: ${formData.medicalHistory.presentIllness}\n`;
  if (formData.medicalHistory?.pastMedicalHistory) analysisText += `Antecedentes Médicos: ${formData.medicalHistory.pastMedicalHistory}\n`;
  if (formData.medicalHistory?.allergies) analysisText += `Alergias: ${formData.medicalHistory.allergies}\n`;
  if (formData.medicalHistory?.medications) analysisText += `Medicamentos: ${formData.medicalHistory.medications}\n`;
  if (formData.medicalHistory?.familyHistory) analysisText += `Historia Familiar: ${formData.medicalHistory.familyHistory}\n`;
  analysisText += `\n`;
  
  // REVISIÓN POR SISTEMAS
  analysisText += `🔍 REVISIÓN POR SISTEMAS:\n`;
  analysisText += `------------------------\n`;
  if (formData.systemReview?.cardiovascular) analysisText += `Cardiovascular: ${formData.systemReview.cardiovascular}\n`;
  if (formData.systemReview?.respiratory) analysisText += `Respiratorio: ${formData.systemReview.respiratory}\n`;
  if (formData.systemReview?.gastrointestinal) analysisText += `Gastrointestinal: ${formData.systemReview.gastrointestinal}\n`;
  if (formData.systemReview?.genitourinary) analysisText += `Genitourinario: ${formData.systemReview.genitourinary}\n`;
  if (formData.systemReview?.musculoskeletal) analysisText += `Musculoesquelético: ${formData.systemReview.musculoskeletal}\n`;
  if (formData.systemReview?.neurological) analysisText += `Neurológico: ${formData.systemReview.neurological}\n`;
  if (formData.systemReview?.dermatological) analysisText += `Dermatológico: ${formData.systemReview.dermatological}\n`;
  if (formData.systemReview?.psychological) analysisText += `Psicológico: ${formData.systemReview.psychological}\n`;
  analysisText += `\n`;
  
  // ESTILO DE VIDA
  analysisText += `🏃 ESTILO DE VIDA:\n`;
  analysisText += `-----------------\n`;
  if (formData.lifestyle?.physicalActivity) analysisText += `Actividad Física: ${formData.lifestyle.physicalActivity}\n`;
  if (formData.lifestyle?.nutrition) analysisText += `Nutrición: ${formData.lifestyle.nutrition}\n`;
  if (formData.lifestyle?.sleep) analysisText += `Sueño: ${formData.lifestyle.sleep}\n`;
  if (formData.lifestyle?.mentalHealth) analysisText += `Salud Mental: ${formData.lifestyle.mentalHealth}\n`;
  if (formData.lifestyle?.toxicHabits) analysisText += `Hábitos Tóxicos: ${formData.lifestyle.toxicHabits}\n`;
  analysisText += `\n`;
  
  // SIGNOS VITALES
  analysisText += `💓 SIGNOS VITALES:\n`;
  analysisText += `------------------\n`;
  if (formData.vitalSigns?.bloodPressure) analysisText += `Presión Arterial: ${formData.vitalSigns.bloodPressure}\n`;
  if (formData.vitalSigns?.heartRate) analysisText += `Frecuencia Cardíaca: ${formData.vitalSigns.heartRate}\n`;
  if (formData.vitalSigns?.respiratoryRate) analysisText += `Frecuencia Respiratoria: ${formData.vitalSigns.respiratoryRate}\n`;
  if (formData.vitalSigns?.temperature) analysisText += `Temperatura: ${formData.vitalSigns.temperature}\n`;
  if (formData.vitalSigns?.oxygenSaturation) analysisText += `Saturación de Oxígeno: ${formData.vitalSigns.oxygenSaturation}\n`;
  if (formData.vitalSigns?.weight) analysisText += `Peso: ${formData.vitalSigns.weight}\n`;
  if (formData.vitalSigns?.height) analysisText += `Altura: ${formData.vitalSigns.height}\n`;
  if (formData.vitalSigns?.bmi) analysisText += `IMC: ${formData.vitalSigns.bmi}\n`;
  analysisText += `\n`;
  
  // EXAMEN FÍSICO
  analysisText += `🔬 EXAMEN FÍSICO:\n`;
  analysisText += `-----------------\n`;
  if (formData.physicalExam?.general) analysisText += `General: ${formData.physicalExam.general}\n`;
  if (formData.physicalExam?.head) analysisText += `Cabeza: ${formData.physicalExam.head}\n`;
  if (formData.physicalExam?.neck) analysisText += `Cuello: ${formData.physicalExam.neck}\n`;
  if (formData.physicalExam?.chest) analysisText += `Tórax: ${formData.physicalExam.chest}\n`;
  if (formData.physicalExam?.cardiovascular) analysisText += `Cardiovascular: ${formData.physicalExam.cardiovascular}\n`;
  if (formData.physicalExam?.respiratory) analysisText += `Respiratorio: ${formData.physicalExam.respiratory}\n`;
  if (formData.physicalExam?.abdomen) analysisText += `Abdomen: ${formData.physicalExam.abdomen}\n`;
  if (formData.physicalExam?.extremities) analysisText += `Extremidades: ${formData.physicalExam.extremities}\n`;
  if (formData.physicalExam?.neurological) analysisText += `Neurológico: ${formData.physicalExam.neurological}\n`;
  if (formData.physicalExam?.skin) analysisText += `Piel: ${formData.physicalExam.skin}\n`;
  analysisText += `\n`;
  
  // DIAGNÓSTICO Y TRATAMIENTO
  analysisText += `🔬 DIAGNÓSTICO Y TRATAMIENTO:\n`;
  analysisText += `-----------------------------\n`;
  if (formData.diagnosis) analysisText += `Diagnóstico: ${formData.diagnosis}\n`;
  if (formData.treatmentPlan) analysisText += `Plan de Tratamiento: ${formData.treatmentPlan}\n`;
  if (formData.recommendations) analysisText += `Recomendaciones: ${formData.recommendations}\n`;
  if (formData.followUp) analysisText += `Seguimiento: ${formData.followUp}\n`;
  analysisText += `\n`;
  
  // TRANSCRIPCIÓN SI EXISTE
  if (formData.transcription) {
    analysisText += `🎤 TRANSCRIPCIÓN DE AUDIO:\n`;
    analysisText += `---------------------------\n`;
    analysisText += `${formData.transcription}\n`;
    analysisText += `\n`;
  }
  
  return analysisText;
};

const generateBasicAnalysis = (formData: any): AIAnalysisResult => {
  const patientName = formData.personalData?.fullName || formData.patient_name || 'sin nombre';
  const age = formData.personalData?.age || formData.patient_age || 'no especificada';
  const gender = formData.personalData?.gender || formData.patient_gender || 'no especificado';
  const mainSymptoms = formData.chiefComplaint?.reason || formData.main_symptoms || 'síntomas no especificados';
  
  return {
    resumen_clinico: `Paciente ${patientName}, ${age} años, ${gender}, presenta ${mainSymptoms}. Se requiere evaluación clínica completa para establecer un diagnóstico definitivo.`,
    posibles_relaciones: "Para identificar relaciones entre sistemas corporales se requiere análisis más detallado de los síntomas, antecedentes médicos y signos vitales. Se recomienda evaluación integral por sistemas.",
    sugerencias_diagnosticas: [
      "Evaluación clínica completa recomendada",
      "Análisis de laboratorio según síntomas",
      "Estudios de imagen si están indicados",
      "Consulta con especialistas según hallazgos"
    ],
    recomendaciones_nutricionales: [
      {
        nutriente: "Evaluación nutricional completa",
        justificacion: "Se requiere evaluación del estado nutricional para establecer recomendaciones específicas"
      },
      {
        nutriente: "Hidratación adecuada",
        justificacion: "Mantener hidratación óptima es fundamental para la salud general"
      },
      {
        nutriente: "Dieta balanceada",
        justificacion: "Una dieta equilibrada proporciona los nutrientes necesarios para el funcionamiento óptimo del organismo"
      }
    ],
    recomendaciones_estilo_vida: [
      "Mantener hábitos saludables de sueño",
      "Realizar actividad física regular según capacidad",
      "Manejar el estrés de manera efectiva",
      "Evitar hábitos tóxicos",
      "Seguir las recomendaciones médicas específicas"
    ],
    disclaimer: "Este es un análisis básico generado automáticamente. La información proporcionada no constituye un diagnóstico médico definitivo. Siempre consulte con un profesional de la salud calificado para evaluación, diagnóstico y tratamiento. Los síntomas pueden variar y requieren evaluación clínica personalizada."
  };
}; 