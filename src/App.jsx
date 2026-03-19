import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { useEffect } from "react"
import Navbar from "./components/layout/Navbar"
import Landing from "./pages/public/Landing"
import Planes from "./pages/public/Planes"
import Solicitud from "./pages/public/Solicitud"
import Nosotros from "./pages/public/Nosotros"
import Vendedores from "./pages/public/Vendedores"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import Dashboard from "./pages/app/dashboard/Dashboard"
import Retos from "./pages/app/retos/Retos"
import RetoDetalle from "./pages/app/retos/RetoDetalle"
import Perfil from "./pages/app/perfil/Perfil"
import Admin from "./pages/app/admin/Admin"
import WhatsAppFloat from "./components/shared/WhatsAppFloat"
import Footer from "./components/layout/Footer"
import Portafolio from "./pages/public/Portafolio"
import PortafolioDetalle from "./pages/public/PortafolioDetalle"
import RoleGuard from "./guards/RoleGuard"

const RUTAS_APP = ["/dashboard", "/admin", "/retos", "/perfil"]

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function AppLayout() {
  const location = useLocation()
  const esRutaApp = RUTAS_APP.some(r => location.pathname.startsWith(r))
  const esAuth = ["/login", "/register"].includes(location.pathname)

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <div>
        <Routes>
          {/* Públicas */}
          <Route path="/" element={<Landing />} />
          <Route path="/planes" element={<Planes />} />
          <Route path="/solicitud" element={<Solicitud />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/vendedores" element={<Vendedores />} />
          <Route path="/portafolio" element={<Portafolio />} />
          <Route path="/portafolio/:id" element={<PortafolioDetalle />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Solo vendedor */}
          <Route path="/dashboard" element={
            <RoleGuard rolesPermitidos={["vendedor"]}>
              <Dashboard />
            </RoleGuard>
          } />
          <Route path="/retos" element={
            <RoleGuard rolesPermitidos={["vendedor", "admin"]}>
              <Retos />
            </RoleGuard>
          } />
          <Route path="/retos/:id" element={
            <RoleGuard rolesPermitidos={["vendedor", "admin"]}>
              <RetoDetalle />
            </RoleGuard>
          } />
          <Route path="/perfil" element={
            <RoleGuard rolesPermitidos={["vendedor", "admin"]}>
              <Perfil />
            </RoleGuard>
          } />

          {/* Solo admin */}
          <Route path="/admin" element={
            <RoleGuard rolesPermitidos={["admin"]}>
              <Admin />
            </RoleGuard>
          } />
        </Routes>
      </div>
      {!esRutaApp && !esAuth && <Footer />}
      {!esRutaApp && <WhatsAppFloat />}
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}

export default App