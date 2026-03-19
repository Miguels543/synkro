import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../../../firebase/config"

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .rd {
    background: #050709;
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: #d1d5db;
    min-height: 100vh;
    margin-top: 65px;
    padding-bottom: 80px;
  }

  .rd-back {
    padding: 18px 32px 0;
    display: flex; align-items: center; gap: 10px;
  }
  .rd-back-btn {
    display: flex; align-items: center; gap: 7px;
    background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08);
    border-radius: 8px; padding: 7px 13px; cursor: pointer;
    font-size: 12px; font-weight: 600; color: rgba(255,255,255,.45);
    font-family: 'Plus Jakarta Sans', sans-serif; transition: all .16s;
  }
  .rd-back-btn:hover { border-color: rgba(255,255,255,.18); color: #fff; }
  .rd-breadcrumb { font-size: 12px; color: rgba(255,255,255,.2); }
  .rd-breadcrumb span { color: rgba(255,255,255,.5); }

  .rd-gal { position: relative; margin: 16px 32px 0; border-radius: 13px; overflow: hidden; }
  .rd-gal-img { width: 100%; aspect-ratio: 16/6; object-fit: cover; display: block; }
  .rd-gal-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,.1) 40%, rgba(5,7,9,.98) 100%);
  }
  .rd-gal-btn {
    position: absolute; top: 50%; transform: translateY(-50%);
    background: rgba(0,0,0,.55); border: 1px solid rgba(255,255,255,.12);
    color: #fff; width: 30px; height: 30px; border-radius: 50%; cursor: pointer;
    display: flex; align-items: center; justify-content: center; font-size: 16px;
    transition: background .16s; z-index: 3;
  }
  .rd-gal-btn:hover { background: rgba(0,0,0,.85); }
  .rd-gal-btn.prev { left: 12px; }
  .rd-gal-btn.next { right: 12px; }
  .rd-gal-dots { position: absolute; bottom: 14px; left: 50%; transform: translateX(-50%); display: flex; gap: 6px; z-index: 3; }
  .rd-gal-dot { width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,.22); cursor: pointer; border: none; transition: all .16s; }
  .rd-gal-dot.on { background: #00f3ff; transform: scale(1.3); }

  .rd-gal-over {
    position: absolute; bottom: 0; left: 0; right: 0; z-index: 4;
    padding: 0 26px 22px;
    display: flex; justify-content: space-between; align-items: flex-end;
  }
  .rd-cat { font-size: 8.5px; letter-spacing: 3px; text-transform: uppercase; color: rgba(0,243,255,.55); margin-bottom: 5px; }
  .rd-nom { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; color: #fff; line-height: 1.1; }

  /* Botón Ver demo en overlay — más visible */
  .rd-demo-btn {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(255,255,255,.12);
    border: 1px solid rgba(255,255,255,.3);
    backdrop-filter: blur(10px);
    border-radius: 9px; padding: 9px 16px;
    font-size: 12px; font-weight: 700;
    color: #fff;
    text-decoration: none;
    transition: all .18s;
    cursor: pointer;
  }
  .rd-demo-btn:hover {
    background: rgba(255,255,255,.22);
    border-color: rgba(255,255,255,.5);
  }
  .rd-demo-btn-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #00f3ff;
    box-shadow: 0 0 6px rgba(0,243,255,.8);
    flex-shrink: 0;
  }

  .rd-body { padding: 20px 32px 0; display: flex; flex-direction: column; gap: 16px; }

  .rd-meta { display: grid; grid-template-columns: repeat(3, 1fr); gap: 11px; }
  .rdm { background: #0c0f14; border: 1px solid rgba(255,255,255,.06); border-radius: 11px; padding: 14px 16px; }
  .rdm-l { font-size: 8px; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(255,255,255,.22); margin-bottom: 7px; }
  .rdm-v { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; line-height: 1; }
  .rdm-s { font-size: 10px; color: rgba(255,255,255,.28); margin-top: 4px; }

  .rd-info { display: grid; grid-template-columns: 1fr 1.3fr 1.3fr; gap: 11px; }
  .rd-box { background: #0c0f14; border: 1px solid rgba(255,255,255,.06); border-radius: 11px; padding: 15px 16px; }
  .rd-box-t { font-size: 8px; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(255,255,255,.2); margin-bottom: 11px; }
  .rd-box-p { font-size: 12.5px; color: rgba(255,255,255,.43); line-height: 1.75; }
  .rd-func { display: flex; align-items: center; gap: 7px; font-size: 12px; color: rgba(255,255,255,.48); padding: 4px 0; border-bottom: 1px solid rgba(255,255,255,.03); }
  .rd-func:last-child { border-bottom: none; }
  .rd-func-ok { color: #10b981; font-size: 10px; }

  .rd-action {
    background: #0c0f14; border: 1px solid rgba(255,255,255,.06);
    border-radius: 11px; padding: 16px 18px;
    display: flex; align-items: center; justify-content: space-between; gap: 16px;
  }
  .rd-action-t { font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 4px; }
  .rd-action-s { font-size: 11px; color: rgba(255,255,255,.3); line-height: 1.55; }
  .rd-action-btns { display: flex; gap: 9px; flex-shrink: 0; }

  .rd-cola { background: rgba(245,158,11,.07); border: 1px solid rgba(245,158,11,.15); border-radius: 10px; padding: 11px 15px; font-size: 12px; color: rgba(245,158,11,.75); display: flex; align-items: center; gap: 8px; }

  .rd-mis-hdr { display: flex; align-items: center; justify-content: space-between; padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,.05); margin-bottom: 12px; }
  .rd-mis-ttl { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 800; color: #fff; }
  .rd-mis-sub { font-size: 11px; color: rgba(255,255,255,.25); margin-top: 2px; }
  .rd-mis-total { background: rgba(16,185,129,.07); border: 1px solid rgba(16,185,129,.12); border-radius: 8px; padding: 6px 12px; text-align: center; }
  .rd-mis-total-v { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 800; color: #10b981; line-height: 1; }
  .rd-mis-total-l { font-size: 8px; color: rgba(16,185,129,.4); text-transform: uppercase; letter-spacing: 1px; margin-top: 2px; }

  .rd-mis-card { background: #0c0f14; border: 1px solid rgba(255,255,255,.05); border-radius: 10px; padding: 14px 16px; display: flex; gap: 13px; align-items: flex-start; margin-bottom: 9px; }
  .rd-mis-pago { flex-shrink: 0; background: rgba(16,185,129,.07); border: 1px solid rgba(16,185,129,.12); border-radius: 8px; padding: 9px 11px; text-align: center; min-width: 58px; }
  .rd-mis-pago-v { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 800; color: #10b981; line-height: 1; }
  .rd-mis-pago-l { font-size: 7px; color: rgba(16,185,129,.4); text-transform: uppercase; letter-spacing: 1px; margin-top: 2px; }
  .rd-mis-nom  { font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 3px; }
  .rd-mis-desc { font-size: 11.5px; color: rgba(255,255,255,.35); line-height: 1.55; }
  .rd-mis-empty { font-size: 12px; color: rgba(255,255,255,.2); padding: 20px 0; text-align: center; }

  .rd-loading { text-align: center; padding: 80px; color: rgba(255,255,255,.2); font-size: 13px; }

  .rbtn { padding: 7px 14px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; border: none; font-family: 'Plus Jakarta Sans', sans-serif; transition: all .16s; white-space: nowrap; }
  .rbtn.ghost { background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.09); color: rgba(255,255,255,.4); }
  .rbtn.ghost:hover { border-color: rgba(255,255,255,.2); color: #fff; }
  .rbtn.cyan  { background: #00f3ff; color: #000; }
  .rbtn.cyan:hover { background: #7fffff; }
  .rbtn.amber { background: rgba(245,158,11,.1); border: 1px solid rgba(245,158,11,.22); color: #f59e0b; }
  .rbtn.amber:hover { background: rgba(245,158,11,.18); }

  .rovl { position: fixed; inset: 0; z-index: 9000; background: rgba(0,0,0,.8); display: flex; align-items: center; justify-content: center; backdrop-filter: blur(5px); }
  .rmod { background: #0e1319; border: 1px solid rgba(0,243,255,.12); border-radius: 15px; padding: 28px; max-width: 400px; width: 92%; }
  .rmod-t    { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 800; color: #fff; margin-bottom: 8px; }
  .rmod-desc { font-size: 12.5px; color: rgba(255,255,255,.4); line-height: 1.7; margin-bottom: 14px; }
  .rmod-warn { background: rgba(245,158,11,.07); border: 1px solid rgba(245,158,11,.16); border-radius: 8px; padding: 11px 13px; font-size: 11.5px; color: rgba(245,158,11,.78); line-height: 1.65; margin-bottom: 16px; }
  .rmod-row  { display: flex; gap: 8px; }
  .rmod-row .rbtn { flex: 1; text-align: center; }
  .rmod-cola-info { background: rgba(245,158,11,.05); border: 1px solid rgba(245,158,11,.1); border-radius: 8px; padding: 11px 13px; margin-bottom: 14px; display: flex; align-items: center; gap: 10px; }
  .rmod-cola-n { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; color: #f59e0b; line-height: 1; flex-shrink: 0; }
  .rmod-cola-txt { font-size: 11.5px; color: rgba(255,255,255,.35); line-height: 1.6; }

  @media (max-width: 768px) {
    .rd-meta { grid-template-columns: 1fr 1fr; }
    .rd-info  { grid-template-columns: 1fr; }
    .rd-gal   { margin: 16px 16px 0; }
    .rd-back  { padding: 18px 16px 0; }
    .rd-body  { padding: 16px 16px 0; }
  }
`

export default function RetoDetalle() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const [proyecto, setProyecto] = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [imgIdx,   setImgIdx]   = useState(0)
  const [modal,    setModal]    = useState(null)

  useEffect(() => {
    const cargar = async () => {
      try {
        const snap = await getDoc(doc(db, "proyectos", id))
        if (snap.exists()) setProyecto({ id: snap.id, ...snap.data() })
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    cargar()
    window.scrollTo({ top: 0 })
  }, [id])

  if (loading) return (
    <div className="rd"><style>{CSS}</style>
      <div className="rd-loading">Cargando proyecto...</div>
    </div>
  )

  if (!proyecto) return (
    <div className="rd"><style>{CSS}</style>
      <div className="rd-loading">Proyecto no encontrado</div>
    </div>
  )

  const esDisp        = proyecto.estado === "disponible"
  const imagenes      = Array.isArray(proyecto.imagenes) ? proyecto.imagenes : (proyecto.imgPrincipal ? [proyecto.imgPrincipal] : [])
  const imgActual     = imagenes[imgIdx] || proyecto.imgPrincipal || proyecto.img || ""
  const comision      = Math.round((Number(proyecto.precioMin) + Number(proyecto.precioMax)) / 2 * Number(proyecto.comision) / 100)
  const misiones      = proyecto.misiones || []
  const totalMis      = misiones.reduce((a, m) => a + Number(m.pago || 0), 0)
  const tieneDemo     = proyecto.demo && proyecto.demo !== "#" && proyecto.demo.startsWith("http")
  const funcionalidades = Array.isArray(proyecto.funcionalidades)
    ? proyecto.funcionalidades
    : (proyecto.funcionalidades ? proyecto.funcionalidades.split(",").map(f => f.trim()).filter(Boolean) : [])

  const prev = () => setImgIdx(i => (i - 1 + imagenes.length) % imagenes.length)
  const next = () => setImgIdx(i => (i + 1) % imagenes.length)

  return (
    <div className="rd">
      <style>{CSS}</style>

      {/* back */}
      <div className="rd-back">
        <button className="rd-back-btn" onClick={() => navigate("/retos")}>Volver</button>
        <span className="rd-breadcrumb">Proyectos / <span>{proyecto.nombre}</span></span>
      </div>

      {/* galeria */}
      <div className="rd-gal">
        {imgActual && <img src={imgActual} alt={proyecto.nombre} className="rd-gal-img" />}
        <div className="rd-gal-overlay" />

        {imagenes.length > 1 && (
          <>
            <button className="rd-gal-btn prev" onClick={prev}>&#8249;</button>
            <button className="rd-gal-btn next" onClick={next}>&#8250;</button>
            <div className="rd-gal-dots">
              {imagenes.map((_, i) => (
                <button key={i} className={`rd-gal-dot ${i === imgIdx ? "on" : ""}`} onClick={() => setImgIdx(i)} />
              ))}
            </div>
          </>
        )}

        <div className="rd-gal-over">
          <div>
            <div className="rd-cat">{proyecto.categoria?.toUpperCase()}</div>
            <div className="rd-nom">{proyecto.nombre}</div>
          </div>

          {/* lado derecho del overlay */}
          <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:10 }}>
            {/* chip de estado */}
            <div style={{
              display:"inline-flex", alignItems:"center", gap:5,
              fontSize:9, fontWeight:800, padding:"4px 11px", borderRadius:20,
              ...(esDisp
                ? { background:"rgba(16,185,129,.18)", border:"1px solid rgba(16,185,129,.35)", color:"#10b981" }
                : { background:"rgba(245,158,11,.15)", border:"1px solid rgba(245,158,11,.3)", color:"#f59e0b" })
            }}>
              <div style={{ width:4, height:4, borderRadius:"50%", background:"currentColor" }} />
              {esDisp ? "Disponible" : `En cola - ${proyecto.cola || 0}`}
            </div>

            {/* botón ver demo */}
            {tieneDemo && (
              <a
                className="rd-demo-btn"
                href={proyecto.demo}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="rd-demo-btn-dot" />
                Ver demo
              </a>
            )}
          </div>
        </div>
      </div>

      {/* body */}
      <div className="rd-body">

        <div className="rd-meta">
          <div className="rdm">
            <div className="rdm-l">Precio desarrollo</div>
            <div className="rdm-v" style={{ color:"#00f3ff", fontSize:18 }}>
              S/.{Number(proyecto.precioMin).toLocaleString()} - {Number(proyecto.precioMax).toLocaleString()}
            </div>
            <div className="rdm-s">Pago unico del cliente</div>
          </div>
          <div className="rdm">
            <div className="rdm-l">Tu comision ({proyecto.comision}%)</div>
            <div className="rdm-v" style={{ color:"#10b981" }}>~S/.{comision}</div>
            <div className="rdm-s">Pagado en 48h tras aprobar</div>
          </div>
          <div className="rdm">
            {esDisp ? (
              <>
                <div className="rdm-l">Estado</div>
                <div className="rdm-v" style={{ color:"#10b981", fontSize:15, paddingTop:3 }}>Disponible</div>
                <div className="rdm-s">Listo para reservar</div>
              </>
            ) : (
              <>
                <div className="rdm-l">Cola actual</div>
                <div className="rdm-v" style={{ color:"#f59e0b" }}>{proyecto.cola || 0}</div>
                <div className="rdm-s">vendedores antes que tu</div>
              </>
            )}
          </div>
        </div>

        {!esDisp && (
          <div className="rd-cola">
            Este proyecto tiene {proyecto.cola || 0} vendedor{(proyecto.cola||0) > 1 ? "es" : ""} en cola.
            Puedes unirte y seras notificado cuando se libere para ti.
          </div>
        )}

        <div className="rd-info">
          <div className="rd-box">
            <div className="rd-box-t">Funcionalidades</div>
            {funcionalidades.map((f, i) => (
              <div key={i} className="rd-func">
                <span className="rd-func-ok">✓</span>
                {f}
              </div>
            ))}
          </div>
          <div className="rd-box">
            <div className="rd-box-t">Descripcion</div>
            <div className="rd-box-p">{proyecto.descripcion}</div>
          </div>
          <div className="rd-box">
            <div className="rd-box-t">Publico objetivo</div>
            <div className="rd-box-p">{proyecto.publicoObjetivo}</div>
          </div>
        </div>

        {/* accion */}
        <div className="rd-action">
          <div style={{ flex:1 }}>
            <div className="rd-action-t">
              {esDisp ? "Este proyecto esta libre ahora" : "Quieres vender este proyecto?"}
            </div>
            <div className="rd-action-s">
              {esDisp
                ? "Reservalo hoy y tienes 6 dias para presentarlo y cerrarlo con tu cliente"
                : `Unete a la cola. Hay ${proyecto.cola || 0} vendedor${(proyecto.cola||0) > 1?"es":""} antes. Seras notificado cuando sea tu turno.`
              }
            </div>
          </div>
          <div className="rd-action-btns">
            {tieneDemo && (
              <a href={proyecto.demo} target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none" }}>
                <button className="rbtn ghost">Ver demo</button>
              </a>
            )}
            <button
              className={`rbtn ${esDisp ? "cyan" : "amber"}`}
              onClick={() => setModal(esDisp ? "vender" : "cola")}
            >
              {esDisp ? "Reservar y vender" : "Unirse a la cola"}
            </button>
          </div>
        </div>

        {/* misiones */}
        <div className="rd-box" style={{ padding:"18px 20px" }}>
          <div className="rd-mis-hdr">
            <div>
              <div className="rd-mis-ttl">Misiones del proyecto</div>
              <div className="rd-mis-sub">
                {misiones.length > 0
                  ? "Tareas con pago fijo - cobras aunque no cierres la venta"
                  : "Sin misiones disponibles aun"}
              </div>
            </div>
            {totalMis > 0 && (
              <div className="rd-mis-total">
                <div className="rd-mis-total-v">S/.{totalMis}</div>
                <div className="rd-mis-total-l">en misiones</div>
              </div>
            )}
          </div>

          {misiones.length === 0 ? (
            <div className="rd-mis-empty">Sin misiones por ahora</div>
          ) : (
            misiones.map((m, i) => (
              <div key={m.id || i} className="rd-mis-card">
                <div className="rd-mis-pago">
                  <div className="rd-mis-pago-v">S/.{m.pago}</div>
                  <div className="rd-mis-pago-l">pago</div>
                </div>
                <div>
                  <div className="rd-mis-nom">{m.titulo}</div>
                  <div className="rd-mis-desc">{m.desc}</div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* modales */}
      {modal && (
        <div className="rovl" onClick={() => setModal(null)}>
          <div className="rmod" onClick={e => e.stopPropagation()}>
            {modal === "vender" && (
              <>
                <div className="rmod-t">Reservar - {proyecto.nombre}</div>
                <div className="rmod-desc">
                  Al reservar tendras <strong style={{ color:"#fff" }}>6 dias</strong> para presentar el demo y reportar la venta.
                  Tu comision estimada es <strong style={{ color:"#10b981" }}>~S/.{comision}</strong>.
                </div>
                <div className="rmod-warn">
                  Las reservas expiradas bajan tu reputacion. Solo reserva si tienes un cliente en mente.
                </div>
                <div className="rmod-row">
                  <button className="rbtn ghost" onClick={() => setModal(null)}>Cancelar</button>
                  <button className="rbtn cyan" onClick={() => setModal(null)}>Confirmar reserva</button>
                </div>
              </>
            )}
            {modal === "cola" && (
              <>
                <div className="rmod-t">Unirse a la cola</div>
                <div className="rmod-desc">Este proyecto ya tiene vendedores en cola. Al unirte seras notificado cuando sea tu turno.</div>
                <div className="rmod-cola-info">
                  <div className="rmod-cola-n">{proyecto.cola || 0}</div>
                  <div className="rmod-cola-txt">vendedor{(proyecto.cola||0) > 1 ? "es" : ""} antes que tu.</div>
                </div>
                <div className="rmod-warn">
                  Si el proyecto te llega y no lo reservas en 24h, pierdes tu lugar en la cola.
                </div>
                <div className="rmod-row">
                  <button className="rbtn ghost" onClick={() => setModal(null)}>Cancelar</button>
                  <button className="rbtn amber" onClick={() => setModal(null)}>Unirse a la cola</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}