import { MedicalHistory, PediatricHistory } from '../types';

// Tipos de errores de validación
export interface ValidationError {
  field: string;
  message: string;
  section?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Validaciones básicas
export const validateRequired = (value: any, fieldName: string): ValidationError | null => {
  if (!value || (typeof value === 'string' && value.trim() === '') || 
      (Array.isArray(value) && value.length === 0)) {
    return {
      field: fieldName,
      message: `${fieldName} es requerido`
    };
  }
  return null;
};

export const validateEmail = (email: string): ValidationError | null => {
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      field: 'email',
      message: 'Formato de email inválido'
    };
  }
  return null;
};

export const validatePhone = (phone: string): ValidationError | null => {
  if (phone && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(phone)) {
    return {
      field: 'phone',
      message: 'Formato de teléfono inválido'
    };
  }
  return null;
};

export const validateAge = (age: number, min: number = 0, max: number = 150): ValidationError | null => {
  if (age < min || age > max) {
    return {
      field: 'age',
      message: `La edad debe estar entre ${min} y ${max} años`
    };
  }
  return null;
};

export const validateDate = (date: string): ValidationError | null => {
  if (date) {
    const dateObj = new Date(date);
    const today = new Date();
    
    if (isNaN(dateObj.getTime())) {
      return {
        field: 'date',
        message: 'Fecha inválida'
      };
    }
    
    if (dateObj > today) {
      return {
        field: 'date',
        message: 'La fecha no puede ser futura'
      };
    }
  }
  return null;
};

export const validateVitalSigns = (vitalSigns: any): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (vitalSigns.bloodPressure) {
    const { systolic, diastolic } = vitalSigns.bloodPressure;
    
    if (systolic && (systolic < 70 || systolic > 300)) {
      errors.push({
        field: 'bloodPressure.systolic',
        message: 'Presión sistólica debe estar entre 70 y 300 mmHg'
      });
    }
    
    if (diastolic && (diastolic < 40 || diastolic > 200)) {
      errors.push({
        field: 'bloodPressure.diastolic',
        message: 'Presión diastólica debe estar entre 40 y 200 mmHg'
      });
    }
    
    if (systolic && diastolic && systolic <= diastolic) {
      errors.push({
        field: 'bloodPressure',
        message: 'La presión sistólica debe ser mayor que la diastólica'
      });
    }
  }
  
  if (vitalSigns.heartRate && (vitalSigns.heartRate < 40 || vitalSigns.heartRate > 200)) {
    errors.push({
      field: 'heartRate',
      message: 'Frecuencia cardíaca debe estar entre 40 y 200 lpm'
    });
  }
  
  if (vitalSigns.respiratoryRate && (vitalSigns.respiratoryRate < 8 || vitalSigns.respiratoryRate > 40)) {
    errors.push({
      field: 'respiratoryRate',
      message: 'Frecuencia respiratoria debe estar entre 8 y 40 rpm'
    });
  }
  
  if (vitalSigns.temperature && (vitalSigns.temperature < 30 || vitalSigns.temperature > 45)) {
    errors.push({
      field: 'temperature',
      message: 'Temperatura debe estar entre 30°C y 45°C'
    });
  }
  
  if (vitalSigns.oxygenSaturation && (vitalSigns.oxygenSaturation < 70 || vitalSigns.oxygenSaturation > 100)) {
    errors.push({
      field: 'oxygenSaturation',
      message: 'Saturación de oxígeno debe estar entre 70% y 100%'
    });
  }
  
  if (vitalSigns.painScale && (vitalSigns.painScale < 0 || vitalSigns.painScale > 10)) {
    errors.push({
      field: 'painScale',
      message: 'Escala de dolor debe estar entre 0 y 10'
    });
  }
  
  return errors;
};

export const validateAnthropometry = (anthropometry: any): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (anthropometry.weight && (anthropometry.weight < 1 || anthropometry.weight > 500)) {
    errors.push({
      field: 'weight',
      message: 'Peso debe estar entre 1 y 500 kg'
    });
  }
  
  if (anthropometry.height && (anthropometry.height < 50 || anthropometry.height > 250)) {
    errors.push({
      field: 'height',
      message: 'Estatura debe estar entre 50 y 250 cm'
    });
  }
  
  if (anthropometry.bmi && (anthropometry.bmi < 10 || anthropometry.bmi > 80)) {
    errors.push({
      field: 'bmi',
      message: 'IMC debe estar entre 10 y 80 kg/m²'
    });
  }
  
  if (anthropometry.waistCircumference && (anthropometry.waistCircumference < 30 || anthropometry.waistCircumference > 200)) {
    errors.push({
      field: 'waistCircumference',
      message: 'Circunferencia de cintura debe estar entre 30 y 200 cm'
    });
  }
  
  if (anthropometry.hipCircumference && (anthropometry.hipCircumference < 40 || anthropometry.hipCircumference > 200)) {
    errors.push({
      field: 'hipCircumference',
      message: 'Circunferencia de cadera debe estar entre 40 y 200 cm'
    });
  }
  
  return errors;
};

// Validación completa de historia clínica de adultos
export const validateMedicalHistory = (data: Partial<MedicalHistory>): ValidationResult => {
  const errors: ValidationError[] = [];
  
  // Validar datos personales
  if (data.personalData) {
    const personalErrors = [
      validateRequired(data.personalData.fullName, 'Nombre completo'),
      validateRequired(data.personalData.dateOfBirth, 'Fecha de nacimiento'),
      validateEmail(data.personalData.email),
      validatePhone(data.personalData.phone),
      validateAge(data.personalData.age || 0),
      validateDate(data.personalData.dateOfBirth)
    ].filter(Boolean) as ValidationError[];
    
    errors.push(...personalErrors.map(error => ({ ...error, section: 'personalData' })));
  }
  
  // Validar motivo de consulta
  if (data.chiefComplaint) {
    const complaintErrors = [
      validateRequired(data.chiefComplaint.reason, 'Motivo de consulta'),
      validateRequired(data.chiefComplaint.duration, 'Duración de síntomas')
    ].filter(Boolean) as ValidationError[];
    
    errors.push(...complaintErrors.map(error => ({ ...error, section: 'chiefComplaint' })));
  }
  
  // Validar signos vitales
  if (data.vitalSigns) {
    const vitalErrors = validateVitalSigns(data.vitalSigns);
    errors.push(...vitalErrors.map(error => ({ ...error, section: 'vitalSigns' })));
  }
  
  // Validar antropometría
  if (data.anthropometry) {
    const anthropometryErrors = validateAnthropometry(data.anthropometry);
    errors.push(...anthropometryErrors.map(error => ({ ...error, section: 'anthropometry' })));
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validación de historia pediátrica
export const validatePediatricHistory = (data: Partial<PediatricHistory>): ValidationResult => {
  const errors: ValidationError[] = [];
  
  // Validar datos del niño
  if (data.childData) {
    const childErrors = [
      validateRequired(data.childData.fullName, 'Nombre del niño'),
      validateRequired(data.childData.dateOfBirth, 'Fecha de nacimiento'),
      validateDate(data.childData.dateOfBirth)
    ].filter(Boolean) as ValidationError[];
    
    errors.push(...childErrors.map(error => ({ ...error, section: 'childData' })));
  }
  
  // Validar datos del tutor
  if (data.guardianData) {
    const guardianErrors = [
      validateRequired(data.guardianData.name, 'Nombre del tutor'),
      validateRequired(data.guardianData.relationship, 'Relación con el niño'),
      validatePhone(data.guardianData.phone),
      validateEmail(data.guardianData.email)
    ].filter(Boolean) as ValidationError[];
    
    errors.push(...guardianErrors.map(error => ({ ...error, section: 'guardianData' })));
  }
  
  // Validar antropometría pediátrica
  if (data.anthropometry) {
    const anthropometryErrors = validateAnthropometry(data.anthropometry);
    errors.push(...anthropometryErrors.map(error => ({ ...error, section: 'anthropometry' })));
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validación de secciones específicas
export const validateSection = (section: string, data: any): ValidationResult => {
  const errors: ValidationError[] = [];
  
  switch (section) {
    case 'personalData':
      errors.push(
        ...[
          validateRequired(data.fullName, 'Nombre completo'),
          validateRequired(data.dateOfBirth, 'Fecha de nacimiento'),
          validateEmail(data.email),
          validatePhone(data.phone)
        ].filter(Boolean) as ValidationError[]
      );
      break;
      
    case 'chiefComplaint':
      errors.push(
        ...[
          validateRequired(data.reason, 'Motivo de consulta'),
          validateRequired(data.duration, 'Duración de síntomas')
        ].filter(Boolean) as ValidationError[]
      );
      break;
      
    case 'vitalSigns':
      errors.push(...validateVitalSigns(data));
      break;
      
    case 'anthropometry':
      errors.push(...validateAnthropometry(data));
      break;
      
    default:
      break;
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors.map(error => ({ ...error, section }))
  };
};

// Función para obtener mensajes de error por campo
export const getFieldError = (errors: ValidationError[], field: string, section?: string): string | null => {
  const error = errors.find(err => 
    err.field === field && (!section || err.section === section)
  );
  return error ? error.message : null;
};

// Función para validar en tiempo real
export const validateField = (field: string, value: any, section?: string): ValidationError | null => {
  switch (field) {
    case 'email':
      return validateEmail(value);
    case 'phone':
      return validatePhone(value);
    case 'age':
      return validateAge(value);
    case 'dateOfBirth':
      return validateDate(value);
    case 'fullName':
    case 'reason':
    case 'duration':
      return validateRequired(value, field);
    default:
      return null;
  }
}; 