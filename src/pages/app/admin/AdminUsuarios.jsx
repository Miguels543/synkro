import { useState, useEffect } from "react"
import {
  collection, getDocs, updateDoc, doc
} from "firebase/firestore"
import { db } from "../../../firebase/config"

const NIVELES = ["Básico","Plus","Pro","Admin"]

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');
  .au { padding:26px 30px 60px; }
  .au-ttl { font-family:'Syne',sans-serif; font-size:20px; font-weight:800; color:#fff; margin-bottom:3px; }
  .au-sub  { font-size:12px; color:rgba(255,255,255,.28); margin-bottom:22px; }
  .au-toolbar { display:flex; gap:10px; align-items:center; margin-bottom:16px; flex-wrap:wrap; }
  .au-search { flex:1; min-width:200px; background:#0c0f14; border:1px solid rgba(255,255,255,.08); border-radius:9px; padding:8px 14px; color:#fff; font-size:13px; font-family:'Plus Jakarta Sans',sans-serif; outline:none; transition:border-color .16s; }
  .au-search:focus { border-color:rgba(0,243,255,.3); }
  .au-search::placeholder { color:rgba(255,255,255,.2); }
  .au-fil { background:#0c0f14; border:1px solid rgba(255,255,255,.08); border-radius:9px; padding:8px 14px; color:rgba(255,255,255,.5); font-size:12px; font-family:'Plus Jakarta Sans',sans-serif; outline:none; cursor:pointer; appearance:none; padding-right:28px; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='rgba(255,255,255,.3)' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 10px center; }
  .au-fil option { background:#0c0f14; }
  .au-count { font-size:11px; color:rgba(255,255,255,.22); white-space:nowrap; }
  .au-loading { text-align:center; padding:48px; color:rgba(255,255,255,.25); font-size:13px; }
  .au-tabla { background:#0c0f14; border:1px solid rgba(255,255,255,.06); border-radius:11px; overflow:hidden; }
  .au-tabla-hdr { display:grid; grid-template-columns:2fr 1.5fr 1fr 1fr 1fr 1fr 120px; padding:10px 16px; border-bottom:1px solid rgba(255,255,255,.05); font-size:8.5px; letter-spacing:1.5px; text-transform:uppercase; color:rgba(255,255,255,.2); }
  .au-row { display:grid; grid-template-columns:2fr 1.5fr 1fr 1fr 1fr 1fr 120px; padding:12px 16px; border-bottom:1px solid rgba(255,255,255,.03); align-items:center; transition:background .13s; }
  .au-row:last-child { border-bottom:none; }
  .au-row:hover { background:rgba(255,255,255,.02); }
  .au-av { width:30px; height:30px; border-radius:8px; flex-shrink:0; background:linear-gradient(135deg,rgba(0,243,255,.12),rgba(168,85,247,.12)); border:1px solid rgba(0,243,255,.15); display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-size:12px; font-weight:800; color:#00f3ff; }
  .au-nom-wrap { display:flex; align-items:center; gap:9px; }
  .au-nom { font-size:13px; font-weight:600; color:#fff; }
  .au-email { font-size:10px; color:rgba(255,255,255,.3); margin-top:1px; }
  .au-val { font-size:12px; color:rgba(255,255,255,.5); }
  .au-val.green { color:#10b981; font-family:'Syne',sans-serif; font-weight:700; }
  .au-chip { display:inline-flex; align-items:center; gap:4px; font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; padding:3px 9px; border-radius:20px; }
  .au-chip.activo     { background:rgba(16,185,129,.09); color:#10b981; border:1px solid rgba(16,185,129,.18); }
  .au-chip.suspendido { background:rgba(239,68,68,.09);  color:#ef4444; border:1px solid rgba(239,68,68,.18); }
  .au-chip.admin      { background:rgba(239,68,68,.09);  color:#ef4444; border:1px solid rgba(239,68,68,.18); }
  .au-acciones { display:flex; gap:6px; }
  .au-accion-btn { padding:5px 10px; border-radius:6px; font-size:11px; font-weight:600; cursor:pointer; border:none; font-family:'Plus Jakarta Sans',sans-serif; transition:all .15s; }
  .au-accion-btn.ghost { background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.09); color:rgba(255,255,255,.4); }
  .au-accion-btn.ghost:hover { border-color:rgba(255,255,255,.2); color:#fff; }
  .au-accion-btn.red   { background:rgba(239,68,68,.08); border:1px solid rgba(239,68,68,.18); color:#ef4444; }
  .au-accion-btn.red:hover { background:rgba(239,68,68,.15); }
  .au-accion-btn.green { background:rgba(16,185,129,.08); border:1px solid rgba(16,185,129,.18); color:#10b981; }
  .au-accion-btn.green:hover { background:rgba(16,185,129,.15); }
  .au-ovl { position:fixed; inset:0; z-index:9000; background:rgba(0,0,0,.8); display:flex; align-items:center; justify-content:center; backdrop-filter:blur(5px); }
  .au-mod { background:#0e1319; border:1px solid rgba(0,243,255,.12); border-radius:15px; padding:28px; max-width:420px; width:92%; }
  .au-mod-t { font-family:'Syne',sans-serif; font-size:17px; font-weight:800; color:#fff; margin-bottom:16px; }
  .au-mod-field { margin-bottom:12px; }
  .au-mod-l { font-size:10px; color:rgba(255,255,255,.3); margin-bottom:5px; }
  .au-mod-v { width:100%; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); border-radius:8px; padding:9px 12px; color:#fff; font-size:13px; font-family:'Plus Jakarta Sans',sans-serif; outline:none; }
  .au-mod-v:focus { border-color:rgba(0,243,255,.3); }
  select.au-mod-v option { background:#0e1319; }
  .au-mod-row { display:flex; gap:8px; margin-top:16px; }
  .au-mod-btn { flex:1; padding:10px; border-radius:8px; font-size:13px; font-weight:700; cursor:pointer; border:none; font-family:'Plus Jakarta Sans',sans-serif; transition:all .16s; }
  .au-mod-btn.ghost { background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.09); color:rgba(255,255,255,.4); }
  .au-mod-btn.cyan  { background:#00f3ff; color:#000; }
  .au-mod-btn.cyan:hover { background:#7fffff; }
  .au-mod-btn:disabled { opacity:.4; cursor:not-allowed; }
`

export default function AdminUsuarios() {
  const [usuarios,  setUsuarios]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [saving,    setSaving]    = useState(false)
  const [buscar,    setBuscar]    = useState("")
  const [filtroRol, setFiltroRol] = useState("todos")
  const [modal,     setModal]     = useState(null)
  const [editForm,  setEditForm]  = useState({})

  useEffect(() => {
    const cargar = async () => {
      try {
        const snap = await getDocs(collection(db, "users"))
        setUsuarios(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [])

  const filtrados = usuarios.filter(u => {
    const match = u.nombre?.toLowerCase().includes(buscar.toLowerCase()) ||
                  u.email?.toLowerCase().includes(buscar.toLowerCase())
    if (filtroRol !== "todos" && u.rol !== filtroRol) return false
    return match
  })

  const toggleEstado = async (u) => {
    const nuevoEstado = u.estado === "activo" ? "suspendido" : "activo"
    try {
      await updateDoc(doc(db, "users", u.id), { estado: nuevoEstado })
      setUsuarios(us => us.map(x => x.id === u.id ? { ...x, estado: nuevoEstado } : x))
    } catch (e) {
      alert("Error: " + e.message)
    }
    setModal(null)
  }

  const guardarEdicion = async () => {
    if (!modal?.user) return
    try {
      setSaving(true)
      await updateDoc(doc(db, "users", modal.user.id), {
        nombre: editForm.nombre,
        nivel:  editForm.nivel,
        rol:    editForm.rol,
      })
      setUsuarios(us => us.map(x => x.id === modal.user.id ? { ...x, ...editForm } : x))
      setModal(null)
    } catch (e) {
      alert("Error: " + e.message)
    } finally {
      setSaving(false)
    }
  }

  const abrirEditar = (u) => {
    setEditForm({ nombre: u.nombre, nivel: u.nivel || "Básico", rol: u.rol || "vendedor" })
    setModal({ tipo:"editar", user: u })
  }

  return (
    <div className="au">
      <style>{CSS}</style>
      <div className="au-ttl">Vendedores</div>
      <div className="au-sub">Gestión de usuarios registrados en la plataforma</div>

      <div className="au-toolbar">
        <input className="au-search" placeholder="Buscar por nombre o email..." value={buscar} onChange={e=>setBuscar(e.target.value)} />
        <select className="au-fil" value={filtroRol} onChange={e=>setFiltroRol(e.target.value)}>
          <option value="todos">Todos los roles</option>
          <option value="vendedor">Vendedores</option>
          <option value="admin">Admins</option>
        </select>
        <span className="au-count">{filtrados.length} usuarios</span>
      </div>

      {loading && <div className="au-loading">Cargando usuarios...</div>}

      {!loading && (
        <div className="au-tabla">
          <div className="au-tabla-hdr">
            <span>Usuario</span><span>Contacto</span><span>Nivel</span>
            <span>Ventas</span><span>Puntos</span><span>Estado</span><span>Acciones</span>
          </div>
          {filtrados.length === 0 && (
            <div style={{ padding:"32px", textAlign:"center", color:"rgba(255,255,255,.2)", fontSize:"13px" }}>
              No hay usuarios
            </div>
          )}
          {filtrados.map(u => (
            <div key={u.id} className="au-row">
              <div className="au-nom-wrap">
                <div className="au-av">{u.nombre?.[0] || "?"}</div>
                <div>
                  <div className="au-nom">{u.nombre}</div>
                  <div className="au-email">{u.usuario || u.ingreso}</div>
                </div>
              </div>
              <div>
                <div className="au-val">{u.email}</div>
                <div className="au-email">{u.whatsapp || u.telefono}</div>
              </div>
              <div className="au-val">{u.nivel || "Básico"}</div>
              <div className="au-val green">{u.ventas || 0}</div>
              <div className="au-val">{u.puntos || 0}</div>
              <div>
                <span className={`au-chip ${u.rol === "admin" ? "admin" : (u.estado || "activo")}`}>
                  {u.rol === "admin" ? "Admin" : (u.estado || "activo")}
                </span>
              </div>
              <div className="au-acciones">
                <button className="au-accion-btn ghost" onClick={()=>abrirEditar(u)}>Editar</button>
                {u.rol !== "admin" && (
                  <button
                    className={`au-accion-btn ${(u.estado||"activo") === "activo" ? "red" : "green"}`}
                    onClick={()=>setModal({ tipo:"confirmar", user: u })}
                  >
                    {(u.estado||"activo") === "activo" ? "Suspender" : "Activar"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* modal editar */}
      {modal?.tipo === "editar" && (
        <div className="au-ovl" onClick={()=>setModal(null)}>
          <div className="au-mod" onClick={e=>e.stopPropagation()}>
            <div className="au-mod-t">Editar — {modal.user.nombre}</div>
            <div className="au-mod-field">
              <div className="au-mod-l">Nombre</div>
              <input className="au-mod-v" value={editForm.nombre} onChange={e=>setEditForm(f=>({...f,nombre:e.target.value}))} />
            </div>
            <div className="au-mod-field">
              <div className="au-mod-l">Nivel</div>
              <select className="au-mod-v" value={editForm.nivel} onChange={e=>setEditForm(f=>({...f,nivel:e.target.value}))} style={{cursor:"pointer",appearance:"none"}}>
                {NIVELES.map(n=><option key={n}>{n}</option>)}
              </select>
            </div>
            <div className="au-mod-field">
              <div className="au-mod-l">Rol</div>
              <select className="au-mod-v" value={editForm.rol} onChange={e=>setEditForm(f=>({...f,rol:e.target.value}))} style={{cursor:"pointer",appearance:"none"}}>
                <option value="vendedor">Vendedor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="au-mod-row">
              <button className="au-mod-btn ghost" onClick={()=>setModal(null)}>Cancelar</button>
              <button className="au-mod-btn cyan" onClick={guardarEdicion} disabled={saving}>
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* modal confirmar */}
      {modal?.tipo === "confirmar" && (
        <div className="au-ovl" onClick={()=>setModal(null)}>
          <div className="au-mod" onClick={e=>e.stopPropagation()}>
            <div className="au-mod-t">
              {(modal.user.estado||"activo") === "activo" ? "Suspender" : "Activar"} — {modal.user.nombre}
            </div>
            <p style={{ fontSize:13, color:"rgba(255,255,255,.4)", lineHeight:1.7, marginBottom:16 }}>
              {(modal.user.estado||"activo") === "activo"
                ? "El vendedor no podrá acceder a la plataforma hasta que lo reactives."
                : "El vendedor recuperará acceso completo a la plataforma."
              }
            </p>
            <div className="au-mod-row">
              <button className="au-mod-btn ghost" onClick={()=>setModal(null)}>Cancelar</button>
              <button
                className="au-mod-btn"
                style={{ background:(modal.user.estado||"activo")==="activo"?"rgba(239,68,68,.15)":"#10b981", color:(modal.user.estado||"activo")==="activo"?"#ef4444":"#fff", border:(modal.user.estado||"activo")==="activo"?"1px solid rgba(239,68,68,.3)":"none" }}
                onClick={()=>toggleEstado(modal.user)}
              >
                {(modal.user.estado||"activo") === "activo" ? "Suspender" : "Activar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}