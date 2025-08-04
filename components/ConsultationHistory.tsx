import React, { useState, useCallback } from 'react';
import { ArrowLeft, Search, FileText, User, Calendar, Filter } from 'lucide-react';
import { useConsultations, usePatients } from '../hooks/useSupabase';

interface ConsultationHistoryProps {
  onNewConsultation: (patient?: any) => void;
  onBack: () => void;
}

const ConsultationHistory: React.FC<ConsultationHistoryProps> = ({
  onNewConsultation,
  onBack
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'adulto' | 'pediatrico'>('all');
  const [selectedConsultation, setSelectedConsultation] = useState<any>(null);

  const { consultations, loading, deleteConsultation } = useConsultations();
  const { patients } = usePatients();

  // Crear un mapa de pacientes para búsqueda rápida
  const patientsMap = patients.reduce((acc: any, patient) => {
    acc[patient.id] = patient;
    return acc;
  }, {});

  const filteredConsultations = consultations.filter(consultation => {
    const matchesSearch = 
      consultation.main_symptoms?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patientsMap[consultation.patient_id]?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = selectedFilter === 'all' || consultation.consultation_type === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  const handleDeleteConsultation = useCallback(async (consultationId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta consulta?')) {
      try {
        await deleteConsultation(consultationId);
      } catch (error) {
        console.error('Error eliminando consulta:', error);
      }
    }
  }, [deleteConsultation]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPatientInfo = (patientId: string) => {
    const patient = patientsMap[patientId];
    return patient ? {
      name: patient.full_name,
      age: patient.age,
      gender: patient.gender,
      folio: patient.folio
    } : null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Historial de Consultas</h1>
        </div>
        <button
          onClick={() => onNewConsultation()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Nueva Consulta
        </button>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por síntomas, diagnóstico o paciente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas las consultas</option>
              <option value="adulto">Adultos</option>
              <option value="pediatrico">Pediátricos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de consultas */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Consultas ({filteredConsultations.length})
          </h3>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Cargando consultas...</p>
            </div>
          ) : filteredConsultations.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {searchTerm || selectedFilter !== 'all' 
                  ? 'No se encontraron consultas' 
                  : 'No hay consultas registradas'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredConsultations.map((consultation) => {
                const patientInfo = getPatientInfo(consultation.patient_id);
                
                return (
                  <div
                    key={consultation.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              {formatDate(consultation.created_at)}
                            </span>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            consultation.consultation_type === 'adulto' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {consultation.consultation_type === 'adulto' ? 'Adulto' : 'Pediátrico'}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            consultation.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {consultation.status === 'completed' ? 'Completada' : 'Pendiente'}
                          </span>
                        </div>

                        {patientInfo ? (
                          <div className="flex items-center gap-2 mb-3">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="font-medium text-gray-900">{patientInfo.name}</span>
                            <span className="text-sm text-gray-600">
                              ({patientInfo.age} años, {patientInfo.gender})
                            </span>
                            <span className="text-xs text-gray-500">Folio: {patientInfo.folio}</span>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 mb-3">
                            Paciente no encontrado
                          </div>
                        )}

                        {consultation.main_symptoms && (
                          <div className="mb-2">
                            <span className="text-sm font-medium text-gray-700">Síntomas: </span>
                            <span className="text-sm text-gray-600">
                              {consultation.main_symptoms.length > 100 
                                ? `${consultation.main_symptoms.substring(0, 100)}...` 
                                : consultation.main_symptoms}
                            </span>
                          </div>
                        )}

                        {consultation.diagnosis && (
                          <div className="mb-2">
                            <span className="text-sm font-medium text-gray-700">Diagnóstico: </span>
                            <span className="text-sm text-gray-600">
                              {consultation.diagnosis.length > 100 
                                ? `${consultation.diagnosis.substring(0, 100)}...` 
                                : consultation.diagnosis}
                            </span>
                          </div>
                        )}

                        {consultation.transcription && (
                          <div className="mb-2">
                            <span className="text-sm font-medium text-gray-700">Transcripción disponible</span>
                          </div>
                        )}

                        {consultation.ai_analysis && (
                          <div className="mb-2">
                            <span className="text-sm font-medium text-gray-700">Análisis de IA disponible</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => setSelectedConsultation(consultation)}
                          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                          Ver Detalles
                        </button>
                        <button
                          onClick={() => handleDeleteConsultation(consultation.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal de detalles */}
      {selectedConsultation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Detalles de la Consulta</h3>
                <button
                  onClick={() => setSelectedConsultation(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {/* Información básica */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha</label>
                    <p className="text-sm text-gray-900">{formatDate(selectedConsultation.created_at)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tipo</label>
                    <p className="text-sm text-gray-900 capitalize">{selectedConsultation.consultation_type}</p>
                  </div>
                </div>

                {/* Información del paciente */}
                {getPatientInfo(selectedConsultation.patient_id) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Paciente</label>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-900">
                        {getPatientInfo(selectedConsultation.patient_id)?.name} 
                        ({getPatientInfo(selectedConsultation.patient_id)?.age} años, 
                        {getPatientInfo(selectedConsultation.patient_id)?.gender})
                      </p>
                      <p className="text-xs text-gray-600">
                        Folio: {getPatientInfo(selectedConsultation.patient_id)?.folio}
                      </p>
                    </div>
                  </div>
                )}

                {/* Síntomas */}
                {selectedConsultation.main_symptoms && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Síntomas Principales</label>
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedConsultation.main_symptoms}</p>
                  </div>
                )}

                {/* Duración y severidad */}
                {(selectedConsultation.symptom_duration || selectedConsultation.symptom_severity) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedConsultation.symptom_duration && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Duración</label>
                        <p className="text-sm text-gray-900">{selectedConsultation.symptom_duration}</p>
                      </div>
                    )}
                    {selectedConsultation.symptom_severity && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Severidad</label>
                        <p className="text-sm text-gray-900 capitalize">{selectedConsultation.symptom_severity}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Antecedentes */}
                {(selectedConsultation.medical_history || selectedConsultation.current_medications || selectedConsultation.allergies) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Antecedentes</label>
                    <div className="space-y-2">
                      {selectedConsultation.medical_history && (
                        <div>
                          <span className="text-xs font-medium text-gray-600">Historial Médico:</span>
                          <p className="text-sm text-gray-900">{selectedConsultation.medical_history}</p>
                        </div>
                      )}
                      {selectedConsultation.current_medications && (
                        <div>
                          <span className="text-xs font-medium text-gray-600">Medicamentos:</span>
                          <p className="text-sm text-gray-900">{selectedConsultation.current_medications}</p>
                        </div>
                      )}
                      {selectedConsultation.allergies && (
                        <div>
                          <span className="text-xs font-medium text-gray-600">Alergias:</span>
                          <p className="text-sm text-gray-900">{selectedConsultation.allergies}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Signos vitales */}
                {selectedConsultation.vital_signs && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Signos Vitales</label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                      {selectedConsultation.vital_signs.blood_pressure && (
                        <div>
                          <span className="text-gray-600">PA:</span> {selectedConsultation.vital_signs.blood_pressure}
                        </div>
                      )}
                      {selectedConsultation.vital_signs.heart_rate && (
                        <div>
                          <span className="text-gray-600">FC:</span> {selectedConsultation.vital_signs.heart_rate}
                        </div>
                      )}
                      {selectedConsultation.vital_signs.temperature && (
                        <div>
                          <span className="text-gray-600">Temp:</span> {selectedConsultation.vital_signs.temperature}
                        </div>
                      )}
                      {selectedConsultation.vital_signs.weight && (
                        <div>
                          <span className="text-gray-600">Peso:</span> {selectedConsultation.vital_signs.weight}
                        </div>
                      )}
                      {selectedConsultation.vital_signs.height && (
                        <div>
                          <span className="text-gray-600">Altura:</span> {selectedConsultation.vital_signs.height}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Diagnóstico y tratamiento */}
                {(selectedConsultation.diagnosis || selectedConsultation.treatment_plan) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedConsultation.diagnosis && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Diagnóstico</label>
                        <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedConsultation.diagnosis}</p>
                      </div>
                    )}
                    {selectedConsultation.treatment_plan && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Plan de Tratamiento</label>
                        <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedConsultation.treatment_plan}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Recomendaciones y notas */}
                {(selectedConsultation.recommendations || selectedConsultation.notes) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedConsultation.recommendations && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Recomendaciones</label>
                        <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedConsultation.recommendations}</p>
                      </div>
                    )}
                    {selectedConsultation.notes && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                        <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedConsultation.notes}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Transcripción */}
                {selectedConsultation.transcription && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Transcripción</label>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedConsultation.transcription}</p>
                    </div>
                  </div>
                )}

                {/* Análisis de IA */}
                {selectedConsultation.ai_analysis && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Análisis de IA</label>
                    <div className="bg-blue-50 p-3 rounded">
                      <pre className="text-sm text-gray-900 whitespace-pre-wrap">
                        {JSON.stringify(selectedConsultation.ai_analysis, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationHistory; 