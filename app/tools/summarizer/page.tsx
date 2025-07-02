'use client';

import { useState } from 'react';

export default function SummarizerPage() {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSummary('');

    if (text.trim().length < 100) {
      setError('Please enter at least 100 characters for a meaningful summary.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate summary.');
      }

      const data = await response.json();
      setSummary(data.summary);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <main className="container mx-auto px-4 py-12">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-100">
            AI Note Summarizer
          </h1>
          <p className="mt-4 text-lg text-gray-300">
            Paste any long-form text and get a concise, AI-powered summary in seconds. Perfect for quick reviews.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-12 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label htmlFor="text-input" className="block text-sm font-medium text-gray-300 mb-2">
                Your Text
              </label>
              <textarea
                id="text-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your long note here (at least 100 characters)..."
                className="w-full h-64 p-4 border border-white/10 bg-white/5 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-200 placeholder:text-gray-500"
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="summary-output" className="block text-sm font-medium text-gray-300 mb-2">
                AI Generated Summary
              </label>
              <div
                id="summary-output"
                className="w-full h-64 p-4 border border-white/10 bg-white/5 rounded-lg shadow-sm text-gray-200 overflow-y-auto"
              >
                {summary}
              </div>
            </div>
          </div>

          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

          <div className="mt-6 text-center">
            <button
              type="submit"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-500"
              disabled={isLoading}
            >
              {isLoading ? 'Summarizing...' : 'Summarize'}
            </button>
          </div>
        </form>
      </main>
    </>
  );
} 