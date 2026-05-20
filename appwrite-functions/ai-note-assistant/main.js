/* global process */

function readPayload(req) {
  if (req.bodyJson && typeof req.bodyJson === 'object') {
    return req.bodyJson
  }

  const rawBody = req.bodyText || req.body || '{}'

  if (typeof rawBody === 'object') {
    return rawBody
  }

  try {
    return JSON.parse(rawBody)
  } catch {
    return {}
  }
}

function getModelText(data) {
  return data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text || ''
}

function buildMessages(payload) {
  const mode = payload.mode || payload.type || payload.action

  if (mode === 'insights') {
    return [
      {
        role: 'system',
        content: 'You analyze notes. Return only valid JSON with summary, actionItems, and suggestedTitles.',
      },
      {
        role: 'user',
        content: `Title: ${payload.title || 'Untitled'}\n\nNote:\n${payload.content || ''}\n\nReturn this exact JSON shape: {"summary":"...","actionItems":["..."],"suggestedTitles":["..."]}`,
      },
    ]
  }

  return [
    {
      role: 'system',
      content: 'You write polished note content for a rich text editor. Return only clean HTML body content. Do not wrap the answer in markdown fences.',
    },
    {
      role: 'user',
      content: payload.prompt || payload.content || '',
    },
  ]
}

export default async ({ req, res, error }) => {
  const apiKey = process.env.OPENROUTER_API_KEY
  const model = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini'
  const payload = readPayload(req)

  if (!apiKey) {
    return res.json({ error: 'Missing OPENROUTER_API_KEY in Appwrite Function variables.' })
  }

  const userPrompt = payload.prompt || payload.content || ''

  if (!userPrompt.trim()) {
    return res.json({ error: 'Missing prompt/content for AI generation.' })
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.APP_URL || 'http://localhost:5173',
        'X-Title': 'OmniNotes',
      },
      body: JSON.stringify({
        model,
        messages: buildMessages(payload),
        temperature: payload.mode === 'insights' ? 0.2 : 0.7,
      }),
    })

    const responseText = await response.text()
    let data

    try {
      data = JSON.parse(responseText)
    } catch {
      data = { error: { message: responseText || 'OpenRouter returned a non-JSON response.' } }
    }

    if (!response.ok) {
      return res.json({ error: data?.error?.message || data?.message || 'OpenRouter request failed.' })
    }

    const content = getModelText(data).trim()

    if (!content) {
      return res.json({ error: 'OpenRouter returned an empty model response.' })
    }

    return res.json({ content })
  } catch (err) {
    error?.(err?.message || String(err))
    return res.json({ error: `AI Function failed while calling OpenRouter: ${err?.message || String(err)}` })
  }
}
