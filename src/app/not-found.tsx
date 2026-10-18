import Link from 'next/link'
import { FileQuestion, ArrowLeft, BookOpen, Compass } from 'lucide-react'
import { Header } from '@/src/components/layout/Header'
import { Footer } from '@/src/components/layout/Footer'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header showMobileNav={false} />

      <main
        id="main-content"
        tabIndex={-1}
        className="focus:outline-hidden flex flex-1 flex-col items-center justify-center px-4 py-20 text-center sm:px-6"
      >
        <div className="mx-auto max-w-md">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <FileQuestion className="h-8 w-8 text-primary" />
          </div>

          <div className="mb-3 inline-flex items-center rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-semibold text-muted-foreground">
            Error 404
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Halaman Tidak Ditemukan
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Maaf, halaman atau dokumen teknis yang Anda tuju tidak tersedia atau tautan telah
            berubah. Silakan periksa kembali alamat URL atau gunakan navigasi berikut.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Beranda
            </Link>
            <Link
              href="/docs/index"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent sm:w-auto"
            >
              <BookOpen className="h-4 w-4" />
              Buka Dokumentasi
            </Link>
          </div>

          <div className="mt-12 rounded-xl border border-border bg-card/60 p-5 text-left">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Compass className="h-3.5 w-3.5 text-primary" />
              <span>Halaman Populer</span>
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link
                  href="/docs/index"
                  className="text-foreground transition-colors hover:text-primary hover:underline"
                >
                  • Ringkasan Proyek & Stack
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/arsitektur-backend"
                  className="text-foreground transition-colors hover:text-primary hover:underline"
                >
                  • MVC + Service Repository Pattern
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/alur-data"
                  className="text-foreground transition-colors hover:text-primary hover:underline"
                >
                  • Alur Data & Pola Error
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/git"
                  className="text-foreground transition-colors hover:text-primary hover:underline"
                >
                  • Panduan Git & Aturan Commit
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
