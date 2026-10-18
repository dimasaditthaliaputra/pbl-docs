'use client'

import { useState, useEffect } from 'react'
import { AlignLeft, ChevronDown } from 'lucide-react'
import { cn } from '@/src/lib/utils'
import type { TocItem } from '@/src/types'

interface TocProps {
  toc: TocItem[]
}

export function Toc({ toc }: TocProps) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    if (toc.length === 0) return

    const handleScroll = () => {
      const headingElements = toc
        .map((item) => document.getElementById(item.id))
        .filter((el): el is HTMLElement => el !== null)

      const scrollPosition = window.scrollY + 120

      let currentActiveId = ''
      for (const el of headingElements) {
        if (el.offsetTop <= scrollPosition) {
          currentActiveId = el.id
        } else {
          break
        }
      }

      if (!currentActiveId && headingElements.length > 0) {
        currentActiveId = headingElements[0].id
      }

      setActiveId(currentActiveId)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [toc])

  if (toc.length === 0) return null

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      window.history.pushState(null, '', `#${id}`)
      setActiveId(id)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-foreground">
        <AlignLeft className="h-3.5 w-3.5 text-primary" />
        <span>Pada Halaman Ini</span>
      </div>
      <ul className="space-y-1.5 text-sm">
        {toc.map((item) => (
          <li key={item.id} className={item.level === 3 ? 'pl-3' : ''}>
            <a
              href={`#${item.id}`}
              onClick={(e) => handleClick(e, item.id)}
              className={cn(
                'block border-l-2 py-1 pl-3 text-xs leading-normal transition-colors',
                activeId === item.id
                  ? 'border-primary font-medium text-foreground'
                  : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
              )}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function TocMobile({ toc }: TocProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    if (toc.length === 0) return

    const handleScroll = () => {
      const headingElements = toc
        .map((item) => document.getElementById(item.id))
        .filter((el): el is HTMLElement => el !== null)

      const scrollPosition = window.scrollY + 120

      let currentActiveId = ''
      for (const el of headingElements) {
        if (el.offsetTop <= scrollPosition) {
          currentActiveId = el.id
        } else {
          break
        }
      }

      if (!currentActiveId && headingElements.length > 0) {
        currentActiveId = headingElements[0].id
      }

      setActiveId(currentActiveId)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [toc])

  if (toc.length === 0) return null

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    setIsOpen(false)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      window.history.pushState(null, '', `#${id}`)
      setActiveId(id)
    }
  }

  return (
    <div className="mb-6 rounded-lg border border-border bg-card/60 p-3 text-sm">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between font-medium text-foreground"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2 text-xs font-semibold">
          <AlignLeft className="h-4 w-4 text-primary" />
          Daftar Isi Halaman ({toc.length})
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-muted-foreground transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <ul className="mt-3 space-y-1.5 border-t border-border pt-3 text-xs">
          {toc.map((item) => (
            <li key={item.id} className={item.level === 3 ? 'pl-3' : ''}>
              <a
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                className={cn(
                  'block py-1 transition-colors',
                  activeId === item.id
                    ? 'font-medium text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
