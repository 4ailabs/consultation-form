# 🏥 Sistema de Consulta Médica Integral

Un sistema completo de gestión de consultas médicas con inteligencia artificial, transcripción de audio, y base de datos en tiempo real.

## ✨ Características Principales

### 🧠 **Smart Flow Inteligente**
- Flujo de consulta adaptativo basado en el contexto del paciente
- Análisis automático de síntomas y prioridades
- Optimización de tiempo y recursos médicos

### 🎙️ **Grabación y Transcripción**
- Grabación de audio en tiempo real
- Transcripción automática con Google Speech-to-Text
- Análisis de IA con Gemini para extracción de datos médicos

### 🗄️ **Base de Datos Supabase**
- Almacenamiento en tiempo real de pacientes y consultas
- Búsqueda inteligente de historiales médicos
- Estadísticas y reportes automáticos

### 📱 **Interfaz Moderna**
- Diseño responsive y accesible
- Navegación intuitiva entre diferentes flujos
- Dashboard con métricas en tiempo real

## 🚀 Tecnologías Utilizadas

- **Frontend:** React + TypeScript + Vite
- **UI:** Tailwind CSS + Lucide React
- **Base de Datos:** Supabase (PostgreSQL)
- **IA:** Google Gemini AI
- **Transcripción:** Google Speech-to-Text
- **Despliegue:** Vercel

## 📋 Requisitos Previos

- Node.js 18+ 
- Cuenta en [Supabase](https://supabase.com)
- Cuenta en [Google Cloud](https://cloud.google.com) (para IA y transcripción)
- Cuenta en [Vercel](https://vercel.com) (para despliegue)

## 🛠️ Instalación Local

### 1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/comprehensive-consultation-form.git
cd comprehensive-consultation-form
```

### 2. **Instalar dependencias**
```bash
npm install
```

### 3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui

# Google AI Configuration
API_KEY=tu-google-ai-api-key
```

### 4. **Configurar Supabase**
1. Ve a [supabase.com](https://supabase.com) y crea un proyecto
2. Ejecuta el script SQL en el SQL Editor:
   ```sql
   -- Copia y pega el contenido de supabase-schema.sql
   ```
3. Copia las credenciales de Settings → API

### 5. **Ejecutar en desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🗄️ Configuración de Supabase

### **Estructura de la Base de Datos**

#### **Tablas Principales:**
- **`patients`** - Información de pacientes
- **`consultations`** - Consultas médicas completas
- **`smart_flow_data`** - Datos del flujo inteligente
- **`system_stats`** - Estadísticas del sistema

#### **Vistas Útiles:**
- **`consultation_summary`** - Resumen de consultas con datos del paciente
- **`consultation_stats`** - Estadísticas agregadas del sistema

### **Ejecutar el Script SQL**
1. Ve al SQL Editor en tu proyecto de Supabase
2. Copia el contenido de `supabase-schema.sql`
3. Ejecuta el script

## 🚀 Despliegue en Vercel

### **1. Preparar el repositorio**
```bash
# Asegúrate de que todos los cambios estén commitados
git add .
git commit -m "Preparar para despliegue en Vercel"
git push origin main
```

### **2. Conectar con Vercel**
1. Ve a [vercel.com](https://vercel.com)
2. Importa tu repositorio de GitHub
3. Configura las variables de entorno en Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `API_KEY`

### **3. Configurar variables de entorno en Vercel**
En el dashboard de Vercel, ve a Settings → Environment Variables:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
API_KEY=tu-google-ai-api-key
```

### **4. Desplegar**
Vercel detectará automáticamente que es un proyecto Vite y lo desplegará correctamente.

## 📁 Estructura del Proyecto

```
comprehensive-consultation-form/
├── components/                 # Componentes React
│   ├── AudioRecorder.tsx      # Grabación de audio
│   ├── SmartConsultationFlow.tsx # Flujo inteligente
│   ├── PatientDashboard.tsx   # Dashboard de pacientes
│   ├── SupabaseExample.tsx    # Ejemplo de Supabase
│   └── ...
├── utils/                     # Utilidades
│   ├── supabase.ts           # Cliente y servicios de Supabase
│   ├── smartFlow.ts          # Motor de decisiones inteligentes
│   ├── folioGenerator.ts     # Generación de folios
│   └── ...
├── hooks/                     # Hooks personalizados
│   └── useSupabase.ts        # Hooks para Supabase
├── supabase-schema.sql       # Esquema de base de datos
├── SUPABASE_SETUP.md         # Guía de configuración
└── ...
```

## 🎯 Funcionalidades por Vista

### **🏠 Dashboard**
- Vista general del sistema
- Métricas en tiempo real
- Acceso rápido a funciones principales

### **🧠 Smart Flow**
- Flujo de consulta inteligente
- Análisis automático de contexto
- Optimización de tiempo y recursos

### **📋 Formularios**
- Formularios tradicionales
- Validación en tiempo real
- Generación de PDF

### **🗄️ Supabase**
- Gestión completa de pacientes
- Consultas y estadísticas
- Búsqueda inteligente

## 🔧 Scripts Disponibles

```bash
npm run dev          # Desarrollo local
npm run build        # Construir para producción
npm run preview      # Vista previa de producción
npm run lint         # Linting del código
```

## 📊 API y Servicios

### **Supabase Services**
```typescript
import { patientService, consultationService } from './utils/supabase';

// Crear paciente
const patient = await patientService.create({...});

// Crear consulta
const consultation = await consultationService.create({...});

// Obtener estadísticas
const stats = await consultationService.getStats();
```

### **Hooks de React**
```typescript
import { usePatients, useConsultations } from './hooks/useSupabase';

function MyComponent() {
  const { patients, createPatient } = usePatients();
  const { consultations, getStats } = useConsultations();
}
```

## 🔐 Seguridad

- **Row Level Security (RLS)** habilitado en Supabase
- Variables de entorno protegidas
- Autenticación preparada para implementación
- Validación de datos en frontend y backend

## 📈 Monitoreo y Analytics

- Estadísticas automáticas del sistema
- Métricas de rendimiento
- Logs de errores
- Dashboard de administración

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes problemas:

1. Revisa la documentación en `SUPABASE_SETUP.md`
2. Verifica las variables de entorno
3. Revisa los logs en la consola del navegador
4. Abre un issue en GitHub

## 🎉 Agradecimientos

- [Supabase](https://supabase.com) por la infraestructura de base de datos
- [Google AI](https://ai.google.dev/) por las capacidades de IA
- [Vercel](https://vercel.com) por el hosting y despliegue
- [Tailwind CSS](https://tailwindcss.com) por el framework de estilos

---

**¡Disfruta usando el Sistema de Consulta Médica Integral! 🏥✨**
