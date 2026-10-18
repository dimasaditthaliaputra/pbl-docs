import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllSlugs, getDocBySlug } from '@/src/lib/content'
import { getPrevNext } from '@/src/lib/navigation'
import { extractTocFromContent } from '@/src/lib/toc'
import { Breadcrumb } from '@/src/components/docs/Breadcrumb'
import { Toc, TocMobile } from '@/src/components/docs/Toc'
import { PageNav } from '@/src/components/docs/PageNav'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = getAllSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const doc = getDocBySlug(slug)

  if (!doc) {
    return { title: 'Halaman Tidak Ditemukan' }
  }

  return {
    title: doc.frontmatter.title,
    description: doc.frontmatter.description,
  }
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params
  const doc = getDocBySlug(slug)

  if (!doc) {
    notFound()
  }

  let MDXContent: React.ComponentType | null = null
  try {
    const mdxModule = await import(`../../../../content/${slug}.mdx`)
    MDXContent = mdxModule.default
  } catch {
    // Fallback if MDX file cannot be imported
  }

  const { prev, next } = getPrevNext(slug)
  const toc = extractTocFromContent(doc.content)

  const breadcrumbItems = [
    { label: 'Dokumentasi', href: '/docs/index' },
    { label: doc.frontmatter.group },
    { label: doc.frontmatter.title },
  ]

  return (
    <div className="flex gap-10">
      <article className="min-w-0 flex-1">
        <Breadcrumb items={breadcrumbItems} />

        <header className="mb-8 border-b border-border/60 pb-6">
          <div className="mb-2 inline-flex items-center rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            {doc.frontmatter.group}
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {doc.frontmatter.title}
          </h1>
          {doc.frontmatter.description && (
            <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
              {doc.frontmatter.description}
            </p>
          )}
        </header>

        {/* Mobile TOC accordion visible on screen < xl */}
        <div className="xl:hidden">
          <TocMobile toc={toc} />
        </div>

        {/* Render MDX content */}
        <div className="prose prose-slate max-w-none dark:prose-invert">
          {MDXContent ? (
            <MDXContent />
          ) : (
            <p className="text-muted-foreground">Konten segera hadir.</p>
          )}
        </div>

        {/* Previous and Next Navigation */}
        <PageNav prev={prev} next={next} />
      </article>

      {/* Desktop TOC sticky on the right for screen >= xl */}
      {toc.length > 0 && (
        <aside className="hidden w-64 shrink-0 xl:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
            <Toc toc={toc} />
          </div>
        </aside>
      )}
    </div>
  )
}
