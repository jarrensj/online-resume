import { ComponentType } from 'react'
import { User, Edit3, FileType, Share2, Wallet, Trash2 } from 'lucide-react'

type IconType = ComponentType<{ className?: string }>

interface NavItem {
  label: string
  icon: IconType
  onClick: () => void
  variant?: 'danger'
}

interface DashboardSidebarProps {
  sidebarOpen: boolean
  onProfileClick: () => void
  onUsernameClick: () => void
  onResumeClick: () => void
  onSocialLinksClick: () => void
  onWalletsClick: () => void
  onResetClick: () => void
}

export default function DashboardSidebar({
  sidebarOpen,
  onProfileClick,
  onUsernameClick,
  onResumeClick,
  onSocialLinksClick,
  onWalletsClick,
  onResetClick,
}: DashboardSidebarProps) {
  const navItems: NavItem[] = [
    { label: 'Profile', icon: User, onClick: onProfileClick },
    { label: 'Username', icon: Edit3, onClick: onUsernameClick },
    { label: 'Resume', icon: FileType, onClick: onResumeClick },
    { label: 'Social Links', icon: Share2, onClick: onSocialLinksClick },
    { label: 'Wallets', icon: Wallet, onClick: onWalletsClick },
  ]

  const buttonBaseClasses =
    'w-full px-4 py-3 rounded-lg transition-colors duration-200 text-left text-charcoal-700 hover:text-charcoal-800'
  const buttonHoverClasses = 'hover:bg-sage-100'
  const dangerClasses =
    'text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-200'

  return (
    <div
      className={`fixed top-0 left-0 h-full w-72 bg-matcha-cream border-r-2 border-sage-300 z-40 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="p-6 pt-20">
        <h2 className="text-xl font-noto font-semibold text-charcoal-800 mb-6">
          Manage Profile
        </h2>

        <nav className="space-y-2">
          {navItems.map(({ label, icon: Icon, onClick }) => (
            <button
              key={label}
              onClick={onClick}
              className={`${buttonBaseClasses} ${buttonHoverClasses}`}
            >
              <span className="w-full inline-flex items-center gap-3">
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{label}</span>
              </span>
            </button>
          ))}

          <div className="pt-4 mt-4 border-t border-sage-200">
            <button
              onClick={onResetClick}
              className={`w-full px-4 py-3 rounded-lg text-left ${dangerClasses}`}
            >
              <span className="w-full inline-flex items-center gap-3">
                <Trash2 className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">Reset Profile</span>
              </span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  )
}
