export interface TocItem {
  id: string
  title: string
  level: 2 | 3
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/<[^>]*>/g, '') // remove HTML tags
    .replace(/[`*_~]/g, '') // remove markdown styling characters
    .replace(/[^\w\s-]/g, '') // remove punctuation except space and hyphen
    .replace(/\s+/g, '-') // spaces to hyphens
    .replace(/-+/g, '-') // collapse consecutive hyphens
    .replace(/^-+|-+$/g, '') // trim leading/trailing hyphens
}

export function extractTocFromContent(content: string): TocItem[] {
  // Strip code blocks so code comments are not mistaken for markdown headings
  const withoutCodeBlocks = content.replace(/```[\s\S]*?```/g, '')

  const headingRegex = /^(#{2,3})\s+(.+)$/gm
  const items: TocItem[] = []
  let match: RegExpExecArray | null

  while ((match = headingRegex.exec(withoutCodeBlocks)) !== null) {
    const hashes = match[1]
    const rawTitle = match[2].trim()
    // Remove any trailing markdown hashes
    const cleanTitle = rawTitle.replace(/\s+#+$/, '').replace(/[`*_~]/g, '')
    const level = hashes.length as 2 | 3
    const id = slugifyHeading(cleanTitle)

    if (id && cleanTitle) {
      items.push({ id, title: cleanTitle, level })
    }
  }

  return items
}
