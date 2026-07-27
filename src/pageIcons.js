// Per-page icons, used for BOTH the navbar logo and the browser-tab favicon.
// Each icon is a filled 24x24 path + a color (matching the page's accent).

export const PAGE_ICONS = {
  home: {
    label: 'Home',
    color: '#8287E1',
    path: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
  },
  projects: {
    // Blender — the famous beginner donut 🍩
    label: 'Blender',
    color: '#8bb3cf',
    fillRule: 'evenodd',
    path: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 6.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Z',
  },
  rlprojects: {
    // Projects — a wrench/build icon
    label: 'Projects',
    color: '#84bdc4',
    path: 'M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z',
  },
  games: {
    label: 'Games',
    color: '#8fbfa0',
    path: 'M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z',
  },
  music: {
    label: 'Music',
    color: '#d59595',
    path: 'M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z',
  },
  contact: {
    label: 'Contact',
    color: '#b4a3d4',
    path: 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
  },
  admin: {
    label: 'Admin',
    color: '#8287E1',
    path: 'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.56-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z',
  },
}

export function getPageIconKey(pathname) {
  if (pathname === '/') return 'home'
  if (pathname.startsWith('/rlprojects')) return 'rlprojects'
  if (pathname.startsWith('/projects')) return 'projects'
  if (pathname.startsWith('/games')) return 'games'
  if (pathname.startsWith('/music')) return 'music'
  if (pathname.startsWith('/contact')) return 'contact'
  if (pathname.startsWith('/admin')) return 'admin'
  return 'home'
}

// Build an app-icon style favicon (colored rounded square + white glyph)
export function makeFaviconDataUri(iconKey) {
  const icon = PAGE_ICONS[iconKey] || PAGE_ICONS.home
  const rule = icon.fillRule || 'nonzero'
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">` +
    `<rect width="24" height="24" rx="5" fill="${icon.color}"/>` +
    `<g transform="translate(3 3) scale(0.75)">` +
    `<path d="${icon.path}" fill="#ffffff" fill-rule="${rule}"/>` +
    `</g></svg>`
  return 'data:image/svg+xml,' + encodeURIComponent(svg)
}
