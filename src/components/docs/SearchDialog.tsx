'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, FileText, Hash, ArrowRight, CornerDownLeft } from 'lucide-react'
import { SEARCH_INDEX, SearchItem } from '@/src/lib/search-data'
import { cn } from '@/src/lib/utils'

interface SearchDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Auto-focus input on mount
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  // Filter search items based on query
  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) {
      // Default to main pages when query is empty
      return SEARCH_INDEX.filter((item) => item.type === 'page')
    }

    // Split query terms for multi-word search
    const terms = q.split(/\s+/).filter(Boolean)

    return SEARCH_INDEX.filter((item) => {
      const targetText =
        `${item.title} ${item.pageTitle} ${item.group} ${item.snippet}`.toLowerCase()
      return terms.every((term) => targetText.includes(term))
    }).slice(0, 15) // Limit to 15 best matches
  }, [query])

  // Selection navigation handler
  const handleSelect = useCallback(
    (item: SearchItem) => {
      onClose()
      router.push(item.href)
    },
    [onClose, router]
  )

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev < filteredResults.length - 1 ? prev + 1 : 0))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredResults.length - 1))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (filteredResults[selectedIndex]) {
          handleSelect(filteredResults[selectedIndex])
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, filteredResults, selectedIndex, onClose, handleSelect])

  // Scroll active item into view
  useEffect(() => {
    const activeEl = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`)
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' })
    }
  }, [selectedIndex])

  const handleQueryChange = (val: string) => {
    setQuery(val)
    setSelectedIndex(0)
  }

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Pencarian dokumentasi"
      className="backdrop-blur-xs fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-16 sm:p-6 sm:pt-24"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-card shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-border px-4 py-3 sm:px-5">
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Cari dokumentasi, arsitektur, kode, atau panduan Git..."
            aria-label="Ketik kata kunci pencarian"
            className="focus:outline-hidden w-full bg-transparent px-3 text-sm text-foreground placeholder:text-muted-foreground sm:text-base"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                handleQueryChange('')
                inputRef.current?.focus()
              }}
              aria-label="Hapus kata kunci"
              className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <kbd className="hidden rounded-md border border-border bg-muted/60 px-2 py-0.5 text-[11px] font-medium text-muted-foreground sm:inline-block">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div ref={listRef} className="max-h-[60vh] overflow-y-auto p-2 sm:p-3">
          {filteredResults.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm font-medium text-foreground">Tidak ada hasil yang cocok</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Coba gunakan kata kunci lain seperti &quot;service&quot;, &quot;form request&quot;,
                &quot;uuid&quot;, atau &quot;git stash&quot;.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {!query && (
                <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Halaman Dokumentasi
                </div>
              )}
              {filteredResults.map((item, idx) => {
                const isSelected = idx === selectedIndex

                return (
                  <div
                    key={item.id}
                    data-index={idx}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={cn(
                      'group flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2.5 transition-colors',
                      isSelected
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground hover:bg-muted/60'
                    )}
                  >
                    <div
                      className={cn(
                        'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border',
                        isSelected
                          ? 'border-primary/40 bg-primary/20 text-primary'
                          : 'border-border bg-muted/40 text-muted-foreground'
                      )}
                    >
                      {item.type === 'page' ? (
                        <FileText className="h-3.5 w-3.5" />
                      ) : (
                        <Hash className="h-3.5 w-3.5" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'text-sm font-medium',
                            isSelected ? 'text-primary' : 'text-foreground'
                          )}
                        >
                          {item.title}
                        </span>
                        <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                          {item.group}
                        </span>
                      </div>
                      {item.snippet && (
                        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                          {item.snippet}
                        </p>
                      )}
                    </div>

                    <ArrowRight
                      className={cn(
                        'mt-1 h-4 w-4 shrink-0 transition-opacity',
                        isSelected ? 'text-primary opacity-100' : 'opacity-0'
                      )}
                    />
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer Shortcut Bar */}
        <div className="hidden items-center justify-between border-t border-border bg-muted/30 px-4 py-2.5 text-[11px] text-muted-foreground sm:flex">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-mono">
                ↑
              </kbd>
              <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-mono">
                ↓
              </kbd>
              <span>Navigasi</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="flex items-center rounded border border-border bg-background px-1.5 py-0.5 font-mono">
                <CornerDownLeft className="mr-0.5 h-2.5 w-2.5" /> Enter
              </kbd>
              <span>Pilih</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-mono">
                Esc
              </kbd>
              <span>Tutup</span>
            </span>
          </div>

          <div>{filteredResults.length} hasil ditemukan</div>
        </div>
      </div>
    </div>
  )
}
