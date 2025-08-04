# Configuración del Backend de Transcripción

Este proyecto incluye funcionalidad de grabación y transcripción de audio usando Google Speech-to-Text y análisis con Gemini AI.

## Requisitos Previos

1. **Google Cloud Platform**:
   - Cuenta de Google Cloud
   - Proyecto habilitado
   - API de Speech-to-Text habilitada
   - Credenciales de servicio

2. **Gemini AI**:
   - API Key de Google AI Studio

## Configuración

### 1. Configurar Google Cloud Speech-to-Text

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Speech-to-Text
4. Crea credenciales de servicio:
   - Ve a "APIs & Services" > "Credentials"
   - Haz clic en "Create Credentials" > "Service Account"
   - Descarga el archivo JSON de credenciales

### 2. Configurar Gemini AI

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crea una nueva API Key
3. Copia la clave

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con:

```env
# Google Cloud Speech-to-Text
GOOGLE_APPLICATION_CREDENTIALS={"type":"service_account","project_id":"tu-proyecto","private_key_id":"...","private_key":"...","client_email":"...","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}

# Gemini AI
GEMINI_API_KEY=tu-api-key-de-gemini

# Configuración del servidor
PORT=3001
NODE_ENV=development
```

### 4. Instalar Dependencias del Backend

```bash
cd ../clinica-transcripcion-backend
npm install
```

### 5. Ejecutar el Backend

```bash
npm start
```

El backend estará disponible en `http://localhost:3001`

## Uso en el Formulario

1. En el formulario de consulta, ve a la sección "Grabación de Sesión"
2. Haz clic en "Iniciar Grabación"
3. Habla durante la consulta
4. Haz clic en "Detener Grabación"
5. Reproduce el audio si deseas verificar
6. Haz clic en "Transcribir" para procesar
7. Revisa los resultados y usa la transcripción o el análisis estructurado

## Características

- **Grabación de audio** en formato WebM
- **Transcripción automática** con Google Speech-to-Text
- **Análisis estructurado** con Gemini AI específico para biomagnetismo
- **Auto-completado** de campos del formulario
- **Interfaz intuitiva** con controles de grabación

## Solución de Problemas

### Error de permisos de micrófono
- Verifica que el navegador tenga permisos para acceder al micrófono
- Asegúrate de que el sitio use HTTPS en producción

### Error de transcripción
- Verifica las credenciales de Google Cloud
- Asegúrate de que la API de Speech-to-Text esté habilitada
- Revisa que el audio no esté en silencio

### Error de análisis de IA
- Verifica la API Key de Gemini
- Asegúrate de que la transcripción se haya completado correctamente

## Límites

- **Tamaño máximo**: 8MB por archivo (aproximadamente 8 minutos de audio)
- **Formatos soportados**: WebM, WAV, MP3, M4A, FLAC
- **Idioma**: Optimizado para español mexicano
- **Uso**: Hasta 60 segundos para archivos grandes

## Seguridad

- Las credenciales se manejan de forma segura en variables de entorno
- El audio se procesa en memoria y no se almacena permanentemente
- Las transcripciones se envían solo a servicios autorizados de Google 