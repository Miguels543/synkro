const PASOS = [
  { n:"01", t:"Explora el catálogo",  d:"En 'Catálogo' ves los sitios disponibles. Cada uno tiene precio, comisión, funcionalidades y un demo en vivo para mostrarle a tu cliente." },
  { n:"02", t:"Reserva un proyecto",  d:"Cuando tengas un cliente interesado, reserva. Tienes 6 días para cerrar la venta. El proyecto es tuyo mientras tengas la reserva activa." },
  { n:"03", t:"Cierra la venta",      d:"Preséntale el demo al cliente. El precio de desarrollo es pago único del cliente. El admin gestiona el proyecto una vez cerrada la venta." },
  { n:"04", t:"Reporta la venta",     d:"Entra a 'Marcar como vendido', sube nombre del cliente, contacto y comprobante. El admin lo revisa y libera tu comisión en 48h." },
  { n:"05", t:"Completa misiones",    d:"Hay tareas opcionales por proyecto — publicar en redes, conseguir reseñas, videos. Las misiones se pagan cuando la venta es aprobada por el admin." },
  { n:"06", t:"Cuida tu reputación",  d:"Tu score sube con ventas y misiones aprobadas. Score alto = acceso prioritario a proyectos con mayor comisión y bonos mensuales." },
]

export default function DashboardGuia() {
  return (
    <div className="dguia">
      <div className="dmis-ttl" style={{ marginBottom: 3 }}>Guía del vendedor</div>
      <div className="dmis-sub" style={{ marginBottom: 28 }}>Todo lo que necesitas saber para empezar</div>

      <div className="dguia-vid">
        <div className="dguia-vid-ico">▶</div>
        <div className="dguia-vid-t">Video introductorio — Bienvenido a Synkro</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,.16)" }}>Próximamente</div>
      </div>

      {PASOS.map(p => (
        <div key={p.n} className="dguia-paso">
          <div className="dguia-n">{p.n}</div>
          <div>
            <div className="dguia-ttl">{p.t}</div>
            <div className="dguia-txt">{p.d}</div>
            <div className="dguia-img">[ imagen — {p.t} ]</div>
          </div>
        </div>
      ))}
    </div>
  )
}