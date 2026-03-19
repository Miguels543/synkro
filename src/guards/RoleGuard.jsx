import { Navigate } from "react-router-dom"
import { useAuth } from "../context/authcontext"

export default function RoleGuard({ children, rolesPermitidos }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (!rolesPermitidos.includes(user.rol)) return <Navigate to="/" replace />
  return children
}