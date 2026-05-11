import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext.jsx'

const Login = () => {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form, setForm]     = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw]   = useState(false)

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(form)
      toast.success(`Welcome back, ${user.fullName}!`)
      navigate(user.role === 'admin' ? '/admin' : user.role === 'seller' ? '/dashboard' : '/home')
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="section flex min-h-[calc(100vh-80px)] items-center justify-center py-16">
      <div className="w-full max-w-md animate-slide-up">
        {/* Card */}
        <div className="card p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <img src="/RANGA_LOGO-removebg-preview.png" alt="RANGA" className="mx-auto mb-4 h-16 w-auto" />
            <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Login</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Email address
              <input
                type="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                className="input mt-1.5"
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Password
              <div className="relative mt-1.5">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => set('password', e.target.value)}
                  className="input pr-12"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((c) => !c)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-gold-500"
                >
                  {showPw ? 'Hide' : 'Show'}
                </button>
              </div>
            </label>

            <button type="submit" disabled={loading} className="btn btn-gold btn-lg w-full">
              {loading ? 'Signing in...' : '🔐 Login'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-gold-600 hover:text-gold-500 dark:text-gold-400">
              Sign up free
            </Link>
          </p>
        </div>

        <p className="mt-3 text-center text-xs text-slate-400">
          Demo: email na "seller" = seller account
        </p>
      </div>
    </div>
  )
}

export default Login
