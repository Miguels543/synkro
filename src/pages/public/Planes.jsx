import { useState } from "react"
import { useNavigate } from "react-router-dom"

const planes = [
  {
    nombre: "Básico",
    precio: 80,
    desc: "Todo lo que necesitas para estar online y captar clientes desde el primer día.",
    color: "#00f3ff",
    gradient: "linear-gradient(135deg, #000d1a, #001f3f)",
    funciones: [
      "Tienda E-commerce básica con catálogo de productos",
      "Diseño web profesional y moderno",
      "Adaptación a celulares y tablets",
      "Dominio incluido (1 año)",
      "Hosting incluido",
      "Certificado SSL (sitio seguro)",
      "Correo empresarial (info@tunegocio.com)",
      "Formulario de contacto",
      "Botón de WhatsApp integrado",
      "Conexión con redes sociales",
      "SEO básico (aparecer en Google)",
      "Redacción de textos del sitio",
      "Selección de imágenes profesionales",
      "Asesoría digital personalizada",
      "Cambios ilimitados",
      "Web lista en 5-7 días",
      "Soporte técnico incluido",
      "Mapa de ubicación Google Maps",
    ],
    noIncluye: ["Panel administrativo", "Bot de WhatsApp"],
  },
  {
    nombre: "Intermedio",
    precio: 120,
    desc: "Vende online y gestiona tu negocio con herramientas profesionales de control total.",
    color: "#a855f7",
    gradient: "linear-gradient(135deg, #0d001a, #1a0035)",
    popular: true,
    funciones: [
      "Todo lo del plan Básico",
      "Tienda E-commerce completa",
      "Carrito de compras",
      "Pasarela de pagos online",
      "Configuración de envíos",
      "Carga inicial de productos (50 productos)",
      "Catálogo de productos completo",
      "Panel administrativo propio",
      "Gestión de productos sin código",
      "Gestión de pedidos",
      "Reportes de ventas",
      "Usuarios y roles",
      "Galería de fotos y videos",
      "Blog integrado",
      "Integración con Google Analytics",
      "Página de reseñas y testimonios",
      "Sistema de cupones y descuentos",
      "Optimización de velocidad del sitio"
    ],
    noIncluye: ["Bot de WhatsApp automatizado"],
  },
  {
    nombre: "Avanzado",
    precio: 150,
    desc: "La solución completa para negocios que quieren escalar sin límites ni dependencias.",
    color: "#f97316",
    gradient: "linear-gradient(135deg, #1a0800, #2d1000)",
    funciones: [
      "Todo lo del plan Intermedio",
      "Pagos online integrados (tarjetas, Yape, Plin, etc.)",
      "Carga inicial de productos (100 productos)",
      "Bot de WhatsApp automatizado",
      "Respuestas automáticas inteligentes",
      "Notificaciones de pedidos por WhatsApp",
      "SEO avanzado y optimización Google",
      "Integración completa con redes sociales",
      "Soporte prioritario 24/7",
      "Actualizaciones incluidas",
      "Análisis de estadísticas del sitio",
      "Gestión de campañas en redes sociales",
      "Optimización avanzada de velocidad",
      "Integración con herramientas de marketing",
      "Automatización de correos para clientes",
      "Recuperación de carritos abandonados",
      "Segmentación de clientes",
      "Asesoría estratégica de crecimiento"
    ],
    noIncluye: [],
  },
]

const funcionesConfig = [
  { id: "ecommerce", label: "Tienda E-commerce", precio: 35, desc: "Carrito, productos y pagos online", requerido: true },
  { id: "dominio", label: "Dominio + Hosting", precio: 20, desc: "Tu dirección web propia por 1 año" },
  { id: "ssl", label: "Certificado SSL", precio: 10, desc: "Seguridad y confianza para tus clientes" },
  { id: "responsive", label: "Diseño Responsive", precio: 15, desc: "Se ve perfecto en móvil y desktop" },
  { id: "contacto", label: "Formulario de contacto", precio: 5, desc: "Recibe mensajes directamente" },
  { id: "whatsapp", label: "Chat de WhatsApp", precio: 8, desc: "Botón directo a tu WhatsApp" },
  { id: "mapa", label: "Mapa de ubicación", precio: 5, desc: "Google Maps integrado" },
  { id: "galeria", label: "Galería de fotos/videos", precio: 10, desc: "Muestra tu trabajo visualmente" },
  { id: "blog", label: "Blog integrado", precio: 12, desc: "Publica contenido y mejora tu SEO" },
  { id: "seo", label: "SEO básico", precio: 15, desc: "Aparecer en Google más fácil" },
  { id: "panel", label: "Panel administrativo", precio: 25, desc: "Gestiona todo sin código" },
  { id: "catalogo", label: "Catálogo de productos", precio: 15, desc: "Muestra tu inventario completo" },
  { id: "reservas", label: "Sistema de reservas", precio: 20, desc: "Citas y reservas online" },
  { id: "resenas", label: "Página de reseñas", precio: 8, desc: "Muestra testimonios de clientes" },
  { id: "bot", label: "Bot de WhatsApp", precio: 42, desc: "Respuestas automáticas inteligentes" },
]

const PRECIO_MAX = 150

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');

  .planes-page {
    min-height: 100vh;
    background: #000;
    color: #fff;
    font-family: 'Space Grotesk', sans-serif;
    padding-top: 65px;
    overflow-x: hidden;
  }

  /* HEADER */
  .planes-header {
    text-align: center;
    padding: 80px 8% 60px;
    position: relative;
  }

  .planes-header::before {
    content: '';
    position: absolute;
    top: 0; left: 50%;
    transform: translateX(-50%);
    width: 600px;
    height: 300px;
    background: radial-gradient(ellipse, rgba(0,243,255,0.06) 0%, transparent 70%);
    pointer-events: none;
  }

  .planes-label {
    font-size: 11px;
    letter-spacing: 5px;
    color: #00f3ff;
    text-transform: uppercase;
    opacity: 0.7;
    margin-bottom: 16px;
  }

  .planes-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(36px, 5vw, 72px);
    font-weight: 800;
    line-height: 1.05;
    margin-bottom: 20px;
    background: linear-gradient(135deg, #fff 0%, #00f3ff 50%, #a855f7 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .planes-subtitle {
    font-size: 17px;
    color: rgba(255,255,255,0.45);
    max-width: 500px;
    margin: 0 auto;
    line-height: 1.7;
  }

  /* TABS */
  .planes-tabs {
    display: flex;
    justify-content: center;
    gap: 0;
    margin: 0 8% 60px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    padding: 4px;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 60px;
  }

  .planes-tab {
    flex: 1;
    padding: 10px 20px;
    border: none;
    background: transparent;
    color: rgba(255,255,255,0.4);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.3s ease;
    font-family: 'Space Grotesk', sans-serif;
    letter-spacing: 0.5px;
  }

  .planes-tab.active {
    background: rgba(0,243,255,0.12);
    color: #00f3ff;
    border: 1px solid rgba(0,243,255,0.3);
  }

  /* PLANES GRID */
  .planes-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    padding: 0 8% 100px;
    align-items: stretch;
  }

  .plan-card {
    border-radius: 20px;
    padding: 40px 32px;
    position: relative;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: default;
    border: 1px solid rgba(255,255,255,0.06);
    display: flex;
    flex-direction: column;
  }

  .plan-card:hover {
    transform: translateY(-8px);
  }

  .plan-card.popular {
    transform: scale(1.06);
    border-color: rgba(168,85,247,0.4);
    box-shadow: 0 0 80px rgba(168,85,247,0.15);
    padding: 52px 32px;
  }

  .plan-card.popular:hover {
    transform: scale(1.06) translateY(-8px);
  }

  .popular-badge {
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 10px;
    letter-spacing: 2px;
    padding: 5px 12px;
    border-radius: 50px;
    background: rgba(168,85,247,0.15);
    border: 1px solid rgba(168,85,247,0.4);
    color: #a855f7;
    text-transform: uppercase;
    font-weight: 600;
  }

  .plan-glow {
    position: absolute;
    top: -60px;
    right: -60px;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    opacity: 0.08;
    filter: blur(40px);
    pointer-events: none;
  }

  .plan-nombre {
    font-size: 12px;
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-bottom: 20px;
    opacity: 0.7;
    font-weight: 600;
  }

  .plan-precio-wrap {
    display: flex;
    align-items: baseline;
    gap: 6px;
    margin-bottom: 8px;
  }

  .plan-moneda {
    font-size: 20px;
    font-weight: 600;
    opacity: 0.6;
  }

  .plan-precio {
    font-family: 'Syne', sans-serif;
    font-size: 64px;
    font-weight: 800;
    line-height: 1;
  }

  .plan-periodo {
    font-size: 14px;
    color: rgba(255,255,255,0.35);
    margin-bottom: 16px;
  }

  .plan-desc {
    font-size: 14px;
    color: rgba(255,255,255,0.45);
    line-height: 1.6;
    margin-bottom: 32px;
    padding-bottom: 32px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }

  .plan-funciones {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 32px;
    flex: 1;
  }

  .plan-funcion {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    color: rgba(255,255,255,0.75);
  }

  .plan-funcion-check {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    flex-shrink: 0;
    font-weight: 700;
  }

  .plan-funcion-check.si {
    background: rgba(0,243,255,0.1);
    color: #00f3ff;
    border: 1px solid rgba(0,243,255,0.3);
  }

  .plan-funcion-check.no {
    background: rgba(255,255,255,0.04);
    color: rgba(255,255,255,0.2);
    border: 1px solid rgba(255,255,255,0.08);
  }

  .plan-funcion.no-incluye {
    opacity: 0.3;
    text-decoration: line-through;
  }

  .plan-btn {
    width: 100%;
    padding: 15px;
    border: none;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    font-family: 'Space Grotesk', sans-serif;
    letter-spacing: 0.5px;
    position: relative;
    overflow: hidden;
    transition: transform 0.12s ease, box-shadow 0.12s ease;
    z-index: 0;
  }

  /* shimmer de luz que sigue al cursor — via JS */
  .plan-btn .btn-shimmer {
    position: absolute;
    width: 120px; height: 120px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,255,255,0.35) 0%, transparent 70%);
    pointer-events: none;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: opacity 0.2s ease;
    z-index: 1;
  }
  .plan-btn:hover .btn-shimmer { opacity: 1; }

  /* texto siempre encima del shimmer */
  .plan-btn .btn-txt {
    position: relative; z-index: 2;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: letter-spacing 0.2s ease, gap 0.2s ease;
  }
  .plan-btn:hover .btn-txt {
    letter-spacing: 2px;
    gap: 12px;
  }

  /* flecha animada */
  .plan-btn .btn-arrow {
    display: inline-block;
    transition: transform 0.25s ease;
    font-style: normal;
  }
  .plan-btn:hover .btn-arrow {
    transform: translateX(5px);
  }

  /* borde luminoso giratorio en hover */
  .plan-btn::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 14px;
    background: conic-gradient(from var(--angle, 0deg), transparent 70%, rgba(255,255,255,0.6) 80%, transparent 90%);
    opacity: 0;
    transition: opacity 0.25s ease;
    z-index: -1;
    animation: none;
  }
  .plan-btn:hover::before {
    opacity: 1;
    animation: rotateBorder 1.2s linear infinite;
  }

  /* sombra glow bajo el botón */
  .plan-btn::after {
    content: '';
    position: absolute;
    bottom: -8px; left: 15%; right: 15%; height: 20px;
    border-radius: 50%;
    filter: blur(14px);
    background: inherit;
    opacity: 0;
    transition: opacity 0.25s ease;
    z-index: -2;
  }
  .plan-btn:hover::after { opacity: 0.7; }

  @keyframes rotateBorder {
    from { --angle: 0deg; }
    to   { --angle: 360deg; }
  }
  @property --angle {
    syntax: "<angle>";
    initial-value: 0deg;
    inherits: false;
  }

  .plan-btn:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(255,255,255,0.06) inset;
  }

  .plan-btn:active {
    transform: translateY(-1px) scale(0.99);
    transition: transform 0.06s ease;
  }

  /* CONFIGURADOR */
  .configurador {
    padding: 0 8% 100px;
  }

  .config-header {
    text-align: center;
    margin-bottom: 60px;
  }

  .config-inner {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 32px;
    align-items: start;
  }

  .config-funciones {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .config-funcion {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px;
    padding: 18px 20px;
    cursor: pointer;
    transition: all 0.25s ease;
    display: flex;
    align-items: center;
    gap: 14px;
    position: relative;
    overflow: hidden;
  }

  .config-funcion:hover {
    background: rgba(0,243,255,0.04);
    border-color: rgba(0,243,255,0.2);
  }

  .config-funcion.selected {
    background: rgba(0,243,255,0.07);
    border-color: rgba(0,243,255,0.4);
  }

  .config-funcion.requerido {
    cursor: default;
    opacity: 0.7;
  }

  .config-checkbox {
    width: 20px;
    height: 20px;
    border-radius: 6px;
    border: 1.5px solid rgba(255,255,255,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.2s ease;
    font-size: 11px;
  }

  .config-funcion.selected .config-checkbox {
    background: #00f3ff;
    border-color: #00f3ff;
    color: #000;
    font-weight: 700;
  }

  .config-funcion-info {
    flex: 1;
  }

  .config-funcion-label {
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 3px;
  }

  .config-funcion-desc {
    font-size: 12px;
    color: rgba(255,255,255,0.35);
  }

  .config-funcion-precio {
    font-size: 13px;
    font-weight: 700;
    color: #00f3ff;
    flex-shrink: 0;
  }

  /* RESUMEN */
  .config-resumen {
    background: rgba(0,5,15,0.8);
    border: 1px solid rgba(0,243,255,0.15);
    border-radius: 20px;
    padding: 32px;
    position: sticky;
    top: 85px;
  }

  .resumen-title {
    font-family: 'Syne', sans-serif;
    font-size: 18px;
    font-weight: 800;
    margin-bottom: 24px;
    color: #fff;
  }

  .resumen-items {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 24px;
    min-height: 120px;
  }

  .resumen-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    color: rgba(255,255,255,0.6);
    padding: 8px 0;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateX(-8px); }
    to { opacity: 1; transform: translateX(0); }
  }

  .resumen-item span:last-child {
    color: #00f3ff;
    font-weight: 600;
  }

  .resumen-total-wrap {
    padding: 20px 0;
    border-top: 1px solid rgba(0,243,255,0.15);
    margin-bottom: 20px;
  }

  .resumen-total-label {
    font-size: 12px;
    letter-spacing: 2px;
    color: rgba(255,255,255,0.3);
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  .resumen-total {
    display: flex;
    align-items: baseline;
    gap: 6px;
  }

  .resumen-total-num {
    font-family: 'Syne', sans-serif;
    font-size: 56px;
    font-weight: 800;
    line-height: 1;
    transition: color 0.3s ease;
  }

  .resumen-total-mes {
    font-size: 16px;
    color: rgba(255,255,255,0.35);
  }

  .resumen-bar-wrap {
    background: rgba(255,255,255,0.06);
    border-radius: 50px;
    height: 6px;
    margin-bottom: 8px;
    overflow: hidden;
  }

  .resumen-bar {
    height: 100%;
    border-radius: 50px;
    transition: width 0.4s ease, background 0.4s ease;
  }

  .resumen-bar-label {
    font-size: 11px;
    color: rgba(255,255,255,0.3);
    text-align: right;
    margin-bottom: 24px;
  }

  .resumen-empty {
    font-size: 13px;
    color: rgba(255,255,255,0.2);
    font-style: italic;
    text-align: center;
    padding: 20px 0;
  }

  .config-btn {
    width: 100%;
    padding: 14px;
    border: none;
    border-radius: 12px;
    background: linear-gradient(45deg, #00f3ff, #0066ff);
    color: #000;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: 'Space Grotesk', sans-serif;
  }

  .config-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 30px rgba(0,243,255,0.35);
  }

  .config-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .tope-aviso {
    font-size: 12px;
    color: #f97316;
    text-align: center;
    margin-top: 10px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .tope-aviso.visible {
    opacity: 1;
  }
    /* COMPARATIVA GURU */
  .guru-banner {
    margin: 0 8% 80px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(0,243,255,0.1);
    border-radius: 20px;
    padding: 40px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    align-items: center;
  }

  .guru-left h3 {
    font-family: 'Syne', sans-serif;
    font-size: 28px;
    font-weight: 800;
    margin-bottom: 12px;
    color: #fff;
  }

  .guru-left p {
    font-size: 14px;
    color: rgba(255,255,255,0.45);
    line-height: 1.7;
  }

  .guru-compare {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .guru-col {
    background: rgba(255,255,255,0.03);
    border-radius: 14px;
    padding: 20px;
    border: 1px solid rgba(255,255,255,0.06);
  }

  .guru-col.synkro {
    border-color: rgba(0,243,255,0.2);
  }

  .guru-col-title {
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-bottom: 14px;
    font-weight: 600;
  }

  .guru-col-title.ellos {
    color: rgba(255,255,255,0.3);
  }

  .guru-col-title.nosotros {
    color: #00f3ff;
  }

  .guru-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: rgba(255,255,255,0.6);
    margin-bottom: 8px;
  }

  .guru-item .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .guru-col.synkro .dot {
    background: #00f3ff;
  }

  .guru-col:not(.synkro) .dot {
    background: rgba(255,255,255,0.2);
  }

  @media (max-width: 900px) {
    .guru-banner {
      grid-template-columns: 1fr;
    }

    .guru-compare {
      grid-template-columns: 1fr;
    }
  }
`

function Planes() {
  const navigate = useNavigate()
  const [tab, setTab] = useState("planes")
  const [seleccionadas, setSeleccionadas] = useState(
    new Set(["ecommerce"])
  )

  const toggleFuncion = (id) => {
    const f = funcionesConfig.find(f => f.id === id)
    if (f.requerido) return
    const next = new Set(seleccionadas)
    if (next.has(id)) {
      next.delete(id)
    } else {
      const nuevoPrecio = calcPrecio(next) + f.precio
      if (nuevoPrecio > PRECIO_MAX) return
      next.add(id)
    }
    setSeleccionadas(next)
  }

  const calcPrecio = (set) => {
    return funcionesConfig
      .filter(f => set.has(f.id))
      .reduce((acc, f) => acc + f.precio, 0)
  }

  const precio = calcPrecio(seleccionadas)
  const porcentaje = Math.min((precio / PRECIO_MAX) * 100, 100)
  const alTope = precio >= PRECIO_MAX

  const barColor = porcentaje < 60
    ? "#00f3ff"
    : porcentaje < 85
    ? "#a855f7"
    : "#f97316"

  const itemsSeleccionados = funcionesConfig.filter(f => seleccionadas.has(f.id))

  return (
    <div className="planes-page">
      <style>{styles}</style>

      <div className="planes-header">
        <p className="planes-label">Precios y planes</p>
        <h1 className="planes-title">Elige tu plan<br />o arma el tuyo</h1>
        <p className="planes-subtitle">Sin contratos largos. Sin sorpresas. Pagas mensual y cancelas cuando quieras.</p>
      </div>

      <div className="planes-tabs">
        <button
          className={`planes-tab ${tab === "planes" ? "active" : ""}`}
          onClick={() => setTab("planes")}
        >
          Planes fijos
        </button>
        <button
          className={`planes-tab ${tab === "config" ? "active" : ""}`}
          onClick={() => setTab("config")}
        >
          Personalizar
        </button>
      </div>
{tab === "planes" && (
  <>
    <div className="planes-grid">
      {planes.map((p, i) => (
        <div
          key={i}
          className={`plan-card ${p.popular ? "popular" : ""}`}
          style={{ background: p.gradient }}
        >
          <div className="plan-glow" style={{ background: p.color }} />
          {p.popular && <div className="popular-badge">Mas popular</div>}

          <p className="plan-nombre" style={{ color: p.color }}>{p.nombre}</p>

          <div className="plan-precio-wrap">
            <span className="plan-moneda" style={{ color: p.color }}>S/.</span>
            <span className="plan-precio" style={{ color: p.color }}>{p.precio}</span>
          </div>
          <p className="plan-periodo">/ mes</p>
          <p className="plan-desc">{p.desc}</p>

          <div className="plan-funciones">
            {p.funciones.map((f, j) => (
              <div className="plan-funcion" key={j}>
                <div className="plan-funcion-check si">✓</div>
                <span>{f}</span>
              </div>
            ))}
            {p.noIncluye.map((f, j) => (
              <div className="plan-funcion no-incluye" key={j}>
                <div className="plan-funcion-check no">✗</div>
                <span>{f}</span>
              </div>
            ))}
          </div>

          <button
            className="plan-btn"
            style={{
              background: p.popular
                ? `linear-gradient(135deg, ${p.color}, #6d28d9)`
                : `rgba(255,255,255,0.06)`,
              color: p.popular ? "#fff" : p.color,
              border: p.popular ? "none" : `1px solid ${p.color}40`,
            }}
            onClick={() => window.open(`https://wa.me/51990502491?text=Hola%2C%20quiero%20el%20plan%20${p.nombre}%20de%20S%2F.${p.precio}%2Fmes`, "_blank")}
            onMouseMove={e => {
              const btn = e.currentTarget
              const rect = btn.getBoundingClientRect()
              const x = e.clientX - rect.left
              const y = e.clientY - rect.top
              const shimmer = btn.querySelector('.btn-shimmer')
              if (shimmer) { shimmer.style.left = x + 'px'; shimmer.style.top = y + 'px' }
              const cx = rect.width / 2, cy = rect.height / 2
              const rotY = ((x - cx) / cx) * 10
              const rotX = -((y - cy) / cy) * 6
              btn.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-5px) scale(1.02)`
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = ''
            }}
          >
            <span className="btn-shimmer" />
            <span className="btn-txt">
              Empezar con {p.nombre} <em className="btn-arrow">→</em>
            </span>
          </button>
        </div>
      ))}
    </div>
    
    <div className="guru-banner">
      <div className="guru-left">
        <h3>¿Por qué elegir Synkro?</h3>
        <p>Muchos servicios cobran mensualidades similares, pero no te dan control real de tu sitio. Con Synkro, tu negocio es tuyo — panel propio, cambios cuando quieras y un diseño que realmente destaca.</p>
      </div>
      <div className="guru-compare">
        <div className="guru-col">
          <div className="guru-col-title ellos">Servicios tradicionales · ~S/. 115/mes</div>
          <div className="guru-item"><span className="dot" />Diseños genéricos</div>
          <div className="guru-item"><span className="dot" />Debes pedir cambios al soporte</div>
          <div className="guru-item"><span className="dot" />Sin panel de administración</div>
          <div className="guru-item"><span className="dot" />Sin automatización de WhatsApp</div>
          <div className="guru-item"><span className="dot" />El código no es realmente tuyo</div>
        </div>
        <div className="guru-col synkro">
          <div className="guru-col-title nosotros">Synkro · S/. 80/mes</div>
          <div className="guru-item"><span className="dot" />Diseño moderno y personalizado</div>
          <div className="guru-item"><span className="dot" />Cambios ilimitados por tu cuenta</div>
          <div className="guru-item"><span className="dot" />Panel de administración incluido</div>
          <div className="guru-item"><span className="dot" />Bot de WhatsApp disponible</div>
          <div className="guru-item"><span className="dot" />El código siempre es tuyo</div>
        </div>
      </div>
    </div>
    </>
)}
  
      {tab === "config" && (
        <div className="configurador">
          <div className="config-header">
            <p className="planes-label">Configurador</p>
            <h2 className="planes-title" style={{ fontSize: "clamp(28px, 3vw, 48px)" }}>
              Arma tu plan ideal
            </h2>
            <p className="planes-subtitle">Selecciona las funciones que necesitas. El precio se ajusta solo. Maximo S/. 150/mes.</p>
          </div>

          <div className="config-inner">
            <div className="config-funciones">
              {funcionesConfig.map((f) => {
                const sel = seleccionadas.has(f.id)
                const bloqueado = !sel && alTope && !f.requerido
                return (
                  <div
                    key={f.id}
                    className={`config-funcion ${sel ? "selected" : ""} ${f.requerido ? "requerido" : ""}`}
                    style={{ opacity: bloqueado ? 0.35 : 1 }}
                    onClick={() => toggleFuncion(f.id)}
                  >
                    <div className="config-checkbox">
                      {sel && "✓"}
                    </div>
                    <div className="config-funcion-info">
                      <div className="config-funcion-label">{f.label}</div>
                      <div className="config-funcion-desc">{f.desc}</div>
                    </div>
                    <div className="config-funcion-precio">+S/.{f.precio}</div>
                  </div>
                )
              })}
            </div>

            <div className="config-resumen">
              <div className="resumen-title">Tu plan</div>

              <div className="resumen-items">
                {itemsSeleccionados.length === 0
                  ? <p className="resumen-empty">Selecciona funciones para armar tu plan</p>
                  : itemsSeleccionados.map((f) => (
                    <div className="resumen-item" key={f.id}>
                      <span>{f.label}</span>
                      <span>S/. {f.precio}</span>
                    </div>
                  ))
                }
              </div>

              <div className="resumen-total-wrap">
                <div className="resumen-total-label">Total mensual</div>
                <div className="resumen-total">
                  <span style={{ fontSize: 20, color: barColor, fontWeight: 700 }}>S/.</span>
                  <span className="resumen-total-num" style={{ color: barColor }}>{precio}</span>
                  <span className="resumen-total-mes">/mes</span>
                </div>
              </div>

              <div className="resumen-bar-wrap">
                <div
                  className="resumen-bar"
                  style={{
                    width: `${porcentaje}%`,
                    background: `linear-gradient(90deg, #00f3ff, ${barColor})`,
                  }}
                />
              </div>
              <div className="resumen-bar-label">S/. {precio} / S/. {PRECIO_MAX} max</div>

              <button
                className="config-btn"
                disabled={itemsSeleccionados.length === 0}
                onClick={() => navigate("/solicitud")}
              >
                Solicitar este plan
              </button>

              <p className={`tope-aviso ${alTope ? "visible" : ""}`}>
                Alcanzaste el maximo de S/. 150/mes
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Planes