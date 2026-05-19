import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import appwriteService from '../../appwrite/config'
import Container from '../container/Container'
import { getAiUsageStats } from '../../utils/aiUsage'
import { getMostUsedTags, getRecentlyEditedPosts, getWeeklyActivity } from '../../utils/posts'

function StatCard({ label, value, detail }) {
  return (
    <div className="animate-fade-up rounded-2xl border border-white/70 bg-white/80 p-5 shadow-lg shadow-slate-200/60 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-slate-950/30">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-3 text-4xl font-black text-slate-950 dark:text-slate-100">{value}</p>
      {detail && <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{detail}</p>}
    </div>
  )
}

function Dashboard() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [aiStats, setAiStats] = useState(() => getAiUsageStats())

  useEffect(() => {
    appwriteService.getPosts().then((response) => {
      if (response) setPosts(response.documents)
    }).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const refreshAiStats = () => setAiStats(getAiUsageStats())
    window.addEventListener('ai-usage-updated', refreshAiStats)
    window.addEventListener('storage', refreshAiStats)

    return () => {
      window.removeEventListener('ai-usage-updated', refreshAiStats)
      window.removeEventListener('storage', refreshAiStats)
    }
  }, [])

  const mostUsedTags = useMemo(() => getMostUsedTags(posts), [posts])
  const recentPosts = useMemo(() => getRecentlyEditedPosts(posts), [posts])
  const weeklyActivity = useMemo(() => getWeeklyActivity(posts), [posts])
  const maxActivity = Math.max(...weeklyActivity.map((day) => day.created + day.edited), 1)
  const publicNotes = posts.filter((post) => post.isPublic).length

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 dark:border-slate-800 dark:border-t-blue-400" />
      </div>
    )
  }

  return (
    <div className="py-10">
      <Container>
        <div className="animate-fade-up mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">Productivity</p>
            <h1 className="mt-1 text-3xl font-black text-slate-950 dark:text-slate-100">Insights dashboard</h1>
          </div>
          <Link to="/add-post" className="rounded-full bg-blue-600 px-5 py-2.5 font-semibold text-white shadow-lg shadow-blue-500/20 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-700">
            New post
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total notes" value={posts.length} detail={`${publicNotes} public notes`} />
          <StatCard label="Recently edited" value={recentPosts.length} detail="Sorted by latest updates" />
          <StatCard label="AI generations" value={aiStats.total} detail={`${aiStats.today} used today`} />
          <StatCard label="Tags tracked" value={mostUsedTags.length} detail="Top tags from your notes" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="animate-fade-up rounded-2xl border border-white/70 bg-white/80 p-5 shadow-lg shadow-slate-200/60 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-slate-950/30">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">Weekly activity</p>
                <h2 className="text-2xl font-black text-slate-950 dark:text-slate-100">Last 7 days</h2>
              </div>
            </div>
            <div className="flex h-56 items-end gap-3">
              {weeklyActivity.map((day) => {
                const total = day.created + day.edited
                const height = Math.max((total / maxActivity) * 100, total ? 12 : 4)

                return (
                  <div key={day.key} className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex h-40 w-full items-end rounded-xl bg-slate-100 p-1 dark:bg-slate-950">
                      <div
                        className="w-full rounded-lg bg-gradient-to-t from-blue-600 to-cyan-400 transition-all duration-500"
                        style={{ height: `${height}%` }}
                        title={`${total} activities`}
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{day.label}</span>
                    <span className="text-xs text-slate-400">{total}</span>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="animate-fade-up rounded-2xl border border-white/70 bg-white/80 p-5 shadow-lg shadow-slate-200/60 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-slate-950/30">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">Most-used tags</p>
            <h2 className="text-2xl font-black text-slate-950 dark:text-slate-100">Tag focus</h2>
            <div className="mt-5 space-y-3">
              {mostUsedTags.length > 0 ? mostUsedTags.map(({ tag, count }) => (
                <div key={tag}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">#{tag}</span>
                    <span className="text-slate-500 dark:text-slate-400">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{ width: `${Math.max((count / mostUsedTags[0].count) * 100, 8)}%` }}
                    />
                  </div>
                </div>
              )) : (
                <p className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  Add tags to notes to see your most-used topics here.
                </p>
              )}
            </div>
          </section>
        </div>

        <section className="animate-fade-up mt-6 rounded-2xl border border-white/70 bg-white/80 p-5 shadow-lg shadow-slate-200/60 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-slate-950/30">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">Recently edited notes</p>
          <div className="mt-4 divide-y divide-slate-200 dark:divide-slate-800">
            {recentPosts.length > 0 ? recentPosts.map((post) => (
              <Link key={post.$id} to={`/post/${post.$id}`} className="flex flex-wrap items-center justify-between gap-3 py-4 transition duration-200 hover:translate-x-1">
                <div>
                  <h3 className="font-bold text-slate-950 dark:text-slate-100">{post.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Updated {new Date(post.$updatedAt || post.$createdAt).toLocaleString()}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${post.isPublic ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>
                  {post.isPublic ? 'Public' : 'Private'}
                </span>
              </Link>
            )) : (
              <p className="py-6 text-sm text-slate-500 dark:text-slate-400">No notes yet.</p>
            )}
          </div>
        </section>
      </Container>
    </div>
  )
}

export default Dashboard
