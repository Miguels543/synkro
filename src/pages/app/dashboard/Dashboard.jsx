import { useState, useEffect, useCallback } from "react"
import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc,
  query, where, serverTimestamp, Timestamp
} from "firebase/firestore"
import { db } from "../../../firebase/config"
import { useAuth } from "../../../context/authcontext"

import { CSS } from "./components/dashboardUtils"
import DashboardInicio    from "./DashboardInicio"
import DashboardProyectos from "./DashboardProyectos"
import DashboardMisiones  from "./DashboardMisiones"
import DashboardGuia      from "./DashboardGuia"
import ModalReservar      from "./components/ModalReservar"
import ModalVendido       from "./components/ModalVendido"
import ModalMision        from "./components/ModalMision"

export default function Dashboard() {
  const { user } = useAuth()
  const [tab,     setTab]     = useState("inicio")
  const [sel,     setSel]     = useState(null)
  const [imgIdx,  setImgIdx]  = useState(0)
  const [modal,   setModal]   = useState(null)
  const [misAct,  setMisAct]  = useState(null)
  const [drawer,  setDrawer]  = useState(false)
  const [loading, setLoading] = useState(true)

  const [userData,  setUserData]  = useState(null)
  const [reservas,  setReservas]  = useState([])
  const [catalogo,  setCatalogo]  = useState([])
  const [ventas,    setVentas]    = useState([])
  const [actividad, setActividad] = useState([])

  // ── Carga de datos ──────────────────────────────────────
  const cargarDatos = useCallback(async () => {
    if (!user?.uid) return
    setLoading(true)
    try {
      const uSnap = await getDoc(doc(db, "users", user.uid))
      if (uSnap.exists()) setUserData(uSnap.data())

      const resSnap = await getDocs(
        query(collection(db, "reservas"), where("vendedorUid", "==", user.uid))
      )
      const misReservas = []
      for (const r of resSnap.docs) {
        const rData = { id: r.id, ...r.data() }
        const pSnap = await getDoc(doc(db, "proyectos", rData.proyectoId))
        if (pSnap.exists()) {
          const misionesConEstado = (pSnap.data().misiones || []).map(m => ({
            ...m,
            estado: rData.misionesEstado?.[m.id] || "sin_iniciar",
          }))
          misReservas.push({
            ...rData,
            proyecto: { id: pSnap.id, ...pSnap.data(), misiones: misionesConEstado },
          })
        }
      }
      setReservas(misReservas)

      const misIds  = new Set(misReservas.map(r => r.proyectoId))
      const catSnap = await getDocs(
        query(collection(db, "proyectos"), where("estado", "==", "disponible"))
      )
      setCatalogo(catSnap.docs.filter(d => !misIds.has(d.id)).map(d => ({ id: d.id, ...d.data() })))

      const venSnap = await getDocs(
        query(collection(db, "ventas"), where("vendedorUid", "==", user.uid))
      )
      setVentas(venSnap.docs.map(d => ({ id: d.id, ...d.data() })))

      const actItems = misReservas.map(r => ({
        tipo:   r.estado === "vendido" ? "venta" : "reserva",
        txt:    r.estado === "vendido" ? `Vendiste ${r.proyecto?.nombre}` : `Reservaste ${r.proyecto?.nombre}`,
        tiempo: r.fechaReserva,
        monto:  r.estado === "vendido" ? r.comisionGanada : null,
      }))
      actItems.sort((a, b) => {
        const ta = a.tiempo?.toDate?.() || new Date(a.tiempo || 0)
        const tb = b.tiempo?.toDate?.() || new Date(b.tiempo || 0)
        return tb - ta
      })
      setActividad(actItems.slice(0, 6))

    } catch (e) {
      console.error("Error cargando dashboard:", e)
    } finally {
      setLoading(false)
    }
  }, [user?.uid])

  useEffect(() => { cargarDatos() }, [cargarDatos])

  // ── Helpers de navegación ───────────────────────────────
  const misProyectos = reservas.map(r => ({
    ...r.proyecto,
    reservaId:  r.id,
    estado:     r.estado,
    expiraEn:   r.expiraEn,
    colaDetras: r.colaDetras || 0,
  }))

  const misP = reservas.flatMap(r => r.proyecto?.misiones || []).filter(m => m.estado === "pendiente").length

  const pickProy = (p) => { setSel(p); setImgIdx(0) }
  const prev     = () => setImgIdx(i => (i - 1 + (sel?.imagenes?.length || 1)) % (sel?.imagenes?.length || 1))
  const next     = () => setImgIdx(i => (i + 1) % (sel?.imagenes?.length || 1))
  const cerrar   = () => { setModal(null); setMisAct(null) }

  const inicial = user?.nombre?.[0] || user?.email?.[0]?.toUpperCase() || "V"

  // ── Acciones Firestore ──────────────────────────────────
  const reservarProyecto = async (proyecto) => {
    const yaReservado = reservas.some(r => r.proyectoId === proyecto.id && ["reservado","liberado"].includes(r.estado))
    if (yaReservado) return
    const yaVendido = reservas.some(r => r.proyectoId === proyecto.id && r.estado === "vendido")
    if (yaVendido) return
    try {
      const expiraEn = Timestamp.fromDate(new Date(Date.now() + 6 * 24 * 60 * 60 * 1000))
      await addDoc(collection(db, "reservas"), {
        vendedorUid:    user.uid,
        vendedorNombre: user.nombre || user.email,
        proyectoId:     proyecto.id,
        proyectoNombre: proyecto.nombre,
        estado:         "reservado",
        expiraEn,
        fechaReserva:   serverTimestamp(),
        misionesEstado: {},
        colaDetras:     proyecto.cola || 0,
      })
      await updateDoc(doc(db, "proyectos", proyecto.id), { cola: (proyecto.cola || 0) + 1 })
      await cargarDatos()
      cerrar()
    } catch (e) { console.error("Error al reservar:", e) }
  }

  const marcarVendido = async ({ nombreCliente, contactoCliente, comprobanteUrl, reservaId, proyecto }) => {
    if (ventas.find(v => v.reservaId === reservaId)) return
    try {
      const comision = Math.round((proyecto.precioMin || proyecto.precio || 0) * (proyecto.comision || 20) / 100)
      await addDoc(collection(db, "ventas"), {
        vendedorUid: user.uid, vendedorNombre: user.nombre || user.email,
        proyectoId: proyecto.id, proyectoNombre: proyecto.nombre,
        reservaId, nombreCliente, contactoCliente, comprobanteUrl: comprobanteUrl || "",
        monto: proyecto.precioMin || proyecto.precio || 0, comisionGanada: comision,
        estadoPago: "pendiente", estado: "pendiente_revision", fecha: serverTimestamp(),
      })
      await updateDoc(doc(db, "reservas", reservaId), { estado: "vendido", fechaVenta: serverTimestamp() })
      await updateDoc(doc(db, "users", user.uid), {
        puntos: (userData?.puntos || 0) + 50,
        ventas: (userData?.ventas || 0) + 1,
      })
      await cargarDatos()
      cerrar()
    } catch (e) { console.error("Error al marcar vendido:", e) }
  }

  const completarMision = async ({ mision, reservaId, evidenciaUrl }) => {
    try {
      const reservaRef = doc(db, "reservas", reservaId)
      const rSnap = await getDoc(reservaRef)
      const misionesEstado    = rSnap.data()?.misionesEstado    || {}
      const misionesEvidencia = rSnap.data()?.misionesEvidencia || {}
      misionesEstado[mision.id] = "pendiente"
      if (evidenciaUrl) misionesEvidencia[mision.id] = evidenciaUrl
      await updateDoc(reservaRef, { misionesEstado, misionesEvidencia })
      await cargarDatos()
      cerrar()
    } catch (e) { console.error("Error al completar misión:", e) }
  }

  // ── Render ──────────────────────────────────────────────
  if (loading) return (
    <div className="d">
      <style>{CSS}</style>
      <div className="d-loading"><div className="d-spin" />Cargando tu dashboard…</div>
    </div>
  )

  return (
    <>
      <style>{CSS}</style>

      {/* Topbar mobile */}
      <div className="d-topbar">
        <span className="d-topbar-logo">SYNKRO</span>
        <button className={`d-topbar-ham${drawer ? " open" : ""}`} onClick={() => setDrawer(o => !o)}>
          <span /><span /><span />
        </button>
      </div>
      <div className={`d-overlay${drawer ? " open" : ""}`} onClick={() => setDrawer(false)} />

      <div className="d">
        {/* ── Sidebar ── */}
        <aside className={`dsb${drawer ? " open" : ""}`}>
          <div className="dsb-top">
            <div className="dsb-av">{inicial}</div>
            <div className="dsb-nom">{user?.nombre || user?.email}</div>
            <div className="dsb-rep">
              <span className="dsb-star">★</span>
              <span style={{ color: "rgba(255,255,255,.6)", fontWeight: 600 }}>{userData?.reputacion || "—"}</span>
              <span>reputación</span>
            </div>
          </div>
          <nav className="dsb-nav">
            <div className="dsb-sec">Menú</div>
            {[
              { id:"inicio",    lbl:"Inicio",        ico:"⊞" },
              { id:"proyectos", lbl:"Mis Proyectos",  ico:"◫" },
              { id:"catalogo",  lbl:"Catálogo",       ico:"▣" },
              { id:"misiones",  lbl:"Misiones",       ico:"◎", badge: misP },
              { id:"guia",      lbl:"Guía",           ico:"?" },
            ].map(it => (
              <button
                key={it.id}
                className={`dsb-btn ${tab === it.id ? "on" : ""}`}
                onClick={() => { setTab(it.id); setSel(null); setDrawer(false) }}
              >
                <span>{it.ico}</span>
                {it.lbl}
                {it.badge > 0 && <span className="dsb-badge">{it.badge}</span>}
              </button>
            ))}
          </nav>
          <div className="dsb-pts">
            <div className="dsb-pts-l">Puntos</div>
            <div className="dsb-pts-v">{(userData?.puntos || 0).toLocaleString()}</div>
            <div className="dsb-pts-s">Vendedor</div>
          </div>
        </aside>

        {/* ── Main ── */}
        <main className="dmain">
          {tab === "inicio" && (
            <DashboardInicio
              user={user}
              userData={userData}
              reservas={reservas}
              ventas={ventas}
              actividad={actividad}
              onVerProyecto={(enCurso) => {
                pickProy({ ...enCurso.proyecto, reservaId: enCurso.id, estado: enCurso.estado, expiraEn: enCurso.expiraEn, colaDetras: enCurso.colaDetras })
                setTab("proyectos")
              }}
              onMarcarVendido={(enCurso) => {
                setSel({ ...enCurso.proyecto, reservaId: enCurso.id })
                setModal("vendido")
              }}
              onVerCatalogo={() => setTab("catalogo")}
            />
          )}

          {tab === "proyectos" && (
            <DashboardProyectos
              modo="mis"
              lista={misProyectos}
              sel={sel} onSel={pickProy}
              imgIdx={imgIdx} onPrev={prev} onNext={next} onDot={setImgIdx}
              onVendido={() => setModal("vendido")}
              onReservar={() => setModal("reservar")}
              onVerCatalogo={() => setTab("catalogo")}
            />
          )}

          {tab === "catalogo" && (
            <DashboardProyectos
              modo="catalogo"
              lista={catalogo}
              sel={sel} onSel={pickProy}
              imgIdx={imgIdx} onPrev={prev} onNext={next} onDot={setImgIdx}
              onVendido={() => setModal("vendido")}
              onReservar={() => setModal("reservar")}
            />
          )}

          {tab === "misiones" && (
            <DashboardMisiones
              reservas={reservas}
              onCompletarMision={(m) => { setMisAct(m); setModal("mision") }}
            />
          )}

          {tab === "guia" && <DashboardGuia />}
        </main>
      </div>

      {/* ── Modales ── */}
      {modal && (
        <div className="dovl" onClick={cerrar}>
          <div className="dmod" onClick={e => e.stopPropagation()}>
            {modal === "reservar" && (
              <ModalReservar
                p={sel}
                reservas={reservas}
                onClose={cerrar}
                onConfirm={() => reservarProyecto(sel)}
              />
            )}
            {modal === "vendido" && (
              <ModalVendido
                p={sel}
                onClose={cerrar}
                onConfirm={(data) => marcarVendido({ ...data, reservaId: sel?.reservaId, proyecto: sel })}
                ventaExistente={ventas.find(v => v.reservaId === sel?.reservaId)}
              />
            )}
            {modal === "mision" && misAct && (
              <ModalMision
                m={misAct}
                onClose={cerrar}
                onConfirm={(data) => completarMision({ mision: misAct, reservaId: misAct.reservaId, evidenciaUrl: data?.evidenciaUrl })}
              />
            )}
          </div>
        </div>
      )}
    </>
  )
}