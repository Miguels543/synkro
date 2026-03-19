import { useNavigate } from "react-router-dom"

const valores = [
  {
    num: "01",
    title: "Transparencia",
    desc: "Sin letras pequeñas. Lo que ves es lo que recibes. Precios claros, tiempos reales, resultados honestos.",
    color: "#00f3ff",
  },
  {
    num: "02",
    title: "Innovación",
    desc: "No hacemos sitios del año 2010. Cada proyecto usa tecnología moderna, diseño actual y código limpio.",
    color: "#a855f7",
  },
  {
    num: "03",
    title: "Resultados",
    desc: "No vendemos promesas. Entregamos herramientas que funcionan y generan impacto real en tu negocio.",
    color: "#3b82f6",
  },
  {
    num: "04",
    title: "Compromiso",
    desc: "Tu proyecto no termina en la entrega. Estamos contigo en cada actualización, duda y mejora futura.",
    color: "#10b981",
  },
]

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');

  .nosotros-page {
    min-height: 100vh;
    background: #000;
    color: #fff;
    font-family: 'Space Grotesk', sans-serif;
    padding-top: 65px;
    overflow-x: hidden;
  }

  /* BG */
  .nos-bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;
  }

  .nos-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(0,243,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,243,255,0.02) 1px, transparent 1px);
    background-size: 60px 60px;
  }

  .nos-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
    opacity: 0.08;
  }

  .nos-orb-1 {
    width: 600px; height: 600px;
    background: #00f3ff;
    top: -200px; right: -100px;
    animation: nosOrb 10s ease-in-out infinite;
  }

  .nos-orb-2 {
    width: 500px; height: 500px;
    background: #a855f7;
    bottom: 20%; left: -150px;
    animation: nosOrb 13s ease-in-out infinite reverse;
  }

  @keyframes nosOrb {
    0%, 100% { transform: translate(0,0); }
    50% { transform: translate(40px, -30px); }
  }

  /* HERO */
  .nos-hero {
    position: relative;
    z-index: 1;
    padding: 100px 8% 80px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
  }

  .nos-label {
    font-size: 11px;
    letter-spacing: 5px;
    color: #00f3ff;
    text-transform: uppercase;
    opacity: 0.7;
    margin-bottom: 20px;
    display: block;
  }

  .nos-hero-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(36px, 4.5vw, 64px);
    font-weight: 800;
    line-height: 1.05;
    margin-bottom: 24px;
    color: #fff;
  }

  .nos-hero-title span {
    background: linear-gradient(135deg, #00f3ff, #a855f7);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .nos-hero-desc {
    font-size: 16px;
    color: rgba(255,255,255,0.45);
    line-height: 1.75;
    max-width: 440px;
  }

  .nos-hero-right {
    position: relative;
  }

  .nos-card-main {
    background: rgba(0,5,15,0.7);
    border: 1px solid rgba(0,243,255,0.15);
    border-radius: 24px;
    padding: 40px;
    backdrop-filter: blur(20px);
    position: relative;
    overflow: hidden;
  }

  .nos-card-main::before {
    content: '';
    position: absolute;
    top: -60px; right: -60px;
    width: 200px; height: 200px;
    background: radial-gradient(circle, rgba(0,243,255,0.08), transparent 70%);
    pointer-events: none;
  }

  .nos-card-year {
    font-family: 'Syne', sans-serif;
    font-size: 72px;
    font-weight: 800;
    color: rgba(0,243,255,0.08);
    line-height: 1;
    margin-bottom: 16px;
  }

  .nos-card-title {
    font-family: 'Syne', sans-serif;
    font-size: 20px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 12px;
  }

  .nos-card-desc {
    font-size: 14px;
    color: rgba(255,255,255,0.4);
    line-height: 1.7;
  }

  .nos-card-tag {
    display: inline-block;
    margin-top: 20px;
    font-size: 11px;
    letter-spacing: 2px;
    padding: 6px 14px;
    border-radius: 50px;
    background: rgba(0,243,255,0.08);
    border: 1px solid rgba(0,243,255,0.2);
    color: #00f3ff;
    text-transform: uppercase;
  }

  /* DIVIDER */
  .nos-divider {
    position: relative;
    z-index: 1;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(0,243,255,0.15), transparent);
    margin: 0 8%;
  }

  /* MISION VISION */
  .mv-section {
    position: relative;
    z-index: 1;
    padding: 100px 8%;
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }

  .mv-card {
    border-radius: 20px;
    padding: 48px 40px;
    position: relative;
    overflow: hidden;
    transition: transform 0.3s ease;
  }

  .mv-card:hover {
    transform: translateY(-6px);
  }

  .mv-card-1 {
    background: linear-gradient(135deg, #000d1a, #001530);
    border: 1px solid rgba(0,243,255,0.15);
  }

  .mv-card-2 {
    background: linear-gradient(135deg, #0d0018, #1a0030);
    border: 1px solid rgba(168,85,247,0.15);
  }

  .mv-card-icon {
    width: 48px; height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
  }

  .mv-card-label {
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    font-weight: 600;
    margin-bottom: 16px;
    opacity: 0.6;
  }

  .mv-card-title {
    font-family: 'Syne', sans-serif;
    font-size: 28px;
    font-weight: 800;
    color: #fff;
    margin-bottom: 16px;
    line-height: 1.2;
  }

  .mv-card-desc {
    font-size: 15px;
    color: rgba(255,255,255,0.45);
    line-height: 1.75;
  }

  .mv-deco {
    position: absolute;
    bottom: -40px; right: -40px;
    font-family: 'Syne', sans-serif;
    font-size: 120px;
    font-weight: 800;
    opacity: 0.04;
    color: #fff;
    line-height: 1;
    user-select: none;
    pointer-events: none;
  }

  /* EQUIPO */
  .equipo-section {
    position: relative;
    z-index: 1;
    padding: 100px 8%;
    max-width: 1200px;
    margin: 0 auto;
  }

  .equipo-header {
    margin-bottom: 60px;
  }

  .section-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(28px, 3.5vw, 48px);
    font-weight: 800;
    color: #fff;
    margin-top: 12px;
  }

  .equipo-card {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 48px;
    align-items: center;
    background: rgba(0,5,15,0.6);
    border: 1px solid rgba(0,243,255,0.1);
    border-radius: 24px;
    padding: 48px;
    position: relative;
    overflow: hidden;
    max-width: 700px;
    transition: border-color 0.3s ease;
  }

  .equipo-card:hover {
    border-color: rgba(0,243,255,0.25);
  }

  .equipo-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    right: 0; height: 2px;
    background: linear-gradient(90deg, #00f3ff, #a855f7, transparent);
  }

  .equipo-avatar {
    width: 100px; height: 100px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(0,243,255,0.15), rgba(168,85,247,0.15));
    border: 2px solid rgba(0,243,255,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    position: relative;
  }

  .equipo-avatar-initials {
    font-family: 'Syne', sans-serif;
    font-size: 32px;
    font-weight: 800;
    background: linear-gradient(135deg, #00f3ff, #a855f7);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .equipo-avatar-dot {
    position: absolute;
    bottom: 4px; right: 4px;
    width: 14px; height: 14px;
    border-radius: 50%;
    background: #10b981;
    border: 2px solid #000;
  }

  .equipo-name {
    font-family: 'Syne', sans-serif;
    font-size: 28px;
    font-weight: 800;
    color: #fff;
    margin-bottom: 6px;
  }

  .equipo-rol {
    font-size: 13px;
    color: #00f3ff;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 16px;
    opacity: 0.8;
  }

  .equipo-desc {
    font-size: 15px;
    color: rgba(255,255,255,0.45);
    line-height: 1.7;
    margin-bottom: 24px;
  }

  .equipo-tags {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .equipo-tag {
    font-size: 12px;
    padding: 5px 12px;
    border-radius: 50px;
    background: rgba(0,243,255,0.07);
    border: 1px solid rgba(0,243,255,0.15);
    color: rgba(255,255,255,0.6);
  }

  /* VALORES */
  .valores-section {
    position: relative;
    z-index: 1;
    padding: 100px 8%;
    max-width: 1200px;
    margin: 0 auto;
  }

  .valores-header {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: end;
    margin-bottom: 64px;
  }

  .valores-header-desc {
    font-size: 16px;
    color: rgba(255,255,255,0.4);
    line-height: 1.75;
    align-self: end;
  }

  .valores-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2px;
    background: rgba(255,255,255,0.04);
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.05);
  }

  .valor-card {
    background: #000;
    padding: 44px;
    position: relative;
    overflow: hidden;
    transition: background 0.3s ease;
    cursor: default;
  }

  .valor-card:hover {
    background: #030d18;
  }

  .valor-line {
    position: absolute;
    top: 0; left: 0;
    width: 0; height: 2px;
    transition: width 0.4s ease;
  }

  .valor-card:hover .valor-line {
    width: 100%;
  }

  .valor-num {
    font-family: 'Syne', sans-serif;
    font-size: 11px;
    letter-spacing: 3px;
    margin-bottom: 20px;
    opacity: 0.4;
  }

  .valor-title {
    font-family: 'Syne', sans-serif;
    font-size: 22px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 12px;
    transition: color 0.3s ease;
  }

  .valor-desc {
    font-size: 14px;
    color: rgba(255,255,255,0.4);
    line-height: 1.75;
  }

  /* CTA — sin tocar */
  .nos-cta {
    position: relative;
    z-index: 1;
    padding: 80px 8% 120px;
    text-align: center;
  }

  .nos-cta-inner {
    max-width: 700px;
    margin: 0 auto;
    background: rgba(0,5,15,0.7);
    border: 1px solid rgba(0,243,255,0.12);
    border-radius: 24px;
    padding: 70px 48px;
    position: relative;
    overflow: hidden;
  }

  .nos-cta-inner::before {
    content: '';
    position: absolute;
    top: -80px; left: 50%;
    transform: translateX(-50%);
    width: 400px; height: 200px;
    background: radial-gradient(ellipse, rgba(0,243,255,0.07), transparent 70%);
    pointer-events: none;
  }

  .nos-cta-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(28px, 3.5vw, 46px);
    font-weight: 800;
    color: #fff;
    margin-bottom: 16px;
    position: relative;
    z-index: 1;
  }

  .nos-cta-desc {
    font-size: 16px;
    color: rgba(255,255,255,0.4);
    margin-bottom: 36px;
    line-height: 1.7;
    position: relative;
    z-index: 1;
  }

  .btn-primary {
    padding: 15px 40px;
    background: linear-gradient(45deg, #00f3ff, #0066ff);
    border: none;
    border-radius: 50px;
    color: #000;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: 'Space Grotesk', sans-serif;
    position: relative;
    z-index: 1;
  }

  .btn-primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 14px 35px rgba(0,243,255,0.35);
  }

  /* ══════════════════════════════════════
     RESPONSIVE — mismos breakpoints
     que Landing.jsx
  ══════════════════════════════════════ */

  /* ── TABLET ≤ 1024px ── */
  @media (max-width: 1024px) {
    .nos-hero {
      padding: 80px 6% 60px;
      gap: 48px;
    }

    .mv-section {
      padding: 80px 6%;
      gap: 20px;
    }

    .mv-card { padding: 36px 28px; }
    .mv-card-title { font-size: 22px; }

    .equipo-section { padding: 80px 6%; }

    .equipo-card {
      gap: 32px;
      padding: 36px;
    }

    .valores-section { padding: 80px 6%; }

    .valores-header { gap: 32px; margin-bottom: 48px; }

    .valor-card { padding: 32px; }

    .nos-divider { margin: 0 6%; }
  }

  /* ── MOBILE ≤ 768px ── */
  @media (max-width: 768px) {

    /* Hero — apilado */
    .nos-hero {
      grid-template-columns: 1fr;
      padding: 64px 6% 48px;
      gap: 36px;
    }

    .nos-hero-desc { font-size: 15px; max-width: 100%; }

    .nos-card-main { padding: 28px 24px; }
    .nos-card-year { font-size: 52px; }
    .nos-card-title { font-size: 17px; }
    .nos-card-desc  { font-size: 13px; }

    /* Mision / Vision — apilado */
    .mv-section {
      grid-template-columns: 1fr;
      padding: 64px 6%;
      gap: 16px;
    }

    .mv-card { padding: 32px 24px; border-radius: 16px; }
    .mv-card-title { font-size: 20px; }
    .mv-card-desc  { font-size: 14px; }
    .mv-deco       { font-size: 80px; }

    /* Equipo */
    .equipo-section { padding: 64px 6%; }

    .equipo-header  { margin-bottom: 36px; }

    .equipo-card {
      grid-template-columns: 1fr;
      gap: 24px;
      padding: 28px 24px;
      border-radius: 16px;
      max-width: 100%;
      text-align: center;
    }

    .equipo-avatar {
      width: 80px; height: 80px;
      margin: 0 auto;
    }

    .equipo-avatar-initials { font-size: 26px; }

    .equipo-name { font-size: 22px; }
    .equipo-rol  { font-size: 11px; }
    .equipo-desc { font-size: 14px; }

    .equipo-tags {
      justify-content: center;
    }

    /* Valores */
    .valores-section { padding: 64px 6%; }

    .valores-header {
      grid-template-columns: 1fr;
      gap: 16px;
      margin-bottom: 36px;
    }

    .valores-grid {
      grid-template-columns: 1fr;
      border-radius: 12px;
    }

    .valor-card   { padding: 32px 24px; }
    .valor-title  { font-size: 18px; }
    .valor-desc   { font-size: 13px; }

    /* Divider */
    .nos-divider { margin: 0 6%; }
  }

  /* ── MOBILE CHICO ≤ 480px ── */
  @media (max-width: 480px) {
    .nos-hero { padding: 48px 5% 36px; gap: 28px; }

    .nos-card-main  { padding: 22px 18px; }
    .nos-card-year  { font-size: 40px; }
    .nos-card-title { font-size: 16px; }

    .mv-section  { padding: 48px 5%; }
    .mv-card     { padding: 26px 20px; }
    .mv-card-title { font-size: 18px; }

    .equipo-section { padding: 48px 5%; }
    .equipo-card    { padding: 24px 18px; }
    .equipo-name    { font-size: 20px; }

    .valores-section { padding: 48px 5%; }
    .valor-card      { padding: 26px 20px; }
    .valor-title     { font-size: 17px; }

    .nos-divider { margin: 0 5%; }
  }
`

function Nosotros() {
  const navigate = useNavigate()

  return (
    <div className="nosotros-page">
      <style>{styles}</style>

      <div className="nos-bg">
        <div className="nos-grid" />
        <div className="nos-orb nos-orb-1" />
        <div className="nos-orb nos-orb-2" />
      </div>

      {/* HERO */}
      <div className="nos-hero">
        <div className="nos-hero-left">
          <span className="nos-label">Quienes somos</span>
          <h1 className="nos-hero-title">
            No somos una agencia.<br />
            Somos el equipo que<br />
            <span>tu negocio necesitaba.</span>
          </h1>
          <p className="nos-hero-desc">
            Synkro nació con una idea simple: que cualquier negocio, sin importar su tamaño,
            pueda tener una presencia digital profesional a un precio justo y con resultados reales.
          </p>
        </div>
        <div className="nos-hero-right">
          <div className="nos-card-main">
            <div className="nos-card-year">2024</div>
            <div className="nos-card-title">El origen de Synkro</div>
            <div className="nos-card-desc">
              Vimos negocios locales perdiendo clientes por no tener presencia digital,
              pagando fortunas a agencias que no entregaban resultados, o conformándose
              con plantillas genéricas que no representaban su marca. Decidimos cambiar eso.
            </div>
            <span className="nos-card-tag">Piura, Peru</span>
          </div>
        </div>
      </div>

      <div className="nos-divider" />

      {/* MISION Y VISION */}
      <div className="mv-section">
        <div className="mv-card mv-card-1">
          <div className="mv-deco">M</div>
          <div className="mv-card-icon" style={{ background: "rgba(0,243,255,0.08)", color: "#00f3ff" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v4l3 3" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="mv-card-label" style={{ color: "#00f3ff" }}>Nuestra mision</div>
          <div className="mv-card-title">Democratizar el desarrollo web en Latinoamerica</div>
          <div className="mv-card-desc">
            Hacer que negocios de todos los tamaños accedan a tecnología moderna,
            diseño profesional y herramientas digitales que antes solo tenían las grandes empresas.
          </div>
        </div>

        <div className="mv-card mv-card-2">
          <div className="mv-deco">V</div>
          <div className="mv-card-icon" style={{ background: "rgba(168,85,247,0.08)", color: "#a855f7" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
          <div className="mv-card-label" style={{ color: "#a855f7" }}>Nuestra vision</div>
          <div className="mv-card-title">Ser la red de desarrollo web mas confiable de la region</div>
          <div className="mv-card-desc">
            Construir un ecosistema donde vendedores, clientes y desarrolladores
            colaboren para llevar negocios al siguiente nivel digital con calidad garantizada.
          </div>
        </div>
      </div>

      <div className="nos-divider" />

      {/* EQUIPO */}
      <div className="equipo-section">
        <div className="equipo-header">
          <span className="nos-label">El equipo</span>
          <h2 className="section-title">Las personas detras<br />de Synkro</h2>
        </div>
        <div className="equipo-card">
          <div className="equipo-avatar">
            <span className="equipo-avatar-initials">MS</span>
            <div className="equipo-avatar-dot" />
          </div>
          <div className="equipo-info">
            <div className="equipo-name">Miguel Suarez</div>
            <div className="equipo-rol">Fundador & Desarrollador</div>
            <div className="equipo-desc">
              Estudiante de Ingenieria de Sistemas apasionado por construir productos digitales
              que resuelvan problemas reales. Fundo Synkro con la vision de llevar tecnologia
              profesional a negocios que la necesitan.
            </div>
            <div className="equipo-tags">
              <span className="equipo-tag">React</span>
              <span className="equipo-tag">Node.js</span>
              <span className="equipo-tag">Firebase</span>
              <span className="equipo-tag">UI/UX</span>
              <span className="equipo-tag">Desarrollo Web</span>
            </div>
          </div>
        </div>
      </div>

      <div className="nos-divider" />

      {/* VALORES */}
      <div className="valores-section">
        <div className="valores-header">
          <div>
            <span className="nos-label">Lo que nos mueve</span>
            <h2 className="section-title">Nuestros valores<br />no son palabras</h2>
          </div>
          <p className="valores-header-desc">
            Son la base de cada decision que tomamos, cada proyecto que entregamos
            y cada cliente que acompañamos en su camino digital.
          </p>
        </div>
        <div className="valores-grid">
          {valores.map((v) => (
            <div className="valor-card" key={v.num}>
              <div className="valor-line" style={{ background: `linear-gradient(90deg, ${v.color}, transparent)` }} />
              <div className="valor-num" style={{ color: v.color }}>{v.num}</div>
              <div className="valor-title">{v.title}</div>
              <div className="valor-desc">{v.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="nos-cta">
        <div className="nos-cta-inner">
          <h2 className="nos-cta-title">Listo para trabajar<br />con nosotros?</h2>
          <p className="nos-cta-desc">
            Cuentanos tu proyecto. Sin compromisos, sin costos ocultos.<br />
            Solo resultados reales para tu negocio.
          </p>
          <button className="btn-primary" onClick={() => navigate("/solicitud")}>
            Iniciar mi proyecto
          </button>
        </div>
      </div>
    </div>
  )
}

export default Nosotros