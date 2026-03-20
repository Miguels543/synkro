import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../../firebase/config"

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');

  .pd {
    min-height: 100vh;
    background: #060608;
    color: #e2e8f0;
    font-family: 'DM Sans', sans-serif;
    overflow-x: hidden;
  }

  .pd-hero {
    position: relative;
    height: 520px;
    overflow: hidden;
  }
  .pd-hero-img {
    width: 100%; height: 100%; object-fit: cover;
    filter: brightness(.35);
    transform: scale(1.04);
    transition: transform 6s ease;
  }
  .pd-hero-img.loaded { transform: scale(1); }

  .pd-hero-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(
      to bottom,
      transparent 30%,
      rgba(6,6,8,.6) 60%,
      #060608 100%
    );
  }

  .pd-hero-content {
    position: absolute; inset: 0;
    display: flex; flex-direction: column; justify-content: flex-end;
    padding: 0 7% 48px;
  }

  .pd-back {
    position: absolute; top: 28px; left: 7%;
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 13px; font-weight: 600; color: rgba(255,255,255,.5);
    text-decoration: none; transition: color .18s;
    background: rgba(0,0,0,.4); backdrop-filter: blur(8px);
    padding: 7px 14px; border-radius: 8px;
    border: 1px solid rgba(255,255,255,.1);
  }
  .pd-back:hover { color: #fff; }

  .pd-cat-chip {
    display: inline-flex; align-items: center;
    font-size: 9px; letter-spacing: 2.5px; text-transform: uppercase;
    padding: 4px 12px; border-radius: 50px;
    background: rgba(0,243,255,.1); color: #00f3ff;
    border: 1px solid rgba(0,243,255,.2);
    margin-bottom: 16px; width: fit-content;
  }

  .pd-titulo {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(52px, 7vw, 96px);
    line-height: .92; letter-spacing: 2px;
    color: #fff;
    margin-bottom: 16px;
  }

  .pd-tipo {
    font-size: 14px; color: rgba(255,255,255,.45);
    font-weight: 500;
  }

  .pd-body {
    max-width: 1100px;
    margin: 0 auto;
    padding: 64px 7% 100px;
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 56px;
    align-items: start;
  }

  .pd-section { margin-bottom: 48px; }

  .pd-section-label {
    font-size: 9px; letter-spacing: 3px; text-transform: uppercase;
    color: rgba(0,243,255,.5); margin-bottom: 14px; font-weight: 700;
  }

  .pd-desc {
    font-size: 17px; line-height: 1.85;
    color: rgba(255,255,255,.65);
    font-weight: 400;
  }

  .pd-funcionalidades {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .pd-func-item {
    display: flex; align-items: center; gap: 10px;
    background: rgba(255,255,255,.02);
    border: 1px solid rgba(255,255,255,.06);
    border-radius: 10px; padding: 12px 14px;
    font-size: 14px; color: rgba(255,255,255,.7);
    font-weight: 500;
  }

  .pd-func-check {
    width: 18px; height: 18px; border-radius: 50%;
    background: rgba(0,243,255,.1); border: 1px solid rgba(0,243,255,.25);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; font-size: 9px; color: #00f3ff;
  }

  .pd-stack-list { display: flex; flex-wrap: wrap; gap: 8px; }

  .pd-stack-tag {
    padding: 7px 16px; border-radius: 8px;
    font-size: 13px; font-weight: 600;
    background: rgba(255,255,255,.04);
    border: 1px solid rgba(255,255,255,.1);
    color: rgba(255,255,255,.6);
  }

  .pd-publico {
    font-size: 15px; line-height: 1.75;
    color: rgba(255,255,255,.5);
    background: rgba(255,255,255,.02);
    border-left: 2px solid rgba(0,243,255,.3);
    padding: 16px 20px; border-radius: 0 8px 8px 0;
  }

  /* ── Clientes reales ── */
  .pd-cli-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 12px;
  }

  .pd-cli-card {
    background: rgba(255,255,255,.02);
    border: 1px solid rgba(255,255,255,.07);
    border-radius: 12px;
    padding: 16px 18px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    transition: border-color .18s, background .18s;
  }
  .pd-cli-card:hover {
    border-color: rgba(255,255,255,.14);
    background: rgba(255,255,255,.035);
  }

  .pd-cli-top {
    display: flex; align-items: center; gap: 12px;
  }

  .pd-cli-logo {
    width: 40px; height: 40px; border-radius: 9px;
    object-fit: cover; flex-shrink: 0;
    background: rgba(255,255,255,.05);
    border: 1px solid rgba(255,255,255,.08);
  }
  .pd-cli-logo-ph {
    width: 40px; height: 40px; border-radius: 9px;
    flex-shrink: 0;
    background: rgba(255,255,255,.05);
    border: 1px solid rgba(255,255,255,.08);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
  }

  .pd-cli-nombre {
    font-size: 14px; font-weight: 700; color: #fff;
  }

  .pd-cli-testimonio {
    font-size: 13px;
    color: rgba(255,255,255,.42);
    line-height: 1.65;
    font-style: italic;
    border-left: 2px solid rgba(0,243,255,.18);
    padding-left: 10px;
    margin: 0;
  }

  .pd-cli-link {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 11px; font-weight: 600;
    color: rgba(0,243,255,.6);
    text-decoration: none;
    border: 1px solid rgba(0,243,255,.15);
    border-radius: 6px;
    padding: 4px 10px;
    width: fit-content;
    transition: all .16s;
  }
  .pd-cli-link:hover {
    color: #00f3ff;
    border-color: rgba(0,243,255,.35);
    background: rgba(0,243,255,.05);
  }

  /* ── Sidebar card ── */
  .pd-card {
    background: #0c0f14;
    border: 1px solid rgba(255,255,255,.07);
    border-radius: 16px;
    overflow: hidden;
    position: sticky;
    top: 90px;
  }

  .pd-card-head {
    padding: 24px 24px 20px;
    border-bottom: 1px solid rgba(255,255,255,.05);
  }

  .pd-card-ttl {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px; letter-spacing: 1px; color: #fff;
    margin-bottom: 4px;
  }

  .pd-card-sub { font-size: 11px; color: rgba(255,255,255,.28); }

  .pd-card-body { padding: 0 24px; }

  .pd-info-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid rgba(255,255,255,.04);
    font-size: 13px;
  }
  .pd-info-row:last-of-type { border-bottom: none; }

  .pd-info-label { color: rgba(255,255,255,.3); font-size: 12px; }
  .pd-info-val   { font-weight: 600; color: rgba(255,255,255,.75); }

  .pd-cta-btns {
    display: flex; flex-direction: column; gap: 10px;
    padding: 20px 24px 24px;
    border-top: 1px solid rgba(255,255,255,.05);
  }

  .pd-btn {
    display: block; text-align: center;
    padding: 12px 20px; border-radius: 10px;
    font-size: 14px; font-weight: 700;
    text-decoration: none; transition: all .18s;
    cursor: pointer; border: none;
    font-family: 'DM Sans', sans-serif;
  }
  .pd-btn.cyan  { background: #00f3ff; color: #000; }
  .pd-btn.cyan:hover { background: #7fffff; }
  .pd-btn.ghost { background: transparent; border: 1px solid rgba(255,255,255,.12); color: rgba(255,255,255,.5); }
  .pd-btn.ghost:hover { border-color: rgba(255,255,255,.3); color: #fff; }

  .pd-estado {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 10px; font-weight: 700; text-transform: uppercase;
    padding: 4px 10px; border-radius: 20px;
  }
  .pd-estado.disp    { background: rgba(16,185,129,.09); color: #10b981; border: 1px solid rgba(16,185,129,.2); }
  .pd-estado.pausado { background: rgba(255,255,255,.05); color: rgba(255,255,255,.3); border: 1px solid rgba(255,255,255,.1); }
  .pd-estado-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }

  .pd-center {
    min-height: 60vh; display: flex; align-items: center; justify-content: center;
    flex-direction: column; gap: 16px;
    color: rgba(255,255,255,.25); font-size: 14px;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .pd-hero-content { animation: fadeUp .5s ease both .1s; }
  .pd-body         { animation: fadeUp .5s ease both .2s; }

  @media (max-width: 860px) {
    .pd-body { grid-template-columns: 1fr; }
    .pd-card { position: static; }
    .pd-funcionalidades { grid-template-columns: 1fr; }
    .pd-hero { height: 380px; }
    .pd-cli-grid { grid-template-columns: 1fr; }
  }
`

export default function PortafolioDetalle() {
  const { id } = useParams()
  const [proyecto,  setProyecto]  = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [imgLoaded, setImgLoaded] = useState(false)

  useEffect(() => {
    const cargar = async () => {
      try {
        const snap = await getDoc(doc(db, "portafolio", id))
        if (snap.exists()) setProyecto({ id: snap.id, ...snap.data() })
      } catch (e) {
        console.error("Error cargando proyecto:", e)
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [id])

  if (loading) {
    return (
      <div className="pd">
        <style>{CSS}</style>
        <div className="pd-center">Cargando proyecto...</div>
      </div>
    )
  }

  if (!proyecto) {
    return (
      <div className="pd">
        <style>{CSS}</style>
        <div className="pd-center">
          <div>Proyecto no encontrado</div>
          <Link to="/portafolio" style={{ color: "#00f3ff", fontSize: "13px" }}>
            Volver al portafolio
          </Link>
        </div>
      </div>
    )
  }

  const funcionalidades = Array.isArray(proyecto.funcionalidades)
    ? proyecto.funcionalidades
    : (proyecto.funcionalidades
        ? proyecto.funcionalidades.split(",").map(f => f.trim()).filter(Boolean)
        : [])

  const clientes = Array.isArray(proyecto.clientes) ? proyecto.clientes : []

  const estadoCls = proyecto.estado === "disponible" ? "disp" : "pausado"
  const estadoLbl = proyecto.estado === "disponible" ? "Disponible" : "No disponible"

  return (
    <div className="pd">
      <style>{CSS}</style>

      <div className="pd-hero">
        {proyecto.img && (
          <img
            src={proyecto.img}
            alt={proyecto.nombre}
            className={`pd-hero-img ${imgLoaded ? "loaded" : ""}`}
            onLoad={() => setImgLoaded(true)}
          />
        )}
        <div className="pd-hero-overlay" />
        <div className="pd-hero-content">
          <Link to="/portafolio" className="pd-back">
            Volver al portafolio
          </Link>
          {proyecto.categoria && (
            <div className="pd-cat-chip">{proyecto.categoria}</div>
          )}
          <h1 className="pd-titulo">{proyecto.nombre}</h1>
          {proyecto.tipo && (
            <div className="pd-tipo">{proyecto.tipo}</div>
          )}
        </div>
      </div>

      <div className="pd-body">
        <div className="pd-left">

          {proyecto.desc && (
            <div className="pd-section">
              <div className="pd-section-label">Sobre el proyecto</div>
              <p className="pd-desc">{proyecto.desc}</p>
            </div>
          )}

          {funcionalidades.length > 0 && (
            <div className="pd-section">
              <div className="pd-section-label">Funcionalidades</div>
              <div className="pd-funcionalidades">
                {funcionalidades.map((f, i) => (
                  <div key={i} className="pd-func-item">
                    <div className="pd-func-check">v</div>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          )}

          {proyecto.publicoObjetivo && (
            <div className="pd-section">
              <div className="pd-section-label">Para quien es esto</div>
              <div className="pd-publico">{proyecto.publicoObjetivo}</div>
            </div>
          )}

          {proyecto.stack?.length > 0 && (
            <div className="pd-section">
              <div className="pd-section-label">Tecnologias utilizadas</div>
              <div className="pd-stack-list">
                {proyecto.stack.map((t, i) => (
                  <span key={i} className="pd-stack-tag">{t}</span>
                ))}
              </div>
            </div>
          )}

          {/* ── Clientes reales ── */}
          {clientes.length > 0 && (
            <div className="pd-section">
              <div className="pd-section-label">Negocios que usan este sistema</div>
              <div className="pd-cli-grid">
                {clientes.map(c => (
                  <div key={c.id} className="pd-cli-card">
                    <div className="pd-cli-top">
                      {c.logo
                        ? <img
                            src={c.logo}
                            alt={c.nombre}
                            className="pd-cli-logo"
                            onError={e => e.target.style.opacity = ".2"}
                          />
                        : <div className="pd-cli-logo-ph">🏢</div>
                      }
                      <div className="pd-cli-nombre">{c.nombre}</div>
                    </div>
                    {c.testimonio && (
                      <p className="pd-cli-testimonio">"{c.testimonio}"</p>
                    )}
                    {c.link && (
                      <a
                        href={c.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pd-cli-link"
                      >
                        ↗ Ver sitio real
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        <div className="pd-right">
          <div className="pd-card">
            <div className="pd-card-head">
              <div className="pd-card-ttl">{proyecto.nombre}</div>
              <div className="pd-card-sub">Synkro - Proyecto web</div>
            </div>

            <div className="pd-card-body">
              {proyecto.categoria && (
                <div className="pd-info-row">
                  <span className="pd-info-label">Categoria</span>
                  <span className="pd-info-val">{proyecto.categoria}</span>
                </div>
              )}
              {proyecto.tipo && (
                <div className="pd-info-row">
                  <span className="pd-info-label">Tipo</span>
                  <span className="pd-info-val">{proyecto.tipo}</span>
                </div>
              )}
              {proyecto.año && (
                <div className="pd-info-row">
                  <span className="pd-info-label">Año</span>
                  <span className="pd-info-val">{proyecto.año}</span>
                </div>
              )}
              <div className="pd-info-row">
                <span className="pd-info-label">Estado</span>
                <span className={`pd-estado ${estadoCls}`}>
                  <span className="pd-estado-dot" />
                  {estadoLbl}
                </span>
              </div>
              <div className="pd-info-row">
                <span className="pd-info-label">Precio</span>
                <span className="pd-info-val">Cotizacion personalizada</span>
              </div>
            </div>

            <div className="pd-cta-btns">
              {proyecto.demo && proyecto.demo !== "#" && (
                <a
                  href={proyecto.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pd-btn ghost"
                >
                  Ver demo
                </a>
              )}
              <a
                href={`https://wa.me/51990502491?text=Hola%2C%20vi%20el%20proyecto%20${encodeURIComponent(proyecto.nombre)}%20y%20me%20interesa%20algo%20similar`}
                target="_blank"
                rel="noopener noreferrer"
                className="pd-btn cyan"
              >
                Quiero algo asi
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}