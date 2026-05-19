import conf from '../components/conf/conf'

const OPENROUTER_CHAT_URL = 'https://openrouter.ai/api/v1/chat/completions'

function extractOutputText(response) {
  return response.choices?.[0]?.message?.content || ''
}

function parseAiJson(text) {
  try {
    return JSON.parse(text)
  } catch {
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('AI response was not valid JSON.')

    return JSON.parse(match[0])
  }
}

function stripHtml(html) {
  const element = document.createElement('div')
  element.innerHTML = html || ''
  return element.textContent || element.innerText || ''
}

function estimateRequestedWords(prompt) {
  const match = prompt.match(/(\d{2,4})\s*words?/i)
  return match ? Number(match[1]) : 500
}

export async function generateNoteInsights({ title = '', content = '' }) {
  if (!conf.openrouterApiKey) {
    throw new Error('Missing OpenRouter API key. Add VITE_OPENROUTER_API_KEY to your .env file and restart the dev server.')
  }

  const plainText = stripHtml(content).trim()

  if (!plainText) {
    throw new Error('Add some note content before using AI.')
  }

  const response = await fetch(OPENROUTER_CHAT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${conf.openrouterApiKey}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'OmniNotes',
    },
    body: JSON.stringify({
      model: conf.openrouterModel,
      messages: [
        {
          role: 'system',
          content: [
            'You help users organize notes.',
            'Return only valid JSON with these keys: summary, actionItems, suggestedTitles.',
            'summary must be a concise paragraph.',
            'actionItems must be an array of short actionable strings.',
            'suggestedTitles must be an array of 3 concise title strings.',
          ].join(' '),
        },
        {
          role: 'user',
          content: `Return JSON only.\n\nCurrent title: ${title || 'Untitled'}\n\nNote content:\n${plainText}`,
        },
      ],
      response_format: {
        type: 'json_object',
      },
      max_tokens: 700,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error?.message || 'OpenRouter request failed.')
  }

  return parseAiJson(extractOutputText(data))
}

export async function generateNoteDraft(prompt) {
  if (!conf.openrouterApiKey) {
    throw new Error('Missing OpenRouter API key. Add VITE_OPENROUTER_API_KEY to your .env file and restart the dev server.')
  }

  const cleanPrompt = prompt.trim()

  if (!cleanPrompt) {
    throw new Error('Write a prompt first, for example: give 500 words note on Elon Musk.')
  }

  const requestedWords = estimateRequestedWords(cleanPrompt)
  const maxTokens = Math.min(Math.max(Math.ceil(requestedWords * 1.8), 900), 3000)

  const response = await fetch(OPENROUTER_CHAT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${conf.openrouterApiKey}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'OmniNotes',
    },
    body: JSON.stringify({
      model: conf.openrouterModel,
      messages: [
        {
          role: 'system',
          content: [
            'You are a note-writing assistant.',
            'Generate the requested note content directly.',
            'Return clean HTML only using h2, h3, p, ul, ol, and li tags.',
            'Do not wrap the response in markdown fences.',
            'Respect requested word counts as closely as possible.',
          ].join(' '),
        },
        {
          role: 'user',
          content: cleanPrompt,
        },
      ],
      max_tokens: maxTokens,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error?.message || 'OpenRouter request failed.')
  }

  return extractOutputText(data)
}
