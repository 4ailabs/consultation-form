import React, { useState, useCallback } from 'react';

// --- Reusable Form Components (defined locally to keep file count low) ---

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
const checkboxGroupClasses = "flex flex-wrap gap-x-6 gap-y-2";
const radioGroupClasses = "flex flex-wrap gap-x-6 gap-y-2";

// --- Main AdultForm Component ---

interface AdultFormProps {
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
}

const AdultForm: React.FC<AdultFormProps> = ({ onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState<any>({});
  const [labsDisabled, setLabsDisabled] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        const fieldName = name.replace('[]', '');
        const list = (formData[fieldName] as string[]) || [];
        const newList = checked ? [...list, value] : list.filter(item => item !== value);
        setFormData((prev: any) => ({ ...prev, [fieldName]: newList }));
    } else if (type === 'radio') {
        if ((e.target as HTMLInputElement).checked) {
            setFormData((prev: any) => ({ ...prev, [name]: value }));
        }
    } else {
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const calculateIMC = useCallback(() => {
    const peso = parseFloat(formData.peso_actual);
    const estaturaCm = parseFloat(formData.estatura_actual);
    if (!isNaN(peso) && !isNaN(estaturaCm) && estaturaCm > 0) {
      const estaturaM = estaturaCm / 100;
      const imc = peso / (estaturaM * estaturaM);
      setFormData((prev: any) => ({ ...prev, imc: imc.toFixed(2) }));
    }
  }, [formData.peso_actual, formData.estatura_actual]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* SECTION 1: DATOS PERSONALES */}
      <Fieldset title="1. Datos Personales">
        <label className={commonLabelClasses}>Nombre completo: <input type="text" name="nombre" required className={commonInputClasses} onChange={handleChange} /></label>
        <label className={commonLabelClasses}>Fecha de nacimiento: <input type="date" name="fecha_nacimiento" required className={commonInputClasses} onChange={handleChange} /></label>
        <label className={commonLabelClasses}>Edad: <input type="number" name="edad" required className={commonInputClasses} onChange={handleChange} /></label>
        <label className={commonLabelClasses}>Género:
            <select name="genero" required className={commonInputClasses} onChange={handleChange} defaultValue="">
                <option value="" disabled>Seleccione</option><option value="Masculino">Masculino</option><option value="Femenino">Femenino</option><option value="Otro">Otro</option>
            </select>
        </label>
        <label className={commonLabelClasses}>Estado civil:
            <select name="estado_civil" required className={commonInputClasses} onChange={handleChange} defaultValue="">
                <option value="" disabled>Seleccione</option><option value="Soltero(a)">Soltero(a)</option><option value="Casado(a)">Casado(a)</option><option value="Unión libre">Unión libre</option><option value="Divorciado(a)">Divorciado(a)</option><option value="Viudo(a)">Viudo(a)</option>
            </select>
        </label>
        <label className={commonLabelClasses}>Ocupación: <input type="text" name="ocupacion" className={commonInputClasses} onChange={handleChange} /></label>
        <label className={commonLabelClasses}>Tipo de sangre: <input type="text" name="tipo_sangre" className={commonInputClasses} onChange={handleChange} /></label>
        <label className={commonLabelClasses}>Número de teléfono: <input type="tel" name="telefono" className={commonInputClasses} onChange={handleChange} /></label>
        <label className={commonLabelClasses}>Correo electrónico: <input type="email" name="email" className={commonInputClasses} onChange={handleChange} /></label>
      </Fieldset>
      
      {/* SECTION 2: HISTORIAL CLÍNICO */}
      <Fieldset title="2. Historial Clínico">
          <label className={commonLabelClasses}>Motivo de la consulta: <textarea name="motivo_consulta" required className={commonInputClasses} onChange={handleChange} placeholder="Razón principal, síntomas..."></textarea></label>
          <label className={commonLabelClasses}>¿Desde cuándo presenta estos síntomas?: <input type="text" name="tiempo_sintomas" className={commonInputClasses} onChange={handleChange} /></label>
          <label className={commonLabelClasses}>Diagnósticos previos: <textarea name="diagnosticos_previos" className={commonInputClasses} onChange={handleChange} placeholder="Ej: hipertensión, diabetes..."></textarea></label>
          <label className={commonLabelClasses}>Cirugías previas: <textarea name="cirugias_previas" className={commonInputClasses} onChange={handleChange}></textarea></label>
          <label className={commonLabelClasses}>Hospitalizaciones: <textarea name="hospitalizaciones" className={commonInputClasses} onChange={handleChange}></textarea></label>
          <label className={commonLabelClasses}>Alergias: <textarea name="alergias" className={commonInputClasses} onChange={handleChange}></textarea></label>
          <label className={commonLabelClasses}>¿Vacunas actualizadas?:
              <select name="vacunas" className={commonInputClasses} onChange={handleChange} defaultValue="">
                  <option value="" disabled>Seleccione</option><option value="Sí">Sí</option><option value="No">No</option><option value="Desconocido">Desconocido</option>
              </select>
          </label>
          <label className={commonLabelClasses}>Medicamentos actuales: <textarea name="medicamentos_actuales" className={commonInputClasses} onChange={handleChange} placeholder="dosis y frecuencia"></textarea></label>
          <label className={commonLabelClasses}>Suplementos: <textarea name="suplementos" className={commonInputClasses} onChange={handleChange}></textarea></label>
          <label className={commonLabelClasses}>Antecedentes familiares: <textarea name="antecedentes_familiares" className={commonInputClasses} onChange={handleChange} placeholder="Ej: diabetes, cáncer, etc."></textarea></label>
      </Fieldset>

      {/* SECTION 3: CONSUMO ALIMENTARIO */}
      <Fieldset title="3. Consumo Alimentario">
            <label className={commonLabelClasses}>Frecuencia de consumo de Frutas:
                <select name="consumo_frutas" className={commonInputClasses} onChange={handleChange} defaultValue="">
                    <option value="" disabled>Seleccione</option><option value="Nunca">Nunca</option><option value="Rara vez">Rara vez</option><option value="1-2 veces/semana">1-2 veces/semana</option><option value="3-4 veces/semana">3-4 veces/semana</option><option value="Diario">Diario</option>
                </select>
            </label>
            <label className={commonLabelClasses}>Frecuencia de consumo de Vegetales:
                <select name="consumo_vegetales" className={commonInputClasses} onChange={handleChange} defaultValue="">
                    <option value="" disabled>Seleccione</option><option value="Nunca">Nunca</option><option value="Rara vez">Rara vez</option><option value="1-2 veces/semana">1-2 veces/semana</option><option value="3-4 veces/semana">3-4 veces/semana</option><option value="Diario">Diario</option>
                </select>
            </label>
            <label className={commonLabelClasses}>Frecuencia de consumo de Cereales/Granos:
                 <select name="consumo_cereales" className={commonInputClasses} onChange={handleChange} defaultValue="">
                    <option value="" disabled>Seleccione</option><option value="Nunca">Nunca</option><option value="Rara vez">Rara vez</option><option value="1-2 veces/semana">1-2 veces/semana</option><option value="3-4 veces/semana">3-4 veces/semana</option><option value="Diario">Diario</option>
                </select>
            </label>
            <label className={commonLabelClasses}>Frecuencia de consumo de Carnes:
                <select name="consumo_carnes" className={commonInputClasses} onChange={handleChange} defaultValue="">
                    <option value="" disabled>Seleccione</option><option value="Nunca">Nunca</option><option value="Rara vez">Rara vez</option><option value="1-2 veces/semana">1-2 veces/semana</option><option value="3-4 veces/semana">3-4 veces/semana</option><option value="Diario">Diario</option>
                </select>
            </label>
            <label className={commonLabelClasses}>Descripción general de su alimentación: <textarea name="alimentacion_general" placeholder="Nº de comidas, horarios, tipo de dieta..." className={commonInputClasses} onChange={handleChange}></textarea></label>
            <label className={commonLabelClasses}>¿Algún alimento que evite o no tolere?: <textarea name="alimentos_avoid" placeholder="Alergias, intolerancias o preferencias..." className={commonInputClasses} onChange={handleChange}></textarea></label>
            <label className={commonLabelClasses}>¿Suele picar entre horas? ¿Qué consume?: <textarea name="snacks" placeholder="Ej: fruta, frutos secos, dulces..." className={commonInputClasses} onChange={handleChange}></textarea></label>
            <label className={commonLabelClasses}>Consumo de agua / otras bebidas: <textarea name="hidratacion" placeholder="Cantidad de vasos, refrescos, café..." className={commonInputClasses} onChange={handleChange}></textarea></label>
      </Fieldset>

      {/* SECTION 4: ESTILO DE VIDA Y HÁBITOS */}
      <Fieldset title="4. Estilo de Vida y Hábitos">
          <label className={commonLabelClasses}>Actividad física (frecuencia y tipo): <textarea name="actividad_fisica" placeholder="Ej: Caminar 30 min/día..." className={commonInputClasses} onChange={handleChange}></textarea></label>
          <label className={commonLabelClasses}>Sueño (horas y calidad): <input type="text" name="sueno" placeholder="Ej: 7 h, sueño regular" className={commonInputClasses} onChange={handleChange} /></label>
          <p className="font-medium text-gray-800 mt-4">Hábitos Tóxicos</p>
          <label className={commonLabelClasses}>¿Fuma?</label>
          <div className={radioGroupClasses}>
              <label className="flex items-center gap-2"><input type="radio" name="fuma" value="Sí" onChange={handleChange} /> Sí</label>
              <label className="flex items-center gap-2"><input type="radio" name="fuma" value="No" defaultChecked onChange={handleChange} /> No</label>
          </div>
          <label className={commonLabelClasses}>Si fuma, cantidad/frecuencia: <input type="text" name="fuma_frecuencia" className={commonInputClasses} onChange={handleChange} /></label>
          <label className={commonLabelClasses}>¿Consume alcohol?</label>
          <div className={radioGroupClasses}>
              <label className="flex items-center gap-2"><input type="radio" name="alcohol" value="Sí" onChange={handleChange} /> Sí</label>
              <label className="flex items-center gap-2"><input type="radio" name="alcohol" value="No" defaultChecked onChange={handleChange} /> No</label>
          </div>
          <label className={commonLabelClasses}>Tipo y frecuencia de alcohol: <input type="text" name="alcohol_frecuencia" className={commonInputClasses} onChange={handleChange} /></label>
          <label className={commonLabelClasses}>¿Otras sustancias psicoactivas?: <input type="text" name="sustancias" className={commonInputClasses} onChange={handleChange} /></label>
          <label className={commonLabelClasses}>Nivel de estrés en la última semana:
              <select name="nivel_estres" className={commonInputClasses} onChange={handleChange} defaultValue="">
                  <option value="" disabled>Seleccione</option><option value="Muy bajo">Muy bajo</option><option value="Bajo">Bajo</option><option value="Moderado">Moderado</option><option value="Alto">Alto</option><option value="Muy alto">Muy alto</option>
              </select>
          </label>
          <label className={commonLabelClasses}>Fuentes de estrés y estrategias de manejo: <textarea name="estres_detalle" className={commonInputClasses} onChange={handleChange}></textarea></label>
      </Fieldset>

      {/* SECTION 5: ESTADO EMOCIONAL */}
      <Fieldset title="5. Estado Emocional y Sintomatología">
          <label className={commonLabelClasses}>¿Cómo describiría su estado emocional actual?: <textarea name="estado_emocional" placeholder="Ej: me siento ansioso, estable..." className={commonInputClasses} onChange={handleChange}></textarea></label>
          <label className={commonLabelClasses}>Síntomas emocionales (seleccione los que ha experimentado):</label>
          <div className={checkboxGroupClasses}>
              <label className="flex items-center gap-2"><input type="checkbox" name="sintomas_emocionales[]" value="Ansiedad" onChange={handleChange} /> Ansiedad</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="sintomas_emocionales[]" value="Depresión" onChange={handleChange} /> Depresión</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="sintomas_emocionales[]" value="Irritabilidad" onChange={handleChange} /> Irritabilidad</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="sintomas_emocionales[]" value="Fatiga emocional" onChange={handleChange} /> Fatiga emocional</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="sintomas_emocionales[]" value="Cambios de humor" onChange={handleChange} /> Cambios de humor</label>
          </div>
           <label className={`${commonLabelClasses} mt-4`}>Califique su estado emocional actual:
              <select name="calificacion_estado" className={commonInputClasses} onChange={handleChange} defaultValue="">
                  <option value="" disabled>Seleccione</option><option value="Muy Bueno">Muy Bueno</option><option value="Bueno">Bueno</option><option value="Regular">Regular</option><option value="Malo">Malo</option><option value="Muy Malo">Muy Malo</option>
              </select>
          </label>
      </Fieldset>

      {/* SECTION 6: ANTROPOMETRÍA */}
      <Fieldset title="6. Parámetros Antropométricos">
        <label className={commonLabelClasses}>Peso actual (kg): <input type="number" step="0.1" name="peso_actual" className={commonInputClasses} onChange={handleChange} /></label>
        <label className={commonLabelClasses}>Estatura (cm): <input type="number" step="0.1" name="estatura_actual" className={commonInputClasses} onChange={handleChange} /></label>
        <label className={commonLabelClasses}>Circunferencia de cintura (cm): <input type="number" step="0.1" name="cintura" className={commonInputClasses} onChange={handleChange} /></label>
        <label className={commonLabelClasses}>Circunferencia de cadera (cm): <input type="number" step="0.1" name="cadera" className={commonInputClasses} onChange={handleChange} /></label>
        <label className={commonLabelClasses}>Índice de Masa Corporal (IMC): <input type="number" step="0.1" name="imc" className={`${commonInputClasses} bg-slate-100`} value={formData.imc || ''} readOnly /></label>
        <button type="button" onClick={calculateIMC} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition">Calcular IMC</button>
        <label className={`${commonLabelClasses} mt-4`}>Peso ideal o meta (si aplica): <input type="number" step="0.1" name="peso_ideal" className={commonInputClasses} onChange={handleChange} /></label>
      </Fieldset>

      {/* SECTION 7: REVISIÓN POR SISTEMAS */}
      <Fieldset title="7. Revisión por Sistemas">
          <h4 className="font-semibold text-lg text-slate-700 mb-2">Sistema Cardiovascular</h4>
          <div className={checkboxGroupClasses}>
              <label className="flex items-center gap-2"><input type="checkbox" name="cardio_sintomas[]" value="Dolor torácico" onChange={handleChange} /> Dolor torácico</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="cardio_sintomas[]" value="Palpitaciones" onChange={handleChange} /> Palpitaciones</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="cardio_sintomas[]" value="Presión alta" onChange={handleChange} /> Presión alta (HTA)</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="cardio_sintomas[]" value="Edema en piernas" onChange={handleChange} /> Edema en piernas</label>
          </div>
          <h4 className="font-semibold text-lg text-slate-700 mt-6 mb-2">Sistema Respiratorio</h4>
          <div className={checkboxGroupClasses}>
              <label className="flex items-center gap-2"><input type="checkbox" name="resp_sintomas[]" value="Tos" onChange={handleChange} /> Tos</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="resp_sintomas[]" value="Disnea" onChange={handleChange} /> Disnea (falta de aire)</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="resp_sintomas[]" value="Sibilancias" onChange={handleChange} /> Sibilancias</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="resp_sintomas[]" value="Asma diagnosticada" onChange={handleChange} /> Asma diagnosticada</label>
          </div>
          <h4 className="font-semibold text-lg text-slate-700 mt-6 mb-2">Sistema Digestivo</h4>
          <div className={checkboxGroupClasses}>
              <label className="flex items-center gap-2"><input type="checkbox" name="digest_sintomas[]" value="Dolor abdominal" onChange={handleChange} /> Dolor abdominal</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="digest_sintomas[]" value="Diarrea" onChange={handleChange} /> Diarrea</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="digest_sintomas[]" value="Estreñimiento" onChange={handleChange} /> Estreñimiento</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="digest_sintomas[]" value="Reflujo ácido" onChange={handleChange} /> Reflujo ácido</label>
          </div>
          <h4 className="font-semibold text-lg text-slate-700 mt-6 mb-2">Ginecología / Obstetricia</h4>
          <label className={commonLabelClasses}>Número de hijos: <input type="number" name="num_hijos" min="0" step="1" className={commonInputClasses} onChange={handleChange} /></label>
          <label className={commonLabelClasses}>Partos: <input type="number" name="partos" min="0" step="1" className={commonInputClasses} onChange={handleChange} /></label>
          <label className={commonLabelClasses}>Cesáreas: <input type="number" name="cesareas" min="0" step="1" className={commonInputClasses} onChange={handleChange} /></label>
          <label className={commonLabelClasses}>¿Menopausia?: <input type="text" name="menopausia" placeholder="Ej: 50 años, no aplica" className={commonInputClasses} onChange={handleChange} /></label>
           <h4 className="font-semibold text-lg text-slate-700 mt-6 mb-2">Salud Sexual (Hombres)</h4>
          <label className={commonLabelClasses}>¿Disfunción eréctil?:
              <select name="disfuncion_erectil" className={commonInputClasses} onChange={handleChange} defaultValue="">
                  <option value="" disabled>Seleccione</option><option value="No">No</option><option value="Sí">Sí</option><option value="No aplica">No aplica</option>
              </select>
          </label>
           <h4 className="font-semibold text-lg text-slate-700 mt-6 mb-2">Otros Síntomas</h4>
          <label className={commonLabelClasses}>Describa otros síntomas o información adicional: <textarea name="otros_sintomas" className={commonInputClasses} onChange={handleChange}></textarea></label>
      </Fieldset>

      {/* SECTION 8: LABORATORIO */}
      <Fieldset title="8. Datos de Laboratorio Clínico">
          <label className="flex items-center gap-2 mb-4"><input type="checkbox" onChange={(e) => setLabsDisabled(e.target.checked)} /> No dispongo de datos de laboratorio</label>
          <label className={commonLabelClasses}>Glucosa en ayunas (mg/dL): <input type="number" step="0.1" name="glucosa" disabled={labsDisabled} className={`${commonInputClasses} disabled:bg-slate-200`} onChange={handleChange} /></label>
          <label className={commonLabelClasses}>Hemoglobina Glicada (HbA1c) (%): <input type="number" step="0.1" name="hbA1c" disabled={labsDisabled} className={`${commonInputClasses} disabled:bg-slate-200`} onChange={handleChange} /></label>
          <label className={commonLabelClasses}>Colesterol Total (mg/dL): <input type="number" step="0.1" name="colesterol_total" disabled={labsDisabled} className={`${commonInputClasses} disabled:bg-slate-200`} onChange={handleChange} /></label>
          <label className={commonLabelClasses}>Colesterol LDL (mg/dL): <input type="number" step="0.1" name="colesterol_ldl" disabled={labsDisabled} className={`${commonInputClasses} disabled:bg-slate-200`} onChange={handleChange} /></label>
          <label className={commonLabelClasses}>Colesterol HDL (mg/dL): <input type="number" step="0.1" name="colesterol_hdl" disabled={labsDisabled} className={`${commonInputClasses} disabled:bg-slate-200`} onChange={handleChange} /></label>
          <label className={commonLabelClasses}>Triglicéridos (mg/dL): <input type="number" step="0.1" name="trigliceridos" disabled={labsDisabled} className={`${commonInputClasses} disabled:bg-slate-200`} onChange={handleChange} /></label>
          <label className={commonLabelClasses}>Otros Resultados: <textarea name="otros_lab" disabled={labsDisabled} className={`${commonInputClasses} disabled:bg-slate-200`} onChange={handleChange}></textarea></label>
      </Fieldset>
      
      {/* SECTION 9: EXPECTATIVAS */}
      <Fieldset title="9. Expectativas y Objetivos">
          <label className={commonLabelClasses}>¿Qué espera conseguir con la consulta? <textarea name="objetivos_paciente" placeholder="Metas a corto, mediano o largo plazo..." className={commonInputClasses} onChange={handleChange}></textarea></label>
      </Fieldset>

      {/* SECTION 10: OBSERVACIONES */}
      <Fieldset title="10. Observaciones Adicionales">
           <label className={commonLabelClasses}>¿Algo más que desee mencionar?: <textarea name="observaciones_adicionales" className={commonInputClasses} onChange={handleChange}></textarea></label>
      </Fieldset>

      {/* FIRMA Y ENVÍO */}
      <hr className="my-8 border-gray-200"/>
      <Fieldset title="Firma">
        <label className={commonLabelClasses}>Firma del Paciente: <input type="text" name="firma_paciente" required placeholder="Nombre o firma digital" className={commonInputClasses} onChange={handleChange} /></label>
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

export default AdultForm;
