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

  const variantColors = {
    danger: {
      button: '#dc3545',
      buttonHover: '#c82333',
      icon: '#dc3545'
    },
    warning: {
      button: '#ff9800',
      buttonHover: '#f57c00',
      icon: '#ff9800'
    },
    info: {
      button: 'var(--accent-green)',
      buttonHover: 'var(--accent-sage)',
      icon: 'var(--accent-green)'
    }
  }

  const colors = variantColors[variant]

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
            style={{ background: `${colors.icon}20` }}
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke={colors.icon}
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
            <h3 
              className="text-2xl font-bold mb-2"
              style={{ fontFamily: 'var(--font-handwritten)', color: 'var(--foreground)' }}
            >
              {title}
            </h3>
            <p 
              className="text-base leading-relaxed"
              style={{ color: 'var(--foreground-secondary)' }}
            >
              {message}
            </p>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-5 py-2.5 font-medium rounded-xl transition-all duration-200 disabled:opacity-50"
            style={{ 
              background: 'var(--background-secondary)', 
              border: '1.5px solid var(--border-soft)',
              color: 'var(--foreground)'
            }}
            onMouseEnter={(e) => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.background = 'var(--hover-bg)';
                e.currentTarget.style.borderColor = 'var(--accent-green)';
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.background = 'var(--background-secondary)';
                e.currentTarget.style.borderColor = 'var(--border-soft)';
              }
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-5 py-2.5 font-medium rounded-xl transition-all duration-200 disabled:opacity-50 text-white"
            style={{ 
              background: isLoading ? 'var(--foreground-light)' : colors.button,
              border: `1.5px solid ${colors.button}`
            }}
            onMouseEnter={(e) => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.background = colors.buttonHover;
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.background = colors.button;
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
