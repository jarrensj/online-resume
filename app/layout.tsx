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
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider dynamic>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          style={{ background: 'var(--background)', color: 'var(--foreground)' }}
        >
          <header className="flex justify-end items-center px-3 sm:px-6 py-3 sm:py-4 gap-2 sm:gap-4 min-h-[60px] sm:h-20">
            <SignedOut>
              <div className="flex items-center gap-2 sm:gap-3">
                <SignInButton mode="modal">
                  <button className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base font-medium rounded-lg transition-all duration-200" style={{ color: 'var(--foreground)', background: 'transparent', border: '1.5px solid var(--border-gentle)' }}>
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-3 sm:px-5 py-1.5 sm:py-2 text-sm sm:text-base font-medium rounded-lg transition-all duration-200 text-white" style={{ background: 'var(--accent-green)', border: '1.5px solid var(--accent-green)' }}>
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