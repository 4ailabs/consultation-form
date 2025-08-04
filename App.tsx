import React, { useState, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { User, Baby, FileText, LayoutDashboard, FileEdit, Brain, Database } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import type { FormType } from './types';
import BasicForm from './components/BasicForm';
import CompleteForm from './components/CompleteForm';
import EvolutionNote from './components/EvolutionNote';
import PostSubmissionDashboard from './components/PostSubmissionDashboard';
import PatientDashboard from './components/PatientDashboard';
import OptimizedConsultationFlow from './components/OptimizedConsultationFlow';
import SmartConsultationFlow from './components/SmartConsultationFlow';
import SupabaseExample from './components/SupabaseExample';
import DiagnosticView from './components/DiagnosticView';
import SimpleFallback from './components/SimpleFallback';
import { generateFolio, generateFolioWithPatientInfo, getFolioStats } from './utils/folioGenerator';
import { generateEvolutionNotePDF, generateCompleteHistoryPDF } from './utils/pdfGenerator';

// --- Helper Components ---

interface NavigationProps {
  currentView: 'dashboard' | 'forms' | 'optimized' | 'smart' | 'supabase' | 'diagnostic';
  onViewChange: (view: 'dashboard' | 'forms' | 'optimized' | 'smart' | 'supabase' | 'diagnostic') => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange }) => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900">🏥 Sistema Médico</h1>
            </div>
            <nav className="ml-10 flex space-x-8">
              <button
                onClick={() => onViewChange('dashboard')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  currentView === 'dashboard'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </button>
              <button
                onClick={() => onViewChange('forms')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  currentView === 'forms'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FileEdit className="w-4 h-4 mr-2" />
                Formularios
              </button>
              <button
                onClick={() => onViewChange('optimized')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  currentView === 'optimized'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Brain className="w-4 h-4 mr-2" />
                Optimizado
              </button>
              <button
                onClick={() => onViewChange('smart')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  currentView === 'smart'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Brain className="w-4 h-4 mr-2" />
                Smart Flow
              </button>
              <button
                onClick={() => onViewChange('supabase')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  currentView === 'supabase'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Database className="w-4 h-4 mr-2" />
                Supabase
              </button>
              <button
                onClick={() => onViewChange('diagnostic')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  currentView === 'diagnostic'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🔧 Diagnóstico
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

interface FormSelectorProps {
  selectedType: FormType;
  onSelect: (type: FormType) => void;
}

const FormSelector: React.FC<FormSelectorProps> = ({ selectedType, onSelect }) => (
  <div className="text-center mb-10 animate-fade-in">
    <h3 className="text-xl font-semibold text-blue-600 mb-5">Seleccione el tipo de formulario</h3>
    <div className="flex justify-center flex-wrap gap-5">
      <label className="relative flex-grow sm:flex-grow-0 sm:w-52 p-6 bg-white rounded-xl border-2 border-gray-200 cursor-pointer text-center transition-all duration-300 ease-in-out shadow-sm hover:shadow-md has-[:checked]:border-blue-600 has-[:checked]:shadow-lg has-[:checked]:shadow-blue-500/10 has-[:checked]:-translate-y-1">
        <input type="radio" name="tipo_formulario" value="adulto" checked={selectedType === 'adulto'} onChange={() => onSelect('adulto')} className="absolute opacity-0" />
        <User className={`w-10 h-10 mx-auto mb-3 transition-colors duration-300 ease-in-out ${selectedType === 'adulto' ? 'text-blue-600' : 'text-gray-500'}`} strokeWidth={1.5} />
        <div className="font-semibold text-lg text-gray-800">Adulto</div>
        <div className="text-sm text-gray-500 mt-1">Para mayores de 18 años</div>
      </label>
      <label className="relative flex-grow sm:flex-grow-0 sm:w-52 p-6 bg-white rounded-xl border-2 border-gray-200 cursor-pointer text-center transition-all duration-300 ease-in-out shadow-sm hover:shadow-md has-[:checked]:border-blue-600 has-[:checked]:shadow-lg has-[:checked]:shadow-blue-500/10 has-[:checked]:-translate-y-1">
        <input type="radio" name="tipo_formulario" value="pediatrico" checked={selectedType === 'pediatrico'} onChange={() => onSelect('pediatrico')} className="absolute opacity-0" />
        <Baby className={`w-10 h-10 mx-auto mb-3 transition-colors duration-300 ease-in-out ${selectedType === 'pediatrico' ? 'text-blue-600' : 'text-gray-500'}`} strokeWidth={1.5} />
        <div className="font-semibold text-lg text-gray-800">Pediátrico</div>
        <div className="text-sm text-gray-500 mt-1">Para menores de 15 años</div>
      </label>
      <label className="relative flex-grow sm:flex-grow-0 sm:w-52 p-6 bg-white rounded-xl border-2 border-gray-200 cursor-pointer text-center transition-all duration-300 ease-in-out shadow-sm hover:shadow-md has-[:checked]:border-green-600 has-[:checked]:shadow-lg has-[:checked]:shadow-green-500/10 has-[:checked]:-translate-y-1">
        <input type="radio" name="tipo_formulario" value="evolucion" checked={selectedType === 'evolucion'} onChange={() => onSelect('evolucion')} className="absolute opacity-0" />
        <FileText className={`w-10 h-10 mx-auto mb-3 transition-colors duration-300 ease-in-out ${selectedType === 'evolucion' ? 'text-green-600' : 'text-gray-500'}`} strokeWidth={1.5} />
        <div className="font-semibold text-lg text-gray-800">Nota de Evolución</div>
        <div className="text-sm text-gray-500 mt-1">Seguimiento rápido</div>
      </label>
    </div>
  </div>
);

// --- Main App Component ---

const App: React.FC = () => {
  const [formType, setFormType] = useState<FormType>('adulto');
  const [useCompleteForm, setUseCompleteForm] = useState<boolean>(false);
  const [useCompletePediatricForm, setUseCompletePediatricForm] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSubmittedData, setLastSubmittedData] = useState<any>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [folioCounter, setFolioCounter] = useState(1001); // Initial folio number
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] =useState<boolean>(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'forms' | 'optimized' | 'smart' | 'supabase' | 'diagnostic'>('diagnostic');

  // 🧪 Paciente de prueba para Smart Flow
  const testPatient = {
    id: '1',
    folio: 'HC-2024-001',
    fullName: 'María González López',
    age: 35,
    gender: 'Femenino',
    phone: '555-0123',
    lastVisit: '2024-08-01',
    nextAppointment: '2024-08-15',
    status: 'active',
    formType: 'adulto',
    previousConsultations: 3,
    symptoms: ['dolor de cabeza', 'fatiga'],
    severity: 'moderado',
    emergency: false
  };

  const ai = useMemo(() => {
    // This assumes process.env.API_KEY is set in the execution environment
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API_KEY is not set in environment variables.");
      setError("La clave de API para el servicio de IA no está configurada.");
      return null;
    }
    return new GoogleGenAI({ apiKey });
  }, []);

  const dataForReport = useMemo(() => {
    if (!lastSubmittedData) return null;
    // The report data is now just the last submitted data, which includes evolution notes and AI analysis as they are added.
    return lastSubmittedData;
  }, [lastSubmittedData]);


  const handleExportPDF = useCallback(async () => {
    if (!dataForReport) return;
    setIsGeneratingPdf(true);

    try {
        // Usar el generador unificado de PDFs
        if (formType === 'evolucion' || dataForReport.nombre_paciente) {
            // Nota de evolución
            generateEvolutionNotePDF({
                ...dataForReport,
                formType: formType
            });
        } else if (dataForReport.nombre || dataForReport.personalData?.fullName) {
            // Historia clínica completa (básica o completa)
            generateCompleteHistoryPDF({
                ...dataForReport,
                formType: formType
            });
        } else {
            // Fallback para otros tipos
            generateCompleteHistoryPDF({
                ...dataForReport,
                formType: formType
            });
        }
    } catch (err) {
        console.error("Error generating PDF:", err);
        setError("No se pudo generar el PDF. Por favor, intente de nuevo.");
    } finally {
        setIsGeneratingPdf(false);
    }
  }, [dataForReport, formType]);

  const handleAiAnalysis = useCallback(async () => {
    if (!lastSubmittedData || !ai) return;
    setIsAnalyzing(true);
    setError(null);
    setAiAnalysisResult(null); // Clear previous results

    // Format data for the prompt
    let promptData = `Tipo de Paciente: ${formType}\n`;
    for(const key in lastSubmittedData) {
        if(lastSubmittedData[key]){
            const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            const value = Array.isArray(lastSubmittedData[key]) ? lastSubmittedData[key].join(', ') : lastSubmittedData[key];
            promptData += `${label}: ${value}\n`;
        }
    }

    const schema = {
        type: Type.OBJECT,
        properties: {
            resumen_clinico: { type: Type.STRING, description: 'Un resumen conciso de los síntomas y datos más relevantes del paciente.' },
            posibles_relaciones: { type: Type.STRING, description: 'Análisis de las posibles interconexiones entre sistemas, hábitos y síntomas presentados.' },
            sugerencias_diagnosticas: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Sugerencias de posibles áreas a investigar o diagnósticos diferenciales a considerar por el profesional.' },
            recomendaciones_nutricionales: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        nutriente: { type: Type.STRING, description: 'El nutriente o compuesto bioactivo recomendado.' },
                        justificacion: { type: Type.STRING, description: 'La justificación clínica para recomendar este nutriente, basada en los datos del paciente.' }
                    },
                    required: ['nutriente', 'justificacion']
                },
                description: 'Recomendaciones específicas de nutrientes o suplementos, con justificación.'
            },
            recomendaciones_estilo_vida: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Sugerencias sobre cambios en el estilo de vida (dieta, ejercicio, sueño, estrés).' },
            disclaimer: { type: Type.STRING, description: 'Un descargo de responsabilidad obligatorio indicando que esto es una sugerencia de IA y no un diagnóstico médico.' }
        },
        required: ['resumen_clinico', 'posibles_relaciones', 'sugerencias_diagnosticas', 'recomendaciones_nutricionales', 'recomendaciones_estilo_vida', 'disclaimer']
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Analiza los siguientes datos de un paciente y proporciona un análisis estructurado. La respuesta debe estar en español.\n\n${promptData}`,
            config: {
                systemInstruction: "Eres un asistente clínico experto en medicina funcional y nutrición. Tu tarea es analizar los datos del formulario de un paciente para proporcionar información preliminar a un profesional de la salud. Tu respuesta DEBE ser un objeto JSON que se ajuste al esquema proporcionado. No incluyas ningún texto fuera del objeto JSON.",
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });
        
        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);
        setAiAnalysisResult(parsedJson);
        // Also update the main data object
        setLastSubmittedData((prev: any) => ({ ...prev, aiAnalysis: parsedJson }));

    } catch (err) {
        console.error("Error analyzing with AI:", err);
        setError("No se pudo completar el análisis con IA. Verifique la configuración y los datos del formulario.");
    } finally {
        setIsAnalyzing(false);
    }

  }, [lastSubmittedData, formType, ai]);

  const handleFormSubmit = useCallback(async (formData: any) => {
    setIsSubmitting(true);
    setError(null);
    setAiAnalysisResult(null);
    const webhookUrl = "https://hook.us1.make.com/9zacarqdqsu906flfdhwodcm8tmxf4tp";
    
    // Generar folio inteligente basado en el tipo de formulario
    let folioData;
    if (formData.nombre_paciente && formData.edad) {
      // Si tenemos información del paciente, usar folio con información
      folioData = generateFolioWithPatientInfo(
        formType, 
        formData.nombre_paciente, 
        parseInt(formData.edad)
      );
    } else if (formData.personalData?.fullName && formData.personalData?.age) {
      // Para formularios completos
      folioData = generateFolioWithPatientInfo(
        formType,
        formData.personalData.fullName,
        formData.personalData.age
      );
    } else {
      // Folio básico
      folioData = generateFolio(formType);
    }

    const dataWithFolio = { 
      ...formData, 
      folio: folioData.folio,
      folioData: folioData,
      formType: formType
    };
    
    const dataForWebhook = new FormData();
    for (const key in dataWithFolio) {
      if (Array.isArray(dataWithFolio[key])) {
        dataWithFolio[key].forEach((value: string) => dataForWebhook.append(`${key}[]`, value));
      } else {
        dataForWebhook.append(key, dataWithFolio[key]);
      }
    }
    dataForWebhook.append('tipo_paciente', formType);

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: dataForWebhook,
      });

      if (!response.ok) {
        throw new Error('Hubo un problema al enviar el formulario. Por favor, inténtelo de nuevo.');
      }
      
      setLastSubmittedData(dataWithFolio);
      setIsSubmitted(true);
      window.scrollTo(0, 0);

      // Procesar automáticamente con IA después del envío exitoso
      if (ai) {
        try {
          // Formatear datos para el prompt de IA
          let promptData = `Tipo de Paciente: ${formType}\n`;
          for(const key in dataWithFolio) {
            if(dataWithFolio[key] && typeof dataWithFolio[key] === 'string' && dataWithFolio[key].trim() !== ''){
              const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
              promptData += `${label}: ${dataWithFolio[key]}\n`;
            }
          }

          const schema = {
            type: Type.OBJECT,
            properties: {
              resumen_clinico: { type: Type.STRING, description: 'Un resumen conciso de los síntomas y datos más relevantes del paciente.' },
              posibles_relaciones: { type: Type.STRING, description: 'Análisis de las posibles interconexiones entre sistemas, hábitos y síntomas presentados.' },
              sugerencias_diagnosticas: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Sugerencias de posibles áreas a investigar o diagnósticos diferenciales a considerar por el profesional.' },
              recomendaciones_nutricionales: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    nutriente: { type: Type.STRING, description: 'El nutriente o compuesto bioactivo recomendado.' },
                    justificacion: { type: Type.STRING, description: 'La justificación clínica para recomendar este nutriente, basada en los datos del paciente.' }
                  },
                  required: ['nutriente', 'justificacion']
                },
                description: 'Recomendaciones específicas de nutrientes o suplementos, con justificación.'
              },
              recomendaciones_estilo_vida: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Sugerencias sobre cambios en el estilo de vida (dieta, ejercicio, sueño, estrés).' },
              disclaimer: { type: Type.STRING, description: 'Un descargo de responsabilidad obligatorio indicando que esto es una sugerencia de IA y no un diagnóstico médico.' }
            },
            required: ['resumen_clinico', 'posibles_relaciones', 'sugerencias_diagnosticas', 'recomendaciones_nutricionales', 'recomendaciones_estilo_vida', 'disclaimer']
          };

          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Analiza los siguientes datos de un paciente y proporciona un análisis estructurado. La respuesta debe estar en español.\n\n${promptData}`,
            config: {
              systemInstruction: "Eres un asistente clínico experto en medicina funcional y nutrición. Tu tarea es analizar los datos del formulario de un paciente para proporcionar información preliminar a un profesional de la salud. Tu respuesta DEBE ser un objeto JSON que se ajuste al esquema proporcionado. No incluyas ningún texto fuera del objeto JSON.",
              responseMimeType: "application/json",
              responseSchema: schema,
            },
          });
          
          const jsonText = response.text.trim();
          const parsedJson = JSON.parse(jsonText);
          setAiAnalysisResult(parsedJson);
          
          // Actualizar los datos principales con el análisis de IA
          setLastSubmittedData((prev: any) => ({ 
            ...prev, 
            aiAnalysis: parsedJson,
            processedWithAI: true 
          }));

        } catch (aiError) {
          console.error("Error en análisis automático con IA:", aiError);
          // No mostrar error al usuario, solo log
        }
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado.');
      console.error('Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  }, [formType, folioCounter]);

  const handleReset = useCallback(() => {
    setIsSubmitted(false);
    setIsSubmitting(false);
    setError(null);
    setFormType('adulto');
    setUseCompleteForm(false);
    setUseCompletePediatricForm(false);
    setLastSubmittedData(null);
    setAiAnalysisResult(null);
  }, []);

  const handleSaveNote = useCallback((note: Record<string, string>) => {
    setLastSubmittedData((prev: any) => ({
      ...prev,
      nota_evolucion: note
    }));
  }, []);
  
  const handleSaveAnnotations = useCallback((annotations: string) => {
    setLastSubmittedData((prev: any) => ({
      ...prev,
      anotaciones_medico: annotations
    }));
  }, []);

  const handleShowFolioStats = useCallback(() => {
    const stats = getFolioStats();
    console.log('Estadísticas de Folios:', stats);
    
    // Crear un mensaje informativo
    const message = `
📊 Estadísticas de Folios:

📈 Total de historias: ${stats.total}
👤 Adultos: ${stats.byType.adulto}
👶 Pediátricos: ${stats.byType.pediatrico}
📋 Evoluciones: ${stats.byType.evolucion}

📅 Este mes:
👤 Adultos: ${stats.currentMonth.adulto}
👶 Pediátricos: ${stats.currentMonth.pediatrico}
📋 Evoluciones: ${stats.currentMonth.evolucion}
    `;
    
    alert(message);
  }, []);

  // 🎯 MANEJAR ERRORES
  const handleError = useCallback((error: any) => {
    console.error('Error en la aplicación:', error);
    setError(error.message || 'Error desconocido');
  }, []);

  // 🧹 LIMPIAR ERROR
  const clearError = useCallback(() => {
    setError(null);
  }, []);


    return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      
      {currentView === 'supabase' ? (
        <SupabaseExample />
      ) : (
        <SimpleFallback />
      )}
    </div>
  );
};

export default App;