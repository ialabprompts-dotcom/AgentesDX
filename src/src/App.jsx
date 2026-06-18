import React, { useState, useEffect, useRef } from 'react';

const Icons = {
  Check: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  ArrowRight: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  ),
  ArrowLeft: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  ),
  Clock: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Sparkles: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  TrendUp: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  Zap: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  Users: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Lock: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  ),
  ChartPie: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
    </svg>
  ),
  Database: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    </svg>
  )
};

export default function App() {
  const [activeStep, setActiveStep] = useState(1);
  const [subStep, setSubStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leadsDb, setLeadsDb] = useState([]);

  // Intenta leer la URL de Google Sheets desde las Variables de Entorno de Vercel
  const sheetsWebhookUrl = import.meta.env.VITE_PUBLIC_SHEETS_URL || '';

  useEffect(() => {
    const savedLeads = localStorage.getItem('agentesdx_leads');
    if (savedLeads) setLeadsDb(JSON.parse(savedLeads));
  }, []);

  const [formData, setFormData] = useState({
    nombre: '', email: '', whatsapp: '', empresa: '', cargo: '', sitioWeb: '', tamanoEmpresa: '2 a 10 empleados',
    tipoNegocio: 'Servicios profesionales', problemaPrincipal: '', tareasRepetitivas: '',
    perdidaTiempo: [], captacionLeads: [], seguimientoLeads: 'Excel', herramientasActuales: '',
    reportesFaltantes: '', procesoPrioritario: '', resultadoEsperado: 'Más ventas'
  });

  const [formErrors, setFormErrors] = useState({});
  const formRef = useRef(null);

  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleCheckboxChange = (category, value) => {
    setFormData(prev => {
      const current = prev[category] || [];
      const updated = current.includes(value) ? current.filter(item => item !== value) : [...current, value];
      return { ...prev, [category]: updated };
    });
  };

  const validateStep1 = () => {
    const errors = {};
    if (!formData.nombre.trim()) errors.nombre = 'El nombre completo es requerido';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Introduce un email corporativo válido';
    if (!formData.whatsapp.trim()) errors.whatsapp = 'El número de WhatsApp es requerido';
    if (!formData.empresa.trim()) errors.empresa = 'El nombre de la empresa es requerido';
    if (!formData.cargo.trim()) errors.cargo = 'Tu cargo o puesto es requerido';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep1 = (e) => {
    e.preventDefault();
    if (validateStep1()) {
      setActiveStep(2);
      setSubStep(1);
      scrollToForm();
    }
  };

  const handleNextSubStep = () => {
    if (subStep < 10) {
      setSubStep(prev => prev + 1);
      scrollToForm();
    } else {
      handleSubmitDiagnostic();
    }
  };

  const handleSubmitDiagnostic = async () => {
    setIsSubmitting(true);
    const timestamp = new Date().toLocaleString('es-ES', { timeZone: 'UTC' });
    const fullPayload = {
      fecha: timestamp,
      ...formData,
      perdidaTiempo: formData.perdidaTiempo.join(', '),
      captacionLeads: formData.captacionLeads.join(', ')
    };

    const updatedDb = [fullPayload, ...leadsDb];
    setLeadsDb(updatedDb);
    localStorage.setItem('agentesdx_leads', JSON.stringify(updatedDb));

    if (sheetsWebhookUrl) {
      try {
        await fetch(sheetsWebhookUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fullPayload)
        });
      } catch (err) {
        console.error("Error enviando datos:", err);
      }
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setActiveStep(3);
      scrollToForm();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans overflow-x-hidden antialiased">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(139,92,246,0.05),transparent_50%)] pointer-events-none" />

      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-slate-950/70 backdrop-blur-md border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-extrabold text-xl">A</span>
            </div>
            <div>
              <span className="font-bold text-lg sm:text-xl text-white">AGENTES<span className="text-blue-500">DX</span></span>
            </div>
          </div>
          <button onClick={scrollToForm} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg text-xs sm:text-sm font-bold text-white">
            Iniciar Diagnóstico
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-20 px-4 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 mb-8 text-xs text-slate-300">
          <span className="text-blue-400">✓ Diagnóstico gratuito</span>
          <span className="text-violet-400">✓ Menos de 3 minutos</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-6 leading-tight">
          Tu negocio no necesita <br />
          <span className="bg-gradient-to-r from-blue-400 to-violet-500 bg-clip-text text-transparent">más herramientas.</span><br />
          Necesita procesos que funcionen.
        </h1>
        <p className="max-w-2xl mx-auto text-slate-400 text-sm sm:text-base mb-8">
          Identificamos dónde estás perdiendo tiempo, clientes y oportunidades para ayudarte a automatizar lo que realmente importa.
        </p>
        <button onClick={scrollToForm} className="px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl font-bold text-white shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5">
          Iniciar Diagnóstico Gratuito →
        </button>
      </section>

      {/* SECCIÓN PROBLEMAS */}
      <section id="problemas" className="py-16 max-w-7xl mx-auto px-4 border-t border-slate-900">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">¿Te sucede alguna de estas situaciones?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { t: "Los clientes escriben y nadie responde rápido.", i: "📞" },
            { t: "El seguimiento se hace manualmente.", i: "📋" },
            { t: "La información está dispersa.", i: "📊" },
            { t: "Tu equipo pierde tiempo en tareas repetitivas.", i: "⏰" },
            { t: "Se pierden oportunidades de venta.", i: "📈" },
            { t: "Los procesos dependen demasiado de personas.", i: "🔄" }
          ].map((c, idx) => (
            <div key={idx} className="p-6 rounded-xl bg-slate-900/40 border border-slate-850">
              <span className="text-2xl mb-3 block">{c.i}</span>
              <p className="text-sm text-slate-300 font-medium">{c.t}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECCIÓN BENEFICIOS */}
      <section id="beneficios" className="py-16 max-w-7xl mx-auto px-4 border-t border-slate-900">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">Lo que puedes lograr</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          {[
            { title: "Más clientes atendidos", desc: "Automatiza respuestas y seguimiento.", icon: <Icons.Users /> },
            { title: "Más productividad", desc: "Reduce tareas manuales y repetitivas.", icon: <Icons.Zap /> },
            { title: "Más control", desc: "Obtén visibilidad sobre procesos y resultados.", icon: <Icons.ChartPie /> },
            { title: "Más ventas", desc: "Aprovecha cada oportunidad comercial.", icon: <Icons.TrendUp /> }
          ].map((b, idx) => (
            <div key={idx} className="p-6 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-blue-400 mb-4">{b.icon}</div>
              <h3 className="font-bold text-white text-base mb-1">{b.title}</h3>
              <p className="text-xs text-slate-400">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FORMULARIO MULTIPASO */}
      <section id="diagnostico" ref={formRef} className="py-16 max-w-3xl mx-auto px-4 border-t border-slate-900">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Auditoría Gratuita de Procesos y Ventas</h2>
          <p className="text-xs text-slate-400 mt-1">Responde estas preguntas y detectaremos oportunidades para mejorar.</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 relative min-h-[350px]">
          {isSubmitting && (
            <div className="absolute inset-0 bg-slate-950/90 rounded-2xl flex flex-col items-center justify-center text-center p-4">
              <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin mb-4" />
              <h3 className="font-bold text-white">Procesando Diagnóstico...</h3>
            </div>
          )}

          {activeStep === 1 && (
            <form onSubmit={handleNextStep1} className="space-y-4 text-left">
              <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider">Paso 1 — Datos Básicos</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Nombre completo*</label>
                  <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200" required />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Email*</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200" required />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">WhatsApp*</label>
                  <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200" required />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Empresa*</label>
                  <input type="text" name="empresa" value={formData.empresa} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200" required />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Cargo*</label>
                  <input type="text" name="cargo" value={formData.cargo} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200" required />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Sitio web</label>
                  <input type="url" name="sitioWeb" value={formData.sitioWeb} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-2">Tamaño de empresa</label>
                <select name="tamanoEmpresa" value={formData.tamanoEmpresa} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200">
                  {['Solo yo', '2 a 10 empleados', '11 a 50 empleados', '51 a 200 empleados', 'Más de 200 empleados'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full py-3 bg-blue-600 rounded-xl font-bold text-xs mt-4">Continuar</button>
            </form>
          )}

          {activeStep === 2 && (
            <div className="space-y-4 text-left">
              <span className="text-[10px] font-mono text-violet-400 block">Pregunta {subStep} de 10</span>
              
              {subStep === 1 && (
                <div>
                  <h3 className="text-sm font-bold text-white mb-3">¿Qué tipo de negocio tienes?</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {['Servicios profesionales', 'Agencia', 'Ecommerce', 'SaaS', 'Retail', 'Manufactura', 'Educación', 'Salud', 'Inmobiliaria', 'Otro'].map(o => (
                      <button key={o} onClick={() => setFormData(p=>({...p, tipoNegocio: o}))} className={`p-3 rounded-lg border text-xs text-left ${formData.tipoNegocio === o ? 'border-blue-500 bg-blue-500/10' : 'border-slate-800 bg-slate-950'}`}>{o}</button>
                    ))}
                  </div>
                </div>
              )}

              {subStep === 2 && (
                <div>
                  <h3 className="text-sm font-bold text-white mb-2">¿Cuál es tu principal problema operativo o comercial?</h3>
                  <textarea name="problemaPrincipal" value={formData.problemaPrincipal} onChange={handleInputChange} rows={4} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 resize-none" />
                </div>
              )}

              {subStep === 3 && (
                <div>
                  <h3 className="text-sm font-bold text-white mb-2">¿Qué tareas repites todas las semanas?</h3>
                  <textarea name="tareasRepetitivas" value={formData.tareasRepetitivas} onChange={handleInputChange} rows={4} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 resize-none" />
                </div>
              )}

              {subStep === 4 && (
                <div>
                  <h3 className="text-sm font-bold text-white mb-3">¿Dónde pierdes más tiempo?</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {['Seguimiento de clientes', 'Ventas', 'Reportes', 'Operaciones', 'Atención al cliente', 'Administración', 'Otro'].map(i => (
                      <button key={i} onClick={() => handleCheckboxChange('perdidaTiempo', i)} className={`p-3 rounded-lg border text-xs text-left flex justify-between ${formData.perdidaTiempo.includes(i) ? 'border-blue-500 bg-blue-500/10' : 'border-slate-800 bg-slate-950'}`}>{i}</button>
                    ))}
                  </div>
                </div>
              )}

              {subStep === 5 && (
                <div>
                  <h3 className="text-sm font-bold text-white mb-3">¿Cómo captas leads actualmente?</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {['Referidos', 'Redes sociales', 'Google Ads', 'Meta Ads', 'LinkedIn', 'SEO', 'Email marketing', 'Eventos', 'Otro'].map(i => (
                      <button key={i} onClick={() => handleCheckboxChange('captacionLeads', i)} className={`p-3 rounded-lg border text-xs text-left ${formData.captacionLeads.includes(i) ? 'border-blue-500 bg-blue-500/10' : 'border-slate-800 bg-slate-950'}`}>{i}</button>
                    ))}
                  </div>
                </div>
              )}

              {subStep === 6 && (
                <div>
                  <h3 className="text-sm font-bold text-white mb-3">¿Cómo haces seguimiento a esos leads?</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {['Excel', 'WhatsApp', 'CRM', 'Email', 'No tengo proceso definido', 'Otro'].map(o => (
                      <button key={o} onClick={() => setFormData(p=>({...p, seguimientoLeads: o}))} className={`p-3 rounded-lg border text-xs text-left ${formData.seguimientoLeads === o ? 'border-blue-500 bg-blue-500/10' : 'border-slate-800 bg-slate-950'}`}>{o}</button>
                    ))}
                  </div>
                </div>
              )}

              {subStep === 7 && (
                <div>
                  <h3 className="text-sm font-bold text-white mb-2">¿Qué herramientas utilizas actualmente?</h3>
                  <textarea name="herramientasActuales" value={formData.herramientasActuales} onChange={handleInputChange} rows={4} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 resize-none" />
                </div>
              )}

              {subStep === 8 && (
                <div>
                  <h3 className="text-sm font-bold text-white mb-2">¿Qué reportes necesitas pero no tienes?</h3>
                  <textarea name="reportesFaltantes" value={formData.reportesFaltantes} onChange={handleInputChange} rows={4} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 resize-none" />
                </div>
              )}

              {subStep === 9 && (
                <div>
                  <h3 className="text-sm font-bold text-white mb-2">¿Qué proceso te gustaría automatizar primero?</h3>
                  <textarea name="procesoPrioritario" value={formData.procesoPrioritario} onChange={handleInputChange} rows={4} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 resize-none" />
                </div>
              )}

              {subStep === 10 && (
                <div>
                  <h3 className="text-sm font-bold text-white mb-3">¿Qué resultado esperas lograr en los próximos 30 a 90 días?</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {['Más leads', 'Más ventas', 'Ahorrar tiempo', 'Reducir costos', 'Mejor seguimiento', 'Mejor atención al cliente', 'Automatizar procesos', 'Otro'].map(o => (
                      <button key={o} onClick={() => setFormData(p=>({...p, resultadoEsperado: o}))} className={`p-3 rounded-lg border text-xs text-left ${formData.resultadoEsperado === o ? 'border-blue-500 bg-blue-500/10' : 'border-slate-800 bg-slate-950'}`}>{o}</button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-slate-800 mt-6">
                <button onClick={() => subStep > 1 ? setSubStep(p=>p-1) : setActiveStep(1)} className="text-xs text-slate-400 hover:text-white font-medium">← Atrás</button>
                <button onClick={handleNextSubStep} className="px-6 py-2.5 bg-blue-600 rounded-lg text-xs font-bold text-white">{subStep === 10 ? 'Enviar Diagnóstico' : 'Siguiente'}</button>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="text-center p-4 space-y-4">
              <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto text-xl">✓</div>
              <h3 className="text-xl font-bold">¡Diagnóstico Enviado!</h3>
              <p className="text-xs text-slate-400">Hemos procesado tu información. Un consultor técnico de AGENTESDX se pondrá en contacto contigo.</p>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 text-left space-y-2">
                <p className="text-xs font-bold text-blue-400">Pre-Análisis del Sistema:</p>
                <p className="text-[11px] text-slate-300">Estimamos fugas operativas en su seguimiento vía "{formData.seguimientoLeads}". Optimizaremos su prioridad de "{formData.resultadoEsperado}" delegando flujos mecánicos.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SECCIÓN RESULTADOS */}
      <section id="resultados" className="py-16 max-w-7xl mx-auto px-4 border-t border-slate-900">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">¿Qué recibirás después?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          {["Diagnóstico personalizado", "Oportunidades de automatización", "Recomendaciones prácticas", "Próximos pasos sugeridos", "Identificación de cuellos de botella"].map((r, i) => (
            <div key={i} className="p-4 bg-slate-900 border border-slate-850 rounded-xl flex items-center gap-3">
              <span className="text-blue-500 font-bold">✓</span>
              <span className="text-sm font-medium text-slate-200">{r}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 text-center max-w-4xl mx-auto px-4 border-t border-slate-900">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Descubre qué tareas puede hacer la IA por tu negocio mientras tú te enfocas en crecer.</h2>
        <button onClick={scrollToForm} className="px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl font-bold text-white mt-4 shadow-xl">
          Solicitar Diagnóstico Gratuito
        </button>
      </section>
    </div>
  );
}
