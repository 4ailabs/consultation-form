import React, { useState, useCallback, useEffect } from 'react';
import { 
  Fieldset, Input, TextArea, Select, CheckboxGroup, RadioGroup, 
  MedicationForm, ProgressSection 
} from './common/FormComponents';
import { 
  MedicalHistory, Gender, MaritalStatus, BloodType, 
  Frequency, StressLevel, EmotionalState, YesNo 
} from '../types';
import { Calculator, Heart, Brain, Activity, Utensils, Moon, Users } from 'lucide-react';

interface CompleteAdultFormProps {
  onSubmit: (data: MedicalHistory) => Promise<void>;
  isSubmitting: boolean;
}

const CompleteAdultForm: React.FC<CompleteAdultFormProps> = ({ onSubmit, isSubmitting }) => {
  const [currentSection, setCurrentSection] = useState(1);
  const [formData, setFormData] = useState<Partial<MedicalHistory>>({
    personalData: {
      fullName: '',
      dateOfBirth: '',
      age: 0,
      gender: 'No especificado',
      maritalStatus: 'Soltero(a)',
      occupation: '',
      bloodType: 'Desconocido',
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
    presentIllness: {
      onset: '',
      course: '',
      associatedSymptoms: [],
      previousTreatments: '',
      responseToTreatment: ''
    },
    pastMedicalHistory: {
      chronicDiseases: [],
      surgeries: [],
      hospitalizations: [],
      accidents: [],
      allergies: {
        medications: [],
        foods: [],
        environmental: [],
        reactions: []
      },
      immunizations: {
        status: 'Unknown',
        lastUpdate: '',
        missing: []
      }
    },
    familyHistory: {
      diabetes: false,
      hypertension: false,
      heartDisease: false,
      cancer: false,
      thyroid: false,
      obesity: false,
      mentalHealth: false,
      allergies: false,
      other: ''
    },
    medications: {
      current: [],
      previous: [],
      supplements: []
    },
    systemReview: {
      cardiovascular: {
        chestPain: false,
        palpitations: false,
        hypertension: false,
        edema: false,
        varicoseVeins: false,
        other: ''
      },
      respiratory: {
        cough: false,
        dyspnea: false,
        wheezing: false,
        asthma: false,
        sleepApnea: false,
        other: ''
      },
      gastrointestinal: {
        abdominalPain: false,
        diarrhea: false,
        constipation: false,
        acidReflux: false,
        nausea: false,
        vomiting: false,
        bloating: false,
        other: ''
      },
      genitourinary: {
        dysuria: false,
        frequency: false,
        urgency: false,
        nocturia: false,
        hematuria: false,
        other: ''
      },
      musculoskeletal: {
        jointPain: false,
        musclePain: false,
        stiffness: false,
        weakness: false,
        swelling: false,
        other: ''
      },
      neurological: {
        headache: false,
        dizziness: false,
        numbness: false,
        tingling: false,
        memoryLoss: false,
        seizures: false,
        other: ''
      },
      dermatological: {
        rash: false,
        itching: false,
        lesions: false,
        hairLoss: false,
        nailChanges: false,
        other: ''
      },
      psychological: {
        anxiety: false,
        depression: false,
        irritability: false,
        moodSwings: false,
        sleepProblems: false,
        other: ''
      }
    },
    sexualHistory: {
      active: false,
      partners: 0,
      protection: false,
      stiHistory: '',
      libido: 'Normal'
    },
    toxicHabits: {
      smoking: { status: false },
      alcohol: { status: false },
      drugs: { status: false }
    },
    lifestyle: {
      physicalActivity: {
        type: '',
        frequency: '',
        duration: '',
        intensity: 'Baja',
        barriers: '',
        goals: ''
      },
      nutrition: {
        mealsPerDay: 3,
        mealTiming: '',
        dietType: '',
        foodAllergies: [],
        foodIntolerances: [],
        supplements: [],
        waterIntake: '',
        caffeineIntake: '',
        alcoholIntake: '',
        eatingPatterns: ''
      },
      sleep: {
        hoursPerNight: 7,
        quality: 'Buena',
        problems: [],
        sleepHygiene: '',
        snoring: false,
        sleepApnea: false
      },
      mentalHealth: {
        stressLevel: 'Moderado',
        stressSources: [],
        copingStrategies: [],
        emotionalState: 'Bueno',
        symptoms: [],
        supportSystem: '',
        previousTreatment: ''
      }
    },
    vitalSigns: {
      bloodPressure: { systolic: 0, diastolic: 0 },
      heartRate: 0,
      respiratoryRate: 0,
      temperature: 0,
      oxygenSaturation: 0,
      painScale: 0
    },
    anthropometry: {
      weight: 0,
      height: 0,
      bmi: 0,
      waistCircumference: 0,
      hipCircumference: 0,
      waistToHipRatio: 0
    },
    laboratory: {
      results: [],
      pending: []
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
    diagnosis: {
      primary: '',
      secondary: [],
      differential: []
    },
    treatmentPlan: {
      medications: [],
      lifestyle: [],
      followUp: '',
      referrals: []
    },
    progressNotes: [],
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Usuario',
      folio: '',
      formType: 'adulto'
    }
  });

  const sections = [
    { id: 1, title: 'Datos Personales', icon: Users },
    { id: 2, title: 'Motivo de Consulta', icon: Heart },
    { id: 3, title: 'Historia Clínica', icon: Brain },
    { id: 4, title: 'Revisión por Sistemas', icon: Activity },
    { id: 5, title: 'Estilo de Vida', icon: Utensils },
    { id: 6, title: 'Signos Vitales', icon: Calculator },
    { id: 7, title: 'Exploración Física', icon: Heart }
  ];

  const handleInputChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof MedicalHistory],
        [field]: value
      }
    }));
  };

  const handleNestedChange = (section: string, subsection: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof MedicalHistory],
        [subsection]: {
          ...(prev[section as keyof MedicalHistory] as any)?.[subsection],
          [field]: value
        }
      }
    }));
  };

  const calculateBMI = useCallback(() => {
    const weight = formData.anthropometry?.weight;
    const height = formData.anthropometry?.height;
    
    if (weight && height && height > 0) {
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);
      const waistToHipRatio = formData.anthropometry?.waistCircumference && formData.anthropometry?.hipCircumference 
        ? formData.anthropometry.waistCircumference / formData.anthropometry.hipCircumference 
        : 0;
      
      handleInputChange('anthropometry', 'bmi', Number(bmi.toFixed(2)));
      handleInputChange('anthropometry', 'waistToHipRatio', Number(waistToHipRatio.toFixed(2)));
    }
  }, [formData.anthropometry?.weight, formData.anthropometry?.height]);

  const calculateAge = useCallback((birthDate: string) => {
    if (birthDate) {
      const today = new Date();
      const birth = new Date(birthDate);
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      
      handleInputChange('personalData', 'age', age);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData as MedicalHistory) {
      onSubmit(formData as MedicalHistory);
    }
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

  useEffect(() => {
    calculateBMI();
  }, [calculateBMI]);

  const renderSection = () => {
    switch (currentSection) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Datos Personales</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Nombre completo"
                name="fullName"
                value={formData.personalData?.fullName}
                onChange={(e) => handleInputChange('personalData', 'fullName', e.target.value)}
                required
              />
              
              <Input
                label="Fecha de nacimiento"
                name="dateOfBirth"
                type="date"
                value={formData.personalData?.dateOfBirth}
                onChange={(e) => {
                  handleInputChange('personalData', 'dateOfBirth', e.target.value);
                  calculateAge(e.target.value);
                }}
                required
              />
              
              <Input
                label="Edad"
                name="age"
                type="number"
                value={formData.personalData?.age}
                disabled
                className="bg-gray-100"
              />
              
              <Select
                label="Género"
                name="gender"
                value={formData.personalData?.gender}
                onChange={(e) => handleInputChange('personalData', 'gender', e.target.value)}
                options={[
                  { value: 'Masculino', label: 'Masculino' },
                  { value: 'Femenino', label: 'Femenino' },
                  { value: 'Otro', label: 'Otro' },
                  { value: 'No especificado', label: 'No especificado' }
                ]}
                required
              />
              
              <Select
                label="Estado civil"
                name="maritalStatus"
                value={formData.personalData?.maritalStatus}
                onChange={(e) => handleInputChange('personalData', 'maritalStatus', e.target.value)}
                options={[
                  { value: 'Soltero(a)', label: 'Soltero(a)' },
                  { value: 'Casado(a)', label: 'Casado(a)' },
                  { value: 'Unión libre', label: 'Unión libre' },
                  { value: 'Divorciado(a)', label: 'Divorciado(a)' },
                  { value: 'Viudo(a)', label: 'Viudo(a)' }
                ]}
                required
              />
              
              <Input
                label="Ocupación"
                name="occupation"
                value={formData.personalData?.occupation}
                onChange={(e) => handleInputChange('personalData', 'occupation', e.target.value)}
              />
              
              <Select
                label="Tipo de sangre"
                name="bloodType"
                value={formData.personalData?.bloodType}
                onChange={(e) => handleInputChange('personalData', 'bloodType', e.target.value)}
                options={[
                  { value: 'A+', label: 'A+' },
                  { value: 'A-', label: 'A-' },
                  { value: 'B+', label: 'B+' },
                  { value: 'B-', label: 'B-' },
                  { value: 'AB+', label: 'AB+' },
                  { value: 'AB-', label: 'AB-' },
                  { value: 'O+', label: 'O+' },
                  { value: 'O-', label: 'O-' },
                  { value: 'Desconocido', label: 'Desconocido' }
                ]}
              />
              
              <Input
                label="Teléfono"
                name="phone"
                type="tel"
                value={formData.personalData?.phone}
                onChange={(e) => handleInputChange('personalData', 'phone', e.target.value)}
              />
              
              <Input
                label="Correo electrónico"
                name="email"
                type="email"
                value={formData.personalData?.email}
                onChange={(e) => handleInputChange('personalData', 'email', e.target.value)}
              />
            </div>
            
            <TextArea
              label="Dirección"
              name="address"
              value={formData.personalData?.address}
              onChange={(e) => handleInputChange('personalData', 'address', e.target.value)}
              rows={2}
            />
            
            <Fieldset title="Contacto de Emergencia" required>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Nombre"
                  name="emergencyName"
                  value={formData.personalData?.emergencyContact?.name}
                  onChange={(e) => handleNestedChange('personalData', 'emergencyContact', 'name', e.target.value)}
                  required
                />
                
                <Input
                  label="Relación"
                  name="emergencyRelationship"
                  value={formData.personalData?.emergencyContact?.relationship}
                  onChange={(e) => handleNestedChange('personalData', 'emergencyContact', 'relationship', e.target.value)}
                  required
                />
                
                <Input
                  label="Teléfono"
                  name="emergencyPhone"
                  type="tel"
                  value={formData.personalData?.emergencyContact?.phone}
                  onChange={(e) => handleNestedChange('personalData', 'emergencyContact', 'phone', e.target.value)}
                  required
                />
              </div>
            </Fieldset>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Motivo de Consulta</h2>
            
            <TextArea
              label="Motivo principal de la consulta"
              name="reason"
              value={formData.chiefComplaint?.reason}
              onChange={(e) => handleInputChange('chiefComplaint', 'reason', e.target.value)}
              placeholder="Describa el motivo principal de su consulta..."
              required
              rows={4}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Duración de los síntomas"
                name="duration"
                value={formData.chiefComplaint?.duration}
                onChange={(e) => handleInputChange('chiefComplaint', 'duration', e.target.value)}
                placeholder="Ej: 3 días, 2 semanas, 1 mes..."
                required
              />
              
              <Select
                label="Severidad"
                name="severity"
                value={formData.chiefComplaint?.severity}
                onChange={(e) => handleInputChange('chiefComplaint', 'severity', e.target.value)}
                options={[
                  { value: 'Leve', label: 'Leve' },
                  { value: 'Moderado', label: 'Moderado' },
                  { value: 'Severo', label: 'Severo' }
                ]}
                required
              />
            </div>
            
            <TextArea
              label="Factores que agravan los síntomas"
              name="aggravatingFactors"
              value={formData.chiefComplaint?.aggravatingFactors}
              onChange={(e) => handleInputChange('chiefComplaint', 'aggravatingFactors', e.target.value)}
              placeholder="¿Qué hace que los síntomas empeoren?"
              rows={3}
            />
            
            <TextArea
              label="Factores que alivian los síntomas"
              name="relievingFactors"
              value={formData.chiefComplaint?.relievingFactors}
              onChange={(e) => handleInputChange('chiefComplaint', 'relievingFactors', e.target.value)}
              placeholder="¿Qué hace que los síntomas mejoren?"
              rows={3}
            />
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Historia Clínica</h2>
            
            <Fieldset title="Historia de la Enfermedad Actual" required>
              <TextArea
                label="Inicio de los síntomas"
                name="onset"
                value={formData.presentIllness?.onset}
                onChange={(e) => handleInputChange('presentIllness', 'onset', e.target.value)}
                placeholder="¿Cómo y cuándo comenzaron los síntomas?"
                rows={3}
              />
              
              <TextArea
                label="Evolución de la enfermedad"
                name="course"
                value={formData.presentIllness?.course}
                onChange={(e) => handleInputChange('presentIllness', 'course', e.target.value)}
                placeholder="¿Cómo han evolucionado los síntomas desde el inicio?"
                rows={3}
              />
              
              <CheckboxGroup
                label="Síntomas asociados"
                name="associatedSymptoms"
                options={[
                  { value: 'Fiebre', label: 'Fiebre' },
                  { value: 'Dolor', label: 'Dolor' },
                  { value: 'Fatiga', label: 'Fatiga' },
                  { value: 'Pérdida de apetito', label: 'Pérdida de apetito' },
                  { value: 'Pérdida de peso', label: 'Pérdida de peso' },
                  { value: 'Náuseas', label: 'Náuseas' },
                  { value: 'Vómitos', label: 'Vómitos' },
                  { value: 'Diarrea', label: 'Diarrea' },
                  { value: 'Estreñimiento', label: 'Estreñimiento' },
                  { value: 'Tos', label: 'Tos' },
                  { value: 'Dificultad para respirar', label: 'Dificultad para respirar' },
                  { value: 'Palpitaciones', label: 'Palpitaciones' },
                  { value: 'Mareos', label: 'Mareos' },
                  { value: 'Dolor de cabeza', label: 'Dolor de cabeza' },
                  { value: 'Insomnio', label: 'Insomnio' },
                  { value: 'Ansiedad', label: 'Ansiedad' },
                  { value: 'Depresión', label: 'Depresión' }
                ]}
                selectedValues={formData.presentIllness?.associatedSymptoms || []}
                onChange={(values) => handleInputChange('presentIllness', 'associatedSymptoms', values)}
              />
              
              <TextArea
                label="Tratamientos previos"
                name="previousTreatments"
                value={formData.presentIllness?.previousTreatments}
                onChange={(e) => handleInputChange('presentIllness', 'previousTreatments', e.target.value)}
                placeholder="¿Qué tratamientos ha recibido para esta condición?"
                rows={3}
              />
              
              <TextArea
                label="Respuesta a tratamientos"
                name="responseToTreatment"
                value={formData.presentIllness?.responseToTreatment}
                onChange={(e) => handleInputChange('presentIllness', 'responseToTreatment', e.target.value)}
                placeholder="¿Cómo ha respondido a los tratamientos anteriores?"
                rows={3}
              />
            </Fieldset>
            
            <Fieldset title="Antecedentes Patológicos">
              <TextArea
                label="Enfermedades crónicas"
                name="chronicDiseases"
                value={formData.pastMedicalHistory?.chronicDiseases?.join(', ')}
                onChange={(e) => handleInputChange('pastMedicalHistory', 'chronicDiseases', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                placeholder="Ej: Diabetes, Hipertensión, Asma..."
                rows={2}
              />
              
              <TextArea
                label="Cirugías previas"
                name="surgeries"
                value={formData.pastMedicalHistory?.surgeries?.join(', ')}
                onChange={(e) => handleInputChange('pastMedicalHistory', 'surgeries', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                placeholder="Fecha y tipo de cirugía"
                rows={2}
              />
              
              <TextArea
                label="Hospitalizaciones"
                name="hospitalizations"
                value={formData.pastMedicalHistory?.hospitalizations?.join(', ')}
                onChange={(e) => handleInputChange('pastMedicalHistory', 'hospitalizations', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                placeholder="Fecha y motivo de hospitalización"
                rows={2}
              />
              
              <TextArea
                label="Accidentes o traumatismos"
                name="accidents"
                value={formData.pastMedicalHistory?.accidents?.join(', ')}
                onChange={(e) => handleInputChange('pastMedicalHistory', 'accidents', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                placeholder="Fecha y descripción del accidente"
                rows={2}
              />
            </Fieldset>
            
            <Fieldset title="Alergias">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextArea
                  label="Alergias a medicamentos"
                  name="medicationAllergies"
                  value={formData.pastMedicalHistory?.allergies?.medications?.join(', ')}
                  onChange={(e) => handleNestedChange('pastMedicalHistory', 'allergies', 'medications', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  placeholder="Ej: Penicilina, Aspirina..."
                  rows={2}
                />
                
                <TextArea
                  label="Alergias alimentarias"
                  name="foodAllergies"
                  value={formData.pastMedicalHistory?.allergies?.foods?.join(', ')}
                  onChange={(e) => handleNestedChange('pastMedicalHistory', 'allergies', 'foods', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  placeholder="Ej: Mariscos, Frutos secos..."
                  rows={2}
                />
                
                <TextArea
                  label="Alergias ambientales"
                  name="environmentalAllergies"
                  value={formData.pastMedicalHistory?.allergies?.environmental?.join(', ')}
                  onChange={(e) => handleNestedChange('pastMedicalHistory', 'allergies', 'environmental', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  placeholder="Ej: Polen, Ácaros..."
                  rows={2}
                />
                
                <TextArea
                  label="Reacciones alérgicas"
                  name="allergicReactions"
                  value={formData.pastMedicalHistory?.allergies?.reactions?.join(', ')}
                  onChange={(e) => handleNestedChange('pastMedicalHistory', 'allergies', 'reactions', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  placeholder="Ej: Urticaria, Anafilaxia..."
                  rows={2}
                />
              </div>
            </Fieldset>
            
            <Fieldset title="Vacunación">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Estado de vacunación"
                  name="immunizationStatus"
                  value={formData.pastMedicalHistory?.immunizations?.status}
                  onChange={(e) => handleNestedChange('pastMedicalHistory', 'immunizations', 'status', e.target.value)}
                  options={[
                    { value: 'Complete', label: 'Completo' },
                    { value: 'Incomplete', label: 'Incompleto' },
                    { value: 'Unknown', label: 'Desconocido' }
                  ]}
                />
                
                <Input
                  label="Última actualización"
                  name="lastImmunization"
                  type="date"
                  value={formData.pastMedicalHistory?.immunizations?.lastUpdate}
                  onChange={(e) => handleNestedChange('pastMedicalHistory', 'immunizations', 'lastUpdate', e.target.value)}
                />
              </div>
              
              <TextArea
                label="Vacunas faltantes"
                name="missingVaccines"
                value={formData.pastMedicalHistory?.immunizations?.missing?.join(', ')}
                onChange={(e) => handleNestedChange('pastMedicalHistory', 'immunizations', 'missing', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                placeholder="Vacunas que faltan por aplicar"
                rows={2}
              />
            </Fieldset>
            
            <Fieldset title="Antecedentes Familiares">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.familyHistory?.diabetes}
                    onChange={(e) => handleInputChange('familyHistory', 'diabetes', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Diabetes</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.familyHistory?.hypertension}
                    onChange={(e) => handleInputChange('familyHistory', 'hypertension', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Hipertensión</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.familyHistory?.heartDisease}
                    onChange={(e) => handleInputChange('familyHistory', 'heartDisease', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Enfermedad cardíaca</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.familyHistory?.cancer}
                    onChange={(e) => handleInputChange('familyHistory', 'cancer', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Cáncer</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.familyHistory?.thyroid}
                    onChange={(e) => handleInputChange('familyHistory', 'thyroid', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Enfermedad tiroidea</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.familyHistory?.obesity}
                    onChange={(e) => handleInputChange('familyHistory', 'obesity', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Obesidad</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.familyHistory?.mentalHealth}
                    onChange={(e) => handleInputChange('familyHistory', 'mentalHealth', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Problemas de salud mental</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.familyHistory?.allergies}
                    onChange={(e) => handleInputChange('familyHistory', 'allergies', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Alergias</span>
                </label>
              </div>
              
              <TextArea
                label="Otros antecedentes familiares"
                name="otherFamilyHistory"
                value={formData.familyHistory?.other}
                onChange={(e) => handleInputChange('familyHistory', 'other', e.target.value)}
                placeholder="Otros antecedentes familiares relevantes"
                rows={2}
              />
            </Fieldset>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Revisión por Sistemas</h2>
            
            <Fieldset title="Sistema Cardiovascular">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.systemReview?.cardiovascular?.chestPain}
                    onChange={(e) => handleNestedChange('systemReview', 'cardiovascular', 'chestPain', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Dolor torácico</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.systemReview?.cardiovascular?.palpitations}
                    onChange={(e) => handleNestedChange('systemReview', 'cardiovascular', 'palpitations', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Palpitaciones</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.systemReview?.cardiovascular?.hypertension}
                    onChange={(e) => handleNestedChange('systemReview', 'cardiovascular', 'hypertension', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Hipertensión</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.systemReview?.cardiovascular?.edema}
                    onChange={(e) => handleNestedChange('systemReview', 'cardiovascular', 'edema', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Edema en piernas</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.systemReview?.cardiovascular?.varicoseVeins}
                    onChange={(e) => handleNestedChange('systemReview', 'cardiovascular', 'varicoseVeins', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Várices</span>
                </label>
              </div>
              
              <TextArea
                label="Otros síntomas cardiovasculares"
                name="otherCardiovascular"
                value={formData.systemReview?.cardiovascular?.other}
                onChange={(e) => handleNestedChange('systemReview', 'cardiovascular', 'other', e.target.value)}
                placeholder="Otros síntomas cardiovasculares"
                rows={2}
              />
            </Fieldset>
            
            <Fieldset title="Sistema Respiratorio">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.systemReview?.respiratory?.cough}
                    onChange={(e) => handleNestedChange('systemReview', 'respiratory', 'cough', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Tos</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.systemReview?.respiratory?.dyspnea}
                    onChange={(e) => handleNestedChange('systemReview', 'respiratory', 'dyspnea', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Dificultad para respirar</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.systemReview?.respiratory?.wheezing}
                    onChange={(e) => handleNestedChange('systemReview', 'respiratory', 'wheezing', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Sibilancias</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.systemReview?.respiratory?.asthma}
                    onChange={(e) => handleNestedChange('systemReview', 'respiratory', 'asthma', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Asma</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.systemReview?.respiratory?.sleepApnea}
                    onChange={(e) => handleNestedChange('systemReview', 'respiratory', 'sleepApnea', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Apnea del sueño</span>
                </label>
              </div>
              
              <TextArea
                label="Otros síntomas respiratorios"
                name="otherRespiratory"
                value={formData.systemReview?.respiratory?.other}
                onChange={(e) => handleNestedChange('systemReview', 'respiratory', 'other', e.target.value)}
                placeholder="Otros síntomas respiratorios"
                rows={2}
              />
            </Fieldset>
            
            <Fieldset title="Sistema Digestivo">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.systemReview?.gastrointestinal?.abdominalPain}
                    onChange={(e) => handleNestedChange('systemReview', 'gastrointestinal', 'abdominalPain', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Dolor abdominal</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.systemReview?.gastrointestinal?.diarrhea}
                    onChange={(e) => handleNestedChange('systemReview', 'gastrointestinal', 'diarrhea', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Diarrea</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.systemReview?.gastrointestinal?.constipation}
                    onChange={(e) => handleNestedChange('systemReview', 'gastrointestinal', 'constipation', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Estreñimiento</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.systemReview?.gastrointestinal?.acidReflux}
                    onChange={(e) => handleNestedChange('systemReview', 'gastrointestinal', 'acidReflux', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Reflujo ácido</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.systemReview?.gastrointestinal?.nausea}
                    onChange={(e) => handleNestedChange('systemReview', 'gastrointestinal', 'nausea', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Náuseas</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.systemReview?.gastrointestinal?.vomiting}
                    onChange={(e) => handleNestedChange('systemReview', 'gastrointestinal', 'vomiting', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Vómitos</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.systemReview?.gastrointestinal?.bloating}
                    onChange={(e) => handleNestedChange('systemReview', 'gastrointestinal', 'bloating', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Hinchazón</span>
                </label>
              </div>
              
              <TextArea
                label="Otros síntomas digestivos"
                name="otherGastrointestinal"
                value={formData.systemReview?.gastrointestinal?.other}
                onChange={(e) => handleNestedChange('systemReview', 'gastrointestinal', 'other', e.target.value)}
                placeholder="Otros síntomas digestivos"
                rows={2}
              />
            </Fieldset>
            
            <Fieldset title="Otros Sistemas">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.systemReview?.neurological?.headache}
                    onChange={(e) => handleNestedChange('systemReview', 'neurological', 'headache', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Dolor de cabeza</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.systemReview?.neurological?.dizziness}
                    onChange={(e) => handleNestedChange('systemReview', 'neurological', 'dizziness', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Mareos</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.systemReview?.musculoskeletal?.jointPain}
                    onChange={(e) => handleNestedChange('systemReview', 'musculoskeletal', 'jointPain', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Dolor articular</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.systemReview?.psychological?.anxiety}
                    onChange={(e) => handleNestedChange('systemReview', 'psychological', 'anxiety', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Ansiedad</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.systemReview?.psychological?.depression}
                    onChange={(e) => handleNestedChange('systemReview', 'psychological', 'depression', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Depresión</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.systemReview?.dermatological?.rash}
                    onChange={(e) => handleNestedChange('systemReview', 'dermatological', 'rash', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Erupciones cutáneas</span>
                </label>
              </div>
            </Fieldset>
          </div>
                 );
         
       case 5:
         return (
           <div className="space-y-6">
             <h2 className="text-2xl font-bold text-gray-800 mb-6">Estilo de Vida</h2>
             
             <Fieldset title="Actividad Física">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Input
                   label="Tipo de actividad física"
                   name="physicalActivityType"
                   value={formData.lifestyle?.physicalActivity?.type}
                   onChange={(e) => handleNestedChange('lifestyle', 'physicalActivity', 'type', e.target.value)}
                   placeholder="Ej: Caminar, correr, nadar, yoga..."
                 />
                 
                 <Select
                   label="Frecuencia"
                   name="physicalActivityFrequency"
                   value={formData.lifestyle?.physicalActivity?.frequency}
                   onChange={(e) => handleNestedChange('lifestyle', 'physicalActivity', 'frequency', e.target.value)}
                   options={[
                     { value: 'Nunca', label: 'Nunca' },
                     { value: '1-2 veces por semana', label: '1-2 veces por semana' },
                     { value: '3-4 veces por semana', label: '3-4 veces por semana' },
                     { value: '5-6 veces por semana', label: '5-6 veces por semana' },
                     { value: 'Diario', label: 'Diario' }
                   ]}
                 />
                 
                 <Input
                   label="Duración por sesión"
                   name="physicalActivityDuration"
                   value={formData.lifestyle?.physicalActivity?.duration}
                   onChange={(e) => handleNestedChange('lifestyle', 'physicalActivity', 'duration', e.target.value)}
                   placeholder="Ej: 30 minutos, 1 hora..."
                 />
                 
                 <Select
                   label="Intensidad"
                   name="physicalActivityIntensity"
                   value={formData.lifestyle?.physicalActivity?.intensity}
                   onChange={(e) => handleNestedChange('lifestyle', 'physicalActivity', 'intensity', e.target.value)}
                   options={[
                     { value: 'Baja', label: 'Baja' },
                     { value: 'Moderada', label: 'Moderada' },
                     { value: 'Alta', label: 'Alta' }
                   ]}
                 />
               </div>
               
               <TextArea
                 label="Barreras para la actividad física"
                 name="physicalActivityBarriers"
                 value={formData.lifestyle?.physicalActivity?.barriers}
                 onChange={(e) => handleNestedChange('lifestyle', 'physicalActivity', 'barriers', e.target.value)}
                 placeholder="¿Qué le impide hacer más actividad física?"
                 rows={2}
               />
               
               <TextArea
                 label="Metas de actividad física"
                 name="physicalActivityGoals"
                 value={formData.lifestyle?.physicalActivity?.goals}
                 onChange={(e) => handleNestedChange('lifestyle', 'physicalActivity', 'goals', e.target.value)}
                 placeholder="¿Qué metas tiene para su actividad física?"
                 rows={2}
               />
             </Fieldset>
             
             <Fieldset title="Nutrición">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Input
                   label="Número de comidas por día"
                   name="mealsPerDay"
                   type="number"
                   min="1"
                   max="10"
                   value={formData.lifestyle?.nutrition?.mealsPerDay}
                   onChange={(e) => handleNestedChange('lifestyle', 'nutrition', 'mealsPerDay', parseInt(e.target.value))}
                 />
                 
                 <Input
                   label="Horarios de comidas"
                   name="mealTiming"
                   value={formData.lifestyle?.nutrition?.mealTiming}
                   onChange={(e) => handleNestedChange('lifestyle', 'nutrition', 'mealTiming', e.target.value)}
                   placeholder="Ej: 8am, 12pm, 6pm..."
                 />
                 
                 <Input
                   label="Tipo de dieta"
                   name="dietType"
                   value={formData.lifestyle?.nutrition?.dietType}
                   onChange={(e) => handleNestedChange('lifestyle', 'nutrition', 'dietType', e.target.value)}
                   placeholder="Ej: Mediterránea, vegetariana, sin gluten..."
                 />
                 
                 <Input
                   label="Consumo de agua"
                   name="waterIntake"
                   value={formData.lifestyle?.nutrition?.waterIntake}
                   onChange={(e) => handleNestedChange('lifestyle', 'nutrition', 'waterIntake', e.target.value)}
                   placeholder="Ej: 8 vasos al día, 2 litros..."
                 />
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Input
                   label="Consumo de cafeína"
                   name="caffeineIntake"
                   value={formData.lifestyle?.nutrition?.caffeineIntake}
                   onChange={(e) => handleNestedChange('lifestyle', 'nutrition', 'caffeineIntake', e.target.value)}
                   placeholder="Ej: 2 tazas de café al día..."
                 />
                 
                 <Input
                   label="Consumo de alcohol"
                   name="alcoholIntake"
                   value={formData.lifestyle?.nutrition?.alcoholIntake}
                   onChange={(e) => handleNestedChange('lifestyle', 'nutrition', 'alcoholIntake', e.target.value)}
                   placeholder="Ej: 1 copa de vino ocasional..."
                 />
               </div>
               
               <TextArea
                 label="Patrones de alimentación"
                 name="eatingPatterns"
                 value={formData.lifestyle?.nutrition?.eatingPatterns}
                 onChange={(e) => handleNestedChange('lifestyle', 'nutrition', 'eatingPatterns', e.target.value)}
                 placeholder="¿Cómo describiría sus patrones de alimentación?"
                 rows={3}
               />
               
               <CheckboxGroup
                 label="Alergias alimentarias"
                 name="foodAllergies"
                 options={[
                   { value: 'Gluten', label: 'Gluten' },
                   { value: 'Lactosa', label: 'Lactosa' },
                   { value: 'Frutos secos', label: 'Frutos secos' },
                   { value: 'Mariscos', label: 'Mariscos' },
                   { value: 'Huevos', label: 'Huevos' },
                   { value: 'Soya', label: 'Soya' },
                   { value: 'Pescado', label: 'Pescado' },
                   { value: 'Ninguna', label: 'Ninguna' }
                 ]}
                 selectedValues={formData.lifestyle?.nutrition?.foodAllergies || []}
                 onChange={(values) => handleNestedChange('lifestyle', 'nutrition', 'foodAllergies', values)}
               />
               
               <CheckboxGroup
                 label="Intolerancias alimentarias"
                 name="foodIntolerances"
                 options={[
                   { value: 'Lactosa', label: 'Lactosa' },
                   { value: 'Fructosa', label: 'Fructosa' },
                   { value: 'Histamina', label: 'Histamina' },
                   { value: 'Gluten', label: 'Gluten' },
                   { value: 'Ninguna', label: 'Ninguna' }
                 ]}
                 selectedValues={formData.lifestyle?.nutrition?.foodIntolerances || []}
                 onChange={(values) => handleNestedChange('lifestyle', 'nutrition', 'foodIntolerances', values)}
               />
             </Fieldset>
             
             <Fieldset title="Sueño">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Input
                   label="Horas de sueño por noche"
                   name="sleepHours"
                   type="number"
                   min="1"
                   max="24"
                   step="0.5"
                   value={formData.lifestyle?.sleep?.hoursPerNight}
                   onChange={(e) => handleNestedChange('lifestyle', 'sleep', 'hoursPerNight', parseFloat(e.target.value))}
                 />
                 
                 <Select
                   label="Calidad del sueño"
                   name="sleepQuality"
                   value={formData.lifestyle?.sleep?.quality}
                   onChange={(e) => handleNestedChange('lifestyle', 'sleep', 'quality', e.target.value)}
                   options={[
                     { value: 'Excelente', label: 'Excelente' },
                     { value: 'Buena', label: 'Buena' },
                     { value: 'Regular', label: 'Regular' },
                     { value: 'Mala', label: 'Mala' },
                     { value: 'Muy mala', label: 'Muy mala' }
                   ]}
                 />
               </div>
               
               <CheckboxGroup
                 label="Problemas de sueño"
                 name="sleepProblems"
                 options={[
                   { value: 'Insomnio', label: 'Insomnio' },
                   { value: 'Despertar frecuente', label: 'Despertar frecuente' },
                   { value: 'Pesadillas', label: 'Pesadillas' },
                   { value: 'Sonambulismo', label: 'Sonambulismo' },
                   { value: 'Apnea del sueño', label: 'Apnea del sueño' },
                   { value: 'Ronquidos', label: 'Ronquidos' },
                   { value: 'Ninguno', label: 'Ninguno' }
                 ]}
                 selectedValues={formData.lifestyle?.sleep?.problems || []}
                 onChange={(values) => handleNestedChange('lifestyle', 'sleep', 'problems', values)}
               />
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <label className="flex items-center gap-2">
                   <input
                     type="checkbox"
                     checked={formData.lifestyle?.sleep?.snoring}
                     onChange={(e) => handleNestedChange('lifestyle', 'sleep', 'snoring', e.target.checked)}
                     className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                   />
                   <span className="text-sm text-gray-700">Ronca durante el sueño</span>
                 </label>
                 
                 <label className="flex items-center gap-2">
                   <input
                     type="checkbox"
                     checked={formData.lifestyle?.sleep?.sleepApnea}
                     onChange={(e) => handleNestedChange('lifestyle', 'sleep', 'sleepApnea', e.target.checked)}
                     className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                   />
                   <span className="text-sm text-gray-700">Apnea del sueño diagnosticada</span>
                 </label>
               </div>
               
               <TextArea
                 label="Higiene del sueño"
                 name="sleepHygiene"
                 value={formData.lifestyle?.sleep?.sleepHygiene}
                 onChange={(e) => handleNestedChange('lifestyle', 'sleep', 'sleepHygiene', e.target.value)}
                 placeholder="¿Qué hábitos tiene antes de dormir?"
                 rows={3}
               />
             </Fieldset>
             
             <Fieldset title="Salud Mental y Estrés">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Select
                   label="Nivel de estrés"
                   name="stressLevel"
                   value={formData.lifestyle?.mentalHealth?.stressLevel}
                   onChange={(e) => handleNestedChange('lifestyle', 'mentalHealth', 'stressLevel', e.target.value)}
                   options={[
                     { value: 'Muy bajo', label: 'Muy bajo' },
                     { value: 'Bajo', label: 'Bajo' },
                     { value: 'Moderado', label: 'Moderado' },
                     { value: 'Alto', label: 'Alto' },
                     { value: 'Muy alto', label: 'Muy alto' }
                   ]}
                 />
                 
                 <Select
                   label="Estado emocional"
                   name="emotionalState"
                   value={formData.lifestyle?.mentalHealth?.emotionalState}
                   onChange={(e) => handleNestedChange('lifestyle', 'mentalHealth', 'emotionalState', e.target.value)}
                   options={[
                     { value: 'Muy Bueno', label: 'Muy Bueno' },
                     { value: 'Bueno', label: 'Bueno' },
                     { value: 'Regular', label: 'Regular' },
                     { value: 'Malo', label: 'Malo' },
                     { value: 'Muy Malo', label: 'Muy Malo' }
                   ]}
                 />
               </div>
               
               <CheckboxGroup
                 label="Fuentes de estrés"
                 name="stressSources"
                 options={[
                   { value: 'Trabajo', label: 'Trabajo' },
                   { value: 'Familia', label: 'Familia' },
                   { value: 'Finanzas', label: 'Finanzas' },
                   { value: 'Salud', label: 'Salud' },
                   { value: 'Relaciones', label: 'Relaciones' },
                   { value: 'Estudios', label: 'Estudios' },
                   { value: 'Ninguna', label: 'Ninguna' }
                 ]}
                 selectedValues={formData.lifestyle?.mentalHealth?.stressSources || []}
                 onChange={(values) => handleNestedChange('lifestyle', 'mentalHealth', 'stressSources', values)}
               />
               
               <CheckboxGroup
                 label="Estrategias de afrontamiento"
                 name="copingStrategies"
                 options={[
                   { value: 'Ejercicio', label: 'Ejercicio' },
                   { value: 'Meditación', label: 'Meditación' },
                   { value: 'Terapia', label: 'Terapia' },
                   { value: 'Hobbies', label: 'Hobbies' },
                   { value: 'Socialización', label: 'Socialización' },
                   { value: 'Música', label: 'Música' },
                   { value: 'Lectura', label: 'Lectura' },
                   { value: 'Ninguna', label: 'Ninguna' }
                 ]}
                 selectedValues={formData.lifestyle?.mentalHealth?.copingStrategies || []}
                 onChange={(values) => handleNestedChange('lifestyle', 'mentalHealth', 'copingStrategies', values)}
               />
               
               <CheckboxGroup
                 label="Síntomas psicológicos"
                 name="psychologicalSymptoms"
                 options={[
                   { value: 'Ansiedad', label: 'Ansiedad' },
                   { value: 'Depresión', label: 'Depresión' },
                   { value: 'Irritabilidad', label: 'Irritabilidad' },
                   { value: 'Cambios de humor', label: 'Cambios de humor' },
                   { value: 'Problemas de concentración', label: 'Problemas de concentración' },
                   { value: 'Ninguno', label: 'Ninguno' }
                 ]}
                 selectedValues={formData.lifestyle?.mentalHealth?.symptoms || []}
                 onChange={(values) => handleNestedChange('lifestyle', 'mentalHealth', 'symptoms', values)}
               />
               
               <TextArea
                 label="Sistema de apoyo"
                 name="supportSystem"
                 value={formData.lifestyle?.mentalHealth?.supportSystem}
                 onChange={(e) => handleNestedChange('lifestyle', 'mentalHealth', 'supportSystem', e.target.value)}
                 placeholder="¿Quién le brinda apoyo emocional?"
                 rows={2}
               />
               
               <TextArea
                 label="Tratamiento psicológico previo"
                 name="previousTreatment"
                 value={formData.lifestyle?.mentalHealth?.previousTreatment}
                 onChange={(e) => handleNestedChange('lifestyle', 'mentalHealth', 'previousTreatment', e.target.value)}
                 placeholder="¿Ha recibido tratamiento psicológico anteriormente?"
                 rows={2}
               />
             </Fieldset>
             
             <Fieldset title="Hábitos Tóxicos">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label className="flex items-center gap-2 mb-2">
                     <input
                       type="checkbox"
                       checked={formData.toxicHabits?.smoking?.status}
                       onChange={(e) => handleNestedChange('toxicHabits', 'smoking', 'status', e.target.checked)}
                       className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                     />
                     <span className="text-sm font-medium text-gray-700">Fuma</span>
                   </label>
                   
                   {formData.toxicHabits?.smoking?.status && (
                     <div className="ml-6 space-y-2">
                       <Input
                         label="Cantidad y frecuencia"
                         name="smokingQuantity"
                         value={formData.toxicHabits?.smoking?.quantity}
                         onChange={(e) => handleNestedChange('toxicHabits', 'smoking', 'quantity', e.target.value)}
                         placeholder="Ej: 1 paquete al día"
                       />
                       
                       <Input
                         label="Duración"
                         name="smokingDuration"
                         value={formData.toxicHabits?.smoking?.duration}
                         onChange={(e) => handleNestedChange('toxicHabits', 'smoking', 'duration', e.target.value)}
                         placeholder="Ej: 10 años"
                       />
                       
                       <Input
                         label="Fecha de abandono"
                         name="smokingQuitDate"
                         type="date"
                         value={formData.toxicHabits?.smoking?.quitDate}
                         onChange={(e) => handleNestedChange('toxicHabits', 'smoking', 'quitDate', e.target.value)}
                       />
                     </div>
                   )}
                 </div>
                 
                 <div>
                   <label className="flex items-center gap-2 mb-2">
                     <input
                       type="checkbox"
                       checked={formData.toxicHabits?.alcohol?.status}
                       onChange={(e) => handleNestedChange('toxicHabits', 'alcohol', 'status', e.target.checked)}
                       className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                     />
                     <span className="text-sm font-medium text-gray-700">Consume alcohol</span>
                   </label>
                   
                   {formData.toxicHabits?.alcohol?.status && (
                     <div className="ml-6 space-y-2">
                       <Input
                         label="Tipo de alcohol"
                         name="alcoholType"
                         value={formData.toxicHabits?.alcohol?.type}
                         onChange={(e) => handleNestedChange('toxicHabits', 'alcohol', 'type', e.target.value)}
                         placeholder="Ej: Vino, cerveza, licor..."
                       />
                       
                       <Input
                         label="Frecuencia"
                         name="alcoholFrequency"
                         value={formData.toxicHabits?.alcohol?.frequency}
                         onChange={(e) => handleNestedChange('toxicHabits', 'alcohol', 'frequency', e.target.value)}
                         placeholder="Ej: 2 veces por semana"
                       />
                       
                       <Input
                         label="Cantidad"
                         name="alcoholQuantity"
                         value={formData.toxicHabits?.alcohol?.quantity}
                         onChange={(e) => handleNestedChange('toxicHabits', 'alcohol', 'quantity', e.target.value)}
                         placeholder="Ej: 2 copas por ocasión"
                       />
                     </div>
                   )}
                 </div>
               </div>
               
               <div>
                 <label className="flex items-center gap-2 mb-2">
                   <input
                     type="checkbox"
                     checked={formData.toxicHabits?.drugs?.status}
                     onChange={(e) => handleNestedChange('toxicHabits', 'drugs', 'status', e.target.checked)}
                     className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                   />
                   <span className="text-sm font-medium text-gray-700">Consume otras sustancias</span>
                 </label>
                 
                 {formData.toxicHabits?.drugs?.status && (
                   <div className="ml-6 space-y-2">
                     <Input
                       label="Tipo de sustancia"
                       name="drugType"
                       value={formData.toxicHabits?.drugs?.type}
                       onChange={(e) => handleNestedChange('toxicHabits', 'drugs', 'type', e.target.value)}
                       placeholder="Especificar tipo"
                     />
                     
                     <Input
                       label="Frecuencia"
                       name="drugFrequency"
                       value={formData.toxicHabits?.drugs?.frequency}
                       onChange={(e) => handleNestedChange('toxicHabits', 'drugs', 'frequency', e.target.value)}
                       placeholder="Ej: Ocasional, frecuente..."
                     />
                     
                     <Input
                       label="Último consumo"
                       name="drugLastUse"
                       type="date"
                       value={formData.toxicHabits?.drugs?.lastUse}
                       onChange={(e) => handleNestedChange('toxicHabits', 'drugs', 'lastUse', e.target.value)}
                     />
                   </div>
                 )}
               </div>
             </Fieldset>
           </div>
         );
         
       case 6:
         return (
           <div className="space-y-6">
             <h2 className="text-2xl font-bold text-gray-800 mb-6">Signos Vitales</h2>
             
             <Fieldset title="Presión Arterial">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Input
                   label="Presión sistólica (mmHg)"
                   name="systolic"
                   type="number"
                   min="70"
                   max="300"
                   value={formData.vitalSigns?.bloodPressure?.systolic}
                   onChange={(e) => handleNestedChange('vitalSigns', 'bloodPressure', 'systolic', parseInt(e.target.value))}
                   placeholder="Ej: 120"
                 />
                 
                 <Input
                   label="Presión diastólica (mmHg)"
                   name="diastolic"
                   type="number"
                   min="40"
                   max="200"
                   value={formData.vitalSigns?.bloodPressure?.diastolic}
                   onChange={(e) => handleNestedChange('vitalSigns', 'bloodPressure', 'diastolic', parseInt(e.target.value))}
                   placeholder="Ej: 80"
                 />
               </div>
             </Fieldset>
             
             <Fieldset title="Otros Signos Vitales">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Input
                   label="Frecuencia cardíaca (lpm)"
                   name="heartRate"
                   type="number"
                   min="40"
                   max="200"
                   value={formData.vitalSigns?.heartRate}
                   onChange={(e) => handleInputChange('vitalSigns', 'heartRate', parseInt(e.target.value))}
                   placeholder="Ej: 72"
                 />
                 
                 <Input
                   label="Frecuencia respiratoria (rpm)"
                   name="respiratoryRate"
                   type="number"
                   min="8"
                   max="40"
                   value={formData.vitalSigns?.respiratoryRate}
                   onChange={(e) => handleInputChange('vitalSigns', 'respiratoryRate', parseInt(e.target.value))}
                   placeholder="Ej: 16"
                 />
                 
                 <Input
                   label="Temperatura (°C)"
                   name="temperature"
                   type="number"
                   min="30"
                   max="45"
                   step="0.1"
                   value={formData.vitalSigns?.temperature}
                   onChange={(e) => handleInputChange('vitalSigns', 'temperature', parseFloat(e.target.value))}
                   placeholder="Ej: 36.8"
                 />
                 
                 <Input
                   label="Saturación de oxígeno (%)"
                   name="oxygenSaturation"
                   type="number"
                   min="70"
                   max="100"
                   value={formData.vitalSigns?.oxygenSaturation}
                   onChange={(e) => handleInputChange('vitalSigns', 'oxygenSaturation', parseInt(e.target.value))}
                   placeholder="Ej: 98"
                 />
               </div>
             </Fieldset>
             
             <Fieldset title="Escala de Dolor">
               <div className="space-y-4">
                 <p className="text-sm text-gray-600">
                   En una escala del 0 al 10, donde 0 es sin dolor y 10 es el peor dolor imaginable:
                 </p>
                 
                 <div className="flex items-center gap-4">
                   <span className="text-sm font-medium text-gray-700">Dolor actual:</span>
                   <input
                     type="range"
                     min="0"
                     max="10"
                     step="1"
                     value={formData.vitalSigns?.painScale || 0}
                     onChange={(e) => handleInputChange('vitalSigns', 'painScale', parseInt(e.target.value))}
                     className="flex-1"
                   />
                   <span className="text-lg font-bold text-blue-600 w-8 text-center">
                     {formData.vitalSigns?.painScale || 0}
                   </span>
                 </div>
                 
                 <div className="grid grid-cols-11 gap-1 text-xs text-gray-500">
                   <span>0</span>
                   <span>1</span>
                   <span>2</span>
                   <span>3</span>
                   <span>4</span>
                   <span>5</span>
                   <span>6</span>
                   <span>7</span>
                   <span>8</span>
                   <span>9</span>
                   <span>10</span>
                 </div>
               </div>
             </Fieldset>
             
             <Fieldset title="Antropometría">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Input
                   label="Peso (kg)"
                   name="weight"
                   type="number"
                   min="1"
                   max="500"
                   step="0.1"
                   value={formData.anthropometry?.weight}
                   onChange={(e) => handleInputChange('anthropometry', 'weight', parseFloat(e.target.value))}
                   placeholder="Ej: 70.5"
                 />
                 
                 <Input
                   label="Estatura (cm)"
                   name="height"
                   type="number"
                   min="50"
                   max="250"
                   step="0.1"
                   value={formData.anthropometry?.height}
                   onChange={(e) => handleInputChange('anthropometry', 'height', parseFloat(e.target.value))}
                   placeholder="Ej: 170.0"
                 />
                 
                 <Input
                   label="IMC (kg/m²)"
                   name="bmi"
                   type="number"
                   min="10"
                   max="80"
                   step="0.01"
                   value={formData.anthropometry?.bmi}
                   disabled
                   className="bg-gray-100"
                 />
                 
                 <button
                   type="button"
                   onClick={calculateBMI}
                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                 >
                   Calcular IMC
                 </button>
                 
                 <Input
                   label="Circunferencia de cintura (cm)"
                   name="waistCircumference"
                   type="number"
                   min="30"
                   max="200"
                   step="0.1"
                   value={formData.anthropometry?.waistCircumference}
                   onChange={(e) => handleInputChange('anthropometry', 'waistCircumference', parseFloat(e.target.value))}
                   placeholder="Ej: 85.0"
                 />
                 
                 <Input
                   label="Circunferencia de cadera (cm)"
                   name="hipCircumference"
                   type="number"
                   min="40"
                   max="200"
                   step="0.1"
                   value={formData.anthropometry?.hipCircumference}
                   onChange={(e) => handleInputChange('anthropometry', 'hipCircumference', parseFloat(e.target.value))}
                   placeholder="Ej: 95.0"
                 />
                 
                 <Input
                   label="Relación cintura-cadera"
                   name="waistToHipRatio"
                   type="number"
                   min="0.1"
                   max="2.0"
                   step="0.01"
                   value={formData.anthropometry?.waistToHipRatio}
                   disabled
                   className="bg-gray-100"
                 />
                 
                 <Input
                   label="Peso objetivo (kg)"
                   name="targetWeight"
                   type="number"
                   min="1"
                   max="500"
                   step="0.1"
                   value={formData.anthropometry?.targetWeight}
                   onChange={(e) => handleInputChange('anthropometry', 'targetWeight', parseFloat(e.target.value))}
                   placeholder="Ej: 65.0"
                 />
               </div>
             </Fieldset>
           </div>
         );
         
       case 7:
         return (
           <div className="space-y-6">
             <h2 className="text-2xl font-bold text-gray-800 mb-6">Exploración Física</h2>
             
             <Fieldset title="Examen General">
               <TextArea
                 label="Estado general"
                 name="generalExam"
                 value={formData.physicalExam?.general}
                 onChange={(e) => handleInputChange('physicalExam', 'general', e.target.value)}
                 placeholder="Descripción del estado general del paciente..."
                 rows={3}
               />
             </Fieldset>
             
             <Fieldset title="Examen por Regiones">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <TextArea
                   label="Cabeza"
                   name="headExam"
                   value={formData.physicalExam?.head}
                   onChange={(e) => handleInputChange('physicalExam', 'head', e.target.value)}
                   placeholder="Examen de cabeza, cara, ojos, oídos, nariz, boca..."
                   rows={3}
                 />
                 
                 <TextArea
                   label="Cuello"
                   name="neckExam"
                   value={formData.physicalExam?.neck}
                   onChange={(e) => handleInputChange('physicalExam', 'neck', e.target.value)}
                   placeholder="Examen de cuello, tiroides, ganglios linfáticos..."
                   rows={3}
                 />
                 
                 <TextArea
                   label="Tórax"
                   name="chestExam"
                   value={formData.physicalExam?.chest}
                   onChange={(e) => handleInputChange('physicalExam', 'chest', e.target.value)}
                   placeholder="Examen del tórax, mamas..."
                   rows={3}
                 />
                 
                 <TextArea
                   label="Cardiovascular"
                   name="cardiovascularExam"
                   value={formData.physicalExam?.cardiovascular}
                   onChange={(e) => handleInputChange('physicalExam', 'cardiovascular', e.target.value)}
                   placeholder="Examen cardiovascular, ritmo cardíaco, soplos..."
                   rows={3}
                 />
                 
                 <TextArea
                   label="Respiratorio"
                   name="respiratoryExam"
                   value={formData.physicalExam?.respiratory}
                   onChange={(e) => handleInputChange('physicalExam', 'respiratory', e.target.value)}
                   placeholder="Examen respiratorio, auscultación pulmonar..."
                   rows={3}
                 />
                 
                 <TextArea
                   label="Abdomen"
                   name="abdomenExam"
                   value={formData.physicalExam?.abdomen}
                   onChange={(e) => handleInputChange('physicalExam', 'abdomen', e.target.value)}
                   placeholder="Examen abdominal, palpación, percusión..."
                   rows={3}
                 />
                 
                 <TextArea
                   label="Extremidades"
                   name="extremitiesExam"
                   value={formData.physicalExam?.extremities}
                   onChange={(e) => handleInputChange('physicalExam', 'extremities', e.target.value)}
                   placeholder="Examen de extremidades, articulaciones, circulación..."
                   rows={3}
                 />
                 
                 <TextArea
                   label="Neurológico"
                   name="neurologicalExam"
                   value={formData.physicalExam?.neurological}
                   onChange={(e) => handleInputChange('physicalExam', 'neurological', e.target.value)}
                   placeholder="Examen neurológico, reflejos, sensibilidad..."
                   rows={3}
                 />
                 
                 <TextArea
                   label="Piel"
                   name="skinExam"
                   value={formData.physicalExam?.skin}
                   onChange={(e) => handleInputChange('physicalExam', 'skin', e.target.value)}
                   placeholder="Examen de la piel, lesiones, color, textura..."
                   rows={3}
                 />
               </div>
             </Fieldset>
             
             <Fieldset title="Hallazgos Relevantes">
               <TextArea
                 label="Hallazgos positivos"
                 name="positiveFindings"
                 value={formData.physicalExam?.general}
                 onChange={(e) => handleInputChange('physicalExam', 'general', e.target.value)}
                 placeholder="Describa los hallazgos positivos encontrados..."
                 rows={4}
               />
             </Fieldset>
           </div>
         );
         
       default:
         return <div>Sección en desarrollo...</div>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <ProgressSection 
        current={currentSection} 
        total={sections.length} 
        title="Historia Clínica Completa" 
      />
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {renderSection()}
        
        <div className="flex justify-between pt-6 border-t">
          <button
            type="button"
            onClick={prevSection}
            disabled={currentSection === 1}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          
          {currentSection < sections.length ? (
            <button
              type="button"
              onClick={nextSection}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Siguiente
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Enviando...' : 'Completar Historia Clínica'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CompleteAdultForm; 