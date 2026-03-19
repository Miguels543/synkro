import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../firebase/config"

const STATS = [
  { n: "12+", l: "Proyectos entregados" },
  { n: "100%", l: "Clientes satisfechos" },
  { n: "48h", l: "Tiempo de respuesta" },
  { n: "∞", l: "Soporte post-entrega" },
]

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  .port {
    min-height: 100vh;
    background: #060608;
    color: #e2e8f0;
    font-family: 'DM Sans', sans-serif;
    overflow-x: hidden;
  }

  .port-hero {
    padding: 110px 7% 80px;
    position: relative;
    border-bottom: 1px solid rgba(255,255,255,.05);
    overflow: hidden;
  }

  .port-hero-grid {
    position: absolute; inset: 0; z-index: 0;
    background-image:
      linear-gradient(rgba(0,243,255,.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,243,255,.04) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse 80% 100% at 50% 0%, black 40%, transparent 100%);
  }

  .port-hero-orb {
    position: absolute; border-radius: 50%; filter: blur(120px); pointer-events: none; z-index: 0;
  }

  .port-hero-label {
    font-size: 10px; letter-spacing: 5px; text-transform: uppercase;
    color: #00f3ff; opacity: .6; margin-bottom: 20px; position: relative; z-index: 1;
  }

  .port-hero-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(72px, 11vw, 160px);
    line-height: .92;
    color: #fff;
    position: relative; z-index: 1;
    margin-bottom: 30px;
    letter-spacing: 2px;
  }

  .port-hero-title span {
    display: block;
    -webkit-text-stroke: 1px rgba(255,255,255,.15);
    color: transparent;
  }

  .port-hero-title em {
    font-style: normal;
    background: linear-gradient(90deg, #00f3ff, #a855f7);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .port-hero-row {
    display: flex; gap: 32px; align-items: flex-end;
    position: relative; z-index: 1;
    flex-wrap: wrap;
  }

  .port-hero-desc {
    max-width: 420px; font-size: 15px; color: rgba(255,255,255,.4);
    line-height: 1.75;
  }

  .port-hero-cta { display: flex; gap: 12px; flex-shrink: 0; }

  .pbtn {
    padding: 11px 24px; border-radius: 8px; font-size: 14px; font-weight: 700;
    cursor: pointer; border: none; font-family: 'DM Sans', sans-serif;
    transition: all .2s; text-decoration: none; display: inline-block;
  }
  .pbtn.cyan  { background: #00f3ff; color: #000; }
  .pbtn.cyan:hover { background: #7fffff; transform: translateY(-2px); }
  .pbtn.ghost { background: transparent; border: 1px solid rgba(255,255,255,.15); color: rgba(255,255,255,.6); }
  .pbtn.ghost:hover { border-color: rgba(255,255,255,.35); color: #fff; }

  .port-stats {
    display: grid; grid-template-columns: repeat(4,1fr);
    border-bottom: 1px solid rgba(255,255,255,.05);
  }
  .port-stat {
    padding: 32px 7%; border-right: 1px solid rgba(255,255,255,.05);
    position: relative; overflow: hidden;
  }
  .port-stat:last-child { border-right: none; }
  .port-stat::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: var(--c); opacity: 0; transition: opacity .3s;
  }
  .port-stat:hover::before { opacity: 1; }
  .port-stat-n {
    font-family: 'Bebas Neue', sans-serif; font-size: 52px;
    line-height: 1; color: #fff; letter-spacing: 1px; margin-bottom: 4px;
  }
  .port-stat-l { font-size: 12px; color: rgba(255,255,255,.3); }

  .port-section { padding: 80px 7%; }

  .port-section-hdr {
    display: flex; justify-content: space-between; align-items: flex-end;
    margin-bottom: 40px; flex-wrap: gap;
    border-bottom: 1px solid rgba(255,255,255,.05); padding-bottom: 24px;
  }
  .port-section-ttl {
    font-family: 'Bebas Neue', sans-serif; font-size: 48px; color: #fff;
    letter-spacing: 2px; line-height: 1;
  }
  .port-section-sub { font-size: 13px; color: rgba(255,255,255,.3); margin-top: 4px; }

  .port-filtros { display: flex; gap: 8px; flex-wrap: wrap; }
  .pfiltro {
    padding: 6px 16px; border-radius: 50px; font-size: 12px; font-weight: 600;
    cursor: pointer; border: 1px solid rgba(255,255,255,.09); background: transparent;
    color: rgba(255,255,255,.35); transition: all .18s; font-family: 'DM Sans', sans-serif;
  }
  .pfiltro:hover { border-color: rgba(255,255,255,.22); color: rgba(255,255,255,.7); }
  .pfiltro.on { border-color: #00f3ff; color: #00f3ff; background: rgba(0,243,255,.07); }

  .port-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: rgba(255,255,255,.05);
    border: 1px solid rgba(255,255,255,.05);
    border-radius: 16px;
    overflow: hidden;
  }

  .pcard {
    position: relative; overflow: hidden; cursor: pointer;
    aspect-ratio: 4/3; background: #0c0f14;
    transition: z-index .01s;
    text-decoration: none; display: block;
  }

  .pcard-img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform .5s ease, filter .4s ease;
    filter: brightness(.65);
  }

  .pcard:hover .pcard-img {
    transform: scale(1.07);
    filter: brightness(.25);
  }

  .pcard-info {
    position: absolute; inset: 0; padding: 24px;
    display: flex; flex-direction: column; justify-content: flex-end;
    z-index: 2;
  }

  .pcard-cat {
    position: absolute; top: 18px; left: 18px;
    font-size: 9px; letter-spacing: 2.5px; text-transform: uppercase;
    padding: 4px 10px; border-radius: 50px;
    background: rgba(0,0,0,.6); color: rgba(255,255,255,.6);
    backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,.1);
    transition: opacity .3s;
  }

  .pcard-año {
    position: absolute; top: 18px; right: 18px;
    font-size: 10px; color: rgba(255,255,255,.35);
    transition: opacity .3s;
  }

  .pcard-bottom {
    transform: translateY(16px); opacity: 0;
    transition: transform .35s ease, opacity .3s ease;
  }
  .pcard:hover .pcard-bottom { transform: translateY(0); opacity: 1; }

  .pcard-tipo {
    font-size: 9.5px; letter-spacing: 2px; text-transform: uppercase;
    color: var(--c); margin-bottom: 7px; font-weight: 700;
  }

  .pcard-nom {
    font-family: 'Bebas Neue', sans-serif; font-size: 28px; color: #fff;
    line-height: 1; letter-spacing: 1px; margin-bottom: 10px;
  }

  .pcard-nom-static {
    position: absolute; bottom: 18px; left: 24px; right: 24px;
    font-family: 'Bebas Neue', sans-serif; font-size: 22px; color: #fff;
    line-height: 1; letter-spacing: 1px;
    transition: opacity .25s;
  }
  .pcard:hover .pcard-nom-static { opacity: 0; }

  .pcard-desc {
    font-size: 12px; color: rgba(255,255,255,.5); line-height: 1.6; margin-bottom: 14px;
  }

  .pcard-stack { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 16px; }
  .pstack-tag {
    font-size: 9px; padding: 3px 8px; border-radius: 4px; font-weight: 700;
    background: rgba(255,255,255,.07); color: rgba(255,255,255,.45);
    border: 1px solid rgba(255,255,255,.09);
  }

  .pcard-demo {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 12px; font-weight: 700; color: var(--c);
    background: rgba(0,0,0,.5); border: 1px solid currentColor;
    padding: 7px 16px; border-radius: 6px; cursor: pointer;
    transition: background .18s; text-decoration: none;
    backdrop-filter: blur(8px);
  }
  .pcard-demo:hover { background: rgba(255,255,255,.1); }

  .port-loading {
    grid-column: 1/-1; text-align: center;
    padding: 80px; color: rgba(255,255,255,.2); font-size: 14px;
  }

  .port-sep { margin: 0 7%; border: none; border-top: 1px solid rgba(255,255,255,.05); }

  .port-cta {
    margin: 0 7% 80px;
    background: #0c0f14;
    border: 1px solid rgba(0,243,255,.12);
    border-radius: 20px; padding: 64px 7%;
    text-align: center; position: relative; overflow: hidden;
  }

  .port-cta::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse 70% 100% at 50% 100%, rgba(0,243,255,.04) 0%, transparent 70%);
    pointer-events: none;
  }

  .port-cta-ttl {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(40px, 6vw, 80px); color: #fff;
    letter-spacing: 2px; line-height: 1; margin-bottom: 16px; position: relative;
  }

  .port-cta-sub {
    font-size: 15px; color: rgba(255,255,255,.38); max-width: 480px;
    margin: 0 auto 32px; line-height: 1.75; position: relative;
  }

  .port-cta-btns { display: flex; gap: 12px; justify-content: center; position: relative; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .port-hero-label,
  .port-hero-title,
  .port-hero-row { animation: fadeUp .6s ease both; }
  .port-hero-label { animation-delay: .05s; }
  .port-hero-title { animation-delay: .12s; }
  .port-hero-row   { animation-delay: .22s; }

  @media (max-width: 900px) {
    .port-grid { grid-template-columns: repeat(2,1fr); }
    .port-servicios { grid-template-columns: 1fr; }
    .port-stats { grid-template-columns: repeat(2,1fr); }
    .port-hero-title { font-size: 72px; }
  }
  @media (max-width: 600px) {
    .port-grid { grid-template-columns: 1fr; }
    .port-stats { grid-template-columns: repeat(2,1fr); }
  }
`

export default function Portafolio() {
  const [proyectos, setProyectos] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [filtro,    setFiltro]    = useState("Todos")

  useEffect(() => {
    const cargar = async () => {
      try {
        const snap = await getDocs(collection(db, "portafolio"))
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        setProyectos(data)
      } catch (e) {
        console.error("Error cargando portafolio:", e)
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [])

  // Categorías dinámicas desde BD
  const categorias = ["Todos", ...new Set(proyectos.map(p => p.categoria).filter(Boolean))]

  const proyFiltrados = filtro === "Todos"
    ? proyectos
    : proyectos.filter(p => p.categoria === filtro)

  const statColors = ["#00f3ff", "#a855f7", "#f97316", "#10b981"]

  return (
    <div className="port">
      <style>{CSS}</style>

      {/* ── HERO ── */}
      <section className="port-hero">
        <div className="port-hero-grid" />
        <div className="port-hero-orb" style={{ width: 500, height: 500, top: -200, right: -100, background: "rgba(0,243,255,.06)" }} />
        <div className="port-hero-orb" style={{ width: 400, height: 400, bottom: -100, left: "30%", background: "rgba(168,85,247,.05)" }} />

        <p className="port-hero-label">Synkro — Portafolio de trabajo</p>
        <h1 className="port-hero-title">
          <span>Nuestro</span>
          <em>trabajo</em>
          <span>habla.</span>
        </h1>
        <div className="port-hero-row">
          <p className="port-hero-desc">
            Sitios web que convierten visitantes en clientes. Cada proyecto está construido con atención al detalle, rendimiento real y diseño que diferencia.
          </p>
          <div className="port-hero-cta">
            <a href="#proyectos" className="pbtn cyan">Ver proyectos</a>
            <Link to="/solicitud" className="pbtn ghost">Pedir presupuesto</Link>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="port-stats">
        {STATS.map((s, i) => (
          <div key={i} className="port-stat" style={{ "--c": statColors[i] }}>
            <div className="port-stat-n">{s.n}</div>
            <div className="port-stat-l">{s.l}</div>
          </div>
        ))}
      </div>

      {/* ── PROYECTOS ── */}
      <section className="port-section" id="proyectos">
        <div className="port-section-hdr">
          <div>
            <div className="port-section-ttl">Proyectos</div>
            <div className="port-section-sub">
              {loading ? "Cargando..." : `${proyFiltrados.length} sitios entregados`}
            </div>
          </div>
          <div className="port-filtros">
            {categorias.map(c => (
              <button
                key={c}
                className={`pfiltro ${filtro === c ? "on" : ""}`}
                onClick={() => setFiltro(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="port-grid">
          {loading && <div className="port-loading">Cargando proyectos...</div>}

          {!loading && proyFiltrados.map(p => (
            <Link
              key={p.id}
              to={`/portafolio/${p.id}`}
              className="pcard"
              style={{ "--c": p.color || "#00f3ff" }}
            >
              <img src={p.img} alt={p.nombre} className="pcard-img" />

              <div className="pcard-cat">{p.categoria}</div>
              <div className="pcard-año">{p.año}</div>

              <div className="pcard-nom-static">{p.nombre}</div>

              <div className="pcard-info">
                <div className="pcard-bottom">
                  <div className="pcard-tipo">{p.tipo}</div>
                  <div className="pcard-nom">{p.nombre}</div>
                  <div className="pcard-desc">{p.desc}</div>
                  <div className="pcard-stack">
                    {p.stack?.map((t, i) => (
                      <span key={i} className="pstack-tag">{t}</span>
                    ))}
                  </div>
                  <span className="pcard-demo">Ver proyecto →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="port-cta">
        <div className="port-cta-ttl">¿Listo para<br />vender online?</div>
        <div className="port-cta-sub">
          Negocios en Piura ya venden online
          Tienda lista, panel de admin y dominio propio desde S/.80/mes. Sin pago inicial
        </div>
        <div className="port-cta-btns">
          <Link to="/solicitud" className="pbtn cyan">Solicitar proyecto</Link>
          <a
            href="https://wa.me/51990502491?text=Hola%2C%20vi%20el%20portafolio%20y%20quiero%20hablar%20sobre%20mi%20proyecto"
            target="_blank"
            rel="noopener noreferrer"
            className="pbtn ghost"
          >
            Hablar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}