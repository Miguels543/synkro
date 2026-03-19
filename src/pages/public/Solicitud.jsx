import { useState } from "react"

const tiposWeb = [
  {
    id: "ecommerce",
    label: "E-commerce",
    desc: "Tienda online con pagos",
    color: "#00f3ff",
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
        <rect x="6" y="14" width="36" height="26" rx="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M16 14v-3a8 8 0 0116 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="18" cy="28" r="2" fill="currentColor"/>
        <circle cx="30" cy="28" r="2" fill="currentColor"/>
        <path d="M14 22h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "restaurante",
    label: "Restaurante",
    desc: "Menú digital y reservas",
    color: "#f97316",
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
        <path d="M16 8v10c0 3.314 2.686 6 6 6s6-2.686 6-6V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M22 24v16M16 8v32M28 8v32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M12 36h24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "corporativa",
    label: "Corporativa",
    desc: "Presencia empresarial",
    color: "#3b82f6",
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
        <rect x="8" y="18" width="32" height="22" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M16 18v-4a8 8 0 0116 0v4" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="20" y="28" width="8" height="12" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M14 26h4M30 26h4M14 32h4M30 32h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "landing",
    label: "Landing Page",
    desc: "Página de conversión",
    color: "#a855f7",
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
        <rect x="6" y="10" width="36" height="28" rx="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M6 16h36" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="11" cy="13" r="1.5" fill="currentColor"/>
        <circle cx="16" cy="13" r="1.5" fill="currentColor"/>
        <circle cx="21" cy="13" r="1.5" fill="currentColor"/>
        <path d="M14 24h20M18 29h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <rect x="18" y="32" width="12" height="4" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    id: "inmobiliaria",
    label: "Inmobiliaria",
    desc: "Catálogo de propiedades",
    color: "#10b981",
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
        <path d="M8 20L24 8l16 12v20H8V20z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <rect x="18" y="28" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M18 34h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "salud",
    label: "Salud",
    desc: "Clínicas y consultorios",
    color: "#ec4899",
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
        <rect x="8" y="8" width="32" height="32" rx="4" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M24 16v16M16 24h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "otro",
    label: "Otro",
    desc: "Algo diferente",
    color: "#fbbf24",
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
        <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M24 20c0-2.21 1.79-4 4-4s4 1.79 4 4c0 3-4 3-4 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="24" cy="34" r="1.5" fill="currentColor"/>
      </svg>
    ),
  },
]

const presupuestos = [
  { id: "bajo", label: "Menos de S/. 80", sub: "Presencia básica online" },
  { id: "medio", label: "S/. 80 — S/. 120", sub: "Tienda con gestión propia" },
  { id: "alto", label: "S/. 120 — S/. 150", sub: "Solución completa con bot" },
  { id: "custom", label: "A conversar", sub: "Tengo algo en mente" },
]

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');

  .solicitud-page {
    min-height: 100vh;
    background: #000;
    color: #fff;
    font-family: 'Space Grotesk', sans-serif;
    padding-top: 65px;
    position: relative;
    overflow: hidden;
  }

  .sol-bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;
  }

  .sol-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.1;
  }

  .sol-orb-1 {
    width: 500px; height: 500px;
    background: #00f3ff;
    top: -100px; left: -100px;
    animation: orbFloat 8s ease-in-out infinite;
  }

  .sol-orb-2 {
    width: 400px; height: 400px;
    background: #a855f7;
    bottom: -50px; right: -80px;
    animation: orbFloat 10s ease-in-out infinite reverse;
  }

  .sol-orb-3 {
    width: 300px; height: 300px;
    background: #3b82f6;
    top: 40%; left: 60%;
    animation: orbFloat 12s ease-in-out infinite 2s;
  }

  @keyframes orbFloat {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(30px, -20px) scale(1.05); }
    66% { transform: translate(-20px, 30px) scale(0.95); }
  }

  .sol-grid-bg {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(0,243,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,243,255,0.025) 1px, transparent 1px);
    background-size: 60px 60px;
  }

  .solicitud-inner {
    max-width: 780px;
    margin: 0 auto;
    padding: 60px 24px 100px;
    position: relative;
    z-index: 1;
  }

  .sol-label {
    font-size: 11px;
    letter-spacing: 5px;
    color: #00f3ff;
    text-transform: uppercase;
    opacity: 0.7;
    margin-bottom: 14px;
    text-align: center;
  }

  .sol-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(32px, 5vw, 62px);
    font-weight: 800;
    line-height: 1.0;
    margin-bottom: 14px;
    text-align: center;
    background: linear-gradient(135deg, #fff 0%, #00f3ff 50%, #a855f7 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .sol-subtitle {
    font-size: 15px;
    color: rgba(255,255,255,0.35);
    text-align: center;
    line-height: 1.7;
    margin-bottom: 56px;
  }

  .steps-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 56px;
  }

  .step-item {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .step-circle {
    width: 38px; height: 38px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
    border: 1.5px solid rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.25);
    transition: all 0.4s ease;
  }

  .step-circle.active {
    border-color: #00f3ff;
    color: #00f3ff;
    box-shadow: 0 0 0 4px rgba(0,243,255,0.08), 0 0 20px rgba(0,243,255,0.2);
  }

  .step-circle.done {
    border-color: #00f3ff;
    background: #00f3ff;
    color: #000;
    box-shadow: 0 0 20px rgba(0,243,255,0.25);
  }

  .step-label {
    font-size: 12px;
    color: rgba(255,255,255,0.25);
    font-weight: 500;
    transition: color 0.4s ease;
  }

  .step-label.active { color: #00f3ff; }
  .step-label.done { color: rgba(255,255,255,0.45); }

  .step-line {
    width: 60px; height: 1px;
    margin: 0 10px;
    background: rgba(255,255,255,0.08);
    position: relative;
    overflow: hidden;
  }

  .step-line-fill {
    position: absolute;
    top: 0; left: 0;
    height: 100%;
    background: linear-gradient(90deg, #00f3ff, #a855f7);
    transition: width 0.6s ease;
  }

  .step-content {
    animation: stepIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  @keyframes stepIn {
    from { opacity: 0; transform: translateY(28px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .step-heading {
    font-family: 'Syne', sans-serif;
    font-size: 26px;
    font-weight: 800;
    color: #fff;
    margin-bottom: 8px;
  }

  .step-sub {
    font-size: 14px;
    color: rgba(255,255,255,0.3);
    margin-bottom: 36px;
    line-height: 1.6;
  }

  /* TIPO CARDS */
  .tipos-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-bottom: 16px;
  }

  .tipo-card {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 18px;
    padding: 24px 16px 20px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    text-align: center;
    position: relative;
    overflow: hidden;
    backdrop-filter: blur(12px);
  }

  .tipo-card:hover {
    transform: translateY(-5px);
    border-color: rgba(255,255,255,0.12);
  }

  .tipo-card.selected {
    transform: translateY(-5px);
  }

  .tipo-icon-wrap {
    width: 58px; height: 58px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 14px;
    transition: all 0.3s ease;
    position: relative;
    z-index: 1;
  }

  .tipo-label {
    font-size: 13px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 5px;
    position: relative;
    z-index: 1;
    transition: color 0.3s ease;
  }

  .tipo-desc {
    font-size: 11px;
    color: rgba(255,255,255,0.3);
    line-height: 1.4;
    position: relative;
    z-index: 1;
  }

  .tipo-dot {
    position: absolute;
    top: 12px; right: 12px;
    width: 8px; height: 8px;
    border-radius: 50%;
    opacity: 0;
    transform: scale(0);
    transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    z-index: 2;
  }

  .tipo-card.selected .tipo-dot {
    opacity: 1;
    transform: scale(1);
  }

  .otro-input-wrap {
    animation: stepIn 0.35s ease both;
    margin-bottom: 24px;
  }

  .otro-input {
    width: 100%;
    background: rgba(251,191,36,0.04);
    border: 1px solid rgba(251,191,36,0.25);
    border-radius: 14px;
    padding: 16px 20px;
    color: #fff;
    font-size: 15px;
    font-family: 'Space Grotesk', sans-serif;
    outline: none;
    transition: all 0.3s ease;
    box-sizing: border-box;
  }

  .otro-input:focus {
    border-color: rgba(251,191,36,0.6);
    box-shadow: 0 0 0 3px rgba(251,191,36,0.08);
  }

  .otro-input::placeholder { color: rgba(255,255,255,0.2); }

  /* PRESUPUESTO */
  .presupuestos-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin-bottom: 40px;
  }

  .presupuesto-card {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px;
    padding: 24px 22px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: space-between;
    backdrop-filter: blur(12px);
    position: relative;
    overflow: hidden;
  }

  .presupuesto-card::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 0% 50%, rgba(0,243,255,0.06), transparent 60%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .presupuesto-card:hover {
    border-color: rgba(0,243,255,0.2);
    transform: translateX(5px);
  }

  .presupuesto-card:hover::after { opacity: 1; }

  .presupuesto-card.selected {
    border-color: rgba(0,243,255,0.5);
    background: rgba(0,243,255,0.05);
    transform: translateX(5px);
  }

  .presupuesto-card.selected::after { opacity: 1; }

  .presupuesto-info { position: relative; z-index: 1; }

  .presupuesto-label {
    font-size: 15px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 4px;
  }

  .presupuesto-sub {
    font-size: 12px;
    color: rgba(255,255,255,0.3);
  }

  .presupuesto-radio {
    width: 22px; height: 22px;
    border-radius: 50%;
    border: 1.5px solid rgba(255,255,255,0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.25s ease;
    flex-shrink: 0;
    position: relative;
    z-index: 1;
  }

  .presupuesto-card.selected .presupuesto-radio {
    border-color: #00f3ff;
    background: #00f3ff;
  }

  .presupuesto-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: #000;
    opacity: 0;
    transform: scale(0);
    transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .presupuesto-card.selected .presupuesto-dot {
    opacity: 1;
    transform: scale(1);
  }

  /* FORM */
  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 16px;
  }

  .form-full { margin-bottom: 16px; }

  .form-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .form-label {
    font-size: 11px;
    letter-spacing: 1.5px;
    color: rgba(255,255,255,0.35);
    text-transform: uppercase;
    font-weight: 600;
  }

  .form-input {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    padding: 14px 16px;
    color: #fff;
    font-size: 15px;
    font-family: 'Space Grotesk', sans-serif;
    outline: none;
    transition: all 0.3s ease;
    width: 100%;
    box-sizing: border-box;
  }

  .form-input:focus {
    border-color: rgba(0,243,255,0.4);
    background: rgba(0,243,255,0.03);
    box-shadow: 0 0 0 3px rgba(0,243,255,0.07);
  }

  .form-input::placeholder { color: rgba(255,255,255,0.18); }

  .form-textarea {
    resize: none;
    min-height: 130px;
  }

  /* NAV */
  .step-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 36px;
  }

  .nav-back {
    background: transparent;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 50px;
    padding: 12px 28px;
    color: rgba(255,255,255,0.35);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: 'Space Grotesk', sans-serif;
  }

  .nav-back:hover {
    border-color: rgba(255,255,255,0.2);
    color: rgba(255,255,255,0.7);
  }

  .nav-next {
    background: linear-gradient(45deg, #00f3ff, #0066ff);
    border: none;
    border-radius: 50px;
    padding: 14px 38px;
    color: #000;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: 'Space Grotesk', sans-serif;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .nav-next:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 14px 35px rgba(0,243,255,0.35);
  }

  .nav-next:disabled {
    opacity: 0.25;
    cursor: not-allowed;
  }

  .nav-arrow {
    display: inline-block;
    transition: transform 0.3s ease;
  }

  .nav-next:hover:not(:disabled) .nav-arrow {
    transform: translateX(5px);
  }

  /* SUCCESS */
  .success-wrap {
    text-align: center;
    padding: 20px 0 60px;
    animation: stepIn 0.6s ease both;
  }

  .success-rings {
    position: relative;
    width: 110px; height: 110px;
    margin: 0 auto 36px;
  }

  .success-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 1px solid rgba(0,243,255,0.2);
    animation: ringPulse 2s ease-out infinite;
  }

  .success-ring:nth-child(2) { animation-delay: 0.4s; }
  .success-ring:nth-child(3) { animation-delay: 0.8s; }

  @keyframes ringPulse {
    0% { transform: scale(1); opacity: 0.6; }
    100% { transform: scale(1.8); opacity: 0; }
  }

  .success-icon-inner {
    position: absolute;
    inset: 15px;
    border-radius: 50%;
    background: rgba(0,243,255,0.08);
    border: 1.5px solid #00f3ff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
    animation: popIn 0.5s 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    box-shadow: 0 0 40px rgba(0,243,255,0.2);
  }

  @keyframes popIn {
    from { transform: scale(0) rotate(-10deg); opacity: 0; }
    to { transform: scale(1) rotate(0deg); opacity: 1; }
  }

  .success-title {
    font-family: 'Syne', sans-serif;
    font-size: 38px;
    font-weight: 800;
    color: #fff;
    margin-bottom: 14px;
  }

  .success-desc {
    font-size: 16px;
    color: rgba(255,255,255,0.4);
    line-height: 1.7;
    max-width: 400px;
    margin: 0 auto 44px;
  }

  .success-resumen {
    background: rgba(0,243,255,0.03);
    border: 1px solid rgba(0,243,255,0.12);
    border-radius: 18px;
    padding: 28px 32px;
    text-align: left;
    max-width: 480px;
    margin: 0 auto 40px;
  }

  .success-resumen-title {
    font-size: 10px;
    letter-spacing: 3px;
    color: rgba(0,243,255,0.5);
    text-transform: uppercase;
    font-weight: 600;
    margin-bottom: 18px;
  }

  .success-resumen-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    padding: 12px 0;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    color: rgba(255,255,255,0.5);
  }

  .success-resumen-item:last-child { border-bottom: none; }

  .success-resumen-item span:last-child {
    color: #fff;
    font-weight: 600;
  }

  .success-btn {
    background: linear-gradient(45deg, #00f3ff, #0066ff);
    border: none;
    border-radius: 50px;
    padding: 14px 42px;
    color: #000;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    font-family: 'Space Grotesk', sans-serif;
    transition: all 0.3s ease;
  }

  .success-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 35px rgba(0,243,255,0.35);
  }
`

function Solicitud() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    tipo: "",
    tipoOtro: "",
    presupuesto: "",
    nombre: "",
    email: "",
    empresa: "",
    whatsapp: "",
    descripcion: "",
  })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const canNext = () => {
    if (step === 1) {
      if (form.tipo === "otro") return form.tipoOtro.trim() !== ""
      return form.tipo !== ""
    }
    if (step === 2) return form.presupuesto !== ""
    if (step === 3) return form.nombre !== "" && form.email !== "" && form.descripcion !== ""
    return true
  }

  const handleSubmit = async () => {
    setLoading(true)
    const tipoLabel = form.tipo === "otro"
      ? `Otro: ${form.tipoOtro}`
      : tiposWeb.find(t => t.id === form.tipo)?.label
    try {
      await fetch("https://formsubmit.co/ajax/nexuscorporation543@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          Nombre: form.nombre,
          Email: form.email,
          Empresa: form.empresa || "No especificado",
          WhatsApp: form.whatsapp || "No especificado",
          "Tipo de web": tipoLabel,
          Presupuesto: presupuestos.find(p => p.id === form.presupuesto)?.label,
          Descripcion: form.descripcion,
          _subject: `Nueva solicitud de ${form.nombre} — Synkro`,
        }),
      })
      setSent(true)
    } catch {
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { num: 1, label: "Tipo" },
    { num: 2, label: "Presupuesto" },
    { num: 3, label: "Datos" },
  ]

  return (
    <div className="solicitud-page">
      <style>{styles}</style>

      <div className="sol-bg">
        <div className="sol-grid-bg" />
        <div className="sol-orb sol-orb-1" />
        <div className="sol-orb sol-orb-2" />
        <div className="sol-orb sol-orb-3" />
      </div>

      <div className="solicitud-inner">
        <p className="sol-label">Hablemos</p>
        <h1 className="sol-title">Cuentanos tu<br />proyecto</h1>
        <p className="sol-subtitle">
          Completa el formulario y te contactamos en menos de 24 horas.<br />
          Sin compromisos, sin costos ocultos.
        </p>

        {!sent ? (
          <>
            <div className="steps-bar">
              {steps.map((s, i) => (
                <div key={s.num} style={{ display: "flex", alignItems: "center" }}>
                  <div className="step-item">
                    <div className={`step-circle ${step === s.num ? "active" : step > s.num ? "done" : ""}`}>
                      {step > s.num ? "✓" : s.num}
                    </div>
                    <span className={`step-label ${step === s.num ? "active" : step > s.num ? "done" : ""}`}>
                      {s.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="step-line">
                      <div className="step-line-fill" style={{ width: step > s.num ? "100%" : "0%" }} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {step === 1 && (
              <div className="step-content" key="s1">
                <h2 className="step-heading">Que tipo de web necesitas?</h2>
                <p className="step-sub">Selecciona la categoria que mas se acerca a tu proyecto.</p>
                <div className="tipos-grid">
                  {tiposWeb.map((t) => {
                    const sel = form.tipo === t.id
                    return (
                      <div
                        key={t.id}
                        className={`tipo-card ${sel ? "selected" : ""}`}
                        style={sel ? {
                          borderColor: t.color,
                          background: `${t.color}0e`,
                          boxShadow: `0 0 35px ${t.color}1a`,
                        } : {}}
                        onClick={() => setForm({ ...form, tipo: t.id, tipoOtro: "" })}
                      >
                        <div className="tipo-dot" style={{ background: t.color }} />
                        <div
                          className="tipo-icon-wrap"
                          style={{
                            background: sel ? `${t.color}18` : "rgba(255,255,255,0.04)",
                            color: sel ? t.color : "rgba(255,255,255,0.35)",
                            boxShadow: sel ? `0 0 20px ${t.color}28` : "none",
                          }}
                        >
                          {t.svg}
                        </div>
                        <div className="tipo-label" style={{ color: sel ? t.color : "#fff" }}>{t.label}</div>
                        <div className="tipo-desc">{t.desc}</div>
                      </div>
                    )
                  })}
                </div>

                {form.tipo === "otro" && (
                  <div className="otro-input-wrap">
                    <input
                      name="tipoOtro"
                      value={form.tipoOtro}
                      onChange={handleChange}
                      placeholder="Describe que tipo de pagina necesitas..."
                      className="otro-input"
                      autoFocus
                    />
                  </div>
                )}

                <div className="step-nav">
                  <div />
                  <button className="nav-next" disabled={!canNext()} onClick={() => setStep(2)}>
                    Siguiente <span className="nav-arrow">→</span>
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="step-content" key="s2">
                <h2 className="step-heading">Cual es tu presupuesto?</h2>
                <p className="step-sub">Elige el rango que mejor se adapta a lo que puedes invertir mensualmente.</p>
                <div className="presupuestos-grid">
                  {presupuestos.map((p) => (
                    <div
                      key={p.id}
                      className={`presupuesto-card ${form.presupuesto === p.id ? "selected" : ""}`}
                      onClick={() => setForm({ ...form, presupuesto: p.id })}
                    >
                      <div className="presupuesto-info">
                        <div className="presupuesto-label">{p.label}</div>
                        <div className="presupuesto-sub">{p.sub}</div>
                      </div>
                      <div className="presupuesto-radio">
                        <div className="presupuesto-dot" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="step-nav">
                  <button className="nav-back" onClick={() => setStep(1)}>← Atras</button>
                  <button className="nav-next" disabled={!canNext()} onClick={() => setStep(3)}>
                    Siguiente <span className="nav-arrow">→</span>
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="step-content" key="s3">
                <h2 className="step-heading">Tus datos de contacto</h2>
                <p className="step-sub">Para poder contactarte y entender mejor tu proyecto.</p>
                <div className="form-grid">
                  <div className="form-field">
                    <label className="form-label">Nombre *</label>
                    <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Tu nombre completo" className="form-input" />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Correo *</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="tu@correo.com" className="form-input" />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Empresa</label>
                    <input name="empresa" value={form.empresa} onChange={handleChange} placeholder="Nombre de tu negocio" className="form-input" />
                  </div>
                  <div className="form-field">
                    <label className="form-label">WhatsApp</label>
                    <input name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="+51 999 999 999" className="form-input" />
                  </div>
                </div>
                <div className="form-full">
                  <div className="form-field">
                    <label className="form-label">Descripcion del proyecto *</label>
                    <textarea
                      name="descripcion"
                      value={form.descripcion}
                      onChange={handleChange}
                      placeholder="Cuentanos que tienes en mente, que funciones necesitas, referencias que te gusten..."
                      className="form-input form-textarea"
                    />
                  </div>
                </div>
                <div className="step-nav">
                  <button className="nav-back" onClick={() => setStep(2)}>← Atras</button>
                  <button className="nav-next" disabled={!canNext() || loading} onClick={handleSubmit}>
                    {loading ? "Enviando..." : <> Enviar solicitud <span className="nav-arrow">→</span> </>}
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="success-wrap">
            <div className="success-rings">
              <div className="success-ring" />
              <div className="success-ring" />
              <div className="success-ring" />
              <div className="success-icon-inner">✓</div>
            </div>
            <h2 className="success-title">Solicitud enviada</h2>
            <p className="success-desc">
              Recibimos tu mensaje. Te contactaremos en menos de 24 horas para hablar de tu proyecto.
            </p>
            <div className="success-resumen">
              <div className="success-resumen-title">Resumen de tu solicitud</div>
              <div className="success-resumen-item">
                <span>Tipo de web</span>
                <span>{form.tipo === "otro" ? form.tipoOtro : tiposWeb.find(t => t.id === form.tipo)?.label}</span>
              </div>
              <div className="success-resumen-item">
                <span>Presupuesto</span>
                <span>{presupuestos.find(p => p.id === form.presupuesto)?.label}</span>
              </div>
              <div className="success-resumen-item">
                <span>Nombre</span>
                <span>{form.nombre}</span>
              </div>
              <div className="success-resumen-item">
                <span>Correo</span>
                <span>{form.email}</span>
              </div>
            </div>
            <button className="success-btn" onClick={() => window.location.href = "/"}>
              Volver al inicio
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Solicitud