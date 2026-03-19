import { useState, useEffect } from "react"
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc
} from "firebase/firestore"
import { db } from "../../../firebase/config"

const CATEGORIAS = [
  "Restaurantes","E-commerce","Inmobiliaria","Educación","Salud",
  "Noticias","Tecnología","Viajes y turismo","Moda y belleza","Corporativas"
]

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');
  .ap { padding:26px 30px 60px; }
  .ap-ttl { font-family:'Syne',sans-serif; font-size:20px; font-weight:800; color:#fff; margin-bottom:3px; }
  .ap-sub  { font-size:12px; color:rgba(255,255,255,.28); margin-bottom:22px; }
  .ap-toolbar { display:flex; gap:10px; align-items:center; margin-bottom:16px; flex-wrap:wrap; }
  .ap-search { flex:1; min-width:200px; background:#0c0f14; border:1px solid rgba(255,255,255,.08); border-radius:9px; padding:8px 14px; color:#fff; font-size:13px; font-family:'Plus Jakarta Sans',sans-serif; outline:none; transition:border-color .16s; }
  .ap-search:focus { border-color:rgba(0,243,255,.3); }
  .ap-search::placeholder { color:rgba(255,255,255,.2); }
  .ap-btn-new { padding:8px 16px; border-radius:9px; background:#00f3ff; color:#000; font-size:12px; font-weight:700; border:none; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; white-space:nowrap; }
  .ap-btn-new:hover { background:#7fffff; }
  .ap-loading { text-align:center; padding:48px; color:rgba(255,255,255,.25); font-size:13px; }
  .ap-error   { text-align:center; padding:48px; color:#ef4444; font-size:13px; }
  .ap-tabla { background:#0c0f14; border:1px solid rgba(255,255,255,.06); border-radius:11px; overflow:hidden; }
  .ap-hdr { display:grid; grid-template-columns:2fr 1.4fr 1fr 1fr 1fr 1fr 160px; padding:10px 16px; border-bottom:1px solid rgba(255,255,255,.05); font-size:8.5px; letter-spacing:1.5px; text-transform:uppercase; color:rgba(255,255,255,.2); }
  .ap-row { display:grid; grid-template-columns:2fr 1.4fr 1fr 1fr 1fr 1fr 160px; padding:13px 16px; border-bottom:1px solid rgba(255,255,255,.03); align-items:center; transition:background .13s; }
  .ap-row:last-child { border-bottom:none; }
  .ap-row:hover { background:rgba(255,255,255,.02); }
  .ap-nom   { font-size:13px; font-weight:600; color:#fff; margin-bottom:2px; }
  .ap-cat   { font-size:9px; letter-spacing:1px; text-transform:uppercase; color:rgba(0,243,255,.45); }
  .ap-precio { font-size:12.5px; font-weight:600; color:rgba(255,255,255,.7); }
  .ap-com   { font-size:13px; font-weight:700; color:#10b981; }
  .ap-com-est { font-size:10px; color:rgba(16,185,129,.5); margin-top:1px; }
  .ap-chip  { display:inline-flex; align-items:center; font-size:9px; font-weight:700; text-transform:uppercase; padding:3px 9px; border-radius:20px; }
  .ap-chip.disp    { background:rgba(16,185,129,.09);  color:#10b981; border:1px solid rgba(16,185,129,.18); }
  .ap-chip.cola    { background:rgba(245,158,11,.09);  color:#f59e0b; border:1px solid rgba(245,158,11,.18); }
  .ap-chip.pausado { background:rgba(255,255,255,.05); color:rgba(255,255,255,.3); border:1px solid rgba(255,255,255,.1); }
  .ap-mis-badge { display:inline-flex; align-items:center; gap:5px; font-size:11px; font-weight:600; color:rgba(255,255,255,.35); cursor:pointer; transition:color .15s; padding:4px 8px; border-radius:6px; border:1px solid transparent; }
  .ap-mis-badge:hover { color:#00f3ff; border-color:rgba(0,243,255,.15); background:rgba(0,243,255,.04); }
  .ap-acciones { display:flex; gap:5px; flex-wrap:wrap; }
  .ap-accion { padding:5px 10px; border-radius:6px; font-size:11px; font-weight:600; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all .15s; border:none; text-decoration:none; display:inline-flex; align-items:center; }
  .ap-accion.ghost { background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.09); color:rgba(255,255,255,.4); }
  .ap-accion.ghost:hover { border-color:rgba(255,255,255,.2); color:#fff; }
  .ap-accion.red { background:rgba(239,68,68,.08); border:1px solid rgba(239,68,68,.18); color:#ef4444; }
  .ap-accion.red:hover { background:rgba(239,68,68,.15); }
  .ap-accion.cyan { background:rgba(0,243,255,.07); border:1px solid rgba(0,243,255,.2); color:#00f3ff; }
  .ap-accion.cyan:hover { background:rgba(0,243,255,.14); }
  .ap-accion:disabled, .ap-accion.disabled { opacity:.3; cursor:not-allowed; pointer-events:none; }

  .ap-ovl { position:fixed; inset:0; z-index:9000; background:rgba(0,0,0,.82); display:flex; align-items:center; justify-content:center; backdrop-filter:blur(6px); }
  .ap-mod { background:#0e1319; border:1px solid rgba(0,243,255,.12); border-radius:15px; max-width:600px; width:94%; max-height:92vh; overflow:hidden; display:flex; flex-direction:column; }
  .ap-mod-hdr { padding:22px 26px 0; flex-shrink:0; }
  .ap-mod-t   { font-family:'Syne',sans-serif; font-size:17px; font-weight:800; color:#fff; margin-bottom:14px; }
  .ap-mod-tabs { display:flex; gap:0; border-bottom:1px solid rgba(255,255,255,.06); }
  .ap-mod-tab  { padding:9px 18px; font-size:12px; font-weight:600; cursor:pointer; border:none; background:transparent; color:rgba(255,255,255,.3); font-family:'Plus Jakarta Sans',sans-serif; border-bottom:2px solid transparent; margin-bottom:-1px; transition:all .15s; }
  .ap-mod-tab.on { color:#00f3ff; border-bottom-color:#00f3ff; }
  .ap-mod-body { padding:20px 26px; overflow-y:auto; flex:1; }
  .ap-mod-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .ap-mod-field { display:flex; flex-direction:column; }
  .ap-mod-field.full { grid-column:1/-1; }
  .ap-mod-l { font-size:10px; color:rgba(255,255,255,.3); margin-bottom:5px; }
  .ap-mod-v { width:100%; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); border-radius:8px; padding:9px 12px; color:#fff; font-size:13px; font-family:'Plus Jakarta Sans',sans-serif; outline:none; transition:border-color .16s; }
  .ap-mod-v:focus { border-color:rgba(0,243,255,.3); }
  .ap-mod-v::placeholder { color:rgba(255,255,255,.16); }
  select.ap-mod-v option { background:#0e1319; }

  /* Demo field con botón de preview */
  .ap-demo-row { display:flex; gap:8px; }
  .ap-demo-input { flex:1; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); border-radius:8px; padding:9px 12px; color:#fff; font-size:13px; font-family:'Plus Jakarta Sans',sans-serif; outline:none; transition:border-color .16s; }
  .ap-demo-input:focus { border-color:rgba(0,243,255,.3); }
  .ap-demo-input::placeholder { color:rgba(255,255,255,.16); }
  .ap-demo-btn { padding:9px 14px; border-radius:8px; background:rgba(0,243,255,.07); border:1px solid rgba(0,243,255,.2); color:#00f3ff; font-size:12px; font-weight:700; cursor:pointer; white-space:nowrap; font-family:'Plus Jakarta Sans',sans-serif; text-decoration:none; display:inline-flex; align-items:center; transition:background .16s; }
  .ap-demo-btn:hover { background:rgba(0,243,255,.14); }
  .ap-demo-btn.disabled { opacity:.3; cursor:not-allowed; pointer-events:none; }

  /* Comisión estimada */
  .ap-com-preview { background:rgba(16,185,129,.06); border:1px solid rgba(16,185,129,.15); border-radius:8px; padding:10px 14px; display:flex; align-items:center; justify-content:space-between; }
  .ap-com-preview-l { font-size:11px; color:rgba(255,255,255,.35); }
  .ap-com-preview-v { font-family:'Syne',sans-serif; font-size:18px; font-weight:800; color:#10b981; }
  .ap-com-preview-s { font-size:10px; color:rgba(16,185,129,.45); margin-top:2px; }

  .ap-imgs-list { display:flex; flex-direction:column; gap:6px; margin-bottom:8px; }
  .ap-img-row { display:flex; align-items:center; gap:8px; background:rgba(255,255,255,.02); border:1px solid rgba(255,255,255,.06); border-radius:8px; padding:7px 10px; }
  .ap-img-thumb { width:40px; height:28px; border-radius:4px; object-fit:cover; flex-shrink:0; background:rgba(255,255,255,.05); }
  .ap-img-url { font-size:11px; color:rgba(255,255,255,.4); flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .ap-img-principal-btn { font-size:9px; font-weight:700; padding:3px 8px; border-radius:20px; cursor:pointer; border:1px solid; transition:all .15s; white-space:nowrap; font-family:'Plus Jakarta Sans',sans-serif; background:transparent; }
  .ap-img-principal-btn.on  { background:rgba(0,243,255,.1); border-color:rgba(0,243,255,.4); color:#00f3ff; }
  .ap-img-principal-btn.off { border-color:rgba(255,255,255,.1); color:rgba(255,255,255,.3); }
  .ap-img-del { background:none; border:none; color:rgba(239,68,68,.4); cursor:pointer; font-size:13px; padding:2px 4px; transition:color .15s; flex-shrink:0; }
  .ap-img-del:hover { color:#ef4444; }
  .ap-img-add-row { display:flex; gap:8px; }
  .ap-img-add-input { flex:1; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); border-radius:8px; padding:8px 12px; color:#fff; font-size:12px; font-family:'Plus Jakarta Sans',sans-serif; outline:none; }
  .ap-img-add-input:focus { border-color:rgba(0,243,255,.3); }
  .ap-img-add-input::placeholder { color:rgba(255,255,255,.2); }
  .ap-img-add-btn { padding:8px 14px; border-radius:8px; background:rgba(0,243,255,.07); border:1px solid rgba(0,243,255,.2); color:#00f3ff; font-size:12px; font-weight:700; cursor:pointer; white-space:nowrap; font-family:'Plus Jakarta Sans',sans-serif; }
  .ap-img-add-btn:hover { background:rgba(0,243,255,.14); }

  .ap-func-list { display:flex; flex-direction:column; gap:5px; margin-bottom:8px; }
  .ap-func-item { display:flex; align-items:center; gap:8px; background:rgba(255,255,255,.02); border:1px solid rgba(255,255,255,.06); border-radius:7px; padding:7px 10px; }
  .ap-func-check { font-size:11px; color:#00f3ff; flex-shrink:0; }
  .ap-func-txt { font-size:12px; color:rgba(255,255,255,.65); flex:1; }
  .ap-func-del { background:none; border:none; color:rgba(239,68,68,.35); cursor:pointer; font-size:12px; padding:2px 4px; transition:color .15s; }
  .ap-func-del:hover { color:#ef4444; }
  .ap-func-add-row { display:flex; gap:8px; }
  .ap-func-input { flex:1; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); border-radius:8px; padding:8px 12px; color:#fff; font-size:12px; font-family:'Plus Jakarta Sans',sans-serif; outline:none; }
  .ap-func-input:focus { border-color:rgba(0,243,255,.3); }
  .ap-func-input::placeholder { color:rgba(255,255,255,.2); }
  .ap-func-add-btn { padding:8px 14px; border-radius:8px; background:rgba(0,243,255,.07); border:1px solid rgba(0,243,255,.2); color:#00f3ff; font-size:12px; font-weight:700; cursor:pointer; white-space:nowrap; font-family:'Plus Jakarta Sans',sans-serif; }
  .ap-func-add-btn:hover { background:rgba(0,243,255,.14); }

  .ap-mis-list { display:flex; flex-direction:column; gap:8px; margin-bottom:14px; }
  .ap-mis-card { background:rgba(255,255,255,.02); border:1px solid rgba(255,255,255,.06); border-radius:9px; padding:11px 13px; display:flex; align-items:flex-start; gap:10px; }
  .ap-mis-pago { flex-shrink:0; background:rgba(16,185,129,.07); border:1px solid rgba(16,185,129,.12); border-radius:7px; padding:6px 10px; text-align:center; min-width:52px; }
  .ap-mis-pago-v { font-family:'Syne',sans-serif; font-size:13px; font-weight:800; color:#10b981; line-height:1; }
  .ap-mis-pago-l { font-size:7px; color:rgba(16,185,129,.4); text-transform:uppercase; }
  .ap-mis-tit  { font-size:12.5px; font-weight:600; color:#fff; margin-bottom:2px; }
  .ap-mis-desc { font-size:11px; color:rgba(255,255,255,.35); line-height:1.5; }
  .ap-mis-del  { margin-left:auto; flex-shrink:0; background:none; border:none; color:rgba(239,68,68,.35); cursor:pointer; font-size:14px; padding:2px 5px; transition:color .15s; }
  .ap-mis-del:hover { color:#ef4444; }
  .ap-mis-nueva { background:rgba(0,243,255,.03); border:1px dashed rgba(0,243,255,.18); border-radius:9px; padding:14px; }
  .ap-mis-nueva-t { font-size:10px; font-weight:700; color:rgba(0,243,255,.4); margin-bottom:10px; text-transform:uppercase; letter-spacing:1.2px; }
  .ap-mis-nueva-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:8px; }
  .ap-mis-nueva-full { grid-column:1/-1; }
  .ap-mis-nueva-add { width:100%; padding:8px; border-radius:7px; background:rgba(0,243,255,.07); border:1px solid rgba(0,243,255,.18); color:#00f3ff; font-size:12px; font-weight:700; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all .15s; }
  .ap-mis-nueva-add:hover { background:rgba(0,243,255,.14); }
  .ap-mis-empty { text-align:center; padding:20px; color:rgba(255,255,255,.18); font-size:12px; }

  .ap-mod-footer { padding:14px 26px; border-top:1px solid rgba(255,255,255,.06); display:flex; gap:8px; flex-shrink:0; }
  .ap-mod-btn { flex:1; padding:10px; border-radius:8px; font-size:13px; font-weight:700; cursor:pointer; border:none; font-family:'Plus Jakarta Sans',sans-serif; transition:all .15s; }
  .ap-mod-btn.ghost { background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.09); color:rgba(255,255,255,.4); }
  .ap-mod-btn.cyan  { background:#00f3ff; color:#000; }
  .ap-mod-btn.cyan:hover { background:#7fffff; }
  .ap-mod-btn:disabled { opacity:.4; cursor:not-allowed; }
`

const EMPTY_PROYECTO = {
  nombre:"", categoria:"Restaurantes", precioMin:"", precioMax:"",
  comision:20, estado:"disponible", descripcion:"", publicoObjetivo:"",
  funcionalidades:[], imagenes:[], imgPrincipal:"", misiones:[], demo:""
}
const EMPTY_MISION = { titulo:"", desc:"", pago:"" }

function calcComision(precioMin, precioMax, comision) {
  const min = Number(precioMin) || 0
  const max = Number(precioMax) || 0
  const pct = Number(comision)  || 0
  if (!min && !max) return 0
  return Math.round((min + max) / 2 * pct / 100)
}

export default function AdminProyectos() {
  const [proyectos, setProyectos] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [saving,    setSaving]    = useState(false)
  const [error,     setError]     = useState(null)
  const [buscar,    setBuscar]    = useState("")
  const [modal,     setModal]     = useState(null)
  const [tabModal,  setTabModal]  = useState("info")
  const [form,      setForm]      = useState(EMPTY_PROYECTO)
  const [nuevaMis,  setNuevaMis]  = useState(EMPTY_MISION)
  const [nuevaImg,  setNuevaImg]  = useState("")
  const [nuevaFunc, setNuevaFunc] = useState("")

  useEffect(() => { cargarProyectos() }, [])

  const cargarProyectos = async () => {
    try {
      setLoading(true); setError(null)
      const snap = await getDocs(collection(db, "proyectos"))
      setProyectos(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch (e) {
      setError("Error al cargar proyectos: " + e.message)
    } finally {
      setLoading(false)
    }
  }

  const filtrados = proyectos.filter(p =>
    p.nombre?.toLowerCase().includes(buscar.toLowerCase())
  )

  const abrirNuevo = () => {
    setForm({ ...EMPTY_PROYECTO, misiones:[], imagenes:[], funcionalidades:[] })
    setTabModal("info"); setNuevaImg(""); setNuevaFunc("")
    setModal("nuevo")
  }
  const abrirEditar = (p) => {
    setForm({
      ...EMPTY_PROYECTO, ...p,
      demo: p.demo || "",
      misiones: p.misiones || [],
      imagenes: p.imagenes || (p.img ? [p.img] : []),
      imgPrincipal: p.imgPrincipal || p.img || "",
      funcionalidades: Array.isArray(p.funcionalidades)
        ? p.funcionalidades
        : (p.funcionalidades ? p.funcionalidades.split(",").map(f=>f.trim()).filter(Boolean) : [])
    })
    setTabModal("info"); setNuevaImg(""); setNuevaFunc("")
    setModal(p)
  }

  const agregarImg = () => {
    if (!nuevaImg.trim()) return
    setForm(f => ({
      ...f,
      imagenes: [...f.imagenes, nuevaImg.trim()],
      imgPrincipal: f.imgPrincipal || nuevaImg.trim()
    }))
    setNuevaImg("")
  }
  const eliminarImg = (url) => setForm(f => ({
    ...f,
    imagenes: f.imagenes.filter(i => i !== url),
    imgPrincipal: f.imgPrincipal === url ? (f.imagenes.filter(i=>i!==url)[0] || "") : f.imgPrincipal
  }))
  const setPrincipal = (url) => setForm(f => ({ ...f, imgPrincipal: url }))

  const agregarFunc = () => {
    if (!nuevaFunc.trim()) return
    setForm(f => ({ ...f, funcionalidades: [...f.funcionalidades, nuevaFunc.trim()] }))
    setNuevaFunc("")
  }
  const eliminarFunc = (i) => setForm(f => ({ ...f, funcionalidades: f.funcionalidades.filter((_,idx)=>idx!==i) }))

  const guardar = async () => {
    if (!form.nombre.trim()) return
    try {
      setSaving(true)
      const datos = {
        nombre: form.nombre, categoria: form.categoria,
        precioMin: Number(form.precioMin)||0, precioMax: Number(form.precioMax)||0,
        comision: Number(form.comision)||0, estado: form.estado,
        descripcion: form.descripcion, publicoObjetivo: form.publicoObjetivo,
        funcionalidades: form.funcionalidades,
        imagenes: form.imagenes,
        imgPrincipal: form.imgPrincipal || form.imagenes[0] || "",
        img: form.imgPrincipal || form.imagenes[0] || "",
        demo: form.demo || "",
        misiones: form.misiones || [], cola: form.cola || 0,
      }
      if (modal === "nuevo") {
        const ref = await addDoc(collection(db, "proyectos"), datos)
        setProyectos(ps => [...ps, { id: ref.id, ...datos }])
      } else {
        await updateDoc(doc(db, "proyectos", modal.id), datos)
        setProyectos(ps => ps.map(p => p.id === modal.id ? { id: modal.id, ...datos } : p))
      }
      setModal(null)
    } catch (e) {
      alert("Error al guardar: " + e.message)
    } finally {
      setSaving(false)
    }
  }

  const eliminarProyecto = async (id) => {
    if (!confirm("¿Eliminar este proyecto?")) return
    try {
      await deleteDoc(doc(db, "proyectos", id))
      setProyectos(ps => ps.filter(p => p.id !== id))
    } catch (e) {
      alert("Error: " + e.message)
    }
  }

  const agregarMision = () => {
    if (!nuevaMis.titulo || !nuevaMis.pago) return
    const mis = { id:`m${Date.now()}`, ...nuevaMis, pago:+nuevaMis.pago }
    setForm(f => ({ ...f, misiones:[...(f.misiones||[]), mis] }))
    setNuevaMis(EMPTY_MISION)
  }
  const eliminarMision = (mid) =>
    setForm(f => ({ ...f, misiones: f.misiones.filter(m => m.id !== mid) }))

  const chipCls = { disponible:"disp", cola:"cola", pausado:"pausado" }
  const chipLbl = { disponible:"Disponible", cola:"En cola", pausado:"Pausado" }
  const comisionEstimada = calcComision(form.precioMin, form.precioMax, form.comision)

  return (
    <div className="ap">
      <style>{CSS}</style>
      <div className="ap-ttl">Proyectos</div>
      <div className="ap-sub">Las misiones se gestionan dentro de cada proyecto</div>

      <div className="ap-toolbar">
        <input className="ap-search" placeholder="Buscar proyecto..." value={buscar} onChange={e=>setBuscar(e.target.value)} />
        <button className="ap-btn-new" onClick={abrirNuevo}>+ Nuevo proyecto</button>
      </div>

      {loading && <div className="ap-loading">Cargando proyectos...</div>}
      {error   && <div className="ap-error">{error}</div>}

      {!loading && !error && (
        <div className="ap-tabla">
          <div className="ap-hdr">
            <span>Proyecto</span>
            <span>Precio</span>
            <span>Comisión %</span>
            <span>Comisión estimada</span>
            <span>Estado</span>
            <span>Misiones</span>
            <span>Acciones</span>
          </div>
          {filtrados.length === 0 && (
            <div style={{ padding:"32px", textAlign:"center", color:"rgba(255,255,255,.2)", fontSize:"13px" }}>
              No hay proyectos todavía
            </div>
          )}
          {filtrados.map(p => {
            const comEst = calcComision(p.precioMin, p.precioMax, p.comision)
            const tieneDemo = p.demo && p.demo !== "#" && p.demo.startsWith("http")
            return (
              <div key={p.id} className="ap-row">
                <div>
                  <div className="ap-nom">{p.nombre}</div>
                  <div className="ap-cat">{p.categoria}</div>
                </div>
                <div className="ap-precio">
                  S/.{Number(p.precioMin).toLocaleString()} – S/.{Number(p.precioMax).toLocaleString()}
                </div>
                <div className="ap-com">{p.comision}%</div>
                <div>
                  <div className="ap-com">~S/.{comEst.toLocaleString()}</div>
                  <div className="ap-com-est">promedio del rango</div>
                </div>
                <div><span className={`ap-chip ${chipCls[p.estado]||"disp"}`}>{chipLbl[p.estado]||p.estado}</span></div>
                <div>
                  <span className="ap-mis-badge" onClick={()=>{ abrirEditar(p); setTabModal("misiones") }}>
                    ◉ {p.misiones?.length||0} misiones
                  </span>
                </div>
                <div className="ap-acciones">
                  <button className="ap-accion ghost" onClick={()=>abrirEditar(p)}>Editar</button>
                  {tieneDemo ? (
                    <a className="ap-accion cyan" href={p.demo} target="_blank" rel="noopener noreferrer">
                      Demo
                    </a>
                  ) : (
                    <span className="ap-accion ghost disabled" title="Sin demo">Demo</span>
                  )}
                  <button className="ap-accion red" onClick={()=>eliminarProyecto(p.id)}>✕</button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {modal !== null && (
        <div className="ap-ovl" onClick={()=>setModal(null)}>
          <div className="ap-mod" onClick={e=>e.stopPropagation()}>
            <div className="ap-mod-hdr">
              <div className="ap-mod-t">{modal==="nuevo" ? "Nuevo proyecto" : form.nombre}</div>
              <div className="ap-mod-tabs">
                <button className={`ap-mod-tab ${tabModal==="info"?"on":""}`} onClick={()=>setTabModal("info")}>Información</button>
                <button className={`ap-mod-tab ${tabModal==="misiones"?"on":""}`} onClick={()=>setTabModal("misiones")}>
                  Misiones ({form.misiones?.length||0})
                </button>
              </div>
            </div>

            <div className="ap-mod-body">
              {tabModal==="info" && (
                <div className="ap-mod-grid">
                  <div className="ap-mod-field full">
                    <div className="ap-mod-l">Nombre del proyecto</div>
                    <input className="ap-mod-v" value={form.nombre} onChange={e=>setForm(f=>({...f,nombre:e.target.value}))} placeholder="Ej: Restaurante Italiano" />
                  </div>
                  <div className="ap-mod-field">
                    <div className="ap-mod-l">Categoría</div>
                    <select className="ap-mod-v" value={form.categoria} onChange={e=>setForm(f=>({...f,categoria:e.target.value}))} style={{cursor:"pointer",appearance:"none"}}>
                      {CATEGORIAS.map(c=><option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="ap-mod-field">
                    <div className="ap-mod-l">Estado</div>
                    <select className="ap-mod-v" value={form.estado} onChange={e=>setForm(f=>({...f,estado:e.target.value}))} style={{cursor:"pointer",appearance:"none"}}>
                      <option value="disponible">Disponible</option>
                      <option value="pausado">Pausado</option>
                    </select>
                  </div>
                  <div className="ap-mod-field">
                    <div className="ap-mod-l">Precio mínimo (S/.)</div>
                    <input className="ap-mod-v" type="number" value={form.precioMin} onChange={e=>setForm(f=>({...f,precioMin:e.target.value}))} placeholder="1500" />
                  </div>
                  <div className="ap-mod-field">
                    <div className="ap-mod-l">Precio máximo (S/.)</div>
                    <input className="ap-mod-v" type="number" value={form.precioMax} onChange={e=>setForm(f=>({...f,precioMax:e.target.value}))} placeholder="2000" />
                  </div>
                  <div className="ap-mod-field">
                    <div className="ap-mod-l">Comisión (%)</div>
                    <input className="ap-mod-v" type="number" value={form.comision} onChange={e=>setForm(f=>({...f,comision:e.target.value}))} placeholder="20" />
                  </div>

                  {/* Comisión estimada en tiempo real */}
                  <div className="ap-mod-field">
                    <div className="ap-mod-l">Comisión estimada del vendedor</div>
                    <div className="ap-com-preview">
                      <div>
                        <div className="ap-com-preview-l">Promedio del rango × comisión</div>
                        <div className="ap-com-preview-s">(S/.{Number(form.precioMin)||0} + S/.{Number(form.precioMax)||0}) / 2 × {form.comision}%</div>
                      </div>
                      <div className="ap-com-preview-v">
                        {comisionEstimada > 0 ? `~S/.${comisionEstimada.toLocaleString()}` : "—"}
                      </div>
                    </div>
                  </div>

                  {/* URL del demo */}
                  <div className="ap-mod-field full">
                    <div className="ap-mod-l">URL del demo</div>
                    <div className="ap-demo-row">
                      <input
                        className="ap-demo-input"
                        value={form.demo}
                        onChange={e=>setForm(f=>({...f,demo:e.target.value}))}
                        placeholder="https://demo.ejemplo.com"
                      />
                      <a
                        className={`ap-demo-btn ${form.demo && form.demo.startsWith("http") ? "" : "disabled"}`}
                        href={form.demo || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ver demo
                      </a>
                    </div>
                  </div>

                  <div className="ap-mod-field full">
                    <div className="ap-mod-l">Descripción</div>
                    <textarea className="ap-mod-v" rows={3} value={form.descripcion} onChange={e=>setForm(f=>({...f,descripcion:e.target.value}))} placeholder="Describe el proyecto..." style={{resize:"vertical"}} />
                  </div>
                  <div className="ap-mod-field full">
                    <div className="ap-mod-l">Público objetivo</div>
                    <input className="ap-mod-v" value={form.publicoObjetivo} onChange={e=>setForm(f=>({...f,publicoObjetivo:e.target.value}))} placeholder="¿A quién va dirigido?" />
                  </div>

                  <div className="ap-mod-field full">
                    <div className="ap-mod-l">Funcionalidades</div>
                    {form.funcionalidades.length > 0 && (
                      <div className="ap-func-list">
                        {form.funcionalidades.map((f, i) => (
                          <div key={i} className="ap-func-item">
                            <span className="ap-func-check">✓</span>
                            <span className="ap-func-txt">{f}</span>
                            <button className="ap-func-del" onClick={()=>eliminarFunc(i)}>✕</button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="ap-func-add-row">
                      <input className="ap-func-input" value={nuevaFunc} onChange={e=>setNuevaFunc(e.target.value)} onKeyDown={e=>e.key==="Enter"&&agregarFunc()} placeholder="Ej: Sistema de reservas" />
                      <button className="ap-func-add-btn" onClick={agregarFunc}>+ Agregar</button>
                    </div>
                  </div>

                  <div className="ap-mod-field full">
                    <div className="ap-mod-l">Imágenes del proyecto</div>
                    {form.imagenes.length > 0 && (
                      <div className="ap-imgs-list">
                        {form.imagenes.map((url, i) => (
                          <div key={i} className="ap-img-row">
                            <img src={url} className="ap-img-thumb" onError={e=>e.target.style.opacity=".2"} />
                            <span className="ap-img-url">{url}</span>
                            <button className={`ap-img-principal-btn ${form.imgPrincipal===url?"on":"off"}`} onClick={()=>setPrincipal(url)}>
                              {form.imgPrincipal===url ? "✓ Principal" : "Principal"}
                            </button>
                            <button className="ap-img-del" onClick={()=>eliminarImg(url)}>✕</button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="ap-img-add-row">
                      <input className="ap-img-add-input" value={nuevaImg} onChange={e=>setNuevaImg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&agregarImg()} placeholder="https://imagen.com/foto.jpg" />
                      <button className="ap-img-add-btn" onClick={agregarImg}>+ Agregar</button>
                    </div>
                  </div>
                </div>
              )}

              {tabModal==="misiones" && (
                <div>
                  <div className="ap-mis-list">
                    {(!form.misiones||form.misiones.length===0) && (
                      <div className="ap-mis-empty">Este proyecto no tiene misiones todavía</div>
                    )}
                    {form.misiones?.map(m=>(
                      <div key={m.id} className="ap-mis-card">
                        <div className="ap-mis-pago">
                          <div className="ap-mis-pago-v">S/.{m.pago}</div>
                          <div className="ap-mis-pago-l">pago</div>
                        </div>
                        <div style={{flex:1,minWidth:0}}>
                          <div className="ap-mis-tit">{m.titulo}</div>
                          <div className="ap-mis-desc">{m.desc}</div>
                        </div>
                        <button className="ap-mis-del" onClick={()=>eliminarMision(m.id)}>✕</button>
                      </div>
                    ))}
                  </div>
                  <div className="ap-mis-nueva">
                    <div className="ap-mis-nueva-t">Agregar misión</div>
                    <div className="ap-mis-nueva-grid">
                      <div className="ap-mis-nueva-full">
                        <div className="ap-mod-l">Título</div>
                        <input className="ap-mod-v" value={nuevaMis.titulo} onChange={e=>setNuevaMis(m=>({...m,titulo:e.target.value}))} placeholder="Ej: Publicar en Facebook" />
                      </div>
                      <div className="ap-mis-nueva-full">
                        <div className="ap-mod-l">Descripción</div>
                        <textarea className="ap-mod-v" rows={2} value={nuevaMis.desc} onChange={e=>setNuevaMis(m=>({...m,desc:e.target.value}))} placeholder="Qué debe hacer el vendedor..." style={{resize:"none"}} />
                      </div>
                      <div>
                        <div className="ap-mod-l">Pago (S/.)</div>
                        <input className="ap-mod-v" type="number" value={nuevaMis.pago} onChange={e=>setNuevaMis(m=>({...m,pago:e.target.value}))} placeholder="40" />
                      </div>
                      <div style={{display:"flex",alignItems:"flex-end"}}>
                        <button className="ap-mis-nueva-add" onClick={agregarMision}>+ Agregar</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="ap-mod-footer">
              <button className="ap-mod-btn ghost" onClick={()=>setModal(null)}>Cancelar</button>
              <button className="ap-mod-btn cyan" onClick={guardar} disabled={saving||!form.nombre.trim()}>
                {saving ? "Guardando..." : modal==="nuevo" ? "Crear proyecto" : "Guardar cambios"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}