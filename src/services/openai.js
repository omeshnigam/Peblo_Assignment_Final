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
      throw new Error('AI Function execute permission is missing in Appwrite. Open Appwrite Console > Functions > your AI function > Settings/Permissions and allow Users to Execute, then redeploy/retry.')
    }

    throw error
  }

  const data = JSON.parse(execution.responseBody || '{}')

  if (data.error) {
    throw new Error(data.error)
  }

  return data.content || ''
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
