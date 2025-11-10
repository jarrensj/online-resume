'use client'

import { Tweet } from 'react-tweet'
import { extractTweetId } from '@/app/lib/utils'

interface TweetItem {
  tweet_link: string
  notes?: string
}

interface PublicTweetCardProps {
  tweetItem: TweetItem
}

export default function PublicTweetCard({ tweetItem }: PublicTweetCardProps) {
  const tweetId = extractTweetId(tweetItem.tweet_link)

  if (!tweetId) {
    return (
      <div
        className="public-tweet-card public-tweet-card--error"
        role="alert"
      >
        <p className="public-tweet-card__error-title">Invalid tweet URL</p>
        <p className="public-tweet-card__error-body">{tweetItem.tweet_link}</p>
      </div>
    )
  }

  return (
    <article className="public-tweet-card">
      {tweetItem.notes && (
        <section className="public-tweet-note" aria-label="Note">
          <span className="public-tweet-note__label">Note</span>
          <p className="public-tweet-note__content">{tweetItem.notes}</p>
        </section>
      )}

      <div className="public-tweet-card__embed">
        <Tweet id={tweetId} />
      </div>

      <footer className="public-tweet-card__footer">
        <a
          className="public-tweet-card__link"
          href={tweetItem.tweet_link}
          target="_blank"
          rel="noopener noreferrer"
        >
          View on X ↗
        </a>
      </footer>
    </article>
  )
}

