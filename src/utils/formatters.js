// ─────────────────────────────────────────────
// FORMATTERS
// ─────────────────────────────────────────────

// ── Fechas ──────────────────────────────────

// Firestore Timestamp → fecha legible
// Ej: "12 ene 2025"
export function formatFecha(ts) {
  if (!ts) return "—"
  const d = ts?.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString("es-PE", { day: "numeric", month: "short", year: "numeric" })
}

// Firestore Timestamp → fecha corta
// Ej: "12 ene"
export function formatFechaCorta(ts) {
  if (!ts) return "—"
  const d = ts?.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString("es-PE", { day: "numeric", month: "short" })
}

// Firestore Timestamp → hora
// Ej: "14:32"
export function formatHora(ts) {
  if (!ts) return "—"
  const d = ts?.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })
}

// Firestore Timestamp → tiempo relativo
// Ej: "hace 3 días", "hace 2 horas", "hace 5 minutos"
export function formatTiempoRelativo(ts) {
  if (!ts) return "—"
  const d    = ts?.toDate ? ts.toDate() : new Date(ts)
  const diff = Date.now() - d.getTime()
  const min  = Math.floor(diff / 60000)
  const h    = Math.floor(diff / 3600000)
  const dias = Math.floor(diff / 86400000)
  if (dias > 0)  return `hace ${dias} día${dias > 1 ? "s" : ""}`
  if (h > 0)     return `hace ${h} hora${h > 1 ? "s" : ""}`
  if (min > 0)   return `hace ${min} minuto${min > 1 ? "s" : ""}`
  return "justo ahora"
}

// Tiempo restante hasta una fecha futura (Firestore Timestamp o ms)
// Ej: "3d 2h", "4h 30m", "12m", "Expirado"
export function formatTiempoRestante(ts) {
  if (!ts) return null
  const ms   = ts?.toDate ? ts.toDate().getTime() : new Date(ts).getTime()
  const diff = ms - Date.now()
  if (diff <= 0) return "Expirado"
  const d = Math.floor(diff / 864e5)
  const h = Math.floor((diff % 864e5) / 36e5)
  const m = Math.floor((diff % 36e5) / 6e4)
  if (d > 0) return `${d}d ${h}h`
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

// ── Dinero ───────────────────────────────────

// Formatea montos en soles
// Ej: formatSoles(1500) → "S/.1,500"
export function formatSoles(monto) {
  if (monto === null || monto === undefined) return "—"
  return `S/.${Number(monto).toLocaleString("es-PE")}`
}

// Formatea montos con decimales
// Ej: formatSolesDecimal(1500.5) → "S/.1,500.50"
export function formatSolesDecimal(monto) {
  if (monto === null || monto === undefined) return "—"
  return `S/.${Number(monto).toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

// Calcula la comisión de un proyecto
// Ej: calcComision(1500, 20) → 300
export function calcComision(precio, porcentaje = 20) {
  return Math.round((precio || 0) * (porcentaje || 20) / 100)
}

// ── Texto ────────────────────────────────────

// Primera letra en mayúscula
export function capitalize(str) {
  if (!str) return ""
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Trunca texto largo
// Ej: truncar("texto muy largo", 10) → "texto muy..."
export function truncar(str, max = 50) {
  if (!str) return ""
  return str.length > max ? str.slice(0, max) + "…" : str
}

// Inicial de un nombre
// Ej: inicial("Carlos Mendoza") → "C"
export function inicial(nombre) {
  if (!nombre) return "?"
  return nombre.charAt(0).toUpperCase()
}

// Primer nombre
// Ej: primerNombre("Carlos Mendoza") → "Carlos"
export function primerNombre(nombre) {
  if (!nombre) return ""
  return nombre.split(" ")[0]
}

// ── Números ──────────────────────────────────

// Formatea número con separador de miles
export function formatNumero(n) {
  if (n === null || n === undefined) return "0"
  return Number(n).toLocaleString("es-PE")
}

// Porcentaje legible
// Ej: formatPorcentaje(0.734) → "73%"
export function formatPorcentaje(n, decimales = 0) {
  if (n === null || n === undefined) return "0%"
  return `${(Number(n) * 100).toFixed(decimales)}%`
}

// ── Estados ──────────────────────────────────

// Configuración visual de estados de reserva/proyecto
export function cfgEstadoReserva(estado) {
  const map = {
    reservado:  { bg:"rgba(245,158,11,.14)",  color:"#f59e0b", dot:"#f59e0b", label:"Reservado"  },
    liberado:   { bg:"rgba(168,85,247,.13)",  color:"#a855f7", dot:"#a855f7", label:"Liberado"   },
    vendido:    { bg:"rgba(59,130,246,.13)",  color:"#3b82f6", dot:"#3b82f6", label:"Vendido"    },
    expirado:   { bg:"rgba(239,68,68,.11)",   color:"#ef4444", dot:"#ef4444", label:"Expirado"   },
    disponible: { bg:"rgba(16,185,129,.11)",  color:"#10b981", dot:"#10b981", label:"Disponible" },
  }
  return map[estado] || { bg:"rgba(255,255,255,.06)", color:"#aaa", dot:"#aaa", label: estado }
}

// Configuración visual de estados de solicitud
export function cfgEstadoSolicitud(estado) {
  const map = {
    pendiente:  { cls:"pen", color:"#f59e0b", label:"Pendiente" },
    aprobado:   { cls:"ok",  color:"#10b981", label:"Aprobado"  },
    rechazado:  { cls:"rej", color:"#ef4444", label:"Rechazado" },
  }
  return map[estado] || { cls:"pen", color:"#f59e0b", label: estado }
}

// Configuración visual de estados de venta
export function cfgEstadoVenta(estado) {
  const map = {
    pendiente_revision: { color:"#f59e0b", label:"En revisión"  },
    aprobado:           { color:"#10b981", label:"Aprobada"     },
    rechazado:          { color:"#ef4444", label:"Rechazada"    },
  }
  return map[estado] || { color:"#aaa", label: estado }
}

// Configuración visual de estado de pago
export function cfgEstadoPago(estado) {
  const map = {
    pendiente: { color:"#f59e0b", label:"Pendiente de pago" },
    pagado:    { color:"#10b981", label:"Pagado"            },
  }
  return map[estado] || { color:"#aaa", label: estado }
}