import { notFound } from 'next/navigation'
import PublicTweetCard from '@/components/PublicTweetCard'
import { Linkedin, Twitter, Instagram, Globe } from 'lucide-react'
import { createClerkSupabaseClient } from '@/app/lib/db'

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

async function getProfile(username: string): Promise<UserProfile | null> {
  try {
    const supabase = createClerkSupabaseClient()
    
    // Get public profile data by username
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('id, username, linkedin, twitter_handle, ig_handle, website, created_at')
      .eq('username', username.trim())
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return null
    }

    // Get user's resume/tweets
    const { data: resume } = await supabase
      .from('resumes')
      .select('tweets, created_at')
      .eq('user_profile_id', profile.id)
      .single()

    return {
      ...profile,
      tweets: resume?.tweets || [],
      resume_created_at: resume?.created_at
    }
  } catch (error) {
    console.error('Error fetching profile:', error)
    return null
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const resolvedParams = await params
  const profile = await getProfile(resolvedParams.username)

  if (!profile) {
    notFound()
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
                <p style={{ color: 'var(--foreground-secondary)', fontSize: '1.1rem' }}>
                  {profile.username} hasn&apos;t shared any thoughts yet.
                </p>
                <div className="mt-6 w-16 h-0.5 mx-auto" style={{ background: 'var(--accent-sage)' }}></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

