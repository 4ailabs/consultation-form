import React from 'react';
import { CheckCircle, Circle, AlertCircle, Save, Clock, Download, Upload } from 'lucide-react';
import { hasSavedData, getLastSaveInfo, getStorageStats } from '../../utils/storage';

interface FormProgressProps {
  currentSection: number;
  totalSections: number;
  formType: 'adulto' | 'pediatrico';
  isComplete: boolean;
  hasUnsavedChanges: boolean;
  onRestoreData?: () => void;
  onExportData?: () => void;
  onImportData?: () => void;
}

interface SectionStatus {
  id: number;
  title: string;
  isCompleted: boolean;
  isCurrent: boolean;
  hasErrors: boolean;
}

const FormProgress: React.FC<FormProgressProps> = ({
  currentSection,
  totalSections,
  formType,
  isComplete,
  hasUnsavedChanges,
  onRestoreData,
  onExportData,
  onImportData
}) => {
  const [showStats, setShowStats] = React.useState(false);
  const [stats, setStats] = React.useState(getStorageStats());
  const [hasSaved, setHasSaved] = React.useState(hasSavedData(formType));
  const [lastSaveInfo, setLastSaveInfo] = React.useState(getLastSaveInfo());

  React.useEffect(() => {
    setHasSaved(hasSavedData(formType));
    setLastSaveInfo(getLastSaveInfo());
    setStats(getStorageStats());
  }, [formType, hasUnsavedChanges]);

  const sections: SectionStatus[] = [
    { id: 1, title: 'Datos Personales', isCompleted: currentSection > 1, isCurrent: currentSection === 1, hasErrors: false },
    { id: 2, title: 'Motivo de Consulta', isCompleted: currentSection > 2, isCurrent: currentSection === 2, hasErrors: false },
    { id: 3, title: 'Historia Clínica', isCompleted: currentSection > 3, isCurrent: currentSection === 3, hasErrors: false },
    { id: 4, title: 'Revisión por Sistemas', isCompleted: currentSection > 4, isCurrent: currentSection === 4, hasErrors: false },
    { id: 5, title: 'Estilo de Vida', isCompleted: currentSection > 5, isCurrent: currentSection === 5, hasErrors: false },
    { id: 6, title: 'Signos Vitales', isCompleted: currentSection > 6, isCurrent: currentSection === 6, hasErrors: false },
    { id: 7, title: 'Exploración Física', isCompleted: currentSection > 7, isCurrent: currentSection === 7, hasErrors: false }
  ];

  const progressPercentage = (currentSection / totalSections) * 100;
  const completedSections = sections.filter(s => s.isCompleted).length;

  const getStatusIcon = (section: SectionStatus) => {
    if (section.hasErrors) {
      return <AlertCircle size={16} className="text-red-500" />;
    }
    if (section.isCompleted) {
      return <CheckCircle size={16} className="text-green-500" />;
    }
    if (section.isCurrent) {
      return <Circle size={16} className="text-blue-500 fill-current" />;
    }
    return <Circle size={16} className="text-gray-300" />;
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days} día${days > 1 ? 's' : ''}`;
    if (hours > 0) return `${hours} hora${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `${minutes} minuto${minutes > 1 ? 's' : ''}`;
    return 'Hace un momento';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      {/* Header con progreso general */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Progreso del Formulario
          </h3>
          <p className="text-sm text-gray-600">
            {completedSections} de {totalSections} secciones completadas
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <div className="flex items-center gap-1 text-orange-600 text-sm">
              <AlertCircle size={14} />
              Cambios sin guardar
            </div>
          )}
          
          {hasSaved && (
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <Save size={14} />
              Guardado automáticamente
            </div>
          )}
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            {Math.round(progressPercentage)}% completado
          </span>
          <span className="text-sm text-gray-500">
            Sección {currentSection} de {totalSections}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Lista de secciones */}
      <div className="space-y-2 mb-6">
        {sections.map((section) => (
          <div
            key={section.id}
            className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
              section.isCurrent
                ? 'bg-blue-50 border border-blue-200'
                : section.isCompleted
                ? 'bg-green-50 border border-green-200'
                : 'bg-gray-50 border border-gray-200'
            }`}
          >
            {getStatusIcon(section)}
            <span
              className={`text-sm font-medium ${
                section.isCurrent
                  ? 'text-blue-800'
                  : section.isCompleted
                  ? 'text-green-800'
                  : 'text-gray-600'
              }`}
            >
              {section.title}
            </span>
            
            {section.isCurrent && (
              <span className="ml-auto text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                Actual
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Información de guardado */}
      {hasSaved && lastSaveInfo && (
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock size={14} />
              Último guardado: {formatTimeAgo(lastSaveInfo.timestamp)}
            </div>
            
            <button
              onClick={() => setShowStats(!showStats)}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              {showStats ? 'Ocultar' : 'Ver'} estadísticas
            </button>
          </div>
          
          {showStats && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                <div>
                  <span className="font-medium">Tamaño total:</span> {stats.totalSize} bytes
                </div>
                <div>
                  <span className="font-medium">Elementos:</span> {stats.itemCount}
                </div>
                {stats.lastSave && (
                  <div className="col-span-2">
                    <span className="font-medium">Última actividad:</span> {stats.lastSave.toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Acciones */}
      <div className="flex flex-wrap gap-2">
        {hasSaved && onRestoreData && (
          <button
            onClick={onRestoreData}
            className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded hover:bg-blue-200 transition-colors"
          >
            <Upload size={14} />
            Restaurar datos
          </button>
        )}
        
        {onExportData && (
          <button
            onClick={onExportData}
            className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-sm rounded hover:bg-green-200 transition-colors"
          >
            <Download size={14} />
            Exportar
          </button>
        )}
        
        {onImportData && (
          <button
            onClick={onImportData}
            className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded hover:bg-purple-200 transition-colors"
          >
            <Upload size={14} />
            Importar
          </button>
        )}
      </div>

      {/* Estado de completitud */}
      {isComplete && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-800">
            <CheckCircle size={16} />
            <span className="font-medium">Formulario completado</span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            Todos los campos requeridos han sido completados correctamente.
          </p>
        </div>
      )}
    </div>
  );
};

export default FormProgress; 