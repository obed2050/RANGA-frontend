import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const ProductDetails = () => {
  const { id }  = useParams()
  const { ads } = useAuth()
  const ad      = useMemo(() => ads.find((a) => a.id === id), [ads, id])

  if (!ad) {
    return (
      <div className="section flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <span className="text-5xl">🔍</span>
        <p className="page-label mt-4">Not Found</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">This ad doesn't exist.</h1>
        <Link to="/home" className="btn btn-gold mt-8">Back to Marketplace</Link>
      </div>
    )
  }

  const waLink = `https://wa.me/${ad.whatsapp}?text=${encodeURIComponent(
    `Hi ${ad.sellerName}, I saw your ad for "${ad.title}" on RANGA and would like more details.`
  )}`

  return (
    <div className="section py-10">
      <div className="mb-6">
        <Link to="/home" className="btn btn-ghost btn-sm">← Back to listings</Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">

        {/* Media + details */}
        <div className="space-y-6">
          <div className="card overflow-hidden p-0">
            {ad.mediaType === 'video' ? (
              <video className="h-80 w-full object-cover sm:h-96" src={ad.mediaUrl} controls muted playsInline />
            ) : (
              <img src={ad.mediaUrl} alt={ad.title} className="h-80 w-full object-cover sm:h-96" />
            )}
          </div>

          <div className="card p-6 space-y-4">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <span className="badge-slate">{ad.category}</span>
              <span className="badge-gold">{ad.subcategory}</span>
            </div>

            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{ad.title}</h1>
            <p className="leading-relaxed text-slate-600 dark:text-slate-300">{ad.description}</p>

            <div className="grid gap-4 sm:grid-cols-2 pt-2">
              <div className="card p-4">
                <p className="text-xs text-slate-400">Location</p>
                <p className="mt-1 font-semibold text-slate-900 dark:text-white">📍 {ad.location}</p>
              </div>
              <div className="card p-4">
                <p className="text-xs text-slate-400">Price</p>
                <p className="mt-1 text-xl font-bold text-gold-600 dark:text-gold-400">
                  {ad.price ? `$${ad.price}` : 'On request'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Seller contact */}
        <aside className="space-y-5">
          <div className="card p-6 space-y-5">
            {/* Seller info */}
            <div>
              <p className="page-label">Seller</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold-100 text-xl font-bold text-gold-700 dark:bg-gold-500/15 dark:text-gold-400">
                  {ad.sellerName?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{ad.sellerName}</p>
                  <p className="text-xs text-slate-400">Verified Seller</p>
                </div>
              </div>
            </div>

            <div className="divider" />

            {/* Contact */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Contact Seller</p>
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="btn btn-gold btn-lg w-full"
              >
                💬 Message on WhatsApp
              </a>
              <a
                href={`tel:${ad.phone}`}
                className="btn btn-dark btn-lg w-full"
              >
                📞 Call {ad.phone}
              </a>
            </div>

            <div className="divider" />

            {/* Quick facts */}
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-slate-700 dark:text-slate-300">Quick facts</p>
              <p className="text-slate-500 dark:text-slate-400">Category: {ad.category}</p>
              <p className="text-slate-500 dark:text-slate-400">Subcategory: {ad.subcategory}</p>
              <p className="text-slate-500 dark:text-slate-400">Visibility: Public marketplace</p>
            </div>
          </div>

          {/* Safety tip */}
          <div className="card border-gold-200/60 bg-gold-50/40 p-4 dark:border-gold-500/20 dark:bg-gold-500/5">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              🛡 <strong>Safety tip:</strong> Always meet in a public place and verify the product before payment.
              RANGA does not process payments.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default ProductDetails
