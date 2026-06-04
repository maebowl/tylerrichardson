import { useEffect, useState } from 'react'
import { useSiteData } from '../data/siteData'
import './Games.css'

function Games() {
  const { games, siteSettings } = useSiteData()
  const [activeGame, setActiveGame] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setActiveGame(null)
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  return (
    <div className="games-page">
      <div className="page-container">
        <header className="page-header">
          <h1 className="page-title">{siteSettings.games?.title || 'Games'}</h1>
          <p className="page-intro">{siteSettings.games?.intro || 'Some of my favorite games.'}</p>
          <div className="arcade-hud" aria-hidden="true">
            <span className="hud-level">{games.length} games</span>
          </div>
        </header>
        <div className="games-grid">
          {games.length === 0 ? (
            <p className="no-games">[ no games found... check back later ]</p>
          ) : (
            games.map((game, index) => (
              <div
                key={game.id}
                className="game-card"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setActiveGame(game)}
              >
                <div className="game-cover">
                  {game.imageUrl ? (
                    <img src={game.imageUrl} alt={game.title} className="game-cover-img" />
                  ) : (
                    <div className="game-cover-placeholder">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="game-icon">
                        <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                      </svg>
                    </div>
                  )}
                </div>
                <div className="game-info">
                  <h3 className="game-title">{game.title}</h3>
                  {game.description && <p className="game-description">{game.description}</p>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {activeGame && (
        <div className="game-modal-overlay" onClick={() => setActiveGame(null)}>
          <div className="game-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setActiveGame(null)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
            <div className="modal-game-content">
              {activeGame.imageUrl && (
                <img src={activeGame.imageUrl} alt={activeGame.title} className="modal-game-cover" />
              )}
              <div className="modal-game-info">
                <h2 className="modal-game-title">{activeGame.title}</h2>
                {activeGame.description && <p className="modal-game-description">{activeGame.description}</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Games
