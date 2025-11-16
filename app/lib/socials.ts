export type SocialFieldKey = 'linkedin' | 'twitter_handle' | 'ig_handle' | 'website'

export const SOCIAL_FIELD_KEYS: SocialFieldKey[] = ['linkedin', 'twitter_handle', 'ig_handle', 'website']

export type SanitizedSocialFields = Partial<Record<SocialFieldKey, string | null>>

const ensureHttpsProtocol = (url: string): string => {
  // If the URL doesn't start with a protocol, add https://
  if (!url.match(/^https?:\/\//i)) {
    return `https://${url}`
  }
  return url
}

export const sanitizeSocialFields = (payload: Record<string, unknown>): SanitizedSocialFields => {
  const result: SanitizedSocialFields = {}

  SOCIAL_FIELD_KEYS.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(payload, key)) {
      const value = payload[key]

      if (typeof value === 'string') {
        const trimmed = value.trim()
        if (trimmed.length > 0) {
          // Automatically add https:// protocol to URL fields if missing
          if (key === 'website' || key === 'linkedin') {
            result[key] = ensureHttpsProtocol(trimmed)
          } else {
            result[key] = trimmed
          }
        } else {
          result[key] = null
        }
      } else {
        result[key] = null
      }
    }
  })

  return result
}

export interface SocialFields {
  linkedin: string | null
  twitter_handle: string | null
  ig_handle: string | null
  website: string | null
}

export const emptySocialFields = (): SocialFields => ({
  linkedin: null,
  twitter_handle: null,
  ig_handle: null,
  website: null,
})

