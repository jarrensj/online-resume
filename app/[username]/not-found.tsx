'use client'

import Link from 'next/link'
import { useState } from 'react'
import { UserX, Home, Search } from 'lucide-react'

export default function NotFound() {
  const [isHoveringButton, setIsHoveringButton] = useState(false)

  return (
    <main 
      className="min-h-screen p-8 flex flex-col items-center justify-center"
      style={{ background: 'var(--background)' }}
    >
      <div className="text-center max-w-2xl">
        {/* Icon with subtle animation */}
        <div className="mb-8 relative inline-block">
          <div 
            className="absolute inset-0 rounded-full blur-2xl opacity-20"
            style={{ background: 'var(--accent-sage)' }}
          ></div>
          <div 
            className="relative rounded-full p-8"
            style={{ 
              background: 'var(--background-card)',
              border: '2px solid var(--border-gentle)',
            }}
          >
            <UserX 
              size={64} 
              strokeWidth={1.5}
              style={{ color: 'var(--accent-brown)' }}
            />
          </div>
        </div>

        {/* Main heading */}
        <h1 
          className="text-5xl font-bold mb-4"
          style={{ 
            fontFamily: 'var(--font-handwritten)', 
            color: 'var(--foreground)' 
          }}
        >
          Profile Not Found
        </h1>
        
        {/* Description */}
        <p 
          className="text-xl mb-8 leading-relaxed"
          style={{ color: 'var(--foreground-secondary)' }}
        >
          We couldn&apos;t find a profile with this username. It may not exist yet, 
          or the user might have changed their username.
        </p>

        {/* Info card */}
        <div 
          className="card p-6 mb-8 text-left"
          style={{ 
            background: 'var(--background-secondary)',
            maxWidth: '480px',
            margin: '0 auto 2rem'
          }}
        >
          <div className="flex items-start gap-3 mb-4">
            <Search 
              size={20} 
              style={{ 
                color: 'var(--accent-green)',
                marginTop: '2px',
                flexShrink: 0
              }} 
            />
            <div>
              <h3 
                className="font-semibold mb-2"
                style={{ color: 'var(--foreground)' }}
              >
                Looking for someone specific?
              </h3>
              <ul 
                className="space-y-1 text-sm"
                style={{ color: 'var(--foreground-secondary)' }}
              >
                <li>• Double-check the username spelling</li>
                <li>• Usernames are case-sensitive</li>
                <li>• The profile might not be created yet</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3 text-white font-medium rounded-xl transition-all duration-200 no-underline"
            style={{ 
              background: isHoveringButton ? 'var(--accent-sage)' : 'var(--accent-green)',
              border: '1.5px solid var(--accent-green)',
              transform: isHoveringButton ? 'translateY(-2px)' : 'translateY(0)',
              boxShadow: isHoveringButton ? 'var(--shadow-soft)' : 'none'
            }}
            onMouseEnter={() => setIsHoveringButton(true)}
            onMouseLeave={() => setIsHoveringButton(false)}
          >
            <Home size={18} />
            Go Home
          </Link>
          
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3 font-medium rounded-xl transition-all duration-200 no-underline"
            style={{ 
              background: 'transparent',
              border: '1.5px solid var(--border-gentle)',
              color: 'var(--foreground)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-green)'
              e.currentTarget.style.color = 'var(--accent-green)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-gentle)'
              e.currentTarget.style.color = 'var(--foreground)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            Create Your Profile
          </Link>
        </div>

        {/* Subtle footer message */}
        <p 
          className="mt-8 text-sm"
          style={{ color: 'var(--foreground-light)' }}
        >
          Want to claim this username? Sign in and create your profile!
        </p>
      </div>
    </main>
  )
}

