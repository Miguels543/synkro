import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { signOut } from "firebase/auth"
import { auth } from "../../../firebase/config"
import { useAuth } from "../../../context/authcontext"
import AdminEstadisticas from "./AdminEstadisticas"
import AdminUsuarios     from "./AdminUsuarios"
import AdminProyectos    from "./AdminProyectos"
import AdminPortafolio   from "./AdminPortafolio"
import AdminMisiones     from "./AdminMisiones"
import AdminVentas       from "./AdminVentas"
import AdminClientes     from "./AdminClientes"
import AdminPagos        from "./AdminPagos"
import AdminSolicitudes  from "./AdminSolicitudes"

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── LAYOUT BASE (desktop) ── */
  .adm {
    display: flex;
    min-height: 100vh;
    margin-top: var(--navbar-h);
    background: #050709;
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: #d1d5db;
    align-items: flex-start;
  }

  /* ── SIDEBAR ── */
  .adm-sb {
    width: 220px;
    flex-shrink: 0;
    background: #070a0f;
    border-right: 1px solid rgba(255,255,255,.05);
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 65px;
    height: calc(100vh - 65px);
    overflow: hidden;
    transition: transform .28s ease;
  }

  .adm-sb-top {
    padding: 20px 16px 16px;
    border-bottom: 1px solid rgba(255,255,255,.05);
    flex-shrink: 0;
  }
  .adm-sb-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(239,68,68,.08); border: 1px solid rgba(239,68,68,.18);
    border-radius: 8px; padding: 6px 12px; margin-bottom: 10px;
  }
  .adm-sb-badge-dot {
    width: 6px; height: 6px; border-radius: 50%; background: #ef4444;
    animation: abl 1.2s infinite;
  }
  @keyframes abl { 0%,100%{opacity:1} 50%{opacity:.2} }
  .adm-sb-badge-t { font-size: 10px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: #ef4444; }
  .adm-sb-nom { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 800; color: #fff; margin-bottom: 2px; }
  .adm-sb-rol { font-size: 10px; color: rgba(255,255,255,.28); }

  .adm-sb-nav { padding: 10px 8px; flex: 1; overflow-y: auto; }
  .adm-sb-sec {
    font-size: 8px; letter-spacing: 3px; text-transform: uppercase;
    color: rgba(255,255,255,.16); padding: 0 8px; margin: 12px 0 5px;
  }
  .adm-sb-sec:first-child { margin-top: 4px; }

  .adm-sb-btn {
    display: flex; align-items: center; gap: 9px;
    width: 100%; padding: 8px 10px; border-radius: 8px;
    background: transparent; border: none; cursor: pointer;
    font-size: 12.5px; font-weight: 500; color: rgba(255,255,255,.32);
    transition: all .15s; text-align: left; position: relative;
    margin-bottom: 1px; font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .adm-sb-btn:hover { background: rgba(255,255,255,.04); color: rgba(255,255,255,.65); }
  .adm-sb-btn.on    { background: rgba(239,68,68,.06); color: #ef4444; font-weight: 600; }
  .adm-sb-btn.on::before {
    content: ''; position: absolute; left: 0; top: 20%; bottom: 20%;
    width: 2.5px; border-radius: 2px; background: #ef4444;
  }
  .adm-sb-ico { font-size: 14px; width: 18px; text-align: center; flex-shrink: 0; }
  .adm-sb-badge2 {
    margin-left: auto; background: #ef4444; color: #fff;
    font-size: 9px; font-weight: 800; padding: 1px 6px; border-radius: 8px;
  }

  /* link de navegación general dentro del sidebar */
  .adm-sb-link {
    display: flex; align-items: center; gap: 9px;
    width: 100%; padding: 8px 10px; border-radius: 8px;
    font-size: 12.5px; font-weight: 500; color: rgba(255,255,255,.32);
    transition: all .15s; text-decoration: none;
    margin-bottom: 1px;
  }
  .adm-sb-link:hover { background: rgba(255,255,255,.04); color: rgba(255,255,255,.65); }

  /* bloque de usuario en la parte baja del sidebar (mobile) */
  .adm-sb-user {
    padding: 14px 16px;
    border-top: 1px solid rgba(255,255,255,.05);
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }
  .adm-sb-user-av {
    width: 32px; height: 32px; border-radius: 8px; flex-shrink: 0;
    background: linear-gradient(135deg,rgba(0,243,255,.15),rgba(168,85,247,.15));
    border: 1px solid rgba(0,243,255,.2);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 800; color: #00f3ff;
  }
  .adm-sb-user-info { flex: 1; min-width: 0; }
  .adm-sb-user-nom { font-size: 12px; font-weight: 700; color: rgba(255,255,255,.8); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .adm-sb-user-rol { font-size: 10px; color: rgba(255,255,255,.28); }
  .adm-sb-logout {
    background: transparent; border: 1px solid rgba(255,255,255,.1);
    color: rgba(255,255,255,.35); padding: 5px 10px; border-radius: 7px;
    font-size: 11px; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600;
    cursor: pointer; transition: all .2s; flex-shrink: 0;
  }
  .adm-sb-logout:hover { border-color: rgba(239,68,68,.35); color: rgba(239,68,68,.7); background: rgba(239,68,68,.05); }

  /* ── MAIN ── */
  .adm-main { flex: 1; min-width: 0; align-self: flex-start; }

  /* ── MOBILE TOPBAR (reemplaza el navbar en ≤768px) ── */
  .adm-topbar {
    display: none;
    position: fixed;
    top: 0; left: 0; right: 0;
    height: 56px;
    background: rgba(0,10,20,.92);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(0,243,255,.15);
    align-items: center;
    justify-content: space-between;
    padding: 0 18px;
    z-index: 1100;
  }
  .adm-topbar-logo {
    font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800;
    color: #00f3ff; letter-spacing: 3px; text-decoration: none;
    text-shadow: 0 0 10px rgba(0,243,255,.4);
  }
  .adm-topbar-ham {
    display: flex; flex-direction: column; gap: 5px;
    width: 36px; height: 36px; background: none; border: none;
    cursor: pointer; padding: 6px; justify-content: center; align-items: center;
  }
  .adm-topbar-ham span {
    display: block; width: 20px; height: 2px;
    background: rgba(255,255,255,.7); border-radius: 2px; transition: all .28s;
  }
  .adm-topbar-ham.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); background: #00f3ff; }
  .adm-topbar-ham.open span:nth-child(2) { opacity: 0; }
  .adm-topbar-ham.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); background: #00f3ff; }

  /* overlay oscuro detrás del drawer */
  .adm-overlay {
    display: none;
    position: fixed; inset: 0;
    background: rgba(0,0,0,.55);
    z-index: 1090;
    backdrop-filter: blur(2px);
  }
  .adm-overlay.open { display: block; }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {

    /* ocultar el navbar global */
    .navbar { display: none !important; }

    /* mostrar nuestra topbar propia */
    .adm-topbar { display: flex; }

    /* layout: sin sidebar fijo, contenido full */
    .adm {
      margin-top: 56px;
      min-height: calc(100vh - 56px);
      flex-direction: column;
    }

    /* sidebar como drawer lateral */
    .adm-sb {
      position: fixed;
      top: 0; left: 0;
      width: 260px;
      height: 100vh;
      z-index: 1095;
      transform: translateX(-100%);
      border-right: 1px solid rgba(0,243,255,.1);
    }
    .adm-sb.open {
      transform: translateX(0);
    }

    /* en mobile el top del sidebar llega hasta arriba */
    .adm-sb-top {
      padding-top: 70px; /* espacio bajo la topbar */
    }

    .adm-main { width: 100%; }
  }

  @media (max-width: 480px) {
    .adm-topbar { padding: 0 14px; }
    .adm-topbar-logo { font-size: 18px; letter-spacing: 2px; }
  }
`

const SECCIONES = [
  {
    grupo: "Admin",
    items: [
      { id:"estadisticas", lbl:"Estadísticas", ico:"◈" },
      { id:"solicitudes",  lbl:"Solicitudes",  ico:"◎" },
    ]
  },
  {
    grupo: "Usuarios",
    items: [
      { id:"usuarios",  lbl:"Vendedores", ico:"◎" },
      { id:"clientes",  lbl:"Clientes",   ico:"◑" },
    ]
  },
  {
    grupo: "Catálogo",
    items: [
      { id:"proyectos",  lbl:"Proyectos",  ico:"▣" },
      { id:"misiones",   lbl:"Misiones",   ico:"◉" },
      { id:"portafolio", lbl:"Portafolio", ico:"◈" },
    ]
  },
  {
    grupo: "Finanzas",
    items: [
      { id:"ventas", lbl:"Ventas", ico:"✦" },
      { id:"pagos",  lbl:"Pagos",  ico:"◈" },
    ]
  },
]

// Rutas generales que aparecen en el drawer en mobile
const NAV_GENERAL = [
  { to: "/",          lbl: "Inicio",      ico: "⌂" },
  { to: "/planes",    lbl: "Planes",      ico: "◧" },
  { to: "/solicitud", lbl: "Solicitud",   ico: "✉" },
  { to: "/nosotros",  lbl: "Nosotros",    ico: "◑" },
  { to: "/portafolio",lbl: "Portafolio",  ico: "◈" },
  { to: "/retos",     lbl: "Proyectos",   ico: "▣" },
  { to: "/perfil",    lbl: "Mi perfil",   ico: "◎" },
]

const COMPONENTES = {
  estadisticas: AdminEstadisticas,
  solicitudes:  AdminSolicitudes,
  usuarios:     AdminUsuarios,
  proyectos:    AdminProyectos,
  portafolio:   AdminPortafolio,
  misiones:     AdminMisiones,
  ventas:       AdminVentas,
  clientes:     AdminClientes,
  pagos:        AdminPagos,
}

export default function Admin() {
  const [tab, setTab]         = useState("estadisticas")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isMobile, setIsMobile]     = useState(window.innerWidth <= 768)
  const { user } = useAuth()
  const navigate  = useNavigate()

  const Seccion = COMPONENTES[tab] || AdminEstadisticas

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  // Cierra el drawer al cambiar de sección
  const selectTab = (id) => {
    setTab(id)
    setDrawerOpen(false)
  }

  const handleLogout = async () => {
    setDrawerOpen(false)
    await signOut(auth)
    navigate("/")
  }

  const inicial     = user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "A"
  const nombreCorto = user?.displayName?.split(" ")[0] || user?.email || "Admin"

  return (
    <>
      <style>{CSS}</style>

      {/* ── Topbar propia en mobile (reemplaza el Navbar global) ── */}
      <div className="adm-topbar">
        <Link to="/" className="adm-topbar-logo">SYNKRO</Link>
        <button
          className={`adm-topbar-ham${drawerOpen ? " open" : ""}`}
          onClick={() => setDrawerOpen(o => !o)}
          aria-label="Menú"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Overlay oscuro */}
      <div
        className={`adm-overlay${drawerOpen ? " open" : ""}`}
        onClick={() => setDrawerOpen(false)}
      />

      <div className="adm">
        <aside className={`adm-sb${drawerOpen ? " open" : ""}`}>
          <div className="adm-sb-top">
            <div className="adm-sb-badge">
              <div className="adm-sb-badge-dot" />
              <span className="adm-sb-badge-t">Admin</span>
            </div>
            <div className="adm-sb-nom">Panel de control</div>
            <div className="adm-sb-rol">Administrador · Synkro</div>
          </div>

          <nav className="adm-sb-nav">
            {/* Secciones del admin */}
            {SECCIONES.map(g => (
              <div key={g.grupo}>
                <div className="adm-sb-sec">{g.grupo}</div>
                {g.items.map(it => (
                  <button
                    key={it.id}
                    className={`adm-sb-btn ${tab === it.id ? "on" : ""}`}
                    onClick={() => selectTab(it.id)}
                  >
                    <span className="adm-sb-ico">{it.ico}</span>
                    {it.lbl}
                    {it.badge > 0 && <span className="adm-sb-badge2">{it.badge}</span>}
                  </button>
                ))}
              </div>
            ))}

            {/* Navegación general — solo visible en mobile dentro del drawer */}
            {isMobile && (
              <div>
                <div className="adm-sb-sec">Navegación</div>
                {NAV_GENERAL.map(l => (
                  <Link
                    key={l.to}
                    to={l.to}
                    className="adm-sb-link"
                    onClick={() => setDrawerOpen(false)}
                  >
                    <span className="adm-sb-ico">{l.ico}</span>
                    {l.lbl}
                  </Link>
                ))}
              </div>
            )}
          </nav>

          {/* Usuario + logout en la parte baja del drawer (solo mobile) */}
          {isMobile && (
            <div className="adm-sb-user">
              <div className="adm-sb-user-av">{inicial}</div>
              <div className="adm-sb-user-info">
                <div className="adm-sb-user-nom">{nombreCorto}</div>
                <div className="adm-sb-user-rol">Administrador</div>
              </div>
              <button className="adm-sb-logout" onClick={handleLogout}>
                Salir
              </button>
            </div>
          )}
        </aside>

        <main className="adm-main">
          <Seccion />
        </main>
      </div>
    </>
  )
}