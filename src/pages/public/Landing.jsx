import CiudadDigital from "../../components/shared/CiudadDigital"
import { useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react"

const servicios = [
  {
    title: "E-commerce",
    desc: "Tiendas online completas con carrito de compras, pasarela de pagos y gestión de inventario en tiempo real.",
    bg: "linear-gradient(135deg, #000810 0%, #001830 100%)",
    accent: "#00f3ff",
    num: "01",
    tag: "VENDE EN LINEA"
  },
  {
    title: "Restaurantes",
    desc: "Menú digital interactivo, sistema de reservas online y gestión de pedidos integrado para tu negocio gastronómico.",
    bg: "linear-gradient(135deg, #0d0010 0%, #1a0030 100%)",
    accent: "#a855f7",
    num: "02",
    tag: "GASTRONOMIA DIGITAL"
  },
  {
    title: "Corporativas",
    desc: "Sitios profesionales de alto impacto que transmiten autoridad, confianza y posicionan tu marca en el mercado.",
    bg: "linear-gradient(135deg, #000820 0%, #001050 100%)",
    accent: "#3b82f6",
    num: "03",
    tag: "PRESENCIA EMPRESARIAL"
  },
  {
    title: "Landing Pages",
    desc: "Páginas de conversión diseñadas estratégicamente para capturar leads y maximizar tus ventas online.",
    bg: "linear-gradient(135deg, #100800 0%, #301800 100%)",
    accent: "#f97316",
    num: "04",
    tag: "CONVERSION MAXIMA"
  },
  {
    title: "Inmobiliarias",
    desc: "Catálogos de propiedades con filtros avanzados, galería de imágenes y formularios de contacto integrados.",
    bg: "linear-gradient(135deg, #001008 0%, #002818 100%)",
    accent: "#10b981",
    num: "05",
    tag: "SECTOR INMOBILIARIO"
  },
  {
    title: "Salud y Bienestar",
    desc: "Plataformas para clínicas y consultorios con agenda online, historial de pacientes y portal de resultados.",
    bg: "linear-gradient(135deg, #100010 0%, #280028 100%)",
    accent: "#ec4899",
    num: "06",
    tag: "SECTOR SALUD"
  },
]

const stats = [
  { num: "50+", label: "Proyectos entregados" },
  { num: "98%", label: "Clientes satisfechos" },
  { num: "24h", label: "Tiempo de respuesta" },
  { num: "3+", label: "Anos de experiencia" },
]

const razones = [
  { num: "01", title: "Diseño que convierte", desc: "Cada pixel tiene un propósito. Interfaces que generan confianza desde el primer segundo y guían al usuario hacia la acción." },
  { num: "02", title: "Velocidad extrema", desc: "Sitios optimizados para cargar en menos de 2 segundos. Google te premia, tus clientes no esperan." },
  { num: "03", title: "Panel de control propio", desc: "Administra productos, precios y contenido sin tocar una línea de código. Tu negocio, tus manos." },
  { num: "04", title: "Soporte real y continuo", desc: "No desaparecemos después de entregar. Estamos contigo en cada actualización, mejora y duda." },
]

const testimonios = [
  { texto: "El sitio que crearon para mi negocio es increible. Mis ventas aumentaron un 30% en el primer mes.", autor: "Juan Perez", rol: "CEO — Empresa Tech" },
  { texto: "Profesionales de verdad. Entregaron exactamente lo que prometieron y en el tiempo acordado.", autor: "Maria Lopez", rol: "Dueña — Restaurante El Sabor" },
  { texto: "El panel de administracion es tan sencillo que yo mismo manejo todo sin ayuda tecnica.", autor: "Carlos Rodriguez", rol: "Director — Inmobiliaria CR" },
]

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');

  .landing {
    position: relative;
    background: #000;
    color: #fff;
    overflow-x: hidden;
    font-family: 'Space Grotesk', sans-serif;
  }

  /* ── HERO ── */
  .hero {
    position: relative;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 65px 20px 0;
    overflow: hidden;
  }

  .hero-tag {
    font-size: 11px;
    letter-spacing: 5px;
    color: #00f3ff;
    text-transform: uppercase;
    margin-bottom: 24px;
    opacity: 0.7;
    animation: fadeUp 0.8s ease forwards;
  }

  .hero-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(42px, 7vw, 76px);
    font-weight: 800;
    line-height: 1.0;
    margin-bottom: 28px;
    background: linear-gradient(135deg, #ffffff 0%, #00f3ff 40%, #8a2be2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: fadeUp 0.8s 0.15s ease both;
  }

  .hero-subtitle {
    font-size: clamp(15px, 1.8vw, 20px);
    color: rgba(255,255,255,0.5);
    max-width: 560px;
    line-height: 1.7;
    margin-bottom: 44px;
    animation: fadeUp 0.8s 0.3s ease both;
  }

  .hero-btns {
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
    justify-content: center;
    animation: fadeUp 0.8s 0.45s ease both;
  }

  .btn-primary {
    padding: 14px 36px;
    background: linear-gradient(45deg, #00f3ff, #0066ff);
    border: none;
    border-radius: 50px;
    color: #000;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: 'Space Grotesk', sans-serif;
    letter-spacing: 0.5px;
  }

  .btn-primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(0, 243, 255, 0.45);
  }

  .btn-secondary {
    padding: 14px 36px;
    background: transparent;
    border: 1px solid rgba(0, 243, 255, 0.4);
    border-radius: 50px;
    color: #00f3ff;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: 'Space Grotesk', sans-serif;
  }

  .btn-secondary:hover {
    background: rgba(0, 243, 255, 0.08);
    transform: translateY(-3px);
    border-color: #00f3ff;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 1; }
  }

  /* ── TICKER ── */
  .ticker {
    position: relative;
    z-index: 1;
    overflow: hidden;
    border-top: 1px solid rgba(0,243,255,0.15);
    border-bottom: 1px solid rgba(0,243,255,0.15);
    background: rgba(0,243,255,0.03);
    padding: 14px 0;
  }

  .ticker-track {
    display: flex;
    gap: 60px;
    animation: ticker 20s linear infinite;
    white-space: nowrap;
  }

  .ticker-item {
    font-size: 12px;
    letter-spacing: 3px;
    color: rgba(0,243,255,0.6);
    text-transform: uppercase;
    flex-shrink: 0;
  }

  .ticker-dot {
    display: inline-block;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #00f3ff;
    margin-right: 60px;
    vertical-align: middle;
  }

  @keyframes ticker {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }

  /* ── SERVICIOS SLIDER ── */
  .servicios-slider {
    position: relative;
    height: 100vh;
    overflow: hidden;
  }

  .slider-track {
    display: flex;
    height: 100%;
    transition: transform 0.8s cubic-bezier(0.77, 0, 0.175, 1);
  }

  .slider-slide {
    min-width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 10%;
    position: relative;
    overflow: hidden;
  }

  .slide-bg-num {
    position: absolute;
    right: 5%;
    bottom: -5%;
    font-family: 'Syne', sans-serif;
    font-size: clamp(160px, 20vw, 280px);
    font-weight: 800;
    opacity: 0.04;
    color: #fff;
    user-select: none;
    pointer-events: none;
    line-height: 1;
  }

  .slide-content {
    max-width: 620px;
    z-index: 2;
  }

  .slide-tag {
    display: inline-block;
    font-size: 10px;
    letter-spacing: 4px;
    padding: 6px 14px;
    border-radius: 50px;
    margin-bottom: 24px;
    font-weight: 600;
    border: 1px solid currentColor;
    opacity: 0.8;
  }

  .slide-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(40px, 6vw, 80px);
    font-weight: 800;
    line-height: 1.05;
    margin-bottom: 24px;
  }

  .slide-desc {
    font-size: 17px;
    color: rgba(255,255,255,0.55);
    line-height: 1.75;
    max-width: 480px;
    margin-bottom: 40px;
  }

  .slide-cta {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .slide-counter {
    font-size: 13px;
    color: rgba(255,255,255,0.3);
    letter-spacing: 2px;
  }

  .slider-controls {
    position: absolute;
    bottom: 40px;
    right: 10%;
    display: flex;
    align-items: center;
    gap: 12px;
    z-index: 3;
  }

  .slider-btn {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.15);
    color: #fff;
    font-size: 18px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }

  .slider-btn:hover {
    background: rgba(0,243,255,0.1);
    border-color: #00f3ff;
    color: #00f3ff;
  }

  .slider-progress-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    background: linear-gradient(90deg, #00f3ff, #8a2be2);
    transition: width 0.8s cubic-bezier(0.77, 0, 0.175, 1);
    z-index: 3;
  }

  .slide-dots {
    position: absolute;
    bottom: 44px;
    left: 10%;
    display: flex;
    gap: 8px;
    z-index: 3;
  }

  .slide-dot {
    height: 2px;
    border-radius: 2px;
    background: rgba(255,255,255,0.2);
    cursor: pointer;
    transition: all 0.4s ease;
    width: 20px;
  }

  .slide-dot.active {
    width: 40px;
    background: #00f3ff;
  }

  /* ── RAZONES ── */
  .razones-section {
    position: relative;
    z-index: 1;
    padding: 120px 8%;
  }

  .razones-header {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: end;
    margin-bottom: 80px;
  }

  .section-label {
    font-size: 11px;
    letter-spacing: 4px;
    color: #00f3ff;
    text-transform: uppercase;
    margin-bottom: 16px;
    opacity: 0.7;
  }

  .section-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(28px, 3.5vw, 52px);
    font-weight: 800;
    line-height: 1.1;
    color: #fff;
  }

  .section-desc {
    font-size: 16px;
    color: rgba(255,255,255,0.45);
    line-height: 1.7;
    max-width: 420px;
    align-self: end;
  }

  .razones-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2px;
    background: rgba(0,243,255,0.06);
    border: 1px solid rgba(0,243,255,0.08);
    border-radius: 20px;
    overflow: hidden;
  }

  .razon-card {
    background: #000;
    padding: 48px;
    position: relative;
    cursor: default;
    transition: background 0.3s ease;
    overflow: hidden;
  }

  .razon-card::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 0% 100%, rgba(0,243,255,0.06) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  .razon-card:hover {
    background: #020d15;
  }

  .razon-card:hover::after {
    opacity: 1;
  }

  .razon-num {
    font-family: 'Syne', sans-serif;
    font-size: 11px;
    letter-spacing: 3px;
    color: rgba(0,243,255,0.4);
    margin-bottom: 20px;
  }

  .razon-card h3 {
    font-family: 'Syne', sans-serif;
    font-size: 22px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 14px;
  }

  .razon-card p {
    font-size: 15px;
    color: rgba(255,255,255,0.45);
    line-height: 1.7;
  }

  .razon-line {
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #00f3ff, transparent);
    transition: width 0.4s ease;
  }

  .razon-card:hover .razon-line {
    width: 100%;
  }

  /* ── STATS ── */
  .stats-section {
    position: relative;
    z-index: 1;
    padding: 80px 8%;
    border-top: 1px solid rgba(0,243,255,0.08);
    border-bottom: 1px solid rgba(0,243,255,0.08);
    overflow: hidden;
  }

  .stats-section::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    height: 300px;
    background: radial-gradient(ellipse, rgba(0,243,255,0.04) 0%, transparent 70%);
    pointer-events: none;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0;
    position: relative;
  }

  .stat-item {
    padding: 40px;
    text-align: center;
    border-right: 1px solid rgba(0,243,255,0.08);
    position: relative;
    transition: background 0.3s ease;
  }

  .stat-item:last-child {
    border-right: none;
  }

  .stat-item:hover {
    background: rgba(0,243,255,0.03);
  }

  .stat-number {
    font-family: 'Syne', sans-serif;
    font-size: clamp(48px, 5vw, 72px);
    font-weight: 800;
    background: linear-gradient(135deg, #00f3ff, #8a2be2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1;
    margin-bottom: 12px;
  }

  .stat-label {
    font-size: 12px;
    color: rgba(255,255,255,0.35);
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  /* ── TESTIMONIOS ── */
  .testimonios-section {
    position: relative;
    z-index: 1;
    padding: 120px 8%;
    overflow: hidden;
  }

  .testimonios-header {
    margin-bottom: 64px;
  }

  .testimonios-track-wrap {
    overflow: hidden;
    position: relative;
  }

  .testimonios-track-wrap::before,
  .testimonios-track-wrap::after {
    content: '';
    position: absolute;
    top: 0;
    width: 120px;
    height: 100%;
    z-index: 2;
    pointer-events: none;
  }

  .testimonios-track-wrap::before {
    left: 0;
    background: linear-gradient(90deg, #000, transparent);
  }

  .testimonios-track-wrap::after {
    right: 0;
    background: linear-gradient(-90deg, #000, transparent);
  }

  .testimonios-track {
    display: flex;
    gap: 24px;
    animation: slideTestimonios 18s linear infinite;
    width: max-content;
  }

  .testimonios-track:hover {
    animation-play-state: paused;
  }

  @keyframes slideTestimonios {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }

  .testimonio-card {
    background: rgba(0,10,20,0.8);
    border: 1px solid rgba(0,243,255,0.1);
    border-radius: 16px;
    padding: 32px;
    width: 360px;
    flex-shrink: 0;
    transition: border-color 0.3s ease, transform 0.3s ease;
  }

  .testimonio-card:hover {
    border-color: rgba(0,243,255,0.35);
    transform: translateY(-4px);
  }

  .testimonio-stars {
    color: #00f3ff;
    font-size: 14px;
    letter-spacing: 4px;
    margin-bottom: 16px;
  }

  .testimonio-texto {
    font-size: 15px;
    color: rgba(255,255,255,0.6);
    line-height: 1.75;
    margin-bottom: 24px;
    font-style: italic;
  }

  .testimonio-autor {
    font-size: 14px;
    font-weight: 700;
    color: #fff;
  }

  .testimonio-rol {
    font-size: 12px;
    color: #00f3ff;
    margin-top: 4px;
    opacity: 0.7;
  }

  /* ── TRABAJA CON NOSOTROS ── */
  .vendor-section {
    position: relative;
    z-index: 1;
    padding: 120px 8%;
  }

  .vendor-inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
    background: rgba(0,5,15,0.6);
    border: 1px solid rgba(0,243,255,0.12);
    border-radius: 24px;
    padding: 80px;
    position: relative;
    overflow: hidden;
  }

  .vendor-inner::before {
    content: '';
    position: absolute;
    top: -100px;
    right: -100px;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(138,43,226,0.08) 0%, transparent 60%);
    pointer-events: none;
  }

  .vendor-inner::after {
    content: '';
    position: absolute;
    bottom: -100px;
    left: -100px;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(0,243,255,0.06) 0%, transparent 60%);
    pointer-events: none;
  }

  .vendor-left h2 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(32px, 3.5vw, 52px);
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 20px;
    color: #fff;
  }

  .vendor-left p {
    font-size: 16px;
    color: rgba(255,255,255,0.45);
    line-height: 1.7;
    margin-bottom: 36px;
  }

  .vendor-benefits {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .vendor-benefit {
    display: flex;
    align-items: center;
    gap: 14px;
    font-size: 15px;
    color: rgba(255,255,255,0.7);
  }

  .vendor-benefit-bar {
    width: 28px;
    height: 2px;
    background: linear-gradient(90deg, #00f3ff, #8a2be2);
    flex-shrink: 0;
  }

  .vendor-right {
    display: flex;
    flex-direction: column;
    gap: 16px;
    position: relative;
    z-index: 1;
  }

  .vendor-stat-card {
    background: rgba(0,243,255,0.04);
    border: 1px solid rgba(0,243,255,0.1);
    border-radius: 14px;
    padding: 24px 28px;
    display: flex;
    align-items: center;
    gap: 20px;
    transition: all 0.3s ease;
    cursor: default;
  }

  .vendor-stat-card:hover {
    background: rgba(0,243,255,0.08);
    border-color: rgba(0,243,255,0.3);
    transform: translateX(8px);
  }

  .vendor-stat-num {
    font-family: 'Syne', sans-serif;
    font-size: 32px;
    font-weight: 800;
    color: #00f3ff;
    line-height: 1;
    min-width: 80px;
  }

  .vendor-stat-label {
    font-size: 14px;
    color: rgba(255,255,255,0.5);
    line-height: 1.4;
  }

  /* ── DIVIDER ── */
  .divider {
    position: relative;
    z-index: 1;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(0,243,255,0.2), transparent);
    margin: 0 8%;
  }
`

function Landing() {
  const navigate = useNavigate()
  const [slide, setSlide] = useState(0)
  const autoRef = useRef(null)

  const prev = () => setSlide((s) => (s === 0 ? servicios.length - 1 : s - 1))
  const next = () => setSlide((s) => (s === servicios.length - 1 ? 0 : s + 1))

  useEffect(() => {
    autoRef.current = setInterval(next, 5000)
    return () => clearInterval(autoRef.current)
  }, [])

  const resetAuto = (fn) => {
    clearInterval(autoRef.current)
    fn()
    autoRef.current = setInterval(next, 5000)
  }

  const tickerItems = ["Diseño Web", "E-commerce", "Landing Pages", "Panel de Control", "Soporte 24/7", "SEO Optimizado", "Alta Velocidad", "Responsive"]
  const doubled = [...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems]

  const testimoniosDoubled = [...testimonios, ...testimonios, ...testimonios, ...testimonios]

  return (
    <div className="landing">
      <style>{styles}</style>

      {/* HERO */}
      <section className="hero">
        <CiudadDigital />
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.75) 100%)",
          zIndex: 1, pointerEvents: "none"
        }} />
        <p className="hero-tag" style={{ position: "relative", zIndex: 2 }}>Desarrollo Web Profesional</p>
        <h1 className="hero-title" style={{ position: "relative", zIndex: 2 }}>
          Tu negocio merece<br />una presencia digital<br />que impacte
        </h1>
        <p className="hero-subtitle" style={{ position: "relative", zIndex: 2 }}>
          Creamos sitios web modernos, rápidos y optimizados que convierten visitantes en clientes reales.
        </p>
        <div className="hero-btns" style={{ position: "relative", zIndex: 2 }}>
          <button className="btn-primary" onClick={() => navigate("/solicitud")}>Solicitar mi web</button>
          <button className="btn-secondary" onClick={() => navigate("/planes")}>Ver planes</button>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker">
        <div className="ticker-track">
          {doubled.map((item, i) => (
            <span key={i} className="ticker-item">
              {item}
              {i < doubled.length - 1 && <span className="ticker-dot" />}
            </span>
          ))}
        </div>
      </div>

      {/* SERVICIOS SLIDER */}
      <section className="servicios-slider">
        <div
          className="slider-progress-bar"
          style={{ width: `${((slide + 1) / servicios.length) * 100}%` }}
        />
        <div
          className="slider-track"
          style={{ transform: `translateX(-${slide * 100}%)` }}
        >
          {servicios.map((s, i) => (
            <div key={i} className="slider-slide" style={{ background: s.bg }}>
              <div className="slide-bg-num">{s.num}</div>
              <div className="slide-content">
                <span className="slide-tag" style={{ color: s.accent, borderColor: s.accent }}>{s.tag}</span>
                <h2 className="slide-title" style={{ color: s.accent }}>{s.title}</h2>
                <p className="slide-desc">{s.desc}</p>
                <div className="slide-cta">
                  <button className="btn-primary" onClick={() => navigate("/solicitud")}>
                    Solicitar este servicio
                  </button>
                  <span className="slide-counter">{String(i + 1).padStart(2, "0")} / {String(servicios.length).padStart(2, "0")}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="slide-dots">
          {servicios.map((_, i) => (
            <div
              key={i}
              className={`slide-dot ${i === slide ? "active" : ""}`}
              onClick={() => resetAuto(() => setSlide(i))}
            />
          ))}
        </div>

        <div className="slider-controls">
          <button className="slider-btn" onClick={() => resetAuto(prev)}>&#8592;</button>
          <button className="slider-btn" onClick={() => resetAuto(next)}>&#8594;</button>
        </div>
      </section>

      <div className="divider" />

      {/* POR QUE SYNKRO */}
      <section className="razones-section">
        <div className="razones-header">
          <div>
            <p className="section-label">Por que elegirnos</p>
            <h2 className="section-title">Construido para<br />hacer crecer<br />tu negocio</h2>
          </div>
          <p className="section-desc">No solo construimos sitios web. Construimos herramientas que trabajan por ti las 24 horas del dia.</p>
        </div>
        <div className="razones-grid">
          {razones.map((r, i) => (
            <div className="razon-card" key={i}>
              <div className="razon-line" />
              <div className="razon-num">{r.num}</div>
              <h3>{r.title}</h3>
              <p>{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <div className="stats-section">
        <div className="stats-grid">
          {stats.map((s, i) => (
            <div className="stat-item" key={i}>
              <div className="stat-number">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TESTIMONIOS AUTO-SCROLL */}
      <section className="testimonios-section">
        <div className="testimonios-header">
          <p className="section-label">Lo que dicen</p>
          <h2 className="section-title">Clientes que confiaron<br />en Synkro</h2>
        </div>
        <div className="testimonios-track-wrap">
          <div className="testimonios-track">
            {testimoniosDoubled.map((t, i) => (
              <div className="testimonio-card" key={i}>
                <div className="testimonio-stars">★★★★★</div>
                <p className="testimonio-texto">"{t.texto}"</p>
                <div className="testimonio-autor">{t.autor}</div>
                <div className="testimonio-rol">{t.rol}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* TRABAJA CON NOSOTROS */}
      <section className="vendor-section">
        <div className="vendor-inner">
          <div className="vendor-left">
            <p className="section-label">Oportunidad</p>
            <h2>Trabaja con<br />nosotros</h2>
            <p>Unete a nuestra red de vendedores y genera ingresos vendiendo sitios web. Sin experiencia tecnica requerida, solo actitud.</p>
            <div className="vendor-benefits">
              {[
                "Comisiones de hasta 30% por venta",
                "Proyectos listos para vender",
                "Sistema de ranking y premios mensuales",
                "Trabajo 100% remoto y flexible",
              ].map((text, i) => (
                <div className="vendor-benefit" key={i}>
                  <div className="vendor-benefit-bar" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
            <br />
            <button className="btn-primary" onClick={() => navigate("/vendedores")}>
              Quiero unirme
            </button>
          </div>
          <div className="vendor-right">
            {[
              { num: "30%", label: "Comision maxima por cada venta cerrada" },
              { num: "50+", label: "Proyectos disponibles para vender ahora mismo" },
              { num: "Top 10", label: "Vendedores con premios mensuales garantizados" },
              { num: "0 req.", label: "Experiencia tecnica requerida para empezar" },
            ].map((s, i) => (
              <div className="vendor-stat-card" key={i}>
                <div className="vendor-stat-num">{s.num}</div>
                <div className="vendor-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Landing