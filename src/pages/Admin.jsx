import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import AdminDashboard from '../components/AdminDashboard.jsx'
import AdminUserManagement from '../components/AdminUserManagement.jsx'
import AdminAdManagement from '../components/AdminAdManagement.jsx'
import AdminActivityLogs from '../components/AdminActivityLogs.jsx'
import AdminSettings from '../components/AdminSettings.jsx'
import AdminReports from '../components/AdminReports.jsx'

const SECTIONS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'users',     label: 'Users',     icon: '👥' },
  { id: 'ads',       label: 'Ads',       icon: '📋' },
  { id: 'reports',   label: 'Reports',   icon: '📈' },
  { id: 'logs',      label: 'Activity',  icon: '🔍' },
  { id: 'settings',  label: 'Settings',  icon: '⚙️' },
]

const Admin = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [active, setActive] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('ranga_theme')
    return saved ? saved === 'dark' : true
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('ranga_theme', dark ? 'dark' : 'light')
  }, [dark])

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className={`flex h-screen w-screen overflow-hidden ${dark ? 'bg-[#0a0c10] text-slate-100' : 'bg-slate-100 text-slate-900'}`}>

      {/* Sidebar */}
      <aside className={`flex flex-col shrink-0 border-r transition-all duration-300 ${
        dark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white'
      } ${sidebarOpen ? 'w-60' : 'w-16'}`}>

        <div className={`flex h-16 items-center gap-3 border-b px-4 ${dark ? 'border-slate-800' : 'border-slate-200'}`}>
          <img src="/RANGA_LOGO-removebg-preview.png" alt="RANGA" className="h-8 w-8 shrink-0 object-contain" />
          {sidebarOpen && <span className={`text-base font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>RANGA Admin</span>}
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-2 pt-4">
          {SECTIONS.map((s) => (
            <button key={s.id} onClick={() => setActive(s.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active === s.id
                  ? 'bg-emerald-500/20 text-emerald-500'
                  : dark ? 'text-slate-400 hover:bg-slate-800/60 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`}>
              <span className="text-base shrink-0">{s.icon}</span>
              {sidebarOpen && <span>{s.label}</span>}
            </button>
          ))}

          <button onClick={() => navigate('/home')}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition mt-2 ${
              dark ? 'text-gold-400 hover:bg-gold-500/10' : 'text-gold-600 hover:bg-gold-50'
            }`}>
            <span className="text-base shrink-0">🌐</span>
            {sidebarOpen && <span>View Marketplace</span>}
          </button>
        </nav>

        <div className={`border-t p-3 space-y-1 ${dark ? 'border-slate-800' : 'border-slate-200'}`}>
          {sidebarOpen && (
            <div className={`mb-2 rounded-xl px-3 py-2 ${dark ? 'bg-slate-900' : 'bg-slate-100'}`}>
              <p className={`text-xs font-semibold truncate ${dark ? 'text-white' : 'text-slate-900'}`}>{user?.fullName}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
              <span className="mt-1 inline-block rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-semibold text-red-400">Admin</span>
            </div>
          )}
          <button onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition">
            <span className="shrink-0">🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">

        <header className={`flex h-16 shrink-0 items-center justify-between border-b px-6 backdrop-blur ${
          dark ? 'border-slate-800 bg-slate-950/80' : 'border-slate-200 bg-white/80'
        }`}>
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen((c) => !c)}
              className={`rounded-lg p-1.5 transition ${
                dark ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`}>
              {sidebarOpen ? '◀' : '▶'}
            </button>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest">Admin Panel</p>
              <h1 className={`text-base font-semibold ${dark ? 'text-white' : 'text-slate-900'}`}>
                {SECTIONS.find((s) => s.id === active)?.icon}{' '}
                {SECTIONS.find((s) => s.id === active)?.label}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setDark((c) => !c)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                dark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}>
              {dark ? '☀️ Light' : '🌙 Dark'}
            </button>
            <button onClick={() => navigate('/home')}
              className="rounded-lg bg-gold-500/20 px-3 py-1.5 text-xs font-medium text-gold-500 hover:bg-gold-500/30 transition">
              🌐 Marketplace
            </button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-sm font-bold text-emerald-400">
              {user?.fullName?.[0]?.toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {active === 'dashboard' && <AdminDashboard />}
          {active === 'users'     && <AdminUserManagement />}
          {active === 'ads'       && <AdminAdManagement />}
          {active === 'reports'   && <AdminReports />}
          {active === 'logs'      && <AdminActivityLogs user={user} />}
          {active === 'settings'  && <AdminSettings />}
        </main>
      </div>
    </div>
  )
}

export default Admin
