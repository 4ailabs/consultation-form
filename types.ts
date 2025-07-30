
export type FormType = 'adulto' | 'pediatrico' | 'evolucion';

// Tipos básicos
export type Gender = 'Masculino' | 'Femenino' | 'Otro' | 'No especificado';
export type MaritalStatus = 'Soltero(a)' | 'Casado(a)' | 'Unión libre' | 'Divorciado(a)' | 'Viudo(a)';
export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Desconocido';
export type Frequency = 'Nunca' | 'Rara vez' | '1-2 veces/semana' | '3-4 veces/semana' | 'Diario' | 'Varias veces al día';
export type StressLevel = 'Muy bajo' | 'Bajo' | 'Moderado' | 'Alto' | 'Muy alto';
export type EmotionalState = 'Muy Bueno' | 'Bueno' | 'Regular' | 'Malo' | 'Muy Malo';
export type YesNo = 'Sí' | 'No' | 'Desconocido' | 'No aplica';

// Antecedentes familiares
export interface FamilyHistory {
  diabetes: boolean;
  hypertension: boolean;
  heartDisease: boolean;
  cancer: boolean;
  thyroid: boolean;
  obesity: boolean;
  mentalHealth: boolean;
  allergies: boolean;
  other: string;
}

// Medicamentos y suplementos
export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  prescribedBy: string;
}

export interface Supplement {
  name: string;
  dosage: string;
  frequency: string;
  reason: string;
}

// Signos vitales
export interface VitalSigns {
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  heartRate: number;
  respiratoryRate: number;
  temperature: number;
  oxygenSaturation: number;
  painScale: number; // 0-10
}

// Antropometría
export interface Anthropometry {
  weight: number; // kg
  height: number; // cm
  bmi: number;
  waistCircumference: number; // cm
  hipCircumference: number; // cm
  waistToHipRatio: number;
  bodyFatPercentage?: number;
  muscleMass?: number;
  targetWeight?: number;
}

// Laboratorio
export interface LaboratoryResults {
  // Hemograma
  hemoglobin: number;
  hematocrit: number;
  whiteBloodCells: number;
  platelets: number;
  
  // Química sanguínea
  glucose: number;
  hba1c: number;
  creatinine: number;
  bun: number;
  gfr: number;
  
  // Perfil lipídico
  totalCholesterol: number;
  ldl: number;
  hdl: number;
  triglycerides: number;
  
  // Función hepática
  alt: number;
  ast: number;
  alkalinePhosphatase: number;
  totalBilirubin: number;
  
  // Función tiroidea
  tsh: number;
  t4: number;
  t3: number;
  
  // Otros
  vitaminD: number;
  b12: number;
  iron: number;
  ferritin: number;
  
  // Orina
  proteinuria: string;
  glycosuria: string;
  ketonuria: string;
  
  date: string;
  laboratory: string;
}

// Revisión por sistemas
export interface SystemReview {
  cardiovascular: {
    chestPain: boolean;
    palpitations: boolean;
    hypertension: boolean;
    edema: boolean;
    varicoseVeins: boolean;
    other: string;
  };
  respiratory: {
    cough: boolean;
    dyspnea: boolean;
    wheezing: boolean;
    asthma: boolean;
    sleepApnea: boolean;
    other: string;
  };
  gastrointestinal: {
    abdominalPain: boolean;
    diarrhea: boolean;
    constipation: boolean;
    acidReflux: boolean;
    nausea: boolean;
    vomiting: boolean;
    bloating: boolean;
    other: string;
  };
  genitourinary: {
    dysuria: boolean;
    frequency: boolean;
    urgency: boolean;
    nocturia: boolean;
    hematuria: boolean;
    other: string;
  };
  musculoskeletal: {
    jointPain: boolean;
    musclePain: boolean;
    stiffness: boolean;
    weakness: boolean;
    swelling: boolean;
    other: string;
  };
  neurological: {
    headache: boolean;
    dizziness: boolean;
    numbness: boolean;
    tingling: boolean;
    memoryLoss: boolean;
    seizures: boolean;
    other: string;
  };
  dermatological: {
    rash: boolean;
    itching: boolean;
    lesions: boolean;
    hairLoss: boolean;
    nailChanges: boolean;
    other: string;
  };
  psychological: {
    anxiety: boolean;
    depression: boolean;
    irritability: boolean;
    moodSwings: boolean;
    sleepProblems: boolean;
    other: string;
  };
}

// Historia ginecológica
export interface GynecologicalHistory {
  menarche: number;
  menstrualCycle: string;
  lastPeriod: string;
  pregnancies: number;
  deliveries: number;
  cesareans: number;
  abortions: number;
  menopause: {
    status: 'No' | 'Sí' | 'Perimenopausia';
    age?: number;
  };
  papSmear: {
    lastDate: string;
    result: string;
  };
  mammogram: {
    lastDate: string;
    result: string;
  };
}

// Historia sexual
export interface SexualHistory {
  active: boolean;
  partners: number;
  protection: boolean;
  stiHistory: string;
  erectileDysfunction?: boolean;
  libido: 'Normal' | 'Bajo' | 'Alto' | 'No aplica';
}

// Hábitos tóxicos
export interface ToxicHabits {
  smoking: {
    status: boolean;
    quantity?: string;
    duration?: string;
    quitDate?: string;
  };
  alcohol: {
    status: boolean;
    type?: string;
    frequency?: string;
    quantity?: string;
  };
  drugs: {
    status: boolean;
    type?: string;
    frequency?: string;
    lastUse?: string;
  };
}

// Actividad física
export interface PhysicalActivity {
  type: string;
  frequency: string;
  duration: string;
  intensity: 'Baja' | 'Moderada' | 'Alta';
  barriers: string;
  goals: string;
}

// Nutrición
export interface Nutrition {
  mealsPerDay: number;
  mealTiming: string;
  dietType: string;
  foodAllergies: string[];
  foodIntolerances: string[];
  supplements: Supplement[];
  waterIntake: string;
  caffeineIntake: string;
  alcoholIntake: string;
  eatingPatterns: string;
}

// Sueño
export interface Sleep {
  hoursPerNight: number;
  quality: 'Excelente' | 'Buena' | 'Regular' | 'Mala' | 'Muy mala';
  problems: string[];
  sleepHygiene: string;
  snoring: boolean;
  sleepApnea: boolean;
}

// Estrés y salud mental
export interface MentalHealth {
  stressLevel: StressLevel;
  stressSources: string[];
  copingStrategies: string[];
  emotionalState: EmotionalState;
  symptoms: string[];
  supportSystem: string;
  previousTreatment: string;
}

// Historia clínica principal
export interface MedicalHistory {
  // Datos personales
  personalData: {
    fullName: string;
    dateOfBirth: string;
    age: number;
    gender: Gender;
    maritalStatus: MaritalStatus;
    occupation: string;
    bloodType: BloodType;
    phone: string;
    email: string;
    address: string;
    emergencyContact: {
      name: string;
      relationship: string;
      phone: string;
    };
  };
  
  // Motivo de consulta
  chiefComplaint: {
    reason: string;
    duration: string;
    severity: 'Leve' | 'Moderado' | 'Severo';
    aggravatingFactors: string;
    relievingFactors: string;
  };
  
  // Historia de la enfermedad actual
  presentIllness: {
    onset: string;
    course: string;
    associatedSymptoms: string[];
    previousTreatments: string;
    responseToTreatment: string;
  };
  
  // Antecedentes patológicos
  pastMedicalHistory: {
    chronicDiseases: string[];
    surgeries: string[];
    hospitalizations: string[];
    accidents: string[];
    allergies: {
      medications: string[];
      foods: string[];
      environmental: string[];
      reactions: string[];
    };
    immunizations: {
      status: 'Complete' | 'Incomplete' | 'Unknown';
      lastUpdate: string;
      missing: string[];
    };
  };
  
  // Antecedentes familiares
  familyHistory: FamilyHistory;
  
  // Medicamentos
  medications: {
    current: Medication[];
    previous: Medication[];
    supplements: Supplement[];
  };
  
  // Revisión por sistemas
  systemReview: SystemReview;
  
  // Historia ginecológica (mujeres)
  gynecologicalHistory?: GynecologicalHistory;
  
  // Historia sexual
  sexualHistory: SexualHistory;
  
  // Hábitos tóxicos
  toxicHabits: ToxicHabits;
  
  // Estilo de vida
  lifestyle: {
    physicalActivity: PhysicalActivity;
    nutrition: Nutrition;
    sleep: Sleep;
    mentalHealth: MentalHealth;
  };
  
  // Signos vitales
  vitalSigns: VitalSigns;
  
  // Antropometría
  anthropometry: Anthropometry;
  
  // Laboratorio
  laboratory: {
    results: LaboratoryResults[];
    pending: string[];
  };
  
  // Exploración física
  physicalExam: {
    general: string;
    head: string;
    neck: string;
    chest: string;
    cardiovascular: string;
    respiratory: string;
    abdomen: string;
    extremities: string;
    neurological: string;
    skin: string;
  };
  
  // Impresión diagnóstica
  diagnosis: {
    primary: string;
    secondary: string[];
    differential: string[];
  };
  
  // Plan de tratamiento
  treatmentPlan: {
    medications: Medication[];
    lifestyle: string[];
    followUp: string;
    referrals: string[];
  };
  
  // Notas de evolución
  progressNotes: {
    date: string;
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  }[];
  
  // Metadatos
  metadata: {
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    folio: string;
    formType: FormType;
  };
}

// Tipos para el formulario pediátrico
export interface PediatricHistory extends Omit<MedicalHistory, 'gynecologicalHistory' | 'sexualHistory'> {
  // Datos del niño
  childData: {
    fullName: string;
    dateOfBirth: string;
    age: {
      years: number;
      months: number;
    };
    gender: Gender;
    bloodType: BloodType;
  };
  
  // Datos del tutor
  guardianData: {
    name: string;
    relationship: string;
    phone: string;
    email: string;
    address: string;
  };
  
  // Historia perinatal
  perinatalHistory: {
    pregnancy: {
      weeks: number;
      complications: string;
      medications: string;
    };
    delivery: {
      type: 'Vaginal' | 'Cesarean' | 'Forceps' | 'Vacuum';
      complications: string;
      apgarScore: string;
    };
    birthWeight: number;
    birthLength: number;
    neonatalComplications: string;
  };
  
  // Desarrollo
  development: {
    motor: {
      headControl: string;
      sitting: string;
      crawling: string;
      walking: string;
    };
    language: {
      babbling: string;
      firstWords: string;
      sentences: string;
    };
    social: {
      eyeContact: string;
      socialSmile: string;
      strangerAnxiety: string;
    };
    concerns: string;
  };
  
  // Crecimiento
  growth: {
    weightHistory: { date: string; weight: number }[];
    heightHistory: { date: string; height: number }[];
    headCircumference: { date: string; circumference: number }[];
    percentiles: {
      weight: number;
      height: number;
      headCircumference: number;
    };
  };
  
  // Alimentación
  feeding: {
    breastfeeding: {
      duration: string;
      problems: string;
    };
    formula: {
      type: string;
      problems: string;
    };
    solids: {
      ageStarted: string;
      currentDiet: string;
      problems: string;
    };
    allergies: string[];
  };
  
  // Vacunación
  immunization: {
    schedule: 'Complete' | 'Incomplete' | 'Unknown';
    lastUpdate: string;
    missing: string[];
    reactions: string[];
  };
  
  // Escolar
  school: {
    grade: string;
    performance: 'Excellent' | 'Good' | 'Average' | 'Below Average';
    problems: string;
    specialNeeds: string;
  };
  
  // Comportamiento
  behavior: {
    temperament: string;
    sleepPattern: string;
    eatingHabits: string;
    socialSkills: string;
    problems: string;
  };
}
