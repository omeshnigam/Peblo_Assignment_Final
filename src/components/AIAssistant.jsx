import React, { useState } from 'react'
import { generateNoteDraft, generateNoteInsights } from '../services/openai'
import { recordAiUsage } from '../utils/aiUsage'

function AIAssistant({ title, content, getContent, onUseTitle, onInsertContent }) {
  const [result, setResult] = useState(null)
  const [draftPrompt, setDraftPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [draftLoading, setDraftLoading] = useState(false)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')

  const runAi = async () => {
    setLoading(true)
    setError('')
    setStatus('')

    try {
      const latestContent = getContent ? getContent() : content
      const insights = await generateNoteInsights({ title, content: latestContent })
      setResult({
        summary: insights.summary || '',
        actionItems: Array.isArray(insights.actionItems) ? insights.actionItems : [],
        suggestedTitles: Array.isArray(insights.suggestedTitles) ? insights.suggestedTitles : [],
      })
      recordAiUsage()
      setStatus('AI insights generated.')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const runDraft = async () => {
    setDraftLoading(true)
    setError('')
    setStatus('')

    try {
      const draft = await generateNoteDraft(draftPrompt)
      onInsertContent?.(draft)
      recordAiUsage()
      setStatus('Generated note inserted into the editor.')
    } catch (error) {
      setError(error.message)
    } finally {
      setDraftLoading(false)
    }
  }

  return (
    <section className="mb-4 rounded-xl border border-blue-200 bg-blue-50/80 p-4 shadow-sm dark:border-blue-900/60 dark:bg-blue-950/30">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-950 dark:text-slate-100">AI writing assistant</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Generate a summary, action items, and title ideas from your note.
          </p>
        </div>
        <button
          type="button"
          onClick={runAi}
          disabled={loading}
          className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Thinking...' : 'Generate AI'}
        </button>
      </div>

      <div className="mt-4 rounded-xl border border-blue-100 bg-white/70 p-3 dark:border-blue-900/60 dark:bg-slate-900/70">
        <label className="mb-2 block text-sm font-bold text-slate-800 dark:text-slate-200" htmlFor="ai-draft-prompt">
          Generate full note content
        </label>
        <textarea
          id="ai-draft-prompt"
          value={draftPrompt}
          onChange={(event) => setDraftPrompt(event.target.value)}
          placeholder="Example: give 500 words note on Elon Musk"
          rows="3"
          className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition duration-200 placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
        />
        <button
          type="button"
          onClick={runDraft}
          disabled={draftLoading}
          className="mt-3 rounded-full bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition duration-200 hover:-translate-y-0.5 hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {draftLoading ? 'Writing note...' : 'Generate note into editor'}
        </button>
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      )}

      {status && (
        <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
          {status}
        </p>
      )}

      {result && (
        <div className="mt-5 space-y-4">
          <div className="rounded-lg bg-white p-4 dark:bg-slate-900">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-black uppercase tracking-wide text-blue-700 dark:text-blue-300">Summary</h3>
              <button
                type="button"
                onClick={() => onInsertContent?.(`<h2>AI Summary</h2><p>${result.summary}</p>`)}
                className="rounded-full border border-blue-200 px-3 py-1 text-xs font-semibold text-blue-700 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-950"
              >
                Insert summary
              </button>
            </div>
            <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{result.summary}</p>
          </div>

          <div className="rounded-lg bg-white p-4 dark:bg-slate-900">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-black uppercase tracking-wide text-blue-700 dark:text-blue-300">Action items</h3>
              {result.actionItems.length > 0 && (
                <button
                  type="button"
                  onClick={() => onInsertContent?.(`<h2>Action Items</h2><ul>${result.actionItems.map((item) => `<li>${item}</li>`).join('')}</ul>`)}
                  className="rounded-full border border-blue-200 px-3 py-1 text-xs font-semibold text-blue-700 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-950"
                >
                  Insert actions
                </button>
              )}
            </div>
            {result.actionItems.length > 0 ? (
              <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                {result.actionItems.map((item, index) => (
                  <li key={`${item}-${index}`} className="flex gap-2">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">No clear action items found.</p>
            )}
          </div>

          <div className="rounded-lg bg-white p-4 dark:bg-slate-900">
            <h3 className="mb-3 text-sm font-black uppercase tracking-wide text-blue-700 dark:text-blue-300">Suggested titles</h3>
            <div className="flex flex-wrap gap-2">
              {result.suggestedTitles.map((suggestedTitle) => (
                <button
                  type="button"
                  key={suggestedTitle}
                  onClick={() => onUseTitle(suggestedTitle)}
                  className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:text-blue-300"
                >
                  {suggestedTitle}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default AIAssistant
