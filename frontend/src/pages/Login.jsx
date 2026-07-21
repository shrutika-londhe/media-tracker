import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Could not sign in. Check your details and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="inline-block text-3xl leading-none">📖</span>
          <h1 className="mt-3 text-2xl font-display font-semibold text-stone-50">Welcome back</h1>
          <p className="mt-1 text-sm text-stone-400">Pick up right where your shelf left off.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-ink-700 bg-ink-900 p-6">
          {error && (
            <p className="rounded-lg bg-ember-500/10 border border-ember-500/30 px-3 py-2 text-sm text-ember-400">
              {error}
            </p>
          )}
          <div>
            <label className="block text-xs font-medium text-stone-400 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg bg-ink-800 border border-ink-700 px-3 py-2 text-sm text-stone-100 outline-none focus:border-moss-500 focus:ring-1 focus:ring-moss-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-400 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg bg-ink-800 border border-ink-700 px-3 py-2 text-sm text-stone-100 outline-none focus:border-moss-500 focus:ring-1 focus:ring-moss-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-moss-500 hover:bg-moss-600 transition-colors py-2 text-sm font-semibold text-ink-950 disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-stone-400">
          New here?{' '}
          <Link to="/register" className="text-moss-400 hover:text-moss-500 font-medium">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}
