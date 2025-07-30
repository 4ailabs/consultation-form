# 🏥 Sistema de Consulta Médica Integral

Un sistema completo y moderno para la gestión de historias clínicas, formularios de consulta y notas de evolución médica.

## ✨ Características Principales

### 📋 Formularios Disponibles
- **👤 Formulario Adulto Básico** - Consulta rápida para pacientes adultos
- **👤 Historia Clínica Completa Adulto** - Formulario exhaustivo con 7 secciones
- **👶 Formulario Pediátrico Básico** - Consulta especializada para niños
- **👶 Historia Clínica Completa Pediátrica** - Formulario completo con datos perinatales
- **📋 Nota de Evolución** - Seguimiento rápido y eficiente

### 🚀 Funcionalidades Avanzadas
- **🤖 Análisis con IA** - Integración con Google Gemini para análisis clínico
- **📄 Generación de PDF** - Reportes imprimibles automáticos
- **💾 Auto-guardado** - Persistencia de datos en localStorage
- **📱 Responsive Design** - Funciona perfectamente en móviles y desktop
- **🎨 Interfaz Moderna** - Diseño limpio y profesional con Tailwind CSS

## 🛠️ Tecnologías Utilizadas

- **React 18** - Framework principal
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de estilos
- **Lucide React** - Iconos modernos
- **jsPDF + html2canvas** - Generación de PDF
- **Google Gemini AI** - Análisis inteligente

## 📦 Instalación

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/4ailabs/consultation-form.git
cd consultation-form
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
# Crear archivo .env.local
echo "API_KEY=tu_clave_de_google_gemini" > .env.local
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

5. **Abrir en el navegador**
```
http://localhost:5173
```

## 🏗️ Estructura del Proyecto

```
comprehensive-consultation-form/
├── components/
│   ├── common/
│   │   ├── FormComponents.tsx    # Componentes reutilizables
│   │   └── FormProgress.tsx      # Barra de progreso
│   ├── AdultForm.tsx             # Formulario básico adulto
│   ├── PediatricForm.tsx         # Formulario básico pediátrico
│   ├── CompleteForm.tsx          # Historia clínica completa
│   ├── EvolutionNote.tsx         # Nota de evolución
│   ├── PostSubmissionDashboard.tsx # Dashboard post-envío
│   └── PrintableReport.tsx       # Generación de PDF
├── utils/
│   ├── validation.ts             # Validaciones
│   └── storage.ts                # Gestión de localStorage
├── types.ts                      # Definiciones TypeScript
├── App.tsx                       # Componente principal
└── package.json
```

## 📋 Secciones del Formulario Completo

### Para Adultos (7 secciones):
1. **Datos Personales** - Información básica y contacto
2. **Motivo de Consulta** - Descripción del problema
3. **Historia Clínica** - Antecedentes, alergias, vacunación
4. **Revisión por Sistemas** - Cardiovascular, respiratorio, digestivo
5. **Estilo de Vida** - Actividad física, nutrición, sueño, salud mental
6. **Signos Vitales** - Presión arterial, temperatura, IMC
7. **Exploración Física** - Examen físico completo

### Para Pediátricos (8 secciones):
1. **Datos Personales** - Información básica
2. **Datos Perinatales** - Nacimiento, lactancia, desarrollo
3. **Motivo de Consulta** - Descripción del problema
4. **Historia Clínica** - Antecedentes y vacunación
5. **Desarrollo y Crecimiento** - Hitos del desarrollo
6. **Revisión por Sistemas** - Sistemas corporales
7. **Signos Vitales** - Medidas antropométricas
8. **Exploración Física** - Examen físico

## 🔧 Configuración

### Variables de Entorno
```env
# Google Gemini AI (opcional)
API_KEY=tu_clave_de_google_gemini

# Webhook para envío de datos (opcional)
WEBHOOK_URL=https://hook.us1.make.com/tu_webhook
```

### Personalización
- **Colores**: Editar `tailwind.config.js`
- **Validaciones**: Modificar `utils/validation.ts`
- **Campos**: Ajustar `types.ts` y componentes correspondientes

## 🚀 Despliegue

### Vercel (Recomendado)
1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Desplegar automáticamente

### Netlify
1. Conectar repositorio a Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`

### GitHub Pages
```bash
npm run build
# Subir contenido de dist/ a gh-pages
```

## 📊 Funcionalidades Avanzadas

### 🤖 Análisis con IA
- Resumen clínico automático
- Sugerencias diagnósticas
- Recomendaciones nutricionales
- Análisis de estilo de vida

### 📄 Generación de PDF
- Reportes profesionales
- Incluye todos los datos del formulario
- Formato médico estándar
- Descarga automática

### 💾 Persistencia de Datos
- Auto-guardado cada 30 segundos
- Restauración de datos perdidos
- Exportación/importación de datos
- Limpieza automática de datos expirados

## 🔒 Seguridad y Privacidad

- **Datos locales**: Toda la información se mantiene en el navegador
- **Sin servidor**: No se almacenan datos en servidores externos
- **Cifrado**: Datos en localStorage con expiración
- **GDPR/COPPA**: Cumple con regulaciones de privacidad

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

- **Issues**: [GitHub Issues](https://github.com/4ailabs/consultation-form/issues)
- **Documentación**: [Wiki del proyecto](https://github.com/4ailabs/consultation-form/wiki)
- **Contacto**: miguel@4ailabs.com

## 🗺️ Roadmap

### Próximas Funcionalidades
- [ ] Base de datos local (IndexedDB)
- [ ] Autenticación de usuarios
- [ ] Sincronización con servidor
- [ ] Búsqueda de pacientes
- [ ] Notificaciones push
- [ ] Modo offline completo
- [ ] Tests unitarios e integración
- [ ] Documentación técnica detallada
- [ ] Internacionalización (i18n)
- [ ] Temas personalizables
- [ ] Integración con sistemas de salud
- [ ] Cumplimiento HIPAA/GDPR
- [ ] Auditoría de acceso

---

**Desarrollado con ❤️ por [4AI Labs](https://4ailabs.com)**
