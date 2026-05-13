import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const Footer = () => {
  const { chatMessages, sendChatMessage, user, fetchChat } = useAuth()
  const navigate = useNavigate()
  const [chatMsg, setChatMsg] = useState('')
  const chatBoxRef = useRef(null)

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight
    }
  }, [chatMessages])

  // Refresh messages buri segundu 5 kugirango user abone replies za admin
  useEffect(() => {
    if (!user) return
    const t = setInterval(() => fetchChat(), 5000)
    return () => clearInterval(t)
  }, [user])

  const send = () => {
    if (!chatMsg.trim()) return
    if (!user) {
      navigate('/login')
      return
    }
    sendChatMessage(chatMsg, false)
    setChatMsg('')
  }

  return (
    <footer className="border-t border-slate-200/80 bg-white dark:border-slate-800/80 dark:bg-[#0d0f14]">
      <div className="section py-10">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr_1fr_1.6fr_1.6fr]">

          {/* Brand */}
          <div className="space-y-3">
            <img src="/RANGA_LOGO-removebg-preview.png" alt="RANGA" className="h-10 w-auto" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Local marketplace — buy & sell via WhatsApp or phone.
            </p>

            <div className="space-y-2 pt-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-gold-600 dark:text-gold-400">About</p>
              <p className="text-xs text-slate-500 dark:text-slate-500">
                RANGA is a trusted local marketplace connecting buyers and sellers across the region. No middlemen, no hidden fees — just direct deals.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="badge-gold">🛡 Trusted</span>
              <span className="badge-gold">⚡ Fast</span>
              <span className="badge-gold">🆓 Free</span>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <a href="https://wa.me/250796449412" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-green-500 transition">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-500 transition">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-pink-500 transition">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="https://x.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/></svg>
              </a>
            </div>
          </div>

          {/* Navigate */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Navigate</p>
            <Link to="/home" className="block text-sm text-slate-600 transition hover:text-gold-600 dark:text-slate-400 dark:hover:text-gold-400">Browse Ads</Link>
            <Link to="/seller-landing" className="block text-sm text-slate-600 transition hover:text-gold-600 dark:text-slate-400 dark:hover:text-gold-400">Become a Seller</Link>
            <Link to="/register" className="block text-sm text-slate-600 transition hover:text-gold-600 dark:text-slate-400 dark:hover:text-gold-400">Post an Ad</Link>
            <Link to="/" className="block text-sm text-slate-600 transition hover:text-gold-600 dark:text-slate-400 dark:hover:text-gold-400">Home</Link>
          </div>

          {/* Sellers */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Sellers</p>
            <Link to="/login" className="block text-sm text-slate-600 transition hover:text-gold-600 dark:text-slate-400 dark:hover:text-gold-400">Login</Link>
            <Link to="/register" className="block text-sm text-slate-600 transition hover:text-gold-600 dark:text-slate-400 dark:hover:text-gold-400">Sign Up</Link>
            <Link to="/dashboard" className="block text-sm text-slate-600 transition hover:text-gold-600 dark:text-slate-400 dark:hover:text-gold-400">Dashboard</Link>
            <Link to="/upload" className="block text-sm text-slate-600 transition hover:text-gold-600 dark:text-slate-400 dark:hover:text-gold-400">Upload Ad</Link>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Contact</p>

            <div className="space-y-2">
              <a href="mailto:info@ranga.com" className="flex items-center gap-2 text-sm text-slate-600 transition hover:text-gold-600 dark:text-slate-400 dark:hover:text-gold-400">
                📧 info@ranga.com
              </a>
              <a href="tel:+250796449412" className="flex items-center gap-2 text-sm text-slate-600 transition hover:text-gold-600 dark:text-slate-400 dark:hover:text-gold-400">
                📞 +250796449412
              </a>
              <a href="https://wa.me/250796449412" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-slate-600 transition hover:text-gold-600 dark:text-slate-400 dark:hover:text-gold-400">
                💬 WhatsApp Us
              </a>
            </div>

            {/* Live Chat */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 border-b border-slate-200 px-3 py-2 dark:border-slate-700">
                <span className={`h-2 w-2 rounded-full ${user ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`} />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Live Chat</p>
                {user && <span className="ml-auto text-[10px] text-slate-400">{user.fullName}</span>}
              </div>

              {!user ? (
                // Utakoze login — garagaza message yo gukora login
                <div className="flex flex-col items-center justify-center gap-3 p-4 text-center">
                  <span className="text-2xl">🔐</span>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Login kugirango ucatinge na support</p>
                  <button
                    onClick={() => navigate('/login')}
                    className="btn btn-gold btn-sm w-full"
                  >
                    Login to Chat
                  </button>
                </div>
              ) : (
                // Wakoze login — garagaza messages ze gusa
                <>
                  <div ref={chatBoxRef} className="h-28 overflow-y-auto space-y-1.5 p-2">
                    {chatMessages.map((m) => (
                      <div key={m.id} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`rounded-lg px-2.5 py-1 text-xs max-w-[80%] ${
                          m.from === 'user'
                            ? 'bg-gold-500 text-slate-950'
                            : m.from === 'admin'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          {m.from === 'admin' && <p className="text-[10px] font-bold mb-0.5">🛡 Admin</p>}
                          {m.text}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-1.5 border-t border-slate-200 p-2 dark:border-slate-700">
                    <input
                      value={chatMsg}
                      onChange={(e) => setChatMsg(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && send()}
                      placeholder="Type a message..."
                      className="input py-1.5 text-xs"
                    />
                    <button onClick={send} className="btn btn-gold btn-sm px-3">→</button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Get Help */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Get Help</p>
            <div className="space-y-2">
              {[
                { icon: '❓', label: 'How to post an ad', desc: 'Register, go to Upload, fill details & submit.' },
                { icon: '📞', label: 'Contact a seller', desc: 'Click WhatsApp or Call on any listing card.' },
                { icon: '🔑', label: 'Forgot password', desc: 'Contact support via live chat.' },
                { icon: '🛡', label: 'Report a listing', desc: 'Use the flag icon on the product page.' },
                { icon: '💼', label: 'Seller dashboard', desc: 'Login and go to Dashboard to manage ads.' },
                { icon: '💬', label: 'Live Chat', desc: null, link: true },
              ].map((h) => (
                <div key={h.label} className="flex items-start gap-2">
                  <span className="text-sm">{h.icon}</span>
                  <div>
                    {h.link ? (
                      <button
                        onClick={() => document.querySelector('footer input[placeholder="Type a message..."]')?.focus()}
                        className="text-xs font-semibold text-gold-600 hover:text-gold-500 dark:text-gold-400 dark:hover:text-gold-300"
                      >
                        {h.label} — chat with us now →
                      </button>
                    ) : (
                      <>
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{h.label}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-500">{h.desc}</p>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="mt-8 flex items-center justify-between border-t border-slate-200/80 pt-5 text-xs text-slate-500 dark:border-slate-800/80">
          <p>© 2026 RANGA</p>
          <p className="text-gold-600/70 dark:text-gold-500/70">Your Local Marketplace</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
