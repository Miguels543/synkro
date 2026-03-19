import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../../context/authcontext"

const linksPublicos = [
  { icon: "🏠", text: "Inicio", path: "/" },
  { icon: "💎", text: "Planes", path: "/planes" },
  { icon: "📝", text: "Solicitud", path: "/solicitud" },
  { icon: "ℹ️", text: "Nosotros", path: "/nosotros" },
]

const linksVendedor = [
  { icon: "🏠", text: "Inicio", path: "/" },
  { icon: "📊", text: "Dashboard", path: "/dashboard" },
  { icon: "🎯", text: "Retos", path: "/retos" },
  { icon: "👤", text: "Perfil", path: "/perfil" },
  { icon: "💎", text: "Planes", path: "/planes" },
  { icon: "📝", text: "Solicitud", path: "/solicitud" },
  { icon: "ℹ️", text: "Nosotros", path: "/nosotros" },
]

const linksAdmin = [
  { icon: "🏠", text: "Inicio", path: "/" },
  { icon: "📊", text: "Dashboard", path: "/dashboard" },
  { icon: "🎯", text: "Retos", path: "/retos" },
  { icon: "👤", text: "Perfil", path: "/perfil" },
  { icon: "💎", text: "Planes", path: "/planes" },
  { icon: "📝", text: "Solicitud", path: "/solicitud" },
  { icon: "ℹ️", text: "Nosotros", path: "/nosotros" },
  { icon: "⚙️", text: "Admin", path: "/admin" },
]

const sidebarStyle = `
  .left-sidebar {
    width: 50px;
    height: calc(var(--sidebar-height) - 40px);
    background: rgba(0, 10, 20, 0);
    position: fixed;
    left: 20px;
    top: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 20px 0;
    z-index: 100;
    overflow-y: scroll;
    overflow-x: hidden;
    scrollbar-width: none;
    -ms-overflow-style: none;
    transition: width 0.3s ease;
    border-radius: 15px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(0, 243, 255, 0.2);
  }

  .left-sidebar:hover {
    width: 200px;
  }

  .left-sidebar::-webkit-scrollbar {
    display: none;
  }

  .nav-links {
    margin-top: -20px;
    list-style: none;
    width: 100%;
    padding: 0;
    margin: 0;
  }

  .nav-links a {
    color: #ffffff;
    text-decoration: none;
    display: flex;
    align-items: center;
    width: 100%;
    height: 45px;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    padding: 0 15px;
    position: relative;
  }

  .nav-links .icon {
    font-size: 25px;
    min-width: 20px;
    display: flex;
    justify-content: center;
  }

  .nav-links .text {
    margin-left: 15px;
    opacity: 0;
    transition: opacity 0.3s ease;
    white-space: nowrap;
  }

  .left-sidebar:hover .nav-links .text {
    opacity: 1;
  }

  .nav-links a:hover {
    background: linear-gradient(90deg, rgba(0, 243, 255, 0.1), transparent);
    text-shadow: 0 0 5px #00f3ff;
  }

  .nav-links a::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 0;
    background: #00f3ff;
    transition: height 0.3s ease;
  }

  .nav-links a:hover::before {
    height: 80%;
  }

  .nav-links a.active {
    background: linear-gradient(90deg, rgba(0, 243, 255, 0.1), transparent);
    color: #00f3ff;
  }

  .nav-links a.active::before {
    height: 80%;
  }
`

function Sidebar() {
  const { user } = useAuth()
  const location = useLocation()
  const rol = user?.rol

  const links = rol === "admin" ? linksAdmin : rol === "vendedor" ? linksVendedor : linksPublicos

  const ocultar = ["/login", "/register"].includes(location.pathname)
  if (ocultar) return null

  const itemHeight = 45
  const padding = 40
  const sidebarHeight = links.length * itemHeight + padding

  return (
    <>
      <style>{sidebarStyle.replace("var(--sidebar-height)", `${sidebarHeight}px`)}</style>
      <nav className="left-sidebar">
        <ul className="nav-links">
          {links.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={location.pathname === link.path ? "active" : ""}
              >
                <span className="icon">{link.icon}</span>
                <span className="text">{link.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}

export default Sidebar