import { useNavigate } from "react-router-dom"

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');

  .footer {
    background: #000;
    border-top: 1px solid rgba(255,255,255,0.06);
    font-family: 'Space Grotesk', sans-serif;
    color: #fff;
    position: relative;
    overflow: hidden;
  }

  /* línea superior glow */
  .footer::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, #00f3ff 40%, #a855f7 70%, transparent 100%);
    opacity: 0.5;
  }

  /* ── ZONA SUPERIOR: CTA ── */
  .footer-cta {
    padding: 80px 8% 72px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 40px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    flex-wrap: wrap;
  }

  .footer-cta-left {}

  .footer-cta-tag {
    font-size: 11px;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: rgba(0,243,255,0.6);
    margin-bottom: 12px;
    font-weight: 600;
  }

  .footer-cta-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(28px, 3.5vw, 48px);
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -1px;
  }

  .footer-cta-title span {
    color: #00f3ff;
  }

  .footer-cta-btn {
    padding: 16px 40px;
    background: #00f3ff;
    border: none;
    border-radius: 12px;
    color: #000;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    font-family: 'Space Grotesk', sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    transition: all 0.3s ease;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .footer-cta-btn:hover {
    background: #fff;
    transform: translateY(-2px);
    box-shadow: 0 12px 30px rgba(0,243,255,0.3);
  }

  /* ── ZONA PRINCIPAL: COLUMNAS ── */
  .footer-main {
    padding: 72px 8% 64px;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 48px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }

  /* Columna logo */
  .footer-brand {}

  .footer-logo {
    font-family: 'Syne', sans-serif;
    font-size: 36px;
    font-weight: 800;
    color: #fff;
    letter-spacing: -1px;
    margin-bottom: 6px;
    line-height: 1;
  }

  .footer-logo span {
    color: #00f3ff;
  }

  .footer-tagline {
    font-size: 13px;
    color: rgba(255,255,255,0.3);
    line-height: 1.6;
    margin-bottom: 32px;
    max-width: 260px;
  }

  .footer-social {
    display: flex;
    gap: 12px;
  }

  .footer-social-btn {
    width: 42px; height: 42px;
    border-radius: 10px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.25s ease;
    text-decoration: none;
    color: rgba(255,255,255,0.5);
    font-size: 16px;
  }

  .footer-social-btn:hover {
    background: rgba(0,243,255,0.08);
    border-color: rgba(0,243,255,0.3);
    color: #00f3ff;
    transform: translateY(-2px);
  }

  /* Columnas nav */
  .footer-col {}

  .footer-col-title {
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.25);
    font-weight: 600;
    margin-bottom: 24px;
  }

  .footer-links {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .footer-link {
    font-size: 14px;
    color: rgba(255,255,255,0.45);
    cursor: pointer;
    transition: color 0.2s ease;
    background: none;
    border: none;
    padding: 0;
    text-align: left;
    font-family: 'Space Grotesk', sans-serif;
    width: fit-content;
    text-decoration: none;
  }

  .footer-link:hover {
    color: #fff;
  }

  .footer-link.highlight {
    color: #00f3ff;
  }

  .footer-link.highlight:hover {
    color: #fff;
  }

  /* ── ZONA INFERIOR ── */
  .footer-bottom {
    padding: 24px 8%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    flex-wrap: wrap;
  }

  .footer-copy {
    font-size: 13px;
    color: rgba(255,255,255,0.2);
  }

  .footer-copy span {
    color: rgba(0,243,255,0.4);
  }

  .footer-made {
    font-size: 12px;
    color: rgba(255,255,255,0.15);
    letter-spacing: 0.5px;
  }

  /* ── BG DECORATIVO ── */
  .footer-bg-text {
    position: absolute;
    bottom: -10px;
    right: -1%;
    font-family: 'Syne', sans-serif;
    font-size: clamp(80px, 12vw, 160px);
    font-weight: 800;
    color: transparent;
    -webkit-text-stroke: 1px rgba(0,243,255,0.04);
    user-select: none;
    pointer-events: none;
    line-height: 1;
    white-space: nowrap;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 960px) {
    .footer-main {
      grid-template-columns: 1fr 1fr;
    }
    .footer-brand {
      grid-column: 1 / -1;
    }
  }

  @media (max-width: 600px) {
    .footer-cta {
      flex-direction: column;
      align-items: flex-start;
    }
    .footer-main {
      grid-template-columns: 1fr 1fr;
      gap: 40px;
    }
    .footer-bottom {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
  }
`

// Iconos SVG simples inline
const TikTokIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
  </svg>
)

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

function Footer() {
  const navigate = useNavigate()

  return (
    <footer className="footer">
      <style>{styles}</style>
      <div className="footer-bg-text">SYNKRO</div>

      {/* CTA strip */}
        <div className="footer-cta">
        <div className="footer-cta-left">
            <p className="footer-cta-tag">Tu negocio online</p>
            <h3 className="footer-cta-title">
            ¿Listo para vender<br />
            <span>por internet?</span>
            </h3>
        </div>
        <button className="footer-cta-btn" onClick={() => navigate('/solicitud')}>
            Quiero mi web →
        </button>
        </div>

      {/* Columnas principales */}
      <div className="footer-main">

        {/* Marca */}
        <div className="footer-brand">
          <div className="footer-logo">Syn<span>kro</span></div>
          <p className="footer-tagline">
            Creamos tiendas online para negocios hispanohablantes.
            Tú vendes, nosotros construimos.
          </p>
          <div className="footer-social">
            <a
              href="https://www.tiktok.com/@synkrodev0?_r=1&_t=ZS-94bUrhIX4jc"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-btn"
              title="TikTok"
            >
              <TikTokIcon />
            </a>
            <a
              href="https://wa.me/51990502491"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-btn"
              title="WhatsApp"
            >
              <WhatsAppIcon />
            </a>
          </div>
        </div>

        {/* Navegación */}
        <div className="footer-col">
          <p className="footer-col-title">Páginas</p>
          <div className="footer-links">
            <button className="footer-link" onClick={() => navigate('/')}>Inicio</button>
            <button className="footer-link" onClick={() => navigate('/planes')}>Planes</button>
            <button className="footer-link" onClick={() => navigate('/nosotros')}>Nosotros</button>
            <button className="footer-link" onClick={() => navigate('/vendedores')}>Vendedores</button>
          </div>
        </div>

        {/* Cuenta */}
        <div className="footer-col">
          <p className="footer-col-title">Cuenta</p>
          <div className="footer-links">
            <button className="footer-link" onClick={() => navigate('/login')}>Iniciar sesión</button>
            <button className="footer-link highlight" onClick={() => navigate('/register')}>Registrarse</button>
            <button className="footer-link" onClick={() => navigate('/dashboard')}>Dashboard</button>
            <button className="footer-link" onClick={() => navigate('/retos')}>Proyectos</button>
          </div>
        </div>

        {/* Contacto */}
        <div className="footer-col">
          <p className="footer-col-title">Contacto</p>
          <div className="footer-links">
            <a
              href="https://wa.me/51990502491"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              WhatsApp
            </a>
            <a
              href="mailto:nexuscorporation543@gmail.com"
              className="footer-link"
            >
              Email
            </a>
            <button className="footer-link" onClick={() => navigate('/solicitud')}>
              Solicitar web
            </button>
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <p className="footer-copy">
          © 2025 <span>Synkro</span>. Todos los derechos reservados.
        </p>
        <p className="footer-made">
          Hecho para negocios que quieren crecer online.
        </p>
      </div>
    </footer>
  )
}

export default Footer