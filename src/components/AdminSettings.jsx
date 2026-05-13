import { useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext.jsx'

const DEFAULT_CENTRE = [
  { url: '/Screenshot 2026-05-11 181232.png', adId: null },
  { url: '/house1.webp', adId: null },
  { url: '/car1.webp', adId: null },
]
const DEFAULT_SIDE = [
  { url: '/laptoop1.webp', adId: null },
  { url: '/house2.webp', adId: null },
  { url: '/car2.webp', adId: null },
  { url: '/phone1.webp', adId: null },
]

export const getLandingImages = () => {
  try {
    const saved = localStorage.getItem('ranga_landing_images_v2')
    return saved ? JSON.parse(saved) : { centre: DEFAULT_CENTRE, side: DEFAULT_SIDE }
  } catch {
    return { centre: DEFAULT_CENTRE, side: DEFAULT_SIDE }
  }
}

const AdminSettings = () => {
  const { ads } = useAuth()
  const [settings, setSettings] = useState({
    maxFileSize: 4,
    allowedFormats: ['JPG', 'PNG', 'WEBP', 'GIF', 'MP4'],
    emailNotifications: true,
    twoFactorAuth: false,
    sessionTimeout: 30,
    backupFrequency: 'weekly',
  })
  const [activeTab, setActiveTab] = useState('landing')
  const [landingImgs, setLandingImgs] = useState(() => getLandingImages())
  const [landingSaving, setLandingSaving] = useState(false)
  const [showAdPicker, setShowAdPicker] = useState(null) // { type, index }
  const [adSearch, setAdSearch] = useState('')

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    toast.success('Setting updated')
  }

  const handleSaveSettings = () => {
    localStorage.setItem('admin_settings', JSON.stringify(settings))
    toast.success('All settings saved successfully')
  }

  // Guhindura image ukoresheje file upload
  const handleLandingFile = (e, type, index) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.error('Max 5MB'); return }
    const reader = new FileReader()
    reader.onload = () => {
      setLandingImgs((prev) => {
        const updated = { ...prev, [type]: [...prev[type]] }
        updated[type][index] = { url: reader.result, adId: null }
        return updated
      })
    }
    reader.readAsDataURL(file)
  }

  // Guhindura image ukoresheje URL
  const handleLandingUrl = (type, index, url) => {
    setLandingImgs((prev) => {
      const updated = { ...prev, [type]: [...prev[type]] }
      updated[type][index] = { ...updated[type][index], url }
      return updated
    })
  }

  // Guhitamo ad ivuye muri published ads
  const pickAdImage = (ad) => {
    const { type, index } = showAdPicker
    setLandingImgs((prev) => {
      const updated = { ...prev, [type]: [...prev[type]] }
      updated[type][index] = { url: ad.mediaUrl, adId: ad.id }
      return updated
    })
    setShowAdPicker(null)
    setAdSearch('')
    toast.success(`✅ Image ya "${ad.title}" yashyizweho!`)
  }

  const saveLandingImages = () => {
    setLandingSaving(true)
    localStorage.setItem('ranga_landing_images_v2', JSON.stringify(landingImgs))
    setTimeout(() => {
      setLandingSaving(false)
      toast.success('✅ Images zabitswe! Subira kuri landing page ubone.')
    }, 400)
  }

  const resetLandingImages = () => {
    setLandingImgs({ centre: DEFAULT_CENTRE, side: DEFAULT_SIDE })
    localStorage.removeItem('ranga_landing_images_v2')
    toast.success('Images zasubiye ku default')
  }

  const filteredAds = ads.filter((ad) =>
    ad.mediaUrl && ad.title.toLowerCase().includes(adSearch.toLowerCase())
  )

  const getSlotUrl = (slot) => (typeof slot === 'string' ? slot : slot?.url || '')
  const getSlotAdId = (slot) => (typeof slot === 'object' ? slot?.adId : null)

  const SettingSection = ({ title, description, children }) => (
    <div className="rounded-[20px] border border-slate-800/80 bg-slate-900/70 p-6 shadow-soft">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-1 text-sm text-slate-400">{description}</p>
      <div className="mt-4">{children}</div>
    </div>
  )

  const ImageSlot = ({ slot, type, index, height = 'h-32', label }) => (
    <div className="space-y-2">
      <div className={`relative ${height} overflow-hidden rounded-xl bg-slate-800`}>
        <img src={getSlotUrl(slot)} alt={label} className="h-full w-full object-cover" />
        <span className="absolute top-1 left-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] text-white">{label}</span>
        {getSlotAdId(slot) && (
          <span className="absolute top-1 right-1 rounded-full bg-emerald-500/80 px-2 py-0.5 text-[10px] text-white">Ad linked</span>
        )}
      </div>

      {/* 3 options: URL, Upload, Pick from Ads */}
      <input
        type="text"
        value={getSlotUrl(slot)}
        onChange={(e) => handleLandingUrl(type, index, e.target.value)}
        placeholder="/filename.webp or https://..."
        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-white outline-none focus:border-emerald-500"
      />
      <div className="grid grid-cols-2 gap-1.5">
        <label className="flex cursor-pointer items-center justify-center gap-1 rounded-lg bg-slate-800 px-2 py-1.5 text-xs text-slate-300 hover:bg-slate-700 transition">
          📁 Upload
          <input type="file" accept="image/*" className="hidden"
            onChange={(e) => handleLandingFile(e, type, index)} />
        </label>
        <button
          onClick={() => { setShowAdPicker({ type, index }); setAdSearch('') }}
          className="rounded-lg bg-blue-500/20 px-2 py-1.5 text-xs text-blue-300 hover:bg-blue-500/30 transition"
        >
          🖼️ From Ads
        </button>
      </div>
    </div>
  )

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white">System Settings</h2>
        <p className="mt-2 text-slate-400">Configure system behavior and security options</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-0">
        {['landing', 'general', 'security', 'backup'].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium transition ${
              activeTab === tab ? 'border-b-2 border-emerald-500 text-emerald-300' : 'text-slate-400 hover:text-slate-300'
            }`}>
            {tab === 'landing' ? '🖼️ Landing Images' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* ── Landing Images ── */}
      {activeTab === 'landing' && (
        <div className="space-y-6">
          <div className="rounded-[20px] border border-slate-800/80 bg-slate-900/70 p-6 shadow-soft">
            <h3 className="text-lg font-semibold text-white">🖼️ Landing Page Images</h3>
            <p className="mt-1 text-sm text-slate-400">
              Shyiramo URL, upload ifoto, cyangwa hitamo image ivuye muri ads zashyizwe — iyo ukanda <strong className="text-blue-300">🖼️ From Ads</strong>.
              Images zifite ad zizajya zijya kuri page ya wa seller.
            </p>

            {/* Centre Slideshow */}
            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold text-emerald-300">🎠 Centre Slideshow — images 3</p>
              <div className="grid gap-4 sm:grid-cols-3">
                {landingImgs.centre.map((slot, i) => (
                  <ImageSlot key={i} slot={slot} type="centre" index={i} height="h-32" label={`Slide ${i + 1}`} />
                ))}
              </div>
            </div>

            {/* Side Grid */}
            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold text-blue-300">📐 Side Grid — images 4</p>
              <div className="grid gap-4 sm:grid-cols-4">
                {landingImgs.side.map((slot, i) => (
                  <ImageSlot key={i} slot={slot} type="side" index={i} height="h-24" label={`Side ${i + 1}`} />
                ))}
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={saveLandingImages} disabled={landingSaving}
                className="flex-1 rounded-xl bg-emerald-500/20 px-4 py-2.5 text-sm font-semibold text-emerald-300 hover:bg-emerald-500/30 disabled:opacity-50 transition">
                {landingSaving ? 'Saving...' : '✅ Save Landing Images'}
              </button>
              <button onClick={resetLandingImages}
                className="rounded-xl bg-slate-700/50 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700 transition">
                🔄 Reset Default
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── General ── */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <SettingSection title="Upload Configuration" description="Control file upload limits and allowed formats">
            <div className="space-y-4">
              <label className="block text-sm text-slate-300">
                Max File Size (MB):
                <input type="number" value={settings.maxFileSize}
                  onChange={(e) => handleSettingChange('maxFileSize', parseInt(e.target.value))}
                  className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950/90 px-3 py-2 text-white outline-none focus:border-emerald-500" />
              </label>
              <div>
                <p className="text-sm text-slate-300 mb-2">Allowed Formats:</p>
                <div className="flex flex-wrap gap-2">
                  {['JPG', 'PNG', 'WEBP', 'GIF', 'MP4', 'MOV', 'AVI'].map((format) => (
                    <button key={format}
                      onClick={() => {
                        const updated = settings.allowedFormats.includes(format)
                          ? settings.allowedFormats.filter((f) => f !== format)
                          : [...settings.allowedFormats, format]
                        handleSettingChange('allowedFormats', updated)
                      }}
                      className={`rounded-full px-3 py-1 text-sm transition ${
                        settings.allowedFormats.includes(format) ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}>
                      {format}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </SettingSection>
          <SettingSection title="Notifications" description="Configure system notifications">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={settings.emailNotifications}
                onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                className="h-4 w-4 cursor-pointer" />
              <span className="text-sm text-slate-300">Enable Email Notifications</span>
            </label>
          </SettingSection>
        </div>
      )}

      {/* ── Security ── */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <SettingSection title="Authentication" description="Control authentication and access methods">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={settings.twoFactorAuth}
                onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                className="h-4 w-4 cursor-pointer" />
              <span className="text-sm text-slate-300">Require Two-Factor Authentication for Admins</span>
            </label>
          </SettingSection>
          <SettingSection title="Session Management" description="Control user session settings">
            <label className="block text-sm text-slate-300">
              Session Timeout (minutes):
              <input type="number" value={settings.sessionTimeout}
                onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950/90 px-3 py-2 text-white outline-none focus:border-emerald-500" />
            </label>
          </SettingSection>
        </div>
      )}

      {/* ── Backup ── */}
      {activeTab === 'backup' && (
        <div className="space-y-6">
          <SettingSection title="Backup Configuration" description="Configure automatic database backups">
            <label className="block text-sm text-slate-300">
              Backup Frequency:
              <select value={settings.backupFrequency}
                onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950/90 px-3 py-2 text-white outline-none focus:border-emerald-500">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </label>
          </SettingSection>
        </div>
      )}

      {activeTab !== 'landing' && (
        <button onClick={handleSaveSettings}
          className="w-full rounded-lg bg-emerald-500 px-6 py-3 text-lg font-semibold text-slate-950 transition hover:bg-emerald-400">
          💾 Save All Settings
        </button>
      )}

      {/* ── Ad Picker Modal ── */}
      {showAdPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setShowAdPicker(null)}>
          <div className="w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-[20px] border border-slate-700 bg-slate-900 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
              <h3 className="text-base font-semibold text-white">🖼️ Hitamo image ivuye muri published ads</h3>
              <button onClick={() => setShowAdPicker(null)} className="text-slate-400 hover:text-white text-xl">✕</button>
            </div>
            <div className="px-5 py-3 border-b border-slate-800">
              <input type="search" value={adSearch} onChange={(e) => setAdSearch(e.target.value)}
                placeholder="Shakisha ad..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500" />
            </div>
            <div className="overflow-y-auto p-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {filteredAds.length === 0 ? (
                <p className="col-span-3 text-center text-sm text-slate-500 py-8">Nta ads zibonetse</p>
              ) : filteredAds.map((ad) => (
                <button key={ad.id} onClick={() => pickAdImage(ad)}
                  className="group overflow-hidden rounded-xl border border-slate-700 bg-slate-800 text-left transition hover:border-emerald-500">
                  <div className="h-24 overflow-hidden">
                    <img src={ad.mediaUrl} alt={ad.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium text-white line-clamp-1">{ad.title}</p>
                    <p className="text-[10px] text-slate-400">{ad.sellerName}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default AdminSettings
