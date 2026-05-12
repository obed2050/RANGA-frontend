import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

const AdminDashboard = () => {
  const { getSystemStats, ads, getAllUsers, comments, replyComment, chatMessages, sendChatMessage, dealsCount, fetchChat } = useAuth()
  const [stats, setStats] = useState({ totalUsers: 0, totalSellers: 0, totalBuyers: 0, totalAds: 0, totalCategories: 0 })
  const [allUsers, setAllUsers] = useState([])
  const recentAds = ads.slice(0, 5)
  const [replyText, setReplyText] = useState({})
  const [adminMsg, setAdminMsg] = useState('')
  const chatEndRef = useRef(null)

  useEffect(() => {
    getSystemStats().then(setStats)
    getAllUsers().then(setAllUsers)
  }, [])

  // Refresh chat buri segundu 5
  useEffect(() => {
    const interval = setInterval(() => {
      fetchChat && fetchChat()
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const recentUsers = allUsers.slice(0, 5)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const StatCard = ({ label, value, color, icon }) => (
    <div className={`rounded-[20px] border border-slate-800/80 bg-slate-900/70 p-6 shadow-soft ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-3 text-4xl font-bold">{value}</p>
        </div>
        <div className="text-5xl opacity-20">{icon}</div>
      </div>
    </div>
  )

  return (
    <section className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white">Dashboard Overview</h2>
        <p className="mt-2 text-slate-400">System metrics and key performance indicators</p>
      </div>

      {/* Main Statistics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <StatCard label="Total Users" value={stats.totalUsers} color="" icon="👥" />
        <StatCard label="Sellers" value={stats.totalSellers} color="" icon="🏪" />
        <StatCard label="Buyers" value={stats.totalBuyers} color="" icon="🛍️" />
        <StatCard label="Total Ads" value={stats.totalAds} color="" icon="📋" />
        <StatCard label="Categories" value={stats.totalCategories} color="" icon="📂" />
        <StatCard label="Deals Done" value={dealsCount} color="" icon="🤝" />
        <StatCard label="Published" value={ads.length} color="" icon="✅" />
      </div>

      {/* Charts Section (Mockup) */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* User Growth Chart */}
        <div className="rounded-[20px] border border-slate-800/80 bg-slate-900/70 p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-white">User Growth (Last 30 Days)</h3>
          <div className="mt-6 space-y-4">
            <div className="flex items-end gap-2">
              {[45, 52, 48, 61, 70, 68, 75].map((height, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-emerald-500/60"
                  style={{ height: `${height}px` }}
                  title={`Day ${i + 1}`}
                />
              ))}
            </div>
            <p className="text-xs text-slate-500">Mon → Sun</p>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="rounded-[20px] border border-slate-800/80 bg-slate-900/70 p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-white">Top Categories</h3>
          <div className="mt-6 space-y-3">
            {['Services', 'Products', 'Electronics', 'Fashion'].map((cat, i) => (
              <div key={cat} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">{cat}</span>
                    <span className="text-emerald-300">{(75 - i * 15)}%</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-slate-800">
                    <div
                      className="h-2 rounded-full bg-emerald-500"
                      style={{ width: `${75 - i * 15}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Users */}
        <div className="rounded-[20px] border border-slate-800/80 bg-slate-900/70 p-6 shadow-soft">
          <h3 className="mb-4 text-lg font-semibold text-white">Recent Users</h3>
          <div className="space-y-3">
            {recentUsers.map((u) => (
              <div key={u.id} className="flex items-center justify-between rounded-lg bg-slate-950/50 p-3">
                <div>
                  <p className="text-sm font-medium text-white">{u.fullName}</p>
                  <p className="text-xs text-slate-500">{u.email}</p>
                </div>
                <span className="text-xs font-semibold text-emerald-300">{u.role}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Ads */}
        <div className="rounded-[20px] border border-slate-800/80 bg-slate-900/70 p-6 shadow-soft">
          <h3 className="mb-4 text-lg font-semibold text-white">Recent Ads</h3>
          <div className="space-y-3">
            {recentAds.map((ad) => (
              <div key={ad.id} className="flex items-center gap-3 rounded-lg bg-slate-950/50 p-3">
                <div className="h-12 w-12 overflow-hidden rounded bg-slate-800">
                  {ad.mediaType === 'video' ? (
                    <video src={ad.mediaUrl} className="h-full w-full object-cover" muted />
                  ) : (
                    <img src={ad.mediaUrl} alt={ad.title} className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white line-clamp-1">{ad.title}</p>
                  <p className="text-xs text-slate-500">{ad.sellerName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Chat — Admin Side */}
      <div className="rounded-[20px] border border-slate-800/80 bg-slate-900/70 p-6 shadow-soft">
        <div className="flex items-center gap-2 mb-4">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <h3 className="text-lg font-semibold text-white">Live Chat — User Messages</h3>
        </div>
        <div className="h-64 overflow-y-auto space-y-2 mb-3 pr-1">
          {chatMessages.map((m) => (
            <div key={m.id} className={`flex ${m.from === 'admin' ? 'justify-end' : 'justify-start'}`}>
              <div className={`rounded-xl px-3 py-2 text-sm max-w-[75%] ${
                m.from === 'admin'
                  ? 'bg-gold-500 text-slate-950'
                  : m.from === 'support'
                  ? 'bg-slate-800 text-slate-300'
                  : 'bg-slate-700 text-white'
              }`}>
                {m.from === 'user' && <p className="text-[10px] font-bold text-slate-400 mb-0.5">User</p>}
                {m.from === 'support' && <p className="text-[10px] font-bold text-slate-500 mb-0.5">Support</p>}
                {m.text}
                <p className="text-[10px] mt-0.5 opacity-60">{m.time}</p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <div className="flex gap-2">
          <input
            value={adminMsg}
            onChange={(e) => setAdminMsg(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && adminMsg.trim()) {
                sendChatMessage(adminMsg, true)
                setAdminMsg('')
              }
            }}
            placeholder="Reply as Admin..."
            className="input bg-slate-800 border-slate-700 text-white text-sm"
          />
          <button
            onClick={() => {
              if (adminMsg.trim()) {
                sendChatMessage(adminMsg, true)
                setAdminMsg('')
              }
            }}
            className="btn btn-gold"
          >
            Send
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <div className="rounded-[20px] border border-slate-800/80 bg-slate-900/70 p-6 shadow-soft">
        <h3 className="mb-4 text-lg font-semibold text-white">💬 User Comments ({comments.length})</h3>
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
          {comments.length === 0 && (
            <p className="text-sm text-slate-500">No comments yet.</p>
          )}
          {comments.map((c) => (
            <div key={c.id} className="rounded-xl bg-slate-950/50 p-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-semibold text-white">{c.name}</p>
                <span className="text-xs text-slate-500">{c.time}</span>
              </div>
              <p className="text-sm text-slate-400">{c.text}</p>

              {/* Existing replies */}
              {c.replies?.length > 0 && (
                <div className="mt-3 space-y-1.5 border-l-2 border-gold-500 pl-3">
                  {c.replies.map((r) => (
                    <div key={r.id}>
                      <p className="text-xs font-semibold text-gold-400">🛡 {r.from}</p>
                      <p className="text-xs text-slate-400">{r.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply input */}
              <div className="mt-3 flex gap-2">
                <input
                  value={replyText[c.id] || ''}
                  onChange={(e) => setReplyText((p) => ({ ...p, [c.id]: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && replyText[c.id]?.trim()) {
                      replyComment(c.id, replyText[c.id])
                      setReplyText((p) => ({ ...p, [c.id]: '' }))
                    }
                  }}
                  placeholder="Reply as Admin..."
                  className="input py-1.5 text-xs bg-slate-800 border-slate-700 text-white"
                />
                <button
                  onClick={() => {
                    if (replyText[c.id]?.trim()) {
                      replyComment(c.id, replyText[c.id])
                      setReplyText((p) => ({ ...p, [c.id]: '' }))
                    }
                  }}
                  className="btn btn-gold btn-sm px-3"
                >
                  Reply
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[20px] border border-slate-800/80 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 p-6 shadow-soft">
          <p className="text-sm text-slate-400">Avg Users/Day</p>
          <p className="mt-2 text-3xl font-bold text-emerald-300">{Math.round(stats.totalUsers / 7)}</p>
          <p className="mt-2 text-xs text-slate-500">↑ 12% from last week</p>
        </div>
        <div className="rounded-[20px] border border-slate-800/80 bg-gradient-to-br from-blue-500/10 to-blue-500/5 p-6 shadow-soft">
          <p className="text-sm text-slate-400">Ads/User</p>
          <p className="mt-2 text-3xl font-bold text-blue-300">
            {(stats.totalAds / stats.totalUsers || 0).toFixed(1)}
          </p>
          <p className="mt-2 text-xs text-slate-500">Average listing per user</p>
        </div>
        <div className="rounded-[20px] border border-slate-800/80 bg-gradient-to-br from-purple-500/10 to-purple-500/5 p-6 shadow-soft">
          <p className="text-sm text-slate-400">Seller Rate</p>
          <p className="mt-2 text-3xl font-bold text-purple-300">
            {((stats.totalSellers / stats.totalUsers) * 100 || 0).toFixed(1)}%
          </p>
          <p className="mt-2 text-xs text-slate-500">Of total users</p>
        </div>
      </div>
    </section>
  )
}

export default AdminDashboard
