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

function extractAiContent(data) {
  if (typeof data === 'string') {
    const trimmed = data.trim()

    if (!trimmed) return ''

    try {
      return extractAiContent(JSON.parse(trimmed))
    } catch {
      return trimmed
    }
  }

  if (!data || typeof data !== 'object') return ''

  const directText =
    data.content ||
    data.output ||
    data.text ||
    data.response ||
    data.result ||
    data.message ||
    data.completion ||
    data.generatedText ||
    data.generated_text

  if (typeof directText === 'string' && directText.trim()) {
    return directText
  }

  const choice = Array.isArray(data.choices) ? data.choices[0] : null
  const choiceText = choice?.message?.content || choice?.delta?.content || choice?.text

  if (typeof choiceText === 'string' && choiceText.trim()) {
    return choiceText
  }

  const nestedText =
    extractAiContent(data.data) ||
    extractAiContent(data.body) ||
    extractAiContent(data.payload) ||
    extractAiContent(data.result?.content) ||
    extractAiContent(data.response?.content)

  if (nestedText) return nestedText

  if (data.summary || data.actionItems || data.suggestedTitles) {
    return JSON.stringify(data)
  }

  return ''
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

  const content = extractAiContent(data)

  if (!content.trim()) {
    throw new Error('AI Function completed but returned empty content. Return the model text in a "content" field, or return an OpenAI/OpenRouter choices response.')
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
    prompt: cleanPrompt,
  })
}
