import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import AdminDashboard from '../components/AdminDashboard.jsx'
import AdminUserManagement from '../components/AdminUserManagement.jsx'
import AdminAdManagement from '../components/AdminAdManagement.jsx'
import AdminActivityLogs from '../components/AdminActivityLogs.jsx'
import AdminSettings from '../components/AdminSettings.jsx'
import AdminReports from '../components/AdminReports.jsx'

const SECTIONS = [
  { id: 'dashboard', label: 'Dashboard',  icon: '📊' },
  { id: 'users',     label: 'Users',      icon: '👥' },
  { id: 'ads',       label: 'Ads',        icon: '📋' },
  { id: 'reports',   label: 'Reports',    icon: '📈' },
  { id: 'logs',      label: 'Activity',   icon: '🔍' },
  { id: 'settings',  label: 'Settings',   icon: '⚙️' },
]

const Admin = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [active, setActive] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0a0c10] text-slate-100">

      {/* ── Sidebar ── */}
      <aside className={`flex flex-col shrink-0 border-r border-slate-800 bg-slate-950 transition-all duration-300 ${sidebarOpen ? 'w-60' : 'w-16'}`}>

        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-4">
          <img src="/RANGA_LOGO-removebg-preview.png" alt="RANGA" className="h-8 w-8 shrink-0 object-contain" />
          {sidebarOpen && <span className="text-base font-bold text-white">RANGA Admin</span>}
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-2 pt-4">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active === s.id
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <span className="text-base shrink-0">{s.icon}</span>
              {sidebarOpen && <span>{s.label}</span>}
            </button>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="border-t border-slate-800 p-3 space-y-1">
          {sidebarOpen && (
            <div className="mb-2 rounded-xl bg-slate-900 px-3 py-2">
              <p className="text-xs font-semibold text-white truncate">{user?.fullName}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
              <span className="mt-1 inline-block rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-semibold text-red-300">Admin</span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 hover:bg-red-500/10 hover:text-red-300 transition"
          >
            <span className="shrink-0">🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Topbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-950/80 px-6 backdrop-blur">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen((c) => !c)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
            >
              {sidebarOpen ? '◀' : '▶'}
            </button>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest">Admin Panel</p>
              <h1 className="text-base font-semibold text-white">
                {SECTIONS.find((s) => s.id === active)?.icon}{' '}
                {SECTIONS.find((s) => s.id === active)?.label}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs text-slate-500">{new Date().toLocaleDateString()}</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-sm font-bold text-emerald-300">
              {user?.fullName?.[0]?.toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        {/* Content */}
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
