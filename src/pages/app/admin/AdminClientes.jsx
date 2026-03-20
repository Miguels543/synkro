import { useState, useEffect } from "react"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "../../../firebase/config"

const CSS_CLI = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');
  .acl { padding:26px 30px 60px; }
  .acl-ttl { font-family:'Syne',sans-serif; font-size:20px; font-weight:800; color:#fff; margin-bottom:3px; }
  .acl-sub  { font-size:12px; color:rgba(255,255,255,.28); margin-bottom:22px; }
  .acl-toolbar { display:flex; gap:10px; margin-bottom:16px; align-items:center; }
  .acl-search { flex:1; background:#0c0f14; border:1px solid rgba(255,255,255,.08); border-radius:9px; padding:8px 14px; color:#fff; font-size:13px; font-family:'Plus Jakarta Sans',sans-serif; outline:none; }
  .acl-search:focus { border-color:rgba(0,243,255,.3); }
  .acl-search::placeholder { color:rgba(255,255,255,.2); }
  .acl-loading { text-align:center; padding:48px; color:rgba(255,255,255,.25); font-size:13px; }

  .acl-tabla { background:#0c0f14; border:1px solid rgba(255,255,255,.06); border-radius:11px; overflow:hidden; }
  .acl-hdr { display:grid; grid-template-columns:2fr 1.5fr 1.5fr 1fr 1fr; padding:10px 16px; border-bottom:1px solid rgba(255,255,255,.05); font-size:8.5px; letter-spacing:1.5px; text-transform:uppercase; color:rgba(255,255,255,.2); }
  .acl-row { display:grid; grid-template-columns:2fr 1.5fr 1.5fr 1fr 1fr; padding:13px 16px; border-bottom:1px solid rgba(255,255,255,.03); align-items:center; transition:background .13s; cursor:pointer; }
  .acl-row:last-child { border-bottom:none; }
  .acl-row:hover { background:rgba(255,255,255,.02); }
  .acl-nom  { font-size:13px; font-weight:600; color:#fff; margin-bottom:2px; }
  .acl-cont { font-size:10px; color:rgba(255,255,255,.3); }
  .acl-val  { font-size:12px; color:rgba(255,255,255,.5); }
  .acl-monto { font-family:'Syne',sans-serif; font-size:13px; font-weight:800; color:#00f3ff; }

  /* Modal detalle cliente */
  .acl-ovl { position:fixed; inset:0; z-index:9000; background:rgba(0,0,0,.8); display:flex; align-items:center; justify-content:center; backdrop-filter:blur(5px); padding:20px; }
  .acl-modal { background:#0e1319; border:1px solid rgba(0,243,255,.15); border-radius:16px; width:100%; max-width:440px; padding:28px; }
  .acl-modal-t { font-family:'Syne',sans-serif; font-size:18px; font-weight:800; color:#fff; margin-bottom:20px; }
  .acl-modal-row { display:flex; justify-content:space-between; padding:9px 0; border-bottom:1px solid rgba(255,255,255,.04); font-size:13px; }
  .acl-modal-row:last-child { border-bottom:none; }
  .acl-modal-lbl { color:rgba(255,255,255,.35); }
  .acl-modal-val { color:#fff; font-weight:600; text-align:right; }

  @media (max-width:768px) {
    .acl { padding:18px 16px 50px; }
    .acl-hdr { display:none; }
    .acl-row { grid-template-columns:1fr; gap:4px; padding:14px 16px; }
    .acl-ttl { font-size:17px; }
  }
  @media (max-width:480px) {
    .acl { padding:14px 12px 40px; }
  }
`

function formatFecha(f) {
  if (!f) return "—"
  const d = f?.toDate ? f.toDate() : new Date(f)
  return d.toLocaleDateString("es-PE", { day:"numeric", month:"short", year:"numeric" })
}

export default function AdminClientes() {
  const [clientes, setClientes] = useState([])  // extraídos de ventas aprobadas
  const [loading,  setLoading]  = useState(true)
  const [buscar,   setBuscar]   = useState("")
  const [detalle,  setDetalle]  = useState(null)

  useEffect(() => {
    const cargar = async () => {
      try {
        // Los clientes viven dentro de las ventas aprobadas
        const snap = await getDocs(
          query(collection(db, "ventas"), where("estado", "==", "aprobado"))
        )
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        setClientes(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [])

  const filtrados = clientes.filter(c =>
    (c.nombreCliente   || "").toLowerCase().includes(buscar.toLowerCase()) ||
    (c.proyectoNombre  || "").toLowerCase().includes(buscar.toLowerCase()) ||
    (c.vendedorNombre  || "").toLowerCase().includes(buscar.toLowerCase()) ||
    (c.contactoCliente || "").toLowerCase().includes(buscar.toLowerCase())
  )

  return (
    <div className="acl">
      <style>{CSS_CLI}</style>
      <div className="acl-ttl">Clientes</div>
      <div className="acl-sub">Negocios que compraron a través de Synkro — extraídos de ventas aprobadas</div>

      <div className="acl-toolbar">
        <input
          className="acl-search"
          placeholder="Buscar cliente, proyecto o vendedor..."
          value={buscar}
          onChange={e => setBuscar(e.target.value)}
        />
        <div style={{ fontSize:11, color:"rgba(255,255,255,.22)", whiteSpace:"nowrap" }}>
          {loading ? "…" : `${filtrados.length} clientes`}
        </div>
      </div>

      {loading && <div className="acl-loading">Cargando clientes…</div>}

      {!loading && (
        <div className="acl-tabla">
          <div className="acl-hdr">
            <span>Cliente</span>
            <span>Vendedor</span>
            <span>Proyecto</span>
            <span>Monto</span>
            <span>Fecha</span>
          </div>

          {filtrados.length === 0 && (
            <div style={{ padding:"32px", textAlign:"center", color:"rgba(255,255,255,.2)", fontSize:13 }}>
              {clientes.length === 0
                ? "No hay ventas aprobadas aún"
                : "Sin resultados para esa búsqueda"}
            </div>
          )}

          {filtrados.map(c => (
            <div key={c.id} className="acl-row" onClick={() => setDetalle(c)}>
              <div>
                <div className="acl-nom">{c.nombreCliente || "—"}</div>
                <div className="acl-cont">{c.contactoCliente || "Sin contacto"}</div>
              </div>
              <div className="acl-val">{c.vendedorNombre || "—"}</div>
              <div className="acl-val">{c.proyectoNombre || "—"}</div>
              <div className="acl-monto">S/.{Number(c.monto||0).toLocaleString()}</div>
              <div className="acl-val">{formatFecha(c.fecha)}</div>
            </div>
          ))}
        </div>
      )}

      {/* Modal detalle */}
      {detalle && (
        <div className="acl-ovl" onClick={() => setDetalle(null)}>
          <div className="acl-modal" onClick={e => e.stopPropagation()}>
            <div className="acl-modal-t">Detalle del cliente</div>
            {[
              { l:"Cliente",          v: detalle.nombreCliente   },
              { l:"Contacto",         v: detalle.contactoCliente },
              { l:"Vendedor",         v: detalle.vendedorNombre  },
              { l:"Proyecto vendido", v: detalle.proyectoNombre  },
              { l:"Monto",            v: `S/.${Number(detalle.monto||0).toLocaleString()}` },
              { l:"Comisión pagada",  v: `S/.${Number(detalle.comisionGanada||0).toLocaleString()}` },
              { l:"Fecha",            v: formatFecha(detalle.fecha) },
            ].map((r,i) => (
              <div key={i} className="acl-modal-row">
                <span className="acl-modal-lbl">{r.l}</span>
                <span className="acl-modal-val">{r.v || "—"}</span>
              </div>
            ))}
            {detalle.comprobanteUrl && (
              <a href={detalle.comprobanteUrl} target="_blank" rel="noopener noreferrer"
                style={{ display:"block", marginTop:16, padding:"10px 14px", background:"rgba(0,243,255,.06)", border:"1px solid rgba(0,243,255,.15)", borderRadius:8, color:"#00f3ff", fontSize:13, fontWeight:600, textAlign:"center", textDecoration:"none" }}>
                📎 Ver comprobante de pago
              </a>
            )}
            <button onClick={() => setDetalle(null)}
              style={{ width:"100%", marginTop:14, padding:"11px", borderRadius:8, background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.09)", color:"rgba(255,255,255,.5)", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}