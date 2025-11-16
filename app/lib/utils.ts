/**
 * Utility functions for the online resume application
 */

/**
 * Extracts tweet ID from Twitter/X URL
 * @param url - The tweet URL from twitter.com or x.com
 * @returns The tweet ID string or null if invalid URL
 */
export function extractTweetId(url: string): string | null {
  if (!url) return null
  const regex = /(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/
  const match = url.match(regex)
  return match ? match[1] : null
}

/**
 * Ensures a URL has an HTTPS protocol prefix
 * @param url - The URL string to normalize
 * @returns The URL with https:// prefix if it didn't have a protocol
 */
export function ensureHttpsProtocol(url: string): string {
  const trimmed = url.trim()
  if (!trimmed) return trimmed
  // If the URL doesn't start with a protocol, add https://
  if (!trimmed.match(/^https?:\/\//i)) {
    return `https://${trimmed}`
  }
  return trimmed
}
