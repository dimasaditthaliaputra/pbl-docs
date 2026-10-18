import { Header } from '@/src/components/layout/Header'
import { Footer } from '@/src/components/layout/Footer'
import { Sidebar } from '@/src/components/docs/Sidebar'

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header showMobileNav={true} />

      <div className="mx-auto flex w-full max-w-[1440px] flex-1 px-4 sm:px-6 lg:px-8">
        <Sidebar />
        <main
          id="main-content"
          tabIndex={-1}
          className="focus:outline-hidden min-w-0 flex-1 py-8 lg:pl-8 xl:pl-10"
        >
          {children}
        </main>
      </div>

      <Footer />
    </div>
  )
}
