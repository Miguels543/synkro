import { useState, useEffect } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "../../firebase/config"
import { useNavigate } from "react-router-dom"
import ParticlesBackground from "../../components/shared/Particles"
import CiudadDigital from "../../components/shared/CiudadDigital"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const navigate = useNavigate()

  // Detecta cambio de tamaño para swapear fondo
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const uid = userCredential.user.uid
      const userDoc = await getDoc(doc(db, "users", uid))

      if (userDoc.exists()) {
        const rol = userDoc.data().rol
        if (rol === "admin") navigate("/admin")
        else if (rol === "vendedor") navigate("/dashboard")
        else setError("Rol no reconocido")
      } else {
        setError("Usuario no encontrado en la base de datos")
      }
    } catch (err) {
      setError("Correo o contraseña incorrectos")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "#000",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Fondo: partículas en desktop, ciudad digital en mobile */}
      {isMobile ? <CiudadDigital /> : <ParticlesBackground />}

      {/* Card del formulario — siempre encima del fondo */}
      <div style={{
        position: "relative",
        zIndex: 10,                          // ← alto para estar siempre sobre el fondo
        width: "100%",
        maxWidth: "400px",
        padding: "40px",
        background: "rgba(0, 10, 20, 0.8)",
        border: "1px solid rgba(0, 243, 255, 0.3)",
        borderRadius: "20px",
        backdropFilter: "blur(10px)",
        boxShadow: "0 0 30px rgba(0, 243, 255, 0.1)",
        margin: "0 16px",                    // margen lateral en pantallas pequeñas
      }}>
        <h2 style={{ 
          textAlign: "center", 
          color: "#00f3ff", 
          marginBottom: "30px",
          fontSize: "28px"
        }}>
          Iniciar Sesión
        </h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />

          {error && (
            <p style={{ color: "#ff4444", fontSize: "14px", marginTop: "10px" }}>
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p style={{ 
          textAlign: "center", 
          marginTop: "20px", 
          color: "#b3b3b3",
          fontSize: "14px"
        }}>
          ¿Quieres vender con nosotros?{" "}
          <a href="/register" style={{ color: "#00f3ff" }}>
            Regístrate aquí
          </a>
        </p>

        <p style={{ 
          textAlign: "center", 
          marginTop: "10px",
          fontSize: "14px"
        }}>
          <a href="#" style={{ color: "#b3b3b3" }}>
            Olvidé mi contraseña
          </a>
        </p>
      </div>
    </div>
  )
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  background: "rgba(0, 243, 255, 0.05)",
  border: "1px solid rgba(0, 243, 255, 0.3)",
  borderRadius: "10px",
  color: "#fff",
  fontSize: "16px",
  outline: "none",
  boxSizing: "border-box",
}

const buttonStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "10px",
  background: "linear-gradient(45deg, #00f3ff, #0066ff)",
  border: "none",
  borderRadius: "10px",
  color: "#000",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
}

export default Login