import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { useEffect, useState, useMemo, useCallback, createContext, useContext } from 'react'
import './index.css'


 
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import MissionVision from './pages/MissionVision.jsx'
import Donate from './pages/Donate.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import Disclaimer from './pages/Disclaimer.jsx'
import Home from './pages/Home.jsx'

import { auth, GoogleAuthProvider, signInWithPopup, signInAnonymously, signOut } from './firebase.js'//auth means authentication ,it help us identify who the user in our app ,firebase services 
import { onAuthStateChanged } from 'firebase/auth'

const AuthContext = createContext(null)

function useAuth() {
  return useContext(AuthContext)
}

function AuthProvider({ children }) {
  const [user,setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const loginWithGoogle = useCallback(async () => {
    if (!auth) {
      alert('Firebase is not configured. Set .env.local and restart the dev server.')
      return
    }
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  }, [])

  const loginAnonymously = useCallback(async () => {
    if (!auth) {
      alert('Firebase is not configured. Set .env.local and restart the dev server.')
      return
    }
    await signInAnonymously(auth)
  }, [])

  const logout = useCallback(async () => {
    if (!auth) return
    await signOut(auth)
  }, [])

  const value = useMemo(() => ({ user, loading, loginWithGoogle, loginAnonymously, logout }), [user, loading, loginWithGoogle, loginAnonymously, logout])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

function Navbar() {
  const { user, logout, loginWithGoogle, loginAnonymously } = useAuth()
  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-emerald-600 via-green-600 to-lime-600 text-white shadow-lg backdrop-blur-sm">
      <div className="container-responsive flex items-center justify-between h-16">
        <NavLink to="/" className="font-bold tracking-wide flex items-center gap-2 hover:scale-105 transition-transform duration-300">
          <span className="material-symbols-outlined text-2xl float">eco</span>
          <span className="gradient-text text-lg font-semibold">destitutesofindia.com</span>
        </NavLink>
        <nav className="flex items-center gap-6 text-sm">
          <NavLink to="/" className={({isActive}) => 
            `nav-link px-3 py-2 rounded-lg transition-all duration-300 ${isActive ? 'bg-white/20 underline' : 'opacity-90 hover:opacity-100 hover:bg-white/10'}`
          }>Home</NavLink>
          <NavLink to="/about" className={({isActive}) => 
            `nav-link px-3 py-2 rounded-lg transition-all duration-300 ${isActive ? 'bg-white/20 underline' : 'opacity-90 hover:opacity-100 hover:bg-white/10'}`
          }>About</NavLink>
          <NavLink to="/mission-vision" className={({isActive}) => 
            `nav-link px-3 py-2 rounded-lg transition-all duration-300 ${isActive ? 'bg-white/20 underline' : 'opacity-90 hover:opacity-100 hover:bg-white/10'}`
          }>Mission & Vision</NavLink>
          <NavLink to="/donate" className={({isActive}) => 
            `nav-link px-3 py-2 rounded-lg transition-all duration-300 ${isActive ? 'bg-white/20 underline' : 'opacity-90 hover:opacity-100 hover:bg-white/10'}`
          }>Donate</NavLink>
          <NavLink to="/contact" className={({isActive}) => 
            `nav-link px-3 py-2 rounded-lg transition-all duration-300 ${isActive ? 'bg-white/20 underline' : 'opacity-90 hover:opacity-100 hover:bg-white/10'}`
          }>Contact</NavLink>
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden sm:inline text-xs opacity-90 bg-white/10 px-2 py-1 rounded-lg transition-all duration-300 hover:bg-white/20">
                {user.isAnonymous ? 'Anonymous' : (user.displayName || user.email)}
              </span>
              <button onClick={logout} className="btn-secondary bg-white/15 hover:bg-white/25 text-white text-xs flex items-center gap-1 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105">
                <span className="material-symbols-outlined text-sm">logout</span> Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={loginAnonymously} className="btn-secondary bg-white/15 hover:bg-white/25 text-white text-xs flex items-center gap-1 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105">
                <span className="material-symbols-outlined text-sm">local_florist</span> Anonymous
              </button>
              <button onClick={loginWithGoogle} className="btn-primary bg-emerald-300 text-slate-900 text-xs flex items-center gap-1 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105">
                <span className="material-symbols-outlined text-sm">park</span> Google
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}


function Footer() {
  return (
    <footer className="mt-10 bg-gradient-to-r from-lime-600 via-green-600 to-emerald-600 text-white">
      <div className="container-responsive py-8 text-sm flex flex-col sm:flex-row items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
          <span className="material-symbols-outlined float">forest</span>
          <span className="gradient-text font-semibold">© {new Date().getFullYear()} destitutesofindia.com</span>
        </div>
        <nav className="flex items-center gap-4 opacity-90 hover:opacity-100">
          <NavLink to="/privacy" className="nav-link px-3 py-1 rounded-lg transition-all duration-300 hover:bg-white/10">Privacy Policy</NavLink>
          <NavLink to="/disclaimer" className="nav-link px-3 py-1 rounded-lg transition-all duration-300 hover:bg-white/10">Disclaimer</NavLink>
        </nav>
      </div>
    </footer>
  )
}

function RoutedApp() {
  const location = useLocation()
  // Reveal-on-scroll: observe elements on each route change
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('reveal-visible')
          io.unobserve(e.target)
        }
      })
    }, { threshold: 0.12 })
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el))
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return () => io.disconnect()
  }, [location.pathname])

  return (
    <div className="min-h-full flex flex-col" id="app-root">
      <Navbar />
      <main className="container-responsive py-6 flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/mission-vision" element={<MissionVision />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <RoutedApp />
      </AuthProvider>
    </BrowserRouter>
  )
}

export { useAuth }
