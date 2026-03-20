import { useState, useEffect } from "react"
import { collection, getDocs, updateDoc, addDoc, doc, serverTimestamp } from "firebase/firestore"
import { db } from "../../../firebase/config"

/* ─────────────────────────────────────────
   CSS
───────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');
  .av { padding:26px 30px 60px; }
  .av-ttl { font-family:'Syne',sans-serif; font-size:20px; font-weight:800; color:#fff; margin-bottom:3px; }
  .av-sub  { font-size:12px; color:rgba(255,255,255,.28); margin-bottom:22px; }
  .av-loading { text-align:center; padding:48px; color:rgba(255,255,255,.25); font-size:13px; }

  /* Stats */
  .av-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin-bottom:18px; }
  .av-stat  { background:#0c0f14; border:1px solid rgba(255,255,255,.05); border-radius:10px; padding:13px 14px; position:relative; overflow:hidden; }
  .av-stat::after { content:''; position:absolute; top:0; left:0; right:0; height:1.5px; }
  .av-stat.c1::after { background:linear-gradient(90deg,#f59e0b,transparent); }
  .av-stat.c2::after { background:linear-gradient(90deg,#00f3ff,transparent); }
  .av-stat.c3::after { background:linear-gradient(90deg,#10b981,transparent); }
  .av-stat.c4::after { background:linear-gradient(90deg,#a855f7,transparent); }
  .av-stat-l { font-size:8px; letter-spacing:1.5px; text-transform:uppercase; color:rgba(255,255,255,.22); margin-bottom:6px; }
  .av-stat-v { font-family:'Syne',sans-serif; font-size:20px; font-weight:800; color:#fff; line-height:1; }

  /* Tabs */
  .av-tabs { display:flex; gap:8px; margin-bottom:18px; flex-wrap:wrap; }
  .av-tab  { padding:7px 16px; border-radius:20px; font-size:12px; font-weight:600; cursor:pointer; border:1px solid rgba(255,255,255,.07); background:rgba(255,255,255,.03); color:rgba(255,255,255,.35); transition:all .16s; font-family:'Plus Jakarta Sans',sans-serif; }
  .av-tab.on { background:rgba(0,243,255,.08); border-color:rgba(0,243,255,.25); color:#00f3ff; }

  /* Card */
  .av-card { background:#0c0f14; border:1px solid rgba(255,255,255,.06); border-radius:12px; padding:18px 20px; margin-bottom:12px; }
  .av-card-hdr { display:flex; align-items:flex-start; gap:12px; margin-bottom:16px; }
  .av-av  { width:40px; height:40px; border-radius:10px; background:linear-gradient(135deg,rgba(0,243,255,.12),rgba(168,85,247,.12)); border:1px solid rgba(0,243,255,.15); display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-size:16px; font-weight:800; color:#00f3ff; flex-shrink:0; }
  .av-vend { font-size:13px; font-weight:700; color:#fff; margin-bottom:2px; }
  .av-meta { font-size:11px; color:rgba(255,255,255,.3); }

  /* Timeline */
  .av-tl { display:flex; align-items:center; margin-bottom:16px; }
  .av-tl-step { display:flex; flex-direction:column; align-items:center; gap:4px; flex:1; }
  .av-tl-dot  { width:26px; height:26px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:11px; border:2px solid rgba(255,255,255,.1); background:#0c0f14; transition:all .3s; }
  .av-tl-dot.done   { background:rgba(16,185,129,.15); border-color:#10b981; color:#10b981; }
  .av-tl-dot.active { background:rgba(245,158,11,.15); border-color:#f59e0b; animation:tlpulse 2s infinite; }
  @keyframes tlpulse { 0%,100%{opacity:1} 50%{opacity:.5} }
  .av-tl-lbl  { font-size:8px; color:rgba(255,255,255,.25); text-align:center; max-width:60px; line-height:1.3; }
  .av-tl-lbl.done   { color:#10b981; }
  .av-tl-lbl.active { color:#f59e0b; }
  .av-tl-line { flex:1; height:1px; background:rgba(255,255,255,.07); margin-bottom:18px; }
  .av-tl-line.done  { background:#10b981; }

  /* Datos grid */
  .av-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin-bottom:14px; }
  .av-dato { background:rgba(255,255,255,.02); border:1px solid rgba(255,255,255,.05); border-radius:8px; padding:10px 12px; }
  .av-dato-l { font-size:8px; letter-spacing:1.2px; text-transform:uppercase; color:rgba(255,255,255,.22); margin-bottom:4px; }
  .av-dato-v { font-size:13px; font-weight:600; color:#fff; }

  /* Cliente box */
  .av-cli { background:rgba(0,243,255,.02); border:1px solid rgba(0,243,255,.08); border-radius:9px; padding:12px 14px; margin-bottom:12px; }
  .av-cli-lbl { font-size:8px; letter-spacing:1.5px; text-transform:uppercase; color:rgba(0,243,255,.4); margin-bottom:8px; }
  .av-cli-row { display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px; }
  .av-cli-k   { color:rgba(255,255,255,.35); }
  .av-cli-v   { color:rgba(255,255,255,.75); font-weight:600; }

  /* Comprobante */
  .av-comp { display:flex; align-items:center; gap:10px; background:rgba(0,243,255,.03); border:1px solid rgba(0,243,255,.1); border-radius:8px; padding:10px 14px; margin-bottom:12px; text-decoration:none; transition:all .16s; }
  .av-comp:hover { background:rgba(0,243,255,.07); }
  .av-comp-txt { font-size:12px; font-weight:600; color:rgba(0,243,255,.8); }
  .av-comp-sub { font-size:10px; color:rgba(255,255,255,.3); margin-top:1px; }
  .av-no-comp  { font-size:11px; color:rgba(255,255,255,.2); margin-bottom:12px; font-style:italic; }

  /* Misiones */
  .av-mis-sec  { font-size:8px; letter-spacing:1.5px; text-transform:uppercase; color:rgba(255,255,255,.2); margin-bottom:10px; }
  .av-mis-item { display:flex; align-items:center; gap:10px; padding:10px 13px; border-radius:9px; margin-bottom:7px; border:1px solid; transition:all .15s; }
  .av-mis-ico  { width:28px; height:28px; border-radius:7px; display:flex; align-items:center; justify-content:center; font-size:13px; flex-shrink:0; }
  .av-mis-nom  { flex:1; font-size:12.5px; font-weight:600; }
  .av-mis-pago { font-family:'Syne',sans-serif; font-size:13px; font-weight:800; white-space:nowrap; }
  .av-mis-ev   { font-size:10px; color:rgba(0,243,255,.6); text-decoration:none; white-space:nowrap; }
  .av-mis-ev:hover { color:#00f3ff; }
  .av-mis-btns { display:flex; gap:5px; flex-shrink:0; }
  .av-mis-btn  { padding:4px 10px; border-radius:6px; font-size:10px; font-weight:700; cursor:pointer; border:none; font-family:'Plus Jakarta Sans',sans-serif; transition:all .13s; }
  .av-mis-btn.ap  { background:#10b981; color:#fff; }
  .av-mis-btn.ap:hover { background:#059669; }
  .av-mis-btn.rej { background:rgba(239,68,68,.1); border:1px solid rgba(239,68,68,.2); color:#ef4444; }
  .av-mis-btn.rej:hover { background:rgba(239,68,68,.18); }

  /* Total misiones */
  .av-mis-total { display:flex; justify-content:space-between; padding:8px 13px; background:rgba(255,255,255,.02); border-radius:8px; font-size:12px; margin-bottom:12px; }
  .av-mis-total-l { color:rgba(255,255,255,.4); }
  .av-mis-total-v { font-family:'Syne',sans-serif; font-weight:800; color:#10b981; }

  /* Botones */
  .av-btns { display:flex; gap:8px; flex-wrap:wrap; }
  .av-btn  { flex:1; min-width:100px; padding:10px; border-radius:8px; font-size:12px; font-weight:700; cursor:pointer; border:none; font-family:'Plus Jakarta Sans',sans-serif; transition:all .16s; text-align:center; }
  .av-btn:disabled { opacity:.5; cursor:not-allowed; }
  .av-btn.red   { background:rgba(239,68,68,.1); border:1px solid rgba(239,68,68,.2); color:#ef4444; }
  .av-btn.red:hover:not(:disabled)   { background:rgba(239,68,68,.18); }
  .av-btn.green { background:#10b981; color:#fff; }
  .av-btn.green:hover:not(:disabled) { background:#059669; }
  .av-btn.cyan  { background:rgba(0,243,255,.08); border:1px solid rgba(0,243,255,.2); color:#00f3ff; }
  .av-btn.cyan:hover:not(:disabled)  { background:rgba(0,243,255,.14); }
  .av-btn.amber { background:rgba(245,158,11,.1); border:1px solid rgba(245,158,11,.2); color:#f59e0b; }
  .av-btn.amber:hover:not(:disabled) { background:rgba(245,158,11,.18); }

  /* Chips */
  .av-chip { display:inline-flex; align-items:center; gap:4px; font-size:9px; font-weight:700; text-transform:uppercase; padding:3px 9px; border-radius:20px; }
  .av-chip.pen   { background:rgba(245,158,11,.09); color:#f59e0b; border:1px solid rgba(245,158,11,.18); }
  .av-chip.ok    { background:rgba(16,185,129,.09);  color:#10b981; border:1px solid rgba(16,185,129,.18); }
  .av-chip.rej   { background:rgba(239,68,68,.09);   color:#ef4444; border:1px solid rgba(239,68,68,.18); }
  .av-chip.blue  { background:rgba(0,243,255,.09);   color:#00f3ff; border:1px solid rgba(0,243,255,.18); }
  .av-chip.amber { background:rgba(245,158,11,.09);  color:#f59e0b; border:1px solid rgba(245,158,11,.18); }

  /* Toast */
  .av-toast { position:fixed; bottom:28px; left:50%; transform:translateX(-50%); background:#0c0f14; border-radius:10px; padding:12px 22px; font-size:13px; font-weight:600; box-shadow:0 8px 32px rgba(0,0,0,.4); z-index:9999; animation:toastIn .25s ease; white-space:nowrap; }
  .av-toast.green { border:1px solid rgba(16,185,129,.3); color:#10b981; }
  .av-toast.red   { border:1px solid rgba(239,68,68,.3);  color:#ef4444; }
  .av-toast.cyan  { border:1px solid rgba(0,243,255,.3);  color:#00f3ff; }
  @keyframes toastIn { from{opacity:0;transform:translateX(-50%) translateY(8px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }

  /* Modal boleta */
  .av-ovl { position:fixed; inset:0; z-index:9000; background:rgba(0,0,0,.85); display:flex; align-items:center; justify-content:center; backdrop-filter:blur(6px); padding:20px; overflow-y:auto; }
  .av-boleta { background:#0e1319; border:1px solid rgba(0,243,255,.15); border-radius:16px; width:100%; max-width:480px; overflow:hidden; }
  .av-boleta-hdr { background:linear-gradient(135deg,rgba(0,243,255,.08),rgba(0,102,255,.08)); padding:24px; border-bottom:1px solid rgba(255,255,255,.06); text-align:center; }
  .av-boleta-logo { font-family:'Syne',sans-serif; font-size:22px; font-weight:800; color:#00f3ff; letter-spacing:3px; margin-bottom:4px; }
  .av-boleta-num  { font-size:11px; color:rgba(255,255,255,.3); }
  .av-boleta-body { padding:20px 24px; }
  .av-boleta-sec  { font-size:8px; letter-spacing:2px; text-transform:uppercase; color:rgba(0,243,255,.4); margin:14px 0 8px; }
  .av-boleta-row  { display:flex; justify-content:space-between; padding:7px 0; border-bottom:1px solid rgba(255,255,255,.04); font-size:12.5px; }
  .av-boleta-row:last-child { border-bottom:none; }
  .av-boleta-lbl  { color:rgba(255,255,255,.35); }
  .av-boleta-val  { color:#fff; font-weight:600; text-align:right; }
  .av-boleta-total { background:rgba(0,243,255,.05); border:1px solid rgba(0,243,255,.12); border-radius:10px; padding:14px 16px; margin:14px 0; display:flex; justify-content:space-between; align-items:center; }
  .av-boleta-total-l { font-size:11px; color:rgba(255,255,255,.4); text-transform:uppercase; }
  .av-boleta-total-v { font-family:'Syne',sans-serif; font-size:22px; font-weight:800; color:#00f3ff; }
  .av-boleta-ftr { padding:16px 24px; border-top:1px solid rgba(255,255,255,.05); display:flex; gap:8px; }

  @media (max-width:1024px) { .av-stats { grid-template-columns:repeat(2,1fr); } }
  @media (max-width:768px) {
    .av { padding:18px 16px 50px; }
    .av-grid { grid-template-columns:1fr 1fr; }
    .av-stats { grid-template-columns:1fr 1fr; gap:8px; }
    .av-tl { display:none; }
    .av-ttl { font-size:17px; }
  }
  @media (max-width:480px) {
    .av { padding:14px 12px 40px; }
    .av-card { padding:14px; }
    .av-grid { grid-template-columns:1fr 1fr; gap:8px; }
    .av-btn  { font-size:11px; padding:8px; min-width:80px; }
    .av-mis-btns { flex-direction:column; }
  }
`

/* ─────────────────────────────────────────
   ESTADOS Y TIMELINE
───────────────────────────────────────── */
const ESTADOS = {
  pendiente_revision: { cls:"pen",   lbl:"En revisión",  step:0 },
  aprobado:           { cls:"blue",  lbl:"Aprobada",     step:1 },
  cliente_pago:       { cls:"amber", lbl:"Cliente pagó", step:2 },
  completado:         { cls:"ok",    lbl:"Completada",   step:3 },
  rechazado:          { cls:"rej",   lbl:"Rechazada",    step:-1 },
}

const TIMELINE = [
  { lbl:"Reportada\npor vendedor", ico:"📋" },
  { lbl:"Aprobada\npor admin",     ico:"✓"  },
  { lbl:"Cliente\npagó",           ico:"💰" },
]

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
function formatFecha(f) {
  if (!f) return "—"
  const d = f?.toDate ? f.toDate() : new Date(f)
  return d.toLocaleDateString("es-PE", { day:"numeric", month:"short", year:"numeric" })
}

/* ─────────────────────────────────────────
   MODAL BOLETA
───────────────────────────────────────── */
function ModalBoleta({ venta, misionesAprobadas, onClose }) {
  const num = `SYN-${venta.id?.slice(-6)?.toUpperCase() || "000000"}`
  const totalMis = misionesAprobadas.reduce((s,m) => s + Number(m.pago||0), 0)
  return (
    <div className="av-ovl" onClick={onClose}>
      <div className="av-boleta" onClick={e => e.stopPropagation()}>
        <div className="av-boleta-hdr">
          <div className="av-boleta-logo">SYNKRO</div>
          <div className="av-boleta-num">Boleta · {num} · {formatFecha(venta.fecha)}</div>
        </div>
        <div className="av-boleta-body">
          <div className="av-boleta-sec">Vendedor</div>
          <div className="av-boleta-row"><span className="av-boleta-lbl">Nombre</span><span className="av-boleta-val">{venta.vendedorNombre}</span></div>

          <div className="av-boleta-sec">Cliente</div>
          <div className="av-boleta-row"><span className="av-boleta-lbl">Nombre</span><span className="av-boleta-val">{venta.nombreCliente}</span></div>
          <div className="av-boleta-row"><span className="av-boleta-lbl">Contacto</span><span className="av-boleta-val">{venta.contactoCliente}</span></div>

          <div className="av-boleta-sec">Proyecto</div>
          <div className="av-boleta-row"><span className="av-boleta-lbl">Nombre</span><span className="av-boleta-val">{venta.proyectoNombre}</span></div>
          <div className="av-boleta-row"><span className="av-boleta-lbl">Precio cobrado</span><span className="av-boleta-val">S/.{Number(venta.monto||0).toLocaleString()}</span></div>
          <div className="av-boleta-row"><span className="av-boleta-lbl">Comisión vendedor</span><span className="av-boleta-val" style={{color:"#10b981"}}>S/.{Number(venta.comisionGanada||0).toLocaleString()}</span></div>

          {misionesAprobadas.length > 0 && (
            <>
              <div className="av-boleta-sec">Misiones aprobadas</div>
              {misionesAprobadas.map((m,i) => (
                <div key={i} className="av-boleta-row">
                  <span className="av-boleta-lbl">{m.titulo}</span>
                  <span className="av-boleta-val" style={{color:"#10b981"}}>S/.{m.pago}</span>
                </div>
              ))}
            </>
          )}

          <div className="av-boleta-total">
            <span className="av-boleta-total-l">Total a pagar al vendedor</span>
            <span className="av-boleta-total-v">S/.{(Number(venta.comisionGanada||0) + totalMis).toLocaleString()}</span>
          </div>

          {venta.comprobanteUrl && (
            <a href={venta.comprobanteUrl} target="_blank" rel="noopener noreferrer"
              style={{display:"flex",alignItems:"center",gap:8,background:"rgba(0,243,255,.04)",border:"1px solid rgba(0,243,255,.1)",borderRadius:8,padding:"10px 14px",textDecoration:"none",marginTop:4}}>
              <span style={{fontSize:16}}>📎</span>
              <div>
                <div style={{fontSize:12,fontWeight:600,color:"rgba(0,243,255,.8)"}}>Comprobante del vendedor</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,.3)"}}>Click para abrir</div>
              </div>
            </a>
          )}
        </div>
        <div className="av-boleta-ftr">
          <button onClick={onClose}
            style={{flex:1,padding:"10px",borderRadius:8,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.09)",color:"rgba(255,255,255,.5)",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   COMPONENTE PRINCIPAL
───────────────────────────────────────── */
export default function AdminVentas() {
  const [ventas,     setVentas]     = useState([])
  const [reservas,   setReservas]   = useState({})
  const [proyectos,  setProyectos]  = useState({})
  const [loading,    setLoading]    = useState(true)
  const [filtro,     setFiltro]     = useState("pendiente_revision")
  const [procesando, setProcesando] = useState(null)
  const [toast,      setToast]      = useState(null)
  const [boleta,     setBoleta]     = useState(null)
  // Estado local de aprobación de misiones por venta: { ventaId: { misionId: true|false } }
  const [aprMisiones, setAprMisiones] = useState({})

  useEffect(() => {
    const cargar = async () => {
      try {
        const [snapV, snapR, snapP] = await Promise.all([
          getDocs(collection(db, "ventas")),
          getDocs(collection(db, "reservas")),
          getDocs(collection(db, "proyectos")),
        ])
        setVentas(snapV.docs.map(d => ({ id:d.id, ...d.data() })))

        const resMap = {}
        snapR.docs.forEach(d => { resMap[d.id] = { id:d.id, ...d.data() } })
        setReservas(resMap)

        const proyMap = {}
        snapP.docs.forEach(d => { proyMap[d.id] = { id:d.id, ...d.data() } })
        setProyectos(proyMap)
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    cargar()
  }, [])

  const mostrarToast = (msg, tipo = "green") => {
    setToast({ msg, tipo })
    setTimeout(() => setToast(null), 3500)
  }

  // Obtener misiones con su estado real desde la reserva
  const getMisiones = (v) => {
    const reserva  = reservas[v.reservaId]
    const proyecto = proyectos[v.proyectoId]
    if (!proyecto) return []
    const misionesEstado    = reserva?.misionesEstado    || {}
    const misionesEvidencia = reserva?.misionesEvidencia || {}
    return (proyecto.misiones || []).map(m => ({
      ...m,
      evidenciaUrl: misionesEvidencia[m.id] || null,
      // sin_iniciar = no subió nada | pendiente = subió evidencia esperando aprobación
      estadoMision: misionesEstado[m.id] || "sin_iniciar",
    }))
  }

  // Paso 1: Aprobar/rechazar reporte del vendedor
  const cambiarEstado = async (v, nuevoEstado) => {
    setProcesando(v.id)
    try {
      await updateDoc(doc(db, "ventas", v.id), { estado: nuevoEstado })
      setVentas(vs => vs.map(x => x.id === v.id ? { ...x, estado: nuevoEstado } : x))
      if (nuevoEstado === "aprobado") {
        setFiltro("aprobado")
        mostrarToast("✓ Venta aprobada — espera el pago del cliente", "green")
      } else {
        setFiltro("rechazado")
        mostrarToast("✕ Venta rechazada", "red")
      }
    } catch (e) { mostrarToast("Error: " + e.message, "red") }
    finally { setProcesando(null) }
  }

  // Paso 2: Confirmar pago del cliente
  const confirmarPagoCliente = async (v) => {
    setProcesando(v.id)
    try {
      await updateDoc(doc(db, "ventas", v.id), {
        estado: "cliente_pago",
        fechaPagoCliente: serverTimestamp(),
      })
      setVentas(vs => vs.map(x => x.id === v.id ? { ...x, estado: "cliente_pago" } : x))
      setFiltro("cliente_pago")
      mostrarToast("✓ Pago del cliente confirmado — aprueba las misiones", "cyan")
    } catch (e) { mostrarToast("Error: " + e.message, "red") }
    finally { setProcesando(null) }
  }

  // Paso 3: Confirmar misiones y generar pago al vendedor
  const confirmarMisionesYPago = async (v, misiones) => {
    setProcesando(v.id)
    try {
      // Solo las aprobadas por el admin
      const apr = aprMisiones[v.id] || {}
      const misionesAprobadas = misiones.filter(m =>
        m.estadoMision === "pendiente" && apr[m.id] !== false  // aprobadas por defecto si tienen evidencia
        || apr[m.id] === true                                   // aprobadas manualmente
      )

      const totalComision = Number(v.comisionGanada || 0)
      const totalMis      = misionesAprobadas.reduce((s,m) => s + Number(m.pago||0), 0)
      const totalAPagar   = totalComision + totalMis

      // Actualizar venta
      await updateDoc(doc(db, "ventas", v.id), {
        estado: "completado",
        misionesAprobadas: misionesAprobadas.map(m => m.id),
        fechaCompletado: serverTimestamp(),
      })

      // Crear pago en AdminPagos
      await addDoc(collection(db, "pagos"), {
        ventaId:          v.id,
        reservaId:        v.reservaId,
        vendedorUid:      v.vendedorUid,
        vendedor:         v.vendedorNombre,
        proyectoNombre:   v.proyectoNombre,
        proyectoId:       v.proyectoId,
        nombreCliente:    v.nombreCliente,
        concepto:         `Comisión venta — ${v.proyectoNombre}`,
        comisionVenta:    totalComision,
        comisionMisiones: totalMis,
        misionesDetalle:  misionesAprobadas.map(m => ({ titulo:m.titulo, pago:m.pago })),
        monto:            totalAPagar,
        estado:           "pendiente",
        metodo:           "",
        numero:           "",
        createdAt:        serverTimestamp(),
      })

      setVentas(vs => vs.map(x => x.id === v.id ? { ...x, estado: "completado" } : x))
      setFiltro("completado")
      mostrarToast(`✓ Pago generado — S/.${totalAPagar.toLocaleString()} pendiente en Pagos`, "green")
    } catch (e) { mostrarToast("Error: " + e.message, "red") }
    finally { setProcesando(null) }
  }

  // Toggle aprobación de misión
  const toggleMision = (ventaId, misionId, valor) => {
    setAprMisiones(a => ({
      ...a,
      [ventaId]: { ...(a[ventaId] || {}), [misionId]: valor }
    }))
  }

  const filtradas = ventas.filter(v => v.estado === filtro)
  const conteo    = (e) => ventas.filter(v => v.estado === e).length
  const totalIngresos   = ventas.filter(v => ["cliente_pago","completado"].includes(v.estado)).reduce((s,v) => s + Number(v.monto||0), 0)
  const totalComisiones = ventas.filter(v => ["cliente_pago","completado"].includes(v.estado)).reduce((s,v) => s + Number(v.comisionGanada||0), 0)

  return (
    <div className="av">
      <style>{CSS}</style>
      <div className="av-ttl">Gestión de ventas</div>
      <div className="av-sub">Aprueba reportes, confirma pagos y gestiona misiones del vendedor</div>

      <div className="av-stats">
        <div className="av-stat c1"><div className="av-stat-l">En revisión</div><div className="av-stat-v" style={{color:"#f59e0b"}}>{conteo("pendiente_revision")}</div></div>
        <div className="av-stat c2"><div className="av-stat-l">Esperando pago cliente</div><div className="av-stat-v" style={{color:"#00f3ff"}}>{conteo("aprobado")}</div></div>
        <div className="av-stat c3"><div className="av-stat-l">Ingresos confirmados</div><div className="av-stat-v" style={{color:"#10b981",fontSize:15}}>S/.{totalIngresos.toLocaleString()}</div></div>
        <div className="av-stat c4"><div className="av-stat-l">Comisiones generadas</div><div className="av-stat-v" style={{color:"#a855f7",fontSize:15}}>S/.{totalComisiones.toLocaleString()}</div></div>
      </div>

      <div className="av-tabs">
        {[
          { id:"pendiente_revision", lbl:"En revisión"  },
          { id:"aprobado",           lbl:"Aprobadas"    },
          { id:"cliente_pago",       lbl:"Cliente pagó" },
          { id:"completado",         lbl:"Completadas"  },
          { id:"rechazado",          lbl:"Rechazadas"   },
        ].map(f => (
          <button key={f.id} className={`av-tab ${filtro===f.id?"on":""}`} onClick={() => setFiltro(f.id)}>
            {f.lbl} ({conteo(f.id)})
          </button>
        ))}
      </div>

      {loading && <div className="av-loading">Cargando ventas…</div>}
      {!loading && filtradas.length === 0 && (
        <div style={{textAlign:"center",padding:"40px 20px",color:"rgba(255,255,255,.2)",fontSize:13}}>
          No hay ventas en esta categoría
        </div>
      )}

      {!loading && filtradas.map(v => {
        const cfg       = ESTADOS[v.estado] || ESTADOS.pendiente_revision
        const step      = cfg.step
        const enProceso = procesando === v.id
        const misiones  = getMisiones(v)
        const apr       = aprMisiones[v.id] || {}

        // Para la boleta: misiones que quedaron aprobadas
        const misionesAprobBoleta = misiones.filter(m =>
          (m.estadoMision === "pendiente" && apr[m.id] !== false) || apr[m.id] === true
        )

        return (
          <div key={v.id} className="av-card">

            {/* Header */}
            <div className="av-card-hdr">
              <div className="av-av">{v.vendedorNombre?.[0] || "?"}</div>
              <div style={{flex:1}}>
                <div className="av-vend">{v.vendedorNombre}</div>
                <div className="av-meta">{formatFecha(v.fecha)} · {v.proyectoNombre}</div>
              </div>
              <span className={`av-chip ${cfg.cls}`}>{cfg.lbl}</span>
            </div>

            {/* Timeline */}
            {v.estado !== "rechazado" && (
              <div className="av-tl">
                {TIMELINE.map((tl, i) => (
                  <>
                    <div key={i} className="av-tl-step">
                      <div className={`av-tl-dot ${i < step ? "done" : i === step ? "active" : ""}`}>
                        {i < step ? "✓" : tl.ico}
                      </div>
                      <div className={`av-tl-lbl ${i < step ? "done" : i === step ? "active" : ""}`}>
                        {tl.lbl}
                      </div>
                    </div>
                    {i < TIMELINE.length - 1 && (
                      <div key={`l${i}`} className={`av-tl-line ${i < step ? "done" : ""}`} />
                    )}
                  </>
                ))}
              </div>
            )}

            {/* Datos */}
            <div className="av-grid">
              <div className="av-dato"><div className="av-dato-l">Proyecto</div><div className="av-dato-v">{v.proyectoNombre||"—"}</div></div>
              <div className="av-dato"><div className="av-dato-l">Precio vendido</div><div className="av-dato-v" style={{fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:800,color:"#00f3ff"}}>S/.{Number(v.monto||0).toLocaleString()}</div></div>
              <div className="av-dato"><div className="av-dato-l">Comisión vendedor</div><div className="av-dato-v" style={{fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:800,color:"#10b981"}}>S/.{Number(v.comisionGanada||0).toLocaleString()}</div></div>
              <div className="av-dato"><div className="av-dato-l">Ganancia Synkro</div><div className="av-dato-v" style={{fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:800,color:"#a855f7"}}>S/.{(Number(v.monto||0)-Number(v.comisionGanada||0)).toLocaleString()}</div></div>
            </div>

            {/* Cliente */}
            <div className="av-cli">
              <div className="av-cli-lbl">Cliente</div>
              <div className="av-cli-row"><span className="av-cli-k">Nombre</span><span className="av-cli-v">{v.nombreCliente||"—"}</span></div>
              <div className="av-cli-row"><span className="av-cli-k">Contacto</span><span className="av-cli-v">{v.contactoCliente||"—"}</span></div>
            </div>

            {/* Comprobante del vendedor */}
            {v.comprobanteUrl ? (
              <a href={v.comprobanteUrl} target="_blank" rel="noopener noreferrer" className="av-comp">
                <span style={{fontSize:18}}>📎</span>
                <div>
                  <div className="av-comp-txt">Ver comprobante del vendedor</div>
                  <div className="av-comp-sub">Subido por {v.vendedorNombre} · click para abrir</div>
                </div>
              </a>
            ) : (
              <div className="av-no-comp">Sin comprobante adjunto</div>
            )}

            {/* ── MISIONES — solo en estado cliente_pago ── */}
            {v.estado === "cliente_pago" && misiones.length > 0 && (
              <div style={{marginBottom:14}}>
                <div className="av-mis-sec">
                  Misiones del vendedor — aprueba o rechaza cada una
                </div>
                {misiones.map((m, i) => {
                  const tieneEvidencia = m.estadoMision === "pendiente"
                  const noHizo         = m.estadoMision === "sin_iniciar"
                  // Estado de aprobación: undefined=sin decidir, true=aprobada, false=rechazada
                  const aprobada = apr[m.id]
                  // Color del item
                  const borderColor = aprobada === true
                    ? "rgba(16,185,129,.25)"
                    : aprobada === false
                      ? "rgba(239,68,68,.2)"
                      : noHizo
                        ? "rgba(255,255,255,.04)"
                        : "rgba(245,158,11,.2)"

                  const bg = aprobada === true
                    ? "rgba(16,185,129,.05)"
                    : aprobada === false
                      ? "rgba(239,68,68,.04)"
                      : "rgba(255,255,255,.02)"

                  return (
                    <div key={m.id} className="av-mis-item" style={{borderColor, background:bg}}>
                      {/* Icono estado */}
                      <div className="av-mis-ico" style={{
                        background: tieneEvidencia ? "rgba(245,158,11,.1)" : "rgba(255,255,255,.04)",
                        border: `1px solid ${tieneEvidencia ? "rgba(245,158,11,.2)" : "rgba(255,255,255,.06)"}`,
                      }}>
                        {tieneEvidencia ? "📸" : "○"}
                      </div>

                      <div style={{flex:1,minWidth:0}}>
                        <div className="av-mis-nom" style={{color: noHizo ? "rgba(255,255,255,.3)" : "rgba(255,255,255,.8)"}}>
                          {m.titulo}
                        </div>
                        <div style={{fontSize:10,color:"rgba(255,255,255,.25)",marginTop:2}}>
                          {noHizo
                            ? "No subió evidencia"
                            : aprobada === true
                              ? "✓ Aprobada"
                              : aprobada === false
                                ? "✕ Rechazada"
                                : "⏳ Tiene evidencia — pendiente de revisión"}
                        </div>
                      </div>

                      <span className="av-mis-pago" style={{color: aprobada===true ? "#10b981" : "rgba(255,255,255,.25)"}}>
                        S/.{m.pago}
                      </span>

                      {m.evidenciaUrl && (
                        <a href={m.evidenciaUrl} target="_blank" rel="noopener noreferrer" className="av-mis-ev">
                          Ver evidencia
                        </a>
                      )}

                      {/* Botones solo si tiene evidencia */}
                      {tieneEvidencia && aprobada === undefined && (
                        <div className="av-mis-btns">
                          <button className="av-mis-btn rej" onClick={() => toggleMision(v.id, m.id, false)}>✕</button>
                          <button className="av-mis-btn ap"  onClick={() => toggleMision(v.id, m.id, true)}>✓</button>
                        </div>
                      )}
                      {tieneEvidencia && aprobada !== undefined && (
                        <button
                          className="av-mis-btn"
                          style={{background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",color:"rgba(255,255,255,.35)"}}
                          onClick={() => toggleMision(v.id, m.id, undefined)}
                        >
                          ↩
                        </button>
                      )}
                    </div>
                  )
                })}

                {/* Total misiones aprobadas */}
                {misiones.some(m => apr[m.id] === true) && (
                  <div className="av-mis-total">
                    <span className="av-mis-total-l">
                      Comisión S/.{Number(v.comisionGanada||0).toLocaleString()} + Misiones aprobadas
                    </span>
                    <span className="av-mis-total-v">
                      S/.{(
                        Number(v.comisionGanada||0) +
                        misiones.filter(m => apr[m.id] === true).reduce((s,m) => s + Number(m.pago||0), 0)
                      ).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* ── BOTONES ── */}
            <div className="av-btns">
              <button className="av-btn cyan" onClick={() => setBoleta({ venta:v, misionesAprobadas: misionesAprobBoleta })}>
                📄 Ver boleta
              </button>

              {v.estado === "pendiente_revision" && (
                <>
                  <button className="av-btn red" disabled={enProceso} onClick={() => cambiarEstado(v, "rechazado")}>
                    {enProceso ? "…" : "✕ Rechazar"}
                  </button>
                  <button className="av-btn green" disabled={enProceso} onClick={() => cambiarEstado(v, "aprobado")}>
                    {enProceso ? "…" : "✓ Aprobar reporte"}
                  </button>
                </>
              )}

              {v.estado === "aprobado" && (
                <button className="av-btn amber" disabled={enProceso} onClick={() => confirmarPagoCliente(v)}>
                  {enProceso ? "…" : "💰 Confirmar pago del cliente"}
                </button>
              )}

              {v.estado === "cliente_pago" && (
                <button
                  className="av-btn green"
                  disabled={enProceso || (
                    // Bloquear si hay misiones con evidencia sin decisión
                    misiones.some(m => m.estadoMision === "pendiente" && apr[m.id] === undefined)
                  )}
                  onClick={() => confirmarMisionesYPago(v, misiones)}
                  title={misiones.some(m => m.estadoMision === "pendiente" && apr[m.id] === undefined)
                    ? "Aprueba o rechaza todas las misiones con evidencia primero"
                    : ""}
                >
                  {enProceso ? "…" : "🎯 Generar pago al vendedor"}
                </button>
              )}
            </div>
          </div>
        )
      })}

      {toast  && <div className={`av-toast ${toast.tipo}`}>{toast.msg}</div>}
      {boleta && <ModalBoleta venta={boleta.venta} misionesAprobadas={boleta.misionesAprobadas} onClose={() => setBoleta(null)} />}
    </div>
  )
}