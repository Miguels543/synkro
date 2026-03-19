import { useState, useEffect } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../../firebase/config"

const CSS_CLI = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');
  .acl { padding:26px 30px 60px; }
  .acl-ttl { font-family:'Syne',sans-serif; font-size:20px; font-weight:800; color:#fff; margin-bottom:3px; }
  .acl-sub  { font-size:12px; color:rgba(255,255,255,.28); margin-bottom:22px; }
  .acl-toolbar { display:flex; gap:10px; margin-bottom:16px; }
  .acl-search { flex:1; background:#0c0f14; border:1px solid rgba(255,255,255,.08); border-radius:9px; padding:8px 14px; color:#fff; font-size:13px; font-family:'Plus Jakarta Sans',sans-serif; outline:none; }
  .acl-search:focus { border-color:rgba(0,243,255,.3); }
  .acl-search::placeholder { color:rgba(255,255,255,.2); }
  .acl-loading { text-align:center; padding:48px; color:rgba(255,255,255,.25); font-size:13px; }
  .acl-tabla { background:#0c0f14; border:1px solid rgba(255,255,255,.06); border-radius:11px; overflow:hidden; }
  .acl-hdr { display:grid; grid-template-columns:2fr 1fr 1.5fr 1.5fr 1fr 1fr; padding:10px 16px; border-bottom:1px solid rgba(255,255,255,.05); font-size:8.5px; letter-spacing:1.5px; text-transform:uppercase; color:rgba(255,255,255,.2); }
  .acl-row { display:grid; grid-template-columns:2fr 1fr 1.5fr 1.5fr 1fr 1fr; padding:13px 16px; border-bottom:1px solid rgba(255,255,255,.03); align-items:center; transition:background .13s; }
  .acl-row:last-child { border-bottom:none; }
  .acl-row:hover { background:rgba(255,255,255,.02); }
  .acl-nom   { font-size:13px; font-weight:600; color:#fff; margin-bottom:2px; }
  .acl-cont  { font-size:10px; color:rgba(255,255,255,.3); }
  .acl-val   { font-size:12px; color:rgba(255,255,255,.5); }
  .acl-monto { font-family:'Syne',sans-serif; font-size:13px; font-weight:800; color:#00f3ff; }
`

export default function AdminClientes() {
  const [clientes, setClientes] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [buscar,   setBuscar]   = useState("")

  useEffect(() => {
    const cargar = async () => {
      try {
        const snap = await getDocs(collection(db, "clientes"))
        setClientes(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [])

  const filtrados = clientes.filter(c =>
    c.nombre?.toLowerCase().includes(buscar.toLowerCase()) ||
    c.rubro?.toLowerCase().includes(buscar.toLowerCase())
  )

  const formatFecha = (f) => {
    if (!f) return "—"
    if (f?.toDate) return f.toDate().toLocaleDateString("es-PE", { day:"numeric", month:"short", year:"numeric" })
    return f
  }

  return (
    <div className="acl">
      <style>{CSS_CLI}</style>
      <div className="acl-ttl">Clientes</div>
      <div className="acl-sub">Empresas y negocios que compraron a través de Synkro</div>

      <div className="acl-toolbar">
        <input className="acl-search" placeholder="Buscar cliente o rubro..." value={buscar} onChange={e=>setBuscar(e.target.value)} />
        <div style={{ fontSize:11, color:"rgba(255,255,255,.22)", display:"flex", alignItems:"center" }}>
          {loading ? "..." : `${filtrados.length} clientes`}
        </div>
      </div>

      {loading && <div className="acl-loading">Cargando clientes...</div>}

      {!loading && (
        <div className="acl-tabla">
          <div className="acl-hdr">
            <span>Cliente</span><span>Rubro</span><span>Vendedor</span>
            <span>Proyecto</span><span>Monto</span><span>Fecha</span>
          </div>
          {filtrados.length === 0 && (
            <div style={{ padding:"32px", textAlign:"center", color:"rgba(255,255,255,.2)", fontSize:"13px" }}>
              No hay clientes todavía
            </div>
          )}
          {filtrados.map(c => (
            <div key={c.id} className="acl-row">
              <div>
                <div className="acl-nom">{c.nombre}</div>
                <div className="acl-cont">{c.contacto} · {c.telefono}</div>
              </div>
              <div className="acl-val">{c.rubro}</div>
              <div className="acl-val">{c.vendedor}</div>
              <div className="acl-val">{c.proyecto}</div>
              <div className="acl-monto">S/.{Number(c.monto||0).toLocaleString()}</div>
              <div className="acl-val">{formatFecha(c.fecha)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}