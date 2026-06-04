import { useEffect, useState } from 'react'
import { useSiteData } from '../data/siteData'
import './Music.css'

// Extract YouTube video ID from various URL formats
function getYouTubeId(url) {
  if (!url) return null
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

function Music() {
  const { songs, siteSettings } = useSiteData()
  const [activeVideo, setActiveVideo] = useState(null)

  // Filter out songs with audioUrl (those are background music for the record player)
  const displaySongs = songs.filter(s => !s.audioUrl)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setActiveVideo(null)
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  const handleSongClick = (song) => {
    if (song.youtubeUrl) {
      setActiveVideo(song)
    }
  }

  return (
    <div className="music-page">
      <div className="page-container">
        <header className="page-header">
          <h1 className="page-title">{siteSettings.music.title}</h1>
          <p className="page-intro">
            {siteSettings.music.intro}
          </p>
          <div className="track-count" aria-hidden="true">
            {displaySongs.length} tracks
          </div>
        </header>
        <div className="songs-grid">
          {displaySongs.map((song, index) => {
            const videoId = getYouTubeId(song.youtubeUrl)
            const thumbnailUrl = videoId
              ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
              : null

            return (
              <div
                key={song.id}
                className={`song-card ${videoId ? 'has-video' : ''}`}
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => handleSongClick(song)}
              >
                <div className="song-thumbnail">
                  {thumbnailUrl ? (
                    <img src={thumbnailUrl} alt={song.title} />
                  ) : (
                    <div className="thumbnail-placeholder">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                      </svg>
                    </div>
                  )}
                  {videoId && (
                    <div className="play-overlay">
                      <svg className="play-button" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  )}
                </div>
                <div className="song-details">
                  <span className="track-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  <div className="song-text">
                    <span className="song-title">{song.title}</span>
                    <span className="song-artist">{song.artist}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div className="video-modal-overlay" onClick={() => setActiveVideo(null)}>
          <div className="video-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setActiveVideo(null)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
            <div className="modal-video-container">
              <iframe
                src={`https://www.youtube.com/embed/${getYouTubeId(activeVideo.youtubeUrl)}?autoplay=1`}
                title={activeVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="modal-info">
              <h3 className="modal-title">{activeVideo.title}</h3>
              <p className="modal-artist">{activeVideo.artist}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Music
