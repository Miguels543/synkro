import { useState, useEffect } from "react"
import { collection, getDocs, updateDoc, doc, getDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../../../firebase/config"

const CSS = `
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

  .apg-tabs { display:flex; gap:8px; margin-bottom:18px; flex-wrap:wrap; }
  .apg-tab  { padding:7px 16px; border-radius:20px; font-size:12px; font-weight:600; cursor:pointer; border:1px solid rgba(255,255,255,.07); background:rgba(255,255,255,.03); color:rgba(255,255,255,.35); transition:all .16s; font-family:'Plus Jakarta Sans',sans-serif; }
  .apg-tab.on { background:rgba(0,243,255,.08); border-color:rgba(0,243,255,.25); color:#00f3ff; }

  .apg-card { background:#0c0f14; border:1px solid rgba(255,255,255,.06); border-radius:12px; padding:18px 20px; margin-bottom:12px; }
  .apg-card-hdr { display:flex; align-items:flex-start; gap:12px; margin-bottom:14px; }
  .apg-av { width:40px; height:40px; border-radius:10px; background:linear-gradient(135deg,rgba(0,243,255,.1),rgba(168,85,247,.1)); border:1px solid rgba(0,243,255,.12); display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-size:15px; font-weight:800; color:#00f3ff; flex-shrink:0; }
  .apg-nom  { font-size:13px; font-weight:700; color:#fff; margin-bottom:2px; }
  .apg-conc { font-size:11px; color:rgba(255,255,255,.35); }

  .apg-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-bottom:16px; }
  .apg-dato { background:rgba(255,255,255,.02); border:1px solid rgba(255,255,255,.04); border-radius:8px; padding:10px 12px; }
  .apg-dato-l { font-size:8px; letter-spacing:1.2px; text-transform:uppercase; color:rgba(255,255,255,.2); margin-bottom:4px; }
  .apg-dato-v { font-size:13px; font-weight:600; color:#fff; }

  .apg-metodo-wrap { margin-bottom:14px; }
  .apg-metodo-lbl  { font-size:8px; letter-spacing:1.5px; text-transform:uppercase; color:rgba(255,255,255,.25); margin-bottom:10px; }
  .apg-metodo-list { display:flex; flex-direction:column; gap:8px; margin-bottom:10px; }
  .apg-metodo-item { display:flex; align-items:center; gap:12px; padding:10px 14px; background:rgba(255,255,255,.02); border:1px solid rgba(255,255,255,.06); border-radius:9px; cursor:pointer; transition:all .16s; }
  .apg-metodo-item.selected { background:rgba(16,185,129,.06); border-color:rgba(16,185,129,.25); }
  .apg-metodo-item:hover { border-color:rgba(255,255,255,.12); }
  .apg-metodo-ico  { width:34px; height:34px; border-radius:8px; background:rgba(16,185,129,.08); border:1px solid rgba(16,185,129,.12); display:flex; align-items:center; justify-content:center; font-size:16px; flex-shrink:0; }
  .apg-metodo-tipo { font-size:13px; font-weight:700; color:#fff; margin-bottom:2px; }
  .apg-metodo-num  { font-size:11px; color:rgba(255,255,255,.4); }
  .apg-metodo-radio { width:16px; height:16px; border-radius:50%; border:2px solid rgba(255,255,255,.2); margin-left:auto; flex-shrink:0; transition:all .16s; }
  .apg-metodo-radio.on { border-color:#10b981; background:#10b981; box-shadow:0 0 0 3px rgba(16,185,129,.15); }
  .apg-metodo-nodata { font-size:12px; color:rgba(255,255,255,.2); padding:10px 0; font-style:italic; }

  .apg-ref-wrap { margin-bottom:14px; }
  .apg-ref-inp { width:100%; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); border-radius:8px; padding:9px 12px; color:#fff; font-size:13px; font-family:'Plus Jakarta Sans',sans-serif; outline:none; box-sizing:border-box; }
  .apg-ref-inp:focus { border-color:rgba(0,243,255,.3); }
  .apg-ref-inp::placeholder { color:rgba(255,255,255,.2); }

  .apg-pagado-info { background:rgba(16,185,129,.04); border:1px solid rgba(16,185,129,.1); border-radius:9px; padding:12px 14px; margin-bottom:12px; }
  .apg-pagado-lbl  { font-size:8px; letter-spacing:1.5px; text-transform:uppercase; color:rgba(16,185,129,.5); margin-bottom:6px; }
  .apg-pagado-row  { display:flex; justify-content:space-between; font-size:12px; margin-bottom:3px; }
  .apg-pagado-k    { color:rgba(255,255,255,.35); }
  .apg-pagado-v    { color:rgba(255,255,255,.75); font-weight:600; }

  .apg-btns { display:flex; gap:8px; }
  .apg-btn  { flex:1; padding:10px; border-radius:8px; font-size:12px; font-weight:700; cursor:pointer; border:none; font-family:'Plus Jakarta Sans',sans-serif; transition:all .16s; text-align:center; }
  .apg-btn:disabled { opacity:.5; cursor:not-allowed; }
  .apg-btn.green { background:#10b981; color:#fff; }
  .apg-btn.green:hover:not(:disabled) { background:#059669; }
  .apg-btn.ghost { background:transparent; border:1px solid rgba(255,255,255,.1); color:rgba(255,255,255,.4); cursor:default; }

  .apg-chip { display:inline-flex; align-items:center; gap:4px; font-size:9px; font-weight:700; text-transform:uppercase; padding:3px 9px; border-radius:20px; }
  .apg-chip.ok  { background:rgba(16,185,129,.09); color:#10b981; border:1px solid rgba(16,185,129,.18); }
  .apg-chip.pen { background:rgba(245,158,11,.09); color:#f59e0b; border:1px solid rgba(245,158,11,.18); }

  .apg-toast { position:fixed; bottom:28px; left:50%; transform:translateX(-50%); background:#0c0f14; border-radius:10px; padding:12px 22px; font-size:13px; font-weight:600; box-shadow:0 8px 32px rgba(0,0,0,.4); z-index:9999; animation:toastIn .25s ease; white-space:nowrap; border:1px solid rgba(16,185,129,.3); color:#10b981; }
  @keyframes toastIn { from{opacity:0;transform:translateX(-50%) translateY(8px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }

  @media (max-width:768px) {
    .apg { padding:18px 16px 50px; }
    .apg-resumen { grid-template-columns:1fr 1fr; }
    .apg-grid { grid-template-columns:1fr 1fr; }
    .apg-ttl { font-size:17px; }
  }
  @media (max-width:480px) {
    .apg { padding:14px 12px 40px; }
    .apg-resumen { grid-template-columns:1fr; }
    .apg-card { padding:14px; }
    .apg-grid { grid-template-columns:1fr 1fr; gap:8px; }
    .apg-btn  { font-size:11px; padding:8px; }
  }
`

const METODO_ICO = { Yape:"💜", Plin:"💙", "Transferencia bancaria":"🏦" }

function formatFecha(f) {
  if (!f) return "—"
  const d = f?.toDate ? f.toDate() : new Date(f)
  return d.toLocaleDateString("es-PE", { day:"numeric", month:"short", year:"numeric" })
}

export default function AdminPagos() {
  const [pagos,      setPagos]      = useState([])
  const [vendedores, setVendedores] = useState({})
  const [loading,    setLoading]    = useState(true)
  const [filtro,     setFiltro]     = useState("pendiente")
  const [procesando, setProcesando] = useState(null)
  const [toast,      setToast]      = useState(false)
  const [selMetodo,  setSelMetodo]  = useState({})
  const [refs,       setRefs]       = useState({})

  useEffect(() => {
    const cargar = async () => {
      try {
        const snap = await getDocs(collection(db, "pagos"))
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        setPagos(data)

        const uids = [...new Set(data.map(p => p.vendedorUid).filter(Boolean))]
        const vMap = {}
        await Promise.all(uids.map(async uid => {
          const uSnap = await getDoc(doc(db, "users", uid))
          if (uSnap.exists()) {
            const uData = uSnap.data()
            vMap[uid] = {
              metodosCobro: uData.metodosCobro || [],
              whatsapp:     uData.whatsapp     || "",
              nombre:       uData.nombre       || "",
            }
          }
        }))
        setVendedores(vMap)

        const selInit = {}
        data.filter(p => p.estado === "pendiente").forEach(p => {
          const metodos   = vMap[p.vendedorUid]?.metodosCobro || []
          const principal = metodos.find(m => m.principal) || metodos[0]
          if (principal) selInit[p.id] = principal
        })
        setSelMetodo(selInit)

      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [])

  // ── vData se pasa como parámetro para evitar el error de closure ──
  const marcarPagado = async (p, vData) => {
    const metodo = selMetodo[p.id]
    const ref    = refs[p.id] || ""
    setProcesando(p.id)
    try {
      const metodoStr = metodo
        ? metodo.tipo === "Transferencia bancaria"
          ? `${metodo.banco} · ${metodo.numero}`
          : `${metodo.tipo} · ${metodo.numero}`
        : "Sin método"

      await updateDoc(doc(db, "pagos", p.id), {
        estado:    "pagado",
        metodo:    metodoStr,
        numero:    ref,
        fechaPago: serverTimestamp(),
      })

      // Marcar venta como completada
      if (p.ventaId) {
        await updateDoc(doc(db, "ventas", p.ventaId), { estado: "completado" })
      }

      setPagos(ps => ps.map(x => x.id === p.id ? {
        ...x,
        estado:    "pagado",
        metodo:    metodoStr,
        numero:    ref,
        fechaPago: { toDate: () => new Date() },
      } : x))

      setToast(true)
      setTimeout(() => setToast(false), 3000)

      // Abrir WhatsApp con comprobante — vData viene como parámetro
      if (vData?.whatsapp) {
        const num   = vData.whatsapp.replace(/[^0-9]/g, "")
        const fecha = new Date().toLocaleDateString("es-PE", { day:"numeric", month:"long", year:"numeric" })
        const ref2  = ref ? `\nN° operación: ${ref}` : ""

        const desgloseMisiones = Number(p.comisionMisiones||0) > 0
          ? `\nMisiones aprobadas: S/.${Number(p.comisionMisiones).toLocaleString()}` +
            (p.misionesDetalle||[]).map(m => `\n  - ${m.titulo}: S/.${m.pago}`).join("")
          : ""

        const msg = encodeURIComponent(
          `Hola ${p.vendedor}!\n\n` +
          `Synkro - Comprobante de pago\n` +
          `-------------------------------\n` +
          `Proyecto: ${p.proyectoNombre}\n` +
          `Comision por venta: S/.${Number(p.comisionVenta || p.monto || 0).toLocaleString()}` +
          desgloseMisiones +
          `\n-------------------------------\n` +
          `*TOTAL: S/.${Number(p.monto||0).toLocaleString()}*\n` +
          `Via: ${metodoStr}${ref2}\n` +
          `Fecha: ${fecha}\n\n` +
          `Gracias por tu trabajo en Synkro!`
        )
        window.open(`https://wa.me/${num}?text=${msg}`, "_blank")
      }
    } catch (e) {
      alert("Error: " + e.message)
    } finally {
      setProcesando(null)
    }
  }

  const filtrados      = pagos.filter(p => p.estado === filtro)
  const totalPendiente = pagos.filter(p => p.estado === "pendiente").reduce((s,p) => s + Number(p.monto||0), 0)
  const totalPagado    = pagos.filter(p => p.estado === "pagado").reduce((s,p) => s + Number(p.monto||0), 0)

  return (
    <div className="apg">
      <style>{CSS}</style>
      <div className="apg-ttl">Pagos a vendedores</div>
      <div className="apg-sub">Comisiones generadas al confirmar pagos de clientes</div>

      <div className="apg-resumen">
        <div className="apg-res c1">
          <div className="apg-res-l">Pendiente de pago</div>
          <div className="apg-res-v" style={{ color:"#f59e0b" }}>S/.{totalPendiente.toLocaleString()}</div>
          <div className="apg-res-s">{pagos.filter(p=>p.estado==="pendiente").length} comisiones por pagar</div>
        </div>
        <div className="apg-res c2">
          <div className="apg-res-l">Total pagado</div>
          <div className="apg-res-v" style={{ color:"#10b981" }}>S/.{totalPagado.toLocaleString()}</div>
          <div className="apg-res-s">{pagos.filter(p=>p.estado==="pagado").length} pagos realizados</div>
        </div>
        <div className="apg-res c3">
          <div className="apg-res-l">Total histórico</div>
          <div className="apg-res-v" style={{ color:"#00f3ff" }}>S/.{(totalPendiente+totalPagado).toLocaleString()}</div>
          <div className="apg-res-s">Acumulado en comisiones</div>
        </div>
      </div>

      <div className="apg-tabs">
        {["pendiente","pagado"].map(f => (
          <button key={f} className={`apg-tab ${filtro===f?"on":""}`} onClick={() => setFiltro(f)}>
            {f==="pendiente"?"Pendientes":"Pagados"} ({pagos.filter(p=>p.estado===f).length})
          </button>
        ))}
      </div>

      {loading && <div className="apg-loading">Cargando pagos…</div>}

      {!loading && filtrados.length === 0 && (
        <div style={{ textAlign:"center", padding:"40px 20px", color:"rgba(255,255,255,.2)", fontSize:13 }}>
          {filtro === "pendiente"
            ? "No hay comisiones pendientes — confirma misiones en Ventas para generarlas"
            : "No hay pagos realizados aún"}
        </div>
      )}

      {!loading && filtrados.map(p => {
        const enProceso = procesando === p.id
        const vData     = vendedores[p.vendedorUid] || {}
        const metodos   = vData.metodosCobro || []
        const selM      = selMetodo[p.id]
        const ref       = refs[p.id] || ""

        return (
          <div key={p.id} className="apg-card">
            <div className="apg-card-hdr">
              <div className="apg-av">{p.vendedor?.[0] || "?"}</div>
              <div style={{ flex:1 }}>
                <div className="apg-nom">{p.vendedor}</div>
                <div className="apg-conc">{p.concepto}</div>
                {vData.whatsapp && (
                  <div style={{ fontSize:10, color:"rgba(255,255,255,.25)", marginTop:2 }}>
                    📱 {vData.whatsapp}
                  </div>
                )}
              </div>
              <span className={`apg-chip ${p.estado==="pagado"?"ok":"pen"}`}>
                {p.estado==="pagado" ? "Pagado" : "Pendiente"}
              </span>
            </div>

            {/* Datos */}
            <div className="apg-grid">
              <div className="apg-dato">
                <div className="apg-dato-l">Total a pagar</div>
                <div className="apg-dato-v" style={{ fontFamily:"'Syne',sans-serif", fontSize:17, fontWeight:800, color:"#10b981" }}>
                  S/.{Number(p.monto||0).toLocaleString()}
                </div>
              </div>
              <div className="apg-dato">
                <div className="apg-dato-l">Proyecto</div>
                <div className="apg-dato-v">{p.proyectoNombre || "—"}</div>
              </div>
              <div className="apg-dato">
                <div className="apg-dato-l">Cliente</div>
                <div className="apg-dato-v">{p.nombreCliente || "—"}</div>
              </div>
            </div>

            {/* Desglose */}
            <div style={{ background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.05)", borderRadius:9, padding:"12px 14px", marginBottom:14 }}>
              <div style={{ fontSize:8, letterSpacing:"1.5px", textTransform:"uppercase", color:"rgba(255,255,255,.2)", marginBottom:10 }}>Desglose del pago</div>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:6 }}>
                <span style={{ color:"rgba(255,255,255,.4)" }}>Comisión por venta</span>
                <span style={{ color:"#fff", fontWeight:600 }}>S/.{Number(p.comisionVenta || p.monto || 0).toLocaleString()}</span>
              </div>
              {Number(p.comisionMisiones||0) > 0 && (
                <>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:4 }}>
                    <span style={{ color:"rgba(255,255,255,.4)" }}>Misiones aprobadas</span>
                    <span style={{ color:"#10b981", fontWeight:600 }}>+S/.{Number(p.comisionMisiones).toLocaleString()}</span>
                  </div>
                  {(p.misionesDetalle||[]).map((m,i) => (
                    <div key={i} style={{ display:"flex", justifyContent:"space-between", fontSize:11, paddingLeft:12, marginBottom:2 }}>
                      <span style={{ color:"rgba(255,255,255,.25)" }}>· {m.titulo}</span>
                      <span style={{ color:"rgba(16,185,129,.6)" }}>S/.{m.pago}</span>
                    </div>
                  ))}
                </>
              )}
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, fontWeight:800, marginTop:8, paddingTop:8, borderTop:"1px solid rgba(255,255,255,.06)" }}>
                <span style={{ color:"rgba(255,255,255,.6)" }}>Total</span>
                <span style={{ color:"#10b981", fontFamily:"'Syne',sans-serif" }}>S/.{Number(p.monto||0).toLocaleString()}</span>
              </div>
            </div>

            {/* Pendiente: métodos del vendedor */}
            {p.estado === "pendiente" && (
              <>
                <div className="apg-metodo-wrap">
                  <div className="apg-metodo-lbl">Método de cobro del vendedor</div>
                  {metodos.length === 0 ? (
                    <div className="apg-metodo-nodata">
                      ⚠️ El vendedor no ha registrado métodos de cobro en su perfil
                    </div>
                  ) : (
                    <div className="apg-metodo-list">
                      {metodos.map(m => (
                        <div
                          key={m.id}
                          className={`apg-metodo-item ${selM?.id === m.id ? "selected" : ""}`}
                          onClick={() => setSelMetodo(s => ({ ...s, [p.id]: m }))}
                        >
                          <div className="apg-metodo-ico">{METODO_ICO[m.tipo] || "💳"}</div>
                          <div style={{ flex:1 }}>
                            <div className="apg-metodo-tipo">
                              {m.tipo}
                              {m.tipo === "Transferencia bancaria" && m.banco ? ` · ${m.banco}` : ""}
                              {m.principal && (
                                <span style={{ marginLeft:8, fontSize:9, fontWeight:800, letterSpacing:1, textTransform:"uppercase", color:"rgba(0,243,255,.6)", background:"rgba(0,243,255,.07)", border:"1px solid rgba(0,243,255,.12)", borderRadius:10, padding:"1px 7px" }}>
                                  Principal
                                </span>
                              )}
                            </div>
                            <div className="apg-metodo-num">{m.numero}</div>
                          </div>
                          <div className={`apg-metodo-radio ${selM?.id === m.id ? "on" : ""}`} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="apg-ref-wrap">
                  <div className="apg-metodo-lbl">N° de operación / referencia (opcional)</div>
                  <input
                    className="apg-ref-inp"
                    placeholder="Ej: 123456789"
                    value={ref}
                    onChange={e => setRefs(r => ({ ...r, [p.id]: e.target.value }))}
                  />
                </div>
              </>
            )}

            {/* Pagado: info del pago */}
            {p.estado === "pagado" && (
              <div className="apg-pagado-info">
                <div className="apg-pagado-lbl">Datos del pago realizado</div>
                <div className="apg-pagado-row">
                  <span className="apg-pagado-k">Método</span>
                  <span className="apg-pagado-v">{p.metodo || "—"}</span>
                </div>
                {p.numero && (
                  <div className="apg-pagado-row">
                    <span className="apg-pagado-k">N° operación</span>
                    <span className="apg-pagado-v">{p.numero}</span>
                  </div>
                )}
                <div className="apg-pagado-row">
                  <span className="apg-pagado-k">Fecha</span>
                  <span className="apg-pagado-v">{formatFecha(p.fechaPago)}</span>
                </div>
              </div>
            )}

            <div className="apg-btns">
              {p.estado === "pendiente" && (
                // ── vData se pasa aquí como argumento ──
                <button
                  className="apg-btn green"
                  disabled={enProceso || metodos.length === 0}
                  onClick={() => marcarPagado(p, vData)}
                >
                  {enProceso ? "Procesando…" : `✓ Marcar pagado${selM ? ` vía ${selM.tipo}` : ""}`}
                </button>
              )}
              {p.estado === "pagado" && (
                <div className="apg-btn ghost">
                  ✓ Pagado el {formatFecha(p.fechaPago)}
                </div>
              )}
            </div>
          </div>
        )
      })}

      {toast && <div className="apg-toast">✓ Comisión marcada como pagada — WhatsApp abierto</div>}
    </div>
  )
}