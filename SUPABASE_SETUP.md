# 🏥 Configuración de Supabase para SmartClinic AI

## 📋 Pasos para Configurar Supabase

### 1. **Crear Proyecto en Supabase**

1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Haz clic en "New Project"
4. Completa la información:
   - **Name**: `sistema-medico`
   - **Database Password**: Genera una contraseña segura
   - **Region**: Elige la más cercana a tu ubicación
5. Haz clic en "Create new project"

### 2. **Configurar Variables de Entorno**

Crea un archivo `.env` en la raíz de tu proyecto:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui

# Google AI Configuration (existing)
API_KEY=tu-google-ai-api-key
```

**Para obtener las credenciales:**

1. Ve a tu proyecto en Supabase
2. Ve a **Settings** → **API**
3. Copia:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** → `VITE_SUPABASE_ANON_KEY`

### 3. **Crear las Tablas en Supabase**

1. Ve a **SQL Editor** en tu proyecto de Supabase
2. Copia y pega el contenido del archivo `supabase-schema.sql`
3. Haz clic en **Run** para ejecutar el script

### 4. **Verificar la Configuración**

Ejecuta este comando para verificar que todo funciona:

```bash
npm run dev
```

Si ves errores sobre variables de entorno, verifica que tu archivo `.env` esté correctamente configurado.

## 🗄️ Estructura de la Base de Datos

### **Tablas Principales:**

#### 📋 `patients` - Pacientes
```sql
- id (UUID, Primary Key)
- folio (VARCHAR, Unique)
- full_name (VARCHAR)
- age (INTEGER)
- gender (VARCHAR)
- phone (VARCHAR)
- email (VARCHAR, Optional)
- address (TEXT, Optional)
- emergency_contact (VARCHAR, Optional)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 🏥 `consultations` - Consultas
```sql
- id (UUID, Primary Key)
- patient_id (UUID, Foreign Key)
- folio (VARCHAR, Unique)
- form_type (VARCHAR) - 'adulto', 'pediatrico', 'evolucion'
- flow_type (VARCHAR) - 'emergency', 'quick', 'evolution', 'complete', 'smart'
- chief_complaint (TEXT, Optional)
- symptoms (TEXT[], Optional)
- medications (TEXT[], Optional)
- observations (TEXT, Optional)
- transcription (TEXT, Optional)
- ai_analysis (TEXT, Optional)
- extracted_data (JSONB, Optional)
- elapsed_time (INTEGER)
- estimated_time (INTEGER)
- status (VARCHAR) - 'draft', 'completed', 'archived'
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 🧠 `smart_flow_data` - Datos del Flujo Inteligente
```sql
- id (UUID, Primary Key)
- consultation_id (UUID, Foreign Key)
- route (VARCHAR)
- priority (VARCHAR)
- required_steps (TEXT[])
- optional_steps (TEXT[])
- ai_analysis_level (VARCHAR)
- auto_fill_level (VARCHAR)
- smart_actions (JSONB, Optional)
- created_at (TIMESTAMP)
```

## 🔧 Funciones Disponibles

### **Servicios de Pacientes:**
```typescript
import { patientService } from '../utils/supabase';

// Crear paciente
const newPatient = await patientService.create({
  folio: 'HC-2024-001',
  full_name: 'Juan Pérez',
  age: 35,
  gender: 'Masculino',
  phone: '555-0123'
});

// Buscar pacientes
const patients = await patientService.search('Juan');

// Obtener todos los pacientes
const allPatients = await patientService.getAll();
```

### **Servicios de Consultas:**
```typescript
import { consultationService } from '../utils/supabase';

// Crear consulta
const newConsultation = await consultationService.create({
  patient_id: patientId,
  folio: 'CONS-2024-001',
  form_type: 'adulto',
  flow_type: 'smart',
  chief_complaint: 'Dolor de cabeza',
  status: 'completed'
});

// Obtener estadísticas
const stats = await consultationService.getStats();
```

### **Hooks de React:**
```typescript
import { usePatients, useConsultations } from '../hooks/useSupabase';

function MyComponent() {
  const { patients, loading, createPatient } = usePatients();
  const { consultations, getStats } = useConsultations();
  
  // Usar las funciones...
}
```

## 📊 Vistas Útiles

### **consultation_summary**
Vista que combina consultas con información del paciente:
```sql
SELECT * FROM consultation_summary;
```

### **consultation_stats**
Estadísticas agregadas del sistema:
```sql
SELECT * FROM consultation_stats;
```

## 🔐 Seguridad

### **Row Level Security (RLS)**
- Todas las tablas tienen RLS habilitado
- Políticas abiertas para desarrollo
- Para producción, configura políticas específicas

### **Políticas Recomendadas para Producción:**
```sql
-- Ejemplo: Solo usuarios autenticados pueden ver sus datos
CREATE POLICY "Users can only see their own data" ON patients
    FOR ALL USING (auth.uid() = user_id);
```

## 🚀 Migración de Datos Existentes

Si tienes datos existentes, puedes migrarlos:

```typescript
import { migrateExistingData } from '../utils/supabase';

// Migrar datos existentes
const result = await migrateExistingData(existingData);
console.log('Migración completada:', result);
```

## 📈 Monitoreo y Mantenimiento

### **Verificar Estado de la Base de Datos:**
```sql
-- Verificar número de registros
SELECT 
  (SELECT COUNT(*) FROM patients) as total_patients,
  (SELECT COUNT(*) FROM consultations) as total_consultations,
  (SELECT COUNT(*) FROM smart_flow_data) as total_smart_flows;
```

### **Limpiar Datos Antiguos:**
```sql
-- Archivar consultas de más de 2 años
UPDATE consultations 
SET status = 'archived' 
WHERE created_at < NOW() - INTERVAL '2 years';
```

## 🐛 Solución de Problemas

### **Error: "Missing environment variables"**
- Verifica que el archivo `.env` existe
- Asegúrate de que las variables estén correctamente nombradas
- Reinicia el servidor de desarrollo

### **Error: "Table does not exist"**
- Ejecuta el script SQL en Supabase
- Verifica que las tablas se crearon correctamente
- Revisa los logs en Supabase

### **Error: "Permission denied"**
- Verifica las políticas RLS
- Asegúrate de que las credenciales sean correctas
- Revisa los permisos en Supabase

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en la consola del navegador
2. Verifica la configuración en Supabase
3. Consulta la documentación oficial de Supabase
4. Revisa los logs en Supabase Dashboard

## 🎉 ¡Listo!

Una vez completados estos pasos, SmartClinic AI estará completamente integrado con Supabase y podrás:

- ✅ Almacenar pacientes y consultas
- ✅ Usar el flujo inteligente con persistencia
- ✅ Generar reportes y estadísticas
- ✅ Escalar automáticamente
- ✅ Tener backup automático de datos
- ✅ Acceder desde cualquier dispositivo 