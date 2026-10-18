import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/src/components/layout/ThemeProvider'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://pagora-docs.vercel.app'),
  title: {
    default: 'PAGORA Docs — Dokumentasi Sistem Pengadaan',
    template: '%s | PAGORA Docs',
  },
  description:
    'Dokumentasi teknis resmi sistem pengadaan PAGORA (Laravel + Inertia + React). Panduan lengkap arsitektur MVC + Service Repository, alur data, aturan frontend, standar kode, dan alur kerja Git.',
  keywords: [
    'PAGORA',
    'dokumentasi',
    'Laravel',
    'React',
    'Inertia.js',
    'Service Repository Pattern',
    'TanStack Table',
    'sistem pengadaan',
    'panduan git',
  ],
  authors: [{ name: 'Tim Pengembang PAGORA' }],
  creator: 'Dimas & Tim PAGORA',
  publisher: 'PAGORA',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://pagora-docs.vercel.app',
    siteName: 'PAGORA Docs',
    title: 'PAGORA Docs — Dokumentasi Sistem Pengadaan',
    description:
      'Dokumentasi teknis arsitektur, alur data, standar penulisan kode, dan workflow Git untuk sistem pengadaan PAGORA.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PAGORA Docs — Dokumentasi Sistem Pengadaan',
    description:
      'Dokumentasi teknis arsitektur, alur data, dan workflow Git untuk sistem pengadaan PAGORA.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <a
          href="#main-content"
          className="focus:outline-hidden sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:shadow-lg"
        >
          Lewati ke konten utama
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
