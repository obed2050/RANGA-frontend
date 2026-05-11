import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Sidebar from '../components/Sidebar.jsx'
import AdCard from '../components/AdCard.jsx'

const MyAds = () => {
  const { sellerAds, deleteAd } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="section py-10">
      <div className="grid gap-8 xl:grid-cols-[256px_1fr]">
        <Sidebar />

        <div className="space-y-6 min-w-0">
          {/* Header */}
          <div className="card p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="page-label">My Ads</p>
                <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                  Manage your listings
                </h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {sellerAds.length} active listing{sellerAds.length !== 1 ? 's' : ''}
                </p>
              </div>
              <button onClick={() => navigate('/upload')} className="btn btn-gold shrink-0">
                ➕ Upload New Ad
              </button>
            </div>
          </div>

          {/* Ads grid */}
          {sellerAds.length === 0 ? (
            <div className="card flex flex-col items-center py-20 text-center">
              <span className="text-5xl">📭</span>
              <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">No listings yet</h3>
              <p className="mt-2 text-sm text-slate-500">Start by uploading your first ad.</p>
              <button onClick={() => navigate('/upload')} className="btn btn-gold mt-6">
                Upload your first ad
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sellerAds.map((ad) => (
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
  )
}

export default MyAds
