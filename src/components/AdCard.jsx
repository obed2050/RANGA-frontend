import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const Heart = ({ filled }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
)

const LoginPromptModal = ({ onClose, adTitle }) => {
  const navigate = useNavigate()
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-500/15 text-3xl mx-auto">
          🔐
        </div>

        <h2 className="text-center text-lg font-bold text-white">Login Required</h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Ugomba gukora login kugirango ubone amakuru ya seller w'iyi ad:
        </p>
        <p className="mt-1 text-center text-xs font-medium text-gold-400 line-clamp-2">
          "{adTitle}"
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => { onClose(); navigate('/login') }}
            className="btn btn-gold btn-lg w-full"
          >
            🔑 Login
          </button>
          <button
            onClick={() => { onClose(); navigate('/register') }}
            className="btn btn-dark btn-lg w-full"
          >
            🚀 Create Account
          </button>
          <button
            onClick={onClose}
            className="text-center text-sm text-slate-500 hover:text-slate-300 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

const AdCard = ({ ad, onEdit, onDelete }) => {
  const [saved, setSaved] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const { user, recordDeal } = useAuth()

  const waLink = `https://wa.me/${ad.whatsapp}?text=${encodeURIComponent(
    `Hi ${ad.sellerName}, I saw your ad for "${ad.title}" on RANGA and would like more details.`
  )}`

  const handleContact = (e, action) => {
    if (!user) {
      e.preventDefault()
      setShowLoginModal(true)
      return
    }
    recordDeal()
    if (action === 'call') {
      window.location.href = `tel:${ad.phone}`
    }
  }

  return (
    <>
      <article className="card-hover group relative flex flex-col overflow-hidden">
        {/* Save button */}
        <button
          type="button"
          aria-label={saved ? 'Unsave' : 'Save'}
          onClick={() => setSaved((c) => !c)}
          className={`absolute right-2.5 top-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-sm transition ${
            saved
              ? 'bg-gold-500 text-white shadow-gold'
              : 'bg-white/80 text-slate-400 hover:text-gold-500 dark:bg-slate-900/80'
          }`}
        >
          <Heart filled={saved} />
        </button>

        {/* Media */}
        <Link to={`/product/${ad.id}`} className="relative block h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
          {ad.mediaType === 'video' ? (
            <video className="h-full w-full object-cover" src={ad.mediaUrl} muted playsInline preload="metadata" />
          ) : (
            <img src={ad.mediaUrl} alt={ad.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent px-3 pb-3 pt-8">
            <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-white">{ad.title}</h3>
          </div>
        </Link>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-3 p-3">
          {/* Badges */}
          <div className="flex flex-wrap gap-1.5">
            <span className="badge-slate">{ad.category}</span>
            {ad.subcategory && <span className="badge badge-gold">{ad.subcategory}</span>}
          </div>

          {/* Price + location */}
          <div className="flex items-end justify-between gap-2">
            <div>
              {ad.price ? (
                <p className="text-base font-bold text-gold-600 dark:text-gold-400">
                  {ad.currency || 'RWF'} {Number(ad.price).toLocaleString()}
                </p>
              ) : (
                <p className="text-xs text-slate-400">Price on request</p>
              )}
              {ad.location && <p className="mt-0.5 text-xs text-slate-400">📍 {ad.location}</p>}
            </div>
            {ad.sellerName && <p className="truncate text-xs text-slate-400">{ad.sellerName}</p>}
          </div>

          {/* CTA */}
          <div className="flex gap-2">
            {/* WhatsApp */}
            {user ? (
              <a href={waLink} target="_blank" rel="noreferrer" onClick={recordDeal}
                className="btn btn-gold btn-sm flex-1">
                💬 WhatsApp
              </a>
            ) : (
              <button onClick={(e) => handleContact(e, 'whatsapp')}
                className="btn btn-gold btn-sm flex-1">
                💬 WhatsApp
              </button>
            )}

            {/* Call */}
            {user ? (
              <a href={`tel:${ad.phone}`} onClick={recordDeal}
                className="btn btn-dark btn-sm flex-1">
                📞 Call
              </a>
            ) : (
              <button onClick={(e) => handleContact(e, 'call')}
                className="btn btn-dark btn-sm flex-1">
                📞 Call
              </button>
            )}
          </div>

          {/* Edit / Delete */}
          {(onEdit || onDelete) && (
            <div className="flex gap-2 border-t border-slate-100 pt-2 dark:border-slate-800">
              {onEdit && (
                <button type="button" onClick={() => onEdit(ad)} className="btn btn-gold-outline btn-sm flex-1">
                  Edit
                </button>
              )}
              {onDelete && (
                <button type="button" onClick={() => onDelete(ad.id)}
                  className="btn btn-sm flex-1 border border-slate-200 text-slate-500 hover:border-red-400 hover:text-red-500 dark:border-slate-700 dark:text-slate-400">
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </article>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginPromptModal
          adTitle={ad.title}
          onClose={() => setShowLoginModal(false)}
        />
      )}
    </>
  )
}

export default AdCard
