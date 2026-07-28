import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import App from './pages/App.jsx'
import { AppProvider } from './context/AppContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>
)
