import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "hi",
  description: "hi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          style={{ background: 'var(--background)', color: 'var(--foreground)' }}
        >
          <header className="flex justify-end items-center px-6 py-4 gap-4 h-20">
            <SignedOut>
              <div className="flex items-center gap-3">
                <SignInButton>
                  <button 
                    className="px-4 py-2 font-medium rounded-lg transition-all duration-200"
                    style={{ 
                      color: 'var(--foreground)',
                      background: 'transparent',
                      border: '1.5px solid var(--border-gentle)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--hover-bg)';
                      e.currentTarget.style.borderColor = 'var(--accent-sage)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = 'var(--border-gentle)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button 
                    className="px-5 py-2 font-medium rounded-lg transition-all duration-200 text-white"
                    style={{ 
                      background: 'var(--accent-green)',
                      border: '1.5px solid var(--accent-green)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--accent-sage)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-gentle)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--accent-green)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>
            <SignedIn>
              <div>
                <UserButton />
              </div>
            </SignedIn>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}