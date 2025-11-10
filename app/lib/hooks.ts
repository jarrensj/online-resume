'use client'

import useSWR, { mutate } from 'swr'
import { UserProfile, Resume } from './db'

// SWR keys for cache management
export const SWR_KEYS = {
  userProfile: '/api/username',
  userResume: '/api/resume',
  userSocials: '/api/socials',
  publicProfile: (username: string) => `/api/profile/${username}`,
}

// Generic fetcher for SWR
const fetcher = async (url: string) => {
  const res = await fetch(url)
  
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.') as Error & { status: number }
    error.status = res.status
    throw error
  }
  
  return res.json()
}

// Hook to fetch user profile with caching
export function useUserProfile() {
  const { data, error, isLoading, mutate: revalidate } = useSWR(
    SWR_KEYS.userProfile,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // 60 seconds
    }
  )

  return {
    userProfile: data?.profile as UserProfile | null | undefined,
    isLoading,
    isError: error,
    revalidate,
  }
}

// Hook to fetch user resume with caching
export function useUserResume() {
  const { data, error, isLoading, mutate: revalidate } = useSWR(
    SWR_KEYS.userResume,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // 60 seconds
    }
  )

  return {
    resume: data?.resume as Resume | null | undefined,
    isLoading,
    isError: error,
    revalidate,
  }
}

// Hook to fetch user social links with caching
export function useUserSocials() {
  const { data, error, isLoading, mutate: revalidate } = useSWR(
    SWR_KEYS.userSocials,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // 60 seconds
    }
  )

  return {
    socials: data?.socials,
    isLoading,
    isError: error,
    revalidate,
  }
}

// Hook to fetch public profile with caching
export function usePublicProfile(username: string) {
  const { data, error, isLoading } = useSWR(
    username ? SWR_KEYS.publicProfile(username) : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // 60 seconds
    }
  )

  return {
    profile: data?.profile,
    isLoading,
    isError: error,
  }
}

// Cache revalidation helpers
export function revalidateUserProfile() {
  mutate(SWR_KEYS.userProfile)
}

export function revalidateUserResume() {
  mutate(SWR_KEYS.userResume)
}

export function revalidateUserSocials() {
  mutate(SWR_KEYS.userSocials)
}

export function revalidatePublicProfile(username: string) {
  mutate(SWR_KEYS.publicProfile(username))
}
