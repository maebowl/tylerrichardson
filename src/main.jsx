import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { SiteDataProvider } from './data/siteData'
import { ThemeProvider } from './components/ThemeProvider'
import './index.css'
import App from './App.jsx'
import './personality.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <SiteDataProvider>
          <App />
        </SiteDataProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
