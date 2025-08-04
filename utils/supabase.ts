import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Faltan las variables de entorno de Supabase');
  console.error('Agrega VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY a tu archivo .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 🏥 TIPOS DE DATOS MÉDICOS
export interface Patient {
  id: string;
  folio: string;
  full_name: string;
  age: number;
  gender: 'Masculino' | 'Femenino';
  phone: string;
  email?: string;
  address?: string;
  emergency_contact?: string;
  created_at: string;
  updated_at: string;
}

export interface Consultation {
  id: string;
  patient_id: string;
  folio: string;
  form_type: 'adulto' | 'pediatrico' | 'evolucion';
  flow_type: 'emergency' | 'quick' | 'evolution' | 'complete' | 'smart';
  chief_complaint?: string;
  symptoms?: string[];
  medications?: string[];
  observations?: string;
  transcription?: string;
  ai_analysis?: string;
  extracted_data?: any;
  elapsed_time: number;
  estimated_time: number;
  status: 'draft' | 'completed' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface SmartFlowData {
  id: string;
  consultation_id: string;
  route: string;
  priority: string;
  required_steps: string[];
  optional_steps: string[];
  ai_analysis_level: string;
  auto_fill_level: string;
  smart_actions: any[];
  created_at: string;
}

// 🎯 FUNCIONES PARA PACIENTES
export const patientService = {
  // Crear nuevo paciente
  async create(patientData: Omit<Patient, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('patients')
      .insert([patientData])
      .select()
      .single();

    if (error) {
      console.error('Error creando paciente:', error);
      throw error;
    }

    return data;
  },

  // Obtener paciente por ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error obteniendo paciente:', error);
      throw error;
    }

    return data;
  },

  // Buscar pacientes
  async search(query: string) {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .or(`full_name.ilike.%${query}%,folio.ilike.%${query}%,phone.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error buscando pacientes:', error);
      throw error;
    }

    return data;
  },

  // Obtener todos los pacientes
  async getAll() {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error obteniendo pacientes:', error);
      throw error;
    }

    return data;
  },

  // Actualizar paciente
  async update(id: string, updates: Partial<Patient>) {
    const { data, error } = await supabase
      .from('patients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error actualizando paciente:', error);
      throw error;
    }

    return data;
  }
};

// 🏥 FUNCIONES PARA CONSULTAS
export const consultationService = {
  // Crear nueva consulta
  async create(consultationData: Omit<Consultation, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('consultations')
      .insert([consultationData])
      .select()
      .single();

    if (error) {
      console.error('Error creando consulta:', error);
      throw error;
    }

    return data;
  },

  // Obtener consulta por ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('consultations')
      .select(`
        *,
        patient:patients(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error obteniendo consulta:', error);
      throw error;
    }

    return data;
  },

  // Obtener consultas de un paciente
  async getByPatientId(patientId: string) {
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error obteniendo consultas del paciente:', error);
      throw error;
    }

    return data;
  },

  // Obtener todas las consultas
  async getAll() {
    const { data, error } = await supabase
      .from('consultations')
      .select(`
        *,
        patient:patients(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error obteniendo consultas:', error);
      throw error;
    }

    return data;
  },

  // Actualizar consulta
  async update(id: string, updates: Partial<Consultation>) {
    const { data, error } = await supabase
      .from('consultations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error actualizando consulta:', error);
      throw error;
    }

    return data;
  },

  // Obtener estadísticas
  async getStats() {
    const { data, error } = await supabase
      .from('consultations')
      .select('form_type, flow_type, status, created_at');

    if (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw error;
    }

    const stats = {
      total: data.length,
      byType: {
        adulto: data.filter(c => c.form_type === 'adulto').length,
        pediatrico: data.filter(c => c.form_type === 'pediatrico').length,
        evolucion: data.filter(c => c.form_type === 'evolucion').length
      },
      byFlow: {
        emergency: data.filter(c => c.flow_type === 'emergency').length,
        quick: data.filter(c => c.flow_type === 'quick').length,
        evolution: data.filter(c => c.flow_type === 'evolution').length,
        complete: data.filter(c => c.flow_type === 'complete').length,
        smart: data.filter(c => c.flow_type === 'smart').length
      },
      byStatus: {
        draft: data.filter(c => c.status === 'draft').length,
        completed: data.filter(c => c.status === 'completed').length,
        archived: data.filter(c => c.status === 'archived').length
      }
    };

    return stats;
  }
};

// 🧠 FUNCIONES PARA SMART FLOW
export const smartFlowService = {
  // Guardar datos del flujo inteligente
  async saveFlowData(flowData: Omit<SmartFlowData, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('smart_flow_data')
      .insert([flowData])
      .select()
      .single();

    if (error) {
      console.error('Error guardando datos del flujo:', error);
      throw error;
    }

    return data;
  },

  // Obtener datos del flujo por consulta
  async getByConsultationId(consultationId: string) {
    const { data, error } = await supabase
      .from('smart_flow_data')
      .select('*')
      .eq('consultation_id', consultationId)
      .single();

    if (error) {
      console.error('Error obteniendo datos del flujo:', error);
      throw error;
    }

    return data;
  }
};

// 📊 FUNCIONES DE UTILIDAD
export const utils = {
  // Generar folio único
  generateFolio(type: string = 'HC'): string {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const time = date.toTimeString().slice(0, 5).replace(':', '');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    return `${type}-${dateStr}-${time}-${random}`;
  },

  // Formatear fecha para Supabase
  formatDate(date: Date): string {
    return date.toISOString();
  },

  // Validar datos del paciente
  validatePatient(patient: any): boolean {
    return !!(patient.full_name && patient.age && patient.gender && patient.phone);
  },

  // Validar datos de consulta
  validateConsultation(consultation: any): boolean {
    return !!(consultation.patient_id && consultation.form_type && consultation.folio);
  }
};

// 🔄 FUNCIÓN PARA MIGRAR DATOS EXISTENTES
export const migrateExistingData = async (existingData: any) => {
  try {
    // Crear paciente si no existe
    let patients = await patientService.search(existingData.patient?.fullName || existingData.nombre);
    let patient: Patient;
    
    if (!patients || patients.length === 0) {
      patient = await patientService.create({
        folio: existingData.folio || utils.generateFolio(),
        full_name: existingData.patient?.fullName || existingData.nombre || 'Paciente Anónimo',
        age: existingData.patient?.age || existingData.edad || 0,
        gender: existingData.patient?.gender || existingData.genero || 'Masculino',
        phone: existingData.patient?.phone || existingData.telefono || '',
        email: existingData.patient?.email || existingData.email || '',
        address: existingData.patient?.address || existingData.direccion || '',
        emergency_contact: existingData.patient?.emergencyContact || existingData.contacto_emergencia || ''
      });
    } else {
      patient = patients[0];
    }

    // Crear consulta
    const consultation = await consultationService.create({
      patient_id: patient.id,
      folio: existingData.folio || utils.generateFolio(),
      form_type: existingData.formType || 'adulto',
      flow_type: existingData.flowDecision?.route || 'complete',
      chief_complaint: existingData.motivo_consulta || existingData.chiefComplaint || '',
      symptoms: existingData.sintomas || existingData.symptoms || [],
      medications: existingData.medicamentos || existingData.medications || [],
      observations: existingData.observaciones || existingData.observations || '',
      transcription: existingData.transcription?.transcription || '',
      ai_analysis: existingData.transcription?.analysis || existingData.aiAnalysis || '',
      extracted_data: existingData.extractedData || {},
      elapsed_time: existingData.elapsedTime || 0,
      estimated_time: existingData.estimatedTime || 15,
      status: 'completed'
    });

    // Guardar datos del flujo inteligente si existen
    if (existingData.flowDecision) {
      await smartFlowService.saveFlowData({
        consultation_id: consultation.id,
        route: existingData.flowDecision.route,
        priority: existingData.flowDecision.priority,
        required_steps: existingData.flowDecision.requiredSteps || [],
        optional_steps: existingData.flowDecision.optionalSteps || [],
        ai_analysis_level: existingData.flowDecision.aiAnalysisLevel || 'basic',
        auto_fill_level: existingData.flowDecision.autoFillLevel || 'minimal',
        smart_actions: existingData.smartActions || []
      });
    }

    return { patient, consultation };
  } catch (error) {
    console.error('Error migrando datos:', error);
    throw error;
  }
}; 