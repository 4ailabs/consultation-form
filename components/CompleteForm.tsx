import React, { useState, useCallback } from 'react';
import { User, Baby, FileText, Calendar, Phone, Mail, MapPin, ChevronLeft, ChevronRight, CheckCircle, Mic, Square, FileAudio } from 'lucide-react';
import AudioRecorder from './AudioRecorder';
import TranscriptionResults from './TranscriptionResults';

interface CompleteFormProps {
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  formType: 'adulto' | 'pediatrico';
}

const CompleteForm: React.FC<CompleteFormProps> = ({ onSubmit, isSubmitting, formType }) => {
  const [currentSection, setCurrentSection] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcriptionData, setTranscriptionData] = useState<{
    transcription: string;
    analysis: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    personalData: {
      fullName: '',
      dateOfBirth: '',
      age: '',
      gender: '',
      maritalStatus: '',
      occupation: '',
      phone: '',
      email: '',
      address: '',
      emergencyContact: {
        name: '',
        relationship: '',
        phone: ''
      }
    },
    chiefComplaint: {
      reason: '',
      duration: '',
      severity: 'Leve',
      aggravatingFactors: '',
      relievingFactors: ''
    },
    medicalHistory: {
      presentIllness: '',
      pastMedicalHistory: '',
      allergies: '',
      medications: '',
      familyHistory: ''
    },
    systemReview: {
      cardiovascular: '',
      respiratory: '',
      gastrointestinal: '',
      genitourinary: '',
      musculoskeletal: '',
      neurological: '',
      dermatological: '',
      psychological: ''
    },
    lifestyle: {
      physicalActivity: '',
      nutrition: '',
      sleep: '',
      mentalHealth: '',
      toxicHabits: ''
    },
    vitalSigns: {
      bloodPressure: '',
      heartRate: '',
      respiratoryRate: '',
      temperature: '',
      oxygenSaturation: '',
      weight: '',
      height: '',
      bmi: ''
    },
    physicalExam: {
      general: '',
      head: '',
      neck: '',
      chest: '',
      cardiovascular: '',
      respiratory: '',
      abdomen: '',
      extremities: '',
      neurological: '',
      skin: ''
    },
    // Campos específicos para pediatría
    pediatricData: formType === 'pediatrico' ? {
      birthWeight: '',
      birthLength: '',
      gestationalAge: '',
      deliveryType: 'Vaginal',
      complications: '',
      developmentalMilestones: {
        social: '',
        language: '',
        motor: '',
        cognitive: ''
      },
      feedingHistory: {
        breastfeeding: false,
        formulaFeeding: false,
        weaningAge: '',
        currentDiet: '',
        feedingProblems: ''
      },
      growthHistory: {
        weightHistory: '',
        heightHistory: '',
        headCircumference: '',
        percentiles: ''
      }
    } : null
  });

  const sections = formType === 'pediatrico' ? [
    'Datos Personales',
    'Datos Perinatales',
    'Motivo de Consulta',
    'Grabación de Sesión',
    'Historia Clínica',
    'Desarrollo y Crecimiento',
    'Revisión por Sistemas',
    'Signos Vitales',
    'Exploración Física'
  ] : [
    'Datos Personales',
    'Motivo de Consulta',
    'Grabación de Sesión',
    'Historia Clínica',
    'Revisión por Sistemas',
    'Estilo de Vida',
    'Signos Vitales',
    'Exploración Física'
  ];

  const handleInputChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleNestedChange = (section: string, subsection: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [subsection]: {
          ...(prev[section as keyof typeof prev] as any)?.[subsection],
          [field]: value
        }
      }
    }));
  };

  const handleTranscriptionComplete = useCallback((transcription: string, analysis: string) => {
    setTranscriptionData({ transcription, analysis });
  }, []);

  const handleUseTranscription = useCallback((transcription: string) => {
    // Auto-completar campos relevantes con la transcripción
    setFormData(prev => ({
      ...prev,
      chiefComplaint: {
        ...prev.chiefComplaint,
        reason: transcription
      },
      medicalHistory: {
        ...prev.medicalHistory,
        presentIllness: transcription
      }
    }));
  }, []);

  const handleUseAnalysis = useCallback((analysis: string) => {
    // Auto-completar campos con el análisis estructurado
    setFormData(prev => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory,
        presentIllness: analysis
      }
    }));
  }, []);

  const calculateAge = useCallback((birthDate: string) => {
    if (birthDate && birthDate.trim() !== '') {
      const today = new Date();
      const birth = new Date(birthDate);
      
      if (isNaN(birth.getTime())) {
        return;
      }
      
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      
      if (age >= 0 && age <= 150) {
        handleInputChange('personalData', 'age', age.toString());
      }
    }
  }, []);

  const calculateBMI = useCallback(() => {
    const weight = parseFloat(formData.vitalSigns.weight);
    const height = parseFloat(formData.vitalSigns.height);
    
    if (weight && height && height > 0) {
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);
      handleInputChange('vitalSigns', 'bmi', bmi.toFixed(2));
    }
  }, [formData.vitalSigns.weight, formData.vitalSigns.height]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const hasDateOfBirth = formData.personalData.dateOfBirth && formData.personalData.dateOfBirth.trim() !== '';
    const hasAge = formData.personalData.age && formData.personalData.age.trim() !== '';
    
    if (!hasDateOfBirth && !hasAge) {
      alert('Por favor, ingrese al menos la fecha de nacimiento o la edad del paciente.');
      return;
    }
    
    onSubmit(formData);
  };

  const nextSection = () => {
    if (currentSection < sections.length) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  const renderSection = () => {
    switch (currentSection) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Datos Personales</h2>
            
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>📅 Información de Edad:</strong> Puede ingresar la fecha de nacimiento exacta (recomendado) o la edad aproximada. 
                Si ingresa la fecha, la edad se calculará automáticamente.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={formData.personalData.fullName}
                  onChange={(e) => handleInputChange('personalData', 'fullName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nombre y apellidos"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  value={formData.personalData.dateOfBirth}
                  onChange={(e) => {
                    handleInputChange('personalData', 'dateOfBirth', e.target.value);
                    calculateAge(e.target.value);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Edad
                </label>
                <input
                  type="number"
                  value={formData.personalData.age}
                  onChange={(e) => handleInputChange('personalData', 'age', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Edad en años"
                  min="0"
                  max="150"
                  disabled={!!formData.personalData.dateOfBirth}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Género
                </label>
                <select
                  value={formData.personalData.gender}
                  onChange={(e) => handleInputChange('personalData', 'gender', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Seleccionar género</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              
              {formType === 'adulto' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado Civil
                    </label>
                    <select
                      value={formData.personalData.maritalStatus}
                      onChange={(e) => handleInputChange('personalData', 'maritalStatus', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Seleccionar estado civil</option>
                      <option value="Soltero(a)">Soltero(a)</option>
                      <option value="Casado(a)">Casado(a)</option>
                      <option value="Unión libre">Unión libre</option>
                      <option value="Divorciado(a)">Divorciado(a)</option>
                      <option value="Viudo(a)">Viudo(a)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ocupación
                    </label>
                    <input
                      type="text"
                      value={formData.personalData.occupation}
                      onChange={(e) => handleInputChange('personalData', 'occupation', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ocupación o profesión"
                    />
                  </div>
                </>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.personalData.phone}
                  onChange={(e) => handleInputChange('personalData', 'phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Número de teléfono"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  value={formData.personalData.email}
                  onChange={(e) => handleInputChange('personalData', 'email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Correo electrónico"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Dirección
                </label>
                <input
                  type="text"
                  value={formData.personalData.address}
                  onChange={(e) => handleInputChange('personalData', 'address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Dirección completa"
                />
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Contacto de Emergencia</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={formData.personalData.emergencyContact.name}
                    onChange={(e) => handleNestedChange('personalData', 'emergencyContact', 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nombre del contacto"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Relación
                  </label>
                  <input
                    type="text"
                    value={formData.personalData.emergencyContact.relationship}
                    onChange={(e) => handleNestedChange('personalData', 'emergencyContact', 'relationship', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: Padre, Madre, Esposo"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={formData.personalData.emergencyContact.phone}
                    onChange={(e) => handleNestedChange('personalData', 'emergencyContact', 'phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Número de teléfono"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        if (formType === 'pediatrico') {
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Datos Perinatales</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Peso al Nacer (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.pediatricData?.birthWeight}
                    onChange={(e) => handleInputChange('pediatricData', 'birthWeight', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: 3.2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitud al Nacer (cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.pediatricData?.birthLength}
                    onChange={(e) => handleInputChange('pediatricData', 'birthLength', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: 50.0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Edad Gestacional (semanas)
                  </label>
                  <input
                    type="number"
                    value={formData.pediatricData?.gestationalAge}
                    onChange={(e) => handleInputChange('pediatricData', 'gestationalAge', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: 40"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Parto
                  </label>
                  <select
                    value={formData.pediatricData?.deliveryType}
                    onChange={(e) => handleInputChange('pediatricData', 'deliveryType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Vaginal">Vaginal</option>
                    <option value="Cesárea">Cesárea</option>
                    <option value="Instrumentado">Instrumentado</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Complicaciones del Parto
                </label>
                <textarea
                  value={formData.pediatricData?.complications}
                  onChange={(e) => handleInputChange('pediatricData', 'complications', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describa cualquier complicación durante el embarazo o parto"
                />
              </div>
            </div>
          );
        } else {
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Motivo de Consulta</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motivo Principal
                  </label>
                  <textarea
                    value={formData.chiefComplaint.reason}
                    onChange={(e) => handleInputChange('chiefComplaint', 'reason', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Describa el motivo principal de la consulta"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duración
                    </label>
                    <input
                      type="text"
                      value={formData.chiefComplaint.duration}
                      onChange={(e) => handleInputChange('chiefComplaint', 'duration', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ej: 3 días, 2 semanas"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Severidad
                    </label>
                    <select
                      value={formData.chiefComplaint.severity}
                      onChange={(e) => handleInputChange('chiefComplaint', 'severity', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Leve">Leve</option>
                      <option value="Moderado">Moderado</option>
                      <option value="Severo">Severo</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Factores Agravantes
                  </label>
                  <textarea
                    value={formData.chiefComplaint.aggravatingFactors}
                    onChange={(e) => handleInputChange('chiefComplaint', 'aggravatingFactors', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                    placeholder="¿Qué empeora los síntomas?"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Factores Mejorantes
                  </label>
                  <textarea
                    value={formData.chiefComplaint.relievingFactors}
                    onChange={(e) => handleInputChange('chiefComplaint', 'relievingFactors', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                    placeholder="¿Qué mejora los síntomas?"
                  />
                </div>
              </div>
            </div>
          );
        }

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Grabación de Sesión
            </h2>
            
            <div className="space-y-6">
              <AudioRecorder
                onTranscriptionComplete={handleTranscriptionComplete}
                isRecording={isRecording}
                setIsRecording={setIsRecording}
              />
              
              {transcriptionData && (
                <TranscriptionResults
                  transcription={transcriptionData.transcription}
                  analysis={transcriptionData.analysis}
                  onUseTranscription={handleUseTranscription}
                  onUseAnalysis={handleUseAnalysis}
                />
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {formType === 'pediatrico' ? 'Historia Clínica' : 'Historia Clínica'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enfermedad Actual
                </label>
                <textarea
                  value={formData.medicalHistory?.presentIllness || ''}
                  onChange={(e) => handleInputChange('medicalHistory', 'presentIllness', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Describa la enfermedad actual del paciente..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Antecedentes Patológicos
                </label>
                <textarea
                  value={formData.medicalHistory?.pastMedicalHistory || ''}
                  onChange={(e) => handleInputChange('medicalHistory', 'pastMedicalHistory', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Enfermedades previas, cirugías, hospitalizaciones..."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alergias
                  </label>
                  <textarea
                    value={formData.medicalHistory?.allergies || ''}
                    onChange={(e) => handleInputChange('medicalHistory', 'allergies', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                    placeholder="Alergias a medicamentos, alimentos, etc..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medicamentos Actuales
                  </label>
                  <textarea
                    value={formData.medicalHistory?.currentMedications || ''}
                    onChange={(e) => handleInputChange('medicalHistory', 'currentMedications', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                    placeholder="Medicamentos que toma actualmente..."
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {formType === 'pediatrico' ? 'Desarrollo y Crecimiento' : 'Revisión por Sistemas'}
            </h2>
            
            {formType === 'pediatrico' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Peso Actual (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.pediatricData?.growthHistory?.weightHistory || ''}
                      onChange={(e) => handleNestedChange('pediatricData', 'growthHistory', 'weightHistory', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Ej: 15.5"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Talla Actual (cm)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.pediatricData?.growthHistory?.heightHistory || ''}
                      onChange={(e) => handleNestedChange('pediatricData', 'growthHistory', 'heightHistory', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Ej: 95.0"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hitos del Desarrollo
                  </label>
                  <textarea
                    value={formData.pediatricData?.developmentalMilestones?.social || ''}
                    onChange={(e) => handleNestedChange('pediatricData', 'developmentalMilestones', 'social', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={3}
                    placeholder="Describa los hitos del desarrollo alcanzados..."
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sistema Cardiovascular
                    </label>
                    <textarea
                      value={formData.systemReview?.cardiovascular || ''}
                      onChange={(e) => handleInputChange('systemReview', 'cardiovascular', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={2}
                      placeholder="Dolor torácico, palpitaciones, edema..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sistema Respiratorio
                    </label>
                    <textarea
                      value={formData.systemReview?.respiratory || ''}
                      onChange={(e) => handleInputChange('systemReview', 'respiratory', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={2}
                      placeholder="Tos, disnea, sibilancias..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sistema Digestivo
                    </label>
                    <textarea
                      value={formData.systemReview?.gastrointestinal || ''}
                      onChange={(e) => handleInputChange('systemReview', 'gastrointestinal', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={2}
                      placeholder="Náuseas, vómitos, dolor abdominal..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sistema Genitourinario
                    </label>
                    <textarea
                      value={formData.systemReview?.genitourinary || ''}
                      onChange={(e) => handleInputChange('systemReview', 'genitourinary', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={2}
                      placeholder="Disuria, hematuria, cambios menstruales..."
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {formType === 'pediatrico' ? 'Revisión por Sistemas' : 'Estilo de Vida'}
            </h2>
            
            {formType === 'pediatrico' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sistema Cardiovascular
                    </label>
                    <textarea
                      value={formData.systemReview?.cardiovascular || ''}
                      onChange={(e) => handleInputChange('systemReview', 'cardiovascular', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      rows={2}
                      placeholder="Dolor torácico, palpitaciones, edema..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sistema Respiratorio
                    </label>
                    <textarea
                      value={formData.systemReview?.respiratory || ''}
                      onChange={(e) => handleInputChange('systemReview', 'respiratory', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      rows={2}
                      placeholder="Tos, disnea, sibilancias..."
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hábitos Alimenticios
                    </label>
                    <textarea
                      value={formData.lifestyle?.diet || ''}
                      onChange={(e) => handleInputChange('lifestyle', 'diet', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="Describa los hábitos alimenticios..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Actividad Física
                    </label>
                    <textarea
                      value={formData.lifestyle?.exercise || ''}
                      onChange={(e) => handleInputChange('lifestyle', 'exercise', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="Tipo y frecuencia de ejercicio..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hábitos de Sueño
                    </label>
                    <textarea
                      value={formData.lifestyle?.sleep || ''}
                      onChange={(e) => handleInputChange('lifestyle', 'sleep', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={2}
                      placeholder="Horas de sueño, calidad del sueño..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Consumo de Sustancias
                    </label>
                    <textarea
                      value={formData.lifestyle?.substances || ''}
                      onChange={(e) => handleInputChange('lifestyle', 'substances', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={2}
                      placeholder="Tabaco, alcohol, drogas..."
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {formType === 'pediatrico' ? 'Revisión por Sistemas' : 'Estilo de Vida'}
            </h2>
            
            {formType === 'pediatrico' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sistema Cardiovascular
                    </label>
                    <textarea
                      value={formData.systemReview?.cardiovascular || ''}
                      onChange={(e) => handleInputChange('systemReview', 'cardiovascular', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      rows={2}
                      placeholder="Dolor torácico, palpitaciones, edema..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sistema Respiratorio
                    </label>
                    <textarea
                      value={formData.systemReview?.respiratory || ''}
                      onChange={(e) => handleInputChange('systemReview', 'respiratory', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      rows={2}
                      placeholder="Tos, disnea, sibilancias..."
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hábitos Alimenticios
                    </label>
                    <textarea
                      value={formData.lifestyle?.diet || ''}
                      onChange={(e) => handleInputChange('lifestyle', 'diet', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="Describa los hábitos alimenticios..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Actividad Física
                    </label>
                    <textarea
                      value={formData.lifestyle?.exercise || ''}
                      onChange={(e) => handleInputChange('lifestyle', 'exercise', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="Tipo y frecuencia de ejercicio..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hábitos de Sueño
                    </label>
                    <textarea
                      value={formData.lifestyle?.sleep || ''}
                      onChange={(e) => handleInputChange('lifestyle', 'sleep', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={2}
                      placeholder="Horas de sueño, calidad del sueño..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Consumo de Sustancias
                    </label>
                    <textarea
                      value={formData.lifestyle?.substances || ''}
                      onChange={(e) => handleInputChange('lifestyle', 'substances', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={2}
                      placeholder="Tabaco, alcohol, drogas..."
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );


        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Signos Vitales</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Presión Arterial (mmHg)
                </label>
                <input
                  type="text"
                  value={formData.vitalSigns.presion_arterial}
                  onChange={(e) => handleInputChange('vitalSigns', 'presion_arterial', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: 120/80"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frecuencia Cardíaca (lpm)
                </label>
                <input
                  type="number"
                  value={formData.vitalSigns.frecuencia_cardiaca}
                  onChange={(e) => handleInputChange('vitalSigns', 'frecuencia_cardiaca', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: 72"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temperatura (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.vitalSigns.temperatura}
                  onChange={(e) => handleInputChange('vitalSigns', 'temperatura', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: 36.8"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Saturación de Oxígeno (%)
                </label>
                <input
                  type="number"
                  value={formData.vitalSigns.saturacion_oxigeno}
                  onChange={(e) => handleInputChange('vitalSigns', 'saturacion_oxigeno', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: 98"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.vitalSigns.peso}
                  onChange={(e) => {
                    handleInputChange('vitalSigns', 'peso', e.target.value);
                    calculateBMI();
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: 70.5"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Talla (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.vitalSigns.talla}
                  onChange={(e) => {
                    handleInputChange('vitalSigns', 'talla', e.target.value);
                    calculateBMI();
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: 170.0"
                />
              </div>
              
              {formData.vitalSigns.bmi && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IMC Calculado
                  </label>
                  <input
                    type="text"
                    value={formData.vitalSigns.bmi}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    readOnly
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Exploración Física</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Examen General
                </label>
                <textarea
                  value={formData.physicalExam.generalExam}
                  onChange={(e) => handleInputChange('physicalExam', 'generalExam', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Describa el examen físico general..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hallazgos Relevantes
                </label>
                <textarea
                  value={formData.physicalExam.relevantFindings}
                  onChange={(e) => handleInputChange('physicalExam', 'relevantFindings', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Describa los hallazgos más relevantes..."
                />
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-600 mb-4">
              Sección {currentSection}: {sections[currentSection - 1]}
            </h3>
            <p className="text-gray-500">
              Esta sección está en desarrollo. Próximamente disponible.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className={`bg-gradient-to-r ${formType === 'adulto' ? 'from-blue-50 to-indigo-50' : 'from-green-50 to-teal-50'} p-6 rounded-xl mb-6`}>
        <div className="flex items-center gap-3 mb-4">
          {formType === 'adulto' ? <User className="w-8 h-8 text-blue-600" /> : <Baby className="w-8 h-8 text-green-600" />}
          <h2 className="text-2xl font-bold text-gray-800">
            Historia Clínica Completa - {formType === 'adulto' ? 'Adulto' : 'Pediátrica'}
          </h2>
        </div>
        <p className="text-gray-600">
          Formulario completo para historia clínica {formType === 'adulto' ? 'de adultos' : 'pediátrica'}.
        </p>
      </div>

      {/* Botón de Grabación Rápida */}
      <div className="mb-6">
        <div className="bg-white rounded-lg p-4 shadow-md border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${isRecording ? 'bg-red-100' : 'bg-gray-100'}`}>
                <Mic className={`w-5 h-5 ${isRecording ? 'text-red-600' : 'text-gray-600'}`} />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">
                  {isRecording ? 'Grabando sesión...' : 'Grabación de Sesión'}
                </h3>
                <p className="text-sm text-gray-600">
                  {isRecording 
                    ? `Tiempo: ${Math.floor(recordingTime / 60)}:${(recordingTime % 60).toString().padStart(2, '0')}`
                    : 'Inicia la grabación de la consulta desde el principio'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {!isRecording && !transcriptionData && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      const startRecording = async () => {
                        try {
                          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                          const mediaRecorder = new MediaRecorder(stream, {
                            mimeType: 'audio/webm;codecs=opus'
                          });
                          
                          const chunks: Blob[] = [];
                          
                          mediaRecorder.ondataavailable = (event) => {
                            if (event.data.size > 0) {
                              chunks.push(event.data);
                            }
                          };
                          
                          mediaRecorder.onstop = () => {
                            const blob = new Blob(chunks, { type: 'audio/webm' });
                            const url = URL.createObjectURL(blob);
                            setTranscriptionData({
                              transcription: 'Audio grabado - Ve a la sección de grabación para transcribir',
                              analysis: 'Audio disponible para transcripción'
                            });
                            stream.getTracks().forEach(track => track.stop());
                          };
                          
                          mediaRecorder.start();
                          setIsRecording(true);
                          setRecordingTime(0);
                          
                          const timer = setInterval(() => {
                            setRecordingTime(prev => prev + 1);
                          }, 1000);
                          
                          // Guardar referencia para detener
                          (window as any).recordingTimer = timer;
                          (window as any).mediaRecorder = mediaRecorder;
                        } catch (err) {
                          console.error('Error al iniciar grabación:', err);
                        }
                      };
                      startRecording();
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  >
                    <Mic className="w-4 h-4" />
                    Grabar
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'audio/*,.webm,.mp3,.wav,.m4a';
                      input.onchange = (event) => {
                        const file = (event.target as HTMLInputElement).files?.[0];
                        if (file) {
                          // Validar que sea un archivo de audio
                          if (!file.type.startsWith('audio/') && 
                              !file.name.toLowerCase().endsWith('.webm') &&
                              !file.name.toLowerCase().endsWith('.mp3') &&
                              !file.name.toLowerCase().endsWith('.wav') &&
                              !file.name.toLowerCase().endsWith('.m4a')) {
                            alert('Por favor selecciona un archivo de audio válido (MP3, WAV, M4A, WebM)');
                            return;
                          }

                          // Validar tamaño (máximo 8MB)
                          if (file.size > 8 * 1024 * 1024) {
                            alert('El archivo es demasiado grande. Máximo 8MB permitido.');
                            return;
                          }

                          setTranscriptionData({
                            transcription: `Archivo subido: ${file.name} - Ve a la sección de grabación para transcribir`,
                            analysis: 'Audio disponible para transcripción'
                          });
                        }
                      };
                      input.click();
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    <FileAudio className="w-4 h-4" />
                    Subir Archivo
                  </button>
                </>
              )}
              
              {isRecording && (
                <button
                  type="button"
                  onClick={() => {
                    if ((window as any).mediaRecorder) {
                      (window as any).mediaRecorder.stop();
                      setIsRecording(false);
                      if ((window as any).recordingTimer) {
                        clearInterval((window as any).recordingTimer);
                      }
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  <Square className="w-4 h-4" />
                  Detener Grabación
                </button>
              )}
              
              {transcriptionData && !isRecording && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-green-600 font-medium">✓ Audio grabado</span>
                  <button
                    type="button"
                    onClick={() => setCurrentSection(3)}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Ir a Transcripción
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Sección {currentSection} de {sections.length}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round((currentSection / sections.length) * 100)}% completado
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${formType === 'adulto' ? 'bg-blue-600' : 'bg-green-600'}`}
            style={{ width: `${(currentSection / sections.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {renderSection()}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={prevSection}
            disabled={currentSection === 1}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </button>

          {currentSection < sections.length ? (
            <button
              type="button"
              onClick={nextSection}
              className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors ${formType === 'adulto' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center gap-2 px-6 py-2 text-white rounded-lg transition-colors ${formType === 'adulto' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Guardar Historia Clínica
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CompleteForm; 