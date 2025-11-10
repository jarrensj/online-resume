'use client'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
  variant?: 'danger' | 'warning' | 'info'
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isLoading = false,
  variant = 'warning'
}: ConfirmDialogProps) {
  if (!isOpen) return null

  const getButtonClass = () => {
    switch (variant) {
      case 'danger':
        return 'btn-danger'
      case 'warning':
        return 'btn-secondary'
      case 'info':
        return 'btn-primary'
      default:
        return 'btn-primary'
    }
  }

  const getIconColor = () => {
    switch (variant) {
      case 'danger':
        return '#dc3545'
      case 'warning':
        return '#ff9800'
      case 'info':
        return 'var(--accent-green)'
      default:
        return 'var(--accent-green)'
    }
  }

  const iconColor = getIconColor()

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onCancel}
    >
      <div 
        className="max-w-md w-full rounded-2xl p-6 shadow-2xl"
        style={{ background: 'var(--background-card)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4 mb-5">
          <div 
            className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: `${iconColor}20` }}
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {variant === 'danger' && (
                <>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </>
              )}
              {variant === 'warning' && (
                <>
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </>
              )}
              {variant === 'info' && (
                <>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </>
              )}
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-2xl font-bold mb-2 heading-handwritten">
              {title}
            </h3>
            <p className="text-base leading-relaxed text-secondary">
              {message}
            </p>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="btn-base btn-outline"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`btn-base ${getButtonClass()}`}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
