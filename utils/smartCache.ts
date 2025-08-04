// 🧠 SISTEMA DE CACHÉ INTELIGENTE
// Gestiona datos de consultas con persistencia automática y recuperación inteligente

export interface CacheEntry {
  id: string;
  timestamp: number;
  data: any;
  type: 'draft' | 'completed' | 'template';
  priority: 'low' | 'medium' | 'high';
  expiresAt?: number;
  metadata?: {
    patientId?: string;
    formType?: string;
    flowRoute?: string;
    step?: number;
  };
}

export class SmartCache {
  private static instance: SmartCache;
  private cache: Map<string, CacheEntry> = new Map();
  private readonly STORAGE_KEY = 'smart_consultation_cache';
  private readonly MAX_ENTRIES = 100;
  private readonly DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 horas

  private constructor() {
    this.loadFromStorage();
    this.startCleanupTimer();
  }

  public static getInstance(): SmartCache {
    if (!SmartCache.instance) {
      SmartCache.instance = new SmartCache();
    }
    return SmartCache.instance;
  }

  // 💾 GUARDAR ENTRADA
  public set(
    key: string, 
    data: any, 
    options: {
      type?: 'draft' | 'completed' | 'template';
      priority?: 'low' | 'medium' | 'high';
      ttl?: number;
      metadata?: any;
    } = {}
  ): void {
    const entry: CacheEntry = {
      id: key,
      timestamp: Date.now(),
      data: JSON.parse(JSON.stringify(data)), // Deep clone
      type: options.type || 'draft',
      priority: options.priority || 'medium',
      expiresAt: options.ttl ? Date.now() + options.ttl : Date.now() + this.DEFAULT_TTL,
      metadata: options.metadata
    };

    this.cache.set(key, entry);
    this.enforceLimit();
    this.saveToStorage();
  }

  // 📄 OBTENER ENTRADA
  public get(key: string): any | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    // Verificar expiración
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.saveToStorage();
      return null;
    }
    
    // Actualizar timestamp de acceso
    entry.timestamp = Date.now();
    this.saveToStorage();
    
    return entry.data;
  }

  // 🔍 BUSCAR ENTRADAS
  public find(criteria: {
    type?: 'draft' | 'completed' | 'template';
    patientId?: string;
    formType?: string;
    since?: number;
  }): CacheEntry[] {
    const results: CacheEntry[] = [];
    
    for (const entry of this.cache.values()) {
      let matches = true;
      
      if (criteria.type && entry.type !== criteria.type) {
        matches = false;
      }
      
      if (criteria.patientId && entry.metadata?.patientId !== criteria.patientId) {
        matches = false;
      }
      
      if (criteria.formType && entry.metadata?.formType !== criteria.formType) {
        matches = false;
      }
      
      if (criteria.since && entry.timestamp < criteria.since) {
        matches = false;
      }
      
      if (matches) {
        results.push(entry);
      }
    }
    
    return results.sort((a, b) => b.timestamp - a.timestamp);
  }

  // 🔄 AUTO-GUARDAR CONSULTA
  public autoSave(
    patientId: string, 
    formData: any, 
    step: number,
    metadata: any = {}
  ): void {
    const key = `draft_${patientId}_${Date.now()}`;
    
    this.set(key, {
      formData,
      step,
      progress: metadata.progress || 0,
      lastModified: Date.now()
    }, {
      type: 'draft',
      priority: 'high',
      ttl: 2 * 60 * 60 * 1000, // 2 horas para drafts
      metadata: {
        patientId,
        formType: metadata.formType,
        flowRoute: metadata.flowRoute,
        step
      }
    });
  }

  // 📋 RECUPERAR DRAFT MÁS RECIENTE
  public getLatestDraft(patientId?: string): any | null {
    const drafts = this.find({ 
      type: 'draft',
      patientId,
      since: Date.now() - (2 * 60 * 60 * 1000) // Últimas 2 horas
    });
    
    return drafts.length > 0 ? drafts[0].data : null;
  }

  // 🏥 GUARDAR PLANTILLA
  public saveTemplate(
    name: string,
    formType: string,
    template: any
  ): void {
    const key = `template_${formType}_${name.toLowerCase().replace(/\s+/g, '_')}`;
    
    this.set(key, template, {
      type: 'template',
      priority: 'medium',
      ttl: 30 * 24 * 60 * 60 * 1000, // 30 días
      metadata: {
        formType,
        templateName: name
      }
    });
  }

  // 📊 OBTENER ESTADÍSTICAS
  public getStats(): {
    totalEntries: number;
    byType: Record<string, number>;
    byPriority: Record<string, number>;
    oldestEntry: number;
    newestEntry: number;
    storageSize: number;
  } {
    const stats = {
      totalEntries: this.cache.size,
      byType: { draft: 0, completed: 0, template: 0 },
      byPriority: { low: 0, medium: 0, high: 0 },
      oldestEntry: Date.now(),
      newestEntry: 0,
      storageSize: 0
    };

    for (const entry of this.cache.values()) {
      stats.byType[entry.type]++;
      stats.byPriority[entry.priority]++;
      
      if (entry.timestamp < stats.oldestEntry) {
        stats.oldestEntry = entry.timestamp;
      }
      
      if (entry.timestamp > stats.newestEntry) {
        stats.newestEntry = entry.timestamp;
      }
    }

    // Calcular tamaño aproximado
    try {
      const serialized = localStorage.getItem(this.STORAGE_KEY);
      stats.storageSize = serialized ? serialized.length : 0;
    } catch (error) {
      stats.storageSize = 0;
    }

    return stats;
  }

  // 🧹 LIMPIAR CACHÉ
  public cleanup(): number {
    const now = Date.now();
    let cleaned = 0;
    
    // Eliminar entradas expiradas
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt && now > entry.expiresAt) {
        this.cache.delete(key);
        cleaned++;
      }
    }
    
    this.saveToStorage();
    return cleaned;
  }

  // 🔄 LIMPIAR POR TIPO
  public clearByType(type: 'draft' | 'completed' | 'template'): number {
    let cleared = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.type === type) {
        this.cache.delete(key);
        cleared++;
      }
    }
    
    this.saveToStorage();
    return cleared;
  }

  // 💾 PERSISTENCIA
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const entries: [string, CacheEntry][] = JSON.parse(stored);
        this.cache = new Map(entries);
        
        // Limpiar entradas expiradas al cargar
        this.cleanup();
      }
    } catch (error) {
      console.warn('Error loading cache from storage:', error);
      this.cache = new Map();
    }
  }

  private saveToStorage(): void {
    try {
      const entries = Array.from(this.cache.entries());
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
      console.warn('Error saving cache to storage:', error);
      
      // Si hay error de espacio, limpiar entradas antiguas
      if (error instanceof DOMException && error.code === 22) {
        this.clearOldEntries();
        try {
          const entries = Array.from(this.cache.entries());
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(entries));
        } catch (secondError) {
          console.error('Failed to save cache even after cleanup:', secondError);
        }
      }
    }
  }

  private enforceLimit(): void {
    if (this.cache.size <= this.MAX_ENTRIES) return;
    
    // Convertir a array y ordenar por prioridad y timestamp
    const entries = Array.from(this.cache.entries()).sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b[1].priority] - priorityOrder[a[1].priority];
      
      if (priorityDiff !== 0) return priorityDiff;
      return b[1].timestamp - a[1].timestamp;
    });
    
    // Mantener solo las entradas más importantes
    const toKeep = entries.slice(0, this.MAX_ENTRIES);
    this.cache = new Map(toKeep);
  }

  private clearOldEntries(): void {
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oneWeekAgo && entry.type === 'draft' && entry.priority === 'low') {
        this.cache.delete(key);
      }
    }
  }

  private startCleanupTimer(): void {
    // Limpiar cada hora
    setInterval(() => {
      this.cleanup();
    }, 60 * 60 * 1000);
  }

  // 🚀 EXPORT/IMPORT
  public exportData(): string {
    const entries = Array.from(this.cache.entries());
    return JSON.stringify({
      version: '1.0',
      timestamp: Date.now(),
      entries
    }, null, 2);
  }

  public importData(data: string): boolean {
    try {
      const parsed = JSON.parse(data);
      if (parsed.version && parsed.entries) {
        this.cache = new Map(parsed.entries);
        this.saveToStorage();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing cache data:', error);
      return false;
    }
  }
}

// 🛠️ FUNCIONES DE UTILIDAD

export const smartCache = SmartCache.getInstance();

export const autoSaveConsultation = (
  patientId: string,
  formData: any,
  step: number,
  metadata: any = {}
) => {
  smartCache.autoSave(patientId, formData, step, metadata);
};

export const getLatestDraft = (patientId?: string) => {
  return smartCache.getLatestDraft(patientId);
};

export const saveTemplate = (name: string, formType: string, template: any) => {
  smartCache.saveTemplate(name, formType, template);
};

export const getCacheStats = () => {
  return smartCache.getStats();
};

// 🎯 HOOKS PARA REACT
export const useSmartCache = () => {
  return {
    save: (key: string, data: any, options?: any) => smartCache.set(key, data, options),
    load: (key: string) => smartCache.get(key),
    find: (criteria: any) => smartCache.find(criteria),
    autoSave: autoSaveConsultation,
    getLatestDraft,
    saveTemplate,
    stats: getCacheStats
  };
};