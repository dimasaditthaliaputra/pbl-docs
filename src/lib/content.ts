import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { NAV_ORDER } from './navigation'

const CONTENT_DIR = path.join(process.cwd(), 'content')

export interface DocFrontmatter {
  title: string
  description: string
  order: number
  group: string
}

export interface DocPage {
  slug: string
  frontmatter: DocFrontmatter
  content: string
}

export function getAllSlugs(): string[] {
  return NAV_ORDER.map((item) => item.slug)
}

export function getDocBySlug(slug: string): DocPage | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`)

  if (!fs.existsSync(filePath)) {
    return null
  }

  const fileContent = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContent)

  return {
    slug,
    frontmatter: data as DocFrontmatter,
    content,
  }
}

export function getAllDocs(): DocPage[] {
  return getAllSlugs()
    .map((slug) => getDocBySlug(slug))
    .filter((doc): doc is DocPage => doc !== null)
    .sort((a, b) => a.frontmatter.order - b.frontmatter.order)
}
