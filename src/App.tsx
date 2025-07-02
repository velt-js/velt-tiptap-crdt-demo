import { VeltProvider } from '@veltdev/react'
import './App.css'
import TipTap from './components/TipTap'
import VeltCollaboration from './velt-components/VeltCollaboration'

function App() {

  return (
    <>
      <VeltProvider apiKey={'Emcfab4ysRXaC1CZ8hmG'}>
        <div className="app-container">
          <header className="app-header">
            <h1 className="app-title">Collaborative Tiptap Editor</h1>
            <div className="login-section">
              <VeltCollaboration />
            </div>
          </header>
          <main className="app-content">
            <TipTap />
          </main>
        </div>
      </VeltProvider>
    </>
  )
}

export default App
