import { useState, useEffect, useRef } from "react"
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc
} from "firebase/firestore"
import { db } from "../../../firebase/config"
import { HexColorPicker } from "react-colorful"

const CATEGORIAS_PORT = [
  "Gastronomia","Ecommerce","Inmobiliaria","Salud","Deportes",
  "Educación","Tecnología","Moda y belleza","Corporativas","Otros"
]

const STACK_OPCIONES = ["HTML/CSS","JavaScript","React","Firebase","Vercel","Stripe","Node.js","LocalStorage"]

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');
  .apo { padding:26px 30px 60px; }
  .apo-ttl { font-family:'Syne',sans-serif; font-size:20px; font-weight:800; color:#fff; margin-bottom:3px; }
  .apo-sub  { font-size:12px; color:rgba(255,255,255,.28); margin-bottom:22px; }
  .apo-toolbar { display:flex; gap:10px; align-items:center; margin-bottom:16px; flex-wrap:wrap; }
  .apo-search { flex:1; min-width:200px; background:#0c0f14; border:1px solid rgba(255,255,255,.08); border-radius:9px; padding:8px 14px; color:#fff; font-size:13px; font-family:'Plus Jakarta Sans',sans-serif; outline:none; }
  .apo-search:focus { border-color:rgba(0,243,255,.3); }
  .apo-search::placeholder { color:rgba(255,255,255,.2); }
  .apo-btn-new { padding:8px 16px; border-radius:9px; background:#00f3ff; color:#000; font-size:12px; font-weight:700; border:none; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; white-space:nowrap; }
  .apo-btn-new:hover { background:#7fffff; }
  .apo-loading { text-align:center; padding:48px; color:rgba(255,255,255,.25); font-size:13px; }
  .apo-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
  .apo-card { background:#0c0f14; border:1px solid rgba(255,255,255,.06); border-radius:11px; overflow:hidden; }
  .apo-card-img { width:100%; aspect-ratio:16/9; object-fit:cover; filter:brightness(.7); display:block; }
  .apo-card-img-placeholder { width:100%; aspect-ratio:16/9; background:rgba(255,255,255,.03); display:flex; align-items:center; justify-content:center; color:rgba(255,255,255,.15); font-size:13px; }
  .apo-card-body { padding:14px 16px; }
  .apo-card-cat { font-size:8px; letter-spacing:2px; text-transform:uppercase; color:rgba(0,243,255,.5); margin-bottom:5px; }
  .apo-card-nom { font-family:'Syne',sans-serif; font-size:14px; font-weight:800; color:#fff; margin-bottom:4px; }
  .apo-card-tipo { font-size:11px; color:rgba(255,255,255,.35); margin-bottom:10px; }
  .apo-card-stack { display:flex; flex-wrap:wrap; gap:4px; margin-bottom:12px; }
  .apo-stack-tag { font-size:9px; padding:2px 7px; border-radius:4px; background:rgba(255,255,255,.06); color:rgba(255,255,255,.4); border:1px solid rgba(255,255,255,.08); }
  .apo-card-btns { display:flex; gap:6px; }
  .apo-btn { padding:5px 12px; border-radius:6px; font-size:11px; font-weight:600; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all .15s; border:none; }
  .apo-btn.ghost { background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.09); color:rgba(255,255,255,.4); }
  .apo-btn.ghost:hover { color:#fff; border-color:rgba(255,255,255,.2); }
  .apo-btn.red { background:rgba(239,68,68,.08); border:1px solid rgba(239,68,68,.18); color:#ef4444; }
  .apo-btn.red:hover { background:rgba(239,68,68,.15); }

  /* Modal */
  .apo-ovl { position:fixed; inset:0; z-index:9000; background:rgba(0,0,0,.82); display:flex; align-items:center; justify-content:center; backdrop-filter:blur(6px); }
  .apo-mod { background:#0e1319; border:1px solid rgba(0,243,255,.12); border-radius:15px; max-width:600px; width:94%; max-height:92vh; overflow-y:auto; display:flex; flex-direction:column; }
  .apo-mod-hdr { padding:22px 26px 18px; border-bottom:1px solid rgba(255,255,255,.06); flex-shrink:0; position:sticky; top:0; background:#0e1319; z-index:2; }
  .apo-mod-t { font-family:'Syne',sans-serif; font-size:17px; font-weight:800; color:#fff; }
  .apo-mod-body { padding:20px 26px; flex:1; }
  .apo-mod-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .apo-mod-field { display:flex; flex-direction:column; }
  .apo-mod-field.full { grid-column:1/-1; }
  .apo-mod-l { font-size:10px; color:rgba(255,255,255,.3); margin-bottom:5px; }
  .apo-mod-v { width:100%; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); border-radius:8px; padding:9px 12px; color:#fff; font-size:13px; font-family:'Plus Jakarta Sans',sans-serif; outline:none; transition:border-color .16s; }
  .apo-mod-v:focus { border-color:rgba(0,243,255,.3); }
  .apo-mod-v::placeholder { color:rgba(255,255,255,.16); }
  select.apo-mod-v option { background:#0e1319; }

  /* Color picker */
  .apo-color-wrap { position:relative; }
  .apo-color-preview {
    display:flex; align-items:center; gap:10px; cursor:pointer;
    background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08);
    border-radius:8px; padding:8px 12px; transition:border-color .16s;
  }
  .apo-color-preview:hover { border-color:rgba(0,243,255,.3); }
  .apo-color-swatch { width:24px; height:24px; border-radius:6px; border:1px solid rgba(255,255,255,.15); flex-shrink:0; }
  .apo-color-hex { font-size:13px; color:#fff; font-family:'Plus Jakarta Sans',sans-serif; }
  .apo-color-popover {
    position:absolute; top:calc(100% + 8px); left:0; z-index:100;
    background:#0e1319; border:1px solid rgba(255,255,255,.12);
    border-radius:12px; padding:14px; box-shadow:0 8px 32px rgba(0,0,0,.5);
  }
  .apo-color-popover .react-colorful { width:200px; height:160px; }
  .apo-color-popover .react-colorful__saturation { border-radius:8px 8px 0 0; }
  .apo-color-popover .react-colorful__hue { border-radius:0 0 8px 8px; height:14px; }

  /* Imágenes */
  .apo-imgs-list { display:flex; flex-direction:column; gap:6px; margin-bottom:8px; }
  .apo-img-row {
    display:flex; align-items:center; gap:8px;
    background:rgba(255,255,255,.02); border:1px solid rgba(255,255,255,.06);
    border-radius:8px; padding:7px 10px;
  }
  .apo-img-thumb { width:40px; height:28px; border-radius:4px; object-fit:cover; flex-shrink:0; background:rgba(255,255,255,.05); }
  .apo-img-url { font-size:11px; color:rgba(255,255,255,.4); flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .apo-img-principal-btn {
    font-size:9px; font-weight:700; padding:3px 8px; border-radius:20px; cursor:pointer;
    border:1px solid; transition:all .15s; white-space:nowrap; font-family:'Plus Jakarta Sans',sans-serif;
    background:transparent;
  }
  .apo-img-principal-btn.on { background:rgba(0,243,255,.1); border-color:rgba(0,243,255,.4); color:#00f3ff; }
  .apo-img-principal-btn.off { border-color:rgba(255,255,255,.1); color:rgba(255,255,255,.3); }
  .apo-img-del { background:none; border:none; color:rgba(239,68,68,.4); cursor:pointer; font-size:13px; padding:2px 4px; transition:color .15s; flex-shrink:0; }
  .apo-img-del:hover { color:#ef4444; }
  .apo-img-add-row { display:flex; gap:8px; }
  .apo-img-add-input { flex:1; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); border-radius:8px; padding:8px 12px; color:#fff; font-size:12px; font-family:'Plus Jakarta Sans',sans-serif; outline:none; }
  .apo-img-add-input:focus { border-color:rgba(0,243,255,.3); }
  .apo-img-add-input::placeholder { color:rgba(255,255,255,.2); }
  .apo-img-add-btn { padding:8px 14px; border-radius:8px; background:rgba(0,243,255,.07); border:1px solid rgba(0,243,255,.2); color:#00f3ff; font-size:12px; font-weight:700; cursor:pointer; white-space:nowrap; font-family:'Plus Jakarta Sans',sans-serif; }
  .apo-img-add-btn:hover { background:rgba(0,243,255,.14); }

  /* Funcionalidades */
  .apo-func-list { display:flex; flex-direction:column; gap:5px; margin-bottom:8px; }
  .apo-func-item {
    display:flex; align-items:center; gap:8px;
    background:rgba(255,255,255,.02); border:1px solid rgba(255,255,255,.06);
    border-radius:7px; padding:7px 10px;
  }
  .apo-func-check { font-size:11px; color:#00f3ff; flex-shrink:0; }
  .apo-func-txt { font-size:12px; color:rgba(255,255,255,.65); flex:1; }
  .apo-func-del { background:none; border:none; color:rgba(239,68,68,.35); cursor:pointer; font-size:12px; padding:2px 4px; transition:color .15s; }
  .apo-func-del:hover { color:#ef4444; }
  .apo-func-add-row { display:flex; gap:8px; }
  .apo-func-input { flex:1; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); border-radius:8px; padding:8px 12px; color:#fff; font-size:12px; font-family:'Plus Jakarta Sans',sans-serif; outline:none; }
  .apo-func-input:focus { border-color:rgba(0,243,255,.3); }
  .apo-func-input::placeholder { color:rgba(255,255,255,.2); }
  .apo-func-add-btn { padding:8px 14px; border-radius:8px; background:rgba(0,243,255,.07); border:1px solid rgba(0,243,255,.2); color:#00f3ff; font-size:12px; font-weight:700; cursor:pointer; white-space:nowrap; font-family:'Plus Jakarta Sans',sans-serif; }
  .apo-func-add-btn:hover { background:rgba(0,243,255,.14); }

  /* Stack */
  .apo-stack-sel { display:flex; flex-wrap:wrap; gap:6px; margin-top:4px; }
  .apo-stack-opt { padding:5px 12px; border-radius:20px; font-size:11px; font-weight:600; cursor:pointer; border:1px solid rgba(255,255,255,.09); background:transparent; color:rgba(255,255,255,.35); transition:all .15s; font-family:'Plus Jakarta Sans',sans-serif; }
  .apo-stack-opt.on { border-color:rgba(0,243,255,.4); color:#00f3ff; background:rgba(0,243,255,.07); }

  .apo-mod-footer { padding:14px 26px; border-top:1px solid rgba(255,255,255,.06); display:flex; gap:8px; flex-shrink:0; position:sticky; bottom:0; background:#0e1319; z-index:2; }
  .apo-mod-btn { flex:1; padding:10px; border-radius:8px; font-size:13px; font-weight:700; cursor:pointer; border:none; font-family:'Plus Jakarta Sans',sans-serif; transition:all .15s; }
  .apo-mod-btn.ghost { background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.09); color:rgba(255,255,255,.4); }
  .apo-mod-btn.cyan  { background:#00f3ff; color:#000; }
  .apo-mod-btn.cyan:hover { background:#7fffff; }
  .apo-mod-btn:disabled { opacity:.4; cursor:not-allowed; }

  @media (max-width:860px) { .apo-grid { grid-template-columns:repeat(2,1fr); } }
  @media (max-width:560px) { .apo-grid { grid-template-columns:1fr; } }
`

const EMPTY = {
  nombre:"", categoria:"Gastronomia", tipo:"", desc:"",
  imagenes:[], imgPrincipal:"", demo:"",
  año: new Date().getFullYear().toString(),
  color:"#00f3ff", stack:[], funcionalidades:[], publicoObjetivo:"", estado:"disponible"
}

// ── Color Picker con click-outside ──────────────
function ColorPicker({ color, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <div className="apo-color-wrap" ref={ref}>
      <div className="apo-color-preview" onClick={() => setOpen(o => !o)}>
        <div className="apo-color-swatch" style={{ background: color }} />
        <span className="apo-color-hex">{color}</span>
      </div>
      {open && (
        <div className="apo-color-popover">
          <HexColorPicker color={color} onChange={onChange} />
        </div>
      )}
    </div>
  )
}

export default function AdminPortafolio() {
  const [proyectos,  setProyectos]  = useState([])
  const [loading,    setLoading]    = useState(true)
  const [saving,     setSaving]     = useState(false)
  const [buscar,     setBuscar]     = useState("")
  const [modal,      setModal]      = useState(null)
  const [form,       setForm]       = useState(EMPTY)
  const [nuevaImg,   setNuevaImg]   = useState("")
  const [nuevaFunc,  setNuevaFunc]  = useState("")

  useEffect(() => {
    const cargar = async () => {
      try {
        const snap = await getDocs(collection(db, "portafolio"))
        setProyectos(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [])

  const filtrados = proyectos.filter(p =>
    p.nombre?.toLowerCase().includes(buscar.toLowerCase())
  )

  const abrirNuevo  = () => {
    setForm({ ...EMPTY, stack:[], imagenes:[], funcionalidades:[] })
    setNuevaImg(""); setNuevaFunc("")
    setModal("nuevo")
  }
  const abrirEditar = (p) => {
    setForm({
      ...EMPTY, ...p,
      stack:          p.stack          || [],
      imagenes:       p.imagenes       || (p.img ? [p.img] : []),
      imgPrincipal:   p.imgPrincipal   || p.img || "",
      funcionalidades: Array.isArray(p.funcionalidades)
        ? p.funcionalidades
        : (p.funcionalidades ? p.funcionalidades.split(",").map(f=>f.trim()).filter(Boolean) : [])
    })
    setNuevaImg(""); setNuevaFunc("")
    setModal(p)
  }

  // Imágenes
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

  // Funcionalidades
  const agregarFunc = () => {
    if (!nuevaFunc.trim()) return
    setForm(f => ({ ...f, funcionalidades: [...f.funcionalidades, nuevaFunc.trim()] }))
    setNuevaFunc("")
  }
  const eliminarFunc = (i) => setForm(f => ({ ...f, funcionalidades: f.funcionalidades.filter((_,idx)=>idx!==i) }))

  // Stack
  const toggleStack = (tag) =>
    setForm(f => ({
      ...f,
      stack: f.stack.includes(tag) ? f.stack.filter(s=>s!==tag) : [...f.stack, tag]
    }))

  const guardar = async () => {
    if (!form.nombre.trim()) return
    try {
      setSaving(true)
      const datos = {
        nombre:          form.nombre,
        categoria:       form.categoria,
        tipo:            form.tipo,
        desc:            form.desc,
        imagenes:        form.imagenes,
        imgPrincipal:    form.imgPrincipal || form.imagenes[0] || "",
        img:             form.imgPrincipal || form.imagenes[0] || "", // compatibilidad
        demo:            form.demo,
        año:             form.año,
        color:           form.color,
        stack:           form.stack,
        funcionalidades: form.funcionalidades,
        publicoObjetivo: form.publicoObjetivo,
        estado:          form.estado,
      }
      if (modal === "nuevo") {
        const ref = await addDoc(collection(db, "portafolio"), datos)
        setProyectos(ps => [...ps, { id: ref.id, ...datos }])
      } else {
        await updateDoc(doc(db, "portafolio", modal.id), datos)
        setProyectos(ps => ps.map(p => p.id === modal.id ? { id: modal.id, ...datos } : p))
      }
      setModal(null)
    } catch (e) {
      alert("Error: " + e.message)
    } finally {
      setSaving(false)
    }
  }

  const eliminar = async (id) => {
    if (!confirm("¿Eliminar este proyecto del portafolio?")) return
    try {
      await deleteDoc(doc(db, "portafolio", id))
      setProyectos(ps => ps.filter(p => p.id !== id))
    } catch (e) {
      alert("Error: " + e.message)
    }
  }

  return (
    <div className="apo">
      <style>{CSS}</style>
      <div className="apo-ttl">Portafolio público</div>
      <div className="apo-sub">Proyectos visibles en la página de portafolio</div>

      <div className="apo-toolbar">
        <input className="apo-search" placeholder="Buscar proyecto..." value={buscar} onChange={e=>setBuscar(e.target.value)} />
        <button className="apo-btn-new" onClick={abrirNuevo}>+ Agregar proyecto</button>
      </div>

      {loading && <div className="apo-loading">Cargando portafolio...</div>}

      {!loading && (
        <div className="apo-grid">
          {filtrados.length === 0 && (
            <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"48px", color:"rgba(255,255,255,.2)", fontSize:"13px" }}>
              No hay proyectos en el portafolio todavía
            </div>
          )}
          {filtrados.map(p => (
            <div key={p.id} className="apo-card">
              {(p.imgPrincipal || p.img)
                ? <img src={p.imgPrincipal || p.img} alt={p.nombre} className="apo-card-img" />
                : <div className="apo-card-img-placeholder">Sin imagen</div>
              }
              <div className="apo-card-body">
                <div className="apo-card-cat">{p.categoria} · {p.año}</div>
                <div className="apo-card-nom">{p.nombre}</div>
                {p.tipo && <div className="apo-card-tipo">{p.tipo}</div>}
                <div className="apo-card-stack">
                  {p.stack?.map((t,i) => <span key={i} className="apo-stack-tag">{t}</span>)}
                </div>
                <div className="apo-card-btns">
                  <button className="apo-btn ghost" style={{ flex:1 }} onClick={()=>abrirEditar(p)}>Editar</button>
                  <button className="apo-btn red" onClick={()=>eliminar(p.id)}>✕</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal !== null && (
        <div className="apo-ovl" onClick={()=>setModal(null)}>
          <div className="apo-mod" onClick={e=>e.stopPropagation()}>
            <div className="apo-mod-hdr">
              <div className="apo-mod-t">{modal === "nuevo" ? "Agregar al portafolio" : `Editar — ${form.nombre}`}</div>
            </div>

            <div className="apo-mod-body">
              <div className="apo-mod-grid">

                {/* Nombre */}
                <div className="apo-mod-field full">
                  <div className="apo-mod-l">Nombre del proyecto</div>
                  <input className="apo-mod-v" value={form.nombre} onChange={e=>setForm(f=>({...f,nombre:e.target.value}))} placeholder="Ej: Restaurante Borgo" />
                </div>

                {/* Categoría */}
                <div className="apo-mod-field">
                  <div className="apo-mod-l">Categoría</div>
                  <select className="apo-mod-v" value={form.categoria} onChange={e=>setForm(f=>({...f,categoria:e.target.value}))} style={{cursor:"pointer",appearance:"none"}}>
                    {CATEGORIAS_PORT.map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>

                {/* Tipo */}
                <div className="apo-mod-field">
                  <div className="apo-mod-l">Tipo</div>
                  <input className="apo-mod-v" value={form.tipo} onChange={e=>setForm(f=>({...f,tipo:e.target.value}))} placeholder="Ej: E-commerce + Reservas" />
                </div>

                {/* Año */}
                <div className="apo-mod-field">
                  <div className="apo-mod-l">Año</div>
                  <input className="apo-mod-v" value={form.año} onChange={e=>setForm(f=>({...f,año:e.target.value}))} placeholder="2024" />
                </div>

                {/* Color */}
                <div className="apo-mod-field">
                  <div className="apo-mod-l">Color accent</div>
                  <ColorPicker color={form.color} onChange={c=>setForm(f=>({...f,color:c}))} />
                </div>

                {/* Imágenes */}
                <div className="apo-mod-field full">
                  <div className="apo-mod-l">Imágenes del proyecto</div>
                  {form.imagenes.length > 0 && (
                    <div className="apo-imgs-list">
                      {form.imagenes.map((url, i) => (
                        <div key={i} className="apo-img-row">
                          <img src={url} className="apo-img-thumb" onError={e=>e.target.style.opacity=".2"} />
                          <span className="apo-img-url">{url}</span>
                          <button
                            className={`apo-img-principal-btn ${form.imgPrincipal===url?"on":"off"}`}
                            onClick={()=>setPrincipal(url)}
                          >
                            {form.imgPrincipal===url ? "✓ Principal" : "Principal"}
                          </button>
                          <button className="apo-img-del" onClick={()=>eliminarImg(url)}>✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="apo-img-add-row">
                    <input
                      className="apo-img-add-input"
                      value={nuevaImg}
                      onChange={e=>setNuevaImg(e.target.value)}
                      onKeyDown={e=>e.key==="Enter"&&agregarImg()}
                      placeholder="https://imagen.com/foto.jpg"
                    />
                    <button className="apo-img-add-btn" onClick={agregarImg}>+ Agregar</button>
                  </div>
                </div>

                {/* Demo */}
                <div className="apo-mod-field full">
                  <div className="apo-mod-l">URL del demo</div>
                  <input className="apo-mod-v" value={form.demo} onChange={e=>setForm(f=>({...f,demo:e.target.value}))} placeholder="https://..." />
                </div>

                {/* Descripción */}
                <div className="apo-mod-field full">
                  <div className="apo-mod-l">Descripción</div>
                  <textarea className="apo-mod-v" rows={3} value={form.desc} onChange={e=>setForm(f=>({...f,desc:e.target.value}))} placeholder="Describe el proyecto para el visitante..." style={{resize:"vertical"}} />
                </div>

                {/* Público objetivo */}
                <div className="apo-mod-field full">
                  <div className="apo-mod-l">Público objetivo</div>
                  <input className="apo-mod-v" value={form.publicoObjetivo} onChange={e=>setForm(f=>({...f,publicoObjetivo:e.target.value}))} placeholder="¿A quién va dirigido este sitio?" />
                </div>

                {/* Funcionalidades */}
                <div className="apo-mod-field full">
                  <div className="apo-mod-l">Funcionalidades</div>
                  {form.funcionalidades.length > 0 && (
                    <div className="apo-func-list">
                      {form.funcionalidades.map((f, i) => (
                        <div key={i} className="apo-func-item">
                          <span className="apo-func-check">✓</span>
                          <span className="apo-func-txt">{f}</span>
                          <button className="apo-func-del" onClick={()=>eliminarFunc(i)}>✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="apo-func-add-row">
                    <input
                      className="apo-func-input"
                      value={nuevaFunc}
                      onChange={e=>setNuevaFunc(e.target.value)}
                      onKeyDown={e=>e.key==="Enter"&&agregarFunc()}
                      placeholder="Ej: Sistema de reservas"
                    />
                    <button className="apo-func-add-btn" onClick={agregarFunc}>+ Agregar</button>
                  </div>
                </div>

                {/* Stack */}
                <div className="apo-mod-field full">
                  <div className="apo-mod-l">Stack tecnológico</div>
                  <div className="apo-stack-sel">
                    {STACK_OPCIONES.map(tag => (
                      <button key={tag} className={`apo-stack-opt ${form.stack.includes(tag)?"on":""}`} onClick={()=>toggleStack(tag)}>
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            <div className="apo-mod-footer">
              <button className="apo-mod-btn ghost" onClick={()=>setModal(null)}>Cancelar</button>
              <button className="apo-mod-btn cyan" onClick={guardar} disabled={saving||!form.nombre.trim()}>
                {saving ? "Guardando..." : modal === "nuevo" ? "Agregar al portafolio" : "Guardar cambios"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}