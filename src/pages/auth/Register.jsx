import { useState, useEffect } from "react"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc, collection, addDoc, serverTimestamp } from "firebase/firestore"
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
  { value: "+54",   label: <span><ReactCountryFlag countryCode="AR" svg /> +54</span> },
  { value: "+591",  label: <span><ReactCountryFlag countryCode="BO" svg /> +591</span> },
  { value: "+56",   label: <span><ReactCountryFlag countryCode="CL" svg /> +56</span> },
  { value: "+57",   label: <span><ReactCountryFlag countryCode="CO" svg /> +57</span> },
  { value: "+506",  label: <span><ReactCountryFlag countryCode="CR" svg /> +506</span> },
  { value: "+53",   label: <span><ReactCountryFlag countryCode="CU" svg /> +53</span> },
  { value: "+1809", label: <span><ReactCountryFlag countryCode="DO" svg /> +1809</span> },
  { value: "+593",  label: <span><ReactCountryFlag countryCode="EC" svg /> +593</span> },
  { value: "+503",  label: <span><ReactCountryFlag countryCode="SV" svg /> +503</span> },
  { value: "+34",   label: <span><ReactCountryFlag countryCode="ES" svg /> +34</span> },
  { value: "+240",  label: <span><ReactCountryFlag countryCode="GQ" svg /> +240</span> },
  { value: "+502",  label: <span><ReactCountryFlag countryCode="GT" svg /> +502</span> },
  { value: "+504",  label: <span><ReactCountryFlag countryCode="HN" svg /> +504</span> },
  { value: "+52",   label: <span><ReactCountryFlag countryCode="MX" svg /> +52</span> },
  { value: "+505",  label: <span><ReactCountryFlag countryCode="NI" svg /> +505</span> },
  { value: "+507",  label: <span><ReactCountryFlag countryCode="PA" svg /> +507</span> },
  { value: "+595",  label: <span><ReactCountryFlag countryCode="PY" svg /> +595</span> },
  { value: "+51",   label: <span><ReactCountryFlag countryCode="PE" svg /> +51</span> },
  { value: "+1787", label: <span><ReactCountryFlag countryCode="PR" svg /> +1787</span> },
  { value: "+598",  label: <span><ReactCountryFlag countryCode="UY" svg /> +598</span> },
  { value: "+58",   label: <span><ReactCountryFlag countryCode="VE" svg /> +58</span> },
]

const opcionesExperiencia = [
  { value: "ninguna",  label: "Ninguna — es mi primera vez" },
  { value: "poca",     label: "Poca — he vendido algo informal" },
  { value: "moderada", label: "Moderada — tengo experiencia básica" },
  { value: "bastante", label: "Bastante — llevo tiempo en ventas" },
]

// Detecta qué plataforma es para mostrar la etiqueta en tiempo real
function detectarPlataforma(red) {
  if (!red) return null
  const r = red.toLowerCase()
  if (r.includes("tiktok"))   return "TikTok"
  if (r.includes("linkedin")) return "LinkedIn"
  if (r.includes("twitter") || r.includes("x.com")) return "X / Twitter"
  if (r.includes("facebook")) return "Facebook"
  if (r.includes("youtube"))  return "YouTube"
  if (r.startsWith("http"))   return "Enlace"
  return "Instagram"  // por defecto si es solo @usuario o nombre
}

const styles = `
  .register-page {
    min-height: 100vh; background: #000;
    display: flex; justify-content: center; align-items: flex-start;
    position: relative; padding: 80px 20px 40px; overflow: hidden;
  }
  .register-box {
    position: relative; z-index: 10; width: 100%; max-width: 750px;
    padding: 40px; background: rgba(0,10,20,0.88);
    border: 1px solid rgba(0,243,255,0.3); border-radius: 20px;
    backdrop-filter: blur(10px); box-shadow: 0 0 30px rgba(0,243,255,0.1);
  }
  .register-box h2 {
    text-align: center; color: #00f3ff; font-size: 28px;
    margin-bottom: 6px; text-shadow: 0 0 10px rgba(0,243,255,0.4);
  }
  .register-intro {
    text-align: center; color: rgba(255,255,255,.35);
    font-size: 13px; margin-bottom: 28px; line-height: 1.6;
  }
  .register-section {
    font-size: 9px; letter-spacing: 2.5px; text-transform: uppercase;
    color: rgba(0,243,255,.4); margin: 22px 0 12px;
    display: flex; align-items: center; gap: 10px;
  }
  .register-section::before, .register-section::after {
    content: ''; flex: 1; height: 1px; background: rgba(0,243,255,.1);
  }
  .register-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .register-full { grid-column: 1 / -1; }
  .register-input {
    width: 100%; padding: 12px; background: rgba(0,243,255,0.05);
    border: 1px solid rgba(0,243,255,0.25); border-radius: 10px;
    color: #fff; font-size: 15px; outline: none; box-sizing: border-box;
    font-family: 'Plus Jakarta Sans', sans-serif; transition: border 0.25s ease;
  }
  .register-input:focus { border-color: #00f3ff; box-shadow: 0 0 8px rgba(0,243,255,0.25); }
  .register-input::placeholder { color: rgba(255,255,255,.3); }
  .register-textarea {
    width: 100%; padding: 12px; background: rgba(0,243,255,0.05);
    border: 1px solid rgba(0,243,255,0.25); border-radius: 10px;
    color: #fff; font-size: 14px; outline: none; box-sizing: border-box;
    font-family: 'Plus Jakarta Sans', sans-serif; transition: border 0.25s ease;
    resize: vertical; min-height: 90px; line-height: 1.6;
  }
  .register-textarea:focus { border-color: #00f3ff; box-shadow: 0 0 8px rgba(0,243,255,0.25); }
  .register-textarea::placeholder { color: rgba(255,255,255,.3); }
  .register-char { text-align: right; font-size: 11px; margin-top: 4px; transition: color .2s; }
  .phone-container { display: flex; gap: 8px; }

  /* Red social — wrap con badge de plataforma */
  .register-red-wrap { position: relative; }
  .register-red-badge {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    font-size: 10px; font-weight: 700; letter-spacing: .5px;
    color: rgba(0,243,255,.6); pointer-events: none;
    background: rgba(0,243,255,.07); border: 1px solid rgba(0,243,255,.15);
    border-radius: 6px; padding: 2px 7px;
  }

  .register-btn {
    width: 100%; padding: 13px; margin-top: 22px;
    background: linear-gradient(45deg, #00f3ff, #0066ff);
    border: none; border-radius: 10px; color: #000;
    font-size: 16px; font-weight: bold; cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: opacity 0.3s ease, box-shadow 0.3s ease;
  }
  .register-btn:hover:not(:disabled) { opacity: .85; box-shadow: 0 0 20px rgba(0,243,255,0.4); }
  .register-btn:disabled { opacity: .5; cursor: not-allowed; }
  .register-error  { color: #ff4444; font-size: 13px; margin-top: 10px; text-align: center; }
  .register-footer { text-align: center; margin-top: 18px; color: rgba(255,255,255,.35); font-size: 14px; }
  .register-footer a { color: #00f3ff; text-decoration: none; }

  /* Hint debajo del campo de red social */
  .register-hint {
    font-size: 10.5px; color: rgba(255,255,255,.2);
    margin-top: 5px; line-height: 1.5;
  }

  @media (max-width: 768px) {
    .register-page { padding: 70px 16px 32px; align-items: flex-start; }
    .register-box  { padding: 28px 20px; }
    .register-grid { grid-template-columns: 1fr; }
    .register-full { grid-column: 1; }
    .register-box h2 { font-size: 22px; }
  }
  @media (max-width: 480px) {
    .register-page { padding: 60px 5% 24px; }
    .register-box  { padding: 22px 14px; }
    .register-box h2 { font-size: 20px; margin-bottom: 4px; }
    .register-intro { font-size: 12px; }
    .register-input, .register-textarea { font-size: 14px; padding: 10px; }
    .register-btn   { font-size: 15px; padding: 11px; }
  }
`

const selectBase = {
  control:            (b, s) => ({ ...b, background: "rgba(0,243,255,.05)", border: `1px solid ${s.isFocused ? "#00f3ff" : "rgba(0,243,255,.25)"}`, borderRadius: "10px", minHeight: "45px", boxShadow: "none" }),
  menu:               (b)    => ({ ...b, background: "#000d1a", border: "1px solid rgba(0,243,255,.2)", zIndex: 20 }),
  option:             (b, s) => ({ ...b, background: s.isFocused ? "rgba(0,243,255,.1)" : "transparent", color: "#fff", cursor: "pointer" }),
  singleValue:        (b)    => ({ ...b, color: "#fff" }),
  placeholder:        (b)    => ({ ...b, color: "rgba(255,255,255,.3)" }),
  input:              (b)    => ({ ...b, color: "#fff" }),
  dropdownIndicator:  (b)    => ({ ...b, color: "rgba(0,243,255,.4)" }),
  indicatorSeparator: ()     => ({ display: "none" }),
}

const MIN_MOTIVACION = 50

function Register() {
  const [form, setForm] = useState({
    nombre: "", usuario: "", email: "", password: "",
    codigoPais: { value: "+51", label: <span><ReactCountryFlag countryCode="PE" svg /> +51</span> },
    whatsapp: "", pais: null,
    motivacion:  "",
    experiencia: null,
    redSocial:   "",
  })
  const [error,    setError]    = useState("")
  const [loading,  setLoading]  = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const navigate = useNavigate()

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }))
  const handleChange = (e) => set(e.target.name, e.target.value)

  const handleRegister = async (e) => {
    e.preventDefault()
    setError("")

    if (!form.pais)        { setError("Selecciona tu país"); return }
    if (!form.experiencia) { setError("Indica tu nivel de experiencia en ventas"); return }
    if (form.motivacion.trim().length < MIN_MOTIVACION) {
      setError(`Cuéntanos un poco más sobre tu motivación (mínimo ${MIN_MOTIVACION} caracteres)`)
      return
    }

    setLoading(true)
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password)
      const uid = userCredential.user.uid
      const whatsappCompleto = form.codigoPais.value + form.whatsapp

      await setDoc(doc(db, "users", uid), {
        uid,
        nombre:      form.nombre,
        usuario:     form.usuario,
        email:       form.email,
        whatsapp:    whatsappCompleto,
        pais:        form.pais.value,
        rol:         "vendedor",
        estado:      "pendiente",
        experiencia: form.experiencia.value,
        puntos:      0,
        ventas:      0,
        createdAt:   serverTimestamp(),
      })

      await addDoc(collection(db, "solicitudes"), {
        uid,
        nombre:      form.nombre,
        email:       form.email,
        telefono:    whatsappCompleto,
        pais:        form.pais.value,
        estado:      "pendiente",
        motivacion:  form.motivacion.trim(),
        experiencia: form.experiencia.value,
        redSocial:   form.redSocial.trim(),
        fecha:       serverTimestamp(),
      })

      navigate("/dashboard")
    } catch (err) {
      if (err.code === "auth/email-already-in-use") setError("Este correo ya está registrado")
      else if (err.code === "auth/weak-password")   setError("La contraseña debe tener al menos 6 caracteres")
      else setError("Error al registrarse, intenta de nuevo")
    } finally {
      setLoading(false)
    }
  }

  const charColor = form.motivacion.length >= MIN_MOTIVACION
    ? "rgba(16,185,129,.7)"
    : form.motivacion.length > 20
      ? "rgba(245,158,11,.7)"
      : "rgba(255,255,255,.2)"

  const plataforma = detectarPlataforma(form.redSocial)

  return (
    <div className="register-page">
      <style>{styles}</style>
      {isMobile ? <CiudadDigital /> : <ParticlesBackground />}

      <div className="register-box">
        <h2>Únete como Vendedor</h2>
        <p className="register-intro">
          Completa el formulario — tu solicitud será revisada en 24 a 48 horas.
        </p>

        <form onSubmit={handleRegister}>

          {/* ── Datos personales ── */}
          <div className="register-section">Datos personales</div>
          <div className="register-grid">
            <input name="nombre"   type="text"     placeholder="Nombre completo"    value={form.nombre}   onChange={handleChange} required className="register-input" />
            <input name="usuario"  type="text"     placeholder="Nombre de usuario"  value={form.usuario}  onChange={handleChange} required className="register-input" />
            <input name="email"    type="email"    placeholder="Correo electrónico" value={form.email}    onChange={handleChange} required className="register-input" />
            <input name="password" type="password" placeholder="Contraseña"         value={form.password} onChange={handleChange} required className="register-input" />

            <div className="phone-container register-full">
              <Select
                options={codigos} value={form.codigoPais}
                onChange={(s) => set("codigoPais", s)}
                styles={{ ...selectBase, container: (b) => ({ ...b, width: "140px", flexShrink: 0 }), menu: (b) => ({ ...b, background: "#000d1a", border: "1px solid rgba(0,243,255,.2)", width: "170px" }) }}
              />
              <input
                name="whatsapp" type="tel" placeholder="WhatsApp"
                value={form.whatsapp}
                onChange={(e) => set("whatsapp", e.target.value.replace(/\D/g, ""))}
                required className="register-input" style={{ flex: 1 }}
              />
            </div>

            <div className="register-full">
              <Select
                options={paises} value={form.pais}
                onChange={(s) => set("pais", s)}
                placeholder="Selecciona tu país"
                styles={selectBase}
              />
            </div>
          </div>

          {/* ── Sobre ti ── */}
          <div className="register-section">Sobre ti</div>
          <div className="register-grid">

            <div className="register-full">
              <Select
                options={opcionesExperiencia} value={form.experiencia}
                onChange={(s) => set("experiencia", s)}
                placeholder="¿Cuánta experiencia en ventas tienes?"
                styles={selectBase}
              />
            </div>

            {/* Red social — sin @ prefix, con badge de plataforma detectada */}
            <div className="register-full register-red-wrap">
              <input
                name="redSocial" type="text"
                placeholder="Ej: @miusuario · tiktok.com/@usuario · linkedin.com/in/usuario"
                value={form.redSocial}
                onChange={handleChange}
                className="register-input"
                style={{ paddingRight: plataforma ? "100px" : "12px" }}
              />
              {/* Badge que muestra la plataforma detectada en tiempo real */}
              {form.redSocial && plataforma && (
                <span className="register-red-badge">{plataforma}</span>
              )}
            </div>
            <p className="register-hint register-full">
              Puede ser Instagram, TikTok, LinkedIn, X, Facebook o YouTube. Escribe tu usuario o pega el enlace completo.
            </p>

            <div className="register-full">
              <textarea
                name="motivacion"
                placeholder="¿Por qué quieres vender con Synkro? Cuéntanos en tus propias palabras…"
                value={form.motivacion}
                onChange={handleChange}
                className="register-textarea"
                maxLength={500}
              />
              <div className="register-char" style={{ color: charColor }}>
                {form.motivacion.length < MIN_MOTIVACION
                  ? `${MIN_MOTIVACION - form.motivacion.length} caracteres más`
                  : `✓ ${form.motivacion.length} / 500`}
              </div>
            </div>

          </div>

          {error && <p className="register-error">{error}</p>}

          <button type="submit" disabled={loading} className="register-btn">
            {loading ? "Enviando solicitud…" : "Enviar solicitud"}
          </button>
        </form>

        <p className="register-footer">
          ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
        </p>
      </div>
    </div>
  )
}

export default Register