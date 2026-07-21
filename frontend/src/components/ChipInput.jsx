import React, { useState } from 'react'

export default function ChipInput({ label, values, onChange, placeholder }) {
  const [draft, setDraft] = useState('')

  function commitDraft() {
    const value = draft.trim()
    if (value && !values.includes(value)) {
      onChange([...values, value])
    }
    setDraft('')
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      commitDraft()
    } else if (e.key === 'Backspace' && draft === '' && values.length > 0) {
      onChange(values.slice(0, -1))
    }
  }

  function removeAt(index) {
    onChange(values.filter((_, i) => i !== index))
  }

  return (
    <div>
      <label className="block text-xs font-medium text-stone-400 mb-1">{label}</label>
      <div className="flex flex-wrap items-center gap-1.5 rounded-lg bg-ink-800 border border-ink-700 px-2 py-1.5 focus-within:border-moss-500 focus-within:ring-1 focus-within:ring-moss-500">
        {values.map((v, i) => (
          <span
            key={`${v}-${i}`}
            className="inline-flex items-center gap-1 rounded-full bg-moss-500/15 text-moss-400 text-xs px-2 py-0.5"
          >
            {v}
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="hover:text-ember-400 leading-none"
              aria-label={`Remove ${v}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commitDraft}
          placeholder={values.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[80px] bg-transparent text-sm text-stone-100 outline-none py-0.5"
        />
      </div>
    </div>
  )
}
