import { useState, useEffect } from "react"
import { doc, getDoc, updateDoc, collection, getDocs, query, where } from "firebase/firestore"
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth"
import { db, auth } from "../../../firebase/config"
import { useAuth } from "../../../context/authcontext"

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .pf {
    background: #050709;
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: #d1d5db;
    min-height: 100vh;
    margin-top: 65px;
    padding-bottom: 80px;
  }

  /* HERO */
  .pf-hero {
    position: relative;
    padding: 32px 36px 28px;
    border-bottom: 1px solid rgba(255,255,255,.05);
    overflow: hidden;
  }
  .pf-hero-bg {
    position: absolute; inset: 0; z-index: 0;
    background: radial-gradient(ellipse 60% 100% at 10% 50%, rgba(0,243,255,.04) 0%, transparent 70%),
                radial-gradient(ellipse 40% 80% at 90% 20%, rgba(168,85,247,.03) 0%, transparent 70%);
  }
  .pf-hero-inner { position: relative; z-index: 1; display: flex; align-items: center; gap: 22px; }

  .pf-av-wrap { position: relative; flex-shrink: 0; }
  .pf-av {
    width: 72px; height: 72px; border-radius: 16px;
    background: linear-gradient(135deg, rgba(0,243,255,.15), rgba(168,85,247,.15));
    border: 1px solid rgba(0,243,255,.2);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; color: #00f3ff;
  }

  .pf-id { flex: 1; }
  .pf-nom { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; color: #fff; margin-bottom: 4px; }
  .pf-meta { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
  .pf-nivel {
    font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;
    padding: 3px 10px; border-radius: 20px;
    background: rgba(0,243,255,.08); border: 1px solid rgba(0,243,255,.15); color: #00f3ff;
  }
  .pf-nivel.admin {
    background: rgba(239,68,68,.08); border-color: rgba(239,68,68,.2); color: #ef4444;
  }
  .pf-rep { display: flex; align-items: center; gap: 5px; font-size: 12px; color: rgba(255,255,255,.4); }
  .pf-rep-v { color: #f59e0b; font-weight: 700; font-size: 13px; }
  .pf-stars { color: #f59e0b; font-size: 11px; letter-spacing: 1px; }
  .pf-ingreso { font-size: 11px; color: rgba(255,255,255,.22); }

  .pf-hero-right { margin-left: auto; }
  .pf-pts-badge {
    background: rgba(0,243,255,.05); border: 1px solid rgba(0,243,255,.1);
    border-radius: 10px; padding: 10px 16px; text-align: right;
  }
  .pf-pts-v { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800; color: #00f3ff; line-height: 1; }
  .pf-pts-l { font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: rgba(0,243,255,.35); margin-top: 2px; }

  /* TABS */
  .pf-tabs {
    display: flex; gap: 2px;
    padding: 14px 36px 0;
    border-bottom: 1px solid rgba(255,255,255,.05);
  }
  .pf-tab {
    padding: 9px 18px; border-radius: 8px 8px 0 0; font-size: 12px; font-weight: 600;
    cursor: pointer; border: none; background: transparent;
    color: rgba(255,255,255,.3); font-family: 'Plus Jakarta Sans', sans-serif;
    transition: all .16s; position: relative; bottom: -1px;
  }
  .pf-tab:hover { color: rgba(255,255,255,.6); }
  .pf-tab.on {
    background: #0c0f14; color: #fff;
    border: 1px solid rgba(255,255,255,.07); border-bottom-color: #0c0f14;
  }

  /* BODY */
  .pf-body { padding: 24px 36px; }
  .pf-loading { text-align: center; padding: 60px; color: rgba(255,255,255,.2); font-size: 13px; }

  /* STATS */
  .pf-stats {
    display: grid; grid-template-columns: repeat(5, 1fr); gap: 11px; margin-bottom: 18px;
  }
  .pf-stat {
    background: #0c0f14; border: 1px solid rgba(255,255,255,.05);
    border-radius: 11px; padding: 15px 16px; position: relative; overflow: hidden;
  }
  .pf-stat::after { content:''; position:absolute; top:0; left:0; right:0; height:1.5px; }
  .pf-stat.c1::after { background: linear-gradient(90deg,#00f3ff,transparent); }
  .pf-stat.c2::after { background: linear-gradient(90deg,#10b981,transparent); }
  .pf-stat.c3::after { background: linear-gradient(90deg,#f59e0b,transparent); }
  .pf-stat.c4::after { background: linear-gradient(90deg,#a855f7,transparent); }
  .pf-stat.c5::after { background: linear-gradient(90deg,#ef4444,transparent); }
  .pf-stat-l { font-size: 8.5px; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(255,255,255,.22); margin-bottom: 7px; }
  .pf-stat-v { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; color: #fff; line-height: 1; margin-bottom: 3px; }
  .pf-stat-s { font-size: 10px; color: rgba(255,255,255,.22); }

  /* GRAFICA */
  .pf-grafica {
    background: #0c0f14; border: 1px solid rgba(255,255,255,.06);
    border-radius: 12px; padding: 18px 20px; margin-bottom: 18px;
  }
  .pf-grafica-hdr { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
  .pf-grafica-t { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 800; color: #fff; }
  .pf-grafica-s { font-size: 11px; color: rgba(255,255,255,.25); }
  .pf-bars { display: flex; align-items: flex-end; gap: 10px; height: 100px; }
  .pf-bar-wrap { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; height: 100%; justify-content: flex-end; }
  .pf-bar { width: 100%; border-radius: 5px 5px 0 0; background: linear-gradient(to top, rgba(0,243,255,.6), rgba(0,243,255,.2)); min-height: 4px; }
  .pf-bar:hover { background: linear-gradient(to top, #00f3ff, rgba(0,243,255,.4)); }
  .pf-bar-v { font-family: 'Syne', sans-serif; font-size: 10px; font-weight: 800; color: rgba(255,255,255,.5); }
  .pf-bar-mes { font-size: 9px; color: rgba(255,255,255,.25); }

  /* RENDIMIENTO */
  .pf-rend { display: grid; grid-template-columns: 1fr 1fr; gap: 11px; margin-bottom: 18px; }
  .pf-rend-box { background: #0c0f14; border: 1px solid rgba(255,255,255,.06); border-radius: 11px; padding: 16px 18px; }
  .pf-rend-t { font-size: 9px; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(255,255,255,.22); margin-bottom: 12px; }
  .pf-rend-v { font-family: 'Syne', sans-serif; font-size: 32px; font-weight: 800; line-height: 1; margin-bottom: 6px; }
  .pf-rend-s { font-size: 11px; color: rgba(255,255,255,.3); }
  .pf-progress { height: 4px; background: rgba(255,255,255,.06); border-radius: 2px; margin-top: 10px; overflow: hidden; }
  .pf-progress-fill { height: 100%; border-radius: 2px; }

  /* ACTIVIDAD */
  .pf-act-box { background: #0c0f14; border: 1px solid rgba(255,255,255,.06); border-radius: 11px; overflow: hidden; }
  .pf-act-hdr { padding: 13px 16px; border-bottom: 1px solid rgba(255,255,255,.04); font-size: 11px; font-weight: 600; color: rgba(255,255,255,.4); }
  .pf-act-row { padding: 10px 16px; border-bottom: 1px solid rgba(255,255,255,.03); display: flex; gap: 10px; align-items: flex-start; }
  .pf-act-row:last-child { border-bottom: none; }
  .pf-act-ico { width: 26px; height: 26px; border-radius: 7px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 11px; }
  .pf-act-txt { font-size: 12px; color: rgba(255,255,255,.5); line-height: 1.4; }
  .pf-act-t { font-size: 10px; color: rgba(255,255,255,.2); margin-top: 2px; }
  .pf-act-m { margin-left: auto; font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700; color: #10b981; flex-shrink: 0; }

  /* COBROS */
  .pf-cobro-hdr {
    background: #0c0f14; border: 1px solid rgba(255,255,255,.06);
    border-radius: 11px; padding: 16px 18px; margin-bottom: 14px;
    display: flex; align-items: center; justify-content: space-between; gap: 16px;
  }
  .pf-cobro-t { font-size: 9px; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(255,255,255,.22); margin-bottom: 6px; }
  .pf-cobro-met { display: inline-flex; align-items: center; gap: 8px; background: rgba(16,185,129,.07); border: 1px solid rgba(16,185,129,.14); border-radius: 8px; padding: 8px 14px; }
  .pf-cobro-ico { font-size: 18px; }
  .pf-cobro-nom { font-size: 13px; font-weight: 700; color: #fff; }
  .pf-cobro-num { font-size: 11px; color: rgba(255,255,255,.35); margin-top: 1px; }

  .pf-tabla { background: #0c0f14; border: 1px solid rgba(255,255,255,.06); border-radius: 11px; overflow: hidden; }
  .pf-tabla-hdr { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; padding: 10px 16px; border-bottom: 1px solid rgba(255,255,255,.05); font-size: 8.5px; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(255,255,255,.2); }
  .pf-tabla-row { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,.03); align-items: center; transition: background .13s; }
  .pf-tabla-row:last-child { border-bottom: none; }
  .pf-tabla-row:hover { background: rgba(255,255,255,.02); }
  .pf-tabla-nom { font-size: 12.5px; color: rgba(255,255,255,.65); font-weight: 500; }
  .pf-tabla-monto { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 800; color: #10b981; }
  .pf-tabla-fecha { font-size: 11px; color: rgba(255,255,255,.3); }

  /* COMPROBANTES */
  .pf-comp-card { background: #0c0f14; border: 1px solid rgba(255,255,255,.06); border-radius: 11px; padding: 14px 16px; margin-bottom: 10px; display: flex; align-items: center; gap: 14px; }
  .pf-comp-ico { width: 38px; height: 38px; border-radius: 9px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 16px; }
  .pf-comp-body { flex: 1; min-width: 0; }
  .pf-comp-nom { font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 2px; }
  .pf-comp-cli { font-size: 11px; color: rgba(255,255,255,.3); }
  .pf-comp-right { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
  .pf-comp-monto { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 800; color: rgba(255,255,255,.6); }
  .pf-comp-fecha { font-size: 10px; color: rgba(255,255,255,.22); }

  /* CUENTA */
  .pf-cuenta-box { background: #0c0f14; border: 1px solid rgba(255,255,255,.06); border-radius: 11px; padding: 18px 20px; }
  .pf-cuenta-box-t { font-size: 9px; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(255,255,255,.22); margin-bottom: 16px; padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,.05); display: flex; justify-content: space-between; align-items: center; }
  .pf-field { margin-bottom: 14px; }
  .pf-field:last-child { margin-bottom: 0; }
  .pf-field-l { font-size: 10px; color: rgba(255,255,255,.3); margin-bottom: 5px; }
  .pf-field-v { width: 100%; background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.07); border-radius: 8px; padding: 9px 12px; color: #fff; font-size: 13px; font-family: 'Plus Jakarta Sans', sans-serif; outline: none; transition: border-color .16s; }
  .pf-field-v:focus { border-color: rgba(0,243,255,.3); }
  .pf-field-v:disabled { color: rgba(255,255,255,.35); cursor: not-allowed; }
  .pf-field-v::placeholder { color: rgba(255,255,255,.16); }
  select.pf-field-v option { background: #0c0f14; }

  .pf-save { margin-top: 14px; width: 100%; padding: 10px; border-radius: 8px; background: #00f3ff; color: #000; font-size: 13px; font-weight: 700; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: background .16s; }
  .pf-save:hover { background: #7fffff; }
  .pf-save:disabled { background: rgba(0,243,255,.25); color: rgba(0,0,0,.4); cursor: not-allowed; }

  .pf-edit-btn { background: rgba(0,243,255,.08); border: 1px solid rgba(0,243,255,.15); border-radius: 6px; padding: 3px 10px; font-size: 11px; font-weight: 700; color: #00f3ff; cursor: pointer; font-family: inherit; }
  .pf-cancel-btn { background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.1); border-radius: 6px; padding: 3px 10px; font-size: 11px; font-weight: 700; color: rgba(255,255,255,.45); cursor: pointer; font-family: inherit; }

  .pf-chip { display: inline-flex; align-items: center; gap: 4px; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px; padding: 3px 9px; border-radius: 20px; }
  .pf-chip.ok  { background: rgba(16,185,129,.09); color: #10b981; border: 1px solid rgba(16,185,129,.18); }
  .pf-chip.pen { background: rgba(245,158,11,.09); color: #f59e0b; border: 1px solid rgba(245,158,11,.18); }
  .pf-chip.rej { background: rgba(239,68,68,.09); color: #ef4444; border: 1px solid rgba(239,68,68,.18); }

  .pf-sec-t { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 800; color: #fff; margin-bottom: 14px; display: flex; align-items: center; gap: 10px; }
  .pf-sec-t::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,.05); }

  .pf-error { background: rgba(239,68,68,.07); border: 1px solid rgba(239,68,68,.15); border-radius: 8px; padding: 10px 14px; font-size: 12px; color: rgba(239,68,68,.8); margin-bottom: 10px; }

  .pf-toast { position: fixed; bottom: 24px; right: 24px; z-index: 9999; background: #10b981; color: #fff; padding: 10px 18px; border-radius: 10px; font-size: 13px; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif; box-shadow: 0 4px 20px rgba(16,185,129,.3); animation: tst .3s ease; }
  @keyframes tst { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
`

const actIco = {
  venta:   { bg:"rgba(16,185,129,.1)",  ic:"v" },
  mision:  { bg:"rgba(0,243,255,.08)",  ic:"o" },
  reserva: { bg:"rgba(245,158,11,.08)", ic:"r" },
  expiro:  { bg:"rgba(239,68,68,.08)",  ic:"x" },
}

const compIco = {
  aprobado:  { bg:"rgba(16,185,129,.1)",  ic:"v", chip:"ok"  },
  pendiente: { bg:"rgba(245,158,11,.08)", ic:"p", chip:"pen" },
  rechazado: { bg:"rgba(239,68,68,.08)",  ic:"x", chip:"rej" },
}

export default function Perfil() {
  const { user } = useAuth()
  const rol = user?.rol

  const [loading,    setLoading]    = useState(true)
  const [userData,   setUserData]   = useState(null)
  const [ventas,     setVentas]     = useState([])
  const [pagos,      setPagos]      = useState([])
  const [tab,        setTab]        = useState("resumen")
  const [toast,      setToast]      = useState(false)
  const [pwError,    setPwError]    = useState("")

  // edicion
  const [editPersonal, setEditPersonal] = useState(false)
  const [editPw,       setEditPw]       = useState(false)
  const [tmpPersonal,  setTmpPersonal]  = useState({})
  const [pwActual,     setPwActual]     = useState("")
  const [pwNueva,      setPwNueva]      = useState("")
  const [pwConf,       setPwConf]       = useState("")
  const [savingP,      setSavingP]      = useState(false)
  const [savingPw,     setSavingPw]     = useState(false)

  // metodos de cobro
  const [metodos,     setMetodos]     = useState([])
  const [agregando,   setAgregando]   = useState(false)
  const [nuevoMetodo, setNuevoMetodo] = useState({ tipo:"Yape", numero:"", banco:"BCP" })

  const showToast = () => { setToast(true); setTimeout(() => setToast(false), 2500) }

  // ── Cargar datos ─────────────────────────
  useEffect(() => {
    if (!user) return
    const cargar = async () => {
      try {
        const snap = await getDoc(doc(db, "users", user.uid))
        if (snap.exists()) {
          const data = { id: snap.id, ...snap.data() }
          setUserData(data)
          setTmpPersonal({ nombre: data.nombre || "", email: data.email || "", telefono: data.whatsapp || "" })
          setMetodos(data.metodosCobro || [])
        }

        if (rol === "vendedor") {
          const snapVentas = await getDocs(query(collection(db, "ventas"), where("vendedorId", "==", user.uid)))
          setVentas(snapVentas.docs.map(d => ({ id: d.id, ...d.data() })))

          const snapPagos = await getDocs(query(collection(db, "pagos"), where("vendedorId", "==", user.uid)))
          setPagos(snapPagos.docs.map(d => ({ id: d.id, ...d.data() })))
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [user])

  // ── Guardar datos personales ─────────────
  const guardarPersonal = async () => {
    try {
      setSavingP(true)
      await updateDoc(doc(db, "users", user.uid), {
        nombre:    tmpPersonal.nombre,
        email:     tmpPersonal.email,
        whatsapp:  tmpPersonal.telefono,
      })
      setUserData(d => ({ ...d, nombre: tmpPersonal.nombre, email: tmpPersonal.email, whatsapp: tmpPersonal.telefono }))
      setEditPersonal(false)
      showToast()
    } catch (e) {
      console.error(e)
    } finally {
      setSavingP(false)
    }
  }

  // ── Cambiar contraseña ────────────────────
  const guardarPw = async () => {
    if (pwNueva !== pwConf) { setPwError("Las contraseñas no coinciden"); return }
    if (pwNueva.length < 6)  { setPwError("Minimo 6 caracteres"); return }
    try {
      setSavingPw(true)
      setPwError("")
      const credential = EmailAuthProvider.credential(user.email, pwActual)
      await reauthenticateWithCredential(auth.currentUser, credential)
      await updatePassword(auth.currentUser, pwNueva)
      setPwActual(""); setPwNueva(""); setPwConf("")
      setEditPw(false)
      showToast()
    } catch (e) {
      setPwError(e.code === "auth/wrong-password" ? "Contrasena actual incorrecta" : e.message)
    } finally {
      setSavingPw(false)
    }
  }

  // ── Metodos de cobro ──────────────────────
  const agregarMetodo = async () => {
    if (!nuevoMetodo.numero) return
    const nuevo = { id: `m${Date.now()}`, ...nuevoMetodo, principal: metodos.length === 0 }
    const nuevos = [...metodos, nuevo]
    setMetodos(nuevos)
    await updateDoc(doc(db, "users", user.uid), { metodosCobro: nuevos })
    setNuevoMetodo({ tipo:"Yape", numero:"", banco:"BCP" })
    setAgregando(false)
    showToast()
  }

  const eliminarMetodo = async (id) => {
    const nuevos = metodos.filter(m => m.id !== id)
    setMetodos(nuevos)
    await updateDoc(doc(db, "users", user.uid), { metodosCobro: nuevos })
  }

  const hacerPrincipal = async (id) => {
    const nuevos = metodos.map(m => ({ ...m, principal: m.id === id }))
    setMetodos(nuevos)
    await updateDoc(doc(db, "users", user.uid), { metodosCobro: nuevos })
  }

  // ── Stats vendedor ────────────────────────
  const ventasAprobadas  = ventas.filter(v => v.estado === "aprobado")
  const totalCobrado     = pagos.filter(p => p.estado === "pagado").reduce((a, p) => a + Number(p.monto||0), 0)
  const totalPendiente   = pagos.filter(p => p.estado === "pendiente").reduce((a, p) => a + Number(p.monto||0), 0)
  const misionesOk       = userData?.misionesCompletadas || 0
  const expirados        = userData?.reservasExpiradas   || 0
  const tasaCierre       = ventas.length > 0 ? Math.round((ventasAprobadas.length / ventas.length) * 100) : 0
  const racha            = userData?.racha || 0

  // grafica últimos 7 meses
  const ahora = new Date()
  const grafica = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(ahora.getFullYear(), ahora.getMonth() - (6 - i), 1)
    const mes = d.toLocaleString("es-PE", { month: "short" })
    const comision = ventasAprobadas
      .filter(v => {
        const f = v.fecha?.toDate ? v.fecha.toDate() : new Date(v.fecha)
        return f.getMonth() === d.getMonth() && f.getFullYear() === d.getFullYear()
      })
      .reduce((a, v) => a + Number(v.comision||0), 0)
    return { mes, comision }
  })
  const maxComision = Math.max(...grafica.map(g => g.comision), 1)

  const inicial = userData?.nombre?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"

  if (loading) return (
    <div className="pf">
      <style>{CSS}</style>
      <div className="pf-loading">Cargando perfil...</div>
    </div>
  )

  // ── TABS según rol ────────────────────────
  const TABS_VENDEDOR = [
    { id:"resumen",      lbl:"Resumen"      },
    { id:"cobros",       lbl:"Cobros"       },
    { id:"comprobantes", lbl:"Comprobantes" },
    { id:"cuenta",       lbl:"Mi cuenta"    },
  ]
  const TABS_ADMIN = [
    { id:"cuenta", lbl:"Mi cuenta" },
  ]
  const TABS = rol === "admin" ? TABS_ADMIN : TABS_VENDEDOR

  const formatFecha = (f) => {
    if (!f) return "—"
    if (f?.toDate) return f.toDate().toLocaleDateString("es-PE", { day:"numeric", month:"short", year:"numeric" })
    return f
  }

  return (
    <div className="pf">
      <style>{CSS}</style>

      {/* HERO */}
      <div className="pf-hero">
        <div className="pf-hero-bg" />
        <div className="pf-hero-inner">
          <div className="pf-av-wrap">
            <div className="pf-av">{inicial}</div>
          </div>
          <div className="pf-id">
            <div className="pf-nom">{userData?.nombre || user?.email}</div>
            <div className="pf-meta">
              <span className={`pf-nivel ${rol === "admin" ? "admin" : ""}`}>
                {rol === "admin" ? "Administrador" : (userData?.nivel || "Vendedor")}
              </span>
              {rol === "vendedor" && userData?.reputacion && (
                <span className="pf-rep">
                  <span className="pf-rep-v">{userData.reputacion}</span>
                  <span className="pf-stars">
                    {Array.from({ length: 5 }, (_, i) => i < Math.round(userData.reputacion) ? "star" : "star_empty").map((s, i) =>
                      <span key={i}>{s === "star" ? "★" : "☆"}</span>
                    )}
                  </span>
                  <span>reputacion</span>
                </span>
              )}
              <span className="pf-ingreso">
                Miembro desde {userData?.createdAt?.toDate
                  ? userData.createdAt.toDate().toLocaleDateString("es-PE", { month:"long", year:"numeric" })
                  : "—"}
              </span>
            </div>
          </div>
          {rol === "vendedor" && (
            <div className="pf-hero-right">
              <div className="pf-pts-badge">
                <div className="pf-pts-v">{(userData?.puntos || 0).toLocaleString()}</div>
                <div className="pf-pts-l">Puntos</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* TABS */}
      <div className="pf-tabs">
        {TABS.map(t => (
          <button key={t.id} className={`pf-tab ${tab === t.id ? "on" : ""}`} onClick={() => setTab(t.id)}>
            {t.lbl}
          </button>
        ))}
      </div>

      {/* BODY */}
      <div className="pf-body">

        {/* ── RESUMEN (solo vendedor) ── */}
        {tab === "resumen" && rol === "vendedor" && (
          <>
            <div className="pf-stats">
              {[
                { cls:"c1", l:"Ventas totales",       v: ventasAprobadas.length,              s:"Desde que ingresaste"  },
                { cls:"c2", l:"Comisiones cobradas",   v:`S/.${totalCobrado.toLocaleString()}`, s:"Acumulado total"       },
                { cls:"c3", l:"Pendiente de cobro",    v:`S/.${totalPendiente.toLocaleString()}`,s:"En revision"          },
                { cls:"c4", l:"Misiones completadas",  v: misionesOk,                          s:"Con pago aprobado"     },
                { cls:"c5", l:"Reservas expiradas",    v: expirados,                           s:"Afectaron reputacion"  },
              ].map((s,i) => (
                <div key={i} className={`pf-stat ${s.cls}`}>
                  <div className="pf-stat-l">{s.l}</div>
                  <div className="pf-stat-v">{s.v}</div>
                  <div className="pf-stat-s">{s.s}</div>
                </div>
              ))}
            </div>

            <div className="pf-grafica">
              <div className="pf-grafica-hdr">
                <div className="pf-grafica-t">Comisiones por mes</div>
                <div className="pf-grafica-s">Ultimos 7 meses</div>
              </div>
              <div className="pf-bars">
                {grafica.map((g, i) => (
                  <div key={i} className="pf-bar-wrap">
                    <div className="pf-bar-v">{g.comision > 0 ? `S/.${g.comision}` : ""}</div>
                    <div className="pf-bar" style={{ height:`${(g.comision/maxComision)*80 + (g.comision>0?4:0)}px` }} />
                    <div className="pf-bar-mes">{g.mes}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pf-rend">
              <div className="pf-rend-box">
                <div className="pf-rend-t">Tasa de cierre</div>
                <div className="pf-rend-v" style={{ color:"#10b981" }}>{tasaCierre}%</div>
                <div className="pf-rend-s">De tus reservas terminaron en venta</div>
                <div className="pf-progress">
                  <div className="pf-progress-fill" style={{ width:`${tasaCierre}%`, background:"#10b981" }} />
                </div>
              </div>
              <div className="pf-rend-box">
                <div className="pf-rend-t">Racha activa</div>
                <div className="pf-rend-v" style={{ color:"#f59e0b" }}>{racha} sem</div>
                <div className="pf-rend-s">Semanas consecutivas con actividad</div>
                <div className="pf-progress">
                  <div className="pf-progress-fill" style={{ width:`${Math.min(racha*20,100)}%`, background:"#f59e0b" }} />
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── COBROS (solo vendedor) ── */}
        {tab === "cobros" && rol === "vendedor" && (
          <>
            <div className="pf-sec-t">Metodo de cobro</div>
            <div className="pf-cobro-hdr">
              <div>
                <div className="pf-cobro-t">Metodo registrado</div>
                {metodos.find(m => m.principal) ? (
                  <div className="pf-cobro-met">
                    <span className="pf-cobro-ico">{metodos.find(m=>m.principal)?.tipo === "Yape" ? "m" : metodos.find(m=>m.principal)?.tipo === "Plin" ? "p" : "b"}</span>
                    <div>
                      <div className="pf-cobro-nom">{metodos.find(m=>m.principal)?.tipo}</div>
                      <div className="pf-cobro-num">{metodos.find(m=>m.principal)?.numero}</div>
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize:12, color:"rgba(255,255,255,.3)" }}>Sin metodo registrado</div>
                )}
              </div>
              <button className="pf-save" style={{ width:"auto", padding:"9px 20px", marginTop:0 }} onClick={() => setTab("cuenta")}>
                Editar metodo
              </button>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:11, marginBottom:18 }}>
              <div className="pf-rend-box">
                <div className="pf-rend-t">Total cobrado</div>
                <div className="pf-rend-v" style={{ color:"#10b981", fontSize:26 }}>S/.{totalCobrado.toLocaleString()}</div>
                <div className="pf-rend-s">{pagos.filter(p=>p.estado==="pagado").length} pagos recibidos</div>
              </div>
              <div className="pf-rend-box">
                <div className="pf-rend-t">Pendiente de cobro</div>
                <div className="pf-rend-v" style={{ color:"#f59e0b", fontSize:26 }}>S/.{totalPendiente.toLocaleString()}</div>
                <div className="pf-rend-s">{pagos.filter(p=>p.estado==="pendiente").length} pagos en revision</div>
              </div>
            </div>

            <div className="pf-sec-t">Historial de pagos</div>
            <div className="pf-tabla">
              <div className="pf-tabla-hdr">
                <span>Proyecto</span><span>Monto</span><span>Fecha</span><span>Estado</span>
              </div>
              {pagos.length === 0 && (
                <div style={{ padding:"28px", textAlign:"center", color:"rgba(255,255,255,.2)", fontSize:"13px" }}>
                  Sin pagos todavia
                </div>
              )}
              {pagos.map(p => (
                <div key={p.id} className="pf-tabla-row">
                  <span className="pf-tabla-nom">{p.concepto || p.proyecto}</span>
                  <span className="pf-tabla-monto">S/.{Number(p.monto||0).toLocaleString()}</span>
                  <span className="pf-tabla-fecha">{formatFecha(p.fecha)}</span>
                  <span>
                    <span className={`pf-chip ${p.estado==="pagado" ? "ok" : "pen"}`}>
                      {p.estado === "pagado" ? "Cobrado" : "Pendiente"}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── COMPROBANTES (solo vendedor) ── */}
        {tab === "comprobantes" && rol === "vendedor" && (
          <>
            <div className="pf-sec-t">Comprobantes enviados</div>
            {ventas.length === 0 && (
              <div style={{ padding:"40px", textAlign:"center", color:"rgba(255,255,255,.2)", fontSize:"13px" }}>
                Sin comprobantes todavia
              </div>
            )}
            {ventas.map(v => {
              const cfg = compIco[v.estado] || compIco.pendiente
              return (
                <div key={v.id} className="pf-comp-card">
                  <div className="pf-comp-ico" style={{ background:cfg.bg }}>{cfg.ic}</div>
                  <div className="pf-comp-body">
                    <div className="pf-comp-nom">{v.proyecto}</div>
                    <div className="pf-comp-cli">Cliente: {v.cliente}</div>
                  </div>
                  <div className="pf-comp-right">
                    <div className="pf-comp-monto">S/.{Number(v.monto||0).toLocaleString()}</div>
                    <span className={`pf-chip ${cfg.chip}`}>
                      {v.estado === "aprobado" ? "Aprobado" : v.estado === "pendiente" ? "En revision" : "Rechazado"}
                    </span>
                    <div className="pf-comp-fecha">{formatFecha(v.fecha)}</div>
                  </div>
                </div>
              )
            })}
          </>
        )}

        {/* ── CUENTA (ambos roles) ── */}
        {tab === "cuenta" && (
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>

              {/* Datos personales */}
              <div className="pf-cuenta-box">
                <div className="pf-cuenta-box-t">
                  <span>Datos personales</span>
                  {!editPersonal
                    ? <button className="pf-edit-btn" onClick={() => { setTmpPersonal({ nombre: userData?.nombre||"", email: userData?.email||"", telefono: userData?.whatsapp||"" }); setEditPersonal(true) }}>Editar</button>
                    : <button className="pf-cancel-btn" onClick={() => setEditPersonal(false)}>Cancelar</button>
                  }
                </div>
                <div className="pf-field">
                  <div className="pf-field-l">Nombre completo</div>
                  <input className="pf-field-v" value={editPersonal ? tmpPersonal.nombre : (userData?.nombre||"")} onChange={e=>setTmpPersonal(p=>({...p,nombre:e.target.value}))} disabled={!editPersonal} placeholder="Tu nombre" />
                </div>
                <div className="pf-field">
                  <div className="pf-field-l">Correo electronico</div>
                  <input className="pf-field-v" type="email" value={editPersonal ? tmpPersonal.email : (userData?.email||"")} onChange={e=>setTmpPersonal(p=>({...p,email:e.target.value}))} disabled={!editPersonal} placeholder="Tu correo" />
                </div>
                <div className="pf-field">
                  <div className="pf-field-l">Telefono / WhatsApp</div>
                  <input className="pf-field-v" value={editPersonal ? tmpPersonal.telefono : (userData?.whatsapp||"")} onChange={e=>setTmpPersonal(p=>({...p,telefono:e.target.value}))} disabled={!editPersonal} placeholder="Ej: +51 987 654 321" />
                </div>
                <div className="pf-field">
                  <div className="pf-field-l">Rol</div>
                  <input className="pf-field-v" value={rol === "admin" ? "Administrador" : (userData?.nivel || "Vendedor")} disabled />
                </div>
                {editPersonal && (
                  <button className="pf-save" onClick={guardarPersonal} disabled={savingP}>
                    {savingP ? "Guardando..." : "Guardar cambios"}
                  </button>
                )}
              </div>

              {/* Contrasena */}
              <div className="pf-cuenta-box">
                <div className="pf-cuenta-box-t">
                  <span>Contrasena</span>
                  {!editPw
                    ? <button className="pf-edit-btn" onClick={() => setEditPw(true)}>Editar</button>
                    : <button className="pf-cancel-btn" onClick={() => { setEditPw(false); setPwActual(""); setPwNueva(""); setPwConf(""); setPwError("") }}>Cancelar</button>
                  }
                </div>
                {pwError && <div className="pf-error">{pwError}</div>}
                <div className="pf-field">
                  <div className="pf-field-l">Contrasena actual</div>
                  <input className="pf-field-v" type="password" value={pwActual} onChange={e=>setPwActual(e.target.value)} placeholder="..." disabled={!editPw} />
                </div>
                <div className="pf-field">
                  <div className="pf-field-l">Nueva contrasena</div>
                  <input className="pf-field-v" type="password" value={pwNueva} onChange={e=>setPwNueva(e.target.value)} placeholder="..." disabled={!editPw} />
                </div>
                <div className="pf-field" style={{ marginBottom:0 }}>
                  <div className="pf-field-l">Confirmar nueva contrasena</div>
                  <input className="pf-field-v" type="password" value={pwConf} onChange={e=>setPwConf(e.target.value)} placeholder="..." disabled={!editPw} />
                </div>
                {editPw && (
                  <button className="pf-save" disabled={!pwActual||!pwNueva||pwNueva!==pwConf||savingPw} onClick={guardarPw}>
                    {savingPw ? "Guardando..." : "Guardar cambios"}
                  </button>
                )}
              </div>
            </div>

            {/* Metodos de cobro — solo vendedor */}
            {rol === "vendedor" && (
              <div className="pf-cuenta-box">
                <div className="pf-cuenta-box-t">
                  <span>Metodos de cobro</span>
                  {!agregando && (
                    <button className="pf-edit-btn" onClick={() => setAgregando(true)}>+ Agregar</button>
                  )}
                </div>

                <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom: agregando ? 14 : 0 }}>
                  {metodos.length === 0 && !agregando && (
                    <div style={{ fontSize:12, color:"rgba(255,255,255,.2)", padding:"8px 0" }}>Sin metodos registrados</div>
                  )}
                  {metodos.map(m => (
                    <div key={m.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 14px", background:"rgba(255,255,255,.02)", border:`1px solid ${m.principal?"rgba(0,243,255,.2)":"rgba(255,255,255,.06)"}`, borderRadius:9 }}>
                      <div style={{ width:36, height:36, borderRadius:8, background:"rgba(16,185,129,.08)", border:"1px solid rgba(16,185,129,.12)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>
                        {m.tipo === "Yape" ? "m" : m.tipo === "Plin" ? "p" : "b"}
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:700, color:"#fff", marginBottom:2 }}>{m.tipo}</div>
                        <div style={{ fontSize:11, color:"rgba(255,255,255,.35)" }}>
                          {m.tipo === "Transferencia bancaria" ? `${m.banco} - ${m.numero}` : m.numero}
                        </div>
                      </div>
                      {m.principal ? (
                        <div style={{ fontSize:9, fontWeight:800, letterSpacing:1, textTransform:"uppercase", padding:"3px 9px", borderRadius:20, background:"rgba(0,243,255,.08)", border:"1px solid rgba(0,243,255,.15)", color:"#00f3ff" }}>Principal</div>
                      ) : (
                        <button onClick={() => hacerPrincipal(m.id)} style={{ fontSize:10, fontWeight:600, color:"rgba(255,255,255,.3)", background:"transparent", border:"1px solid rgba(255,255,255,.08)", borderRadius:6, padding:"3px 9px", cursor:"pointer", fontFamily:"inherit" }}>
                          Hacer principal
                        </button>
                      )}
                      {!m.principal && (
                        <button onClick={() => eliminarMetodo(m.id)} style={{ fontSize:13, color:"rgba(239,68,68,.45)", background:"transparent", border:"none", cursor:"pointer", padding:"4px 6px" }}>x</button>
                      )}
                    </div>
                  ))}
                </div>

                {agregando && (
                  <div style={{ background:"rgba(0,243,255,.03)", border:"1px solid rgba(0,243,255,.09)", borderRadius:10, padding:"16px 18px" }}>
                    <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"rgba(0,243,255,.4)", marginBottom:14 }}>Nuevo metodo</div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:14 }}>
                      <div className="pf-field" style={{ marginBottom:0 }}>
                        <div className="pf-field-l">Tipo</div>
                        <select className="pf-field-v" value={nuevoMetodo.tipo} onChange={e=>setNuevoMetodo(n=>({...n,tipo:e.target.value,numero:"",banco:"BCP"}))} style={{ cursor:"pointer", appearance:"none" }}>
                          <option>Yape</option>
                          <option>Plin</option>
                          <option>Transferencia bancaria</option>
                        </select>
                      </div>
                      <div className="pf-field" style={{ marginBottom:0 }}>
                        <div className="pf-field-l">{nuevoMetodo.tipo === "Transferencia bancaria" ? "Numero de cuenta" : "Numero de celular"}</div>
                        <input className="pf-field-v" value={nuevoMetodo.numero} onChange={e=>setNuevoMetodo(n=>({...n,numero:e.target.value}))} placeholder={nuevoMetodo.tipo === "Transferencia bancaria" ? "19300012345678" : "987 654 321"} />
                      </div>
                      {nuevoMetodo.tipo === "Transferencia bancaria" ? (
                        <div className="pf-field" style={{ marginBottom:0 }}>
                          <div className="pf-field-l">Banco</div>
                          <select className="pf-field-v" value={nuevoMetodo.banco} onChange={e=>setNuevoMetodo(n=>({...n,banco:e.target.value}))} style={{ cursor:"pointer", appearance:"none" }}>
                            <option>BCP</option><option>Interbank</option><option>BBVA</option><option>Scotiabank</option><option>BanBif</option>
                          </select>
                        </div>
                      ) : <div />}
                    </div>
                    <div style={{ display:"flex", gap:8 }}>
                      <button onClick={() => { setAgregando(false); setNuevoMetodo({ tipo:"Yape", numero:"", banco:"BCP" }) }} style={{ flex:1, padding:"9px", borderRadius:8, background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", color:"rgba(255,255,255,.4)", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                        Cancelar
                      </button>
                      <button onClick={agregarMetodo} disabled={!nuevoMetodo.numero} style={{ flex:1, padding:"9px", borderRadius:8, background: nuevoMetodo.numero ? "#00f3ff" : "rgba(0,243,255,.2)", color: nuevoMetodo.numero ? "#000" : "rgba(0,0,0,.4)", fontSize:12, fontWeight:700, cursor: nuevoMetodo.numero ? "pointer" : "not-allowed", border:"none", fontFamily:"inherit" }}>
                        Guardar metodo
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {toast && <div className="pf-toast">Cambios guardados</div>}
    </div>
  )
}