import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const links = [
  { label: 'Overview',  to: '/dashboard', icon: '📊' },
  { label: 'My Ads',    to: '/my-ads',    icon: '📋' },
  { label: 'Upload Ad', to: '/upload',    icon: '➕' },
  { label: 'Profile',   to: '/profile',   icon: '👤' },
]

const Sidebar = () => {
  const { user, sellerAds } = useAuth()

  return (
    <aside className="hidden w-64 shrink-0 xl:block">
      <div className="card sticky top-24 p-5">
        {/* User info */}
        <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-5 dark:border-slate-800">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-100 text-lg dark:bg-gold-500/15">
            {user?.fullName?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
              {user?.fullName || 'Seller'}
            </p>
            <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="space-y-0.5">
          {links.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Quick stat */}
        <div className="mt-5 rounded-xl bg-gold-50 p-4 dark:bg-gold-500/10">
          <p className="text-xs text-slate-500 dark:text-slate-400">Active listings</p>
          <p className="mt-1 text-2xl font-bold text-gold-600 dark:text-gold-400">{sellerAds.length}</p>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
