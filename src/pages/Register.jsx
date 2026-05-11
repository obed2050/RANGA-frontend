import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext.jsx'

const Register = () => {
  const { signup }  = useAuth()
  const navigate    = useNavigate()
  const [form, setForm] = useState({
    fullName: '', email: '', phoneNumber: '', location: '',
    gender: 'female', password: '', role: 'seller',
  })
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw]   = useState(false)

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await signup(form)
      toast.success(`Welcome to RANGA, ${user.fullName}!`)
      navigate(user.role === 'seller' ? '/dashboard' : '/home')
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'input mt-1.5'
  const labelClass = 'block text-sm font-medium text-slate-700 dark:text-slate-300'

  return (
    <div className="section py-16">
      <div className="mx-auto max-w-2xl animate-slide-up">
        <div className="card p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <img src="/RANGA_LOGO-removebg-preview.png" alt="RANGA" className="mx-auto mb-4 h-16 w-auto" />
            <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Create account</h1>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className={labelClass}>
                Full name *
                <input type="text" value={form.fullName} onChange={(e) => set('fullName', e.target.value)}
                  className={inputClass} placeholder="Jane Doe" required />
              </label>
              <label className={labelClass}>
                Email address *
                <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)}
                  className={inputClass} placeholder="you@example.com" required />
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className={labelClass}>
                Phone number *
                <input type="tel" value={form.phoneNumber} onChange={(e) => set('phoneNumber', e.target.value)}
                  className={inputClass} placeholder="+254 700 000 000" required />
              </label>
              <label className={labelClass}>
                Location *
                <input type="text" value={form.location} onChange={(e) => set('location', e.target.value)}
                  className={inputClass} placeholder="Nairobi, Kenya" required />
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className={labelClass}>
                Gender
                <select value={form.gender} onChange={(e) => set('gender', e.target.value)} className={inputClass}>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </label>
              <label className={labelClass}>
                Account type
                <select value={form.role} onChange={(e) => set('role', e.target.value)} className={inputClass}>
                  <option value="seller">Seller — post ads</option>
                  <option value="buyer">Buyer — browse ads</option>
                </select>
              </label>
            </div>

            <label className={labelClass}>
              Password *
              <div className="relative mt-1.5">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => set('password', e.target.value)}
                  className="input pr-12"
                  placeholder="Min. 6 characters"
                  required
                  minLength={6}
                />
                <button type="button" onClick={() => setShowPw((c) => !c)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-gold-500">
                  {showPw ? 'Hide' : 'Show'}
                </button>
              </div>
            </label>

            <button type="submit" disabled={loading} className="btn btn-gold btn-lg w-full mt-2">
              {loading ? 'Creating account...' : '🚀 Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-gold-600 hover:text-gold-500 dark:text-gold-400">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
