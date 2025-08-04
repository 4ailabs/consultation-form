-- 🏥 ESQUEMA DE BASE DE DATOS PARA SISTEMA MÉDICO
-- Ejecuta este script en el SQL Editor de Supabase

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 🧑‍⚕️ TABLA DE PACIENTES
CREATE TABLE IF NOT EXISTS patients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    folio VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    age INTEGER NOT NULL CHECK (age >= 0 AND age <= 150),
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('Masculino', 'Femenino')),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    emergency_contact VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 🏥 TABLA DE CONSULTAS
CREATE TABLE IF NOT EXISTS consultations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    folio VARCHAR(50) UNIQUE NOT NULL,
    form_type VARCHAR(20) NOT NULL CHECK (form_type IN ('adulto', 'pediatrico', 'evolucion')),
    flow_type VARCHAR(20) NOT NULL CHECK (flow_type IN ('emergency', 'quick', 'evolution', 'complete', 'smart')),
    chief_complaint TEXT,
    symptoms TEXT[],
    medications TEXT[],
    observations TEXT,
    transcription TEXT,
    ai_analysis TEXT,
    extracted_data JSONB,
    elapsed_time INTEGER DEFAULT 0,
    estimated_time INTEGER DEFAULT 15,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'completed', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 🧠 TABLA DE DATOS DEL FLUJO INTELIGENTE
CREATE TABLE IF NOT EXISTS smart_flow_data (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    consultation_id UUID REFERENCES consultations(id) ON DELETE CASCADE,
    route VARCHAR(50) NOT NULL,
    priority VARCHAR(20) NOT NULL,
    required_steps TEXT[],
    optional_steps TEXT[],
    ai_analysis_level VARCHAR(20) NOT NULL,
    auto_fill_level VARCHAR(20) NOT NULL,
    smart_actions JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 📊 TABLA DE ESTADÍSTICAS (opcional, para cache)
CREATE TABLE IF NOT EXISTS system_stats (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    stat_type VARCHAR(50) NOT NULL,
    stat_value JSONB NOT NULL,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 🔍 ÍNDICES PARA OPTIMIZAR BÚSQUEDAS
CREATE INDEX IF NOT EXISTS idx_patients_folio ON patients(folio);
CREATE INDEX IF NOT EXISTS idx_patients_name ON patients(full_name);
CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients(phone);
CREATE INDEX IF NOT EXISTS idx_consultations_patient_id ON consultations(patient_id);
CREATE INDEX IF NOT EXISTS idx_consultations_folio ON consultations(folio);
CREATE INDEX IF NOT EXISTS idx_consultations_form_type ON consultations(form_type);
CREATE INDEX IF NOT EXISTS idx_consultations_flow_type ON consultations(flow_type);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations(status);
CREATE INDEX IF NOT EXISTS idx_consultations_created_at ON consultations(created_at);
CREATE INDEX IF NOT EXISTS idx_smart_flow_consultation_id ON smart_flow_data(consultation_id);

-- 🔄 FUNCIÓN PARA ACTUALIZAR updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 🔄 TRIGGERS PARA ACTUALIZAR updated_at
CREATE TRIGGER update_patients_updated_at 
    BEFORE UPDATE ON patients 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_consultations_updated_at 
    BEFORE UPDATE ON consultations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 🔐 POLÍTICAS DE SEGURIDAD RLS (Row Level Security)
-- Habilitar RLS en todas las tablas
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE smart_flow_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_stats ENABLE ROW LEVEL SECURITY;

-- Políticas para pacientes (permitir todo para desarrollo)
CREATE POLICY "Allow all operations on patients" ON patients
    FOR ALL USING (true);

-- Políticas para consultas
CREATE POLICY "Allow all operations on consultations" ON consultations
    FOR ALL USING (true);

-- Políticas para smart flow data
CREATE POLICY "Allow all operations on smart_flow_data" ON smart_flow_data
    FOR ALL USING (true);

-- Políticas para estadísticas
CREATE POLICY "Allow all operations on system_stats" ON system_stats
    FOR ALL USING (true);

-- 📊 VISTAS ÚTILES
CREATE OR REPLACE VIEW consultation_summary AS
SELECT 
    c.id,
    c.folio,
    c.form_type,
    c.flow_type,
    c.status,
    c.created_at,
    p.full_name as patient_name,
    p.age as patient_age,
    p.gender as patient_gender,
    c.elapsed_time,
    c.estimated_time,
    CASE 
        WHEN c.elapsed_time <= c.estimated_time THEN 'Efficient'
        WHEN c.elapsed_time <= c.estimated_time * 1.5 THEN 'Good'
        ELSE 'Slow'
    END as efficiency_rating
FROM consultations c
JOIN patients p ON c.patient_id = p.id
ORDER BY c.created_at DESC;

-- 📈 VISTA DE ESTADÍSTICAS
CREATE OR REPLACE VIEW consultation_stats AS
SELECT 
    COUNT(*) as total_consultations,
    COUNT(CASE WHEN form_type = 'adulto' THEN 1 END) as adult_consultations,
    COUNT(CASE WHEN form_type = 'pediatrico' THEN 1 END) as pediatric_consultations,
    COUNT(CASE WHEN form_type = 'evolucion' THEN 1 END) as evolution_consultations,
    COUNT(CASE WHEN flow_type = 'emergency' THEN 1 END) as emergency_consultations,
    COUNT(CASE WHEN flow_type = 'quick' THEN 1 END) as quick_consultations,
    COUNT(CASE WHEN flow_type = 'smart' THEN 1 END) as smart_consultations,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_consultations,
    AVG(elapsed_time) as avg_elapsed_time,
    AVG(estimated_time) as avg_estimated_time
FROM consultations;

-- 🎯 FUNCIÓN PARA GENERAR FOLIO ÚNICO
CREATE OR REPLACE FUNCTION generate_unique_folio(prefix VARCHAR DEFAULT 'HC')
RETURNS VARCHAR AS $$
DECLARE
    new_folio VARCHAR;
    counter INTEGER := 1;
BEGIN
    LOOP
        new_folio := prefix || '-' || 
                    TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
                    TO_CHAR(NOW(), 'HH24MI') || '-' || 
                    LPAD(counter::TEXT, 3, '0');
        
        -- Verificar si el folio ya existe
        IF NOT EXISTS (SELECT 1 FROM patients WHERE folio = new_folio) AND
           NOT EXISTS (SELECT 1 FROM consultations WHERE folio = new_folio) THEN
            RETURN new_folio;
        END IF;
        
        counter := counter + 1;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 📝 COMENTARIOS EN LAS TABLAS
COMMENT ON TABLE patients IS 'Tabla principal de pacientes del sistema médico';
COMMENT ON TABLE consultations IS 'Tabla de consultas médicas con datos completos';
COMMENT ON TABLE smart_flow_data IS 'Datos del flujo inteligente para análisis de IA';
COMMENT ON TABLE system_stats IS 'Estadísticas del sistema para cache y reportes';

-- 🎉 ¡ESQUEMA COMPLETADO!
-- Ahora puedes usar las siguientes funciones:
-- - generate_unique_folio('HC') para generar folios únicos
-- - Las vistas consultation_summary y consultation_stats para reportes
-- - Todas las tablas tienen RLS habilitado pero con políticas abiertas para desarrollo 