import { useNavigate } from 'react-router-dom'

const FEATURES = [
  { icon: '⚡', title: 'Upload fast',     desc: 'Add images, videos, and ad details with instant preview.' },
  { icon: '📋', title: 'Manage ads',      desc: 'Edit or remove listings from your dashboard anytime.' },
  { icon: '📈', title: 'Track views',     desc: 'See how many buyers viewed your listings.' },
  { icon: '💬', title: 'Get contacts',    desc: 'Buyers reach you directly via WhatsApp or phone.' },
]

const SellerLanding = () => {
  const navigate = useNavigate()

  return (
    <div className="overflow-hidden">
      <section className="relative py-24">
        {/* Glow */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-gold-400/10 blur-3xl dark:bg-gold-500/8" />
        </div>

        <div className="section">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">

            {/* Left */}
            <div className="space-y-7 animate-slide-up">
              <img src="/RANGA_LOGO-removebg-preview.png" alt="RANGA" className="h-14 w-auto" />
              <span className="badge-gold">📢 Seller Platform</span>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                Post ads &{' '}
                <span className="text-gold-500">reach buyers</span> directly.
              </h1>
              <p className="max-w-lg text-base text-slate-600 dark:text-slate-300">
                Upload listings, manage your dashboard, get buyer contacts.
              </p>

              <div className="flex flex-wrap gap-3">
                <button onClick={() => navigate('/register')} className="btn btn-gold btn-lg">
                  🚀 Start Selling Free
                </button>
                <button onClick={() => navigate('/login')} className="btn btn-dark btn-lg">
                  🔑 Login
                </button>
              </div>

              {/* Trust pills */}
              <div className="flex flex-wrap gap-2">
                {['✅ Free to post', '⚡ Instant listing', '📊 Dashboard', '💬 Direct buyer contact'].map((t) => (
                  <span key={t} className="badge-gold">{t}</span>
                ))}
              </div>
            </div>

            {/* Right */}
            <div className="card p-6 animate-fade-in">
              <div className="rounded-xl border border-gold-200/60 bg-gold-50/60 p-5 dark:border-gold-500/20 dark:bg-gold-500/5">
                <span className="badge-gold">Seller Tools</span>
                <h2 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">Your dashboard</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {FEATURES.map((f) => (
                    <div key={f.title} className="rounded-xl bg-white p-3 shadow-card dark:bg-slate-800/60">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{f.icon} {f.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}

export default SellerLanding
