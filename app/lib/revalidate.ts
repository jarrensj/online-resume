import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from './cache'

/**
 * Revalidate all caches for a user after profile mutation
 */
export function revalidateUserProfile(userId: string) {
  revalidateTag(CACHE_TAGS.userProfile(userId))
}

/**
 * Revalidate resume cache for a user after resume mutation
 */
export function revalidateUserResume(userId: string) {
  revalidateTag(CACHE_TAGS.userResume(userId))
}

/**
 * Revalidate social links cache for a user after social links mutation
 */
export function revalidateUserSocials(userId: string) {
  revalidateTag(CACHE_TAGS.userSocials(userId))
}

/**
 * Revalidate public profile cache after profile changes
 */
export function revalidatePublicProfile(username: string) {
  revalidateTag(CACHE_TAGS.publicProfile(username))
}
