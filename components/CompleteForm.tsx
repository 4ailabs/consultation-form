import React, { useState, useCallback, useEffect } from 'react';
import { 
  Fieldset, Input, TextArea, Select, CheckboxGroup, RadioGroup, 
  MedicationForm, ProgressSection 
} from './common/FormComponents';
import { 
  MedicalHistory, PediatricHistory, Gender, MaritalStatus, BloodType, 
  Frequency, StressLevel, EmotionalState, YesNo 
} from '../types';
import { Calculator, Heart, Brain, Activity, Utensils, Moon, Users, Baby } from 'lucide-react';

interface CompleteFormProps {
  onSubmit: (data: MedicalHistory | PediatricHistory) => Promise<void>;
  isSubmitting: boolean;
  formType: 'adulto' | 'pediatrico';
}

const CompleteForm: React.FC<CompleteFormProps> = ({ onSubmit, isSubmitting, formType }) => {
  const [currentSection, setCurrentSection] = useState(1);
  const [formData, setFormData] = useState<Partial<MedicalHistory | PediatricHistory>>({
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
        heightPercentile: '',
        weightPercentile: '',
        headCircumference: '',
        growthProblems: ''
      }
    } : undefined,
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
        nausea: false,
        vomiting: false,
        diarrhea: false,
        constipation: false,
        abdominalPain: false,
        heartburn: false,
        other: ''
      },
      other: ''
    },
    lifestyle: {
      physicalActivity: {
        type: '',
        frequency: '',
        duration: '',
        intensity: '',
        barriers: '',
        goals: ''
      },
      nutrition: {
        mealsPerDay: 3,
        mealTiming: '',
        dietType: '',
        waterIntake: '',
        caffeineIntake: '',
        alcoholIntake: '',
        eatingPatterns: '',
        foodAllergies: [],
        foodIntolerances: []
      },
      sleep: {
        hoursPerNight: 8,
        quality: '',
        problems: [],
        snoring: false,
        sleepApnea: false,
        sleepHygiene: ''
      },
      mentalHealth: {
        stressLevel: '',
        emotionalState: '',
        stressSources: [],
        copingStrategies: [],
        symptoms: [],
        supportSystem: '',
        previousTreatment: ''
      }
    },
    toxicHabits: {
      smoking: {
        status: false,
        quantity: '',
        duration: '',
        quitDate: ''
      },
      alcohol: {
        status: false,
        type: '',
        frequency: '',
        quantity: ''
      },
      drugs: {
        status: false,
        type: '',
        frequency: '',
        lastUse: ''
      }
    },
    vitalSigns: {
      bloodPressure: {
        systolic: 0,
        diastolic: 0
      },
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
      waistToHipRatio: 0,
      targetWeight: 0
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
    folio: '',
    formType: formType
  });

  const sections = formType === 'pediatrico' ? [
    { id: 1, title: 'Datos Personales', icon: Users },
    { id: 2, title: 'Datos Perinatales', icon: Baby },
    { id: 3, title: 'Motivo de Consulta', icon: Heart },
    { id: 4, title: 'Historia Clínica', icon: Brain },
    { id: 5, title: 'Desarrollo y Crecimiento', icon: Activity },
    { id: 6, title: 'Revisión por Sistemas', icon: Activity },
    { id: 7, title: 'Signos Vitales', icon: Calculator },
    { id: 8, title: 'Exploración Física', icon: Heart }
  ] : [
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
        ...prev[section as keyof (MedicalHistory | PediatricHistory)],
        [field]: value
      }
    }));
  };

  const handleNestedChange = (section: string, subsection: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof (MedicalHistory | PediatricHistory)],
        [subsection]: {
          ...(prev[section as keyof (MedicalHistory | PediatricHistory)] as any)?.[subsection],
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
    if (birthDate && birthDate.trim() !== '') {
      const today = new Date();
      const birth = new Date(birthDate);
      
      // Verificar que la fecha sea válida
      if (isNaN(birth.getTime())) {
        return;
      }
      
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      
      // Verificar que la edad sea razonable
      if (age >= 0 && age <= 150) {
        handleInputChange('personalData', 'age', age);
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar que al menos fecha de nacimiento o edad estén presentes
    const hasDateOfBirth = formData.personalData?.dateOfBirth && formData.personalData.dateOfBirth.trim() !== '';
    const hasAge = formData.personalData?.age && formData.personalData.age > 0;
    
    if (!hasDateOfBirth && !hasAge) {
      alert('Por favor, ingrese al menos la fecha de nacimiento o la edad del paciente.');
      return;
    }
    
    if (formData as MedicalHistory | PediatricHistory) {
      onSubmit(formData as MedicalHistory | PediatricHistory);
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
            
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>📅 Información de Edad:</strong> Puede ingresar la fecha de nacimiento exacta (recomendado) o la edad aproximada. 
                Si ingresa la fecha, la edad se calculará automáticamente. Si no conoce la fecha exacta, puede ingresar solo la edad.
              </p>
            </div>
            
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
                  const newDate = e.target.value;
                  handleInputChange('personalData', 'dateOfBirth', newDate);
                  
                  if (newDate) {
                    calculateAge(newDate);
                  } else {
                    // Si se borra la fecha, limpiar la edad para permitir entrada manual
                    handleInputChange('personalData', 'age', 0);
                  }
                }}
                placeholder="Si no se conoce, deje vacío"
              />
              
              <Input
                label="Edad (años)"
                name="age"
                type="number"
                min="0"
                max="150"
                value={formData.personalData?.age}
                onChange={(e) => handleInputChange('personalData', 'age', parseInt(e.target.value) || 0)}
                placeholder="Si no se conoce fecha, ingrese edad aproximada"
                className={formData.personalData?.dateOfBirth ? 'bg-gray-100' : ''}
                disabled={!!formData.personalData?.dateOfBirth}
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
              
              {formType === 'adulto' && (
                <>
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
                </>
              )}
              
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
            </div>
            
            <Fieldset title="Información de Contacto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Teléfono"
                  name="phone"
                  type="tel"
                  value={formData.personalData?.phone}
                  onChange={(e) => handleInputChange('personalData', 'phone', e.target.value)}
                  required
                />
                
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.personalData?.email}
                  onChange={(e) => handleInputChange('personalData', 'email', e.target.value)}
                />
                
                <Input
                  label="Dirección"
                  name="address"
                  value={formData.personalData?.address}
                  onChange={(e) => handleInputChange('personalData', 'address', e.target.value)}
                  className="md:col-span-2"
                />
              </div>
            </Fieldset>
            
            <Fieldset title="Contacto de Emergencia">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Nombre del contacto"
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
                  label="Teléfono de emergencia"
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
        if (formType === 'pediatrico') {
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Datos Perinatales</h2>
              
              <Fieldset title="Información del Nacimiento">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Peso al nacer (kg)"
                    name="birthWeight"
                    type="number"
                    step="0.1"
                    value={formData.pediatricData?.birthWeight}
                    onChange={(e) => handleNestedChange('pediatricData', 'birthWeight', e.target.value)}
                    placeholder="Ej: 3.2"
                  />
                  
                  <Input
                    label="Longitud al nacer (cm)"
                    name="birthLength"
                    type="number"
                    step="0.1"
                    value={formData.pediatricData?.birthLength}
                    onChange={(e) => handleNestedChange('pediatricData', 'birthLength', e.target.value)}
                    placeholder="Ej: 50.0"
                  />
                  
                  <Input
                    label="Edad gestacional (semanas)"
                    name="gestationalAge"
                    type="number"
                    value={formData.pediatricData?.gestationalAge}
                    onChange={(e) => handleNestedChange('pediatricData', 'gestationalAge', e.target.value)}
                    placeholder="Ej: 40"
                  />
                  
                  <Select
                    label="Tipo de parto"
                    name="deliveryType"
                    value={formData.pediatricData?.deliveryType}
                    onChange={(e) => handleNestedChange('pediatricData', 'deliveryType', e.target.value)}
                    options={[
                      { value: 'Vaginal', label: 'Vaginal' },
                      { value: 'Cesárea', label: 'Cesárea' },
                      { value: 'Instrumentado', label: 'Instrumentado' },
                      { value: 'Otro', label: 'Otro' }
                    ]}
                  />
                </div>
                
                <TextArea
                  label="Complicaciones del parto"
                  name="complications"
                  value={formData.pediatricData?.complications}
                  onChange={(e) => handleNestedChange('pediatricData', 'complications', e.target.value)}
                  placeholder="Describa cualquier complicación durante el embarazo o parto"
                  rows={3}
                />
              </Fieldset>
              
              <Fieldset title="Historia Alimentaria">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.pediatricData?.feedingHistory?.breastfeeding}
                      onChange={(e) => handleNestedChange('pediatricData', 'feedingHistory', 'breastfeeding', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Lactancia materna</span>
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.pediatricData?.feedingHistory?.formulaFeeding}
                      onChange={(e) => handleNestedChange('pediatricData', 'feedingHistory', 'formulaFeeding', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Alimentación con fórmula</span>
                  </label>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Edad de destete (meses)"
                    name="weaningAge"
                    type="number"
                    value={formData.pediatricData?.feedingHistory?.weaningAge}
                    onChange={(e) => handleNestedChange('pediatricData', 'feedingHistory', 'weaningAge', e.target.value)}
                    placeholder="Ej: 6"
                  />
                  
                  <Input
                    label="Dieta actual"
                    name="currentDiet"
                    value={formData.pediatricData?.feedingHistory?.currentDiet}
                    onChange={(e) => handleNestedChange('pediatricData', 'feedingHistory', 'currentDiet', e.target.value)}
                    placeholder="Ej: Mixta, sólidos, etc."
                  />
                </div>
                
                <TextArea
                  label="Problemas de alimentación"
                  name="feedingProblems"
                  value={formData.pediatricData?.feedingHistory?.feedingProblems}
                  onChange={(e) => handleNestedChange('pediatricData', 'feedingHistory', 'feedingProblems', e.target.value)}
                  placeholder="Describa cualquier problema de alimentación"
                  rows={2}
                />
              </Fieldset>
            </div>
          );
        } else {
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Motivo de Consulta</h2>
              
              <Fieldset title="Información Principal">
                <div className="space-y-4">
                  <Input
                    label="Motivo principal de consulta"
                    name="reason"
                    value={formData.chiefComplaint?.reason}
                    onChange={(e) => handleInputChange('chiefComplaint', 'reason', e.target.value)}
                    placeholder="Describa el motivo principal de la consulta"
                    required
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Duración del problema"
                      name="duration"
                      value={formData.chiefComplaint?.duration}
                      onChange={(e) => handleInputChange('chiefComplaint', 'duration', e.target.value)}
                      placeholder="Ej: 3 días, 2 semanas, 1 mes..."
                    />
                    
                    <Select
                      label="Severidad"
                      name="severity"
                      value={formData.chiefComplaint?.severity}
                      onChange={(e) => handleInputChange('chiefComplaint', 'severity', e.target.value)}
                      options={[
                        { value: 'Leve', label: 'Leve' },
                        { value: 'Moderada', label: 'Moderada' },
                        { value: 'Severa', label: 'Severa' }
                      ]}
                    />
                  </div>
                  
                  <TextArea
                    label="Factores que agravan"
                    name="aggravatingFactors"
                    value={formData.chiefComplaint?.aggravatingFactors}
                    onChange={(e) => handleInputChange('chiefComplaint', 'aggravatingFactors', e.target.value)}
                    placeholder="¿Qué hace que el problema empeore?"
                    rows={2}
                  />
                  
                  <TextArea
                    label="Factores que alivian"
                    name="relievingFactors"
                    value={formData.chiefComplaint?.relievingFactors}
                    onChange={(e) => handleInputChange('chiefComplaint', 'relievingFactors', e.target.value)}
                    placeholder="¿Qué hace que el problema mejore?"
                    rows={2}
                  />
                </div>
              </Fieldset>
            </div>
          );
        }
        
      default:
        return <div>Sección en desarrollo...</div>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">
            Historia Clínica Completa - {formType === 'pediatrico' ? 'Pediátrica' : 'Adulto'}
          </h2>
        </div>
        <p className="text-gray-600">
          Formulario completo para {formType === 'pediatrico' ? 'pacientes pediátricos' : 'pacientes adultos'}.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <ProgressSection
          currentSection={currentSection}
          totalSections={sections.length}
          sections={sections}
        />

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          {renderSection()}
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={prevSection}
            disabled={currentSection === 1}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            Anterior
          </button>

          {currentSection < sections.length ? (
            <button
              type="button"
              onClick={nextSection}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              Siguiente
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Enviar Historia Clínica
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