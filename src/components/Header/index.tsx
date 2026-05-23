import type { ReactNode } from 'react'
import Logo from '../Logo'

export const CONTACT_URL = 'https://www.airtel.in/b2b/contact-us'

interface BreadcrumbItem {
  label: string
  href?: string
  onClick?: () => void
}

interface Props {
  /** Breadcrumb items. If omitted, no breadcrumb row is shown. */
  breadcrumb?: BreadcrumbItem[]
  /** Optional caption shown to the right of the logo (e.g., "Step 1 of 5"). */
  caption?: string
  /** Optional custom node placed before the Talk to an Expert button. */
  rightSlot?: ReactNode
  /** Sticky positioning (used on the Result page). */
  sticky?: boolean
}

export default function Header({ breadcrumb, caption, rightSlot, sticky = false }: Props) {
  return (
    <div className={sticky ? 'sticky top-0 z-40' : ''}>
      <header className="bg-white border-b border-[#E5E5E5]">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          {/* Left: Logo + optional caption */}
          <div className="flex items-center gap-4 min-w-0">
            <Logo height={64} />
            {caption && (
              <span className="text-sm md:text-base font-semibold text-gray-500 hidden md:block">
                {caption}
              </span>
            )}
          </div>

          {/* Right: Optional slot + Talk to an Expert */}
          <div className="flex items-center gap-3 shrink-0">
            {rightSlot}
            <a
              href={CONTACT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#1A1A1A] text-white text-sm font-semibold rounded-lg hover:bg-black transition-all duration-150 shadow-sm"
              aria-label="Talk to an Expert"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="sm:hidden">
                <path d="M3 5a2 2 0 012-2h2.28a1 1 0 01.95.68l1.5 4.5a1 1 0 01-.5 1.21l-2.26 1.13a11 11 0 005.52 5.52l1.13-2.26a1 1 0 011.21-.5l4.5 1.5a1 1 0 01.68.95V19a2 2 0 01-2 2A18 18 0 013 5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="hidden sm:inline">Talk to an Expert</span>
            </a>
          </div>
        </div>
      </header>

      {/* Breadcrumb row */}
      {breadcrumb && breadcrumb.length > 0 && (
        <div className="bg-white border-b border-[#E5E5E5]">
          <nav className="max-w-6xl mx-auto px-6 py-2.5 text-xs">
            <ol className="flex items-center gap-2 text-gray-500">
              {breadcrumb.map((item, i) => {
                const isLast = i === breadcrumb.length - 1
                return (
                  <li key={i} className="flex items-center gap-2">
                    {i > 0 && <span className="text-gray-300">/</span>}
                    {item.href && !isLast ? (
                      <a href={item.href} className="hover:text-[#1A1A1A] transition-colors">
                        {item.label}
                      </a>
                    ) : item.onClick && !isLast ? (
                      <button
                        onClick={item.onClick}
                        className="hover:text-[#1A1A1A] transition-colors"
                      >
                        {item.label}
                      </button>
                    ) : (
                      <span className={isLast ? 'text-[#1A1A1A] font-medium' : ''}>
                        {item.label}
                      </span>
                    )}
                  </li>
                )
              })}
            </ol>
          </nav>
        </div>
      )}
    </div>
  )
}
