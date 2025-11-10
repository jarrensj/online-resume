'use client'

import {
  SignInButton,
  SignUpButton,
  UserButton,
  useAuth,
} from '@clerk/nextjs'

export function Header() {
  const { isSignedIn, isLoaded } = useAuth()

  return (
    <header className="flex justify-end items-center px-6 py-4 gap-4 h-20">
      {!isLoaded ? (
        // Show loading state while auth is being determined
        <div className="w-24 h-10" />
      ) : isSignedIn ? (
        <div>
          <UserButton />
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <SignInButton mode="modal">
            <button className="px-4 py-2 font-medium rounded-lg transition-all duration-200" style={{ color: 'var(--foreground)', background: 'transparent', border: '1.5px solid var(--border-gentle)' }}>
              Sign In
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="px-5 py-2 font-medium rounded-lg transition-all duration-200 text-white" style={{ background: 'var(--accent-green)', border: '1.5px solid var(--accent-green)' }}>
              Sign Up
            </button>
          </SignUpButton>
        </div>
      )}
    </header>
  )
}
