// ─────────────────────────────────────────────
// ROLES
// ─────────────────────────────────────────────

export const ROLES = {
  ADMIN:    "admin",
  VENDEDOR: "vendedor",
}

export const ESTADOS_USUARIO = {
  PENDIENTE:  "pendiente",
  APROBADO:   "aprobado",
  RECHAZADO:  "rechazado",
}

// Verifica si el usuario tiene un rol específico
export function tieneRol(user, rol) {
  return user?.rol === rol
}

export function esAdmin(user) {
  return tieneRol(user, ROLES.ADMIN)
}

export function esVendedor(user) {
  return tieneRol(user, ROLES.VENDEDOR)
}

// Verifica si el vendedor tiene acceso completo (aprobado)
export function vendedorAprobado(user) {
  return esVendedor(user) && user?.estado === ESTADOS_USUARIO.APROBADO
}

export function vendedorPendiente(user) {
  return esVendedor(user) && user?.estado === ESTADOS_USUARIO.PENDIENTE
}

export function vendedorRechazado(user) {
  return esVendedor(user) && user?.estado === ESTADOS_USUARIO.RECHAZADO
}

// Devuelve la ruta de inicio según el rol
export function rutaInicio(user) {
  if (esAdmin(user))    return "/admin"
  if (esVendedor(user)) return "/dashboard"
  return "/"
}

// Etiqueta legible del rol
export function etiquetaRol(rol) {
  const map = {
    admin:    "Administrador",
    vendedor: "Vendedor",
  }
  return map[rol] || "Usuario"
}

// Etiqueta legible del estado del vendedor
export function etiquetaEstado(estado) {
  const map = {
    pendiente:  "Pendiente de aprobación",
    aprobado:   "Aprobado",
    rechazado:  "No aprobado",
  }
  return map[estado] || estado
}

// Etiqueta legible del nivel de experiencia (Register)
export function etiquetaExperiencia(experiencia) {
  const map = {
    ninguna:  "Sin experiencia",
    poca:     "Poca experiencia",
    moderada: "Experiencia moderada",
    bastante: "Bastante experiencia",
  }
  return map[experiencia] || experiencia
}