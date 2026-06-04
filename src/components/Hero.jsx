import { Link } from 'react-router-dom'
import { useSiteData } from '../data/siteData'
import './Hero.css'

const quickLinks = [
  { label: 'Blender', to: '/projects' },
  { label: 'Games', to: '/games' },
  { label: 'Music', to: '/music' },
  { label: 'Contact', to: '/contact' },
  { label: 'Blog', to: '/blog' },
]

function Hero() {
  const { siteSettings } = useSiteData()
  const { name, subtitle, intro, currently } = siteSettings.hero

  return (
    <section id="about" className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">{name}</h1>
          <p className="hero-subtitle">{subtitle}</p>
          {intro && <p className="hero-intro">{intro}</p>}
          <nav className="hero-links" aria-label="Quick links">
            {quickLinks.map((link) => (
              <Link key={link.to} to={link.to} className="hero-link">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {currently && currently.length > 0 && (
          <aside className="hero-currently" aria-label="What I'm currently into">
            <span className="currently-heading">// currently</span>
            <ul className="currently-list">
              {currently.map((item, i) => (
                <li key={i} className="currently-item">
                  <span className="currently-label">{item.label}</span>
                  <span className="currently-value">{item.value}</span>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </div>
    </section>
  )
}

export default Hero
