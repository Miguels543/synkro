import { useState } from "react"
import { subirImagenCloudinary } from "./dashboardUtils"

export default function ModalMision({ m, onClose, onConfirm }) {
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
    if (!file) { setError("Sube una captura como evidencia"); return }
    setError("")
    setLoading(true)
    setProgress(30)
    try {
      const url = await subirImagenCloudinary(file)
      setProgress(90)
      await onConfirm({ evidenciaUrl: url })
      setProgress(100)
    } catch (e) {
      setError("Error al subir imagen. Intenta de nuevo.")
      setProgress(0)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="dmod-t">{m.titulo}</div>
      <div className="dmod-desc">{m.desc}</div>
      <div className="dmod-warn">
        ⚠️ El pago de esta misión se libera cuando la venta del proyecto sea aprobada por el admin.
      </div>

      <label className="dup" style={file ? { borderColor: "rgba(16,185,129,.4)" } : {}}>
        <input type="file" accept="image/*" style={{ display: "none" }} onChange={onFileChange} />
        {preview && <img src={preview} alt="preview" className="dup-preview" />}
        <div className="dup-ico">{file ? "✓" : "📸"}</div>
        <div>{file ? file.name : "Sube una captura como evidencia"}</div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,.16)" }}>
          {file ? `${(file.size / 1024).toFixed(0)} KB` : "PNG o JPG"}
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
        <button className="dbtn green full" disabled={!file || loading} onClick={enviar}>
          {loading ? "Subiendo..." : "Enviar evidencia"}
        </button>
      </div>
    </>
  )
}