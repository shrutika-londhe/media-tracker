import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../services/api.js'
import { STATUS_LABELS, STATUS_OPTIONS, CATEGORY_LABELS, CATEGORY_GROUPS } from '../constants.js'
import { getStatusBadgeClasses } from '../theme.js'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const location = useLocation()

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [searchInput, setSearchInput] = useState('')
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')
  const [genre, setGenre] = useState('')
  const [favoriteOnly, setFavoriteOnly] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setQ(searchInput.trim()), 350)
    return () => clearTimeout(timer)
  }, [searchInput])

  useEffect(() => {
    let cancelled = false
    async function loadItems() {
      setLoading(true)
      try {
        const params = { size: 50, sort: 'updatedAt,desc' }
        if (q) params.q = q
        if (category) params.category = category
        if (status) params.status = status
        if (genre) params.genre = genre
        if (favoriteOnly) params.favorite = true

        const { data } = await api.get('/media-items', { params })
        if (!cancelled) {
          setItems(data.content || [])
          setError('')
        }
      } catch (err) {
        if (!cancelled) setError('Could not load your items yet — the API might still be starting up.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    loadItems()
    return () => {
      cancelled = true
    }
  }, [q, category, status, genre, favoriteOnly])

  const counts = items.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1
    return acc
  }, {})

  const hasActiveFilters = q || category || status || genre || favoriteOnly

  function clearFilters() {
    setSearchInput('')
    setQ('')
    setCategory('')
    setStatus('')
    setGenre('')
    setFavoriteOnly(false)
  }

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'Wishlist', path: '/wishlist', icon: '✨' },
    { label: 'Collections', path: '/collections', icon: '🗂️' },
    { label: 'Stats', path: '/stats', icon: '📈' },
  ]

  return (
    <div className="flex min-h-screen font-sans bg-ink-950 text-moss-50">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-ink-700 flex flex-col justify-between p-5 sticky top-0 h-screen shadow-sm bg-ink-900">
        <div>
          {/* Brand Header */}
          <div className="flex items-center gap-3 px-2 py-3 mb-6 border-b border-ink-700">
            <span className="text-xl p-2 rounded-xl shadow-sm bg-moss-500 text-moss-50">📖</span>
            <div>
              <h1 className="font-display font-bold text-lg text-moss-50">
                Media Tracker
              </h1>
              <p className="text-[10px] uppercase tracking-wider font-bold text-moss-400">Personal Library</p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1.5">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-moss-500 text-ink-950'
                      : 'text-moss-100 hover:bg-ink-800'
                  }`}
                >
                  <span className="text-base">{link.icon}</span>
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Export Actions */}
          <div className="mt-8 pt-4 border-t border-ink-700 space-y-1">
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider mb-2 text-moss-400">
              Data Operations
            </p>
            <button
              onClick={() => downloadExport('csv')}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-colors text-moss-100 hover:bg-ink-800"
            >
              <span>📄</span> Export as CSV
            </button>
            <button
              onClick={() => downloadExport('json')}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-colors text-moss-100 hover:bg-ink-800"
            >
              <span>📦</span> Export as JSON
            </button>
          </div>
        </div>

        {/* User Profile */}
        <div className="pt-4 border-t border-ink-700">
          <div className="flex items-center justify-between p-2.5 rounded-xl border border-ink-700 bg-ink-800">
            <div className="truncate pr-2">
              <p className="text-[10px] font-medium text-moss-400">Logged in as</p>
              <p className="text-xs font-bold truncate text-moss-50">{user?.displayName || 'User'}</p>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg transition-colors text-moss-100 hover:bg-ember-500/20 hover:text-ember-400"
              title="Sign out"
            >
              🚪
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 max-w-6xl mx-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-display font-extrabold text-moss-50">Overview</h2>
            <p className="text-sm font-medium text-moss-400">Track and manage your current shelf collection</p>
          </div>
          <Link
            to="/items/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold shadow-md hover:opacity-90 transition-all bg-ember-500 text-ink-950"
          >
            <span>+</span> Add new item
          </Link>
        </div>

        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total items" value={items.length} variant="neutral" />
          <StatCard label="In progress" value={counts.IN_PROGRESS || 0} variant="ember" />
          <StatCard label="Completed" value={counts.COMPLETED || 0} variant="moss" />
          <StatCard label="Planned" value={counts.PLANNED || 0} variant="subtle" />
        </div>

        {/* Filter Bar */}
        <div className="p-4 rounded-2xl border border-ink-700 mb-6 flex flex-wrap items-center gap-3 shadow-sm bg-ink-900">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="🔍 Search titles…"
            className="flex-1 min-w-[200px] rounded-xl border border-ink-700 px-4 py-2 text-sm outline-none transition-all bg-ink-950 text-moss-50 placeholder:text-ink-700 focus:border-moss-500"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border border-ink-700 px-3 py-2 text-sm outline-none font-medium bg-ink-950 text-moss-50 focus:border-moss-500"
          >
            <option value="">All categories</option>
            {CATEGORY_GROUPS.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.options.map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </optgroup>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-xl border border-ink-700 px-3 py-2 text-sm outline-none font-medium bg-ink-950 text-moss-50 focus:border-moss-500"
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <input
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            placeholder="Genre…"
            className="w-32 rounded-xl border border-ink-700 px-3 py-2 text-sm outline-none bg-ink-950 text-moss-50 placeholder:text-ink-700 focus:border-moss-500"
          />
          <label className="flex items-center gap-2 text-xs font-bold border border-ink-700 px-3 py-2.5 rounded-xl cursor-pointer select-none bg-ink-950 text-moss-50">
            <input
              type="checkbox"
              checked={favoriteOnly}
              onChange={(e) => setFavoriteOnly(e.target.checked)}
              className="rounded accent-moss-500"
            />
            ★ Favorites
          </label>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-xs font-bold px-2 py-1 hover:underline text-moss-500">
              Clear filters
            </button>
          )}
        </div>

        {/* Content Section */}
        <div className="rounded-2xl border border-ink-700 overflow-hidden shadow-sm bg-ink-900">
          <div className="px-6 py-4 border-b border-ink-700 flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-moss-50">
              {hasActiveFilters ? 'Filtered Results' : 'Recent Items'}
            </h3>
            <span className="text-xs font-mono font-bold text-moss-400">{items.length} items listed</span>
          </div>

          {loading && (
            <p className="px-6 py-12 text-center text-sm font-semibold animate-pulse text-moss-400">
              Loading your shelf library…
            </p>
          )}
          {!loading && error && (
            <p className="px-6 py-12 text-center text-sm font-bold text-ember-400">{error}</p>
          )}

          {!loading && !error && items.length === 0 && !hasActiveFilters && (
            <div className="px-6 py-14 text-center">
              <span className="text-4xl">📚</span>
              <p className="font-bold mt-3 text-moss-50">Your shelf is completely empty</p>
              <p className="text-sm mt-1 mb-5 font-medium text-moss-400">
                Start populating your library with your favorite media.
              </p>
              <Link
                to="/items/new"
                className="inline-block font-bold px-4 py-2 rounded-xl text-xs shadow-sm bg-moss-500 text-ink-950"
              >
                + Add item
              </Link>
            </div>
          )}

          {!loading && !error && items.length === 0 && hasActiveFilters && (
            <p className="px-6 py-12 text-center text-sm font-medium text-moss-400">
              No items matching your criteria were found.
            </p>
          )}

          {!loading && !error && items.length > 0 && (
            <ul className="divide-y divide-ink-700">
              {items.map((item) => (
                <li key={item.id}>
                                   <Link
                    to={`/items/${item.id}/edit`}
                    className="px-5 py-3 flex items-center justify-between hover:bg-ink-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {item.coverImageUrl ? (
                        <img
                          src={item.coverImageUrl}
                          alt=""
                          className="w-9 h-12 object-cover rounded-md border border-ink-700 flex-shrink-0"
                          onError={(e) => (e.target.style.visibility = 'hidden')}
                        />
                      ) : (
                        <div className="w-9 h-12 rounded-md border border-ink-700 bg-ink-800 flex-shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="text-stone-100 font-medium truncate">
                          {item.favorite && <span className="text-ember-400 mr-1">★</span>}
                          {item.title}
                        </p>
                        <p className="text-xs text-stone-500">{CATEGORY_LABELS[item.category] || item.category}</p>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-ink-800 text-stone-300 border border-ink-700 flex-shrink-0 ml-3">
                      {STATUS_LABELS[item.status] || item.status}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  )
}

async function downloadExport(format) {
  const response = await api.get(`/media-items/export/${format}`, { responseType: 'blob' })
  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.download = `media-tracker-export.${format}`
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

const STAT_CARD_VARIANTS = {
  neutral: 'bg-ink-900 border-ink-700 text-moss-50',
  ember: 'bg-ember-500 border-ember-500 text-ink-950',
  moss: 'bg-moss-600 border-moss-600 text-moss-50',
  subtle: 'bg-ink-800 border-ink-700 text-moss-100',
}

function StatCard({ label, value, variant = 'neutral' }) {
  return (
    <div className={`rounded-2xl border px-5 py-4 shadow-sm ${STAT_CARD_VARIANTS[variant]}`}>
      <p className="text-3xl font-extrabold tracking-tight">{value}</p>
      <p className="text-xs font-bold mt-1">{label}</p>
    </div>
  )
}
