import { useState } from "react"
import { subirImagenCloudinary } from "./dashboardUtils"

export default function ModalVendido({ p, onClose, onConfirm, ventaExistente }) {
  const [nombre,   setNombre]   = useState("")
  const [contacto, setContacto] = useState("")
  const [file,     setFile]     = useState(null)
  const [preview,  setPreview]  = useState(null)
  const [progress, setProgress] = useState(0)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState("")

  const onFileChange = (e) => {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const enviar = async () => {
    if (!nombre || !contacto || !file) { setError("Completa todos los campos y sube el comprobante"); return }
    setError("")
    setLoading(true)
    setProgress(30)
    try {
      const url = await subirImagenCloudinary(file)
      setProgress(90)
      await onConfirm({ nombreCliente: nombre, contactoCliente: contacto, comprobanteUrl: url })
      setProgress(100)
    } catch (e) {
      setError("Error al subir imagen. Intenta de nuevo.")
      setProgress(0)
    } finally {
      setLoading(false)
    }
  }

  if (ventaExistente) return (
    <>
      <div className="dmod-t">Venta ya registrada</div>
      <div className="dmod-desc">Ya reportaste una venta para este proyecto. Está en revisión por el admin.</div>
      <div className="dmod-row">
        <button className="dbtn cyan full" onClick={onClose}>Entendido</button>
      </div>
    </>
  )

  return (
    <>
      <div className="dmod-t">Reportar venta — {p?.nombre}</div>
      <div className="dmod-desc">El admin revisará la venta y liberará tu comisión en 48h vía Yape o transferencia.</div>

      <input className="dmod-in" placeholder="Nombre del cliente" value={nombre} onChange={e => setNombre(e.target.value)} />
      <input className="dmod-in" placeholder="WhatsApp o correo del cliente" value={contacto} onChange={e => setContacto(e.target.value)} />

      <label className="dup" style={file ? { borderColor: "rgba(16,185,129,.4)" } : {}}>
        <input type="file" accept="image/*,.pdf" style={{ display: "none" }} onChange={onFileChange} />
        {preview && <img src={preview} alt="preview" className="dup-preview" />}
        <div className="dup-ico">{file ? "✓" : "📎"}</div>
        <div>{file ? file.name : "Sube el comprobante de pago"}</div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,.16)" }}>
          {file ? `${(file.size / 1024).toFixed(0)} KB` : "PNG, JPG o PDF"}
        </div>
      </label>

      {loading && (
        <div className="dup-progress">
          <div className="dup-progress-bar" style={{ width: `${progress}%` }} />
        </div>
      )}
      {error && <div style={{ color: "#ef4444", fontSize: 12, marginBottom: 8 }}>{error}</div>}

      <div className="dmod-row">
        <button className="dbtn ghost full" onClick={onClose} disabled={loading}>Cancelar</button>
        <button className="dbtn green full" disabled={!nombre || !contacto || !file || loading} onClick={enviar}>
          {loading ? "Subiendo..." : "Enviar evidencia"}
        </button>
      </div>
    </>
  )
}