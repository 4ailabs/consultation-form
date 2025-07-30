// Generador de PDF Unificado para todos los tipos de formularios

import jsPDF from 'jspdf';

export interface PDFData {
  folio?: string;
  formType: 'adulto' | 'pediatrico' | 'evolucion';
  [key: string]: any;
}

export interface PDFConfig {
  title: string;
  includeFolio?: boolean;
  includeDate?: boolean;
  sections: PDFSection[];
}

export interface PDFSection {
  title: string;
  fields: PDFField[];
  condition?: (data: PDFData) => boolean;
}

export interface PDFField {
  label: string;
  value: string | number | any;
  type?: 'text' | 'vital-signs' | 'list' | 'date' | 'soap';
  format?: (value: any) => string;
}

class PDFGenerator {
  private pdf: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number;
  private contentWidth: number;
  private yPosition: number;

  constructor() {
    this.pdf = new jsPDF('p', 'mm', 'a4');
    this.pageWidth = this.pdf.internal.pageSize.getWidth();
    this.pageHeight = this.pdf.internal.pageSize.getHeight();
    this.margin = 20;
    this.contentWidth = this.pageWidth - (this.margin * 2);
    this.yPosition = this.margin;
  }

  private formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  private formatVitalSigns(vitalSigns: any): string {
    if (!vitalSigns) return 'No registrados';
    
    const signs = [];
    if (vitalSigns.presion_arterial) signs.push(`PA: ${vitalSigns.presion_arterial}`);
    if (vitalSigns.frecuencia_cardiaca) signs.push(`FC: ${vitalSigns.frecuencia_cardiaca}`);
    if (vitalSigns.temperatura) signs.push(`T: ${vitalSigns.temperatura}°C`);
    if (vitalSigns.saturacion_oxigeno) signs.push(`SpO2: ${vitalSigns.saturacion_oxigeno}%`);
    if (vitalSigns.peso) signs.push(`Peso: ${vitalSigns.peso} kg`);
    if (vitalSigns.talla) signs.push(`Talla: ${vitalSigns.talla} cm`);
    
    return signs.join(' | ') || 'No registrados';
  }

  private addHeader(title: string, data: PDFData): void {
    // Título principal
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(18);
    this.pdf.text(title, this.pageWidth / 2, this.yPosition, { align: 'center' });
    this.yPosition += 15;

    // Información del folio y fecha
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'normal');
    
    if (data.folio) {
      this.pdf.text(`Folio: ${data.folio}`, this.margin, this.yPosition);
    }
    
    if (data.fecha) {
      this.pdf.text(`Fecha: ${this.formatDate(data.fecha)}`, this.pageWidth - this.margin - 40, this.yPosition);
    }
    
    this.yPosition += 10;

    // Línea separadora
    this.pdf.setDrawColor(200, 200, 200);
    this.pdf.line(this.margin, this.yPosition, this.pageWidth - this.margin, this.yPosition);
    this.yPosition += 15;
  }

  private addSection(section: PDFSection, data: PDFData): void {
    if (section.condition && !section.condition(data)) return;

    // Verificar si necesitamos nueva página
    if (this.yPosition > this.pageHeight - 80) {
      this.pdf.addPage();
      this.yPosition = this.margin;
    }

    // Título de sección
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(14);
    this.pdf.text(section.title.toUpperCase(), this.margin, this.yPosition);
    this.yPosition += 8;

    // Campos de la sección
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(11);

    for (const field of section.fields) {
      if (!field.value) continue;

      let displayValue = field.value;
      
      if (field.format) {
        displayValue = field.format(field.value);
      } else if (field.type === 'vital-signs') {
        displayValue = this.formatVitalSigns(field.value);
      } else if (field.type === 'date') {
        displayValue = this.formatDate(field.value);
      } else if (field.type === 'list' && Array.isArray(field.value)) {
        displayValue = field.value.join(', ');
      }

      if (displayValue) {
        // Verificar si necesitamos nueva página
        if (this.yPosition > this.pageHeight - 60) {
          this.pdf.addPage();
          this.yPosition = this.margin;
        }

        if (field.type === 'soap') {
          // Formato especial para notas SOAP
          this.pdf.setFont('helvetica', 'bold');
          this.pdf.text(`${field.label}:`, this.margin, this.yPosition);
          this.yPosition += 6;
          this.pdf.setFont('helvetica', 'normal');
          
          const lines = this.pdf.splitTextToSize(displayValue, this.contentWidth);
          this.pdf.text(lines, this.margin, this.yPosition);
          this.yPosition += (lines.length * 5) + 3;
        } else {
          // Formato normal
          const lines = this.pdf.splitTextToSize(`${field.label}: ${displayValue}`, this.contentWidth);
          this.pdf.text(lines, this.margin, this.yPosition);
          this.yPosition += (lines.length * 5) + 2;
        }
      }
    }
  }

  private addFooter(): void {
    const totalPages = this.pdf.getNumberOfPages();
    
    for (let i = 1; i <= totalPages; i++) {
      this.pdf.setPage(i);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.setFontSize(8);
      this.pdf.setTextColor(100, 100, 100);
      this.pdf.text(`Página ${i} de ${totalPages}`, this.pageWidth / 2, this.pageHeight - 10, { align: 'center' });
      this.pdf.text(`Generado el ${new Date().toLocaleDateString('es-ES')}`, this.margin, this.pageHeight - 10);
    }
  }

  public generatePDF(data: PDFData, config: PDFConfig): void {
    // Configurar página inicial
    this.yPosition = this.margin;
    
    // Agregar encabezado
    this.addHeader(config.title, data);

    // Agregar secciones
    for (const section of config.sections) {
      this.addSection(section, data);
    }

    // Agregar pie de página
    this.addFooter();

    // Generar nombre del archivo
    const patientName = data.nombre_paciente || data.personalData?.fullName || data.nombre || data.nombre_nino || 'paciente';
    const fileName = `${config.title.replace(/\s+/g, '_')}_${patientName.replace(/\s+/g, '_')}_${data.folio || new Date().toISOString().split('T')[0]}.pdf`;

    // Guardar PDF
    this.pdf.save(fileName);
  }
}

// Configuraciones predefinidas para diferentes tipos de formularios
export const getEvolutionNoteConfig = (data: PDFData): PDFConfig => ({
  title: 'NOTA DE EVOLUCIÓN MÉDICA',
  includeFolio: true,
  includeDate: true,
  sections: [
    {
      title: 'Información del Paciente',
      fields: [
        { label: 'Nombre', value: data.nombre_paciente },
        { label: 'Edad', value: data.edad ? `${data.edad} años` : '' }
      ]
    },
    {
      title: 'Motivo de Consulta',
      fields: [
        { label: 'Motivo', value: data.motivo_consulta }
      ]
    },
    {
      title: 'Síntomas Actuales',
      fields: [
        { label: 'Síntomas', value: data.sintomas_actuales }
      ]
    },
    {
      title: 'Evolución',
      fields: [
        { label: 'Evolución', value: data.evolucion }
      ]
    },
    {
      title: 'Exploración Física',
      fields: [
        { label: 'Exploración', value: data.exploracion_fisica }
      ]
    },
    {
      title: 'Signos Vitales',
      fields: [
        { label: 'Signos Vitales', value: data.signos_vitales, type: 'vital-signs' }
      ]
    },
    {
      title: 'Tratamiento',
      fields: [
        { label: 'Tratamiento Actual', value: data.tratamiento_actual },
        { label: 'Cambios en el Tratamiento', value: data.cambios_tratamiento }
      ]
    },
    {
      title: 'Recomendaciones y Seguimiento',
      fields: [
        { label: 'Recomendaciones', value: data.recomendaciones },
        { label: 'Próxima Cita', value: data.proxima_cita, type: 'date' },
        { label: 'Observaciones', value: data.observaciones }
      ]
    },
    {
      title: 'Anotaciones del Médico',
      fields: [
        { label: 'Anotaciones', value: data.anotaciones_medico }
      ],
      condition: (data) => !!data.anotaciones_medico
    },
    {
      title: 'Nota SOAP',
      fields: [
        { label: 'S - Subjetivo', value: data.nota_soap?.s, type: 'soap' },
        { label: 'O - Objetivo', value: data.nota_soap?.o, type: 'soap' },
        { label: 'A - Análisis', value: data.nota_soap?.a, type: 'soap' },
        { label: 'P - Plan', value: data.nota_soap?.p, type: 'soap' }
      ],
      condition: (data) => !!(data.nota_soap?.s || data.nota_soap?.o || data.nota_soap?.a || data.nota_soap?.p)
    }
  ]
});

export const getCompleteHistoryConfig = (data: PDFData): PDFConfig => ({
  title: 'HISTORIA CLÍNICA COMPLETA',
  includeFolio: true,
  includeDate: true,
  sections: [
    {
      title: 'Datos Personales',
      fields: [
        { label: 'Nombre Completo', value: data.personalData?.fullName || data.nombre },
        { label: 'Fecha de Nacimiento', value: data.personalData?.dateOfBirth, type: 'date' },
        { label: 'Edad', value: data.personalData?.age ? `${data.personalData.age} años` : data.edad ? `${data.edad} años` : '' },
        { label: 'Género', value: data.personalData?.gender || data.genero },
        { label: 'Estado Civil', value: data.personalData?.maritalStatus },
        { label: 'Ocupación', value: data.personalData?.occupation },
        { label: 'Teléfono', value: data.personalData?.phone || data.telefono },
        { label: 'Email', value: data.personalData?.email || data.email },
        { label: 'Dirección', value: data.personalData?.address || data.direccion }
      ]
    },
    {
      title: 'Motivo de Consulta',
      fields: [
        { label: 'Motivo Principal', value: data.chiefComplaint?.mainComplaint || data.motivo_consulta },
        { label: 'Duración', value: data.chiefComplaint?.duration },
        { label: 'Intensidad', value: data.chiefComplaint?.intensity },
        { label: 'Factores Agravantes', value: data.chiefComplaint?.aggravatingFactors },
        { label: 'Factores Mejorantes', value: data.chiefComplaint?.relievingFactors }
      ]
    },
    {
      title: 'Historia Clínica',
      fields: [
        { label: 'Enfermedad Actual', value: data.medicalHistory?.presentIllness },
        { label: 'Antecedentes Patológicos', value: data.medicalHistory?.pastMedicalHistory || data.antecedentes },
        { label: 'Antecedentes Quirúrgicos', value: data.medicalHistory?.surgicalHistory },
        { label: 'Alergias', value: data.medicalHistory?.allergies || data.alergias },
        { label: 'Medicamentos Actuales', value: data.medicalHistory?.currentMedications || data.medicamentos, type: 'list' },
        { label: 'Antecedentes Familiares', value: data.medicalHistory?.familyHistory }
      ]
    },
    {
      title: 'Signos Vitales',
      fields: [
        { label: 'Presión Arterial', value: data.vitalSigns?.bloodPressure },
        { label: 'Frecuencia Cardíaca', value: data.vitalSigns?.heartRate },
        { label: 'Frecuencia Respiratoria', value: data.vitalSigns?.respiratoryRate },
        { label: 'Temperatura', value: data.vitalSigns?.temperature },
        { label: 'Saturación de Oxígeno', value: data.vitalSigns?.oxygenSaturation },
        { label: 'Escala de Dolor', value: data.vitalSigns?.painScale }
      ]
    },
    {
      title: 'Antropometría',
      fields: [
        { label: 'Peso', value: data.vitalSigns?.anthropometry?.weight },
        { label: 'Talla', value: data.vitalSigns?.anthropometry?.height },
        { label: 'IMC', value: data.vitalSigns?.anthropometry?.bmi },
        { label: 'Circunferencia de Cintura', value: data.vitalSigns?.anthropometry?.waistCircumference },
        { label: 'Circunferencia de Cadera', value: data.vitalSigns?.anthropometry?.hipCircumference },
        { label: 'Relación Cintura/Cadera', value: data.vitalSigns?.anthropometry?.waistHipRatio }
      ]
    },
    {
      title: 'Síntomas',
      fields: [
        { label: 'Síntomas', value: data.sintomas }
      ]
    },
    {
      title: 'Observaciones',
      fields: [
        { label: 'Observaciones Adicionales', value: data.observaciones }
      ]
    },
    {
      title: 'Exploración Física',
      fields: [
        { label: 'Examen General', value: data.physicalExam?.generalExam },
        { label: 'Hallazgos Relevantes', value: data.physicalExam?.relevantFindings }
      ]
    }
  ]
});

// Funciones de utilidad para usar directamente
export const generateEvolutionNotePDF = (data: PDFData): void => {
  const generator = new PDFGenerator();
  const config = getEvolutionNoteConfig(data);
  generator.generatePDF(data, config);
};

export const generateCompleteHistoryPDF = (data: PDFData): void => {
  const generator = new PDFGenerator();
  const config = getCompleteHistoryConfig(data);
  generator.generatePDF(data, config);
};

export const generateCustomPDF = (data: PDFData, config: PDFConfig): void => {
  const generator = new PDFGenerator();
  generator.generatePDF(data, config);
}; 