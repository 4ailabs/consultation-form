import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Mic, Square, Play, Pause, Upload, Trash2, Loader2, FileAudio } from 'lucide-react';

interface AudioRecorderProps {
  onTranscriptionComplete: (transcription: string, analysis: string) => void;
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
  quickRecordAudio?: Blob | null;
  quickRecordFileName?: string;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ 
  onTranscriptionComplete, 
  isRecording, 
  setIsRecording,
  quickRecordAudio,
  quickRecordFileName
}) => {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);



  // Función para limpiar todo el estado
  const clearAudio = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setIsPlaying(false);
    setRecordingTime(0);
    setError(null);
    setUploadedFileName(null);
  }, [audioUrl]);

  // Función para iniciar grabación
  const startRecording = useCallback(async () => {
    try {
      setError(null);
      clearAudio(); // Limpiar audio anterior
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setUploadedFileName('Audio grabado');
        
        // Detener todas las pistas del stream
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Iniciar timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (err) {
      console.error('Error al iniciar grabación:', err);
      setError('No se pudo acceder al micrófono. Verifica los permisos.');
    }
  }, [setIsRecording, clearAudio]);

  // Función para detener grabación
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isRecording, setIsRecording]);

  // Función para reproducir/pausar audio
  const playAudio = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  }, [isPlaying]);

  // Función para manejar subida de archivos
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar que sea un archivo de audio
    if (!file.type.startsWith('audio/') && 
        !file.name.toLowerCase().endsWith('.webm') &&
        !file.name.toLowerCase().endsWith('.mp3') &&
        !file.name.toLowerCase().endsWith('.wav') &&
        !file.name.toLowerCase().endsWith('.m4a')) {
      setError('Por favor selecciona un archivo de audio válido (MP3, WAV, M4A, WebM)');
      return;
    }

    // Validar tamaño (máximo 8MB)
    if (file.size > 8 * 1024 * 1024) {
      setError('El archivo es demasiado grande. Máximo 8MB permitido.');
      return;
    }

    setError(null);
    clearAudio(); // Limpiar audio anterior

    // Crear URL para el nuevo archivo
    const url = URL.createObjectURL(file);
    setAudioBlob(file);
    setAudioUrl(url);
    setUploadedFileName(file.name);
    setIsPlaying(false);
    setRecordingTime(0);
    
    // Limpiar el input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [clearAudio]);

  // Función para abrir selector de archivos
  const openFileSelector = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Función para transcribir audio
  const uploadAudio = useCallback(async () => {
    if (!audioBlob) return;
    
    setIsUploading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('audioFile', audioBlob, uploadedFileName || 'recording.webm');
      
      // URL del backend de transcripción desplegado en Vercel
      const response = await fetch('https://clinica-transcripcion.vercel.app/api/transcription/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.originalTranscription && result.geminiAnalysis) {
        onTranscriptionComplete(result.originalTranscription, result.geminiAnalysis);
      } else {
        throw new Error('Respuesta incompleta del servidor');
      }
      
    } catch (err) {
      console.error('Error al subir audio:', err);
      setError(`Error al procesar el audio: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    } finally {
      setIsUploading(false);
    }
  }, [audioBlob, uploadedFileName, onTranscriptionComplete]);

  // Efecto para procesar audio del Quick Record automáticamente
  useEffect(() => {
    if (quickRecordAudio && !audioBlob) {
      console.log('Audio del Quick Record detectado, procesando automáticamente...');
      
      // Limpiar audio anterior si existe
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }

      // Configurar el audio del Quick Record
      const url = URL.createObjectURL(quickRecordAudio);
      setAudioBlob(quickRecordAudio);
      setAudioUrl(url);
      setUploadedFileName(quickRecordFileName || 'Audio del Quick Record');
      setIsPlaying(false);
      setRecordingTime(0);
      setError(null);

      // Procesar automáticamente después de un breve delay
      setTimeout(() => {
        uploadAudio();
      }, 1000);
    }
  }, [quickRecordAudio, quickRecordFileName, audioBlob, audioUrl, uploadAudio]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Mic className="w-5 h-5" />
        Grabación de Sesión
      </h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
      
      <div className="space-y-6">
        {/* Estado: Sin audio */}
        {!audioBlob && !isRecording && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Opción 1: Grabar */}
              <div className="border-2 border-dashed border-red-300 rounded-lg p-4 text-center">
                <Mic className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <h4 className="font-medium text-gray-800 mb-2">Grabar Audio</h4>
                <p className="text-sm text-gray-600 mb-3">Grabar audio en vivo desde el micrófono</p>
                <button
                  type="button"
                  onClick={startRecording}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors mx-auto"
                >
                  <Mic className="w-4 h-4" />
                  Iniciar Grabación
                </button>
              </div>

              {/* Opción 2: Subir archivo */}
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center">
                <FileAudio className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <h4 className="font-medium text-gray-800 mb-2">Subir Archivo</h4>
                <p className="text-sm text-gray-600 mb-3">Subir un archivo de audio existente</p>
                <button
                  type="button"
                  onClick={openFileSelector}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors mx-auto"
                >
                  <Upload className="w-4 h-4" />
                  Seleccionar Archivo
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*,.webm,.mp3,.wav,.m4a"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>
            
            <div className="text-xs text-gray-400 text-center">
              Formatos soportados: MP3, WAV, M4A, WebM (máximo 8MB)
            </div>
          </div>
        )}

        {/* Estado: Grabando */}
        {isRecording && (
          <div className="border-2 border-red-300 rounded-lg p-4 bg-red-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <div>
                  <h4 className="font-medium text-red-800">Grabando...</h4>
                  <p className="text-sm text-red-600">Tiempo: {formatTime(recordingTime)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={stopRecording}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                <Square className="w-4 h-4" />
                Detener Grabación
              </button>
            </div>
          </div>
        )}

        {/* Estado: Audio disponible */}
        {audioBlob && audioUrl && !isRecording && (
          <div className="space-y-4">
            {/* Información del audio */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileAudio className="w-5 h-5 text-green-600" />
                  <div>
                    <h4 className="font-medium text-green-800">
                      {uploadedFileName || 'Audio disponible'}
                    </h4>
                    <p className="text-sm text-green-600">
                      Duración: {formatTime(Math.floor(audioBlob.size / 16000))} (aproximada)
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={openFileSelector}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    <Upload className="w-3 h-3" />
                    Cambiar
                  </button>
                  <button
                    type="button"
                    onClick={clearAudio}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    Eliminar
                  </button>
                </div>
              </div>
            </div>

            {/* Controles de audio */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={playAudio}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? 'Pausar' : 'Reproducir'}
              </button>
              
              <button
                type="button"
                onClick={uploadAudio}
                disabled={isUploading}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {isUploading ? 'Procesando...' : 'Transcribir'}
              </button>
            </div>

            {/* Reproductor de audio */}
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              onPause={() => setIsPlaying(false)}
              className="w-full"
              controls
            />
          </div>
        )}

        {/* Instrucciones */}
        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
          <p className="font-medium mb-2">Instrucciones:</p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Grabar:</strong> Haz clic en "Iniciar Grabación" y habla claramente</li>
            <li><strong>Subir:</strong> Selecciona un archivo de audio existente</li>
            <li><strong>Reproducir:</strong> Escucha el audio antes de transcribir</li>
            <li><strong>Transcribir:</strong> Procesa el audio con IA para obtener análisis</li>
            <li><strong>Cambiar:</strong> Puedes reemplazar el audio en cualquier momento</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AudioRecorder; 