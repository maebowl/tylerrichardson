const GITHUB_REPO = 'maebowl/tyler-site'
const DATA_FILE_PATH = 'src/data/siteData.jsx'
const UPLOADS_PATH = 'public/uploads'

// Helper to properly encode UTF-8 to base64
function utf8ToBase64(str) {
  const encoder = new TextEncoder()
  const bytes = encoder.encode(str)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

export async function saveToGitHub(data, token) {
  if (!token) {
    throw new Error('GitHub token is required')
  }

  // Get the current file to get its SHA
  const fileResponse = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${DATA_FILE_PATH}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  )

  if (!fileResponse.ok) {
    const errorData = await fileResponse.json().catch(() => ({}))
    throw new Error(errorData.message || `Failed to fetch file: ${fileResponse.status}`)
  }

  const fileData = await fileResponse.json()
  const currentSha = fileData.sha

  // Generate the new file content
  const newContent = generateSiteDataFile(data)
  const encodedContent = utf8ToBase64(newContent)

  // Commit the changes
  const updateResponse = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${DATA_FILE_PATH}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Update site content via admin',
        content: encodedContent,
        sha: currentSha,
      }),
    }
  )

  if (!updateResponse.ok) {
    const error = await updateResponse.json()
    throw new Error(error.message || 'Failed to save to GitHub')
  }

  return await updateResponse.json()
}

export async function uploadFileToGitHub(file, token) {
  if (!token) {
    throw new Error('GitHub token is required')
  }

  // Generate unique filename with timestamp
  const timestamp = Date.now()
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
  const filename = `${timestamp}-${safeName}`
  const filePath = `${UPLOADS_PATH}/${filename}`

  // Read file as base64
  const base64Content = await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      // Remove data URL prefix (e.g., "data:image/png;base64,")
      const base64 = result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

  // Check if file already exists (to get SHA for update)
  let existingSha = null
  try {
    const checkResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    )
    if (checkResponse.ok) {
      const existingFile = await checkResponse.json()
      existingSha = existingFile.sha
    }
  } catch (e) {
    // File doesn't exist, that's fine
  }

  // Upload file to GitHub
  const uploadBody = {
    message: `Upload ${filename}`,
    content: base64Content,
  }
  if (existingSha) {
    uploadBody.sha = existingSha
  }

  const uploadResponse = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadBody),
    }
  )

  if (!uploadResponse.ok) {
    const error = await uploadResponse.json()
    throw new Error(error.message || 'Failed to upload file')
  }

  // Return the public URL path (relative to site root)
  return `/uploads/${filename}`
}

function generateSiteDataFile(data) {
  const { siteSettings, videos, projects, songs, posts, socials } = data

  // Helper to indent JSON properly (add 2 spaces to each line after the first)
  const indent = (json) => {
    const lines = json.split('\n')
    return lines.map((line, i) => i === 0 ? line : '  ' + line).join('\n')
  }

  return `import { createContext, useContext, useState } from 'react'

const defaultData = {
  siteSettings: ${indent(JSON.stringify(siteSettings, null, 4))},
  videos: ${indent(JSON.stringify(videos, null, 4))},
  projects: ${indent(JSON.stringify(projects, null, 4))},
  songs: ${indent(JSON.stringify(songs, null, 4))},
  posts: ${indent(JSON.stringify(posts, null, 4))},
  socials: ${indent(JSON.stringify(socials, null, 4))},
}

const SiteDataContext = createContext()

export function SiteDataProvider({ children }) {
  const [data, setData] = useState(defaultData)

  const updateVideos = (videos) => setData(prev => ({ ...prev, videos }))
  const updateProjects = (projects) => setData(prev => ({ ...prev, projects }))
  const updateSongs = (songs) => setData(prev => ({ ...prev, songs }))
  const updatePosts = (posts) => setData(prev => ({ ...prev, posts }))
  const updateSocials = (socials) => setData(prev => ({ ...prev, socials }))

  const addVideo = (video) => {
    const id = Math.max(0, ...data.videos.map(v => v.id)) + 1
    setData(prev => ({ ...prev, videos: [...prev.videos, { ...video, id }] }))
  }

  const updateVideo = (id, updates) => {
    setData(prev => ({
      ...prev,
      videos: prev.videos.map(v => v.id === id ? { ...v, ...updates } : v)
    }))
  }

  const deleteVideo = (id) => {
    setData(prev => ({ ...prev, videos: prev.videos.filter(v => v.id !== id) }))
  }

  const addProject = (project) => {
    const id = Math.max(0, ...data.projects.map(p => p.id)) + 1
    setData(prev => ({ ...prev, projects: [...prev.projects, { ...project, id }] }))
  }

  const updateProject = (id, updates) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, ...updates } : p)
    }))
  }

  const deleteProject = (id) => {
    setData(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }))
  }

  const addSong = (song) => {
    const id = Math.max(0, ...data.songs.map(s => s.id)) + 1
    setData(prev => ({ ...prev, songs: [...prev.songs, { ...song, id }] }))
  }

  const updateSong = (id, updates) => {
    setData(prev => ({
      ...prev,
      songs: prev.songs.map(s => s.id === id ? { ...s, ...updates } : s)
    }))
  }

  const deleteSong = (id) => {
    setData(prev => ({ ...prev, songs: prev.songs.filter(s => s.id !== id) }))
  }

  const addPost = (post) => {
    setData(prev => ({ ...prev, posts: [...prev.posts, post] }))
  }

  const updatePost = (slug, updates) => {
    setData(prev => ({
      ...prev,
      posts: prev.posts.map(p => p.slug === slug ? { ...p, ...updates } : p)
    }))
  }

  const deletePost = (slug) => {
    setData(prev => ({ ...prev, posts: prev.posts.filter(p => p.slug !== slug) }))
  }

  const updateSocial = (id, updates) => {
    setData(prev => ({
      ...prev,
      socials: prev.socials.map(s => s.id === id ? { ...s, ...updates } : s)
    }))
  }

  const updateSiteSettings = (section, updates) => {
    setData(prev => {
      const currentSection = prev.siteSettings[section] || {}
      // Deep merge for nested objects like taglines
      const mergedUpdates = { ...currentSection }
      for (const [key, value] of Object.entries(updates)) {
        if (value && typeof value === 'object' && !Array.isArray(value) && currentSection[key] && typeof currentSection[key] === 'object') {
          // Deep merge nested objects
          mergedUpdates[key] = { ...currentSection[key], ...value }
        } else {
          mergedUpdates[key] = value
        }
      }
      return {
        ...prev,
        siteSettings: {
          ...prev.siteSettings,
          [section]: mergedUpdates
        }
      }
    })
  }

  const resetToDefaults = () => {
    setData(defaultData)
  }

  return (
    <SiteDataContext.Provider value={{
      ...data,
      updateVideos,
      updateProjects,
      updateSongs,
      updatePosts,
      updateSocials,
      addVideo,
      updateVideo,
      deleteVideo,
      addProject,
      updateProject,
      deleteProject,
      addSong,
      updateSong,
      deleteSong,
      addPost,
      updatePost,
      deletePost,
      updateSocial,
      updateSiteSettings,
      resetToDefaults,
    }}>
      {children}
    </SiteDataContext.Provider>
  )
}

export function useSiteData() {
  const context = useContext(SiteDataContext)
  if (!context) {
    throw new Error('useSiteData must be used within SiteDataProvider')
  }
  return context
}
`
}
