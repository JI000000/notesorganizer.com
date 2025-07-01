'use client'

import { useState } from 'react'
import { Sparkles, Clipboard, Check } from 'lucide-react'

type TitleSuggestion = {
  style: string;
  title: string;
}

const TitleGeneratorPage = () => {
  const [content, setContent] = useState('')
  const [titles, setTitles] = useState<TitleSuggestion[]>([])
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  const [copiedTitle, setCopiedTitle] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setState('loading')
    setError('')
    setTitles([])
    setCopiedTitle(null)

    try {
      const response = await fetch('/api/generate-title', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message)
      setTitles(data.titles)
      setState('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.')
      setState('error')
    }
  }

  const handleCopy = (title: string) => {
    navigator.clipboard.writeText(title)
    setCopiedTitle(title)
    setTimeout(() => setCopiedTitle(null), 2000)
  }

  return (
    <div className="py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Sparkles className="mx-auto h-12 w-12 text-blue-500" />
          <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            AI Note Title Generator
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            Stuck on a title? Paste your note content below and let our AI generate compelling titles for you.
          </p>
        </div>

        <div className="max-w-3xl mx-auto mt-10">
          <form onSubmit={handleSubmit}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your note here. Minimum 50 characters..."
              rows={8}
              className="w-full p-4 rounded-md bg-brand-dark-light border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              required
              minLength={50}
            />
            <button
              type="submit"
              disabled={state === 'loading'}
              className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {state === 'loading' ? 'Generating...' : 'Generate Titles'}
            </button>
          </form>

          {state === 'error' && (
            <p className="mt-4 text-center text-red-400">{error}</p>
          )}

          {state === 'success' && titles.length > 0 && (
            <div className="mt-10">
              <h2 className="text-2xl font-bold text-center text-white">Here are your suggestions:</h2>
              <div className="mt-6 space-y-4">
                {titles.map((item, index) => (
                  <div key={index} className="bg-brand-dark-light p-4 rounded-lg flex justify-between items-center">
                    <div>
                      <span className="text-sm font-semibold text-blue-400">{item.style}</span>
                      <p className="text-white mt-1">{item.title}</p>
                    </div>
                    <button onClick={() => handleCopy(item.title)} className="p-2 rounded-md hover:bg-gray-700 transition-colors text-gray-400 hover:text-white">
                      {copiedTitle === item.title ? <Check size={20} className="text-green-500" /> : <Clipboard size={20} />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TitleGeneratorPage; 