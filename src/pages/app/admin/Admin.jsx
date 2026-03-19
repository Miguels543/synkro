import { useState } from "react"
import AdminEstadisticas from "./AdminEstadisticas"
import AdminUsuarios     from "./AdminUsuarios"
import AdminProyectos    from "./AdminProyectos"
import AdminPortafolio   from "./AdminPortafolio"
import AdminMisiones     from "./AdminMisiones"
import AdminVentas       from "./AdminVentas"
import AdminClientes     from "./AdminClientes"
import AdminPagos        from "./AdminPagos"
import AdminSolicitudes  from "./AdminSolicitudes"

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .adm {
    display: flex;
    min-height: calc(100vh - 65px);
    margin-top: 65px;
    background: #050709;
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: #d1d5db;
  }

  .adm-sb {
    width: 220px;
    flex-shrink: 0;
    background: #070a0f;
    border-right: 1px solid rgba(255,255,255,.05);
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 65px;
    height: calc(100vh - 65px);
    overflow: hidden;
  }

  .adm-sb-top {
    padding: 20px 16px 16px;
    border-bottom: 1px solid rgba(255,255,255,.05);
    flex-shrink: 0;
  }
  .adm-sb-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(239,68,68,.08); border: 1px solid rgba(239,68,68,.18);
    border-radius: 8px; padding: 6px 12px; margin-bottom: 10px;
  }
  .adm-sb-badge-dot {
    width: 6px; height: 6px; border-radius: 50%; background: #ef4444;
    animation: abl 1.2s infinite;
  }
  @keyframes abl { 0%,100%{opacity:1} 50%{opacity:.2} }
  .adm-sb-badge-t { font-size: 10px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: #ef4444; }
  .adm-sb-nom { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 800; color: #fff; margin-bottom: 2px; }
  .adm-sb-rol { font-size: 10px; color: rgba(255,255,255,.28); }

  .adm-sb-nav { padding: 10px 8px; flex: 1; overflow-y: auto; }
  .adm-sb-sec {
    font-size: 8px; letter-spacing: 3px; text-transform: uppercase;
    color: rgba(255,255,255,.16); padding: 0 8px; margin: 12px 0 5px;
  }
  .adm-sb-sec:first-child { margin-top: 4px; }

  .adm-sb-btn {
    display: flex; align-items: center; gap: 9px;
    width: 100%; padding: 8px 10px; border-radius: 8px;
    background: transparent; border: none; cursor: pointer;
    font-size: 12.5px; font-weight: 500; color: rgba(255,255,255,.32);
    transition: all .15s; text-align: left; position: relative;
    margin-bottom: 1px; font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .adm-sb-btn:hover { background: rgba(255,255,255,.04); color: rgba(255,255,255,.65); }
  .adm-sb-btn.on    { background: rgba(239,68,68,.06); color: #ef4444; font-weight: 600; }
  .adm-sb-btn.on::before {
    content: ''; position: absolute; left: 0; top: 20%; bottom: 20%;
    width: 2.5px; border-radius: 2px; background: #ef4444;
  }
  .adm-sb-ico { font-size: 14px; width: 18px; text-align: center; flex-shrink: 0; }
  .adm-sb-badge2 {
    margin-left: auto; background: #ef4444; color: #fff;
    font-size: 9px; font-weight: 800; padding: 1px 6px; border-radius: 8px;
  }

  .adm-main { flex: 1; min-width: 0; }
`

const SECCIONES = [
  {
    grupo: "General",
    items: [
      { id:"estadisticas", lbl:"Estadísticas", ico:"◈" },
      { id:"solicitudes",  lbl:"Solicitudes",  ico:"◎" },
    ]
  },
  {
    grupo: "Usuarios",
    items: [
      { id:"usuarios",  lbl:"Vendedores", ico:"◎" },
      { id:"clientes",  lbl:"Clientes",   ico:"◑" },
    ]
  },
  {
    grupo: "Catálogo",
    items: [
      { id:"proyectos",  lbl:"Proyectos",  ico:"▣" },
      { id:"misiones",   lbl:"Misiones",   ico:"◉" },
      { id:"portafolio", lbl:"Portafolio", ico:"◈" },
    ]
  },
  {
    grupo: "Finanzas",
    items: [
      { id:"ventas", lbl:"Ventas", ico:"✦" },
      { id:"pagos",  lbl:"Pagos",  ico:"◈" },
    ]
  },
]

const COMPONENTES = {
  estadisticas: AdminEstadisticas,
  solicitudes:  AdminSolicitudes,
  usuarios:     AdminUsuarios,
  proyectos:    AdminProyectos,
  portafolio:   AdminPortafolio,
  misiones:     AdminMisiones,
  ventas:       AdminVentas,
  clientes:     AdminClientes,
  pagos:        AdminPagos,
}

export default function Admin() {
  const [tab, setTab] = useState("estadisticas")
  const Seccion = COMPONENTES[tab] || AdminEstadisticas

  return (
    <div className="adm">
      <style>{CSS}</style>

      <aside className="adm-sb">
        <div className="adm-sb-top">
          <div className="adm-sb-badge">
            <div className="adm-sb-badge-dot" />
            <span className="adm-sb-badge-t">Admin</span>
          </div>
          <div className="adm-sb-nom">Panel de control</div>
          <div className="adm-sb-rol">Administrador · Synkro</div>
        </div>

        <nav className="adm-sb-nav">
          {SECCIONES.map(g => (
            <div key={g.grupo}>
              <div className="adm-sb-sec">{g.grupo}</div>
              {g.items.map(it => (
                <button
                  key={it.id}
                  className={`adm-sb-btn ${tab === it.id ? "on" : ""}`}
                  onClick={() => setTab(it.id)}
                >
                  <span className="adm-sb-ico">{it.ico}</span>
                  {it.lbl}
                  {it.badge > 0 && <span className="adm-sb-badge2">{it.badge}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      <main className="adm-main">
        <Seccion />
      </main>
    </div>
  )
}