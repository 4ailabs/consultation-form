import React from 'react';

const DiagnosticView: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            🏥 Sistema de Consulta Médica
          </h1>
          
          <div className="space-y-4 text-left">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-medium text-green-800 mb-2">✅ Aplicación Cargada Correctamente</h3>
              <p className="text-green-700 text-sm">
                El componente de diagnóstico se está mostrando, lo que significa que React está funcionando.
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-medium text-blue-800 mb-2">🔧 Información del Sistema</h3>
              <div className="text-blue-700 text-sm space-y-1">
                <p><strong>Navegador:</strong> {navigator.userAgent}</p>
                <p><strong>URL:</strong> {window.location.href}</p>
                <p><strong>Modo:</strong> {process.env.NODE_ENV}</p>
                <p><strong>Timestamp:</strong> {new Date().toLocaleString()}</p>
              </div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h3 className="font-medium text-yellow-800 mb-2">⚠️ Variables de Entorno</h3>
              <div className="text-yellow-700 text-sm space-y-1">
                <p><strong>VITE_SUPABASE_URL:</strong> {import.meta.env.VITE_SUPABASE_URL ? '✅ Configurada' : '❌ No configurada'}</p>
                <p><strong>VITE_SUPABASE_ANON_KEY:</strong> {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Configurada' : '❌ No configurada'}</p>
                <p><strong>API_KEY:</strong> {import.meta.env.API_KEY ? '✅ Configurada' : '❌ No configurada'}</p>
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 className="font-medium text-purple-800 mb-2">🎯 Próximos Pasos</h3>
              <div className="text-purple-700 text-sm space-y-2">
                <p>1. Si las variables de entorno no están configuradas, configura tu archivo <code>.env</code></p>
                <p>2. Si todo está configurado, el problema puede estar en los componentes principales</p>
                <p>3. Revisa la consola del navegador para ver errores específicos</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              🔄 Recargar Página
            </button>
            
            <button
              onClick={() => {
                console.log('Diagnóstico - Variables de entorno:', {
                  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
                  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Configurada' : 'No configurada',
                  API_KEY: import.meta.env.API_KEY ? 'Configurada' : 'No configurada'
                });
              }}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              📋 Ver en Consola
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticView; 