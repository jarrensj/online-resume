'use client'

import { useState, useEffect, use } from 'react'
import { notFound } from 'next/navigation'
import PublicTweetCard from '@/components/PublicTweetCard'
import { Linkedin, Twitter, Instagram, Globe } from 'lucide-react'

interface TweetItem {
  tweet_link: string
  notes?: string
}

interface UserProfile {
  id: string
  username: string
  created_at: string
  tweets: TweetItem[]
  resume_created_at?: string
  linkedin?: string | null
  twitter_handle?: string | null
  ig_handle?: string | null
  website?: string | null
}

interface ProfilePageProps {
  params: Promise<{
    username: string
  }>
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const resolvedParams = use(params)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/profile/${resolvedParams.username}`)
        
        if (response.status === 404) {
          notFound()
          return
        }
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile')
        }
        
        const data = await response.json()
        setProfile(data.profile)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (resolvedParams.username) {
      fetchProfile()
    }
  }, [resolvedParams.username])

  if (loading) {
    return (
      <main className="min-h-screen p-8 flex flex-col items-center justify-center" style={{ background: 'var(--background)' }}>
        <div className="text-center">
          <div 
            className="animate-spin rounded-full h-10 w-10 border-2 mx-auto loading-spinner"
            style={{ borderTopColor: 'var(--accent-green)', borderColor: 'var(--border-soft)' }}
          ></div>
          <p className="mt-4 text-lg" style={{ color: 'var(--foreground-secondary)' }}>Loading profile...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen p-8 flex flex-col items-center justify-center" style={{ background: 'var(--background)' }}>
        <div className="text-center">
          <h1 
            className="text-3xl font-bold mb-4"
            style={{ fontFamily: 'var(--font-handwritten)', color: '#c53030' }}
          >
            Oops!
          </h1>
          <p style={{ color: 'var(--foreground-secondary)' }}>{error}</p>
        </div>
      </main>
    )
  }

  if (!profile) {
    return notFound()
  }

  const getSocialLinks = () => {
    const links = []
    
    if (profile.linkedin) {
      links.push({
        href: profile.linkedin,
        icon: Linkedin,
        label: 'LinkedIn',
        ariaLabel: 'Visit LinkedIn profile'
      })
    }
    
    if (profile.twitter_handle) {
      const handle = profile.twitter_handle.startsWith('@') 
        ? profile.twitter_handle.slice(1) 
        : profile.twitter_handle
      links.push({
        href: `https://twitter.com/${handle}`,
        icon: Twitter,
        label: 'Twitter',
        ariaLabel: 'Visit Twitter profile'
      })
    }
    
    if (profile.ig_handle) {
      const handle = profile.ig_handle.startsWith('@') 
        ? profile.ig_handle.slice(1) 
        : profile.ig_handle
      links.push({
        href: `https://instagram.com/${handle}`,
        icon: Instagram,
        label: 'Instagram',
        ariaLabel: 'Visit Instagram profile'
      })
    }
    
    if (profile.website) {
      links.push({
        href: profile.website,
        icon: Globe,
        label: 'Website',
        ariaLabel: 'Visit website'
      })
    }
    
    return links
  }

  const socialLinks = getSocialLinks()

  return (
    <main className="min-h-screen px-6 py-12" style={{ background: 'var(--background)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="text-center mb-12">
          <h1
            className="text-5xl font-bold mb-4"
            style={{ fontFamily: 'var(--font-handwritten)', color: 'var(--foreground)' }}
          >
            {profile.username}
          </h1>

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="flex justify-center gap-4 mt-6">
              {socialLinks.map((link) => {
                const Icon = link.icon
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.ariaLabel}
                    className="social-icon-link"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      border: '1.5px solid var(--border-gentle)',
                      background: 'var(--background-card)',
                      color: 'var(--foreground-secondary)',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent-green)'
                      e.currentTarget.style.color = 'var(--accent-green)'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = 'var(--shadow-soft)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-gentle)'
                      e.currentTarget.style.color = 'var(--foreground-secondary)'
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <Icon size={20} strokeWidth={2} />
                  </a>
                )
              })}
            </div>
          )}
        </div>

        {/* Tweets Section */}
        <div className="space-y-6">
          {profile.tweets && profile.tweets.length > 0 ? (
            <>
              <div className="flex flex-col gap-4">
                {profile.tweets.map((tweetItem, index) => (
                  <PublicTweetCard key={index} tweetItem={tweetItem} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div 
                className="card p-12 max-w-lg mx-auto"
                style={{ background: 'var(--background-secondary)' }}
              >
                <h2 
                  className="text-3xl font-semibold mb-3"
                  style={{ fontFamily: 'var(--font-handwritten)', color: 'var(--foreground)' }}
                >
                  No tweets yet
                </h2>
                <div className="mt-6 w-16 h-0.5 mx-auto" style={{ background: 'var(--accent-sage)' }}></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

