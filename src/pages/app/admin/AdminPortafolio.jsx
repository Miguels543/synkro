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

const CAMPOS_PRIVADOS = ["comision","precioMin","precioMax","misiones","publicoObjetivo","estado","cola"]

const EMPTY = {
  nombre:"", categoria:"Gastronomia", tipo:"", desc:"",
  imagenes:[], imgPrincipal:"", demo:"",
  año: new Date().getFullYear().toString(),
  color:"#00f3ff", stack:[], funcionalidades:[], publicoObjetivo:"", estado:"disponible",
  clientes:[]
}

const EMPTY_CLIENTE = { nombre:"", logo:"", testimonio:"", link:"" }

function sanitizarParaPortafolio(proyecto) {
  const limpio = { ...proyecto }
  CAMPOS_PRIVADOS.forEach(k => delete limpio[k])
  return limpio
}

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
  .apo-btn-import { padding:8px 16px; border-radius:9px; background:rgba(0,243,255,.07); border:1px solid rgba(0,243,255,.22); color:#00f3ff; font-size:12px; font-weight:700; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; white-space:nowrap; transition:background .15s; }
  .apo-btn-import:hover { background:rgba(0,243,255,.14); }
  .apo-loading { text-align:center; padding:48px; color:rgba(255,255,255,.25); font-size:13px; }
  .apo-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
  .apo-card { background:#0c0f14; border:1px solid rgba(255,255,255,.06); border-radius:11px; overflow:hidden; }
  .apo-card-img { width:100%; aspect-ratio:16/9; object-fit:cover; filter:brightness(.7); display:block; }
  .apo-card-img-placeholder { width:100%; aspect-ratio:16/9; background:rgba(255,255,255,.03); display:flex; align-items:center; justify-content:center; color:rgba(255,255,255,.15); font-size:13px; }
  .apo-card-body { padding:14px 16px; }
  .apo-card-cat { font-size:8px; letter-spacing:2px; text-transform:uppercase; color:rgba(0,243,255,.5); margin-bottom:5px; }
  .apo-card-nom { font-family:'Syne',sans-serif; font-size:14px; font-weight:800; color:#fff; margin-bottom:4px; }
  .apo-card-tipo { font-size:11px; color:rgba(255,255,255,.35); margin-bottom:8px; }
  .apo-card-stack { display:flex; flex-wrap:wrap; gap:4px; margin-bottom:8px; }
  .apo-stack-tag { font-size:9px; padding:2px 7px; border-radius:4px; background:rgba(255,255,255,.06); color:rgba(255,255,255,.4); border:1px solid rgba(255,255,255,.08); }
  .apo-card-clientes-badge { font-size:10px; color:rgba(16,185,129,.55); margin-bottom:10px; display:flex; align-items:center; gap:5px; }
  .apo-card-btns { display:flex; gap:6px; }
  .apo-btn { padding:5px 12px; border-radius:6px; font-size:11px; font-weight:600; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all .15s; border:none; }
  .apo-btn.ghost { background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.09); color:rgba(255,255,255,.4); }
  .apo-btn.ghost:hover { color:#fff; border-color:rgba(255,255,255,.2); }
  .apo-btn.red { background:rgba(239,68,68,.08); border:1px solid rgba(239,68,68,.18); color:#ef4444; }
  .apo-btn.red:hover { background:rgba(239,68,68,.15); }

  /* Modal */
  .apo-ovl { position:fixed; inset:0; z-index:9000; background:rgba(0,0,0,.82); display:flex; align-items:center; justify-content:center; backdrop-filter:blur(6px); }
  .apo-mod { background:#0e1319; border:1px solid rgba(0,243,255,.12); border-radius:15px; max-width:620px; width:94%; max-height:92vh; overflow:hidden; display:flex; flex-direction:column; }
  .apo-mod-hdr { padding:22px 26px 0; border-bottom:1px solid rgba(255,255,255,.06); flex-shrink:0; background:#0e1319; }
  .apo-mod-t { font-family:'Syne',sans-serif; font-size:17px; font-weight:800; color:#fff; margin-bottom:14px; }
  .apo-mod-tabs { display:flex; }
  .apo-mod-tab { padding:9px 18px; font-size:12px; font-weight:600; cursor:pointer; border:none; background:transparent; color:rgba(255,255,255,.3); font-family:'Plus Jakarta Sans',sans-serif; border-bottom:2px solid transparent; margin-bottom:-1px; transition:all .15s; }
  .apo-mod-tab.on { color:#00f3ff; border-bottom-color:#00f3ff; }
  .apo-mod-body { padding:20px 26px; overflow-y:auto; flex:1; }
  .apo-mod-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .apo-mod-field { display:flex; flex-direction:column; }
  .apo-mod-field.full { grid-column:1/-1; }
  .apo-mod-l { font-size:10px; color:rgba(255,255,255,.3); margin-bottom:5px; }
  .apo-mod-v { width:100%; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); border-radius:8px; padding:9px 12px; color:#fff; font-size:13px; font-family:'Plus Jakarta Sans',sans-serif; outline:none; transition:border-color .16s; box-sizing:border-box; }
  .apo-mod-v:focus { border-color:rgba(0,243,255,.3); }
  .apo-mod-v::placeholder { color:rgba(255,255,255,.16); }
  select.apo-mod-v option { background:#0e1319; }

  /* Color picker */
  .apo-color-wrap { position:relative; }
  .apo-color-preview { display:flex; align-items:center; gap:10px; cursor:pointer; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); border-radius:8px; padding:8px 12px; transition:border-color .16s; }
  .apo-color-preview:hover { border-color:rgba(0,243,255,.3); }
  .apo-color-swatch { width:24px; height:24px; border-radius:6px; border:1px solid rgba(255,255,255,.15); flex-shrink:0; }
  .apo-color-hex { font-size:13px; color:#fff; font-family:'Plus Jakarta Sans',sans-serif; }
  .apo-color-popover { position:absolute; top:calc(100% + 8px); left:0; z-index:100; background:#0e1319; border:1px solid rgba(255,255,255,.12); border-radius:12px; padding:14px; box-shadow:0 8px 32px rgba(0,0,0,.5); }
  .apo-color-popover .react-colorful { width:200px; height:160px; }
  .apo-color-popover .react-colorful__saturation { border-radius:8px 8px 0 0; }
  .apo-color-popover .react-colorful__hue { border-radius:0 0 8px 8px; height:14px; }

  /* Imágenes */
  .apo-imgs-list { display:flex; flex-direction:column; gap:6px; margin-bottom:8px; }
  .apo-img-row { display:flex; align-items:center; gap:8px; background:rgba(255,255,255,.02); border:1px solid rgba(255,255,255,.06); border-radius:8px; padding:7px 10px; }
  .apo-img-thumb { width:40px; height:28px; border-radius:4px; object-fit:cover; flex-shrink:0; background:rgba(255,255,255,.05); }
  .apo-img-url { font-size:11px; color:rgba(255,255,255,.4); flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .apo-img-principal-btn { font-size:9px; font-weight:700; padding:3px 8px; border-radius:20px; cursor:pointer; border:1px solid; transition:all .15s; white-space:nowrap; font-family:'Plus Jakarta Sans',sans-serif; background:transparent; }
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
  .apo-func-item { display:flex; align-items:center; gap:8px; background:rgba(255,255,255,.02); border:1px solid rgba(255,255,255,.06); border-radius:7px; padding:7px 10px; }
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

  /* ── Clientes reales ── */
  .cli-list { display:flex; flex-direction:column; gap:8px; margin-bottom:14px; }
  .cli-card { display:flex; align-items:flex-start; gap:12px; background:rgba(255,255,255,.02); border:1px solid rgba(255,255,255,.06); border-radius:10px; padding:12px 13px; }
  .cli-logo { width:46px; height:46px; border-radius:9px; object-fit:cover; flex-shrink:0; background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.07); }
  .cli-logo-ph { width:46px; height:46px; border-radius:9px; flex-shrink:0; background:rgba(255,255,255,.04); border:1px dashed rgba(255,255,255,.1); display:flex; align-items:center; justify-content:center; font-size:20px; }
  .cli-info { flex:1; min-width:0; }
  .cli-nombre { font-size:13px; font-weight:700; color:#fff; margin-bottom:3px; }
  .cli-testimonio { font-size:11px; color:rgba(255,255,255,.38); line-height:1.6; margin-bottom:5px; font-style:italic; }
  .cli-link { font-size:10px; color:rgba(0,243,255,.5); text-decoration:none; transition:color .14s; word-break:break-all; }
  .cli-link:hover { color:#00f3ff; }
  .cli-del { background:none; border:none; color:rgba(239,68,68,.35); cursor:pointer; font-size:14px; padding:2px 5px; transition:color .15s; flex-shrink:0; }
  .cli-del:hover { color:#ef4444; }
  .cli-empty { text-align:center; padding:26px; color:rgba(255,255,255,.15); font-size:12px; border:1px dashed rgba(255,255,255,.07); border-radius:10px; margin-bottom:14px; line-height:1.6; }

  .cli-nueva { background:rgba(0,243,255,.02); border:1px dashed rgba(0,243,255,.15); border-radius:10px; padding:15px 16px; }
  .cli-nueva-t { font-size:10px; font-weight:700; color:rgba(0,243,255,.4); text-transform:uppercase; letter-spacing:1.2px; margin-bottom:12px; }
  .cli-nueva-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:10px; }
  .cli-nueva-full { grid-column:1/-1; }
  .cli-nueva-lbl { font-size:10px; color:rgba(255,255,255,.3); margin-bottom:4px; }
  .cli-nueva-input { width:100%; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); border-radius:8px; padding:8px 11px; color:#fff; font-size:12px; font-family:'Plus Jakarta Sans',sans-serif; outline:none; box-sizing:border-box; transition:border-color .15s; }
  .cli-nueva-input:focus { border-color:rgba(0,243,255,.3); }
  .cli-nueva-input::placeholder { color:rgba(255,255,255,.18); }
  .cli-nueva-add { width:100%; padding:9px; border-radius:8px; background:rgba(0,243,255,.08); border:1px solid rgba(0,243,255,.2); color:#00f3ff; font-size:12px; font-weight:700; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all .15s; }
  .cli-nueva-add:hover { background:rgba(0,243,255,.15); }
  .cli-nueva-add:disabled { opacity:.3; cursor:not-allowed; }

  .apo-mod-footer { padding:14px 26px; border-top:1px solid rgba(255,255,255,.06); display:flex; gap:8px; flex-shrink:0; background:#0e1319; }
  .apo-mod-btn { flex:1; padding:10px; border-radius:8px; font-size:13px; font-weight:700; cursor:pointer; border:none; font-family:'Plus Jakarta Sans',sans-serif; transition:all .15s; }
  .apo-mod-btn.ghost { background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.09); color:rgba(255,255,255,.4); }
  .apo-mod-btn.cyan  { background:#00f3ff; color:#000; }
  .apo-mod-btn.cyan:hover { background:#7fffff; }
  .apo-mod-btn:disabled { opacity:.4; cursor:not-allowed; }

  /* Importar */
  .imp-mod { background:#0e1319; border:1px solid rgba(0,243,255,.12); border-radius:15px; max-width:520px; width:94%; max-height:88vh; display:flex; flex-direction:column; }
  .imp-hdr { padding:20px 24px 16px; border-bottom:1px solid rgba(255,255,255,.06); flex-shrink:0; }
  .imp-ttl { font-family:'Syne',sans-serif; font-size:16px; font-weight:800; color:#fff; margin-bottom:2px; }
  .imp-sub { font-size:11px; color:rgba(255,255,255,.25); }
  .imp-search { width:100%; margin:14px 0 0; background:#0c0f14; border:1px solid rgba(255,255,255,.08); border-radius:8px; padding:8px 13px; color:#fff; font-size:13px; font-family:'Plus Jakarta Sans',sans-serif; outline:none; box-sizing:border-box; }
  .imp-search:focus { border-color:rgba(0,243,255,.3); }
  .imp-search::placeholder { color:rgba(255,255,255,.2); }
  .imp-body { padding:14px 24px; overflow-y:auto; flex:1; display:flex; flex-direction:column; gap:8px; }
  .imp-loading { text-align:center; padding:32px; color:rgba(255,255,255,.25); font-size:13px; }
  .imp-empty  { text-align:center; padding:32px; color:rgba(255,255,255,.2); font-size:13px; }
  .imp-item { display:flex; align-items:center; gap:12px; background:rgba(255,255,255,.02); border:1px solid rgba(255,255,255,.06); border-radius:10px; padding:11px 13px; cursor:pointer; transition:all .15s; }
  .imp-item:hover { border-color:rgba(0,243,255,.25); background:rgba(0,243,255,.03); }
  .imp-item.ya-existe { opacity:.4; cursor:not-allowed; }
  .imp-item.ya-existe:hover { border-color:rgba(255,255,255,.06); background:rgba(255,255,255,.02); }
  .imp-thumb { width:52px; height:36px; border-radius:6px; object-fit:cover; flex-shrink:0; background:rgba(255,255,255,.05); }
  .imp-thumb-ph { width:52px; height:36px; border-radius:6px; background:rgba(255,255,255,.04); flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:10px; color:rgba(255,255,255,.15); }
  .imp-info { flex:1; min-width:0; }
  .imp-nom { font-size:13px; font-weight:600; color:#fff; margin-bottom:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .imp-cat { font-size:9px; letter-spacing:1.2px; text-transform:uppercase; color:rgba(0,243,255,.4); }
  .imp-badge-ya  { font-size:9px; font-weight:700; padding:3px 9px; border-radius:20px; background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.1); color:rgba(255,255,255,.3); white-space:nowrap; flex-shrink:0; }
  .imp-badge-add { font-size:9px; font-weight:700; padding:3px 9px; border-radius:20px; background:rgba(0,243,255,.08); border:1px solid rgba(0,243,255,.25); color:#00f3ff; white-space:nowrap; flex-shrink:0; }
  .imp-footer { padding:12px 24px; border-top:1px solid rgba(255,255,255,.06); flex-shrink:0; }
  .imp-footer-btn { width:100%; padding:10px; border-radius:8px; font-size:13px; font-weight:700; cursor:pointer; border:1px solid rgba(255,255,255,.09); background:rgba(255,255,255,.04); color:rgba(255,255,255,.4); font-family:'Plus Jakarta Sans',sans-serif; transition:all .15s; }
  .imp-footer-btn:hover { color:#fff; border-color:rgba(255,255,255,.2); }

  @media (max-width:860px) { .apo-grid { grid-template-columns:repeat(2,1fr); } }
  @media (max-width:560px) { .apo-grid { grid-template-columns:1fr; } }
`

function ColorPicker({ color, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
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

function ModalImportar({ portafolioActual, onImportar, onClose }) {
  const [proyectos, setProyectos] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [buscar,    setBuscar]    = useState("")

  useEffect(() => {
    const cargar = async () => {
      try {
        const snap = await getDocs(collection(db, "proyectos"))
        setProyectos(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    cargar()
  }, [])

  const nombresExistentes = new Set(portafolioActual.map(p => p.nombre?.toLowerCase().trim()))
  const filtrados = proyectos.filter(p => p.nombre?.toLowerCase().includes(buscar.toLowerCase()))

  return (
    <div className="apo-ovl" onClick={onClose}>
      <div className="imp-mod" onClick={e => e.stopPropagation()}>
        <div className="imp-hdr">
          <div className="imp-ttl">Importar desde Proyectos</div>
          <div className="imp-sub">Solo datos públicos — sin comisiones, precios ni misiones</div>
          <input className="imp-search" placeholder="Buscar..." value={buscar} onChange={e=>setBuscar(e.target.value)} autoFocus />
        </div>
        <div className="imp-body">
          {loading && <div className="imp-loading">Cargando...</div>}
          {!loading && filtrados.length === 0 && <div className="imp-empty">Sin proyectos</div>}
          {!loading && filtrados.map(p => {
            const ya = nombresExistentes.has(p.nombre?.toLowerCase().trim())
            const thumb = p.imgPrincipal || p.img || p.imagenes?.[0] || ""
            return (
              <div key={p.id} className={`imp-item ${ya?"ya-existe":""}`}
                onClick={() => !ya && onImportar(p)}
                title={ya ? "Ya está en portafolio" : "Clic para importar"}>
                {thumb
                  ? <img src={thumb} className="imp-thumb" onError={e=>e.target.style.opacity=".2"} />
                  : <div className="imp-thumb-ph">IMG</div>}
                <div className="imp-info">
                  <div className="imp-nom">{p.nombre}</div>
                  <div className="imp-cat">{p.categoria}</div>
                </div>
                {ya
                  ? <span className="imp-badge-ya">Ya agregado</span>
                  : <span className="imp-badge-add">+ Importar</span>}
              </div>
            )
          })}
        </div>
        <div className="imp-footer">
          <button className="imp-footer-btn" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  )
}

export default function AdminPortafolio() {
  const [proyectos,     setProyectos]     = useState([])
  const [loading,       setLoading]       = useState(true)
  const [saving,        setSaving]        = useState(false)
  const [buscar,        setBuscar]        = useState("")
  const [modal,         setModal]         = useState(null)
  const [tabModal,      setTabModal]      = useState("info")
  const [modalImportar, setModalImportar] = useState(false)
  const [form,          setForm]          = useState(EMPTY)
  const [nuevaImg,      setNuevaImg]      = useState("")
  const [nuevaFunc,     setNuevaFunc]     = useState("")
  const [nuevoCliente,  setNuevoCliente]  = useState(EMPTY_CLIENTE)

  useEffect(() => {
    const cargar = async () => {
      try {
        const snap = await getDocs(collection(db, "portafolio"))
        setProyectos(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    cargar()
  }, [])

  const filtrados = proyectos.filter(p =>
    p.nombre?.toLowerCase().includes(buscar.toLowerCase())
  )

  const handleImportarProyecto = (proyecto) => {
    const limpio = sanitizarParaPortafolio(proyecto)
    setForm({
      ...EMPTY,
      nombre:          limpio.nombre       || "",
      categoria:       limpio.categoria    || "Gastronomia",
      desc:            limpio.descripcion  || "",
      imagenes:        limpio.imagenes     || (limpio.img ? [limpio.img] : []),
      imgPrincipal:    limpio.imgPrincipal || limpio.img || "",
      demo:            limpio.demo         || "",
      funcionalidades: Array.isArray(limpio.funcionalidades)
        ? limpio.funcionalidades
        : (limpio.funcionalidades ? limpio.funcionalidades.split(",").map(f=>f.trim()).filter(Boolean) : []),
      año: new Date().getFullYear().toString(),
      color: "#00f3ff", stack: [], clientes: [],
    })
    setTabModal("info")
    setNuevaImg(""); setNuevaFunc(""); setNuevoCliente(EMPTY_CLIENTE)
    setModalImportar(false)
    setModal("nuevo")
  }

  const abrirNuevo = () => {
    setForm({ ...EMPTY, stack:[], imagenes:[], funcionalidades:[], clientes:[] })
    setTabModal("info"); setNuevaImg(""); setNuevaFunc(""); setNuevoCliente(EMPTY_CLIENTE)
    setModal("nuevo")
  }
  const abrirEditar = (p) => {
    setForm({
      ...EMPTY, ...p,
      stack:           p.stack          || [],
      imagenes:        p.imagenes       || (p.img ? [p.img] : []),
      imgPrincipal:    p.imgPrincipal   || p.img || "",
      funcionalidades: Array.isArray(p.funcionalidades)
        ? p.funcionalidades
        : (p.funcionalidades ? p.funcionalidades.split(",").map(f=>f.trim()).filter(Boolean) : []),
      clientes: p.clientes || [],
    })
    setTabModal("info"); setNuevaImg(""); setNuevaFunc(""); setNuevoCliente(EMPTY_CLIENTE)
    setModal(p)
  }

  const agregarImg = () => {
    if (!nuevaImg.trim()) return
    setForm(f => ({ ...f, imagenes:[...f.imagenes, nuevaImg.trim()], imgPrincipal: f.imgPrincipal||nuevaImg.trim() }))
    setNuevaImg("")
  }
  const eliminarImg = (url) => setForm(f => ({
    ...f, imagenes: f.imagenes.filter(i=>i!==url),
    imgPrincipal: f.imgPrincipal===url ? (f.imagenes.filter(i=>i!==url)[0]||"") : f.imgPrincipal
  }))
  const setPrincipal = (url) => setForm(f => ({ ...f, imgPrincipal: url }))

  const agregarFunc = () => {
    if (!nuevaFunc.trim()) return
    setForm(f => ({ ...f, funcionalidades:[...f.funcionalidades, nuevaFunc.trim()] }))
    setNuevaFunc("")
  }
  const eliminarFunc = (i) => setForm(f => ({ ...f, funcionalidades: f.funcionalidades.filter((_,idx)=>idx!==i) }))

  const toggleStack = (tag) => setForm(f => ({
    ...f, stack: f.stack.includes(tag) ? f.stack.filter(s=>s!==tag) : [...f.stack, tag]
  }))

  const agregarCliente = () => {
    if (!nuevoCliente.nombre.trim()) return
    const c = { id:`c${Date.now()}`, ...nuevoCliente }
    setForm(f => ({ ...f, clientes:[...(f.clientes||[]), c] }))
    setNuevoCliente(EMPTY_CLIENTE)
  }
  const eliminarCliente = (id) => setForm(f => ({ ...f, clientes: f.clientes.filter(c=>c.id!==id) }))

  const guardar = async () => {
    if (!form.nombre.trim()) return
    try {
      setSaving(true)
      const datos = {
        nombre: form.nombre, categoria: form.categoria, tipo: form.tipo,
        desc: form.desc, imagenes: form.imagenes,
        imgPrincipal: form.imgPrincipal || form.imagenes[0] || "",
        img: form.imgPrincipal || form.imagenes[0] || "",
        demo: form.demo, año: form.año, color: form.color,
        stack: form.stack, funcionalidades: form.funcionalidades,
        publicoObjetivo: form.publicoObjetivo, estado: form.estado,
        clientes: form.clientes || [],
      }
      if (modal === "nuevo") {
        const ref = await addDoc(collection(db, "portafolio"), datos)
        setProyectos(ps => [...ps, { id: ref.id, ...datos }])
      } else {
        await updateDoc(doc(db, "portafolio", modal.id), datos)
        setProyectos(ps => ps.map(p => p.id===modal.id ? { id:modal.id, ...datos } : p))
      }
      setModal(null)
    } catch (e) { alert("Error: " + e.message) }
    finally { setSaving(false) }
  }

  const eliminar = async (id) => {
    if (!confirm("¿Eliminar del portafolio?")) return
    try {
      await deleteDoc(doc(db, "portafolio", id))
      setProyectos(ps => ps.filter(p => p.id !== id))
    } catch (e) { alert("Error: " + e.message) }
  }

  return (
    <div className="apo">
      <style>{CSS}</style>
      <div className="apo-ttl">Portafolio público</div>
      <div className="apo-sub">Proyectos visibles en la página de portafolio</div>

      <div className="apo-toolbar">
        <input className="apo-search" placeholder="Buscar proyecto..." value={buscar} onChange={e=>setBuscar(e.target.value)} />
        <button className="apo-btn-import" onClick={() => setModalImportar(true)}>↓ Importar proyecto</button>
        <button className="apo-btn-new" onClick={abrirNuevo}>+ Agregar manual</button>
      </div>

      {loading && <div className="apo-loading">Cargando portafolio...</div>}

      {!loading && (
        <div className="apo-grid">
          {filtrados.length === 0 && (
            <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"48px", color:"rgba(255,255,255,.2)", fontSize:"13px" }}>
              No hay proyectos todavía
            </div>
          )}
          {filtrados.map(p => (
            <div key={p.id} className="apo-card">
              {(p.imgPrincipal || p.img)
                ? <img src={p.imgPrincipal||p.img} alt={p.nombre} className="apo-card-img" />
                : <div className="apo-card-img-placeholder">Sin imagen</div>}
              <div className="apo-card-body">
                <div className="apo-card-cat">{p.categoria} · {p.año}</div>
                <div className="apo-card-nom">{p.nombre}</div>
                {p.tipo && <div className="apo-card-tipo">{p.tipo}</div>}
                <div className="apo-card-stack">
                  {p.stack?.map((t,i) => <span key={i} className="apo-stack-tag">{t}</span>)}
                </div>
                {p.clientes?.length > 0 && (
                  <div className="apo-card-clientes-badge">
                    <span style={{color:"#10b981"}}>●</span>
                    {p.clientes.length} cliente{p.clientes.length!==1?"s":""} real{p.clientes.length!==1?"es":""}
                  </div>
                )}
                <div className="apo-card-btns">
                  <button className="apo-btn ghost" style={{flex:1}} onClick={()=>abrirEditar(p)}>Editar</button>
                  <button className="apo-btn red" onClick={()=>eliminar(p.id)}>✕</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalImportar && (
        <ModalImportar
          portafolioActual={proyectos}
          onImportar={handleImportarProyecto}
          onClose={() => setModalImportar(false)}
        />
      )}

      {modal !== null && (
        <div className="apo-ovl" onClick={()=>setModal(null)}>
          <div className="apo-mod" onClick={e=>e.stopPropagation()}>
            <div className="apo-mod-hdr">
              <div className="apo-mod-t">{modal==="nuevo" ? "Agregar al portafolio" : `Editar — ${form.nombre}`}</div>
              <div className="apo-mod-tabs">
                {[
                  { key:"info",     label:"Información" },
                  { key:"clientes", label:`Clientes reales (${form.clientes?.length||0})` },
                ].map(t => (
                  <button key={t.key} className={`apo-mod-tab ${tabModal===t.key?"on":""}`} onClick={()=>setTabModal(t.key)}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="apo-mod-body">

              {tabModal === "info" && (
                <div className="apo-mod-grid">
                  <div className="apo-mod-field full">
                    <div className="apo-mod-l">Nombre del proyecto</div>
                    <input className="apo-mod-v" value={form.nombre} onChange={e=>setForm(f=>({...f,nombre:e.target.value}))} placeholder="Ej: Restaurante Borgo" />
                  </div>
                  <div className="apo-mod-field">
                    <div className="apo-mod-l">Categoría</div>
                    <select className="apo-mod-v" value={form.categoria} onChange={e=>setForm(f=>({...f,categoria:e.target.value}))} style={{cursor:"pointer",appearance:"none"}}>
                      {CATEGORIAS_PORT.map(c=><option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="apo-mod-field">
                    <div className="apo-mod-l">Tipo</div>
                    <input className="apo-mod-v" value={form.tipo} onChange={e=>setForm(f=>({...f,tipo:e.target.value}))} placeholder="Ej: E-commerce + Reservas" />
                  </div>
                  <div className="apo-mod-field">
                    <div className="apo-mod-l">Año</div>
                    <input className="apo-mod-v" value={form.año} onChange={e=>setForm(f=>({...f,año:e.target.value}))} placeholder="2026" />
                  </div>
                  <div className="apo-mod-field">
                    <div className="apo-mod-l">Color accent</div>
                    <ColorPicker color={form.color} onChange={c=>setForm(f=>({...f,color:c}))} />
                  </div>
                  <div className="apo-mod-field full">
                    <div className="apo-mod-l">Imágenes del proyecto</div>
                    {form.imagenes.length > 0 && (
                      <div className="apo-imgs-list">
                        {form.imagenes.map((url,i) => (
                          <div key={i} className="apo-img-row">
                            <img src={url} className="apo-img-thumb" onError={e=>e.target.style.opacity=".2"} />
                            <span className="apo-img-url">{url}</span>
                            <button className={`apo-img-principal-btn ${form.imgPrincipal===url?"on":"off"}`} onClick={()=>setPrincipal(url)}>
                              {form.imgPrincipal===url?"✓ Principal":"Principal"}
                            </button>
                            <button className="apo-img-del" onClick={()=>eliminarImg(url)}>✕</button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="apo-img-add-row">
                      <input className="apo-img-add-input" value={nuevaImg} onChange={e=>setNuevaImg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&agregarImg()} placeholder="https://imagen.com/foto.jpg" />
                      <button className="apo-img-add-btn" onClick={agregarImg}>+ Agregar</button>
                    </div>
                  </div>
                  <div className="apo-mod-field full">
                    <div className="apo-mod-l">URL del demo</div>
                    <input className="apo-mod-v" value={form.demo} onChange={e=>setForm(f=>({...f,demo:e.target.value}))} placeholder="https://..." />
                  </div>
                  <div className="apo-mod-field full">
                    <div className="apo-mod-l">Descripción</div>
                    <textarea className="apo-mod-v" rows={3} value={form.desc} onChange={e=>setForm(f=>({...f,desc:e.target.value}))} placeholder="Describe el proyecto..." style={{resize:"vertical"}} />
                  </div>
                  <div className="apo-mod-field full">
                    <div className="apo-mod-l">Público objetivo</div>
                    <input className="apo-mod-v" value={form.publicoObjetivo} onChange={e=>setForm(f=>({...f,publicoObjetivo:e.target.value}))} placeholder="¿A quién va dirigido?" />
                  </div>
                  <div className="apo-mod-field full">
                    <div className="apo-mod-l">Funcionalidades</div>
                    {form.funcionalidades.length > 0 && (
                      <div className="apo-func-list">
                        {form.funcionalidades.map((fn,i) => (
                          <div key={i} className="apo-func-item">
                            <span className="apo-func-check">✓</span>
                            <span className="apo-func-txt">{fn}</span>
                            <button className="apo-func-del" onClick={()=>eliminarFunc(i)}>✕</button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="apo-func-add-row">
                      <input className="apo-func-input" value={nuevaFunc} onChange={e=>setNuevaFunc(e.target.value)} onKeyDown={e=>e.key==="Enter"&&agregarFunc()} placeholder="Ej: Sistema de reservas" />
                      <button className="apo-func-add-btn" onClick={agregarFunc}>+ Agregar</button>
                    </div>
                  </div>
                  <div className="apo-mod-field full">
                    <div className="apo-mod-l">Stack tecnológico</div>
                    <div className="apo-stack-sel">
                      {STACK_OPCIONES.map(tag => (
                        <button key={tag} className={`apo-stack-opt ${form.stack.includes(tag)?"on":""}`} onClick={()=>toggleStack(tag)}>{tag}</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {tabModal === "clientes" && (
                <div>
                  <p style={{fontSize:"11px",color:"rgba(255,255,255,.25)",marginBottom:"14px",lineHeight:1.6,margin:"0 0 16px"}}>
                    Negocios o personas que ya usan este sistema. Se muestran públicamente en la página del proyecto como prueba social.
                  </p>

                  {(!form.clientes || form.clientes.length === 0)
                    ? (
                      <div className="cli-empty">
                        Ningún cliente registrado todavía.<br/>
                        Cuando tengas tu primer cliente usando este sistema, agrégalo aquí.
                      </div>
                    ) : (
                      <div className="cli-list">
                        {form.clientes.map(c => (
                          <div key={c.id} className="cli-card">
                            {c.logo
                              ? <img src={c.logo} className="cli-logo" onError={e=>e.target.style.opacity=".2"} />
                              : <div className="cli-logo-ph">🏢</div>}
                            <div className="cli-info">
                              <div className="cli-nombre">{c.nombre}</div>
                              {c.testimonio && <div className="cli-testimonio">"{c.testimonio}"</div>}
                              {c.link && (
                                <a href={c.link} target="_blank" rel="noopener noreferrer" className="cli-link">
                                  🔗 {c.link}
                                </a>
                              )}
                            </div>
                            <button className="cli-del" onClick={()=>eliminarCliente(c.id)}>✕</button>
                          </div>
                        ))}
                      </div>
                    )
                  }

                  <div className="cli-nueva">
                    <div className="cli-nueva-t">Agregar cliente</div>
                    <div className="cli-nueva-grid">
                      <div>
                        <div className="cli-nueva-lbl">Nombre del negocio *</div>
                        <input className="cli-nueva-input" value={nuevoCliente.nombre} onChange={e=>setNuevoCliente(c=>({...c,nombre:e.target.value}))} placeholder="Ej: Panadería Don Pedro" />
                      </div>
                      <div>
                        <div className="cli-nueva-lbl">URL del logo</div>
                        <input className="cli-nueva-input" value={nuevoCliente.logo} onChange={e=>setNuevoCliente(c=>({...c,logo:e.target.value}))} placeholder="https://logo.png" />
                      </div>
                      <div className="cli-nueva-full">
                        <div className="cli-nueva-lbl">Testimonio / frase corta</div>
                        <input className="cli-nueva-input" value={nuevoCliente.testimonio} onChange={e=>setNuevoCliente(c=>({...c,testimonio:e.target.value}))} placeholder='Ej: "Ahora llevamos el inventario sin errores"' />
                      </div>
                      <div className="cli-nueva-full">
                        <div className="cli-nueva-lbl">Link al sitio real</div>
                        <input className="cli-nueva-input" value={nuevoCliente.link} onChange={e=>setNuevoCliente(c=>({...c,link:e.target.value}))} placeholder="https://suempresa.com" />
                      </div>
                    </div>
                    <button className="cli-nueva-add" onClick={agregarCliente} disabled={!nuevoCliente.nombre.trim()}>
                      + Agregar cliente
                    </button>
                  </div>
                </div>
              )}

            </div>

            <div className="apo-mod-footer">
              <button className="apo-mod-btn ghost" onClick={()=>setModal(null)}>Cancelar</button>
              <button className="apo-mod-btn cyan" onClick={guardar} disabled={saving||!form.nombre.trim()}>
                {saving ? "Guardando..." : modal==="nuevo" ? "Crear en portafolio" : "Guardar cambios"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}