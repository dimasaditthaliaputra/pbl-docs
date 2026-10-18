import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  Code2,
  GitBranch,
  Layers,
  Database,
  ShieldCheck,
  CheckCircle2,
  Workflow,
  FolderTree,
} from 'lucide-react'
import { Header } from '@/src/components/layout/Header'
import { Footer } from '@/src/components/layout/Footer'
import { NAV_ORDER } from '@/src/lib/navigation'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header showMobileNav={false} />

      <main id="main-content" tabIndex={-1} className="focus:outline-hidden flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border/40 py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-4 py-1.5 text-xs font-medium text-foreground sm:text-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              <span>Sistem Pengadaan (Procurement) Monolith</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl">
              Dokumentasi Teknis{' '}
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                PAGORA
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Panduan lengkap arsitektur MVC + Service Repository, alur data Inertia.js, aturan
              penulisan kode frontend, dan standar Git untuk seluruh tim pengembang.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/docs/index"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 sm:w-auto"
              >
                Mulai Membaca
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/docs/arsitektur-backend"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent sm:w-auto"
              >
                <Layers className="h-4 w-4 text-primary" />
                Arsitektur Backend
              </Link>
              <Link
                href="/docs/git"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent sm:w-auto"
              >
                <GitBranch className="h-4 w-4 text-primary" />
                Panduan Git
              </Link>
            </div>
          </div>
        </section>

        {/* 4 Pilar Arsitektur */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-primary">
                Prinsip Desain & Rekayasa
              </h2>
              <p className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Arsitektur yang Rapi, Terstruktur, dan Terstandar
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="shadow-xs rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Layers className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-foreground">MVC + Service Repo</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Controller tipis hanya memanggil Service. Logika bisnis di Service, akses data
                  lewat Repository Interface.
                </p>
              </div>

              <div className="shadow-xs rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Workflow className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-foreground">Jembatan Inertia.js</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Monolith modern: controller Laravel me-render komponen React langsung via{' '}
                  <code className="text-[11px]">Inertia::render()</code> tanpa REST API manual.
                </p>
              </div>

              <div className="shadow-xs rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-foreground">Keamanan & UUID</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  ID internal tidak boleh bocor ke frontend. Seluruh URL dan props publik
                  menggunakan UUID untuk mencegah IDOR.
                </p>
              </div>

              <div className="shadow-xs rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <GitBranch className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-foreground">Tata Kelola Git Tim</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Branch <code className="text-[11px]">feat/*</code>, format commit{' '}
                  <code className="text-[11px]">feat : ...</code> dengan spasi, dan penggabungan ke
                  main hanya lewat PR oleh Dimas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Daftar Modul Dokumentasi */}
        <section className="border-t border-border/40 bg-muted/15 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Daftar Isi Dokumentasi
                </h2>
                <p className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Modul & Topik Pembahasan
                </p>
              </div>
              <Link
                href="/docs/index"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline sm:text-sm"
              >
                Buka semua halaman
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {NAV_ORDER.map((item) => (
                <Link
                  key={item.slug}
                  href={`/docs/${item.slug}`}
                  className="shadow-xs group flex flex-col justify-between rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-semibold uppercase tracking-wider text-primary/80">
                        {item.group}
                      </span>
                      <span>#{item.order}</span>
                    </div>
                    <h3 className="mt-2 font-semibold text-foreground transition-colors group-hover:text-primary">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    <span>Baca bab</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
