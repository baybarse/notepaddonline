import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'
import './styles/auth.css'
import './styles/layout.css'
import './styles/sidebar.css'
import './styles/editor.css'
import './styles/preview.css'
import './styles/shared.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
