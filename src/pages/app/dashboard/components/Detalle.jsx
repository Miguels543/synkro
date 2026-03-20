import { estadoCfg, tiempoRestante } from "./dashboardUtils"

export default function Detalle({ p, imgIdx, onPrev, onNext, onDot, onVendido, onReservar }) {
  const cfg      = estadoCfg(p.estado)
  const precio   = p.precioMin || p.precio || 0
  const comision = Math.round(precio * (p.comision || 20) / 100)
  const imgs     = p.imagenes || []

  return (
    <div className="ddet">
      <div className="ddet-gal">
        <img src={imgs[imgIdx] || imgs[0]} alt="" className="ddet-gal-img" />
        <div className="ddet-gal-overlay" />
        {imgs.length > 1 && (
          <>
            <button className="dgal-btn prev" onClick={onPrev}>‹</button>
            <button className="dgal-btn next" onClick={onNext}>›</button>
            <div className="dgal-dots">
              {imgs.map((_, i) => (
                <button key={i} className={`dgal-dot ${i === imgIdx ? "on" : ""}`} onClick={() => onDot(i)} />
              ))}
            </div>
          </>
        )}
        <div className="ddet-over">
          <div>
            <div className="ddet-cat">{p.categoria?.toUpperCase()}</div>
            <div className="ddet-nom">{p.nombre}</div>
          </div>
          <div className="ddet-over-r">
            <div className="dchip" style={{ background: cfg.bg, color: cfg.color, fontSize: 9, padding: "3px 10px" }}>
              <div className="dchip-dot" style={{ background: cfg.dot }} />{cfg.label}
            </div>
            {p.demo && (
              <a href={p.demo} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                <button className="dbtn ghost" style={{ fontSize: 11 }}>🔗 Ver demo</button>
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="ddet-body">
        {p.estado === "liberado" && (
          <div className="dliberado">
            <div className="dliberado-ico">🔓</div>
            <div>
              Este proyecto se liberó para ti. Tienes{" "}
              <strong style={{ color: "#a855f7" }}>{tiempoRestante(p.expiraEn)}</strong> para reservarlo.
            </div>
          </div>
        )}

        <div className="ddet-meta">
          <div className="dmet">
            <div className="dmet-l">Precio desde</div>
            <div className="dmet-v" style={{ color: "#00f3ff" }}>S/.{precio.toLocaleString()}</div>
            <div className="dmet-s">{p.precioMax ? `hasta S/.${p.precioMax.toLocaleString()}` : "Pago único"}</div>
          </div>
          <div className="dmet">
            <div className="dmet-l">Tu comisión ({p.comision || 20}%)</div>
            <div className="dmet-v" style={{ color: "#10b981" }}>S/.{comision}</div>
            <div className="dmet-s">Pagado en 48h</div>
          </div>
          <div className="dmet">
            {p.estado === "reservado"  && <><div className="dmet-l">Tiempo restante</div><div className="dmet-v" style={{ color: "#f59e0b" }}>{tiempoRestante(p.expiraEn)}</div><div className="dmet-s">Para cerrar la venta</div></>}
            {p.estado === "liberado"   && <><div className="dmet-l">Expira en</div><div className="dmet-v" style={{ color: "#a855f7" }}>{tiempoRestante(p.expiraEn)}</div><div className="dmet-s">Para reservar</div></>}
            {p.estado === "disponible" && <><div className="dmet-l">Estado</div><div className="dmet-v" style={{ color: "#10b981", fontSize: 15, paddingTop: 2 }}>Disponible ✓</div><div className="dmet-s">Listo para reservar</div></>}
            {p.estado === "vendido"    && <><div className="dmet-l">Estado final</div><div className="dmet-v" style={{ color: "#3b82f6", fontSize: 15, paddingTop: 2 }}>Vendido ✓</div><div className="dmet-s">Comisión cobrada</div></>}
            {p.estado === "expirado"   && <><div className="dmet-l">Estado final</div><div className="dmet-v" style={{ color: "#ef4444", fontSize: 15, paddingTop: 2 }}>Expirado</div><div className="dmet-s">Afectó reputación</div></>}
          </div>
        </div>

        <div className="ddet-grid">
          <div className="ddet-box">
            <div className="ddet-box-t">Funcionalidades</div>
            {(p.funcionalidades || []).map((f, i) => (
              <div key={i} className="dfunc"><span className="dfunc-ok">✓</span>{f}</div>
            ))}
          </div>
          <div className="ddet-box">
            <div className="ddet-box-t">Descripción</div>
            <div className="ddet-box-p">{p.descripcion}</div>
          </div>
          <div className="ddet-box">
            <div className="ddet-box-t">Público objetivo</div>
            <div className="ddet-box-p">{p.publicoObjetivo}</div>
          </div>
        </div>

        {p.colaDetras > 0 && (
          <div className="dcola-note">
            {p.colaDetras} vendedor{p.colaDetras > 1 ? "es" : ""} esperando detrás de ti
          </div>
        )}

        <div className="ddet-actions">
          {p.estado === "reservado" && (
            <button className="dbtn green full" onClick={onVendido}>✓ Marcar como vendido</button>
          )}
          {(p.estado === "liberado" || p.estado === "disponible") && (
            <button className="dbtn cyan full" onClick={onReservar}>Reservar ahora</button>
          )}
        </div>
      </div>
    </div>
  )
}