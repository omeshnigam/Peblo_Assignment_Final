export function parseTags(tags) {
  if (!tags) return []

  if (Array.isArray(tags)) {
    return tags.map((tag) => String(tag).trim()).filter(Boolean)
  }

  return String(tags)
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
}

export function formatTags(tags) {
  return parseTags(tags).join(', ')
}

export function filterAndSortPosts(posts, searchTerm, selectedTag) {
  const query = searchTerm.trim().toLowerCase()

  return [...posts]
    .filter((post) => {
      const tags = parseTags(post.tags)
      const searchable = `${post.title || ''} ${post.content || ''} ${tags.join(' ')}`.toLowerCase()
      const matchesSearch = query ? searchable.includes(query) : true
      const matchesTag = selectedTag ? tags.includes(selectedTag) : true

      return matchesSearch && matchesTag
    })
    .sort((a, b) => new Date(b.$updatedAt || b.$createdAt || 0) - new Date(a.$updatedAt || a.$createdAt || 0))
}

export function getAllTags(posts) {
  return Array.from(new Set(posts.flatMap((post) => parseTags(post.tags)))).sort((a, b) => a.localeCompare(b))
}

export function getMostUsedTags(posts, limit = 5) {
  const counts = posts.reduce((acc, post) => {
    parseTags(post.tags).forEach((tag) => {
      acc[tag] = (acc[tag] || 0) + 1
    })

    return acc
  }, {})

  return Object.entries(counts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
    .slice(0, limit)
}

export function getRecentlyEditedPosts(posts, limit = 5) {
  return [...posts]
    .sort((a, b) => new Date(b.$updatedAt || b.$createdAt || 0) - new Date(a.$updatedAt || a.$createdAt || 0))
    .slice(0, limit)
}

export function getWeeklyActivity(posts) {
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    date.setDate(date.getDate() - (6 - index))

    return {
      key: date.toISOString().slice(0, 10),
      label: date.toLocaleDateString(undefined, { weekday: 'short' }),
      created: 0,
      edited: 0,
    }
  })

  const byKey = Object.fromEntries(days.map((day) => [day.key, day]))

  posts.forEach((post) => {
    const createdKey = post.$createdAt ? new Date(post.$createdAt).toISOString().slice(0, 10) : null
    const updatedKey = post.$updatedAt ? new Date(post.$updatedAt).toISOString().slice(0, 10) : null

    if (createdKey && byKey[createdKey]) byKey[createdKey].created += 1
    if (updatedKey && byKey[updatedKey]) byKey[updatedKey].edited += 1
  })

  return days
}
