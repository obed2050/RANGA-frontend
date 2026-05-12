import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const CATEGORIES = [
  { icon: '🏠', label: 'Real Estate' },
  { icon: '🚗', label: 'Vehicles' },
  { icon: '📱', label: 'Electronics' },
  { icon: '👗', label: 'Fashion' },
  { icon: '🛋️', label: 'Furniture' },
  { icon: '💼', label: 'Services' },
  { icon: '🌿', label: 'Agriculture' },
  { icon: '🎓', label: 'Education' },
  { icon: '💄', label: 'Beauty' },
  { icon: '🍎', label: 'Food' },
  { icon: '⚽', label: 'Sports' },
  { icon: '🐾', label: 'Pets' },
]

const CENTRE_IMAGES = [
  '/Screenshot 2026-05-11 181232.png',
  '/house1.webp',
  '/car1.webp',
]

const SIDE_IMAGES = [
  '/laptoop1.webp',
  '/house2.webp',
  '/car2.webp',
  '/phone1.webp',
]

const HOW = [
  { step: '01', icon: '🔍', title: 'Browse Ads' },
  { step: '02', icon: '📞', title: 'Contact Seller' },
  { step: '03', icon: '🤝', title: 'Close the Deal' },
]

const Landing = () => {
  const navigate = useNavigate()
  const { ads, getSystemStats, dealsCount } = useAuth()
  const [slideIdx, setSlideIdx] = useState(0)
  const [stats, setStats] = useState({ totalSellers: 0, totalCategories: 0, totalAds: 0, totalUsers: 0, totalBuyers: 0 })

  useEffect(() => {
    getSystemStats().then(setStats)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setSlideIdx((i) => (i + 1) % CENTRE_IMAGES.length), 3500)
    return () => clearInterval(t)
  }, [])

  const categoryCounts = useMemo(() => {
    const map = {}
    ads.forEach((ad) => { map[ad.category] = (map[ad.category] || 0) + 1 })
    return map
  }, [ads])

  return (
    <div className="overflow-hidden">

      {/* ── Hero ── */}
      <section className="relative py-8 sm:py-10">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gold-400/10 blur-3xl dark:bg-gold-500/8" />
        </div>

        <div className="section">
          {/* Title */}
          <div className="mb-5 text-center animate-slide-up">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
              Buy & Sell on{' '}
              <span className="relative inline-block text-gold-500">
                RANGA
                <span className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-gold-400/40" />
              </span>
            </h1>
            <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
              Thousands of listings. Contact sellers via WhatsApp or phone.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <button onClick={() => navigate('/home')} className="btn btn-gold btn-lg">🔍 Browse Listings</button>
              <button onClick={() => navigate('/seller-landing')} className="btn btn-dark btn-lg">📢 Post Your Ad</button>
            </div>
          </div>

          {/* Categories — mobile: horizontal scroll pills, desktop: hidden (iri muri 3-col grid) */}
          <div className="mb-4 lg:hidden">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400">Categories</p>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.label}
                  onClick={() => navigate('/home')}
                  className="flex shrink-0 flex-col items-center gap-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-gold-400 hover:bg-gold-50 dark:border-slate-700 dark:bg-slate-800/60 dark:hover:border-gold-500 dark:hover:bg-gold-500/10"
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">{cat.label}</span>
                  {categoryCounts[cat.label] ? (
                    <span className="text-[10px] text-slate-400">{categoryCounts[cat.label]}</span>
                  ) : null}
                </button>
              ))}
            </div>
          </div>

          {/* 3-column hero */}
          <div className="grid gap-3 lg:grid-cols-[200px_1fr_220px]" style={{ height: '440px' }}>

            {/* Left — Categories: hidden kuri mobile (zigaragara hejuru) */}
            <div className="card hidden overflow-y-auto p-2.5 lg:block">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400">Categories</p>
              <div className="space-y-0.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.label}
                    onClick={() => navigate('/home')}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition hover:bg-gold-50 dark:hover:bg-gold-500/10"
                  >
                    <span className="text-sm">{cat.icon}</span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-slate-800 dark:text-slate-200">{cat.label}</p>
                      {categoryCounts[cat.label] ? (
                        <p className="text-[10px] text-slate-400">{categoryCounts[cat.label]} ads</p>
                      ) : null}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Centre — Slideshow nini (itamovinga) */}
            <div className="relative overflow-hidden rounded-2xl">
              {CENTRE_IMAGES.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt={`main ${i}`}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                    i === slideIdx ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              {/* Stats */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { value: ads.length, label: 'Listings' },
                    { value: stats.totalSellers, label: 'Sellers' },
                    { value: stats.totalCategories, label: 'Categories' },
                    { value: dealsCount, label: 'Deals' },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl bg-black/50 p-2 text-center backdrop-blur-sm">
                      <p className="text-lg font-extrabold text-gold-400">{s.value}</p>
                      <p className="text-[10px] text-white/80">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              {/* Dots */}
              <div className="absolute top-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                {CENTRE_IMAGES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSlideIdx(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === slideIdx ? 'w-5 bg-gold-400' : 'w-1.5 bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Right — Images grid + View All: hidden kuri mobile */}
            <div className="hidden flex-col gap-2 lg:flex">
              <div className="grid grid-cols-2 gap-2 flex-1">
                {SIDE_IMAGES.map((src, i) => (
                  <div key={i} className="overflow-hidden rounded-xl">
                    <img
                      src={src}
                      alt={`side ${i}`}
                      className="h-full w-full object-cover"
                      style={{ minHeight: '90px' }}
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate('/home')}
                className="btn btn-gold w-full"
              >
                View All Listings →
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-12 bg-gold-50/40 dark:bg-slate-950/60">
        <div className="section">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">How it works</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {HOW.map((s) => (
              <div key={s.step} className="card relative p-5 text-center">
                <span className="absolute -top-3 left-6 rounded-full bg-gold-500 px-3 py-0.5 text-xs font-bold text-slate-950">
                  {s.step}
                </span>
                <div className="mb-3 text-3xl">{s.icon}</div>
                <h3 className="font-bold text-slate-900 dark:text-white">{s.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-12">
        <div className="section">
          <div className="card overflow-hidden bg-gradient-to-br from-gold-500 to-gold-600 p-10 text-center shadow-gold-lg dark:from-gold-600 dark:to-gold-700">
            <h2 className="text-2xl font-extrabold text-slate-950">Start selling on RANGA</h2>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button onClick={() => navigate('/register')} className="btn btn-dark btn-lg">🚀 Sell Free</button>
              <button onClick={() => navigate('/home')} className="btn btn-lg border-2 border-slate-950/20 bg-transparent text-slate-950 hover:bg-slate-950/10">Browse</button>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Landing
