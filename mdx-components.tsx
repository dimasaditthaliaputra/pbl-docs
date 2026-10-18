import type { MDXComponents } from 'mdx/types'
import React from 'react'
import { slugifyHeading } from '@/src/lib/toc'

function extractText(node: React.ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node)
  }
  if (Array.isArray(node)) {
    return node.map(extractText).join('')
  }
  if (React.isValidElement(node)) {
    const props = node.props as { children?: React.ReactNode }
    return extractText(props.children)
  }
  return ''
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h1: ({ children }) => (
      <h1 className="mt-8 scroll-mt-24 text-3xl font-bold tracking-tight text-foreground">
        {children}
      </h1>
    ),
    h2: ({ children }) => {
      const text = extractText(children)
      const id = slugifyHeading(text)
      return (
        <h2
          id={id}
          className="group mt-10 scroll-mt-24 border-b border-border/60 pb-2 text-2xl font-semibold tracking-tight text-foreground"
        >
          <a
            href={`#${id}`}
            className="inline-flex items-center gap-2 transition-colors hover:text-primary"
          >
            <span>{children}</span>
            <span
              className="text-lg text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
              aria-hidden="true"
            >
              #
            </span>
          </a>
        </h2>
      )
    },
    h3: ({ children }) => {
      const text = extractText(children)
      const id = slugifyHeading(text)
      return (
        <h3
          id={id}
          className="group mt-8 scroll-mt-24 text-xl font-semibold tracking-tight text-foreground"
        >
          <a
            href={`#${id}`}
            className="inline-flex items-center gap-2 transition-colors hover:text-primary"
          >
            <span>{children}</span>
            <span
              className="text-base text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
              aria-hidden="true"
            >
              #
            </span>
          </a>
        </h3>
      )
    },
    table: ({ children }) => (
      <div className="my-6 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">{children}</table>
      </div>
    ),
    th: ({ children }) => (
      <th className="border-b border-border bg-muted/60 px-4 py-2.5 text-left font-semibold text-foreground">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border-b border-border/60 px-4 py-2.5 text-muted-foreground last:border-0">
        {children}
      </td>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 rounded-r border-l-4 border-primary bg-muted/30 py-2 pl-4 pr-3 italic text-muted-foreground">
        {children}
      </blockquote>
    ),
  }
}
