import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface EvolutionNoteData {
  folio?: string;
  fecha: string;
  nombre_paciente: string;
  edad: string;
  motivo_consulta: string;
  sintomas_actuales: string;
  evolucion: string;
  exploracion_fisica: string;
  signos_vitales: {
    presion_arterial: string;
    frecuencia_cardiaca: string;
    temperatura: string;
    saturacion_oxigeno: string;
    peso: string;
    talla: string;
  };
  tratamiento_actual: string;
  cambios_tratamiento: string;
  recomendaciones: string;
  proxima_cita: string;
  observaciones: string;
  anotaciones_medico?: string;
  nota_soap?: {
    s: string;
    o: string;
    a: string;
    p: string;
  };
}

interface EvolutionNotePDFProps {
  data: EvolutionNoteData;
  onComplete?: () => void;
}

const EvolutionNotePDF: React.FC<EvolutionNotePDFProps> = ({ data, onComplete }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatVitalSigns = (vitalSigns: any) => {
    const signs = [];
    if (vitalSigns.presion_arterial) signs.push(`PA: ${vitalSigns.presion_arterial}`);
    if (vitalSigns.frecuencia_cardiaca) signs.push(`FC: ${vitalSigns.frecuencia_cardiaca}`);
    if (vitalSigns.temperatura) signs.push(`T: ${vitalSigns.temperatura}°C`);
    if (vitalSigns.saturacion_oxigeno) signs.push(`SpO2: ${vitalSigns.saturacion_oxigeno}%`);
    if (vitalSigns.peso) signs.push(`Peso: ${vitalSigns.peso} kg`);
    if (vitalSigns.talla) signs.push(`Talla: ${vitalSigns.talla} cm`);
    return signs.join(' | ') || 'No registrados';
  };

  // Generar PDF inmediatamente cuando el componente se monta
  React.useEffect(() => {
    const generatePDF = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let yPosition = margin;

    // Configuración de fuentes
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);

    // Título principal
    pdf.text('NOTA DE EVOLUCIÓN MÉDICA', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Información del folio y fecha
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    if (data.folio) {
      pdf.text(`Folio: ${data.folio}`, margin, yPosition);
    }
    pdf.text(`Fecha: ${formatDate(data.fecha)}`, pageWidth - margin - 40, yPosition);
    yPosition += 10;

    // Línea separadora
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 15;

    // Información del paciente
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('INFORMACIÓN DEL PACIENTE', margin, yPosition);
    yPosition += 8;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    pdf.text(`Nombre: ${data.nombre_paciente}`, margin, yPosition);
    pdf.text(`Edad: ${data.edad} años`, margin + 80, yPosition);
    yPosition += 8;

    // Motivo de consulta
    if (data.motivo_consulta) {
      yPosition += 5;
      pdf.setFont('helvetica', 'bold');
      pdf.text('MOTIVO DE CONSULTA:', margin, yPosition);
      yPosition += 6;
      pdf.setFont('helvetica', 'normal');
      const motivoLines = pdf.splitTextToSize(data.motivo_consulta, contentWidth);
      pdf.text(motivoLines, margin, yPosition);
      yPosition += (motivoLines.length * 5);
    }

    // Síntomas actuales
    if (data.sintomas_actuales) {
      yPosition += 5;
      pdf.setFont('helvetica', 'bold');
      pdf.text('SÍNTOMAS ACTUALES:', margin, yPosition);
      yPosition += 6;
      pdf.setFont('helvetica', 'normal');
      const sintomasLines = pdf.splitTextToSize(data.sintomas_actuales, contentWidth);
      pdf.text(sintomasLines, margin, yPosition);
      yPosition += (sintomasLines.length * 5);
    }

    // Evolución
    if (data.evolucion) {
      yPosition += 5;
      pdf.setFont('helvetica', 'bold');
      pdf.text('EVOLUCIÓN:', margin, yPosition);
      yPosition += 6;
      pdf.setFont('helvetica', 'normal');
      const evolucionLines = pdf.splitTextToSize(data.evolucion, contentWidth);
      pdf.text(evolucionLines, margin, yPosition);
      yPosition += (evolucionLines.length * 5);
    }

    // Verificar si necesitamos nueva página
    if (yPosition > pageHeight - 80) {
      pdf.addPage();
      yPosition = margin;
    }

    // Exploración física
    if (data.exploracion_fisica) {
      yPosition += 5;
      pdf.setFont('helvetica', 'bold');
      pdf.text('EXPLORACIÓN FÍSICA:', margin, yPosition);
      yPosition += 6;
      pdf.setFont('helvetica', 'normal');
      const exploracionLines = pdf.splitTextToSize(data.exploracion_fisica, contentWidth);
      pdf.text(exploracionLines, margin, yPosition);
      yPosition += (exploracionLines.length * 5);
    }

    // Signos vitales
    yPosition += 5;
    pdf.setFont('helvetica', 'bold');
    pdf.text('SIGNOS VITALES:', margin, yPosition);
    yPosition += 6;
    pdf.setFont('helvetica', 'normal');
    const vitalSignsText = formatVitalSigns(data.signos_vitales);
    pdf.text(vitalSignsText, margin, yPosition);
    yPosition += 8;

    // Verificar si necesitamos nueva página
    if (yPosition > pageHeight - 80) {
      pdf.addPage();
      yPosition = margin;
    }

    // Tratamiento actual
    if (data.tratamiento_actual) {
      yPosition += 5;
      pdf.setFont('helvetica', 'bold');
      pdf.text('TRATAMIENTO ACTUAL:', margin, yPosition);
      yPosition += 6;
      pdf.setFont('helvetica', 'normal');
      const tratamientoLines = pdf.splitTextToSize(data.tratamiento_actual, contentWidth);
      pdf.text(tratamientoLines, margin, yPosition);
      yPosition += (tratamientoLines.length * 5);
    }

    // Cambios en el tratamiento
    if (data.cambios_tratamiento) {
      yPosition += 5;
      pdf.setFont('helvetica', 'bold');
      pdf.text('CAMBIOS EN EL TRATAMIENTO:', margin, yPosition);
      yPosition += 6;
      pdf.setFont('helvetica', 'normal');
      const cambiosLines = pdf.splitTextToSize(data.cambios_tratamiento, contentWidth);
      pdf.text(cambiosLines, margin, yPosition);
      yPosition += (cambiosLines.length * 5);
    }

    // Verificar si necesitamos nueva página
    if (yPosition > pageHeight - 80) {
      pdf.addPage();
      yPosition = margin;
    }

    // Recomendaciones
    if (data.recomendaciones) {
      yPosition += 5;
      pdf.setFont('helvetica', 'bold');
      pdf.text('RECOMENDACIONES:', margin, yPosition);
      yPosition += 6;
      pdf.setFont('helvetica', 'normal');
      const recomendacionesLines = pdf.splitTextToSize(data.recomendaciones, contentWidth);
      pdf.text(recomendacionesLines, margin, yPosition);
      yPosition += (recomendacionesLines.length * 5);
    }

    // Próxima cita
    if (data.proxima_cita) {
      yPosition += 5;
      pdf.setFont('helvetica', 'bold');
      pdf.text('PRÓXIMA CITA:', margin, yPosition);
      yPosition += 6;
      pdf.setFont('helvetica', 'normal');
      pdf.text(formatDate(data.proxima_cita), margin, yPosition);
      yPosition += 8;
    }

    // Observaciones adicionales
    if (data.observaciones) {
      yPosition += 5;
      pdf.setFont('helvetica', 'bold');
      pdf.text('OBSERVACIONES ADICIONALES:', margin, yPosition);
      yPosition += 6;
      pdf.setFont('helvetica', 'normal');
      const observacionesLines = pdf.splitTextToSize(data.observaciones, contentWidth);
      pdf.text(observacionesLines, margin, yPosition);
      yPosition += (observacionesLines.length * 5);
    }

    // Anotaciones del médico
    if (data.anotaciones_medico) {
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = margin;
      }
      yPosition += 5;
      pdf.setFont('helvetica', 'bold');
      pdf.text('ANOTACIONES DEL MÉDICO:', margin, yPosition);
      yPosition += 6;
      pdf.setFont('helvetica', 'normal');
      const anotacionesLines = pdf.splitTextToSize(data.anotaciones_medico, contentWidth);
      pdf.text(anotacionesLines, margin, yPosition);
      yPosition += (anotacionesLines.length * 5);
    }

    // Nota SOAP
    if (data.nota_soap && (data.nota_soap.s || data.nota_soap.o || data.nota_soap.a || data.nota_soap.p)) {
      if (yPosition > pageHeight - 100) {
        pdf.addPage();
        yPosition = margin;
      }
      yPosition += 10;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('NOTA SOAP', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 10;

      pdf.setFontSize(11);
      const soapSections = [
        { key: 's', title: 'S - Subjetivo', content: data.nota_soap.s },
        { key: 'o', title: 'O - Objetivo', content: data.nota_soap.o },
        { key: 'a', title: 'A - Análisis', content: data.nota_soap.a },
        { key: 'p', title: 'P - Plan', content: data.nota_soap.p }
      ];

      for (const section of soapSections) {
        if (section.content) {
          pdf.setFont('helvetica', 'bold');
          pdf.text(`${section.title}:`, margin, yPosition);
          yPosition += 6;
          pdf.setFont('helvetica', 'normal');
          const soapLines = pdf.splitTextToSize(section.content, contentWidth);
          pdf.text(soapLines, margin, yPosition);
          yPosition += (soapLines.length * 5) + 3;
        }
      }
    }

    // Pie de página
    const currentPage = pdf.getCurrentPageInfo().pageNumber;
    const totalPages = pdf.getNumberOfPages();
    
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Página ${i} de ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      pdf.text(`Generado el ${new Date().toLocaleDateString('es-ES')}`, margin, pageHeight - 10);
    }

    // Generar nombre del archivo
    const fileName = `Nota_Evolucion_${data.nombre_paciente.replace(/\s+/g, '_')}_${data.fecha.replace(/-/g, '')}.pdf`;

      // Guardar PDF
      pdf.save(fileName);
      
      if (onComplete) {
        onComplete();
      }
    };

    generatePDF();
  }, [data, onComplete]);

  return (
    <div style={{ display: 'none' }}>
      {/* Este componente no renderiza nada visible, solo maneja la generación del PDF */}
    </div>
  );
};

export default EvolutionNotePDF;
export type { EvolutionNoteData }; 