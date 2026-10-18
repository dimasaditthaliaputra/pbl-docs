'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getNavGroups } from '@/src/lib/navigation'
import { cn } from '@/src/lib/utils'

export function Sidebar() {
  const pathname = usePathname()
  const groups = getNavGroups()

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto border-r border-border py-6 pr-4 lg:block">
      <nav aria-label="Navigasi dokumentasi" className="space-y-6">
        {groups.map((group) => (
          <div key={group.title}>
            <h2 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
              {group.title}
            </h2>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const href = `/docs/${item.slug}`
                const isActive = pathname === href

                return (
                  <li key={item.slug}>
                    <Link
                      href={href}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'focus-visible:outline-hidden flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-primary',
                        isActive
                          ? 'bg-primary/10 font-semibold text-primary'
                          : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
                      )}
                    >
                      <span>{item.title}</span>
                      {isActive && (
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}
