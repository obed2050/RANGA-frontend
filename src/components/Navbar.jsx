import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

/* ── Icons ── */
const Sun = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
  </svg>
)
const Moon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)
const Menu = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
)
const X = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

const NAV_GUEST = [
  { label: 'Explore',  to: '/home' },
  { label: 'Sell',     to: '/seller-landing' },
  { label: 'About',    to: '/home' },
  { label: 'Contact',  to: '/home' },
]
const NAV_SELLER = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'My Ads',    to: '/my-ads' },
  { label: 'Upload',    to: '/upload' },
  { label: 'Profile',   to: '/profile' },
]
const NAV_ADMIN = [{ label: 'Admin Panel', to: '/admin' }]

const Navbar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('ranga_theme')
    const isDark = saved ? saved === 'dark' : true
    document.documentElement.classList.toggle('dark', isDark)
    return isDark
  })
  const [open, setOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const dropRef = useRef(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('ranga_theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => { setOpen(false); setDropOpen(false) }, [location.pathname])

  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const navItems = user?.role === 'admin' ? NAV_ADMIN
    : user?.role === 'seller' ? NAV_SELLER
    : NAV_GUEST

  const isLanding = location.pathname === '/'

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md dark:border-slate-800/80 dark:bg-[#0d0f14]/95">
      <div className="section flex h-16 items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <img src="/RANGA_LOGO-removebg-preview.png" alt="RANGA" className="h-10 w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `nav-link rounded-lg px-3 py-2 ${isActive ? 'nav-link-active bg-gold-50 dark:bg-gold-500/10' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            type="button"
            aria-label="Toggle theme"
            onClick={() => setDark((c) => !c)}
            className="btn-ghost btn h-9 w-9 rounded-xl p-0 text-slate-500 dark:text-slate-400"
          >
            {dark ? <Sun /> : <Moon />}
          </button>

          {user ? (
            <div className="relative hidden md:block" ref={dropRef}>
              <button
                type="button"
                onClick={() => setDropOpen((c) => !c)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-gold-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold-500 text-xs font-bold text-slate-950">
                  {user.fullName?.[0]?.toUpperCase() || 'U'}
                </span>
                <span>{user.fullName?.split(' ')[0]}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`transition-transform ${dropOpen ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6"/></svg>
              </button>

              {dropOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-slate-200 bg-white py-1.5 shadow-lg dark:border-slate-700 dark:bg-slate-900 animate-fade-in">
                  <div className="border-b border-slate-100 px-4 py-2.5 dark:border-slate-800">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{user.fullName}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                  <Link to="/profile" className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-gold-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-gold-400">
                    👤 Profile
                  </Link>
                  <Link to="/dashboard" className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-gold-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-gold-400">
                    📊 Dashboard
                  </Link>
                  <Link to="/my-ads" className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-gold-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-gold-400">
                    📋 My Ads
                  </Link>
                  <Link to="/upload" className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-gold-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-gold-400">
                    ➕ Post Ad
                  </Link>
                  <Link to="/profile" className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-gold-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-gold-400">
                    🔑 Account & Password
                  </Link>
                  <div className="border-t border-slate-100 mt-1 pt-1 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={logout}
                      className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                    >
                      🚪 Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-gold btn-sm">Post Ad Free</Link>
            </div>
          )}

          {/* Mobile toggle */}
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((c) => !c)}
            className="btn-ghost btn h-9 w-9 rounded-xl p-0 md:hidden"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-slate-200/80 bg-white px-4 pb-4 pt-2 dark:border-slate-800/80 dark:bg-[#0d0f14] md:hidden animate-fade-in">
          <nav className="flex flex-col gap-0.5">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? 'bg-gold-50 text-gold-700 dark:bg-gold-500/10 dark:text-gold-400'
                      : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/60'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
            {user ? (
              <button type="button" onClick={logout} className="btn btn-gold-outline w-full">Logout</button>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost flex-1">Login</Link>
                <Link to="/register" className="btn btn-gold flex-1">Post Ad Free</Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Trust bar — landing only */}
      {isLanding && (
        <div className="border-t border-slate-100 bg-gold-50/80 px-4 py-1.5 dark:border-slate-800/60 dark:bg-gold-500/5">
          <div className="section flex items-center gap-4 overflow-x-auto whitespace-nowrap text-xs text-slate-500 dark:text-slate-500">
            <span className="font-semibold text-gold-600 dark:text-gold-500">🛡 Trusted Marketplace</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">Direct seller contact · No hidden fees · Free to browse</span>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
