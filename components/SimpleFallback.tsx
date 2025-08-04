import React from 'react';

const SimpleFallback: React.FC = () => {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f0f0f0', 
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center'
    }}>
      <h1 style={{ color: '#333' }}>🏥 Sistema de Consulta Médica</h1>
      <p style={{ color: '#666' }}>React está funcionando correctamente</p>
      <div style={{ 
        margin: '20px 0', 
        padding: '10px', 
        backgroundColor: '#e8f5e8', 
        border: '1px solid #4caf50',
        borderRadius: '5px'
      }}>
        ✅ Aplicación cargada exitosamente
      </div>
      <p style={{ fontSize: '14px', color: '#888' }}>
        Timestamp: {new Date().toLocaleString()}
      </p>
    </div>
  );
};

export default SimpleFallback; 