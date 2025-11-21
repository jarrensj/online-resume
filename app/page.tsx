'use client'

import Link from 'next/link'
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import UsernameForm from '@/components/UsernameForm'
import ResumeForm from '@/components/ResumeForm'
import ConfirmDialog from '@/components/ConfirmDialog'
import SocialLinksForm from '@/components/SocialLinksForm'
import WalletAddressesForm from '@/components/WalletAddressesForm'
import { FileText, Users, Shield, Sparkles, Code, Palette, TrendingUp, Edit3, FileType, Share2, Wallet, ExternalLink, Trash2, Menu, X, User } from 'lucide-react'

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
  const [showSocialForm, setShowSocialForm] = useState(false)
  const [showWalletForm, setShowWalletForm] = useState(false)
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [resetError, setResetError] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
    setShowSocialForm(false)
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

  const handleResetProfile = async () => {
    setResetLoading(true)
    setResetError('')

    try {
      const response = await fetch('/api/username', {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset profile')
      }

      // Success! Reset the local state
      setUserProfile(null)
      setShowResetDialog(false)
      setShowUpdateForm(false)
      setShowResumeForm(false)
      setShowSocialForm(false)
      setShowWalletForm(false)
      
    } catch (err) {
      setResetError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <main className="min-h-screen" style={{ background: 'var(--background)' }}>
      <SignedOut>
        {/* Hero Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            {/* Decorative icons */}
            <div className="flex justify-center items-center space-x-12 mb-8 opacity-60">
              <FileText className="w-6 h-6 text-charcoal-400 hand-drawn" strokeWidth={1} />
              <Sparkles className="w-8 h-8 text-sage-400 hand-drawn" strokeWidth={1} />
              <Users className="w-6 h-6 text-charcoal-400 hand-drawn" strokeWidth={1} />
            </div>

            {/* Main content */}
            <h1 className="text-4xl md:text-6xl font-noto font-light text-charcoal-800 mb-6 leading-tight">
              Better than a resume.<br />
              <span className="font-medium text-sage-500">Show what&apos;s real.</span>
            </h1>
            
            <p className="text-xl text-charcoal-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              People can lie on their resume. The antiresume is different — it&apos;s build out of genuine interactions, public and real wins, and concrete online evidence of how great you are.
            </p>

            {/* CTA Button */}
            <div className="mb-16">
              <SignInButton>
                <button className="bg-charcoal-700 hover:bg-charcoal-800 text-matcha-cream font-zen text-lg px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                  Show your antiresume
                </button>
              </SignInButton>
            </div>

            {/* Subtle decorative line */}
            <div className="w-16 h-px bg-charcoal-300 mx-auto opacity-60"></div>
          </div>
        </section>

        {/* What is an antiresume Section */}
        <section className="py-20 px-6 bg-gradient-to-b from-matcha-cream to-sage-50/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-noto font-light text-charcoal-800 text-center mb-4">
              What&apos;s in an antiresume?
            </h2>
            <p className="text-center text-charcoal-600 mb-16 max-w-2xl mx-auto">
              Three core elements that prove your worth
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="bg-matcha-cream shadow-md rounded-3xl p-8 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                <div className="w-14 h-14 bg-sage-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-7 h-7 text-sage-500" strokeWidth={1.5} />
                </div>
                <div className="text-sage-500 font-noto font-medium text-sm mb-3 tracking-wider">01</div>
                <h3 className="text-2xl font-noto font-medium text-charcoal-800 mb-4">
                  Your actual work
                </h3>
                <p className="text-charcoal-600 leading-relaxed">
                  Not bullet points about responsibilities — links to posts about real projects, code repositories, and things you&apos;ve shipped.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-matcha-cream shadow-md rounded-3xl p-8 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                <div className="w-14 h-14 bg-sage-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-7 h-7 text-sage-500" strokeWidth={1.5} />
                </div>
                <div className="text-sage-500 font-noto font-medium text-sm mb-3 tracking-wider">02</div>
                <h3 className="text-2xl font-noto font-medium text-charcoal-800 mb-4">
                  Social proof that matters
                </h3>
                <p className="text-charcoal-600 leading-relaxed">
                  Embed tweets from people who&apos;ve worked with you, used your products, or genuinely support your work.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-matcha-cream shadow-md rounded-3xl p-8 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                <div className="w-14 h-14 bg-sage-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-7 h-7 text-sage-500" strokeWidth={1.5} />
                </div>
                <div className="text-sage-500 font-noto font-medium text-sm mb-3 tracking-wider">03</div>
                <h3 className="text-2xl font-noto font-medium text-charcoal-800 mb-4">
                  Your digital footprint
                </h3>
                <p className="text-charcoal-600 leading-relaxed">
                  Show your social links and what you&apos;ve shipped. Flex your digital footprint and public and real you.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* For Builders Section - Bento Grid Style */}
        <section className="py-20 px-6 bg-sage-50/50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-noto font-light text-charcoal-800 text-center mb-4">
              For Builders
            </h2>
            <p className="text-center text-charcoal-600 mb-16 max-w-2xl mx-auto leading-relaxed">
              Whether you&apos;re engineering, designing, or trading — show your wins (and losses) the way they deserve to be shared.
            </p>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Engineers Card - Large Featured */}
              <div className="lg:row-span-2 bg-gradient-to-br from-matcha-cream to-sage-100 shadow-md rounded-3xl p-8 lg:p-10 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex flex-col h-full">
                  <div className="w-16 h-16 bg-charcoal-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <Code className="w-8 h-8 text-matcha-cream" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-noto font-medium text-charcoal-800 mb-4">
                    For Engineers
                  </h3>
                  <div className="flex-1 space-y-4">
                    <p className="text-lg text-charcoal-600 leading-relaxed">
                      Stop sharing your best work in a PDF. Share the posts about your side projects blowing up, the shares by other legendary people, and the comments from people saying your code changed their life.
                    </p>
                    <div className="bg-matcha-cream/70 backdrop-blur-sm border border-sage-400 rounded-2xl p-4">
                      <p className="text-charcoal-700 leading-relaxed font-medium">
                        Flex <span className="text-sage-500 font-bold">the product launches</span> that you were a part of and the numbers that it did online.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Designers Card */}
              <div className="bg-gradient-to-br from-matcha-cream to-matcha-light shadow-md rounded-3xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 bg-sage-200 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Palette className="w-7 h-7 text-sage-500" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl lg:text-3xl font-noto font-medium text-charcoal-800 mb-3">
                  For Designers
                </h3>
                <p className="text-charcoal-600 leading-relaxed mb-4">
                  Traditional portfolios are static and boring. Share the public comments where people are blown away with your designs, posts of your designs going viral.
                </p>
                <p className="text-charcoal-700 leading-relaxed font-medium text-sm">
                  Show the <span className="text-sage-500 font-bold">real reactions</span> from amazing people.
                </p>
              </div>

              {/* Traders Card */}
              <div className="bg-gradient-to-br from-charcoal-800 to-charcoal-700 shadow-lg rounded-3xl p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group text-matcha-cream">
                <div className="w-14 h-14 bg-sage-400 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <TrendingUp className="w-7 h-7 text-charcoal-800" strokeWidth={2} />
                </div>
                <h3 className="text-2xl lg:text-3xl font-noto font-medium mb-3">
                  For Traders
                </h3>
                <p className="text-matcha-cream/90 leading-relaxed mb-4">
                  Share your insane wins when you 10x a position. Share your brutal losses when the market humbled you — with real post receipts. That can&apos;t be faked.
                </p>
                <p className="text-matcha-cream leading-relaxed font-medium text-sm">
                  <span className="text-sage-400 font-bold">Flex your online receipts</span> where you were right on a thesis so early.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-6 bg-matcha-light/30">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-noto font-light text-charcoal-800 text-center mb-4">
              Why antiresume?
            </h2>
            <p className="text-center text-charcoal-600 mb-12 max-w-2xl mx-auto">
              Your online presence tells the real story. Show what you&apos;ve actually built and who genuinely believes in you.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="w-16 h-16 bg-sage-100 rounded-2xl flex items-center justify-center">
                    <FileText className="w-8 h-8 text-sage-500" strokeWidth={1.5} />
                  </div>
                </div>
                <h3 className="text-xl font-noto font-medium text-charcoal-800 mb-3">
                  Real Projects
                </h3>
                <p className="text-charcoal-600 leading-relaxed">
                  Display what you&apos;ve actually built. Link to your demo posts, the product launches, and just what you&apos;ve shipped.
                </p>
              </div>

              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="w-16 h-16 bg-sage-100 rounded-2xl flex items-center justify-center">
                    <Users className="w-8 h-8 text-sage-500" strokeWidth={1.5} />
                  </div>
                </div>
                <h3 className="text-xl font-noto font-medium text-charcoal-800 mb-3">
                  Genuine Vouches
                </h3>
                <p className="text-charcoal-600 leading-relaxed">
                  Share posts from people who actually believe in you and your character and your work.
                </p>
              </div>

              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="w-16 h-16 bg-sage-100 rounded-2xl flex items-center justify-center">
                    <Shield className="w-8 h-8 text-sage-500" strokeWidth={1.5} />
                  </div>
                </div>
                <h3 className="text-xl font-noto font-medium text-charcoal-800 mb-3">
                  Authentic Story
                </h3>
                <p className="text-charcoal-600 leading-relaxed">
                  Your online presence is verifiable. No inflated titles, just real work and real impact.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Example antiresumes Section */}
        <section className="py-12 px-6 bg-sage-50/50">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-noto font-light text-charcoal-800 mb-6">
              Example antiresumes
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/jarrensj"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-matcha-cream hover:bg-sage-100 text-charcoal-800 font-zen px-6 py-3 rounded-xl border-2 border-sage-300 hover:border-sage-400 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                /jarrensj
              </Link>
              <Link
                href="/jarrensj"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-matcha-cream hover:bg-sage-100 text-charcoal-800 font-zen px-6 py-3 rounded-xl border-2 border-sage-300 hover:border-sage-400 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                /jarrensj
              </Link>
              <Link
                href="/jarrensj"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-matcha-cream hover:bg-sage-100 text-charcoal-800 font-zen px-6 py-3 rounded-xl border-2 border-sage-300 hover:border-sage-400 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                /jarrensj
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-charcoal-200 bg-matcha-light/30">
          <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <div className="flex items-center space-x-2 mb-4">
                  <FileText className="w-6 h-6 text-charcoal-600" strokeWidth={1.5} />
                  <span className="font-noto font-medium text-charcoal-800">antiresume</span>
                </div>
                <Link href="/" className="text-sm text-charcoal-600 leading-relaxed hover:text-sage-500 transition-colors">
                  build your antiresume
                </Link>
              </div>
            </div>
            
            <div className="border-t border-charcoal-200 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center">
              <Link href="/" className="text-xs text-charcoal-500 mb-2 sm:mb-0 hover:text-sage-500 transition-colors">
                antiresume.com
              </Link>
              <div className="flex items-center space-x-1 text-xs text-charcoal-500">
                <span>Made with sushi</span>
              </div>
            </div>
          </div>
        </footer>
      </SignedOut>

      <SignedIn>
        {/* Hamburger Menu Button */}
        {userProfile && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="fixed top-6 left-6 z-50 p-2 rounded-lg bg-matcha-cream border-2 border-sage-300 hover:bg-sage-100 transition-all duration-200"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X className="w-6 h-6 text-charcoal-700" /> : <Menu className="w-6 h-6 text-charcoal-700" />}
          </button>
        )}

        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 h-full w-72 bg-matcha-cream border-r-2 border-sage-300 z-40 transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-6 pt-20">
            <h2 className="text-xl font-noto font-semibold text-charcoal-800 mb-6">Manage Profile</h2>
            <nav className="space-y-2">
              <button
                onClick={() => {
                  setShowUpdateForm(false);
                  setShowResumeForm(false);
                  setShowSocialForm(false);
                  setShowWalletForm(false);
                  setSidebarOpen(false);
                }}
                className="w-full px-4 py-3 rounded-lg hover:bg-sage-100 transition-colors duration-200 text-left text-charcoal-700 hover:text-charcoal-800"
              >
                <span className="font-medium inline-flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile
                </span>
              </button>
              <button
                onClick={() => {
                  setShowUpdateForm(!showUpdateForm);
                  setShowResumeForm(false);
                  setShowSocialForm(false);
                  setShowWalletForm(false);
                  setSidebarOpen(false);
                }}
                className="w-full px-4 py-3 rounded-lg hover:bg-sage-100 transition-colors duration-200 text-left text-charcoal-700 hover:text-charcoal-800"
              >
                <span className="font-medium inline-flex items-center gap-2">
                  <Edit3 className="w-5 h-5" />
                  Username
                </span>
              </button>
              <button
                onClick={() => {
                  setShowResumeForm(!showResumeForm);
                  setShowSocialForm(false);
                  setShowWalletForm(false);
                  setShowUpdateForm(false);
                  setSidebarOpen(false);
                }}
                className="w-full px-4 py-3 rounded-lg hover:bg-sage-100 transition-colors duration-200 text-left text-charcoal-700 hover:text-charcoal-800"
              >
                <span className="font-medium inline-flex items-center gap-2">
                  <FileType className="w-5 h-5" />
                  Resume
                </span>
              </button>
              <button
                onClick={() => {
                  setShowSocialForm(!showSocialForm);
                  setShowResumeForm(false);
                  setShowWalletForm(false);
                  setShowUpdateForm(false);
                  setSidebarOpen(false);
                }}
                className="w-full px-4 py-3 rounded-lg hover:bg-sage-100 transition-colors duration-200 text-left text-charcoal-700 hover:text-charcoal-800"
              >
                <span className="font-medium inline-flex items-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Social Links
                </span>
              </button>
              <button
                onClick={() => {
                  setShowWalletForm(!showWalletForm);
                  setShowResumeForm(false);
                  setShowSocialForm(false);
                  setShowUpdateForm(false);
                  setSidebarOpen(false);
                }}
                className="w-full px-4 py-3 rounded-lg hover:bg-sage-100 transition-colors duration-200 text-left text-charcoal-700 hover:text-charcoal-800"
              >
                <span className="font-medium inline-flex items-center gap-2">
                  <Wallet className="w-5 h-5" />
                  Wallets
                </span>
              </button>
              
              <div className="pt-4 mt-4 border-t border-sage-200">
                <button
                  onClick={() => {
                    setShowResetDialog(true);
                    setSidebarOpen(false);
                  }}
                  className="w-full px-4 py-3 rounded-lg hover:bg-red-50 transition-colors duration-200 text-left text-red-600 hover:text-red-700"
                >
                  <span className="font-medium inline-flex items-center gap-2">
                    <Trash2 className="w-5 h-5" />
                    Reset Profile
                  </span>
                </button>
              </div>
            </nav>
          </div>
        </div>

        <div className="px-6 pt-32 pb-12 flex flex-col items-center justify-center">
        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-2 mx-auto loading-spinner"></div>
            <p className="mt-4 text-lg loading-text">
              Loading your space…
            </p>
          </div>
        ) : userProfile ? (
          // User has a profile - show dashboard or forms
          <div className="text-center max-w-3xl mx-auto w-full">
            {!showUpdateForm && !showResumeForm && !showSocialForm && !showWalletForm ? (
              // Show profile dashboard when no form is active
              <>
                <div className="mb-10">
                  <h1 className="text-5xl font-bold mb-3 heading-handwritten">
                    Welcome back, {userProfile.username}!
                  </h1>
                  <p className="text-lg text-secondary">
                    Edit your profile
                  </p>
                </div>

                <div className="card p-8 mb-8">
                  <h2 className="text-2xl font-semibold mb-6 heading-handwritten">
                    Your Profile
                  </h2>
                  <div className="text-left space-y-4 mb-8">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium" style={{ color: 'var(--foreground)' }}>Username:</span>
                      <span className="text-secondary">{userProfile.username}</span>
                    </div>
                    <div className="flex items-center space-x-3 flex-wrap">
                      <span className="font-medium" style={{ color: 'var(--foreground)' }}>Profile URL:</span>
                      <a 
                        href={`/${userProfile.username}`}
                        className="profile-link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        /{userProfile.username}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 flex-wrap justify-center">
                    <a
                      href={`/${userProfile.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-base btn-sage no-underline text-sm px-3 py-2 gap-1.5"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Public Profile
                    </a>
                  </div>
                </div>
              </>
            ) : (
              // Show only the active form
              <>
                {showUpdateForm && (
                  <div className="mb-8">
                    <UsernameForm
                      mode="update"
                      currentUsername={userProfile.username}
                      onUsernameSet={handleUsernameSet}
                    />
                  </div>
                )}

                {showResumeForm && (
                  <div className="mb-8">
                    <ResumeForm
                      onResumeUpdated={() => {
                        // Optionally refresh or show success message
                        console.log('Resume updated!')
                      }}
                    />
                  </div>
                )}

                {showSocialForm && (
                  <div className="mb-8">
                    <SocialLinksForm />
                  </div>
                )}

                {showWalletForm && (
                  <div className="mb-8">
                    <WalletAddressesForm />
                  </div>
                )}
              </>
            )}

            {resetError && (
              <div className="mt-4 max-w-md mx-auto alert alert-error">
                {resetError}
              </div>
            )}
          </div>
        ) : (
          // User doesn't have a profile - show username creation form
          <div className="w-full max-w-md mx-auto">
            <UsernameForm onUsernameSet={handleUsernameSet} />
          </div>
        )}
        </div>
      </SignedIn>

      {/* Reset Profile Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showResetDialog}
        title="Reset Profile?"
        message="Are you sure you want to reset your profile? This will permanently delete your username, resume, and all associated data. This action cannot be undone."
        confirmText="Yes, Reset Profile"
        cancelText="Cancel"
        onConfirm={handleResetProfile}
        onCancel={() => {
          setShowResetDialog(false)
          setResetError('')
        }}
        isLoading={resetLoading}
        variant="danger"
      />
    </main>
  );
}
