import { useState, useEffect } from "react"
import { collection, getDocs, updateDoc, doc } from "firebase/firestore"
import { db } from "../../../firebase/config"

const CSS_BASE = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');
  .as { padding:26px 30px 60px; }
  .as-ttl { font-family:'Syne',sans-serif; font-size:20px; font-weight:800; color:#fff; margin-bottom:3px; }
  .as-sub  { font-size:12px; color:rgba(255,255,255,.28); margin-bottom:22px; }
  .as-loading { text-align:center; padding:48px; color:rgba(255,255,255,.25); font-size:13px; }
  .as-tabs { display:flex; gap:8px; margin-bottom:18px; }
  .as-tab  { padding:7px 16px; border-radius:20px; font-size:12px; font-weight:600; cursor:pointer; border:1px solid rgba(255,255,255,.07); background:rgba(255,255,255,.03); color:rgba(255,255,255,.35); transition:all .16s; font-family:'Plus Jakarta Sans',sans-serif; }
  .as-tab.on { background:rgba(0,243,255,.08); border-color:rgba(0,243,255,.25); color:#00f3ff; }
  .as-card { background:#0c0f14; border:1px solid rgba(255,255,255,.06); border-radius:11px; padding:16px 18px; margin-bottom:10px; }
  .as-card-hdr { display:flex; align-items:flex-start; gap:12px; margin-bottom:10px; }
  .as-av { width:38px; height:38px; border-radius:9px; background:linear-gradient(135deg,rgba(0,243,255,.12),rgba(168,85,247,.12)); border:1px solid rgba(0,243,255,.15); display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-size:15px; font-weight:800; color:#00f3ff; flex-shrink:0; }
  .as-nom  { font-size:14px; font-weight:700; color:#fff; margin-bottom:2px; }
  .as-meta { font-size:11px; color:rgba(255,255,255,.3); }
  .as-msg  { font-size:12.5px; color:rgba(255,255,255,.4); line-height:1.7; background:rgba(255,255,255,.02); border-radius:8px; padding:10px 12px; margin-bottom:12px; }
  .as-btns { display:flex; gap:8px; }
  .as-btn  { flex:1; padding:9px; border-radius:8px; font-size:12px; font-weight:700; cursor:pointer; border:none; font-family:'Plus Jakarta Sans',sans-serif; transition:all .16s; text-align:center; }
  .as-btn.green { background:#10b981; color:#fff; }
  .as-btn.green:hover { background:#059669; }
  .as-btn.red   { background:rgba(239,68,68,.1); border:1px solid rgba(239,68,68,.2); color:#ef4444; }
  .as-btn.red:hover { background:rgba(239,68,68,.18); }
  .as-chip { display:inline-flex; align-items:center; gap:4px; font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; padding:3px 9px; border-radius:20px; }
  .as-chip.pen { background:rgba(245,158,11,.09); color:#f59e0b; border:1px solid rgba(245,158,11,.18); }
  .as-chip.ok  { background:rgba(16,185,129,.09); color:#10b981; border:1px solid rgba(16,185,129,.18); }
  .as-chip.rej { background:rgba(239,68,68,.09);  color:#ef4444; border:1px solid rgba(239,68,68,.18); }
`

const chipCfg = {
  pendiente: { cls:"pen", lbl:"Pendiente"  },
  aprobado:  { cls:"ok",  lbl:"Aprobado"   },
  rechazado: { cls:"rej", lbl:"Rechazado"  },
}

export default function AdminSolicitudes() {
  const [solicitudes, setSolicitudes] = useState([])
  const [loading,     setLoading]     = useState(true)
  const [filtro,      setFiltro]      = useState("pendiente")

  useEffect(() => {
    const cargar = async () => {
      try {
        const snap = await getDocs(collection(db, "solicitudes"))
        setSolicitudes(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [])

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      await updateDoc(doc(db, "solicitudes", id), { estado: nuevoEstado })
      setSolicitudes(s => s.map(x => x.id===id ? {...x, estado: nuevoEstado} : x))
    } catch (e) {
      alert("Error: " + e.message)
    }
  }

  const filtradas = solicitudes.filter(s => s.estado === filtro)

  const formatFecha = (f) => {
    if (!f) return ""
    if (f?.toDate) return f.toDate().toLocaleDateString("es-PE", { day:"numeric", month:"short", year:"numeric" })
    return f
  }

  return (
    <div className="as">
      <style>{CSS_BASE}</style>
      <div className="as-ttl">Solicitudes de ingreso</div>
      <div className="as-sub">Vendedores esperando aprobación para acceder a la plataforma</div>

      <div className="as-tabs">
        {["pendiente","aprobado","rechazado"].map(f => (
          <button key={f} className={`as-tab ${filtro===f?"on":""}`} onClick={()=>setFiltro(f)}>
            {f==="pendiente"?"Pendientes":f==="aprobado"?"Aprobados":"Rechazados"} ({solicitudes.filter(s=>s.estado===f).length})
          </button>
        ))}
      </div>

      {loading && <div className="as-loading">Cargando solicitudes...</div>}

      {!loading && filtradas.length === 0 && (
        <div style={{ textAlign:"center", padding:"40px 20px", color:"rgba(255,255,255,.2)", fontSize:13 }}>
          No hay solicitudes en esta categoría
        </div>
      )}

      {!loading && filtradas.map(s => {
        const cfg = chipCfg[s.estado] || chipCfg.pendiente
        return (
          <div key={s.id} className="as-card">
            <div className="as-card-hdr">
              <div className="as-av">{s.nombre?.[0] || "?"}</div>
              <div style={{ flex:1 }}>
                <div className="as-nom">{s.nombre}</div>
                <div className="as-meta">{s.email} · {s.telefono} · {formatFecha(s.fecha)}</div>
              </div>
              <span className={`as-chip ${cfg.cls}`}>{cfg.lbl}</span>
            </div>
            {s.mensaje && <div className="as-msg">"{s.mensaje}"</div>}
            {s.estado === "pendiente" && (
              <div className="as-btns">
                <button className="as-btn red"   onClick={()=>cambiarEstado(s.id, "rechazado")}>✕ Rechazar</button>
                <button className="as-btn green" onClick={()=>cambiarEstado(s.id, "aprobado")}>✓ Aprobar</button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}