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
  }, [currentUsername, mode])

  const handleBlur = () => {
    // Remove @ symbol from username if present
    if (username.trim().startsWith('@')) {
      setUsername(username.trim().slice(1))
    }
  }

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
        body: JSON.stringify({ 
          username: username.trim()
        }),
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
    <div className="max-w-md mx-auto card p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-3 heading-handwritten">
          {mode === 'update' ? 'Update Username' : `Welcome${user?.firstName ? `, ${user.firstName}` : ''}!`}
        </h2>
        <p className="text-secondary">
          {mode === 'update' ? 'Change your username below' : 'Choose a username to complete your profile'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="username" className="form-label">
            Username *
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={handleBlur}
            placeholder="yourhandle"
            className="input-field"
            disabled={loading}
            maxLength={50}
          />
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !username.trim() || (mode === 'update' && username.trim() === currentUsername)}
          className="w-full btn-base btn-primary"
        >
          {loading 
            ? (mode === 'update' ? 'Updating…' : 'Saving…') 
            : (mode === 'update' ? 'Update Username' : 'Save Username')
          }
        </button>
      </form>
    </div>
  )
}
