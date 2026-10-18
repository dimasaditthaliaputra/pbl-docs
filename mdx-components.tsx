import type { MDXComponents } from 'mdx/types'

// Global MDX components — Sprint 2 will add CodeBlock, Callout, FileTree, Steps, Tabs, Diagram
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    // Typography overrides for prose styling consistency
    h1: ({ children }) => (
      <h1 className="mt-8 scroll-m-20 text-3xl font-bold tracking-tight">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-6 scroll-m-20 text-xl font-semibold tracking-tight">{children}</h3>
    ),
    table: ({ children }) => (
      <div className="my-6 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">{children}</table>
      </div>
    ),
    th: ({ children }) => (
      <th className="border-b border-border bg-muted px-4 py-2 text-left font-semibold">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border-b border-border px-4 py-2 last:border-0">{children}</td>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-4 border-l-4 border-primary pl-4 text-muted-foreground">
        {children}
      </blockquote>
    ),
  }
}
