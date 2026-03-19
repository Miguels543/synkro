import { useState } from "react"

// ─────────────────────────────────────────────
// DATOS FALSOS — reemplazar con Firestore
// ─────────────────────────────────────────────
const VENDEDOR = {
  nombre: "Carlos Mendoza",
  reputacion: 4.3,
  puntos: 1240,
  nivel: "Vendedor Pro",
  ventas: 7,
  cobradas: 1850,
  pendientes: 360,
  racha: 3,
}

// Solo proyectos con los que el vendedor ha interactuado
// DISPONIBLE y COLA no aparecen aquí — el vendedor solo ve "LIBERADO" (tuvo cola en ese proyecto)
const MIS_PROYECTOS = [
  {
    id: 1,
    nombre: "Restaurante Italiano",
    categoria: "Gastronomia",
    precio: 1800,
    comision: 20,
    estado: "reservado",
    expiraEn: Date.now() + 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 60 * 23,
    colaDetras: 1,
    imagenes: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&q=80",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=80",
    ],
    descripcion: "Sitio web elegante para restaurante de alta cocina. Diseño responsivo, experiencia optimizada para convertir visitantes en reservas.",
    publicoObjetivo: "Restaurantes de alta cocina que buscan presencia digital para atraer clientes y gestionar reservas online.",
    funcionalidades: ["Diseño responsivo", "Sistema de reservas", "Menu digital", "Galeria de imagenes", "Redes sociales"],
    demo: "#",
    misiones: [
      { id: "m1", titulo: "Publicar en Facebook", desc: "Comparte el demo en un grupo de emprendedores con +500 miembros.", pago: 25, estado: "pendiente" },
      { id: "m2", titulo: "Reseña en Google Maps", desc: "Consigue que un restaurante deje una reseña del demo.", pago: 40, estado: "completada" },
      { id: "m3", titulo: "Video en TikTok", desc: "Crea un video corto mostrando el sitio. Mínimo 200 vistas.", pago: 60, estado: "sin_iniciar" },
    ],
  },
  {
    id: 4,
    nombre: "Tienda de Moda",
    categoria: "Ecommerce",
    precio: 2000,
    comision: 20,
    estado: "liberado", // estuvo en cola — se liberó, tiene 24h para reservar
    expiraEn: Date.now() + 1000 * 60 * 60 * 18,
    colaDetras: 0,
    imagenes: [
      "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=900&q=80",
      "https://images.unsplash.com/photo-1558171813-1b1c43e0e45e?w=900&q=80",
    ],
    descripcion: "Tienda online completa con catalogo de productos, carrito de compras, pasarela de pagos y panel de administracion.",
    publicoObjetivo: "Marcas de ropa y accesorios que quieren vender online con experiencia de compra premium.",
    funcionalidades: ["Catalogo de productos", "Carrito de compras", "Pasarela de pagos", "Panel de admin", "Cupones de descuento"],
    demo: "#",
    misiones: [
      { id: "m5", titulo: "Historia en Instagram", desc: "Sube una historia mostrando la tienda con enlace al demo.", pago: 30, estado: "sin_iniciar" },
    ],
  },
  {
    id: 2,
    nombre: "Inmobiliaria Premium",
    categoria: "Inmobiliaria",
    precio: 2200,
    comision: 20,
    estado: "vendido",
    expiraEn: null,
    colaDetras: 0,
    imagenes: [
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&q=80",
      "https://images.unsplash.com/photo-1582407947304-fd86f28f1dfc?w=900&q=80",
    ],
    descripcion: "Plataforma inmobiliaria con listado de propiedades, filtros avanzados y contacto directo con agentes.",
    publicoObjetivo: "Agencias inmobiliarias y corredores que quieren digitalizar su cartera de propiedades.",
    funcionalidades: ["Listado de propiedades", "Filtros avanzados", "Galeria de fotos", "Formulario de contacto", "Panel de agentes"],
    demo: "#",
    misiones: [
      { id: "m4", titulo: "Post en LinkedIn", desc: "Publica el caso de exito con hashtags del sector.", pago: 35, estado: "completada" },
    ],
  },
  {
    id: 3,
    nombre: "Clinica Dental",
    categoria: "Salud",
    precio: 1500,
    comision: 20,
    estado: "expirado",
    expiraEn: null,
    colaDetras: 0,
    imagenes: ["https://images.unsplash.com/photo-1629909615184-74f495363b67?w=900&q=80"],
    descripcion: "Sitio web para clinica dental con citas online, presentacion del equipo y galeria de tratamientos.",
    publicoObjetivo: "Clinicas dentales que quieren modernizar su presencia digital y reducir llamadas.",
    funcionalidades: ["Agenda de citas", "Perfil del equipo", "Galeria de tratamientos", "Blog de salud", "Chat en vivo"],
    demo: "#",
    misiones: [],
  },
]

const ACTIVIDAD = [
  { tipo: "venta",    txt: "Vendiste Inmobiliaria Premium",                      tiempo: "hace 3 dias",    monto: 440 },
  { tipo: "mision",  txt: "Mision completada: Reseña en Google Maps",            tiempo: "hace 5 dias",    monto: 40 },
  { tipo: "liberado",txt: "Tienda de Moda se liberó — tienes 24h para reservar", tiempo: "hace 6 horas",   monto: null },
  { tipo: "reserva", txt: "Reservaste Restaurante Italiano",                      tiempo: "hace 2 dias",    monto: null },
  { tipo: "expiro",  txt: "Expiro tu reserva de Clinica Dental",                 tiempo: "hace 1 semana",  monto: null },
]

// ─────────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────────
function tiempoRestante(ms) {
  if (!ms) return null
  const diff = ms - Date.now()
  if (diff <= 0) return "Expirado"
  const d = Math.floor(diff / 864e5)
  const h = Math.floor((diff % 864e5) / 36e5)
  const m = Math.floor((diff % 36e5) / 6e4)
  if (d > 0) return `${d}d ${h}h`
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

function estadoCfg(e) {
  const map = {
    reservado: { bg: "rgba(245,158,11,.14)",  color: "#f59e0b", dot: "#f59e0b", label: "Reservado" },
    liberado:  { bg: "rgba(168,85,247,.13)",  color: "#a855f7", dot: "#a855f7", label: "Liberado"  },
    vendido:   { bg: "rgba(59,130,246,.13)",  color: "#3b82f6", dot: "#3b82f6", label: "Vendido"   },
    expirado:  { bg: "rgba(239,68,68,.11)",   color: "#ef4444", dot: "#ef4444", label: "Expirado"  },
  }
  return map[e] || { bg: "rgba(255,255,255,.06)", color: "#aaa", dot: "#aaa", label: e }
}

// ─────────────────────────────────────────────
// CSS
// ─────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ROOT: ocupa exactamente el espacio bajo el navbar fijo de 65px */
  /* DESPUÉS */
  .d {
  min-height: 100vh;
  margin-top: 65px;
  background: #050709;
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: #d1d5db;
}

  /* ══ SIDEBAR ══════════════════════════════ */
  .dsb {
  width: 210px;
  background: #070a0f;
  border-right: 1px solid rgba(255,255,255,.05);
  display: flex; flex-direction: column;
  position: fixed;
  top: 65px;
  left: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 100;
}
  .dsb-top {
    padding: 20px 16px 16px;
    border-bottom: 1px solid rgba(255,255,255,.05);
    flex-shrink: 0;
  }
  .dsb-av {
    width: 38px; height: 38px; border-radius: 9px;
    background: linear-gradient(135deg,rgba(0,243,255,.1),rgba(168,85,247,.1));
    border: 1px solid rgba(0,243,255,.15);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne',sans-serif; font-size: 15px; font-weight: 800;
    color: #00f3ff; margin-bottom: 9px;
  }
  .dsb-nom  { font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 3px; }
  .dsb-rep  { display: flex; align-items: center; gap: 5px; font-size: 11px; color: rgba(255,255,255,.3); }
  .dsb-star { color: #f59e0b; }

  .dsb-nav { padding: 10px 8px; flex: 1; overflow-y: auto; }
  .dsb-sec {
    font-size: 8px; letter-spacing: 3px; text-transform: uppercase;
    color: rgba(255,255,255,.16); padding: 0 8px; margin: 10px 0 4px;
  }
  .dsb-sec:first-child { margin-top: 0; }

  .dsb-btn {
    display: flex; align-items: center; gap: 9px;
    width: 100%; padding: 8px 10px; border-radius: 8px;
    background: transparent; border: none; cursor: pointer;
    font-size: 13px; font-weight: 500; color: rgba(255,255,255,.35);
    transition: all .16s; text-align: left; position: relative;
    margin-bottom: 1px; font-family: 'Plus Jakarta Sans',sans-serif;
  }
  .dsb-btn:hover { background: rgba(255,255,255,.04); color: rgba(255,255,255,.7); }
  .dsb-btn.on    { background: rgba(0,243,255,.07); color: #00f3ff; font-weight: 600; }
  .dsb-btn.on::before {
    content: ''; position: absolute; left: 0; top: 20%; bottom: 20%;
    width: 2.5px; border-radius: 2px; background: #00f3ff;
  }
  .dsb-badge {
    margin-left: auto; background: #f59e0b; color: #000;
    font-size: 9px; font-weight: 800; padding: 1px 6px; border-radius: 8px;
  }

  .dsb-pts {
    margin: 0 8px 14px; flex-shrink: 0;
    background: rgba(0,243,255,.04); border: 1px solid rgba(0,243,255,.08);
    border-radius: 10px; padding: 11px 13px;
  }
  .dsb-pts-l { font-size: 8px; letter-spacing: 2px; text-transform: uppercase; color: rgba(0,243,255,.38); margin-bottom: 3px; }
  .dsb-pts-v { font-family: 'Syne',sans-serif; font-size: 22px; font-weight: 800; color: #00f3ff; line-height: 1; }
  .dsb-pts-s { font-size: 10px; color: rgba(255,255,255,.22); margin-top: 2px; }

  /* ══ MAIN ═════════════════════════════════ */
.dmain {
  margin-left: 210px;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
  /* ══ INICIO ═══════════════════════════════ */
  .dinicio {padding: 24px 28px 60px;}
  .dinicio-hi  { font-family: 'Syne',sans-serif; font-size: 20px; font-weight: 800; color: #fff; margin-bottom: 2px; }
  .dinicio-sub { font-size: 12px; color: rgba(255,255,255,.28); margin-bottom: 20px; }

  .dstats {
    display: grid; grid-template-columns: repeat(4,1fr); gap: 11px; margin-bottom: 18px;
  }
  .dstat {
    background: #0c0f14; border: 1px solid rgba(255,255,255,.05);
    border-radius: 11px; padding: 15px 16px; position: relative; overflow: hidden;
  }
  .dstat::after { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1.5px; }
  .dstat.c1::after { background: linear-gradient(90deg,#00f3ff,transparent); }
  .dstat.c2::after { background: linear-gradient(90deg,#10b981,transparent); }
  .dstat.c3::after { background: linear-gradient(90deg,#f59e0b,transparent); }
  .dstat.c4::after { background: linear-gradient(90deg,#a855f7,transparent); }
  .dstat-l { font-size: 9px; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(255,255,255,.23); margin-bottom: 7px; }
  .dstat-v { font-family: 'Syne',sans-serif; font-size: 21px; font-weight: 800; color: #fff; line-height: 1; margin-bottom: 4px; }
  .dstat-s { font-size: 10px; color: rgba(255,255,255,.23); }

  .dinicio-grid { display: grid; grid-template-columns: 1fr 270px; gap: 14px; }

  /* card activo */
  .dactivo {
    background: #0c0f14; border: 1px solid rgba(245,158,11,.16);
    border-radius: 11px; overflow: hidden;
  }
  .dactivo-hdr {
    padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,.04);
    display: flex; justify-content: space-between; align-items: center;
  }
  .dactivo-lbl { font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(255,255,255,.22); }
  .dtimer {
    display: flex; align-items: center; gap: 6px;
    background: rgba(245,158,11,.09); border: 1px solid rgba(245,158,11,.2);
    border-radius: 20px; padding: 3px 10px; font-size: 11px; font-weight: 700; color: #f59e0b;
  }
  .dtimer-dot { width: 5px; height: 5px; border-radius: 50%; background: #f59e0b; animation: blk 1.1s infinite; }
  @keyframes blk { 0%,100%{opacity:1} 50%{opacity:.2} }

  .dactivo-body { padding: 14px 16px; display: flex; gap: 13px; align-items: flex-start; }
  .dactivo-img  { width: 76px; height: 54px; border-radius: 7px; object-fit: cover; flex-shrink: 0; border: 1px solid rgba(255,255,255,.07); }
  .dactivo-cat  { font-size: 8px; letter-spacing: 2px; text-transform: uppercase; color: rgba(0,243,255,.4); margin-bottom: 4px; }
  .dactivo-nom  { font-family: 'Syne',sans-serif; font-size: 15px; font-weight: 800; color: #fff; margin-bottom: 8px; line-height: 1.2; }
  .dactivo-row  { display: flex; gap: 18px; }
  .dpl { font-size: 8px; color: rgba(255,255,255,.25); margin-bottom: 2px; }
  .dpv { font-family: 'Syne',sans-serif; font-size: 14px; font-weight: 800; }

  .dactivo-ftr { padding: 10px 16px; border-top: 1px solid rgba(255,255,255,.04); display: flex; gap: 8px; }

  /* botones */
  .dbtn {
    padding: 7px 14px; border-radius: 7px; font-size: 12px; font-weight: 700;
    cursor: pointer; border: none; font-family: 'Plus Jakarta Sans',sans-serif;
    transition: all .16s; white-space: nowrap;
  }
  .dbtn:disabled { opacity: .35; cursor: not-allowed; }
  .dbtn.cyan   { background: #00f3ff; color: #000; }
  .dbtn.cyan:not(:disabled):hover { background: #7fffff; }
  .dbtn.ghost  { background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.09); color: rgba(255,255,255,.45); }
  .dbtn.ghost:not(:disabled):hover { border-color: rgba(255,255,255,.2); color: #fff; }
  .dbtn.green  { background: #10b981; color: #fff; }
  .dbtn.green:not(:disabled):hover { background: #059669; }
  .dbtn.purple { background: rgba(168,85,247,.12); border: 1px solid rgba(168,85,247,.22); color: #a855f7; }
  .dbtn.full   { width: 100%; padding: 11px; text-align: center; border-radius: 8px; font-size: 13px; }

  /* actividad */
  .dact { background: #0c0f14; border: 1px solid rgba(255,255,255,.05); border-radius: 11px; overflow: hidden; }
  .dcard-hdr { padding: 12px 15px; border-bottom: 1px solid rgba(255,255,255,.04); font-size: 11px; font-weight: 600; color: rgba(255,255,255,.45); }
  .dact-row  { padding: 9px 15px; border-bottom: 1px solid rgba(255,255,255,.03); display: flex; gap: 9px; align-items: flex-start; }
  .dact-row:last-child { border-bottom: none; }
  .dact-ico  { width: 24px; height: 24px; border-radius: 6px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 10px; }
  .dact-txt  { font-size: 11.5px; color: rgba(255,255,255,.5); line-height: 1.45; }
  .dact-t    { font-size: 9.5px; color: rgba(255,255,255,.2); margin-top: 2px; }
  .dact-m    { margin-left: auto; font-family: 'Syne',sans-serif; font-size: 12px; font-weight: 700; color: #10b981; flex-shrink: 0; }

  /* ══ PROYECTOS ════════════════════════════ */
  .dproy {display: grid; grid-template-columns: 230px 1fr;
  min-height: calc(100vh - 65px);}
  /* lista lateral */
  .dlista { border-right: 1px solid rgba(255,255,255,.05); display: flex; flex-direction: column; }

  .dlista-hdr {
    padding: 13px 15px 10px; border-bottom: 1px solid rgba(255,255,255,.05);
    display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;
  }
  .dlista-hdr-t { font-size: 11px; font-weight: 700; color: rgba(255,255,255,.4); }
  .dlista-hdr-n { font-size: 10px; color: rgba(255,255,255,.18); }

  .dlista-sec {
    padding: 7px 15px 5px; font-size: 7.5px; letter-spacing: 3px; text-transform: uppercase;
    color: rgba(255,255,255,.16); background: rgba(255,255,255,.012); flex-shrink: 0;
  }

  .ditem {
    padding: 10px 15px; border-bottom: 1px solid rgba(255,255,255,.03);
    cursor: pointer; transition: background .13s; display: flex; gap: 9px; align-items: center; flex-shrink: 0;
  }
  .ditem:hover { background: rgba(255,255,255,.02); }
  .ditem.on    { background: rgba(0,243,255,.04); border-left: 2px solid #00f3ff; padding-left: 13px; }

  .ditem-img { width: 42px; height: 30px; border-radius: 5px; object-fit: cover; flex-shrink: 0; border: 1px solid rgba(255,255,255,.06); }
  .ditem-nom { font-size: 12px; font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 4px; }
  .ditem-bot { display: flex; justify-content: space-between; align-items: center; }
  .ditem-com { font-family: 'Syne',sans-serif; font-size: 11px; font-weight: 700; color: rgba(255,255,255,.28); }

  .dchip {
    display: inline-flex; align-items: center; gap: 3px;
    font-size: 8px; font-weight: 700; letter-spacing: .3px;
    padding: 2px 7px; border-radius: 8px; text-transform: uppercase;
  }
  .dchip-dot { width: 4px; height: 4px; border-radius: 50%; }

  /* ══ DETALLE ══════════════════════════════ */
  .ddet { display: flex; flex-direction: column; min-width: 0; background: #050709; }

  /* galeria */
  .ddet-gal { position: relative; flex-shrink: 0; }
  .ddet-gal-img { width: 100%; aspect-ratio: 16/7; object-fit: cover; display: block; }
  .ddet-gal-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,.1) 40%, rgba(5,7,9,.98) 100%);
  }
  .dgal-btn {
    position: absolute; top: 50%; transform: translateY(-50%);
    background: rgba(0,0,0,.55); border: 1px solid rgba(255,255,255,.12);
    color: #fff; width: 28px; height: 28px; border-radius: 50%; cursor: pointer;
    display: flex; align-items: center; justify-content: center; font-size: 15px;
    transition: background .16s; z-index: 3;
  }
  .dgal-btn:hover { background: rgba(0,0,0,.85); }
  .dgal-btn.prev { left: 10px; }
  .dgal-btn.next { right: 10px; }
  .dgal-dots { position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%); display: flex; gap: 5px; z-index: 3; }
  .dgal-dot  { width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,.22); cursor: pointer; border: none; transition: all .16s; }
  .dgal-dot.on { background: #00f3ff; transform: scale(1.3); }

  /* info sobre imagen */
  .ddet-over {
    position: absolute; bottom: 0; left: 0; right: 0; z-index: 4;
    padding: 0 22px 20px;
    display: flex; justify-content: space-between; align-items: flex-end;
  }
  .ddet-cat { font-size: 8.5px; letter-spacing: 3px; text-transform: uppercase; color: rgba(0,243,255,.55); margin-bottom: 4px; }
  .ddet-nom { font-family: 'Syne',sans-serif; font-size: 22px; font-weight: 800; color: #fff; line-height: 1.1; }
  .ddet-over-r { display: flex; flex-direction: column; align-items: flex-end; gap: 7px; }

  /* cuerpo del detalle */
  .ddet-body { padding: 16px 22px 48px; display: flex; flex-direction: column; gap: 14px; }

  /* banner liberado */
  .dliberado {
    background: rgba(168,85,247,.07); border: 1px solid rgba(168,85,247,.18);
    border-radius: 10px; padding: 12px 14px;
    font-size: 12.5px; color: rgba(168,85,247,.85); line-height: 1.65;
    display: flex; align-items: flex-start; gap: 10px;
  }
  .dliberado-ico { font-size: 17px; flex-shrink: 0; }

  /* fila de 3 meta-cards */
  .ddet-meta { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
  .dmet {
    background: #0c0f14; border: 1px solid rgba(255,255,255,.06);
    border-radius: 10px; padding: 13px 14px;
  }
  .dmet-l { font-size: 8px; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(255,255,255,.22); margin-bottom: 6px; }
  .dmet-v { font-family: 'Syne',sans-serif; font-size: 20px; font-weight: 800; line-height: 1; }
  .dmet-s { font-size: 10px; color: rgba(255,255,255,.28); margin-top: 3px; }

  /* grid 3 columnas: funcionalidades | descripcion | publico */
  .ddet-grid { display: grid; grid-template-columns: 1fr 1.3fr 1.3fr; gap: 10px; }
  .ddet-box {
    background: #0c0f14; border: 1px solid rgba(255,255,255,.06);
    border-radius: 10px; padding: 14px 15px;
  }
  .ddet-box-t { font-size: 8px; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(255,255,255,.2); margin-bottom: 10px; }
  .ddet-box-p { font-size: 12.5px; color: rgba(255,255,255,.43); line-height: 1.75; }

  .dfunc { display: flex; align-items: center; gap: 7px; font-size: 12px; color: rgba(255,255,255,.48); padding: 4px 0; border-bottom: 1px solid rgba(255,255,255,.03); }
  .dfunc:last-child { border-bottom: none; }
  .dfunc-ok { color: #10b981; font-size: 10px; }

  /* acciones */
  .ddet-actions { display: flex; gap: 10px; }
  .ddet-actions .dbtn.full { flex: 1; }

  .dcola-note { font-size: 11px; color: rgba(255,255,255,.25); }

  /* ══ MISIONES ═════════════════════════════ */
  .dmis { flex: 1; padding: 22px 28px 60px; }
  .dmis-ttl { font-family: 'Syne',sans-serif; font-size: 20px; font-weight: 800; color: #fff; margin-bottom: 3px; }
  .dmis-sub { font-size: 12px; color: rgba(255,255,255,.28); margin-bottom: 24px; }

  .dmis-g    { margin-bottom: 26px; }
  .dmis-g-hdr { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,.05); }
  .dmis-g-img { width: 34px; height: 24px; border-radius: 4px; object-fit: cover; }
  .dmis-g-nom { font-size: 13px; font-weight: 700; color: #fff; }
  .dmis-g-cnt { font-size: 10px; color: rgba(255,255,255,.23); }

  .dmis-card {
    background: #0c0f14; border: 1px solid rgba(255,255,255,.05);
    border-radius: 10px; padding: 13px 15px;
    display: flex; gap: 12px; align-items: flex-start;
    margin-bottom: 8px;
  }
  .dmis-pago { flex-shrink: 0; background: rgba(16,185,129,.07); border: 1px solid rgba(16,185,129,.12); border-radius: 8px; padding: 8px 10px; text-align: center; min-width: 56px; }
  .dmis-pago-v { font-family: 'Syne',sans-serif; font-size: 15px; font-weight: 800; color: #10b981; line-height: 1; }
  .dmis-pago-l { font-size: 7px; color: rgba(16,185,129,.4); text-transform: uppercase; letter-spacing: 1px; }

  .dmis-body { flex: 1; min-width: 0; }
  .dmis-nom  { font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 3px; }
  .dmis-desc { font-size: 11.5px; color: rgba(255,255,255,.35); line-height: 1.55; margin-bottom: 8px; }

  .dest {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px;
    padding: 3px 9px; border-radius: 20px;
  }
  .dest.si { background: rgba(255,255,255,.05); color: rgba(255,255,255,.26); }
  .dest.p  { background: rgba(245,158,11,.09); color: #f59e0b; }
  .dest.ok { background: rgba(16,185,129,.09); color: #10b981; }

  /* ══ GUIA ═════════════════════════════════ */
  .dguia { flex: 1; padding: 22px 28px 60px; }
  .dguia-vid {
    width: 100%; aspect-ratio: 16/9; background: #0c0f14;
    border: 1px solid rgba(255,255,255,.06); border-radius: 11px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 9px; color: rgba(255,255,255,.18); margin-bottom: 34px; cursor: pointer;
    transition: border-color .2s;
  }
  .dguia-vid:hover { border-color: rgba(0,243,255,.18); }
  .dguia-vid-ico { font-size: 42px; }
  .dguia-vid-t   { font-family: 'Syne',sans-serif; font-size: 14px; font-weight: 700; color: rgba(255,255,255,.32); }

  .dguia-paso { display: grid; grid-template-columns: 50px 1fr; padding: 22px 0; border-bottom: 1px solid rgba(255,255,255,.05); }
  .dguia-paso:last-child { border-bottom: none; }
  .dguia-n   { font-family: 'Syne',sans-serif; font-size: 12px; font-weight: 800; color: rgba(0,243,255,.3); padding-top: 2px; }
  .dguia-ttl { font-family: 'Syne',sans-serif; font-size: 16px; font-weight: 800; color: #fff; margin-bottom: 6px; }
  .dguia-txt { font-size: 13px; color: rgba(255,255,255,.4); line-height: 1.75; margin-bottom: 12px; }
  .dguia-img { width: 100%; aspect-ratio: 16/7; background: #0c0f14; border: 1px dashed rgba(255,255,255,.07); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,.12); font-size: 11px; }

  /* ══ MODAL ════════════════════════════════ */
  .dovl {
    position: fixed; inset: 0; z-index: 9000;
    background: rgba(0,0,0,.8); display: flex; align-items: center; justify-content: center;
    backdrop-filter: blur(5px); animation: fin .16s ease;
  }
  @keyframes fin { from{opacity:0} to{opacity:1} }

  .dmod {
    background: #0e1319; border: 1px solid rgba(0,243,255,.12);
    border-radius: 15px; padding: 28px; max-width: 400px; width: 92%;
    animation: sup .2s ease;
  }
  @keyframes sup { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }

  .dmod-t    { font-family: 'Syne',sans-serif; font-size: 17px; font-weight: 800; color: #fff; margin-bottom: 8px; }
  .dmod-desc { font-size: 12.5px; color: rgba(255,255,255,.4); line-height: 1.7; margin-bottom: 14px; }
  .dmod-warn { background: rgba(245,158,11,.07); border: 1px solid rgba(245,158,11,.16); border-radius: 8px; padding: 10px 12px; font-size: 11.5px; color: rgba(245,158,11,.78); line-height: 1.6; margin-bottom: 16px; }

  .dmod-in {
    width: 100%; background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08);
    border-radius: 8px; padding: 10px 12px; color: #fff; font-size: 13px;
    font-family: 'Plus Jakarta Sans',sans-serif; outline: none; margin-bottom: 8px; transition: border-color .16s;
  }
  .dmod-in:focus { border-color: rgba(0,243,255,.3); }
  .dmod-in::placeholder { color: rgba(255,255,255,.16); }

  .dup {
    width: 100%; padding: 20px; border: 1px dashed rgba(255,255,255,.1); border-radius: 8px;
    display: flex; flex-direction: column; align-items: center; gap: 6px;
    background: rgba(255,255,255,.02); cursor: pointer; margin-bottom: 12px;
    transition: border-color .16s; color: rgba(255,255,255,.26); font-size: 12px; text-align: center;
  }
  .dup:hover { border-color: rgba(0,243,255,.25); color: rgba(255,255,255,.5); }
  .dup-ico { font-size: 20px; }

  .dmod-row { display: flex; gap: 8px; }
  .dmod-row .dbtn.full { flex: 1; }
`

// ─────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────
export default function Dashboard() {
  const [tab, setTab]       = useState("inicio")
  const [sel, setSel]       = useState(MIS_PROYECTOS[0])
  const [imgIdx, setImgIdx] = useState(0)
  const [modal, setModal]   = useState(null)   // "reservar" | "vendido" | "mision"
  const [misAct, setMisAct] = useState(null)

  const enCurso = MIS_PROYECTOS.find(p => p.estado === "reservado")
  const misP    = MIS_PROYECTOS.flatMap(p => p.misiones).filter(m => m.estado === "pendiente").length

  const pickProy = (p) => { setSel(p); setImgIdx(0) }
  const prev = () => setImgIdx(i => (i - 1 + sel.imagenes.length) % sel.imagenes.length)
  const next = () => setImgIdx(i => (i + 1) % sel.imagenes.length)
  const cerrar = () => { setModal(null); setMisAct(null) }

  const actIco = {
    venta:    { bg: "rgba(16,185,129,.1)",  ic: "✓" },
    mision:   { bg: "rgba(0,243,255,.08)",  ic: "◎" },
    reserva:  { bg: "rgba(245,158,11,.08)", ic: "⏱" },
    liberado: { bg: "rgba(168,85,247,.1)",  ic: "🔓" },
    expiro:   { bg: "rgba(239,68,68,.08)",  ic: "✕" },
  }

  return (
    <div className="d">
      <style>{CSS}</style>

      {/* ── SIDEBAR ── */}
      <aside className="dsb">
        <div className="dsb-top">
          <div className="dsb-av">{VENDEDOR.nombre[0]}</div>
          <div className="dsb-nom">{VENDEDOR.nombre}</div>
          <div className="dsb-rep">
            <span className="dsb-star">★</span>
            <span style={{ color: "rgba(255,255,255,.6)", fontWeight: 600 }}>{VENDEDOR.reputacion}</span>
            <span>reputacion</span>
          </div>
        </div>

        <nav className="dsb-nav">
          <div className="dsb-sec">Menu</div>
          {[
            { id: "inicio",    lbl: "Inicio",        ico: "⊞" },
            { id: "proyectos", lbl: "Mis Proyectos",  ico: "◫" },
            { id: "misiones",  lbl: "Misiones",       ico: "◎", badge: misP },
            { id: "guia",      lbl: "Guia",           ico: "?" },
          ].map(it => (
            <button
              key={it.id}
              className={`dsb-btn ${tab === it.id ? "on" : ""}`}
              onClick={() => setTab(it.id)}
            >
              <span>{it.ico}</span>
              {it.lbl}
              {it.badge > 0 && <span className="dsb-badge">{it.badge}</span>}
            </button>
          ))}
        </nav>

        <div className="dsb-pts">
          <div className="dsb-pts-l">Puntos</div>
          <div className="dsb-pts-v">{VENDEDOR.puntos.toLocaleString()}</div>
          <div className="dsb-pts-s">{VENDEDOR.nivel}</div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="dmain">

        {/* ════ INICIO ════ */}
        {tab === "inicio" && (
          <div className="dinicio">
            <div className="dinicio-hi">Bienvenido, {VENDEDOR.nombre.split(" ")[0]} 👋</div>
            <div className="dinicio-sub">Resumen de tu actividad este mes</div>

            <div className="dstats">
              {[
                { cls: "c1", l: "Ventas del mes",     v: VENDEDOR.ventas,                           s: "+2 vs mes anterior" },
                { cls: "c2", l: "Comisiones cobradas", v: `S/.${VENDEDOR.cobradas.toLocaleString()}`, s: "Este mes" },
                { cls: "c3", l: "Pendiente de cobro",  v: `S/.${VENDEDOR.pendientes}`,                s: "1 venta por aprobar" },
                { cls: "c4", l: "Racha activa",         v: `${VENDEDOR.racha} sem`,                   s: "Sigue 🔥" },
              ].map((s, i) => (
                <div key={i} className={`dstat ${s.cls}`}>
                  <div className="dstat-l">{s.l}</div>
                  <div className="dstat-v">{s.v}</div>
                  <div className="dstat-s">{s.s}</div>
                </div>
              ))}
            </div>

            <div className="dinicio-grid">
              {/* proyecto activo */}
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
                      <img src={enCurso.imagenes[0]} alt="" className="dactivo-img" />
                      <div>
                        <div className="dactivo-cat">{enCurso.categoria}</div>
                        <div className="dactivo-nom">{enCurso.nombre}</div>
                        <div className="dactivo-row">
                          <div>
                            <div className="dpl">Precio desarrollo</div>
                            <div className="dpv" style={{ color: "#00f3ff" }}>S/.{enCurso.precio.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="dpl">Tu comision</div>
                            <div className="dpv" style={{ color: "#10b981" }}>S/.{enCurso.precio * enCurso.comision / 100}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="dactivo-ftr">
                      <button className="dbtn cyan" onClick={() => { pickProy(enCurso); setTab("proyectos") }}>
                        Ver proyecto
                      </button>
                      <button className="dbtn ghost" onClick={() => setModal("vendido")}>
                        Marcar vendido
                      </button>
                    </div>
                  </>
                ) : (
                  <div style={{ padding: "28px 16px", textAlign: "center", color: "rgba(255,255,255,.2)", fontSize: 12 }}>
                    Sin proyecto activo.
                    <br />
                    <button className="dbtn cyan" style={{ marginTop: 12 }} onClick={() => setTab("proyectos")}>
                      Ver proyectos
                    </button>
                  </div>
                )}
              </div>

              {/* actividad reciente */}
              <div className="dact">
                <div className="dcard-hdr">Actividad reciente</div>
                {ACTIVIDAD.map((a, i) => {
                  const ic = actIco[a.tipo] || actIco.reserva
                  return (
                    <div key={i} className="dact-row">
                      <div className="dact-ico" style={{ background: ic.bg }}>{ic.ic}</div>
                      <div style={{ flex: 1 }}>
                        <div className="dact-txt">{a.txt}</div>
                        <div className="dact-t">{a.tiempo}</div>
                      </div>
                      {a.monto && <div className="dact-m">+S/.{a.monto}</div>}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ════ PROYECTOS ════ */}
        {tab === "proyectos" && (
          <div className="dproy">

            {/* lista lateral */}
            <div className="dlista">
              <div className="dlista-hdr">
                <span className="dlista-hdr-t">Mis Proyectos</span>
                <span className="dlista-hdr-n">{MIS_PROYECTOS.length}</span>
              </div>

              {/* ACTIVOS: solo reservado y liberado */}
              {MIS_PROYECTOS.filter(p => ["reservado", "liberado"].includes(p.estado)).length > 0 && (
                <>
                  <div className="dlista-sec">Activos</div>
                  {MIS_PROYECTOS.filter(p => ["reservado", "liberado"].includes(p.estado)).map(p => (
                    <ItemLista key={p.id} p={p} activo={sel?.id === p.id} onClick={() => pickProy(p)} />
                  ))}
                </>
              )}

              {/* HISTORIAL: vendido y expirado */}
              {MIS_PROYECTOS.filter(p => ["vendido", "expirado"].includes(p.estado)).length > 0 && (
                <>
                  <div className="dlista-sec">Historial</div>
                  {MIS_PROYECTOS.filter(p => ["vendido", "expirado"].includes(p.estado)).map(p => (
                    <ItemLista key={p.id} p={p} activo={sel?.id === p.id} onClick={() => pickProy(p)} />
                  ))}
                </>
              )}

              {/* NOTA: disponibles generales NO aparecen aquí — el vendedor
                  solo ve "liberado" (proyectos de la cola que se liberaron para él) */}
            </div>

            {/* panel detalle */}
            {sel ? (
              <Detalle
                p={sel}
                imgIdx={imgIdx}
                onPrev={prev}
                onNext={next}
                onDot={setImgIdx}
                onVendido={() => setModal("vendido")}
                onReservar={() => setModal("reservar")}
              />
            ) : (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,.2)", fontSize: 13 }}>
                Selecciona un proyecto
              </div>
            )}
          </div>
        )}

        {/* ════ MISIONES ════ */}
        {tab === "misiones" && (
          <div className="dmis">
            <div className="dmis-ttl">Misiones</div>
            <div className="dmis-sub">Tareas con pago fijo — se cobran aunque no cierres la venta</div>

            {MIS_PROYECTOS.filter(p => p.misiones.length > 0).map(p => (
              <div key={p.id} className="dmis-g">
                <div className="dmis-g-hdr">
                  <img src={p.imagenes[0]} alt="" className="dmis-g-img" />
                  <div>
                    <div className="dmis-g-nom">{p.nombre}</div>
                    <div className="dmis-g-cnt">{p.misiones.length} misiones</div>
                  </div>
                </div>
                {p.misiones.map(m => (
                  <div key={m.id} className="dmis-card">
                    <div className="dmis-pago">
                      <div className="dmis-pago-v">S/.{m.pago}</div>
                      <div className="dmis-pago-l">pago</div>
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
                        onClick={() => { setMisAct(m); setModal("mision") }}
                      >
                        Completar
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* ════ GUIA ════ */}
        {tab === "guia" && <Guia />}
      </main>

      {/* ── MODALES ── */}
      {modal && (
        <div className="dovl" onClick={cerrar}>
          <div className="dmod" onClick={e => e.stopPropagation()}>
            {modal === "reservar" && <ModalReservar p={sel} onClose={cerrar} />}
            {modal === "vendido"  && <ModalVendido  p={sel} onClose={cerrar} />}
            {modal === "mision"   && misAct && <ModalMision m={misAct} onClose={cerrar} />}
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// ITEM LISTA
// ─────────────────────────────────────────────
function ItemLista({ p, activo, onClick }) {
  const cfg = estadoCfg(p.estado)
  return (
    <div className={`ditem ${activo ? "on" : ""}`} onClick={onClick}>
      <img src={p.imagenes[0]} alt="" className="ditem-img" />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="ditem-nom">{p.nombre}</div>
        <div className="ditem-bot">
          <div className="dchip" style={{ background: cfg.bg, color: cfg.color }}>
            <div className="dchip-dot" style={{ background: cfg.dot }} />
            {cfg.label}
          </div>
          <div className="ditem-com">S/.{p.precio * p.comision / 100}</div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// DETALLE — panel derecho rediseñado
// ─────────────────────────────────────────────
function Detalle({ p, imgIdx, onPrev, onNext, onDot, onVendido, onReservar }) {
  const cfg = estadoCfg(p.estado)
  const comision = p.precio * p.comision / 100

  return (
    <div className="ddet">

      {/* galería con info encima */}
      <div className="ddet-gal">
        <img src={p.imagenes[imgIdx]} alt="" className="ddet-gal-img" />
        <div className="ddet-gal-overlay" />

        {p.imagenes.length > 1 && (
          <>
            <button className="dgal-btn prev" onClick={onPrev}>‹</button>
            <button className="dgal-btn next" onClick={onNext}>›</button>
            <div className="dgal-dots">
              {p.imagenes.map((_, i) => (
                <button key={i} className={`dgal-dot ${i === imgIdx ? "on" : ""}`} onClick={() => onDot(i)} />
              ))}
            </div>
          </>
        )}

        {/* nombre y estado sobre la imagen */}
        <div className="ddet-over">
          <div>
            <div className="ddet-cat">{p.categoria.toUpperCase()}</div>
            <div className="ddet-nom">{p.nombre}</div>
          </div>
          <div className="ddet-over-r">
            <div className="dchip" style={{ background: cfg.bg, color: cfg.color, fontSize: 9, padding: "3px 10px" }}>
              <div className="dchip-dot" style={{ background: cfg.dot }} />
              {cfg.label}
            </div>
            <a href={p.demo} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              <button className="dbtn ghost" style={{ fontSize: 11 }}>🔗 Ver demo</button>
            </a>
          </div>
        </div>
      </div>

      {/* cuerpo */}
      <div className="ddet-body">

        {/* aviso especial si está liberado */}
        {p.estado === "liberado" && (
          <div className="dliberado">
            <div className="dliberado-ico">🔓</div>
            <div>
              Este proyecto estaba en cola y se liberó para ti.
              Tienes <strong style={{ color: "#a855f7" }}>{tiempoRestante(p.expiraEn)}</strong> para
              reservarlo. Si no lo haces pasa al siguiente vendedor en la cola.
            </div>
          </div>
        )}

        {/* fila de 3 datos clave */}
        <div className="ddet-meta">
          <div className="dmet">
            <div className="dmet-l">Precio desarrollo</div>
            <div className="dmet-v" style={{ color: "#00f3ff" }}>S/.{p.precio.toLocaleString()}</div>
            <div className="dmet-s">Pago unico del cliente</div>
          </div>

          <div className="dmet">
            <div className="dmet-l">Tu comision ({p.comision}%)</div>
            <div className="dmet-v" style={{ color: "#10b981" }}>S/.{comision}</div>
            <div className="dmet-s">Pagado en 48h tras aprobar</div>
          </div>

          <div className="dmet">
            {p.estado === "reservado" && (
              <>
                <div className="dmet-l">Tiempo restante</div>
                <div className="dmet-v" style={{ color: "#f59e0b" }}>{tiempoRestante(p.expiraEn)}</div>
                <div className="dmet-s">Para cerrar la venta</div>
              </>
            )}
            {p.estado === "liberado" && (
              <>
                <div className="dmet-l">Expira en</div>
                <div className="dmet-v" style={{ color: "#a855f7" }}>{tiempoRestante(p.expiraEn)}</div>
                <div className="dmet-s">Para reservar</div>
              </>
            )}
            {p.estado === "vendido" && (
              <>
                <div className="dmet-l">Estado final</div>
                <div className="dmet-v" style={{ color: "#3b82f6", fontSize: 16, paddingTop: 2 }}>Vendido ✓</div>
                <div className="dmet-s">Comision cobrada</div>
              </>
            )}
            {p.estado === "expirado" && (
              <>
                <div className="dmet-l">Estado final</div>
                <div className="dmet-v" style={{ color: "#ef4444", fontSize: 16, paddingTop: 2 }}>Expirado</div>
                <div className="dmet-s">Afecto reputacion</div>
              </>
            )}
          </div>
        </div>

        {/* 3 columnas: funcionalidades | descripcion | publico objetivo */}
        <div className="ddet-grid">
          <div className="ddet-box">
            <div className="ddet-box-t">Funcionalidades</div>
            {p.funcionalidades.map((f, i) => (
              <div key={i} className="dfunc">
                <span className="dfunc-ok">✓</span>
                {f}
              </div>
            ))}
          </div>

          <div className="ddet-box">
            <div className="ddet-box-t">Descripcion</div>
            <div className="ddet-box-p">{p.descripcion}</div>
          </div>

          <div className="ddet-box">
            <div className="ddet-box-t">Publico objetivo</div>
            <div className="ddet-box-p">{p.publicoObjetivo}</div>
          </div>
        </div>

        {/* cola */}
        {p.colaDetras > 0 && (
          <div className="dcola-note">
            {p.colaDetras} vendedor{p.colaDetras > 1 ? "es" : ""} esperando detrás de ti en la cola
          </div>
        )}

        {/* botones de accion */}
        <div className="ddet-actions">
          {p.estado === "reservado" && (
            <button className="dbtn green full" onClick={onVendido}>
              ✓ Marcar como vendido
            </button>
          )}
          {p.estado === "liberado" && (
            <button className="dbtn cyan full" onClick={onReservar}>
              Reservar ahora
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// GUIA
// ─────────────────────────────────────────────
function Guia() {
  const pasos = [
    { n: "01", t: "Explora el catalogo",  d: "En 'Mis Proyectos' ves los sitios que tienes activos o en historial. Cada uno tiene precio, comision, funcionalidades y un demo en vivo para mostrarle a tu cliente." },
    { n: "02", t: "Reserva un proyecto",  d: "Cuando tengas un cliente interesado, reserva. Tienes 6 dias para cerrar la venta. Si hay vendedores en cola pueden ver el timer pero el proyecto es tuyo mientras lo tengas." },
    { n: "03", t: "Cierra la venta",      d: "Presentale el demo al cliente. El precio de desarrollo es pago unico. El cliente tambien paga suscripcion mensual de mantenimiento que es aparte del desarrollo." },
    { n: "04", t: "Reporta la venta",     d: "Entra a 'Marcar como vendido', sube nombre del cliente, contacto y comprobante de pago. El admin lo revisa y libera tu comision en 48h via Yape o transferencia." },
    { n: "05", t: "Completa misiones",    d: "Hay tareas opcionales por proyecto — publicar en redes, conseguir reseñas, videos. Cada mision tiene pago fijo que cobras aunque no cierres la venta principal." },
    { n: "06", t: "Cuida tu reputacion",  d: "Tu score sube con ventas y misiones aprobadas. Baja si dejas expirar reservas sin justificacion. Score alto = acceso a proyectos con mayor comision y bonos mensuales." },
  ]

  return (
    <div className="dguia">
      <div className="dmis-ttl" style={{ marginBottom: 3 }}>Guia del vendedor</div>
      <div className="dmis-sub" style={{ marginBottom: 28 }}>Todo lo que necesitas saber para empezar</div>
      <div className="dguia-vid">
        <div className="dguia-vid-ico">▶</div>
        <div className="dguia-vid-t">Video introductorio — Bienvenido a Synkro</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,.16)" }}>Proximamente</div>
      </div>
      {pasos.map(p => (
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

// ─────────────────────────────────────────────
// MODALES
// ─────────────────────────────────────────────
function ModalReservar({ p, onClose }) {
  return (
    <>
      <div className="dmod-t">Reservar — {p?.nombre}</div>
      <div className="dmod-desc">
        Tendras 6 dias para reportar la venta. Si el tiempo expira, el proyecto pasa al siguiente vendedor en la cola.
      </div>
      <div className="dmod-warn">
        ⚠️ Las reservas expiradas bajan tu reputacion. Solo reserva si tienes un cliente en mente.
      </div>
      <div className="dmod-row">
        <button className="dbtn ghost full" onClick={onClose}>Cancelar</button>
        <button className="dbtn cyan full" onClick={onClose}>Confirmar reserva</button>
      </div>
    </>
  )
}

function ModalVendido({ p, onClose }) {
  const [nombre,   setNombre]   = useState("")
  const [contacto, setContacto] = useState("")
  const [file,     setFile]     = useState(null)
  const [loading,  setLoading]  = useState(false)

  const onFile = (e) => { if (e.target.files[0]) setFile(e.target.files[0]) }
  const onDrop = (e) => { e.preventDefault(); if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]) }

  const enviar = async () => {
    if (!nombre || !contacto || !file) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    setLoading(false)
    onClose()
  }

  return (
    <>
      <div className="dmod-t">Reportar venta — {p?.nombre}</div>
      <div className="dmod-desc">
        Sube la evidencia. El admin la revisa y libera tu comision en 48h via Yape o transferencia.
      </div>
      <input
        className="dmod-in" placeholder="Nombre del cliente"
        value={nombre} onChange={e => setNombre(e.target.value)}
      />
      <input
        className="dmod-in" placeholder="WhatsApp o correo del cliente"
        value={contacto} onChange={e => setContacto(e.target.value)}
      />
      <label
        className="dup"
        onDragOver={e => e.preventDefault()}
        onDrop={onDrop}
        style={file ? { borderColor: "rgba(16,185,129,.4)", color: "rgba(16,185,129,.8)" } : {}}
      >
        <input type="file" accept="image/*,.pdf" style={{ display: "none" }} onChange={onFile} />
        <div className="dup-ico">{file ? "✓" : "📎"}</div>
        <div>{file ? file.name : "Sube el comprobante de pago"}</div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,.16)" }}>
          {file ? `${(file.size / 1024).toFixed(0)} KB` : "PNG, JPG o PDF — max 5MB"}
        </div>
      </label>
      <div className="dmod-row">
        <button className="dbtn ghost full" onClick={onClose}>Cancelar</button>
        <button
          className="dbtn green full"
          disabled={!nombre || !contacto || !file || loading}
          onClick={enviar}
        >
          {loading ? "Enviando..." : "Enviar evidencia"}
        </button>
      </div>
    </>
  )
}

function ModalMision({ m, onClose }) {
  const [file,    setFile]    = useState(null)
  const [loading, setLoading] = useState(false)

  const onFile = (e) => { if (e.target.files[0]) setFile(e.target.files[0]) }
  const onDrop = (e) => { e.preventDefault(); if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]) }

  const enviar = async () => {
    if (!file) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    setLoading(false)
    onClose()
  }

  return (
    <>
      <div className="dmod-t">{m.titulo}</div>
      <div className="dmod-desc">{m.desc}</div>
      <label
        className="dup"
        onDragOver={e => e.preventDefault()}
        onDrop={onDrop}
        style={file ? { borderColor: "rgba(16,185,129,.4)", color: "rgba(16,185,129,.8)" } : {}}
      >
        <input type="file" accept="image/*" style={{ display: "none" }} onChange={onFile} />
        <div className="dup-ico">{file ? "✓" : "📸"}</div>
        <div>{file ? file.name : "Sube una captura como evidencia"}</div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,.16)" }}>
          {file ? `${(file.size / 1024).toFixed(0)} KB` : "PNG o JPG — max 5MB"}
        </div>
      </label>
      <div className="dmod-row">
        <button className="dbtn ghost full" onClick={onClose}>Cancelar</button>
        <button
          className="dbtn green full"
          disabled={!file || loading}
          onClick={enviar}
        >
          {loading ? "Enviando..." : "Enviar evidencia"}
        </button>
      </div>
    </>
  )
}