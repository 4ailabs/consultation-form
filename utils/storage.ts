import { MedicalHistory, PediatricHistory, FormType } from '../types';

// Claves para el almacenamiento local
const STORAGE_KEYS = {
  ADULT_FORM: 'medical_history_adult_form',
  PEDIATRIC_FORM: 'medical_history_pediatric_form',
  FORM_TYPE: 'medical_history_form_type',
  LAST_SAVE: 'medical_history_last_save',
  SESSION_ID: 'medical_history_session_id'
};

// Interfaz para los datos guardados
interface SavedFormData {
  data: Partial<MedicalHistory | PediatricHistory>;
  timestamp: number;
  sessionId: string;
  formType: FormType;
  isComplete: boolean;
}

// Generar ID de sesión único
const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Obtener ID de sesión actual o crear uno nuevo
const getSessionId = (): string => {
  let sessionId = localStorage.getItem(STORAGE_KEYS.SESSION_ID);
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionId);
  }
  return sessionId;
};

// Guardar datos del formulario
export const saveFormData = (
  data: Partial<MedicalHistory | PediatricHistory>,
  formType: FormType,
  isComplete: boolean = false
): void => {
  try {
    const sessionId = getSessionId();
    const savedData: SavedFormData = {
      data,
      timestamp: Date.now(),
      sessionId,
      formType,
      isComplete
    };

    const key = formType === 'adulto' ? STORAGE_KEYS.ADULT_FORM : STORAGE_KEYS.PEDIATRIC_FORM;
    localStorage.setItem(key, JSON.stringify(savedData));
    localStorage.setItem(STORAGE_KEYS.FORM_TYPE, formType);
    localStorage.setItem(STORAGE_KEYS.LAST_SAVE, Date.now().toString());

    console.log(`Formulario guardado automáticamente: ${formType}`);
  } catch (error) {
    console.error('Error al guardar formulario:', error);
  }
};

// Cargar datos del formulario
export const loadFormData = (formType: FormType): Partial<MedicalHistory | PediatricHistory> | null => {
  try {
    const key = formType === 'adulto' ? STORAGE_KEYS.ADULT_FORM : STORAGE_KEYS.PEDIATRIC_FORM;
    const savedData = localStorage.getItem(key);
    
    if (savedData) {
      const parsed: SavedFormData = JSON.parse(savedData);
      
      // Verificar que los datos no sean muy antiguos (más de 24 horas)
      const isExpired = Date.now() - parsed.timestamp > 24 * 60 * 60 * 1000;
      
      if (isExpired) {
        console.log('Datos del formulario expirados, eliminando...');
        localStorage.removeItem(key);
        return null;
      }
      
      console.log(`Formulario cargado: ${formType}`);
      return parsed.data;
    }
    
    return null;
  } catch (error) {
    console.error('Error al cargar formulario:', error);
    return null;
  }
};

// Obtener el tipo de formulario guardado
export const getSavedFormType = (): FormType | null => {
  try {
    const formType = localStorage.getItem(STORAGE_KEYS.FORM_TYPE);
    return formType as FormType || null;
  } catch (error) {
    console.error('Error al obtener tipo de formulario:', error);
    return null;
  }
};

// Verificar si hay datos guardados
export const hasSavedData = (formType: FormType): boolean => {
  try {
    const key = formType === 'adulto' ? STORAGE_KEYS.ADULT_FORM : STORAGE_KEYS.PEDIATRIC_FORM;
    const savedData = localStorage.getItem(key);
    
    if (savedData) {
      const parsed: SavedFormData = JSON.parse(savedData);
      const isExpired = Date.now() - parsed.timestamp > 24 * 60 * 60 * 1000;
      return !isExpired;
    }
    
    return false;
  } catch (error) {
    console.error('Error al verificar datos guardados:', error);
    return false;
  }
};

// Limpiar datos guardados
export const clearSavedData = (formType?: FormType): void => {
  try {
    if (formType) {
      const key = formType === 'adulto' ? STORAGE_KEYS.ADULT_FORM : STORAGE_KEYS.PEDIATRIC_FORM;
      localStorage.removeItem(key);
    } else {
      // Limpiar todos los datos
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    }
    console.log('Datos del formulario eliminados');
  } catch (error) {
    console.error('Error al limpiar datos:', error);
  }
};

// Obtener información de la última sesión
export const getLastSaveInfo = (): { timestamp: number; formType: FormType } | null => {
  try {
    const lastSave = localStorage.getItem(STORAGE_KEYS.LAST_SAVE);
    const formType = localStorage.getItem(STORAGE_KEYS.FORM_TYPE);
    
    if (lastSave && formType) {
      return {
        timestamp: parseInt(lastSave),
        formType: formType as FormType
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error al obtener información de última sesión:', error);
    return null;
  }
};

// Guardar datos automáticamente con debounce
let saveTimeout: NodeJS.Timeout | null = null;

export const autoSaveFormData = (
  data: Partial<MedicalHistory | PediatricHistory>,
  formType: FormType,
  delay: number = 2000
): void => {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  
  saveTimeout = setTimeout(() => {
    saveFormData(data, formType, false);
  }, delay);
};

// Exportar datos como JSON
export const exportFormData = (formType: FormType): string | null => {
  try {
    const data = loadFormData(formType);
    if (data) {
      const exportData = {
        data,
        formType,
        exportedAt: new Date().toISOString(),
        version: '1.0'
      };
      return JSON.stringify(exportData, null, 2);
    }
    return null;
  } catch (error) {
    console.error('Error al exportar datos:', error);
    return null;
  }
};

// Importar datos desde JSON
export const importFormData = (jsonData: string): { data: any; formType: FormType } | null => {
  try {
    const parsed = JSON.parse(jsonData);
    
    if (parsed.data && parsed.formType) {
      saveFormData(parsed.data, parsed.formType, true);
      return {
        data: parsed.data,
        formType: parsed.formType
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error al importar datos:', error);
    return null;
  }
};

// Obtener estadísticas de uso
export const getStorageStats = (): {
  totalSize: number;
  itemCount: number;
  lastSave: Date | null;
} => {
  try {
    let totalSize = 0;
    let itemCount = 0;
    
    Object.values(STORAGE_KEYS).forEach(key => {
      const item = localStorage.getItem(key);
      if (item) {
        totalSize += item.length;
        itemCount++;
      }
    });
    
    const lastSaveInfo = getLastSaveInfo();
    const lastSave = lastSaveInfo ? new Date(lastSaveInfo.timestamp) : null;
    
    return {
      totalSize,
      itemCount,
      lastSave
    };
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return {
      totalSize: 0,
      itemCount: 0,
      lastSave: null
    };
  }
};

// Verificar si el almacenamiento está disponible
export const isStorageAvailable = (): boolean => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
};

// Limpiar datos expirados
export const cleanupExpiredData = (): void => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      if (key === STORAGE_KEYS.LAST_SAVE || key === STORAGE_KEYS.SESSION_ID) {
        return; // No limpiar estos
      }
      
      const savedData = localStorage.getItem(key);
      if (savedData) {
        const parsed: SavedFormData = JSON.parse(savedData);
        const isExpired = Date.now() - parsed.timestamp > 24 * 60 * 60 * 1000;
        
        if (isExpired) {
          localStorage.removeItem(key);
          console.log(`Datos expirados eliminados: ${key}`);
        }
      }
    });
  } catch (error) {
    console.error('Error al limpiar datos expirados:', error);
  }
}; 