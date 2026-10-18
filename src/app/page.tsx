import Link from 'next/link'
import { ArrowRight, BookOpen, Code2, GitBranch } from 'lucide-react'
import { ThemeToggle } from '@/src/components/layout/ThemeToggle'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <BookOpen className="h-5 w-5 text-primary" />
            <span>PAGORA Docs</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/docs/index"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Dokumentasi
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 inline-flex items-center rounded-full border border-border bg-muted px-4 py-1.5 text-sm text-muted-foreground">
            <Code2 className="mr-2 h-3.5 w-3.5" />
            Laravel + Inertia + React
          </div>

          <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground">
            Dokumentasi Teknis{' '}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              PAGORA
            </span>
          </h1>

          <p className="mb-10 text-lg leading-relaxed text-muted-foreground">
            Panduan lengkap arsitektur, alur data, aturan penulisan kode, dan panduan Git untuk tim
            pengembang PAGORA — sistem pengadaan berbasis web.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/docs/index"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Mulai Baca
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/docs/arsitektur-backend"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              <GitBranch className="h-4 w-4" />
              Arsitektur Backend
            </Link>
          </div>
        </div>

        <div className="mt-20 grid max-w-5xl grid-cols-1 gap-6 text-left sm:grid-cols-3">
          {[
            {
              icon: BookOpen,
              title: 'Arsitektur Lengkap',
              desc: 'MVC + Service Repository Pattern, alur request, dan tanggung jawab setiap layer.',
            },
            {
              icon: Code2,
              title: 'Standar Kode',
              desc: 'Aturan penulisan PHP dan React, pola komponen reusable, dan validasi form.',
            },
            {
              icon: GitBranch,
              title: 'Panduan Git',
              desc: 'Aturan branch, format commit, alur kerja harian, dan cara pull request.',
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
            >
              <Icon className="mb-3 h-8 w-8 text-primary" />
              <h2 className="mb-2 font-semibold text-foreground">{title}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
