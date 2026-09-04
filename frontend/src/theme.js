// src/theme.js
// Single source of truth for status → style mapping.
// Keep this next to STATUS_LABELS in constants.js conceptually —
// one maps status to display text, this maps it to Tailwind classes.

export function getStatusBadgeClasses(itemStatus) {
  switch (itemStatus) {
    case 'IN_PROGRESS':
      return 'bg-ember-400/20 text-ember-500 border-ember-400'
    case 'COMPLETED':
      return 'bg-moss-100 text-moss-600 border-moss-400'
    case 'PLANNED':
      return 'bg-ink-800 text-moss-100 border-ink-700'
    default:
      return 'bg-ink-950 text-moss-400 border-ink-700'
  }
}
