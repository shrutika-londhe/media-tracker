export const CATEGORY_GROUPS = [
  {
    label: 'Reading',
    options: [
      ['MANHWA', 'Manhwa'],
      ['MANGA', 'Manga'],
      ['MANHUA', 'Manhua'],
      ['BOOK_FICTION', 'Fiction book'],
      ['BOOK_NON_FICTION', 'Non-fiction book'],
      ['LIGHT_NOVEL', 'Light novel'],
      ['WEB_NOVEL', 'Web novel'],
      ['COMIC', 'Comic'],
    ],
  },
  {
    label: 'Watching',
    options: [
      ['K_DRAMA', 'K-Drama'],
      ['C_DRAMA', 'C-Drama'],
      ['J_DRAMA', 'J-Drama'],
      ['MOVIE', 'Movie'],
      ['ANIME', 'Anime'],
      ['TV_SERIES', 'TV series'],
      ['DOCUMENTARY', 'Documentary'],
    ],
  },
  {
    label: 'Listening',
    options: [
      ['PODCAST', 'Podcast'],
      ['AUDIOBOOK', 'Audiobook'],
      ['MUSIC_ALBUM', 'Music album'],
    ],
  },
  {
    label: 'Other',
    options: [['OTHER', 'Other']],
  },
]

export const STATUS_OPTIONS = [
  ['PLANNED', 'Planned'],
  ['IN_PROGRESS', 'In progress'],
  ['COMPLETED', 'Completed'],
  ['ON_HOLD', 'On hold'],
  ['DROPPED', 'Dropped'],
  ['RE_READING', 'Re-reading'],
  ['RE_WATCHING', 'Re-watching'],
]

export const STATUS_LABELS = Object.fromEntries(STATUS_OPTIONS)
export const CATEGORY_LABELS = Object.fromEntries(CATEGORY_GROUPS.flatMap((g) => g.options))
