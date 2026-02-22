import { useEffect, useState } from 'react'
import { useSiteData } from '../data/siteData'
import './Contact.css'

const socialIcons = {
  discord: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="social-icon">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="social-icon">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  twitch: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="social-icon">
      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>
    </svg>
  ),
  letterboxd: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="social-icon">
      <path d="M8.224 14.352a4.447 4.447 0 0 1-3.775 2.092C1.992 16.444 0 14.454 0 12s1.992-4.444 4.45-4.444c1.592 0 2.988.836 3.774 2.092-.483.74-.764 1.622-.764 2.571s.281 1.831.764 2.571zm3.776-6.444c2.457 0 4.449 1.99 4.449 4.444s-1.992 4.444-4.449 4.444-4.449-1.99-4.449-4.444 1.992-4.444 4.449-4.444zm7.55 0c-1.592 0-2.988.836-3.775 2.092.484.74.764 1.622.764 2.571s-.28 1.831-.764 2.571a4.447 4.447 0 0 0 3.775 2.092c2.458 0 4.45-1.99 4.45-4.444s-1.992-4.444-4.45-4.444z"/>
    </svg>
  ),
  steam: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="social-icon">
      <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z"/>
    </svg>
  ),
  characterhub: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="social-icon">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
    </svg>
  ),
  tumblr: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="social-icon">
      <path d="M14.563 24c-5.093 0-7.031-3.756-7.031-6.411V9.747H5.116V6.648c3.63-1.313 4.512-4.596 4.71-6.469C9.84.051 9.941 0 9.999 0h3.517v6.114h4.801v3.633h-4.82v7.47c.016 1.001.375 2.371 2.207 2.371h.09c.631-.02 1.486-.205 1.936-.419l1.156 3.425c-.436.636-2.4 1.374-4.156 1.404h-.166z"/>
    </svg>
  ),
}

// Default taglines as fallback
const defaultTaglines = {
  discord: "Let's chat!",
  youtube: "Watch me create",
  twitch: "Catch me live",
  letterboxd: "Movie opinions",
  steam: "My games",
  characterhub: "My characters",
  tumblr: "My blog",
}

function Contact() {
  const { socials, siteSettings } = useSiteData()
  const [hoveredCard, setHoveredCard] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Get taglines from settings or use defaults
  const taglines = siteSettings.contact.taglines || defaultTaglines
  const getTagline = (id) => taglines[id] || defaultTaglines[id] || "Find me here"

  // Get featured social (first one, or discord if exists)
  const featuredSocial = socials.find(s => s.id === 'discord') || socials[0]
  const otherSocials = socials.filter(s => s.id !== featuredSocial?.id)

  return (
    <div className="contact-page">
      <div className="page-container">
        <header className="page-header">
          <h1 className="page-title">{siteSettings.contact.title}</h1>
          <p className="page-intro">
            {siteSettings.contact.intro}
          </p>
        </header>

        {/* Featured Card */}
        {featuredSocial && (
          <a
            href={featuredSocial.url}
            className={`featured-social social-${featuredSocial.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="featured-glow"></div>
            <div className="featured-content">
              <div className="featured-icon-wrapper">
                {socialIcons[featuredSocial.id]}
              </div>
              <div className="featured-info">
                <span className="featured-tagline">{getTagline(featuredSocial.id)}</span>
                <span className="featured-name">{featuredSocial.name}</span>
                <span className="featured-handle">{featuredSocial.handle}</span>
              </div>
            </div>
            <div className="featured-cta">
              <span>Connect</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          </a>
        )}

        {/* Other Socials */}
        <div className="socials-grid">
          {otherSocials.map((social, index) => (
            <a
              key={social.id}
              href={social.url}
              className={`social-card social-${social.id} ${hoveredCard === social.id ? 'hovered' : ''}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ animationDelay: `${(index + 1) * 0.1}s` }}
              onMouseEnter={() => setHoveredCard(social.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="card-bg"></div>
              <div className="card-content">
                <div className="social-icon-wrapper">
                  {socialIcons[social.id]}
                </div>
                <div className="social-info">
                  <span className="social-tagline">{getTagline(social.id)}</span>
                  <span className="social-name">{social.name}</span>
                  <span className="social-handle">{social.handle}</span>
                </div>
                <div className="social-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17L17 7M17 7H7M17 7v10"/>
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Badges Section */}
        {siteSettings.contact.badges && siteSettings.contact.badges.length > 0 && (
          <div className="badges-section">
            <div className="badges-grid">
              {siteSettings.contact.badges.map((badge, index) => (
                badge.url ? (
                  <a
                    key={index}
                    href={badge.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="badge-link"
                  >
                    <img src={badge.image} alt={badge.alt || 'Badge'} className="badge-img" />
                  </a>
                ) : (
                  <img key={index} src={badge.image} alt={badge.alt || 'Badge'} className="badge-img" />
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Contact
