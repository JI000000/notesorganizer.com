'use client';

import { useState } from 'react';

export default function SummarizerPage() {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSummarize = async () => {
    setIsLoading(true);
    setError('');
    setSummary('');

    // Basic validation
    if (!inputText.trim()) {
      setError('Please enter some text to summarize.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        throw new Error('Failed to get a summary. Please try again.');
      }

      const data = await response.json();
      setSummary(data.summary);

    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-24 pt-48">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white">AI Note Summarizer</h1>
        <p className="text-lg text-gray-400 mt-4">Paste any note or article. Get a perfect, one-paragraph summary in seconds.</p>
      </div>

      <div className="max-w-4xl mx-auto mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label htmlFor="input-text" className="block text-lg font-semibold text-gray-300 mb-2">Your Text</label>
            <textarea
              id="input-text"
              rows={15}
              className="w-full bg-gray-900 border border-gray-700 rounded-md p-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              placeholder="Paste your long note here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="summary-output" className="block text-lg font-semibold text-gray-300 mb-2">AI Generated Summary</label>
            <div
              id="summary-output"
              className="w-full h-full bg-gray-900 border border-gray-700 rounded-md p-4 text-gray-200 min-h-[200px]"
            >
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
                </div>
              ) : (
                <p>{summary}</p>
              )}
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={handleSummarize}
            disabled={isLoading}
            className="bg-brand-blue text-white font-bold text-lg px-8 py-4 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Summarizing...' : 'Summarize'}
          </button>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
} 