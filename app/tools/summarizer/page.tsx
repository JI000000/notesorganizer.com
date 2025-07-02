'use client';

import { useState } from 'react';

export default function SummarizerPage() {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSummary('');
    setError('');

    const response = await fetch('/api/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    setIsLoading(false);

    if (!response.ok) {
      const result = await response.json();
      setError(result.error || 'An unexpected error occurred.');
      return;
    }

    const result = await response.json();
    setSummary(result.summary);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]"> 
      <header className="py-8 bg-gray-900/50">
        <div className="text-center max-w-3xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-100">
            AI Note Summarizer
          </h1>
          <p className="mt-4 text-lg text-gray-300">
            Paste any long-form text and get a concise, AI-powered summary in seconds. Perfect for quick reviews.
          </p>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 pb-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <form onSubmit={handleSubmit} className="w-full h-full flex flex-col">
          <textarea
            value={text}
            onChange={handleTextChange}
            className="w-full flex-grow p-4 bg-gray-800 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow resize-none"
            placeholder="Paste any long-form text here and click Summarize..."
          ></textarea>
          <button
            type="submit"
            disabled={isLoading || !text}
            className="mt-4 w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Summarizing...' : 'Summarize'}
          </button>
        </form>

        <div className="w-full h-full flex flex-col bg-gray-800/50 rounded-lg border border-gray-700">
          <div className="p-4 border-b border-gray-700">
              <h2 className="text-xl font-bold tracking-tight text-gray-100">
                AI Generated Summary
              </h2>
          </div>
          <div className="p-4 flex-grow overflow-y-auto">
            {error && <p className="text-red-400">{error}</p>}
            {isLoading && !summary && (
              <p className="text-gray-400 animate-pulse">Generating summary...</p>
            )}
            <p className="text-gray-300 whitespace-pre-wrap">{summary}</p>
          </div>
        </div>
      </main>
    </div>
  );
} 