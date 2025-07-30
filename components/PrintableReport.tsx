import React from 'react';

interface PrintableReportProps {
  data: any;
  formType: 'adulto' | 'pediatrico';
}

const ReportSection: React.FC<{ title: string; children: React.ReactNode, className?: string }> = ({ title, children, className }) => (
  <div className={`mb-6 break-inside-avoid ${className}`}>
    <h3 className="text-lg font-bold border-b-2 border-slate-300 pb-2 mb-3 text-slate-800">{title}</h3>
    <div className="space-y-2 text-sm">
      {children}
    </div>
  </div>
);

const ReportField: React.FC<{ label: string; value?: string | string[] | null; fullWidth?: boolean }> = ({ label, value, fullWidth = false }) => {
  const displayValue = Array.isArray(value) ? value.join(', ') : (value || 'N/A');
  if (value === null || value === undefined || (Array.isArray(value) && value.length === 0) || value === '') return null;
  
  if (fullWidth) {
    return (
       <div className="py-1">
        <span className="font-semibold text-slate-600 block">{label}: </span>
        <p className="text-slate-900 whitespace-pre-wrap">{displayValue}</p>
      </div>
    )
  }

  return (
    <div className="py-1 grid grid-cols-3 gap-2">
      <span className="font-semibold text-slate-600 col-span-1">{label}: </span>
      <span className="text-slate-900 col-span-2">{displayValue}</span>
    </div>
  );
};

const AiReportSection: React.FC<{ analysis: any }> = ({ analysis }) => {
    if (!analysis) return null;
    
    return (
        <ReportSection title="Análisis con Inteligencia Artificial" className="bg-blue-50 p-4 rounded-lg">
            <div className="py-1">
                <span className="font-semibold text-slate-600 block">Resumen Clínico:</span>
                <p className="text-slate-900 whitespace-pre-wrap">{analysis.resumen_clinico}</p>
            </div>
            <div className="py-1 mt-2">
                <span className="font-semibold text-slate-600 block">Posibles Interconexiones:</span>
                <p className="text-slate-900 whitespace-pre-wrap">{analysis.posibles_relaciones}</p>
            </div>
             <div className="py-1 mt-2">
                <span className="font-semibold text-slate-600 block">Sugerencias Diagnósticas:</span>
                <ul className="list-disc list-inside text-slate-900">
                    {analysis.sugerencias_diagnosticas?.map((item: string, index: number) => <li key={index}>{item}</li>)}
                </ul>
            </div>
            <div className="py-1 mt-2">
                <span className="font-semibold text-slate-600 block">Recomendaciones Nutricionales:</span>
                 <ul className="list-none text-slate-900 space-y-2 mt-1">
                    {analysis.recomendaciones_nutricionales?.map((item: any, index: number) => 
                        <li key={index} className='border-l-2 border-blue-200 pl-2'>
                           <strong>{item.nutriente}:</strong> {item.justificacion}
                        </li>
                    )}
                </ul>
            </div>
            <div className="py-1 mt-2">
                <span className="font-semibold text-slate-600 block">Recomendaciones Estilo de Vida:</span>
                <ul className="list-disc list-inside text-slate-900">
                    {analysis.recomendaciones_estilo_vida?.map((item: string, index: number) => <li key={index}>{item}</li>)}
                </ul>
            </div>
            <div className="py-1 mt-4 text-xs text-slate-500 italic">
                <p>{analysis.disclaimer}</p>
            </div>
        </ReportSection>
    )
}

const PrintableReport: React.FC<PrintableReportProps> = ({ data, formType }) => {
  return (
    <div className="p-8 bg-white font-sans text-base">
      <div className="text-center mb-8 border-b-2 pb-4">
        <h1 className="text-2xl font-bold text-slate-800">Reporte de Consulta</h1>
        <p className="text-slate-600 mt-1">Fecha de Generación: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        {data.folio && <p className="text-slate-800 font-bold text-lg mt-2">Folio de Expediente: {data.folio}</p>}
      </div>
      
      {data.aiAnalysis && <AiReportSection analysis={data.aiAnalysis} />}

      {data.anotaciones_medico && (
          <ReportSection title="Anotaciones del Médico" className="bg-slate-50 p-4 rounded-lg">
              <p className="text-slate-900 whitespace-pre-wrap">{data.anotaciones_medico}</p>
          </ReportSection>
      )}

      {data.nota_evolucion && (
          <ReportSection title="Nota de Evolución (SOAP)" className="bg-amber-50 p-4 rounded-lg">
              {typeof data.nota_evolucion === 'object' && data.nota_evolucion !== null ? (
                <div className="space-y-3">
                    <div>
                        <h4 className="font-semibold text-slate-700">S - Subjetivo:</h4>
                        <p className="text-slate-900 whitespace-pre-wrap pl-2">{data.nota_evolucion.s || 'N/A'}</p>
                    </div>
                     <div>
                        <h4 className="font-semibold text-slate-700">O - Objetivo:</h4>
                        <p className="text-slate-900 whitespace-pre-wrap pl-2">{data.nota_evolucion.o || 'N/A'}</p>
                    </div>
                     <div>
                        <h4 className="font-semibold text-slate-700">A - Análisis:</h4>
                        <p className="text-slate-900 whitespace-pre-wrap pl-2">{data.nota_evolucion.a || 'N/A'}</p>
                    </div>
                     <div>
                        <h4 className="font-semibold text-slate-700">P - Plan:</h4>
                        <p className="text-slate-900 whitespace-pre-wrap pl-2">{data.nota_evolucion.p || 'N/A'}</p>
                    </div>
                </div>
              ) : (
                <p className="text-slate-900 whitespace-pre-wrap">{data.nota_evolucion}</p>
              )}
          </ReportSection>
      )}

      {formType === 'adulto' ? (
        <>
          <ReportSection title="1. Datos Personales">
            <ReportField label="Nombre" value={data.nombre} />
            <ReportField label="F. Nacimiento" value={data.fecha_nacimiento} />
            <ReportField label="Edad" value={data.edad} />
            <ReportField label="Género" value={data.genero} />
            <ReportField label="Estado Civil" value={data.estado_civil} />
            <ReportField label="Ocupación" value={data.ocupacion} />
            <ReportField label="Tipo de sangre" value={data.tipo_sangre} />
            <ReportField label="Teléfono" value={data.telefono} />
            <ReportField label="Email" value={data.email} />
          </ReportSection>
          
          <ReportSection title="2. Historial Clínico">
            <ReportField label="Motivo de consulta" value={data.motivo_consulta} fullWidth />
            <ReportField label="Tiempo con síntomas" value={data.tiempo_sintomas} />
            <ReportField label="Diagnósticos previos" value={data.diagnosticos_previos} fullWidth />
            <ReportField label="Cirugías previas" value={data.cirugias_previas} fullWidth />
            <ReportField label="Hospitalizaciones" value={data.hospitalizaciones} fullWidth />
            <ReportField label="Alergias" value={data.alergias} fullWidth />
            <ReportField label="Vacunas" value={data.vacunas} />
            <ReportField label="Medicamentos" value={data.medicamentos_actuales} fullWidth />
            <ReportField label="Suplementos" value={data.suplementos} fullWidth />
            <ReportField label="Antecedentes fam." value={data.antecedentes_familiares} fullWidth />
          </ReportSection>
          
          <ReportSection title="3. Consumo Alimentario">
            <ReportField label="Frutas" value={data.consumo_frutas}/>
            <ReportField label="Vegetales" value={data.consumo_vegetales}/>
            <ReportField label="Cereales/Granos" value={data.consumo_cereales}/>
            <ReportField label="Carnes" value={data.consumo_carnes}/>
            <ReportField label="Alimentación general" value={data.alimentacion_general} fullWidth/>
            <ReportField label="Alimentos evitados" value={data.alimentos_avoid} fullWidth/>
            <ReportField label="Snacks" value={data.snacks} fullWidth/>
            <ReportField label="Hidratación" value={data.hidratacion} fullWidth/>
          </ReportSection>

          <ReportSection title="4. Estilo de Vida y Hábitos">
            <ReportField label="Actividad física" value={data.actividad_fisica} fullWidth />
            <ReportField label="Sueño" value={data.sueno} />
            <ReportField label="Fuma" value={data.fuma} />
            <ReportField label="Frecuencia (fuma)" value={data.fuma_frecuencia} />
            <ReportField label="Consume alcohol" value={data.alcohol} />
            <ReportField label="Frecuencia (alcohol)" value={data.alcohol_frecuencia} />
            <ReportField label="Otras sustancias" value={data.sustancias} />
            <ReportField label="Nivel de estrés" value={data.nivel_estres} />
            <ReportField label="Detalle de estrés" value={data.estres_detalle} fullWidth />
          </ReportSection>

          <ReportSection title="5. Estado Emocional">
            <ReportField label="Estado emocional" value={data.estado_emocional} fullWidth />
            <ReportField label="Síntomas emocionales" value={data.sintomas_emocionales} />
            <ReportField label="Calificación estado" value={data.calificacion_estado} />
          </ReportSection>

          <ReportSection title="6. Parámetros Antropométricos">
            <ReportField label="Peso actual (kg)" value={data.peso_actual} />
            <ReportField label="Estatura (cm)" value={data.estatura_actual} />
            <ReportField label="Cintura (cm)" value={data.cintura} />
            <ReportField label="Cadera (cm)" value={data.cadera} />
            <ReportField label="IMC" value={data.imc} />
            <ReportField label="Peso ideal (kg)" value={data.peso_ideal} />
          </ReportSection>

          <ReportSection title="7. Revisión por Sistemas">
            <ReportField label="Cardiovascular" value={data.cardio_sintomas} />
            <ReportField label="Respiratorio" value={data.resp_sintomas} />
            <ReportField label="Digestivo" value={data.digest_sintomas} />
            <ReportField label="Nº de hijos" value={data.num_hijos} />
            <ReportField label="Partos" value={data.partos} />
            <ReportField label="Cesáreas" value={data.cesareas} />
            <ReportField label="Menopausia" value={data.menopausia} />
            <ReportField label="Disfunción eréctil" value={data.disfuncion_erectil} />
            <ReportField label="Otros síntomas" value={data.otros_sintomas} fullWidth/>
          </ReportSection>

          <ReportSection title="8. Datos de Laboratorio">
            <ReportField label="Glucosa (mg/dL)" value={data.glucosa} />
            <ReportField label="HbA1c (%)" value={data.hbA1c} />
            <ReportField label="Colesterol Total" value={data.colesterol_total} />
            <ReportField label="Colesterol LDL" value={data.colesterol_ldl} />
            <ReportField label="Colesterol HDL" value={data.colesterol_hdl} />
            <ReportField label="Triglicéridos" value={data.trigliceridos} />
            <ReportField label="Otros Labs" value={data.otros_lab} fullWidth />
          </ReportSection>
          
          <ReportSection title="9. Expectativas y Objetivos">
             <ReportField label="Objetivos del paciente" value={data.objetivos_paciente} fullWidth />
          </ReportSection>
          
          <ReportSection title="10. Observaciones Adicionales">
             <ReportField label="Observaciones" value={data.observaciones_adicionales} fullWidth />
          </ReportSection>

           <ReportSection title="Firma">
            <ReportField label="Firma del Paciente" value={data.firma_paciente} />
          </ReportSection>
        </>
      ) : (
        <>
           <ReportSection title="1. Información Básica">
            <ReportField label="Nombre Paciente" value={data.nombre_nino} />
            <ReportField label="F. Nacimiento" value={data.fecha_nacimiento_nino} />
            <ReportField label="Edad" value={data.edad_nino} />
            <ReportField label="Género" value={data.genero_nino} />
            <ReportField label="Tipo de sangre" value={data.tipo_sangre_nino} />
            <ReportField label="Nombre Responsable" value={data.nombre_padres} />
            <ReportField label="Relación" value={data.relacion_paciente} />
           </ReportSection>

           <ReportSection title="2. Motivo y Antecedentes">
            <ReportField label="Motivo de consulta" value={data.motivo_consulta_nino} fullWidth />
            <ReportField label="Duración síntomas" value={data.tiempo_sintomas_nino} />
            <ReportField label="Evolución" value={data.evolucion_sintomas} />
            <ReportField label="Vacunación" value={data.vacunas_nino} />
            <ReportField label="Alergias" value={data.alergias_nino} />
            <ReportField label="Antecedentes perinatales" value={data.antecedentes_perinatales} fullWidth />
            <ReportField label="Medicamentos" value={data.medicamentos_actuales_nino} fullWidth />
            <ReportField label="Antecedentes fam." value={data.antecedentes_familiares_nino} fullWidth />
           </ReportSection>

           <ReportSection title="3. Desarrollo y Crecimiento">
              <ReportField label="Peso actual (kg)" value={data.peso_actual_nino} />
              <ReportField label="Estatura (cm)" value={data.estatura_actual_nino} />
              <ReportField label="Perímetro cefálico (cm)" value={data.perimetro_cefalico} />
              <ReportField label="IMC" value={data.imc_nino} />
              <ReportField label="Hitos del desarrollo" value={data.hitos_desarrollo} />
              <ReportField label="Preocupaciones" value={data.evaluacion_desarrollo} fullWidth />
           </ReportSection>
           
           <ReportSection title="4. Alimentación y Hábitos">
              <ReportField label="Tipo alimentación" value={data.tipo_alimentacion} />
              <ReportField label="Alimentación diaria" value={data.alimentacion_general_nino} fullWidth />
              <ReportField label="Alimentos rechazados" value={data.alimentos_avoid_nino} />
              <ReportField label="Horas de sueño" value={data.sueno_nino} />
              <ReportField label="Calidad de sueño" value={data.calidad_sueno} />
              <ReportField label="Tiempo de pantallas" value={data.pantallas_nino} />
              <ReportField label="Actividad física" value={data.actividad_fisica_nino} fullWidth />
           </ReportSection>
           
           <ReportSection title="5. Valoración por Sistemas">
              <ReportField label="Síntomas Respiratorios" value={data.resp_sintomas_nino} />
              <ReportField label="Síntomas Digestivos" value={data.digest_sintomas_nino} />
              <ReportField label="Síntomas Piel" value={data.piel_sintomas_nino} />
              <ReportField label="Comportamiento" value={data.comportamiento_nino} />
              <ReportField label="Otros síntomas" value={data.otros_sintomas_nino} fullWidth />
           </ReportSection>
           
           <ReportSection title="6. Entorno Social y Escolar">
              <ReportField label="Escolaridad" value={data.escolaridad} />
              <ReportField label="Rendimiento académico" value={data.rendimiento_academico} />
              <ReportField label="Adaptación escolar" value={data.adaptacion_escolar} />
              <ReportField label="Act. extracurriculares" value={data.actividades_extracurriculares} fullWidth />
              <ReportField label="Dinámica familiar" value={data.dinamica_familiar} fullWidth />
           </ReportSection>
           
            <ReportSection title="7. Observaciones y Objetivos">
                <ReportField label="Expectativas/Objetivos" value={data.objetivos_consulta} fullWidth />
                <ReportField label="Observaciones" value={data.observaciones_adicionales_nino} fullWidth />
           </ReportSection>

           <ReportSection title="Firma">
            <ReportField label="Firma del Responsable" value={data.firma_responsable_nino} />
          </ReportSection>
        </>
      )}

    </div>
  );
};

export default PrintableReport;