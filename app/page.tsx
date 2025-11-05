'use client'

import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import UsernameForm from '@/components/UsernameForm'
import ResumeForm from '@/components/ResumeForm'

interface UserProfile {
  id: string
  clerk_user_id: string
  username: string
  email?: string
  created_at: string
  updated_at: string
}

export default function Home() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [showUpdateForm, setShowUpdateForm] = useState(false)
  const [showResumeForm, setShowResumeForm] = useState(false)

  // Fetch user profile when component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/username')
        const data = await response.json()
        
        if (response.ok && data.profile) {
          setUserProfile(data.profile)
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  const handleUsernameSet = (username: string) => {
    // Refresh the profile data
    setUserProfile(prev => prev ? { ...prev, username } : null)
    setShowUpdateForm(false)
    setLoading(true)
    
    // Refetch to get updated profile
    fetch('/api/username')
      .then(res => res.json())
      .then(data => {
        if (data.profile) {
          setUserProfile(data.profile)
        }
      })
      .finally(() => setLoading(false))
  }

  return (
    <main className="min-h-screen px-4 sm:px-6 py-8 sm:py-12 flex flex-col items-center justify-center" style={{ background: 'var(--background)' }}>
      <SignedOut>
        <div className="text-center max-w-md mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold mb-3 sm:mb-4" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-handwritten)' }}>
              Welcome!
            </h1>
            <p className="text-base sm:text-lg" style={{ color: 'var(--foreground-secondary)' }}>
              Create your resume
            </p>
          </div>
          
          <div className="space-y-4">
            <SignInButton>
              <button 
                className="w-full px-8 py-3 text-white font-medium rounded-xl transition-all duration-200"
                style={{ 
                  background: 'var(--accent-green)',
                  border: '1.5px solid var(--accent-green)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--accent-sage)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-soft)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--accent-green)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Sign In to Start
              </button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        {loading ? (
          <div className="text-center">
            <div 
              className="animate-spin rounded-full h-10 w-10 border-2 mx-auto loading-spinner"
              style={{ borderTopColor: 'var(--accent-green)', borderColor: 'var(--border-soft)' }}
            ></div>
            <p className="mt-4 text-lg" style={{ color: 'var(--foreground-secondary)' }}>
              Loading your space...
            </p>
          </div>
        ) : userProfile ? (
          // User has a profile - show dashboard
          <div className="text-center max-w-3xl mx-auto w-full">
            <div className="mb-6 sm:mb-10">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3" style={{ fontFamily: 'var(--font-handwritten)', color: 'var(--foreground)' }}>
                Welcome back, {userProfile.username}!
              </h1>
              <p className="text-base sm:text-lg" style={{ color: 'var(--foreground-secondary)' }}>
                Edit your profile
              </p>
            </div>

            <div className="card p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6" style={{ fontFamily: 'var(--font-handwritten)', color: 'var(--foreground)' }}>
                Your Profile
              </h2>
              <div className="text-left space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3">
                  <span className="font-medium text-sm sm:text-base" style={{ color: 'var(--foreground)' }}>Username:</span>
                  <span className="text-sm sm:text-base" style={{ color: 'var(--foreground-secondary)' }}>{userProfile.username}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3">
                  <span className="font-medium text-sm sm:text-base" style={{ color: 'var(--foreground)' }}>Member since:</span>
                  <span className="text-sm sm:text-base" style={{ color: 'var(--foreground-secondary)' }}>
                    {new Date(userProfile.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3 flex-wrap">
                  <span className="font-medium text-sm sm:text-base" style={{ color: 'var(--foreground)' }}>Profile URL:</span>
                  <a 
                    href={`/${userProfile.username}`}
                    className="underline decoration-2 underline-offset-4 transition-colors"
                    style={{ color: 'var(--accent-brown)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-green)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--accent-brown)'}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    /{userProfile.username}
                  </a>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                <button
                  onClick={() => {
                    setShowUpdateForm(!showUpdateForm);
                    if (!showUpdateForm) setShowResumeForm(false); // Close resume form when opening username form
                  }}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base text-white font-medium rounded-xl transition-all duration-200"
                  style={{ 
                    background: 'var(--accent-brown)',
                    border: '1.5px solid var(--accent-brown)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--accent-warm)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--accent-brown)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {showUpdateForm ? 'Cancel' : 'Change Username'}
                </button>
                <button
                  onClick={() => {
                    setShowResumeForm(!showResumeForm);
                    if (!showResumeForm) setShowUpdateForm(false); // Close username form when opening resume form
                  }}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base text-white font-medium rounded-xl transition-all duration-200"
                  style={{ 
                    background: 'var(--accent-green)',
                    border: '1.5px solid var(--accent-green)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--accent-sage)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--accent-green)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {showResumeForm ? 'Cancel' : 'Manage Resume'}
                </button>
                <a
                  href={`/${userProfile.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base text-white font-medium rounded-xl transition-all duration-200 no-underline"
                  style={{ 
                    background: 'var(--accent-sage)',
                    border: '1.5px solid var(--accent-sage)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--accent-green)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--accent-sage)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  View Public Profile
                </a>
              </div>
            </div>

            {showUpdateForm && (
              <div className="mb-6 sm:mb-8">
                <UsernameForm
                  mode="update"
                  currentUsername={userProfile.username}
                  onUsernameSet={handleUsernameSet}
                />
              </div>
            )}

            {showResumeForm && (
              <div className="mb-6 sm:mb-8">
                <ResumeForm
                  onResumeUpdated={() => {
                    // Optionally refresh or show success message
                    console.log('Resume updated!')
                  }}
                />
              </div>
            )}
          </div>
        ) : (
          // User doesn't have a profile - show username creation form
          <div className="w-full max-w-md mx-auto">
            <UsernameForm onUsernameSet={handleUsernameSet} />
          </div>
        )}
      </SignedIn>
    </main>
  );
}