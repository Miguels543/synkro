import { useState } from "react"
import { tiempoRestante } from "./dashboardUtils"

export default function ModalReservar({ p, reservas, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false)

  const reservaActiva = reservas?.find(
    r => r.proyectoId === p?.id && ["reservado", "liberado"].includes(r.estado)
  )
  const yaVendido = reservas?.find(
    r => r.proyectoId === p?.id && r.estado === "vendido"
  )
  const cola   = p?.cola || 0
  const enCola = cola > 0

  const handleConfirm = async () => {
    if (loading) return
    setLoading(true)
    try { await onConfirm() }
    catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  // ── Ya tienes este proyecto reservado ──
  if (reservaActiva) return (
    <>
      <div className="dmod-t">Ya tienes este proyecto</div>
      <div className="dmod-desc">
        Tienes <strong style={{ color: "#f59e0b" }}>{p?.nombre}</strong> reservado activamente.
        {reservaActiva.expiraEn && (
          <> Te quedan <strong style={{ color: "#f59e0b" }}>{tiempoRestante(reservaActiva.expiraEn)}</strong> para cerrarlo.</>
        )}
      </div>
      <div className="dmod-row">
        <button className="dbtn cyan full" onClick={onClose}>Entendido</button>
      </div>
    </>
  )

  // ── Ya lo vendiste ──
  if (yaVendido) return (
    <>
      <div className="dmod-t">Ya cerraste este proyecto</div>
      <div className="dmod-desc">
        Ya reportaste una venta para <strong style={{ color: "#3b82f6" }}>{p?.nombre}</strong>.
        Si aún no ves la comisión, está en revisión con el admin.
      </div>
      <div className="dmod-row">
        <button className="dbtn cyan full" onClick={onClose}>Entendido</button>
      </div>
    </>
  )

  // ── Hay cola, puede unirse ──
  if (enCola) return (
    <>
      <div className="dmod-t">Hay {cola} vendedor{cola !== 1 ? "es" : ""} antes que tú</div>
      <div className="dmod-desc">
        Este proyecto ya está siendo trabajado. Si te unes entras en el puesto{" "}
        <strong style={{ color: "#a855f7" }}>#{cola + 1}</strong>.
        Cuando los vendedores anteriores terminen o expiren, el proyecto llega a ti automáticamente.
      </div>
      <div className="dmod-warn">
        ⚠️ Solo únete si tienes un cliente esperando. Las reservas expiradas bajan tu reputación.
      </div>
      <div className="dmod-row">
        <button className="dbtn ghost full" onClick={onClose} disabled={loading}>Cancelar</button>
        <button className="dbtn purple full" onClick={handleConfirm} disabled={loading}>
          {loading ? "Uniéndome..." : `Unirme — puesto #${cola + 1}`}
        </button>
      </div>
    </>
  )

  // ── Libre — flujo normal ──
  return (
    <>
      <div className="dmod-t">Reservar — {p?.nombre}</div>
      <div className="dmod-desc">
        Tendrás 6 días para reportar la venta. Si el tiempo expira, el proyecto pasa al siguiente vendedor.
      </div>
      <div className="dmod-warn">
        ⚠️ Las reservas expiradas bajan tu reputación. Solo reserva si tienes un cliente en mente.
      </div>
      <div className="dmod-row">
        <button className="dbtn ghost full" onClick={onClose} disabled={loading}>Cancelar</button>
        <button className="dbtn cyan full" onClick={handleConfirm} disabled={loading}>
          {loading ? "Reservando..." : "Confirmar reserva"}
        </button>
      </div>
    </>
  )
}