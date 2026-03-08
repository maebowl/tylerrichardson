import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useSiteData } from '../data/siteData'
import './BlogPost.css'

function BlogPost() {
  const { slug } = useParams()
  const { posts } = useSiteData()
  const post = posts.find(p => p.slug === slug)
  const [activeMedia, setActiveMedia] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setActiveMedia(null)
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  if (!post) {
    return (
      <section className="blog-post-page">
        <div className="section-container">
          <h1 className="page-title">Post Not Found</h1>
          <p className="page-intro">Sorry, that post doesn't exist.</p>
          <Link to="/blog" className="back-link">Back to Blog</Link>
        </div>
      </section>
    )
  }

  // Support both old format (imageUrl/videoUrl) and new format (media array)
  const getMedia = () => {
    if (post.media && post.media.length > 0) return post.media
    const media = []
    if (post.imageUrl) media.push({ type: 'image', url: post.imageUrl })
    if (post.videoUrl) media.push({ type: 'video', url: post.videoUrl })
    return media
  }

  const media = getMedia()

  return (
    <section className="blog-post-page">
      <div className="section-container">
        <Link to="/blog" className="back-link">cd ../blog</Link>
        <div className="post-terminal-window">
          <div className="post-titlebar" aria-hidden="true">
            <div className="post-dots">
              <span className="dot dot-red"></span>
              <span className="dot dot-yellow"></span>
              <span className="dot dot-green"></span>
            </div>
            <span className="post-titlebar-text">{post.slug}.md — vim</span>
            <div className="post-titlebar-spacer"></div>
          </div>
          <article className="post-content">
            <header className="post-header">
              <div className="post-meta-line" aria-hidden="true">
                <span className="meta-tag">cat</span> ~/blog/{post.slug}.md
              </div>
              <time className="post-date">
                {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </time>
              <h1 className="post-title">{post.title}</h1>
            </header>

          {media.length > 0 && (
            <div className="post-media-gallery">
              {media.map((item, index) => (
                <div
                  key={index}
                  className="gallery-item"
                  onClick={() => setActiveMedia(item)}
                >
                  {item.type === 'video' ? (
                    <video
                      src={item.url}
                      className="gallery-video"
                      muted
                      loop
                      playsInline
                      autoPlay
                    />
                  ) : (
                    <img
                      src={item.url}
                      alt={`${post.title} - ${index + 1}`}
                      className="gallery-image"
                    />
                  )}
                  <div className="gallery-overlay">
                    <svg className="expand-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 11V3h-8l3.29 3.29-10 10L3 13v8h8l-3.29-3.29 10-10z"/>
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div
            className="post-body"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
        </div>
      </div>

      {/* Media Modal */}
      {activeMedia && (
        <div className="media-modal-overlay" onClick={() => setActiveMedia(null)}>
          <div className="media-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setActiveMedia(null)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
            <div className="modal-media-container">
              {activeMedia.type === 'video' ? (
                <video
                  src={activeMedia.url}
                  controls
                  autoPlay
                  className="modal-video"
                />
              ) : (
                <img
                  src={activeMedia.url}
                  alt={post.title}
                  className="modal-image"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default BlogPost
