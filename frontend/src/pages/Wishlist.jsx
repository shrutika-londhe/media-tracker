import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api.js'
import { CATEGORY_LABELS } from '../constants.js'

export default function Wishlist() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const { data } = await api.get('/media-items', { params: { wishlist: true, size: 100 } })
        if (!cancelled) setItems(data.content || [])
      } catch (err) {
        if (!cancelled) setError('Could not load your wishlist.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="min-h-screen">
      <header className="border-b border-ink-800">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-3">
          <Link to="/dashboard" className="text-stone-400 hover:text-stone-100 text-sm">
            ← Back
          </Link>
          <h1 className="font-display text-lg text-stone-50">Wishlist</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <p className="text-sm text-stone-500 mb-4">
          Things you want to read, watch, or listen to — mark any item's "Add to wishlist" box to see it here.
        </p>

        <div className="rounded-2xl border border-ink-700 bg-ink-900">
          {loading && <p className="px-5 py-8 text-sm text-stone-400">Loading your wishlist…</p>}
          {!loading && error && <p className="px-5 py-8 text-sm text-ember-400">{error}</p>}
          {!loading && !error && items.length === 0 && (
            <div className="px-5 py-10 text-center">
              <p className="text-stone-300 font-medium">Your wishlist is empty</p>
              <p className="text-sm text-stone-500 mt-1 mb-4">
                Add an item and check "Add to wishlist", or edit an existing one.
              </p>
              <Link
                to="/items/new"
                className="inline-block rounded-lg bg-moss-500 hover:bg-moss-600 transition-colors px-4 py-2 text-sm font-semibold text-ink-950"
              >
                + Add item
              </Link>
            </div>
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
