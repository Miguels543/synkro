import { useState, useEffect } from "react"
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore"
import { db } from "../../../firebase/config"

const CSS_MIS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');
  .ami { padding:26px 30px 60px; }
  .ami-ttl { font-family:'Syne',sans-serif; font-size:20px; font-weight:800; color:#fff; margin-bottom:3px; }
  .ami-sub  { font-size:12px; color:rgba(255,255,255,.28); margin-bottom:22px; }
  .ami-loading { text-align:center; padding:48px; color:rgba(255,255,255,.25); font-size:13px; }
  .ami-toolbar { display:flex; gap:10px; align-items:center; margin-bottom:16px; }
  .ami-search { flex:1; background:#0c0f14; border:1px solid rgba(255,255,255,.08); border-radius:9px; padding:8px 14px; color:#fff; font-size:13px; font-family:'Plus Jakarta Sans',sans-serif; outline:none; }
  .ami-search:focus { border-color:rgba(0,243,255,.3); }
  .ami-search::placeholder { color:rgba(255,255,255,.2); }
  .ami-btn-new { padding:8px 16px; border-radius:9px; background:#00f3ff; color:#000; font-size:12px; font-weight:700; border:none; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; white-space:nowrap; }
  .ami-btn-new:hover { background:#7fffff; }
  .ami-card { background:#0c0f14; border:1px solid rgba(255,255,255,.06); border-radius:11px; padding:15px 18px; margin-bottom:10px; display:flex; align-items:center; gap:14px; }
  .ami-pago { flex-shrink:0; background:rgba(16,185,129,.07); border:1px solid rgba(16,185,129,.12); border-radius:8px; padding:9px 12px; text-align:center; min-width:60px; }
  .ami-pago-v { font-family:'Syne',sans-serif; font-size:16px; font-weight:800; color:#10b981; line-height:1; }
  .ami-pago-l { font-size:7px; color:rgba(16,185,129,.4); text-transform:uppercase; letter-spacing:1px; margin-top:2px; }
  .ami-body { flex:1; min-width:0; }
  .ami-proy { font-size:9px; letter-spacing:1.5px; text-transform:uppercase; color:rgba(0,243,255,.45); margin-bottom:3px; }
  .ami-nom  { font-size:13px; font-weight:700; color:#fff; margin-bottom:3px; }
  .ami-desc { font-size:11.5px; color:rgba(255,255,255,.35); line-height:1.55; }
  .ami-stats { display:flex; gap:14px; flex-shrink:0; }
  .ami-stat  { text-align:center; }
  .ami-stat-v { font-family:'Syne',sans-serif; font-size:16px; font-weight:800; color:#fff; }
  .ami-stat-l { font-size:8px; color:rgba(255,255,255,.25); text-transform:uppercase; letter-spacing:1px; }
  .ami-acciones { display:flex; gap:6px; flex-shrink:0; }
  .ami-btn { padding:6px 11px; border-radius:6px; font-size:11px; font-weight:600; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all .15s; border:none; }
  .ami-btn.red { background:rgba(239,68,68,.08); border:1px solid rgba(239,68,68,.18); color:#ef4444; }
  .ami-ovl { position:fixed; inset:0; z-index:9000; background:rgba(0,0,0,.8); display:flex; align-items:center; justify-content:center; backdrop-filter:blur(5px); }
  .ami-mod { background:#0e1319; border:1px solid rgba(0,243,255,.12); border-radius:15px; padding:28px; max-width:420px; width:92%; }
  .ami-mod-t { font-family:'Syne',sans-serif; font-size:17px; font-weight:800; color:#fff; margin-bottom:16px; }
  .ami-mod-f { margin-bottom:12px; }
  .ami-mod-l { font-size:10px; color:rgba(255,255,255,.3); margin-bottom:5px; }
  .ami-mod-v { width:100%; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); border-radius:8px; padding:9px 12px; color:#fff; font-size:13px; font-family:'Plus Jakarta Sans',sans-serif; outline:none; }
  .ami-mod-v:focus { border-color:rgba(0,243,255,.3); }
  .ami-mod-v::placeholder { color:rgba(255,255,255,.16); }
  select.ami-mod-v option { background:#0e1319; }
  .ami-mod-row { display:flex; gap:8px; margin-top:14px; }
  .ami-mod-btn { flex:1; padding:10px; border-radius:8px; font-size:13px; font-weight:700; cursor:pointer; border:none; font-family:'Plus Jakarta Sans',sans-serif; }
  .ami-mod-btn.ghost { background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.09); color:rgba(255,255,255,.4); }
  .ami-mod-btn.cyan  { background:#00f3ff; color:#000; }
  .ami-mod-btn:disabled { opacity:.4; cursor:not-allowed; }
`

export default function AdminMisiones() {
  const [misiones,  setMisiones]  = useState([])
  const [proyectos, setProyectos] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [saving,    setSaving]    = useState(false)
  const [buscar,    setBuscar]    = useState("")
  const [modal,     setModal]     = useState(null)
  const [form,      setForm]      = useState({ proyecto:"", titulo:"", desc:"", pago:"" })

  useEffect(() => {
    const cargar = async () => {
      try {
        const [snapMis, snapProy] = await Promise.all([
          getDocs(collection(db, "misiones")),
          getDocs(collection(db, "proyectos")),
        ])
        setMisiones(snapMis.docs.map(d => ({ id: d.id, ...d.data() })))
        setProyectos(snapProy.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [])

  const filtradas = misiones.filter(m =>
    m.titulo?.toLowerCase().includes(buscar.toLowerCase()) ||
    m.proyecto?.toLowerCase().includes(buscar.toLowerCase())
  )

  const guardar = async () => {
    if (!form.titulo || !form.pago) return
    try {
      setSaving(true)
      const datos = { ...form, pago: Number(form.pago), completadas: 0, pendientes: 0 }
      const ref = await addDoc(collection(db, "misiones"), datos)
      setMisiones(ms => [...ms, { id: ref.id, ...datos }])
      setModal(null)
    } catch (e) {
      alert("Error: " + e.message)
    } finally {
      setSaving(false)
    }
  }

  const eliminar = async (id) => {
    if (!confirm("¿Eliminar esta misión?")) return
    try {
      await deleteDoc(doc(db, "misiones", id))
      setMisiones(ms => ms.filter(m => m.id !== id))
    } catch (e) {
      alert("Error: " + e.message)
    }
  }

  return (
    <div className="ami">
      <style>{CSS_MIS}</style>
      <div className="ami-ttl">Misiones</div>
      <div className="ami-sub">Tareas opcionales con pago fijo asignadas a cada proyecto</div>
      <div className="ami-toolbar">
        <input className="ami-search" placeholder="Buscar misión o proyecto..." value={buscar} onChange={e=>setBuscar(e.target.value)} />
        <button className="ami-btn-new" onClick={()=>{ setForm({ proyecto:"", titulo:"", desc:"", pago:"" }); setModal("nuevo") }}>
          + Nueva misión
        </button>
      </div>

      {loading && <div className="ami-loading">Cargando misiones...</div>}

      {!loading && filtradas.map(m => (
        <div key={m.id} className="ami-card">
          <div className="ami-pago">
            <div className="ami-pago-v">S/.{m.pago}</div>
            <div className="ami-pago-l">pago</div>
          </div>
          <div className="ami-body">
            <div className="ami-proy">{m.proyecto}</div>
            <div className="ami-nom">{m.titulo}</div>
            <div className="ami-desc">{m.desc}</div>
          </div>
          <div className="ami-stats">
            <div className="ami-stat">
              <div className="ami-stat-v" style={{ color:"#10b981" }}>{m.completadas||0}</div>
              <div className="ami-stat-l">hechas</div>
            </div>
            <div className="ami-stat">
              <div className="ami-stat-v" style={{ color:"#f59e0b" }}>{m.pendientes||0}</div>
              <div className="ami-stat-l">pendientes</div>
            </div>
          </div>
          <div className="ami-acciones">
            <button className="ami-btn red" onClick={()=>eliminar(m.id)}>✕</button>
          </div>
        </div>
      ))}

      {modal && (
        <div className="ami-ovl" onClick={()=>setModal(null)}>
          <div className="ami-mod" onClick={e=>e.stopPropagation()}>
            <div className="ami-mod-t">Nueva misión</div>
            <div className="ami-mod-f">
              <div className="ami-mod-l">Proyecto</div>
              <select className="ami-mod-v" value={form.proyecto} onChange={e=>setForm(f=>({...f,proyecto:e.target.value}))} style={{cursor:"pointer",appearance:"none"}}>
                <option value="">Seleccionar proyecto</option>
                {proyectos.map(p=><option key={p.id}>{p.nombre}</option>)}
              </select>
            </div>
            <div className="ami-mod-f">
              <div className="ami-mod-l">Título</div>
              <input className="ami-mod-v" value={form.titulo} onChange={e=>setForm(f=>({...f,titulo:e.target.value}))} placeholder="Ej: Publicar en Facebook" />
            </div>
            <div className="ami-mod-f">
              <div className="ami-mod-l">Descripción</div>
              <textarea className="ami-mod-v" rows={3} value={form.desc} onChange={e=>setForm(f=>({...f,desc:e.target.value}))} placeholder="Qué debe hacer el vendedor..." style={{resize:"vertical"}} />
            </div>
            <div className="ami-mod-f">
              <div className="ami-mod-l">Pago (S/.)</div>
              <input className="ami-mod-v" type="number" value={form.pago} onChange={e=>setForm(f=>({...f,pago:e.target.value}))} placeholder="40" />
            </div>
            <div className="ami-mod-row">
              <button className="ami-mod-btn ghost" onClick={()=>setModal(null)}>Cancelar</button>
              <button className="ami-mod-btn cyan" onClick={guardar} disabled={saving||!form.titulo||!form.pago}>
                {saving ? "Guardando..." : "Crear misión"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}