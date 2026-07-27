import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getPageIconKey, PAGE_ICONS, makeFaviconDataUri } from '../pageIcons'
import './Navbar.css'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const location = useLocation()
  const isHome = location.pathname === '/'
  const iconKey = getPageIconKey(location.pathname)
  const pageIcon = PAGE_ICONS[iconKey]

  // Swap the browser-tab favicon to match the current page
  useEffect(() => {
    let link = document.querySelector("link[rel='icon']")
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.head.appendChild(link)
    }
    link.setAttribute('type', 'image/svg+xml')
    link.setAttribute('href', makeFaviconDataUri(iconKey))
  }, [iconKey])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHidden(true)
      } else {
        setHidden(false)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  const handleLogoClick = (e) => {
    closeMenu()
    if (isHome) {
      e.preventDefault()
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  return (
    <>
      <div
        className={`menu-overlay ${menuOpen ? 'open' : ''}`}
        onClick={closeMenu}
      />
      <nav className={`navbar ${hidden ? 'navbar-hidden' : ''}`}>
        <div className="navbar-content">
          <Link to="/" className="nav-logo" onClick={handleLogoClick} aria-label="Home" title={pageIcon.label}>
            <svg
              className="nav-logo-icon"
              viewBox="0 0 24 24"
              width="28"
              height="28"
              aria-hidden="true"
              style={{ color: pageIcon.color }}
            >
              <path d={pageIcon.path} fill="currentColor" fillRule={pageIcon.fillRule || 'nonzero'} />
            </svg>
          </Link>
          <button
            className={`menu-toggle ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
          <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <li><Link to="/projects" onClick={closeMenu} className={isActive('/projects') ? 'active' : ''}>Blender</Link></li>
            <li><Link to="/rlprojects" onClick={closeMenu} className={isActive('/rlprojects') ? 'active' : ''}>Projects</Link></li>
            <li><Link to="/games" onClick={closeMenu} className={isActive('/games') ? 'active' : ''}>Games</Link></li>
            <li><Link to="/music" onClick={closeMenu} className={isActive('/music') ? 'active' : ''}>Music</Link></li>
            <li><Link to="/contact" onClick={closeMenu} className={isActive('/contact') ? 'active' : ''}>Contact</Link></li>
          </ul>
        </div>
      </nav>
    </>
  )
}

export default Navbar
