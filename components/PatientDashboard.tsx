import React, { useState, useCallback } from 'react';
import { 
  Search, 
  UserPlus, 
  FileText, 
  Mic, 
  BarChart3, 
  Users, 
  Calendar,
  Plus,
  Clock,
  AlertCircle,
  CheckCircle,
  TrendingUp
} from 'lucide-react';
import SystemMetrics from './SystemMetrics';

interface Patient {
  id: string;
  folio: string;
  fullName: string;
  age: number;
  gender: 'Masculino' | 'Femenino';
  phone: string;
  lastVisit: string;
  nextAppointment?: string;
  status: 'active' | 'inactive' | 'pending';
  formType: 'adulto' | 'pediatrico';
}

interface DashboardStats {
  totalPatients: number;
  todayAppointments: number;
  pendingFollowUps: number;
  recentConsultations: number;
}

interface PatientDashboardProps {
  onNavigateToOptimized?: () => void;
  onNavigateToForms?: () => void;
}

const PatientDashboard: React.FC<PatientDashboardProps> = ({ 
  onNavigateToOptimized, 
  onNavigateToForms 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'patients' | 'consultations' | 'reports'>('dashboard');
  const [showMetrics, setShowMetrics] = useState(false);

  // Mock data - En producción vendría de una base de datos
  const [patients] = useState<Patient[]>([
    {
      id: '1',
      folio: 'HC-2024-001',
      fullName: 'María González López',
      age: 35,
      gender: 'Femenino',
      phone: '555-0123',
      lastVisit: '2024-08-01',
      nextAppointment: '2024-08-15',
      status: 'active',
      formType: 'adulto'
    },
    {
      id: '2',
      folio: 'HC-2024-002',
      fullName: 'Carlos Rodríguez',
      age: 28,
      gender: 'Masculino',
      phone: '555-0456',
      lastVisit: '2024-07-28',
      status: 'active',
      formType: 'adulto'
    },
    {
      id: '3',
      folio: 'HC-2024-003',
      fullName: 'Ana Martínez',
      age: 8,
      gender: 'Femenino',
      phone: '555-0789',
      lastVisit: '2024-08-02',
      nextAppointment: '2024-08-20',
      status: 'active',
      formType: 'pediatrico'
    }
  ]);

  const [stats] = useState<DashboardStats>({
    totalPatients: 156,
    todayAppointments: 8,
    pendingFollowUps: 12,
    recentConsultations: 24
  });

  const filteredPatients = patients.filter(patient =>
    patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  const handleNewConsultation = useCallback((patient?: Patient) => {
    // Navegar al flujo optimizado
    if (onNavigateToOptimized) {
      onNavigateToOptimized();
    }
    console.log('Nueva consulta para:', patient?.fullName || 'Nuevo paciente');
  }, [onNavigateToOptimized]);

  const handleQuickRecord = useCallback(() => {
    // Navegar al flujo optimizado con grabación rápida
    if (onNavigateToOptimized) {
      onNavigateToOptimized();
    }
    console.log('Iniciando grabación rápida');
  }, [onNavigateToOptimized]);

  const handlePatientSelect = useCallback((patient: Patient) => {
    setSelectedPatient(patient);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SmartClinic AI</h1>
              <p className="text-sm text-gray-600">Optimizando el trabajo médico con IA</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowMetrics(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                Métricas
              </button>
              <button
                onClick={handleQuickRecord}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <Mic className="w-4 h-4" />
                Grabación Rápida
              </button>
              <button
                onClick={() => handleNewConsultation()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Nueva Consulta
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'patients', label: 'Pacientes', icon: Users },
              { id: 'consultations', label: 'Consultas', icon: FileText },
              { id: 'reports', label: 'Reportes', icon: TrendingUp }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Pacientes</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Citas Hoy</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.todayAppointments}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Seguimientos Pendientes</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pendingFollowUps}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Consultas Recientes</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.recentConsultations}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Acciones Rápidas</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => handleNewConsultation()}
                    className="flex items-center justify-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <UserPlus className="w-6 h-6 text-gray-400" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Nueva Consulta</p>
                      <p className="text-sm text-gray-500">Adulto o Pediátrico</p>
                    </div>
                  </button>

                  <button
                    onClick={handleQuickRecord}
                    className="flex items-center justify-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Mic className="w-6 h-6 text-gray-400" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Grabación Rápida</p>
                      <p className="text-sm text-gray-500">Transcripción automática</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('patients')}
                    className="flex items-center justify-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
                  >
                    <Search className="w-6 h-6 text-gray-400" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Buscar Paciente</p>
                      <p className="text-sm text-gray-500">Historial completo</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Patients */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Pacientes Recientes</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {patients.slice(0, 5).map((patient) => (
                    <div
                      key={patient.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handlePatientSelect(patient)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {patient.fullName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{patient.fullName}</p>
                          <p className="text-sm text-gray-500">
                            {patient.folio} • {patient.age} años • {patient.gender}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          patient.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : patient.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {patient.status === 'active' ? 'Activo' : 
                           patient.status === 'pending' ? 'Pendiente' : 'Inactivo'}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNewConsultation(patient);
                          }}
                          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                          Consulta
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'patients' && (
          <div className="space-y-6">
            {/* Search */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Buscar por nombre, folio o teléfono..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <button
                  onClick={() => handleNewConsultation()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Nuevo Paciente
                </button>
              </div>
            </div>

            {/* Patients List */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Pacientes ({filteredPatients.length})
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {filteredPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handlePatientSelect(patient)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {patient.fullName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{patient.fullName}</p>
                          <p className="text-sm text-gray-500">
                            {patient.folio} • {patient.age} años • {patient.gender} • {patient.phone}
                          </p>
                          <p className="text-xs text-gray-400">
                            Última visita: {new Date(patient.lastVisit).toLocaleDateString()}
                            {patient.nextAppointment && ` • Próxima cita: ${new Date(patient.nextAppointment).toLocaleDateString()}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          patient.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : patient.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {patient.status === 'active' ? 'Activo' : 
                           patient.status === 'pending' ? 'Pendiente' : 'Inactivo'}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          patient.formType === 'adulto' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {patient.formType === 'adulto' ? 'Adulto' : 'Pediátrico'}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNewConsultation(patient);
                          }}
                          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                          Consulta
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'consultations' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Consultas Recientes</h3>
            <p className="text-gray-500">Funcionalidad en desarrollo...</p>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Reportes y Estadísticas</h3>
            <p className="text-gray-500">Funcionalidad en desarrollo...</p>
          </div>
        )}
      </div>

      {/* Metrics Modal */}
      {showMetrics && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <SystemMetrics onClose={() => setShowMetrics(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard; 