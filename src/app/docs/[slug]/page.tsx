import { notFound } from 'next/navigation'
import { getAllSlugs, getDocBySlug } from '@/src/lib/content'
import { getPrevNext } from '@/src/lib/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

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
    return { title: 'Halaman tidak ditemukan' }
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

  // Dynamic import of MDX file — Next.js compiles .mdx files natively with @next/mdx
  let MDXContent: React.ComponentType | null = null
  try {
    const mdxModule = await import(`../../../../content/${slug}.mdx`)
    MDXContent = mdxModule.default
  } catch {
    // MDX file may not exist yet for future content; fall back to raw content display
  }

  const { prev, next } = getPrevNext(slug)

  return (
    <article>
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-muted-foreground">{doc.frontmatter.group}</p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {doc.frontmatter.title}
        </h1>
        {doc.frontmatter.description && (
          <p className="mt-3 text-lg text-muted-foreground">{doc.frontmatter.description}</p>
        )}
      </div>

      <div className="prose prose-slate max-w-none dark:prose-invert">
        {MDXContent ? (
          <MDXContent />
        ) : (
          <p className="text-muted-foreground">Konten segera hadir.</p>
        )}
      </div>

      {/* Prev/Next navigation */}
      <nav
        className="mt-12 flex items-center justify-between border-t border-border pt-8"
        aria-label="Navigasi halaman"
      >
        {prev ? (
          <Link
            href={`/docs/${prev.slug}`}
            className="group flex items-center gap-3 rounded-lg border border-border p-4 text-sm transition-colors hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-1" />
            <div>
              <p className="text-xs text-muted-foreground">Sebelumnya</p>
              <p className="font-medium text-foreground">{prev.title}</p>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {next ? (
          <Link
            href={`/docs/${next.slug}`}
            className="group flex items-center gap-3 rounded-lg border border-border p-4 text-sm transition-colors hover:bg-accent"
          >
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Berikutnya</p>
              <p className="font-medium text-foreground">{next.title}</p>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </article>
  )
}
