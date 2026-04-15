import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '@/api'

const LoginPage = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState<string | null>(null)
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password) {
      setError('Username and password are required')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res  = await loginUser({ username: username.trim().toLowerCase(), password })
      const { token, user } = res.data.data

      localStorage.setItem('lds_token', token)
      localStorage.setItem('lds_user', JSON.stringify(user))

      navigate(user.role === 'superadmin' ? '/superadmin' : '/admin', { replace: true })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors'

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center px-4">
      {/* Brand */}
      <div className="flex items-center gap-2.5 mb-8">
        <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
        <span className="text-base font-semibold tracking-tight text-neutral-900">
          Lending Decision System
        </span>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-white border border-neutral-200 rounded-xl overflow-hidden">
        <div className="h-1 bg-blue-600" />
        <div className="p-8 space-y-6">
          <div>
            <h1 className="text-lg font-semibold text-neutral-900">Staff login</h1>
            <p className="text-xs text-neutral-400 mt-1">
              Admin and Super Admin access only
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                autoComplete="username"
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className={inputClass}
              />
            </div>

            {error && (
              <div className="px-3 py-2 bg-red-50 border border-red-100 rounded-lg">
                <p className="text-xs text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          {/* Role hint */}
          <div className="border-t border-neutral-100 pt-4 space-y-1.5">
            <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider mb-2">
              Roles
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  admin
                </span>
                <span className="text-xs text-neutral-400">Applications & decisions</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                superadmin
              </span>
              <span className="text-xs text-neutral-400">Full access + audit logs</span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-neutral-400 mt-6">
        Not staff?{' '}
        <a href="/" className="text-blue-600 hover:underline">
          Submit an application
        </a>
      </p>
    </div>
  )
}

export default LoginPage
