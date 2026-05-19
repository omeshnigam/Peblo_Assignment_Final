const AI_USAGE_KEY = 'omninotes-ai-usage'

function getTodayKey() {
  return new Date().toISOString().slice(0, 10)
}

export function getAiUsageStats() {
  try {
    const stats = JSON.parse(localStorage.getItem(AI_USAGE_KEY) || '{}')

    return {
      total: Number(stats.total || 0),
      today: Number(stats.byDay?.[getTodayKey()] || 0),
      byDay: stats.byDay || {},
      lastUsedAt: stats.lastUsedAt || null,
    }
  } catch {
    return {
      total: 0,
      today: 0,
      byDay: {},
      lastUsedAt: null,
    }
  }
}

export function recordAiUsage() {
  const stats = getAiUsageStats()
  const today = getTodayKey()
  const nextStats = {
    total: stats.total + 1,
    byDay: {
      ...stats.byDay,
      [today]: Number(stats.byDay[today] || 0) + 1,
    },
    lastUsedAt: new Date().toISOString(),
  }

  localStorage.setItem(AI_USAGE_KEY, JSON.stringify(nextStats))
  window.dispatchEvent(new CustomEvent('ai-usage-updated', { detail: nextStats }))

  return nextStats
}
