'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'

interface UsernameFormProps {
  onUsernameSet?: (username: string) => void
  mode?: 'create' | 'update'
  currentUsername?: string
}

export default function UsernameForm({ onUsernameSet, mode = 'create', currentUsername = '' }: UsernameFormProps) {
  const [username, setUsername] = useState(currentUsername)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { user } = useUser()

  useEffect(() => {
    setUsername(currentUsername)
  }, [currentUsername])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!username.trim()) {
      setError('Username is required')
      return
    }

    if (mode === 'update' && username.trim() === currentUsername) {
      setError('New username must be different from current username')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const method = mode === 'update' ? 'PUT' : 'POST'
      const response = await fetch('/api/username', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Failed to ${mode === 'update' ? 'update' : 'save'} username`)
      }

      // Success!
      const successMessage = mode === 'update' ? 'Username updated successfully!' : 'Username saved successfully!'
      setSuccess(successMessage)
      
      // Call the callback if provided
      onUsernameSet?.(username.trim())
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto card p-4 sm:p-6 md:p-8">
      <div className="text-center mb-6 sm:mb-8">
        <h2 
          className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3"
          style={{ fontFamily: 'var(--font-handwritten)', color: 'var(--foreground)' }}
        >
          {mode === 'update' ? 'Update Username' : `Welcome${user?.firstName ? `, ${user.firstName}` : ''}!`}
        </h2>
        <p className="text-sm sm:text-base" style={{ color: 'var(--foreground-secondary)' }}>
          {mode === 'update' ? 'Change your username below' : 'Choose a username to complete your profile'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div>
          <label 
            htmlFor="username" 
            className="block text-sm font-medium mb-2 sm:mb-3"
            style={{ color: 'var(--foreground)' }}
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl transition-all duration-200"
            style={{
              border: '1.5px solid var(--border-gentle)',
              background: 'var(--background-card)',
              color: 'var(--foreground)',
              fontSize: '1rem'
            }}
            disabled={loading}
            maxLength={50}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--accent-green)';
              e.target.style.boxShadow = '0 0 0 3px rgba(157, 181, 161, 0.15)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-gentle)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {error && (
          <div 
            className="text-sm p-4 rounded-xl border"
            style={{ 
              color: '#c53030',
              background: '#fed7d7',
              borderColor: '#feb2b2'
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div 
            className="text-sm p-4 rounded-xl border"
            style={{ 
              color: 'var(--accent-green)',
              background: '#f0fff4',
              borderColor: 'var(--accent-sage)'
            }}
          >
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !username.trim() || (mode === 'update' && username.trim() === currentUsername)}
          className="w-full py-2.5 sm:py-3 px-4 sm:px-6 text-sm sm:text-base font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-white"
          style={{
            background: loading || !username.trim() || (mode === 'update' && username.trim() === currentUsername) 
              ? 'var(--foreground-light)' 
              : 'var(--accent-green)',
            border: '1.5px solid transparent'
          }}
          onMouseEnter={(e) => {
            if (!e.currentTarget.disabled) {
              e.currentTarget.style.background = 'var(--accent-sage)';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-soft)';
            }
          }}
          onMouseLeave={(e) => {
            if (!e.currentTarget.disabled) {
              e.currentTarget.style.background = 'var(--accent-green)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }
          }}
        >
          {loading 
            ? (mode === 'update' ? 'Updating...' : 'Saving...') 
            : (mode === 'update' ? 'Update Username' : 'Save Username')
          }
        </button>
      </form>
    </div>
  )
}

