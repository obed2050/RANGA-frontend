import { useState } from 'react'
import toast from 'react-hot-toast'

const DEFAULT_CENTRE = [
  '/Screenshot 2026-05-11 181232.png',
  '/house1.webp',
  '/car1.webp',
]
const DEFAULT_SIDE = [
  '/laptoop1.webp',
  '/house2.webp',
  '/car2.webp',
  '/phone1.webp',
]

export const getLandingImages = () => {
  try {
    const saved = localStorage.getItem('ranga_landing_images')
    return saved ? JSON.parse(saved) : { centre: DEFAULT_CENTRE, side: DEFAULT_SIDE }
  } catch {
    return { centre: DEFAULT_CENTRE, side: DEFAULT_SIDE }
  }
}

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    maxFileSize: 4,
    allowedFormats: ['JPG', 'PNG', 'WEBP', 'GIF', 'MP4'],
    emailNotifications: true,
    twoFactorAuth: false,
    sessionTimeout: 30,
    backupFrequency: 'weekly',
  })

  const [activeTab, setActiveTab] = useState('landing')

  // Landing images state
  const [landingImgs, setLandingImgs] = useState(() => getLandingImages())
  const [landingSaving, setLandingSaving] = useState(false)

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    toast.success('Setting updated')
  }

  const handleSaveSettings = () => {
    localStorage.setItem('admin_settings', JSON.stringify(settings))
    toast.success('All settings saved successfully')
  }

  // Landing image handlers
  const handleLandingFile = (e, type, index) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.error('Max 5MB'); return }
    const reader = new FileReader()
    reader.onload = () => {
      const url = reader.result
      setLandingImgs((prev) => {
        const updated = { ...prev, [type]: [...prev[type]] }
        updated[type][index] = url
        return updated
      })
    }
    reader.readAsDataURL(file)
  }

  const handleLandingUrl = (type, index, url) => {
    setLandingImgs((prev) => {
      const updated = { ...prev, [type]: [...prev[type]] }
      updated[type][index] = url
      return updated
    })
  }

  const saveLandingImages = () => {
    setLandingSaving(true)
    localStorage.setItem('ranga_landing_images', JSON.stringify(landingImgs))
    setTimeout(() => {
      setLandingSaving(false)
      toast.success('✅ Landing images saved! Reload landing page to see changes.')
    }, 500)
  }

  const resetLandingImages = () => {
    setLandingImgs({ centre: DEFAULT_CENTRE, side: DEFAULT_SIDE })
    localStorage.removeItem('ranga_landing_images')
    toast.success('Landing images reset to default')
  }

  const SettingSection = ({ title, description, children }) => (
    <div className="rounded-[20px] border border-slate-800/80 bg-slate-900/70 p-6 shadow-soft">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-1 text-sm text-slate-400">{description}</p>
      <div className="mt-4">{children}</div>
    </div>
  )

  return (
    <section className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white">System Settings</h2>
        <p className="mt-2 text-slate-400">Configure system behavior and security options</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-800">
        {['landing', 'general', 'security', 'backup'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium transition ${
              activeTab === tab
                ? 'border-b-2 border-emerald-500 text-emerald-300'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            {tab === 'landing' ? '🖼️ Landing Images' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Landing Images Settings */}
      {activeTab === 'landing' && (
        <div className="space-y-6">
          <div className="rounded-[20px] border border-slate-800/80 bg-slate-900/70 p-6 shadow-soft">
            <h3 className="text-lg font-semibold text-white">🖼️ Landing Page Images</h3>
            <p className="mt-1 text-sm text-slate-400">Hindura amafoto agaragara kuri landing page. Shyiramo URL cyangwa upload ifoto nshya.</p>

            {/* Centre Slideshow */}
            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold text-emerald-300">🎠 Centre Slideshow (3 images)</p>
              <div className="grid gap-4 sm:grid-cols-3">
                {landingImgs.centre.map((src, i) => (
                  <div key={i} className="space-y-2">
                    <div className="relative h-32 overflow-hidden rounded-xl bg-slate-800">
                      <img src={src} alt={`centre ${i}`} className="h-full w-full object-cover" />
                      <span className="absolute top-1 left-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] text-white">Slide {i + 1}</span>
                    </div>
                    <input
                      type="text"
                      value={src}
                      onChange={(e) => handleLandingUrl('centre', i, e.target.value)}
                      placeholder="URL cyangwa /filename.webp"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-white outline-none focus:border-emerald-500"
                    />
                    <label className="flex cursor-pointer items-center justify-center gap-1 rounded-lg bg-slate-800 px-2 py-1.5 text-xs text-slate-300 hover:bg-slate-700 transition">
                      📁 Upload
                      <input type="file" accept="image/*" className="hidden"
                        onChange={(e) => handleLandingFile(e, 'centre', i)} />
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Side Images */}
            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold text-blue-300">📐 Side Grid (4 images)</p>
              <div className="grid gap-4 sm:grid-cols-4">
                {landingImgs.side.map((src, i) => (
                  <div key={i} className="space-y-2">
                    <div className="relative h-24 overflow-hidden rounded-xl bg-slate-800">
                      <img src={src} alt={`side ${i}`} className="h-full w-full object-cover" />
                      <span className="absolute top-1 left-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] text-white">{i + 1}</span>
                    </div>
                    <input
                      type="text"
                      value={src}
                      onChange={(e) => handleLandingUrl('side', i, e.target.value)}
                      placeholder="URL cyangwa /filename.webp"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-white outline-none focus:border-emerald-500"
                    />
                    <label className="flex cursor-pointer items-center justify-center gap-1 rounded-lg bg-slate-800 px-2 py-1.5 text-xs text-slate-300 hover:bg-slate-700 transition">
                      📁 Upload
                      <input type="file" accept="image/*" className="hidden"
                        onChange={(e) => handleLandingFile(e, 'side', i)} />
                    </label>
                  </div>
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

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <SettingSection
            title="Upload Configuration"
            description="Control file upload limits and allowed formats"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300">
                  Max File Size (MB):
                  <input
                    type="number"
                    value={settings.maxFileSize}
                    onChange={(e) => handleSettingChange('maxFileSize', parseInt(e.target.value))}
                    className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950/90 px-3 py-2 text-white outline-none focus:border-emerald-500"
                  />
                </label>
              </div>

              <div>
                <p className="text-sm text-slate-300 mb-2">Allowed Formats:</p>
                <div className="flex flex-wrap gap-2">
                  {['JPG', 'PNG', 'WEBP', 'GIF', 'MP4', 'MOV', 'AVI'].map((format) => (
                    <button
                      key={format}
                      onClick={() => {
                        const updated = settings.allowedFormats.includes(format)
                          ? settings.allowedFormats.filter((f) => f !== format)
                          : [...settings.allowedFormats, format]
                        handleSettingChange('allowedFormats', updated)
                      }}
                      className={`rounded-full px-3 py-1 text-sm transition ${
                        settings.allowedFormats.includes(format)
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {format}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </SettingSection>

          <SettingSection title="Notifications" description="Configure system notifications">
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                  className="h-4 w-4 cursor-pointer"
                />
                <span className="text-sm text-slate-300">Enable Email Notifications</span>
              </label>
            </div>
          </SettingSection>
        </div>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <SettingSection
            title="Authentication"
            description="Control authentication and access methods"
          >
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.twoFactorAuth}
                  onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                  className="h-4 w-4 cursor-pointer"
                />
                <span className="text-sm text-slate-300">Require Two-Factor Authentication for Admins</span>
              </label>
            </div>
          </SettingSection>

          <SettingSection title="Session Management" description="Control user session settings">
            <div>
              <label className="block text-sm text-slate-300">
                Session Timeout (minutes):
                <input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                  className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950/90 px-3 py-2 text-white outline-none focus:border-emerald-500"
                />
              </label>
            </div>
          </SettingSection>

          <SettingSection title="Security Audit" description="View security information">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-lg bg-slate-950/50 p-3">
                <p className="text-xs text-slate-500">Failed Login Attempts</p>
                <p className="mt-1 text-2xl font-bold text-yellow-300">3</p>
              </div>
              <div className="rounded-lg bg-slate-950/50 p-3">
                <p className="text-xs text-slate-500">Last Security Scan</p>
                <p className="mt-1 text-sm text-emerald-300">2 hours ago</p>
              </div>
              <div className="rounded-lg bg-slate-950/50 p-3">
                <p className="text-xs text-slate-500">Active Sessions</p>
                <p className="mt-1 text-2xl font-bold text-emerald-300">1</p>
              </div>
            </div>
          </SettingSection>
        </div>
      )}

      {/* Backup Settings */}
      {activeTab === 'backup' && (
        <div className="space-y-6">
          <SettingSection
            title="Backup Configuration"
            description="Configure automatic database backups"
          >
            <div>
              <label className="block text-sm text-slate-300">
                Backup Frequency:
                <select
                  value={settings.backupFrequency}
                  onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950/90 px-3 py-2 text-white outline-none focus:border-emerald-500"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </label>
            </div>
          </SettingSection>

          <SettingSection title="Backup Management" description="Manage and restore backups">
            <div className="space-y-3">
              <button className="w-full rounded-lg bg-emerald-500/20 px-4 py-3 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/30">
                💾 Create Backup Now
              </button>
              <button className="w-full rounded-lg bg-blue-500/20 px-4 py-3 text-sm font-semibold text-blue-300 transition hover:bg-blue-500/30">
                📥 Download Backup
              </button>
              <button className="w-full rounded-lg bg-yellow-500/20 px-4 py-3 text-sm font-semibold text-yellow-300 transition hover:bg-yellow-500/30">
                ⚠️ Restore from Backup
              </button>
            </div>

            <div className="mt-4 rounded-lg bg-slate-950/50 p-4">
              <p className="text-xs text-slate-500 mb-3">Recent Backups</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-300">
                  <span>backup_2024_04_30.bak</span>
                  <span className="text-slate-500">2.4 MB</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>backup_2024_04_23.bak</span>
                  <span className="text-slate-500">2.3 MB</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>backup_2024_04_16.bak</span>
                  <span className="text-slate-500">2.2 MB</span>
                </div>
              </div>
            </div>
          </SettingSection>
        </div>
      )}

      {/* Save Button */}
      <button
        onClick={handleSaveSettings}
        className="w-full rounded-lg bg-emerald-500 px-6 py-3 text-lg font-semibold text-slate-950 transition hover:bg-emerald-400"
      >
        💾 Save All Settings
      </button>
    </section>
  )
}

export default AdminSettings
