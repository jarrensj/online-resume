'use client'

import { ChangeEvent, FormEvent, useEffect, useState } from 'react'

type SocialFieldKey = 'linkedin' | 'twitter_handle' | 'ig_handle' | 'website'

type SocialLinksState = Record<SocialFieldKey, string>

interface SocialLinksFormProps {
  onSocialsUpdated?: (socials: SocialLinksState) => void
}

const defaultState: SocialLinksState = {
  linkedin: '',
  twitter_handle: '',
  ig_handle: '',
  website: '',
}

export default function SocialLinksForm({ onSocialsUpdated }: SocialLinksFormProps) {
  const [socials, setSocials] = useState<SocialLinksState>({ ...defaultState })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const hasAnyValue = Object.values(socials).some((value) => value.trim().length > 0)

  useEffect(() => {
    const fetchSocials = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await fetch('/api/socials')
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load social links')
        }

        if (data.socials) {
          setSocials({
            linkedin: data.socials.linkedin ?? '',
            twitter_handle: data.socials.twitter_handle ?? '',
            ig_handle: data.socials.ig_handle ?? '',
            website: data.socials.website ?? '',
          })
        }
      } catch (err) {
        console.error('Error fetching social links:', err)
        setError(err instanceof Error ? err.message : 'An error occurred while loading social links')
      } finally {
        setLoading(false)
      }
    }

    fetchSocials()
  }, [])

  const handleChange = (field: SocialFieldKey) => (event: ChangeEvent<HTMLInputElement>) => {
    setSocials((prev) => ({
      ...prev,
      [field]: event.target.value,
    }))
    setSuccess('')
    setError('')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setSubmitting(true)
    setError('')
    setSuccess('')

    const payload = (Object.keys(socials) as SocialFieldKey[]).reduce<Record<string, string>>((acc, key) => {
      acc[key] = socials[key].trim()
      return acc
    }, {})

    try {
      const response = await fetch('/api/socials', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update social links')
      }

      const updatedSocials: SocialLinksState = {
        linkedin: data.socials.linkedin ?? '',
        twitter_handle: data.socials.twitter_handle ?? '',
        ig_handle: data.socials.ig_handle ?? '',
        website: data.socials.website ?? '',
      }

      setSocials(updatedSocials)
      setSuccess('Social links updated successfully!')
      onSocialsUpdated?.(updatedSocials)
    } catch (err) {
      console.error('Error updating social links:', err)
      setError(err instanceof Error ? err.message : 'An error occurred while updating social links')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto card p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-3 heading-handwritten">
          Social Links
        </h2>
        <p className="text-secondary">
          Share where people can find you online
        </p>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 mx-auto loading-spinner"></div>
          <p className="mt-4 text-sm loading-text">
            Loading social links…
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="linkedin" className="form-label">
              LinkedIn
            </label>
            <input
              type="url"
              id="linkedin"
              value={socials.linkedin}
              onChange={handleChange('linkedin')}
              placeholder="https://linkedin.com/in/yourprofile"
              className="input-field"
              disabled={submitting}
            />
          </div>

          <div>
            <label htmlFor="twitter_handle" className="form-label">
              Twitter Handle
            </label>
            <input
              type="text"
              id="twitter_handle"
              value={socials.twitter_handle}
              onChange={handleChange('twitter_handle')}
              placeholder="@yourhandle"
              className="input-field"
              disabled={submitting}
              maxLength={50}
            />
          </div>

          <div>
            <label htmlFor="ig_handle" className="form-label">
              Instagram Handle
            </label>
            <input
              type="text"
              id="ig_handle"
              value={socials.ig_handle}
              onChange={handleChange('ig_handle')}
              placeholder="@yourhandle"
              className="input-field"
              disabled={submitting}
              maxLength={50}
            />
          </div>

          <div>
            <label htmlFor="website" className="form-label">
              Website
            </label>
            <input
              type="url"
              id="website"
              value={socials.website}
              onChange={handleChange('website')}
              placeholder="https://antiresume.com"
              className="input-field"
              disabled={submitting}
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

          <div className="flex justify-between items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 btn-base btn-primary"
            >
              {submitting ? 'Saving…' : 'Save Social Links'}
            </button>
            <button
              type="button"
              onClick={() => {
                setSocials({ ...defaultState })
                setSuccess('')
                setError('')
              }}
              disabled={submitting || !hasAnyValue}
              className="btn-base btn-outline"
            >
              Clear
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
