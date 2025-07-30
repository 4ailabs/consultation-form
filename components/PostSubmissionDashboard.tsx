import React, { useState } from 'react';
import { Download, RefreshCw, Sparkles, BrainCircuit, LoaderCircle, FileText, Check, ClipboardEdit } from 'lucide-react';

// --- Reusable Button ---
interface ActionButtonProps {
    onClick: () => void;
    disabled?: boolean;
    children: React.ReactNode;
    className?: string;
}
const ActionButton: React.FC<ActionButtonProps> = ({ onClick, disabled = false, children, className = '' }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`flex items-center justify-center gap-2 font-semibold py-2.5 px-5 rounded-lg shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-sm ${className}`}
    >
        {children}
    </button>
);

// --- AI Analysis Report Component ---
const AiAnalysisReport: React.FC<{ analysis: any }> = ({ analysis }) => {
    if (!analysis) return null;
    return (
        <div className="mt-6 border-t pt-6 text-left">
            <h3 className="flex items-center gap-2 text-xl font-bold text-blue-600 mb-4"><BrainCircuit /> Análisis con IA</h3>
            <div className="p-4 bg-blue-50/70 rounded-lg space-y-4">
                <div>
                    <h4 className="font-semibold text-gray-800">Resumen Clínico</h4>
                    <p className="text-gray-700 text-sm mt-1">{analysis.resumen_clinico}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-800">Posibles Interconexiones</h4>
                    <p className="text-gray-700 text-sm mt-1">{analysis.posibles_relaciones}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-800">Sugerencias Diagnósticas</h4>
                    <ul className="list-disc list-inside text-gray-700 text-sm mt-1 space-y-1">
                        {analysis.sugerencias_diagnosticas?.map((item: string, i: number) => <li key={i}>{item}</li>)}
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-800">Recomendaciones Nutricionales</h4>
                     <ul className="text-sm mt-1 space-y-2">
                        {analysis.recomendaciones_nutricionales?.map((item: {nutriente: string, justificacion: string}, i: number) => (
                            <li key={i} className="border-l-4 border-blue-200 pl-3">
                                <strong className="block text-gray-800">{item.nutriente}</strong>
                                <span className="text-gray-600">{item.justificacion}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-800">Recomendaciones Estilo de Vida</h4>
                     <ul className="list-disc list-inside text-gray-700 text-sm mt-1 space-y-1">
                        {analysis.recomendaciones_estilo_vida?.map((item: string, i: number) => <li key={i}>{item}</li>)}
                    </ul>
                </div>
                 <p className="text-xs text-gray-500 italic pt-2">{analysis.disclaimer}</p>
            </div>
        </div>
    );
};

// --- Doctor Annotations Component ---
const DoctorAnnotations: React.FC<{ onSave: (note: string) => void }> = ({ onSave }) => {
    const [annotation, setAnnotation] = useState('');
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = () => {
        if (annotation.trim()) {
            onSave(annotation);
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 2000);
        }
    };
    
    return (
        <div className="mt-6 border-t pt-6 text-left">
            <h3 className="flex items-center gap-2 text-xl font-bold text-gray-700 mb-4"><ClipboardEdit /> Anotaciones del Médico</h3>
            <textarea
                className="w-full p-3 border border-gray-300 rounded-lg text-base transition-all duration-300 ease-in-out bg-white hover:border-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                rows={4}
                placeholder="Añada aquí sus anotaciones, ideas o recordatorios sobre el caso..."
                value={annotation}
                onChange={(e) => setAnnotation(e.target.value)}
            />
            <div className="text-right mt-2">
                 <ActionButton onClick={handleSave} className="bg-slate-700 text-white" disabled={!annotation.trim()}>
                    {isSaved ? <><Check className="w-5 h-5"/> Anotación Guardada</> : 'Guardar Anotación para PDF'}
                </ActionButton>
            </div>
        </div>
    );
};

const commonTextAreaClasses = "w-full p-3 border border-gray-300 rounded-lg text-base transition-all duration-300 ease-in-out bg-white hover:border-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20";

// --- SOAP Note Component ---
const SoapNote: React.FC<{ onSave: (note: Record<string, string>) => void }> = ({ onSave }) => {
    const [soap, setSoap] = useState({ s: '', o: '', a: '', p: '' });
    const [isSaved, setIsSaved] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSoap(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        if (Object.values(soap).some(field => field.trim())) {
            onSave(soap);
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 2000);
        }
    };
    
    const hasContent = Object.values(soap).some(field => field.trim());

    return (
        <div className="mt-6 border-t pt-6 text-left">
            <h3 className="flex items-center gap-2 text-xl font-bold text-gray-700 mb-4"><FileText /> Nota de Evolución (SOAP)</h3>
            <div className="space-y-4">
                <div>
                    <label className="block mb-1.5 font-semibold text-gray-600">S - Subjetivo</label>
                    <textarea 
                        name="s" 
                        value={soap.s} 
                        onChange={handleChange} 
                        className={commonTextAreaClasses}
                        rows={3}
                        placeholder="Información que el paciente relata: síntomas, preocupaciones, historial..."
                    />
                </div>
                 <div>
                    <label className="block mb-1.5 font-semibold text-gray-600">O - Objetivo</label>
                    <textarea 
                        name="o" 
                        value={soap.o} 
                        onChange={handleChange} 
                        className={commonTextAreaClasses}
                        rows={3}
                        placeholder="Datos medibles y observables: signos vitales, resultados de laboratorio, hallazgos del examen físico..."
                    />
                </div>
                 <div>
                    <label className="block mb-1.5 font-semibold text-gray-600">A - Análisis</label>
                    <textarea 
                        name="a" 
                        value={soap.a} 
                        onChange={handleChange} 
                        className={commonTextAreaClasses}
                        rows={3}
                        placeholder="Interpretación del profesional sobre los datos subjetivos y objetivos. Diagnóstico diferencial..."
                    />
                </div>
                 <div>
                    <label className="block mb-1.5 font-semibold text-gray-600">P - Plan</label>
                    <textarea 
                        name="p" 
                        value={soap.p} 
                        onChange={handleChange} 
                        className={commonTextAreaClasses}
                        rows={3}
                        placeholder="Plan de acción: tratamientos, estudios adicionales, recomendaciones, seguimiento..."
                    />
                </div>
            </div>
            <div className="text-right mt-3">
                 <ActionButton onClick={handleSave} className="bg-slate-700 text-white" disabled={!hasContent}>
                    {isSaved ? <><Check className="w-5 h-5"/> Nota Guardada</> : 'Guardar Nota SOAP para PDF'}
                </ActionButton>
            </div>
        </div>
    );
};


// --- Main Dashboard Component ---

interface PostSubmissionDashboardProps {
  folio?: string;
  onReset: () => void;
  onExportPDF: () => void;
  isGeneratingPdf: boolean;
  hasDataToExport: boolean;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  analysisResult: any;
  onSaveNote: (note: Record<string, string>) => void;
  onSaveAnnotations: (note: string) => void;
  onShowFolioStats: () => void;
  error: string | null;
}

const PostSubmissionDashboard: React.FC<PostSubmissionDashboardProps> = ({
    folio, onReset, onExportPDF, isGeneratingPdf, hasDataToExport, onAnalyze, isAnalyzing, analysisResult, onSaveNote, onSaveAnnotations, onShowFolioStats, error
}) => (
    <div className="text-center animate-fade-in">
        <div className="bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl p-8 shadow-lg">
            <Check className="w-20 h-20 mx-auto mb-4 text-emerald-500" strokeWidth={1.5} />
            <h3 className="text-2xl font-bold mb-2">¡Formulario enviado correctamente!</h3>
            {folio && <p className="text-lg mb-6 font-semibold text-emerald-800">Número de Expediente: <span className="text-black bg-emerald-200 px-2 py-1 rounded">{folio}</span></p>}
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative my-6" role="alert">{error}</div>}
        
        <div className="my-8 flex justify-center flex-wrap gap-4">
            <ActionButton onClick={onReset} className="bg-gradient-to-r from-emerald-500 to-green-500 text-white">
                <RefreshCw className="w-5 h-5"/> Nuevo Formulario
            </ActionButton>
            <ActionButton onClick={onExportPDF} disabled={isGeneratingPdf || !hasDataToExport} className="bg-gradient-to-r from-slate-500 to-slate-600 text-white">
                {isGeneratingPdf ? <LoaderCircle className="w-5 h-5 animate-spin"/> : <Download className="w-5 h-5" />}
                {isGeneratingPdf ? 'Generando...' : 'Exportar a PDF'}
            </ActionButton>
             <ActionButton onClick={onAnalyze} disabled={isAnalyzing} className="bg-gradient-to-r from-blue-600 to-violet-500 text-white">
                {isAnalyzing ? <LoaderCircle className="w-5 h-5 animate-spin"/> : <Sparkles className="w-5 h-5" />}
                {isAnalyzing ? 'Analizando...' : 'Analizar con IA'}
            </ActionButton>
            <ActionButton onClick={onShowFolioStats} className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                <FileText className="w-5 h-5" />
                Estadísticas
            </ActionButton>
        </div>

        {isAnalyzing && (
            <div className="flex justify-center items-center gap-3 text-lg text-blue-600 p-4">
                <LoaderCircle className="animate-spin" />
                <p>La IA está procesando los datos. Esto puede tardar unos segundos...</p>
            </div>
        )}
        
        {analysisResult && <AiAnalysisReport analysis={analysisResult} />}

        <DoctorAnnotations onSave={onSaveAnnotations} />

        <SoapNote onSave={onSaveNote} />

    </div>
);

export default PostSubmissionDashboard;