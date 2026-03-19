import { useState, useMemo, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../../firebase/config"

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .rp {
    margin-top: 65px;
    background: #050709;
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: #d1d5db;
    min-height: 100vh;
  }

  .rp-bar {
    padding: 22px 32px 0;
    display: flex; justify-content: space-between; align-items: flex-start;
    flex-wrap: wrap; gap: 16px;
  }
  .rp-ttl { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800; color: #fff; margin-bottom: 3px; }
  .rp-sub { font-size: 12px; color: rgba(255,255,255,.28); }

  .rp-filtros { padding: 18px 32px 0; display: flex; flex-direction: column; gap: 10px; }
  .rp-fil-row { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }

  /* Buscador */
  .rp-search {
    background: #0c0f14; border: 1px solid rgba(255,255,255,.08);
    border-radius: 9px; padding: 8px 14px;
    color: #fff; font-size: 12px; font-weight: 500;
    font-family: 'Plus Jakarta Sans', sans-serif;
    outline: none; transition: border-color .16s;
    min-width: 220px;
  }
  .rp-search:focus { border-color: rgba(0,243,255,.3); }
  .rp-search::placeholder { color: rgba(255,255,255,.25); }

  .rp-sel {
    background: #0c0f14; border: 1px solid rgba(255,255,255,.08);
    border-radius: 9px; padding: 8px 32px 8px 14px;
    color: rgba(255,255,255,.6); font-size: 12px; font-weight: 500;
    font-family: 'Plus Jakarta Sans', sans-serif;
    outline: none; cursor: pointer; transition: border-color .16s;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='rgba(255,255,255,.3)' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 12px center;
  }
  .rp-sel:focus { border-color: rgba(0,243,255,.3); }
  .rp-sel option { background: #0c0f14; }

  .rp-pill {
    padding: 7px 14px; border-radius: 20px; font-size: 11px; font-weight: 700;
    cursor: pointer; border: 1px solid rgba(255,255,255,.07);
    background: rgba(255,255,255,.03); color: rgba(255,255,255,.35);
    transition: all .16s; font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .rp-pill:hover { border-color: rgba(255,255,255,.15); color: rgba(255,255,255,.6); }
  .rp-pill.on { background: rgba(0,243,255,.08); border-color: rgba(0,243,255,.25); color: #00f3ff; }

  .rp-slider-wrap {
    display: flex; align-items: center; gap: 12px;
    background: #0c0f14; border: 1px solid rgba(255,255,255,.08);
    border-radius: 9px; padding: 8px 14px; min-width: 260px;
  }
  .rp-slider-lbl { font-size: 11px; color: rgba(255,255,255,.3); white-space: nowrap; }
  .rp-slider-val { font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 800; color: #00f3ff; white-space: nowrap; min-width: 70px; text-align: right; }
  .rp-slider {
    flex: 1; -webkit-appearance: none; appearance: none;
    height: 3px; border-radius: 2px; outline: none; cursor: pointer;
    background: linear-gradient(to right, #00f3ff var(--pct, 50%), rgba(255,255,255,.1) var(--pct, 50%));
  }
  .rp-slider::-webkit-slider-thumb {
    -webkit-appearance: none; width: 14px; height: 14px;
    border-radius: 50%; background: #00f3ff;
    border: 2px solid #050709; cursor: pointer;
    box-shadow: 0 0 6px rgba(0,243,255,.4);
  }

  .rp-count { font-size: 11px; color: rgba(255,255,255,.22); margin-left: auto; white-space: nowrap; }

  .rp-grid {
    padding: 20px 32px 60px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 14px;
  }

  .rp-loading { grid-column: 1/-1; text-align: center; padding: 60px; color: rgba(255,255,255,.2); font-size: 13px; }

  .rp-card {
    background: #0c0f14;
    border: 1px solid rgba(255,255,255,.06);
    border-radius: 13px; overflow: hidden;
    transition: border-color .2s, transform .2s;
    cursor: pointer;
    display: flex; flex-direction: column;
  }
  .rp-card:hover { border-color: rgba(0,243,255,.18); transform: translateY(-2px); }

  .rp-card-img { width: 100%; aspect-ratio: 16/8; object-fit: cover; display: block; }
  .rp-card-img-wrap { position: relative; overflow: hidden; }
  .rp-card-img-wrap::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(to bottom, transparent 40%, rgba(12,15,20,.95) 100%);
  }

  .rp-card-cat {
    position: absolute; top: 11px; left: 11px; z-index: 2;
    font-size: 8px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
    padding: 3px 9px; border-radius: 20px;
    background: rgba(0,0,0,.55); border: 1px solid rgba(255,255,255,.1);
    color: rgba(255,255,255,.55); backdrop-filter: blur(6px);
  }
  .rp-card-badge {
    position: absolute; top: 11px; right: 11px; z-index: 2;
    font-size: 8px; font-weight: 800; letter-spacing: .5px; text-transform: uppercase;
    padding: 3px 9px; border-radius: 20px;
    display: flex; align-items: center; gap: 4px;
  }
  .rp-card-badge.disp { background: rgba(16,185,129,.15); border: 1px solid rgba(16,185,129,.25); color: #10b981; }
  .rp-card-badge.cola { background: rgba(245,158,11,.12); border: 1px solid rgba(245,158,11,.22); color: #f59e0b; }
  .rp-badge-dot { width: 4px; height: 4px; border-radius: 50%; background: currentColor; animation: blk 1.2s infinite; }
  @keyframes blk { 0%,100%{opacity:1} 50%{opacity:.2} }

  .rp-card-body { padding: 14px 16px; flex: 1; display: flex; flex-direction: column; gap: 8px; }
  .rp-card-nom { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 800; color: #fff; line-height: 1.25; }
  .rp-card-desc { font-size: 11.5px; color: rgba(255,255,255,.35); line-height: 1.65; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

  .rp-card-nums { display: flex; gap: 16px; padding-top: 4px; }
  .rp-cn-l { font-size: 8px; letter-spacing: 1.2px; text-transform: uppercase; color: rgba(255,255,255,.22); margin-bottom: 3px; }
  .rp-cn-v { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 800; }

  .rp-card-cola { font-size: 10px; color: rgba(245,158,11,.6); display: flex; align-items: center; gap: 5px; }

  .rp-card-ftr {
    padding: 10px 16px 14px;
    display: flex; gap: 8px;
    border-top: 1px solid rgba(255,255,255,.04);
  }

  .rbtn {
    padding: 7px 14px; border-radius: 8px; font-size: 12px; font-weight: 700;
    cursor: pointer; border: none; font-family: 'Plus Jakarta Sans', sans-serif;
    transition: all .16s; white-space: nowrap;
  }
  .rbtn.ghost { background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.09); color: rgba(255,255,255,.4); }
  .rbtn.ghost:hover { border-color: rgba(255,255,255,.2); color: #fff; }
  .rbtn.cyan  { background: #00f3ff; color: #000; }
  .rbtn.cyan:hover { background: #7fffff; }
  .rbtn.amber { background: rgba(245,158,11,.1); border: 1px solid rgba(245,158,11,.22); color: #f59e0b; }
  .rbtn.amber:hover { background: rgba(245,158,11,.18); }
  .rbtn.full  { flex: 1; text-align: center; }
  .rbtn:disabled { opacity: .35; cursor: not-allowed; }

  .rp-empty { grid-column: 1/-1; padding: 60px 20px; text-align: center; color: rgba(255,255,255,.2); font-size: 13px; }
  .rp-empty-ico { font-size: 36px; margin-bottom: 12px; }

  .rovl {
    position: fixed; inset: 0; z-index: 9000;
    background: rgba(0,0,0,.8); display: flex; align-items: center; justify-content: center;
    backdrop-filter: blur(5px);
  }
  .rmod {
    background: #0e1319; border: 1px solid rgba(0,243,255,.12);
    border-radius: 15px; padding: 28px; max-width: 400px; width: 92%;
  }
  .rmod-t    { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 800; color: #fff; margin-bottom: 8px; }
  .rmod-desc { font-size: 12.5px; color: rgba(255,255,255,.4); line-height: 1.7; margin-bottom: 14px; }
  .rmod-warn { background: rgba(245,158,11,.07); border: 1px solid rgba(245,158,11,.16); border-radius: 8px; padding: 11px 13px; font-size: 11.5px; color: rgba(245,158,11,.78); line-height: 1.65; margin-bottom: 16px; }
  .rmod-row  { display: flex; gap: 8px; }
  .rmod-row .rbtn.full { flex: 1; }
  .rmod-cola-info { background: rgba(245,158,11,.05); border: 1px solid rgba(245,158,11,.1); border-radius: 8px; padding: 11px 13px; margin-bottom: 14px; display: flex; align-items: center; gap: 10px; }
  .rmod-cola-n { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; color: #f59e0b; line-height: 1; flex-shrink: 0; }
  .rmod-cola-txt { font-size: 11.5px; color: rgba(255,255,255,.35); line-height: 1.6; }

  @keyframes sup { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
`

export default function Retos() {
  const navigate = useNavigate()
  const [proyectos, setProyectos] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [buscar,    setBuscar]    = useState("")
  const [catFil,    setCatFil]    = useState("Todas")
  const [dispFil,   setDispFil]   = useState("todos")
  const [precio,    setPrecio]    = useState(50000)
  const [modal,     setModal]     = useState(null)
  const [selP,      setSelP]      = useState(null)

  const PRECIO_MAX = 6000

  useEffect(() => {
    const cargar = async () => {
      try {
        const snap = await getDocs(collection(db, "proyectos"))
        setProyectos(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [])

  // Categorías dinámicas desde los proyectos cargados
  const categorias = useMemo(() => {
    const cats = [...new Set(proyectos.map(p => p.categoria).filter(Boolean))].sort()
    return ["Todas", ...cats]
  }, [proyectos])

  const filtrados = useMemo(() => {
    return proyectos.filter(p => {
      if (buscar && !p.nombre?.toLowerCase().includes(buscar.toLowerCase()) &&
          !p.descripcion?.toLowerCase().includes(buscar.toLowerCase())) return false
      if (catFil !== "Todas" && p.categoria !== catFil) return false
      if (dispFil === "disponibles" && p.estado !== "disponible") return false
      if (dispFil === "cola" && p.estado !== "cola") return false
      if (Number(p.precioMin) > precio) return false
      return true
    })
  }, [proyectos, buscar, catFil, dispFil, precio])

  const pct = ((precio - 500) / (PRECIO_MAX - 500) * 100).toFixed(1)
  const cerrarModal = () => { setModal(null); setSelP(null) }

  return (
    <div className="rp">
      <style>{CSS}</style>

      <div className="rp-bar">
        <div>
          <div className="rp-ttl">Proyectos disponibles</div>
          <div className="rp-sub">Explora los proyectos, reserva y empieza a vender</div>
        </div>
      </div>

      <div className="rp-filtros">
        {/* Fila 1: buscador + categoría + disponibilidad */}
        <div className="rp-fil-row">
          <input
            className="rp-search"
            placeholder="Buscar proyecto..."
            value={buscar}
            onChange={e => setBuscar(e.target.value)}
          />

          <select className="rp-sel" value={catFil} onChange={e => setCatFil(e.target.value)}>
            {categorias.map(c => <option key={c}>{c}</option>)}
          </select>

          {[
            { id:"todos",       lbl:"Todos"       },
            { id:"disponibles", lbl:"Disponibles" },
            { id:"cola",        lbl:"En cola"     },
          ].map(p => (
            <button key={p.id} className={`rp-pill ${dispFil === p.id ? "on" : ""}`} onClick={() => setDispFil(p.id)}>
              {p.lbl}
            </button>
          ))}

          <div className="rp-slider-wrap">
            <span className="rp-slider-lbl">Hasta</span>
            <input
              type="range" className="rp-slider"
              min={500} max={PRECIO_MAX} step={100}
              value={precio}
              style={{ "--pct": `${pct}%` }}
              onChange={e => setPrecio(+e.target.value)}
            />
            <span className="rp-slider-val">S/.{precio.toLocaleString()}</span>
          </div>

          <span className="rp-count">{loading ? "..." : `${filtrados.length} proyectos`}</span>
        </div>
      </div>

      <div className="rp-grid">
        {loading && <div className="rp-loading">Cargando proyectos...</div>}

        {!loading && filtrados.length === 0 && (
          <div className="rp-empty">
            <div className="rp-empty-ico">◎</div>
            <div>No hay proyectos con esos filtros</div>
          </div>
        )}

        {!loading && filtrados.map((p, i) => {
          const esDisp = p.estado === "disponible"
          const comision = Math.round((Number(p.precioMin) + Number(p.precioMax)) / 2 * Number(p.comision) / 100)
          const img = p.imgPrincipal || (Array.isArray(p.imagenes) ? p.imagenes[0] : "") || ""

          return (
            <div key={p.id} className="rp-card" style={{ animation: `sup .3s ease ${i * 40}ms both` }}>
              <div className="rp-card-img-wrap" onClick={() => navigate(`/retos/${p.id}`)}>
                {img && <img src={img} alt={p.nombre} className="rp-card-img" />}
                <div className="rp-card-cat">{p.categoria}</div>
                <div className={`rp-card-badge ${esDisp ? "disp" : "cola"}`}>
                  <div className="rp-badge-dot" />
                  {esDisp ? "Disponible" : `Cola - ${p.cola || 0}`}
                </div>
              </div>

              <div className="rp-card-body" onClick={() => navigate(`/retos/${p.id}`)}>
                <div className="rp-card-nom">{p.nombre}</div>
                <div className="rp-card-desc">{p.descripcion}</div>
                <div className="rp-card-nums">
                  <div>
                    <div className="rp-cn-l">Precio desarrollo</div>
                    <div className="rp-cn-v" style={{ color:"#00f3ff" }}>
                      S/.{Number(p.precioMin).toLocaleString()} - {Number(p.precioMax).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="rp-cn-l">Tu comision ({p.comision}%)</div>
                    <div className="rp-cn-v" style={{ color:"#10b981" }}>~S/.{comision}</div>
                  </div>
                </div>
                {!esDisp && p.cola > 0 && (
                  <div className="rp-card-cola">
                    {p.cola} vendedor{p.cola > 1 ? "es" : ""} en cola
                  </div>
                )}
              </div>

              <div className="rp-card-ftr">
                <button className="rbtn ghost" onClick={() => navigate(`/retos/${p.id}`)}>Ver detalles</button>
                <button
                  className={`rbtn full ${esDisp ? "cyan" : "amber"}`}
                  onClick={e => { e.stopPropagation(); setSelP(p); setModal(esDisp ? "vender" : "cola") }}
                >
                  {esDisp ? "Vender" : "Unirse a la cola"}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {modal && (
        <div className="rovl" onClick={cerrarModal}>
          <div className="rmod" onClick={e => e.stopPropagation()}>
            {modal === "vender" && (
              <>
                <div className="rmod-t">Reservar - {selP?.nombre}</div>
                <div className="rmod-desc">
                  Al reservar tendras <strong style={{ color:"#fff" }}>6 dias</strong> para presentar el demo y reportar la venta.
                  Tu comision estimada es <strong style={{ color:"#10b981" }}>~S/.{Math.round((Number(selP?.precioMin)+Number(selP?.precioMax))/2*Number(selP?.comision)/100)}</strong>.
                </div>
                <div className="rmod-warn">
                  Las reservas expiradas bajan tu reputacion. Solo reserva si tienes un cliente en mente.
                </div>
                <div className="rmod-row">
                  <button className="rbtn ghost full" onClick={cerrarModal}>Cancelar</button>
                  <button className="rbtn cyan full" onClick={cerrarModal}>Confirmar reserva</button>
                </div>
              </>
            )}
            {modal === "cola" && (
              <>
                <div className="rmod-t">Unirse a la cola</div>
                <div className="rmod-desc">Este proyecto ya tiene vendedores en cola. Al unirte seras notificado cuando sea tu turno.</div>
                <div className="rmod-cola-info">
                  <div className="rmod-cola-n">{selP?.cola}</div>
                  <div className="rmod-cola-txt">vendedor{selP?.cola > 1 ? "es" : ""} antes que tu.</div>
                </div>
                <div className="rmod-warn">
                  Si el proyecto te llega y no lo reservas en 24h, pierdes tu lugar en la cola.
                </div>
                <div className="rmod-row">
                  <button className="rbtn ghost full" onClick={cerrarModal}>Cancelar</button>
                  <button className="rbtn amber full" onClick={cerrarModal}>Unirse a la cola</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}