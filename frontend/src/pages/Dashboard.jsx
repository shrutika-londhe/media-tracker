import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../services/api.js'
import { STATUS_LABELS, STATUS_OPTIONS, CATEGORY_LABELS, CATEGORY_GROUPS } from '../constants.js'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [searchInput, setSearchInput] = useState('')
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')
  const [favoriteOnly, setFavoriteOnly] = useState(false)

  // Debounce the search box so we don't fire a request on every keystroke.
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
  }, [q, category, status, favoriteOnly])

  const counts = items.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1
    return acc
  }, {})

  const hasActiveFilters = q || category || status || favoriteOnly
function clearFilters() {
    setSearchInput('')
    setQ('')
    setCategory('')
    setStatus('')
    setFavoriteOnly(false)
  }
  return (
    <div className="min-h-screen">
      <header className="border-b border-ink-800">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📖</span>
            <span className="font-display font-semibold text-stone-50">Media Tracker</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/wishlist" className="text-stone-400 hover:text-stone-100 transition-colors">
              Wishlist
            </Link>
            <Link to="/collections" className="text-stone-400 hover:text-stone-100 transition-colors">
              Collections
            </Link>
            <Link to="/stats" className="text-stone-400 hover:text-stone-100 transition-colors">
              Stats
            </Link>
            <Link
              to="/items/new"
              className="rounded-lg bg-moss-500 hover:bg-moss-600 transition-colors px-3 py-1.5 text-xs font-semibold text-ink-950"
            >
              + Add item
            </Link>
            <span className="text-stone-400">
              Hi, <span className="text-stone-100 font-medium">{user?.displayName}</span>
            </span>
            <button
              onClick={logout}
              className="text-stone-400 hover:text-ember-400 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total items" value={items.length} />
          <StatCard label="In progress" value={counts.IN_PROGRESS || 0} accent="moss" />
          <StatCard label="Completed" value={counts.COMPLETED || 0} accent="moss" />
          <StatCard label="Planned" value={counts.PLANNED || 0} />
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search titles…"
            className="flex-1 min-w-[180px] rounded-lg bg-ink-800 border border-ink-700 px-3 py-2 text-sm text-stone-100 outline-none focus:border-moss-500 focus:ring-1 focus:ring-moss-500"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg bg-ink-800 border border-ink-700 px-3 py-2 text-sm text-stone-100 outline-none focus:border-moss-500 focus:ring-1 focus:ring-moss-500"
          >
            <option value="">All categories</option>
            {CATEGORY_GROUPS.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.options.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg bg-ink-800 border border-ink-700 px-3 py-2 text-sm text-stone-100 outline-none focus:border-moss-500 focus:ring-1 focus:ring-moss-500"
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-sm text-stone-300">
            <input
              type="checkbox"
              checked={favoriteOnly}
              onChange={(e) => setFavoriteOnly(e.target.checked)}
              className="rounded border-ink-700 bg-ink-800 text-moss-500 focus:ring-moss-500"
            />
            Favorites only
          </label>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-sm text-stone-500 hover:text-ember-400">
              Clear filters
            </button>
          )}
        </div>

        <div className="rounded-2xl border border-ink-700 bg-ink-900">
          <div className="px-5 py-4 border-b border-ink-800 flex items-center justify-between">
            <h2 className="font-display text-lg text-stone-50">
              {hasActiveFilters ? 'Results' : 'Recent activity'}
            </h2>
          </div>

          {loading && <p className="px-5 py-8 text-sm text-stone-400">Loading your shelf…</p>}
          {!loading && error && <p className="px-5 py-8 text-sm text-ember-400">{error}</p>}
          {!loading && !error && items.length === 0 && !hasActiveFilters && (
            <div className="px-5 py-10 text-center">
              <p className="text-stone-300 font-medium">Nothing tracked yet</p>
              <p className="text-sm text-stone-500 mt-1 mb-4">Add your first book, show, or podcast to get started.</p>
              <Link
                to="/items/new"
                className="inline-block rounded-lg bg-moss-500 hover:bg-moss-600 transition-colors px-4 py-2 text-sm font-semibold text-ink-950"
              >
                + Add item
              </Link>
            </div>
          )}
          {!loading && !error && items.length === 0 && hasActiveFilters && (
            <p className="px-5 py-10 text-center text-sm text-stone-500">
              No items match your search or filters.
            </p>
          )}
          {!loading && !error && items.length > 0 && (
            <ul className="divide-y divide-ink-800">
              {items.map((item) => (
                <li key={item.id}>
                  <Link
                    to={`/items/${item.id}/edit`}
                    className="px-5 py-3 flex items-center justify-between hover:bg-ink-800/50 transition-colors"
                  >
                    <div>
                      <p className="text-stone-100 font-medium">
                        {item.favorite && <span className="text-ember-400 mr-1">★</span>}
                        {item.title}
                      </p>
                      <p className="text-xs text-stone-500">{CATEGORY_LABELS[item.category] || item.category}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-ink-800 text-stone-300 border border-ink-700">
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

function StatCard({ label, value, accent }) {
  return (
    <div className="rounded-xl border border-ink-700 bg-ink-900 px-4 py-3">
      <p className={`text-2xl font-display font-semibold ${accent === 'moss' ? 'text-moss-400' : 'text-stone-100'}`}>
        {value}
      </p>
      <p className="text-xs text-stone-500 mt-0.5">{label}</p>
    </div>
  )
}