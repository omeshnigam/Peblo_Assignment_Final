import conf from '../components/conf/conf'
import { Client, Functions } from 'appwrite'

const client = new Client()
  .setEndpoint(conf.appwriteUrl)
  .setProject(conf.appwriteProjectId)

const functions = new Functions(client)

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

function extractAiContent(data, seen = new Set()) {
  if (typeof data === 'string') {
    const trimmed = data.trim()

    if (!trimmed) return ''

    try {
      return extractAiContent(JSON.parse(trimmed), seen)
    } catch {
      return trimmed
    }
  }

  if (!data || typeof data !== 'object') return ''
  if (seen.has(data)) return ''
  seen.add(data)

  if (Array.isArray(data)) {
    return data.map((item) => extractAiContent(item, seen)).filter(Boolean).join('\n\n')
  }

  if (data.summary || data.actionItems || data.suggestedTitles) {
    return JSON.stringify(data)
  }

  const directText = [
    data.content,
    data.output_text,
    data.text,
    data.response,
    data.result,
    data.message,
    data.completion,
    data.generatedText,
    data.generated_text,
    data.answer,
  ].find((value) => typeof value === 'string' && value.trim())

  if (directText) {
    return directText
  }

  const choice = Array.isArray(data.choices) ? data.choices[0] : null
  const choiceText = extractAiContent(choice?.message?.content, seen) || extractAiContent(choice?.delta?.content, seen) || extractAiContent(choice?.text, seen)

  if (choiceText) return choiceText

  const candidates = [
    data.output,
    data.content,
    data.data,
    data.body,
    data.payload,
    data.response,
    data.result,
    data.message,
    data.candidates,
    data.parts,
  ]

  for (const candidate of candidates) {
    const nestedText = extractAiContent(candidate, seen)
    if (nestedText) return nestedText
  }

  return ''
}

function getResponsePreview(data) {
  try {
    return JSON.stringify(data).slice(0, 500)
  } catch {
    return String(data).slice(0, 500)
  }
}

function isAppwriteStarterResponse(data) {
  return Boolean(
    data &&
    typeof data === 'object' &&
    data.motto &&
    data.learn &&
    data.connect &&
    data.getInspired
  )
}

async function callAiFunction(payload) {
  if (!conf.appwriteAiFunctionId) {
    throw new Error('Missing Appwrite AI Function ID. Add VITE_APPWRITE_AI_FUNCTION_ID to your .env file and restart the dev server.')
  }

  let execution

  try {
    execution = await functions.createExecution({
      functionId: conf.appwriteAiFunctionId,
      body: JSON.stringify(payload),
      async: false,
    })
  } catch (error) {
    if (error?.code === 401 || error?.message?.toLowerCase().includes('execute')) {
      throw new Error('AI Function execute permission is missing in Appwrite. Open Appwrite Console > Functions > your AI function > Settings/Permissions and allow Users to Execute, then redeploy/retry.', { cause: error })
    }

    throw error
  }

  if (execution.status !== 'completed') {
    throw new Error(`AI Function did not complete. Status: ${execution.status}. ${execution.errors || execution.responseBody || ''}`.trim())
  }

  if (!execution.responseBody) {
    throw new Error('AI Function returned an empty response. Check the Appwrite Function code and make sure it returns res.json({ content: "..." }).')
  }

  let data

  try {
    data = JSON.parse(execution.responseBody)
  } catch (error) {
    throw new Error(`AI Function returned non-JSON response: ${execution.responseBody.slice(0, 200)}`, { cause: error })
  }

  if (data.error) {
    throw new Error(data.error)
  }

  if (isAppwriteStarterResponse(data)) {
    throw new Error('Your Appwrite AI Function is still running the default starter code. Deploy the AI note assistant function code from appwrite-functions/ai-note-assistant, then retry.')
  }

  const content = extractAiContent(data)

  if (!content.trim()) {
    throw new Error(`AI Function completed but returned empty content. Raw response preview: ${getResponsePreview(data)}`)
  }

  return content
}

export async function generateNoteInsights({ title = '', content = '' }) {
  const plainText = stripHtml(content).trim()

  if (!plainText) {
    throw new Error('Add some note content before using AI.')
  }

  const contentText = await callAiFunction({
    mode: 'insights',
    title,
    content: plainText,
  })

  return parseAiJson(contentText)
}

export async function generateNoteDraft(prompt) {
  const cleanPrompt = prompt.trim()

  if (!cleanPrompt) {
    throw new Error('Write a prompt first, for example: give 500 words note on Elon Musk.')
  }

  return callAiFunction({
    mode: 'draft',
    type: 'draft',
    action: 'draft',
    prompt: cleanPrompt,
    content: cleanPrompt,
  })
}
