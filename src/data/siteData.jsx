import { createContext, useContext, useState } from 'react'

const defaultData = {
  siteSettings: {
      "hero": {
          "greeting": "Hi, I'm",
          "name": "Tyler Richardson",
          "subtitle": "Professional idiot and bad at video games"
      },
      "projects": {
          "title": "Blender",
          "intro": "No, this isn't my entire personality. Maybe."
      },
      "music": {
          "title": "Favorite Songs",
          "intro": "The music I either bang my head to or bawl my eyes out to."
      },
      "games": {
          "title": "Games",
          "intro": "Some of my favorite games."
      },
      "contact": {
          "title": "Contact",
          "intro": "Come hang out, talk video games, or watch me fail.",
          "taglines": {
              "discord": "Join my server",
              "youtube": "Random crap",
              "twitch": "Catch me live",
              "letterboxd": "Movie opinions",
              "steam": "My games",
              "characterhub": "My characters",
              "tumblr": "Random crap"
          },
          "badges": [
              {
                  "image": "/uploads/1768599526001-tyler.gif",
                  "url": "https://tyler-site.pages.dev",
                  "alt": "tyler"
              },
              {
                  "image": "/uploads/1768599599069-mabelwallin-com88x31.gif",
                  "url": "https://mabelwallin.com",
                  "alt": "traaaaaaaans"
              },
              {
                  "image": "https://mabelwallin.com/uploads/1768557812569-IMG_1919.gif",
                  "url": "https://www.youtube.com/c/scottthewoz",
                  "alt": "ScottWoz"
              },
              {
                  "image": "https://notnite.com/buttons/blender.gif",
                  "url": "https://www.blender.org/",
                  "alt": "blender"
              },
              {
                  "image": "https://notnite.com/buttons/jellyfin.gif",
                  "url": "https://jellyfin.org",
                  "alt": "jellyfin"
              },
              {
                  "image": "https://notnite.com/buttons/notnite.png",
                  "url": "https://notnite.com/",
                  "alt": "notnite"
              },
              {
                  "image": "https://notnite.com/buttons/qbittorrent.png",
                  "url": "https://www.qbittorrent.org/",
                  "alt": "qbit"
              },
              {
                  "image": "https://eightyeightthirty.one/88x31.png",
                  "url": "https://eightyeightthirty.one",
                  "alt": "8831"
              }
          ]
      },
      "blog": {
          "title": "Blog",
          "intro": "Projects, updates, and random garbage."
      }
  },
  games: [
      {
          "title": "Hollow Knight",
          "description": "Why did nobody tell me Metroidvanias were peak?",
          "imageUrl": "https://cdn.mobygames.com/covers/1792719-hollow-knight-limited-edition-linux-front-cover.jpg",
          "id": 1
      },
      {
          "title": "Hollow Knight: Silksong",
          "description": "HK but better? That’s possible?",
          "imageUrl": "https://cdn.mobygames.com/covers/20548218-hollow-knight-silksong-windows-apps-front-cover.png",
          "id": 2
      },
      {
          "title": "OneShot",
          "description": "I can’t even make a joke about this one it’s just too good",
          "imageUrl": "https://m.media-amazon.com/images/M/MV5BNWQzYWE5MjQtYmE0MS00MDc0LTlmZTYtMDBiMjBmNmUxYjdlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
          "id": 3
      },
      {
          "title": "Splatoon 3",
          "description": "The only shooter i’ve ever enjoyed",
          "imageUrl": "https://i.ebayimg.com/images/g/MngAAOSw8JFjC-qU/s-l1600.jpg",
          "id": 4
      },
      {
          "title": "Haste",
          "description": "Sonic but actually good",
          "imageUrl": "https://www.gematsu.com/wp-content/uploads/2023/11/Game-Page-Box-Art_HASTE-Broken-Worlds-Inits.jpg",
          "id": 5
      },
      {
          "title": "A Hat in Time",
          "description": "What if Mario 64 but not old?",
          "imageUrl": "https://wallpaperaccess.com/full/2146096.jpg",
          "id": 6
      }
  ],
  projects: [
      {
          "title": "The Donut",
          "description": "you know the one.",
          "imageUrl": "/uploads/1768541664379-image.png",
          "videoUrl": "/uploads/1768541637397-ezgif-6c2ae73cef5eec86.mp4",
          "id": 1
      },
      {
          "title": "Fluid Simulation",
          "description": "this took so goddamn long to render",
          "imageUrl": "",
          "videoUrl": "/uploads/1768542204017-8mb.video-PUP-8GLXv6yL.mp4",
          "id": 2
      },
      {
          "title": "Monitor",
          "description": "I had to.",
          "imageUrl": "",
          "videoUrl": "/uploads/1768600668799-0001-0250.mkv",
          "id": 3
      },
      {
          "title": "VTuber model",
          "description": "i will NOT be sharing the blender file.",
          "imageUrl": "/uploads/1769901146797-untitled.png",
          "videoUrl": "",
          "id": 4
      }
  ],
  songs: [
      {
          "title": "P.A.R.T.Y.",
          "artist": "Alestorm",
          "youtubeUrl": "https://www.youtube.com/watch?v=EKA3RSgkhq8",
          "id": 1
      },
      {
          "title": "seishun complex",
          "artist": "kessoku band",
          "youtubeUrl": "https://www.youtube.com/watch?v=7FDRQifEMUQ",
          "id": 2
      },
      {
          "title": "Mantis Lords",
          "artist": "Christopher Larkin",
          "youtubeUrl": "https://www.youtube.com/watch?v=Lp5M2BAXwSo",
          "id": 3
      },
      {
          "title": "Death By Glamour",
          "artist": "Toby Fox",
          "youtubeUrl": "https://www.youtube.com/watch?v=Q9kDr4na0ls",
          "id": 4
      },
      {
          "title": "'Til Depth Do Us Part",
          "artist": "Deep Cut",
          "youtubeUrl": "https://www.youtube.com/watch?v=lw1XwyW39uk",
          "id": 5
      },
      {
          "title": "In Memory",
          "artist": "Nightmargin",
          "youtubeUrl": "https://www.youtube.com/watch?v=z9-6ZAVOwHo",
          "id": 6
      },
      {
          "title": "City of Tears",
          "artist": "Christpher Larkin",
          "youtubeUrl": "",
          "audioUrl": "/uploads/1768604086549-Hollow_Knight_OST_-_City_of_Tears.mp3",
          "id": 8
      }
  ],
  posts: [
      {
          "slug": "record-player-get",
          "title": "I got a record player!",
          "date": "2026-01-11",
          "excerpt": "It go spinny",
          "content": "So... Fangamer sells vinyl records. I feel like that's all the explanation needed to understand why I got this thing. I found it used for around $150, and despite the delays (Fangamer was backed up after Christmas), the records got here first. \n\nIf you know anything about me, you know OneShot is my favorite game of all time. As much as I love it, I have to admit that the OST isn't that solid. Even so, I felt like this had to be my first record. And honestly? It's great. I love listening to it, even if the Hollow Knight vinyl might have been a better pick.\n\nAs for the record player itself, the needle sometimes gets stuck and starts skipping, but that's really the only problem; it looks and plays fantastically. (yes, I know I cleaned it wrong in the video, I was holding my phone to record. Sorry for not having three hands.) \n\nThe only problem is that... I don't have powered speakers, or an open outlet I could plug them into. No big deal, the player is set up right next to my TV, so I can just use its composite input. But… that requires a video signal as well, so whenever I want to listen to my records, I have to power on my SNES. Naturally. Is it a bit of a gimped setup? Definitely. Does it work? It sure does.\n\nI'm not exactly sure how I feel about vinyl as a medium. It's cool and all, but it doesn't really feel as premium as I thought, and it doesn't sound different enough for me to really want all my music to be on vinyl when I could just... <i>VERY LEGALLY</i> get mp3s of all my music instead. But hey, maybe I just need to get an OST I care more about. I'll stick with it for a bit longer, I guess.",
          "media": []
      }
  ],
  socials: [
      {
          "id": "discord",
          "name": "Discord",
          "handle": "Somewhere in Splatsville",
          "url": "https://discord.gg/6EMXrZFQaq"
      },
      {
          "id": "youtube",
          "name": "YouTube",
          "handle": "Nozoa",
          "url": "https://www.youtube.com/@NozoaST"
      },
      {
          "id": "twitch",
          "name": "Twitch",
          "handle": "NozoaST",
          "url": "https://www.twitch.tv/nozoast"
      },
      {
          "id": "letterboxd",
          "name": "Letterboxd",
          "handle": "LoreTie",
          "url": "https://letterboxd.com/loretie/"
      },
      {
          "id": "steam",
          "name": "Steam",
          "handle": "Nozoa",
          "url": "https://steamcommunity.com/id/Nozoa"
      },
      {
          "id": "characterhub",
          "name": "CharacterHub",
          "handle": "Nozoa",
          "url": "https://characterhub.com/profile/Nozoa"
      },
      {
          "id": "tumblr",
          "name": "Tumblr",
          "handle": "Nozoa",
          "url": "https://www.tumblr.com/nozoa"
      }
  ],
}

const SiteDataContext = createContext()

export function SiteDataProvider({ children }) {
  const [data, setData] = useState(defaultData)

  const updateGames = (games) => setData(prev => ({ ...prev, games }))
  const updateProjects = (projects) => setData(prev => ({ ...prev, projects }))
  const updateSongs = (songs) => setData(prev => ({ ...prev, songs }))
  const updatePosts = (posts) => setData(prev => ({ ...prev, posts }))
  const updateSocials = (socials) => setData(prev => ({ ...prev, socials }))

  const addGame = (game) => {
    const id = Math.max(0, ...data.games.map(g => g.id)) + 1
    setData(prev => ({ ...prev, games: [...prev.games, { ...game, id }] }))
  }

  const updateGame = (id, updates) => {
    setData(prev => ({
      ...prev,
      games: prev.games.map(g => g.id === id ? { ...g, ...updates } : g)
    }))
  }

  const deleteGame = (id) => {
    setData(prev => ({ ...prev, games: prev.games.filter(g => g.id !== id) }))
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
      updateGames,
      updateProjects,
      updateSongs,
      updatePosts,
      updateSocials,
      addGame,
      updateGame,
      deleteGame,
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
