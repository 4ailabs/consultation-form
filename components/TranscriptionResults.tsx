import React, { useState } from 'react';
import { FileText, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface TranscriptionResultsProps {
  transcription: string;
  analysis: string;
  onUseTranscription: (transcription: string) => void;
  onUseAnalysis: (analysis: string) => void;
}

const TranscriptionResults: React.FC<TranscriptionResultsProps> = ({
  transcription,
  analysis,
  onUseTranscription,
  onUseAnalysis
}) => {
  const [showTranscription, setShowTranscription] = useState(true);
  const [showAnalysis, setShowAnalysis] = useState(true);
  const [copiedTranscription, setCopiedTranscription] = useState(false);
  const [copiedAnalysis, setCopiedAnalysis] = useState(false);

  const copyToClipboard = async (text: string, setCopied: (value: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar al portapapeles:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5" />
        Resultados de Transcripción
      </h3>

      <div className="space-y-4">
        {/* Transcripción Original */}
        <div className="border rounded-lg">
          <div 
            className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
            onClick={() => setShowTranscription(!showTranscription)}
          >
            <h4 className="font-medium">Transcripción Original</h4>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(transcription, setCopiedTranscription);
                }}
                className="flex items-center gap-1 px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50"
              >
                {copiedTranscription ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedTranscription ? 'Copiado' : 'Copiar'}
              </button>
              <button
                type="button"
                onClick={() => onUseTranscription(transcription)}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Usar
              </button>
              {showTranscription ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
          
          {showTranscription && (
            <div className="p-4 border-t">
              <div className="bg-gray-50 p-3 rounded text-sm leading-relaxed max-h-40 overflow-y-auto">
                {transcription}
              </div>
            </div>
          )}
        </div>

        {/* Análisis de IA */}
        <div className="border rounded-lg">
          <div 
            className="flex items-center justify-between p-4 bg-blue-50 cursor-pointer"
            onClick={() => setShowAnalysis(!showAnalysis)}
          >
            <h4 className="font-medium text-blue-800">Análisis de IA</h4>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(analysis, setCopiedAnalysis);
                }}
                className="flex items-center gap-1 px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50"
              >
                {copiedAnalysis ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedAnalysis ? 'Copiado' : 'Copiar'}
              </button>
              <button
                type="button"
                onClick={() => onUseAnalysis(analysis)}
                className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
              >
                Usar
              </button>
              {showAnalysis ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
          
          {showAnalysis && (
            <div className="p-4 border-t">
              <div className="bg-blue-50 p-3 rounded text-sm leading-relaxed max-h-60 overflow-y-auto">
                <pre className="whitespace-pre-wrap font-sans">{analysis}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Información adicional */}
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
          <p className="font-medium mb-1">Información del Procesamiento:</p>
          <ul className="space-y-1">
            <li>• Transcripción realizada con Google Speech-to-Text</li>
            <li>• Análisis estructurado con Gemini AI</li>
            <li>• Optimizado para consultas de biomagnetismo y bioenergética</li>
            <li>• Puedes usar cualquiera de los resultados en el formulario</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TranscriptionResults; 