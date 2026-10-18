'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { SearchDialog } from './SearchDialog'

export function SearchTrigger() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      } else if (
        e.key === '/' &&
        !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)
      ) {
        e.preventDefault()
        setIsOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Buka pencarian dokumentasi (Tekan Cmd+K atau Ctrl+K)"
        className="focus-visible:outline-hidden group flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-muted/40 text-muted-foreground transition-all hover:border-primary/40 hover:bg-accent/60 hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary md:h-9 md:w-56 md:justify-between md:px-3 lg:w-64"
      >
        <span className="flex items-center gap-2">
          <Search
            className="h-4 w-4 shrink-0 transition-transform group-hover:scale-105"
            aria-hidden="true"
          />
          <span className="hidden text-xs font-normal md:inline-block">Cari dokumentasi...</span>
        </span>
        <kbd className="hidden rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground md:inline-block">
          ⌘K
        </kbd>
      </button>

      <SearchDialog
        key={isOpen ? 'open' : 'closed'}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
}
