'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, BookOpen } from 'lucide-react'
import { Button } from '@/src/components/ui/button'
import { ThemeToggle } from '@/src/components/layout/ThemeToggle'
import { getNavGroups } from '@/src/lib/navigation'
import { cn } from '@/src/lib/utils'

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const groups = getNavGroups()

  // Lock body scroll and listen for Escape key when open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleLinkClick = () => {
    setIsOpen(false)
  }

  return (
    <div className="lg:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        aria-label="Buka navigasi mobile"
        aria-expanded={isOpen}
        className="mr-2 h-9 w-9"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div
            className="backdrop-blur-xs fixed inset-0 bg-black/60 transition-opacity"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer container */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Navigasi dokumentasi mobile"
            className="relative z-50 flex w-80 max-w-[85vw] flex-col border-r border-border bg-background p-6 shadow-2xl"
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between border-b border-border pb-4">
              <Link
                href="/"
                className="flex items-center gap-2 font-semibold text-foreground"
                onClick={handleLinkClick}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <BookOpen className="h-4 w-4" />
                </div>
                <span>PAGORA Docs</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                aria-label="Tutup navigasi"
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Navigation links */}
            <div className="flex-1 overflow-y-auto py-4">
              <nav aria-label="Menu navigasi mobile" className="space-y-6">
                {groups.map((group) => (
                  <div key={group.title}>
                    <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {group.title}
                    </p>
                    <ul className="space-y-1">
                      {group.items.map((item) => {
                        const href = `/docs/${item.slug}`
                        const isActive = pathname === href

                        return (
                          <li key={item.slug}>
                            <Link
                              href={href}
                              onClick={handleLinkClick}
                              aria-current={isActive ? 'page' : undefined}
                              className={cn(
                                'flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors',
                                isActive
                                  ? 'bg-primary/10 font-semibold text-primary'
                                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                              )}
                            >
                              <span>{item.title}</span>
                              {isActive && (
                                <span
                                  className="h-1.5 w-1.5 rounded-full bg-primary"
                                  aria-hidden="true"
                                />
                              )}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                ))}
              </nav>
            </div>

            {/* Drawer footer */}
            <div className="flex items-center justify-between border-t border-border pt-4">
              <div className="text-xs text-muted-foreground">
                <span>PAGORA v1.0</span>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
