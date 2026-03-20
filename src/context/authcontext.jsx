import { createContext, useContext, useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "../firebase/config"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // Función reutilizable para cargar los datos del user desde Firestore
  const cargarDatosUser = async (firebaseUser) => {
    const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))
    if (userDoc.exists()) {
      setUser({ ...firebaseUser, ...userDoc.data() })
    } else {
      setUser(firebaseUser)
    }
  }

  useEffect(() => {
    const unsuscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await cargarDatosUser(firebaseUser)
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return unsuscribe
  }, [])

  // refreshUser: lo llama ProtectedRoute para re-leer Firestore sin cerrar sesión
  const refreshUser = async () => {
    if (auth.currentUser) {
      await cargarDatosUser(auth.currentUser)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}