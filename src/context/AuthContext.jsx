import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import api from '../api/axios.js'
import sampleAds from '../data/ads.js'

const AuthContext = createContext(null)

const LOCAL_USER = 'ranga_user'
const LOCAL_TOKEN = 'ranga_token'
const LOCAL_COMMENTS = 'ranga_comments'
const LOCAL_CHAT = 'ranga_chat'
const LOCAL_DEALS = 'ranga_deals'

const INITIAL_COMMENTS = [
  { id: 1, name: 'Amina K.', text: 'Great marketplace! Found exactly what I needed.', time: '2h ago', likes: 4, replies: [] },
  { id: 2, name: 'Brian M.', text: 'Easy to use and fast. Love RANGA!', time: '5h ago', likes: 7, replies: [] },
  { id: 3, name: 'Grace W.', text: 'Sold my sofa in 2 days. Highly recommend!', time: '1d ago', likes: 12, replies: [] },
  { id: 4, name: 'Hassan A.', text: 'Found a great car deal here. Very legit sellers.', time: '2d ago', likes: 9, replies: [] },
]

const getLocalJson = (key, fallback) => {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}
const saveLocalJson = (key, value) => localStorage.setItem(key, JSON.stringify(value))

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getLocalJson(LOCAL_USER, null))
  const [token, setToken] = useState(() => localStorage.getItem(LOCAL_TOKEN))
  const [ads, setAds] = useState(sampleAds)
  const [loadingAds, setLoadingAds] = useState(false)

  // Siba localStorage ya kera (Kenya locations)
  useEffect(() => {
    const version = localStorage.getItem('ranga_ads_version')
    if (version !== '3') {
      localStorage.removeItem('ranga_ads')
      localStorage.setItem('ranga_ads_version', '3')
    }
  }, [])
  const [comments, setComments] = useState(() => getLocalJson(LOCAL_COMMENTS, INITIAL_COMMENTS))
  const [chatMessages, setChatMessages] = useState([
    { id: 1, from: 'support', text: 'Hi! How can we help you today?', time: 'now' },
  ])

  // Fetch chat messages from backend
  const fetchChat = async () => {
    try {
      const res = await api.get('/api/chat')
      if (res.data?.length > 0) {
        setChatMessages(res.data.map((m) => ({
          id: m.id,
          from: m.from,
          text: m.text,
          senderName: m.senderName,
          time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        })))
      }
    } catch { /* use default */ }
  }

  useEffect(() => {
    if (token) fetchChat()
  }, [token])
  const [dealsCount, setDealsCount] = useState(() => getLocalJson(LOCAL_DEALS, 0))

  useEffect(() => { saveLocalJson(LOCAL_COMMENTS, comments) }, [comments])
  useEffect(() => { saveLocalJson(LOCAL_DEALS, dealsCount) }, [dealsCount])

  useEffect(() => {
    if (user) saveLocalJson(LOCAL_USER, user)
    else localStorage.removeItem(LOCAL_USER)
    if (token) localStorage.setItem(LOCAL_TOKEN, token)
    else localStorage.removeItem(LOCAL_TOKEN)
  }, [user, token])

  // Fetch listings from backend
  const fetchAds = async () => {
    setLoadingAds(true)
    try {
      const res = await api.get('/api/listings?limit=100')
      const rows = res.data?.data || []
      if (rows.length > 0) {
        // normalize backend listing to frontend ad shape
        setAds(rows.map(normalizeListingToAd))
      } else {
        setAds(sampleAds)
      }
    } catch {
      setAds(sampleAds)
    } finally {
      setLoadingAds(false)
    }
  }

  useEffect(() => { fetchAds() }, [])

  const normalizeListingToAd = (l) => ({
    id: String(l.id),
    title: l.title,
    description: l.description,
    price: l.price,
    currency: l.currency || 'RWF',
    category: l.category?.name || l.categoryName || 'General',
    subcategory: l.subcategory || '',
    location: l.location || '',
    sellerName: l.seller?.fullName || 'Seller',
    sellerId: String(l.seller?.id || l.userId),
    whatsapp: l.whatsapp || l.seller?.phoneNumber?.replace(/\D/g, '') || '250700000000',
    phone: l.phone || l.seller?.phoneNumber || '0700000000',
    mediaType: l.mediaType || 'image',
    mediaUrl: l.mediaUrl || (l.images?.[0]) || '',
    status: l.status || 'active',
    createdAt: l.createdAt,
  })

  const login = async ({ email, password }) => {
    const res = await api.post('/api/auth/login', { email, password })
    const { token: t, user: u } = res.data
    setToken(t)
    setUser(u)
    return u
  }

  const signup = async ({ fullName, email, phoneNumber, whatsappNumber, location, gender, password, role }) => {
    const res = await api.post('/api/auth/register', {
      fullName, email, phoneNumber, whatsappNumber, location, gender, password, role,
    })
    const { token: t, user: u } = res.data
    setToken(t)
    setUser(u)
    return u
  }

  const logout = () => {
    setUser(null)
    setToken(null)
  }

  const addAd = async (newAd) => {
    try {
      const res = await api.post('/api/listings', {
        title: newAd.title,
        description: newAd.description,
        price: newAd.price || null,
        currency: newAd.currency,
        type: 'sell',
        location: newAd.location,
        subcategory: newAd.subcategory,
        whatsapp: newAd.whatsapp,
        phone: newAd.phone,
        mediaType: newAd.mediaType,
        mediaUrl: newAd.mediaUrl,
      })
      setAds((current) => [normalizeListingToAd(res.data), ...current])
    } catch {
      // fallback: add locally if backend fails
      setAds((current) => [newAd, ...current])
    }
  }

  const updateAd = async (updatedAd) => {
    try {
      await api.put(`/api/listings/${updatedAd.id}`, {
        title: updatedAd.title,
        description: updatedAd.description,
        price: updatedAd.price || null,
        currency: updatedAd.currency,
        location: updatedAd.location,
        subcategory: updatedAd.subcategory,
        whatsapp: updatedAd.whatsapp,
        phone: updatedAd.phone,
        mediaType: updatedAd.mediaType,
        mediaUrl: updatedAd.mediaUrl,
      })
    } catch { /* ignore */ }
    setAds((current) => current.map((ad) => (ad.id === updatedAd.id ? updatedAd : ad)))
  }

  const deleteAd = async (id) => {
    try {
      await api.delete(`/api/listings/${id}`)
    } catch { /* ignore */ }
    setAds((current) => current.filter((ad) => ad.id !== id && String(ad.id) !== String(id)))
  }

  const sellerAds = useMemo(
    () => (user?.role === 'seller' ? ads.filter((ad) => String(ad.sellerId) === String(user.id)) : []),
    [ads, user],
  )

  // Admin: fetch users from backend
  const createUser = async (data) => {
    const res = await api.post('/api/admin/users', data)
    return res.data
  }

  const getAllUsers = async () => {
    try {
      const res = await api.get('/api/admin/users')
      return res.data
    } catch {
      return []
    }
  }

  const deleteUser = async (userId) => {
    await api.delete(`/api/admin/users/${userId}`)
    setAds((current) => current.filter((ad) => String(ad.sellerId) !== String(userId)))
  }

  const updateUser = async (userId, updates) => {
    await api.put(`/api/admin/users/${userId}`, updates)
  }

  const updateProfile = async (updates) => {
    try {
      await api.put(`/api/admin/users/${user.id}`, updates)
    } catch { /* ignore */ }
    setUser((u) => ({ ...u, ...updates }))
  }

  const getSystemStats = async () => {
    try {
      const [usersRes, listingsRes] = await Promise.all([
        api.get('/api/admin/users'),
        api.get('/api/listings?limit=1'),
      ])
      const users = usersRes.data
      const sellers = users.filter((u) => u.role === 'seller')
      const buyers = users.filter((u) => u.role === 'buyer')
      return {
        totalUsers: users.length,
        totalSellers: sellers.length,
        totalBuyers: buyers.length,
        totalAds: listingsRes.data?.total || ads.length,
        totalCategories: new Set(ads.map((ad) => ad.category)).size,
      }
    } catch {
      return {
        totalUsers: 0, totalSellers: 0, totalBuyers: 0,
        totalAds: ads.length,
        totalCategories: new Set(ads.map((ad) => ad.category)).size,
      }
    }
  }

  const addComment = (name, text) => {
    setComments((c) => [{ id: Date.now(), name, text, time: 'Just now', likes: 0, replies: [] }, ...c])
  }

  const likeComment = (id) => {
    setComments((c) => c.map((cm) => cm.id === id ? { ...cm, likes: cm.likes + 1 } : cm))
  }

  const replyComment = (id, replyText) => {
    setComments((c) => c.map((cm) =>
      cm.id === id
        ? { ...cm, replies: [...(cm.replies || []), { id: Date.now(), from: 'Admin', text: replyText, time: 'Just now' }] }
        : cm
    ))
  }

  const recordDeal = () => setDealsCount((c) => c + 1)

  const sendChatMessage = async (text, fromAdmin = false) => {
    const from = fromAdmin ? 'admin' : 'user'
    const newMsg = {
      id: Date.now(),
      from,
      text,
      senderName: user?.fullName || (fromAdmin ? 'Admin' : 'User'),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setChatMessages((c) => [...c, newMsg])
    try {
      await api.post('/api/chat', { text, from })
    } catch { /* ignore */ }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role,
        login,
        signup,
        logout,
        ads,
        loadingAds,
        fetchAds,
        sellerAds,
        addAd,
        comments,
        addComment,
        likeComment,
        replyComment,
        chatMessages,
        sendChatMessage,
        fetchChat,
        dealsCount,
        recordDeal,
        updateAd,
        deleteAd,
        updateProfile,
        getAllUsers,
        createUser,
        deleteUser,
        updateUser,
        getSystemStats,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
