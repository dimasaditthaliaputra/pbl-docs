import { codeToHtml } from 'shiki'
import { FileCode, Terminal } from 'lucide-react'
import { CopyButton } from './CopyButton'

export interface CodeBlockProps {
  code?: string
  language?: string
  filename?: string
  illustration?: boolean
  children?: React.ReactNode
}

function extractText(node: React.ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node)
  }
  if (Array.isArray(node)) {
    return node.map(extractText).join('')
  }
  if (node && typeof node === 'object' && 'props' in node) {
    const props = (node as { props?: { children?: React.ReactNode } }).props
    return extractText(props?.children)
  }
  return ''
}

export async function CodeBlock({
  code,
  language = 'text',
  filename,
  illustration = false,
  children,
}: CodeBlockProps) {
  const rawCode = (code ?? extractText(children)).trim()

  // Normalize language name
  const langNormalized = language.toLowerCase().replace(/^language-/, '')
  const validLangs: Record<string, string> = {
    js: 'javascript',
    jsx: 'jsx',
    ts: 'typescript',
    tsx: 'tsx',
    php: 'php',
    bash: 'bash',
    sh: 'bash',
    shell: 'bash',
    zsh: 'bash',
    json: 'json',
    sql: 'sql',
    html: 'html',
    css: 'css',
    text: 'text',
    txt: 'text',
  }
  const langToUse = validLangs[langNormalized] ?? 'text'

  let highlightedHtml = ''
  try {
    highlightedHtml = await codeToHtml(rawCode, {
      lang: langToUse,
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    })
  } catch {
    // Fallback if shiki throws on unusual syntax
    highlightedHtml = `<pre class="p-4 overflow-x-auto text-xs font-mono"><code>${rawCode
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')}</code></pre>`
  }

  const isTerminal =
    langToUse === 'bash' ||
    langToUse === 'shell' ||
    langNormalized === 'sh' ||
    langNormalized === 'bash'

  return (
    <div className="shadow-xs group relative my-6 overflow-hidden rounded-xl border border-border bg-card">
      {/* Codeblock Header Bar */}
      <div className="flex h-10 items-center justify-between border-b border-border/80 bg-muted/40 px-4 text-xs">
        <div className="flex items-center gap-2 text-muted-foreground">
          {isTerminal ? (
            <Terminal className="h-4 w-4 text-primary/70" />
          ) : (
            <FileCode className="h-4 w-4 text-primary/70" />
          )}
          <span className="font-mono font-medium text-foreground">
            {filename || (isTerminal ? 'Terminal' : langNormalized.toUpperCase())}
          </span>
          {illustration && (
            <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">
              Contoh ilustrasi
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {filename && (
            <span className="hidden font-mono text-[10px] uppercase text-muted-foreground/70 sm:inline-block">
              {langNormalized}
            </span>
          )}
          <CopyButton text={rawCode} />
        </div>
      </div>

      {/* Code body with dual theme support */}
      <div
        className="code-block-content overflow-x-auto text-xs leading-relaxed sm:text-sm [&>pre]:!m-0 [&>pre]:!rounded-none [&>pre]:!border-0 [&>pre]:!bg-transparent [&>pre]:p-4"
        dangerouslySetInnerHTML={{ __html: highlightedHtml }}
      />
    </div>
  )
}
