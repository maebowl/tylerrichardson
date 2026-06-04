import { useEffect, useState } from 'react'
import { useTheme } from './ThemeProvider'
import './ThemeEffects.css'

function Snowflakes() {
  const [flakes, setFlakes] = useState([])

  useEffect(() => {
    const snowflakeChars = ['❄', '❅', '❆', '✻', '✼']
    const createFlakes = () => {
      const newFlakes = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        char: snowflakeChars[Math.floor(Math.random() * snowflakeChars.length)],
        left: Math.random() * 100,
        duration: 8 + Math.random() * 12,
        delay: Math.random() * 10,
        size: 0.6 + Math.random() * 0.8,
      }))
      setFlakes(newFlakes)
    }
    createFlakes()
  }, [])

  return (
    <>
      {flakes.map((flake) => (
        <span
          key={flake.id}
          className="snowflake"
          style={{
            left: `${flake.left}%`,
            animationDuration: `${flake.duration}s`,
            animationDelay: `${flake.delay}s`,
            fontSize: `${flake.size}rem`,
          }}
        >
          {flake.char}
        </span>
      ))}
    </>
  )
}

function Confetti() {
  const [pieces, setPieces] = useState([])

  useEffect(() => {
    const colors = ['#ff69b4', '#ffd700', '#87ceeb', '#98fb98', '#dda0dd', '#f0e68c']
    const createConfetti = () => {
      const newPieces = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        color: colors[Math.floor(Math.random() * colors.length)],
        left: Math.random() * 100,
        duration: 6 + Math.random() * 8,
        delay: Math.random() * 8,
        size: 6 + Math.random() * 8,
        shape: Math.random() > 0.5 ? 'square' : 'circle',
      }))
      setPieces(newPieces)
    }
    createConfetti()
  }, [])

  return (
    <>
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="confetti"
          style={{
            left: `${piece.left}%`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            borderRadius: piece.shape === 'circle' ? '50%' : '2px',
            animationDuration: `${piece.duration}s`,
            animationDelay: `${piece.delay}s`,
          }}
        />
      ))}
    </>
  )
}

function ThemeBadge({ theme, themes }) {
  if (theme === 'default') return null

  const themeNames = {
    christmas: 'Holiday Mode',
    halloween: 'Spooky Mode',
    birthday: "Tyler's Birthday!",
    pride: 'Pride Month',
  }

  return (
    <div className="theme-badge">
      {theme === 'pride' ? (
        <>
          <span className="pride-flag-mini" aria-hidden="true"></span>
          <span className="pride-intersex" aria-hidden="true" title="intersex"></span>
        </>
      ) : (
        <span className="theme-badge-icon"></span>
      )}
      <span>{themeNames[theme] || themes[theme]?.name}</span>
    </div>
  )
}

function ThemeEffects() {
  const { currentTheme, themes } = useTheme()

  return (
    <>
      {currentTheme === 'christmas' && <Snowflakes />}
      {currentTheme === 'birthday' && <Confetti />}
      <ThemeBadge theme={currentTheme} themes={themes} />
    </>
  )
}

export default ThemeEffects
