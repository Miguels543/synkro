import { useState, useEffect } from "react"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "../../firebase/config"
import { useNavigate } from "react-router-dom"
import Select from "react-select"
import ReactCountryFlag from "react-country-flag"
import ParticlesBackground from "../../components/shared/Particles"
import CiudadDigital from "../../components/shared/CiudadDigital"

const paises = [
  { value: "AR", label: <span><ReactCountryFlag countryCode="AR" svg /> Argentina</span> },
  { value: "BO", label: <span><ReactCountryFlag countryCode="BO" svg /> Bolivia</span> },
  { value: "CL", label: <span><ReactCountryFlag countryCode="CL" svg /> Chile</span> },
  { value: "CO", label: <span><ReactCountryFlag countryCode="CO" svg /> Colombia</span> },
  { value: "CR", label: <span><ReactCountryFlag countryCode="CR" svg /> Costa Rica</span> },
  { value: "CU", label: <span><ReactCountryFlag countryCode="CU" svg /> Cuba</span> },
  { value: "DO", label: <span><ReactCountryFlag countryCode="DO" svg /> República Dominicana</span> },
  { value: "EC", label: <span><ReactCountryFlag countryCode="EC" svg /> Ecuador</span> },
  { value: "SV", label: <span><ReactCountryFlag countryCode="SV" svg /> El Salvador</span> },
  { value: "ES", label: <span><ReactCountryFlag countryCode="ES" svg /> España</span> },
  { value: "GQ", label: <span><ReactCountryFlag countryCode="GQ" svg /> Guinea Ecuatorial</span> },
  { value: "GT", label: <span><ReactCountryFlag countryCode="GT" svg /> Guatemala</span> },
  { value: "HN", label: <span><ReactCountryFlag countryCode="HN" svg /> Honduras</span> },
  { value: "MX", label: <span><ReactCountryFlag countryCode="MX" svg /> México</span> },
  { value: "NI", label: <span><ReactCountryFlag countryCode="NI" svg /> Nicaragua</span> },
  { value: "PA", label: <span><ReactCountryFlag countryCode="PA" svg /> Panamá</span> },
  { value: "PY", label: <span><ReactCountryFlag countryCode="PY" svg /> Paraguay</span> },
  { value: "PE", label: <span><ReactCountryFlag countryCode="PE" svg /> Perú</span> },
  { value: "PR", label: <span><ReactCountryFlag countryCode="PR" svg /> Puerto Rico</span> },
  { value: "UY", label: <span><ReactCountryFlag countryCode="UY" svg /> Uruguay</span> },
  { value: "VE", label: <span><ReactCountryFlag countryCode="VE" svg /> Venezuela</span> },
]

const codigos = [
  { value: "+54", label: <span><ReactCountryFlag countryCode="AR" svg /> +54</span> },
  { value: "+591", label: <span><ReactCountryFlag countryCode="BO" svg /> +591</span> },
  { value: "+56", label: <span><ReactCountryFlag countryCode="CL" svg /> +56</span> },
  { value: "+57", label: <span><ReactCountryFlag countryCode="CO" svg /> +57</span> },
  { value: "+506", label: <span><ReactCountryFlag countryCode="CR" svg /> +506</span> },
  { value: "+53", label: <span><ReactCountryFlag countryCode="CU" svg /> +53</span> },
  { value: "+1809", label: <span><ReactCountryFlag countryCode="DO" svg /> +1809</span> },
  { value: "+593", label: <span><ReactCountryFlag countryCode="EC" svg /> +593</span> },
  { value: "+503", label: <span><ReactCountryFlag countryCode="SV" svg /> +503</span> },
  { value: "+34", label: <span><ReactCountryFlag countryCode="ES" svg /> +34</span> },
  { value: "+240", label: <span><ReactCountryFlag countryCode="GQ" svg /> +240</span> },
  { value: "+502", label: <span><ReactCountryFlag countryCode="GT" svg /> +502</span> },
  { value: "+504", label: <span><ReactCountryFlag countryCode="HN" svg /> +504</span> },
  { value: "+52", label: <span><ReactCountryFlag countryCode="MX" svg /> +52</span> },
  { value: "+505", label: <span><ReactCountryFlag countryCode="NI" svg /> +505</span> },
  { value: "+507", label: <span><ReactCountryFlag countryCode="PA" svg /> +507</span> },
  { value: "+595", label: <span><ReactCountryFlag countryCode="PY" svg /> +595</span> },
  { value: "+51", label: <span><ReactCountryFlag countryCode="PE" svg /> +51</span> },
  { value: "+1787", label: <span><ReactCountryFlag countryCode="PR" svg /> +1787</span> },
  { value: "+598", label: <span><ReactCountryFlag countryCode="UY" svg /> +598</span> },
  { value: "+58", label: <span><ReactCountryFlag countryCode="VE" svg /> +58</span> },
]

const styles = `
  .register-page {
    min-height: 100vh;
    background: #000;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: 80px 20px 20px;
    overflow: hidden;
  }

  .register-box {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 750px;
    padding: 40px;
    background: rgba(0, 10, 20, 0.85);
    border: 1px solid rgba(0, 243, 255, 0.3);
    border-radius: 20px;
    backdrop-filter: blur(10px);
    box-shadow: 0 0 30px rgba(0, 243, 255, 0.1);
  }

  .register-box h2 {
    text-align: center;
    color: #00f3ff;
    font-size: 28px;
    margin-bottom: 30px;
    text-shadow: 0 0 10px rgba(0, 243, 255, 0.4);
  }

  .register-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
  }

  .register-input {
    width: 100%;
    padding: 12px;
    background: rgba(0, 243, 255, 0.05);
    border: 1px solid rgba(0, 243, 255, 0.3);
    border-radius: 10px;
    color: #fff;
    font-size: 15px;
    outline: none;
    box-sizing: border-box;
    font-family: 'Roboto', sans-serif;
    transition: border 0.3s ease;
  }

  .register-input:focus {
    border-color: #00f3ff;
    box-shadow: 0 0 8px rgba(0, 243, 255, 0.3);
  }

  .register-input::placeholder {
    color: #b3b3b3;
  }

  .phone-container {
    display: flex;
    gap: 8px;
  }

  .phone-code-select {
    width: 110px;
    padding: 12px 8px;
    background: rgba(0, 243, 255, 0.05);
    border: 1px solid rgba(0, 243, 255, 0.3);
    border-radius: 10px;
    color: #fff;
    font-size: 13px;
    outline: none;
    cursor: pointer;
    font-family: 'Roboto', sans-serif;
  }

  .phone-code-select option {
    background: #000d1a;
    color: #fff;
  }

  .register-btn {
    width: 100%;
    padding: 13px;
    margin-top: 20px;
    background: linear-gradient(45deg, #00f3ff, #0066ff);
    border: none;
    border-radius: 10px;
    color: #000;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    font-family: 'Roboto', sans-serif;
    transition: opacity 0.3s ease, box-shadow 0.3s ease;
  }

  .register-btn:hover {
    opacity: 0.85;
    box-shadow: 0 0 20px rgba(0, 243, 255, 0.4);
  }

  .register-error {
    color: #ff4444;
    font-size: 14px;
    margin-top: 10px;
    text-align: center;
  }

  .register-footer {
    text-align: center;
    margin-top: 20px;
    color: #b3b3b3;
    font-size: 14px;
  }

  .register-footer a {
    color: #00f3ff;
    text-decoration: none;
  }

  /* ── Responsive ── */

  @media (max-width: 768px) {
    .register-box {
      padding: 30px 20px;
    }

    .register-grid {
      grid-template-columns: 1fr;
    }

    .register-box h2 {
      font-size: 22px;
    }
  }

  @media (max-width: 480px) {
    .register-page {
      padding: 60px 5% 20px;
    }

    .register-box {
      padding: 24px 16px;
    }

    .register-box h2 {
      font-size: 20px;
      margin-bottom: 20px;
    }

    .register-input {
      font-size: 14px;
      padding: 10px;
    }

    .register-btn {
      font-size: 15px;
      padding: 11px;
    }
  }
`

function Register() {
  const [form, setForm] = useState({
    nombre: "",
    usuario: "",
    email: "",
    password: "",
    codigoPais: { value: "+51", label: <span><ReactCountryFlag countryCode="PE" svg /> +51</span> },
    whatsapp: "",
    pais: null,
  })
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError("")

    if (!form.pais) {
      setError("Selecciona tu país")
      return
    }

    setLoading(true)

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password)
      const uid = userCredential.user.uid

      await setDoc(doc(db, "users", uid), {
        nombre: form.nombre,
        usuario: form.usuario,
        email: form.email,
        whatsapp: form.codigoPais.value + form.whatsapp,
        pais: form.pais.value,
        rol: "vendedor",
        puntos: 0,
        ventas: 0,
        createdAt: new Date(),
      })

      navigate("/dashboard")
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Este correo ya está registrado")
      } else if (err.code === "auth/weak-password") {
        setError("La contraseña debe tener al menos 6 caracteres")
      } else {
        setError("Error al registrarse, intenta de nuevo")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-page">
      <style>{styles}</style>

      {/* Fondo: partículas en desktop, ciudad digital en mobile */}
      {isMobile ? <CiudadDigital /> : <ParticlesBackground />}

      <div className="register-box">
        <h2>Únete como Vendedor</h2>

        <form onSubmit={handleRegister}>
          <div className="register-grid">
            <input
              name="nombre"
              type="text"
              placeholder="Nombre completo"
              value={form.nombre}
              onChange={handleChange}
              required
              className="register-input"
            />
            <input
              name="usuario"
              type="text"
              placeholder="Nombre de usuario"
              value={form.usuario}
              onChange={handleChange}
              required
              className="register-input"
            />
            <input
              name="email"
              type="email"
              placeholder="Correo electrónico"
              value={form.email}
              onChange={handleChange}
              required
              className="register-input"
            />
            <input
              name="password"
              type="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              required
              className="register-input"
            />
            <div className="phone-container">
              <Select
                options={codigos}
                value={form.codigoPais}
                onChange={(selected) => setForm({ ...form, codigoPais: selected })}
                styles={{
                  container: (base) => ({ ...base, width: "130px" }),
                  control: (base) => ({
                    ...base,
                    background: "rgba(0, 243, 255, 0.05)",
                    border: "1px solid rgba(0, 243, 255, 0.3)",
                    borderRadius: "10px",
                    minHeight: "45px",
                  }),
                  menu: (base) => ({
                    ...base,
                    background: "#000d1a",
                    border: "1px solid rgba(0, 243, 255, 0.3)",
                    width: "160px",
                  }),
                  option: (base, state) => ({
                    ...base,
                    background: state.isFocused ? "rgba(0, 243, 255, 0.1)" : "transparent",
                    color: "#fff",
                    cursor: "pointer",
                  }),
                  singleValue: (base) => ({ ...base, color: "#fff" }),
                  placeholder: (base) => ({ ...base, color: "#b3b3b3" }),
                  input: (base) => ({ ...base, color: "#fff" }),
                }}
              />
              <input
                name="whatsapp"
                type="tel"
                placeholder="Número"
                value={form.whatsapp}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "")
                  setForm({ ...form, whatsapp: val })
                }}
                required
                className="register-input"
                style={{ flex: 1 }}
              />
            </div>
            <Select
              options={paises}
              value={form.pais}
              onChange={(selected) => setForm({ ...form, pais: selected })}
              placeholder="Selecciona tu país"
              styles={{
                control: (base) => ({
                  ...base,
                  background: "rgba(0, 243, 255, 0.05)",
                  border: "1px solid rgba(0, 243, 255, 0.3)",
                  borderRadius: "10px",
                  color: "#fff",
                  minHeight: "45px",
                }),
                menu: (base) => ({
                  ...base,
                  background: "#000d1a",
                  border: "1px solid rgba(0, 243, 255, 0.3)",
                }),
                option: (base, state) => ({
                  ...base,
                  background: state.isFocused ? "rgba(0, 243, 255, 0.1)" : "transparent",
                  color: "#fff",
                  cursor: "pointer",
                }),
                singleValue: (base) => ({ ...base, color: "#fff" }),
                placeholder: (base) => ({ ...base, color: "#b3b3b3" }),
                input: (base) => ({ ...base, color: "#fff" }),
              }}
            />
          </div>

          {error && <p className="register-error">{error}</p>}

          <button type="submit" disabled={loading} className="register-btn">
            {loading ? "Registrando..." : "Registrarme"}
          </button>
        </form>

        <p className="register-footer">
          ¿Ya tienes cuenta?{" "}
          <a href="/login">Inicia sesión</a>
        </p>
      </div>
    </div>
  )
}

export default Register