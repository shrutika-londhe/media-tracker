import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../services/api.js'
import { STATUS_LABELS, STATUS_OPTIONS, CATEGORY_LABELS, CATEGORY_GROUPS } from '../constants.js'

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

  // Palette Extracted from Image
  const colors = {
    periwinkle: '#6B74C9',   // Deep primary blue/purple
    lavender: '#A8B2E6',     // Light slate periwinkle
    peach: '#F7D6CA',        // Soft cream/peach base
    pink: '#F4B3C2',         // Soft blush pink accents
    bgMain: '#FAF6F4',       // Warm off-white background based on peach tone
    textDark: '#2D3154',     // High-contrast deep slate text
  }

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

  const getStatusBadgeStyle = (itemStatus) => {
    switch(itemStatus) {
      case 'IN_PROGRESS':
        return { backgroundColor: colors.peach, color: colors.textDark, borderColor: colors.pink }
      case 'COMPLETED':
        return { backgroundColor: '#E2F0D9', color: '#2E6930', borderColor: '#B5E0A1' }
      case 'PLANNED':
        return { backgroundColor: colors.lavender + '40', color: colors.periwinkle, borderColor: colors.lavender }
      default:
        return { backgroundColor: colors.bgMain, color: colors.textDark, borderColor: colors.lavender }
    }
  }

  return (
    <div className="flex min-h-screen font-sans" style={{ backgroundColor: colors.bgMain, color: colors.textDark }}>
      {/* Sidebar Navigation */}
      <aside 
        className="w-64 border-r flex flex-col justify-between p-5 sticky top-0 h-screen shadow-sm"
        style={{ backgroundColor: '#FFFFFF', borderColor: colors.lavender }}
      >
        <div>
          {/* Brand Header */}
          <div className="flex items-center gap-3 px-2 py-3 mb-6 border-b" style={{ borderColor: colors.peach }}>
            <span className="text-xl p-2 rounded-xl shadow-sm" style={{ backgroundColor: colors.pink, color: '#FFFFFF' }}>📖</span>
            <div>
              <h1 className="font-display font-bold text-lg" style={{ color: colors.periwinkle }}>
                Media Tracker
              </h1>
              <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: colors.textDark }}>Personal Library</p>
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
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    backgroundColor: isActive ? colors.periwinkle : 'transparent',
                    color: isActive ? '#FFFFFF' : colors.textDark,
                  }}
                >
                  <span className="text-base">{link.icon}</span>
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Export Actions */}
          <div className="mt-8 pt-4 border-t space-y-1" style={{ borderColor: colors.peach }}>
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: colors.periwinkle }}>
              Data Operations
            </p>
            <button
              onClick={() => downloadExport('csv')}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-colors hover:bg-stone-50"
              style={{ color: colors.textDark }}
            >
              <span>📄</span> Export as CSV
            </button>
            <button
              onClick={() => downloadExport('json')}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-colors hover:bg-stone-50"
              style={{ color: colors.textDark }}
            >
              <span>📦</span> Export as JSON
            </button>
          </div>
        </div>

        {/* User Profile */}
        <div className="pt-4 border-t" style={{ borderColor: colors.peach }}>
          <div className="flex items-center justify-between p-2.5 rounded-xl border" style={{ backgroundColor: colors.peach + '40', borderColor: colors.peach }}>
            <div className="truncate pr-2">
              <p className="text-[10px] font-medium" style={{ color: colors.periwinkle }}>Logged in as</p>
              <p className="text-xs font-bold truncate" style={{ color: colors.textDark }}>{user?.displayName || 'User'}</p>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg transition-colors hover:bg-rose-100"
              title="Sign out"
              style={{ color: colors.textDark }}
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
            <h2 className="text-2xl font-extrabold" style={{ color: colors.periwinkle }}>Overview</h2>
            <p className="text-sm font-medium" style={{ color: colors.textDark }}>Track and manage your current shelf collection</p>
          </div>
          <Link
            to="/items/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold shadow-md hover:opacity-90 transition-all"
            style={{ backgroundColor: colors.periwinkle, color: '#FFFFFF' }}
          >
            <span>+</span> Add new item
          </Link>
        </div>

        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total items" value={items.length} bg="#FFFFFF" border={colors.lavender} textColor={colors.periwinkle} />
          <StatCard label="In progress" value={counts.IN_PROGRESS || 0} bg={colors.pink} border={colors.pink} textColor="#FFFFFF" />
          <StatCard label="Completed" value={counts.COMPLETED || 0} bg="#E2F0D9" border="#B5E0A1" textColor="#2E6930" />
          <StatCard label="Planned" value={counts.PLANNED || 0} bg={colors.peach} border={colors.peach} textColor={colors.textDark} />
        </div>

        {/* Filter Bar */}
        <div 
          className="p-4 rounded-2xl border mb-6 flex flex-wrap items-center gap-3 shadow-sm"
          style={{ backgroundColor: '#FFFFFF', borderColor: colors.lavender }}
        >
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="🔍 Search titles…"
            className="flex-1 min-w-[200px] rounded-xl border px-4 py-2 text-sm outline-none transition-all placeholder:text-stone-400"
            style={{ backgroundColor: colors.bgMain, borderColor: colors.lavender, color: colors.textDark }}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border px-3 py-2 text-sm outline-none font-medium"
            style={{ backgroundColor: colors.bgMain, borderColor: colors.lavender, color: colors.textDark }}
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
            className="rounded-xl border px-3 py-2 text-sm outline-none font-medium"
            style={{ backgroundColor: colors.bgMain, borderColor: colors.lavender, color: colors.textDark }}
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
            className="w-32 rounded-xl border px-3 py-2 text-sm outline-none placeholder:text-stone-400"
            style={{ backgroundColor: colors.bgMain, borderColor: colors.lavender, color: colors.textDark }}
          />
          <label 
            className="flex items-center gap-2 text-xs font-bold border px-3 py-2.5 rounded-xl cursor-pointer select-none"
            style={{ backgroundColor: colors.bgMain, borderColor: colors.lavender, color: colors.textDark }}
          >
            <input
              type="checkbox"
              checked={favoriteOnly}
              onChange={(e) => setFavoriteOnly(e.target.checked)}
              className="rounded accent-indigo-500"
            />
            ★ Favorites
          </label>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-xs font-bold px-2 py-1 hover:underline" style={{ color: colors.periwinkle }}>
              Clear filters
            </button>
          )}
        </div>

        {/* Content Section */}
        <div className="rounded-2xl border overflow-hidden shadow-sm" style={{ backgroundColor: '#FFFFFF', borderColor: colors.lavender }}>
          <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: colors.lavender }}>
            <h3 className="font-display font-bold text-base" style={{ color: colors.periwinkle }}>
              {hasActiveFilters ? 'Filtered Results' : 'Recent Items'}
            </h3>
            <span className="text-xs font-mono font-bold" style={{ color: colors.periwinkle }}>{items.length} items listed</span>
          </div>

          {loading && <p className="px-6 py-12 text-center text-sm font-semibold animate-pulse" style={{ color: colors.periwinkle }}>Loading your shelf library…</p>}
          {!loading && error && <p className="px-6 py-12 text-center text-sm font-bold" style={{ color: colors.textDark }}>{error}</p>}
          
          {!loading && !error && items.length === 0 && !hasActiveFilters && (
            <div className="px-6 py-14 text-center">
              <span className="text-4xl">📚</span>
              <p className="font-bold mt-3" style={{ color: colors.periwinkle }}>Your shelf is completely empty</p>
              <p className="text-sm mt-1 mb-5 font-medium" style={{ color: colors.textDark }}>Start populating your library with your favorite media.</p>
              <Link
                to="/items/new"
                className="inline-block font-bold px-4 py-2 rounded-xl text-xs text-white shadow-sm"
                style={{ backgroundColor: colors.periwinkle }}
              >
                + Add item
              </Link>
            </div>
          )}

          {!loading && !error && items.length === 0 && hasActiveFilters && (
            <p className="px-6 py-12 text-center text-sm font-medium" style={{ color: colors.periwinkle }}>
              No items matching your criteria were found.
            </p>
          )}

          {!loading && !error && items.length > 0 && (
            <ul className="divide-y" style={{ borderColor: colors.lavender }}>
              {items.map((item) => (
                <li key={item.id}>
                  <Link
                    to={`/items/${item.id}/edit`}
                    className="px-6 py-4 flex items-center justify-between hover:bg-stone-50 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center border shadow-sm" style={{ backgroundColor: colors.bgMain, borderColor: colors.lavender }}>
                        {item.favorite ? <span className="text-amber-500 text-sm">★</span> : <span className="text-xs" style={{ color: colors.periwinkle }}>📄</span>}
                      </div>
                      <div>
                        <p className="font-bold text-sm transition-colors group-hover:underline" style={{ color: colors.textDark }}>
                          {item.title}
                        </p>
                        <p className="text-xs font-medium" style={{ color: colors.periwinkle }}>
                          {CATEGORY_LABELS[item.category] || item.category}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full border font-bold" style={getStatusBadgeStyle(item.status)}>
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

function StatCard({ label, value, bg, border, textColor }) {
  return (
    <div className="rounded-2xl border px-5 py-4 shadow-sm" style={{ backgroundColor: bg, borderColor: border }}>
      <p className="text-3xl font-extrabold tracking-tight" style={{ color: textColor }}>{value}</p>
      <p className="text-xs font-bold mt-1" style={{ color: textColor }}>{label}</p>
    </div>
  )
}