import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import AdCard from './AdCard.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const CATEGORIES = {
  Services:   ['Photography', 'Cleaning', 'Repair', 'Gardening', 'Delivery', 'Tutoring'],
  Products:   ['Fashion', 'Accessories', 'Electronics', 'Home', 'Food', 'Beauty'],
  RealEstate: ['Rent', 'Sale', 'Land', 'Commercial'],
  Vehicles:   ['Cars', 'Motorcycles', 'Trucks', 'Parts'],
}

const UploadForm = ({ initialData = null, onSubmit }) => {
  const { user } = useAuth()
  const [form, setForm] = useState({
    title:       initialData?.title       || '',
    description: initialData?.description || '',
    price:       initialData?.price       || '',
    currency:    initialData?.currency    || 'RWF',
    category:    initialData?.category    || 'Services',
    subcategory: initialData?.subcategory || 'Photography',
    mediaUrl:    initialData?.mediaUrl    || '',
    mediaType:   initialData?.mediaType   || 'image',
    file:        null,
  })
  const [previewUrl, setPreviewUrl] = useState(initialData?.mediaUrl || '')

  const subcategoryOptions = useMemo(() => CATEGORIES[form.category] || [], [form.category])

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }))

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 4 * 1024 * 1024) {
      toast.error('File must be 4 MB or less.')
      return
    }
    const mediaType = file.type.startsWith('video') ? 'video' : 'image'
    const reader = new FileReader()
    reader.onload = () => {
      const url = reader.result
      setForm((p) => ({ ...p, file, mediaType, mediaUrl: url }))
      setPreviewUrl(url)
    }
    reader.onerror = () => toast.error('Could not read file.')
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title || !form.description || !form.category || !form.subcategory) {
      toast.error('Please fill all required fields.')
      return
    }
    if (!previewUrl) {
      toast.error('Please upload an image or video.')
      return
    }
    onSubmit({
      id:          initialData?.id || `ad-${Date.now()}`,
      title:       form.title,
      description: form.description,
      price:       form.price,
      currency:    form.currency,
      category:    form.category,
      subcategory: form.subcategory,
      location:    user?.location    || 'Kigali, Rwanda',
      sellerName:  user?.fullName    || 'RANGA Seller',
      sellerId:    user?.id          || `seller-${Date.now()}`,
      whatsapp:    user?.whatsappNumber?.replace(/\D/g, '') || user?.phoneNumber?.replace(/\D/g, '') || '250700000000',
      phone:       user?.phoneNumber || '0700000000',
      mediaType:   form.mediaType,
      mediaUrl:    previewUrl,
    })
  }

  const inputClass = 'input mt-1.5'

  return (
    <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
      {/* Form */}
      <form onSubmit={handleSubmit} className="card space-y-6 p-6">
        <div>
          <p className="page-label">Upload Ad</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            {initialData ? 'Edit listing' : 'Create a new listing'}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Fill in the details below. Fields marked * are required.
          </p>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Title *
            <input
              type="text"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              className={inputClass}
              placeholder="e.g. Mobile Car Wash Service"
              required
            />
          </label>

          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Description *
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={4}
              className={inputClass}
              placeholder="Describe your product or service..."
              required
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Category *
              <select
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value, subcategory: CATEGORIES[e.target.value]?.[0] || '' }))}
                className={inputClass}
                required
              >
                {Object.keys(CATEGORIES).map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Subcategory *
              <select
                value={form.subcategory}
                onChange={(e) => set('subcategory', e.target.value)}
                className={inputClass}
                required
              >
                {subcategoryOptions.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Price (optional)
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => set('price', e.target.value)}
                className={inputClass}
                placeholder="e.g. 25000"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Currency
              <select
                value={form.currency}
                onChange={(e) => set('currency', e.target.value)}
                className={inputClass}
              >
                <option value="RWF">🇷🇼 RWF — Rwandan Franc</option>
                <option value="USD">🇺🇸 USD — US Dollar</option>
                <option value="EUR">🇪🇺 EUR — Euro</option>
                <option value="KES">🇰🇪 KES — Kenyan Shilling</option>
                <option value="UGX">🇺🇬 UGX — Ugandan Shilling</option>
                <option value="TZS">🇹🇿 TZS — Tanzanian Shilling</option>
                <option value="GBP">🇬🇧 GBP — British Pound</option>
              </select>
            </label>
          </div>

          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Image or Video *
            <div className="mt-1.5 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-4 text-center transition hover:border-gold-400 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-gold-500">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,video/mp4"
                onChange={handleFile}
                className="hidden"
                id="media-upload"
              />
              <label htmlFor="media-upload" className="cursor-pointer">
                {previewUrl ? (
                  <div className="space-y-2">
                    {form.mediaType === 'video' ? (
                      <video src={previewUrl} className="mx-auto h-32 rounded-lg object-cover" muted playsInline />
                    ) : (
                      <img src={previewUrl} alt="preview" className="mx-auto h-32 rounded-lg object-cover" />
                    )}
                    <p className="text-xs text-gold-600 dark:text-gold-400">Click to change file</p>
                  </div>
                ) : (
                  <div className="space-y-2 py-4">
                    <p className="text-2xl">📁</p>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Click to upload</p>
                    <p className="text-xs text-slate-400">JPG, PNG, WEBP, GIF, MP4 · Max 4 MB</p>
                  </div>
                )}
              </label>
            </div>
          </label>
        </div>

        <button type="submit" className="btn btn-gold btn-lg w-full">
          {initialData ? '✅ Update Listing' : '🚀 Publish Ad'}
        </button>
      </form>

      {/* Live preview */}
      <div className="card p-5">
        <p className="page-label mb-4">Live Preview</p>
        <AdCard
          ad={{
            id:          initialData?.id || 'preview',
            title:       form.title       || 'Your Ad Title',
            description: form.description || 'Your description appears here.',
            category:    form.category,
            subcategory: form.subcategory,
            price:       form.price,
            currency:    form.currency,
            sellerName:  user?.fullName   || 'Seller Name',
            whatsapp:    user?.phoneNumber?.replace(/\D/g, '') || '254700000000',
            phone:       user?.phoneNumber || '0700000000',
            mediaType:   form.mediaType,
            mediaUrl:    previewUrl || '/house1.webp',
          }}
        />
        <p className="mt-4 text-center text-xs text-slate-400">This is how your ad will appear to buyers.</p>
      </div>
    </div>
  )
}

export default UploadForm
