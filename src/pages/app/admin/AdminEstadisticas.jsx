import { useState, useEffect } from "react"
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore"
import { db } from "../../../firebase/config"

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');
  .ae { padding: 26px 30px 60px; }
  .ae-ttl { font-family:'Syne',sans-serif; font-size:20px; font-weight:800; color:#fff; margin-bottom:3px; }
  .ae-sub  { font-size:12px; color:rgba(255,255,255,.28); margin-bottom:22px; }
  .ae-loading { text-align:center; padding:80px; color:rgba(255,255,255,.25); font-size:13px; }
  .ae-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:11px; margin-bottom:18px; }
  .ae-stat { background:#0c0f14; border:1px solid rgba(255,255,255,.05); border-radius:11px; padding:15px 16px; position:relative; overflow:hidden; }
  .ae-stat::after { content:''; position:absolute; top:0; left:0; right:0; height:1.5px; }
  .ae-stat.c1::after { background:linear-gradient(90deg,#00f3ff,transparent); }
  .ae-stat.c2::after { background:linear-gradient(90deg,#10b981,transparent); }
  .ae-stat.c3::after { background:linear-gradient(90deg,#f59e0b,transparent); }
  .ae-stat.c4::after { background:linear-gradient(90deg,#a855f7,transparent); }
  .ae-stat.c5::after { background:linear-gradient(90deg,#ef4444,transparent); }
  .ae-stat.c6::after { background:linear-gradient(90deg,#3b82f6,transparent); }
  .ae-stat.c7::after { background:linear-gradient(90deg,#10b981,transparent); }
  .ae-stat.c8::after { background:linear-gradient(90deg,#f59e0b,transparent); }
  .ae-stat-l { font-size:8.5px; letter-spacing:1.5px; text-transform:uppercase; color:rgba(255,255,255,.22); margin-bottom:7px; }
  .ae-stat-v { font-family:'Syne',sans-serif; font-size:22px; font-weight:800; color:#fff; line-height:1; margin-bottom:3px; }
  .ae-stat-s { font-size:10px; color:rgba(255,255,255,.22); }
  .ae-grid { display:grid; grid-template-columns:1.4fr 1fr; gap:14px; margin-bottom:14px; }
  .ae-box { background:#0c0f14; border:1px solid rgba(255,255,255,.06); border-radius:11px; padding:18px 20px; }
  .ae-box-t { font-family:'Syne',sans-serif; font-size:13px; font-weight:800; color:#fff; margin-bottom:4px; }
  .ae-box-s { font-size:11px; color:rgba(255,255,255,.25); margin-bottom:16px; }
  .ae-bars { display:flex; align-items:flex-end; gap:8px; height:90px; }
  .ae-bar-wrap { flex:1; display:flex; flex-direction:column; align-items:center; gap:5px; height:100%; justify-content:flex-end; }
  .ae-bar { width:100%; border-radius:4px 4px 0 0; min-height:4px; background:linear-gradient(to top,rgba(0,243,255,.6),rgba(0,243,255,.15)); transition:.3s; }
  .ae-bar:hover { background:linear-gradient(to top,#00f3ff,rgba(0,243,255,.35)); }
  .ae-bar-v { font-size:9px; font-weight:700; color:rgba(255,255,255,.4); }
  .ae-bar-m { font-size:8.5px; color:rgba(255,255,255,.22); }
  .ae-vend-row { display:flex; align-items:center; gap:11px; padding:9px 0; border-bottom:1px solid rgba(255,255,255,.04); }
  .ae-vend-row:last-child { border-bottom:none; }
  .ae-vend-n { font-size:9px; font-weight:800; color:rgba(255,255,255,.2); width:16px; flex-shrink:0; }
  .ae-vend-av { width:30px; height:30px; border-radius:8px; flex-shrink:0; background:linear-gradient(135deg,rgba(0,243,255,.12),rgba(168,85,247,.12)); border:1px solid rgba(0,243,255,.15); display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-size:12px; font-weight:800; color:#00f3ff; }
  .ae-vend-nom { font-size:12px; font-weight:600; color:#fff; flex:1; }
  .ae-vend-v   { font-size:11px; color:rgba(255,255,255,.3); }
  .ae-vend-com { font-family:'Syne',sans-serif; font-size:12px; font-weight:800; color:#10b981; }
  .ae-proy-row { display:flex; align-items:center; gap:10px; padding:9px 0; border-bottom:1px solid rgba(255,255,255,.04); }
  .ae-proy-row:last-child { border-bottom:none; }
  .ae-proy-cat { font-size:8px; letter-spacing:1px; text-transform:uppercase; color:rgba(0,243,255,.45); margin-top:2px; }
  .ae-proy-nom { font-size:12px; font-weight:600; color:#fff; flex:1; }
  .ae-proy-v   { font-family:'Syne',sans-serif; font-size:13px; font-weight:800; color:#fff; }
  .ae-proy-vl  { font-size:9px; color:rgba(255,255,255,.25); }
  .ae-alerta { background:rgba(239,68,68,.06); border:1px solid rgba(239,68,68,.14); border-radius:11px; padding:14px 18px; margin-bottom:18px; display:flex; align-items:center; gap:12px; }
  .ae-alerta-ico { font-size:20px; flex-shrink:0; }
  .ae-alerta-t { font-size:13px; font-weight:700; color:rgba(239,68,68,.85); margin-bottom:2px; }
  .ae-alerta-s { font-size:11.5px; color:rgba(255,255,255,.3); }
`

export default function AdminEstadisticas() {
  const [stats,        setStats]        = useState(null)
  const [graficaVentas,setGraficaVentas]= useState([])
  const [topVendedores,setTopVendedores]= useState([])
  const [topProyectos, setTopProyectos] = useState([])
  const [loading,      setLoading]      = useState(true)

  useEffect(() => {
    const cargar = async () => {
      try {
        // Cargar datos en paralelo
        const [snapVentas, snapUsers, snapProyectos, snapSolicitudes, snapPagos] = await Promise.all([
          getDocs(collection(db, "ventas")),
          getDocs(collection(db, "users")),
          getDocs(collection(db, "proyectos")),
          getDocs(query(collection(db, "solicitudes"), where("estado","==","pendiente"))),
          getDocs(collection(db, "pagos")),
        ])

        const ventas      = snapVentas.docs.map(d => ({ id: d.id, ...d.data() }))
        const users       = snapUsers.docs.map(d => ({ id: d.id, ...d.data() }))
        const proyectos   = snapProyectos.docs.map(d => ({ id: d.id, ...d.data() }))
        const pagos       = snapPagos.docs.map(d => ({ id: d.id, ...d.data() }))

        const ventasAprobadas = ventas.filter(v => v.estado === "aprobado")
        const ahora = new Date()
        const esMes = (v) => {
          const f = v.fecha?.toDate ? v.fecha.toDate() : new Date(v.fecha)
          return f.getMonth() === ahora.getMonth() && f.getFullYear() === ahora.getFullYear()
        }
        const ventasMes       = ventasAprobadas.filter(esMes)
        const ingresosMes     = ventasMes.reduce((a, v) => a + Number(v.monto || 0), 0)
        const comisionesPag   = pagos.filter(p => p.estado === "pagado").reduce((a,p) => a + Number(p.monto||0), 0)
        const pendientePago   = pagos.filter(p => p.estado === "pendiente").reduce((a,p) => a + Number(p.monto||0), 0)
        const vendedoresAct   = users.filter(u => u.rol === "vendedor" && (u.estado||"activo") === "activo").length
        const proyDisp        = proyectos.filter(p => p.estado === "disponible").length
        const tasaCierre      = ventas.length > 0 ? Math.round((ventasAprobadas.length / ventas.length) * 100) : 0

        setStats({
          vendedoresActivos:    vendedoresAct,
          ingresosMes,
          ventasMes:            ventasMes.length,
          comisionesPagadas:    comisionesPag,
          pendientesPago:       pendientePago,
          proyectosDisponibles: proyDisp,
          tasaCierre,
          solicitudesPendientes: snapSolicitudes.size,
        })

        // Gráfica: agrupar ventas aprobadas por mes (últimos 7 meses)
        const meses = []
        for (let i = 6; i >= 0; i--) {
          const d = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1)
          meses.push({
            mes: d.toLocaleString("es-PE", { month:"short" }),
            mes2: d.getMonth(),
            año: d.getFullYear(),
            ventas: 0,
            ingresos: 0,
          })
        }
        ventasAprobadas.forEach(v => {
          const f = v.fecha?.toDate ? v.fecha.toDate() : new Date(v.fecha)
          const idx = meses.findIndex(m => m.mes2 === f.getMonth() && m.año === f.getFullYear())
          if (idx >= 0) {
            meses[idx].ventas++
            meses[idx].ingresos += Number(v.monto || 0)
          }
        })
        setGraficaVentas(meses)

        // Top vendedores por comisión este mes
        const porVendedor = {}
        ventasMes.forEach(v => {
          if (!porVendedor[v.vendedor]) porVendedor[v.vendedor] = { nombre: v.vendedor, ventas: 0, comision: 0 }
          porVendedor[v.vendedor].ventas++
          porVendedor[v.vendedor].comision += Number(v.comision || 0)
        })
        setTopVendedores(Object.values(porVendedor).sort((a,b) => b.comision - a.comision).slice(0, 5))

        // Top proyectos este mes
        const porProyecto = {}
        ventasMes.forEach(v => {
          if (!porProyecto[v.proyecto]) porProyecto[v.proyecto] = { nombre: v.proyecto, categoria: v.categoria || "", ventas: 0 }
          porProyecto[v.proyecto].ventas++
        })
        setTopProyectos(Object.values(porProyecto).sort((a,b) => b.ventas - a.ventas).slice(0, 4))

      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [])

  if (loading) return (
    <div className="ae">
      <style>{CSS}</style>
      <div className="ae-ttl">Estadísticas generales</div>
      <div className="ae-sub">Resumen de actividad de la plataforma</div>
      <div className="ae-loading">Cargando estadísticas...</div>
    </div>
  )

  const maxIngresos = Math.max(...graficaVentas.map(g => g.ingresos), 1)

  return (
    <div className="ae">
      <style>{CSS}</style>
      <div className="ae-ttl">Estadísticas generales</div>
      <div className="ae-sub">Resumen de actividad de la plataforma</div>

      {stats?.solicitudesPendientes > 0 && (
        <div className="ae-alerta">
          <div className="ae-alerta-ico">⚠️</div>
          <div>
            <div className="ae-alerta-t">{stats.solicitudesPendientes} solicitudes pendientes de revisión</div>
            <div className="ae-alerta-s">Vendedores esperando aprobación para acceder a la plataforma</div>
          </div>
        </div>
      )}

      <div className="ae-stats">
        {[
          { cls:"c1", l:"Vendedores activos",     v: stats.vendedoresActivos,                                s:"En la plataforma"   },
          { cls:"c2", l:"Ingresos este mes",       v:`S/.${stats.ingresosMes.toLocaleString()}`,              s:"Ventas cerradas"    },
          { cls:"c3", l:"Ventas este mes",         v: stats.ventasMes,                                       s:"Ventas aprobadas"   },
          { cls:"c4", l:"Comisiones pagadas",      v:`S/.${stats.comisionesPagadas.toLocaleString()}`,        s:"A vendedores"       },
          { cls:"c5", l:"Pendiente de pago",       v:`S/.${stats.pendientesPago.toLocaleString()}`,           s:"Por aprobar"        },
          { cls:"c6", l:"Proyectos disponibles",   v: stats.proyectosDisponibles,                            s:"En catálogo activo" },
          { cls:"c7", l:"Tasa de cierre",          v:`${stats.tasaCierre}%`,                                 s:"Reservas → ventas"  },
          { cls:"c8", l:"Solicitudes pendientes",  v: stats.solicitudesPendientes,                           s:"Esperando revisión" },
        ].map((s,i) => (
          <div key={i} className={`ae-stat ${s.cls}`}>
            <div className="ae-stat-l">{s.l}</div>
            <div className="ae-stat-v">{s.v}</div>
            <div className="ae-stat-s">{s.s}</div>
          </div>
        ))}
      </div>

      <div className="ae-grid">
        <div className="ae-box">
          <div className="ae-box-t">Ingresos por mes</div>
          <div className="ae-box-s">Últimos 7 meses</div>
          <div className="ae-bars">
            {graficaVentas.map((g,i) => (
              <div key={i} className="ae-bar-wrap">
                <div className="ae-bar-v">{g.ingresos > 0 ? `S/.${(g.ingresos/1000).toFixed(1)}k` : ""}</div>
                <div className="ae-bar" style={{ height:`${(g.ingresos/maxIngresos)*80+4}px` }} />
                <div className="ae-bar-m">{g.mes}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="ae-box">
          <div className="ae-box-t">Top vendedores</div>
          <div className="ae-box-s">Por comisiones del mes</div>
          {topVendedores.length === 0 && (
            <div style={{ fontSize:12, color:"rgba(255,255,255,.2)", paddingTop:8 }}>Sin ventas este mes</div>
          )}
          {topVendedores.map((v,i) => (
            <div key={i} className="ae-vend-row">
              <div className="ae-vend-n">#{i+1}</div>
              <div className="ae-vend-av">{v.nombre?.[0]}</div>
              <div style={{ flex:1 }}>
                <div className="ae-vend-nom">{v.nombre}</div>
                <div className="ae-vend-v">{v.ventas} ventas</div>
              </div>
              <div className="ae-vend-com">S/.{v.comision}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="ae-box">
        <div className="ae-box-t">Proyectos más vendidos</div>
        <div className="ae-box-s">Este mes</div>
        {topProyectos.length === 0 && (
          <div style={{ fontSize:12, color:"rgba(255,255,255,.2)", paddingTop:8 }}>Sin ventas este mes</div>
        )}
        {topProyectos.map((p,i) => (
          <div key={i} className="ae-proy-row">
            <div className="ae-vend-n">#{i+1}</div>
            <div style={{ flex:1 }}>
              <div className="ae-proy-nom">{p.nombre}</div>
              <div className="ae-proy-cat">{p.categoria}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div className="ae-proy-v">{p.ventas}</div>
              <div className="ae-proy-vl">ventas</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}