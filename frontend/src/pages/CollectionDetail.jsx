import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../services/api.js'
import { CATEGORY_LABELS } from '../constants.js'

export default function CollectionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [collection, setCollection] = useState(null)
  const [allItems, setAllItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [renaming, setRenaming] = useState(false)
  const [nameDraft, setNameDraft] = useState('')
  const [addItemId, setAddItemId] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    load()
  }, [id])

  async function load() {
    setLoading(true)
    try {
      const [collectionRes, itemsRes] = await Promise.all([
        api.get(`/collections/${id}`),
        api.get('/media-items', { params: { size: 200 } }),
      ])
      setCollection(collectionRes.data)
      setNameDraft(collectionRes.data.name)
      setAllItems(itemsRes.data.content || [])
      setError('')
    } catch (err) {
      setError('Could not load this collection.')
    } finally {
      setLoading(false)
    }
  }

  async function handleRename(e) {
    e.preventDefault()
    const name = nameDraft.trim()
    if (!name || name === collection.name) {
      setRenaming(false)
      return
    }
    setBusy(true)
    try {
      const { data } = await api.put(`/collections/${id}`, { name })
      setCollection(data)
      setRenaming(false)
    } catch (err) {
      setError('Could not rename this collection.')
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Delete "${collection.name}"? This only removes the collection, not the items in it.`)) return
    setBusy(true)
    try {
      await api.delete(`/collections/${id}`)
      navigate('/collections')
    } catch (err) {
      setError('Could not delete this collection.')
      setBusy(false)
    }
  }

  async function handleAddItem(e) {
    e.preventDefault()
    if (!addItemId) return
    setBusy(true)
    try {
      const { data } = await api.post(`/collections/${id}/items/${addItemId}`)
      setCollection(data)
      setAddItemId('')
    } catch (err) {
      setError('Could not add that item.')
    } finally {
      setBusy(false)
    }
  }

  async function handleRemoveItem(itemId) {
    setBusy(true)
    try {
      const { data } = await api.delete(`/collections/${id}/items/${itemId}`)
      setCollection(data)
    } catch (err) {
      setError('Could not remove that item.')
    } finally {
      setBusy(false)
    }
  }

  if (loading) {
    return <p className="max-w-3xl mx-auto px-6 py-10 text-sm text-stone-400">Loading collection…</p>
  }

  if (error && !collection) {
    return <p className="max-w-3xl mx-auto px-6 py-10 text-sm text-ember-400">{error}</p>
  }

  const availableToAdd = allItems.filter((item) => !collection.items.some((ci) => ci.id === item.id))

  return (
    <div className="min-h-screen">
      <header className="border-b border-ink-800">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-3">
          <Link to="/collections" className="text-stone-400 hover:text-stone-100 text-sm">
            ← Back
          </Link>
          {!renaming ? (
            <h1
              className="font-display text-lg text-stone-50 cursor-pointer hover:text-moss-400"
              onClick={() => setRenaming(true)}
              title="Click to rename"
            >
              {collection.name}
            </h1>
          ) : (
            <form onSubmit={handleRename} className="flex items-center gap-2">
              <input
                autoFocus
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                onBlur={handleRename}
                className="rounded-lg bg-ink-800 border border-ink-700 px-2 py-1 text-sm text-stone-100 outline-none focus:border-moss-500"
              />
            </form>
          )}
          <button
            onClick={handleDelete}
            disabled={busy}
            className="ml-auto text-sm text-ember-400 hover:text-ember-500 disabled:opacity-50"
          >
            Delete collection
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {error && <p className="text-sm text-ember-400 mb-4">{error}</p>}

        <form onSubmit={handleAddItem} className="flex gap-2 mb-6">
          <select
            value={addItemId}
            onChange={(e) => setAddItemId(e.target.value)}
            className="flex-1 rounded-lg bg-ink-800 border border-ink-700 px-3 py-2 text-sm text-stone-100 outline-none focus:border-moss-500 focus:ring-1 focus:ring-moss-500"
          >
            <option value="">Add an item to this collection…</option>
            {availableToAdd.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={busy || !addItemId}
            className="rounded-lg bg-moss-500 hover:bg-moss-600 transition-colors px-4 py-2 text-sm font-semibold text-ink-950 disabled:opacity-60"
          >
            Add
          </button>
        </form>

        <div className="rounded-2xl border border-ink-700 bg-ink-900">
          {collection.items.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-stone-500">
              No items in this collection yet — add one above.
            </p>
          ) : (
            <ul className="divide-y divide-ink-800">
              {collection.items.map((item) => (
                <li key={item.id} className="px-5 py-3 flex items-center justify-between">
                  <Link to={`/items/${item.id}/edit`} className="hover:text-moss-400">
                    <p className="text-stone-100 font-medium">{item.title}</p>
                    <p className="text-xs text-stone-500">{CATEGORY_LABELS[item.category] || item.category}</p>
                  </Link>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={busy}
                    className="text-xs text-stone-500 hover:text-ember-400 disabled:opacity-50"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  )
}
