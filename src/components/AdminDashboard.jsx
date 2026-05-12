import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../api/axios.js'

const AdminDashboard = () => {
  const { getSystemStats, ads, getAllUsers, comments, replyComment, dealsCount } = useAuth()
  const [stats, setStats] = useState({ totalUsers: 0, totalSellers: 0, totalBuyers: 0, totalAds: 0, totalCategories: 0 })
  const [allUsers, setAllUsers] = useState([])
  const [conversations, setConversations] = useState([])
  const [activeConv, setActiveConv] = useState(null) // { userId, fullName }
  const [convMessages, setConvMessages] = useState([])
  const [adminMsg, setAdminMsg] = useState('')
  const [replyText, setReplyText] = useState({})
  const chatBoxRef = useRef(null)
  const recentAds = ads.slice(0, 5)

  useEffect(() => {
    getSystemStats().then(setStats)
    getAllUsers().then(setAllUsers)
    fetchConversations()
  }, [])

  // Refresh conversations buri segundu 5
  useEffect(() => {
    const t = setInterval(() => {
      fetchConversations()
      if (activeConv) fetchConvMessages(activeConv.userId)
    }, 5000)
    return () => clearInterval(t)
  }, [activeConv])

  useEffect(() => {
    if (chatBoxRef.current) chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight
  }, [convMessages])

  const fetchConversations = async () => {
    try {
      const res = await api.get('/api/chat/conversations')
      setConversations(res.data)
    } catch { /* ignore */ }
  }

  const fetchConvMessages = async (userId) => {
    try {
      const res = await api.get(`/api/chat/user/${userId}`)
      setConvMessages(res.data.map((m) => ({
        ...m,
        time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      })))
    } catch { /* ignore */ }
  }

  const openConversation = (conv) => {
    setActiveConv(conv)
    fetchConvMessages(conv.userId)
  }

  const sendAdminReply = async () => {
    if (!adminMsg.trim() || !activeConv) return
    const msg = { id: Date.now(), from: 'admin', text: adminMsg, senderName: 'Admin', time: 'now' }
    setConvMessages((c) => [...c, msg])
    setAdminMsg('')
    try {
      await api.post('/api/chat/reply', { text: adminMsg, userId: activeConv.userId })
    } catch { /* ignore */ }
  }

  const recentUsers = allUsers.slice(0, 5)

  const StatCard = ({ label, value, icon }) => (
    <div className="rounded-[20px] border border-slate-800/80 bg-slate-900/70 p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-3 text-4xl font-bold text-white">{value}</p>
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

      {/* Live Chat — Private Conversations */}
      <div className="rounded-[20px] border border-slate-800/80 bg-slate-900/70 shadow-soft overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-800">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <h3 className="text-lg font-semibold text-white">Live Chat — Private Conversations</h3>
          <span className="ml-auto text-xs text-slate-500">{conversations.length} conversation{conversations.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr]" style={{ height: '420px' }}>

          {/* Left — Conversations list */}
          <div className="border-r border-slate-800 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 text-sm">
                <span className="text-3xl mb-2">💬</span>
                No conversations yet
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.userId}
                  onClick={() => openConversation(conv)}
                  className={`w-full text-left px-4 py-3 border-b border-slate-800/50 transition hover:bg-slate-800/50 ${
                    activeConv?.userId === conv.userId ? 'bg-slate-800/80 border-l-2 border-l-emerald-500' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-sm font-bold text-emerald-300">
                      {conv.fullName?.[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white truncate">{conv.fullName}</p>
                      <p className="text-xs text-slate-500 truncate">{conv.lastMessage}</p>
                    </div>
                    {conv.unread > 0 && (
                      <span className="shrink-0 rounded-full bg-emerald-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Right — Chat window */}
          <div className="flex flex-col">
            {!activeConv ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-500">
                <span className="text-4xl mb-3">👈</span>
                <p className="text-sm">Select a conversation to start chatting</p>
              </div>
            ) : (
              <>
                {/* Chat header */}
                <div className="flex items-center gap-3 border-b border-slate-800 px-4 py-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-sm font-bold text-emerald-300">
                    {activeConv.fullName?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{activeConv.fullName}</p>
                    <p className="text-xs text-slate-500">{activeConv.email}</p>
                  </div>
                </div>

                {/* Messages */}
                <div ref={chatBoxRef} className="flex-1 overflow-y-auto space-y-2 p-4">
                  {convMessages.map((m) => (
                    <div key={m.id} className={`flex ${m.from === 'admin' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`rounded-xl px-3 py-2 text-sm max-w-[75%] ${
                        m.from === 'admin'
                          ? 'bg-emerald-500/20 text-emerald-100'
                          : 'bg-slate-700 text-white'
                      }`}>
                        {m.from !== 'admin' && (
                          <p className="text-[10px] font-bold text-slate-400 mb-0.5">{m.senderName}</p>
                        )}
                        {m.text}
                        <p className="text-[10px] mt-0.5 opacity-50">{m.time}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply input */}
                <div className="flex gap-2 border-t border-slate-800 p-3">
                  <input
                    value={adminMsg}
                    onChange={(e) => setAdminMsg(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendAdminReply()}
                    placeholder={`Reply to ${activeConv.fullName}...`}
                    className="input bg-slate-800 border-slate-700 text-white text-sm"
                  />
                  <button onClick={sendAdminReply} className="btn btn-gold">Send</button>
                </div>
              </>
            )}
          </div>
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
