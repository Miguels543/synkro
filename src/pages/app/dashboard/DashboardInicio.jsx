import { tiempoRestante, formatFecha } from "./components/dashboardUtils"

const ACT_ICO = {
  venta:   { bg: "rgba(16,185,129,.1)",  ic: "✓" },
  reserva: { bg: "rgba(245,158,11,.08)", ic: "⏱" },
  liberado:{ bg: "rgba(168,85,247,.1)",  ic: "🔓" },
  expiro:  { bg: "rgba(239,68,68,.08)",  ic: "✕" },
}

export default function DashboardInicio({
  user, userData, reservas, ventas, actividad,
  onVerProyecto, onMarcarVendido, onVerCatalogo,
}) {
  const enCurso = reservas.find(r => r.estado === "reservado")

  const totalVentas         = ventas.length
  const comisionesCobradas  = ventas.filter(v => v.estadoPago === "pagado").reduce((s, v) => s + (v.comisionGanada || 0), 0)
  const comisionesPend      = ventas.filter(v => v.estadoPago !== "pagado").reduce((s, v) => s + (v.comisionGanada || 0), 0)
  const proyectosActivos    = reservas.filter(r => r.estado === "reservado").length

  const nombreCorto = user?.nombre?.split(" ")[0] || "Vendedor"

  return (
    <div className="dinicio">
      <div className="dinicio-hi">Bienvenido, {nombreCorto} 👋</div>
      <div className="dinicio-sub">Resumen de tu actividad</div>

      <div className="dstats">
        {[
          { cls:"c1", l:"Ventas totales",     v: totalVentas,                                s:"Acumuladas"  },
          { cls:"c2", l:"Comisiones cobradas", v:`S/.${comisionesCobradas.toLocaleString()}`, s:"Pagadas"     },
          { cls:"c3", l:"Pendiente de cobro",  v:`S/.${comisionesPend.toLocaleString()}`,     s:"En revisión" },
          { cls:"c4", l:"Proyectos en cola",   v: proyectosActivos,                           s:"Activos"     },
        ].map((s, i) => (
          <div key={i} className={`dstat ${s.cls}`}>
            <div className="dstat-l">{s.l}</div>
            <div className="dstat-v">{s.v}</div>
            <div className="dstat-s">{s.s}</div>
          </div>
        ))}
      </div>

      <div className="dinicio-grid">
        {/* Proyecto activo */}
        <div className="dactivo">
          <div className="dactivo-hdr">
            <span className="dactivo-lbl">Proyecto activo</span>
            {enCurso && (
              <div className="dtimer">
                <div className="dtimer-dot" />
                {tiempoRestante(enCurso.expiraEn)} restantes
              </div>
            )}
          </div>

          {enCurso ? (
            <>
              <div className="dactivo-body">
                <img src={enCurso.proyecto?.imagenes?.[0]} alt="" className="dactivo-img" />
                <div>
                  <div className="dactivo-cat">{enCurso.proyecto?.categoria}</div>
                  <div className="dactivo-nom">{enCurso.proyecto?.nombre}</div>
                  <div className="dactivo-row">
                    <div>
                      <div className="dpl">Precio desde</div>
                      <div className="dpv" style={{ color: "#00f3ff" }}>
                        S/.{(enCurso.proyecto?.precioMin || 0).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="dpl">Tu comisión</div>
                      <div className="dpv" style={{ color: "#10b981" }}>
                        S/.{Math.round((enCurso.proyecto?.precioMin || 0) * (enCurso.proyecto?.comision || 20) / 100)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="dactivo-ftr">
                <button className="dbtn cyan" onClick={() => onVerProyecto(enCurso)}>
                  Ver proyecto
                </button>
                <button className="dbtn ghost" onClick={() => onMarcarVendido(enCurso)}>
                  Marcar vendido
                </button>
              </div>
            </>
          ) : (
            <div style={{ padding: "28px 16px", textAlign: "center", color: "rgba(255,255,255,.2)", fontSize: 12 }}>
              Sin proyecto activo.<br />
              <button className="dbtn cyan" style={{ marginTop: 12 }} onClick={onVerCatalogo}>
                Ver catálogo
              </button>
            </div>
          )}
        </div>

        {/* Actividad reciente */}
        <div className="dact">
          <div className="dcard-hdr">Actividad reciente</div>
          {actividad.length === 0 && (
            <div style={{ padding: "20px 15px", color: "rgba(255,255,255,.18)", fontSize: 12 }}>
              Sin actividad aún
            </div>
          )}
          {actividad.map((a, i) => {
            const ic = ACT_ICO[a.tipo] || ACT_ICO.reserva
            return (
              <div key={i} className="dact-row">
                <div className="dact-ico" style={{ background: ic.bg }}>{ic.ic}</div>
                <div style={{ flex: 1 }}>
                  <div className="dact-txt">{a.txt}</div>
                  <div className="dact-t">{formatFecha(a.tiempo)}</div>
                </div>
                {a.monto && <div className="dact-m">+S/.{a.monto}</div>}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}