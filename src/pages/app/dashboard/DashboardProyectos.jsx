import { useState, useEffect } from "react"
import ItemLista from "./components/ItemLista"
import Detalle   from "./components/Detalle"

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener("resize", handler)
    return () => window.removeEventListener("resize", handler)
  }, [])
  return isMobile
}

export default function DashboardProyectos({
  modo,
  lista,
  sel, onSel,
  imgIdx, onPrev, onNext, onDot,
  onVendido, onReservar,
  onVerCatalogo,
}) {
  const esMis    = modo === "mis"
  const isMobile = useIsMobile()

  // En mobile: si hay selección mostramos detalle, si no mostramos lista
  const showLista  = !isMobile || !sel
  const showDetalle = !isMobile || !!sel

  const handleSel = (p) => {
    onSel(p)
  }

  const handleBack = () => {
    onSel(null)
  }

  return (
    <div className="dproy">
      {/* ── Lista ── */}
      <div className={`dlista${!showLista ? " hidden-mobile" : ""}`}>
        <div className="dlista-hdr">
          <span className="dlista-hdr-t">{esMis ? "Mis Proyectos" : "Catálogo"}</span>
          <span className="dlista-hdr-n">{lista.length}</span>
        </div>

        {esMis ? (
          <>
            {lista.filter(p => ["reservado", "liberado"].includes(p.estado)).length > 0 && (
              <>
                <div className="dlista-sec">Activos</div>
                {lista.filter(p => ["reservado", "liberado"].includes(p.estado)).map(p => (
                  <ItemLista key={p.reservaId} p={p} activo={sel?.reservaId === p.reservaId} onClick={() => handleSel(p)} />
                ))}
              </>
            )}
            {lista.filter(p => ["vendido", "expirado"].includes(p.estado)).length > 0 && (
              <>
                <div className="dlista-sec">Historial</div>
                {lista.filter(p => ["vendido", "expirado"].includes(p.estado)).map(p => (
                  <ItemLista key={p.reservaId} p={p} activo={sel?.reservaId === p.reservaId} onClick={() => handleSel(p)} />
                ))}
              </>
            )}
            {lista.length === 0 && (
              <div style={{ padding: "20px 15px", color: "rgba(255,255,255,.18)", fontSize: 12 }}>
                No tienes proyectos aún.<br />
                <button className="dbtn cyan" style={{ marginTop: 10, fontSize: 11 }} onClick={onVerCatalogo}>
                  Ver catálogo
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="dlista-sec">Disponibles</div>
            {lista.length === 0 && (
              <div style={{ padding: "20px 15px", color: "rgba(255,255,255,.18)", fontSize: 12 }}>
                No hay proyectos disponibles
              </div>
            )}
            {lista.map(p => (
              <ItemLista
                key={p.id}
                p={{ ...p, estado: "disponible" }}
                activo={sel?.id === p.id}
                onClick={() => handleSel({ ...p, estado: "disponible" })}
              />
            ))}
          </>
        )}
      </div>

      {/* ── Detalle ── */}
      {showDetalle && sel ? (
        <div className={`ddet-wrapper${!showDetalle ? " hidden-mobile" : ""}`} style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0, background: "#050709", overflowY: "auto" }}>
          {/* Botón volver — solo visible en mobile */}
          {isMobile && (
            <button className="ddet-back" onClick={handleBack}>
              ← Volver a {esMis ? "mis proyectos" : "catálogo"}
            </button>
          )}
          <Detalle
            p={sel} imgIdx={imgIdx}
            onPrev={onPrev} onNext={onNext} onDot={onDot}
            onVendido={onVendido} onReservar={onReservar}
          />
        </div>
      ) : !isMobile ? (
        <div className="dproy-empty">
          {esMis ? "Selecciona un proyecto" : "Selecciona un proyecto del catálogo"}
        </div>
      ) : null}
    </div>
  )
}