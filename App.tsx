import React, { useState, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { User, Baby, FileText } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import type { FormType } from './types';
import BasicForm from './components/BasicForm';
import CompleteForm from './components/CompleteForm';
import EvolutionNote from './components/EvolutionNote';
import PostSubmissionDashboard from './components/PostSubmissionDashboard';
import { generateFolio, generateFolioWithPatientInfo, getFolioStats } from './utils/folioGenerator';
import { generateEvolutionNotePDF, generateCompleteHistoryPDF } from './utils/pdfGenerator';

// --- Helper Components ---

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
        } else {
            // Historia clínica completa
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


  return (
    <div className="w-11/12 max-w-4xl mx-auto my-10 p-6 sm:p-10 bg-white rounded-2xl shadow-xl border border-gray-200/80">
      <h1 className="text-center mb-8 font-extrabold text-3xl md:text-4xl bg-gradient-to-r from-blue-600 to-violet-500 text-transparent bg-clip-text tracking-tight">Sistema de Consulta Médica Integral</h1>
      
      {isSubmitted ? (
        <PostSubmissionDashboard
            folio={lastSubmittedData?.folio}
            onReset={handleReset}
            onExportPDF={handleExportPDF}
            isGeneratingPdf={isGeneratingPdf}
            hasDataToExport={!!lastSubmittedData}
            onAnalyze={handleAiAnalysis}
            isAnalyzing={isAnalyzing}
            analysisResult={aiAnalysisResult}
            onSaveNote={handleSaveNote}
            onSaveAnnotations={handleSaveAnnotations}
            onShowFolioStats={handleShowFolioStats}
            error={error}
        />
      ) : (
        <>
          <FormSelector selectedType={formType} onSelect={setFormType} />
          
          {formType === 'adulto' && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Tipo de Formulario</h3>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="adultFormType"
                    checked={!useCompleteForm}
                    onChange={() => setUseCompleteForm(false)}
                    className="text-blue-600"
                  />
                  <span className="text-gray-700">Formulario Básico</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="adultFormType"
                    checked={useCompleteForm}
                    onChange={() => setUseCompleteForm(true)}
                    className="text-blue-600"
                  />
                  <span className="text-gray-700">Historia Clínica Completa</span>
                </label>
              </div>
            </div>
          )}
          
          {formType === 'pediatrico' && (
            <div className="mb-6 p-4 bg-green-50 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-3">Tipo de Formulario Pediátrico</h3>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="pediatricFormType"
                    checked={!useCompletePediatricForm}
                    onChange={() => setUseCompletePediatricForm(false)}
                    className="text-green-600"
                  />
                  <span className="text-gray-700">Formulario Básico</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="pediatricFormType"
                    checked={useCompletePediatricForm}
                    onChange={() => setUseCompletePediatricForm(true)}
                    className="text-green-600"
                  />
                  <span className="text-gray-700">Historia Clínica Completa</span>
                </label>
              </div>
            </div>
          )}
          
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">{error}</div>}
          
                          {formType === 'adulto' && !useCompleteForm && <BasicForm onSubmit={handleFormSubmit} isSubmitting={isSubmitting} formType="adulto" />}
                {formType === 'adulto' && useCompleteForm && <CompleteForm onSubmit={handleFormSubmit} isSubmitting={isSubmitting} formType="adulto" />}
                {formType === 'pediatrico' && !useCompletePediatricForm && <BasicForm onSubmit={handleFormSubmit} isSubmitting={isSubmitting} formType="pediatrico" />}
                {formType === 'pediatrico' && useCompletePediatricForm && <CompleteForm onSubmit={handleFormSubmit} isSubmitting={isSubmitting} formType="pediatrico" />}
                {formType === 'evolucion' && <EvolutionNote onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />}
        </>
      )}
    </div>
  );
};

export default App;