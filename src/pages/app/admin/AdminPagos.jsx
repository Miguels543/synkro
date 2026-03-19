import { useState, useEffect } from "react"
import { collection, getDocs, updateDoc, doc } from "firebase/firestore"
import { db } from "../../../firebase/config"

const CSS_PAG = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');
  .apg { padding:26px 30px 60px; }
  .apg-ttl { font-family:'Syne',sans-serif; font-size:20px; font-weight:800; color:#fff; margin-bottom:3px; }
  .apg-sub  { font-size:12px; color:rgba(255,255,255,.28); margin-bottom:22px; }
  .apg-loading { text-align:center; padding:48px; color:rgba(255,255,255,.25); font-size:13px; }
  .apg-resumen { display:grid; grid-template-columns:repeat(3,1fr); gap:11px; margin-bottom:18px; }
  .apg-res { background:#0c0f14; border:1px solid rgba(255,255,255,.06); border-radius:11px; padding:15px 16px; position:relative; overflow:hidden; }
  .apg-res::after { content:''; position:absolute; top:0; left:0; right:0; height:1.5px; }
  .apg-res.c1::after { background:linear-gradient(90deg,#f59e0b,transparent); }
  .apg-res.c2::after { background:linear-gradient(90deg,#10b981,transparent); }
  .apg-res.c3::after { background:linear-gradient(90deg,#00f3ff,transparent); }
  .apg-res-l { font-size:8.5px; letter-spacing:1.5px; text-transform:uppercase; color:rgba(255,255,255,.22); margin-bottom:7px; }
  .apg-res-v { font-family:'Syne',sans-serif; font-size:22px; font-weight:800; color:#fff; line-height:1; margin-bottom:3px; }
  .apg-res-s { font-size:10px; color:rgba(255,255,255,.22); }
  .apg-tabs { display:flex; gap:8px; margin-bottom:18px; }
  .apg-tab  { padding:7px 16px; border-radius:20px; font-size:12px; font-weight:600; cursor:pointer; border:1px solid rgba(255,255,255,.07); background:rgba(255,255,255,.03); color:rgba(255,255,255,.35); transition:all .16s; font-family:'Plus Jakarta Sans',sans-serif; }
  .apg-tab.on { background:rgba(0,243,255,.08); border-color:rgba(0,243,255,.25); color:#00f3ff; }
  .apg-tabla { background:#0c0f14; border:1px solid rgba(255,255,255,.06); border-radius:11px; overflow:hidden; }
  .apg-hdr { display:grid; grid-template-columns:1.5fr 2fr 1fr 1.5fr 1fr 120px; padding:10px 16px; border-bottom:1px solid rgba(255,255,255,.05); font-size:8.5px; letter-spacing:1.5px; text-transform:uppercase; color:rgba(255,255,255,.2); }
  .apg-row { display:grid; grid-template-columns:1.5fr 2fr 1fr 1.5fr 1fr 120px; padding:13px 16px; border-bottom:1px solid rgba(255,255,255,.03); align-items:center; transition:background .13s; }
  .apg-row:last-child { border-bottom:none; }
  .apg-row:hover { background:rgba(255,255,255,.02); }
  .apg-vend  { font-size:13px; font-weight:600; color:#fff; }
  .apg-conc  { font-size:12px; color:rgba(255,255,255,.5); }
  .apg-monto { font-family:'Syne',sans-serif; font-size:13px; font-weight:800; color:#10b981; }
  .apg-met   { font-size:11px; color:rgba(255,255,255,.4); }
  .apg-num   { font-size:10px; color:rgba(255,255,255,.25); margin-top:1px; }
  .apg-chip  { display:inline-flex; align-items:center; gap:4px; font-size:9px; font-weight:700; text-transform:uppercase; padding:3px 9px; border-radius:20px; }
  .apg-chip.ok  { background:rgba(16,185,129,.09); color:#10b981; border:1px solid rgba(16,185,129,.18); }
  .apg-chip.pen { background:rgba(245,158,11,.09); color:#f59e0b; border:1px solid rgba(245,158,11,.18); }
  .apg-btn-pay { padding:5px 11px; border-radius:6px; font-size:11px; font-weight:700; cursor:pointer; background:#10b981; color:#fff; border:none; font-family:'Plus Jakarta Sans',sans-serif; transition:background .15s; }
  .apg-btn-pay:hover { background:#059669; }
`

export default function AdminPagos() {
  const [pagos,   setPagos]   = useState([])
  const [loading, setLoading] = useState(true)
  const [filtro,  setFiltro]  = useState("pendiente")

  useEffect(() => {
    const cargar = async () => {
      try {
        const snap = await getDocs(collection(db, "pagos"))
        setPagos(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [])

  const marcarPagado = async (id) => {
    const fecha = new Date().toLocaleDateString("es-PE", { day:"numeric", month:"short", year:"numeric" })
    try {
      await updateDoc(doc(db, "pagos", id), { estado:"pagado", fecha })
      setPagos(ps => ps.map(p => p.id===id ? {...p, estado:"pagado", fecha} : p))
    } catch (e) {
      alert("Error: " + e.message)
    }
  }

  const filtrados      = pagos.filter(p => p.estado === filtro)
  const totalPendiente = pagos.filter(p=>p.estado==="pendiente").reduce((a,p)=>a+Number(p.monto||0),0)
  const totalPagado    = pagos.filter(p=>p.estado==="pagado").reduce((a,p)=>a+Number(p.monto||0),0)

  return (
    <div className="apg">
      <style>{CSS_PAG}</style>
      <div className="apg-ttl">Pagos a vendedores</div>
      <div className="apg-sub">Gestiona las comisiones y misiones por pagar</div>

      <div className="apg-resumen">
        <div className="apg-res c1">
          <div className="apg-res-l">Pendiente de pago</div>
          <div className="apg-res-v" style={{ color:"#f59e0b" }}>S/.{totalPendiente.toLocaleString()}</div>
          <div className="apg-res-s">{pagos.filter(p=>p.estado==="pendiente").length} pagos por realizar</div>
        </div>
        <div className="apg-res c2">
          <div className="apg-res-l">Total pagado</div>
          <div className="apg-res-v" style={{ color:"#10b981" }}>S/.{totalPagado.toLocaleString()}</div>
          <div className="apg-res-s">{pagos.filter(p=>p.estado==="pagado").length} pagos realizados</div>
        </div>
        <div className="apg-res c3">
          <div className="apg-res-l">Total en comisiones</div>
          <div className="apg-res-v" style={{ color:"#00f3ff" }}>S/.{(totalPendiente+totalPagado).toLocaleString()}</div>
          <div className="apg-res-s">Acumulado histórico</div>
        </div>
      </div>

      <div className="apg-tabs">
        {["pendiente","pagado"].map(f => (
          <button key={f} className={`apg-tab ${filtro===f?"on":""}`} onClick={()=>setFiltro(f)}>
            {f==="pendiente"?"Pendientes":"Pagados"} ({pagos.filter(p=>p.estado===f).length})
          </button>
        ))}
      </div>

      {loading && <div className="apg-loading">Cargando pagos...</div>}

      {!loading && (
        <div className="apg-tabla">
          <div className="apg-hdr">
            <span>Vendedor</span><span>Concepto</span><span>Monto</span>
            <span>Método</span><span>Estado</span><span>Acción</span>
          </div>
          {filtrados.length === 0 && (
            <div style={{ padding:"32px", textAlign:"center", color:"rgba(255,255,255,.2)", fontSize:"13px" }}>
              No hay pagos en esta categoría
            </div>
          )}
          {filtrados.map(p => (
            <div key={p.id} className="apg-row">
              <div className="apg-vend">{p.vendedor}</div>
              <div className="apg-conc">{p.concepto}</div>
              <div className="apg-monto">S/.{Number(p.monto||0).toLocaleString()}</div>
              <div>
                <div className="apg-met">{p.metodo}</div>
                <div className="apg-num">{p.numero}</div>
              </div>
              <div>
                <span className={`apg-chip ${p.estado==="pagado"?"ok":"pen"}`}>
                  {p.estado==="pagado"?"Pagado":"Pendiente"}
                </span>
              </div>
              <div>
                {p.estado === "pendiente" ? (
                  <button className="apg-btn-pay" onClick={()=>marcarPagado(p.id)}>
                    ✓ Marcar pagado
                  </button>
                ) : (
                  <span style={{ fontSize:11, color:"rgba(255,255,255,.2)" }}>{p.fecha}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}