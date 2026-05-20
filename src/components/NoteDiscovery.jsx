import { useMemo, useState } from 'react'
import PostCard from './PostCard'
import { filterAndSortPosts, getAllTags } from '../utils/posts'

function NoteDiscovery({ posts = [], emptyTitle = 'No notes found', emptyDescription = 'Try a different search or tag filter.' }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState('')

  const tags = useMemo(() => getAllTags(posts), [posts])
  const visiblePosts = useMemo(() => filterAndSortPosts(posts, searchTerm, selectedTag), [posts, searchTerm, selectedTag])

  return (
    <div className="space-y-6">
      <div className="animate-fade-up rounded-2xl border border-white/70 bg-white/80 p-4 shadow-lg shadow-slate-200/60 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-slate-950/30">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_260px_auto]">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="note-search">
              Keyword search
            </label>
            <input
              id="note-search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search title, content, or tags"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition duration-200 placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="tag-filter">
              Filter by tag
            </label>
            <select
              id="tag-filter"
              value={selectedTag}
              onChange={(event) => setSelectedTag(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition duration-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
            >
              <option value="">All tags</option>
              {tags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={() => {
                setSearchTerm('')
                setSelectedTag('')
              }}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:text-blue-300"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <span>{visiblePosts.length} of {posts.length} notes</span>
          <span>Sorted by recently updated</span>
          {selectedTag && <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-700 dark:bg-blue-950 dark:text-blue-300">#{selectedTag}</span>}
        </div>
      </div>

      {visiblePosts.length === 0 ? (
        <div className="animate-fade-up rounded-2xl border border-dashed border-slate-300 bg-white/75 p-10 text-center shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">{emptyTitle}</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">{emptyDescription}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visiblePosts.map((post) => (
            <div key={post.$id} className="animate-fade-up">
              <PostCard {...post} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default NoteDiscovery
