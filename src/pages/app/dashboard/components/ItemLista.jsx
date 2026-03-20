import { estadoCfg } from "./dashboardUtils"

export default function ItemLista({ p, activo, onClick }) {
  const cfg      = estadoCfg(p.estado)
  const precio   = p.precioMin || p.precio || 0
  const comision = Math.round(precio * (p.comision || 20) / 100)

  return (
    <div className={`ditem ${activo ? "on" : ""}`} onClick={onClick}>
      <img src={p.imagenes?.[0]} alt="" className="ditem-img" />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="ditem-nom">{p.nombre}</div>
        <div className="ditem-bot">
          <div className="dchip" style={{ background: cfg.bg, color: cfg.color }}>
            <div className="dchip-dot" style={{ background: cfg.dot }} />
            {cfg.label}
          </div>
          <div className="ditem-com">S/.{comision}</div>
        </div>
      </div>
    </div>
  )
}