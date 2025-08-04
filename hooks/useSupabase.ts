import { useState, useEffect, useCallback } from 'react';
import { 
  patientService, 
  consultationService, 
  smartFlowService,
  type Patient,
  type Consultation,
  type SmartFlowData
} from '../utils/supabase';

// 🎯 HOOK PARA PACIENTES
export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await patientService.getAll();
      setPatients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando pacientes');
    } finally {
      setLoading(false);
    }
  }, []);

  const searchPatients = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await patientService.search(query);
      setPatients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error buscando pacientes');
    } finally {
      setLoading(false);
    }
  }, []);

  const createPatient = useCallback(async (patientData: Omit<Patient, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const newPatient = await patientService.create(patientData);
      setPatients(prev => [newPatient, ...prev]);
      return newPatient;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creando paciente');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePatient = useCallback(async (id: string, updates: Partial<Patient>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedPatient = await patientService.update(id, updates);
      setPatients(prev => prev.map(p => p.id === id ? updatedPatient : p));
      return updatedPatient;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error actualizando paciente');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  return {
    patients,
    loading,
    error,
    fetchPatients,
    searchPatients,
    createPatient,
    updatePatient
  };
};

// 🏥 HOOK PARA CONSULTAS
export const useConsultations = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConsultations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await consultationService.getAll();
      setConsultations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando consultas');
    } finally {
      setLoading(false);
    }
  }, []);

  const getConsultationsByPatient = useCallback(async (patientId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await consultationService.getByPatientId(patientId);
      setConsultations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando consultas del paciente');
    } finally {
      setLoading(false);
    }
  }, []);

  const createConsultation = useCallback(async (consultationData: Omit<Consultation, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const newConsultation = await consultationService.create(consultationData);
      setConsultations(prev => [newConsultation, ...prev]);
      return newConsultation;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creando consulta');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateConsultation = useCallback(async (id: string, updates: Partial<Consultation>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedConsultation = await consultationService.update(id, updates);
      setConsultations(prev => prev.map(c => c.id === id ? updatedConsultation : c));
      return updatedConsultation;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error actualizando consulta');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const stats = await consultationService.getStats();
      return stats;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error obteniendo estadísticas');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConsultations();
  }, [fetchConsultations]);

  return {
    consultations,
    loading,
    error,
    fetchConsultations,
    getConsultationsByPatient,
    createConsultation,
    updateConsultation,
    getStats
  };
};

// 🧠 HOOK PARA SMART FLOW
export const useSmartFlow = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveFlowData = useCallback(async (flowData: Omit<SmartFlowData, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await smartFlowService.saveFlowData(flowData);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error guardando datos del flujo');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getFlowData = useCallback(async (consultationId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await smartFlowService.getByConsultationId(consultationId);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error obteniendo datos del flujo');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    saveFlowData,
    getFlowData
  };
};

// 🔄 HOOK PARA MIGRACIÓN DE DATOS
export const useDataMigration = () => {
  const [migrating, setMigrating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const migrateData = useCallback(async (existingData: any) => {
    setMigrating(true);
    setError(null);
    try {
      const { migrateExistingData } = await import('../utils/supabase');
      const result = await migrateExistingData(existingData);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error migrando datos');
      throw err;
    } finally {
      setMigrating(false);
    }
  }, []);

  return {
    migrating,
    error,
    migrateData
  };
};

// 📊 HOOK PARA ESTADÍSTICAS EN TIEMPO REAL
export const useRealTimeStats = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await consultationService.getStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando estadísticas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    // Actualizar estadísticas cada 5 minutos
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    fetchStats
  };
}; 