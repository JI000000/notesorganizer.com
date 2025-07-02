'use client'

import { useState } from 'react'
import { Sparkles } from 'lucide-react'

export default function TitleGeneratorPage() {
  const [text, setText] = useState('')
  const [titles, setTitles] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setTitles([])
    
    if (text.trim().length < 50) {
      setError('Please enter at least 50 characters to generate titles.')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/generate-title', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate titles.')
      }

      const data = await response.json()
      setTitles(data.titles)

    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <main className="container mx-auto px-4 py-12">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-100">
            AI Title Generator
          </h1>
          <p className="mt-4 text-lg text-gray-300">
            Struggling with a title? Paste your note&rsquo;s content below and get a list of compelling, creative titles in seconds.
          </p>
        </div>

        <div className="mt-12 max-w-3xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your note, article, or any text here (at least 50 characters)..."
                className="w-full h-48 p-4 border border-white/10 bg-white/5 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-200 placeholder:text-gray-500"
                disabled={isLoading}
              />
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <div className="mt-4 text-center">
              <button
                type="submit"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-500"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  'Generate Titles'
                )}
              </button>
            </div>
          </form>

          {titles.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-center text-gray-100">Your AI-Generated Titles</h2>
              <ul className="mt-6 space-y-4">
                {titles.map((title, index) => (
                  <li key={index} className="p-4 bg-white/5 border border-white/10 rounded-lg shadow-sm flex items-center">
                    <Sparkles className="h-5 w-5 text-blue-500 mr-4 flex-shrink-0" />
                    <span className="text-gray-200">{title}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </>
  )
} 