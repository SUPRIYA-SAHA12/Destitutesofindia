import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { useEffect, useState, useMemo, useCallback, createContext, useContext } from 'react'
import './index.css'


import Home from './pages/home.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import MissionVision from './pages/MissionVision.jsx'
import Donate from './pages/Donate.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import Disclaimer from './pages/Disclaimer.jsx'

import { auth, GoogleAuthProvider, signInWithPopup, signInAnonymously, signOut } from './firebase.js'
import { onAuthStateChanged } from 'firebase/auth'

const AuthContext = createContext(null)

function useAuth() {
  return useContext(AuthContext)
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
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
<div className="p-4 bg-emerald-100 text-emerald-700 rounded">Tailwind test</div>

function Navbar() {
  const { user, logout, loginWithGoogle, loginAnonymously } = useAuth()
  return (
    <header className="border-b bg-white sticky top-0 z-40">
      <div className="container-responsive flex items-center justify-between h-14">
        <NavLink to="/" className="text-sky-600 font-bold">destitutesofindia.com</NavLink>
        <nav className="flex items-center gap-3 text-sm">
          <NavLink to="/" className={({isActive}) => isActive ? 'text-sky-600' : 'text-slate-600'}>Home</NavLink>
          <NavLink to="/about" className={({isActive}) => isActive ? 'text-sky-600' : 'text-slate-600'}>About</NavLink>
          <NavLink to="/mission-vision" className={({isActive}) => isActive ? 'text-sky-600' : 'text-slate-600'}>Mission & Vision</NavLink>
          <NavLink to="/donate" className={({isActive}) => isActive ? 'text-sky-600' : 'text-slate-600'}>Donate</NavLink>
          <NavLink to="/contact" className={({isActive}) => isActive ? 'text-sky-600' : 'text-slate-600'}>Contact</NavLink>
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden sm:inline text-xs text-slate-600">{user.isAnonymous ? 'Anonymous' : (user.displayName || user.email)}</span>
              <button onClick={logout} className="px-3 py-1 rounded bg-slate-900 text-white text-xs">Logout</button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={loginAnonymously} className="px-3 py-1 rounded border text-xs">Post Anonymously</button>
              <button onClick={loginWithGoogle} className="px-3 py-1 rounded bg-sky-600 text-white text-xs">Login with Google</button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}


function Footer() {
  return (
    <footer className="border-t mt-10">
      <div className="container-responsive py-8 text-sm text-slate-600 flex flex-col sm:flex-row items-center sm:justify-between gap-3">
        <div>© {new Date().getFullYear()} destitutesofindia.com</div>
        <nav className="flex items-center gap-4">
          <NavLink to="/privacy">Privacy Policy</NavLink>
          <NavLink to="/disclaimer">Disclaimer</NavLink>
        </nav>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-full flex flex-col">
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
      </AuthProvider>
    </BrowserRouter>
  )
}

export { useAuth }
