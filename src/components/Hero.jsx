import { useSiteData } from '../data/siteData'
import './Hero.css'

function Hero() {
  const { siteSettings } = useSiteData()
  const { greeting, name, subtitle } = siteSettings.hero

  return (
    <section id="about" className="hero">
      <div className="hero-content">
        <div className="hero-ascii-border top">
          ╔══════════════════════════════════════════╗
        </div>
        <div className="hero-text">
          <p className="hero-greeting">{greeting}</p>
          <h1 className="hero-title">{name}<span className="blink-cursor">_</span></h1>
          <p className="hero-subtitle">{subtitle}<span className="blink-cursor">_</span></p>
        </div>
        <div className="hero-ascii-border bottom">
          ╚══════════════════════════════════════════╝
        </div>
        <div className="hero-status-bar">
          <span className="status-item">STATUS: ONLINE</span>
          <span className="status-item">LOCATION: THE INTERNET</span>
          <span className="status-item blink-slow">● LIVE</span>
        </div>
      </div>
    </section>
  )
}

export default Hero
