import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { signOut } from "firebase/auth"
import { auth } from "../../firebase/config"
import { useAuth } from "../../context/authcontext"

/* ─────────────────────────────────────────
   Estilos para las pantallas de estado
───────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');

  .pr-screen {
    min-height: 100vh;
    background: #050709;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Plus Jakarta Sans', sans-serif;
    padding: 24px;
  }

  .pr-card {
    max-width: 480px;
    width: 100%;
    background: #0c0f14;
    border-radius: 20px;
    padding: 48px 40px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .pr-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
  }
  .pr-card.pending::before  { background: linear-gradient(90deg, #f59e0b, #f97316, transparent); }
  .pr-card.rejected::before { background: linear-gradient(90deg, #ef4444, transparent); }

  .pr-icon {
    font-size: 52px;
    margin-bottom: 20px;
    display: block;
    line-height: 1;
  }

  .pr-title {
    font-family: 'Syne', sans-serif;
    font-size: 22px;
    font-weight: 800;
    color: #fff;
    margin-bottom: 10px;
  }

  .pr-sub {
    font-size: 14px;
    color: rgba(255,255,255,.4);
    line-height: 1.7;
    margin-bottom: 28px;
  }

  /* Pasos de espera */
  .pr-steps {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 28px;
    text-align: left;
  }
  .pr-step {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    background: rgba(255,255,255,.03);
    border: 1px solid rgba(255,255,255,.06);
    border-radius: 10px;
    padding: 12px 14px;
  }
  .pr-step-num {
    width: 22px; height: 22px; border-radius: 50%;
    background: rgba(245,158,11,.12);
    border: 1px solid rgba(245,158,11,.25);
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 800; color: #f59e0b;
    flex-shrink: 0; margin-top: 1px;
  }
  .pr-step-txt { font-size: 13px; color: rgba(255,255,255,.55); line-height: 1.5; }
  .pr-step-txt strong { color: rgba(255,255,255,.8); font-weight: 700; }

  /* Tiempo estimado */
  .pr-eta {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(245,158,11,.07);
    border: 1px solid rgba(245,158,11,.18);
    border-radius: 20px; padding: 7px 16px;
    font-size: 12px; font-weight: 600; color: #f59e0b;
    margin-bottom: 28px;
  }

  /* Botones */
  .pr-btn {
    display: block; width: 100%;
    padding: 12px; border-radius: 10px;
    font-size: 14px; font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    cursor: pointer; transition: all .2s;
    text-decoration: none; text-align: center;
    border: none;
  }
  .pr-btn.outline {
    background: transparent;
    border: 1px solid rgba(255,255,255,.1);
    color: rgba(255,255,255,.4);
    margin-top: 10px;
  }
  .pr-btn.outline:hover { border-color: rgba(239,68,68,.3); color: rgba(239,68,68,.6); }
  .pr-btn.primary {
    background: linear-gradient(45deg, #00f3ff, #0066ff);
    color: #000;
  }
  .pr-btn.primary:hover { opacity: .85; }
  .pr-btn.danger {
    background: rgba(239,68,68,.08);
    border: 1px solid rgba(239,68,68,.2);
    color: #ef4444;
  }
  .pr-btn.danger:hover { background: rgba(239,68,68,.15); }

  /* Pulso animado */
  .pr-pulse-wrap {
    position: relative;
    width: 72px; height: 72px;
    margin: 0 auto 24px;
  }
  .pr-pulse-ring {
    position: absolute; inset: 0;
    border-radius: 50%;
    border: 2px solid rgba(245,158,11,.3);
    animation: prPulse 2s ease-out infinite;
  }
  .pr-pulse-ring:nth-child(2) { animation-delay: .6s; }
  .pr-pulse-ring:nth-child(3) { animation-delay: 1.2s; }
  .pr-pulse-core {
    position: absolute; inset: 16px;
    border-radius: 50%;
    background: rgba(245,158,11,.12);
    border: 1px solid rgba(245,158,11,.3);
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
  }
  @keyframes prPulse {
    0%   { transform: scale(1);   opacity: .6; }
    100% { transform: scale(1.6); opacity: 0;  }
  }

  @media (max-width: 480px) {
    .pr-card { padding: 36px 24px; }
    .pr-title { font-size: 19px; }
  }
`

/* ─────────────────────────────────────────
   Pantalla: pendiente de aprobación
───────────────────────────────────────── */
function PantallaPendiente({ user, onRefresh, onLogout }) {
  const [checking, setChecking] = useState(false)

  const handleRefresh = async () => {
    setChecking(true)
    await onRefresh()
    setChecking(false)
  }

  return (
    <div className="pr-screen">
      <style>{CSS}</style>
      <div className="pr-card pending">
        <div className="pr-pulse-wrap">
          <div className="pr-pulse-ring" />
          <div className="pr-pulse-ring" />
          <div className="pr-pulse-ring" />
          <div className="pr-pulse-core">⏳</div>
        </div>

        <div className="pr-title">Tu cuenta está en revisión</div>
        <div className="pr-sub">
          Hola <strong style={{ color: "rgba(255,255,255,.75)" }}>{user?.nombre || user?.email}</strong>,
          tu solicitud fue recibida. Nuestro equipo la está revisando.
        </div>

        <div className="pr-steps">
          <div className="pr-step">
            <div className="pr-step-num">1</div>
            <div className="pr-step-txt"><strong>Solicitud recibida</strong> — tu registro fue enviado correctamente.</div>
          </div>
          <div className="pr-step">
            <div className="pr-step-num">2</div>
            <div className="pr-step-txt"><strong>Revisión del equipo</strong> — validamos tu información antes de darte acceso.</div>
          </div>
          <div className="pr-step">
            <div className="pr-step-num">3</div>
            <div className="pr-step-txt"><strong>Acceso aprobado</strong> — recibirás acceso completo al dashboard de vendedor.</div>
          </div>
        </div>

        <div className="pr-eta">
          ⏱ Tiempo estimado de revisión: <strong>24 – 48 horas</strong>
        </div>

        <button className="pr-btn primary" onClick={handleRefresh} disabled={checking}>
          {checking ? "Verificando..." : "¿Ya me aprobaron? Verificar"}
        </button>
        <button className="pr-btn outline" onClick={onLogout}>
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Pantalla: solicitud rechazada
───────────────────────────────────────── */
function PantallaRechazada({ onLogout }) {
  return (
    <div className="pr-screen">
      <style>{CSS}</style>
      <div className="pr-card rejected">
        <span className="pr-icon">❌</span>
        <div className="pr-title">Solicitud no aprobada</div>
        <div className="pr-sub">
          Tu solicitud para unirte como vendedor no fue aprobada en esta oportunidad.
          Si crees que es un error o tienes más información que compartir, contáctanos.
        </div>

        <a
          href="https://wa.me/51990502491?text=Hola,%20mi%20solicitud%20fue%20rechazada%20y%20quisiera%20saber%20el%20motivo"
          target="_blank"
          rel="noopener noreferrer"
          className="pr-btn primary"
        >
          Contactar por WhatsApp
        </a>
        <button className="pr-btn danger" onClick={onLogout} style={{ marginTop: 10 }}>
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   ProtectedRoute principal
───────────────────────────────────────── */
function ProtectedRoute({ children, requiredRole }) {
  const { user, refreshUser } = useAuth()

  const handleLogout = async () => {
    await signOut(auth)
  }

  // No autenticado
  if (!user) return <Navigate to="/login" replace />

  // Vendedor pendiente → pantalla de espera
  if (user.rol === "vendedor" && user.estado === "pendiente") {
    return <PantallaPendiente user={user} onRefresh={refreshUser} onLogout={handleLogout} />
  }

  // Vendedor rechazado → pantalla de rechazo
  if (user.rol === "vendedor" && user.estado === "rechazado") {
    return <PantallaRechazada onLogout={handleLogout} />
  }

  // Rol incorrecto
  if (requiredRole && user.rol !== requiredRole) {
    return <Navigate to={user.rol === "admin" ? "/admin" : "/dashboard"} replace />
  }

  return children
}

export default ProtectedRoute