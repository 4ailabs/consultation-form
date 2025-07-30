import React, { useState } from 'react';
import { FileText, Calendar, User, Activity } from 'lucide-react';

interface EvolutionNoteProps {
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

const EvolutionNote: React.FC<EvolutionNoteProps> = ({ onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    nombre_paciente: '',
    edad: '',
    motivo_consulta: '',
    sintomas_actuales: '',
    evolucion: '',
    exploracion_fisica: '',
    signos_vitales: {
      presion_arterial: '',
      frecuencia_cardiaca: '',
      temperatura: '',
      saturacion_oxigeno: '',
      peso: '',
      talla: ''
    },
    tratamiento_actual: '',
    cambios_tratamiento: '',
    recomendaciones: '',
    proxima_cita: '',
    observaciones: ''
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl mb-6">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-8 h-8 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-800">Nota de Evolución</h2>
        </div>
        <p className="text-gray-600">
          Formulario rápido para notas de seguimiento y evolución del paciente.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Básica */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">Información del Paciente</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Fecha
              </label>
              <input
                type="date"
                value={formData.fecha}
                onChange={(e) => handleInputChange('fecha', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Paciente
              </label>
              <input
                type="text"
                value={formData.nombre_paciente}
                onChange={(e) => handleInputChange('nombre_paciente', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nombre completo"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Edad
              </label>
              <input
                type="number"
                value={formData.edad}
                onChange={(e) => handleInputChange('edad', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Años"
                min="0"
                max="150"
              />
            </div>
          </div>
        </div>

        {/* Motivo y Síntomas */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-800">Motivo de Consulta y Evolución</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivo de Consulta
              </label>
              <input
                type="text"
                value={formData.motivo_consulta}
                onChange={(e) => handleInputChange('motivo_consulta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Motivo principal de la consulta"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Síntomas Actuales
              </label>
              <textarea
                value={formData.sintomas_actuales}
                onChange={(e) => handleInputChange('sintomas_actuales', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Describa los síntomas actuales del paciente"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Evolución
              </label>
              <textarea
                value={formData.evolucion}
                onChange={(e) => handleInputChange('evolucion', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Describa la evolución desde la última consulta"
              />
            </div>
          </div>
        </div>

        {/* Exploración Física */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Exploración Física</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exploración Física
              </label>
              <textarea
                value={formData.exploracion_fisica}
                onChange={(e) => handleInputChange('exploracion_fisica', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Hallazgos de la exploración física"
              />
            </div>
          </div>
        </div>

        {/* Signos Vitales */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Signos Vitales</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Presión Arterial
              </label>
              <input
                type="text"
                value={formData.signos_vitales.presion_arterial}
                onChange={(e) => handleNestedChange('signos_vitales', 'presion_arterial', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: 120/80"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frecuencia Cardíaca
              </label>
              <input
                type="text"
                value={formData.signos_vitales.frecuencia_cardiaca}
                onChange={(e) => handleNestedChange('signos_vitales', 'frecuencia_cardiaca', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="lpm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temperatura
              </label>
              <input
                type="text"
                value={formData.signos_vitales.temperatura}
                onChange={(e) => handleNestedChange('signos_vitales', 'temperatura', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="°C"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Saturación O₂
              </label>
              <input
                type="text"
                value={formData.signos_vitales.saturacion_oxigeno}
                onChange={(e) => handleNestedChange('signos_vitales', 'saturacion_oxigeno', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="%"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Peso
              </label>
              <input
                type="text"
                value={formData.signos_vitales.peso}
                onChange={(e) => handleNestedChange('signos_vitales', 'peso', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="kg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Talla
              </label>
              <input
                type="text"
                value={formData.signos_vitales.talla}
                onChange={(e) => handleNestedChange('signos_vitales', 'talla', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="cm"
              />
            </div>
          </div>
        </div>

        {/* Tratamiento */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Tratamiento</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tratamiento Actual
              </label>
              <textarea
                value={formData.tratamiento_actual}
                onChange={(e) => handleInputChange('tratamiento_actual', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Medicamentos y tratamientos actuales"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cambios en el Tratamiento
              </label>
              <textarea
                value={formData.cambios_tratamiento}
                onChange={(e) => handleInputChange('cambios_tratamiento', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Modificaciones al tratamiento (dosis, frecuencia, etc.)"
              />
            </div>
          </div>
        </div>

        {/* Recomendaciones y Seguimiento */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recomendaciones y Seguimiento</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recomendaciones
              </label>
              <textarea
                value={formData.recomendaciones}
                onChange={(e) => handleInputChange('recomendaciones', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Recomendaciones para el paciente"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Próxima Cita
              </label>
              <input
                type="date"
                value={formData.proxima_cita}
                onChange={(e) => handleInputChange('proxima_cita', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observaciones Adicionales
              </label>
              <textarea
                value={formData.observaciones}
                onChange={(e) => handleInputChange('observaciones', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Observaciones adicionales o notas importantes"
              />
            </div>
          </div>
        </div>

        {/* Botón de Envío */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Guardando...
              </>
            ) : (
              <>
                <FileText className="w-5 h-5" />
                Guardar Nota de Evolución
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EvolutionNote; 