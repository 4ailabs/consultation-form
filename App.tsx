import React, { useState, useCallback } from 'react';
import { LayoutDashboard, Users, FileText, History } from 'lucide-react';
import PatientDashboard from './components/PatientDashboard';
import PatientManagement from './components/PatientManagement';
import UnifiedConsultationForm from './components/UnifiedConsultationForm';
import ConsultationHistory from './components/ConsultationHistory';

// Tipos para la navegación simplificada
type ViewType = 'dashboard' | 'patients' | 'consultation' | 'history';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  const handleNewConsultation = useCallback((patient?: any) => {
    setSelectedPatient(patient);
    setCurrentView('consultation');
  }, []);

  const handleViewChange = useCallback((view: ViewType) => {
    setCurrentView(view);
  }, []);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <PatientDashboard 
            onNavigateToConsultation={handleNewConsultation}
            onNavigateToPatients={() => setCurrentView('patients')}
          />
        );
      case 'patients':
        return (
          <PatientManagement 
            onSelectPatient={handleNewConsultation}
            onBack={() => setCurrentView('dashboard')}
          />
        );
      case 'consultation':
        return (
          <UnifiedConsultationForm 
            patient={selectedPatient}
            onComplete={() => setCurrentView('history')}
            onBack={() => setCurrentView('dashboard')}
          />
        );
      case 'history':
        return (
          <ConsultationHistory 
            onNewConsultation={handleNewConsultation}
            onBack={() => setCurrentView('dashboard')}
          />
        );
      default:
        return <PatientDashboard onNavigateToConsultation={handleNewConsultation} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header simplificado */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">🏥 SmartClinic AI</h1>
              <p className="ml-4 text-sm text-gray-600">Sistema unificado con Supabase</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación simplificada */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => handleViewChange('dashboard')}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                currentView === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>
            <button
              onClick={() => handleViewChange('patients')}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                currentView === 'patients'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users className="w-4 h-4" />
              Pacientes
            </button>
            <button
              onClick={() => handleNewConsultation()}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                currentView === 'consultation'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="w-4 h-4" />
              Nueva Consulta
            </button>
            <button
              onClick={() => handleViewChange('history')}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                currentView === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <History className="w-4 h-4" />
              Historial
            </button>
          </nav>
        </div>
      </div>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderCurrentView()}
      </main>
    </div>
  );
};

export default App;