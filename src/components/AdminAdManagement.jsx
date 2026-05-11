import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext.jsx'

const CATEGORIES = {
  Services:    ['Photography', 'Cleaning', 'Repair', 'Gardening', 'Delivery', 'Tutoring'],
  Products:    ['Fashion', 'Accessories', 'Electronics', 'Home', 'Food', 'Beauty'],
  RealEstate:  ['Rent', 'Sale', 'Land', 'Commercial'],
  Vehicles:    ['Cars', 'Motorcycles', 'Bicycles', 'Trucks', 'Parts'],
  Electronics: ['Phones', 'Laptops', 'TVs', 'Cameras', 'Audio'],
}

const EMPTY_AD = {
  title: '', description: '', price: '', currency: 'RWF',
  category: 'Services', subcategory: 'Photography',
  location: '', mediaType: 'image', mediaUrl: '', file: null,
}

const AdminAdManagement = () => {
  const { ads, addAd, updateAd, deleteAd, user } = useAuth()
  const [searchAd, setSearchAd] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedAd, setSelectedAd] = useState(null)
  const [flaggedAds, setFlaggedAds] = useState({})
  const [showUpload, setShowUpload] = useState(false)
  const [form, setForm] = useState(EMPTY_AD)
  const [previewUrl, setPreviewUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  // edit state
  const [editingAd, setEditingAd] = useState(null)
  const [editForm, setEditForm] = useState(EMPTY_AD)
  const [editPreview, setEditPreview] = useState('')
  const [editSubmitting, setEditSubmitting] = useState(false)

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }))
  const setE = (k, v) => setEditForm((p) => ({ ...p, [k]: v }))
  const subcategoryOptions = useMemo(() => CATEGORIES[form.category] || [], [form.category])
  const editSubOptions = useMemo(() => CATEGORIES[editForm.category] || [], [editForm.category])

  const handleFile = (e, isEdit = false) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 4 * 1024 * 1024) { toast.error('File must be 4 MB or less.'); return }
    const mediaType = file.type.startsWith('video') ? 'video' : 'image'
    const reader = new FileReader()
    reader.onload = () => {
      const url = reader.result
      if (isEdit) {
        setEditForm((p) => ({ ...p, file, mediaType, mediaUrl: url }))
        setEditPreview(url)
      } else {
        setForm((p) => ({ ...p, file, mediaType, mediaUrl: url }))
        setPreviewUrl(url)
      }
    }
    reader.onerror = () => toast.error('Could not read file.')
    reader.readAsDataURL(file)
  }

  const handleUploadSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.description) { toast.error('Title na description birakenewe.'); return }
    if (!previewUrl) { toast.error('Shyiramo ifoto cyangwa video.'); return }
    setSubmitting(true)
    try {
      await addAd({
        id: `ad-${Date.now()}`,
        title: form.title, description: form.description,
        price: form.price, currency: form.currency,
        category: form.category, subcategory: form.subcategory,
        location: form.location || user?.location || 'Kigali, Rwanda',
        sellerName: user?.fullName || 'RANGA Admin',
        sellerId: user?.id || 'admin',
        whatsapp: user?.whatsappNumber?.replace(/\D/g, '') || user?.phoneNumber?.replace(/\D/g, '') || '250780000000',
        phone: user?.phoneNumber || '0780000000',
        mediaType: form.mediaType, mediaUrl: previewUrl,
      })
      toast.success('✅ Ad yashyizweho neza!')
      setForm(EMPTY_AD); setPreviewUrl(''); setShowUpload(false)
    } catch { toast.error('Gupublish ad byanze.') }
    finally { setSubmitting(false) }
  }

  const openEdit = (ad) => {
    setEditingAd(ad)
    setEditForm({
      title: ad.title || '', description: ad.description || '',
      price: ad.price || '', currency: ad.currency || 'RWF',
      category: ad.category || 'Services', subcategory: ad.subcategory || '',
      location: ad.location || '', mediaType: ad.mediaType || 'image',
      mediaUrl: ad.mediaUrl || '', file: null,
    })
    setEditPreview(ad.mediaUrl || '')
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!editForm.title || !editForm.description) { toast.error('Title na description birakenewe.'); return }
    setEditSubmitting(true)
    try {
      await updateAd({
        ...editingAd,
        title: editForm.title, description: editForm.description,
        price: editForm.price, currency: editForm.currency,
        category: editForm.category, subcategory: editForm.subcategory,
        location: editForm.location,
        mediaType: editForm.mediaType, mediaUrl: editPreview || editingAd.mediaUrl,
      })
      toast.success('✅ Ad yahinduwe neza!')
      setEditingAd(null)
    } catch { toast.error('Guhindura ad byanze.') }
    finally { setEditSubmitting(false) }
  }

  const categories = ['all', ...new Set(ads.map((ad) => ad.category))]

  const filteredAds = ads.filter((ad) => {
    const matchesSearch = ad.title.toLowerCase().includes(searchAd.toLowerCase())
    const matchesCategory = filterCategory === 'all' || ad.category === filterCategory
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'flagged' && flaggedAds[ad.id]) ||
      (filterStatus === 'active' && !flaggedAds[ad.id])
    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleFlagAd = (adId) => {
    setFlaggedAds((prev) => ({ ...prev, [adId]: !prev[adId] }))
    toast.success(flaggedAds[adId] ? 'Ad unflagged' : 'Ad flagged for review')
  }

  const handleDeleteAd = (adId) => {
    if (confirm('Uzi neza ko ushaka gusiba iyi ad?')) {
      deleteAd(adId)
      toast.success('Ad yasibwe neza!')
    }
  }

  const adStats = {
    total: ads.length,
    flagged: Object.values(flaggedAds).filter(Boolean).length,
    active: ads.length - Object.values(flaggedAds).filter(Boolean).length,
  }

  const inputCls = 'w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500'
  const labelCls = 'block text-xs font-medium text-slate-400 mb-1'

  const MediaUploadBox = ({ preview, inputId, onChange }) => (
    <div className="mt-1 rounded-xl border-2 border-dashed border-slate-700 bg-slate-950/50 p-4 text-center transition hover:border-emerald-500">
      <input type="file" accept="image/jpeg,image/png,image/webp,image/gif,video/mp4"
        onChange={onChange} className="hidden" id={inputId} />
      <label htmlFor={inputId} className="cursor-pointer">
        {preview ? (
          <div className="space-y-2">
            {preview.includes('video') || preview.endsWith('.mp4') ? (
              <video src={preview} className="mx-auto h-36 rounded-lg object-cover" muted playsInline />
            ) : (
              <img src={preview} alt="preview" className="mx-auto h-36 rounded-lg object-cover" />
            )}
            <p className="text-xs text-emerald-400">Click to change file</p>
          </div>
        ) : (
          <div className="space-y-2 py-6">
            <p className="text-3xl">📁</p>
            <p className="text-sm font-medium text-slate-300">Click to upload</p>
            <p className="text-xs text-slate-500">JPG, PNG, WEBP, GIF, MP4 · Max 4 MB</p>
          </div>
        )}
      </label>
    </div>
  )

  const AdFormFields = ({ f, setF, subOpts, previewVal, inputId, onFileChange }) => (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className={labelCls}>Title *</label>
        <input type="text" value={f.title} onChange={(e) => setF('title', e.target.value)}
          className={inputCls} placeholder="e.g. Toyota Premio 2015" required />
      </div>
      <div className="sm:col-span-2">
        <label className={labelCls}>Description *</label>
        <textarea value={f.description} onChange={(e) => setF('description', e.target.value)}
          rows={3} className={inputCls} placeholder="Sobanura ibintu byawe..." required />
      </div>
      <div>
        <label className={labelCls}>Category *</label>
        <select value={f.category}
          onChange={(e) => setF('category', e.target.value)}
          className={inputCls}>
          {Object.keys(CATEGORIES).map((k) => <option key={k} value={k}>{k}</option>)}
        </select>
      </div>
      <div>
        <label className={labelCls}>Subcategory *</label>
        <select value={f.subcategory} onChange={(e) => setF('subcategory', e.target.value)} className={inputCls}>
          {subOpts.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
      <div>
        <label className={labelCls}>Price (optional)</label>
        <input type="number" min="0" value={f.price} onChange={(e) => setF('price', e.target.value)}
          className={inputCls} placeholder="e.g. 250000" />
      </div>
      <div>
        <label className={labelCls}>Currency</label>
        <select value={f.currency} onChange={(e) => setF('currency', e.target.value)} className={inputCls}>
          <option value="RWF">🇷🇼 RWF</option>
          <option value="USD">🇺🇸 USD</option>
          <option value="EUR">🇪🇺 EUR</option>
          <option value="KES">🇰🇪 KES</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className={labelCls}>Location</label>
        <input type="text" value={f.location} onChange={(e) => setF('location', e.target.value)}
          className={inputCls} placeholder="e.g. Kigali, Gasabo" />
      </div>
      <div className="sm:col-span-2">
        <label className={labelCls}>Image or Video</label>
        <MediaUploadBox preview={previewVal} inputId={inputId} onChange={onFileChange} />
      </div>
    </div>
  )

  return (
    <section className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Ad Management</h2>
          <p className="mt-2 text-slate-400">Moderate, manage, and upload marketplace ads</p>
        </div>
        <button
          onClick={() => { setShowUpload((c) => !c); setForm(EMPTY_AD); setPreviewUrl('') }}
          className="flex items-center gap-2 rounded-xl bg-emerald-500/20 px-5 py-2.5 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/30"
        >
          {showUpload ? '✕ Cancel' : '➕ Upload Ad'}
        </button>
      </div>

      {/* Upload Form */}
      {showUpload && (
        <form onSubmit={handleUploadSubmit}
          className="rounded-[20px] border border-emerald-500/30 bg-emerald-500/5 p-6 space-y-5">
          <h3 className="text-lg font-semibold text-emerald-300">➕ Upload New Ad</h3>
          <AdFormFields f={form} setF={set} subOpts={subcategoryOptions}
            previewVal={previewUrl} inputId="admin-media-upload"
            onFileChange={(e) => handleFile(e, false)} />
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={submitting}
              className="rounded-xl bg-emerald-500/20 px-6 py-2.5 text-sm font-semibold text-emerald-300 hover:bg-emerald-500/30 disabled:opacity-50">
              {submitting ? 'Publishing...' : '🚀 Publish Ad'}
            </button>
            <button type="button" onClick={() => setShowUpload(false)}
              className="rounded-xl bg-slate-700/50 px-6 py-2.5 text-sm text-slate-300 hover:bg-slate-700">Cancel</button>
          </div>
        </form>
      )}

      {/* Ad Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-[20px] border border-slate-800/80 bg-slate-900/70 p-4 shadow-soft">
          <p className="text-sm text-slate-400">Total Ads</p>
          <p className="mt-2 text-3xl font-bold text-slate-100">{adStats.total}</p>
        </div>
        <div className="rounded-[20px] border border-emerald-800/30 bg-emerald-500/10 p-4 shadow-soft">
          <p className="text-sm text-emerald-300">Active</p>
          <p className="mt-2 text-3xl font-bold text-emerald-300">{adStats.active}</p>
        </div>
        <div className="rounded-[20px] border border-yellow-800/30 bg-yellow-500/10 p-4 shadow-soft">
          <p className="text-sm text-yellow-300">Flagged</p>
          <p className="mt-2 text-3xl font-bold text-yellow-300">{adStats.flagged}</p>
        </div>
        <div className="rounded-[20px] border border-slate-800/80 bg-slate-900/70 p-4 shadow-soft">
          <p className="text-sm text-slate-400">Categories</p>
          <p className="mt-2 text-3xl font-bold text-slate-100">{categories.length - 1}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-3">
        <input type="search" placeholder="Search ads by title..."
          value={searchAd} onChange={(e) => setSearchAd(e.target.value)}
          className="rounded-3xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none focus:border-emerald-500" />
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
          className="rounded-3xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none focus:border-emerald-500">
          {categories.map((cat) => <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-3xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none focus:border-emerald-500">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="flagged">Flagged</option>
        </select>
      </div>

      {/* Ads Grid */}
      {filteredAds.length === 0 ? (
        <div className="rounded-[20px] border border-slate-800/80 bg-slate-900/70 p-8 text-center shadow-soft">
          <p className="text-slate-400">No ads found matching your filters.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAds.map((ad) => (
            <div key={ad.id}
              className={`overflow-hidden rounded-[20px] border shadow-soft transition ${
                flaggedAds[ad.id] ? 'border-yellow-500/50 bg-yellow-500/10' : 'border-slate-800/80 bg-slate-900/70'
              }`}>
              <div className="relative h-48 overflow-hidden bg-slate-950 cursor-pointer hover:opacity-90 transition"
                onClick={() => setSelectedAd(ad)}>
                {ad.mediaType === 'video' ? (
                  <video src={ad.mediaUrl} className="h-full w-full object-cover" muted />
                ) : (
                  <img src={ad.mediaUrl} alt={ad.title} className="h-full w-full object-cover" />
                )}
                {flaggedAds[ad.id] && (
                  <div className="absolute top-2 right-2 rounded-full bg-yellow-500 px-2 py-1 text-xs font-bold text-yellow-900">FLAGGED</div>
                )}
              </div>

              <div className="space-y-3 p-4">
                <div>
                  <h3 className="line-clamp-2 font-semibold text-white">{ad.title}</h3>
                  <p className="mt-1 text-xs text-slate-500 line-clamp-2">{ad.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><p className="text-slate-500">Category</p><p className="font-medium text-slate-200">{ad.category}</p></div>
                  <div><p className="text-slate-500">Subcategory</p><p className="font-medium text-slate-200">{ad.subcategory}</p></div>
                  <div><p className="text-slate-500">Price</p><p className="font-medium text-emerald-300">{ad.currency || 'RWF'} {ad.price ? Number(ad.price).toLocaleString() : 'On Request'}</p></div>
                  <div><p className="text-slate-500">Location</p><p className="font-medium text-slate-200">{ad.location || '—'}</p></div>
                </div>
                <div className="border-t border-slate-800 pt-3">
                  <p className="text-xs text-slate-500">Seller</p>
                  <p className="font-medium text-slate-200">{ad.sellerName}</p>
                </div>
                {/* Actions — 3 buttons */}
                <div className="flex gap-2">
                  <button onClick={() => openEdit(ad)}
                    className="flex-1 rounded-full bg-blue-500/20 px-3 py-2 text-xs font-semibold text-blue-300 hover:bg-blue-500/30">
                    ✏️ Edit
                  </button>
                  <button onClick={() => handleFlagAd(ad.id)}
                    className={`flex-1 rounded-full px-3 py-2 text-xs font-semibold transition ${
                      flaggedAds[ad.id] ? 'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                    }`}>
                    {flaggedAds[ad.id] ? '⚠️ Unflag' : '🚩 Flag'}
                  </button>
                  <button onClick={() => handleDeleteAd(ad.id)}
                    className="flex-1 rounded-full bg-red-500/20 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/30">
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Edit Modal ── */}
      {editingAd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setEditingAd(null)}>
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[20px] border border-blue-500/30 bg-slate-900 shadow-soft"
            onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-blue-300">✏️ Edit Ad</h3>
                <button type="button" onClick={() => setEditingAd(null)} className="text-slate-400 hover:text-white text-xl">✕</button>
              </div>
              <AdFormFields f={editForm} setF={setE} subOpts={editSubOptions}
                previewVal={editPreview} inputId="admin-edit-media"
                onFileChange={(e) => handleFile(e, true)} />
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={editSubmitting}
                  className="rounded-xl bg-blue-500/20 px-6 py-2.5 text-sm font-semibold text-blue-300 hover:bg-blue-500/30 disabled:opacity-50">
                  {editSubmitting ? 'Saving...' : '✅ Save Changes'}
                </button>
                <button type="button" onClick={() => setEditingAd(null)}
                  className="rounded-xl bg-slate-700/50 px-6 py-2.5 text-sm text-slate-300 hover:bg-slate-700">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedAd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setSelectedAd(null)}>
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[20px] border border-slate-800/80 bg-slate-900 shadow-soft"
            onClick={(e) => e.stopPropagation()}>
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <h3 className="text-xl font-semibold text-white">Ad Details</h3>
                <button onClick={() => setSelectedAd(null)} className="text-slate-400 hover:text-white text-xl">✕</button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  {selectedAd.mediaType === 'video' ? (
                    <video src={selectedAd.mediaUrl} controls className="w-full max-h-72 rounded-lg" />
                  ) : (
                    <img src={selectedAd.mediaUrl} alt={selectedAd.title} className="w-full max-h-72 rounded-lg object-cover" />
                  )}
                </div>
                {[['Title', selectedAd.title], ['Price', `${selectedAd.currency || 'RWF'} ${selectedAd.price ? Number(selectedAd.price).toLocaleString() : 'On Request'}`],
                  ['Category', selectedAd.category], ['Subcategory', selectedAd.subcategory],
                  ['Location', selectedAd.location], ['Seller', selectedAd.sellerName],
                  ['Phone', selectedAd.phone], ['WhatsApp', selectedAd.whatsapp],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="mt-1 font-medium text-white">{value || '—'}</p>
                  </div>
                ))}
                <div className="md:col-span-2">
                  <p className="text-xs text-slate-500">Description</p>
                  <p className="mt-1 text-slate-300">{selectedAd.description}</p>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => { setSelectedAd(null); openEdit(selectedAd) }}
                  className="rounded-xl bg-blue-500/20 px-5 py-2 text-sm font-semibold text-blue-300 hover:bg-blue-500/30">
                  ✏️ Edit this Ad
                </button>
                <button onClick={() => { handleDeleteAd(selectedAd.id); setSelectedAd(null) }}
                  className="rounded-xl bg-red-500/20 px-5 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/30">
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default AdminAdManagement
