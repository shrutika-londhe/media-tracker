import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api.js'

export default function Collections() {
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const { data } = await api.get('/collections')
      setCollections(data)
      setError('')
    } catch (err) {
      setError('Could not load your collections.')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(e) {
    e.preventDefault()
    const name = newName.trim()
    if (!name) return
    setCreating(true)
    try {
      await api.post('/collections', { name })
      setNewName('')
      await load()
    } catch (err) {
      setError('Could not create that collection.')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-ink-800">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-3">
          <Link to="/dashboard" className="text-stone-400 hover:text-stone-100 text-sm">
            ← Back
          </Link>
          <h1 className="font-display text-lg text-stone-50">Collections</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <form onSubmit={handleCreate} className="flex gap-2 mb-6">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New collection name, e.g. Top 10"
            className="flex-1 rounded-lg bg-ink-800 border border-ink-700 px-3 py-2 text-sm text-stone-100 outline-none focus:border-moss-500 focus:ring-1 focus:ring-moss-500"
          />
          <button
            type="submit"
            disabled={creating || !newName.trim()}
            className="rounded-lg bg-moss-500 hover:bg-moss-600 transition-colors px-4 py-2 text-sm font-semibold text-ink-950 disabled:opacity-60"
          >
            {creating ? 'Creating…' : 'Create'}
          </button>
        </form>

        {error && <p className="text-sm text-ember-400 mb-4">{error}</p>}

        <div className="rounded-2xl border border-ink-700 bg-ink-900">
          {loading && <p className="px-5 py-8 text-sm text-stone-400">Loading your collections…</p>}
          {!loading && collections.length === 0 && (
            <p className="px-5 py-10 text-center text-sm text-stone-500">
              No collections yet — create one above to start grouping items together.
            </p>
          )}
          {!loading && collections.length > 0 && (
            <ul className="divide-y divide-ink-800">
              {collections.map((c) => (
                <li key={c.id}>
                  <Link
                    to={`/collections/${c.id}`}
                    className="px-5 py-3 flex items-center justify-between hover:bg-ink-800/50 transition-colors"
                  >
                    <span className="text-stone-100 font-medium">{c.name}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-ink-800 text-stone-300 border border-ink-700">
                      {c.itemCount} {c.itemCount === 1 ? 'item' : 'items'}
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
