import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { NavItem } from '@/src/types'

interface PageNavProps {
  prev: NavItem | null
  next: NavItem | null
}

export function PageNav({ prev, next }: PageNavProps) {
  if (!prev && !next) return null

  return (
    <nav
      aria-label="Navigasi halaman dokumentasi"
      className="mt-14 grid grid-cols-1 gap-4 border-t border-border pt-8 sm:grid-cols-2"
    >
      {prev ? (
        <Link
          href={`/docs/${prev.slug}`}
          className="group flex flex-col justify-between rounded-lg border border-border p-4 text-sm transition-all hover:border-primary/50 hover:bg-accent/40"
        >
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Sebelumnya</span>
          </span>
          <span className="mt-2 font-medium text-foreground transition-colors group-hover:text-primary">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}

      {next ? (
        <Link
          href={`/docs/${next.slug}`}
          className="group flex flex-col justify-between rounded-lg border border-border p-4 text-right text-sm transition-all hover:border-primary/50 hover:bg-accent/40 sm:col-start-2"
        >
          <span className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
            <span>Berikutnya</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </span>
          <span className="mt-2 font-medium text-foreground transition-colors group-hover:text-primary">
            {next.title}
          </span>
        </Link>
      ) : null}
    </nav>
  )
}
