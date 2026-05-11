import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Sidebar from '../components/Sidebar.jsx'
import AdCard from '../components/AdCard.jsx'

const StatCard = ({ icon, label, value, sub }) => (
  <div className="stat-card">
    <div className="flex items-center justify-between">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <span className="text-xl">{icon}</span>
    </div>
    <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{value}</p>
    {sub && <p className="text-xs text-slate-400">{sub}</p>}
  </div>
)

const Dashboard = () => {
  const { user, sellerAds, deleteAd } = useAuth()
  const navigate = useNavigate()
  const recent   = sellerAds.slice(0, 4)

  return (
    <div className="section py-10">
      <div className="grid gap-8 xl:grid-cols-[256px_1fr]">
        <Sidebar />

        <div className="space-y-8 min-w-0">
          {/* Welcome */}
          <div className="card p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="page-label">Dashboard Overview</p>
                <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                  Welcome back, {user?.fullName?.split(' ')[0] || 'Seller'} 👋
                </h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Manage your listings and keep your ads fresh.
                </p>
              </div>
              <button onClick={() => navigate('/upload')} className="btn btn-gold btn-lg shrink-0">
                ➕ Upload New Ad
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-4">
            <StatCard icon="📋" label="Active Listings"  value={sellerAds.length}          sub="Your published ads" />
            <StatCard icon="👁" label="Recent Uploads"   value={recent.length}             sub="Last 4 ads" />
            <StatCard icon="📞" label="Call Number"      value={user?.phoneNumber || '—'}  sub="Buyers call you" />
            <StatCard icon="💬" label="WhatsApp"         value={user?.whatsappNumber || user?.phoneNumber || '—'} sub="Buyers WhatsApp you" />
          </div>

          {/* Quick actions */}
          <div className="card p-6">
            <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">Quick Actions</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { icon: '➕', label: 'Upload Ad',   to: '/upload' },
                { icon: '📋', label: 'My Ads',      to: '/my-ads' },
                { icon: '👤', label: 'Edit Profile', to: '/profile' },
              ].map((a) => (
                <button
                  key={a.label}
                  onClick={() => navigate(a.to)}
                  className="card-hover flex items-center gap-3 p-4 text-left"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-50 text-lg dark:bg-gold-500/10">
                    {a.icon}
                  </span>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{a.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent ads */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">Recent Listings</h2>
              <button onClick={() => navigate('/my-ads')} className="btn btn-ghost btn-sm">View all →</button>
            </div>

            {recent.length === 0 ? (
              <div className="card flex flex-col items-center py-16 text-center">
                <span className="text-4xl">📭</span>
                <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">No ads yet</h3>
                <p className="mt-1 text-sm text-slate-500">Upload your first listing to get started.</p>
                <button onClick={() => navigate('/upload')} className="btn btn-gold mt-5">
                  Upload your first ad
                </button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {recent.map((ad) => (
                  <AdCard
                    key={ad.id}
                    ad={ad}
                    onEdit={() => navigate('/upload', { state: { editAd: ad } })}
                    onDelete={deleteAd}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
