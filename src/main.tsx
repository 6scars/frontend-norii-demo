import { StrictMode }                       from 'react'
import { createRoot }                       from 'react-dom/client'
import { BrowserRouter }                    from 'react-router-dom'

import AppProviders     from './app/AppProviders.tsx'
import AppRoutes        from './app/AppRoutes.tsx'
import './App.css'


const rootElement = document.getElementById('root')

if (!rootElement) throw new Error('Missing #root application container')

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </BrowserRouter>
  </StrictMode>
)
