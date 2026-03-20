// ─────────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────────
export function tiempoRestante(ts) {
  if (!ts) return null
  const ms   = ts?.toDate ? ts.toDate().getTime() : new Date(ts).getTime()
  const diff = ms - Date.now()
  if (diff <= 0) return "Expirado"
  const d = Math.floor(diff / 864e5)
  const h = Math.floor((diff % 864e5) / 36e5)
  const m = Math.floor((diff % 36e5) / 6e4)
  if (d > 0) return `${d}d ${h}h`
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export function estadoCfg(e) {
  const map = {
    reservado: { bg:"rgba(245,158,11,.14)",  color:"#f59e0b", dot:"#f59e0b", label:"Reservado"  },
    liberado:  { bg:"rgba(168,85,247,.13)",  color:"#a855f7", dot:"#a855f7", label:"Liberado"   },
    vendido:   { bg:"rgba(59,130,246,.13)",  color:"#3b82f6", dot:"#3b82f6", label:"Vendido"    },
    expirado:  { bg:"rgba(239,68,68,.11)",   color:"#ef4444", dot:"#ef4444", label:"Expirado"   },
    disponible:{ bg:"rgba(16,185,129,.11)",  color:"#10b981", dot:"#10b981", label:"Disponible" },
  }
  return map[e] || { bg:"rgba(255,255,255,.06)", color:"#aaa", dot:"#aaa", label: e }
}

export function formatFecha(ts) {
  if (!ts) return ""
  const d = ts?.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString("es-PE", { day:"numeric", month:"short" })
}

export async function subirImagenCloudinary(file) {
  const CLOUD  = "dnw35uxqn"
  const PRESET = "synkro_uploads"
  const fd = new FormData()
  fd.append("file", file)
  fd.append("upload_preset", PRESET)
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, { method:"POST", body:fd })
  if (!res.ok) throw new Error("Error al subir imagen")
  return (await res.json()).secure_url
}

// ─────────────────────────────────────────────
// CSS GLOBAL DEL DASHBOARD
// ─────────────────────────────────────────────
export const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .d { min-height: 100vh; margin-top: 65px; background: #050709; font-family: 'Plus Jakarta Sans', sans-serif; color: #d1d5db; }

  /* ── SIDEBAR ── */
  .dsb { width: 210px; background: #070a0f; border-right: 1px solid rgba(255,255,255,.05); display: flex; flex-direction: column; position: fixed; top: 65px; left: 0; bottom: 0; overflow: hidden; z-index: 100; transition: transform .28s ease; }
  .dsb-top { padding: 20px 16px 16px; border-bottom: 1px solid rgba(255,255,255,.05); flex-shrink: 0; }
  .dsb-av { width: 38px; height: 38px; border-radius: 9px; background: linear-gradient(135deg,rgba(0,243,255,.1),rgba(168,85,247,.1)); border: 1px solid rgba(0,243,255,.15); display: flex; align-items: center; justify-content: center; font-family: 'Syne',sans-serif; font-size: 15px; font-weight: 800; color: #00f3ff; margin-bottom: 9px; }
  .dsb-nom  { font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 3px; }
  .dsb-rep  { display: flex; align-items: center; gap: 5px; font-size: 11px; color: rgba(255,255,255,.3); }
  .dsb-star { color: #f59e0b; }
  .dsb-nav  { padding: 10px 8px; flex: 1; overflow-y: auto; }
  .dsb-sec  { font-size: 8px; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,.16); padding: 0 8px; margin: 10px 0 4px; }
  .dsb-btn  { display: flex; align-items: center; gap: 9px; width: 100%; padding: 8px 10px; border-radius: 8px; background: transparent; border: none; cursor: pointer; font-size: 13px; font-weight: 500; color: rgba(255,255,255,.35); transition: all .16s; text-align: left; position: relative; margin-bottom: 1px; font-family: 'Plus Jakarta Sans',sans-serif; }
  .dsb-btn:hover { background: rgba(255,255,255,.04); color: rgba(255,255,255,.7); }
  .dsb-btn.on    { background: rgba(0,243,255,.07); color: #00f3ff; font-weight: 600; }
  .dsb-btn.on::before { content: ''; position: absolute; left: 0; top: 20%; bottom: 20%; width: 2.5px; border-radius: 2px; background: #00f3ff; }
  .dsb-badge { margin-left: auto; background: #f59e0b; color: #000; font-size: 9px; font-weight: 800; padding: 1px 6px; border-radius: 8px; }
  .dsb-pts { margin: 0 8px 14px; flex-shrink: 0; background: rgba(0,243,255,.04); border: 1px solid rgba(0,243,255,.08); border-radius: 10px; padding: 11px 13px; }
  .dsb-pts-l { font-size: 8px; letter-spacing: 2px; text-transform: uppercase; color: rgba(0,243,255,.38); margin-bottom: 3px; }
  .dsb-pts-v { font-family: 'Syne',sans-serif; font-size: 22px; font-weight: 800; color: #00f3ff; line-height: 1; }
  .dsb-pts-s { font-size: 10px; color: rgba(255,255,255,.22); margin-top: 2px; }

  /* ── MAIN ── */
  .dmain { margin-left: 210px; display: flex; flex-direction: column; min-width: 0; }

  /* ── TOPBAR MOBILE ── */
  .d-topbar { display: none; position: fixed; top: 0; left: 0; right: 0; height: 56px; background: rgba(0,10,20,.92); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(0,243,255,.15); align-items: center; justify-content: space-between; padding: 0 18px; z-index: 1100; }
  .d-topbar-logo { font-family: 'Syne',sans-serif; font-size: 20px; font-weight: 800; color: #00f3ff; letter-spacing: 3px; text-decoration: none; }
  .d-topbar-ham  { display: flex; flex-direction: column; gap: 5px; width: 36px; height: 36px; background: none; border: none; cursor: pointer; padding: 6px; justify-content: center; align-items: center; }
  .d-topbar-ham span { display: block; width: 20px; height: 2px; background: rgba(255,255,255,.7); border-radius: 2px; transition: all .28s; }
  .d-topbar-ham.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); background: #00f3ff; }
  .d-topbar-ham.open span:nth-child(2) { opacity: 0; }
  .d-topbar-ham.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); background: #00f3ff; }
  .d-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,.55); z-index: 1090; }
  .d-overlay.open { display: block; }

  /* ── LOADING ── */
  .d-loading { display: flex; align-items: center; justify-content: center; min-height: 60vh; color: rgba(255,255,255,.25); font-size: 13px; gap: 10px; }
  .d-spin { width: 18px; height: 18px; border: 2px solid rgba(0,243,255,.2); border-top-color: #00f3ff; border-radius: 50%; animation: spin .7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── INICIO ── */
  .dinicio { padding: 24px 28px 60px; }
  .dinicio-hi  { font-family: 'Syne',sans-serif; font-size: 20px; font-weight: 800; color: #fff; margin-bottom: 2px; }
  .dinicio-sub { font-size: 12px; color: rgba(255,255,255,.28); margin-bottom: 20px; }
  .dstats { display: grid; grid-template-columns: repeat(4,1fr); gap: 11px; margin-bottom: 18px; }
  .dstat  { background: #0c0f14; border: 1px solid rgba(255,255,255,.05); border-radius: 11px; padding: 15px 16px; position: relative; overflow: hidden; }
  .dstat::after { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1.5px; }
  .dstat.c1::after { background: linear-gradient(90deg,#00f3ff,transparent); }
  .dstat.c2::after { background: linear-gradient(90deg,#10b981,transparent); }
  .dstat.c3::after { background: linear-gradient(90deg,#f59e0b,transparent); }
  .dstat.c4::after { background: linear-gradient(90deg,#a855f7,transparent); }
  .dstat-l { font-size: 9px; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(255,255,255,.23); margin-bottom: 7px; }
  .dstat-v { font-family: 'Syne',sans-serif; font-size: 21px; font-weight: 800; color: #fff; line-height: 1; margin-bottom: 4px; }
  .dstat-s { font-size: 10px; color: rgba(255,255,255,.23); }
  .dinicio-grid { display: grid; grid-template-columns: 1fr 270px; gap: 14px; }
  .dactivo { background: #0c0f14; border: 1px solid rgba(245,158,11,.16); border-radius: 11px; overflow: hidden; }
  .dactivo-hdr { padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,.04); display: flex; justify-content: space-between; align-items: center; }
  .dactivo-lbl { font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(255,255,255,.22); }
  .dtimer { display: flex; align-items: center; gap: 6px; background: rgba(245,158,11,.09); border: 1px solid rgba(245,158,11,.2); border-radius: 20px; padding: 3px 10px; font-size: 11px; font-weight: 700; color: #f59e0b; }
  .dtimer-dot { width: 5px; height: 5px; border-radius: 50%; background: #f59e0b; animation: blk 1.1s infinite; }
  @keyframes blk { 0%,100%{opacity:1} 50%{opacity:.2} }
  .dactivo-body { padding: 14px 16px; display: flex; gap: 13px; align-items: flex-start; }
  .dactivo-img  { width: 76px; height: 54px; border-radius: 7px; object-fit: cover; flex-shrink: 0; border: 1px solid rgba(255,255,255,.07); }
  .dactivo-cat  { font-size: 8px; letter-spacing: 2px; text-transform: uppercase; color: rgba(0,243,255,.4); margin-bottom: 4px; }
  .dactivo-nom  { font-family: 'Syne',sans-serif; font-size: 15px; font-weight: 800; color: #fff; margin-bottom: 8px; line-height: 1.2; }
  .dactivo-row  { display: flex; gap: 18px; }
  .dpl { font-size: 8px; color: rgba(255,255,255,.25); margin-bottom: 2px; }
  .dpv { font-family: 'Syne',sans-serif; font-size: 14px; font-weight: 800; }
  .dactivo-ftr  { padding: 10px 16px; border-top: 1px solid rgba(255,255,255,.04); display: flex; gap: 8px; }
  .dact { background: #0c0f14; border: 1px solid rgba(255,255,255,.05); border-radius: 11px; overflow: hidden; }
  .dcard-hdr { padding: 12px 15px; border-bottom: 1px solid rgba(255,255,255,.04); font-size: 11px; font-weight: 600; color: rgba(255,255,255,.45); }
  .dact-row  { padding: 9px 15px; border-bottom: 1px solid rgba(255,255,255,.03); display: flex; gap: 9px; align-items: flex-start; }
  .dact-row:last-child { border-bottom: none; }
  .dact-ico  { width: 24px; height: 24px; border-radius: 6px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 10px; }
  .dact-txt  { font-size: 11.5px; color: rgba(255,255,255,.5); line-height: 1.45; }
  .dact-t    { font-size: 9.5px; color: rgba(255,255,255,.2); margin-top: 2px; }
  .dact-m    { margin-left: auto; font-family: 'Syne',sans-serif; font-size: 12px; font-weight: 700; color: #10b981; flex-shrink: 0; }

  /* ── PROYECTOS / CATÁLOGO ── */
  .dproy { display: grid; grid-template-columns: 230px 1fr; min-height: calc(100vh - 65px); }
  .dlista { border-right: 1px solid rgba(255,255,255,.05); display: flex; flex-direction: column; overflow-y: auto; }
  .dlista-hdr { padding: 13px 15px 10px; border-bottom: 1px solid rgba(255,255,255,.05); display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
  .dlista-hdr-t { font-size: 11px; font-weight: 700; color: rgba(255,255,255,.4); }
  .dlista-hdr-n { font-size: 10px; color: rgba(255,255,255,.18); }
  .dlista-sec   { padding: 7px 15px 5px; font-size: 7.5px; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,.16); background: rgba(255,255,255,.012); flex-shrink: 0; }
  .ditem { padding: 10px 15px; border-bottom: 1px solid rgba(255,255,255,.03); cursor: pointer; transition: background .13s; display: flex; gap: 9px; align-items: center; flex-shrink: 0; }
  .ditem:hover { background: rgba(255,255,255,.02); }
  .ditem.on    { background: rgba(0,243,255,.04); border-left: 2px solid #00f3ff; padding-left: 13px; }
  .ditem-img { width: 42px; height: 30px; border-radius: 5px; object-fit: cover; flex-shrink: 0; border: 1px solid rgba(255,255,255,.06); }
  .ditem-nom { font-size: 12px; font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 4px; }
  .ditem-bot { display: flex; justify-content: space-between; align-items: center; }
  .ditem-com { font-family: 'Syne',sans-serif; font-size: 11px; font-weight: 700; color: rgba(255,255,255,.28); }
  .dchip     { display: inline-flex; align-items: center; gap: 3px; font-size: 8px; font-weight: 700; letter-spacing: .3px; padding: 2px 7px; border-radius: 8px; text-transform: uppercase; }
  .dchip-dot { width: 4px; height: 4px; border-radius: 50%; }

  /* ── DETALLE ── */
  .ddet { display: flex; flex-direction: column; min-width: 0; background: #050709; overflow-y: auto; }
  .ddet-gal { position: relative; flex-shrink: 0; }
  .ddet-gal-img { width: 100%; aspect-ratio: 16/7; object-fit: cover; display: block; }
  .ddet-gal-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,.1) 40%, rgba(5,7,9,.98) 100%); }
  .dgal-btn  { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,.55); border: 1px solid rgba(255,255,255,.12); color: #fff; width: 28px; height: 28px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 15px; transition: background .16s; z-index: 3; }
  .dgal-btn:hover { background: rgba(0,0,0,.85); }
  .dgal-btn.prev { left: 10px; }
  .dgal-btn.next { right: 10px; }
  .dgal-dots { position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%); display: flex; gap: 5px; z-index: 3; }
  .dgal-dot  { width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,.22); cursor: pointer; border: none; transition: all .16s; }
  .dgal-dot.on { background: #00f3ff; transform: scale(1.3); }
  .ddet-over { position: absolute; bottom: 0; left: 0; right: 0; z-index: 4; padding: 0 22px 20px; display: flex; justify-content: space-between; align-items: flex-end; }
  .ddet-cat  { font-size: 8.5px; letter-spacing: 3px; text-transform: uppercase; color: rgba(0,243,255,.55); margin-bottom: 4px; }
  .ddet-nom  { font-family: 'Syne',sans-serif; font-size: 22px; font-weight: 800; color: #fff; line-height: 1.1; }
  .ddet-over-r { display: flex; flex-direction: column; align-items: flex-end; gap: 7px; }
  .ddet-body { padding: 16px 22px 48px; display: flex; flex-direction: column; gap: 14px; }
  .dliberado { background: rgba(168,85,247,.07); border: 1px solid rgba(168,85,247,.18); border-radius: 10px; padding: 12px 14px; font-size: 12.5px; color: rgba(168,85,247,.85); line-height: 1.65; display: flex; align-items: flex-start; gap: 10px; }
  .dliberado-ico { font-size: 17px; flex-shrink: 0; }
  .ddet-meta { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
  .dmet { background: #0c0f14; border: 1px solid rgba(255,255,255,.06); border-radius: 10px; padding: 13px 14px; }
  .dmet-l { font-size: 8px; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(255,255,255,.22); margin-bottom: 6px; }
  .dmet-v { font-family: 'Syne',sans-serif; font-size: 20px; font-weight: 800; line-height: 1; }
  .dmet-s { font-size: 10px; color: rgba(255,255,255,.28); margin-top: 3px; }
  .ddet-grid { display: grid; grid-template-columns: 1fr 1.3fr 1.3fr; gap: 10px; }
  .ddet-box  { background: #0c0f14; border: 1px solid rgba(255,255,255,.06); border-radius: 10px; padding: 14px 15px; }
  .ddet-box-t { font-size: 8px; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(255,255,255,.2); margin-bottom: 10px; }
  .ddet-box-p { font-size: 12.5px; color: rgba(255,255,255,.43); line-height: 1.75; }
  .dfunc { display: flex; align-items: center; gap: 7px; font-size: 12px; color: rgba(255,255,255,.48); padding: 4px 0; border-bottom: 1px solid rgba(255,255,255,.03); }
  .dfunc:last-child { border-bottom: none; }
  .dfunc-ok { color: #10b981; font-size: 10px; }
  .ddet-actions { display: flex; gap: 10px; }
  .ddet-actions .dbtn.full { flex: 1; }
  .dcola-note { font-size: 11px; color: rgba(255,255,255,.25); }

  /* ── MISIONES ── */
  .dmis { flex: 1; padding: 22px 28px 60px; }
  .dmis-ttl  { font-family: 'Syne',sans-serif; font-size: 20px; font-weight: 800; color: #fff; margin-bottom: 3px; }
  .dmis-sub  { font-size: 12px; color: rgba(255,255,255,.28); margin-bottom: 24px; }
  .dmis-g    { margin-bottom: 26px; }
  .dmis-g-hdr { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,.05); }
  .dmis-g-img { width: 34px; height: 24px; border-radius: 4px; object-fit: cover; }
  .dmis-g-nom { font-size: 13px; font-weight: 700; color: #fff; }
  .dmis-g-cnt { font-size: 10px; color: rgba(255,255,255,.23); }
  .dmis-card  { background: #0c0f14; border: 1px solid rgba(255,255,255,.05); border-radius: 10px; padding: 13px 15px; display: flex; gap: 12px; align-items: flex-start; margin-bottom: 8px; }
  .dmis-pago  { flex-shrink: 0; background: rgba(0,243,255,.04); border: 1px solid rgba(0,243,255,.1); border-radius: 8px; padding: 8px 10px; text-align: center; min-width: 56px; }
  .dmis-pago-v { font-family: 'Syne',sans-serif; font-size: 13px; font-weight: 800; color: rgba(0,243,255,.6); line-height: 1; }
  .dmis-pago-l { font-size: 7px; color: rgba(0,243,255,.3); text-transform: uppercase; letter-spacing: 1px; }
  .dmis-body { flex: 1; min-width: 0; }
  .dmis-nom  { font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 3px; }
  .dmis-desc { font-size: 11.5px; color: rgba(255,255,255,.35); line-height: 1.55; margin-bottom: 8px; }
  .dest { display: inline-flex; align-items: center; gap: 5px; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px; padding: 3px 9px; border-radius: 20px; }
  .dest.si { background: rgba(255,255,255,.05); color: rgba(255,255,255,.26); }
  .dest.p  { background: rgba(245,158,11,.09); color: #f59e0b; }
  .dest.ok { background: rgba(16,185,129,.09); color: #10b981; }

  /* ── GUIA ── */
  .dguia { flex: 1; padding: 22px 28px 60px; }
  .dguia-vid { width: 100%; aspect-ratio: 16/9; background: #0c0f14; border: 1px solid rgba(255,255,255,.06); border-radius: 11px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 9px; color: rgba(255,255,255,.18); margin-bottom: 34px; cursor: pointer; transition: border-color .2s; }
  .dguia-vid:hover { border-color: rgba(0,243,255,.18); }
  .dguia-vid-ico { font-size: 42px; }
  .dguia-vid-t   { font-family: 'Syne',sans-serif; font-size: 14px; font-weight: 700; color: rgba(255,255,255,.32); }
  .dguia-paso { display: grid; grid-template-columns: 50px 1fr; padding: 22px 0; border-bottom: 1px solid rgba(255,255,255,.05); }
  .dguia-paso:last-child { border-bottom: none; }
  .dguia-n   { font-family: 'Syne',sans-serif; font-size: 12px; font-weight: 800; color: rgba(0,243,255,.3); padding-top: 2px; }
  .dguia-ttl { font-family: 'Syne',sans-serif; font-size: 16px; font-weight: 800; color: #fff; margin-bottom: 6px; }
  .dguia-txt { font-size: 13px; color: rgba(255,255,255,.4); line-height: 1.75; margin-bottom: 12px; }
  .dguia-img { width: 100%; aspect-ratio: 16/7; background: #0c0f14; border: 1px dashed rgba(255,255,255,.07); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,.12); font-size: 11px; }

  /* ── BOTONES ── */
  .dbtn { padding: 7px 14px; border-radius: 7px; font-size: 12px; font-weight: 700; cursor: pointer; border: none; font-family: 'Plus Jakarta Sans',sans-serif; transition: all .16s; white-space: nowrap; }
  .dbtn:disabled { opacity: .35; cursor: not-allowed; }
  .dbtn.cyan   { background: #00f3ff; color: #000; }
  .dbtn.cyan:not(:disabled):hover { background: #7fffff; }
  .dbtn.ghost  { background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.09); color: rgba(255,255,255,.45); }
  .dbtn.ghost:not(:disabled):hover { border-color: rgba(255,255,255,.2); color: #fff; }
  .dbtn.green  { background: #10b981; color: #fff; }
  .dbtn.green:not(:disabled):hover { background: #059669; }
  .dbtn.purple { background: rgba(168,85,247,.12); border: 1px solid rgba(168,85,247,.22); color: #a855f7; }
  .dbtn.full   { width: 100%; padding: 11px; text-align: center; border-radius: 8px; font-size: 13px; }

  /* ── MODAL ── */
  .dovl { position: fixed; inset: 0; z-index: 9000; background: rgba(0,0,0,.8); display: flex; align-items: center; justify-content: center; backdrop-filter: blur(5px); animation: fin .16s ease; }
  @keyframes fin { from{opacity:0} to{opacity:1} }
  .dmod { background: #0e1319; border: 1px solid rgba(0,243,255,.12); border-radius: 15px; padding: 28px; max-width: 400px; width: 92%; animation: sup .2s ease; }
  @keyframes sup { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  .dmod-t    { font-family: 'Syne',sans-serif; font-size: 17px; font-weight: 800; color: #fff; margin-bottom: 8px; }
  .dmod-desc { font-size: 12.5px; color: rgba(255,255,255,.4); line-height: 1.7; margin-bottom: 14px; }
  .dmod-warn { background: rgba(245,158,11,.07); border: 1px solid rgba(245,158,11,.16); border-radius: 8px; padding: 10px 12px; font-size: 11.5px; color: rgba(245,158,11,.78); line-height: 1.6; margin-bottom: 16px; }
  .dmod-in   { width: 100%; background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08); border-radius: 8px; padding: 10px 12px; color: #fff; font-size: 13px; font-family: 'Plus Jakarta Sans',sans-serif; outline: none; margin-bottom: 8px; transition: border-color .16s; }
  .dmod-in:focus { border-color: rgba(0,243,255,.3); }
  .dmod-in::placeholder { color: rgba(255,255,255,.16); }
  .dup { width: 100%; padding: 20px; border: 1px dashed rgba(255,255,255,.1); border-radius: 8px; display: flex; flex-direction: column; align-items: center; gap: 6px; background: rgba(255,255,255,.02); cursor: pointer; margin-bottom: 12px; transition: border-color .16s; color: rgba(255,255,255,.26); font-size: 12px; text-align: center; }
  .dup:hover { border-color: rgba(0,243,255,.25); color: rgba(255,255,255,.5); }
  .dup-ico { font-size: 20px; }
  .dup-progress { width:100%; height:4px; background:rgba(255,255,255,.06); border-radius:2px; margin:8px 0; overflow:hidden; }
  .dup-progress-bar { height:100%; background:linear-gradient(90deg,#00f3ff,#0066ff); border-radius:2px; transition:width .3s; }
  .dup-preview { width:100%; max-height:140px; object-fit:cover; border-radius:8px; border:1px solid rgba(0,243,255,.2); margin-bottom:8px; }
  .dmod-row { display: flex; gap: 8px; }
  .dmod-row .dbtn.full { flex: 1; }

  /* ── RESPONSIVE 768px ── */
  @media (max-width: 768px) {
    /* Ocultar navbar principal, mostrar topbar mobile */
    .navbar { display: none !important; }
    .d-topbar { display: flex; }
    .d { margin-top: 56px; }

    /* Sidebar como drawer deslizable */
    .dsb { position: fixed; top: 0; left: 0; width: 260px; height: 100vh; z-index: 1095; transform: translateX(-100%); }
    .dsb.open { transform: translateX(0); }
    .dsb-top { padding-top: 70px; }
    .dmain { margin-left: 0; }

    /* Inicio */
    .dinicio { padding: 16px 16px 50px; }
    .dstats  { grid-template-columns: repeat(2,1fr); gap: 9px; }
    .dinicio-grid { grid-template-columns: 1fr; }
    .dactivo-body { flex-direction: column; }
    .dactivo-img  { width: 100%; height: 120px; border-radius: 8px; }
    .dactivo-row  { gap: 24px; }

    /* Proyectos / catálogo — en mobile la lista y el detalle se alternan */
    .dproy  { grid-template-columns: 1fr; min-height: unset; display: flex; flex-direction: column; }
    .dlista { max-height: unset; overflow-y: auto; border-right: none; border-bottom: 1px solid rgba(255,255,255,.05); }
    .dlista.hidden-mobile { display: none; }
    .ddet.hidden-mobile   { display: none; }
    .ddet-back { display: flex; align-items: center; gap: 7px; padding: 10px 16px; font-size: 12px; font-weight: 600; color: rgba(0,243,255,.7); background: none; border: none; border-bottom: 1px solid rgba(255,255,255,.05); cursor: pointer; width: 100%; font-family: 'Plus Jakarta Sans',sans-serif; }
    .ddet-back:hover { color: #00f3ff; }
    .dproy-empty { flex: 1; display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,.2); font-size: 13px; min-height: 200px; }

    /* Detalle */
    .ddet-gal-img { aspect-ratio: 16/9; }
    .ddet-body    { padding: 14px 16px 48px; }
    .ddet-meta    { grid-template-columns: 1fr 1fr; }
    .ddet-grid    { grid-template-columns: 1fr; }
    .ddet-over    { padding: 0 16px 16px; }
    .ddet-nom     { font-size: 18px; }
    .ddet-actions { flex-direction: column; }

    /* Misiones */
    .dmis  { padding: 16px 16px 50px; }
    .dmis-card { flex-wrap: wrap; }

    /* Guía */
    .dguia { padding: 16px 16px 50px; }
    .dguia-paso { grid-template-columns: 40px 1fr; }

    /* Modal más alto en mobile */
    .dmod { padding: 22px 18px; max-height: 92vh; overflow-y: auto; }
    .dmod-row { flex-direction: column; }
  }

  /* ── RESPONSIVE 480px ── */
  @media (max-width: 480px) {
    .dinicio { padding: 12px 12px 40px; }
    .dstats  { grid-template-columns: repeat(2,1fr); gap: 8px; }
    .dstat   { padding: 11px 12px; }
    .dstat-v { font-size: 18px; }
    .dstat-l { font-size: 8px; }

    /* Stats en columna en pantallas muy pequeñas */
    .dstats  { grid-template-columns: 1fr 1fr; }

    /* Detalle */
    .ddet-meta { grid-template-columns: 1fr; }
    .ddet-over { padding: 0 12px 12px; }
    .ddet-nom  { font-size: 16px; }
    .ddet-body { padding: 12px 12px 48px; gap: 10px; }

    /* Misiones */
    .dmis-card { gap: 8px; }
    .dmis-pago { min-width: 48px; padding: 6px 8px; }
    .dmis-pago-v { font-size: 11px; }

    /* Guía */
    .dguia-paso { grid-template-columns: 32px 1fr; gap: 8px; }
    .dguia-ttl  { font-size: 14px; }
    .dguia-txt  { font-size: 12px; }

    /* Item lista */
    .ditem-img { width: 36px; height: 26px; }
    .ditem-nom { font-size: 11.5px; }

    /* Modal */
    .dmod { padding: 18px 14px; width: 98%; }
    .dmod-t { font-size: 15px; }
  }
`