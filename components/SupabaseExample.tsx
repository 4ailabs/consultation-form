import React, { useState } from 'react';
import { usePatients, useConsultations } from '../hooks/useSupabase';
import { utils } from '../utils/supabase';

const SupabaseExample: React.FC = () => {
  const { patients, loading: patientsLoading, createPatient, searchPatients, deletePatient } = usePatients();
  const { consultations, loading: consultationsLoading, createConsultation, getStats, deleteConsultation } = useConsultations();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState<any>(null);

  // 🎯 CREAR PACIENTE DE EJEMPLO
  const handleCreateExamplePatient = async () => {
    try {
      const newPatient = await createPatient({
        folio: utils.generateFolio('HC'),
        full_name: 'Juan Pérez García',
        age: 35,
        gender: 'Masculino',
        phone: '555-0123',
        email: 'juan.perez@email.com',
        address: 'Calle Principal 123, Ciudad',
        emergency_contact: 'María Pérez - 555-0124'
      });
      
      console.log('✅ Paciente creado:', newPatient);
    } catch (error) {
      console.error('❌ Error creando paciente:', error);
    }
  };

  // 🏥 CREAR CONSULTA DE EJEMPLO
  const handleCreateExampleConsultation = async () => {
    if (patients.length === 0) {
      alert('Primero crea un paciente');
      return;
    }

    try {
      const newConsultation = await createConsultation({
        patient_id: patients[0].id,
        folio: utils.generateFolio('CONS'),
        form_type: 'adulto',
        flow_type: 'smart',
        chief_complaint: 'Dolor de cabeza intenso',
        symptoms: ['dolor de cabeza', 'náusea', 'sensibilidad a la luz'],
        medications: ['paracetamol'],
        observations: 'Paciente refiere dolor pulsátil en la región temporal',
        transcription: 'El paciente dice que tiene dolor de cabeza desde hace 3 días...',
        ai_analysis: 'Análisis de IA: Síntomas sugestivos de migraña...',
        extracted_data: {
          symptoms: ['dolor de cabeza', 'náusea'],
          severity: 'moderado',
          duration: '3 días'
        },
        elapsed_time: 1200, // 20 minutos en segundos
        estimated_time: 15,
        status: 'completed'
      });
      
      console.log('✅ Consulta creada:', newConsultation);
    } catch (error) {
      console.error('❌ Error creando consulta:', error);
    }
  };

  // 📊 OBTENER ESTADÍSTICAS
  const handleGetStats = async () => {
    try {
      const consultationStats = await getStats();
      setStats(consultationStats);
      console.log('📊 Estadísticas:', consultationStats);
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas:', error);
    }
  };

  // 🔍 BUSCAR PACIENTES
  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchPatients(searchQuery);
    }
  };

  // 🗑️ ELIMINAR PACIENTE
  const handleDeletePatient = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este paciente? Esta acción no se puede deshacer.')) {
      try {
        await deletePatient(id);
        console.log('✅ Paciente eliminado');
      } catch (error) {
        console.error('❌ Error eliminando paciente:', error);
        alert('Error eliminando paciente');
      }
    }
  };

  // 🗑️ ELIMINAR CONSULTA
  const handleDeleteConsultation = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta consulta? Esta acción no se puede deshacer.')) {
      try {
        await deleteConsultation(id);
        console.log('✅ Consulta eliminada');
      } catch (error) {
        console.error('❌ Error eliminando consulta:', error);
        alert('Error eliminando consulta');
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">🏥 Sistema Médico con Supabase</h1>
        <p className="text-blue-100">
          Ejemplo de integración completa con base de datos en tiempo real
        </p>
      </div>

      {/* 🎯 ACCIONES PRINCIPALES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold mb-4">👤 Gestión de Pacientes</h3>
          <div className="space-y-3">
            <button
              onClick={handleCreateExamplePatient}
              disabled={patientsLoading}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {patientsLoading ? 'Creando...' : '➕ Crear Paciente Ejemplo'}
            </button>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar paciente..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                🔍
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold mb-4">🏥 Gestión de Consultas</h3>
          <div className="space-y-3">
            <button
              onClick={handleCreateExampleConsultation}
              disabled={consultationsLoading || patients.length === 0}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
            >
              {consultationsLoading ? 'Creando...' : '📋 Crear Consulta Ejemplo'}
            </button>
            
            <button
              onClick={handleGetStats}
              disabled={consultationsLoading}
              className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50"
            >
              📊 Ver Estadísticas
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold mb-4">📈 Estado del Sistema</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Pacientes:</span>
              <span className="font-medium">{patients.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Consultas:</span>
              <span className="font-medium">{consultations.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Estado:</span>
              <span className="text-green-600 font-medium">✅ Conectado</span>
            </div>
          </div>
        </div>
      </div>

      {/* 📊 ESTADÍSTICAS */}
      {stats && (
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold mb-4">📊 Estadísticas del Sistema</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-blue-700">Total Consultas</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.byType.adulto}</div>
              <div className="text-sm text-green-700">Adultos</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{stats.byFlow.smart}</div>
              <div className="text-sm text-purple-700">Smart Flow</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{stats.byStatus.completed}</div>
              <div className="text-sm text-orange-700">Completadas</div>
            </div>
          </div>
        </div>
      )}

      {/* 📋 LISTA DE PACIENTES */}
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <h3 className="text-lg font-semibold mb-4">👥 Pacientes Registrados</h3>
        {patientsLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600 mt-2">Cargando pacientes...</p>
          </div>
        ) : patients.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No hay pacientes registrados</p>
            <p className="text-sm text-gray-500">Crea un paciente de ejemplo para comenzar</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Folio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Edad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teléfono
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {patients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {patient.folio}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {patient.full_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patient.age} años
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patient.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(patient.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleDeletePatient(patient.id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                        title="Eliminar paciente"
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 📋 LISTA DE CONSULTAS */}
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <h3 className="text-lg font-semibold mb-4">🏥 Consultas Recientes</h3>
        {consultationsLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
            <p className="text-gray-600 mt-2">Cargando consultas...</p>
          </div>
        ) : consultations.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No hay consultas registradas</p>
            <p className="text-sm text-gray-500">Crea una consulta de ejemplo para comenzar</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Folio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Flujo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tiempo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {consultations.map((consultation) => (
                  <tr key={consultation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {consultation.folio}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        consultation.form_type === 'adulto' ? 'bg-blue-100 text-blue-700' :
                        consultation.form_type === 'pediatrico' ? 'bg-green-100 text-green-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {consultation.form_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        consultation.flow_type === 'smart' ? 'bg-purple-100 text-purple-700' :
                        consultation.flow_type === 'emergency' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {consultation.flow_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        consultation.status === 'completed' ? 'bg-green-100 text-green-700' :
                        consultation.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {consultation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {Math.round(consultation.elapsed_time / 60)} min
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(consultation.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleDeleteConsultation(consultation.id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                        title="Eliminar consulta"
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 💡 INFORMACIÓN */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">💡 Cómo Usar</h3>
        <div className="text-blue-700 space-y-2 text-sm">
          <p>1. <strong>Configura Supabase:</strong> Sigue las instrucciones en <code>SUPABASE_SETUP.md</code></p>
          <p>2. <strong>Crea un paciente:</strong> Haz clic en "Crear Paciente Ejemplo"</p>
          <p>3. <strong>Crea una consulta:</strong> Haz clic en "Crear Consulta Ejemplo"</p>
          <p>4. <strong>Ver estadísticas:</strong> Haz clic en "Ver Estadísticas"</p>
          <p>5. <strong>Busca pacientes:</strong> Usa el campo de búsqueda</p>
        </div>
      </div>
    </div>
  );
};

export default SupabaseExample; 