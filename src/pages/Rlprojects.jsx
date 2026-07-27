import { useEffect, useState } from 'react'
import { useSiteData } from '../data/siteData'
import './Projects.css'

function Rlprojects() {
  const { rlprojects, siteSettings } = useSiteData()
  const [activeProject, setActiveProject] = useState(null)

  const settings = siteSettings.rlprojects || { title: 'Projects', intro: '' }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setActiveProject(null)
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  const handleProjectClick = (project) => {
    if (project.videoUrl || project.imageUrl) {
      setActiveProject(project)
    }
  }

  return (
    <div className="projects-page rlprojects-page">
      <div className="page-container">
        <header className="page-header">
          <h1 className="page-title">{settings.title}</h1>
          <p className="page-intro">
            {settings.intro}
          </p>
          <div className="viewport-status">
            <span>{rlprojects.length} projects</span>
          </div>
        </header>
        {rlprojects.length === 0 ? (
          <p className="page-intro" style={{ opacity: 0.7 }}>
            [ nothing here yet... check back soon ]
          </p>
        ) : (
          <div className="projects-grid">
            {rlprojects.map((project, index) => {
              const hasMedia = project.videoUrl || project.imageUrl

              return (
                <article
                  key={project.id}
                  className={`project-card ${hasMedia ? 'has-media' : ''}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => handleProjectClick(project)}
                >
                  <div className="project-media">
                    {project.videoUrl ? (
                      <video
                        src={project.videoUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="project-video"
                      />
                    ) : project.imageUrl ? (
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="project-image"
                      />
                    ) : (
                      <div className="placeholder-art">
                        <span className="placeholder-text">Coming Soon</span>
                      </div>
                    )}
                    {hasMedia && (
                      <div className="expand-overlay">
                        <svg className="expand-icon" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M21 11V3h-8l3.29 3.29-10 10L3 13v8h8l-3.29-3.29 10-10z"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="project-info">
                    <span className="project-index">[{String(index + 1).padStart(3, '0')}]</span>
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-description">{project.description}</p>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>

      {/* Project Modal */}
      {activeProject && (
        <div className="project-modal-overlay" onClick={() => setActiveProject(null)}>
          <div className="project-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setActiveProject(null)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
            <div className="modal-media-container">
              {activeProject.videoUrl ? (
                <video
                  src={activeProject.videoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                  onVolumeChange={(e) => { e.target.muted = true }}
                  className="modal-video"
                />
              ) : (
                <img
                  src={activeProject.imageUrl}
                  alt={activeProject.title}
                  className="modal-image"
                />
              )}
            </div>
            <div className="modal-info">
              <h3 className="modal-title">{activeProject.title}</h3>
              <p className="modal-description">{activeProject.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Rlprojects
