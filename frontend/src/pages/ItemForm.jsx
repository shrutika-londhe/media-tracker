import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import api from '../services/api.js'
import ChipInput from '../components/ChipInput.jsx'
import { CATEGORY_GROUPS, STATUS_OPTIONS } from '../constants.js'


const EMPTY_FORM = {
  title: '',
  alternativeTitle: '',
  coverImageUrl: '',
  category: '',
  status: 'PLANNED',
  author: '',
  artist: '',
  director: '',
  studio: '',
  publisher: '',
  platform: '',
  genres: [],
  tags: [],
  language: '',
  country: '',
  releaseYear: '',
  rating: '',
  personalRating: '',
  currentProgress: '',
  totalProgress: '',
  currentSeason: '',
  favorite: false,
  wishlist: false,
  review: '',
  notes: '',
}

// Fields the API stores as numbers but the form edits as text inputs.
const NUMERIC_FIELDS = [
  'releaseYear',
  'rating',
  'personalRating',
  'currentProgress',
  'totalProgress',
  'currentSeason',
]

export default function ItemForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    let cancelled = false
    async function loadItem() {
      try {
        const { data } = await api.get(`/media-items/${id}`)
        if (cancelled) return
        setForm({
          ...EMPTY_FORM,
          ...data,
          genres: data.genres || [],
          tags: data.tags || [],
          releaseYear: data.releaseYear ?? '',
          rating: data.rating ?? '',
          personalRating: data.personalRating ?? '',
          currentProgress: data.currentProgress ?? '',
          totalProgress: data.totalProgress ?? '',
          currentSeason: data.currentSeason ?? '',
        })
      } catch (err) {
        if (!cancelled) setError('Could not load this item.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    loadItem()
    return () => {
      cancelled = true
    }
  }, [id, isEdit])

  function setField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleTextChange(field) {
    return (e) => setField(field, e.target.value)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!form.category) {
      setError('Please choose a category.')
      return
    }

    const payload = { ...form }
    NUMERIC_FIELDS.forEach((field) => {
      payload[field] = payload[field] === '' ? null : Number(payload[field])
    })

    setSaving(true)
    try {
      if (isEdit) {
        await api.put(`/media-items/${id}`, payload)
      } else {
        await api.post('/media-items', payload)
      }
      navigate('/dashboard')
    } catch (err) {
      const fieldErrors = err.response?.data?.fieldErrors
      setError(
        fieldErrors
          ? Object.values(fieldErrors)[0]
          : err.response?.data?.error || 'Could not save this item. Please check the fields and try again.',
      )
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm('Delete this item? This cannot be undone.')) return
    setSaving(true)
    try {
      await api.delete(`/media-items/${id}`)
      navigate('/dashboard')
    } catch (err) {
      setError('Could not delete this item.')
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="max-w-2xl mx-auto px-6 py-10 text-sm text-moss-400">Loading item…</p>
  }

  return (
    <div className="min-h-screen bg-ink-950">
      <header className="border-b border-ink-800">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-3">
          <Link to="/dashboard" className="text-moss-400 hover:text-moss-50 text-sm">
            ← Back
          </Link>
          <h1 className="font-display text-lg text-moss-50">{isEdit ? 'Edit item' : 'Add item'}</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <p className="rounded-lg bg-ember-500/10 border border-ember-500/30 px-3 py-2 text-sm text-ember-400">
              {error}
            </p>
          )}

          <Section title="Basics">
            <Field label="Title" required>
              <input
                required
                value={form.title}
                onChange={handleTextChange('title')}
                className={inputClass}
                placeholder="e.g. Solo Leveling"
              />
            </Field>
            <Field label="Alternative title">
              <input value={form.alternativeTitle} onChange={handleTextChange('alternativeTitle')} className={inputClass} />
            </Field>

                        <Field label="Cover image URL">
              <div className="flex gap-3 items-start">
                <input
                  value={form.coverImageUrl}
                  onChange={handleTextChange('coverImageUrl')}
                  className={inputClass}
                  placeholder="https://example.com/cover.jpg"
                />
                {form.coverImageUrl && (
                  <img
                    src={form.coverImageUrl}
                    alt="Cover preview"
                    className="w-14 h-20 object-cover rounded-md border border-ink-700 flex-shrink-0"
                    onError={(e) => (e.target.style.visibility = 'hidden')}
                  />
                )}
              </div>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Category" required>
                <select
                  required
                  value={form.category}
                  onChange={handleTextChange('category')}
                  className={inputClass}
                >
                  <option value="" disabled>
                    Choose…
                  </option>
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
              </Field>
              <Field label="Status">
                <select value={form.status} onChange={handleTextChange('status')} className={inputClass}>
                  {STATUS_OPTIONS.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </Section>

          <Section title="Credits">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Author">
                <input value={form.author} onChange={handleTextChange('author')} className={inputClass} />
              </Field>
              <Field label="Artist">
                <input value={form.artist} onChange={handleTextChange('artist')} className={inputClass} />
              </Field>
              <Field label="Director">
                <input value={form.director} onChange={handleTextChange('director')} className={inputClass} />
              </Field>
              <Field label="Studio">
                <input value={form.studio} onChange={handleTextChange('studio')} className={inputClass} />
              </Field>
              <Field label="Publisher">
                <input value={form.publisher} onChange={handleTextChange('publisher')} className={inputClass} />
              </Field>
              <Field label="Platform">
                <input
                  value={form.platform}
                  onChange={handleTextChange('platform')}
                  className={inputClass}
                  placeholder="Netflix, Kindle, Crunchyroll…"
                />
              </Field>
            </div>
          </Section>

          <Section title="Details">
            <ChipInput label="Genres" values={form.genres} onChange={(v) => setField('genres', v)} placeholder="Type a genre, press Enter" />
            <ChipInput label="Tags" values={form.tags} onChange={(v) => setField('tags', v)} placeholder="Type a tag, press Enter" />
            <div className="grid grid-cols-3 gap-4">
              <Field label="Language">
                <input value={form.language} onChange={handleTextChange('language')} className={inputClass} />
              </Field>
              <Field label="Country">
                <input value={form.country} onChange={handleTextChange('country')} className={inputClass} />
              </Field>
              <Field label="Release year">
                <input type="number" value={form.releaseYear} onChange={handleTextChange('releaseYear')} className={inputClass} />
              </Field>
            </div>
          </Section>

          <Section title="Progress & rating">
            <div className="grid grid-cols-3 gap-4">
              <Field label="Current progress">
                <input type="number" min="0" value={form.currentProgress} onChange={handleTextChange('currentProgress')} className={inputClass} />
              </Field>
              <Field label="Total">
                <input type="number" min="0" value={form.totalProgress} onChange={handleTextChange('totalProgress')} className={inputClass} />
              </Field>
              <Field label="Season">
                <input type="number" min="0" value={form.currentSeason} onChange={handleTextChange('currentSeason')} className={inputClass} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Public rating (0–10)">
                <input type="number" min="0" max="10" step="0.1" value={form.rating} onChange={handleTextChange('rating')} className={inputClass} />
              </Field>
              <Field label="Your rating (0–10)">
                <input type="number" min="0" max="10" step="0.1" value={form.personalRating} onChange={handleTextChange('personalRating')} className={inputClass} />
              </Field>
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm text-moss-100">
                <input
                  type="checkbox"
                  checked={form.favorite}
                  onChange={(e) => setField('favorite', e.target.checked)}
                  className="rounded border-ink-700 bg-ink-800 text-moss-500 focus:ring-moss-500"
                />
                Mark as favorite
              </label>
              <label className="flex items-center gap-2 text-sm text-moss-100">
                <input
                  type="checkbox"
                  checked={form.wishlist}
                  onChange={(e) => setField('wishlist', e.target.checked)}
                  className="rounded border-ink-700 bg-ink-800 text-moss-500 focus:ring-moss-500"
                />
                Add to wishlist
              </label>
            </div>
          </Section>

          <Section title="Thoughts">
            <Field label="Review">
              <textarea rows={3} value={form.review} onChange={handleTextChange('review')} className={inputClass} />
            </Field>
            <Field label="Notes">
              <textarea rows={3} value={form.notes} onChange={handleTextChange('notes')} className={inputClass} />
            </Field>
          </Section>

          <div className="flex items-center justify-between pt-2">
            <div>
              {isEdit && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={saving}
                  className="text-sm text-ember-400 hover:text-ember-500 disabled:opacity-50"
                >
                  Delete item
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <Link to="/dashboard" className="px-4 py-2 text-sm text-moss-400 hover:text-moss-50">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-moss-500 hover:bg-moss-600 transition-colors px-5 py-2 text-sm font-semibold text-ink-950 disabled:opacity-60"
              >
                {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Add item'}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}

const inputClass =
  'w-full rounded-lg bg-ink-800 border border-ink-700 px-3 py-2 text-sm text-moss-50 outline-none focus:border-moss-500 focus:ring-1 focus:ring-moss-500'

function Section({ title, children }) {
  return (
    <div className="rounded-2xl border border-ink-700 bg-ink-900 p-5 space-y-4">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-moss-400">{title}</h2>
      {children}
    </div>
  )
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-moss-400 mb-1">
        {label} {required && <span className="text-ember-400">*</span>}
      </label>
      {children}
    </div>
  )
}
