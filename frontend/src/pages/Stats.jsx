import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import api from '../services/api.js'
import { CATEGORY_LABELS, STATUS_LABELS } from '../constants.js'

export default function Stats() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const { data } = await api.get('/stats')
        if (!cancelled) setStats(data)
      } catch (err) {
        if (!cancelled) setError('Could not load your stats.')
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
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
          <Link to="/dashboard" className="text-stone-400 hover:text-stone-100 text-sm">
            ← Back
          </Link>
          <h1 className="font-display text-lg text-stone-50">Stats</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {loading && <p className="text-sm text-stone-400">Crunching your numbers…</p>}
        {!loading && error && <p className="text-sm text-ember-400">{error}</p>}

        {!loading && !error && stats && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard label="Total items" value={stats.totalItems} />
              <StatCard label="Completed" value={stats.statusCounts?.COMPLETED || 0} accent />
              <StatCard label="Current streak" value={`${stats.currentStreak}🔥`} accent />
              <StatCard label="Longest streak" value={stats.longestStreak} />
            </div>

            <Section title="Activity, last 12 weeks">
              <ActivityHeatmap data={stats.dailyActivity} />
            </Section>

            <Section title="Completed by month">
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.monthlyCompletions} margin={{ left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2A3140" />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: '#a8a29e', fontSize: 11 }}
                      tickFormatter={(m) => m.slice(5)}
                      axisLine={{ stroke: '#2A3140' }}
                    />
                    <YAxis tick={{ fill: '#a8a29e', fontSize: 11 }} allowDecimals={false} axisLine={{ stroke: '#2A3140' }} />
                    <Tooltip
                      contentStyle={{ background: '#1F2430', border: '1px solid #2A3140', borderRadius: 8 }}
                      labelStyle={{ color: '#f5f5f4' }}
                    />
                    <Bar dataKey="count" fill="#5C8A52" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Section>

            <Section title="By category">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={categoryChartData(stats.categoryCounts)}
                    margin={{ left: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#2A3140" horizontal={false} />
                    <XAxis type="number" tick={{ fill: '#a8a29e', fontSize: 11 }} allowDecimals={false} axisLine={{ stroke: '#2A3140' }} />
                    <YAxis
                      type="category"
                      dataKey="label"
                      tick={{ fill: '#a8a29e', fontSize: 11 }}
                      width={100}
                      axisLine={{ stroke: '#2A3140' }}
                    />
                    <Tooltip
                      contentStyle={{ background: '#1F2430', border: '1px solid #2A3140', borderRadius: 8 }}
                      labelStyle={{ color: '#f5f5f4' }}
                    />
                    <Bar dataKey="count" fill="#D98B3F" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Section>

            <Section title="Status breakdown">
              <div className="flex flex-wrap gap-2">
                {Object.entries(stats.statusCounts || {}).map(([status, count]) => (
                  <span
                    key={status}
                    className="text-xs px-3 py-1.5 rounded-full bg-ink-800 text-stone-300 border border-ink-700"
                  >
                    {STATUS_LABELS[status] || status}: <span className="text-stone-100 font-medium">{count}</span>
                  </span>
                ))}
              </div>
            </Section>

            {stats.topGenres?.length > 0 && (
              <Section title="Top genres">
                <div className="flex flex-wrap gap-2">
                  {stats.topGenres.map((g) => (
                    <span
                      key={g.genre}
                      className="text-xs px-3 py-1.5 rounded-full bg-moss-500/15 text-moss-400 border border-moss-500/30"
                    >
                      {g.genre} · {g.count}
                    </span>
                  ))}
                </div>
              </Section>
            )}
          </>
        )}
      </main>
    </div>
  )
}

function categoryChartData(categoryCounts) {
  return Object.entries(categoryCounts || {})
    .map(([category, count]) => ({ label: CATEGORY_LABELS[category] || category, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)
}

function StatCard({ label, value, accent }) {
  return (
    <div className="rounded-xl border border-ink-700 bg-ink-900 px-4 py-3">
      <p className={`text-2xl font-display font-semibold ${accent ? 'text-moss-400' : 'text-stone-100'}`}>{value}</p>
      <p className="text-xs text-stone-500 mt-0.5">{label}</p>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="rounded-2xl border border-ink-700 bg-ink-900 p-5">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-stone-500 mb-4">{title}</h2>
      {children}
    </div>
  )
}

function intensityClass(count) {
  if (count === 0) return 'bg-ink-800'
  if (count === 1) return 'bg-moss-500/30'
  if (count === 2) return 'bg-moss-500/60'
  return 'bg-moss-500'
}

function ActivityHeatmap({ data }) {
  if (!data || data.length === 0) return <p className="text-sm text-stone-500">No activity yet.</p>

  // Group the flat day list into week-columns of 7, left-to-right oldest to newest.
  const weeks = []
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7))
  }

  return (
    <div className="flex gap-1 overflow-x-auto pb-1">
      {weeks.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-1">
          {week.map((day) => (
            <div
              key={day.date}
              title={`${day.date}: ${day.count} update${day.count === 1 ? '' : 's'}`}
              className={`w-3 h-3 rounded-sm ${intensityClass(day.count)}`}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
