'use client'

import { Tweet } from 'react-tweet'
import { extractTweetId } from '@/app/lib/utils'

interface TweetItem {
  tweet_link: string
  notes?: string
}

interface TweetCardProps {
  tweetItem: TweetItem
  index: number
  variant?: 'default' | 'compact'
}

export default function TweetCard({ tweetItem, variant = 'default' }: TweetCardProps) {
  const tweetId = extractTweetId(tweetItem.tweet_link)
  
  // Handle invalid tweet URL
  if (!tweetId) {
    if (variant === 'compact') {
      return (
        <div className="alert alert-error text-xs">
          Invalid tweet URL
        </div>
      )
    }

    return (
      <div className="alert alert-error">
        <p className="text-sm font-medium">
          Invalid tweet URL: {tweetItem.tweet_link}
        </p>
        {tweetItem.notes && (
          <p className="text-sm mt-3 text-secondary">
            <strong>Note:</strong> {tweetItem.notes}
          </p>
        )}
      </div>
    )
  }
  
  if (variant === 'compact') {
    return <Tweet id={tweetId} />
  }

  return (
    <article className="tweet-card">
      {/* User's note (if exists) */}
      {tweetItem.notes && (
        <div className="tweet-note" aria-label="Note">
          <span className="tweet-note__label">Note</span>
          <p className="tweet-note__content">{tweetItem.notes}</p>
        </div>
      )}

      {/* Tweet embed */}
      <div className="tweet-embed">
        <Tweet id={tweetId} />
      </div>

      <div className="tweet-card__footer">
        <a
          className="tweet-card__link"
          href={tweetItem.tweet_link}
          target="_blank"
          rel="noopener noreferrer"
        >
          View on X ↗
        </a>
      </div>
    </article>
  )
}
