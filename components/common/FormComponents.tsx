import React from 'react';
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle } from 'lucide-react';

// Interfaces para los componentes
interface FieldsetProps {
  title: string;
  children?: React.ReactNode;
  className?: string;
  isOpen?: boolean;
  onToggle?: () => void;
  required?: boolean;
}

interface InputProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'tel' | 'number' | 'date' | 'time' | 'url' | 'password';
  value?: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  step?: number;
  min?: number;
  max?: number;
}

interface TextAreaProps {
  label: string;
  name: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  rows?: number;
  className?: string;
}

interface SelectProps {
  label: string;
  name: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

interface CheckboxGroupProps {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  required?: boolean;
  error?: string;
  className?: string;
}

interface RadioGroupProps {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  selectedValue?: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  className?: string;
}

interface MedicationFormProps {
  medications: Array<{
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    prescribedBy: string;
  }>;
  onMedicationsChange: (medications: Array<{
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    prescribedBy: string;
  }>) => void;
}

// Clases CSS comunes
const commonInputClasses = "w-full p-3 border border-gray-300 rounded-lg text-base transition-all duration-300 ease-in-out bg-white hover:border-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 disabled:bg-gray-100 disabled:cursor-not-allowed";
const commonLabelClasses = "block mb-1.5 font-medium text-gray-700 text-sm";
const errorClasses = "border-red-500 focus:border-red-500 focus:ring-red-500/20";
const successClasses = "border-green-500 focus:border-green-500 focus:ring-green-500/20";

// Componente Fieldset colapsable
export const Fieldset: React.FC<FieldsetProps> = ({ 
  title, 
  children, 
  className = '', 
  isOpen = true, 
  onToggle,
  required = false 
}) => (
  <fieldset className={`border-none mb-6 bg-slate-50/50 rounded-xl shadow-sm transition-all duration-300 ease-in-out hover:shadow-md ${className}`}>
    <legend 
      className={`font-semibold text-xl text-blue-600 px-2 mb-4 flex items-center justify-between cursor-pointer ${onToggle ? 'hover:text-blue-700' : ''}`}
      onClick={onToggle}
    >
      <div className="flex items-center gap-2">
        {title}
        {required && <span className="text-red-500 text-sm">*</span>}
      </div>
      {onToggle && (
        <div className="text-blue-600">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      )}
    </legend>
    {isOpen && (
      <div className="space-y-4 p-4">
        {children}
      </div>
    )}
  </fieldset>
);

// Componente Input
export const Input: React.FC<InputProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  required = false,
  placeholder,
  disabled = false,
  error,
  className = '',
  step,
  min,
  max
}) => {
  const inputClasses = `${commonInputClasses} ${error ? errorClasses : ''} ${className}`;
  
  return (
    <div className="space-y-1">
      <label className={commonLabelClasses}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value || ''}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        disabled={disabled}
        className={inputClasses}
        step={step}
        min={min}
        max={max}
      />
      {error && (
        <div className="flex items-center gap-1 text-red-600 text-sm">
          <AlertCircle size={14} />
          {error}
        </div>
      )}
    </div>
  );
};

// Componente TextArea
export const TextArea: React.FC<TextAreaProps> = ({
  label,
  name,
  value,
  onChange,
  required = false,
  placeholder,
  disabled = false,
  error,
  rows = 3,
  className = ''
}) => {
  const textareaClasses = `${commonInputClasses} ${error ? errorClasses : ''} ${className}`;
  
  return (
    <div className="space-y-1">
      <label className={commonLabelClasses}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        name={name}
        value={value || ''}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={textareaClasses}
      />
      {error && (
        <div className="flex items-center gap-1 text-red-600 text-sm">
          <AlertCircle size={14} />
          {error}
        </div>
      )}
    </div>
  );
};

// Componente Select
export const Select: React.FC<SelectProps> = ({
  label,
  name,
  value,
  onChange,
  required = false,
  disabled = false,
  error,
  className = '',
  options,
  placeholder
}) => {
  const selectClasses = `${commonInputClasses} ${error ? errorClasses : ''} ${className}`;
  
  return (
    <div className="space-y-1">
      <label className={commonLabelClasses}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        name={name}
        value={value || ''}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={selectClasses}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <div className="flex items-center gap-1 text-red-600 text-sm">
          <AlertCircle size={14} />
          {error}
        </div>
      )}
    </div>
  );
};

// Componente Checkbox Group
export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  label,
  name,
  options,
  selectedValues,
  onChange,
  required = false,
  error,
  className = ''
}) => {
  const handleChange = (value: string, checked: boolean) => {
    const newValues = checked
      ? [...selectedValues, value]
      : selectedValues.filter(v => v !== value);
    onChange(newValues);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className={commonLabelClasses}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
            <input
              type="checkbox"
              name={`${name}[]`}
              value={option.value}
              checked={selectedValues.includes(option.value)}
              onChange={(e) => handleChange(option.value, e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
      {error && (
        <div className="flex items-center gap-1 text-red-600 text-sm">
          <AlertCircle size={14} />
          {error}
        </div>
      )}
    </div>
  );
};

// Componente Radio Group
export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  name,
  options,
  selectedValue,
  onChange,
  required = false,
  error,
  className = ''
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className={commonLabelClasses}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
      {error && (
        <div className="flex items-center gap-1 text-red-600 text-sm">
          <AlertCircle size={14} />
          {error}
        </div>
      )}
    </div>
  );
};

// Componente para formulario de medicamentos
export const MedicationForm: React.FC<MedicationFormProps> = ({
  medications,
  onMedicationsChange
}) => {
  const addMedication = () => {
    const newMedication = {
      id: Date.now().toString(),
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
      prescribedBy: ''
    };
    onMedicationsChange([...medications, newMedication]);
  };

  const removeMedication = (id: string) => {
    onMedicationsChange(medications.filter(med => med.id !== id));
  };

  const updateMedication = (id: string, field: string, value: string) => {
    onMedicationsChange(
      medications.map(med =>
        med.id === id ? { ...med, [field]: value } : med
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-800">Medicamentos Actuales</h4>
        <button
          type="button"
          onClick={addMedication}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Agregar Medicamento
        </button>
      </div>
      
      {medications.length === 0 && (
        <p className="text-gray-500 text-sm italic">No hay medicamentos registrados</p>
      )}
      
      {medications.map((medication, index) => (
        <div key={medication.id} className="border border-gray-200 rounded-lg p-4 bg-white">
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-medium text-gray-800">Medicamento {index + 1}</h5>
            <button
              type="button"
              onClick={() => removeMedication(medication.id)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Eliminar
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre del medicamento"
              name={`medication_${medication.id}_name`}
              value={medication.name}
              onChange={(e) => updateMedication(medication.id, 'name', e.target.value)}
              placeholder="Ej: Paracetamol"
            />
            
            <Input
              label="Dosis"
              name={`medication_${medication.id}_dosage`}
              value={medication.dosage}
              onChange={(e) => updateMedication(medication.id, 'dosage', e.target.value)}
              placeholder="Ej: 500mg"
            />
            
            <Input
              label="Frecuencia"
              name={`medication_${medication.id}_frequency`}
              value={medication.frequency}
              onChange={(e) => updateMedication(medication.id, 'frequency', e.target.value)}
              placeholder="Ej: Cada 8 horas"
            />
            
            <Input
              label="Duración"
              name={`medication_${medication.id}_duration`}
              value={medication.duration}
              onChange={(e) => updateMedication(medication.id, 'duration', e.target.value)}
              placeholder="Ej: 7 días"
            />
            
            <Input
              label="Prescrito por"
              name={`medication_${medication.id}_prescribedBy`}
              value={medication.prescribedBy}
              onChange={(e) => updateMedication(medication.id, 'prescribedBy', e.target.value)}
              placeholder="Nombre del médico"
              className="md:col-span-2"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// Componente para mostrar información de validación
export const ValidationInfo: React.FC<{ isValid: boolean; message: string }> = ({
  isValid,
  message
}) => (
  <div className={`flex items-center gap-2 text-sm ${isValid ? 'text-green-600' : 'text-red-600'}`}>
    {isValid ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
    {message}
  </div>
);

// Componente para secciones de progreso
export const ProgressSection: React.FC<{ current: number; total: number; title: string }> = ({
  current,
  total,
  title
}) => (
  <div className="mb-6">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <span className="text-sm text-gray-600">{current} de {total}</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${(current / total) * 100}%` }}
      />
    </div>
  </div>
); 