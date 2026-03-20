export default function DashboardMisiones({ reservas, onCompletarMision }) {
  const conMisiones = reservas.filter(r => (r.proyecto?.misiones || []).length > 0)

  return (
    <div className="dmis">
      <div className="dmis-ttl">Misiones</div>
      <div className="dmis-sub">Tareas con pago fijo — se cobran aunque no cierres la venta</div>

      {conMisiones.length === 0 && (
        <div style={{ color: "rgba(255,255,255,.2)", fontSize: 13 }}>
          Reserva un proyecto para ver sus misiones
        </div>
      )}

      {conMisiones.map(r => (
        <div key={r.id} className="dmis-g">
          <div className="dmis-g-hdr">
            <img src={r.proyecto?.imagenes?.[0]} alt="" className="dmis-g-img" />
            <div>
              <div className="dmis-g-nom">{r.proyecto?.nombre}</div>
              <div className="dmis-g-cnt">{r.proyecto?.misiones?.length} misiones</div>
            </div>
          </div>

          {(r.proyecto?.misiones || []).map(m => (
            <div key={m.id} className="dmis-card">
              <div className="dmis-pago">
                <div className="dmis-pago-v">S/.{m.pago}</div>
                <div className="dmis-pago-l">al aprobar</div>
              </div>
              <div className="dmis-body">
                <div className="dmis-nom">{m.titulo}</div>
                <div className="dmis-desc">{m.desc}</div>
                <div className={`dest ${m.estado === "sin_iniciar" ? "si" : m.estado === "pendiente" ? "p" : "ok"}`}>
                  {m.estado === "sin_iniciar" ? "Sin iniciar" : m.estado === "pendiente" ? "⏳ Pendiente" : "✓ Completada"}
                </div>
              </div>
              {m.estado === "sin_iniciar" && (
                <button
                  className="dbtn cyan"
                  style={{ flexShrink: 0, alignSelf: "center", fontSize: 11 }}
                  onClick={() => onCompletarMision({ ...m, reservaId: r.id })}
                >
                  Completar
                </button>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}