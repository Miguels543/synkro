import { useState, useEffect, useRef } from "react"
import {
  collection, getDocs, doc, updateDoc, addDoc, deleteDoc, getDoc
} from "firebase/firestore"
import { db } from "../../../firebase/config"

// ─── CSS ────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');

  /* ── Base ── */
  .am { padding: 28px 30px 80px; font-family: 'Plus Jakarta Sans', sans-serif; }

  /* ── Vista 1: Grid de proyectos ── */
  .am-v1-header { margin-bottom: 24px; }
  .am-ttl  { font-family:'Syne',sans-serif; font-size:22px; font-weight:800; color:#fff; margin-bottom:3px; }
  .am-ttl span { color:#00f3ff; }
  .am-sub  { font-size:12px; color:rgba(255,255,255,.28); }

  .am-toolbar { display:flex; gap:10px; align-items:center; margin-bottom:24px; flex-wrap:wrap; }
  .am-search-wrap { flex:1; min-width:220px; position:relative; }
  .am-search-icon { position:absolute; left:13px; top:50%; transform:translateY(-50%); color:rgba(255,255,255,.2); font-size:13px; pointer-events:none; }
  .am-search { width:100%; background:#0c0f14; border:1px solid rgba(255,255,255,.08); border-radius:10px; padding:9px 14px 9px 36px; color:#fff; font-size:13px; font-family:'Plus Jakarta Sans',sans-serif; outline:none; box-sizing:border-box; transition:border-color .16s; }
  .am-search:focus { border-color:rgba(0,243,255,.3); }
  .am-search::placeholder { color:rgba(255,255,255,.2); }

  .am-btn-new { padding:9px 18px; border-radius:10px; background:#00f3ff; color:#000; font-size:12px; font-weight:700; border:none; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; white-space:nowrap; transition:background .15s; display:flex; align-items:center; gap:6px; }
  .am-btn-new:hover { background:#7fffff; }

  .am-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:14px; }

  .am-proy-card {
    background:#0c0f14;
    border:1px solid rgba(255,255,255,.06);
    border-radius:13px;
    overflow:hidden;
    display:flex;
    align-items:stretch;
    transition: border-color .2s, transform .2s, box-shadow .2s;
    cursor:pointer;
  }
  .am-proy-card:hover {
    border-color:rgba(0,243,255,.22);
    transform:translateY(-2px);
    box-shadow:0 8px 32px rgba(0,243,255,.07);
  }

  .am-proy-thumb {
    width:120px; flex-shrink:0;
    object-fit:cover; filter:brightness(.6);
    display:block;
  }
  .am-proy-thumb-ph {
    width:120px; flex-shrink:0;
    background:rgba(255,255,255,.03);
    display:flex; align-items:center; justify-content:center;
    color:rgba(255,255,255,.1); font-size:28px;
  }

  .am-proy-body { padding:16px 18px; flex:1; display:flex; flex-direction:column; justify-content:space-between; gap:10px; }
  .am-proy-top { display:flex; justify-content:space-between; align-items:flex-start; gap:8px; }
  .am-proy-nombre { font-family:'Syne',sans-serif; font-size:16px; font-weight:800; color:#fff; }
  .am-proy-badge { font-size:10px; font-weight:700; padding:3px 10px; border-radius:20px; background:rgba(0,243,255,.08); border:1px solid rgba(0,243,255,.2); color:#00f3ff; white-space:nowrap; flex-shrink:0; }
  .am-proy-desc { font-size:11.5px; color:rgba(255,255,255,.3); line-height:1.5; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }

  .am-proy-footer { display:flex; align-items:center; justify-content:space-between; }
  .am-proy-cat { font-size:8.5px; letter-spacing:1.5px; text-transform:uppercase; color:rgba(0,243,255,.35); }
  .am-ver-btn { padding:6px 14px; border-radius:7px; background:rgba(0,243,255,.08); border:1px solid rgba(0,243,255,.2); color:#00f3ff; font-size:11px; font-weight:700; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:background .15s; }
  .am-ver-btn:hover { background:rgba(0,243,255,.18); }

  .am-loading { text-align:center; padding:60px; color:rgba(255,255,255,.2); font-size:13px; }
  .am-empty   { text-align:center; padding:60px; color:rgba(255,255,255,.15); font-size:13px; }

  /* ── Vista 2: Detalle ── */
  .am-v2 { display:flex; flex-direction:column; gap:20px; }

  .am-back-btn {
    display:inline-flex; align-items:center; gap:7px;
    font-size:12px; font-weight:600; color:rgba(255,255,255,.4);
    background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08);
    border-radius:8px; padding:6px 14px; cursor:pointer;
    font-family:'Plus Jakarta Sans',sans-serif; transition:all .15s; border-left:none;
    width:fit-content; margin-bottom:4px;
  }
  .am-back-btn:hover { color:#fff; border-color:rgba(255,255,255,.2); }

  .am-v2-ttl { font-family:'Syne',sans-serif; font-size:22px; font-weight:800; color:#fff; margin-bottom:2px; }
  .am-v2-ttl span { color:#00f3ff; }
  .am-v2-sub { font-size:12px; color:rgba(255,255,255,.25); margin-bottom:0; }

  /* Header del proyecto seleccionado */
  .am-proy-header {
    background:#0c0f14; border:1px solid rgba(255,255,255,.07);
    border-radius:13px; overflow:hidden; display:flex; align-items:stretch;
  }
  .am-ph-thumb { width:130px; flex-shrink:0; object-fit:cover; filter:brightness(.65); display:block; }
  .am-ph-thumb-ph { width:130px; flex-shrink:0; background:rgba(255,255,255,.03); display:flex; align-items:center; justify-content:center; font-size:32px; color:rgba(255,255,255,.1); }
  .am-ph-body { padding:18px 22px; flex:1; display:flex; flex-direction:column; justify-content:center; gap:6px; }
  .am-ph-nombre { font-family:'Syne',sans-serif; font-size:20px; font-weight:800; color:#fff; }
  .am-ph-meta { display:flex; align-items:center; gap:12px; font-size:11.5px; color:rgba(255,255,255,.35); }
  .am-ph-meta-dot { width:3px; height:3px; border-radius:50%; background:rgba(255,255,255,.2); }
  .am-ph-desc { font-size:12.5px; color:rgba(255,255,255,.4); line-height:1.55; }
  .am-ph-actions { display:flex; align-items:center; gap:10px; padding:18px 22px 18px 0; flex-shrink:0; }
  .am-asignar-btn { padding:9px 18px; border-radius:9px; background:#00f3ff; color:#000; font-size:12px; font-weight:700; border:none; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; white-space:nowrap; display:flex; align-items:center; gap:6px; transition:background .15s; }
  .am-asignar-btn:hover { background:#7fffff; }

  /* Layout dos columnas */
  .am-v2-layout { display:grid; grid-template-columns:1fr 300px; gap:16px; align-items:start; }

  /* Misiones asignadas */
  .am-mis-section { display:flex; flex-direction:column; gap:10px; }
  .am-mis-section-ttl { font-size:11px; font-weight:700; color:rgba(255,255,255,.35); text-transform:uppercase; letter-spacing:1.5px; margin-bottom:4px; }

  .am-mis-card {
    background:#0c0f14; border:1px solid rgba(255,255,255,.06);
    border-radius:11px; padding:14px 16px;
    display:flex; align-items:flex-start; gap:14px;
    transition:border-color .15s;
  }
  .am-mis-card:hover { border-color:rgba(255,255,255,.11); }
  .am-mis-card.bloqueada { opacity:.55; }

  .am-mis-acento { width:3px; flex-shrink:0; border-radius:2px; align-self:stretch; background:rgba(0,243,255,.35); }
  .am-mis-acento.reservada { background:rgba(245,158,11,.5); }
  .am-mis-acento.proceso   { background:rgba(16,185,129,.5); }

  .am-mis-info { flex:1; min-width:0; }
  .am-mis-nom  { font-size:13.5px; font-weight:700; color:#fff; margin-bottom:3px; }
  .am-mis-desc-txt { font-size:11.5px; color:rgba(255,255,255,.35); line-height:1.55; margin-bottom:8px; }
  .am-mis-footer { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
  .am-mis-precio { font-family:'Syne',sans-serif; font-size:15px; font-weight:800; color:#10b981; }
  .am-mis-estado { font-size:9px; font-weight:700; text-transform:uppercase; padding:2px 8px; border-radius:20px; letter-spacing:.8px; }
  .am-mis-estado.disponible { background:rgba(16,185,129,.09); color:#10b981; border:1px solid rgba(16,185,129,.2); }
  .am-mis-estado.reservada  { background:rgba(245,158,11,.09);  color:#f59e0b; border:1px solid rgba(245,158,11,.2); }
  .am-mis-estado.proceso    { background:rgba(0,243,255,.08);   color:#00f3ff; border:1px solid rgba(0,243,255,.2); }

  .am-mis-btns { display:flex; flex-direction:column; gap:5px; flex-shrink:0; }
  .am-mis-btn  { padding:5px 10px; border-radius:6px; font-size:11px; font-weight:600; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all .15s; border:none; display:flex; align-items:center; gap:4px; white-space:nowrap; }
  .am-mis-btn.edit { background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.1); color:rgba(255,255,255,.5); }
  .am-mis-btn.edit:hover { color:#fff; border-color:rgba(255,255,255,.25); }
  .am-mis-btn.del  { background:rgba(239,68,68,.07); border:1px solid rgba(239,68,68,.18); color:#ef4444; }
  .am-mis-btn.del:hover  { background:rgba(239,68,68,.14); }
  .am-mis-btn:disabled { opacity:.3; cursor:not-allowed; pointer-events:none; }

  .am-mis-empty { text-align:center; padding:36px 20px; color:rgba(255,255,255,.15); font-size:12.5px; border:1px dashed rgba(255,255,255,.07); border-radius:11px; line-height:1.7; }

  /* Panel derecho — biblioteca */
  .am-lib { background:#0c0f14; border:1px solid rgba(255,255,255,.07); border-radius:13px; padding:16px; position:sticky; top:90px; }
  .am-lib-ttl { font-family:'Syne',sans-serif; font-size:14px; font-weight:800; color:#fff; margin-bottom:12px; }
  .am-lib-search-wrap { position:relative; margin-bottom:12px; }
  .am-lib-search { width:100%; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); border-radius:8px; padding:8px 12px 8px 32px; color:#fff; font-size:12px; font-family:'Plus Jakarta Sans',sans-serif; outline:none; box-sizing:border-box; }
  .am-lib-search:focus { border-color:rgba(0,243,255,.3); }
  .am-lib-search::placeholder { color:rgba(255,255,255,.2); }
  .am-lib-search-icon { position:absolute; left:10px; top:50%; transform:translateY(-50%); color:rgba(255,255,255,.2); font-size:11px; pointer-events:none; }

  .am-lib-list { display:flex; flex-direction:column; gap:4px; max-height:460px; overflow-y:auto; }
  .am-lib-list::-webkit-scrollbar { width:3px; }
  .am-lib-list::-webkit-scrollbar-track { background:transparent; }
  .am-lib-list::-webkit-scrollbar-thumb { background:rgba(0,243,255,.15); border-radius:2px; }

  .am-lib-item {
    display:flex; align-items:center; gap:10px;
    padding:9px 10px; border-radius:8px;
    border:1px solid transparent;
    cursor:pointer; transition:all .14s;
  }
  .am-lib-item:hover { background:rgba(0,243,255,.04); border-color:rgba(0,243,255,.15); }
  .am-lib-item.ya-asignada { opacity:.35; cursor:not-allowed; }
  .am-lib-item.ya-asignada:hover { background:transparent; border-color:transparent; }
  .am-lib-info { flex:1; min-width:0; }
  .am-lib-nom   { font-size:12px; font-weight:600; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .am-lib-precio { font-size:10px; color:rgba(16,185,129,.6); font-weight:600; }
  .am-lib-add { padding:3px 9px; border-radius:5px; background:rgba(0,243,255,.07); border:1px solid rgba(0,243,255,.2); color:#00f3ff; font-size:10px; font-weight:700; cursor:pointer; flex-shrink:0; transition:background .13s; font-family:'Plus Jakarta Sans',sans-serif; }
  .am-lib-add:hover { background:rgba(0,243,255,.16); }

  .am-lib-empty { text-align:center; padding:24px 12px; color:rgba(255,255,255,.18); font-size:11.5px; }
  .am-lib-nueva-btn { width:100%; margin-top:10px; padding:8px; border-radius:8px; background:rgba(255,255,255,.03); border:1px dashed rgba(255,255,255,.1); color:rgba(255,255,255,.3); font-size:11px; font-weight:700; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all .15s; }
  .am-lib-nueva-btn:hover { border-color:rgba(0,243,255,.2); color:rgba(0,243,255,.6); }

  /* ── Modales ── */
  .am-ovl { position:fixed; inset:0; z-index:9999; background:rgba(0,0,0,.82); display:flex; align-items:center; justify-content:center; backdrop-filter:blur(6px); }
  .am-modal { background:#0e1319; border:1px solid rgba(0,243,255,.12); border-radius:14px; padding:26px; max-width:440px; width:94%; }
  .am-modal-t { font-family:'Syne',sans-serif; font-size:16px; font-weight:800; color:#fff; margin-bottom:18px; }
  .am-modal-f { margin-bottom:12px; }
  .am-modal-l { font-size:10px; color:rgba(255,255,255,.3); margin-bottom:5px; }
  .am-modal-v { width:100%; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); border-radius:8px; padding:9px 12px; color:#fff; font-size:13px; font-family:'Plus Jakarta Sans',sans-serif; outline:none; box-sizing:border-box; transition:border-color .15s; }
  .am-modal-v:focus { border-color:rgba(0,243,255,.3); }
  .am-modal-v::placeholder { color:rgba(255,255,255,.16); }
  .am-modal-row { display:flex; gap:8px; margin-top:16px; }
  .am-modal-btn { flex:1; padding:10px; border-radius:8px; font-size:13px; font-weight:700; cursor:pointer; border:none; font-family:'Plus Jakarta Sans',sans-serif; transition:all .15s; }
  .am-modal-btn.ghost { background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.09); color:rgba(255,255,255,.4); }
  .am-modal-btn.cyan  { background:#00f3ff; color:#000; }
  .am-modal-btn.cyan:hover { background:#7fffff; }
  .am-modal-btn:disabled { opacity:.4; cursor:not-allowed; }

  /* Responsive */
  @media (max-width:860px) {
    .am-grid { grid-template-columns:1fr; }
    .am-v2-layout { grid-template-columns:1fr; }
    .am-lib { position:static; }

    /* Card de proyecto: imagen arriba, contenido vertical */
    .am-proy-card { flex-direction:column; }
    .am-proy-thumb { width:100%; height:160px; object-fit:cover; }
    .am-proy-thumb-ph { width:100%; height:120px; }

    /* Header del proyecto en detalle */
    .am-proy-header { flex-direction:column; }
    .am-ph-thumb, .am-ph-thumb-ph { width:100%; height:120px; }
    .am-ph-actions { padding:0 18px 18px; }
  }
`

const EMPTY_PLANTILLA = { titulo:"", desc:"", pago:"" }
const EMPTY_MISION    = { titulo:"", desc:"", pago:"" }

// ─── Componente principal ────────────────────────────────────────────────────
export default function AdminMisiones() {
  // Vista: "grid" | proyecto (objeto)
  const [vista,       setVista]       = useState("grid")
  const [proyectos,   setProyectos]   = useState([])
  const [plantillas,  setPlantillas]  = useState([])
  const [loading,     setLoading]     = useState(true)
  const [saving,      setSaving]      = useState(false)
  const [buscarProy,  setBuscarProy]  = useState("")
  const [buscarLib,   setBuscarLib]   = useState("")

  // Modal: null | "nueva-plantilla" | "editar-mision" | "asignar-manual"
  const [modal,       setModal]       = useState(null)
  const [formPlan,    setFormPlan]    = useState(EMPTY_PLANTILLA)
  const [formMis,     setFormMis]     = useState(EMPTY_MISION)
  const [editTarget,  setEditTarget]  = useState(null) // id de misión editando

  // ── Carga inicial ──────────────────────────────────────
  useEffect(() => {
    const cargar = async () => {
      try {
        const [snapProy, snapPlan] = await Promise.all([
          getDocs(collection(db, "proyectos")),
          getDocs(collection(db, "misionesPlantillas")),
        ])
        setProyectos(snapProy.docs.map(d => ({ id: d.id, ...d.data() })))
        setPlantillas(snapPlan.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [])

  // ── Proyecto activo (con misiones frescas) ─────────────
  const proyectoActivo = vista !== "grid"
    ? proyectos.find(p => p.id === vista.id)
    : null
  const misionesActivas = proyectoActivo?.misiones || []

  // ── Guardar misiones del proyecto activo en Firestore ──
  const guardarMisiones = async (nuevasMisiones) => {
    if (!proyectoActivo) return
    await updateDoc(doc(db, "proyectos", proyectoActivo.id), { misiones: nuevasMisiones })
    setProyectos(ps => ps.map(p =>
      p.id === proyectoActivo.id ? { ...p, misiones: nuevasMisiones } : p
    ))
  }

  // ── Asignar desde plantilla ────────────────────────────
  const asignarPlantilla = async (plantilla) => {
    const yaExiste = misionesActivas.some(m => m.titulo === plantilla.titulo)
    if (yaExiste) return
    const nueva = {
      id: `m${Date.now()}`,
      titulo: plantilla.titulo,
      desc: plantilla.desc || "",
      pago: Number(plantilla.pago) || 0,
      estado: "disponible",
      pendientes: 0, completadas: 0,
    }
    await guardarMisiones([...misionesActivas, nueva])
  }

  // ── Eliminar misión asignada ───────────────────────────
  const eliminarMision = async (mId) => {
    if (!confirm("¿Eliminar esta misión?")) return
    await guardarMisiones(misionesActivas.filter(m => m.id !== mId))
  }

  // ── Editar misión ──────────────────────────────────────
  const abrirEditar = (m) => {
    setEditTarget(m.id)
    setFormMis({ titulo: m.titulo, desc: m.desc || "", pago: m.pago })
    setModal("editar-mision")
  }
  const guardarEdicion = async () => {
    if (!formMis.titulo || !formMis.pago) return
    setSaving(true)
    try {
      const updated = misionesActivas.map(m =>
        m.id === editTarget
          ? { ...m, titulo: formMis.titulo, desc: formMis.desc, pago: Number(formMis.pago) }
          : m
      )
      await guardarMisiones(updated)
      setModal(null)
    } catch (e) { alert(e.message) }
    finally { setSaving(false) }
  }

  // ── Asignar misión manual (sin plantilla) ──────────────
  const guardarManual = async () => {
    if (!formMis.titulo || !formMis.pago) return
    setSaving(true)
    try {
      const nueva = {
        id: `m${Date.now()}`,
        titulo: formMis.titulo, desc: formMis.desc,
        pago: Number(formMis.pago), pendientes: 0, completadas: 0,
      }
      await guardarMisiones([...misionesActivas, nueva])
      setModal(null)
    } catch (e) { alert(e.message) }
    finally { setSaving(false) }
  }

  // ── Nueva plantilla en biblioteca ─────────────────────
  const guardarPlantilla = async () => {
    if (!formPlan.titulo) return
    setSaving(true)
    try {
      const datos = { titulo: formPlan.titulo, desc: formPlan.desc, pago: Number(formPlan.pago) || 0 }
      const ref = await addDoc(collection(db, "misionesPlantillas"), datos)
      setPlantillas(ps => [...ps, { id: ref.id, ...datos }])
      setModal(null)
    } catch (e) { alert(e.message) }
    finally { setSaving(false) }
  }

  // ── Filtros ────────────────────────────────────────────
  const proyFiltrados = proyectos.filter(p =>
    p.nombre?.toLowerCase().includes(buscarProy.toLowerCase())
  )
  const libFiltradas = plantillas.filter(p =>
    p.titulo?.toLowerCase().includes(buscarLib.toLowerCase())
  )

  // ─── RENDER ─────────────────────────────────────────────
  return (
    <div className="am">
      <style>{CSS}</style>

      {/* ══════════ VISTA 1: GRID DE PROYECTOS ══════════ */}
      {vista === "grid" && (
        <>
          <div className="am-v1-header">
            <div className="am-ttl">Misiones <span>por proyecto</span></div>
            <div className="am-sub">Gestiona misiones asociadas a cada proyecto</div>
          </div>

          <div className="am-toolbar">
            <div className="am-search-wrap">
              <span className="am-search-icon">🔍</span>
              <input
                className="am-search"
                placeholder="Buscar proyecto..."
                value={buscarProy}
                onChange={e => setBuscarProy(e.target.value)}
              />
            </div>
            <button
              className="am-btn-new"
              onClick={() => { setFormPlan(EMPTY_PLANTILLA); setModal("nueva-plantilla") }}
            >
              + Nueva plantilla
            </button>
          </div>

          {loading && <div className="am-loading">Cargando proyectos...</div>}

          {!loading && proyFiltrados.length === 0 && (
            <div className="am-empty">No hay proyectos todavía</div>
          )}

          {!loading && (
            <div className="am-grid">
              {proyFiltrados.map(p => {
                const thumb = p.imgPrincipal || p.img || p.imagenes?.[0] || ""
                const numMis = p.misiones?.length || 0
                return (
                  <div key={p.id} className="am-proy-card" onClick={() => setVista(p)}>
                    {thumb
                      ? <img src={thumb} className="am-proy-thumb" onError={e=>e.target.style.opacity=".1"} />
                      : <div className="am-proy-thumb-ph">🗂</div>
                    }
                    <div className="am-proy-body">
                      <div className="am-proy-top">
                        <div className="am-proy-nombre">{p.nombre}</div>
                        <div className="am-proy-badge">{numMis} misión{numMis!==1?"es":""}</div>
                      </div>
                      <div className="am-proy-desc">{p.descripcion || p.desc || "Sin descripción"}</div>
                      <div className="am-proy-footer">
                        <div className="am-proy-cat">{p.categoria}</div>
                        <button className="am-ver-btn" onClick={e => { e.stopPropagation(); setVista(p) }}>
                          Ver misiones
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* ══════════ VISTA 2: DETALLE DEL PROYECTO ══════════ */}
      {vista !== "grid" && proyectoActivo && (
        <div className="am-v2">
          <button className="am-back-btn" onClick={() => setVista("grid")}>
            ← Volver a proyectos
          </button>

          <div>
            <div className="am-v2-ttl">Misiones <span>para {proyectoActivo.nombre}</span></div>
            <div className="am-v2-sub">Gestiona las misiones del proyecto {proyectoActivo.nombre}.</div>
          </div>

          {/* Header del proyecto */}
          <div className="am-proy-header">
            {(() => {
              const thumb = proyectoActivo.imgPrincipal || proyectoActivo.img || proyectoActivo.imagenes?.[0] || ""
              return thumb
                ? <img src={thumb} className="am-ph-thumb" onError={e=>e.target.style.opacity=".1"} />
                : <div className="am-ph-thumb-ph">🗂</div>
            })()}
            <div className="am-ph-body">
              <div className="am-ph-nombre">{proyectoActivo.nombre}</div>
              <div className="am-ph-meta">
                <span>{misionesActivas.length} misiones activas</span>
                {proyectoActivo.categoria && <>
                  <span className="am-ph-meta-dot"/>
                  <span>{proyectoActivo.categoria}</span>
                </>}
              </div>
              {(proyectoActivo.descripcion || proyectoActivo.desc) && (
                <div className="am-ph-desc">{proyectoActivo.descripcion || proyectoActivo.desc}</div>
              )}
            </div>
            <div className="am-ph-actions">
              <button
                className="am-asignar-btn"
                onClick={() => {
                  setFormMis(EMPTY_MISION)
                  setModal("asignar-manual")
                }}
              >
                + Asignar misión
              </button>
            </div>
          </div>

          {/* Layout 2 columnas */}
          <div className="am-v2-layout">

            {/* ── Misiones asignadas (izquierda) ── */}
            <div className="am-mis-section">
              <div className="am-mis-section-ttl">
                Misiones asignadas ({misionesActivas.length})
              </div>

              {misionesActivas.length === 0 && (
                <div className="am-mis-empty">
                  Este proyecto no tiene misiones todavía.<br/>
                  Agrega desde la biblioteca de la derecha o crea una personalizada.
                </div>
              )}

              {misionesActivas.map(m => {
                // Estado derivado automáticamente — no lo define el admin
                const pendientes   = m.pendientes  || 0
                const completadas  = m.completadas || 0
                const estado = pendientes > 0 ? "reservada" : completadas > 0 ? "en proceso" : "disponible"
                const blq    = pendientes > 0 || completadas > 0
                const acentoCls = estado === "reservada" ? "reservada" : estado === "en proceso" ? "proceso" : ""
                return (
                  <div key={m.id} className={`am-mis-card ${blq?"bloqueada":""}`}>
                    <div className={`am-mis-acento ${acentoCls}`} />
                    <div className="am-mis-info">
                      <div className="am-mis-nom">{m.titulo}</div>
                      {m.desc && <div className="am-mis-desc-txt">{m.desc}</div>}
                      <div className="am-mis-footer">
                        <span className="am-mis-precio">S/.{Number(m.pago).toLocaleString()}</span>
                        <span className={`am-mis-estado ${estado === "reservada" ? "reservada" : estado === "en proceso" ? "proceso" : "disponible"}`}>
                          {estado}
                        </span>
                        {blq && (
                          <span style={{fontSize:"10px",color:"rgba(255,255,255,.2)"}}>
                            · {m.pendientes||0} pendiente{(m.pendientes||0)!==1?"s":""} · {m.completadas||0} completada{(m.completadas||0)!==1?"s":""}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="am-mis-btns">
                      <button
                        className="am-mis-btn edit"
                        disabled={blq}
                        onClick={() => abrirEditar(m)}
                        title={blq ? "No se puede editar: hay vendedores activos" : "Editar"}
                      >
                        ✎ Editar
                      </button>
                      <button
                        className="am-mis-btn del"
                        disabled={blq}
                        onClick={() => eliminarMision(m.id)}
                        title={blq ? "No se puede eliminar: hay vendedores activos" : "Eliminar"}
                      >
                        ✕ Eliminar
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* ── Biblioteca de plantillas (derecha) ── */}
            <div className="am-lib">
              <div className="am-lib-ttl">Misiones definidas</div>
              <div className="am-lib-search-wrap">
                <span className="am-lib-search-icon">🔍</span>
                <input
                  className="am-lib-search"
                  placeholder="Buscar misión..."
                  value={buscarLib}
                  onChange={e => setBuscarLib(e.target.value)}
                />
              </div>

              <div className="am-lib-list">
                {libFiltradas.length === 0 && (
                  <div className="am-lib-empty">No hay plantillas todavía</div>
                )}
                {libFiltradas.map(pl => {
                  const yaAsignada = misionesActivas.some(m => m.titulo === pl.titulo)
                  return (
                    <div
                      key={pl.id}
                      className={`am-lib-item ${yaAsignada?"ya-asignada":""}`}
                      title={yaAsignada ? "Ya está asignada a este proyecto" : "Clic para agregar"}
                      onClick={() => !yaAsignada && asignarPlantilla(pl)}
                    >
                      <div className="am-lib-info">
                        <div className="am-lib-nom">{pl.titulo}</div>
                        <div className="am-lib-precio">S/.{Number(pl.pago).toLocaleString()}</div>
                      </div>
                      {!yaAsignada && (
                        <button
                          className="am-lib-add"
                          onClick={e => { e.stopPropagation(); asignarPlantilla(pl) }}
                        >
                          + Agregar
                        </button>
                      )}
                      {yaAsignada && (
                        <span style={{fontSize:"9px",color:"rgba(0,243,255,.35)",fontWeight:700}}>✓</span>
                      )}
                    </div>
                  )
                })}
              </div>

              <button
                className="am-lib-nueva-btn"
                onClick={() => { setFormPlan(EMPTY_PLANTILLA); setModal("nueva-plantilla") }}
              >
                + Nueva plantilla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ MODALES ══════════ */}

      {/* Nueva plantilla */}
      {modal === "nueva-plantilla" && (
        <div className="am-ovl" onClick={() => setModal(null)}>
          <div className="am-modal" onClick={e => e.stopPropagation()}>
            <div className="am-modal-t">Nueva plantilla de misión</div>
            <div className="am-modal-f">
              <div className="am-modal-l">Título *</div>
              <input className="am-modal-v" value={formPlan.titulo} onChange={e=>setFormPlan(f=>({...f,titulo:e.target.value}))} placeholder="Ej: Publicar en Facebook" />
            </div>
            <div className="am-modal-f">
              <div className="am-modal-l">Descripción</div>
              <textarea className="am-modal-v" rows={3} value={formPlan.desc} onChange={e=>setFormPlan(f=>({...f,desc:e.target.value}))} placeholder="Qué debe hacer el vendedor..." style={{resize:"vertical"}} />
            </div>
            <div className="am-modal-f">
              <div className="am-modal-l">Precio sugerido (S/.)</div>
              <input className="am-modal-v" type="number" value={formPlan.pago} onChange={e=>setFormPlan(f=>({...f,pago:e.target.value}))} placeholder="40" />
            </div>
            <div className="am-modal-row">
              <button className="am-modal-btn ghost" onClick={() => setModal(null)}>Cancelar</button>
              <button className="am-modal-btn cyan" onClick={guardarPlantilla} disabled={saving || !formPlan.titulo}>
                {saving ? "Guardando..." : "Crear plantilla"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Asignar misión manual */}
      {modal === "asignar-manual" && (
        <div className="am-ovl" onClick={() => setModal(null)}>
          <div className="am-modal" onClick={e => e.stopPropagation()}>
            <div className="am-modal-t">Asignar misión personalizada</div>
            <div className="am-modal-f">
              <div className="am-modal-l">Título *</div>
              <input className="am-modal-v" value={formMis.titulo} onChange={e=>setFormMis(f=>({...f,titulo:e.target.value}))} placeholder="Ej: Grabar reseña en Google" />
            </div>
            <div className="am-modal-f">
              <div className="am-modal-l">Descripción</div>
              <textarea className="am-modal-v" rows={3} value={formMis.desc} onChange={e=>setFormMis(f=>({...f,desc:e.target.value}))} placeholder="Instrucciones para el vendedor..." style={{resize:"vertical"}} />
            </div>
            <div className="am-modal-f">
              <div className="am-modal-l">Pago (S/.) *</div>
              <input className="am-modal-v" type="number" value={formMis.pago} onChange={e=>setFormMis(f=>({...f,pago:e.target.value}))} placeholder="40" />
            </div>
            <div className="am-modal-row">
              <button className="am-modal-btn ghost" onClick={() => setModal(null)}>Cancelar</button>
              <button className="am-modal-btn cyan" onClick={guardarManual} disabled={saving || !formMis.titulo || !formMis.pago}>
                {saving ? "Guardando..." : "Asignar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editar misión asignada */}
      {modal === "editar-mision" && (
        <div className="am-ovl" onClick={() => setModal(null)}>
          <div className="am-modal" onClick={e => e.stopPropagation()}>
            <div className="am-modal-t">Editar misión</div>
            <div className="am-modal-f">
              <div className="am-modal-l">Título *</div>
              <input className="am-modal-v" value={formMis.titulo} onChange={e=>setFormMis(f=>({...f,titulo:e.target.value}))} />
            </div>
            <div className="am-modal-f">
              <div className="am-modal-l">Descripción</div>
              <textarea className="am-modal-v" rows={3} value={formMis.desc} onChange={e=>setFormMis(f=>({...f,desc:e.target.value}))} style={{resize:"vertical"}} />
            </div>
            <div className="am-modal-f">
              <div className="am-modal-l">Pago (S/.) *</div>
              <input className="am-modal-v" type="number" value={formMis.pago} onChange={e=>setFormMis(f=>({...f,pago:e.target.value}))} />
            </div>
            <div className="am-modal-row">
              <button className="am-modal-btn ghost" onClick={() => setModal(null)}>Cancelar</button>
              <button className="am-modal-btn cyan" onClick={guardarEdicion} disabled={saving || !formMis.titulo || !formMis.pago}>
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}