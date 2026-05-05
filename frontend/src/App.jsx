import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom'
import { useEffect } from 'react'

/* ── Manikan site pages ──────────────────────────────────────────────────── */
import LandingPage        from './pages/manikan/LandingPage'
import SizeRecommendation from './pages/manikan/SizeRecommendation'
import EventStyling       from './pages/manikan/EventStyling'
import Visualization      from './pages/manikan/Visualization'
import WardrobeDashboard  from './pages/manikan/WardrobeDashboard'
import BusinessPage       from './pages/manikan/BusinessPage'
import PricingPage        from './pages/manikan/PricingPage'

/* ── Manikan site layout ─────────────────────────────────────────────────── */
import Navbar from './components/manikan/Navbar'
import Footer from './components/manikan/Footer'

/* ── Engine pages — these are now the primary store ─────────────────────── */
import EngineStorePage    from './pages/StorePage'
import ProductDetailPage  from './pages/ProductDetailPage'

/* ── Engine components (3D avatar generator) ────────────────────────────── */
import { useState, useCallback, useRef } from 'react'
import ControlPanel from './components/ControlPanel'
import AvatarViewer from './components/AvatarViewer'

const API_URL = 'http://localhost:8000/generate-avatar'

/* ── Scroll to top on route change ──────────────────────────────────────── */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

/* ── Manikan marketing layout (Navbar + Footer, light theme) ─────────────── */
function ManikanLayout({ children }) {
  return (
    <div className="manikan-layout min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

/* ── Engine Avatar Generator Page ────────────────────────────────────────── */
function EnginePage() {
  const [modelUrl, setModelUrl]   = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError]         = useState(null)
  const previousUrlRef            = useRef(null)

  const handleGenerate = useCallback(async (measurements) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(API_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(measurements),
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || `Server error: ${response.status}`)
      }
      const blob = await response.blob()
      const url  = URL.createObjectURL(blob)
      if (previousUrlRef.current) URL.revokeObjectURL(previousUrlRef.current)
      previousUrlRef.current = url
      setModelUrl(url)
    } catch (err) {
      console.error('Avatar generation failed:', err)
      setError(err.message || 'Failed to generate avatar. Is the backend running?')
    } finally {
      setIsLoading(false)
    }
  }, [])

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-surface-primary flex-col">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-6 py-4 bg-surface-secondary border-b border-border-subtle shrink-0">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" className="h-8 w-auto object-contain" alt="Manikan" />
        </Link>
        <Link to="/" className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </header>
      
      {/* ── Main Content ──────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        <aside className="w-[380px] min-w-[340px] flex-shrink-0">
          <ControlPanel onGenerate={handleGenerate} isLoading={isLoading} />
        </aside>
        <main className="flex-1 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-surface-primary via-surface-secondary to-surface-primary" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/[0.03] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-secondary/[0.03] rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />
        <div className="relative z-[1] w-full h-full">
          <AvatarViewer modelUrl={modelUrl} isLoading={isLoading} />
        </div>
        {error && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 animate-fade-in">
            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-danger/10 border border-danger/20 backdrop-blur-md shadow-lg">
              <svg className="w-5 h-5 text-danger flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-sm text-danger font-medium">{error}</p>
              <button onClick={() => setError(null)} className="ml-2 text-danger/60 hover:text-danger transition-colors cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
        </main>
      </div>
    </div>
  )
}

/* ── Router root ─────────────────────────────────────────────────────────── */
export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* ── Manikan marketing pages (light theme, Navbar + Footer) ── */}
        <Route path="/" element={
          <ManikanLayout><LandingPage /></ManikanLayout>
        } />
        <Route path="/size" element={
          <ManikanLayout><SizeRecommendation /></ManikanLayout>
        } />
        <Route path="/events" element={
          <ManikanLayout><EventStyling /></ManikanLayout>
        } />
        <Route path="/visualize" element={
          <ManikanLayout><Visualization /></ManikanLayout>
        } />
        <Route path="/wardrobe" element={
          <ManikanLayout><WardrobeDashboard /></ManikanLayout>
        } />
        <Route path="/business" element={
          <ManikanLayout><BusinessPage /></ManikanLayout>
        } />
        <Route path="/pricing" element={
          <ManikanLayout><PricingPage /></ManikanLayout>
        } />

        {/* ── Engine Store — now at /store (primary store) ── */}
        <Route path="/store" element={
          <ManikanLayout><EngineStorePage /></ManikanLayout>
        } />
        <Route path="/store/:id" element={
          <ManikanLayout><ProductDetailPage /></ManikanLayout>
        } />

        {/* ── Engine Avatar Generator ── */}
        <Route path="/engine" element={<EnginePage />} />

        {/* ── Legacy /shop redirects → /store ── */}
        <Route path="/shop"     element={<Navigate to="/store" replace />} />
        <Route path="/shop/:id" element={<Navigate to="/store" replace />} />
      </Routes>
    </>
  )
}
