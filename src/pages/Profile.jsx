import { useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext.jsx'
import Sidebar from '../components/Sidebar.jsx'

const Profile = () => {
  const { user, updateProfile } = useAuth()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    fullName:       user?.fullName       || '',
    email:          user?.email          || '',
    phoneNumber:    user?.phoneNumber    || '',
    whatsappNumber: user?.whatsappNumber || user?.phoneNumber || '',
    location:       user?.location       || '',
    gender:         user?.gender         || 'female',
    password:       '',
  })

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  const handleSave = () => {
    if (!form.fullName || !form.email || !form.phoneNumber || !form.whatsappNumber || !form.location) {
      toast.error('Please fill all required fields.')
      return
    }
    const updates = {
      fullName:       form.fullName,
      email:          form.email,
      phoneNumber:    form.phoneNumber,
      whatsappNumber: form.whatsappNumber,
      location:       form.location,
      gender:         form.gender,
    }
    if (form.password.trim()) updates.password = form.password
    updateProfile(updates)
    toast.success('Profile updated!')
    setEditing(false)
  }

  const labelClass = 'block text-sm font-medium text-slate-700 dark:text-slate-300'
  const inputClass = 'input mt-1.5'

  return (
    <div className="section py-10">
      <div className="grid gap-8 xl:grid-cols-[256px_1fr]">
        <Sidebar />

        <div className="space-y-6 min-w-0">
          {/* Header */}
          <div className="card p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gold-100 text-3xl font-bold text-gold-700 dark:bg-gold-500/15 dark:text-gold-400">
                  {user?.fullName?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <p className="page-label">Profile</p>
                  <h1 className="mt-0.5 text-2xl font-bold text-slate-900 dark:text-white">{user?.fullName}</h1>
                  <span className="badge-gold capitalize mt-1">{user?.role}</span>
                </div>
              </div>
              <button
                onClick={() => setEditing((c) => !c)}
                className={`btn btn-sm shrink-0 ${editing ? 'btn-ghost' : 'btn-gold-outline'}`}
              >
                {editing ? '✕ Cancel' : '✏️ Edit Profile'}
              </button>
            </div>
          </div>

          {editing ? (
            /* ── Edit Form ── */
            <div className="card p-6 space-y-5">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">Edit Your Profile</h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className={labelClass}>
                  Full Name *
                  <input value={form.fullName} onChange={(e) => set('fullName', e.target.value)} className={inputClass} placeholder="Jane Doe" />
                </label>
                <label className={labelClass}>
                  Email *
                  <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} className={inputClass} placeholder="you@example.com" />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className={labelClass}>
                  📞 Call Number *
                  <input type="tel" value={form.phoneNumber} onChange={(e) => set('phoneNumber', e.target.value)} className={inputClass} placeholder="+250 700 000 000" />
                </label>
                <label className={labelClass}>
                  💬 WhatsApp Number *
                  <input type="tel" value={form.whatsappNumber} onChange={(e) => set('whatsappNumber', e.target.value)} className={inputClass} placeholder="+250 700 000 000" />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className={labelClass}>
                  Location *
                  <input value={form.location} onChange={(e) => set('location', e.target.value)} className={inputClass} placeholder="Kigali, Rwanda" />
                </label>
                <label className={labelClass}>
                  Gender
                  <select value={form.gender} onChange={(e) => set('gender', e.target.value)} className={inputClass}>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                </label>
              </div>

              <label className={labelClass}>
                New Password <span className="text-slate-400 font-normal">(leave blank to keep current)</span>
                <input type="password" value={form.password} onChange={(e) => set('password', e.target.value)} className={inputClass} placeholder="Min. 6 characters" minLength={6} />
              </label>

              <button onClick={handleSave} className="btn btn-gold btn-lg w-full">
                ✅ Save Changes
              </button>
            </div>
          ) : (
            /* ── View Mode ── */
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: 'Full Name',        value: user?.fullName },
                { label: 'Email',            value: user?.email },
                { label: '📞 Call Number',   value: user?.phoneNumber },
                { label: '💬 WhatsApp',      value: user?.whatsappNumber || user?.phoneNumber },
                { label: 'Location',         value: user?.location },
                { label: 'Gender',           value: user?.gender },
                { label: 'Account Type',     value: user?.role },
              ].map(({ label, value }) => (
                <div key={label} className="card p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
                  <p className="mt-2 text-base font-semibold text-slate-900 dark:text-white">{value || '—'}</p>
                </div>
              ))}
            </div>
          )}

          <div className="card border-gold-200/60 bg-gold-50/40 p-4 dark:border-gold-500/20 dark:bg-gold-500/5">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              💡 Your Call and WhatsApp numbers are shown to buyers on your listings. Keep them up to date.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
