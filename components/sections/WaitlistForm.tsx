'use client'

import { useState, FormEvent } from 'react'
import { Mail, LoaderCircle, CheckCircle2 } from 'lucide-react'

export const WaitlistForm = () => {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setState('loading')
    setMessage('')

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong.')
      }
      
      setState('success')
      setMessage(data.message)
      setEmail('')
    } catch (error) {
      setState('error')
      if (error instanceof Error) {
        setMessage(error.message)
      } else {
        setMessage('An unknown error occurred.')
      }
    }
  }

  return (
    <div className="mt-8">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto">
        <div className="relative flex-grow">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full pl-10 pr-4 py-3 rounded-md bg-brand-dark-light border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            aria-label="Email for waitlist"
          />
        </div>
        <button
          type="submit"
          disabled={state === 'loading'}
          className="flex-shrink-0 px-6 py-3 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {state === 'loading' && <LoaderCircle className="animate-spin" size={20} />}
          {state !== 'loading' && 'Join the Waitlist'}
        </button>
      </form>
      {state === 'success' && (
        <p className="mt-4 text-green-400 flex items-center justify-center gap-2">
          <CheckCircle2 size={20} /> {message}
        </p>
      )}
      {state === 'error' && (
        <p className="mt-4 text-red-400 text-center">{message}</p>
      )}
    </div>
  )
} 