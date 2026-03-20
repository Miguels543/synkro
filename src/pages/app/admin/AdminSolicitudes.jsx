import { useState, useEffect } from "react"
import { collection, getDocs, updateDoc, doc } from "firebase/firestore"
import { db } from "../../../firebase/config"

const CSS_BASE = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');
  .as { padding:26px 30px 60px; }
  .as-ttl { font-family:'Syne',sans-serif; font-size:20px; font-weight:800; color:#fff; margin-bottom:3px; }
  .as-sub  { font-size:12px; color:rgba(255,255,255,.28); margin-bottom:22px; }
  .as-loading { text-align:center; padding:48px; color:rgba(255,255,255,.25); font-size:13px; }
  .as-tabs { display:flex; gap:8px; margin-bottom:18px; flex-wrap:wrap; }
  .as-tab  { padding:7px 16px; border-radius:20px; font-size:12px; font-weight:600; cursor:pointer; border:1px solid rgba(255,255,255,.07); background:rgba(255,255,255,.03); color:rgba(255,255,255,.35); transition:all .16s; font-family:'Plus Jakarta Sans',sans-serif; }
  .as-tab.on { background:rgba(0,243,255,.08); border-color:rgba(0,243,255,.25); color:#00f3ff; }
  .as-card { background:#0c0f14; border:1px solid rgba(255,255,255,.06); border-radius:12px; padding:18px 20px; margin-bottom:12px; }
  .as-card-hdr { display:flex; align-items:flex-start; gap:12px; margin-bottom:14px; }
  .as-av { width:40px; height:40px; border-radius:10px; background:linear-gradient(135deg,rgba(0,243,255,.12),rgba(168,85,247,.12)); border:1px solid rgba(0,243,255,.15); display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-size:16px; font-weight:800; color:#00f3ff; flex-shrink:0; }
  .as-nom  { font-size:14px; font-weight:700; color:#fff; margin-bottom:3px; }
  .as-meta { font-size:11px; color:rgba(255,255,255,.28); line-height:1.5; }
  .as-filtros { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:14px; }
  .as-filtro-box { background:rgba(255,255,255,.02); border:1px solid rgba(255,255,255,.05); border-radius:9px; padding:10px 12px; }
  .as-filtro-lbl { font-size:8.5px; letter-spacing:1.5px; text-transform:uppercase; color:rgba(255,255,255,.2); margin-bottom:5px; }
  .as-filtro-val { font-size:12.5px; font-weight:600; color:rgba(255,255,255,.7); }
  .as-exp.ninguna  { color:rgba(255,255,255,.4); }
  .as-exp.poca     { color:#60a5fa; }
  .as-exp.moderada { color:#f59e0b; }
  .as-exp.bastante { color:#10b981; }
  .as-red { font-size:12.5px; color:#00f3ff; text-decoration:none; font-weight:600; }
  .as-red:hover { text-decoration:underline; }
  .as-motivacion-wrap { margin-bottom:14px; }
  .as-motivacion-lbl  { font-size:8.5px; letter-spacing:1.5px; text-transform:uppercase; color:rgba(255,255,255,.2); margin-bottom:7px; }
  .as-motivacion-txt  { font-size:13px; color:rgba(255,255,255,.55); line-height:1.75; background:rgba(255,255,255,.02); border:1px solid rgba(255,255,255,.05); border-radius:9px; padding:12px 14px; border-left:2px solid rgba(0,243,255,.2); }
  .as-btns { display:flex; gap:8px; }
  .as-btn  { flex:1; padding:9px; border-radius:8px; font-size:12px; font-weight:700; cursor:pointer; border:none; font-family:'Plus Jakarta Sans',sans-serif; transition:all .16s; text-align:center; }
  .as-btn:disabled { opacity:.5; cursor:not-allowed; }
  .as-btn.green { background:#10b981; color:#fff; }
  .as-btn.green:hover:not(:disabled) { background:#059669; }
  .as-btn.red   { background:rgba(239,68,68,.1); border:1px solid rgba(239,68,68,.2); color:#ef4444; }
  .as-btn.red:hover:not(:disabled) { background:rgba(239,68,68,.18); }
  .as-chip { display:inline-flex; align-items:center; gap:4px; font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; padding:3px 9px; border-radius:20px; }
  .as-chip.pen { background:rgba(245,158,11,.09); color:#f59e0b; border:1px solid rgba(245,158,11,.18); }
  .as-chip.ok  { background:rgba(16,185,129,.09);  color:#10b981; border:1px solid rgba(16,185,129,.18); }
  .as-chip.rej { background:rgba(239,68,68,.09);   color:#ef4444; border:1px solid rgba(239,68,68,.18); }
  .as-toast { position:fixed; bottom:28px; left:50%; transform:translateX(-50%); background:#0c0f14; border-radius:10px; padding:12px 22px; font-size:13px; font-weight:600; box-shadow:0 8px 32px rgba(0,0,0,.4); z-index:9999; animation:toastIn .25s ease; white-space:nowrap; }
  .as-toast.green { border:1px solid rgba(16,185,129,.3); color:#10b981; }
  .as-toast.red   { border:1px solid rgba(239,68,68,.3);  color:#ef4444; }
  @keyframes toastIn { from{opacity:0;transform:translateX(-50%) translateY(8px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
  @media (max-width: 768px) {
    .as { padding:18px 16px 50px; }
    .as-filtros { grid-template-columns:1fr; }
    .as-ttl { font-size:17px; }
  }
  @media (max-width: 480px) {
    .as { padding:14px 12px 40px; }
    .as-card { padding:14px; }
    .as-btn  { font-size:11px; padding:8px; }
  }
`

const chipCfg = {
  pendiente: { cls:"pen", lbl:"Pendiente" },
  aprobado:  { cls:"ok",  lbl:"Aprobado"  },
  rechazado: { cls:"rej", lbl:"Rechazado" },
}

const expCfg = {
  ninguna:  { ico:"○", lbl:"Sin experiencia"     },
  poca:     { ico:"◔", lbl:"Poca experiencia"     },
  moderada: { ico:"◑", lbl:"Experiencia moderada" },
  bastante: { ico:"●", lbl:"Bastante experiencia" },
}

export default function AdminSolicitudes() {
  const [solicitudes, setSolicitudes] = useState([])
  const [loading,     setLoading]     = useState(true)
  const [filtro,      setFiltro]      = useState("pendiente")
  const [procesando,  setProcesando]  = useState(null)
  const [toast,       setToast]       = useState(null)

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

  const mostrarToast = (msg, tipo = "green") => {
    setToast({ msg, tipo })
    setTimeout(() => setToast(null), 3000)
  }

  // ← recibe el objeto completo "s", no solo el id
  const cambiarEstado = async (s, nuevoEstado) => {
    setProcesando(s.id)
    try {
      // 1 — Actualizar solicitudes/{id}
      await updateDoc(doc(db, "solicitudes", s.id), { estado: nuevoEstado })

      // 2 — Actualizar users/{uid} para que RoleGuard lo detecte al verificar
      if (s.uid) {
        await updateDoc(doc(db, "users", s.uid), { estado: nuevoEstado })
      } else {
        console.warn("Solicitud sin uid — no se actualizó el user:", s.id)
      }

      // 3 — Reflejar cambio en el estado local
      setSolicitudes(prev => prev.map(x => x.id === s.id ? { ...x, estado: nuevoEstado } : x))

      mostrarToast(
        nuevoEstado === "aprobado"
          ? "✓ Vendedor aprobado — ya tiene acceso"
          : "✕ Solicitud rechazada",
        nuevoEstado === "aprobado" ? "green" : "red"
      )
    } catch (e) {
      console.error("Error al cambiar estado:", e)
      mostrarToast("Error: " + e.message, "red")
    } finally {
      setProcesando(null)
    }
  }

  const filtradas = solicitudes.filter(s => s.estado === filtro)
  const conteo    = (e) => solicitudes.filter(s => s.estado === e).length

  const formatFecha = (f) => {
    if (!f) return ""
    if (f?.toDate) return f.toDate().toLocaleDateString("es-PE", { day:"numeric", month:"short", year:"numeric" })
    return f
  }

  const redSocialUrl = (red) => {
    if (!red) return null
    const r = red.trim()
    if (r.startsWith("http")) return r
    const usuario = r.startsWith("@") ? r.slice(1) : r
    const rl = r.toLowerCase()
    if (rl.includes("tiktok"))   return `https://tiktok.com/@${usuario}`
    if (rl.includes("linkedin")) return `https://linkedin.com/in/${usuario}`
    if (rl.includes("twitter") || rl.includes("x.com")) return `https://x.com/${usuario}`
    if (rl.includes("facebook")) return `https://facebook.com/${usuario}`
    if (rl.includes("youtube"))  return `https://youtube.com/@${usuario}`
    return `https://instagram.com/${usuario}`
  }

  const redSocialLabel = (red) => {
    if (!red) return "Instagram"
    const rl = red.toLowerCase()
    if (rl.includes("tiktok"))   return "TikTok"
    if (rl.includes("linkedin")) return "LinkedIn"
    if (rl.includes("twitter") || rl.includes("x.com")) return "X"
    if (rl.includes("facebook")) return "Facebook"
    if (rl.includes("youtube"))  return "YouTube"
    if (rl.startsWith("http"))   return "Enlace"
    return "Instagram"
  }

  return (
    <div className="as">
      <style>{CSS_BASE}</style>
      <div className="as-ttl">Solicitudes de ingreso</div>
      <div className="as-sub">Revisa la motivación y perfil de cada candidato antes de aprobar</div>

      <div className="as-tabs">
        {["pendiente","aprobado","rechazado"].map(f => (
          <button key={f} className={`as-tab ${filtro===f?"on":""}`} onClick={() => setFiltro(f)}>
            {f==="pendiente"?"Pendientes":f==="aprobado"?"Aprobados":"Rechazados"} ({conteo(f)})
          </button>
        ))}
      </div>

      {loading && <div className="as-loading">Cargando solicitudes…</div>}

      {!loading && filtradas.length === 0 && (
        <div style={{textAlign:"center",padding:"40px 20px",color:"rgba(255,255,255,.2)",fontSize:13}}>
          No hay solicitudes en esta categoría
        </div>
      )}

      {!loading && filtradas.map(s => {
        const cfg       = chipCfg[s.estado] || chipCfg.pendiente
        const exp       = expCfg[s.experiencia]
        const enProceso = procesando === s.id
        const redUrl    = redSocialUrl(s.redSocial)
        const redLabel  = redSocialLabel(s.redSocial)

        return (
          <div key={s.id} className="as-card">
            <div className="as-card-hdr">
              <div className="as-av">{s.nombre?.[0] || "?"}</div>
              <div style={{flex:1}}>
                <div className="as-nom">{s.nombre}</div>
                <div className="as-meta">
                  {s.email}<br/>
                  {s.telefono} · {s.pais} · {formatFecha(s.fecha)}
                </div>
              </div>
              <span className={`as-chip ${cfg.cls}`}>{cfg.lbl}</span>
            </div>

            <div className="as-filtros">
              <div className="as-filtro-box">
                <div className="as-filtro-lbl">Experiencia en ventas</div>
                {exp ? (
                  <div className={`as-filtro-val as-exp ${s.experiencia}`}>
                    {exp.ico} {exp.lbl}
                  </div>
                ) : (
                  <div className="as-filtro-val" style={{color:"rgba(255,255,255,.25)"}}>No indicada</div>
                )}
              </div>
              <div className="as-filtro-box">
                <div className="as-filtro-lbl">Red social</div>
                {redUrl ? (
                  <a href={redUrl} target="_blank" rel="noopener noreferrer" className="as-red">
                    {redLabel}: {s.redSocial}
                  </a>
                ) : (
                  <div className="as-filtro-val" style={{color:"rgba(255,255,255,.25)"}}>No indicada</div>
                )}
              </div>
            </div>

            {s.motivacion && (
              <div className="as-motivacion-wrap">
                <div className="as-motivacion-lbl">¿Por qué quiere unirse?</div>
                <div className="as-motivacion-txt">"{s.motivacion}"</div>
              </div>
            )}

            {s.estado === "pendiente" && (
              <div className="as-btns">
                <button
                  className="as-btn red"
                  disabled={enProceso}
                  onClick={() => cambiarEstado(s, "rechazado")}
                >
                  {enProceso ? "…" : "✕ Rechazar"}
                </button>
                <button
                  className="as-btn green"
                  disabled={enProceso}
                  onClick={() => cambiarEstado(s, "aprobado")}
                >
                  {enProceso ? "…" : "✓ Aprobar"}
                </button>
              </div>
            )}
          </div>
        )
      })}

      {toast && <div className={`as-toast ${toast.tipo}`}>{toast.msg}</div>}
    </div>
  )
}