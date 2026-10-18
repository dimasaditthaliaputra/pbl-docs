import React from 'react'
import { Folder, FolderOpen, FileCode, FileText } from 'lucide-react'
import { cn } from '@/src/lib/utils'

export interface FileTreeProps {
  children?: React.ReactNode
  className?: string
}

export interface FileTreeItemProps {
  name: string
  comment?: string
  children?: React.ReactNode
  defaultOpen?: boolean
}

interface ParsedLine {
  indent: number
  isFolder: boolean
  name: string
  comment?: string
}

function parseRawTree(raw: string): ParsedLine[] {
  const lines = raw.split('\n')
  const results: ParsedLine[] = []

  for (const rawLine of lines) {
    if (!rawLine.trim()) continue

    // Separate item and comment by `#`
    const commentIndex = rawLine.indexOf('#')
    let lineContent = commentIndex >= 0 ? rawLine.slice(0, commentIndex) : rawLine
    const comment = commentIndex >= 0 ? rawLine.slice(commentIndex + 1).trim() : undefined

    // Measure indentation depth based on characters like `├──`, `└──`, `│`, spaces
    let indent = 0
    // Strip branch characters and count spaces
    const cleanPrefixMatch = lineContent.match(/^([\s│├└─]+)/)
    if (cleanPrefixMatch) {
      const prefix = cleanPrefixMatch[1]
      // Count depth by 4-space equivalent or branch symbols
      const branchCount = (prefix.match(/[├└]/g) || []).length
      const spaceCount = (prefix.match(/ {2,}/g) || []).length
      indent = Math.max(branchCount, Math.floor(prefix.length / 4))
    }

    const cleanName = lineContent.replace(/^[\s│├└─]+/, '').trim()
    if (!cleanName) continue

    const isFolder = cleanName.endsWith('/') || cleanName.includes('/')

    results.push({
      indent,
      isFolder,
      name: cleanName,
      comment,
    })
  }

  return results
}

export function FileTree({ children, className = '' }: FileTreeProps) {
  // If children is a string (e.g. from markdown template string), parse as ASCII tree
  const isStringContent = typeof children === 'string'

  if (isStringContent) {
    const items = parseRawTree(children as string)

    return (
      <div
        className={cn(
          'shadow-xs my-6 overflow-x-auto rounded-xl border border-border bg-card/60 p-4 font-mono text-xs sm:text-sm',
          className
        )}
      >
        <div className="min-w-max space-y-1.5">
          {items.map((item, idx) => (
            <div
              key={`${item.name}-${idx}`}
              className="flex items-center gap-2 py-0.5"
              style={{ paddingLeft: `${item.indent * 1.25}rem` }}
            >
              {item.isFolder ? (
                <FolderOpen className="h-4 w-4 shrink-0 text-amber-500/90" />
              ) : item.name.endsWith('.php') ||
                item.name.endsWith('.jsx') ||
                item.name.endsWith('.tsx') ||
                item.name.endsWith('.js') ? (
                <FileCode className="h-4 w-4 shrink-0 text-blue-500/90" />
              ) : (
                <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
              )}

              <span
                className={cn(
                  'font-medium',
                  item.isFolder ? 'font-semibold text-foreground' : 'text-foreground/90'
                )}
              >
                {item.name}
              </span>

              {item.comment && (
                <span className="ml-2 font-sans text-xs text-muted-foreground">
                  # {item.comment}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'shadow-xs my-6 overflow-x-auto rounded-xl border border-border bg-card/60 p-4 font-mono text-xs sm:text-sm',
        className
      )}
    >
      <div className="min-w-max space-y-1">{children}</div>
    </div>
  )
}

function FolderItem({ name, comment, children }: FileTreeItemProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 py-0.5">
        <Folder className="h-4 w-4 shrink-0 text-amber-500/90" />
        <span className="font-semibold text-foreground">{name}/</span>
        {comment && (
          <span className="ml-2 font-sans text-xs text-muted-foreground"># {comment}</span>
        )}
      </div>
      {children && <div className="ml-2 space-y-1 border-l border-border/70 pl-4">{children}</div>}
    </div>
  )
}

function FileItem({ name, comment }: FileTreeItemProps) {
  const isCode =
    name.endsWith('.php') || name.endsWith('.jsx') || name.endsWith('.tsx') || name.endsWith('.js')

  return (
    <div className="flex items-center gap-2 py-0.5">
      {isCode ? (
        <FileCode className="h-4 w-4 shrink-0 text-blue-500/90" />
      ) : (
        <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
      )}
      <span className="text-foreground/90">{name}</span>
      {comment && <span className="ml-2 font-sans text-xs text-muted-foreground"># {comment}</span>}
    </div>
  )
}

FileTree.Folder = FolderItem
FileTree.File = FileItem
