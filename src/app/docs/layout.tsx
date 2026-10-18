import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import { getNavGroups } from '@/src/lib/navigation'
import { ThemeToggle } from '@/src/components/layout/ThemeToggle'

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const navGroups = getNavGroups()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <BookOpen className="h-5 w-5 text-primary" />
            <span>PAGORA Docs</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 px-6">
        {/* Sidebar */}
        <aside className="sticky top-[65px] hidden h-[calc(100vh-65px)] w-64 shrink-0 overflow-y-auto border-r border-border py-8 pr-6 md:block">
          <nav aria-label="Navigasi dokumentasi">
            {navGroups.map((group) => (
              <div key={group.title} className="mb-6">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.title}
                </p>
                <ul className="space-y-1">
                  {group.items.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/docs/${item.slug}`}
                        className="block rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 py-8 md:pl-10">{children}</main>
      </div>
    </div>
  )
}
