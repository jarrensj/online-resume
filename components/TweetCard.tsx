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
}

export default function TweetCard({ tweetItem, index }: TweetCardProps) {
  const tweetId = extractTweetId(tweetItem.tweet_link)
  
  // Handle click to open the parent tweet
  const handleCardClick = () => {
    window.open(tweetItem.tweet_link, '_blank', 'noopener,noreferrer')
  }
  
  // Handle invalid tweet URL
  if (!tweetId) {
    return (
      <div 
        className="border rounded-2xl p-6 cursor-pointer"
        style={{
          background: '#fed7d7',
          borderColor: '#feb2b2',
          color: '#c53030'
        }}
        onClick={handleCardClick}
      >
        <p className="text-sm font-medium">
          Invalid tweet URL: {tweetItem.tweet_link}
        </p>
        {tweetItem.notes && (
          <p className="text-sm mt-3" style={{ color: 'var(--foreground-secondary)' }}>
            <strong>Note:</strong> {tweetItem.notes}
          </p>
        )}
      </div>
    )
  }
  
  return (
    <div className="tweet-card cursor-pointer" onClick={handleCardClick}>
      {/* Tweet embed */}
      <div className="tweet-embed pointer-events-none">
        <Tweet id={tweetId} />
      </div>
      
      {/* User's note (if exists) */}
      {tweetItem.notes && (
        <div className="tweet-note pointer-events-none">
          {tweetItem.notes}
        </div>
      )}
    </div>
  )
}
