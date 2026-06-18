import React, { useState, useEffect, useRef } from 'react';

// === CONFIGURACIÓN DE ICONOS SVG PREMIUM ===
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
  // === ESTADOS GLOBAL ===
  const [activeStep, setActiveStep] = useState(1); // 1: Datos básicos, 2: Diagnóstico técnico, 3: Éxito/Resultado
  const [subStep, setSubStep] = useState(1); // Subpasos dentro de la fase 2 (1 a 10)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  
  // URL de Webhook de Google Sheets (El usuario puede cambiarla dinámicamente)
  const [sheetsWebhookUrl, setSheetsWebhookUrl] = useState('');
  const [showIntegrationGuide, setShowIntegrationGuide] = useState(false);
  const [testModeEnabled, setTestModeEnabled] = useState(true);
  const [leadsDb, setLeadsDb] = useState([]);

  // Cargar datos de localStorage para simular persistencia
  useEffect(() => {
    const savedLeads = localStorage.getItem('agentesdx_leads');
    if (savedLeads) {
      setLeadsDb(JSON.parse(savedLeads));
    }
  }, []);

  // === RESPUESTAS DEL FORMULARIO ===
  const [formData, setFormData] = useState({
    // Paso 1: Datos Básicos
    nombre: '',
    email: '',
    whatsapp: '',
    empresa: '',
    cargo: '',
    sitioWeb: '',
    tamanoEmpresa: '2 a 10 empleados',

    // Paso 2: Diagnóstico
    tipoNegocio: 'Servicios profesionales',
    problemaPrincipal: '',
    tareasRepetitivas: '',
    perdidaTiempo: [], // Multiselect Checkbox
    captacionLeads: [], // Multiselect Checkbox
    seguimientoLeads: 'Excel',
    herramientasActuales: '',
    reportesFaltantes: '',
    procesoPrioritario: '',
    resultadoEsperado: 'Más ventas'
  });

  const [formErrors, setFormErrors] = useState({});

  // Referencia para scroll automático
  const formRef = useRef(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // === MANEJADORES DE INPUTS ===
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleCheckboxChange = (category, value) => {
    setFormData(prev => {
      const current = prev[category] || [];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
  };

  const selectSingleOption = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // === VALIDACIÓN DEL PASO 1 ===
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

  // === NAVEGACIÓN FORMULARIO ===
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

  const handlePrevSubStep = () => {
    if (subStep > 1) {
      setSubStep(prev => prev - 1);
    } else {
      setActiveStep(1);
    }
    scrollToForm();
  };

  // === ENVÍO DEL DIAGNÓSTICO ===
  const handleSubmitDiagnostic = async () => {
    setIsSubmitting(true);
    
    const timestamp = new Date().toLocaleString('es-ES', { timeZone: 'UTC' });
    const fullPayload = {
      fecha: timestamp,
      ...formData,
      // Convertir arrays a strings limpios para Google Sheets
      perdidaTiempo: formData.perdidaTiempo.join(', '),
      captacionLeads: formData.captacionLeads.join(', ')
    };

    // 1. Guardar en Base de Datos local simulada (LocalStorage)
    const updatedDb = [fullPayload, ...leadsDb];
    setLeadsDb(updatedDb);
    localStorage.setItem('agentesdx_leads', JSON.stringify(updatedDb));

    // 2. Intentar disparar webhook real si el usuario configuró uno
    if (sheetsWebhookUrl) {
      try {
        await fetch(sheetsWebhookUrl, {
          method: 'POST',
          mode: 'no-cors', // Evita problemas de CORS habituales con scripts de Google
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(fullPayload)
        });
      } catch (err) {
        console.error("Error enviando webhook real:", err);
      }
    }

    // 3. Simular procesamiento premium de IA
    setTimeout(() => {
      setIsSubmitting(false);
      setActiveStep(3);
      scrollToForm();
    }, 2500);
  };

  // === REINICIAR FORMULARIO ===
  const resetForm = () => {
    setFormData({
      nombre: '',
      email: '',
      whatsapp: '',
      empresa: '',
      cargo: '',
      sitioWeb: '',
      tamanoEmpresa: '2 a 10 empleados',
      tipoNegocio: 'Servicios profesionales',
      problemaPrincipal: '',
      tareasRepetitivas: '',
      perdidaTiempo: [],
      captacionLeads: [],
      seguimientoLeads: 'Excel',
      herramientasActuales: '',
      reportesFaltantes: '',
      procesoPrioritario: '',
      resultadoEsperado: 'Más ventas'
    });
    setFormErrors({});
    setActiveStep(1);
    setSubStep(1);
  };

  // Copiar código de Google Sheets
  const copyToClipboard = (text, index) => {
    const dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Código Apps Script sugerido para conectar a Google Sheets de manera infalible
  const appsScriptCode = `function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  try {
    var data = JSON.parse(e.postData.contents);
    sheet.appendRow([
      data.fecha,
      data.nombre,
      data.email,
      data.whatsapp,
      data.empresa,
      data.cargo,
      data.sitioWeb,
      data.tamanoEmpresa,
      data.tipoNegocio,
      data.problemaPrincipal,
      data.tareasRepetitivas,
      data.perdidaTiempo,
      data.captacionLeads,
      data.seguimientoLeads,
      data.herramientasActuales,
      data.reportesFaltantes,
      data.procesoPrioritario,
      data.resultadoEsperado
    ]);
    return ContentService.createTextOutput(JSON.stringify({"status":"success"})).setMimeType(ContentService.MimeType.JSON);
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({"status":"error", "error": error.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden antialiased">
      
      {/* CAPA DE FONDO ESTILO STRIPE / LINEAR */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(139,92,246,0.05),transparent_50%)] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-slate-800 to-transparent pointer-events-none" />

      {/* HEADER / NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-slate-950/70 backdrop-blur-md border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          
          {/* LOGO */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/10">
              <span className="text-white font-extrabold text-xl tracking-tighter">A</span>
            </div>
            <div>
              <span className="font-bold text-lg sm:text-xl tracking-tight text-white">AGENTES<span className="text-blue-500">DX</span></span>
              <p className="text-[10px] text-slate-400 font-mono tracking-widest -mt-1 uppercase">Sistemas de IA</p>
            </div>
          </div>

          {/* MENÚ DE ACCESO RÁPIDO */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-400">
            <a href="#problemas" className="hover:text-white transition-colors">¿Te pasa esto?</a>
            <a href="#beneficios" className="hover:text-white transition-colors">Beneficios</a>
            <a href="#diagnostico" className="hover:text-white transition-colors">Auditoría Gratuita</a>
            <a href="#resultados" className="hover:text-white transition-colors">¿Qué recibirás?</a>
          </nav>

          {/* BOTÓN HEADER */}
          <button 
            onClick={scrollToForm}
            className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-xs sm:text-sm font-medium rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white text-white focus:ring-4 focus:outline-none focus:ring-blue-800 mt-2"
          >
            <span className="relative px-3 sm:px-5 py-2 transition-all ease-in duration-75 bg-slate-950 rounded-md group-hover:bg-opacity-0 font-bold">
              Iniciar Diagnóstico
            </span>
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 sm:pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          
          {/* BADGES SUPERIORES */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 backdrop-blur-sm mb-6 sm:mb-8 text-xs text-slate-300 font-medium">
            <span className="flex items-center gap-1.5 text-blue-400">
              <Icons.Check className="w-3.5 h-3.5" /> Diagnóstico gratuito
            </span>
            <span className="h-3 w-[1px] bg-slate-800 hidden sm:inline" />
            <span className="flex items-center gap-1.5 text-violet-400">
              <Icons.Clock className="w-3.5 h-3.5" /> Menos de 3 minutos
            </span>
            <span className="h-3 w-[1px] bg-slate-800 hidden sm:inline" />
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Icons.Sparkles className="w-3.5 h-3.5" /> Sin compromiso
            </span>
          </div>

          {/* TÍTULO PRINCIPAL CON GRADIENTE */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-none">
            Tu negocio no necesita <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-500 bg-clip-text text-transparent">
              más herramientas.
            </span>
            <br className="hidden sm:block" />
            <span className="text-slate-100">Necesita procesos que funcionen.</span>
          </h1>

          {/* SUBTÍTULO */}
          <p className="max-w-3xl mx-auto text-base sm:text-xl text-slate-400 mb-8 sm:mb-10 leading-relaxed">
            Identificamos dónde estás perdiendo tiempo, clientes y oportunidades para ayudarte a automatizar lo que realmente importa en tu operativa.
          </p>

          {/* BOTONES ACCIÓN */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={scrollToForm}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/25 hover:opacity-95 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group text-base"
            >
              Iniciar Diagnóstico Gratuito
              <Icons.ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#problemas"
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-850 text-slate-200 hover:text-white rounded-xl font-medium border border-slate-850 hover:border-slate-800 transition-all flex items-center justify-center gap-2 text-base"
            >
              Ver Cómo Funciona
            </a>
          </div>

          {/* MOCK DE PLATAFORMA INTEGRADA */}
          <div className="relative mx-auto max-w-4xl rounded-2xl border border-slate-800 bg-slate-900/20 p-2 sm:p-4 backdrop-blur-sm shadow-2xl">
            <div className="absolute -inset-[1px] bg-gradient-to-r from-blue-500/30 via-violet-500/10 to-transparent rounded-2xl -z-10 blur-xl opacity-70" />
            
            {/* Barra superior de ventana */}
            <div className="flex items-center justify-between px-3 pb-3 border-b border-slate-800/60 mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <span className="text-[11px] font-mono text-slate-500">agentesdx-dashboard-ia.sh</span>
              <div className="w-12 h-1" />
            </div>

            {/* Simulación de procesos automatizados */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
              <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800/80">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-slate-400 font-medium">Auto-captura de Leads</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">Activo</span>
                </div>
                <p className="text-2xl font-bold text-white">4,812</p>
                <div className="w-full bg-slate-900 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-blue-500 h-full w-[82%]" />
                </div>
                <p className="text-[10px] text-slate-500 mt-2">✓ 0 fugas de prospectos en Meta Ads</p>
              </div>

              <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800/80">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-slate-400 font-medium">Seguimiento por WhatsApp</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-violet-500/10 text-violet-400 border border-violet-500/20">Corriendo</span>
                </div>
                <p className="text-2xl font-bold text-white">99.4%</p>
                <div className="w-full bg-slate-900 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-violet-500 h-full w-[99%]" />
                </div>
                <p className="text-[10px] text-slate-500 mt-2">✓ Tiempo de respuesta &lt; 1 min</p>
              </div>

              <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800/80">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-slate-400 font-medium">Productividad & Tiempo</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Optimizado</span>
                </div>
                <p className="text-2xl font-bold text-white">-18h /sem</p>
                <div className="w-full bg-slate-900 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[70%]" />
                </div>
                <p className="text-[10px] text-slate-500 mt-2">✓ Tareas repetitivas delegadas a IA</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECCIÓN PROBLEMAS */}
      <section id="problemas" className="py-20 bg-slate-950 border-t border-slate-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
              ¿Te sucede alguna de estas situaciones?
            </h2>
            <p className="text-slate-400">
              Mantener un negocio escalable es imposible si tu equipo sigue perdiendo tiempo en tareas que un sistema moderno de automatización e IA debería hacer en segundos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-white/[0.01] border border-slate-900 hover:border-blue-500/30 hover:bg-slate-900/10 transition-all duration-300 group">
              <span className="text-3xl block mb-4">📞</span>
              <h3 className="text-lg font-bold text-slate-200 group-hover:text-white mb-2 transition-colors">
                Los clientes escriben y nadie responde rápido
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Tus prospectos pierden el interés a los pocos minutos de contactarte si no obtienen respuestas inmediatas.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-white/[0.01] border border-slate-900 hover:border-blue-500/30 hover:bg-slate-900/10 transition-all duration-300 group">
              <span className="text-3xl block mb-4">📋</span>
              <h3 className="text-lg font-bold text-slate-200 group-hover:text-white mb-2 transition-colors">
                El seguimiento se hace manualmente
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Depender de que una persona recuerde agendar y escribir de vuelta provoca olvidos y pérdidas de ventas críticas.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-white/[0.01] border border-slate-900 hover:border-blue-500/30 hover:bg-slate-900/10 transition-all duration-300 group">
              <span className="text-3xl block mb-4">📊</span>
              <h3 className="text-lg font-bold text-slate-200 group-hover:text-white mb-2 transition-colors">
                La información está dispersa
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Tener datos guardados en chats de WhatsApp, Exceles aislados y libretas te impide tomar decisiones estratégicas fundamentadas.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-2xl bg-white/[0.01] border border-slate-900 hover:border-violet-500/30 hover:bg-slate-900/10 transition-all duration-300 group">
              <span className="text-3xl block mb-4">⏰</span>
              <h3 className="text-lg font-bold text-slate-200 group-hover:text-white mb-2 transition-colors">
                Equipo perdiendo tiempo en tareas repetitivas
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Cargar leads a mano, copiar y pegar los mismos mensajes de bienvenida o crear reportes drena el potencial humano de tu empresa.
              </p>
            </div>

            {/* Card 5 */}
            <div className="p-6 rounded-2xl bg-white/[0.01] border border-slate-900 hover:border-violet-500/30 hover:bg-slate-900/10 transition-all duration-300 group">
              <span className="text-3xl block mb-4">📈</span>
              <h3 className="text-lg font-bold text-slate-200 group-hover:text-white mb-2 transition-colors">
                Se pierden oportunidades de venta constantemente
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Los leads fríos nunca se vuelven a contactar. Pierdes rentabilidad en tu inversión publicitaria por falta de insistencia automatizada.
              </p>
            </div>

            {/* Card 6 */}
            <div className="p-6 rounded-2xl bg-white/[0.01] border border-slate-900 hover:border-violet-500/30 hover:bg-slate-900/10 transition-all duration-300 group">
              <span className="text-3xl block mb-4">🔄</span>
              <h3 className="text-lg font-bold text-slate-200 group-hover:text-white mb-2 transition-colors">
                Los procesos dependen demasiado de personas
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Si tú o un colaborador clave se ausentan, las operaciones se detienen porque la lógica del negocio está en sus cabezas, no en un sistema.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* SECCIÓN BENEFICIOS */}
      <section id="beneficios" className="py-20 bg-slate-900/40 border-t border-slate-900 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.02),transparent_70%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
              Lo que puedes lograr con un sistema robusto
            </h2>
            <p className="text-slate-400">
              No nos enfocamos en vender "IA" como una palabra de moda. Construimos los engranajes automáticos que impulsan el crecimiento medible de tu empresa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Beneficio 1 */}
            <div className="relative p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between overflow-hidden group">
              <div className="absolute top-0 right-0 h-16 w-16 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/15 transition-all duration-300" />
              <div>
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6 border border-blue-500/20">
                  <Icons.Users />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Más clientes atendidos</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Automatiza respuestas instantáneas en WhatsApp, Instagram y mail para capturar leads 24/7 sin contratar más personal.
                </p>
              </div>
              <div className="border-t border-slate-900 mt-6 pt-4">
                <span className="text-xs font-mono text-slate-500">Mecanismo: Chatbots de contexto experto</span>
              </div>
            </div>

            {/* Beneficio 2 */}
            <div className="relative p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between overflow-hidden group">
              <div className="absolute top-0 right-0 h-16 w-16 bg-violet-500/5 rounded-full blur-xl group-hover:bg-violet-500/15 transition-all duration-300" />
              <div>
                <div className="h-12 w-12 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400 mb-6 border border-violet-500/20">
                  <Icons.Zap />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Más productividad</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Elimina las tareas administrativas repetitivas. Tu equipo se concentrará únicamente en cerrar negocios de alto valor.
                </p>
              </div>
              <div className="border-t border-slate-900 mt-6 pt-4">
                <span className="text-xs font-mono text-slate-500">Mecanismo: Integraciones API multiplataforma</span>
              </div>
            </div>

            {/* Beneficio 3 */}
            <div className="relative p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between overflow-hidden group">
              <div className="absolute top-0 right-0 h-16 w-16 bg-pink-500/5 rounded-full blur-xl group-hover:bg-pink-500/15 transition-all duration-300" />
              <div>
                <div className="h-12 w-12 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 mb-6 border border-pink-500/20">
                  <Icons.ChartPie />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Más control operativo</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Obtén visibilidad absoluta en tiempo real de tus ventas, respuestas y rendimiento a través de reportes autogenerados sin esfuerzo.
                </p>
              </div>
              <div className="border-t border-slate-900 mt-6 pt-4">
                <span className="text-xs font-mono text-slate-500">Mecanismo: Extracción automatizada de reportes</span>
              </div>
            </div>

            {/* Beneficio 4 */}
            <div className="relative p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between overflow-hidden group">
              <div className="absolute top-0 right-0 h-16 w-16 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/15 transition-all duration-300" />
              <div>
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6 border border-emerald-500/20">
                  <Icons.TrendUp />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Más ventas</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Nunca dejes enfriar a un cliente potencial. Nuestro sistema se encarga del seguimiento estratégico continuo de forma automática.
                </p>
              </div>
              <div className="border-t border-slate-900 mt-6 pt-4">
                <span className="text-xs font-mono text-slate-500">Mecanismo: Secuencias automatizadas de seguimiento</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECCIÓN DIAGNÓSTICO / FORMULARIO MULTIPASO */}
      <section id="diagnostico" ref={formRef} className="py-20 bg-slate-950 border-t border-slate-900 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 bg-blue-500/5 blur-3xl pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-wider text-blue-500 uppercase">Herramienta Interactiva</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-2 mb-4">
              Auditoría Gratuita de Procesos y Ventas
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
              Responde estas preguntas con sinceridad y nuestro sistema estructurará un análisis completo de tus cuellos de botella con sugerencias exactas de automatización.
            </p>
          </div>

          {/* CONTENEDOR PRINCIPAL DEL FORMULARIO */}
          <div className="relative bg-slate-900/40 border border-slate-800 rounded-3xl p-6 sm:p-10 backdrop-blur-md shadow-2xl overflow-hidden">
            
            {/* CONFIGURADOR DE WEBHOOK PARA PRUEBAS (Desplegable) */}
            <div className="mb-6 border-b border-slate-800 pb-6">
              <button 
                onClick={() => setShowIntegrationGuide(!showIntegrationGuide)}
                className="flex items-center justify-between w-full text-xs font-mono text-slate-400 hover:text-white transition-colors bg-slate-950/60 p-3 rounded-xl border border-slate-800/80"
              >
                <span className="flex items-center gap-2">
                  <Icons.Database className="w-4 h-4 text-violet-400" />
                  {sheetsWebhookUrl ? "✓ Google Sheets Conectado" : "⚡ Conecta esta Landing a tu Google Sheets (Opcional)"}
                </span>
                <span className="text-[10px] bg-slate-900 px-2 py-1 rounded text-slate-300">
                  {showIntegrationGuide ? "Ocultar" : "Configurar"}
                </span>
              </button>

              {showIntegrationGuide && (
                <div className="mt-4 p-4 bg-slate-950 rounded-xl border border-slate-850 text-xs text-slate-300 space-y-4 animate-fadeIn">
                  <p>
                    Puedes capturar las respuestas de esta landing directamente en una hoja de Google Sheets. Solo sigue estos pasos:
                  </p>
                  <ol className="list-decimal pl-5 space-y-2 text-slate-400">
                    <li>Crea un Google Sheet con las columnas del formulario.</li>
                    <li>Ve a <strong className="text-slate-200">Extensiones &gt; Apps Script</strong> y pega el código de abajo.</li>
                    <li>Haz clic en <strong className="text-slate-200">Implementar &gt; Nueva implementación</strong>, selecciona "Aplicación web", configúrala para que tenga acceso "Cualquiera" y copia la URL generada.</li>
                    <li>Pega esa URL aquí abajo para activarla en tiempo real.</li>
                  </ol>

                  {/* Input de URL de Google Apps Script */}
                  <div className="pt-2">
                    <label className="block text-slate-400 font-medium mb-1">Tu URL de Aplicación Web (Google Apps Script)</label>
                    <div className="flex gap-2">
                      <input 
                        type="url" 
                        placeholder="https://script.google.com/macros/s/.../exec"
                        value={sheetsWebhookUrl}
                        onChange={(e) => setSheetsWebhookUrl(e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-850 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 font-mono text-xs"
                      />
                      {sheetsWebhookUrl && (
                        <button 
                          onClick={() => setSheetsWebhookUrl('')}
                          className="px-3 py-2 bg-red-950/40 text-red-400 hover:bg-red-950 rounded-lg border border-red-900/50"
                        >
                          Desconectar
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Código para Copiar */}
                  <div className="relative">
                    <div className="flex justify-between items-center text-[10px] text-slate-500 mb-1">
                      <span>Código de Google Apps Script:</span>
                      <button 
                        onClick={() => copyToClipboard(appsScriptCode, 1)}
                        className="text-blue-400 hover:underline"
                      >
                        {copiedIndex === 1 ? '¡Copiado!' : 'Copiar Código'}
                      </button>
                    </div>
                    <pre className="p-3 bg-slate-900 rounded-lg overflow-x-auto text-[10px] text-slate-400 font-mono max-h-40">
                      {appsScriptCode}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* ESTADOS DE RENDIMIENTO Y LOADER */}
            {isSubmitting && (
              <div className="absolute inset-0 bg-slate-950/90 z-20 flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
                <div className="relative w-20 h-20 mb-6">
                  <div className="absolute inset-0 rounded-full border-4 border-slate-800" />
                  <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Procesando Diagnóstico...</h3>
                <p className="text-sm text-slate-400 max-w-sm">
                  Estamos analizando tus respuestas, buscando cuellos de botella e interactuando con tu configuración de almacenamiento para estructurar tus recomendaciones.
                </p>
              </div>
            )}

            {/* BARRA DE PROGRESO */}
            {activeStep <= 2 && (
              <div className="mb-8">
                <div className="flex justify-between items-center text-xs text-slate-400 font-mono mb-2">
                  <span>Progreso de Auditoría</span>
                  <span>
                    {activeStep === 1 ? 'Paso 1: Datos de Contacto' : `Paso 2: Diagnóstico Operativo (${subStep}/10)`}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-violet-600 transition-all duration-300"
                    style={{ 
                      width: activeStep === 1 
                        ? '15%' 
                        : `${15 + (subStep / 10) * 85}%` 
                    }}
                  />
                </div>
              </div>
            )}

            {/* ================= PASO 1: DATOS BÁSICOS ================= */}
            {activeStep === 1 && (
              <form onSubmit={handleNextStep1} className="space-y-6">
                <div className="text-left mb-6">
                  <h3 className="text-lg font-bold text-white">1. Datos Básicos del Negocio</h3>
                  <p className="text-xs text-slate-400">Permítenos conocerte para estructurar adecuadamente el perfil de tu sector empresarial.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  {/* Nombre */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Nombre Completo *</label>
                    <input 
                      type="text" 
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      placeholder="Ej. Juan Pérez"
                      className={`w-full bg-slate-950 border ${formErrors.nombre ? 'border-red-500' : 'border-slate-800'} rounded-xl px-4 py-3.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors`}
                    />
                    {formErrors.nombre && <p className="text-red-400 text-xs mt-1">{formErrors.nombre}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Email Corporativo *</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Ej. juan@empresa.com"
                      className={`w-full bg-slate-950 border ${formErrors.email ? 'border-red-500' : 'border-slate-800'} rounded-xl px-4 py-3.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors`}
                    />
                    {formErrors.email && <p className="text-red-400 text-xs mt-1">{formErrors.email}</p>}
                  </div>

                  {/* WhatsApp */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">WhatsApp Directo *</label>
                    <input 
                      type="tel" 
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      placeholder="Ej. +34 600 000 000"
                      className={`w-full bg-slate-950 border ${formErrors.whatsapp ? 'border-red-500' : 'border-slate-800'} rounded-xl px-4 py-3.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors`}
                    />
                    {formErrors.whatsapp && <p className="text-red-400 text-xs mt-1">{formErrors.whatsapp}</p>}
                  </div>

                  {/* Empresa */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Nombre de la Empresa *</label>
                    <input 
                      type="text" 
                      name="empresa"
                      value={formData.empresa}
                      onChange={handleInputChange}
                      placeholder="Ej. DX Solutions"
                      className={`w-full bg-slate-950 border ${formErrors.empresa ? 'border-red-500' : 'border-slate-800'} rounded-xl px-4 py-3.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors`}
                    />
                    {formErrors.empresa && <p className="text-red-400 text-xs mt-1">{formErrors.empresa}</p>}
                  </div>

                  {/* Cargo */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Tu Cargo o Rol *</label>
                    <input 
                      type="text" 
                      name="cargo"
                      value={formData.cargo}
                      onChange={handleInputChange}
                      placeholder="Ej. Director General / Fundador"
                      className={`w-full bg-slate-950 border ${formErrors.cargo ? 'border-red-500' : 'border-slate-800'} rounded-xl px-4 py-3.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors`}
                    />
                    {formErrors.cargo && <p className="text-red-400 text-xs mt-1">{formErrors.cargo}</p>}
                  </div>

                  {/* Sitio Web */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Sitio Web (Opcional)</label>
                    <input 
                      type="url" 
                      name="sitioWeb"
                      value={formData.sitioWeb}
                      onChange={handleInputChange}
                      placeholder="Ej. https://empresa.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Tamaño de Empresa */}
                <div className="text-left mt-6">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Tamaño de la Empresa</label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {['Solo yo', '2 a 10 empleados', '11 a 50 empleados', '51 a 200 empleados', 'Más de 200 empleados'].map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => selectSingleOption('tamanoEmpresa', size)}
                        className={`p-3 rounded-xl border text-xs font-medium transition-all text-center ${formData.tamanoEmpresa === size ? 'bg-blue-600/10 border-blue-500 text-white shadow-lg shadow-blue-500/5' : 'bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-700 hover:text-slate-200'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* BOTÓN SIGUIENTE */}
                <div className="pt-6 border-t border-slate-800 flex justify-end">
                  <button
                    type="submit"
                    className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-violet-600 hover:opacity-95 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/10 flex items-center gap-2 group"
                  >
                    Continuar Diagnóstico
                    <Icons.ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </form>
            )}

            {/* ================= PASO 2: DIAGNÓSTICO (10 PREGUNTAS) ================= */}
            {activeStep === 2 && (
              <div className="space-y-6 text-left">
                
                {/* PREGUNTA 1: TIPO NEGOCIO */}
                {subStep === 1 && (
                  <div>
                    <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Pregunta 1 de 10</span>
                    <h3 className="text-xl font-bold text-white mt-1 mb-4">¿Qué tipo de negocio tienes actualmente?</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {['Servicios profesionales', 'Agencia', 'Ecommerce', 'SaaS', 'Retail', 'Manufactura', 'Educación', 'Salud', 'Inmobiliaria', 'Otro'].map((option) => (
                        <button
                          key={option}
                          onClick={() => selectSingleOption('tipoNegocio', option)}
                          className={`p-4 rounded-xl border text-sm font-medium transition-all text-left flex items-center justify-between ${formData.tipoNegocio === option ? 'bg-blue-600/10 border-blue-500 text-white' : 'bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-700'}`}
                        >
                          {option}
                          {formData.tipoNegocio === option && <Icons.Check className="w-4 h-4 text-blue-500" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* PREGUNTA 2: PROBLEMA OPERATIVO */}
                {subStep === 2 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Pregunta 2 de 10</span>
                    <h3 className="text-xl font-bold text-white mt-1 mb-2">¿Cuál es tu principal problema operativo o comercial?</h3>
                    <p className="text-xs text-slate-400 mb-4">Explícanos brevemente qué es lo que más te cuesta o frustra en el día a día.</p>
                    <textarea 
                      name="problemaPrincipal"
                      value={formData.problemaPrincipal}
                      onChange={handleInputChange}
                      placeholder="Ej. El equipo de ventas tarda horas en contestar los leads de publicidad y muchos prospectos se enfrían de inmediato..."
                      rows={5}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    />
                  </div>
                )}

                {/* PREGUNTA 3: TAREAS REPETIDAS */}
                {subStep === 3 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Pregunta 3 de 10</span>
                    <h3 className="text-xl font-bold text-white mt-1 mb-2">¿Qué tareas repites todas las semanas y te roban energía?</h3>
                    <p className="text-xs text-slate-400 mb-4">Escribe aquellas actividades mecánicas que sientes que no aportan valor pero debes hacer de todas formas.</p>
                    <textarea 
                      name="tareasRepetitivas"
                      value={formData.tareasRepetitivas}
                      onChange={handleInputChange}
                      placeholder="Ej. Enviar mensajes de bienvenida uno a uno, rellenar manualmente hojas de Excel con datos de clientes, agendar llamadas a mano..."
                      rows={5}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    />
                  </div>
                )}

                {/* PREGUNTA 4: PÉRDIDA DE TIEMPO */}
                {subStep === 4 && (
                  <div>
                    <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Pregunta 4 de 10</span>
                    <h3 className="text-xl font-bold text-white mt-1 mb-2">¿Dónde consideras que se pierde más tiempo en tu organización?</h3>
                    <p className="text-xs text-slate-400 mb-4">Selecciona todas las opciones que correspondan a tus dolores actuales.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {['Seguimiento de clientes', 'Ventas', 'Reportes', 'Operaciones', 'Atención al cliente', 'Administración', 'Otro'].map((item) => {
                        const isSelected = formData.perdidaTiempo.includes(item);
                        return (
                          <button
                            key={item}
                            onClick={() => handleCheckboxChange('perdidaTiempo', item)}
                            className={`p-4 rounded-xl border text-sm font-medium transition-all text-left flex items-center justify-between ${isSelected ? 'bg-blue-600/10 border-blue-500 text-white' : 'bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-700'}`}
                          >
                            <span>{item}</span>
                            <div className={`w-5 h-5 rounded flex items-center justify-center border ${isSelected ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-800 bg-slate-900'}`}>
                              {isSelected && <Icons.Check className="w-3.5 h-3.5" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* PREGUNTA 5: CAPTACIÓN DE LEADS */}
                {subStep === 5 && (
                  <div>
                    <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Pregunta 5 de 10</span>
                    <h3 className="text-xl font-bold text-white mt-1 mb-2">¿Cómo captas leads o clientes potenciales actualmente?</h3>
                    <p className="text-xs text-slate-400 mb-4">Indica todos los canales donde tu empresa adquiere visibilidad comercial.</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {['Referidos', 'Redes sociales', 'Google Ads', 'Meta Ads', 'LinkedIn', 'SEO', 'Email marketing', 'Eventos', 'Otro'].map((item) => {
                        const isSelected = formData.captacionLeads.includes(item);
                        return (
                          <button
                            key={item}
                            onClick={() => handleCheckboxChange('captacionLeads', item)}
                            className={`p-4 rounded-xl border text-sm font-medium transition-all text-left flex items-center justify-between ${isSelected ? 'bg-blue-600/10 border-blue-500 text-white' : 'bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-700'}`}
                          >
                            <span>{item}</span>
                            <div className={`w-5 h-5 rounded flex items-center justify-center border ${isSelected ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-800 bg-slate-900'}`}>
                              {isSelected && <Icons.Check className="w-3.5 h-3.5" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* PREGUNTA 6: SEGUIMIENTO DE LEADS */}
                {subStep === 6 && (
                  <div>
                    <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Pregunta 6 de 10</span>
                    <h3 className="text-xl font-bold text-white mt-1 mb-4">¿Cómo haces seguimiento a esos clientes potenciales hoy?</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {['Excel', 'WhatsApp', 'CRM', 'Email', 'No tengo proceso definido', 'Otro'].map((option) => (
                        <button
                          key={option}
                          onClick={() => selectSingleOption('seguimientoLeads', option)}
                          className={`p-4 rounded-xl border text-sm font-medium transition-all text-left flex items-center justify-between ${formData.seguimientoLeads === option ? 'bg-blue-600/10 border-blue-500 text-white' : 'bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-700'}`}
                        >
                          {option}
                          {formData.seguimientoLeads === option && <Icons.Check className="w-4 h-4 text-blue-500" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* PREGUNTA 7: HERRAMIENTAS ACTUALES */}
                {subStep === 7 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Pregunta 7 de 10</span>
                    <h3 className="text-xl font-bold text-white mt-1 mb-2">¿Qué herramientas de software utilizas actualmente?</h3>
                    <p className="text-xs text-slate-400 mb-4">Haz una lista rápida de las plataformas que forman parte de tu ecosistema actual.</p>
                    <textarea 
                      name="herramientasActuales"
                      value={formData.herramientasActuales}
                      onChange={handleInputChange}
                      placeholder="Ej. Trello, Gmail, WhatsApp Business, ActiveCampaign, Holded..."
                      rows={5}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    />
                  </div>
                )}

                {/* PREGUNTA 8: REPORTES FALTANTES */}
                {subStep === 8 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Pregunta 8 de 10</span>
                    <h3 className="text-xl font-bold text-white mt-1 mb-2">¿Qué métricas o reportes necesitas tener pero te cuesta conseguir?</h3>
                    <p className="text-xs text-slate-400 mb-4">Información crítica que deberías ver al instante pero requieres horas de cálculo manual para obtenerla.</p>
                    <textarea 
                      name="reportesFaltantes"
                      value={formData.reportesFaltantes}
                      onChange={handleInputChange}
                      placeholder="Ej. El coste exacto de adquisición por lead publicitario al día, tasa de conversión exacta de los vendedores..."
                      rows={5}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    />
                  </div>
                )}

                {/* PREGUNTA 9: PROCESO A AUTOMATIZAR */}
                {subStep === 9 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Pregunta 9 de 10</span>
                    <h3 className="text-xl font-bold text-white mt-1 mb-2">¿Qué proceso específico te gustaría automatizar con prioridad?</h3>
                    <p className="text-xs text-slate-400 mb-4">Aquello que si funcionara de forma automática mañana mismo, aliviaría el 80% de tus preocupaciones.</p>
                    <textarea 
                      name="procesoPrioritario"
                      value={formData.procesoPrioritario}
                      onChange={handleInputChange}
                      placeholder="Ej. El agendamiento de citas cualificadas directo a nuestro Google Calendar desde WhatsApp sin interacción manual..."
                      rows={5}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    />
                  </div>
                )}

                {/* PREGUNTA 10: RESULTADO ESPERADO */}
                {subStep === 10 && (
                  <div>
                    <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Pregunta 10 de 10</span>
                    <h3 className="text-xl font-bold text-white mt-1 mb-4">¿Qué resultado prioritario esperas lograr en los próximos 30 a 90 días?</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {['Más leads', 'Más ventas', 'Ahorrar tiempo', 'Reducir costos', 'Mejor seguimiento', 'Mejor atención al cliente', 'Automatizar procesos', 'Otro'].map((option) => (
                        <button
                          key={option}
                          onClick={() => selectSingleOption('resultadoEsperado', option)}
                          className={`p-4 rounded-xl border text-sm font-medium transition-all text-left flex items-center justify-between ${formData.resultadoEsperado === option ? 'bg-blue-600/10 border-blue-500 text-white shadow-lg' : 'bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-700'}`}
                        >
                          {option}
                          {formData.resultadoEsperado === option && <Icons.Check className="w-4 h-4 text-blue-500" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ACCIONES DE NAVEGACIÓN PASO 2 */}
                <div className="pt-6 border-t border-slate-800 flex justify-between">
                  <button
                    onClick={handlePrevSubStep}
                    className="px-6 py-3 bg-slate-950 hover:bg-slate-850 text-slate-300 font-semibold rounded-xl border border-slate-850 transition-all flex items-center gap-2"
                  >
                    <Icons.ArrowLeft className="w-4 h-4" />
                    Atrás
                  </button>
                  <button
                    onClick={handleNextSubStep}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-violet-600 hover:opacity-95 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/10 flex items-center gap-2 group"
                  >
                    {subStep === 10 ? 'Enviar Diagnóstico' : 'Siguiente'}
                    <Icons.ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

              </div>
            )}

            {/* ================= PASO 3: ÉXITO Y REPORTE SIMULADO IA ================= */}
            {activeStep === 3 && (
              <div className="space-y-8 text-center animate-fadeIn">
                
                {/* Cabecera de éxito */}
                <div className="flex flex-col items-center">
                  <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 mb-6 shadow-lg shadow-emerald-500/5">
                    <Icons.Check className="w-8 h-8" />
                  </div>
                  <h3 className="text-3xl font-extrabold text-white">¡Diagnóstico Completado con Éxito!</h3>
                  <p className="text-sm text-slate-400 max-w-lg mt-2">
                    Hemos procesado tus datos {formData.nombre ? `para ${formData.empresa}` : ''}. Un especialista técnico de AGENTESDX se pondrá en contacto contigo en breve a tu WhatsApp o correo corporativo.
                  </p>
                </div>

                {/* INFORME ANALÍTICO GENERADO */}
                <div className="text-left bg-slate-950 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 px-3 py-1 bg-blue-500/10 border-b border-l border-slate-800 rounded-bl-xl text-[10px] font-mono text-blue-400 uppercase tracking-widest">
                    Pre-Análisis de IA
                  </div>
                  
                  <div className="border-b border-slate-900 pb-4">
                    <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Perfil analizado</span>
                    <h4 className="text-lg font-bold text-white mt-1">{formData.empresa} ({formData.tipoNegocio})</h4>
                    <p className="text-xs text-slate-400">Tamaño del equipo: {formData.tamanoEmpresa} | Contacto: {formData.nombre} ({formData.cargo})</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h5 className="text-sm font-semibold text-blue-400 flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                        Diagnóstico de Cuello de Botella Detectado:
                      </h5>
                      <p className="text-xs text-slate-300 pl-3.5 mt-1 leading-relaxed">
                        Basado en tus dolores de <strong className="text-slate-200">"{formData.perdidaTiempo.join(', ') || 'procesos generales'}"</strong> y el seguimiento vía <strong className="text-slate-200">"{formData.seguimientoLeads}"</strong>, estimamos que estás perdiendo aproximadamente el 30% al 45% de tus oportunidades por fricciones de tiempo y ausencia de automatización en tus canales de captación ({formData.captacionLeads.join(', ') || 'tus canales habituales'}).
                      </p>
                    </div>

                    <div>
                      <h5 className="text-sm font-semibold text-violet-400 flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                        Solución Propuesta a Corto Plazo:
                      </h5>
                      <p className="text-xs text-slate-300 pl-3.5 mt-1 leading-relaxed">
                        Implementar una pasarela intermedia de automatización para estructurar los datos entrantes de tus prospectos hacia un entorno CRM centralizado, unificando tus reportes para evitar la dispersión de datos.
                      </p>
                    </div>

                    <div>
                      <h5 className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Impacto Estimado en 30 Días:
                      </h5>
                      <p className="text-xs text-slate-300 pl-3.5 mt-1 leading-relaxed">
                        Reducción de hasta un <strong className="text-slate-200">80% en tiempo administrativo</strong> en tareas mecánicas y respuesta instantánea garantizada para tu objetivo de <strong className="text-slate-200">"{formData.resultadoEsperado}"</strong>.
                      </p>
                    </div>
                  </div>
                </div>

                {/* BOTÓN REINICIO */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={resetForm}
                    className="px-6 py-3 bg-slate-900 hover:bg-slate-850 text-slate-300 rounded-xl font-medium border border-slate-800 transition-all text-sm w-full sm:w-auto"
                  >
                    Realizar otra auditoría
                  </button>
                  <a
                    href="https://wa.me/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/10 text-sm flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    Chatear Directo por WhatsApp
                  </a>
                </div>

              </div>
            )}

          </div>

          {/* SIMULADOR DE BASE DE DATOS LOCALES (Solo visible para pruebas, demuestra el guardado de datos) */}
          {leadsDb.length > 0 && (
            <div className="mt-12 p-6 bg-slate-900/10 border border-slate-900 rounded-2xl text-left">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Base de Datos de Leads Capturados en LocalStorage
                  </h4>
                  <p className="text-xs text-slate-500">Historial de auditorías registradas en este navegador.</p>
                </div>
                <button
                  onClick={() => {
                    localStorage.removeItem('agentesdx_leads');
                    setLeadsDb([]);
                  }}
                  className="text-[10px] text-red-400 hover:underline"
                >
                  Limpiar Base de Datos
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-400">
                  <thead>
                    <tr className="border-b border-slate-850 text-slate-300 font-semibold bg-slate-950/40">
                      <th className="p-2">Fecha</th>
                      <th className="p-2">Empresa</th>
                      <th className="p-2">Contacto</th>
                      <th className="p-2">WhatsApp</th>
                      <th className="p-2">Objetivo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leadsDb.map((lead, idx) => (
                      <tr key={idx} className="border-b border-slate-900 hover:bg-slate-900/20">
                        <td className="p-2 font-mono text-[10px]">{lead.fecha}</td>
                        <td className="p-2 font-bold text-white">{lead.empresa}</td>
                        <td className="p-2">{lead.nombre} ({lead.cargo})</td>
                        <td className="p-2">{lead.whatsapp}</td>
                        <td className="p-2 text-violet-400">{lead.resultadoEsperado}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* SECCIÓN RESULTADOS RECIENTES */}
      <section id="resultados" className="py-20 bg-slate-900/20 border-t border-slate-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
              ¿Qué recibirás tras completar el diagnóstico?
            </h2>
            <p className="text-slate-400">
              Nuestro compromiso no acaba con un formulario en línea. Estructuramos una ruta de optimización viable para tu negocio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-850 flex gap-4 items-start">
              <span className="text-xl p-2 bg-blue-500/10 rounded-lg text-blue-400">✓</span>
              <div>
                <h4 className="text-lg font-bold text-white mb-1">Diagnóstico Personalizado</h4>
                <p className="text-sm text-slate-400 leading-relaxed">Un documento claro enfocado en tu tipo de negocio y modelo operativo real.</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-850 flex gap-4 items-start">
              <span className="text-xl p-2 bg-violet-500/10 rounded-lg text-violet-400">✓</span>
              <div>
                <h4 className="text-lg font-bold text-white mb-1">Oportunidades de Automatización</h4>
                <p className="text-sm text-slate-400 leading-relaxed">Identificación de flujos mecánicos que pueden delegarse a un robot inmediatamente.</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-850 flex gap-4 items-start">
              <span className="text-xl p-2 bg-pink-500/10 rounded-lg text-pink-400">✓</span>
              <div>
                <h4 className="text-lg font-bold text-white mb-1">Recomendaciones Prácticas</h4>
                <p className="text-sm text-slate-400 leading-relaxed">Sin rodeos teóricos ni conceptos abstractos. Directo al grano operativo.</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-850 flex gap-4 items-start">
              <span className="text-xl p-2 bg-emerald-500/10 rounded-lg text-emerald-400">✓</span>
              <div>
                <h4 className="text-lg font-bold text-white mb-1">Próximos Pasos Sugeridos</h4>
                <p className="text-sm text-slate-400 leading-relaxed">El orden exacto en el que debes integrar tus sistemas para no detener tus ventas.</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-850 flex gap-4 items-start">
              <span className="text-xl p-2 bg-amber-500/10 rounded-lg text-amber-400">✓</span>
              <div>
                <h4 className="text-lg font-bold text-white mb-1">Identificación de Cuellos de Botella</h4>
                <p className="text-sm text-slate-400 leading-relaxed">Te decimos exactamente dónde están los puntos ciegos que drenan tu presupuesto publicitario.</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-850 flex gap-4 items-start">
              <span className="text-xl p-2 bg-red-500/10 rounded-lg text-red-400">✓</span>
              <div>
                <h4 className="text-lg font-bold text-white mb-1">Acceso Directo a Expertos</h4>
                <p className="text-sm text-slate-400 leading-relaxed">Una llamada estratégica de cortesía para repasar el diagnóstico técnico de tus procesos.</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 bg-slate-950 relative overflow-hidden border-t border-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.06),transparent_60%)]" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6 tracking-tight leading-tight">
            Descubre qué tareas puede hacer la IA <br className="hidden sm:block" />
            por tu negocio mientras tú te enfocas en crecer.
          </h2>
          <p className="text-slate-400 sm:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            No pierdas más tiempo persiguiendo leads a mano ni elaborando reportes mecánicos. Pon tu negocio en piloto automático estratégico.
          </p>

          <button
            onClick={scrollToForm}
            className="px-10 py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white rounded-2xl font-bold shadow-2xl shadow-blue-500/30 hover:opacity-95 transform hover:-translate-y-0.5 transition-all text-base sm:text-lg inline-flex items-center gap-3 group"
          >
            Solicitar Diagnóstico Gratuito
            <Icons.ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Seguridad badges */}
          <div className="flex justify-center items-center gap-6 mt-8 text-xs text-slate-500">
            <span className="flex items-center gap-2">
              <Icons.Lock className="w-4 h-4 text-slate-600" /> Datos 100% Protegidos
            </span>
            <span className="h-4 w-[1px] bg-slate-800" />
            <span>Auditoría sin Obligación Comercial</span>
          </div>
        </div>
      </section>

      {/* PIE DE PÁGINA */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12 text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <span className="text-white font-black text-sm tracking-tighter">A</span>
            </div>
            <span className="font-bold text-slate-300">AGENTESDX</span>
          </div>
          <p className="text-xs">
            © {new Date().getFullYear()} AGENTESDX. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6 text-xs text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Términos de servicio</a>
            <a href="#" className="hover:text-white transition-colors">Política de privacidad</a>
          </div>
        </div>
      </footer>

    </div>
  );
}