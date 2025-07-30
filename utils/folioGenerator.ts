// Sistema de Generación de Folios Inteligentes para Historias Clínicas

export interface FolioData {
  folio: string;
  timestamp: Date;
  patientType: 'adulto' | 'pediatrico' | 'evolucion';
  sequence: number;
}

export interface FolioConfig {
  prefix: string;
  year: number;
  month: number;
  sequence: number;
  patientType: 'adulto' | 'pediatrico' | 'evolucion';
}

class FolioGenerator {
  private static instance: FolioGenerator;
  private sequences: Map<string, number> = new Map();
  private readonly STORAGE_KEY = 'folio_sequences';

  private constructor() {
    this.loadSequences();
  }

  public static getInstance(): FolioGenerator {
    if (!FolioGenerator.instance) {
      FolioGenerator.instance = new FolioGenerator();
    }
    return FolioGenerator.instance;
  }

  private loadSequences(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.sequences = new Map(JSON.parse(stored));
      }
    } catch (error) {
      console.warn('Error loading folio sequences:', error);
      this.sequences = new Map();
    }
  }

  private saveSequences(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(Array.from(this.sequences.entries())));
    } catch (error) {
      console.warn('Error saving folio sequences:', error);
    }
  }

  private getTypePrefix(patientType: 'adulto' | 'pediatrico' | 'evolucion'): string {
    switch (patientType) {
      case 'adulto':
        return 'AD';
      case 'pediatrico':
        return 'PE';
      case 'evolucion':
        return 'EV';
      default:
        return 'HC';
    }
  }

  private getMonthCode(month: number): string {
    const months = [
      'ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN',
      'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'
    ];
    return months[month - 1] || 'XXX';
  }

  private getNextSequence(patientType: 'adulto' | 'pediatrico' | 'evolucion'): number {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    
    const key = `${patientType}_${year}_${month}`;
    const currentSequence = this.sequences.get(key) || 0;
    const nextSequence = currentSequence + 1;
    
    this.sequences.set(key, nextSequence);
    this.saveSequences();
    
    return nextSequence;
  }

  public generateFolio(patientType: 'adulto' | 'pediatrico' | 'evolucion'): FolioData {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const sequence = this.getNextSequence(patientType);
    
    const typePrefix = this.getTypePrefix(patientType);
    const monthCode = this.getMonthCode(month);
    const yearShort = year.toString().slice(-2);
    const sequencePadded = sequence.toString().padStart(4, '0');
    
    const folio = `${typePrefix}-${monthCode}${yearShort}-${sequencePadded}`;
    
    return {
      folio,
      timestamp: now,
      patientType,
      sequence
    };
  }

  public generateFolioWithPatientInfo(
    patientType: 'adulto' | 'pediatrico' | 'evolucion',
    patientName?: string,
    patientAge?: number
  ): FolioData {
    const baseFolio = this.generateFolio(patientType);
    
    // Si tenemos información del paciente, podemos crear un folio más descriptivo
    if (patientName && patientAge) {
      const initials = this.getInitials(patientName);
      const ageGroup = this.getAgeGroup(patientAge);
      const typePrefix = this.getTypePrefix(patientType);
      const monthCode = this.getMonthCode(baseFolio.timestamp.getMonth() + 1);
      const yearShort = baseFolio.timestamp.getFullYear().toString().slice(-2);
      const sequencePadded = baseFolio.sequence.toString().padStart(3, '0');
      
      const enhancedFolio = `${typePrefix}-${initials}${ageGroup}-${monthCode}${yearShort}-${sequencePadded}`;
      
      return {
        ...baseFolio,
        folio: enhancedFolio
      };
    }
    
    return baseFolio;
  }

  private getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 3);
  }

  private getAgeGroup(age: number): string {
    if (age < 1) return 'RN'; // Recién nacido
    if (age < 12) return 'IN'; // Infante
    if (age < 18) return 'AD'; // Adolescente
    if (age < 65) return 'AD'; // Adulto
    return 'GE'; // Geriátrico
  }

  public getFolioStats(): Record<string, any> {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    
    const stats: Record<string, any> = {
      total: 0,
      byType: { adulto: 0, pediatrico: 0, evolucion: 0 },
      byMonth: {},
      currentMonth: {
        adulto: 0,
        pediatrico: 0,
        evolucion: 0
      }
    };

    for (const [key, count] of this.sequences.entries()) {
      const [type, year, month] = key.split('_');
      const yearNum = parseInt(year);
      const monthNum = parseInt(month);
      
      stats.total += count;
      stats.byType[type as keyof typeof stats.byType] += count;
      
      const monthKey = `${monthNum}/${yearNum}`;
      stats.byMonth[monthKey] = (stats.byMonth[monthKey] || 0) + count;
      
      if (yearNum === currentYear && monthNum === currentMonth) {
        stats.currentMonth[type as keyof typeof stats.currentMonth] += count;
      }
    }

    return stats;
  }

  public resetSequences(): void {
    this.sequences.clear();
    this.saveSequences();
  }

  public exportSequences(): string {
    return JSON.stringify(Array.from(this.sequences.entries()), null, 2);
  }

  public importSequences(data: string): boolean {
    try {
      const sequences = JSON.parse(data);
      this.sequences = new Map(sequences);
      this.saveSequences();
      return true;
    } catch (error) {
      console.error('Error importing sequences:', error);
      return false;
    }
  }
}

// Funciones de utilidad para usar directamente
export const generateFolio = (patientType: 'adulto' | 'pediatrico' | 'evolucion'): FolioData => {
  return FolioGenerator.getInstance().generateFolio(patientType);
};

export const generateFolioWithPatientInfo = (
  patientType: 'adulto' | 'pediatrico' | 'evolucion',
  patientName?: string,
  patientAge?: number
): FolioData => {
  return FolioGenerator.getInstance().generateFolioWithPatientInfo(patientType, patientName, patientAge);
};

export const getFolioStats = () => {
  return FolioGenerator.getInstance().getFolioStats();
};

export const resetFolioSequences = () => {
  return FolioGenerator.getInstance().resetSequences();
};

export const exportFolioSequences = () => {
  return FolioGenerator.getInstance().exportSequences();
};

export const importFolioSequences = (data: string) => {
  return FolioGenerator.getInstance().importSequences(data);
};

// Ejemplos de uso:
// generateFolio('adulto') → "AD-ENE25-0001"
// generateFolioWithPatientInfo('pediatrico', 'Juan Pérez', 5) → "PE-JPI-ENE25-001"
// generateFolio('evolucion') → "EV-ENE25-0001" 