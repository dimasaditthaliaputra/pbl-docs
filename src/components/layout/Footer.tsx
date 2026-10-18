import Link from 'next/link'
import { BookOpen } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-muted/20 text-sm">
      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:gap-12">
          {/* Kolom 1: Informasi Proyek */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <BookOpen className="h-4 w-4" />
              </div>
              <span className="text-base font-bold">PAGORA Docs</span>
            </Link>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Dokumentasi teknis arsitektur, alur data, aturan kode, dan workflow Git untuk sistem
              pengadaan PAGORA (Laravel + Inertia + React).
            </p>
            <div className="mt-4 inline-flex items-center rounded-md border border-border bg-background px-2.5 py-1 text-[11px] text-muted-foreground">
              Proyek Dokumentasi Tim
            </div>
          </div>

          {/* Kolom 2: Pengantar & Backend */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Arsitektur & Backend
            </h3>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link
                  href="/docs/index"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Ringkasan Proyek
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/struktur-folder"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Struktur Folder
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/arsitektur-backend"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  MVC + Service Repository
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/alur-data"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Alur Data & Pola Error
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Frontend & Panduan */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Frontend & Panduan
            </h3>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link
                  href="/docs/frontend"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Aturan Frontend
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/standar-kode"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Standar Penulisan Kode
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/fitur-baru"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Membuat Fitur Baru
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/git"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Panduan Git Tim
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Stack Inti */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Stack Teknologi
            </h3>
            <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
              <li>• Laravel (PHP) & Fortify</li>
              <li>• Inertia.js + React (.jsx)</li>
              <li>• shadcn/ui & Tailwind CSS</li>
              <li>• TanStack Table & Dropzone</li>
              <li>• PostgreSQL</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {currentYear} Tim Pengembang PAGORA. Seluruh hak cipta dilindungi.</p>
          <p>Sumber kebenaran konten: context.md</p>
        </div>
      </div>
    </footer>
  )
}
