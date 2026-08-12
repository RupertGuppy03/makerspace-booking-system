import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ManagementPage from './pages/Management/ManagementPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ManagementPage />
  </StrictMode>,
)
