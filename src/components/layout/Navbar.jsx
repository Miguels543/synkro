import { Link, useLocation, useNavigate } from "react-router-dom"
import { signOut } from "firebase/auth"
import { auth } from "../../firebase/config"
import { useAuth } from "../../context/authcontext"
import { useState } from "react"

const navStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');

  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 65px;
    background: rgba(0, 10, 20, 0.85);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(0, 243, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 40px;
    z-index: 1000;
    box-sizing: border-box;
  }

  .navbar-logo {
    font-size: 26px;
    font-weight: bold;
    color: #00f3ff;
    text-decoration: none;
    letter-spacing: 4px;
    text-shadow: 0 0 10px rgba(0, 243, 255, 0.5);
    font-family: 'Syne', sans-serif;
    flex: 1;
  }

  .navbar-links {
    display: flex;
    align-items: center;
    gap: 35px;
    list-style: none;
    margin: 0;
    padding: 0;
    flex: 2;
    justify-content: center;
  }

  .navbar-links a {
    color: rgba(255,255,255,.65);
    text-decoration: none;
    font-size: 14px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 500;
    transition: all 0.3s ease;
    position: relative;
    padding-bottom: 4px;
  }

  .navbar-links a::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: #00f3ff;
    transition: width 0.3s ease;
    border-radius: 2px;
  }

  .navbar-links a:hover { color: #00f3ff; }
  .navbar-links a:hover::after,
  .navbar-links a.active::after { width: 100%; }
  .navbar-links a.active { color: #00f3ff; font-weight: 600; }

  .navbar-right {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
    justify-content: flex-end;
  }

  .nav-perfil {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,255,255,.04);
    border: 1px solid rgba(255,255,255,.09);
    border-radius: 9px;
    padding: 5px 12px 5px 6px;
    text-decoration: none;
    transition: all .2s;
    cursor: pointer;
  }
  .nav-perfil:hover {
    border-color: rgba(0,243,255,.3);
    background: rgba(0,243,255,.05);
  }
  .nav-perfil-av {
    width: 28px;
    height: 28px;
    border-radius: 7px;
    background: linear-gradient(135deg, rgba(0,243,255,.18), rgba(168,85,247,.18));
    border: 1px solid rgba(0,243,255,.22);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Syne', sans-serif;
    font-size: 12px;
    font-weight: 800;
    color: #00f3ff;
    flex-shrink: 0;
  }
  .nav-perfil-nom {
    font-size: 13px;
    font-weight: 600;
    color: rgba(255,255,255,.75);
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .btn-logout {
    background: transparent;
    border: 1px solid rgba(255,255,255,.1);
    color: rgba(255,255,255,.45);
    padding: 7px 16px;
    border-radius: 8px;
    font-size: 13px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .btn-logout:hover {
    border-color: rgba(239,68,68,.35);
    color: rgba(239,68,68,.7);
    background: rgba(239,68,68,.05);
  }

  /* ── HAMBURGER ── */
  .nav-hamburger {
    display: none;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    width: 36px;
    height: 36px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    z-index: 1100;
    flex-shrink: 0;
  }

  .nav-hamburger span {
    display: block;
    width: 22px;
    height: 2px;
    background: rgba(255,255,255,0.7);
    border-radius: 2px;
    transition: all 0.3s ease;
  }

  .nav-hamburger.open span:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
    background: #00f3ff;
  }
  .nav-hamburger.open span:nth-child(2) {
    opacity: 0;
  }
  .nav-hamburger.open span:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
    background: #00f3ff;
  }

  /* ── MENU MÓVIL ── */
  .nav-mobile-menu {
    display: none;
    position: fixed;
    top: 65px;
    left: 0;
    width: 100%;
    background: rgba(0, 10, 20, 0.97);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(0,243,255,0.12);
    flex-direction: column;
    padding: 20px 24px 28px;
    gap: 0;
    z-index: 999;
  }

  .nav-mobile-menu.open { display: flex; }

  .nav-mobile-menu li {
    list-style: none;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }

  .nav-mobile-menu li:last-child { border-bottom: none; }

  .nav-mobile-menu a {
    display: block;
    padding: 14px 0;
    color: rgba(255,255,255,0.65);
    text-decoration: none;
    font-size: 15px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 500;
    transition: color 0.2s;
  }

  .nav-mobile-menu a:hover,
  .nav-mobile-menu a.active {
    color: #00f3ff;
  }

  .nav-mobile-bottom {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid rgba(0,243,255,0.1);
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .nav-mobile-bottom .nav-perfil {
    width: 100%;
    padding: 14px 16px;
    border-radius: 12px;
    border-color: rgba(0,243,255,0.18);
    background: rgba(0,243,255,0.06);
    gap: 14px;
    align-items: center;
  }

  .nav-mobile-bottom .nav-perfil-av {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    font-size: 16px;
    flex-shrink: 0;
  }

  .nav-mobile-bottom .nav-perfil-nom {
    font-size: 15px;
    font-weight: 700;
    color: rgba(255,255,255,0.9);
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .nav-mobile-bottom .btn-logout {
    width: 100%;
    padding: 11px;
    font-size: 14px;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    .navbar {
      padding: 0 20px;
    }

    .navbar-links { display: none; }
    .navbar-right  { display: none; }

    .nav-hamburger { display: flex; }
  }
`

function Navbar() {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const rol = user?.rol
  const [menuOpen, setMenuOpen] = useState(false)

  const esAuthPage = ["/login", "/register"].includes(location.pathname)
  const isActive = (path) => location.pathname === path ? "active" : ""

  const handleLogout = async () => {
    setMenuOpen(false)
    await signOut(auth)
    navigate("/")
  }

  const closeMenu = () => setMenuOpen(false)

  const inicial = user?.displayName
    ? user.displayName[0].toUpperCase()
    : user?.email?.[0]?.toUpperCase() || "U"

  const nombreCorto = user?.displayName?.split(" ")[0] || "Mi perfil"

  return (
    <>
      <style>{navStyle}</style>
      <nav className="navbar">
        <Link to="/" className="navbar-logo">SYNKRO</Link>

        {/* Links desktop — igual que antes */}
        <ul className="navbar-links">
          <li><Link to="/"          className={isActive("/")}>Inicio</Link></li>
          <li><Link to="/planes"    className={isActive("/planes")}>Planes</Link></li>
          <li><Link to="/solicitud" className={isActive("/solicitud")}>Solicitud</Link></li>
          <li><Link to="/nosotros"  className={isActive("/nosotros")}>Nosotros</Link></li>
          <li><Link to="/portafolio" className={isActive("/portafolio")}>Portafolio</Link></li>

          {rol === "vendedor" && (
            <>
              <li><Link to="/dashboard" className={isActive("/dashboard")}>Dashboard</Link></li>
              <li><Link to="/retos"     className={isActive("/retos")}>Proyectos</Link></li>
            </>
          )}

          {rol === "admin" && (
            <>
              <li><Link to="/retos" className={isActive("/retos")}>Proyectos</Link></li>
              <li><Link to="/admin" className={isActive("/admin")}>Admin</Link></li>
            </>
          )}
        </ul>

        {/* Perfil + logout desktop — igual que antes */}
        <div className="navbar-right">
          {!esAuthPage && user && (
            <>
              <Link to="/perfil" className="nav-perfil">
                <div className="nav-perfil-av">{inicial}</div>
                <span className="nav-perfil-nom">{nombreCorto}</span>
              </Link>
              <button className="btn-logout" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </>
          )}
        </div>

        {/* Hamburger — solo en móvil */}
        <button
          className={`nav-hamburger${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen(m => !m)}
          aria-label="Menú"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* Menú móvil desplegable */}
      <ul className={`nav-mobile-menu${menuOpen ? " open" : ""}`}>
        <li><Link to="/"          className={isActive("/")}          onClick={closeMenu}>Inicio</Link></li>
        <li><Link to="/planes"    className={isActive("/planes")}    onClick={closeMenu}>Planes</Link></li>
        <li><Link to="/solicitud" className={isActive("/solicitud")} onClick={closeMenu}>Solicitud</Link></li>
        <li><Link to="/nosotros"  className={isActive("/nosotros")}  onClick={closeMenu}>Nosotros</Link></li>
        <li><Link to="/portafolio" className={isActive("/portafolio")} onClick={closeMenu}>Portafolio</Link></li>

        {rol === "vendedor" && (
          <>
            <li><Link to="/dashboard" className={isActive("/dashboard")} onClick={closeMenu}>Dashboard</Link></li>
            <li><Link to="/retos"     className={isActive("/retos")}     onClick={closeMenu}>Proyectos</Link></li>
          </>
        )}

        {rol === "admin" && (
          <>
            <li><Link to="/retos" className={isActive("/retos")} onClick={closeMenu}>Proyectos</Link></li>
            <li><Link to="/admin" className={isActive("/admin")} onClick={closeMenu}>Admin</Link></li>
          </>
        )}

        {!esAuthPage && user && (
          <div className="nav-mobile-bottom">
            <Link to="/perfil" className="nav-perfil" onClick={closeMenu}>
              <div className="nav-perfil-av">{inicial}</div>
              <span className="nav-perfil-nom">
                {user?.displayName || user?.email}
                <span style={{ fontSize:"11px", color:"rgba(0,243,255,0.5)", fontWeight:400, letterSpacing:"0.5px" }}>
                  {rol === "admin" ? "Administrador" : rol === "vendedor" ? "Vendedor" : "Mi cuenta"}
                </span>
              </span>
            </Link>
            <button className="btn-logout" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        )}
      </ul>
    </>
  )
}

export default Navbar