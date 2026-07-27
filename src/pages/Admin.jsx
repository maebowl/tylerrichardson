import { useState, useEffect, useRef } from 'react'
import { useSiteData } from '../data/siteData'
import { saveToGitHub, uploadFileToGitHub } from '../services/github'
import { useTheme } from '../components/ThemeProvider'
import './Admin.css'

const ADMIN_PASSWORD = 'ilovelegobatman'
const AUTH_KEY = 'tyler-admin-auth'
const GITHUB_TOKEN_KEY = 'tyler-github-token'
const RAWG_KEY = 'tyler-rawg-key'

function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('settings')
  const [githubToken, setGithubToken] = useState('')
  const [rawgKey, setRawgKey] = useState('')
  const [showTokenInput, setShowTokenInput] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState('')

  const {
    siteSettings, games, projects, rlprojects, songs, socials,
    updateSiteSettings,
    updateGames, addGame, updateGame, deleteGame,
    updateProjects, addProject, updateProject, deleteProject,
    updateRlprojects, addRlproject, updateRlproject, deleteRlproject,
    updateSongs, addSong, updateSong, deleteSong,
    updateSocials, updateSocial, resetToDefaults
  } = useSiteData()

  useEffect(() => {
    const auth = sessionStorage.getItem(AUTH_KEY)
    if (auth === 'true') {
      setIsAuthenticated(true)
    }
    const savedToken = localStorage.getItem(GITHUB_TOKEN_KEY)
    if (savedToken) {
      setGithubToken(savedToken)
    }
    const savedRawg = localStorage.getItem(RAWG_KEY)
    if (savedRawg) {
      setRawgKey(savedRawg)
    }
  }, [])

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      sessionStorage.setItem(AUTH_KEY, 'true')
      setError('')
    } else {
      setError('Incorrect password')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem(AUTH_KEY)
  }

  const handleSaveToken = () => {
    localStorage.setItem(GITHUB_TOKEN_KEY, githubToken)
    localStorage.setItem(RAWG_KEY, rawgKey)
    setShowTokenInput(false)
    setSaveStatus('Tokens saved!')
    setTimeout(() => setSaveStatus(''), 3000)
  }

  const handleSaveToGitHub = async () => {
    if (!githubToken) {
      setShowTokenInput(true)
      return
    }

    setSaving(true)
    setSaveStatus('')

    try {
      await saveToGitHub({ siteSettings, games, projects, rlprojects, songs, socials }, githubToken)
      setSaveStatus('Saved to GitHub! Site will rebuild shortly.')
    } catch (err) {
      setSaveStatus(`Error: ${err.message}`)
    } finally {
      setSaving(false)
      setTimeout(() => setSaveStatus(''), 5000)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-page">
        <div className="admin-login">
          <h1>Admin</h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoFocus
            />
            <button type="submit">Login</button>
          </form>
          {error && <p className="error">{error}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <div className="admin-actions">
            <button
              onClick={handleSaveToGitHub}
              className="btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save to GitHub'}
            </button>
            <button onClick={() => setShowTokenInput(!showTokenInput)} className="btn-secondary">
              {githubToken ? 'Change Tokens' : 'Set Tokens'}
            </button>
            <button onClick={resetToDefaults} className="btn-secondary">Reset to Defaults</button>
            <button onClick={handleLogout} className="btn-secondary">Logout</button>
          </div>
        </div>

        {showTokenInput && (
          <div className="token-input-section">
            <p>GitHub Personal Access Token (needs repo scope):</p>
            <div className="token-input-row">
              <input
                type="password"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxx"
              />
            </div>
            <p style={{ marginTop: '1rem' }}>RAWG API Key (for game search — get one at rawg.io/apidocs):</p>
            <div className="token-input-row">
              <input
                type="password"
                value={rawgKey}
                onChange={(e) => setRawgKey(e.target.value)}
                placeholder="RAWG API key"
              />
            </div>
            <button onClick={handleSaveToken} className="btn-primary" style={{ marginTop: '1rem' }}>Save Tokens</button>
          </div>
        )}

        {saveStatus && (
          <div className={`save-status ${saveStatus.includes('Error') ? 'error' : 'success'}`}>
            {saveStatus}
          </div>
        )}

        <div className="admin-tabs">
          <button
            className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Site Settings
          </button>
          <button
            className={`tab ${activeTab === 'games' ? 'active' : ''}`}
            onClick={() => setActiveTab('games')}
          >
            Games
          </button>
          <button
            className={`tab ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            Blender
          </button>
          <button
            className={`tab ${activeTab === 'rlprojects' ? 'active' : ''}`}
            onClick={() => setActiveTab('rlprojects')}
          >
            Projects
          </button>
          <button
            className={`tab ${activeTab === 'songs' ? 'active' : ''}`}
            onClick={() => setActiveTab('songs')}
          >
            Songs
          </button>
          <button
            className={`tab ${activeTab === 'socials' ? 'active' : ''}`}
            onClick={() => setActiveTab('socials')}
          >
            Contact
          </button>
          <button
            className={`tab ${activeTab === 'badges' ? 'active' : ''}`}
            onClick={() => setActiveTab('badges')}
          >
            Badges
          </button>
          <button
            className={`tab ${activeTab === 'themes' ? 'active' : ''}`}
            onClick={() => setActiveTab('themes')}
          >
            Themes
          </button>
        </div>

        <div className="admin-content">
          {activeTab === 'settings' && (
            <SiteSettingsManager siteSettings={siteSettings} updateSiteSettings={updateSiteSettings} />
          )}
          {activeTab === 'games' && (
            <GamesManager games={games} addGame={addGame} updateGame={updateGame} deleteGame={deleteGame} updateGames={updateGames} githubToken={githubToken} rawgKey={rawgKey} />
          )}
          {activeTab === 'projects' && (
            <ProjectsManager projects={projects} addProject={addProject} updateProject={updateProject} deleteProject={deleteProject} updateProjects={updateProjects} githubToken={githubToken} />
          )}
          {activeTab === 'rlprojects' && (
            <RlprojectsManager rlprojects={rlprojects} addRlproject={addRlproject} updateRlproject={updateRlproject} deleteRlproject={deleteRlproject} updateRlprojects={updateRlprojects} githubToken={githubToken} />
          )}
          {activeTab === 'songs' && (
            <SongsManager songs={songs} addSong={addSong} updateSong={updateSong} deleteSong={deleteSong} updateSongs={updateSongs} githubToken={githubToken} />
          )}
          {activeTab === 'socials' && (
            <SocialsManager socials={socials} updateSocial={updateSocial} updateSocials={updateSocials} />
          )}
          {activeTab === 'badges' && (
            <BadgesManager siteSettings={siteSettings} updateSiteSettings={updateSiteSettings} githubToken={githubToken} />
          )}
          {activeTab === 'themes' && (
            <ThemeManager />
          )}
        </div>
      </div>
    </div>
  )
}

function FileUpload({ onUpload, accept, label, githubToken }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!githubToken) {
      setError('Please set your GitHub token first')
      return
    }

    setUploading(true)
    setError('')

    try {
      const url = await uploadFileToGitHub(file, githubToken)
      onUpload(url)
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="file-upload">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        disabled={uploading}
        id={`file-${label}`}
      />
      <label htmlFor={`file-${label}`} className={`file-upload-btn ${uploading ? 'uploading' : ''}`}>
        {uploading ? 'Uploading...' : label}
      </label>
      {error && <span className="file-upload-error">{error}</span>}
    </div>
  )
}

function SiteSettingsManager({ siteSettings, updateSiteSettings }) {
  const currently = siteSettings.hero.currently || []

  const updateCurrently = (index, field, value) => {
    const next = currently.map((it, i) => (i === index ? { ...it, [field]: value } : it))
    updateSiteSettings('hero', { currently: next })
  }
  const addCurrently = () => updateSiteSettings('hero', { currently: [...currently, { label: '', value: '' }] })
  const removeCurrently = (index) => updateSiteSettings('hero', { currently: currently.filter((_, i) => i !== index) })

  return (
    <div className="manager">
      <h2>Site Settings</h2>
      <p className="manager-note">Customize page titles, subtitles, and intro text.</p>

      <div className="settings-section">
        <h3>Home Page (Hero)</h3>
        <div className="settings-fields">
          <label>
            <span>Name</span>
            <input
              value={siteSettings.hero.name}
              onChange={(e) => updateSiteSettings('hero', { name: e.target.value })}
              placeholder="Your Name"
            />
          </label>
          <label>
            <span>Subtitle</span>
            <input
              value={siteSettings.hero.subtitle}
              onChange={(e) => updateSiteSettings('hero', { subtitle: e.target.value })}
              placeholder="Creative developer & 3D artist"
            />
          </label>
          <label>
            <span>Intro</span>
            <textarea
              value={siteSettings.hero.intro || ''}
              onChange={(e) => updateSiteSettings('hero', { intro: e.target.value })}
              placeholder="A short intro in your voice..."
              rows={3}
            />
          </label>
        </div>

        <h4 className="subsection-title">Currently Into</h4>
        <p className="manager-note">The little "currently" panel on the home page. The label is the small grey text (e.g. "playing"); the value is what shows below it.</p>
        <div className="settings-fields">
          {currently.map((item, index) => (
            <div key={index} className="currently-edit-row">
              <input
                value={item.label}
                onChange={(e) => updateCurrently(index, 'label', e.target.value)}
                placeholder="playing"
              />
              <input
                value={item.value}
                onChange={(e) => updateCurrently(index, 'value', e.target.value)}
                placeholder="Hollow Knight: Silksong"
              />
              <button type="button" className="btn-remove" onClick={() => removeCurrently(index)}>×</button>
            </div>
          ))}
          <button type="button" className="btn-secondary" onClick={addCurrently}>+ Add row</button>
        </div>
      </div>

      <div className="settings-section">
        <h3>Projects Page</h3>
        <div className="settings-fields">
          <label>
            <span>Title</span>
            <input
              value={siteSettings.projects.title}
              onChange={(e) => updateSiteSettings('projects', { title: e.target.value })}
              placeholder="Projects"
            />
          </label>
          <label>
            <span>Intro Text</span>
            <textarea
              value={siteSettings.projects.intro}
              onChange={(e) => updateSiteSettings('projects', { intro: e.target.value })}
              placeholder="Page introduction..."
              rows={2}
            />
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h3>Music Page</h3>
        <div className="settings-fields">
          <label>
            <span>Title</span>
            <input
              value={siteSettings.music.title}
              onChange={(e) => updateSiteSettings('music', { title: e.target.value })}
              placeholder="Music"
            />
          </label>
          <label>
            <span>Intro Text</span>
            <textarea
              value={siteSettings.music.intro}
              onChange={(e) => updateSiteSettings('music', { intro: e.target.value })}
              placeholder="Page introduction..."
              rows={2}
            />
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h3>Games Page</h3>
        <div className="settings-fields">
          <label>
            <span>Title</span>
            <input
              value={siteSettings.games?.title || ''}
              onChange={(e) => updateSiteSettings('games', { title: e.target.value })}
              placeholder="Games"
            />
          </label>
          <label>
            <span>Intro Text</span>
            <textarea
              value={siteSettings.games?.intro || ''}
              onChange={(e) => updateSiteSettings('games', { intro: e.target.value })}
              placeholder="Page introduction..."
              rows={2}
            />
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h3>Contact Page</h3>
        <div className="settings-fields">
          <label>
            <span>Title</span>
            <input
              value={siteSettings.contact.title}
              onChange={(e) => updateSiteSettings('contact', { title: e.target.value })}
              placeholder="Contact"
            />
          </label>
          <label>
            <span>Intro Text</span>
            <textarea
              value={siteSettings.contact.intro}
              onChange={(e) => updateSiteSettings('contact', { intro: e.target.value })}
              placeholder="Page introduction..."
              rows={2}
            />
          </label>
        </div>
        <h4 className="subsection-title">Social Taglines</h4>
        <p className="manager-note">Customize the tagline shown above each social link.</p>
        <div className="settings-fields taglines-grid">
          {Object.entries(siteSettings.contact.taglines || {}).map(([id, tagline]) => (
            <label key={id}>
              <span>{id}</span>
              <input
                value={tagline}
                onChange={(e) => updateSiteSettings('contact', {
                  taglines: { ...siteSettings.contact.taglines, [id]: e.target.value }
                })}
                placeholder={`Tagline for ${id}`}
              />
            </label>
          ))}
        </div>
      </div>

      <div className="settings-section">
        <h3>Projects Page (non-Blender)</h3>
        <div className="settings-fields">
          <label>
            <span>Title</span>
            <input
              value={siteSettings.rlprojects?.title || ''}
              onChange={(e) => updateSiteSettings('rlprojects', { title: e.target.value })}
              placeholder="Projects"
            />
          </label>
          <label>
            <span>Intro Text</span>
            <textarea
              value={siteSettings.rlprojects?.intro || ''}
              onChange={(e) => updateSiteSettings('rlprojects', { intro: e.target.value })}
              placeholder="Page introduction..."
              rows={2}
            />
          </label>
        </div>
      </div>
    </div>
  )
}

function GameSearch({ rawgKey, onSelect }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const debounceRef = useRef(null)

  const search = (q) => {
    if (!q.trim() || !rawgKey) {
      setResults([])
      return
    }
    setSearching(true)
    fetch(`https://api.rawg.io/api/games?key=${rawgKey}&search=${encodeURIComponent(q)}&page_size=6`)
      .then(res => res.json())
      .then(data => {
        setResults(data.results || [])
        setSearching(false)
      })
      .catch(() => {
        setResults([])
        setSearching(false)
      })
  }

  const handleChange = (e) => {
    const val = e.target.value
    setQuery(val)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(val), 400)
  }

  const handleSelect = (game) => {
    onSelect({ title: game.name, imageUrl: game.background_image || '' })
    setQuery('')
    setResults([])
  }

  return (
    <div className="game-search">
      <input
        placeholder={rawgKey ? 'Search for a game...' : 'Set RAWG API key to search'}
        value={query}
        onChange={handleChange}
        disabled={!rawgKey}
      />
      {searching && <p className="search-status">Searching...</p>}
      {results.length > 0 && (
        <div className="search-results">
          {results.map(game => (
            <button key={game.id} className="search-result" onClick={() => handleSelect(game)}>
              {game.background_image ? (
                <img src={game.background_image} alt={game.name} className="search-result-img" />
              ) : (
                <div className="search-result-img search-result-placeholder" />
              )}
              <div className="search-result-info">
                <strong>{game.name}</strong>
                {game.released && <span>{game.released.slice(0, 4)}</span>}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function GamesManager({ games, addGame, updateGame, deleteGame, updateGames, githubToken, rawgKey }) {
  const [editing, setEditing] = useState(null)
  const [newGame, setNewGame] = useState({ title: '', description: '', imageUrl: '' })

  const handleAdd = () => {
    if (!newGame.title) return
    addGame(newGame)
    setNewGame({ title: '', description: '', imageUrl: '' })
  }

  const handleSearchSelect = (game) => {
    setNewGame({ ...newGame, title: game.title, imageUrl: game.imageUrl })
  }

  const handleUpdate = (id) => {
    updateGame(id, editing)
    setEditing(null)
  }

  const moveItem = (index, direction) => {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= games.length) return
    const newGames = [...games]
    const [removed] = newGames.splice(index, 1)
    newGames.splice(newIndex, 0, removed)
    updateGames(newGames)
  }

  return (
    <div className="manager">
      <h2>Games</h2>
      <p className="manager-note">Search for a game to auto-fill title and cover, or add manually.</p>

      <div className="add-form">
        <h3>Add New Game</h3>
        <GameSearch rawgKey={rawgKey} onSelect={handleSearchSelect} />
        <input
          placeholder="Title"
          value={newGame.title}
          onChange={(e) => setNewGame({ ...newGame, title: e.target.value })}
        />
        <input
          placeholder="Note (optional)"
          value={newGame.description}
          onChange={(e) => setNewGame({ ...newGame, description: e.target.value })}
        />
        <div className="media-input-group">
          <input
            placeholder="Cover Image URL (optional)"
            value={newGame.imageUrl}
            onChange={(e) => setNewGame({ ...newGame, imageUrl: e.target.value })}
          />
          <FileUpload
            accept="image/*"
            label="Upload Cover"
            githubToken={githubToken}
            onUpload={(url) => setNewGame({ ...newGame, imageUrl: url })}
          />
        </div>
        {newGame.imageUrl && (
          <div className="game-cover-preview">
            <img src={newGame.imageUrl} alt="Cover preview" />
          </div>
        )}
        <button onClick={handleAdd}>Add Game</button>
      </div>

      <div className="items-list">
        {games.map((game, index) => (
          <div key={game.id} className="item">
            {editing?.id === game.id ? (
              <>
                <input
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  placeholder="Title"
                />
                <input
                  value={editing.description || ''}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  placeholder="Note (optional)"
                />
                <div className="media-input-group">
                  <input
                    value={editing.imageUrl || ''}
                    onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value })}
                    placeholder="Cover Image URL (optional)"
                  />
                  <FileUpload
                    accept="image/*"
                    label="Upload Cover"
                    githubToken={githubToken}
                    onUpload={(url) => setEditing({ ...editing, imageUrl: url })}
                  />
                </div>
                <div className="item-actions">
                  <button onClick={() => handleUpdate(game.id)}>Save</button>
                  <button onClick={() => setEditing(null)}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <div className="reorder-buttons">
                  <button onClick={() => moveItem(index, -1)} disabled={index === 0} className="btn-reorder" title="Move up">▲</button>
                  <button onClick={() => moveItem(index, 1)} disabled={index === games.length - 1} className="btn-reorder" title="Move down">▼</button>
                </div>
                <div className="item-info">
                  <strong>{game.title}</strong>
                  {game.description && <p>{game.description}</p>}
                  {game.imageUrl && <span className="item-meta item-url">Cover: {game.imageUrl}</span>}
                </div>
                <div className="item-actions">
                  <button onClick={() => setEditing({ ...game })}>Edit</button>
                  <button onClick={() => deleteGame(game.id)} className="btn-danger">Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function ProjectsManager({ projects, addProject, updateProject, deleteProject, updateProjects, githubToken }) {
  const [editing, setEditing] = useState(null)
  const [newProject, setNewProject] = useState({ title: '', description: '', imageUrl: '', videoUrl: '' })

  const handleAdd = () => {
    if (!newProject.title) return
    addProject(newProject)
    setNewProject({ title: '', description: '', imageUrl: '', videoUrl: '' })
  }

  const handleUpdate = (id) => {
    updateProject(id, editing)
    setEditing(null)
  }

  const moveItem = (index, direction) => {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= projects.length) return
    const newProjects = [...projects]
    const [removed] = newProjects.splice(index, 1)
    newProjects.splice(newIndex, 0, removed)
    updateProjects(newProjects)
  }

  return (
    <div className="manager">
      <h2>Blender</h2>
      <p className="manager-note">Upload images or MP4 videos, or paste a URL. Video takes priority if both are set.</p>

      <div className="add-form">
        <h3>Add New Project</h3>
        <input
          placeholder="Title"
          value={newProject.title}
          onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
        />
        <input
          placeholder="Description"
          value={newProject.description}
          onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
        />
        <div className="media-input-group">
          <input
            placeholder="Image URL (optional)"
            value={newProject.imageUrl}
            onChange={(e) => setNewProject({ ...newProject, imageUrl: e.target.value })}
          />
          <FileUpload
            accept="image/*"
            label="Upload Image"
            githubToken={githubToken}
            onUpload={(url) => setNewProject({ ...newProject, imageUrl: url })}
          />
        </div>
        <div className="media-input-group">
          <input
            placeholder="Video URL (MP4/WebM/MKV, optional)"
            value={newProject.videoUrl}
            onChange={(e) => setNewProject({ ...newProject, videoUrl: e.target.value })}
          />
          <FileUpload
            accept="video/mp4,video/webm,video/x-matroska,.mkv"
            label="Upload Video"
            githubToken={githubToken}
            onUpload={(url) => setNewProject({ ...newProject, videoUrl: url })}
          />
        </div>
        <button onClick={handleAdd}>Add Project</button>
      </div>

      <div className="items-list">
        {projects.map((project, index) => (
          <div key={project.id} className="item">
            {editing?.id === project.id ? (
              <>
                <input
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  placeholder="Title"
                />
                <input
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  placeholder="Description"
                />
                <div className="media-input-group">
                  <input
                    value={editing.imageUrl || ''}
                    onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value })}
                    placeholder="Image URL (optional)"
                  />
                  <FileUpload
                    accept="image/*"
                    label="Upload Image"
                    githubToken={githubToken}
                    onUpload={(url) => setEditing({ ...editing, imageUrl: url })}
                  />
                </div>
                <div className="media-input-group">
                  <input
                    value={editing.videoUrl || ''}
                    onChange={(e) => setEditing({ ...editing, videoUrl: e.target.value })}
                    placeholder="Video URL (MP4/WebM/MKV)"
                  />
                  <FileUpload
                    accept="video/mp4,video/webm,video/x-matroska,.mkv"
                    label="Upload Video"
                    githubToken={githubToken}
                    onUpload={(url) => setEditing({ ...editing, videoUrl: url })}
                  />
                </div>
                <div className="item-actions">
                  <button onClick={() => handleUpdate(project.id)}>Save</button>
                  <button onClick={() => setEditing(null)}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <div className="reorder-buttons">
                  <button onClick={() => moveItem(index, -1)} disabled={index === 0} className="btn-reorder" title="Move up">▲</button>
                  <button onClick={() => moveItem(index, 1)} disabled={index === projects.length - 1} className="btn-reorder" title="Move down">▼</button>
                </div>
                <div className="item-info">
                  <strong>{project.title}</strong>
                  <p>{project.description}</p>
                  {project.imageUrl && <span className="item-meta item-url">Image: {project.imageUrl}</span>}
                  {project.videoUrl && <span className="item-meta item-url">Video: {project.videoUrl}</span>}
                </div>
                <div className="item-actions">
                  <button onClick={() => setEditing({ ...project })}>Edit</button>
                  <button onClick={() => deleteProject(project.id)} className="btn-danger">Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function RlprojectsManager({ rlprojects, addRlproject, updateRlproject, deleteRlproject, updateRlprojects, githubToken }) {
  const [editing, setEditing] = useState(null)
  const [newProject, setNewProject] = useState({ title: '', description: '', imageUrl: '', videoUrl: '' })

  const handleAdd = () => {
    if (!newProject.title) return
    addRlproject(newProject)
    setNewProject({ title: '', description: '', imageUrl: '', videoUrl: '' })
  }

  const handleUpdate = (id) => {
    updateRlproject(id, editing)
    setEditing(null)
  }

  const moveItem = (index, direction) => {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= rlprojects.length) return
    const next = [...rlprojects]
    const [removed] = next.splice(index, 1)
    next.splice(newIndex, 0, removed)
    updateRlprojects(next)
  }

  return (
    <div className="manager">
      <h2>Projects</h2>
      <p className="manager-note">Non-Blender projects. Upload images or MP4 videos, or paste a URL. Video takes priority if both are set.</p>

      <div className="add-form">
        <h3>Add New Project</h3>
        <input
          placeholder="Title"
          value={newProject.title}
          onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
        />
        <input
          placeholder="Description"
          value={newProject.description}
          onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
        />
        <div className="media-input-group">
          <input
            placeholder="Image URL (optional)"
            value={newProject.imageUrl}
            onChange={(e) => setNewProject({ ...newProject, imageUrl: e.target.value })}
          />
          <FileUpload
            accept="image/*"
            label="Upload Image"
            githubToken={githubToken}
            onUpload={(url) => setNewProject({ ...newProject, imageUrl: url })}
          />
        </div>
        <div className="media-input-group">
          <input
            placeholder="Video URL (MP4/WebM/MKV, optional)"
            value={newProject.videoUrl}
            onChange={(e) => setNewProject({ ...newProject, videoUrl: e.target.value })}
          />
          <FileUpload
            accept="video/mp4,video/webm,video/x-matroska,.mkv"
            label="Upload Video"
            githubToken={githubToken}
            onUpload={(url) => setNewProject({ ...newProject, videoUrl: url })}
          />
        </div>
        <button onClick={handleAdd}>Add Project</button>
      </div>

      <div className="items-list">
        {rlprojects.map((project, index) => (
          <div key={project.id} className="item">
            {editing?.id === project.id ? (
              <>
                <input
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  placeholder="Title"
                />
                <input
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  placeholder="Description"
                />
                <div className="media-input-group">
                  <input
                    value={editing.imageUrl || ''}
                    onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value })}
                    placeholder="Image URL (optional)"
                  />
                  <FileUpload
                    accept="image/*"
                    label="Upload Image"
                    githubToken={githubToken}
                    onUpload={(url) => setEditing({ ...editing, imageUrl: url })}
                  />
                </div>
                <div className="media-input-group">
                  <input
                    value={editing.videoUrl || ''}
                    onChange={(e) => setEditing({ ...editing, videoUrl: e.target.value })}
                    placeholder="Video URL (MP4/WebM/MKV)"
                  />
                  <FileUpload
                    accept="video/mp4,video/webm,video/x-matroska,.mkv"
                    label="Upload Video"
                    githubToken={githubToken}
                    onUpload={(url) => setEditing({ ...editing, videoUrl: url })}
                  />
                </div>
                <div className="item-actions">
                  <button onClick={() => handleUpdate(project.id)}>Save</button>
                  <button onClick={() => setEditing(null)}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <div className="reorder-buttons">
                  <button onClick={() => moveItem(index, -1)} disabled={index === 0} className="btn-reorder" title="Move up">▲</button>
                  <button onClick={() => moveItem(index, 1)} disabled={index === rlprojects.length - 1} className="btn-reorder" title="Move down">▼</button>
                </div>
                <div className="item-info">
                  <strong>{project.title}</strong>
                  <p>{project.description}</p>
                  {project.imageUrl && <span className="item-meta item-url">Image: {project.imageUrl}</span>}
                  {project.videoUrl && <span className="item-meta item-url">Video: {project.videoUrl}</span>}
                </div>
                <div className="item-actions">
                  <button onClick={() => setEditing({ ...project })}>Edit</button>
                  <button onClick={() => deleteRlproject(project.id)} className="btn-danger">Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function SongsManager({ songs, addSong, updateSong, deleteSong, updateSongs, githubToken }) {
  const [editing, setEditing] = useState(null)
  const [newSong, setNewSong] = useState({ title: '', artist: '', youtubeUrl: '', audioUrl: '' })

  const handleAdd = () => {
    if (!newSong.title || !newSong.artist) return
    addSong(newSong)
    setNewSong({ title: '', artist: '', youtubeUrl: '', audioUrl: '' })
  }

  const handleUpdate = (id) => {
    updateSong(id, editing)
    setEditing(null)
  }

  const moveItem = (index, direction) => {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= songs.length) return
    const newSongs = [...songs]
    const [removed] = newSongs.splice(index, 1)
    newSongs.splice(newIndex, 0, removed)
    updateSongs(newSongs)
  }

  return (
    <div className="manager">
      <h2>Favorite Songs</h2>
      <p className="manager-note">Upload MP3 files to enable playback in the record player. YouTube links are for display on the Music page.</p>

      <div className="add-form">
        <h3>Add New Song</h3>
        <input
          placeholder="Song Title"
          value={newSong.title}
          onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
        />
        <input
          placeholder="Artist"
          value={newSong.artist}
          onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
        />
        <div className="media-input-group">
          <input
            placeholder="Audio URL (optional)"
            value={newSong.audioUrl}
            onChange={(e) => setNewSong({ ...newSong, audioUrl: e.target.value })}
          />
          <FileUpload
            accept="audio/*"
            label="Upload MP3"
            githubToken={githubToken}
            onUpload={(url) => setNewSong({ ...newSong, audioUrl: url })}
          />
        </div>
        <input
          placeholder="YouTube Music Video URL (optional)"
          value={newSong.youtubeUrl}
          onChange={(e) => setNewSong({ ...newSong, youtubeUrl: e.target.value })}
        />
        <button onClick={handleAdd}>Add Song</button>
      </div>

      <div className="items-list">
        {songs.map((song, index) => (
          <div key={song.id} className="item">
            {editing?.id === song.id ? (
              <>
                <input
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  placeholder="Title"
                />
                <input
                  value={editing.artist}
                  onChange={(e) => setEditing({ ...editing, artist: e.target.value })}
                  placeholder="Artist"
                />
                <div className="media-input-group">
                  <input
                    value={editing.audioUrl || ''}
                    onChange={(e) => setEditing({ ...editing, audioUrl: e.target.value })}
                    placeholder="Audio URL (optional)"
                  />
                  <FileUpload
                    accept="audio/*"
                    label="Upload MP3"
                    githubToken={githubToken}
                    onUpload={(url) => setEditing({ ...editing, audioUrl: url })}
                  />
                </div>
                <input
                  value={editing.youtubeUrl || ''}
                  onChange={(e) => setEditing({ ...editing, youtubeUrl: e.target.value })}
                  placeholder="YouTube URL (optional)"
                />
                <div className="item-actions">
                  <button onClick={() => handleUpdate(song.id)}>Save</button>
                  <button onClick={() => setEditing(null)}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <div className="reorder-buttons">
                  <button onClick={() => moveItem(index, -1)} disabled={index === 0} className="btn-reorder" title="Move up">▲</button>
                  <button onClick={() => moveItem(index, 1)} disabled={index === songs.length - 1} className="btn-reorder" title="Move down">▼</button>
                </div>
                <div className="item-info">
                  <strong>{song.title}</strong>
                  <span className="item-meta">{song.artist}</span>
                  {song.audioUrl && <span className="item-meta item-url">🎵 {song.audioUrl}</span>}
                  {song.youtubeUrl && <span className="item-meta item-url">▶️ {song.youtubeUrl}</span>}
                </div>
                <div className="item-actions">
                  <button onClick={() => setEditing({ ...song })}>Edit</button>
                  <button onClick={() => deleteSong(song.id)} className="btn-danger">Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function SocialsManager({ socials, updateSocial, updateSocials }) {
  const [editing, setEditing] = useState(null)

  const handleUpdate = (id) => {
    updateSocial(id, editing)
    setEditing(null)
  }

  const moveItem = (index, direction) => {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= socials.length) return
    const newSocials = [...socials]
    const [removed] = newSocials.splice(index, 1)
    newSocials.splice(newIndex, 0, removed)
    updateSocials(newSocials)
  }

  return (
    <div className="manager">
      <h2>Contact Links</h2>
      <p className="manager-note">Edit your social media links and handles. Reorder to change display order (first item is featured).</p>

      <div className="items-list">
        {socials.map((social, index) => (
          <div key={social.id} className="item">
            {editing?.id === social.id ? (
              <>
                <input
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  placeholder="Platform name"
                />
                <input
                  value={editing.handle}
                  onChange={(e) => setEditing({ ...editing, handle: e.target.value })}
                  placeholder="Handle/username"
                />
                <input
                  value={editing.url}
                  onChange={(e) => setEditing({ ...editing, url: e.target.value })}
                  placeholder="URL"
                />
                <div className="item-actions">
                  <button onClick={() => handleUpdate(social.id)}>Save</button>
                  <button onClick={() => setEditing(null)}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <div className="reorder-buttons">
                  <button onClick={() => moveItem(index, -1)} disabled={index === 0} className="btn-reorder" title="Move up">▲</button>
                  <button onClick={() => moveItem(index, 1)} disabled={index === socials.length - 1} className="btn-reorder" title="Move down">▼</button>
                </div>
                <div className="item-info">
                  <strong>{social.name}</strong>
                  {index === 0 && <span className="featured-badge">Featured</span>}
                  <span className="item-meta">{social.handle}</span>
                  <span className="item-meta">{social.url}</span>
                </div>
                <div className="item-actions">
                  <button onClick={() => setEditing({ ...social })}>Edit</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function BadgesManager({ siteSettings, updateSiteSettings, githubToken }) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const badges = siteSettings.contact?.badges || []

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !githubToken) return

    setUploading(true)
    try {
      const url = await uploadFileToGitHub(file, githubToken)
      const newBadges = [...badges, { image: url, url: '', alt: file.name.replace(/\.[^/.]+$/, '') }]
      updateSiteSettings('contact', { badges: newBadges })
    } catch (err) {
      console.error('Upload failed:', err)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const updateBadge = (index, field, value) => {
    const newBadges = [...badges]
    newBadges[index] = { ...newBadges[index], [field]: value }
    updateSiteSettings('contact', { badges: newBadges })
  }

  const removeBadge = (index) => {
    const newBadges = badges.filter((_, i) => i !== index)
    updateSiteSettings('contact', { badges: newBadges })
  }

  const addBadgeByUrl = () => {
    const newBadges = [...badges, { image: '', url: '', alt: '' }]
    updateSiteSettings('contact', { badges: newBadges })
  }

  return (
    <div className="manager">
      <h2>Badges</h2>
      <p className="manager-note">Add 88x31 badges to your Contact page. Upload from your device or paste an image URL.</p>

      <div className="badges-add-section">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          style={{ display: 'none' }}
        />
        <button
          className="btn-primary"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || !githubToken}
        >
          {uploading ? 'Uploading...' : 'Upload Badge'}
        </button>
        <button className="btn-secondary" onClick={addBadgeByUrl}>
          Add by URL
        </button>
        {!githubToken && <p className="manager-note" style={{ color: 'var(--accent-primary)' }}>Set GitHub token to enable uploads</p>}
      </div>

      <div className="badges-list">
        {badges.length === 0 ? (
          <p className="no-items">No badges yet. Add some!</p>
        ) : (
          badges.map((badge, index) => (
            <div key={index} className="badge-item-full">
              <div className="badge-preview-large">
                {badge.image ? (
                  <img src={badge.image} alt={badge.alt || 'Badge'} />
                ) : (
                  <div className="badge-placeholder">No image</div>
                )}
              </div>
              <div className="badge-fields-full">
                <label>
                  <span>Image URL</span>
                  <input
                    value={badge.image}
                    onChange={(e) => updateBadge(index, 'image', e.target.value)}
                    placeholder="https://example.com/badge.gif"
                  />
                </label>
                <label>
                  <span>Link URL (optional)</span>
                  <input
                    value={badge.url || ''}
                    onChange={(e) => updateBadge(index, 'url', e.target.value)}
                    placeholder="https://example.com"
                  />
                </label>
                <label>
                  <span>Alt Text</span>
                  <input
                    value={badge.alt || ''}
                    onChange={(e) => updateBadge(index, 'alt', e.target.value)}
                    placeholder="Badge description"
                  />
                </label>
              </div>
              <button className="btn-remove-large" onClick={() => removeBadge(index)}>
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function ThemeManager() {
  const { currentTheme, setCurrentTheme, themes, getActiveTheme } = useTheme()
  const autoTheme = getActiveTheme()

  const themeInfo = {
    default: { icon: '🎨', description: 'The standard site theme' },
    christmas: { icon: '🎄', description: 'Dec 10 - Jan 2: Snowflakes, red & green colors' },
    halloween: { icon: '🎃', description: 'Oct 15 - Nov 1: Spooky orange & purple glow' },
    birthday: { icon: '🎂', description: 'Aug 10-14: Confetti, pink & gold celebration' },
    pride: { icon: '🏳️‍🌈', description: 'June: Rainbow gradients and colors' },
  }

  return (
    <div className="manager">
      <h2>Theme Preview</h2>
      <p className="manager-note">
        Themes activate automatically based on the date. Use these buttons to preview each theme.
        {autoTheme !== 'default' && (
          <span className="theme-auto-note"> Currently auto-active: <strong>{themes[autoTheme]?.name}</strong></span>
        )}
      </p>

      <div className="theme-grid">
        {Object.entries(themes).map(([key, theme]) => (
          <button
            key={key}
            className={`theme-card ${currentTheme === key ? 'active' : ''} ${autoTheme === key && key !== 'default' ? 'auto-active' : ''}`}
            onClick={() => setCurrentTheme(key)}
          >
            <span className="theme-icon">{themeInfo[key]?.icon}</span>
            <span className="theme-name">{theme.name}</span>
            <span className="theme-description">{themeInfo[key]?.description}</span>
            {currentTheme === key && <span className="theme-badge-active">Active</span>}
            {autoTheme === key && key !== 'default' && currentTheme !== key && (
              <span className="theme-badge-scheduled">Scheduled</span>
            )}
          </button>
        ))}
      </div>

      <div className="theme-actions">
        <button
          className="btn-secondary"
          onClick={() => setCurrentTheme(autoTheme)}
        >
          Reset to Auto ({themes[autoTheme]?.name})
        </button>
      </div>
    </div>
  )
}

export default Admin
