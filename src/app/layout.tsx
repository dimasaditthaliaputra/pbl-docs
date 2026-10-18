import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/src/components/layout/ThemeProvider'

export const metadata: Metadata = {
  title: {
    default: 'PAGORA Docs',
    template: '%s | PAGORA Docs',
  },
  description:
    'Dokumentasi teknis proyek PAGORA — sistem pengadaan berbasis Laravel + Inertia + React.',
  keywords: ['PAGORA', 'dokumentasi', 'Laravel', 'React', 'Inertia.js', 'pengadaan'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
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
