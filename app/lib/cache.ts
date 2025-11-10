import { unstable_cache } from 'next/cache'
import { createClerkSupabaseClient } from './db'

// Cache tags for revalidation
export const CACHE_TAGS = {
  userProfile: (userId: string) => `user-profile-${userId}`,
  userResume: (userId: string) => `user-resume-${userId}`,
  userSocials: (userId: string) => `user-socials-${userId}`,
  publicProfile: (username: string) => `public-profile-${username}`,
}

// Cache duration in seconds
const CACHE_DURATION = 60 * 5 // 5 minutes

/**
 * Cached function to fetch user profile by clerk user ID
 */
export const getCachedUserProfile = (userId: string) =>
  unstable_cache(
    async () => {
      const supabase = createClerkSupabaseClient()
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('clerk_user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw new Error('Failed to fetch user profile')
      }

      return data
    },
    [`user-profile-${userId}`],
    {
      tags: [CACHE_TAGS.userProfile(userId)],
      revalidate: CACHE_DURATION,
    }
  )()

/**
 * Cached function to fetch user profile ID by clerk user ID
 */
export const getCachedUserProfileId = (userId: string) =>
  unstable_cache(
    async () => {
      const supabase = createClerkSupabaseClient()
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('clerk_user_id', userId)
        .single()

      if (error) {
        return null
      }

      return data?.id || null
    },
    [`user-profile-id-${userId}`],
    {
      tags: [CACHE_TAGS.userProfile(userId)],
      revalidate: CACHE_DURATION,
    }
  )()

/**
 * Cached function to fetch user resume
 */
export const getCachedUserResume = (userId: string) =>
  unstable_cache(
    async () => {
      const profileId = await getCachedUserProfileId(userId)
      if (!profileId) return null

      const supabase = createClerkSupabaseClient()
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_profile_id', profileId)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw new Error('Failed to fetch resume')
      }

      return data
    },
    [`user-resume-${userId}`],
    {
      tags: [CACHE_TAGS.userResume(userId), CACHE_TAGS.userProfile(userId)],
      revalidate: CACHE_DURATION,
    }
  )()

/**
 * Cached function to fetch user social links
 */
export const getCachedUserSocials = (userId: string) =>
  unstable_cache(
    async () => {
      const supabase = createClerkSupabaseClient()
      const { data, error } = await supabase
        .from('user_profiles')
        .select('linkedin, twitter_handle, ig_handle, website')
        .eq('clerk_user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw new Error('Failed to fetch social links')
      }

      return data
    },
    [`user-socials-${userId}`],
    {
      tags: [CACHE_TAGS.userSocials(userId), CACHE_TAGS.userProfile(userId)],
      revalidate: CACHE_DURATION,
    }
  )()

/**
 * Cached function to fetch public profile with resume by username
 */
export const getCachedPublicProfile = (username: string) =>
  unstable_cache(
    async () => {
      const supabase = createClerkSupabaseClient()
      
      // Get public profile data by username
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('id, username, linkedin, twitter_handle, ig_handle, website, created_at')
        .eq('username', username.trim())
        .single()

      if (error) {
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
        resume_created_at: resume?.created_at,
      }
    },
    [`public-profile-${username}`],
    {
      tags: [CACHE_TAGS.publicProfile(username)],
      revalidate: CACHE_DURATION,
    }
  )()
