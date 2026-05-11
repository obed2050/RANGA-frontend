import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import AdCard from '../components/AdCard.jsx'
import SearchBar from '../components/SearchBar.jsx'

const PHRASES = [
  'Find the best ads near you',
  'Buy & sell anything locally',
  'Discover great deals today',
  'Connect with sellers directly',
  'Your local marketplace',
]

const useTypewriter = (phrases) => {
  const [text, setText] = useState('')
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = phrases[phraseIdx]
    const timeout = setTimeout(() => {
      if (!deleting) {
        setText(current.slice(0, charIdx + 1))
        if (charIdx + 1 === current.length) {
          setTimeout(() => setDeleting(true), 1500)
        } else {
          setCharIdx((c) => c + 1)
        }
      } else {
        setText(current.slice(0, charIdx - 1))
        if (charIdx - 1 === 0) {
          setDeleting(false)
          setPhraseIdx((i) => (i + 1) % phrases.length)
          setCharIdx(0)
        } else {
          setCharIdx((c) => c - 1)
        }
      }
    }, deleting ? 40 : 80)
    return () => clearTimeout(timeout)
  }, [charIdx, deleting, phraseIdx, phrases])

  return text
}

const HERO_IMAGES = [
  '/Screenshot 2026-05-11 181232.png',
  '/house1.webp',
  '/car1.webp',
]

const AdSkeleton = () => (
  <div className="card overflow-hidden">
    <div className="skeleton h-44 rounded-none" />
    <div className="space-y-3 p-3">
      <div className="skeleton h-4 w-3/4" />
      <div className="skeleton h-3 w-1/2" />
      <div className="flex gap-2">
        <div className="skeleton h-8 flex-1 rounded-xl" />
        <div className="skeleton h-8 flex-1 rounded-xl" />
      </div>
    </div>
  </div>
)

const Home = () => {
  const { ads } = useAuth()
  const [search, setSearch]         = useState('')
  const [category, setCategory]     = useState('All')
  const [subcategory, setSubcategory] = useState('All')
  const [loading, setLoading]       = useState(true)
  const typedText = useTypewriter(PHRASES)
  const [slideIdx, setSlideIdx] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setSlideIdx((i) => (i + 1) % HERO_IMAGES.length), 3500)
    return () => clearInterval(t)
  }, [])

  const categories    = useMemo(() => ['All', ...new Set(ads.map((a) => a.category))], [ads])
  const subcategories = useMemo(() => [
    'All',
    ...new Set(ads.filter((a) => category === 'All' || a.category === category).map((a) => a.subcategory)),
  ], [ads, category])

  const filtered = useMemo(() =>
    ads.filter((ad) => {
      const q = search.toLowerCase()
      const matchSearch = [ad.title, ad.description, ad.category, ad.subcategory].join(' ').toLowerCase().includes(q)
      const matchCat    = category    === 'All' || ad.category    === category
      const matchSub    = subcategory === 'All' || ad.subcategory === subcategory
      return matchSearch && matchCat && matchSub
    }),
  [ads, search, category, subcategory])

  const clearAll = () => { setSearch(''); setCategory('All'); setSubcategory('All') }

  return (
    <div className="section py-6">

      {/* Hero mini */}
      <div className="relative mb-5 overflow-hidden rounded-2xl" style={{ height: '180px' }}>
        {HERO_IMAGES.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`hero ${i}`}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              i === slideIdx ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-6">
          <p className="page-label text-gold-400">Marketplace</p>
          <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
            {typedText}<span className="animate-pulse text-gold-400">|</span>
          </h1>
        </div>
        <div className="absolute bottom-2 right-3 flex gap-1">
          {HERO_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlideIdx(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === slideIdx ? 'w-4 bg-gold-400' : 'w-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <SearchBar search={search} setSearch={setSearch} />
      </div>

      {/* Category pills */}
      <div className="mb-4 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => { setCategory(cat); setSubcategory('All') }}
            className={`pill ${category === cat ? 'pill-active' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Subcategory pills */}
      {subcategories.length > 2 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {subcategories.map((sub) => (
            <button
              key={sub}
              onClick={() => setSubcategory(sub)}
              className={`pill text-xs ${subcategory === sub ? 'pill-active' : ''}`}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      {/* Result count */}
      {!loading && (
        <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
          {filtered.length} listing{filtered.length !== 1 ? 's' : ''} found
        </p>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
          {[...Array(14)].map((_, i) => <AdSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card flex flex-col items-center py-20 text-center">
          <span className="text-5xl">🔍</span>
          <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">No listings found</h3>
          <p className="mt-2 text-sm text-slate-500">Try adjusting your search or filters.</p>
          <button onClick={clearAll} className="btn btn-gold mt-6">Clear filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
          {filtered.map((ad) => <AdCard key={ad.id} ad={ad} />)}
        </div>
      )}
    </div>
  )
}

export default Home
