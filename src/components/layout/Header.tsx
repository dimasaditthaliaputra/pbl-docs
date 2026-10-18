import Link from 'next/link'
import { BookOpen, ExternalLink } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { MobileNav } from '@/src/components/docs/MobileNav'

interface HeaderProps {
  showMobileNav?: boolean
}

export function Header({ showMobileNav = true }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          {showMobileNav && <MobileNav />}

          <Link href="/" className="flex items-center gap-2.5 font-semibold text-foreground">
            <div className="shadow-xs flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BookOpen className="h-4 w-4" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-base tracking-tight sm:text-lg">PAGORA Docs</span>
              <span className="hidden rounded-full border border-border bg-muted/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-block">
                Laravel + React
              </span>
            </div>
          </Link>
        </div>

        <nav aria-label="Navigasi utama" className="flex items-center gap-2 sm:gap-4">
          <div className="hidden items-center gap-1 sm:flex md:gap-3">
            <Link
              href="/docs/index"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Dokumentasi
            </Link>
            <Link
              href="/docs/arsitektur-backend"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Arsitektur
            </Link>
            <Link
              href="/docs/git"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Git Tim
            </Link>
          </div>

          <div className="hidden h-4 w-px bg-border sm:block" />

          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
