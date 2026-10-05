import './styles/globals.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './App'
import { createLocalRepository } from './lib/storage'
import { AppStateProvider } from './state'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element #root not found')

// Swap this for a backend-backed AppRepository later; the UI doesn't change.
const repository = createLocalRepository()
const initialData = await repository.load()

createRoot(rootElement).render(
  <StrictMode>
    <AppStateProvider initialData={initialData} repository={repository}>
      <App />
    </AppStateProvider>
  </StrictMode>,
)
