import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { useEffect, useState, useMemo, useCallback, createContext, useContext } from 'react'
import './index.css'


import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import MissionVision from './pages/MissionVision.jsx'
import Donate from './pages/Donate.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import Disclaimer from './pages/Disclaimer.jsx'


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
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop
      const doc = document.documentElement
      const h = doc.scrollHeight - doc.clientHeight
      setScrolled(y > 8)
      setProgress(h > 0 ? Math.min(100, Math.max(0, (y / h) * 100)) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header className={`sticky top-0 z-40 text-black transition-all duration-300 ${scrolled ? 'backdrop-blur supports-[backdrop-filter]:bg-white/10 shadow-xl' : ''}`}
        style={{ background: 'linear-gradient(10deg,rgb(63, 10, 121),rgb(169, 19, 210),rgb(17, 76, 214)))' }}>
        <div className={`container-responsive flex items-center justify-between ${scrolled ? 'h-14' : 'h-16'} transition-all duration-300`}>
          <NavLink to="/" className="font-bold tracking-wide flex items-center gap-2 hover:scale-105 transition-transform duration-300">
            <span className="material-symbols-outlined text-2xl float">eco</span>
            <span className="gradient-text text-lg font-semibold">destitutesofindia.com</span>
          </NavLink>
          <button className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg hover:bg-white/10 transition"
            onClick={() => setMenuOpen(v => !v)} aria-label="Toggle menu">
            <span className="material-symbols-outlined">{menuOpen ? 'close' : 'menu'}</span>
          </button>
          <nav className="hidden lg:flex text-sm items-center gap-6"> 
            <NavLink to="/" className={({isActive}) => 
              `nav-link px-3 py-2 rounded-lg transition-all duration-300 flex items-center gap-1 ${isActive ? 'bg-white/20 underline' : 'opacity-90 hover:opacity-100 hover:bg-white/10'}`
            }>
              <span className="material-symbols-outlined text-blue-500 text-lg">home</span>
              Home
            </NavLink>
            <NavLink to="/about" className={({isActive}) => 
              `nav-link px-3 py-2 rounded-lg transition-all duration-300 flex items-center gap-1 ${isActive ? 'bg-white/20 underline' : 'opacity-90 hover:opacity-100 hover:bg-white/10'}`
            }>
              <span className="material-symbols-outlined text-blue-500 text-lg">info</span>
              About
            </NavLink>
            <NavLink to="/mission-vission" className={({isActive}) => 
              `nav-link px-3 py-2 rounded-lg transition-all duration-300 flex items-center gap-1 ${isActive ? 'bg-white/20 underline' : 'opacity-90 hover:opacity-100 hover:bg-white/10'}`
            }>
              <span className="material-symbols-outlined text-blue-500 text-lg">visibility</span>
              Mission_Vision
            </NavLink>
            <NavLink to="/donate" className={({isActive}) => 
              `nav-link px-3 py-2 rounded-lg transition-all duration-300 flex items-center gap-1 ${isActive ? 'bg-white/20 underline' : 'opacity-90 hover:opacity-100 hover:bg-white/10'}`
            }>
              <span className="material-symbols-outlined text-blue-500 text-lg">volunteer_activism</span>
              Donate
            </NavLink>
            <NavLink to="/contact" className={({isActive}) => 
              `nav-link px-3 py-2 rounded-lg transition-all duration-300 flex items-center gap-1 ${isActive ? 'bg-white/20 underline' : 'opacity-90 hover:opacity-100 hover:bg-white/10'}`
            }>
              <span className="material-symbols-outlined text-blue-500 text-lg">mail</span>
              Contact
            </NavLink>
          </nav>
          <div className="hidden lg:flex items-center gap-3">
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
        <div className="h-1 w-full bg-white/10">
          <div className="h-full bg-white/70 transition-all" style={{ width: `${progress}%` }}></div>
        </div>
      </header>
      
      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setMenuOpen(false)}>
          <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-b from-emerald-600 to-green-600 text-white p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-semibold">Menu</h3>
              <button onClick={() => setMenuOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <nav className="space-y-4 mb-8">
              <NavLink to="/" className={({isActive}) => 
                `px-4 py-3 rounded-lg transition-all duration-300 flex items-center ${isActive ? 'bg-white/20' : 'hover:bg-white/10'}`
              } onClick={() => setMenuOpen(false)}>
                <span className="material-symbols-outlined text-blue-500 text-lg mr-2">home</span>
                Home
              </NavLink>
              <NavLink to="/about" className={({isActive}) => 
                `px-4 py-3 rounded-lg transition-all duration-300 flex items-center ${isActive ? 'bg-white/20' : 'hover:bg-white/10'}`
              } onClick={() => setMenuOpen(false)}>
                <span className="material-symbols-outlined text-blue-500 text-lg mr-2">info</span>
                About
              </NavLink>
              <NavLink to="/mission-vision" className={({isActive}) => 
                `px-4 py-3 rounded-lg transition-all duration-300 flex items-center ${isActive ? 'bg-white/20' : 'hover:bg-white/10'}`
              } onClick={() => setMenuOpen(false)}>
                <span className="material-symbols-outlined text-blue-500 text-lg mr-2">visibility</span>
                Mission & Vision
              </NavLink>
              <NavLink to="/donate" className={({isActive}) => 
                `px-4 py-3 rounded-lg transition-all duration-300 flex items-center ${isActive ? 'bg-white/20' : 'hover:bg-white/10'}`
              } onClick={() => setMenuOpen(false)}>
                <span className="material-symbols-outlined text-blue-500 text-lg mr-2">volunteer_activism</span>
                Donate
              </NavLink>
              <NavLink to="/contact" className={({isActive}) => 
                `px-4 py-3 rounded-lg transition-all duration-300 flex items-center ${isActive ? 'bg-white/20' : 'hover:bg-white/10'}`
              } onClick={() => setMenuOpen(false)}>
                <span className="material-symbols-outlined text-blue-500 text-lg mr-2">mail</span>
                Contact
              </NavLink>
            </nav>
            <div className="space-y-4">
              {user ? (
                <>
                  <div className="px-4 py-3 bg-white/10 rounded-lg">
                    <span className="text-sm">{user.isAnonymous ? 'Anonymous' : (user.displayName || user.email)}</span>
                  </div>
                  <button onClick={() => { logout(); setMenuOpen(false); }} className="w-full btn-secondary bg-white/15 hover:bg-white/25 text-white text-sm flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-300">
                    <span className="material-symbols-outlined">logout</span> Logout
                  </button>
                </>
              ) : (
                <div className="space-y-3">
                  <button onClick={() => { loginAnonymously(); setMenuOpen(false); }} className="w-full btn-secondary bg-white/15 hover:bg-white/25 text-white text-sm flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-300">
                    <span className="material-symbols-outlined">local_florist</span> Post Anonymously
                  </button>
                  <button onClick={() => { loginWithGoogle(); setMenuOpen(false); }} className="w-full btn-primary bg-emerald-300 text-slate-900 text-sm flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-300">
                    <span className="material-symbols-outlined">park</span> Login with Google
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}


function Footer() {
  return (
    // <footer className="mt-10 text-black" style={{ background: 'linear-gradient(10deg,rgb(8, 121, 155),rgb(9, 87, 132),rgb(8, 231, 209)' }}>
    //   <div className="h-1 w-full bg-white/10">
    //     <div className="h-full w-24 animate-pulse bg-white/70"></div>
    //   </div>
    //   <div className="container-responsive py-8 text-sm flex flex-col sm:flex-row items-center sm:justify-between gap-3">
    //     <div className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
    //       <span className="material-symbols-outlined float">forest</span>
    //       <span className="gradient-text font-semibold">© {new Date().getFullYear()} destitutesofindia.com</span>
    //     </div>
    //     <nav className="flex items-center gap-4 opacity-90 hover:opacity-100">
    //       <NavLink to="/privacy" className="nav-link px-3 py-1 rounded-lg transition-all duration-300 hover:bg-white/10">Privacy Policy</NavLink>
    //       <NavLink to="/disclaimer" className="nav-link px-3 py-1 rounded-lg transition-all duration-300 hover:bg-white/10">Disclaimer</NavLink>
    //     </nav>
    //   </div>
    // </footer>
      <footer className="w-full bg-gradient-to-br from-slate-800 via-blue-900 to-slate-800 text-slate-200 py-10 mt-10 reveal">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Logo + About */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold gradient-text">DestitutesOfIndia</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Helping communities by connecting needs with those who can provide support. 
            Together, we create impact.
          </p>
        </div>
    
        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="hover:text-blue-400 transition">Home</a>
            </li>
            <li>
              <a href="/about" className="hover:text-blue-400 transition">About Us</a>
            </li>
            <li>
              <a href="/news" className="hover:text-blue-400 transition">News</a>
            </li>
            <li>
              <a href="/contact" className="hover:text-blue-400 transition">Contact</a>
            </li>
          </ul>
        </div>
    
        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Support</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/donate" className="hover:text-green-400 transition">Donate</a>
            </li>
            <li>
              <a href="/volunteer" className="hover:text-green-400 transition">Volunteer</a>
            </li>
            <li>
              <a href="/privacy" className="hover:text-green-400 transition">Privacy Policy</a>
            </li>
            <li>
              <a href="/terms" className="hover:text-green-400 transition">Terms of Service</a>
            </li>
          </ul>
        </div>
    
        {/* Social */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Connect with us</h3>
          <div className="flex gap-4">
            <a href="#" aria-label="Facebook" className="hover:scale-110 hover:text-blue-500 transition">
              <span className="material-symbols-outlined text-2xl">facebook</span>
            </a>
            <a href="#" aria-label="Twitter" className="hover:scale-110 hover:text-sky-400 transition">
              <span className="material-symbols-outlined text-2xl">public</span>
            </a>
            <a href="#" aria-label="Instagram" className="hover:scale-110 hover:text-pink-400 transition">
              <span className="material-symbols-outlined text-2xl">photo_camera</span>
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:scale-110 hover:text-blue-400 transition">
              <span className="material-symbols-outlined text-2xl">groups</span>
            </a>
          </div>
        </div>
      </div>
    
      {/* Bottom Bar */}
      <div className="border-t border-slate-700 mt-8 pt-4 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} DestitutesOfIndia. All rights reserved.
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