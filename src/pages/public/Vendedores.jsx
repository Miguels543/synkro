import { useState } from "react"
import { useNavigate } from "react-router-dom"

const pasos = [
  { num: "01", title: "Te registras", desc: "Crea tu cuenta en minutos. Sin papeleo, sin requisitos técnicos, sin costo." },
  { num: "02", title: "Accedes al catalogo", desc: "Ve todos los proyectos disponibles para vender con sus comisiones ya definidas." },
  { num: "03", title: "Vendes y cobras", desc: "Contactas clientes, cierras la venta y recibes tu comisión. Así de simple." },
]

const faqs = [
  { q: "Necesito saber programar?", a: "Para nada. Tu trabajo es vender, no desarrollar. Nosotros nos encargamos de toda la parte técnica." },
  { q: "Cuanto puedo ganar al mes?", a: "Depende de cuánto vendas. Con solo 2 ventas al mes ya superas un salario mínimo en comisiones. Los mejores vendedores ganan más de S/. 1,500 mensuales." },
  { q: "Hay un mínimo de ventas?", a: "No. Puedes vender a tu ritmo. No hay presión ni penalizaciones por no alcanzar metas." },
  { q: "Como recibo mi pago?", a: "Por transferencia bancaria o Yape/Plin. El pago se procesa dentro de las 48 horas después de confirmar la venta." },
  { q: "Puedo vender desde cualquier pais?", a: "Sí. Vendemos a cualquier negocio hispanohablante, sin importar el país. Solo necesitas internet." },
  { q: "Que pasa si el cliente tiene problemas con su web?", a: "Nosotros atendemos el soporte técnico. Tú no tienes que resolver nada técnico, solo mantener la relación con el cliente." },
]

const beneficios = [
  { tag: "Dinero", title: "Comisiones reales", desc: "Hasta 30% por cada venta cerrada. Sin topes, sin descuentos ocultos. Lo que acuerdan es lo que recibes.", accent: "#00f3ff" },
  { tag: "Ventas", title: "Catálogo listo para vender", desc: "No construyes nada. Los proyectos ya están desarrollados. Solo preséntalos, cierra y cobra.", accent: "#a855f7" },
  { tag: "Logros", title: "Ranking y premios mensuales", desc: "Los mejores vendedores del mes reciben bonos y reconocimientos. La competencia sana te motiva a crecer.", accent: "#00f3ff" },
  { tag: "Extras", title: "Retos con bonos extra", desc: "Completa misiones semanales y suma puntos para desbloquear comisiones adicionales.", accent: "#a855f7" },
  { tag: "Soporte", title: "Soporte técnico incluido", desc: "Cualquier problema del cliente lo resolvemos nosotros. Tú solo cuidas la relación comercial.", accent: "#00f3ff" },
  { tag: "Libertad", title: "Trabajo 100% remoto", desc: "Desde donde estés, cuando quieras. Solo necesitas internet y ganas de vender.", accent: "#a855f7" },
]

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');

  .vend-page {
    background: #000;
    color: #fff;
    font-family: 'Space Grotesk', sans-serif;
    padding-top: 65px;
    overflow-x: hidden;
  }

  /* ── HERO ── */
  .vend-hero {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 80px 8%;
    position: relative;
    overflow: hidden;
  }

  .vend-hero-bg-text {
    position: absolute;
    top: 50%;
    left: -2%;
    transform: translateY(-50%);
    font-family: 'Syne', sans-serif;
    font-size: clamp(120px, 18vw, 260px);
    font-weight: 800;
    color: transparent;
    -webkit-text-stroke: 1px rgba(0,243,255,0.07);
    white-space: nowrap;
    user-select: none;
    pointer-events: none;
    line-height: 1;
    z-index: 0;
  }

  .vend-hero-content {
    position: relative;
    z-index: 1;
    max-width: 900px;
  }

  .vend-hero-tag {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-size: 11px;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: #000;
    background: #00f3ff;
    padding: 7px 16px;
    border-radius: 4px;
    font-weight: 700;
    margin-bottom: 32px;
  }

  .vend-hero-tag-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #000;
    animation: tagBlink 1.5s infinite;
  }

  @keyframes tagBlink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  .vend-hero-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(52px, 8vw, 110px);
    font-weight: 800;
    line-height: 0.95;
    margin-bottom: 32px;
    letter-spacing: -2px;
  }

  .vend-hero-title .line-cyan  { color: #00f3ff; display: block; }
  .vend-hero-title .line-white { color: #fff; display: block; }
  .vend-hero-title .line-dim   { color: rgba(255,255,255,0.25); display: block; }

  .vend-hero-bottom {
    display: flex;
    align-items: center;
    gap: 48px;
    flex-wrap: wrap;
  }

  .vend-hero-desc {
    font-size: 17px;
    color: rgba(255,255,255,0.45);
    line-height: 1.7;
    max-width: 420px;
  }

  .vend-btn-main {
    padding: 18px 44px;
    background: #00f3ff;
    border: none;
    border-radius: 4px;
    color: #000;
    font-size: 16px;
    font-weight: 800;
    cursor: pointer;
    font-family: 'Space Grotesk', sans-serif;
    letter-spacing: 0.5px;
    transition: all 0.2s ease;
    white-space: nowrap;
    text-transform: uppercase;
    flex-shrink: 0;
  }

  .vend-btn-main:hover {
    background: #fff;
    transform: translateY(-2px);
    box-shadow: 0 0 40px rgba(0,243,255,0.3);
  }

  .vend-hero-scroll {
    position: absolute;
    bottom: 40px;
    right: 8%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    font-size: 10px;
    letter-spacing: 3px;
    color: rgba(255,255,255,0.2);
    text-transform: uppercase;
    writing-mode: vertical-rl;
  }

  .vend-hero-scroll-line {
    width: 1px;
    height: 48px;
    background: linear-gradient(to bottom, rgba(0,243,255,0.5), transparent);
  }

  /* ── NUMEROS ── */
  .vend-numeros {
    background: #00f3ff;
    padding: 0 8%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }

  .vend-numero-item {
    padding: 48px 32px;
    border-right: 1px solid rgba(0,0,0,0.15);
    transition: background 0.2s ease;
  }

  .vend-numero-item:last-child { border-right: none; }
  .vend-numero-item:hover { background: rgba(0,0,0,0.06); }

  .vend-numero-num {
    font-family: 'Syne', sans-serif;
    font-size: clamp(48px, 5vw, 72px);
    font-weight: 800;
    color: #000;
    line-height: 1;
    margin-bottom: 8px;
  }

  .vend-numero-label {
    font-size: 13px;
    color: rgba(0,0,0,0.6);
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  /* ── COMO FUNCIONA ── */
  .vend-como {
    padding: 120px 8%;
    position: relative;
    overflow: hidden;
  }

  .vend-como::before {
    content: 'HOW';
    position: absolute;
    right: -2%;
    top: 50%;
    transform: translateY(-50%);
    font-family: 'Syne', sans-serif;
    font-size: clamp(100px, 15vw, 200px);
    font-weight: 800;
    color: transparent;
    -webkit-text-stroke: 1px rgba(255,255,255,0.04);
    user-select: none;
    pointer-events: none;
    line-height: 1;
  }

  .vend-section-header {
    display: flex;
    align-items: baseline;
    gap: 24px;
    margin-bottom: 80px;
  }

  .vend-section-num {
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    letter-spacing: 3px;
    color: rgba(0,243,255,0.5);
    flex-shrink: 0;
  }

  .vend-section-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(32px, 4vw, 56px);
    font-weight: 800;
    color: #fff;
    line-height: 1.05;
  }

  .vend-pasos {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0;
    position: relative;
    z-index: 1;
  }

  .vend-paso {
    padding: 48px 40px;
    border-left: 1px solid rgba(255,255,255,0.06);
    position: relative;
    transition: background 0.3s ease;
  }

  .vend-paso:first-child { border-left: none; }
  .vend-paso:hover { background: rgba(0,243,255,0.03); }

  .vend-paso-num {
    font-family: 'Syne', sans-serif;
    font-size: 72px;
    font-weight: 800;
    color: rgba(0,243,255,0.08);
    line-height: 1;
    margin-bottom: 24px;
  }

  .vend-paso-title {
    font-family: 'Syne', sans-serif;
    font-size: 22px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 12px;
  }

  .vend-paso-desc {
    font-size: 14px;
    color: rgba(255,255,255,0.4);
    line-height: 1.75;
  }

  .vend-paso-line {
    position: absolute;
    top: 0; left: 0;
    width: 0; height: 2px;
    background: #00f3ff;
    transition: width 0.4s ease;
  }

  .vend-paso:hover .vend-paso-line { width: 100%; }

  /* ── CALCULADORA ── */
  .vend-calc {
    background: #0a0a0a;
    padding: 120px 8%;
    position: relative;
    overflow: hidden;
    border-top: 1px solid rgba(255,255,255,0.05);
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }

  .vend-calc-inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 100px;
    align-items: center;
    position: relative;
    z-index: 1;
  }

  .vend-calc-slider-wrap { margin-top: 48px; }

  .vend-calc-label {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 16px;
  }

  .vend-calc-label-text {
    font-size: 13px;
    color: rgba(255,255,255,0.4);
    letter-spacing: 1px;
  }

  .vend-calc-label-val {
    font-family: 'Syne', sans-serif;
    font-size: 22px;
    font-weight: 700;
    color: #00f3ff;
  }

  .vend-slider {
    width: 100%;
    -webkit-appearance: none;
    appearance: none;
    height: 3px;
    background: rgba(255,255,255,0.1);
    border-radius: 2px;
    outline: none;
    cursor: pointer;
    margin-bottom: 40px;
  }

  .vend-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px; height: 20px;
    border-radius: 50%;
    background: #00f3ff;
    cursor: pointer;
    box-shadow: 0 0 15px rgba(0,243,255,0.5);
    transition: transform 0.2s ease;
  }

  .vend-slider::-webkit-slider-thumb:hover { transform: scale(1.2); }

  .vend-calc-right { text-align: center; }

  .vend-calc-result-label {
    font-size: 12px;
    letter-spacing: 4px;
    color: rgba(255,255,255,0.3);
    text-transform: uppercase;
    margin-bottom: 16px;
  }

  .vend-calc-result {
    font-family: 'Syne', sans-serif;
    font-size: clamp(64px, 8vw, 110px);
    font-weight: 800;
    color: #00f3ff;
    line-height: 1;
    margin-bottom: 12px;
    text-shadow: 0 0 60px rgba(0,243,255,0.3);
    transition: all 0.3s ease;
  }

  .vend-calc-result-mes {
    font-size: 16px;
    color: rgba(255,255,255,0.3);
    margin-bottom: 32px;
  }

  .vend-calc-breakdown {
    display: flex;
    flex-direction: column;
    gap: 10px;
    text-align: left;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px;
    padding: 24px;
  }

  .vend-calc-row {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    color: rgba(255,255,255,0.45);
    padding: 6px 0;
    border-bottom: 1px solid rgba(255,255,255,0.04);
  }

  .vend-calc-row:last-child { border-bottom: none; }
  .vend-calc-row span:last-child { color: #fff; font-weight: 600; }

  /* ── BENEFICIOS — NUEVO LAYOUT ── */
  .vend-beneficios {
    padding: 120px 8%;
    position: relative;
    overflow: hidden;
  }

  .vend-ben-header {
    display: flex;
    align-items: baseline;
    gap: 24px;
    margin-bottom: 16px;
  }

  .vend-ben-subtitle {
    font-size: 16px;
    color: rgba(255,255,255,0.35);
    line-height: 1.7;
    max-width: 500px;
    margin-bottom: 72px;
    margin-left: calc(13px + 24px + 4px); /* alinea con el titulo */
  }

  .vend-ben-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2px;
  }

  .vend-ben-card {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.05);
    padding: 40px 36px;
    position: relative;
    overflow: hidden;
    transition: background 0.3s ease, border-color 0.3s ease;
    cursor: default;
  }

  .vend-ben-card:hover {
    background: rgba(255,255,255,0.045);
    border-color: rgba(255,255,255,0.1);
  }

  .vend-ben-card:hover .vend-ben-card-glow {
    opacity: 1;
  }

  .vend-ben-card-glow {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 2px;
    background: linear-gradient(90deg, #00f3ff, #a855f7);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .vend-ben-card-tag {
    display: inline-block;
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #00f3ff;
    background: rgba(0,243,255,0.07);
    border: 1px solid rgba(0,243,255,0.15);
    border-radius: 3px;
    padding: 4px 10px;
    margin-bottom: 24px;
    font-weight: 600;
  }

  .vend-ben-card-idx {
    position: absolute;
    top: 32px;
    right: 32px;
    font-family: 'Syne', sans-serif;
    font-size: 48px;
    font-weight: 800;
    color: rgba(255,255,255,0.03);
    line-height: 1;
  }

  .vend-ben-card-title {
    font-family: 'Syne', sans-serif;
    font-size: 20px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 12px;
    line-height: 1.2;
  }

  .vend-ben-card-desc {
    font-size: 14px;
    color: rgba(255,255,255,0.38);
    line-height: 1.75;
  }

  /* ── FAQ ── */
  .vend-faq {
    background: #050505;
    padding: 120px 8%;
    border-top: 1px solid rgba(255,255,255,0.05);
  }

  .vend-faq-inner {
    max-width: 800px;
    margin: 0 auto;
  }

  .vend-faq-list {
    margin-top: 64px;
    display: flex;
    flex-direction: column;
  }

  .vend-faq-item {
    border-bottom: 1px solid rgba(255,255,255,0.06);
    overflow: hidden;
  }

  .vend-faq-q {
    width: 100%;
    background: transparent;
    border: none;
    padding: 28px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 17px;
    font-weight: 600;
    color: #fff;
    text-align: left;
    gap: 20px;
    transition: color 0.2s ease;
  }

  .vend-faq-q:hover { color: #00f3ff; }

  .vend-faq-icon {
    width: 28px; height: 28px;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 18px;
    color: rgba(255,255,255,0.4);
    transition: all 0.3s ease;
    line-height: 1;
  }

  .vend-faq-item.open .vend-faq-icon {
    border-color: #00f3ff;
    color: #00f3ff;
    transform: rotate(45deg);
    background: rgba(0,243,255,0.08);
  }

  .vend-faq-a {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.4s ease, padding 0.3s ease;
    font-size: 15px;
    color: rgba(255,255,255,0.45);
    line-height: 1.75;
    padding: 0;
  }

  .vend-faq-item.open .vend-faq-a {
    max-height: 200px;
    padding-bottom: 24px;
  }

  /* ── GARANTIAS STRIP ── */
  .vend-garantias {
    background: #050505;
    border-top: 1px solid rgba(255,255,255,0.05);
    border-bottom: 1px solid rgba(255,255,255,0.05);
    padding: 80px 8%;
  }

  .vend-garantias-header {
    text-align: center;
    margin-bottom: 56px;
  }

  .vend-garantias-label {
    font-size: 11px;
    letter-spacing: 5px;
    color: #00f3ff;
    text-transform: uppercase;
    opacity: 0.7;
    margin-bottom: 14px;
  }

  .vend-garantias-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(28px, 3.5vw, 48px);
    font-weight: 800;
    color: #fff;
  }

  .vend-garantias-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }

  .vend-garantia-card {
    background: rgba(0,243,255,0.03);
    border: 1px solid rgba(0,243,255,0.12);
    border-radius: 16px;
    padding: 32px 28px;
    position: relative;
    overflow: hidden;
    transition: background 0.3s ease, border-color 0.3s ease;
  }

  .vend-garantia-card:hover {
    background: rgba(0,243,255,0.06);
    border-color: rgba(0,243,255,0.25);
  }

  .vend-garantia-card.destacada {
    background: rgba(0,243,255,0.06);
    border-color: rgba(0,243,255,0.3);
    box-shadow: 0 0 40px rgba(0,243,255,0.06);
  }

  .vend-garantia-check {
    width: 36px; height: 36px;
    border-radius: 50%;
    background: rgba(0,243,255,0.1);
    border: 1px solid rgba(0,243,255,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: #00f3ff;
    margin-bottom: 20px;
    font-weight: 700;
  }

  .vend-garantia-titulo {
    font-family: 'Syne', sans-serif;
    font-size: 17px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 10px;
    line-height: 1.2;
  }

  .vend-garantia-desc {
    font-size: 13px;
    color: rgba(255,255,255,0.4);
    line-height: 1.65;
  }

  .vend-garantia-card.destacada .vend-garantia-titulo {
    color: #00f3ff;
  }

  /* ── CTA FINAL ── */
  .vend-cta {
    padding: 160px 8%;
    position: relative;
    overflow: hidden;
    text-align: center;
  }

  .vend-cta::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, #00f3ff, transparent);
  }

  .vend-cta::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(168,85,247,0.5), transparent);
  }

  .vend-cta-bg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(0,243,255,0.04) 0%, transparent 70%);
    pointer-events: none;
  }

  .vend-cta-inner {
    position: relative;
    z-index: 1;
    max-width: 720px;
    margin: 0 auto;
  }

  .vend-cta-tag {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-size: 11px;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: rgba(0,243,255,0.7);
    border: 1px solid rgba(0,243,255,0.2);
    padding: 7px 16px;
    border-radius: 4px;
    font-weight: 600;
    margin-bottom: 40px;
  }

  .vend-cta-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(48px, 7vw, 96px);
    font-weight: 800;
    line-height: 0.95;
    letter-spacing: -2px;
    margin-bottom: 28px;
  }

  .vend-cta-title .cyan { color: #00f3ff; }

  .vend-cta-desc {
    font-size: 17px;
    color: rgba(255,255,255,0.4);
    line-height: 1.7;
    margin-bottom: 52px;
    max-width: 520px;
    margin-left: auto;
    margin-right: auto;
  }

  .vend-cta-btn {
    display: inline-block;
    padding: 18px 52px;
    background: #00f3ff;
    border: none;
    border-radius: 12px;
    color: #000;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    font-family: 'Space Grotesk', sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    transition: all 0.3s ease;
  }

  .vend-cta-btn:hover {
    background: #fff;
    transform: translateY(-2px);
    box-shadow: 0 12px 30px rgba(0,243,255,0.35);
  }

  .vend-cta-note {
    margin-top: 20px;
    font-size: 12px;
    color: rgba(255,255,255,0.2);
    letter-spacing: 1px;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 900px) {
    .vend-numeros { grid-template-columns: 1fr; }
    .vend-numero-item { border-right: none; border-bottom: 1px solid rgba(0,0,0,0.15); }
    .vend-pasos { grid-template-columns: 1fr; }
    .vend-paso { border-left: none; border-top: 1px solid rgba(255,255,255,0.06); }
    .vend-calc-inner { grid-template-columns: 1fr; gap: 60px; }
    .vend-ben-grid { grid-template-columns: 1fr; }
    .vend-ben-subtitle { margin-left: 0; }
    .vend-garantias-grid { grid-template-columns: 1fr 1fr; }
  }
`

function Vendedores() {
  const navigate = useNavigate()
  const [ventas, setVentas] = useState(3)
  const [faqOpen, setFaqOpen] = useState(null)

  const comisionPromedio = 110
  const ganancia = ventas * comisionPromedio

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="vend-page">
      <style>{styles}</style>

      {/* HERO */}
      <section className="vend-hero">
        <div className="vend-hero-bg-text">VENDE</div>
        <div className="vend-hero-content">
          <div className="vend-hero-tag">
            <div className="vend-hero-tag-dot" />
            Únete al equipo
          </div>
          <h1 className="vend-hero-title">
            <span className="line-white">Gana dinero</span>
            <span className="line-cyan">vendiendo webs.</span>
            <span className="line-dim">Sin código.</span>
          </h1>
          <div className="vend-hero-bottom">
            <p className="vend-hero-desc">
              Únete a la red de vendedores de Synkro. Tú vendes, nosotros construimos.
              Comisiones de hasta 30% por cada proyecto cerrado. Cero inversión, cero riesgo.
            </p>
            <button className="vend-btn-main" onClick={() => scrollToSection('unirse')}>
              Quiero unirme
            </button>
          </div>
        </div>
        <div className="vend-hero-scroll">
          <div className="vend-hero-scroll-line" />
          Scroll
        </div>
      </section>

      {/* NUMEROS */}
      <div className="vend-numeros">
        {[
          { num: "30%", label: "Comisión máxima por venta" },
          { num: "50+", label: "Proyectos disponibles ahora" },
          { num: "48h", label: "Tiempo de pago garantizado" },
        ].map((n, i) => (
          <div className="vend-numero-item" key={i}>
            <div className="vend-numero-num">{n.num}</div>
            <div className="vend-numero-label">{n.label}</div>
          </div>
        ))}
      </div>

      {/* COMO FUNCIONA */}
      <section className="vend-como">
        <div className="vend-section-header">
          <span className="vend-section-num">001</span>
          <h2 className="vend-section-title">Cómo funciona<br />en 3 pasos</h2>
        </div>
        <div className="vend-pasos">
          {pasos.map((p) => (
            <div className="vend-paso" key={p.num}>
              <div className="vend-paso-line" />
              <div className="vend-paso-num">{p.num}</div>
              <div className="vend-paso-title">{p.title}</div>
              <div className="vend-paso-desc">{p.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CALCULADORA */}
      <section className="vend-calc">
        <div className="vend-calc-inner">
          <div className="vend-calc-left">
            <div className="vend-section-header" style={{ marginBottom: 0 }}>
              <span className="vend-section-num">002</span>
              <h2 className="vend-section-title">Cuánto puedes<br />ganar al mes</h2>
            </div>
            <div className="vend-calc-slider-wrap">
              <div className="vend-calc-label">
                <span className="vend-calc-label-text">Ventas por mes</span>
                <span className="vend-calc-label-val">{ventas} {ventas === 1 ? "venta" : "ventas"}</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                value={ventas}
                onChange={(e) => setVentas(Number(e.target.value))}
                className="vend-slider"
              />
              <div className="vend-calc-breakdown">
                <div className="vend-calc-row">
                  <span>Ventas al mes</span>
                  <span>{ventas}</span>
                </div>
                <div className="vend-calc-row">
                  <span>Comisión promedio por venta</span>
                  <span>S/. {comisionPromedio}</span>
                </div>
                <div className="vend-calc-row">
                  <span>Ganancia estimada</span>
                  <span>S/. {ganancia.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="vend-calc-right">
            <div className="vend-calc-result-label">Ganancia mensual estimada</div>
            <div className="vend-calc-result">S/.{ganancia.toLocaleString()}</div>
            <div className="vend-calc-result-mes">por mes</div>
            <button className="vend-btn-main" onClick={() => scrollToSection('unirse')}>
              Empezar ahora
            </button>
          </div>
        </div>
      </section>

      {/* BENEFICIOS — NUEVO LAYOUT: título arriba, grid 3x2 abajo */}
      <section className="vend-beneficios">
        <div className="vend-ben-header">
          <span className="vend-section-num">003</span>
          <h2 className="vend-section-title">Por qué trabajar<br />con Synkro</h2>
        </div>
        <p className="vend-ben-subtitle">
          No necesitas invertir nada. Solo enfócate en vender — nosotros ponemos todo lo demás.
        </p>
        <div className="vend-ben-grid">
          {beneficios.map((b, i) => (
            <div className="vend-ben-card" key={i}>
              <div className="vend-ben-card-glow" />
              <div className="vend-ben-card-idx">{String(i + 1).padStart(2, "0")}</div>
              <div className="vend-ben-card-tag">{b.tag}</div>
              <div className="vend-ben-card-title">{b.title}</div>
              <div className="vend-ben-card-desc">{b.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="vend-faq">
        <div className="vend-faq-inner">
          <div className="vend-section-header">
            <span className="vend-section-num">004</span>
            <h2 className="vend-section-title">Preguntas<br />frecuentes</h2>
          </div>
          <div className="vend-faq-list">
            {faqs.map((f, i) => (
              <div key={i} className={`vend-faq-item ${faqOpen === i ? "open" : ""}`}>
                <button className="vend-faq-q" onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
                  {f.q}
                  <div className="vend-faq-icon">+</div>
                </button>
                <div className="vend-faq-a">{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GARANTIAS */}
      <section className="vend-garantias">
        <div className="vend-garantias-header">
          <p className="vend-garantias-label">Por qué unirte ahora</p>
          <h2 className="vend-garantias-title">Todo lo que necesitas.<br />Nada que perder.</h2>
        </div>
        <div className="vend-garantias-grid">
          <div className="vend-garantia-card">
            <div className="vend-garantia-check">✓</div>
            <div className="vend-garantia-titulo">Sin experiencia técnica</div>
            <div className="vend-garantia-desc">No necesitas saber código ni diseño. Solo hablar con personas y presentar el producto.</div>
          </div>
          <div className="vend-garantia-card destacada">
            <div className="vend-garantia-check">✓</div>
            <div className="vend-garantia-titulo">Cero inversión. Cero riesgo.</div>
            <div className="vend-garantia-desc">No pagas nada para empezar. Ni suscripción, ni herramientas, ni materiales. El único costo es tu tiempo.</div>
          </div>
          <div className="vend-garantia-card">
            <div className="vend-garantia-check">✓</div>
            <div className="vend-garantia-titulo">Primer pago en 48h</div>
            <div className="vend-garantia-desc">Una vez confirmada la venta, tu comisión llega en menos de 48 horas. Sin esperas largas.</div>
          </div>
          <div className="vend-garantia-card">
            <div className="vend-garantia-check">✓</div>
            <div className="vend-garantia-titulo">Soporte desde el día uno</div>
            <div className="vend-garantia-desc">Tienes acceso directo al equipo desde el primer momento. Nunca vendes solo.</div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="vend-cta" id="unirse">
        <div className="vend-cta-bg" />
        <div className="vend-cta-inner">
          <div className="vend-cta-tag">
            <div className="vend-hero-tag-dot" style={{ background: '#00f3ff' }} />
            Sin inversión · Sin código · Sin excusas
          </div>
          <h2 className="vend-cta-title">
            Empieza a ganar<br /><span className="cyan">hoy mismo.</span>
          </h2>
          <p className="vend-cta-desc">
            Completa tu solicitud en 2 minutos y te contactamos en menos de 24 horas
            con acceso completo al catálogo y todo lo que necesitas para tu primera venta.
          </p>
          <button className="vend-cta-btn" onClick={() => navigate('/register')}>
            Quiero ser vendedor →
          </button>
          <p className="vend-cta-note">Te contactamos en menos de 24 horas</p>
        </div>
      </section>
    </div>
  )
}

export default Vendedores