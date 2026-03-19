import { useState, useEffect } from "react"
import {
  collection, getDocs, updateDoc, addDoc, doc, serverTimestamp
} from "firebase/firestore"
import { db } from "../../../firebase/config"

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');
  .av { padding:26px 30px 60px; }
  .av-ttl { font-family:'Syne',sans-serif; font-size:20px; font-weight:800; color:#fff; margin-bottom:3px; }
  .av-sub  { font-size:12px; color:rgba(255,255,255,.28); margin-bottom:22px; }
  .av-loading { text-align:center; padding:48px; color:rgba(255,255,255,.25); font-size:13px; }
  .av-tabs { display:flex; gap:8px; margin-bottom:18px; }
  .av-tab  { padding:7px 16px; border-radius:20px; font-size:12px; font-weight:600; cursor:pointer; border:1px solid rgba(255,255,255,.07); background:rgba(255,255,255,.03); color:rgba(255,255,255,.35); transition:all .16s; font-family:'Plus Jakarta Sans',sans-serif; }
  .av-tab.on { background:rgba(0,243,255,.08); border-color:rgba(0,243,255,.25); color:#00f3ff; }
  .av-card { background:#0c0f14; border:1px solid rgba(255,255,255,.06); border-radius:11px; padding:16px 18px; margin-bottom:10px; }
  .av-card-hdr { display:flex; align-items:flex-start; gap:14px; margin-bottom:14px; }
  .av-av { width:38px; height:38px; border-radius:9px; background:linear-gradient(135deg,rgba(0,243,255,.12),rgba(168,85,247,.12)); border:1px solid rgba(0,243,255,.15); display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-size:15px; font-weight:800; color:#00f3ff; flex-shrink:0; }
  .av-vend { font-size:13px; font-weight:700; color:#fff; margin-bottom:2px; }
  .av-meta { font-size:11px; color:rgba(255,255,255,.3); }
  .av-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin-bottom:14px; }
  .av-dato { background:rgba(255,255,255,.02); border:1px solid rgba(255,255,255,.05); border-radius:8px; padding:10px 12px; }
  .av-dato-l { font-size:8px; letter-spacing:1.2px; text-transform:uppercase; color:rgba(255,255,255,.22); margin-bottom:4px; }
  .av-dato-v { font-size:13px; font-weight:600; color:#fff; }
  .av-dato-v.green { font-family:'Syne',sans-serif; font-size:15px; font-weight:800; color:#10b981; }
  .av-dato-v.cyan  { font-family:'Syne',sans-serif; font-size:15px; font-weight:800; color:#00f3ff; }
  .av-comp { display:flex; align-items:center; gap:10px; background:rgba(255,255,255,.02); border:1px solid rgba(255,255,255,.05); border-radius:8px; padding:10px 14px; margin-bottom:14px; }
  .av-comp-ico { font-size:18px; }
  .av-comp-txt { font-size:12px; color:rgba(255,255,255,.45); }
  .av-comp-lnk { font-size:11px; color:rgba(0,243,255,.5); margin-top:1px; }
  .av-btns { display:flex; gap:8px; }
  .av-btn  { flex:1; padding:9px; border-radius:8px; font-size:12px; font-weight:700; cursor:pointer; border:none; font-family:'Plus Jakarta Sans',sans-serif; transition:all .16s; text-align:center; }
  .av-btn.red   { background:rgba(239,68,68,.1); border:1px solid rgba(239,68,68,.2); color:#ef4444; }
  .av-btn.red:hover { background:rgba(239,68,68,.18); }
  .av-btn.green { background:#10b981; color:#fff; }
  .av-btn.green:hover { background:#059669; }
  .av-chip { display:inline-flex; align-items:center; gap:4px; font-size:9px; font-weight:700; text-transform:uppercase; padding:3px 9px; border-radius:20px; }
  .av-chip.pen { background:rgba(245,158,11,.09); color:#f59e0b; border:1px solid rgba(245,158,11,.18); }
  .av-chip.ok  { background:rgba(16,185,129,.09); color:#10b981; border:1px solid rgba(16,185,129,.18); }
  .av-chip.rej { background:rgba(239,68,68,.09);  color:#ef4444; border:1px solid rgba(239,68,68,.18); }
`

const chipCfg = {
  pendiente: { cls:"pen", lbl:"Pendiente" },
  aprobado:  { cls:"ok",  lbl:"Aprobado"  },
  rechazado: { cls:"rej", lbl:"Rechazado" },
}

export default function AdminVentas() {
  const [ventas,  setVentas]  = useState([])
  const [loading, setLoading] = useState(true)
  const [filtro,  setFiltro]  = useState("pendiente")

  useEffect(() => {
    const cargar = async () => {
      try {
        const snap = await getDocs(collection(db, "ventas"))
        setVentas(snap.docs.map(d => ({ id: d.id, ...d.data() })))
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
      await updateDoc(doc(db, "ventas", id), { estado: nuevoEstado })
      setVentas(vs => vs.map(v => v.id === id ? { ...v, estado: nuevoEstado } : v))
    } catch (e) {
      alert("Error: " + e.message)
    }
  }

  const filtradas = ventas.filter(v => v.estado === filtro)

  return (
    <div className="av">
      <style>{CSS}</style>
      <div className="av-ttl">Ventas reportadas</div>
      <div className="av-sub">Revisa los comprobantes y aprueba o rechaza cada venta</div>

      <div className="av-tabs">
        {["pendiente","aprobado","rechazado"].map(f => (
          <button key={f} className={`av-tab ${filtro===f?"on":""}`} onClick={()=>setFiltro(f)}>
            {f==="pendiente"?"Pendientes":f==="aprobado"?"Aprobadas":"Rechazadas"} ({ventas.filter(v=>v.estado===f).length})
          </button>
        ))}
      </div>

      {loading && <div className="av-loading">Cargando ventas...</div>}

      {!loading && filtradas.length === 0 && (
        <div style={{ textAlign:"center", padding:"40px 20px", color:"rgba(255,255,255,.2)", fontSize:13 }}>
          No hay ventas en esta categoría
        </div>
      )}

      {!loading && filtradas.map(v => {
        const cfg = chipCfg[v.estado] || chipCfg.pendiente
        const fecha = v.fecha?.toDate ? v.fecha.toDate().toLocaleDateString("es-PE", { day:"numeric", month:"short", year:"numeric" }) : v.fecha
        return (
          <div key={v.id} className="av-card">
            <div className="av-card-hdr">
              <div className="av-av">{v.vendedor?.[0] || "?"}</div>
              <div style={{ flex:1 }}>
                <div className="av-vend">{v.vendedor}</div>
                <div className="av-meta">{fecha}</div>
              </div>
              <span className={`av-chip ${cfg.cls}`}>{cfg.lbl}</span>
            </div>

            <div className="av-grid">
              <div className="av-dato">
                <div className="av-dato-l">Proyecto</div>
                <div className="av-dato-v">{v.proyecto}</div>
              </div>
              <div className="av-dato">
                <div className="av-dato-l">Cliente</div>
                <div className="av-dato-v">{v.cliente}</div>
              </div>
              <div className="av-dato">
                <div className="av-dato-l">Monto venta</div>
                <div className="av-dato-v cyan">S/.{Number(v.monto||0).toLocaleString()}</div>
              </div>
              <div className="av-dato">
                <div className="av-dato-l">Comisión vendedor</div>
                <div className="av-dato-v green">S/.{Number(v.comision||0).toLocaleString()}</div>
              </div>
            </div>

            {v.comprobante && (
              <div className="av-comp">
                <div className="av-comp-ico">📎</div>
                <div>
                  <div className="av-comp-txt">{v.comprobante}</div>
                  <div className="av-comp-lnk">Ver comprobante adjunto</div>
                </div>
              </div>
            )}

            {v.estado === "pendiente" && (
              <div className="av-btns">
                <button className="av-btn red"   onClick={()=>cambiarEstado(v.id, "rechazado")}>✕ Rechazar</button>
                <button className="av-btn green" onClick={()=>cambiarEstado(v.id, "aprobado")}>✓ Aprobar venta</button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}