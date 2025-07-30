import React, { useState, useCallback } from 'react';

// --- Reusable Form Components (defined locally) ---
interface FieldsetProps {
  title: string;
  children?: React.ReactNode;
  className?: string;
}
const Fieldset: React.FC<FieldsetProps> = ({ title, children, className }) => (
  <fieldset className={`border-none mb-10 p-6 bg-slate-50/50 rounded-xl shadow-sm transition-all duration-300 ease-in-out hover:shadow-md ${className}`}>
    <legend className="font-semibold text-xl text-blue-600 px-2 mb-4">{title}</legend>
    <div className="space-y-4">
      {children}
    </div>
  </fieldset>
);

const commonInputClasses = "w-full p-3 border border-gray-300 rounded-lg text-base transition-all duration-300 ease-in-out bg-white hover:border-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20";
const commonLabelClasses = "block mb-1.5 font-medium text-gray-700 text-sm";
const rowClass = "flex flex-col sm:flex-row gap-4";
const checkboxGroupClasses = "flex flex-wrap gap-x-6 gap-y-2";

// --- Main PediatricForm Component ---

interface PediatricFormProps {
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
}

const PediatricForm: React.FC<PediatricFormProps> = ({ onSubmit, isSubmitting }) => {
    const [formData, setFormData] = useState<any>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            const fieldName = name.replace('[]', '');
            const list = (formData[fieldName] as string[]) || [];
            const newList = checked ? [...list, value] : list.filter(item => item !== value);
            setFormData((prev: any) => ({ ...prev, [fieldName]: newList }));
        } else {
            setFormData((prev: any) => ({ ...prev, [name]: value }));
        }
    };

    const calculateIMC = useCallback(() => {
        const peso = parseFloat(formData.peso_actual_nino);
        const estaturaCm = parseFloat(formData.estatura_actual_nino);
        if (!isNaN(peso) && !isNaN(estaturaCm) && estaturaCm > 0) {
            const estaturaM = estaturaCm / 100;
            const imc = peso / (estaturaM * estaturaM);
            setFormData((prev: any) => ({ ...prev, imc_nino: imc.toFixed(2) }));
        }
    }, [formData.peso_actual_nino, formData.estatura_actual_nino]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-left mt-0 mb-5 text-2xl font-semibold text-blue-600 relative after:content-[''] after:block after:w-14 after:h-1 after:bg-gradient-to-r from-blue-600 to-violet-500 after:mt-2.5 after:rounded">Formulario Pediátrico</h2>
      
      {/* SECTION 1: INFORMACIÓN BÁSICA */}
      <Fieldset title="1. Información Básica">
        <label className={commonLabelClasses}>Nombre completo del paciente: <input type="text" name="nombre_nino" required className={commonInputClasses} onChange={handleChange}/></label>
        <div className={rowClass}>
            <label className={`${commonLabelClasses} w-full`}>Fecha de nacimiento: <input type="date" name="fecha_nacimiento_nino" required className={commonInputClasses} onChange={handleChange}/></label>
            <label className={`${commonLabelClasses} w-full`}>Edad (años/meses): <input type="text" name="edad_nino" required className={commonInputClasses} onChange={handleChange}/></label>
        </div>
        <div className={rowClass}>
            <label className={`${commonLabelClasses} w-full`}>Género:
                <select name="genero_nino" required className={commonInputClasses} onChange={handleChange} defaultValue="">
                    <option value="" disabled>Seleccione</option><option value="Masculino">Masculino</option><option value="Femenino">Femenino</option><option value="Otro">Otro</option>
                </select>
            </label>
            <label className={`${commonLabelClasses} w-full`}>Tipo de sangre (si conoce): <input type="text" name="tipo_sangre_nino" className={commonInputClasses} onChange={handleChange}/></label>
        </div>
        <label className={commonLabelClasses}>Nombre del padre/madre/tutor: <input type="text" name="nombre_padres" required className={commonInputClasses} onChange={handleChange}/></label>
        <label className={commonLabelClasses}>Relación con el paciente:
            <select name="relacion_paciente" required className={commonInputClasses} onChange={handleChange} defaultValue="">
                <option value="" disabled>Seleccione</option><option value="Madre">Madre</option><option value="Padre">Padre</option><option value="Abuelo/a">Abuelo/a</option><option value="Tutor legal">Tutor legal</option><option value="Otro">Otro</option>
            </select>
        </label>
      </Fieldset>
      
      {/* SECTION 2: MOTIVO Y ANTECEDENTES */}
      <Fieldset title="2. Motivo de Consulta y Antecedentes">
          <label className={commonLabelClasses}>Motivo principal de la consulta: <textarea name="motivo_consulta_nino" required className={commonInputClasses} onChange={handleChange}></textarea></label>
          <div className={rowClass}>
            <label className={`${commonLabelClasses} w-full`}>Duración de síntomas: <input type="text" name="tiempo_sintomas_nino" placeholder="Ej: 3 días, 2 semanas" className={commonInputClasses} onChange={handleChange}/></label>
            <label className={`${commonLabelClasses} w-full`}>Evolución de síntomas:
                <select name="evolucion_sintomas" className={commonInputClasses} onChange={handleChange} defaultValue="">
                    <option value="" disabled>Seleccione</option><option value="Mejorando">Mejorando</option><option value="Estable">Estable</option><option value="Empeorando">Empeorando</option><option value="Variable">Variable</option>
                </select>
            </label>
          </div>
          <div className={rowClass}>
            <label className={`${commonLabelClasses} w-full`}>Estado de vacunación:
                <select name="vacunas_nino" required className={commonInputClasses} onChange={handleChange} defaultValue="">
                    <option value="" disabled>Seleccione</option><option value="Al día">Al día según edad</option><option value="Incompletas">Incompletas</option><option value="Desconocido">Desconocido</option>
                </select>
            </label>
            <label className={`${commonLabelClasses} w-full`}>Alergias conocidas: <input type="text" name="alergias_nino" placeholder="Medicamentos, alimentos, otras" className={commonInputClasses} onChange={handleChange}/></label>
          </div>
          <label className={commonLabelClasses}>Antecedentes perinatales: <textarea name="antecedentes_perinatales" placeholder="Gestación, parto, peso al nacer..." className={commonInputClasses} onChange={handleChange}></textarea></label>
          <label className={commonLabelClasses}>Medicamentos actuales: <textarea name="medicamentos_actuales_nino" placeholder="Nombre, dosis, frecuencia" className={commonInputClasses} onChange={handleChange}></textarea></label>
          <label className={commonLabelClasses}>Antecedentes familiares relevantes: <textarea name="antecedentes_familiares_nino" placeholder="Enfermedades crónicas o hereditarias" className={commonInputClasses} onChange={handleChange}></textarea></label>
      </Fieldset>

      {/* SECTION 3: DESARROLLO */}
      <Fieldset title="3. Desarrollo y Crecimiento">
        <div className={rowClass}>
          <label className={`${commonLabelClasses} w-full`}>Peso actual (kg): <input type="number" step="0.1" name="peso_actual_nino" required className={commonInputClasses} onChange={handleChange}/></label>
          <label className={`${commonLabelClasses} w-full`}>Estatura (cm): <input type="number" step="0.1" name="estatura_actual_nino" required className={commonInputClasses} onChange={handleChange}/></label>
        </div>
        <div className={rowClass}>
          <label className={`${commonLabelClasses} w-full`}>Perímetro cefálico (cm): <input type="number" step="0.1" name="perimetro_cefalico" placeholder="Menores de 3 años" className={commonInputClasses} onChange={handleChange}/></label>
          <label className={`${commonLabelClasses} w-full`}>IMC: <input type="number" step="0.1" name="imc_nino" value={formData.imc_nino || ''} className={`${commonInputClasses} bg-slate-100`} readOnly/></label>
        </div>
        <button type="button" onClick={calculateIMC} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition mb-4">Calcular IMC</button>
        <label className={`${commonLabelClasses} mt-2`}>Hitos del desarrollo alcanzados:</label>
        <div className={checkboxGroupClasses}>
            <label className="flex items-center gap-2"><input type="checkbox" name="hitos_desarrollo[]" value="Control cefálico" onChange={handleChange} /> Control cefálico</label>
            <label className="flex items-center gap-2"><input type="checkbox" name="hitos_desarrollo[]" value="Sentarse solo" onChange={handleChange} /> Sentarse solo</label>
            <label className="flex items-center gap-2"><input type="checkbox" name="hitos_desarrollo[]" value="Gateo" onChange={handleChange} /> Gateo</label>
            <label className="flex items-center gap-2"><input type="checkbox" name="hitos_desarrollo[]" value="Caminar" onChange={handleChange} /> Caminar</label>
            <label className="flex items-center gap-2"><input type="checkbox" name="hitos_desarrollo[]" value="Lenguaje acorde a edad" onChange={handleChange} /> Lenguaje acorde a edad</label>
            <label className="flex items-center gap-2"><input type="checkbox" name="hitos_desarrollo[]" value="Control de esfínteres" onChange={handleChange} /> Control de esfínteres</label>
        </div>
        <label className={`${commonLabelClasses} mt-4`}>Preocupaciones sobre el desarrollo: <textarea name="evaluacion_desarrollo" className={commonInputClasses} onChange={handleChange}></textarea></label>
      </Fieldset>

      {/* SECTION 4: ALIMENTACIÓN Y HÁBITOS */}
      <Fieldset title="4. Alimentación y Hábitos">
          <label className={commonLabelClasses}>Tipo de alimentación principal:
            <select name="tipo_alimentacion" className={commonInputClasses} onChange={handleChange} defaultValue="">
                <option value="" disabled>Seleccione</option>
                <option value="Lactancia materna exclusiva">Lactancia materna exclusiva</option>
                <option value="Lactancia mixta">Lactancia mixta</option>
                <option value="Fórmula">Fórmula exclusiva</option>
                <option value="Alimentación complementaria">Alimentación complementaria</option>
                <option value="Dieta familiar">Dieta familiar completa</option>
            </select>
          </label>
          <label className={commonLabelClasses}>Descripción de alimentación diaria: <textarea name="alimentacion_general_nino" className={commonInputClasses} onChange={handleChange}></textarea></label>
          <label className={commonLabelClasses}>Alimentos rechazados o no tolerados: <input type="text" name="alimentos_avoid_nino" className={commonInputClasses} onChange={handleChange}/></label>
          <div className={rowClass}>
            <label className={`${commonLabelClasses} w-full`}>Horas de sueño diarias: <input type="text" name="sueno_nino" placeholder="Ej: 10-12 horas" className={commonInputClasses} onChange={handleChange}/></label>
            <label className={`${commonLabelClasses} w-full`}>Calidad del sueño:
                <select name="calidad_sueno" className={commonInputClasses} onChange={handleChange} defaultValue="">
                    <option value="" disabled>Seleccione</option><option value="Buena">Buena</option><option value="Regular">Regular</option><option value="Mala">Mala</option>
                </select>
            </label>
          </div>
          <label className={commonLabelClasses}>Tiempo diario de pantallas: <input type="text" name="pantallas_nino" placeholder="Ej: 1 hora de TV" className={commonInputClasses} onChange={handleChange}/></label>
          <label className={commonLabelClasses}>Actividad física habitual: <textarea name="actividad_fisica_nino" className={commonInputClasses} onChange={handleChange}></textarea></label>
      </Fieldset>
      
      {/* SECTION 5: VALORACIÓN POR SISTEMAS */}
      <Fieldset title="5. Valoración por Sistemas">
          <h4 className="font-semibold text-lg text-slate-700 mb-2">Sistema Respiratorio</h4>
          <div className={checkboxGroupClasses}>
              <label className="flex items-center gap-2"><input type="checkbox" name="resp_sintomas_nino[]" value="Tos frecuente" onChange={handleChange}/> Tos</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="resp_sintomas_nino[]" value="Infecciones recurrentes" onChange={handleChange}/> Infecciones recurrentes</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="resp_sintomas_nino[]" value="Sibilancias" onChange={handleChange}/> Sibilancias</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="resp_sintomas_nino[]" value="Dificultad respiratoria" onChange={handleChange}/> Dificultad respiratoria</label>
          </div>
          <h4 className="font-semibold text-lg text-slate-700 mt-6 mb-2">Sistema Digestivo</h4>
          <div className={checkboxGroupClasses}>
              <label className="flex items-center gap-2"><input type="checkbox" name="digest_sintomas_nino[]" value="Vómitos" onChange={handleChange}/> Vómitos</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="digest_sintomas_nino[]" value="Diarrea" onChange={handleChange}/> Diarrea</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="digest_sintomas_nino[]" value="Estreñimiento" onChange={handleChange}/> Estreñimiento</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="digest_sintomas_nino[]" value="Dolor abdominal" onChange={handleChange}/> Dolor abdominal</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="digest_sintomas_nino[]" value="Reflujo" onChange={handleChange}/> Reflujo</label>
          </div>
           <h4 className="font-semibold text-lg text-slate-700 mt-6 mb-2">Piel</h4>
          <div className={checkboxGroupClasses}>
              <label className="flex items-center gap-2"><input type="checkbox" name="piel_sintomas_nino[]" value="Erupciones" onChange={handleChange}/> Erupciones</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="piel_sintomas_nino[]" value="Eccema" onChange={handleChange}/> Eccema</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="piel_sintomas_nino[]" value="Prurito" onChange={handleChange}/> Prurito (picazón)</label>
          </div>
          <h4 className="font-semibold text-lg text-slate-700 mt-6 mb-2">Comportamiento y Desarrollo</h4>
          <div className={checkboxGroupClasses}>
              <label className="flex items-center gap-2"><input type="checkbox" name="comportamiento_nino[]" value="Hiperactividad" onChange={handleChange}/> Hiperactividad</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="comportamiento_nino[]" value="Déficit atención" onChange={handleChange}/> Déficit de atención</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="comportamiento_nino[]" value="Problemas de socialización" onChange={handleChange}/> Problemas de socialización</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="comportamiento_nino[]" value="Problemas de aprendizaje" onChange={handleChange}/> Problemas de aprendizaje</label>
          </div>
          <label className={`${commonLabelClasses} mt-4`}>Otros síntomas o preocupaciones: <textarea name="otros_sintomas_nino" className={commonInputClasses} onChange={handleChange}></textarea></label>
      </Fieldset>
      
      {/* SECTION 6: ENTORNO SOCIAL Y ESCOLAR */}
      <Fieldset title="6. Entorno Social y Escolar">
        <label className={commonLabelClasses}>Escolaridad actual:
            <select name="escolaridad" className={commonInputClasses} onChange={handleChange} defaultValue="">
                <option value="" disabled>Seleccione</option><option value="No escolarizado">No escolarizado</option><option value="Guardería/Maternal">Guardería/Maternal</option><option value="Preescolar">Preescolar</option><option value="Primaria">Primaria</option><option value="Secundaria">Secundaria</option>
            </select>
        </label>
        <div className={rowClass}>
            <label className={`${commonLabelClasses} w-full`}>Rendimiento académico:
                <select name="rendimiento_academico" className={commonInputClasses} onChange={handleChange} defaultValue="">
                    <option value="" disabled>Seleccione</option><option value="Sobresaliente">Sobresaliente</option><option value="Bueno">Bueno</option><option value="Promedio">Promedio</option><option value="Con dificultades">Con dificultades</option><option value="No aplica">No aplica</option>
                </select>
            </label>
            <label className={`${commonLabelClasses} w-full`}>Adaptación escolar:
                 <select name="adaptacion_escolar" className={commonInputClasses} onChange={handleChange} defaultValue="">
                    <option value="" disabled>Seleccione</option><option value="Buena">Buena</option><option value="Regular">Regular</option><option value="Deficiente">Deficiente</option><option value="No aplica">No aplica</option>
                </select>
            </label>
        </div>
        <label className={commonLabelClasses}>Actividades extracurriculares: <textarea name="actividades_extracurriculares" placeholder="Deportes, clases, hobbies" className={commonInputClasses} onChange={handleChange}></textarea></label>
        <label className={commonLabelClasses}>Estructura y dinámica familiar: <textarea name="dinamica_familiar" placeholder="Con quién vive, relación con hermanos..." className={commonInputClasses} onChange={handleChange}></textarea></label>
      </Fieldset>

      {/* SECTION 7: OBSERVACIONES Y OBJETIVOS */}
      <Fieldset title="7. Observaciones y Objetivos">
          <label className={commonLabelClasses}>Expectativas y objetivos de esta consulta: <textarea name="objetivos_consulta" className={commonInputClasses} onChange={handleChange}></textarea></label>
          <label className={commonLabelClasses}>Observaciones adicionales importantes: <textarea name="observaciones_adicionales_nino" className={commonInputClasses} onChange={handleChange}></textarea></label>
      </Fieldset>

      {/* FIRMA Y ENVÍO */}
      <hr className="my-8 border-gray-200"/>
      <Fieldset title="Firma del Responsable">
        <label className={commonLabelClasses}>Firma del Responsable: <input type="text" name="firma_responsable_nino" required placeholder="Nombre o firma digital" className={commonInputClasses} onChange={handleChange} /></label>
        <p className="text-sm text-gray-500">Confirmo que la información proporcionada es veraz y completa.</p>
      </Fieldset>
      
      <div className="text-center">
        <button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-blue-600 to-violet-500 text-white text-lg font-semibold py-3 px-8 rounded-xl cursor-pointer transition-all duration-300 ease-in-out shadow-lg shadow-blue-500/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/30 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed">
          {isSubmitting ? 'Enviando...' : 'Enviar Formulario'}
        </button>
      </div>
    </form>
  );
};

export default PediatricForm;
